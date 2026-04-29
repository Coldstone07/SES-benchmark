# DevTrace: Developmental Trajectory Corpus for Emotional-Spiritual Reasoning

**Status**: Proposed — companion dataset to PERSPECT benchmark  
**Type**: Multi-source annotated corpus (longitudinal coaching transcripts + perspective-paired responses + IQ/EQ annotation layer)  
**Primary use**: Training signal and evaluation ground truth for trajectory-aware emotional-spiritual reasoning in LLMs

---

## Motivation

Every major emotional AI dataset is cross-sectional. It captures a moment — an utterance, a turn, a scenario — and asks: what is the right response *now*? This design assumption is invisible but consequential. It means models trained on this data learn to recognise emotional states. They do not learn to understand emotional development.

In spiritual and coaching contexts, the right response depends not just on the current emotional state but on the *arc* — where the person has been, what stage of development they occupy, and what they are ready to move toward. A model trained only on cross-sectional data learns "this looks like grief, respond with validation." A model trained on trajectory data learns "this person has been in grief for three sessions and is beginning to introduce integrative language — this turn is a transition marker, and the response should honour the grief while holding space for the emerging movement."

DevTrace is the corpus that makes trajectory-aware training possible. It is also the ground-truth infrastructure that PERSPECT's T4 (Trajectory Tracking) task requires.

---

## The Fundamental Gap DevTrace Fills

| What cross-sectional emotional data teaches | What DevTrace teaches |
|---------------------------------------------|----------------------|
| Current emotional state → appropriate response | Developmental arc → trajectory-aware response |
| What is the person feeling right now? | Where is this person in their development? |
| Surface vocabulary matching | Discourse structure and trajectory inference |
| Single correct answer per scenario | Multiple valid responses conditioned on developmental position |
| Confidence = pattern-match strength | Confidence = boundary-proximity awareness |

---

## Corpus Structure

DevTrace contains four interlocking data layers. Each layer is independently valuable; together they provide the multi-level annotation required for trajectory-aware EQ training.

---

### Layer 1: Longitudinal Coaching Transcripts

**What it is**: Multi-session coaching conversations (anonymised, consent-obtained) annotated at the turn level.

**Annotation per turn**:
- `stage_label`: Current developmental stage (S1–S4), with boundary proximity score (0–1)
- `epistemic_orientation`: The person's current relationship to doubt/certainty/paradox (scale: closed/open/integrative)
- `emotional_activation`: Arousal level (low/medium/high) and valence (positive/negative/mixed)
- `coach_stance`: Whether the coach maintained first-person relational stance or shifted to analytical narration (relational/analytical/mixed)
- `transition_marker`: Boolean flag for turns where a developmental shift becomes linguistically visible
- `transition_type`: What kind of shift — stage advance, stage regression, intra-stage deepening, defence mechanism activation

**Why it matters for training**: The model sees developmental movement, not just states. It learns the specific linguistic and emotional patterns that *precede* and *follow* stage transitions — the exact markers that a skilled coach uses to detect movement that a model trained only on cross-sectional data cannot see.

**Target size**: 500 annotated session pairs (1,000 individual sessions, ~100 turns per session = ~100,000 annotated turns)

**Ethics and consent protocol**: Participants provide explicit informed consent for use of anonymised transcripts in AI training. Anonymisation removes all identifying information including names, locations, organisations, and specific biographical details while preserving developmental content and language patterns.

---

### Layer 2: Perspective-Paired Response Sets

**What it is**: For each scenario in the DevTrace scenario bank, 3–4 practitioner-generated responses annotated with which developmental stage each response is optimal for and why.

**Structure per scenario**:
```
Scenario: [user utterance]
Stage ground truth: S2 (Questioning)

Response A: [response text]
  optimal_for: S2
  harmful_for: [S1 — introduces doubt before stabilisation; S4 — condescending crisis framing]
  harm_mechanism: [specific language that would be destabilising/inappropriate]
  stage_markers_used: [list of specific lexical/structural choices that make this S2-appropriate]

Response B: [response text]  
  optimal_for: S1
  harmful_for: [S2 — false stabilisation of healthy questioning; S3 — regressive]
  ...
```

**What this teaches**: The model learns not just "what is the right response" but "why this response is wrong for other positions." This is the counterfactual structure that T5 (Counterfactual Harm) in PERSPECT requires, and it is the direct training signal for preventing stage-mismatch in deployment.

No existing emotional AI dataset has this structure. Perspective-paired responses require practitioners who can explicitly articulate why a valid response for one person is harmful for another — a level of developmental meta-awareness that standard crowdsourced annotation cannot provide.

**Target size**: 600 scenarios × 3.5 response variants average = ~2,100 annotated response-stage pairs

---

### Layer 3: IQ/EQ Annotation Layer

**What it is**: Dual annotation of every scenario and response pair on two independent axes.

**IQ axis — Cognitive Complexity Score (CCS, 1–5)**:
- 1: Stage classification is unambiguous from surface vocabulary alone
- 3: Requires inference beyond surface vocabulary; stage markers are embedded in discourse structure
- 5: Requires full trajectory reasoning; correct classification depends on understanding what developmental path led to this utterance

**EQ axis — Relational Attunement Score (RAS, 1–5)**:
- 1: Correct response is the analytically most likely response; no relational inference needed
- 3: Correct response requires some adjustment from the analytically optimal response based on relational context
- 5: Analytically optimal response would be actively harmful; correct response requires significant divergence from the most likely pattern in service of relational attunement

**Integration marker**:
- `aligned`: IQ and EQ point in the same direction (high-CCS scenarios tend to also be high-RAS)
- `divergent`: IQ and EQ point in different directions — the analytically correct answer is the relationally wrong one
- `independent`: IQ and EQ are independently variable for this scenario

**Why divergent scenarios are the most valuable training signal**: A model optimising only for accuracy will consistently fail on divergent scenarios — it will give the analytically correct but relationally wrong response. These scenarios are where the model needs to have learned to *prioritise relational context over analytical precision*. The IQ/EQ annotation layer makes it possible to identify, weight, and specifically train on these cases.

**Target size**: Full annotation of all Layer 1 turns and Layer 2 scenarios

---

### Layer 4: Calibration Annotation

**What it is**: Every annotated stage label accompanied by:
- `annotator_confidence`: Practitioner's own confidence in their label (0–1 scalar)
- `boundary_proximity`: How close is this scenario to a stage boundary? (0=clear centre, 1=maximum boundary)
- `competing_stage`: Which alternative stage was considered and why it was ruled out
- `distinguishing_criterion`: The specific feature that resolved the classification in favour of the assigned stage

**Why it matters**: This layer is the ground truth for appropriate model confidence. If a practitioner with 15 years of Fowler-based assessment experience assigns confidence 0.65 to a scenario, a model expressing 0.95 confidence on the same scenario is exhibiting a calibration failure — not a triumph. The model should learn to match *human expert calibration* on ambiguous scenarios, not maximise stated confidence.

This directly addresses the MCIP ≈ MCCIP finding from Kairos-SEB. The model wasn't wrong to be uncertain — it was wrong to not express that uncertainty.

---

## Data Collection Protocol

### Practitioner Panel
All DevTrace annotation is performed by credentialed practitioners: licensed spiritual directors, accredited developmental coaching practitioners, or equivalent. Minimum qualification: documented 3+ years of stage-assessment practice using Fowler or equivalent framework.

### Annotation Pipeline
1. **Scenario authoring**: Practitioner drafts scenario against four-field template (tradition context, target stage, difficulty justification, exclusion rationale for adjacent stages)
2. **Double-blind primary annotation**: Two independent annotators assign stage labels, confidence scores, and boundary proximity
3. **IQ/EQ annotation**: Same annotators independently score CCS and RAS
4. **Adjudication**: Scenarios below κ = 0.75 on primary label undergo structured adjudication with senior adjudicator; adjudicated flag preserved
5. **Response generation**: 3–4 practitioners generate stage-specific responses for Layer 2; each annotated for optimal stage, harm mechanisms, and stage markers used
6. **Quality review**: Lead practitioner reviews full scenario record before release

### Inter-Annotator Agreement Targets
| Layer | Target κ | Rationale |
|-------|----------|-----------|
| Stage labels (overall) | ≥ 0.78 | Higher than Kairos-SEB's 0.72 — enforced before release |
| Stage labels (hard tier) | ≥ 0.70 | Tier-stratified, not just overall |
| CCS scores | ≥ 0.72 | Ordinal scale; weighted kappa |
| RAS scores | ≥ 0.72 | Ordinal scale; weighted kappa |
| Integration marker | ≥ 0.80 | Three-class categorical |

---

## How DevTrace Enables IQ/EQ Integration Training

The training signal DevTrace provides that no existing dataset can:

**1. Trajectory-conditioned labelling**: The model sees the same person's utterances across multiple turns, annotated for how their developmental position is evolving. It learns that "I feel at peace" in session 2 (Stage 1) and "I feel at peace" in session 8 (Stage 4) are structurally different utterances despite identical surface content — because the sessions in between show the deconstruction and reintegration arc.

**2. Perspective-paired counterfactuals**: The model sees not just the right answer but the specific reasons why the right answer for one person is wrong for another. This is the training signal for perspective-multiplicity — the capacity to hold multiple valid interpretations simultaneously and choose based on the receiver's developmental position.

**3. Divergent scenario weighting**: IQ/EQ divergent scenarios — where analytical precision and relational attunement point in different directions — are explicitly flagged and can be upweighted in training. This allows fine-tuning that specifically improves the model's capacity to diverge from the most likely response when the relational context demands it.

**4. Calibration-matched confidence targets**: The model can be trained not to maximise stated confidence but to match practitioner confidence distributions. On boundary-proximity = 0.9 scenarios, the right confidence is 0.60–0.70, not 0.95. DevTrace provides the ground truth for this calibration target.

---

## Relationship to PERSPECT Benchmark

DevTrace is both a training resource and an evaluation infrastructure:

| PERSPECT Task | DevTrace Layer Required |
|---------------|------------------------|
| T1: Stage Detection | Layer 4 (calibration annotation for EC scoring) |
| T2: Perspective Divergence | Layer 2 (perspective-paired response sets) |
| T3: IQ/EQ Arbitration | Layer 3 (IQ/EQ annotation — identifies divergent scenarios) |
| T4: Trajectory Tracking | Layer 1 (longitudinal transcripts with transition markers) |
| T5: Counterfactual Harm | Layer 2 (harm mechanism annotations) |

Without DevTrace, T4 and T5 in PERSPECT must use constructed dialogue vignettes rather than naturalistic developmental trajectories — a significant validity reduction.

---

## Release Plan

| Phase | Contents | Format |
|-------|----------|--------|
| v0.1 — Pilot | 100 scenarios (Layers 2–4 only) | HuggingFace + Zenodo DOI |
| v1.0 — Full | 600 scenarios + Layer 1 transcripts (200 session pairs) | HuggingFace versioned dataset |
| v2.0 — Extended | Full 1,000 session pairs, expanded tradition coverage | HuggingFace + paper |

All releases will include: `paraphrase_flag`, `adjudicated_flag`, `tradition`, `stage_label`, `annotator_confidence`, `boundary_proximity`, `ccs`, `ras`, `integration_marker`.

---

## Open Questions

1. **Longitudinal consent at scale**: Multi-session coaching transcripts require ongoing consent from both coach and client. What is the minimum viable consent infrastructure for a 500-session corpus?
2. **Tradition calibration**: Fowler and Peck are Western frameworks. How are stage markers operationalised for South/East Asian spiritual traditions without imposing Western developmental vocabulary?
3. **Synthetic augmentation**: Can LLM-generated synthetic trajectories (reviewed by practitioners) supplement naturalistic transcripts in Layer 1 without introducing systematic bias? What is the minimum ratio of naturalistic to synthetic?
4. **IQ/EQ divergence rarity**: Preliminary analysis suggests truly divergent scenarios (where analytically correct ≠ relationally appropriate) may be uncommon in natural coaching data. Active elicitation of divergent cases may be needed at annotation time.
