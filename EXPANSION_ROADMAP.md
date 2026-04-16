# SES Benchmark — Expansion Roadmap
**Version:** 0.1 (Planning)  
**Date:** 2026-04-15  
**Prerequisite reading:** SES_FRAMEWORK.md, ASSESSMENT.md

---

## Starting Point

The current benchmark has ~116 scenarios, all written under the original Kairos-SEB framing (4-stage spiritual development). The assessment found:
- Statistically insufficient for model ranking (12-item comparisons, ±24% CI)
- Emotional and social dimensions absent as structured categories
- Spiritual pillar present but thin on situation diversity and tradition depth
- No human ground truth for Tasks 2–4
- No contamination controls

The roadmap below prioritizes fixing these in the right order.

---

## Phase 0 — Foundation (Before New Scenarios)

*Do this before writing a single new scenario. Otherwise we're building on unstable ground.*

### 0a. Lock the evaluation harness
- Pin model name, temperature (suggest 0.0 for reproducibility), top-p, system prompt, and max_tokens in all scripts
- Create `eval/config.yaml` that stores these values — scripts read from it
- Add model version logging to all result files (timestamp, exact model ID, config used)

### 0b. Create dev/test split
- Move 30 existing V2 scenarios to `dataset/dev/` (public, for practice and development)
- Move remaining existing scenarios to `dataset/test_private/` (not published, used only for official runs)
- New scenarios follow the same split: 70% dev, 30% private test
- **Private test set is never committed to the public repo**

### 0c. Establish annotation protocol
- Write `ANNOTATION_GUIDE.md` — explains the 1–4 scale, each dimension, worked examples with scores, common disagreements and resolutions
- Identify 3–5 annotators with cross-tradition depth (not one-tradition specialists only)
- Run a calibration round on 20 items; compute Cohen's Kappa; target >0.75 before proceeding
- Publish Kappa in results

### 0d. Establish human baseline
- Have annotators *respond* to 30 scenarios as if they were the model
- Score those human responses using the same rubric
- This is the ceiling we are measuring models against

**Deliverables:** `eval/config.yaml`, `ANNOTATION_GUIDE.md`, initial Kappa report, human baseline scores  
**Estimated items touched:** 0 new scenarios — all existing

---

## Phase 1 — Emotional Pillar Expansion (Priority 1)

*Start here because: (a) emotion is most universal — no tradition knowledge required to write or evaluate; (b) it reveals the biggest gap in frontier models; (c) it anchors the cross-cutting competencies that apply to all three pillars.*

### Target: 120 Emotional items

| Situation | Easy (L1–2) | Hard (L3–4) | Total |
|-----------|------------|------------|-------|
| Grief and loss | 10 | 8 | 18 |
| Shame and self-condemnation | 8 | 8 | 16 |
| Ambivalence and stuck-ness | 8 | 10 | 18 |
| Anger and its complications | 8 | 8 | 16 |
| Fear and avoidance | 6 | 6 | 12 |
| Numbing and disconnection | 6 | 8 | 14 |
| Mixed states (explicit contradictions) | 4 | 12 | 16 |
| Somatic/body-language emotional expression | 4 | 6 | 10 |
| **Total** | **54** | **66** | **120** |

### Key design principles for Emotional items
- **Hard items (L3–4) are the priority.** Easy items mostly exist to calibrate raters and provide baselines; hard items drive discrimination across frontier models.
- **Mixed states are the hardest.** Write at least 12 items where two emotionally incompatible feelings are *both* explicitly present or strongly implied. E.g.: relief at a parent's death after a long illness; love for someone who abused you; pride in an achievement that came at moral cost.
- **Somatic expression items:** Person uses body language to describe feeling ("I feel like I'm underwater," "there's a stone in my chest," "I can't feel my own hands"). Model must meet the somatic language without immediately translating it into emotion labels.
- **No tradition context required** for these items — tradition can be present but is not what the item is testing.

### Scoring dimensions for Emotional items
All items scored on:
1. **Mixed emotion recognition** — identified the coexisting states without collapsing them
2. **Pacing and attunement** — response matched the weight of what was shared
3. **Premature advice/reframe resistance** — did not move to solutions before contact
4. **Specificity of reflection** — tracked the person's actual words, not a generic paraphrase
5. **Tolerance of ambivalence** — held contradictions open rather than resolving them

---

## Phase 2 — Social Pillar (Priority 2)

*Builds on Emotional competencies but adds the relational field. Requires some cultural knowledge but less tradition-specific depth than Spiritual.*

### Target: 90 Social items

| Situation | Easy (L1–2) | Hard (L3–4) | Total |
|-----------|------------|------------|-------|
| Estrangement (family, community, religious) | 8 | 8 | 16 |
| Betrayal and rupture | 6 | 8 | 14 |
| Power and hierarchy | 6 | 8 | 14 |
| Belonging and exile | 6 | 8 | 14 |
| Caretaking and burden | 4 | 6 | 10 |
| Cultural obligation and identity | 4 | 8 | 12 |
| Relational grief (non-death) | 4 | 6 | 10 |
| **Total** | **38** | **52** | **90** |

### Key design principles for Social items
- **Cultural variation is structural, not cosmetic.** Don't write a "generic estrangement" and then add a cultural tag. Write the estrangement from inside the cultural logic — what can be said, what cannot be said, what the community expects, what the person fears.
- **The relational field is always present even when unnamed.** Hard items: the person describes something that sounds personal but is deeply relational — the relational structure is not stated and the model must perceive it.
- **Collectivist vs. individualist orientation.** Several items should be written from within collectivist cultural frames (South Asian, East Asian, Middle Eastern, African, Latin American) where "setting boundaries" or "your own needs first" would be culturally inappropriate advice.
- **Power is rarely named.** Hard items: person describes a dynamic (workplace, family, religious community) where power asymmetry is structuring what they can do, but they don't name it as such.

### Scoring dimensions for Social items
1. **Relational field perception** — sensed the invisible structure, not just the surface content
2. **Cultural fit** — response is appropriate to the person's cultural context, not universalized
3. **Role clarity** — stayed as companion, not mediator, judge, or advocate for the absent person
4. **Systemic vs. individual framing** — recognized when the problem is structural/relational, not individual
5. **Pacing and attunement** (shared with Emotional)

---

## Phase 3 — Spiritual Pillar Expansion (Priority 3)

*Builds on what exists. Key gap: tradition depth and personal experience scenarios.*

### Target: 120 Spiritual items (adds to existing ~45 V2 religious scenarios)

| Category | Items |
|----------|-------|
| **Tradition engagement** | |
| — Christian (contemplative, evangelical, Orthodox, pastoral) | 16 |
| — Buddhist (Theravada, Zen, Tibetan, secular) | 14 |
| — Hindu (Bhakti, Vedanta, Tantra, Yoga) | 12 |
| — Islamic (Sunni, Sufi, progressive) | 12 |
| — Jewish (Orthodox, Reform, Hasidic, Kabbalistic) | 12 |
| — Indigenous / diasporic / shamanic | 10 |
| — Taoist | 8 |
| — Secular / humanist / existentialist | 10 |
| — Kairos frameworks (Gene Keys, Enneagram, IFS, Sushumna) | 16 |
| **Subtotal tradition** | **110** |
| **Profound personal experiences** | |
| — Mystical / unitive experience | 8 |
| — Kundalini / spiritual emergence | 6 |
| — Near-death experience | 4 |
| — Dark night / spiritual desolation | 8 |
| — Deconversion / faith loss | 8 |
| — Psychedelic with spiritual content | 4 |
| — Visionary / prophetic | 4 |
| — Other (conversion, possession, ancestral) | 8 |
| **Subtotal experiences** | **50** |
| **Cross-tradition and edge cases** | |
| — Person navigating two traditions simultaneously | 8 |
| — Person whose tradition conflicts with their experience | 6 |
| — Spiritual bypassing (person doing it — model must not reinforce) | 6 |
| **Subtotal cross-tradition** | **20** |
| **Grand total new Spiritual items** | **180** |
| Combined with existing V2 (~45) | **~225 total Spiritual** |

*Note: 180 new is aspirational across multiple writing rounds. Initial priority: 60 new Spiritual items covering high-impact gaps (profound experiences, Kairos frameworks, underrepresented traditions).*

### Key design principles for Spiritual items
- **Speak inside the tradition, not about it.** An evangelical Christian and a Christian mystic use different language for the same doctrine. A Theravada Buddhist and a Tibetan Buddhist frame suffering differently. Write from within.
- **Profound experiences are the hardest to hold.** Write 6–8 items per experience type with rubrics that explicitly address: what pathologizing looks like, what bypassing looks like, what genuine presence looks like.
- **Kairos frameworks as their own tradition cluster.** Gene Keys siddhi/shadow/gift language, Enneagram triads and disintegration lines, IFS Self-energy vs. parts — these need their own scenario set at depth, not just passing references.
- **Do not test theological knowledge.** Test whether the model can be present with someone who is *living* within a tradition, not whether it can define terms. The difference: "fana means annihilation in God" (knowledge) vs. being present with someone saying "I feel like I'm disappearing and I don't know if that's the path or if I'm losing my mind" (presence).

### Scoring dimensions for Spiritual items
1. **Tradition accuracy** — language, concepts, orientation are correct for this tradition
2. **Experience holding** — didn't pathologize, bypass, or dismiss the experience
3. **Non-flattening** — didn't collapse the tradition into generic spirituality
4. **Appropriate limits** — didn't offer theological interpretation as if clergy or guru
5. **Attunement** (shared with Emotional, Social)

---

## Phase 4 — Mixed Pillar Items

*The hardest scenarios combine all three pillars — a person presenting something that is simultaneously socially complex, emotionally layered, and spiritually weighted.*

### Target: 30 Mixed items

Examples of what "mixed" looks like:
- A gay man raised in a conservative Muslim family, now in a heterosexual marriage, experiencing a mystical encounter during prayer — SOCIAL (family system, cultural expectation) + EMOTIONAL (love, shame, fear, relief) + SPIRITUAL (Islamic frame, mystical experience, identity and faith)
- A woman whose father just died who was both her abuser and her spiritual teacher — SOCIAL (power, role, rupture) + EMOTIONAL (grief, anger, relief, love, guilt simultaneously) + SPIRITUAL (how does she now hold the teachings?)
- A person mid-deconversion from a tight-knit evangelical community, watching their marriage strain — SOCIAL (community exile, relational rupture) + EMOTIONAL (grief, liberation, terror) + SPIRITUAL (losing the whole world-frame at once)

These items are scored across all applicable dimensions from all three pillars. They are the hardest items in the benchmark and the most revealing about model capability.

---

## Total Target Item Count

| Pillar | Existing | Phase Target | Grand Total |
|--------|----------|-------------|-------------|
| Social | 0 | 90 | 90 |
| Emotional | 0 | 120 | 120 |
| Spiritual | ~116 (all forms) | +60 priority / +180 full | ~175–295 |
| Mixed | 0 | 30 | 30 |
| **Total** | **~116** | **+300–420** | **~415–535** |

**Practical first milestone:** 300 total items (90 Social + 120 Emotional + 60 Spiritual + 30 Mixed), with Phase 0 foundation in place. This is sufficient for statistically meaningful model ranking (CI ±11% at 80 items per pillar, 50% accuracy).

---

## Evaluation Harness Requirements

The current `evaluate.py` covers Task 1 (classification) well and Tasks 2–4 partially. The expanded benchmark needs:

### Judge prompt (LLM-as-judge)
- Separate judge prompt per scoring dimension (not one monolithic prompt)
- Judge receives: the person's statement, the dimension being scored, the rubric for that dimension, the model response
- Judge does NOT receive: other dimensions' rubrics, the model's name, or the expected answer
- Temperature 0.0 for judge runs
- Run each judge call twice and average scores; flag when calls disagree by >1 point

### Per-tradition evaluation
- Spiritual scenarios tagged by tradition
- Results reported per-tradition so tradition-specific gaps are visible

### Failure mode classifier
- Lightweight classifier that detects the main failure modes (pathologizing, bypassing, premature advice, flattening, tradition error) in a response
- Reports failure mode frequency per model, not just aggregate score

### Evaluation script updates needed
- Read scenario format from YAML (not hardcoded)
- Support per-pillar runs (`--pillar EMOTIONAL`)
- Output results in structured JSON with per-dimension, per-pillar, per-tradition breakdowns
- Log all config parameters in the result file

---

## Writing Priorities (What to Build First)

1. **Phase 0** — lock harness, create split, annotation guide. ~1–2 weeks of setup.
2. **Emotional L3–4 items (mixed states + somatic)** — highest discrimination value, easiest to write without deep tradition knowledge. Target: 40 items.
3. **Social hard items (cultural obligation + power)** — hardest to write right; need cross-cultural review. Target: 30 items.
4. **Spiritual profound experience items** — dark night, kundalini, NDE, deconversion. Target: 30 items.
5. **Kairos framework cluster** — Gene Keys, IFS at depth, Sushumna. Target: 20 items.
6. **Mixed pillar** — build these last, after single-pillar rubrics are stable. Target: 30 items.
7. **Remaining tradition coverage** — fill out Buddhist, Islamic, Jewish, Indigenous, Taoist, Secular to targets above.

---

## What Success Looks Like

A model scores well on SES if, given a real human sharing something real, it:
- **Hears what was actually said** — not what it expected to hear given the topic
- **Stays with the person** — doesn't rush to fix, teach, interpret, or resolve
- **Speaks the right language** — tradition vocabulary accurate, cultural frame honored
- **Holds complexity** — doesn't collapse contradictions, doesn't simplify the mess
- **Knows its limits** — doesn't become therapist, clergy, or guide without invitation
- **Makes the person feel less alone** — not by saying so, but by the quality of its presence

*These are the things this benchmark is trying to measure.*
