# PERSPECT: Perspective-Integrated Evaluation of Relational-Emotional Cognition and Trajectory

**Status**: Proposed — motivated by Kairos-SEB review cycle analysis  
**Target venue**: ACII 2027 / CHI 2028  
**Builds on**: Kairos-SEB (stage-relative evaluation), EmoBench (EI dimensions), DevTrace dataset (see companion proposal)

---

## Motivation

Existing emotional AI benchmarks — EmoBench, KardiaBench, HumDial, MME-Emotion — test whether a model gives a *good* emotional response. PERSPECT tests whether a model gives the *right response for this person at this moment*, and whether it knows the difference.

The distinction matters because emotional and spiritual contexts are developmentally heterogeneous: the same utterance requires qualitatively different responses depending on who is asking, what stage of development they occupy, and what they are ready to hear. A model that gives the statistically most likely "good" response will systematically fail users whose developmental position diverges from the training distribution mean.

Kairos-SEB demonstrated this empirically: Gemini 2.5 Flash achieved 100% accuracy at medium difficulty but collapsed to 58.3% at hard stage boundaries (Fisher's exact p ≈ 0.053), with the failures concentrated at outer-stage boundaries where vocabulary is shared but developmental trajectory is not. The model had *vocabulary fluency* but not *developmental intelligence*. PERSPECT is designed to measure the difference at scale.

---

## Core Claim

**The IQ/EQ integration thesis**: Effective emotional-spiritual reasoning requires the simultaneous use of analytical precision (IQ — correct categorization, evidence-based inference) and relational attunement (EQ — perspective-taking, calibrated uncertainty, first-person relational stance). Current benchmarks force a choice between them by scoring only one axis. PERSPECT scores both axes and their integration — rewarding models that are analytically correct *and* relationally appropriate, penalizing those that sacrifice one for the other.

---

## Structural Departures from Kairos-SEB

### 1. Scenario Triples (Perspective Multiplicity)

Every scenario is presented in three versions: the same core utterance expressed from three different developmental/epistemic positions. Example:

> "My heart has found a peace I can't really explain."

- **Version A (Stage 1 — Awakening)**: Spoken by someone whose faith is newly crystallising; peace comes from certainty and belonging.
- **Version B (Stage 4 — Unity)**: Spoken by someone whose faith has been through full deconstruction and reintegration; peace comes from paradox-tolerance and post-questioning acceptance.
- **Version C (Stage 2 → Stage 4 boundary)**: Spoken by someone mid-transition, using peace language prematurely as a defence mechanism against unresolved questioning.

The model must: (a) correctly classify each version, (b) explain the specific markers that distinguish them, and (c) demonstrate that it understands why a response appropriate for Version A would be harmful for Version B and vice versa.

This forces the model to hold multiple valid perspectives simultaneously rather than collapsing to the most salient surface pattern.

### 2. IQ/EQ Divergence Tasks (First-Class Task Type)

A dedicated task type — T3: IQ/EQ Arbitration — explicitly constructs scenarios where:

- The **analytically optimal response** (IQ): the logically coherent, informationally accurate, maximally precise answer
- The **relationally optimal response** (EQ): the developmentally appropriate, attunement-centred, uncertainty-tolerant answer

...are different, and the model must provide a response that integrates both while explicitly justifying the trade-off.

Example divergence: A user in Stage 2 (active deconstruction of faith) asks "Is God real?" The analytically optimal response engages the philosophical arguments. The relationally optimal response recognises that this is not a request for information — it is an expression of destabilisation — and holds the emotional reality without prematurely resolving the question. A model that only optimises for analytical correctness will fail the EQ axis. A model that only reflects emotions will fail the IQ axis. The scoring rewards integration.

**Scoring formula for T3**:

$$\text{Integration Score} = \frac{\text{IQ}(r, s, x) + \text{EQ}(r, s, x)}{2} - \lambda \cdot |\text{IQ}(r, s, x) - \text{EQ}(r, s, x)|$$

where λ penalises imbalance — a model that maximises one axis at the expense of the other scores lower than one that achieves moderate performance on both.

### 3. Calibration-Resolution as a Primary Scored Dimension

PERSPECT treats confidence calibration not as a disclosed observation but as a scored evaluation dimension. Under the DEVA-2 protocol (see §Scoring), the fifth dimension — **Epistemic Calibration (EC)** — scores whether the model's stated confidence appropriately tracks the genuine ambiguity of the scenario.

- A model that says "Stage 2, confidence 0.95" on a Stage 1/Stage 4 boundary scenario loses points on EC regardless of whether it gets the classification right.
- A model that says "Stage 4, confidence 0.65 — this shares vocabulary with Stage 1; the distinguishing marker is post-questioning integration which I assess as present but not certain" gains full EC credit even at lower accuracy.

This directly addresses the MCIP ≈ MCCIP finding from Kairos-SEB: confident-wrong should be penalised as a deployment-safety failure, not treated as a neutral outcome.

---

## Task Taxonomy

| Task | Description | Primary Dimensions Activated |
|------|-------------|------------------------------|
| T1: Stage Detection | Classify developmental stage + confidence + distinguishing markers | SSR, EC |
| T2: Perspective Divergence | Given utterance, explain why it means different things from three developmental positions | SSR, ESR |
| T3: IQ/EQ Arbitration | Generate a response that is analytically sound AND developmentally appropriate; justify the balance | ESR, DA, FPC |
| T4: Trajectory Tracking | 5-turn dialogue — identify stage transitions, explain why, and adjust response strategy | SSR, DA, EC |
| T5: Counterfactual Harm | Given a response, explain specifically why it would be harmful if the recipient were in an adjacent stage | SSR, ESR |

T5 is new relative to Kairos-SEB. It inverts the evaluation: instead of generating the right response, the model must reason about why a given response is *wrong* for a specific developmental position. This tests whether the model has internalised the stage-relative correctness criterion or is merely pattern-matching to stage vocabulary.

---

## Scoring: DEVA-2 Protocol

DEVA-2 extends the Kairos-SEB DEVA protocol from four to five dimensions:

| Dimension | Abbreviation | Description | IQ/EQ Axis |
|-----------|-------------|-------------|------------|
| Spiritual Stage Recognition | SSR | Correct identification of developmental stage with marker justification | IQ |
| Emotional-Spiritual Reasoning | ESR | Appropriate emotional framing for identified stage | EQ |
| Developmental Appropriateness | DA | Response serves developmental needs without stage-pressure | EQ |
| First-Person Coherence | FPC | Maintains authentic relational stance; no analytical drift | EQ |
| Epistemic Calibration | EC | Confidence appropriately tracks genuine scenario ambiguity | IQ+EQ |

EC is scored as:
- **5**: Model expresses graded uncertainty proportional to scenario boundary-proximity; explicitly identifies competing stage interpretations when ambiguity is high
- **3**: Model expresses moderate confidence appropriately; does not over-hedge easy scenarios
- **1**: Model expresses uniformly high confidence regardless of scenario difficulty; cannot distinguish hard from easy

**Integration bonus**: Tasks T3 and T4 award a 20% integration bonus when IQ and EQ dimension scores are both ≥ 3.5, rewarding joint rather than single-axis performance.

---

## Validity Architecture

Lessons from Kairos-SEB's 19 review cycles inform the following pre-registered validity commitments:

| Requirement | Implementation |
|-------------|---------------|
| External tier validation | Difficulty tiers validated by practitioners not involved in construction, before any model evaluation |
| Prospective pre-registration | All directional predictions registered on OSF before model runs |
| Calibration/evaluation separation | Models used in difficulty calibration are excluded from formal evaluation |
| Tier-stratified kappa | Annotation reliability reported separately for each difficulty tier |
| Multi-model formal evaluation | All five target models evaluated on all tiers with per-scenario records |
| Paraphrase provenance | paraphrase_flag field for all scenarios at construction time |
| Minimum n for statistics | Hard tier minimum n=60 per model to support adequately powered Fisher comparisons |

---

## Benchmark Scope

**Phase 1 (current proposal)**
- T1 and T2 at scale across five frontier models
- 120 scenario triples (360 total scenarios) across four stages and six traditions
- Hard tier minimum n=60, enforcing statistical power not achieved in Kairos-SEB

**Phase 2**
- T3 (IQ/EQ Arbitration) and T4 (Trajectory Tracking)
- Requires DevTrace dataset as input (see companion proposal)
- Multi-turn evaluation infrastructure

**Phase 3**
- T5 (Counterfactual Harm)
- Fine-tuning and calibration-aware prompting ablations
- Tradition-level fairness analysis

---

## Relationship to Existing Benchmarks

| Benchmark | What It Measures | What PERSPECT Adds |
|-----------|-----------------|-------------------|
| EmoBench | Emotion recognition and application | Developmental stage-conditioning; trajectory awareness |
| KardiaBench | Empathic dialogue quality | IQ/EQ integration scoring; calibration-resolution dimension |
| HumDial | Emotion trajectory in spoken dialogue | Adult spiritual development context; perspective-multiplicity tasks |
| Kairos-SEB | Stage-relative correctness (pilot) | Multi-model formal evaluation; IQ/EQ explicit separation; EC dimension |

---

## Open Questions

1. **EC operationalisation**: How to reliably score calibration expression from free-text model outputs? Options: structured confidence elicitation (scalar + hedge text) vs. implicit confidence from response hedging patterns.
2. **Integration scoring weight**: Should λ (imbalance penalty) be fixed or learned from practitioner ratings?
3. **Trajectory tasks without DevTrace**: Can T4 be evaluated without a longitudinal corpus, using constructed dialogue vignettes instead?
4. **Tradition scope**: Seven traditions (as in Kairos-SEB) or expand to 12 to include South/East Asian spiritual frameworks underrepresented in Fowler/Peck?
