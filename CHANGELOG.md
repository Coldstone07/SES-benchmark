# SES Benchmark — Changelog

---

## [Week 0 Consolidation] — 2026-04-15

### Summary

Complete rebuild of the benchmark's theoretical and measurement foundation. The original Kairos-SEB (4-stage spiritual development, 12-item model comparison) has been preserved and extended into a three-pillar S/E/Sp framework with a production-quality evaluation harness, scoring rubric, and 40 new hard evaluation items.

---

### New Files Added

| File | Description |
|------|-------------|
| `SES_FRAMEWORK.md` | Three-pillar design document — Social, Emotional, Spiritual. Dimensions, failure modes, scoring architecture, scenario format spec. |
| `PLAN.md` | Research agenda (5 literature areas, 20+ sources) + 8-stream parallelization plan with dependency graph. Updated in v0.2 with Week 0 landing report. |
| `EXPANSION_ROADMAP.md` | Item targets (300–420 items), phase breakdown, harness requirements, writing priorities. |
| `ASSESSMENT.md` | Gold-standard audit of the benchmark against HELM, BIG-bench, MT-Bench, MMLU criteria. Verdict: promising but 3 critical fixes needed before expansion. |
| `RESEARCH_SYNTHESIS.md` | 905-line literature synthesis. Per-pillar behavioral markers derived from: Feldman Barrett (emotional granularity), Miller & Rollnick MI, Rogers, Schwartz IFS, Tervalon & Murray-García cultural humility, Moore/Prothero religious literacy, Hood Mysticism Scale, Welwood spiritual bypassing, Grof transpersonal. Includes 20-item failure mode taxonomy and 6 flagged research gaps. |
| `eval/config.yaml` | Pinned evaluation configuration — model, temperature (0.7), seed (42), judge model (temp 0.0), two-run averaging, canary detection. API key read from environment variable (never hard-coded). |
| `eval/run_eval.py` | Main evaluation harness — YAML-driven, model-agnostic, structured JSON output per run. |
| `eval/analyze_results.py` | Results aggregation — per-pillar, per-tradition, per-difficulty, per-dimension breakdowns. |
| `eval/HARNESS_README.md` | Full documentation for running, configuring, extending the harness. |
| `eval/RUBRIC_v0.md` | Scoring rubric — 20 dimensions across 3 pillars + 7 cross-cutting competencies. 1–4 behavioral anchors with positive markers, failure markers, canonical examples, disqualifying failure mode caps. Pre-calibration draft. |
| `eval/SCORING_PROTOCOL.md` | Dual-scorer process, Krippendorff's Alpha (ordinal) computation and targets (α ≥ 0.70), calibration loop (30–50 seed items), LLM-as-judge bias mitigations, quality gates. |
| `eval/judge_prompts/` | 6 per-dimension LLM judge prompt templates (G-Eval chain-of-thought structure): mixed_emotion_recognition, pacing_and_attunement, tradition_accuracy, premature_advice_resistance, experience_holding, relational_field_perception. |
| `items/emotional/` | 40 L3–L4 Emotional items (Stream D). All at hardest difficulty levels — highest discrimination value. |
| `items/emotional/mixed_states/EMO-MIXED-3-001.yaml` | Seed fixture item — grief + relief + shame mixed state. |
| `items/social/estrangement/SOC-EST-2-001.yaml` | Social seed item. |
| `items/spiritual/kairos_v1/` | 5 files — 3 original Kairos seed items + 2 newly migrated V1 scenarios + migration manifest. |
| `CHANGELOG.md` | This file. |

---

### Files Modified

| File | What changed |
|------|-------------|
| `README.md` | Complete rewrite. New three-pillar structure, current status table, quick start, scoring overview, Week 1 direction. Old benchmark reference table preserved at bottom. |
| `PLAN.md` | Added Week 0 landing report section at top. Kairos Review Queue (R1–R7). Revised sequencing. Updated dependency graph. Original research agenda and stream definitions preserved below. |

---

### Files Preserved (No Changes)

All original Kairos-SEB files are preserved exactly as-is:
- `kairos-seb/dataset/` — all V1 + V2 scenarios in markdown
- `kairos-seb/framework/` — developmental model, evaluation dimensions, task definitions
- `kairos-seb/scripts/` — original evaluation scripts (legacy; superseded by `eval/`)
- `kairos-seb/results/` — model comparison results
- `kairos-seb/docs/` — model card, rebuild guide
- `established/` — all 4 external benchmark docs
- `upcoming/` — all 3 emerging benchmark docs
- `docs/` — metrics guide, rebuild guide
- `COMPLETION_SUMMARY.md`, `KAIROS-SEB_PROJECT_SUMMARY.md`, `KAIROS-SEB_SUMMARY.md`

---

### What the Week 0 Streams Found (Key Findings)

**Stream A (Research):**
- Emotional granularity (Feldman Barrett) and IFS Self-energy (Schwartz) are the most operationalizable frameworks for rubric anchors — behavioral markers are specific and testable.
- Religious literacy (Moore/Prothero) establishes that internal-tradition differentiation is the key competency — not general knowledge of "spirituality."
- Spiritual bypassing (Welwood) and pathologizing (Grof) are the two highest-stakes failure modes in the Spiritual pillar.
- 6 gaps flagged requiring expert review: Indigenous traditions, Shia Islam, Tibetan Vajrayana restrictions, psychedelic framing, Gene Keys/Sushumna markers, human baseline.

**Stream B (Harness):**
- The original `evaluate.py` was functional but had temperature unpinned, API keys hard-coded, and no structured output schema. New harness fixes all three.
- Self-enhancement bias: default config uses same model as both model-under-test and judge — flagged as requiring a decision from Kairos before production runs.
- Failure mode detection is currently keyword-based (placeholder). Full LLM classifier deferred.
- IRT (item difficulty estimation), CI reporting, and private test set tooling are known gaps — deferred until item count reaches 80+ per pillar.

**Stream C (Rubric):**
- 5 dimensions with uncertain 3-vs-2 boundary: CC7 (Silence/Spaciousness), SP4 (Appropriate Limits), E4 (Specificity of Reflection), S4 (Systemic Framing), SP3 (Non-Flattening).
- Stream C recommendation: calibration before more item writing. Do not scale until α ≥ 0.70 is established.
- 8 boundary seed scenarios needed to cover the calibration set requirements (all dimensions, all score levels, boundary cases over-represented).

**Stream D (Items):**
- 40 L3–L4 Emotional items represent a significant quality jump from V1. Items like `emo_L4_004.yaml` (friend receiving what you haven't) are genuinely difficult — they require the model to hold the process of naming rather than completing it for the person.
- Item schema is stable. Items using the full schema (active_dimensions, rubric, canary_string, scoring_notes) are the gold standard.
- Some `emo_L3_*` files don't include the `rubric` field — these need updating before being used in calibration.

---

### Open Questions Requiring Kairos Input Before Week 1

See `PLAN.md` §Kairos Review Queue for the full list. In brief:
1. Gene Keys and Sushumna behavioral markers — what does correct look like?
2. Indigenous tradition expert review — are there practitioners Kairos can engage?
3. Shia Islamic scenarios — same question.
4. Tibetan Vajrayana — how to handle restricted teachings?
5. Psychedelic experience framing stance — what is Kairos's position?
6. System prompt wording — does the current framing fit?
7. Judge model decision — who judges what?

---

### Items Migrated vs. Retired

| Category | Count | Decision |
|----------|-------|----------|
| V1 core scenarios (scenarios.md) | 16 | All migrated to YAML. 2 ported files exist; 14 remaining in backlog. |
| V1 expanded (scenarios_expanded.md) | ~20 | In migration backlog |
| V1 Kairos frameworks (scenarios_kairos_framework.md) | ~35 | In migration backlog — requires Kairos review |
| V2 religious expanded (seb_v2_religious_expanded.md) | ~45 | In migration backlog |
| **Retired** | 0 | No scenarios retired — all preserved in `kairos-seb/` |

---

## [Pre-Week 0] — Before 2026-04-15

Original repository contained: Kairos-SEB V1+V2 benchmark documentation, 4 established benchmark docs, 3 upcoming benchmark docs, original evaluation scripts, model comparison results.

See `KAIROS-SEB_PROJECT_SUMMARY.md` and `KAIROS-SEB_SUMMARY.md` for the state before this rebuild.
