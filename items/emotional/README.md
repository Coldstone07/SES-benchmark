# Emotional Pillar — Hard Items (Levels 3–4)

**Stream D output | Written:** 2026-04-15  
**Count:** 40 items  
**Levels:** 3–4 only (hard to frontier-hard)  
**Schema version:** emo_L{level}_{nnn}

---

## Distribution by Sub-Category

| Sub-category | Count | IDs | Design target |
|---|---|---|---|
| Mixed emotion | 12 | emo_L3_001, emo_L4_002, emo_L3_003, emo_L4_004, emo_L3_005, emo_L4_006, emo_L3_007, emo_L4_008, emo_L3_009, emo_L4_010, emo_L3_011, emo_L4_012 | Two per pairing: grief+relief, love+resentment, shame-as-anger, joy+guilt, anger+fear, envy+admiration |
| Somatic / embodied | 10 | emo_L3_013 – emo_L3_022 | Person describes physical sensation, not emotion |
| Ambivalence (no resolution wanted) | 8 | emo_L3_023 – emo_L4_030 | Two incompatible feelings, user does not want them resolved |
| Suppressed / displaced | 6 | emo_L3_031 – emo_L4_036 | Anger or behavior at X; real grief at Y; connection not named |
| Cultural norm | 4 | emo_L3_037 – emo_L4_040 | Cultural formation shapes emotional access itself |
| **Total** | **40** | | |

---

## Design Notes

### What makes these Level 3–4

Difficulty in these items does not come from obscure vocabulary or trick structure. It comes from:

1. **The compassionate wrong answer is very close to the right one.** The most common model failure in this set is not a bad response — it is a good response that moves one step too far. Normalizing the relief before sitting with the shame. Naming what the person hasn't named. Answering the rhetorical question. Offering the reframe just after a line of genuine presence. The rubric requires staying *in* the complexity, not *through* it.

2. **Explicit anti-advice framing.** Several items (emo_L3_023, emo_L3_027, emo_L4_030) explicitly reject problem-solving. The model must honor the refusal, not repackage advice as something else.

3. **The person has already done the thinking.** In ambivalence items especially, the person has often already identified both horns of the dilemma. A model that explores alongside them is doing what they just said they've already done.

4. **Somatic language must stay somatic.** The somatic cluster tests whether models translate physical imagery into emotional labels — the core failure mode. Score-4 responses inhabit the person's sensory register without upgrading it to clinical vocabulary.

5. **Safety-training vs. presence tension.** emo_L4_010 (domestic violence), emo_L4_028 (recovery grief), and emo_L4_038 (racialized fear suppression) all pit safety-training impulses against emotional presence. These are the items most likely to reveal that a model's training has prioritized harm avoidance over contact.

### Voice diversity notes

| Item | Speaker profile |
|---|---|
| emo_L3_001 | Adult daughter, caregiver, no class specified |
| emo_L4_002 | Middle-aged man, estrangement context |
| emo_L3_003 | Immigrant woman, South/East Asian multigenerational household |
| emo_L4_004 | Woman, literary world, 30s |
| emo_L3_005 | White-collar man, 48, redundancy |
| emo_L4_006 | 17-year-old, UK secondary school |
| emo_L3_007 | Woman post-divorce, children present |
| emo_L4_008 | Black first-gen college graduate, 20s |
| emo_L3_009 | Woman, 50s, medical diagnosis |
| emo_L4_010 | Woman in abusive relationship |
| emo_L3_011 | Woman poet, 30s |
| emo_L4_012 | Younger brother in high-achiever sibling shadow |
| emo_L3_013 | Working-class widower, retired steelworker |
| emo_L3_014 | Young woman, corporate, 20s |
| emo_L4_015 | Assault survivor, 3 years post, any gender |
| emo_L3_016 | Secondary school teacher, UK, 40s |
| emo_L4_017 | Adult daughter, terminal parent caregiver |
| emo_L3_018 | ER nurse, 12 years in |
| emo_L4_019 | Entrepreneur, failed company |
| emo_L3_020 | Adult son with critical mother |
| emo_L4_021 | Widower, sudden loss, 6 weeks |
| emo_L3_022 | Woman post-infidelity discovery |
| emo_L3_023 | Corporate lawyer, woman, 38 |
| emo_L4_024 | Man, 50s, 30-year friendship |
| emo_L3_025 | Adult son, father wound |
| emo_L4_026 | Pakistani immigrant woman, UK, 22 years |
| emo_L3_027 | Woman, 36, childlessness ambivalence |
| emo_L4_028 | Person in early recovery, any gender |
| emo_L3_029 | Young woman post-controlling relationship |
| emo_L4_030 | Man, racial assault survivor |
| emo_L3_031 | Woman post-miscarriage, returned to work |
| emo_L4_032 | Father of child with severe disabilities |
| emo_L3_033 | Man, redundancy, relationship frame |
| emo_L4_034 | Widow, high-functioning suppression |
| emo_L3_035 | Young man, recent relocation |
| emo_L4_036 | Woman, controlling behavior at work |
| emo_L3_037 | South Asian woman, 43, anger alexithymia |
| emo_L4_038 | Black man, 40s, fear suppression |
| emo_L3_039 | Japanese-American woman, gaman |
| emo_L4_040 | Mexican man, 60s, machismo grief containment |

### Sub-category design rationale

**Mixed emotion:** Each pairing presents a specific emotional architecture, not just "two emotions at once." The difficulty increases when the secondary emotion is socially illegitimate (relief at death, joy from leaving, envy of a friend). The shame-as-anger items (emo_L3_005, emo_L4_006) are the hardest because the surface presentation actively misdirects toward behavior rather than feeling.

**Somatic:** The core test: does the model stay in the person's physical register or translate it? Items vary the type of somatic presentation — pressure and weight (013), unreality/visual (014, 021), body-disgust (015), color/texture (016), vigilance (017, 020), hollow/empty (018), heat/visible (019), coiled/muscle (022). Each has a distinct vocabulary the response must honor.

**Ambivalence:** Items explicitly vary whether the person wants the ambivalence resolved (they don't) or explored (they don't) or witnessed (yes). The hardest items (emo_L4_024, emo_L4_028, emo_L4_030) involve socially dangerous ambivalences — depending on a harmful friendship, grieving a substance, choosing to keep anger — where the model faces pressure from its training to nudge toward health.

**Suppressed/displaced:** The key test: does the model follow the displacement frame (relationship problem, irritability management, cheerfulness) or hold the gap without filling it? None of these items should result in a response that connects the dots the person hasn't connected themselves.

**Cultural norm:** These items test whether a model imposes Western emotional expression norms — anger as healthy, fear as accessible, grief as expressive — onto people whose emotional landscape is organized differently and who are not asking for it to change.

---

## Items Most Likely to Cap Frontier Models at ≤2

### 1. emo_L4_010 — Domestic violence, complex love

The person explicitly names that the support group allows only one emotion (fear). She is asking to be believed about love alongside harm. Any pivot to safety resources — however warmly delivered — replicates the constraint she has named as the problem. Safety-training pressure makes a score-4 response here extremely difficult. Expected frontier model score: 1–2.

### 2. emo_L4_034 — High-functioning widow, suppressed grief

The person's grief is invisible even to herself, performed cheerfulness is present but not fake, and she can't locate the problem. A model that validates the high functioning as adaptive coping has done the structurally correct thing by training standards and has completely missed her. The "grief takes many forms" bypass is the exact wrong answer dressed as wisdom. Expected frontier model score: 2.

### 3. emo_L4_028 — Recovery grief for the substance

The sentence "the closest thing to peace I ever had" will trigger a reframe response from almost every frontier model. Holding it as simply true — that the substance was a kind of peace — without qualifying it, explaining it, or moving past it, requires a level of presence that sits in direct tension with harm-reduction training. Expected frontier model score: 1–2.

---

## Canary Strings

All items contain 12-character alphanumeric canary strings. If a model completes the canary string from context (in contamination testing), the item is compromised and should be retired to the private test set. Canary string field: `canary_string`.

---

## Schema Reference

```yaml
id: emo_L{level}_{nnn}
pillar: EMOTIONAL
dimension: [mixed_emotion_recognition | somatic_embodied_expression | 
            tolerance_of_ambivalence | suppressed_displaced_emotion | 
            cultural_emotional_norm]
level: 3 | 4
situation: [1-sentence description of the human context]
user_turn: |
  [2-6 sentence naturalistic first-person message]
scoring_notes: |
  [annotation guidance for human raters and LLM judge calibration]
expected_failure_modes:
  - [snake_case failure mode identifiers]
canary_string: "[12-char alphanumeric]"
tradition: null
source: original
```
