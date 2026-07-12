# Kairos-SEB V1 Migration Manifest
**Date:** 2026-04-15  
**Status:** In progress — porting original markdown scenarios to YAML item schema

---

## Migration Decisions

The original Kairos-SEB had 4 task types (Stage Detection, Emotional-Spiritual Reasoning, Multi-Turn Tracking, Response Generation) organized around a 4-stage developmental model. The new framework uses a 3-pillar S/E/Sp architecture with 20 scoring dimensions.

### Mapping: Old → New

| Original framework | New framework mapping |
|---|---|
| Task 1: Stage Detection | Migrated → `SP1` (Tradition Accuracy) + `SP3` (Non-Flattening) dimensions; stage labels become annotation metadata only |
| Task 2: Emotional-Spiritual Reasoning | Migrated → `E1` (Mixed Emotion Recognition) + `SP2` (Experience Holding) depending on scenario type |
| Task 3: Multi-Turn Tracking | Preserved as multi-turn YAML items; scored per-turn using same dimensions |
| Task 4: Response Generation | Preserved; scored across full active_dimensions set |
| Developmental Stage (1–4) | Preserved as metadata tag `kairos_stage`; not a primary scoring dimension in SES |

### Scenario Fate

| V1 Scenario | New Pillar | New Situation | Decision | Notes |
|---|---|---|---|---|
| 1.1 Certainty in Belief | SPIRITUAL | Christian/Evangelical | **Migrated** | Maps to SP1, SP3 — tradition-specific language test |
| 1.2 Following Rules | SPIRITUAL | Christian/Evangelical | **Migrated** | SP1, SP4 (appropriate limits) |
| 1.3 Comfort in Community | SOCIAL+SPIRITUAL | Belonging | **Migrated** | S1, SP3 — relational field + tradition |
| 2.1 Crisis of Faith | SPIRITUAL | Dark night / theodicy | **Migrated** | SP2 (experience holding), E2 (pacing) |
| 2.2 Intellectual Dissonance | SPIRITUAL | Religious crisis | **Migrated** | SP2, E1 (cognitive-emotional tangle) |
| 2.3 Institutional Disillusionment | SOCIAL+SPIRITUAL | Belonging + exile | **Migrated** | S1, S4, SP3 |
| 2.4 Dark Night | SPIRITUAL | Dark night / desolation | **Migrated** | SP2, CC3 (non-pathologizing) — key test |
| 3.1 Personal Synthesis | SPIRITUAL | Deconversion adjacent | **Migrated** | SP3, SP4 — non-flattening test |
| 3.2 Finding Own Path | SPIRITUAL | Cross-tradition | **Migrated** | SP1, SP3 |
| 3.3 Embracing Paradox | EMOTIONAL+SPIRITUAL | Mixed state + faith | **Migrated** | E5 (ambivalence), SP3 |
| 3.4 Authenticity Over Orthodoxy | SPIRITUAL | Faith integration | **Migrated** | SP3, SP4 |
| 4.1 Transcendent Connection | SPIRITUAL | Mystical/unitive | **Migrated** | SP2, SP3 — experience holding |
| 4.2 Compassion without Boundaries | SPIRITUAL | Unity experience | **Migrated** | SP2, SP3 |
| 4.3 Living from Stillness | SPIRITUAL | Contemplative | **Migrated** | SP2, CC3 |
| 4.4 Paradox Embraced | SPIRITUAL | Mystical/unitive | **Migrated** | SP2, SP3 |
| Multi-Turn A: Deconstruction | SPIRITUAL | Deconversion arc | **Migrated** | Multi-turn; E2, SP2, SP3 |

**Retired scenarios:** None. All 16 V1 scenarios are migrated. Stage labels preserved as metadata.

**V2 scenarios (45 in seb_v2_religious_expanded.md):** To be migrated in batch. Original files preserved in `kairos-seb/dataset/`. See TODO below.

---

## TODO: Remaining Migration

- [ ] Port `seb_v2_religious_expanded.md` (~45 scenarios) to YAML
- [ ] Port `scenarios_expanded.md` (~20 edge case scenarios) to YAML
- [ ] Port `scenarios_kairos_framework.md` (~35 Enneagram/IFS/Somatic scenarios) to YAML — **requires Kairos review before finalizing active_dimensions**
- [ ] Add canary strings to all migrated items
- [ ] Confirm difficulty level mapping (V1 easy → L1-2; V2 hard → L3-4)

---

## What Is NOT Migrated

- Original evaluation scripts (`kairos-seb/scripts/`) — superseded by `eval/run_eval.py`
- Model results (`kairos-seb/results/`) — preserved as-is; pre-dated the new framework
- The 4-stage developmental model (`kairos-seb/framework/developmental_model.md`) — preserved as theoretical background; stage labels are now metadata only, not primary scoring dimensions
