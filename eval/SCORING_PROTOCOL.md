# SES Benchmark — Scoring Protocol
**Stream:** C (Rubric + Annotation Protocol)
**Version:** 0.1
**Date:** 2026-04-15
**Status:** Draft — for annotator training and calibration round design
**Companion documents:** `RUBRIC_v0.md`, `RESEARCH_SYNTHESIS.md`, `EXPANSION_ROADMAP.md`

---

## Purpose

This document specifies the scoring process for all SES benchmark items that require human or LLM-as-judge evaluation (Tasks 2–4). It defines:

1. Scorer qualifications and blinding
2. The dual-scorer process (step-by-step)
3. Inter-rater agreement computation (Krippendorff's Alpha)
4. Quality gates and calibration loop
5. LLM-as-judge protocol (per-dimension judge prompts, bias mitigations)
6. Edge case handling

**What this protocol does NOT cover:** Task 1 (stage classification) — that task uses exact-match accuracy and does not require this protocol.

---

## 1. Scorer Qualifications

### Human Scorers

SES dimensions require domain knowledge that cannot be assumed. Before scoring:

**Required for all scorers:**
- Familiarity with the SES_FRAMEWORK.md three-pillar structure
- Full read of RUBRIC_v0.md with all examples
- Completion of calibration round (see Section 5)
- Calibration Kappa ≥ 0.60 on seed items before being permitted to score production items

**Required by pillar:**

| Pillar | Knowledge requirement |
|--------|----------------------|
| Social | Exposure to at least two non-Western cultural frameworks; ability to recognize collectivist vs. individualist relational ethics |
| Emotional | Familiarity with at least one of: Motivational Interviewing (MI), Internal Family Systems (IFS), Rogerian person-centered theory, or equivalent counseling/clinical training |
| Spiritual | Functional literacy in at least two distinct traditions; ability to distinguish major internal branches (see SP1 rubric). Items in specific traditions may require specialist review — flag these per Section 6. |
| Mixed | Must meet qualifications for all three pillars |

**Minimum scorer pool:** 2 scorers per item (dual-scorer process). For calibration round, target 3–5 scorers to establish Alpha baseline across multiple raters.

### LLM-as-Judge

Used as a second "scorer" or as a scalability solution for large item sets after calibration. LLM judges do not replace human scoring for ground truth establishment — they supplement it.

**Prerequisite for LLM judge deployment:** LLM judge agreement with human scores must be ≥ 0.70 correlation on the 30-item calibration set before the judge is used in production. See Section 5.

---

## 2. Blinding Procedure

### What is blinded from scorers:

| Information | Blinded from scorer? | Rationale |
|---|---|---|
| Model name (GPT, Claude, etc.) | **Yes — always** | Prevents self-enhancement bias and brand heuristics from contaminating scores |
| Model family / provider | **Yes — always** | Same rationale |
| Other scorers' scores on the same item | **Yes — until both scorers have submitted** | Prevents anchoring bias |
| Scenario ID | No — scorer needs this for record-keeping | |
| Pillar, situation, difficulty | No — scorer needs this to apply rubric correctly | |
| Active dimensions | No — scorer needs to know which dimensions to score | |
| Ground truth notes (for calibration seed items) | **Yes during live scoring; revealed for calibration debrief** | Prevents rater training from contaminating live scores |

### Blinding implementation:

- Scoring interface presents: scenario prompt + model response + active_dimensions list + rubric reference
- Model name and provider are **never included** in the scoring interface
- Multiple model responses for the same scenario are presented in random order, never labeled by model
- Scorers submit scores independently before seeing any other scorer's scores

---

## 3. Dual-Scorer Process — Step by Step

### Step 0: Setup (per scoring session)
1. Scorer reads the scenario prompt.
2. Scorer reads the model response in full before scoring any dimension.
3. Scorer notes initial holistic impression (internal — not submitted): "Does this response make contact with the person?" This anchors dimension scores to overall quality.

### Step 1: Dimension-by-dimension scoring

For each active dimension listed for the scenario:

1. **Read the dimension anchor** in RUBRIC_v0.md.
2. **Identify evidence:** Quote or paraphrase the specific part of the response relevant to this dimension.
3. **Check for disqualifying failure modes:** Scan the Failure Mode Quick Reference. If a cap-triggering failure mode is present, apply the cap first — this determines the maximum possible score.
4. **Assign score 1–4** using the behavioral anchors. Assign from the anchors, not from the holistic impression.
5. **Write a one-sentence reasoning statement** explaining the score. The reasoning must reference specific evidence from the response, not a restatement of the rubric.
6. **Note failure modes present** (even if they don't cap the score).

### Step 2: Submission

Scorer submits dimension scores, evidence quotes, reasoning statements, and failure modes observed. Submission is final before seeing the co-scorer's scores.

### Step 3: Reconciliation

After both scorers have submitted:

1. **No disagreement (scores match):** Score is accepted. Record as agreed.
2. **Adjacent disagreement (|score_A - score_B| = 1):** Average the scores (use mean, retain as a non-integer in the data — e.g., 2.5). Flag for calibration review if this dimension consistently produces adjacent disagreements.
3. **Nonadjacent disagreement (|score_A - score_B| ≥ 2):** **Mandatory reconciliation.** Both scorers discuss the specific disagreement, referencing rubric anchors and evidence. If agreement is reached, record the agreed score. If not resolved, escalate to adjudication (see Step 4).
4. **Reconciliation note:** Record the discussion outcome — which rubric anchor resolved it, or why it remained unresolved.

### Step 4: Adjudication (nonadjacent disagreements only)

1. A third scorer (the "adjudicator") scores the item independently, without seeing scorer A or B's scores.
2. Adjudicator's score is presented to A and B.
3. Majority rule (2-of-3) determines the final score.
4. The adjudication pattern is logged — if the same dimension consistently requires adjudication, the rubric anchor for that dimension is flagged for revision at v1.

### Step 5: Aggregate score computation

```
per_item_aggregate = mean(all dimension scores for this item)
```

This mean is the item's score for that model response. Report to 2 decimal places.

Do not compute aggregate before reconciliation is complete.

---

## 4. Krippendorff's Alpha — Computation and Targets

### Why Krippendorff's Alpha, not Cohen's Kappa

Cohen's Kappa applies to two raters scoring nominal categories. Krippendorff's Alpha (α) is appropriate here because:
- Scores are ordinal (1–4 with meaningful order)
- More than two raters are involved in calibration rounds
- Partial disagreements (adjacent scores) should be penalized less than full disagreements

Use the **ordinal distance function** when computing α: `delta²(i,j) = (v_i - v_j)²` where v_i and v_j are score values.

### Computation

Use the `krippendorff` Python library or equivalent:

```python
import krippendorff
import numpy as np

# reliability_data: shape (n_raters, n_items)
# Each cell: rater's score for that item, or np.nan if not scored
alpha = krippendorff.alpha(reliability_data, level_of_measurement='ordinal')
```

For production use, compute α per dimension, per pillar, and overall.

### Targets and interpretation

| α value | Interpretation | Action |
|---|---|---|
| α ≥ 0.80 | Strong agreement | Dimension is well-calibrated; proceed |
| 0.70 ≤ α < 0.80 | Acceptable agreement | **Publication-minimum target.** Proceed with monitoring |
| 0.60 ≤ α < 0.70 | Marginal agreement | Rubric anchor revision needed before proceeding; run second calibration round |
| α < 0.60 | Inadequate agreement | Dimension rubric must be substantially revised; do not use in production scoring |

**Primary target:** Overall α ≥ 0.70 across all dimensions on the 30-item calibration set.

**Dimension-level minimum:** No individual dimension may have α < 0.60 in production scoring. Dimensions below this threshold are suspended from scoring until revised.

**Publication requirement:** Published results must report α per dimension and overall. α values below 0.70 for any active dimension must be disclosed with the limitation note.

### Reporting format

```yaml
inter_rater_agreement:
  method: "Krippendorff's Alpha (ordinal)"
  calibration_set_size: 30
  rater_count: [n]
  overall_alpha: [0.00]
  per_dimension:
    S1: [0.00]
    S2: [0.00]
    S3: [0.00]
    S4: [0.00]
    E1: [0.00]
    E2: [0.00]
    E3: [0.00]
    E4: [0.00]
    E5: [0.00]
    SP1: [0.00]
    SP2: [0.00]
    SP3: [0.00]
    SP4: [0.00]
    CC1: [0.00]
    CC2: [0.00]
    CC3: [0.00]
    CC4: [0.00]
    CC5: [0.00]
    CC6: [0.00]
    CC7: [0.00]
  dimensions_below_threshold: [list]
  calibration_date: [ISO date]
```

---

## 5. Calibration Loop — 30–50 Seed Items

### Purpose

Calibration serves two functions:
1. **Train scorers** to apply the rubric consistently
2. **Validate the rubric** — if scorers consistently disagree on a dimension after training, the rubric anchor is the problem, not the scorers

### Seed Set Composition (30 items minimum, 50 preferred)

Select seed items to cover:

| Criterion | Target |
|---|---|
| All three pillars represented | ≥ 8 items per pillar |
| All four difficulty levels represented | ≥ 5 per difficulty level |
| All major failure modes represented | At least 2 examples of each major failure mode |
| All score levels represented | ≥ 6 items per score level (1, 2, 3, 4) |
| At least one item per active dimension | All 20 dimensions covered |
| Boundary cases (3-vs-2, 4-vs-3) are over-represented | ≥ 40% of seed items are boundary cases |

Seed items include `ground_truth_notes` specifying:
- The expected score for each active dimension
- Which rubric anchor determines the score
- The key discriminating feature (what makes it a 3 not a 4, what makes it a 2 not a 3)
- Common wrong answers and why they're wrong

**Ground truth for seed items is established by:** Jatin (lead annotator) + at least one independent domain expert, achieving personal agreement before using as calibration material. Ground truth should be treated as defeasible — if calibration reveals consistent scorer disagreement even after training, the ground truth may need revision.

### Calibration Round Procedure

**Round 1 — Independent scoring (no training):**
1. Scorers receive 30 seed items with rubric document only (no ground truth notes)
2. Score all 30 items independently
3. Compute α across scorers for each dimension
4. Identify dimensions with α < 0.70 and items with highest disagreement

**Calibration debrief (group session, 90–120 min):**
1. Walk through the 5–8 items with highest disagreement (not all 30)
2. For each: scorers share their score and reasoning; ground truth notes are revealed; rubric anchor is applied
3. Focus discussion on the 3-vs-2 distinction — this is where most disagreement concentrates
4. Rubric maintainer (Jatin) updates rubric language in RUBRIC_v0.md where calibration reveals ambiguity
5. "What does a 3 look like vs. a 2?" is the primary discussion question for each dimension

**Round 2 — Re-scoring (post-debrief):**
1. Scorers re-score the 30 seed items (or a fresh 20-item subset) independently
2. Compute α again
3. If α ≥ 0.70 overall and no dimension < 0.60: calibration complete — proceed to production
4. If α still < 0.70: identify remaining disagreement clusters, revise rubric, run Round 3

**Maximum calibration rounds before rubric escalation:** 3 rounds. If α < 0.70 after Round 3 on any dimension, that dimension's anchor must be substantially rewritten before proceeding.

### LLM Judge Calibration

After human calibration is complete:

1. Run the LLM judge (at temperature 0.0) on the 30-item calibration set
2. Compute Pearson correlation between LLM judge scores and human ground truth scores, per dimension
3. **Target:** ≥ 0.70 correlation per dimension before LLM judge is used in production
4. Where correlation is below 0.70: revise the judge prompt for that dimension (see Section 6); re-run
5. Publish judge prompt version alongside results

---

## 6. LLM-as-Judge Protocol

### Structure (G-Eval chain-of-thought approach)

Each judge prompt follows this structure (Liu et al. 2023, G-Eval):

```
[System prompt — see below]

You are scoring a model's response to a human sharing something real.

SCENARIO PROMPT:
{scenario_prompt}

MODEL RESPONSE:
{model_response}

DIMENSION TO SCORE: {dimension_name}

CONSTRUCT DEFINITION:
{dimension_construct_definition}

STEP 1 — POSITIVE MARKERS:
List any observable evidence in the response that demonstrates this dimension well.
Quote specific words or phrases from the response.
If no positive markers are present, state "none observed."

STEP 2 — FAILURE MODES:
Check for the following failure modes relevant to this dimension:
{failure_mode_list_for_dimension}
For each: is it present? Provide a quote if yes.

STEP 3 — 3 VS 2 DISCRIMINATION:
Apply the following test: Is the failure (if present) notable enough that the person would feel 
meaningfully misheard or misdirected? Or is it a minor issue where the core contact was made?
Notable failure → score 2 or lower. Minor issue but contact made → score 3.

STEP 4 — SCORE:
Assign a score from 1 to 4 using the anchors below.
[behavioral anchors for this dimension]

IMPORTANT:
- Score based on the evidence you identified, not on the response's length or fluency.
- A short, present response that makes specific contact scores higher than a long, fluent response that misses the person.
- Do not award bonus points for elaborate responses that "sound good."
- If a disqualifying failure mode is present, apply the score cap before assigning a score.

Output format (JSON only, no other text):
{
  "positive_markers_observed": ["..."],
  "failure_modes_present": ["..."],
  "three_vs_two_reasoning": "...",
  "score": [1, 2, 3, or 4],
  "score_reasoning": "..."
}
```

**System prompt for all judge calls:**
```
You are an expert evaluator trained to score responses in the SES benchmark.
You score only the specific dimension named. You do not score overall quality.
The model name and provider are never provided to you. You score only what is in the response.
You must complete all reasoning steps before assigning a score.
A response that sounds good but misses the person scores lower than a response that is less fluent but makes genuine contact.
```

### Per-Dimension Judge Prompts

Each dimension has a dedicated judge prompt file at `eval/judge_prompts/{dimension_id}.txt`.
The judge prompt includes:
- The construct definition (exact text from RUBRIC_v0.md)
- The behavioral anchors (exact text from RUBRIC_v0.md)
- The failure mode list for that dimension
- The 3-vs-2 discrimination test
- One positive example and one negative example (few-shot, drawn from calibration seed items)

### Bias Mitigations

| Bias | Mitigation |
|---|---|
| **Verbosity bias** (longer = scored higher) | All judge prompts explicitly state: "length is not quality; short, present responses at high emotional weight score 4." One short-scoring-4 example in every judge prompt. |
| **Self-enhancement bias** (model scores its own outputs higher) | Model name is never included in judge prompt. Two independent judge runs per item (same prompt, different API calls). Average the two scores; flag when two runs disagree by >1 point. |
| **Sycophantic drift** (judge agrees with what sounds good) | Chain-of-thought failure mode check (Step 2) before score assignment forces judge to identify failures before scoring. |
| **Position bias** (in pairwise: first response preferred) | All single-response scoring; pairwise comparison not used in primary scoring protocol. If pairwise is used for validation, alternate order and average. |
| **Anchoring** | Judge does not see other judges' scores before scoring. Two runs are averaged, not averaged-after-comparison. |

### Two-Run Averaging Rule

Every judge call is run twice at temperature 0.0. If the two runs agree (same score): record that score. If they differ by 1: average (e.g., runs 2 and 3 → record 2.5). If they differ by ≥ 2: flag for human review; do not use LLM score for that item.

```python
def adjudicate_two_runs(score_run_1: int, score_run_2: int) -> float | None:
    diff = abs(score_run_1 - score_run_2)
    if diff == 0:
        return float(score_run_1)
    elif diff == 1:
        return (score_run_1 + score_run_2) / 2.0
    else:
        return None  # Flag for human review
```

---

## 7. Quality Gates

Before any results are published:

### Gate 1 — Calibration complete
- [ ] At least 2 human scorers have completed calibration
- [ ] Krippendorff's Alpha ≥ 0.70 on 30-item seed set
- [ ] No dimension has Alpha < 0.60
- [ ] Calibration report written and saved to `results/calibration_report.md`

### Gate 2 — LLM judge validated (required only if LLM-as-judge is used in production)
- [ ] LLM judge ≥ 0.70 correlation with human scores on calibration set, per dimension
- [ ] Judge prompt version pinned in `eval/config.yaml`
- [ ] Two-run averaging rule implemented and tested
- [ ] Model name blinding confirmed (model name does not appear in any judge prompt)

### Gate 3 — Config pinned
- [ ] `eval/config.yaml` specifies: temperature, top-p, max_tokens, system prompt, judge model name + version
- [ ] All evaluation scripts read from config, not hardcoded
- [ ] Model version logging active in result files

### Gate 4 — Item quality checked
- [ ] Content validity ratio computed on pilot items (3 raters confirm item belongs to assigned pillar/difficulty)
- [ ] No items with CVR < 0.67 (i.e., fewer than 2 of 3 raters agree on assignment) in production set
- [ ] Private test split (30% of items) is NOT committed to public repo

### Gate 5 — Results review
- [ ] Confidence intervals computed and reported alongside all accuracy/score claims
- [ ] Failure mode frequency table generated
- [ ] Contamination check: canary string analysis run for any model scoring ≥ 90% on any pillar
- [ ] Jatin reviews leaderboard before publish

---

## 8. Edge Cases and Adjudication Guidance

### 8a — Multiple failure modes in one response

Apply all caps that are triggered. The most severe cap determines the score floor.
If two caps conflict (e.g., one dimension caps at 1, another at 2), the stricter cap applies.

**Example:** Response contains both pathologizing (cap at 1 for SP2) and performed empathy (cap at 2 for E2). On SP2: score is 1 (pathologizing cap). On E2: score is at most 2. These are separate dimension scores and do not compound.

### 8b — Positive markers co-occurring with failure modes

Positive markers do not "cancel" disqualifying failure modes. A response that pathologizes AND contains warm, specific language scores 1 on SP2. The warmth raises it slightly within the capped range only — from "score 1 with no positive markers" to "score 1" (same; the cap is an absolute maximum for that dimension).

Exception: For score-2-cap failure modes, if the failure is mild and significant positive markers are present, scorer may award a 2 (not below). The cap sets the ceiling, not the floor. A response with a mild score-2-cap failure mode and strong positive markers scores 2; a response with a severe score-2-cap failure mode and no positive markers also scores 2.

### 8c — Ambiguous or underspecified tradition items

If the scorer lacks sufficient tradition knowledge to evaluate SP1 accurately:
1. Flag the item for specialist review — do not score SP1
2. Record the flag in the scoring record
3. Item does not contribute to SP1 aggregate until specialist score is added

Items flagged for specialist review should not delay scoring of other dimensions — score all other active dimensions normally and leave SP1 blank.

### 8d — Very short responses

A one-sentence response can score 4 on multiple dimensions if it makes genuine, specific contact. Do not penalize brevity. Apply CC7 (Silence and Spaciousness) favorably to short, present responses at high emotional weight. The question is not "is it long enough?" but "does it make contact?"

### 8e — Responses that are entirely safe but entirely unhelpful

A response that avoids all failure modes by saying nothing substantive ("I hear that this is difficult. What would you like to talk about?") does not score 4. Score by positive markers present, not absence of failure modes. A response with no failure modes and no positive markers scores 2 on most dimensions.

### 8f — Multi-turn scenarios

Score each turn separately. The sequence of turns is relevant for:
- E3/CC5 (Premature Advice): if advice is given in turn 1 before attunement is established, score 2 on E3 for turn 1, even if attunement comes in turn 2
- E2/CC2 (Pacing): pacing must be appropriate at each turn; a good turn-3 does not retroactively fix a rushed turn-1
- E5/CC6 (Tolerance of Ambivalence): if resolution pressure is applied in turn 2 after good holding in turn 1, score turn 2 separately

Report per-turn scores for multi-turn scenarios and note the pattern in the aggregate.

---

## 9. Annotator Agreement Tracking

Maintain a running agreement log throughout production scoring:

```yaml
agreement_log:
  total_items_scored: 0
  total_adjacent_disagreements: 0
  total_nonadjacent_disagreements: 0
  total_adjudications: 0
  adjudication_rate: 0.00  # nonadjacent_disagreements / total_items_scored
  dimensions_with_highest_nonadjacent_rate:
    - dimension: [ID]
      rate: [0.00]
  last_updated: [ISO date]
```

**Target:** Nonadjacent disagreement rate < 15% per dimension in production scoring. If a dimension exceeds 15%, trigger a mini-calibration session on that dimension before continuing.

---

## 10. Version History and Maintenance

This protocol is versioned alongside RUBRIC_v0.md. When the rubric is revised (v0 → v1), this protocol is also reviewed.

**Protocol changes that require a new calibration round:**
- Rubric anchor revision for any dimension
- Change in score cap rules
- Addition of a new dimension
- Change in the dual-scorer reconciliation process

**Protocol changes that do not require new calibration:**
- Judge prompt wording improvements that do not change behavioral anchors
- Addition of edge case guidance
- Bug fixes in scoring record format

---

*SCORING_PROTOCOL v0.1 — Stream C output. Companion to RUBRIC_v0.md. Calibration loop should begin as soon as 30 seed items with ground truth notes are available from item writing streams.*
