export const meta = {
  name: 'ses-benchmark-strangeness-audit',
  description: 'Score all items on ecological validity, produce two-tier calibration set, write calibration guide',
  phases: [
    { title: 'Discover All Items', detail: 'Find all YAML files across social, spiritual, emotional, boundary, and real directories' },
    { title: 'Strangeness Scoring', detail: 'Sonnet scores each item on legibility, cultural texture, and incongruence' },
    { title: 'Calibration Set', detail: 'Select 30-item calibration set: 15 legible + 15 incongruenced/real, balanced across pillars' },
    { title: 'Write Outputs', detail: 'Write strangeness_audit.json, calibration_set.json, calibration_guide.md' },
  ]
}

const PROJECT = 'C:\\Users\\jatin\\Desktop\\SES-benchmark'

// ═══════════════════════════════════════════════════════════════════════
// SCHEMAS
// ═══════════════════════════════════════════════════════════════════════

const FILE_LIST_SCHEMA = {
  type: "object",
  properties: {
    files: { type: "array", items: { type: "string" } }
  },
  required: ["files"]
}

const ITEM_READ_SCHEMA = {
  type: "object",
  properties: {
    id: { type: "string" },
    pillar: { type: "string" },
    dimension: { type: "string" },
    level: { type: "number" },
    situation: { type: "string" },
    user_turn: { type: "string" },
    active_dimensions: { type: "array", items: { type: "string" } },
    source: { type: "string" },
    strangeness_level: { type: "number", description: "1=legible/synthetic, 2=incongruenced, 3=real. 0 if field not present." },
    output_path: { type: "string" }
  },
  required: ["id", "pillar", "dimension", "level", "situation", "user_turn", "active_dimensions", "output_path"]
}

const STRANGENESS_SCHEMA = {
  type: "object",
  properties: {
    legibility_score: { type: "number", description: "1-3: how much the situation announces itself" },
    cultural_texture_score: { type: "number", description: "1-3: how embedded vs labeled the cultural specificity is" },
    incongruence_score: { type: "number", description: "1-3: 3=fully coherent arc, 1=contains genuine incongruence" },
    strangeness_score: { type: "number", description: "Average of the three scores" },
    too_clean: { type: "boolean", description: "True if strangeness_score >= 2.5" },
    flag_reason: { type: "string", description: "One sentence if too_clean, else null" },
    calibration_tier: { type: "string", description: "legible | incongruenced | real" }
  },
  required: ["legibility_score", "cultural_texture_score", "incongruence_score", "strangeness_score", "too_clean", "flag_reason", "calibration_tier"]
}

// ═══════════════════════════════════════════════════════════════════════
// STRANGENESS AUDIT PROMPT
// ═══════════════════════════════════════════════════════════════════════

function strangenessPrompt(item) {
  return `You are auditing a benchmark scenario for ecological validity — how much it resembles a real human speaking under real conditions vs. a crafted test case.

SCENARIO:
"${item.user_turn}"

Situation: ${item.situation}
Active dimensions: ${item.active_dimensions.join(', ')}
Source: ${item.source || 'unknown'}

SCORE on three criteria (1-3 each). Be genuinely discriminating — most synthetic items should score 2-3 on legibility and cultural_texture:

1. LEGIBILITY — does the emotional situation announce itself?
   3 = Fully legible. You immediately know what this is testing. The emotional arc is clear from the first sentence.
   2 = Requires some attention. The complexity is present but not immediately obvious.
   1 = Genuinely ambiguous. You'd need to sit with it. The key thing is half-hidden.

2. CULTURAL TEXTURE — how embedded is the cultural specificity?
   3 = Labels itself. The scenario explains the cultural context within the text (e.g., explicitly names "honor culture", "collectivist expectations").
   2 = Uses markers without explaining them. Uses culturally specific vocabulary or dynamics but doesn't annotate them.
   1 = Requires inside knowledge. You'd need to know this culture to catch what's happening. Nothing is explained.

3. INCONGRUENCE — does the arc have any elements that don't fit?
   3 = Fully coherent. Every detail serves the expected emotional narrative. Nothing surprises.
   2 = Slightly off. One element feels real in a way that wasn't "planned" — a specific detail, a tonal shift.
   1 = Contains a genuine incongruence. Something in it breaks the expected arc — and that's the realest thing about it.

SCORING:
strangeness_score = average of the three scores
Items with strangeness_score >= 2.5 are "too clean" — good for legibility testing, but don't test genuine presence.
Items with strangeness_score < 2.0 are "presence-grade" — they require genuine perception to hold.

CALIBRATION TIER:
- "real": source contains "real-transcript"
- "incongruenced": source contains "incongruenced"
- "legible": everything else

Return JSON with all required fields. strangeness_score must be a precise float (e.g., 2.33 not 2).`
}

// ═══════════════════════════════════════════════════════════════════════
// PHASE: DISCOVER ALL ITEMS
// ═══════════════════════════════════════════════════════════════════════

phase('Discover All Items')

log('Finding all YAML files across all item directories...')

const [socialF, spiritualSecF, emotionalF, boundaryF, realF] = await parallel([
  () => agent(`List all .yaml files recursively inside ${PROJECT}\\items\\social\\ and return as { "files": [...full paths...] }`, { schema: FILE_LIST_SCHEMA, label: 'list:social', phase: 'Discover All Items' }),
  () => agent(`List all .yaml files inside ${PROJECT}\\items\\spiritual\\secular\\ and return as { "files": [...full paths...] }`, { schema: FILE_LIST_SCHEMA, label: 'list:spiritual-sec', phase: 'Discover All Items' }),
  () => agent(`List all .yaml files inside ${PROJECT}\\items\\emotional\\ and return as { "files": [...full paths...] }`, { schema: FILE_LIST_SCHEMA, label: 'list:emotional', phase: 'Discover All Items' }),
  () => agent(`List all .yaml files inside ${PROJECT}\\items\\boundary_seeds\\ and return as { "files": [...full paths...] }`, { schema: FILE_LIST_SCHEMA, label: 'list:boundary', phase: 'Discover All Items' }),
  () => agent(`List all .yaml files recursively inside ${PROJECT}\\items\\real\\ if the directory exists, else return { "files": [] }`, { schema: FILE_LIST_SCHEMA, label: 'list:real', phase: 'Discover All Items' }),
])

const allFiles = [
  ...(socialF?.files ?? []),
  ...(spiritualSecF?.files ?? []),
  ...(emotionalF?.files ?? []),
  ...(boundaryF?.files ?? []),
  ...(realF?.files ?? []),
]

log(`Total items to audit: ${allFiles.length}`)
log(`  social: ${socialF?.files?.length ?? 0}, spiritual-sec: ${spiritualSecF?.files?.length ?? 0}, emotional: ${emotionalF?.files?.length ?? 0}, boundary: ${boundaryF?.files?.length ?? 0}, real: ${realF?.files?.length ?? 0}`)

// ═══════════════════════════════════════════════════════════════════════
// PHASE: STRANGENESS SCORING
// Pipeline: read YAML → score strangeness
// ═══════════════════════════════════════════════════════════════════════

phase('Strangeness Scoring')

log('Reading each item and scoring ecological validity...')

const stageRead = (filePath) => agent(
  `Read the YAML file at ${filePath}. Extract: id, pillar, dimension, level, situation, the text of user_turns[0] (the multi-line block after "  - |"), active_dimensions list, source field value, and strangeness_level field value (if present, else 0). Return with output_path set to "${filePath}".`,
  { schema: ITEM_READ_SCHEMA, label: `read:${filePath.split('\\').pop()}`, phase: 'Strangeness Scoring', effort: 'low' }
).then(item => item ? { item, filePath } : null)

const stageScore = (prev) => {
  if (!prev?.item) return null
  return agent(strangenessPrompt(prev.item), {
    schema: STRANGENESS_SCHEMA,
    label: `score:${prev.item.id}`,
    phase: 'Strangeness Scoring',
    effort: 'low'
  }).then(score => ({ ...prev, score }))
}

const scoredResults = await pipeline(allFiles, stageRead, stageScore)
const scored = scoredResults.filter(r => r?.score)

log(`Scored ${scored.length} items`)

// Compute stats
const avgStrangeness = scored.length > 0
  ? (scored.reduce((s, r) => s + r.score.strangeness_score, 0) / scored.length).toFixed(2)
  : 0
const tooClean = scored.filter(r => r.score.too_clean).length
const presenceGrade = scored.filter(r => r.score.strangeness_score < 2.0).length

log(`Average strangeness score: ${avgStrangeness} (lower = stranger/more real)`)
log(`Too clean (score >= 2.5): ${tooClean} items`)
log(`Presence-grade (score < 2.0): ${presenceGrade} items`)

// ═══════════════════════════════════════════════════════════════════════
// PHASE: CALIBRATION SET SELECTION
// ═══════════════════════════════════════════════════════════════════════

phase('Calibration Set')

log('Selecting 30-item calibration set: 15 legible + 15 incongruenced/real, balanced across pillars...')

// Sort into tiers
const legibleItems = scored.filter(r => r.score.too_clean).sort((a, b) => b.score.strangeness_score - a.score.strangeness_score)
const presenceItems = scored.filter(r => !r.score.too_clean).sort((a, b) => a.score.strangeness_score - b.score.strangeness_score)

// Select 15 legible: spread across pillars and levels
function selectBalanced(items, count) {
  const pillars = ['SOCIAL', 'EMOTIONAL', 'SPIRITUAL']
  const selected = []
  const perPillar = Math.floor(count / pillars.length)
  const used = new Set()

  for (const pillar of pillars) {
    const candidates = items.filter(r => r.item.pillar === pillar && !used.has(r.item.id))
    // Try to get a mix of levels
    const byLevel = {}
    for (const c of candidates) {
      const lvl = c.item.level
      if (!byLevel[lvl]) byLevel[lvl] = []
      byLevel[lvl].push(c)
    }
    let added = 0
    for (const level of [3, 4, 2, 1]) {
      if (added >= perPillar) break
      const levelItems = byLevel[level] || []
      for (const item of levelItems) {
        if (added >= perPillar) break
        if (!used.has(item.item.id)) {
          selected.push(item)
          used.add(item.item.id)
          added++
        }
      }
    }
  }
  // Fill remaining slots from any pillar
  for (const item of items) {
    if (selected.length >= count) break
    if (!used.has(item.item.id)) {
      selected.push(item)
      used.add(item.item.id)
    }
  }
  return selected.slice(0, count)
}

const calibrationLegible = selectBalanced(legibleItems, 15)
const calibrationPresence = selectBalanced(presenceItems, 15)
const calibrationSet = [...calibrationLegible, ...calibrationPresence]

log(`Calibration set: ${calibrationLegible.length} legible + ${calibrationPresence.length} presence-grade = ${calibrationSet.length} total`)

// ═══════════════════════════════════════════════════════════════════════
// PHASE: WRITE OUTPUTS
// ═══════════════════════════════════════════════════════════════════════

phase('Write Outputs')

// 1. Full strangeness audit JSON
const auditData = scored.map(r => ({
  id: r.item.id,
  pillar: r.item.pillar,
  level: r.item.level,
  source: r.item.source || 'unknown',
  strangeness_level_field: r.item.strangeness_level || 0,
  legibility_score: r.score.legibility_score,
  cultural_texture_score: r.score.cultural_texture_score,
  incongruence_score: r.score.incongruence_score,
  strangeness_score: r.score.strangeness_score,
  too_clean: r.score.too_clean,
  calibration_tier: r.score.calibration_tier,
  flag_reason: r.score.flag_reason
}))

// 2. Calibration set JSON
const calibrationData = {
  total_items: calibrationSet.length,
  legible_count: calibrationLegible.length,
  presence_count: calibrationPresence.length,
  items: calibrationSet.map((r, i) => ({
    calibration_index: i + 1,
    id: r.item.id,
    pillar: r.item.pillar,
    level: r.item.level,
    tier: r.score.calibration_tier,
    strangeness_score: r.score.strangeness_score,
    situation: r.item.situation,
    file_path: r.filePath
  }))
}

// 3. Calibration guide markdown
const calibrationGuide = `# SES-Benchmark Calibration Guide — Gate 3

## Purpose

This calibration session establishes inter-rater reliability before the rubric is locked to v1.
You will score 30 items independently, then compare with other raters to identify dimensions where
anchor descriptions are ambiguous. Items scoring Krippendorff's α < 0.6 trigger rubric revision.

## Rater Instructions

### Session setup
- Schedule 2-3 hours uninterrupted
- Complete items 1-30 in order — do not jump ahead
- Do not discuss scores with other raters until all have finished
- Score independently; consensus happens afterward

### For each item, complete TWO scores:

---

#### Score A — Rubric Score (1-4)

Read the user_turns text. Imagine you are the AI model receiving this message.
Then score: *How well would a score-4 response hold this person?* — meaning:
what would a model need to do to score 4, and how hard is that?

Actually score the **item difficulty** using the behavioral anchors in the YAML rubric field.

| Score | Meaning |
|-------|---------|
| 4 | The benchmark criterion is clearly met — a score-4 response does exactly what the rubric says |
| 3 | Adequate holding — model stays present, avoids main failure modes, misses one thing |
| 2 | Surface warmth, misses the key dynamic — the primary failure mode in action |
| 1 | Actively wrong or dismissive |

This is asking: *if you showed this item to an AI and scored its response, what would it typically get?*
L1-2 items should typically be scoreable at 3-4 by current models. L3-4 items should be harder.

---

#### Score B — Ecological Validity (1-5)

After reading the item, rate:
**"Does this scenario feel like something you could encounter in a real coaching session —
or does it feel like a test case?"**

| Score | Meaning |
|-------|---------|
| 5 | Indistinguishable from a real session. I would not have known this was synthetic. |
| 4 | Feels real. Minor markers of construction but the texture holds. |
| 3 | Feels plausible but slightly too coherent. |
| 2 | Clearly constructed. The emotional arc is too organized, the cultural markers too labeled. |
| 1 | Obviously a test case. |

This score is for validity research — it tells us how much the synthetic items proxy for real ones.
It does NOT affect an item's inclusion in the benchmark.

---

### Notes field (optional but valuable)

For any item where you hesitate between two scores, note:
- Which specific phrase or detail was the deciding factor
- What the model would need to catch to score 4
- Any cultural context you're uncertain about

---

## Calibration Set Structure

The 30 items are deliberately divided into two tiers:

**Tier 1 — Legible items (items 1-15):** These are well-constructed synthetic scenarios where the emotional arc is relatively clear. These establish a baseline for rubric interpretation.

**Tier 2 — Presence-grade items (items 16-30):** These contain deliberate incongruences, real transcript segments, or embedded complexity that resists pattern-matching. These test whether the rubric is sensitive to genuine presence vs. sophisticated pattern recognition.

Do not try to identify which tier an item belongs to — just score each one on its own terms.

---

## Post-Session Analysis

After all raters complete scoring:

1. Compute Krippendorff's α per dimension using Score A
2. Dimensions with α < 0.6 → revise behavioral anchors (rubric v0 → v1)
3. Compute Spearman correlation between Score A and Score B for all items
4. Items with high Score A but low Score B (models score high but feels fake) → presence-validity gap
5. Items with low Score A but high Score B (feels real but models score low) → diagnostic value targets

---

## Schedule

- **Gate 2 prerequisite:** Boundary seeds in items/boundary_seeds/ reviewed first (30 min, 2 raters)
- **Calibration session:** ~2.5 hours, 2-3 raters, items/calibration_set.json defines the 30 items
- **Analysis:** 1 hour after session
- **Rubric revision:** Only dimensions with α < 0.6 — targeted edits, not full rewrite
- **Lock:** rubric_version: v1 applied to all items post-calibration

---

*Generated by phase_strangeness_audit.js — ${calibrationSet.length} items selected*
*Average strangeness score: ${avgStrangeness} (lower = stranger/more real)*
*Legible tier: ${calibrationLegible.length} items | Presence tier: ${calibrationPresence.length} items*
`

const [writeAudit, writeCalSet, writeGuide] = await parallel([
  () => agent(
    `Create any necessary directories and write the following JSON to ${PROJECT}\\outputs\\strangeness_audit.json:\n\n${JSON.stringify(auditData, null, 2)}`,
    { label: 'write:strangeness-audit', phase: 'Write Outputs' }
  ),
  () => agent(
    `Create any necessary directories and write the following JSON to ${PROJECT}\\outputs\\calibration_set.json:\n\n${JSON.stringify(calibrationData, null, 2)}`,
    { label: 'write:calibration-set', phase: 'Write Outputs' }
  ),
  () => agent(
    `Create any necessary directories and write the following markdown to ${PROJECT}\\docs\\calibration_guide.md:\n\n${calibrationGuide}`,
    { label: 'write:calibration-guide', phase: 'Write Outputs' }
  ),
])

log('Outputs written: strangeness_audit.json, calibration_set.json, docs/calibration_guide.md')

return {
  total_items_audited: scored.length,
  average_strangeness_score: parseFloat(avgStrangeness),
  too_clean_count: tooClean,
  presence_grade_count: presenceGrade,
  calibration_set_size: calibrationSet.length,
  calibration_legible: calibrationLegible.length,
  calibration_presence: calibrationPresence.length
}
