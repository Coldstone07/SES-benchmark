# SES Benchmark — ULTRATHINK PLAN
**Version:** 0.2 (updated after Week 0 consolidation)  
**Date:** 2026-04-15  
**Purpose:** Research agenda + parallelization architecture for building a rigorous Social / Emotional / Spiritual benchmark

---

## Week 0 Landing Report

All four parallel streams completed on 2026-04-15. Here is what landed and what surprised us.

### What landed

| Stream | Output | Status |
|--------|--------|--------|
| A — Research | `RESEARCH_SYNTHESIS.md` — 905 lines, per-pillar behavioral markers, 20-item failure taxonomy, 6 flagged gaps | ✅ Complete |
| B — Harness | `eval/config.yaml`, `eval/run_eval.py`, `eval/analyze_results.py`, 6 judge prompts, `eval/HARNESS_README.md` | ✅ Functional |
| C — Rubric | `eval/RUBRIC_v0.md` (20 dimensions, 1–4 behavioral anchors), `eval/SCORING_PROTOCOL.md` (dual-scorer, Krippendorff's α protocol) | ✅ Draft — pre-calibration |
| D — Items | 40 L3–L4 Emotional items, 1 Social seed, 3 Spiritual seeds | ✅ Complete for Emotional; Seed-only for others |

### What surprised us

1. **Rubric specificity exceeded expectations.** Stream C produced a rubric that is substantially more specific than what most published benchmarks use. The behavioral anchors (score-level examples, failure mode detection signals, canonical quote fragments) are close to publication-ready. The 5 uncertain dimensions flagged below are the real remaining questions.

2. **Stream D item quality.** The 40 Emotional items are substantively better than the V1 scenarios — more specific, harder to evaluate, more discriminating. The `emo_L4_004.yaml` (watching a close friend receive what you've been longing for) is a genuinely hard item that most frontier models will flatten.

3. **The self-enhancement judge problem is sharper than expected.** Stream B flagged that the default config has the same model (`claude-sonnet-4-6`) as both the model under test AND the judge. This means a Claude run is judged by Claude — the self-enhancement bias PLAN.md §A1 warned about. This needs to be a Day 1 decision before any production runs.

4. **The judge prompt gap.** Only 6 of 20 dimensions have judge prompt files. Stream B documented this gap explicitly. Before calibration can begin, all 20 dimensions need judge prompts — or the calibration must be run with human scoring only (which is actually the right approach for Round 1 anyway).

5. **Item schema is stable.** The YAML schema from Stream B works well. Stream D items that use the full schema (active_dimensions, rubric anchors, canary_string, scoring_notes) are the gold standard. Items without the rubric field (like some `emo_L3_*` files) need updating.

---

## Kairos Review Queue — Decisions Needed Before Round 1 Calibration

These are the decisions that need Kairos's direct input. Nothing in this list can be resolved by a research agent.

### R1 — Gene Keys and Sushumna behavioral markers

`RESEARCH_SYNTHESIS.md` includes IFS and Enneagram behavioral markers derived from published literature. Gene Keys and Sushumna markers are extrapolated — not independently sourced. Before writing Gene Keys or Sushumna items and rubric anchors, Kairos must define:
- What does a *correct* response to someone using Gene Keys shadow/gift/siddhi language look like? What's the canonical failure mode?
- What does *appropriate* holding of a Sushumna clearing experience look like vs. pathologizing it vs. bypassing it with generic spirituality language?

### R2 — Indigenous tradition review

`RESEARCH_SYNTHESIS.md` flags: writing items specific to actual Indigenous traditions (Lakota, Diné, Yoruba, Andean) requires tradition-specific expertise. The rubric's PM-SPR-INDG markers (ask rather than assume, recognize colonial layer) are directionally correct but cannot substitute for expert review. Decision: does Kairos have relationships with Indigenous tradition practitioners who can review these items?

### R3 — Shia Islamic underrepresentation

The Karbala/martyrdom spiritual paradigm, batin/zahir distinction, and Shia theology of the Imams are mentioned in the tradition map but not yet covered by scenarios or rubric examples. A Shia Muslim practitioner review is recommended before writing Shia-specific items.

### R4 — Tibetan Vajrayana restriction concern

Some Tibetan Buddhist teachings are traditionally restricted (not for general distribution). Items involving deity yoga, tantric practices, or advanced Vajrayana instructions risk inadvertently treating restricted teachings as public knowledge. Decision: how do we frame Vajrayana items in a way that tests relevant competencies without creating items that require knowledge of restricted teachings?

### R5 — Psychedelic experience framing stance

`RESEARCH_SYNTHESIS.md` notes that psychedelic experience items are contested between transpersonal psychology, neuroscience, and religious tradition responses. The rubric doesn't take a position on whether psychedelic experiences are spiritually "real." Decision: what is Kairos's position? This affects both item writing and rubric anchors for SP2 (Experience Holding) on psychedelic scenarios.

### R6 — System prompt and judge model decisions

Stream B surfaced two open questions:
- **System prompt:** The pinned system prompt in `eval/config.yaml` frames the model as "a thoughtful, present, and perceptive companion." Does Kairos want this framing, or a different one? The system prompt shapes what the model thinks it's being asked to do — it's a significant variable.
- **Judge model:** Running `claude-sonnet-4-6` as both model-under-test and judge creates self-enhancement bias. Options: (a) use a different judge model (GPT-4o as judge when testing Claude; Claude as judge when testing GPT); (b) use Prometheus or a dedicated open-source judge model; (c) rely primarily on human scoring for Round 1 (recommended). Decision needed before production runs.

### R7 — Five uncertain rubric dimensions

Stream C flagged 5 dimensions where the 3-vs-2 distinction is uncertain without calibration data:

| Dimension | Uncertainty |
|---|---|
| CC7 — Silence and Spaciousness | Hard to score algorithmically; very short responses and very long responses both score poorly under different conditions — the boundary is unclear |
| SP4 — Appropriate Limits | When does offering tradition knowledge cross into guru posture? The rubric describes the endpoints well but the middle is contested |
| E4 — Specificity of Reflection | "Somatic language met somatically" is described but hard to operationalize without examples — needs more calibration seed items |
| S4 — Systemic vs. Individual Framing | The 3-vs-2 line (naming the system vs. naming the system then prescribing individual adjustment) needs more worked examples |
| SP3 — Non-Flattening | The 3-vs-2 line between "mild cross-tradition reference" and "tradition flattening" is thinner than expected in practice |

These 5 dimensions need boundary seed items (see Revised Sequencing below) before calibration can be reliable.

---

## Revised Sequencing

### What changes from v0.1

v0.1 said: *"Stream 6 (Mixed Items) depends on Streams 3/4/5 being at least 50% complete."*  
**Revision:** Stream 7 (Human Calibration) is now the highest-leverage next step, not more item writing. Stream C's own recommendation (SCORING_PROTOCOL.md) was explicit: calibration before scale.

v0.1 said: *"Start Session D (Emotional L3–4 items) immediately."*  
**Status:** Done. 40 items exist. Pause here and calibrate before writing Social and Spiritual items.

### Revised Week 1 work (in priority order)

1. **Kairos reviews R1–R7** above — decisions that unlock calibration
2. **Write 8 boundary seed items** targeting the 5 uncertain dimensions and the hardest 3-vs-2 cases from the 40 existing emotional items
3. **Complete judge prompts** for remaining 14 dimensions (can be autonomous; needs to be done before LLM-as-judge calibration)
4. **Round 1 human calibration** — Kairos scores 30-item seed set; compute Krippendorff's α per dimension
5. **Rubric v0 → v1** based on calibration disagreements (especially the 5 uncertain dimensions)
6. **Only after v1 rubric:** begin Social and Spiritual item writing at scale

### Updated dependency graph

```
[R1-R7 decisions from Kairos]
         │
         ▼
[8 boundary seed items] ──────────────────────────────┐
         │                                             │
         ▼                                             ▼
[14 remaining judge prompts]              [Round 1 calibration — 30 items]
         │                                             │
         └───────────────────────┬────────────────────┘
                                 │
                                 ▼
                        [Rubric v0 → v1]
                                 │
                    ┌────────────┴────────────┐
                    ▼                         ▼
          [Social items at scale]    [Spiritual items at scale]
                    │                         │
                    └────────────┬────────────┘
                                 ▼
                         [Mixed items]
                                 │
                                 ▼
                    [Round 2 calibration + model runs]
```

---

## What to Kick Off Next (Revised Recommendation)

| Session | What | Autonomous? | Blocks |
|---------|------|-------------|--------|
| **Kairos review** | Answer R1–R7 above | No — Kairos required | Everything |
| **Boundary seeds** | Write 8 items targeting 5 uncertain dimensions | Autonomous draft + Kairos review | Calibration |
| **Judge prompts** | Complete 14 remaining dimension prompts | Mostly autonomous | LLM calibration |
| **Round 1 calibration** | Score 30 items; compute α | Kairos leads | Rubric v1 |

---

*The research agenda (Part A) and stream definitions (Part B) from v0.1 remain unchanged below this point.*

---

---

## Part A — Research Agenda

*What we must understand before claiming rigor. Structured by literature area, with concrete sources and what we take from each.*

---

### A1. LLM Evaluation Methodology

**The core question:** What does a well-designed LLM benchmark actually require, and what have the best efforts gotten wrong?

| Source | What we take from it |
|--------|---------------------|
| **HELM** (Liang et al., 2022) — Holistic Evaluation of Language Models | Multi-metric, multi-scenario evaluation framework. Key lesson: no single metric captures model quality. We must report per-dimension breakdowns, not just aggregate scores. |
| **BIG-bench** (Srivastava et al., 2022) — Beyond the Imitation Game | 204 tasks, community-designed. Teaches us: task diversity matters, coverage claims need many items, and "hard" must be calibrated against human performance, not guessed. |
| **MMLU / MMLU-Pro** (Hendrycks et al., 2020; Wang et al., 2024) | Multiple-choice benchmark with known contamination issues. MMLU-Pro's lesson: raise difficulty, use multi-step reasoning, and watch for benchmark saturation on frontier models. We take: don't let the easy tier dominate. |
| **MT-Bench** (Zheng et al., 2023) — Multi-turn dialogue benchmark + GPT-4-as-judge | First systematic use of LLM-as-judge for open-ended responses. Lesson: judge bias is real — verbosity bias (longer = scored higher), self-enhancement (Claude judging Claude outputs favorably), position bias. We must control for all three. Publishes exact judge prompts — we must too. |
| **Chatbot Arena / LMSYS** (Chiang et al., 2024) — Elo-based human preference | Gold standard for human preference but expensive. Teaches us: pairwise comparison is more reliable than absolute scoring. We should implement pairwise annotation as a validation check on our rubric scoring. |
| **AlpacaEval** (Li et al., 2023) — Automated instruction-following eval | LLM judge correlation with human preference. Key paper: shows win rate against a reference model is more stable than absolute score. We take: include a reference response (e.g., ideal human response) and score models relative to it. |
| **G-Eval** (Liu et al., 2023) — LLM evaluator with chain-of-thought | GPT-4 with step-by-step rubric outperforms direct scoring. We take: judges should be prompted to reason through each dimension before scoring, not just output a number. |
| **Prometheus** (Kim et al., 2023) — Open-source LLM judge | First open judge trained to follow custom rubrics. Lesson: a well-specified rubric dramatically reduces judge variance. We must write dimension rubrics that are specific enough to be followed by a model judge. |
| **LLM-as-judge failure modes** (Panickssery et al., 2024; Wang et al., 2023) | Catalogues: verbosity bias, position bias, self-enhancement bias, sycophantic drift, inconsistency across runs. Mitigation: blind scoring (model name hidden), two independent judge runs, pairwise > absolute, calibrate against human scores. |

**What we take overall:** LLM-as-judge is viable but must be disciplined. Rubric quality is the bottleneck. We need: per-dimension judge prompts, blind scoring, two-run averaging, and calibration against human baseline on a held-out set.

---

### A2. Psychometrics

**The core question:** We're measuring constructs (attunement, mixed-emotion recognition, tradition accuracy) — not recall. This requires psychometric discipline that most LLM benchmarks skip entirely.

| Source | What we take from it |
|--------|---------------------|
| **Construct Validity** — Cronbach (1955), Messick (1989) | Construct validity = does the instrument measure what it claims? Two threats: construct underrepresentation (items don't cover enough of the construct) and construct-irrelevant variance (items measure something else, e.g., response length). We must map scenario coverage to the construct space and check that long responses don't score higher just for being long. |
| **Item Response Theory (IRT)** — Lord (1980), de Ayala (2009) | IRT models item difficulty empirically from response data, not by expert intuition. After initial model runs, we should estimate item difficulty parameters and remove items that fail to discriminate (all models get right) or that are too hard (all models fail — uninformative). Target: items where model performance ranges from 20–80%. |
| **Cohen's Kappa and Krippendorff's Alpha** — Cohen (1960), Krippendorff (2004) | Standard inter-rater agreement statistics. Cohen's Kappa for two annotators, Krippendorff's Alpha for interval-scale ratings across multiple raters. Target: α > 0.75 before publishing. We compute this on the dev set, publish it, and retrain raters on items below threshold. |
| **Ecological Validity** — Bronfenbrenner (1979), Brunswick (1956) | Do scenarios reflect real-world situations closely enough that performance predicts real-world competence? Risk: our items may be too "well-formed" — real people don't express things as cleanly as written scenarios. We should include some messy, incomplete, barely-coherent expressions (L3–4 hard items). |
| **Content Validity** — Lawshe (1975) Content Validity Ratio | Experts agree that an item belongs to the domain being measured. Run a content validity check: for each item, 3–5 raters confirm it belongs to its assigned pillar, situation, and difficulty level. Compute CVR; remove items below threshold. |
| **Test-Retest Reliability** | Same model, same item, different runs — do scores vary? Because LLMs are stochastic, we must run each item multiple times (suggest 3 runs at T=0.7, then report mean ± SD). Items with high SD are unreliable and should be redesigned or removed. |

**What we take overall:** Treat this like instrument development, not data collection. Items must be validated empirically, not just written carefully. Pilot → calibrate → remove weak items → expand.

---

### A3. Affective, Social, and Spiritual Competence Literature

**The core question:** What do actual human experts look for when scoring empathic, attuned, spiritually competent responses? We must ground our rubrics in this literature.

| Source | What we take from it |
|--------|---------------------|
| **Emotional Granularity** — Feldman Barrett (2017), "How Emotions Are Made" | Emotions are constructed, not detected. High granularity = ability to distinguish specific emotions (guilt ≠ shame, grief ≠ depression, dread ≠ anxiety). Low granularity = flattening to "sad / happy / angry." Our benchmark tests emotional granularity directly — can the model name what is specifically present rather than category-level labels? |
| **Motivational Interviewing (MI)** — Miller & Rollnick (2013) | Evidence-based framework for holding ambivalence without pushing. Four processes: Engage, Focus, Evoke, Plan — but the Engage stage (just being with what is) is what's being tested in Level 1–2 items. MI's OARS (Open questions, Affirming, Reflecting, Summarizing) are behavioral markers we can operationalize in our rubrics. |
| **Rogerian / Person-Centered Conditions** — Rogers (1957) | Three conditions: unconditional positive regard, empathic understanding, congruence. These are the original framework for therapeutic presence. Our cross-cutting competencies (deep listening, non-pathologizing, tolerance of ambivalence) are directly derived from this. Gives us behavioral markers: "the response makes the person feel accurately heard" (empathy) vs. "the response makes the person feel judged" (absence of UPR). |
| **IFS (Internal Family Systems) Listening Markers** — Schwartz (1995), Anderson et al. (2017) | From Self to parts: the "8 Cs" of Self (Curiosity, Calm, Compassion, Clarity, Creativity, Courage, Connectedness, Confidence) vs. parts-led response. A model responding from "Self energy" stays curious, doesn't fix, doesn't judge. This is the exact quality we're trying to measure under attunement. Gives us: behavioral markers of Self-energy in responses. |
| **Cultural Humility** — Tervalon & Murray-García (1998), Hook et al. (2013) | Cultural humility is a posture (lifelong learning, self-reflection, recognizing power) not a checklist. Measurable markers: acknowledges cultural difference without stereotyping, asks rather than assumes, recognizes when its own frame may not fit. We operationalize this in the Social pillar's "cultural fit" dimension. |
| **Religious Literacy** — Moore (2007), Prothero (2007) | Religious literacy = ability to understand and use tradition vocabulary accurately, distinguish between traditions, and recognize internal diversity within traditions. Not theological education — functional accuracy. Our Spiritual pillar's "tradition accuracy" dimension is exactly this. Gives us: checklist of what correct religious literacy looks like per tradition. |
| **Hood's Mysticism Scale** (1975, revised 2001) — M Scale | Empirical measure of mystical experience (ego dissolution, unity, noetic quality, ineffability). Used in psychology of religion research. We reference this when writing profound personal experience scenarios — items should reflect the actual phenomenology, not pop spirituality. |
| **Spiritual Bypassing** — Welwood (1984), Cashwell et al. (2004) | Spiritual bypassing = using spiritual ideas to avoid emotional pain. Classic markers: premature transcendence, detachment from feelings as "spiritual progress," avoiding anger/grief via forgiveness language, using "everything is perfect" to avoid responsibility. We test for this in both Spiritual items (model doesn't bypass) and Spiritual bypassing scenario items (person is bypassing — model doesn't reinforce it). |
| **Transpersonal Psychology** — Grof (1985), Lukoff (1985), Washburn (1988) | Clinical framework for holding spiritual emergence without pathologizing. Grof's "spiritual emergency" concept — overwhelming non-ordinary experience that is not psychosis but looks like it. Gives us: behavioral markers of appropriate (non-pathologizing) vs. inappropriate (medicalizing) responses to spiritual emergence scenarios. |

**What we take overall:** Our rubrics must be grounded in these literatures, not invented from scratch. The markers of good attunement (MI), Self-energy (IFS), accurate tradition engagement (religious literacy), and non-pathologizing response to mystical experience (transpersonal psychology) are already defined. We operationalize them.

---

### A4. Safety-Adjacent Evaluations

**The core question:** What does a harmful response look like in this domain, and what existing tests detect it?

| Source | What we take from it |
|--------|---------------------|
| **TruthfulQA** (Lin et al., 2021) | Tests factual truthfulness, especially on questions where models hallucinate plausible-sounding falsehoods. We adapt: our Spiritual pillar has an analogous risk — models may hallucinate plausible-sounding religious interpretations. We need items where the right answer is "I'm not certain about how this tradition handles this" not a confident hallucinated claim. |
| **Sycophancy evals** (Perez et al., 2022; Sharma et al., 2023) | Models agree with user positions even when wrong. In our domain: sycophantic response = validating spiritual bypassing, reinforcing toxic positivity, agreeing with a frame that isn't actually serving the person. We build in anti-sycophancy items: person states something that sounds spiritual but is bypassing; model should gently hold the contradiction, not validate. |
| **Locus of Control / Spiritual Risk** — Pargament (1997) "The Psychology of Religion and Coping" | Religious coping styles range from collaborative (healthy) to deferring/self-directing (can be adaptive or maladaptive). Models should not push people toward particular coping styles. Tests: does the model impose a coping style (e.g., "surrender to God's will") on someone who hasn't asked for that frame? |
| **Clinical Boundary Violation** — Pope & Vasquez (2016) | Defines when therapist behavior crosses into harmful territory. Analogous: when does a model's response cross from companionship into pseudo-therapy, diagnosis, or prescription? We operationalize: does the model use DSM language (depression, PTSD, attachment disorder) without invitation? Does it prescribe medication or professional help prematurely? |
| **BOLD / Bias-in-Open-Ended** (Dhamala et al., 2021) | Evaluates bias in open-ended language generation. For our domain: religious bias (treating certain traditions as more valid), cultural bias (Western assumptions), demographic bias (assuming speaker's religion/gender/age from context). We include items designed to surface these biases. |

**What we take overall:** Safety in this domain means: not pathologizing, not bypassing, not sycophantically validating harm, not crossing into clinical/clergy roles, and not imposing cultural/religious assumptions. These are testable with specific item designs.

---

### A5. Contamination and Dataset Hygiene

| Source | What we take from it |
|--------|---------------------|
| **Benchmark Contamination** — Golchin & Surdeanu (2023), Xu et al. (2024) | Methods for detecting whether model training data includes benchmark items. Key method: canary strings (unique phrases embedded in items; if model completes them, items are contaminated). We embed canary phrases in dev set items at publication. |
| **Dynamic Benchmarks** — Kiela et al. (2021) Dynabench | Adversarial human-and-model-in-the-loop item generation. Items that fool current models are added; items that all models pass are retired. We adopt: a versioning protocol (V1, V2, V3...) where saturated items are retired and new hard items are added each cycle. |
| **Private Test Set Protocol** — standard ML practice | Test set must never be published. We maintain a private test split (30% of items) that is used only for official evaluation runs, never committed to the repo. The public dev set is for development only; performance on it is not official. |
| **Benchmark Decay** — Liao & Xu (2023) | Benchmarks become less useful over time as models are trained on them. Mitigation: track item-level performance over model generations; items with >90% pass rate across top-5 models are "saturated" and retired. New items are added at each version release. |

---

## Part B — Parallelization Plan

*How to run this as concurrent streams. Each stream can be a separate session.*

---

### Stream Map

```
STREAM 0: RESEARCH SYNTHESIS         [CRITICAL PATH - Week 0]
STREAM 1: RUBRIC + ANNOTATION        [CRITICAL PATH - Week 0]
STREAM 2: EVAL HARNESS               [PARALLEL - Week 0-1]
STREAM 3: EMOTIONAL ITEMS            [PARALLEL - Week 1-3]
STREAM 4: SOCIAL ITEMS               [PARALLEL - Week 1-3]
STREAM 5: SPIRITUAL ITEMS            [PARALLEL - Week 1-3]
STREAM 6: MIXED ITEMS                [DEPENDS ON 3+4+5]
STREAM 7: ANNOTATION + CALIBRATION   [DEPENDS ON 1+ITEMS]
STREAM 8: MODEL RUNS + ANALYSIS      [DEPENDS ON 2+7]
```

---

### Stream Definitions

#### STREAM 0 — Research Synthesis (Critical Path)
**Goal:** Translate the research agenda (Part A) into concrete rubric language and benchmark design decisions.  
**Input:** Part A source list above.  
**Output:** `research/` folder with per-area synthesis notes; specific rubric language derived from literature (MI OARS markers, IFS Self-energy markers, Hood's mysticism phenomenology, etc.).  
**Success criteria:** For each scoring dimension in the benchmark, we have a literature-grounded behavioral description of what a 4 looks like and what a 1 looks like.  
**Who runs it:** Can be autonomous research session (web search + reading) with Kairos review of output.  
**Duration:** ~1 week.  
**Blocks:** Stream 1 (rubric must be grounded in Stream 0 output).

---

#### STREAM 1 — Rubric + Annotation Protocol (Critical Path)
**Goal:** Produce the definitive scoring rubric and annotator guide that all item writing, judging, and calibration is built on.  
**Input:** Stream 0 synthesis, SES_FRAMEWORK.md.  
**Output:**
- `eval/RUBRIC.md` — per-dimension scoring guide with 1–4 scale, behavioral descriptors, positive examples, failure mode examples
- `eval/ANNOTATION_GUIDE.md` — annotator training document, calibration protocol, disagreement resolution
- `eval/judge_prompts/` — per-dimension LLM judge prompts (following G-Eval chain-of-thought approach)
**Success criteria:** Three independent people read the annotation guide and independently score the same 10 items with Cohen's Kappa > 0.75.  
**Who runs it:** Kairos in the loop for calibration round and final rubric review.  
**Duration:** ~1–2 weeks (including calibration round).  
**Blocks:** Stream 3, 4, 5 (items should be written against the rubric, not before it), Stream 7.

---

#### STREAM 2 — Evaluation Harness (Parallel with Stream 0/1)
**Goal:** Build a production-quality evaluation script that is reproducible, model-agnostic, and outputs structured results.  
**Input:** Current `evaluate.py`, `EXPANSION_ROADMAP.md`.  
**Output:**
- `eval/config.yaml` — pinned temperature, top-p, system prompt, max_tokens
- `eval/run_eval.py` — reads scenarios from YAML, calls model API, runs LLM judge, outputs structured JSON
- `eval/analyze_results.py` — reads results JSON, computes per-pillar / per-tradition / per-difficulty / per-competency breakdowns, generates summary report
- Result schema: `{model_id, config_hash, scenario_id, pillar, tradition, difficulty, dimension_scores: {}, failure_modes: [], judge_reasoning: "", timestamp}`
**Success criteria:** Can run a full evaluation of 10 scenarios against 2 models in < 5 minutes, output is reproducible (same config → same results within stochastic tolerance), and analyze script produces a correctly structured summary.  
**Who runs it:** Autonomous coding session.  
**Duration:** ~1 week.  
**Does not block:** Item writing streams (3, 4, 5). Items can be written while harness is built.

---

#### STREAM 3 — Emotional Items (Parallel)
**Goal:** Write 120 Emotional pillar scenarios per EXPANSION_ROADMAP.md.  
**Input:** SES_FRAMEWORK.md Emotional section, Stream 1 Rubric (must be done first), EXPANSION_ROADMAP.md.  
**Output:** `dataset/emotional/` — YAML files organized by situation category. Each file: id, pillar, situation, difficulty, prompt, active_dimensions, rubric, ground_truth_notes.  
**Success criteria:** 120 items written, distributed per the roadmap table, with at least 40 L3–4 hard items. Items reviewed by Kairos for authenticity.  
**Who runs it:** Autonomous item-writing sessions (one per situation category). Kairos reviews each batch before it is locked.  
**Duration:** Parallel execution, ~2 weeks.  
**Depends on:** Stream 1 Rubric complete.

---

#### STREAM 4 — Social Items (Parallel)
**Goal:** Write 90 Social pillar scenarios per EXPANSION_ROADMAP.md.  
**Input:** SES_FRAMEWORK.md Social section, Stream 1 Rubric, EXPANSION_ROADMAP.md.  
**Output:** `dataset/social/` — YAML files organized by situation category.  
**Success criteria:** 90 items written, distributed per the roadmap table, with at least 30 culturally-specific items that reflect non-Western relational frames. Reviewed by Kairos.  
**Who runs it:** Autonomous item-writing sessions (one per situation category). Cultural accuracy review needed — flag items requiring expert review.  
**Duration:** Parallel execution, ~2 weeks.  
**Depends on:** Stream 1 Rubric complete.

---

#### STREAM 5 — Spiritual Items (Parallel)
**Goal:** Write 60 priority Spiritual pillar scenarios (profound experiences + Kairos frameworks + underrepresented traditions).  
**Input:** SES_FRAMEWORK.md Spiritual section, Stream 1 Rubric, EXPANSION_ROADMAP.md.  
**Output:** `dataset/spiritual/` — YAML files organized by tradition and experience type.  
**Success criteria:** 60 items written, covering: 20 profound personal experiences (dark night, kundalini, NDE, deconversion, mystical), 16 Kairos framework scenarios (Gene Keys siddhi/shadow, IFS Self-energy vs. parts, Sushumna), 24 tradition scenarios across underrepresented traditions (Taoist, Indigenous, secular/existentialist, Sufi).  
**Who runs it:** Autonomous item-writing sessions per cluster. **Kairos must review Kairos framework items.** Tradition items should be flagged for expert review.  
**Duration:** Parallel execution, ~2–3 weeks.  
**Depends on:** Stream 1 Rubric complete.

---

#### STREAM 6 — Mixed Pillar Items (Sequential after 3+4+5)
**Goal:** Write 30 Mixed (Social + Emotional + Spiritual simultaneously) items.  
**Input:** Completed single-pillar items as reference, Stream 1 Rubric.  
**Output:** `dataset/mixed/` — YAML files.  
**Success criteria:** 30 items, each requiring scoring on dimensions from at least 2 pillars. All items L3–4 difficulty. Kairos reviews all.  
**Who runs it:** Autonomous session + Kairos review. These are the hardest items to write — expect iteration.  
**Duration:** ~1 week.  
**Depends on:** Streams 3, 4, 5 at least 50% complete (reference items needed).

---

#### STREAM 7 — Annotation + Calibration (Sequential after 1 + items)
**Goal:** Establish human ground truth for 60-item calibration set. Measure inter-rater agreement. Calibrate LLM judge.  
**Input:** Stream 1 Annotation Guide, 60 items from Streams 3+4+5 (20 per pillar, covering all difficulties).  
**Output:**
- Human annotations for 60 items (Kairos + 2–4 additional annotators)
- Cohen's Kappa / Krippendorff's Alpha per dimension
- Calibrated LLM judge prompt (prompt tuned until judge scores match human scores within 0.5 on the 1–4 scale)
- `results/human_baseline.json` — human performance on 30 items that annotators also responded to
**Success criteria:** Kappa > 0.75 on primary scoring dimensions. LLM judge agreement with human scores > 0.70 correlation.  
**Who runs it:** Kairos must participate as lead annotator. Additional annotators recruited by Kairos.  
**Duration:** ~1–2 weeks.  
**Depends on:** Streams 1, 3, 4, 5 (partial).

---

#### STREAM 8 — Model Runs + Analysis (Sequential after 2 + 7)
**Goal:** Run full evaluation on all available models using calibrated harness. Produce public results.  
**Input:** Calibrated harness (Stream 2), calibrated judge (Stream 7), full item set.  
**Output:**
- `results/[model_id]_[date].json` — full per-item results
- `results/LEADERBOARD.md` — model comparison table with per-pillar, per-tradition, per-competency breakdown
- `results/failure_modes.md` — frequency of each failure mode per model
**Success criteria:** At least 4 models run. Results include confidence intervals. Contamination check performed (canary string detection).  
**Who runs it:** Autonomous (API calls). Kairos reviews final leaderboard.  
**Duration:** ~1 week.  
**Depends on:** Streams 2 and 7 complete.

---

### Dependency Graph

```
Week 0 (Foundation):
  STREAM 0 ──┐
             ├──► STREAM 1 ──┬──► STREAM 3 ──┐
  STREAM 2 ──┘               ├──► STREAM 4 ──┼──► STREAM 6 ──► STREAM 7 ──► STREAM 8
                             └──► STREAM 5 ──┘
                             
Parallel during Week 1-3:
  STREAM 3, 4, 5 run concurrently
  STREAM 2 can run concurrently with STREAM 0/1
  
Sequential:
  STREAM 6 waits for 3+4+5 (partial)
  STREAM 7 waits for 1 + items
  STREAM 8 waits for 2 + 7
```

**Critical path:** Stream 0 → Stream 1 → [Streams 3/4/5 in parallel] → Stream 7 → Stream 8

---

### Human-in-the-Loop Requirements

| Stream | Kairos involvement | Why |
|--------|-------------------|-----|
| 0 | Review output | Research synthesis must be validated against domain knowledge |
| 1 | Lead author of rubric; participate in calibration round | Rubric is the benchmark's foundation — cannot be fully autonomous |
| 3 | Review each situation batch before locking | Authenticity check on emotional scenarios |
| 4 | Review each situation batch; flag cultural items for external review | Social items require cross-cultural validation |
| 5 | Review ALL Kairos framework items; review tradition items | Kairos frameworks are proprietary domain knowledge; tradition accuracy matters |
| 6 | Review all mixed items | Highest complexity; highest risk of getting wrong |
| 7 | Lead annotator | Cannot fully outsource human ground truth |
| 8 | Review leaderboard before publishing | Final quality gate |

---

### Milestone Summary

| Milestone | Streams | Deliverables | Gate |
|-----------|---------|-------------|------|
| **M0 — Foundation** | 0, 1 | Research synthesis, Rubric, Annotation guide, judge prompts | Kairos approves rubric |
| **M1 — Harness** | 2 | `eval/run_eval.py`, `eval/config.yaml`, result schema | 10-scenario smoke test passes |
| **M2 — Items Draft** | 3, 4, 5 | 270 item drafts across all pillars | Kairos batch review |
| **M3 — Mixed** | 6 | 30 mixed items | Kairos review |
| **M4 — Calibration** | 7 | Human baseline, Kappa > 0.75, calibrated judge | Kappa threshold met |
| **M5 — Results** | 8 | Full model comparison, leaderboard, failure mode analysis | Kairos review + publish |

---

## Part C — Recommendation: What to Kick Off First

### Start these in parallel now:

**Session A — Research (Stream 0):**  
Web search + reading on: LLM-as-judge biases (MT-Bench, Prometheus, G-Eval papers), psychometric inter-rater reliability methods, MI/OARS behavioral markers, Hood's Mysticism Scale, Grof's spiritual emergency framework. Output: `research/` synthesis notes with rubric-ready behavioral language. Autonomous session, Kairos reviews output.

**Session B — Harness (Stream 2):**  
Refactor existing `evaluate.py` to read from YAML, pin config, implement two-run judge with averaging, output structured JSON per result schema above. Autonomous coding session. Does not need rubric to begin — build the infrastructure, rubric plugs in later.

**Session C — Rubric Draft (Stream 1, first half):**  
Draft the rubric from the existing framework before Stream 0 completes — then refine with Stream 0 output. Start with the clearest dimensions (tradition accuracy, premature advice resistance, mixed emotion recognition) and build out. Kairos participates actively here.

**Session D — Emotional items, L3-4 only (Stream 3, partial):**  
Write the 40 hardest Emotional items first (mixed states + somatic expression). These are the highest discrimination value and least tradition-dependent. They can begin as soon as the rubric draft exists. Write as YAML files, flag for Kairos review.

### Hold until M0 is gate-passed:
- Tradition-specific Spiritual items (require rubric + cultural review protocol)
- Social items with cultural specificity (require rubric + cultural validation plan)
- Mixed items (require single-pillar items to exist)
- Model runs (require calibrated harness + human baseline)

---

## The Single Most Important Thing

The bottleneck is not item quantity. It is **rubric quality and human calibration**.

If we write 300 items before the rubric is locked and calibrated, we'll score them with a rubric that hasn't been validated — and produce numbers that look precise but aren't. The research agenda and the rubric work are not preparatory bureaucracy. They are the actual work that determines whether the results mean anything.

*Everything else is downstream of that.*
