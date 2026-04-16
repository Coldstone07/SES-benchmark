# SES Benchmark
**Social / Emotional / Spiritual Reasoning Evaluation for Language Models**

---

## What This Is

SES evaluates whether a language model can be genuinely present with a human being who is sharing something real — relationally complex, emotionally layered, or spiritually significant.

It does not test knowledge retrieval, factual recall, or theological correctness in isolation. It tests whether a model can *hold* a person: accurately, attentively, without collapsing their complexity, across three domains where human experience runs deepest.

---

## The Three Pillars

| Pillar | What it tests |
|--------|--------------|
| **S — Social** | Reading the relational field. Power, absence, silence, cultural obligation, belonging, rupture, community. Not just the sentence — the invisible structure around it. |
| **E — Emotional** | Holding mixed and contradictory emotion without resolving it prematurely. Mixed states (grief + relief, love + resentment), emotion beneath the words, somatic expression, tolerance of ambivalence. |
| **Sp — Spiritual** | Engaging religious texts and profound personal experiences with accuracy and presence. Tradition-specific language, mystical experience, dark night, deconversion, kundalini — held without pathologizing, flattening, or bypassing. |

**Cross-cutting competencies across all three pillars:** deep listening, attunement, non-pathologizing, cultural humility, appropriate limits (not therapy, not clergy), premature advice resistance, tolerance of not-knowing, silence and spaciousness.

---

## Repository Structure

```
SES-benchmark/
│
├── README.md                    ← You are here
├── SES_FRAMEWORK.md             ← Full pillar design: dimensions, failure modes, scoring architecture
├── PLAN.md                      ← Research agenda + parallelization streams (Week 0 updated)
├── EXPANSION_ROADMAP.md         ← Item targets, phase breakdown, harness requirements
├── ASSESSMENT.md                ← Gold-standard audit of the benchmark (2026-04-15)
├── RESEARCH_SYNTHESIS.md        ← Literature synthesis: per-pillar behavioral markers, failure taxonomy
├── CHANGELOG.md                 ← What changed and when
│
├── eval/                        ← Evaluation harness (Stream B)
│   ├── config.yaml              Pinned run configuration (model, judge, temperature, seed)
│   ├── run_eval.py              Main evaluation script
│   ├── analyze_results.py       Results aggregation and per-pillar/tradition/dimension reporting
│   ├── HARNESS_README.md        How to run, configure, and extend
│   ├── RUBRIC_v0.md             Scoring rubric — 20 dimensions, 1–4 behavioral anchors (pre-calibration)
│   ├── SCORING_PROTOCOL.md      Dual-scorer process, Krippendorff's alpha, calibration loop
│   └── judge_prompts/           Per-dimension LLM judge prompt templates (6 of 20 complete)
│
├── items/                       ← Evaluation items (YAML, one file per item)
│   ├── emotional/               40 L3-L4 items (Stream D); mixed_states/ subdirectory
│   ├── social/                  Seed items (estrangement cluster)
│   └── spiritual/               Seed Kairos framework items
│
├── kairos-seb/                  ← Original Kairos-SEB benchmark (preserved; being migrated)
│   ├── dataset/                 V1 + V2 scenarios in markdown (116 items)
│   ├── framework/               4-stage developmental model, evaluation dimensions, task definitions
│   ├── scripts/                 Original evaluation scripts (legacy — superseded by eval/)
│   ├── results/                 Model comparison results (Claude 100%, Qwen 91.6%, GPT 91.6%, Opus 75%)
│   └── docs/                    Model card, rebuild guide
│
├── established/                 ← 4 documented external benchmarks
│   ├── emobench.md              ACL 2024 — text-based emotional intelligence
│   ├── kardiabench.md           WWW 2026 — empathetic dialogue
│   ├── humdial.md               ICASSP 2026 — spoken dialogue
│   └── mme-emotion.md           ICLR 2026 — multimodal video emotion
│
├── upcoming/                    ← 3 emerging benchmarks (AV-EMO-Reasoning, HEART, MULTI-Bench)
└── docs/                        ← Metrics guide, rebuild guide
```

---

## Quick Start

```bash
# Install dependencies
pip install pyyaml requests

# Set your API key
export OPENROUTER_API_KEY=sk-or-...   # or ANTHROPIC_API_KEY=sk-ant-...

# Dry run — see what items would be evaluated without calling any APIs
python eval/run_eval.py --dry-run

# Run evaluation on all current items
python eval/run_eval.py

# Run Emotional pillar only, hard items
python eval/run_eval.py --pillar EMOTIONAL --difficulty 3 4

# Analyze results
python eval/analyze_results.py outputs/<run_id>_results.json
```

---

## Current Status (Week 0 Complete — 2026-04-15)

| Component | Status | Details |
|-----------|--------|---------|
| Three-pillar framework | ✅ Complete | `SES_FRAMEWORK.md` — 3 pillars, 20 dimensions, 7 failure mode categories |
| Research synthesis | ✅ Complete | `RESEARCH_SYNTHESIS.md` — per-pillar behavioral markers grounded in literature |
| Evaluation harness | ✅ Functional | `eval/` — config pinned, two-run judge, canary detection, structured JSON output |
| Scoring rubric | ✅ Draft (v0) | `eval/RUBRIC_v0.md` — 20 dimensions, 1–4 behavioral anchors; pre-calibration |
| Scoring protocol | ✅ Draft | `eval/SCORING_PROTOCOL.md` — dual-scorer, Krippendorff's α ≥ 0.70, calibration loop |
| Judge prompts | 🟡 Partial | 6 of 20 dimensions have judge prompt files |
| Emotional items | ✅ 40 items | `items/emotional/` — all L3–4; highest-discrimination tier |
| Social items | 🟡 Seed only | 1 item; full 90-item set pending calibration gate |
| Spiritual items | 🟡 Seed only | 3 Kairos items; full set pending calibration gate |
| Original Kairos-SEB | ✅ Preserved | `kairos-seb/` — all V1+V2 scenarios, results, scripts intact |
| Migration to new schema | 🟡 In progress | V1 core items being ported; originals preserved in `kairos-seb/` |
| Human calibration | ⏳ Not started | **Next critical step — blocks all Tasks 2–4 scoring** |

---

## What the Original Benchmark Found

The original Kairos-SEB V1 tested 4-stage spiritual development recognition:

| Model | V1 Core (12 items) | Notes |
|-------|-------------------|-------|
| Claude Sonnet 4.6 | 100% | Contamination check pending (canary strings now embedded) |
| Qwen 3.6 Plus | 91.6% | One Stage 4 → Stage 3 error |
| GPT-5.4 | 91.6% | |
| Claude Opus 4.6 | 75% | |
| MiniMax | 0% | |

**Interpretation:** V1 easy tier is near-saturated for frontier models. The 3-pillar redesign targets discrimination on harder competencies. See `ASSESSMENT.md` for the full audit.

---

## Scoring

Items scored on 5–8 active dimensions per item. **1–4 scale** (no neutral midpoint):

| Score | Meaning |
|-------|---------|
| 4 | Genuinely competent — meets the person where they are |
| 3 | Adequate — contact made, minor issue |
| 2 | Problematic — notable failure, person would feel misheard |
| 1 | Harmful — pathologizing, bypassing, role violation, tradition error |

Score caps apply for disqualifying failure modes. See `eval/RUBRIC_v0.md`.

---

## Traditions Covered (Spiritual Pillar)

Christian (contemplative, evangelical, Orthodox, progressive) · Buddhist (Theravada, Zen, Tibetan, secular) · Hindu (Bhakti, Advaita, Tantra, Yoga) · Islamic (Sunni, Sufi, Shia, progressive) · Jewish (Orthodox, Reform, Hasidic, Kabbalistic) · Indigenous/diasporic/shamanic · Taoist · Secular/humanist/existentialist · Kairos frameworks (Gene Keys, Enneagram, IFS, Sushumna)

---

## What's Next

**The next step is calibration, not more items.** See `PLAN.md` for the updated Week 1 plan and Kairos's review queue.

---

## External Benchmarks Reference

| Benchmark | Focus | Modality | Link |
|-----------|-------|----------|------|
| EmoBench | Text-based emotional intelligence | Text | [GitHub](https://github.com/Sahandfer/EmoBench) |
| KardiaBench | Empathetic dialogue | Text | [HuggingFace](https://huggingface.co/datasets/Jhcircle/KardiaBench) |
| HumDial | Spoken dialogue | Audio/Text | [Challenge](https://aslp-lab.github.io/HumDial-Challenge/) |
| MME-Emotion | Video-based emotion | Video/Audio | [GitHub](https://github.com/FunAudioLLM/MME-Emotion) |

---

## Citation

```
SES Benchmark: Social / Emotional / Spiritual Reasoning Evaluation
Kairos Paths / Coldstone07, 2026
https://github.com/Coldstone07/SES-benchmark
```

---

*Last updated: 2026-04-15 (Week 0 consolidation)*
