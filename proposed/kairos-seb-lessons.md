# Lessons from Kairos-SEB: What 19 Adversarial Review Cycles Revealed

**Source**: Kairos-SEB adversarial review loop (Cycles 1–19, ACII 2027 target)  
**Status**: Post-completion analysis — all 3 independent reviewers (Methodologist, Benchmark Expert, Skeptic) returned Weak Accept with zero MUST FIX items at Cycle 19  
**Relevance**: Foundational motivation for PERSPECT benchmark and DevTrace dataset proposals

---

## Overview

Kairos-SEB was the first benchmark to condition emotional AI correctness on the developmental stage of the user receiving the response. Its empirical evaluation — a formal pilot across five frontier LLMs on Stage Detection (T1) — underwent 19 cycles of adversarial peer review before clearing the panel. The issues that kept surfacing across those cycles were not primarily writing problems. They were measurement problems. This document records what the review process revealed about the structural limits of stage-relative evaluation at the current state of the field.

---

## The Core Finding: Vocabulary Fluency ≠ Developmental Intelligence

Gemini 2.5 Flash achieved 100% accuracy at medium difficulty and 58.3% at hard (Fisher's exact two-tailed p ≈ 0.053). The failure mode was specific: Stage 4 utterances misclassified as Stage 2. Both stages use acceptance and peace vocabulary. What distinguishes them is the *developmental trajectory* behind the words — whether acceptance is pre-questioning (Stage 1 certainty) or post-questioning (Stage 4 integration). The model had the vocabulary. It did not have trajectory awareness.

This distinction — **vocabulary fluency vs. developmental intelligence** — is the central insight the benchmark produced. It suggests a capability gap that is not primarily about domain knowledge, language understanding, or even standard reasoning. It is about *perspective-taking across developmental time*: understanding what a person has been through, not just what they are currently expressing.

---

## What the Review Cycles Kept Catching

**1. Inferential overclaiming from marginal evidence**
The primary Fisher result (p ≈ 0.053) never reached α = 0.05. Across 15+ cycles, reviewers repeatedly caught the paper stating the effect as confirmed when it was directional-only. The language discipline required — "provides directional evidence for," "consistent with but not establishing," "preliminary inference requiring external validation" — reflects a structural tension in small-n pilot benchmarks: the effect is real enough to motivate work, but not strong enough to be stated as a finding. Future benchmarks need larger sample sizes and pre-registered directional predictions to avoid this.

**2. Calibration confidence ≠ accuracy**
MCIP (Mean Confidence on Incorrect Predictions) ≈ 0.93; MCCIP (Mean Confidence on Correct Predictions) ≈ 0.94. The model expressed equally high confidence whether right or wrong. With only n=6 errors, this constitutes a null pilot observation — insufficient to confirm or rule out calibration resolution failure. But the observation is sobering: in a coaching deployment context, a model that can't signal its own uncertainty on hard developmental boundary scenarios cannot support human oversight or confidence thresholding. Calibration-resolution is not a secondary metric — it is a deployment-safety metric.

**3. Annotation reliability at the boundary**
Pre-adjudication kappa κ = 0.72, below the 0.75 threshold. The failures concentrated at Stage 1/Stage 4 and Stage 2/Stage 3 boundaries — precisely the hard-tier scenarios that drive the primary Fisher result. This means the hardest scenarios for the model are also the hardest for human annotators, which raises a validity question: are we measuring model capability or annotation noise? Future benchmarks need tier-stratified kappa, not just overall kappa.

**4. Calibration circularity**
GPT-5.4 and Claude Sonnet were used in difficulty calibration and as evaluation subjects. The specific items each influenced could not be recovered. This makes their hard-tier results uninterpretable for independent evaluation. Any future benchmark must prospectively separate calibration models from evaluation models at design time, not address it retroactively.

**5. The V2 informal observation problem**
Informal observation across all five models suggested a shared ceiling near 50% at hard difficulty. This could not be cited as evidence — no per-scenario records were maintained. The finding is directionally important (it suggests the ceiling is not model-specific but frontier-wide) but scientifically inert without formal infrastructure. Multi-model formal evaluation needs per-scenario outcome records from day one.

---

## The IQ/EQ Structural Problem

The review cycles surfaced a deeper issue the benchmark design didn't fully resolve: current evaluation frameworks optimize for accuracy (an IQ metric) on scenarios that require relational attunement (an EQ capacity).

The model's vocabulary fluency is an IQ output — pattern recognition against a training distribution that includes extensive spiritual/philosophical text. The developmental reasoning required to distinguish Stage 4 peace from Stage 1 certainty is an EQ output — it requires inferring the trajectory and epistemic orientation behind the surface expression.

Current LLMs are trained to converge on the most likely correct answer. In spiritual-emotional contexts, the most linguistically likely answer is often the wrong one for *this person at this moment*. The model needs to know when to diverge from the most probable pattern in service of relational context. No existing benchmark — including Kairos-SEB — directly measures or rewards this capacity.

---

## What a Next-Generation Benchmark Must Address

| Gap in Kairos-SEB | Required in Next Generation |
|-------------------|-----------------------------|
| Single-utterance scenarios | Trajectory-aware multi-turn scenarios |
| Binary correct/incorrect scoring | Perspective-plurality scoring (multiple valid answers from different positions) |
| Accuracy as primary metric | Calibration-resolution as co-primary metric |
| IQ/EQ conflated | IQ/EQ separated and then re-integrated as a test of their joint use |
| Single-model formal evaluation | Multi-model, pre-registered, prospectively separated from calibration |
| Overall kappa only | Tier-stratified kappa from construction |
| No trajectory data | Annotated developmental transitions in longitudinal corpora |

These gaps motivate two concrete proposals: the **PERSPECT benchmark** and the **DevTrace dataset**.

---

## References

- Kairos-SEB paper draft: `../kairos-seb/` (this repo) and `papers/kairos-seb/` (connection-research)  
- Review cycle logs: `../kairos-seb/` adversarial panel records  
- Fowler, J.W. (1981). *Stages of Faith*. Harper & Row.  
- Peck, M.S. (1978). *The Road Less Traveled*. Simon & Schuster.
