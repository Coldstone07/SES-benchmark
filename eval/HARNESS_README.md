# SES Benchmark — Evaluation Harness

This document covers everything you need to run, configure, and extend the
evaluation harness. Read it before touching any eval scripts.

---

## Quick Start

```bash
# 1. Install dependencies
pip install pyyaml requests

# 2. Set your API key
export OPENROUTER_API_KEY=sk-or-...   # or ANTHROPIC_API_KEY=sk-ant-...

# 3. Dry run — see what items would be evaluated without calling any APIs
python eval/run_eval.py --dry-run

# 4. Run a full evaluation (all items, config from eval/config.yaml)
python eval/run_eval.py

# 5. Analyze results
python eval/analyze_results.py outputs/<run_id>_results.json
```

---

## Directory Structure

```
eval/
  config.yaml              Pinned run configuration (model, judge, parameters)
  run_eval.py              Main evaluation harness
  analyze_results.py       Results aggregation and reporting
  HARNESS_README.md        This file
  judge_prompts/           Per-dimension LLM judge prompt templates
    mixed_emotion_recognition.yaml
    pacing_and_attunement.yaml
    tradition_accuracy.yaml
    premature_advice_resistance.yaml
    experience_holding.yaml
    relational_field_perception.yaml

items/                     Evaluation items (one YAML file per item)
  emotional/
    mixed_states/
  social/
    estrangement/
  spiritual/
    kairos_v1/

outputs/                   Run outputs — NOT in version control (.gitignore)
  <run_id>_results.json
  <run_id>_metadata.json
```

---

## Item YAML Schema

Each item lives in its own YAML file under `items/<pillar>/<dimension>/<id>.yaml`.

```yaml
id: EMO-MIXED-3-001             # Unique. Format: PILLAR-DIMENSION-LEVEL-SEQ
pillar: EMOTIONAL               # EMOTIONAL | SOCIAL | SPIRITUAL
dimension: mixed_states         # subdimension name (matches items/ subdirectory)
level: 3                        # difficulty 1–4
situation: mixed_states         # situation category from SES_FRAMEWORK.md

tradition: null                 # e.g. "Buddhist/Zen" — null for non-spiritual

user_turns:                     # list of user messages (multi-turn: alternating user/assistant)
  - |
    [first-person narrative...]

scoring_notes: |                # Human-readable annotation guide for this item
  [what to look for, what's subtle, common rater disagreements]

expected_failure_modes:         # list of known failure modes this item is likely to trigger
  - flattening
  - premature_advice

active_dimensions:              # scoring dimensions to evaluate (must have matching judge prompts
  - mixed_emotion_recognition   # or will fall back to FALLBACK_JUDGE_PROMPT in run_eval.py)
  - pacing_and_attunement

rubric:                         # 1–4 scale descriptors
  score_4: >
    [what a genuinely competent response does]
  score_3: >
    [adequate — mostly right, minor issues]
  score_2: >
    [problematic — notable failure]
  score_1: >
    [harmful or severely inadequate]

canary_string: "exact phrase from the item"   # contamination check phrase
```

**Required fields:** `id`, `pillar`, `dimension`, `level`, `situation`, `user_turns`,
`scoring_notes`, `expected_failure_modes`, `active_dimensions`, `rubric`

**Optional:** `tradition`, `canary_string`

---

## Configuration (eval/config.yaml)

All run parameters are pinned here. Changing this file changes the run fingerprint
(SHA-256 of the config is logged in every metadata file).

Key parameters:

| Parameter | Default | Notes |
|-----------|---------|-------|
| `model.id` | `anthropic/claude-sonnet-4-6` | Exact model string per your API provider |
| `model.temperature` | `0.7` | Fixed for reproducibility |
| `model.seed` | `42` | Passed to API when supported |
| `judge.model_id` | `anthropic/claude-sonnet-4-6` | Same or different model from model under test |
| `judge.temperature` | `0.0` | Always 0 for judge — determinism |
| `judge.runs` | `2` | Each dimension scored twice; disagreements flagged |
| `judge.disagreement_threshold` | `1` | Flag when `|run_1 - run_2| > 1` |
| `api.provider` | `openrouter` | `openrouter` or `anthropic` |
| `run.pairwise` | `false` | Enable pairwise comparison mode |
| `run.position_randomize` | `true` | Swap A/B in pairwise to mitigate position bias |
| `run.canary_check` | `true` | Check responses for canary string leakage |
| `run.output_dir` | `outputs/` | Keep out of version control |

To run a variant experiment, copy `config.yaml` to a new name (e.g., `config_gpt4o.yaml`)
and point the harness at it: `python eval/run_eval.py --config eval/config_gpt4o.yaml`

---

## Output Schema

### `<run_id>_results.json`

Array of item result objects:

```json
[
  {
    "item_id": "EMO-MIXED-3-001",
    "pillar": "EMOTIONAL",
    "dimension": "mixed_states",
    "level": 3,
    "situation": "mixed_states",
    "tradition": null,
    "model_response": "...",
    "dimension_scores": [
      {
        "dimension": "mixed_emotion_recognition",
        "judge_run_1": 3,
        "judge_run_2": 4,
        "mean_score": 3.5,
        "agreed": true,
        "judge_reasoning_1": "...",
        "judge_reasoning_2": "..."
      }
    ],
    "mean_score": 3.5,
    "canary_leaked": false,
    "expected_failure_modes": ["flattening", "premature_advice"],
    "detected_failure_modes": [],
    "timestamp": "2026-04-15T12:00:00+00:00"
  }
]
```

### `<run_id>_metadata.json`

Run fingerprint:

```json
{
  "run_id": "run_20260415T120000_abc123def",
  "config_hash": "abc123def456",
  "model_id": "anthropic/claude-sonnet-4-6",
  "model_temperature": 0.7,
  "model_seed": 42,
  "system_prompt_hash": "deadbeef1234",
  "judge_model_id": "anthropic/claude-sonnet-4-6",
  "judge_temperature": 0.0,
  "judge_runs": 2,
  "items_attempted": 5,
  "items_succeeded": 5,
  "items_failed": 0,
  "pillar_filter": [],
  "difficulty_filter": [],
  "started_at": "2026-04-15T12:00:00+00:00",
  "finished_at": "2026-04-15T12:04:33+00:00",
  "output_results_file": "run_20260415T120000_abc123def_results.json"
}
```

---

## LLM-as-Judge Design

### Bias Mitigations Implemented

| Risk | Mitigation |
|------|-----------|
| **Position bias** (pairwise) | `position_randomize: true` swaps A/B randomly, corrects back before writing |
| **Verbosity bias** | Rubrics are behavioral (what the response *does*), not length-sensitive |
| **Self-enhancement bias** | Judge model is configurable and independent of model under test |
| **Inconsistency** | Two-run scoring by default; disagreements flagged when `\|s1 - s2\| > threshold` |
| **Free-form scoring** | All judge calls use structured rubrics; judge must state REASONING then SCORE |
| **Monolithic prompting** | Separate judge prompt per dimension — judge sees only one rubric at a time |

### How Two-Run Scoring Works

For each (item × dimension):
1. Judge prompt is sent twice with `temperature: 0.0`
2. Both scores (1–4) are recorded
3. `mean_score = (run_1 + run_2) / 2`
4. If `|run_1 - run_2| > disagreement_threshold`, `agreed = false` and the item is flagged
5. Analysis report counts all flagged items

### Adding a New Judge Prompt

1. Create `eval/judge_prompts/<dimension_key>.yaml`
2. Set `dimension_key` to match the string used in item `active_dimensions`
3. Write `prompt_template` using the placeholders:
   `{dimension}`, `{score_4}`, `{score_3}`, `{score_2}`, `{score_1}`,
   `{user_statement}`, `{response}`
4. If no matching prompt exists, the harness falls back to `FALLBACK_JUDGE_PROMPT`
   in `run_eval.py`

---

## Pairwise Comparison

To compare two model runs head-to-head:

```bash
# Run model A
python eval/run_eval.py --config eval/config_model_a.yaml
# Run model B
python eval/run_eval.py --config eval/config_model_b.yaml

# Compare
python eval/run_eval.py --pairwise \
  --response-a outputs/run_A_results.json \
  --response-b outputs/run_B_results.json
```

Pairwise output is `outputs/pairwise_<run_a>_vs_<run_b>.json` — per-item, per-dimension
winner (A | B | TIE) with reasoning and position-swap flag.

---

## Contamination Detection

Every item with a `canary_string` field is checked after the model responds.
If the canary phrase appears verbatim in the response, it is flagged:

```
[FLAG] CANARY LEAKED — possible contamination on SPR-KAIROS-4-001
```

The analysis report lists all leaked items under **Contamination Warning**.

Canary strings should be:
- Unique enough that a model would only produce them by memorizing the item
- Not so long that they would appear naturally in a well-written response
- 4–8 words from a distinctive phrase in the user turn

---

## Filtering

```bash
# Emotional pillar only
python eval/run_eval.py --pillar EMOTIONAL

# Hard items only (difficulty 3 and 4)
python eval/run_eval.py --difficulty 3 4

# Both filters combined
python eval/run_eval.py --pillar SPIRITUAL --difficulty 4

# Dry run to preview filtered set
python eval/run_eval.py --pillar EMOTIONAL --difficulty 3 4 --dry-run
```

---

## API Provider Setup

### OpenRouter (default)

```bash
export OPENROUTER_API_KEY=sk-or-...
```

Set `api.provider: openrouter` and `api.base_url: https://openrouter.ai/api/v1` in config.
Model IDs use OpenRouter format: `anthropic/claude-sonnet-4-6`, `openai/gpt-4o`, etc.

### Anthropic Direct

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

Set `api.provider: anthropic` and `api.base_url: https://api.anthropic.com/v1` in config.
Model IDs use Anthropic format: `claude-sonnet-4-6`, `claude-opus-4-6`, etc.

---

## Adding Items (Stream D)

1. Create a YAML file in `items/<pillar>/<dimension>/<id>.yaml`
2. Follow the schema above — all required fields must be present
3. Choose `active_dimensions` from the existing judge prompts (see `eval/judge_prompts/`)
   or add a new judge prompt for any new dimension
4. Set `canary_string` to a distinctive 4–8 word phrase from the user turn
5. Run `python eval/run_eval.py --dry-run` to verify the item loads without errors

Item IDs follow the format: `PILLAR-DIMENSION-LEVEL-SEQ`
Examples: `EMO-GRIEF-3-007`, `SPR-DARK-NIGHT-4-002`, `SOC-RUPTURE-2-014`

---

## What Stream B Did Not Implement

These are known gaps deferred for later:

1. **Score calibration against human baseline** — the harness produces scores but cannot
   yet calibrate the judge against human annotations. This requires Stream 7 (Annotation +
   Calibration) to run first. Once human baseline scores exist in `results/human_baseline.json`,
   a calibration pass can adjust judge prompts.

2. **IRT / item difficulty estimation** — after sufficient model runs, item response theory
   analysis should identify items where all models pass (easy ceiling) or all fail (uninformative
   floor). `analyze_results.py` surfaces per-item scores but does not yet flag these.

3. **Failure mode LLM classifier** — the current failure mode detection in `run_eval.py` is
   keyword-based. The roadmap calls for a dedicated LLM classifier per failure mode. The
   keyword pass is a placeholder with the right interface; replace `detect_failure_modes()`
   with an LLM call once the classifier prompt is designed (Stream C / rubric work).

4. **Statistical significance / confidence intervals** — `analyze_results.py` reports means
   but not CIs. At 12 items per pillar, CIs would be too wide to be useful. Add CI reporting
   once item count reaches 80+ per pillar.

5. **Private test set tooling** — the harness supports filtering but there is no automated
   tooling to manage the public dev / private test split. Items should be manually sorted into
   `items/` (public dev, 70%) and a local `items/test_private/` (never committed, 30%).
   `test_private/` is in `.gitignore`.

---

*Stream B complete. Questions for Kairos marked below.*
