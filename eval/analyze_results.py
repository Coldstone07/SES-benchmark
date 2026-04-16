#!/usr/bin/env python3
"""
SES Benchmark — Results Analyzer
==================================
Reads one or more *_results.json files from outputs/ and produces:
  - Per-pillar mean scores
  - Per-dimension mean scores
  - Per-tradition mean scores (Spiritual items)
  - Per-difficulty breakdown
  - Failure mode frequency per model
  - Judge disagreement report
  - Canary leak summary

Usage
-----
    # Analyze a single run
    python eval/analyze_results.py outputs/run_20260415T120000_abc123_results.json

    # Compare two runs side-by-side
    python eval/analyze_results.py outputs/run_A_results.json outputs/run_B_results.json

    # Write report to file
    python eval/analyze_results.py outputs/run_results.json --out outputs/report.md
"""

import argparse
import json
import sys
from collections import defaultdict
from pathlib import Path
from typing import Any, Dict, List, Optional


# ─── LOADING ──────────────────────────────────────────────────────────────────

def load_results(path: str) -> List[Dict[str, Any]]:
    with open(path) as f:
        return json.load(f)


def load_metadata(results_path: str) -> Optional[Dict[str, Any]]:
    meta_path = results_path.replace("_results.json", "_metadata.json")
    if Path(meta_path).exists():
        with open(meta_path) as f:
            return json.load(f)
    return None


# ─── AGGREGATION ──────────────────────────────────────────────────────────────

def mean(values: List[float]) -> Optional[float]:
    return sum(values) / len(values) if values else None


def fmt(v: Optional[float]) -> str:
    return f"{v:.2f}" if v is not None else "—"


def aggregate(results: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Compute all breakdowns from a results list."""

    # Flatten dimension scores
    all_means: List[float] = []
    by_pillar: Dict[str, List[float]] = defaultdict(list)
    by_dimension: Dict[str, List[float]] = defaultdict(list)
    by_tradition: Dict[str, List[float]] = defaultdict(list)
    by_difficulty: Dict[int, List[float]] = defaultdict(list)
    failure_mode_counts: Dict[str, int] = defaultdict(int)
    judge_disagree_items: List[str] = []
    canary_leaked: List[str] = []

    for r in results:
        pillar = r.get("pillar", "UNKNOWN")
        level = r.get("level", 0)
        tradition = r.get("tradition")
        item_mean = r.get("mean_score", 0.0)

        all_means.append(item_mean)
        by_pillar[pillar].append(item_mean)
        by_difficulty[level].append(item_mean)

        if tradition:
            by_tradition[tradition].append(item_mean)

        for ds in r.get("dimension_scores", []):
            dim = ds.get("dimension", "unknown")
            by_dimension[dim].append(ds.get("mean_score", 0.0))
            if not ds.get("agreed", True):
                judge_disagree_items.append(f"{r['item_id']}:{dim}")

        for mode in r.get("detected_failure_modes", []):
            failure_mode_counts[mode] += 1

        if r.get("canary_leaked"):
            canary_leaked.append(r["item_id"])

    return {
        "overall_mean": mean(all_means),
        "n_items": len(results),
        "by_pillar": {k: {"mean": mean(v), "n": len(v)} for k, v in sorted(by_pillar.items())},
        "by_dimension": {k: {"mean": mean(v), "n": len(v)} for k, v in sorted(by_dimension.items())},
        "by_tradition": {k: {"mean": mean(v), "n": len(v)} for k, v in sorted(by_tradition.items())},
        "by_difficulty": {k: {"mean": mean(v), "n": len(v)} for k, v in sorted(by_difficulty.items())},
        "failure_mode_counts": dict(sorted(failure_mode_counts.items(), key=lambda x: -x[1])),
        "judge_disagreement": {
            "n_flags": len(judge_disagree_items),
            "items": judge_disagree_items,
        },
        "canary": {
            "leaked_count": len(canary_leaked),
            "items": canary_leaked,
        },
    }


# ─── REPORT RENDERING ─────────────────────────────────────────────────────────

def render_report(agg: Dict[str, Any], label: str, metadata: Optional[Dict]) -> str:
    lines = []
    lines.append(f"# SES Benchmark Results — {label}")
    lines.append("")

    if metadata:
        lines.append("## Run Metadata")
        lines.append(f"- **Run ID:** `{metadata.get('run_id', '—')}`")
        lines.append(f"- **Model:** `{metadata.get('model_id', '—')}`")
        lines.append(f"- **Temperature:** {metadata.get('model_temperature', '—')}")
        lines.append(f"- **Seed:** {metadata.get('model_seed', '—')}")
        lines.append(f"- **Judge:** `{metadata.get('judge_model_id', '—')}`  ×{metadata.get('judge_runs', 2)} runs")
        lines.append(f"- **Config hash:** `{metadata.get('config_hash', '—')}`")
        lines.append(f"- **Started:** {metadata.get('started_at', '—')}")
        lines.append(f"- **Finished:** {metadata.get('finished_at', '—')}")
        lines.append("")

    lines.append("## Overall")
    lines.append(f"- **Items scored:** {agg['n_items']}")
    lines.append(f"- **Overall mean score:** {fmt(agg['overall_mean'])} / 4.0")
    lines.append("")

    lines.append("## Per-Pillar Scores")
    lines.append("| Pillar | Mean | N |")
    lines.append("|--------|------|---|")
    for pillar, v in agg["by_pillar"].items():
        lines.append(f"| {pillar} | {fmt(v['mean'])} | {v['n']} |")
    lines.append("")

    lines.append("## Per-Dimension Scores")
    lines.append("| Dimension | Mean | N |")
    lines.append("|-----------|------|---|")
    for dim, v in agg["by_dimension"].items():
        lines.append(f"| {dim} | {fmt(v['mean'])} | {v['n']} |")
    lines.append("")

    if agg["by_tradition"]:
        lines.append("## Per-Tradition Scores (Spiritual)")
        lines.append("| Tradition | Mean | N |")
        lines.append("|-----------|------|---|")
        for trad, v in agg["by_tradition"].items():
            lines.append(f"| {trad} | {fmt(v['mean'])} | {v['n']} |")
        lines.append("")

    lines.append("## Per-Difficulty Scores")
    lines.append("| Level | Mean | N |")
    lines.append("|-------|------|---|")
    for lvl, v in agg["by_difficulty"].items():
        lines.append(f"| L{lvl} | {fmt(v['mean'])} | {v['n']} |")
    lines.append("")

    if agg["failure_mode_counts"]:
        lines.append("## Failure Mode Frequency")
        lines.append("| Failure Mode | Count |")
        lines.append("|--------------|-------|")
        for mode, count in agg["failure_mode_counts"].items():
            lines.append(f"| {mode} | {count} |")
        lines.append("")

    jd = agg["judge_disagreement"]
    lines.append("## Judge Reliability")
    lines.append(f"- **Disagreements flagged:** {jd['n_flags']}")
    if jd["items"]:
        lines.append("- **Flagged items (item:dimension):**")
        for item in jd["items"][:20]:
            lines.append(f"  - `{item}`")
        if len(jd["items"]) > 20:
            lines.append(f"  - … and {len(jd['items']) - 20} more")
    lines.append("")

    canary = agg["canary"]
    if canary["leaked_count"] > 0:
        lines.append("## ⚠ Contamination Warning")
        lines.append(f"Canary string leaked in **{canary['leaked_count']}** item(s):")
        for item_id in canary["items"]:
            lines.append(f"  - `{item_id}`")
        lines.append("> These items may be in the model's training data. Interpret scores with caution.")
        lines.append("")
    else:
        lines.append("## Contamination Check")
        lines.append("No canary strings leaked. No contamination detected.")
        lines.append("")

    return "\n".join(lines)


def render_comparison(agg_a: Dict, agg_b: Dict, label_a: str, label_b: str) -> str:
    lines = []
    lines.append(f"# SES Benchmark — Comparison: {label_a} vs {label_b}")
    lines.append("")
    lines.append("## Overall")
    lines.append(f"| | {label_a} | {label_b} |")
    lines.append("|--|--|--|")
    lines.append(f"| Items | {agg_a['n_items']} | {agg_b['n_items']} |")
    lines.append(f"| Overall mean | {fmt(agg_a['overall_mean'])} | {fmt(agg_b['overall_mean'])} |")
    lines.append("")

    all_pillars = sorted(set(list(agg_a["by_pillar"]) + list(agg_b["by_pillar"])))
    lines.append("## Per-Pillar")
    lines.append(f"| Pillar | {label_a} | {label_b} |")
    lines.append("|--------|------|----|")
    for p in all_pillars:
        va = agg_a["by_pillar"].get(p, {}).get("mean")
        vb = agg_b["by_pillar"].get(p, {}).get("mean")
        lines.append(f"| {p} | {fmt(va)} | {fmt(vb)} |")
    lines.append("")

    all_dims = sorted(set(list(agg_a["by_dimension"]) + list(agg_b["by_dimension"])))
    lines.append("## Per-Dimension")
    lines.append(f"| Dimension | {label_a} | {label_b} |")
    lines.append("|-----------|------|----|")
    for d in all_dims:
        va = agg_a["by_dimension"].get(d, {}).get("mean")
        vb = agg_b["by_dimension"].get(d, {}).get("mean")
        lines.append(f"| {d} | {fmt(va)} | {fmt(vb)} |")
    lines.append("")

    return "\n".join(lines)


# ─── MAIN ─────────────────────────────────────────────────────────────────────

def parse_args():
    p = argparse.ArgumentParser(description="Analyze SES benchmark result JSON(s)")
    p.add_argument("results", nargs="+", help="One or two *_results.json files")
    p.add_argument("--out", help="Write report to this file (default: print to stdout)")
    return p.parse_args()


def main():
    args = parse_args()

    if len(args.results) == 1:
        results = load_results(args.results[0])
        metadata = load_metadata(args.results[0])
        agg = aggregate(results)
        label = Path(args.results[0]).stem
        report = render_report(agg, label, metadata)
    elif len(args.results) == 2:
        results_a = load_results(args.results[0])
        results_b = load_results(args.results[1])
        agg_a = aggregate(results_a)
        agg_b = aggregate(results_b)
        label_a = Path(args.results[0]).stem
        label_b = Path(args.results[1]).stem
        report = render_comparison(agg_a, agg_b, label_a, label_b)
    else:
        sys.exit("[ERROR] Pass 1 or 2 result files.")

    if args.out:
        with open(args.out, "w") as f:
            f.write(report)
        print(f"Report written to {args.out}")
    else:
        print(report)


if __name__ == "__main__":
    main()
