---

# Kairos-SEB Benchmark Assessment
**Assessed:** 2026-04-15  
**Assessor:** Claude Sonnet 4.6 (automated audit)  
**Scope:** Full repository audit against gold-standard LLM evaluation criteria

---

## 1. Current State Audit — What Actually Exists

### 1.1 Dataset

| File | Scenarios | Format | Quality |
|------|-----------|--------|---------|
| `kairos-seb/dataset/scenarios.md` | 16 core + 2 multi-turn | Markdown with JSON annotations | High — authentic first-person narratives, 4 per stage, language markers documented |
| `kairos-seb/dataset/scenarios_expanded.md` | ~20 | Structured markdown | Good — edge cases, cultural variants (Buddhist, Secular, Indigenous), boundary transitions |
| `kairos-seb/dataset/scenarios_kairos_framework.md` | ~35 | Markdown with JSON template | Good — Enneagram (9 types), IFS parts, Somatics, Buddhist psychology, Human Design, Conscious Leadership |
| `kairos-seb/dataset/seb_v2_religious_expanded.md` | ~45 | Structured markdown + rubric | Strongest file — 7 traditions × multiple denominations, Pure Emotional / Pure Spiritual / Blended separation, explicit Level 1–4 difficulty, verbatim pass/fail criteria |

**Total scenario count: ~116.** All scenarios are substantive first-person narratives. None are stubs.

**Example (Level 4 hard question, seb_v2_religious_expanded.md):**
> "The kenotic hymns of the early church describe Christ 'emptying himself.' I experience something similar in my daily contemplative practice. Is this the same as anatta?"
> 
> *Requires: Christian mysticism knowledge + Buddhist non-self understanding + nuanced cross-tradition integration. Expected pass rate: <30%.*

### 1.2 Framework

| File | Content | Assessment |
|------|---------|-----------|
| `framework/developmental_model.md` | 4-stage model (Awakening → Questioning → Integration → Unity), language markers by stage, emotional themes, integration with Fowler's Stages of Faith + Peck | Theoretically grounded. Stage markers are specific (certainty language vs. uncertainty markers vs. ownership language vs. connection language). |
| `framework/evaluation_dimensions.md` | 4 dimensions × 25% weight each: Stage Recognition, Emotional-Spiritual Reasoning, Developmental Appropriateness, First-Person Coherence. 1–5 scale per dimension. | Detailed rubric with scored examples for each dimension. Inter-rater Kappa target of >0.8 stated. |
| `framework/task_definitions.md` | 4 progressive tasks: Stage Detection → Emotional-Spiritual Reasoning → Multi-Turn Tracking → Response Generation. Metrics defined for each. | Well-structured cognitive hierarchy. Baselines stated (25% random, >90% human, >70% model target). |

### 1.3 Evaluation Scripts

| Script | Lines | Status | What It Actually Does |
|--------|-------|--------|----------------------|
| `scripts/evaluate.py` | 487 | Functional | Full Python harness — `Stage` enum, `EvaluationTask` enum, `Scenario` dataclass, `BaseModelAdapter` (abstract), `GPTAdapter` (concrete OpenAI implementation), `RandomAdapter` baseline. CLI args for task/model/input/output. All 4 tasks implemented; Tasks 2–4 flag "manual evaluation needed." |
| `scripts/quick_eval.py` | 210 | Functional | Quick eval against 16 scenarios via OpenRouter API. Extracts stage number from response, calculates accuracy, saves JSON. API key exposed in plain text — security issue. |
| `scripts/quick_eval.sh` | 99 | Functional | Bash curl-based eval against 6 key scenarios. Accuracy calculation, JSON output. |
| `scripts/test_all_models.sh` | 121 | Functional | 3-model comparison (Qwen 3.6 Plus, GPT-4o, Claude 3.7 Sonnet) against 12 scenarios. Generates comparison JSON. |

### 1.4 Results

| File | Content | Verdict |
|------|---------|---------|
| `results/model_comparison.json` | Claude Sonnet 4.6: 12/12 (100%), Qwen 3.6 Plus: 11/12 (91.6%), GPT-5.4: 11/12 (91.6%), Claude Opus 4.6: 9/12 (75%) | **Real results.** Not placeholder numbers. |
| `results/qwen_results.json` | 11/12 correct, specific error: Stage 4 scenario predicted as Stage 3 | **Real results** with per-item trace. |
| `results/minimax_results.json` | MiniMax: 0/6 (0%) | **Real results.** Demonstrates discriminatory power at the low end. |

**Key caveat:** All results above are on V1 core (easy) questions only. V2 hard questions have an estimated 50% failure rate by design but have not been systematically run and reported in the results files.

### 1.5 Documentation

- `kairos-seb/docs/model_card.md` — HuggingFace-style model card, complete.
- `kairos-seb/docs/rebuild_guide.md` — Step-by-step rebuild instructions, 347 lines, actionable.
- `docs/metrics_guide.md` — Evaluation metrics reference across all benchmarks.
- `docs/rebuild_guide.md` — Access links and rebuild steps for the 4 established benchmarks.
- `established/` — 4 real published benchmarks documented (EmoBench, KardiaBench, HumDial, MME-Emotion).
- `upcoming/` — 3 emerging benchmarks documented (AV-EMO-Reasoning, HEART, MULTI-Bench).

---

## 2. Gold-Standard Comparison

Benchmarks assessed against: MMLU, BIG-Bench, HELM, MT-Bench / Chatbot Arena, TruthfulQA, AlpacaEval, MMLU-Pro, Ethics Benchmark (Hendrycks et al.).

### 2.1 Construct Validity — Does it measure what it claims?

**Claim:** Kairos-SEB measures a model's ability to understand, reason about, and respond to human spiritual development expressed in first-person narrative.

**Assessment: Partially valid — stronger on detection, weaker on generation.**

- Stage detection (Task 1) maps cleanly to the stated construct. Language markers are specific and behavioral.
- Emotional-spiritual reasoning (Task 2) measures something real but operationalization is underspecified — "explain why emotions arise in spiritual contexts" has many valid interpretations.
- The Pure Emotional / Pure Spiritual / Blended separation in V2 is a strong construct validity test: it directly probes whether the model is actually reading what's there vs. pattern-matching on spiritual keywords.
- The 4-stage model (adapted from Fowler/Peck) is a simplified linear model of what is empirically a non-linear, spiral, culturally-variable process. This creates construct mismatch for traditions that don't map to the Awakening→Unity arc (e.g., Zen, which devalues "development" language; Indigenous traditions without teleological framing).
- No convergent validity data: the benchmark has not been correlated against established spiritual well-being measures (SWBS, SAI, Pargament's religious coping scales).

**Comparison:** MMLU has construct validity issues too (multiple-choice format tests recall/elimination, not genuine reasoning). Kairos-SEB's open-ended Tasks 2–4 are *better* on construct validity than MMLU but lack the convergent validation that Ethics Benchmark (Hendrycks) provides via correlation with human moral judgment.

**Gap:** No discriminant validity — we don't know that Kairos-SEB measures something different from general language quality or general cultural knowledge.

---

### 2.2 Item Quality — Clarity, calibration, diversity, coverage

**Clarity: Good to Excellent.**
- V1 core items are unambiguous. Stage 2 (Questioning) and Stage 3 (Integration) are the most clearly written.
- V2 Level 4 items are intentionally ambiguous — appropriate for difficulty level, but ambiguity is not always documented at the item level. A rater cannot always distinguish "this is ambiguous by design" from "this is unclear by accident."

**Calibration: Partially done.**
- Difficulty is labeled (Easy/Medium/Hard, Level 1–4) but calibration is based on expert intuition, not empirical item response data. We don't know the actual item difficulty function across models.
- V1 easy questions produce a ceiling effect: Claude scores 100%, Qwen/GPT score 91–92%. The top-3 frontier models are indistinguishable at this level.

**Diversity: Good on tradition, limited on situation.**
- Tradition coverage: 7 major traditions, multiple denominations each — strong.
- Life situation coverage: Items cluster around "person reflecting on their spiritual life" generically. Grief, shame, addiction, relational rupture, crisis of meaning, identity transition — the situations that actually bring people to coaching — are underrepresented as structured categories.
- Speaker demographics: Age, gender, culture, class, neurotype are not systematically varied. A Stage 2 questioning narrative from a 19-year-old evangelical white American looks very different from one spoken by a 55-year-old Sufi woman in Iran — the benchmark doesn't yet distinguish model performance across these variations.

**Coverage of the competency space: Incomplete.**
- Deep listening / attunement: Not directly measured. Tasks test whether the model *classifies* and *responds appropriately*, but not whether it demonstrates genuine presence — tracking what the person actually said, holding contradictions, resisting the impulse to resolve.
- Cultural humility: No items designed to probe the model's recognition of its own limits.
- Boundary-aware care (not sliding into therapy): Mentioned in rubric but no dedicated items.
- Safety (recognizing crisis vs. ordinary spiritual pain): No items.
- Spiritual bypassing detection: Partially covered by the "no inappropriate faith injection" criterion, but bypassing is broader (toxic positivity, premature reframe, silver-lining spirituality) and underrepresented.

**Comparison:** BIG-Bench had 204 tasks and thousands of items precisely because coverage is hard to claim with small item sets. AlpacaEval uses a large diverse instruction set. At 116 scenarios, Kairos-SEB can make claims about performance on its specific items but not about the broader competency space.

---

### 2.3 Scoring Reliability

**Current method:** Primarily accuracy on stage classification (Task 1). Tasks 2–4 use a 1–5 rubric per dimension, currently evaluated by the model creator + LLM judge. No published inter-rater agreement data.

**What's good:**
- The V2 Part D pass/fail rubric is behavioral and specific. "Does NOT inject spirituality where none exists" is checkable. "Shows awareness of tradition-specific terms" is checkable with domain knowledge.
- The First-Person Coherence dimension has clear positive/negative examples.
- Kappa >0.8 is targeted but not yet achieved at scale.

**What's weak:**
- LLM-as-judge without calibration against human ground truth is the benchmark's biggest current reliability risk. LLM judges are known to exhibit: position bias, verbosity bias, self-enhancement bias (a model judging its own outputs or outputs from its model family), and sycophantic drift. None of these are controlled for.
- The rubric for Task 4 (Response Generation) includes "helpfulness" and "developmental appropriateness" — both require human judgment and are unlikely to be reliably scored by LLM judges without extensive calibration.
- No ICR data, no annotator qualification criteria documented.

**Comparison:** MT-Bench uses GPT-4 as judge with known limitations and publishes its prompt template. Chatbot Arena uses human pairwise preference (more reliable but expensive). HELM uses automated metrics across multiple dimensions. Kairos-SEB's hybrid approach is *right in principle* but the human evaluation component hasn't been executed at scale yet.

**Gap:** The benchmark currently operates primarily in LLM-self-evaluation mode. For the domain (emotional/spiritual reasoning), this is particularly risky — LLMs will plausibly-sound their way through rubrics that require lived wisdom.

---

### 2.4 Contamination Risk

**Risk level: Moderate and growing.**

- The repo is public on GitHub (Coldstone07/SES-benchmark). Any scenario in this repo is in the training data risk pool for models trained after its publication date.
- V1 core 16 scenarios are the highest contamination risk — they are simple, clearly labeled, and now indexed.
- The HuggingFace dataset (coldstone7/kairos-seb) may have been crawled.
- Claude Sonnet 4.6 scoring 100% on V1 core is consistent with either (a) the model genuinely being better at this task, or (b) contamination. There is no way to distinguish these with the current setup.

**Mitigation options not yet implemented:** held-out test sets not published in the repo, versioned dataset with watermarking, dynamic/adversarial item generation.

**Comparison:** TruthfulQA explicitly benchmarks against contamination by choosing questions models tend to answer falsely due to training data patterns. MMLU-Pro is a harder version partly motivated by MMLU saturation from contamination. Kairos-SEB has no contamination controls.

---

### 2.5 Sample Size / Statistical Power

**Current:** 12 scenarios used in model comparison. 45 in V2 full set. ~116 total in repo.

**What this enables and doesn't:**
- 12-item comparison: At 75% accuracy (Claude Opus), confidence interval is roughly ±24% (95% CI: 47%–93%). The difference between Claude Sonnet (100%) and Qwen (91.6%) on 12 items is **not statistically significant**. One item separates them.
- 45-item V2 set: At 50% accuracy, CI is ±15%. Still insufficient to rank models reliably or report per-tradition or per-difficulty breakdown with statistical confidence.
- For reliable model ranking: Generally need 200–500 items at minimum. MMLU has 14,000. BIG-Bench has 204 tasks. Even HEART (a small benchmark) has 300 items.

**This is the single biggest structural limitation.** All current results are directionally interesting but statistically weak.

---

### 2.6 Reproducibility

**What's documented:**
- Evaluation scripts use OpenRouter API, model names are specified in the scripts.
- `quick_eval.py` and `test_all_models.sh` specify model names (qwen/qwen3.6-plus, anthropic/claude-sonnet-4.6, etc.).
- Rebuild guide is detailed.

**What's missing:**
- **Temperature, top-p, and other sampling parameters are not pinned** in the scripts reviewed. Default API parameters vary across providers and versions.
- **Prompt templates are embedded in scripts** but not version-controlled separately or published as a formal prompt registry.
- **Model version pinning:** Model names like "claude-sonnet-4.6" may resolve to different underlying weights over time.
- **Random seed:** Not set in any script reviewed.
- **System prompt:** Not pinned or documented.

**Comparison:** HELM explicitly documents all generation parameters. AlpacaEval pins its judge prompt. MT-Bench publishes its exact prompts. Kairos-SEB is reproducible in spirit but would produce drift across runs as APIs update.

---

### 2.7 Baselines and Chance Performance

**What exists:**
- Random baseline stated: 25% (4-way classification, Task 1).
- Human baseline stated: >90% (claimed, not measured).
- `RandomAdapter` implemented in `evaluate.py`.

**What's missing:**
- Human baseline has not been empirically measured. A claimed >90% human accuracy on stage classification is plausible but unverified.
- No majority-class baseline reported.
- No "sophisticated but wrong" baseline — e.g., a model that always predicts Stage 2 (Questioning) because the language is most distinctive.
- For Tasks 2–4 (open-ended), no baseline response quality has been established.

**Comparison:** TruthfulQA explicitly measures human performance. MMLU-Pro reports human expert performance. Without a measured human baseline, we cannot interpret what model performance means relative to the target competency.

---

### 2.8 Bias, Safety, and Cultural Competence

**Domain-specific risks that are acute here:**

**Tradition bias:** The 4-stage developmental model implicitly privileges progressive, individuated spiritual development (Stage 3: "my spirituality is authentically mine"). This is a Western, post-Enlightenment framing. Orthodox or traditional expressions of faith that deliberately defer to community/scripture (which would score as "Stage 1" in this model) are not deficient — they are coherent within their own tradition's epistemology. A model that correctly scores a devout Orthodox Jew as "Stage 4" for expressing deeply integrated communal observance would be punished by this rubric.

**Therapeutic/pathologizing risk:** No items test whether a model inappropriately pathologizes ordinary spiritual experience (e.g., labeling a dark night of the soul as depression, or suicidal ideation risk where none exists).

**Crisis detection:** No scenarios include acute crisis language (grief that touches on suicidality, spiritual emergency, self-harm ideation). A safe model should recognize and respond appropriately. An unsafe model might spiritualize crisis. This is not tested.

**Spiritual bypassing detection:** Partially covered but the failure mode taxonomy is incomplete. Bypassing variants not yet itemized: toxic positivity, premature meaning-making, spiritual superiority, intellectualization as avoidance, using tradition language to avoid emotional contact.

**Annotator positionality:** The benchmark is authored from within a specific (Kairos/New Age-adjacent, Western, primarily English-language) perspective. This is not disclosed or accounted for in the documentation.

---

### 2.9 Benchmark Saturation / Discrimination Across Frontier Models

**Current discrimination:**
- V1 core (12 items): Claude 100%, Qwen/GPT ~92%, Opus 75%, MiniMax 0%. Good spread.
- V2 hard (estimated 50% failure): Not yet systematically measured.

**Saturation risk on V1:** High. Claude Sonnet scored 100% on 12 items. Any new frontier model will likely also score >90% on V1 within months if not already. The easy tier is already saturated for top models.

**Discrimination on hard items:** Unknown. This is the most important unanswered empirical question.

**What's needed:** A V3 "adversarial" tier designed specifically so that no current model can score above 70%, with items updated as models improve.

---

### 2.10 Documentation

**Strengths:**
- HuggingFace-style model card exists (`kairos-seb/docs/model_card.md`)
- Rebuild guide is comprehensive
- Theoretical grounding is documented with source citations
- Limitations are partially acknowledged

**Missing from a datasheet (Gebru et al. 2018) or model card (Mitchell et al. 2018) standard:**
- Annotator demographics and qualification criteria
- Annotation disagreement rates and how conflicts were resolved
- Intended use vs. out-of-scope use (partially done)
- Known biases with specific examples
- Privacy and consent (were any scenarios drawn from real coaching conversations?)
- Licensing (not specified)
- Version history and changelog
- How to report errors or request updates

---

## 3. Verdict

### Is this currently a good benchmark?

**Honest answer: It is a promising, well-conceived early-stage benchmark. It is not yet a good benchmark by published standards. The gap is real but closeable.**

**What it does well:**
- The core insight — that models should be tested on whether they can meet people *inside* their actual tradition without flattening, injecting, or bypassing — is correct and important. No published benchmark does this.
- The Pure Emotional / Pure Spiritual / Blended separation is genuinely novel and practically valuable.
- The scenario quality is high. The writing is authentic, the religious vocabulary is specific, and the rubric criteria are more behavioral than most.
- Real model runs have been executed and results are documented.

**What prevents it from being a good benchmark right now:**

### Fix 1 — Statistical inadequacy (highest priority)

116 scenarios is insufficient to rank models, report per-tradition breakdowns, or make any reliability claims. Before expanding scope, expand the item count for the *existing* dimensions to at least 300 items, with systematic coverage across tradition × difficulty × situation. Then run all current models and compute confidence intervals. Until this is done, the results are directionally interesting anecdotes, not measurements.

### Fix 2 — Human ground truth and inter-rater agreement

The benchmark currently runs in LLM-self-evaluation mode. For Tasks 2–4 (open-ended), LLM-as-judge without calibration against human ground truth is unreliable in exactly this domain — a model can sound spiritually attuned without being so. The fix: recruit 3–5 annotators with genuine cross-tradition background (not just one tradition each), establish a shared annotation protocol, measure pairwise Cohen's Kappa, and use this to calibrate the LLM judge prompt. Publish the Kappa. Until this is done, scores on Tasks 2–4 are not trustworthy.

### Fix 3 — Reproducibility and contamination controls

Pin temperature, top-p, system prompt, and model version in all evaluation scripts. Add a held-out test split that is **not published in the repo** — used only for official evaluations. Create a public "dev set" for researchers to practice on. This matters especially because the repo is already public and Claude Sonnet 4.6's 100% score on V1 is uninterpretable without contamination controls.

---

### Then: Expand scope

Once those three fixes are in place, the expansion to broader traditions × situations × competencies (the direction Kairos described) is well-positioned. The framework is sound. The scenario-writing quality is high. The conceptual structure (Frameworks × Situations × Competencies) is the right architecture for what this benchmark is trying to do.

The expansion should be built on a fixed, reliable measurement foundation — not on a statistically underpowered, unvalidated base.

---

*Assessment written by Claude Sonnet 4.6 on 2026-04-15. This is a technical audit, not a judgment of the mission — the mission is right. The measurement needs to catch up to it.*
