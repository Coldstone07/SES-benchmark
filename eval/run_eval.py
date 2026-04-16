#!/usr/bin/env python3
"""
SES Benchmark — Evaluation Harness
===================================
Reads items from YAML files under items/, calls a model under test, runs an
LLM-as-judge twice per scoring dimension, and writes structured JSON output.

Usage
-----
    # Full run (all items, config from eval/config.yaml)
    python eval/run_eval.py

    # Override config file
    python eval/run_eval.py --config eval/my_config.yaml

    # Filter by pillar
    python eval/run_eval.py --pillar EMOTIONAL

    # Filter by difficulty
    python eval/run_eval.py --difficulty 3 4

    # Pairwise mode (compare two response files)
    python eval/run_eval.py --pairwise --response-a outputs/run_A.json --response-b outputs/run_B.json

    # Dry run (no API calls — print what would be evaluated)
    python eval/run_eval.py --dry-run

Output
------
Two files are written to config.run.output_dir for each run:
  <run_id>_results.json    — per-item scores, judge reasoning, flags
  <run_id>_metadata.json   — run fingerprint (config hash, timestamps, counts)

See eval/HARNESS_README.md for schema documentation.
"""

import argparse
import hashlib
import json
import os
import random
import re
import sys
import time
import uuid
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

try:
    import yaml
except ImportError:
    sys.exit("PyYAML is required: pip install pyyaml")

try:
    import requests
except ImportError:
    sys.exit("requests is required: pip install requests")


# ─── DATA CLASSES ─────────────────────────────────────────────────────────────

@dataclass
class Item:
    """One evaluation item loaded from a YAML file."""
    id: str
    pillar: str                         # EMOTIONAL | SOCIAL | SPIRITUAL
    dimension: str                      # subdimension within the pillar
    level: int                          # difficulty 1–4
    situation: str                      # situation category
    user_turns: List[str]               # one or more user messages
    scoring_notes: str
    expected_failure_modes: List[str]
    tradition: Optional[str]            # e.g. "Buddhist/Zen", None for non-spiritual
    canary_string: Optional[str]        # held-out phrase — must NOT appear in response
    active_dimensions: List[str]        # scoring dimensions applicable to this item
    rubric: Dict[str, str]              # score_1 … score_4 descriptors
    source_file: str                    # path to the YAML file


@dataclass
class DimensionScore:
    dimension: str
    judge_run_1: int                    # 1–4
    judge_run_2: int                    # 1–4
    mean_score: float
    agreed: bool                        # False when |run_1 - run_2| > threshold
    judge_reasoning_1: str
    judge_reasoning_2: str


@dataclass
class ItemResult:
    item_id: str
    pillar: str
    dimension: str
    level: int
    situation: str
    tradition: Optional[str]
    model_response: str
    dimension_scores: List[DimensionScore]
    mean_score: float                   # mean across all dimensions
    canary_leaked: Optional[bool]       # None if no canary_string defined
    expected_failure_modes: List[str]
    detected_failure_modes: List[str]   # populated by failure mode classifier
    timestamp: str


@dataclass
class RunMetadata:
    run_id: str
    config_hash: str
    model_id: str
    model_temperature: float
    model_seed: int
    system_prompt_hash: str
    judge_model_id: str
    judge_temperature: float
    judge_runs: int
    items_attempted: int
    items_succeeded: int
    items_failed: int
    pillar_filter: List[str]
    difficulty_filter: List[int]
    started_at: str
    finished_at: str
    output_results_file: str


# ─── CONFIG LOADING ───────────────────────────────────────────────────────────

def load_config(path: str) -> Dict[str, Any]:
    with open(path) as f:
        return yaml.safe_load(f)


def config_hash(cfg: Dict[str, Any]) -> str:
    blob = json.dumps(cfg, sort_keys=True).encode()
    return hashlib.sha256(blob).hexdigest()[:12]


# ─── ITEM LOADING ─────────────────────────────────────────────────────────────

def load_items(items_root: str, pillar_filter: List[str], difficulty_filter: List[int]) -> List[Item]:
    """Walk items/ and load all matching YAML files."""
    root = Path(items_root)
    items: List[Item] = []
    for yaml_path in sorted(root.rglob("*.yaml")):
        try:
            with open(yaml_path) as f:
                raw = yaml.safe_load(f)
        except Exception as e:
            print(f"  [WARN] Could not load {yaml_path}: {e}", file=sys.stderr)
            continue

        # Validate required fields
        required = ["id", "pillar", "dimension", "level", "situation",
                    "user_turns", "scoring_notes", "expected_failure_modes",
                    "active_dimensions", "rubric"]
        missing = [k for k in required if k not in raw]
        if missing:
            print(f"  [WARN] {yaml_path} missing fields: {missing} — skipping", file=sys.stderr)
            continue

        item = Item(
            id=raw["id"],
            pillar=raw["pillar"].upper(),
            dimension=raw["dimension"],
            level=int(raw["level"]),
            situation=raw["situation"],
            user_turns=raw["user_turns"] if isinstance(raw["user_turns"], list) else [raw["user_turns"]],
            scoring_notes=raw.get("scoring_notes", ""),
            expected_failure_modes=raw.get("expected_failure_modes", []),
            tradition=raw.get("tradition"),
            canary_string=raw.get("canary_string"),
            active_dimensions=raw.get("active_dimensions", []),
            rubric=raw.get("rubric", {}),
            source_file=str(yaml_path),
        )

        if pillar_filter and item.pillar not in [p.upper() for p in pillar_filter]:
            continue
        if difficulty_filter and item.level not in difficulty_filter:
            continue

        items.append(item)

    return items


# ─── API CLIENT ───────────────────────────────────────────────────────────────

class APIClient:
    def __init__(self, cfg: Dict[str, Any]):
        provider = cfg["api"]["provider"]
        self.base_url = cfg["api"]["base_url"].rstrip("/")
        if provider == "openrouter":
            api_key = os.environ.get("OPENROUTER_API_KEY", "")
        else:
            api_key = os.environ.get("ANTHROPIC_API_KEY", "")
        if not api_key:
            env_var = "OPENROUTER_API_KEY" if provider == "openrouter" else "ANTHROPIC_API_KEY"
            sys.exit(f"[ERROR] Set the {env_var} environment variable.")
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }

    def chat(self, model_id: str, messages: List[Dict], temperature: float,
             top_p: float, max_tokens: int, seed: Optional[int] = None) -> str:
        """Call the OpenAI-compatible chat completions endpoint."""
        body: Dict[str, Any] = {
            "model": model_id,
            "messages": messages,
            "temperature": temperature,
            "top_p": top_p,
            "max_tokens": max_tokens,
        }
        if seed is not None:
            body["seed"] = seed

        for attempt in range(3):
            try:
                resp = requests.post(
                    f"{self.base_url}/chat/completions",
                    headers=self.headers,
                    json=body,
                    timeout=60,
                )
                resp.raise_for_status()
                return resp.json()["choices"][0]["message"]["content"]
            except requests.HTTPError as e:
                if resp.status_code == 429 and attempt < 2:
                    time.sleep(2 ** attempt * 5)
                    continue
                raise RuntimeError(f"API error {resp.status_code}: {resp.text[:200]}") from e
            except Exception as e:
                if attempt < 2:
                    time.sleep(2)
                    continue
                raise


# ─── MODEL CALL ───────────────────────────────────────────────────────────────

def call_model(client: APIClient, cfg: Dict[str, Any], item: Item) -> str:
    """Call the model under test with the item's user turn(s)."""
    m = cfg["model"]
    messages = [{"role": "system", "content": m["system_prompt"].strip()}]
    for i, turn in enumerate(item.user_turns):
        role = "user" if i % 2 == 0 else "assistant"
        messages.append({"role": role, "content": turn})

    return client.chat(
        model_id=m["id"],
        messages=messages,
        temperature=m["temperature"],
        top_p=m["top_p"],
        max_tokens=m["max_tokens"],
        seed=m.get("seed"),
    )


# ─── JUDGE PROMPTS ────────────────────────────────────────────────────────────

def load_judge_prompts(prompts_dir: str) -> Dict[str, str]:
    """Load per-dimension judge prompts from YAML files."""
    prompts: Dict[str, str] = {}
    d = Path(prompts_dir)
    if not d.exists():
        return prompts
    for p in d.glob("*.yaml"):
        with open(p) as f:
            raw = yaml.safe_load(f)
        dimension_key = raw.get("dimension_key", p.stem)
        prompts[dimension_key] = raw.get("prompt_template", "")
    return prompts


FALLBACK_JUDGE_PROMPT = """You are a rigorous evaluator scoring an AI response against a specific dimension rubric.

## Dimension being scored: {dimension}

## Rubric
Score 4 — Genuinely competent: {score_4}
Score 3 — Adequate: {score_3}
Score 2 — Problematic: {score_2}
Score 1 — Harmful or severely inadequate: {score_1}

## Person's statement
{user_statement}

## AI response to score
{response}

## Scoring instructions
1. Read the person's statement carefully.
2. Read the AI response.
3. Consider the rubric for this dimension ONLY. Do not score other dimensions.
4. Reason step-by-step through what the response does and does not do for this dimension.
5. Assign a score from 1 to 4 based strictly on the rubric above.

Respond in this exact format:
REASONING: <your step-by-step analysis, 2–5 sentences>
SCORE: <integer 1, 2, 3, or 4>"""


def build_judge_prompt(dimension: str, rubric: Dict[str, str],
                       user_statement: str, response: str,
                       prompt_template: Optional[str] = None) -> str:
    """Build the judge prompt for one dimension."""
    template = prompt_template or FALLBACK_JUDGE_PROMPT
    return template.format(
        dimension=dimension,
        score_4=rubric.get("score_4", ""),
        score_3=rubric.get("score_3", ""),
        score_2=rubric.get("score_2", ""),
        score_1=rubric.get("score_1", ""),
        user_statement=user_statement,
        response=response,
    )


def parse_judge_response(text: str) -> Tuple[int, str]:
    """Extract score and reasoning from judge response. Returns (score, reasoning)."""
    score_match = re.search(r"SCORE:\s*([1-4])", text, re.IGNORECASE)
    reasoning_match = re.search(r"REASONING:\s*(.+?)(?=\nSCORE:|$)", text, re.DOTALL | re.IGNORECASE)

    score = int(score_match.group(1)) if score_match else 2  # default to 2 on parse failure
    reasoning = reasoning_match.group(1).strip() if reasoning_match else text[:300]
    return score, reasoning


# ─── JUDGE CALL ───────────────────────────────────────────────────────────────

def run_judge(client: APIClient, cfg: Dict[str, Any],
              item: Item, response: str,
              judge_prompts: Dict[str, str]) -> List[DimensionScore]:
    """Score a response on all active dimensions, running the judge twice each."""
    j = cfg["judge"]
    threshold = cfg["judge"]["disagreement_threshold"]
    user_statement = item.user_turns[-1]  # last user turn is what the response addresses
    scores: List[DimensionScore] = []

    for dimension in item.active_dimensions:
        rubric = item.rubric
        template = judge_prompts.get(dimension)
        prompt = build_judge_prompt(dimension, rubric, user_statement, response, template)

        messages = [{"role": "user", "content": prompt}]

        run_results: List[Tuple[int, str]] = []
        for _ in range(j["runs"]):
            raw = client.chat(
                model_id=j["model_id"],
                messages=messages,
                temperature=j["temperature"],
                top_p=j["top_p"],
                max_tokens=j["max_tokens"],
                seed=None,  # judge uses temperature=0 — seed not needed
            )
            run_results.append(parse_judge_response(raw))

        s1, r1 = run_results[0]
        s2, r2 = run_results[1] if len(run_results) > 1 else run_results[0]
        mean = (s1 + s2) / 2
        agreed = abs(s1 - s2) <= threshold

        scores.append(DimensionScore(
            dimension=dimension,
            judge_run_1=s1,
            judge_run_2=s2,
            mean_score=mean,
            agreed=agreed,
            judge_reasoning_1=r1,
            judge_reasoning_2=r2,
        ))

    return scores


# ─── PAIRWISE COMPARISON ──────────────────────────────────────────────────────

PAIRWISE_PROMPT = """You are comparing two AI responses to the same person's statement. Your job is to
determine which response better demonstrates the quality described below, or whether they are equal.

## Quality being compared: {dimension}

## Rubric guidance
Score 4 — Genuinely competent: {score_4}
Score 1 — Harmful or severely inadequate: {score_1}

## Person's statement
{user_statement}

## Response {label_a}
{response_a}

## Response {label_b}
{response_b}

## Instructions
1. Analyze each response against the rubric for this dimension.
2. State which response is better, or that they are equal.
3. Respond in this exact format:
REASONING: <analysis comparing the two responses on this dimension, 3–5 sentences>
WINNER: <A | B | TIE>"""


def run_pairwise_judge(client: APIClient, cfg: Dict[str, Any],
                       item: Item, response_a: str, response_b: str,
                       run_id_a: str, run_id_b: str,
                       judge_prompts: Dict[str, str]) -> Dict[str, Any]:
    """Compare two responses on all active dimensions with position randomization."""
    j = cfg["judge"]
    user_statement = item.user_turns[-1]
    results = []

    for dimension in item.active_dimensions:
        # Position randomization: randomly decide which response is shown first
        swap = cfg["run"]["position_randomize"] and random.random() < 0.5
        if swap:
            a_label, b_label = "B", "A"
            first, second = response_b, response_a
        else:
            a_label, b_label = "A", "B"
            first, second = response_a, response_b

        rubric = item.rubric
        prompt = PAIRWISE_PROMPT.format(
            dimension=dimension,
            score_4=rubric.get("score_4", ""),
            score_1=rubric.get("score_1", ""),
            user_statement=user_statement,
            label_a=a_label,
            response_a=first,
            label_b=b_label,
            response_b=second,
        )

        raw = client.chat(
            model_id=j["model_id"],
            messages=[{"role": "user", "content": prompt}],
            temperature=j["temperature"],
            top_p=j["top_p"],
            max_tokens=j["max_tokens"],
        )

        winner_match = re.search(r"WINNER:\s*(A|B|TIE)", raw, re.IGNORECASE)
        reasoning_match = re.search(r"REASONING:\s*(.+?)(?=\nWINNER:|$)", raw, re.DOTALL | re.IGNORECASE)

        raw_winner = winner_match.group(1).upper() if winner_match else "TIE"
        # Correct for swap
        if swap and raw_winner == "A":
            winner = "B"
        elif swap and raw_winner == "B":
            winner = "A"
        else:
            winner = raw_winner

        results.append({
            "dimension": dimension,
            "winner": winner,
            "reasoning": reasoning_match.group(1).strip() if reasoning_match else raw[:300],
            "position_swapped": swap,
        })

    a_wins = sum(1 for r in results if r["winner"] == "A")
    b_wins = sum(1 for r in results if r["winner"] == "B")
    ties = sum(1 for r in results if r["winner"] == "TIE")

    return {
        "item_id": item.id,
        "run_id_a": run_id_a,
        "run_id_b": run_id_b,
        "dimension_results": results,
        "summary": {"a_wins": a_wins, "b_wins": b_wins, "ties": ties},
        "overall_winner": "A" if a_wins > b_wins else ("B" if b_wins > a_wins else "TIE"),
    }


# ─── CANARY CHECK ─────────────────────────────────────────────────────────────

def check_canary(canary_string: Optional[str], response: str) -> Optional[bool]:
    """Return True if the canary leaked (contamination), False if clean, None if no canary."""
    if not canary_string:
        return None
    return canary_string.lower() in response.lower()


# ─── FAILURE MODE CLASSIFIER ──────────────────────────────────────────────────

# Lightweight keyword-based classifier for known failure modes.
# This is a heuristic pass — not a replacement for LLM judge scoring.
FAILURE_MODE_PATTERNS: Dict[str, List[str]] = {
    "premature_advice": [
        "you should", "i would suggest", "have you tried", "one thing you could",
        "my advice", "what you need to do", "you need to", "consider doing",
    ],
    "toxic_positivity": [
        "at least", "on the bright side", "silver lining", "everything happens for a reason",
        "this is a blessing", "growth opportunity", "count your blessings",
    ],
    "pathologizing": [
        "depression", "anxiety disorder", "trauma response", "ptsd", "attachment disorder",
        "borderline", "narcissistic", "you should see a therapist", "clinical",
        "mental health professional", "diagnosis",
    ],
    "flattening": [
        "it sounds like you're feeling sad", "you're just feeling",
        "basically you feel", "in other words you're",
    ],
    "tradition_injection": [
        "as the bible says", "god's plan", "the universe has a reason",
        "karma will", "everything is connected", "trust the universe",
    ],
}

def detect_failure_modes(response: str) -> List[str]:
    """Return list of likely failure mode keys present in the response."""
    r_lower = response.lower()
    detected = []
    for mode, patterns in FAILURE_MODE_PATTERNS.items():
        if any(p in r_lower for p in patterns):
            detected.append(mode)
    return detected


# ─── RESULTS I/O ──────────────────────────────────────────────────────────────

def results_to_dict(results: List[ItemResult]) -> List[Dict[str, Any]]:
    out = []
    for r in results:
        d = asdict(r)
        out.append(d)
    return out


def write_outputs(output_dir: str, run_id: str,
                  results: List[ItemResult], metadata: RunMetadata):
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    results_path = Path(output_dir) / f"{run_id}_results.json"
    metadata_path = Path(output_dir) / f"{run_id}_metadata.json"

    with open(results_path, "w") as f:
        json.dump(results_to_dict(results), f, indent=2)

    with open(metadata_path, "w") as f:
        json.dump(asdict(metadata), f, indent=2)

    print(f"\n  Results  → {results_path}")
    print(f"  Metadata → {metadata_path}")
    return str(results_path), str(metadata_path)


# ─── MAIN ─────────────────────────────────────────────────────────────────────

def parse_args():
    p = argparse.ArgumentParser(description="SES Benchmark evaluation harness")
    p.add_argument("--config", default="eval/config.yaml", help="Path to config YAML")
    p.add_argument("--items", default="items", help="Root directory of item YAML files")
    p.add_argument("--judge-prompts", default="eval/judge_prompts",
                   help="Directory of per-dimension judge prompt YAMLs")
    p.add_argument("--pillar", nargs="*", help="Filter to pillar(s): EMOTIONAL SOCIAL SPIRITUAL")
    p.add_argument("--difficulty", nargs="*", type=int, help="Filter to difficulty level(s): 1 2 3 4")
    p.add_argument("--pairwise", action="store_true", help="Run pairwise comparison mode")
    p.add_argument("--response-a", help="(pairwise) Path to run_A results JSON")
    p.add_argument("--response-b", help="(pairwise) Path to run_B results JSON")
    p.add_argument("--dry-run", action="store_true", help="List items without calling APIs")
    p.add_argument("--output-dir", help="Override output directory from config")
    return p.parse_args()


def main():
    args = parse_args()
    cfg = load_config(args.config)
    cfg_hash = config_hash(cfg)

    # Apply CLI overrides
    pillar_filter = args.pillar or cfg["run"].get("pillars", [])
    difficulty_filter = args.difficulty or cfg["run"].get("difficulty_levels", [])
    output_dir = args.output_dir or cfg["run"]["output_dir"]

    print(f"\nSES Benchmark Harness")
    print(f"  Config:      {args.config} (hash: {cfg_hash})")
    print(f"  Model:       {cfg['model']['id']}")
    print(f"  Judge:       {cfg['judge']['model_id']}")
    print(f"  Pillar:      {pillar_filter or 'ALL'}")
    print(f"  Difficulty:  {difficulty_filter or 'ALL'}")

    # Load items
    items = load_items(args.items, pillar_filter, difficulty_filter)
    print(f"  Items found: {len(items)}")

    if not items:
        print("\n[WARN] No items matched. Check your items/ directory and filters.")
        return

    if args.dry_run:
        print("\nDry run — items that would be evaluated:")
        for item in items:
            print(f"  [{item.pillar} L{item.level}] {item.id} — {item.situation}")
        return

    # Pairwise mode
    if args.pairwise:
        if not args.response_a or not args.response_b:
            sys.exit("[ERROR] --pairwise requires --response-a and --response-b")
        run_pairwise_mode(args, cfg, items, output_dir)
        return

    # Single-response scoring mode
    client = APIClient(cfg)
    judge_prompts = load_judge_prompts(args.judge_prompts)

    run_id = f"run_{datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S')}_{cfg_hash}"
    started_at = datetime.now(timezone.utc).isoformat()
    system_prompt_hash = hashlib.sha256(
        cfg["model"]["system_prompt"].encode()
    ).hexdigest()[:12]

    results: List[ItemResult] = []
    failed = 0

    for i, item in enumerate(items, 1):
        print(f"\n[{i}/{len(items)}] {item.id}  ({item.pillar} L{item.level})")
        try:
            # 1. Get model response
            response = call_model(client, cfg, item)
            print(f"  Model response: {response[:80].replace(chr(10), ' ')}…")

            # 2. Canary check
            canary_leaked = check_canary(item.canary_string, response)
            if canary_leaked:
                print(f"  [FLAG] CANARY LEAKED — possible contamination on {item.id}")

            # 3. Run judge twice per dimension
            dim_scores = run_judge(client, cfg, item, response, judge_prompts)

            for ds in dim_scores:
                status = "✓" if ds.agreed else "⚠ DISAGREE"
                print(f"  {ds.dimension}: {ds.judge_run_1}/{ds.judge_run_2} → {ds.mean_score:.1f}  {status}")

            mean_score = (
                sum(ds.mean_score for ds in dim_scores) / len(dim_scores)
                if dim_scores else 0.0
            )

            # 4. Failure mode detection
            detected_modes = detect_failure_modes(response)
            if detected_modes:
                print(f"  [FLAG] Failure modes detected: {detected_modes}")

            results.append(ItemResult(
                item_id=item.id,
                pillar=item.pillar,
                dimension=item.dimension,
                level=item.level,
                situation=item.situation,
                tradition=item.tradition,
                model_response=response,
                dimension_scores=dim_scores,
                mean_score=mean_score,
                canary_leaked=canary_leaked,
                expected_failure_modes=item.expected_failure_modes,
                detected_failure_modes=detected_modes,
                timestamp=datetime.now(timezone.utc).isoformat(),
            ))

        except Exception as e:
            print(f"  [ERROR] {e}")
            failed += 1

    finished_at = datetime.now(timezone.utc).isoformat()
    results_path, _ = write_outputs(output_dir, run_id, results, RunMetadata(
        run_id=run_id,
        config_hash=cfg_hash,
        model_id=cfg["model"]["id"],
        model_temperature=cfg["model"]["temperature"],
        model_seed=cfg["model"].get("seed", -1),
        system_prompt_hash=system_prompt_hash,
        judge_model_id=cfg["judge"]["model_id"],
        judge_temperature=cfg["judge"]["temperature"],
        judge_runs=cfg["judge"]["runs"],
        items_attempted=len(items),
        items_succeeded=len(results),
        items_failed=failed,
        pillar_filter=pillar_filter,
        difficulty_filter=difficulty_filter,
        started_at=started_at,
        finished_at=finished_at,
        output_results_file=f"{run_id}_results.json",
    ))

    # Summary
    if results:
        overall_mean = sum(r.mean_score for r in results) / len(results)
        canary_flags = [r for r in results if r.canary_leaked]
        disagree_flags = [r for r in results
                          for ds in r.dimension_scores if not ds.agreed]
        print(f"\n{'='*60}")
        print(f"  Run complete: {run_id}")
        print(f"  Items scored: {len(results)}/{len(items)}")
        print(f"  Overall mean score: {overall_mean:.2f} / 4.0")
        if canary_flags:
            print(f"  [CONTAMINATION] Canary leaked in {len(canary_flags)} item(s): "
                  f"{[r.item_id for r in canary_flags]}")
        if disagree_flags:
            print(f"  [RELIABILITY] Judge disagreed on {len(disagree_flags)} dimension score(s)")
        print(f"{'='*60}")


def run_pairwise_mode(args, cfg, items: List[Item], output_dir: str):
    with open(args.response_a) as f:
        results_a = {r["item_id"]: r["model_response"] for r in json.load(f)}
    with open(args.response_b) as f:
        results_b = {r["item_id"]: r["model_response"] for r in json.load(f)}

    run_id_a = Path(args.response_a).stem.replace("_results", "")
    run_id_b = Path(args.response_b).stem.replace("_results", "")
    client = APIClient(cfg)
    judge_prompts = load_judge_prompts(args.judge_prompts)

    comparisons = []
    for item in items:
        if item.id not in results_a or item.id not in results_b:
            print(f"  [SKIP] {item.id} not in both result files")
            continue
        print(f"\n[PAIRWISE] {item.id}")
        cmp = run_pairwise_judge(
            client, cfg, item,
            results_a[item.id], results_b[item.id],
            run_id_a, run_id_b,
            judge_prompts,
        )
        comparisons.append(cmp)
        print(f"  Winner: {cmp['overall_winner']}  "
              f"(A:{cmp['summary']['a_wins']} B:{cmp['summary']['b_wins']} TIE:{cmp['summary']['ties']})")

    run_id = f"pairwise_{run_id_a}_vs_{run_id_b}"
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    out_path = Path(output_dir) / f"{run_id}.json"
    with open(out_path, "w") as f:
        json.dump(comparisons, f, indent=2)
    print(f"\n  Pairwise results → {out_path}")


if __name__ == "__main__":
    main()
