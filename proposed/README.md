# Proposed: Next-Generation Emotional-Spiritual Benchmarking

This folder contains proposals for the next phase of emotional-spiritual AI evaluation, motivated by lessons from the Kairos-SEB adversarial review process.

## Documents

| File | Description |
|------|-------------|
| [`kairos-seb-lessons.md`](kairos-seb-lessons.md) | Foundational analysis — what 19 adversarial review cycles revealed about the structural limits of stage-relative evaluation |
| [`perspect-benchmark.md`](perspect-benchmark.md) | PERSPECT benchmark proposal — perspective-multiplicity, IQ/EQ integration scoring, calibration-resolution as a primary dimension |
| [`devtrace-dataset.md`](devtrace-dataset.md) | DevTrace dataset proposal — longitudinal trajectory corpus with perspective-paired responses and IQ/EQ annotation layer |

## The Core Argument

Kairos-SEB demonstrated that frontier LLMs have **vocabulary fluency** in spiritual-emotional domains but lack **developmental intelligence** — the capacity to infer the trajectory behind an utterance and respond appropriately for *this person at this developmental moment*.

The gap is structural: current benchmarks optimise for accuracy (an IQ metric) on scenarios that require relational attunement (an EQ capacity). Models are rewarded for giving the most linguistically likely correct answer, but in developmental contexts the most likely answer is often right for someone else.

**PERSPECT** makes the IQ/EQ distinction testable — scoring both axes and their integration.  
**DevTrace** makes it trainable — providing trajectory data, perspective-paired counterfactuals, and calibration-matched confidence targets that no existing emotional AI dataset contains.
