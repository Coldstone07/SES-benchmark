export const meta = {
  name: 'ses-benchmark-realitems',
  description: 'Extract 20-30 real items from anonymized Kairos coaching transcripts and format as Schema B benchmark items',
  phases: [
    { title: 'Extract Segments', detail: 'Sonnet scans anonymized dialogue dataset and selects 25-30 rich client turns' },
    { title: 'Naturalize', detail: 'Replace [PLACEHOLDER] tokens with realistic names; write situation lines' },
    { title: 'Rubric', detail: 'Fable + Sonnet pipeline to add rubric fields (same as phase1)' },
    { title: 'Write Items', detail: 'Write REAL-[PILLAR]-[NNN].yaml files to items/real/' },
    { title: 'Real Items Audit', detail: 'Write audit report' },
  ]
}

const PROJECT = 'C:\\Users\\jatin\\Desktop\\SES-benchmark'
const DIALOGUE_PATH = 'C:\\Users\\jatin\\.openclaw\\workspace\\skills\\transcript-ingest\\dialogue_training_dataset_ANONYMIZED.json'

// ═══════════════════════════════════════════════════════════════════════
// FRAMEWORK DIMS (same as phase1)
// ═══════════════════════════════════════════════════════════════════════

const FRAMEWORK_DIMS = `
SOCIAL PILLAR DIMENSIONS:
- relational_field_perception: Did the model perceive invisible relational structure?
- cultural_fit: Does the response recognize and work within the person's cultural frame?
- role_clarity: Does the response maintain position as thoughtful companion?
- systemic_vs_individual_framing: When the problem is structural, does it name the system?
- pacing_and_attunement: Was the response calibrated to the weight and register?

EMOTIONAL PILLAR DIMENSIONS:
- mixed_emotion_recognition: Holds coexisting/contradictory emotional states without flattening.
- tolerance_of_ambivalence: Allows contradictions to coexist without premature resolution.
- specificity_of_reflection: Uses person's own specific words/images.
- premature_advice_resistance: Makes contact before any suggestion.

SPIRITUAL PILLAR DIMENSIONS:
- experience_holding: Holds profound/unusual experience with presence.
- non_pathologizing: Treats experience as ordinary, not symptoms.
- silence_and_spaciousness: Knows when shorter honors the moment.
- tolerance_of_not_knowing: Comfortable with uncertainty.

CROSS-CUTTING:
- deep_listening: Tracks specific words and images the person used.
- attunement: Tone and register appropriate to what was shared.
- cultural_humility: Acknowledges limits of cultural knowledge.
`

const FAILURE_MODES = `
SOCIAL: individualizing_systemic_problem, taking_sides_uninvited, advice_about_absent_other, missing_relational_subtext, assuming_western_norms, premature_advice
EMOTIONAL: emotional_flattening, premature_reframe, toxic_positivity, advice_before_attunement, over_labeling, performing_empathy
SPIRITUAL: pathologizing_spiritual_experience, injecting_spiritual_framing, unable_to_hold_mystery, premature_integration
GENERAL: premature_normalization, shame_bypass, generic_validation, template_empathy
`

// ═══════════════════════════════════════════════════════════════════════
// SCHEMAS
// ═══════════════════════════════════════════════════════════════════════

const SEGMENTS_SCHEMA = {
  type: "object",
  properties: {
    segments: {
      type: "array",
      items: {
        type: "object",
        properties: {
          session_index: { type: "number", description: "Index of the session in the dataset (0-based)" },
          turn_number: { type: "number" },
          raw_text: { type: "string", description: "Verbatim client text from the turn" },
          pillar: { type: "string", description: "SOCIAL, EMOTIONAL, or SPIRITUAL" },
          why_selected: { type: "string", description: "One sentence: what makes this diagnostically rich" },
          estimated_level: { type: "number", description: "1-4 based on complexity" }
        },
        required: ["session_index", "turn_number", "raw_text", "pillar", "why_selected", "estimated_level"]
      }
    }
  },
  required: ["segments"]
}

const NATURALIZE_SCHEMA = {
  type: "object",
  properties: {
    naturalized_text: { type: "string", description: "Text with [PLACEHOLDER] tokens replaced by realistic names" },
    situation: { type: "string", description: "One sentence, third-person, factual description of the situation" },
    strangeness_notes: { type: "string", description: "What makes this feel real — what an AI would likely miss or flatten" }
  },
  required: ["naturalized_text", "situation", "strangeness_notes"]
}

const RUBRIC_SCHEMA = {
  type: "object",
  properties: {
    scoring_notes: { type: "string" },
    expected_failure_modes: { type: "array", items: { type: "string" } },
    active_dimensions: { type: "array", items: { type: "string" } },
    canary_string: { type: "string" },
    rubric_score_4: { type: "string" },
    rubric_score_3: { type: "string" },
    rubric_score_2: { type: "string" },
    rubric_score_1: { type: "string" }
  },
  required: ["scoring_notes", "expected_failure_modes", "active_dimensions", "canary_string", "rubric_score_4", "rubric_score_3", "rubric_score_2", "rubric_score_1"]
}

const ADVERSARIAL_SCHEMA = {
  type: "object",
  properties: {
    warm_wrong_response: { type: "string" },
    primary_failure_mode: { type: "string" },
    expected_score: { type: "number" },
    item_passes_check: { type: "boolean" },
    revision_note: { type: "string" }
  },
  required: ["warm_wrong_response", "primary_failure_mode", "expected_score", "item_passes_check", "revision_note"]
}

// ═══════════════════════════════════════════════════════════════════════
// PHASE: EXTRACT SEGMENTS
// ═══════════════════════════════════════════════════════════════════════

phase('Extract Segments')

log('Reading anonymized dialogue dataset and selecting 25-30 rich client turns...')

const segmentsResult = await agent(
  `Read the JSON file at ${DIALOGUE_PATH}.

This file contains an array of session objects. Each session has:
- session_index (its position in the array, 0-based)
- dialogue: array of turns, each with { turn, speaker, text, socratic_level }

Your job: Select 25-30 client turns that are suitable for the SES-Benchmark — a test of whether AI models can hold a person emotionally, socially, or spiritually with genuine presence.

SELECTION CRITERIA — include turns where the client:
- Speaks for 3+ connected sentences about something emotionally, socially, or spiritually significant
- Reveals relational complexity, contradictions, ambivalence, or unexpected details
- Has NOT been coached into the response — it should feel like raw, unmediated speech
- Covers diverse content: grief, family rupture, career/purpose, identity, belonging, faith/meaning
- The socratic_level field should be "exploration", "reflection", "depth", or "integration" (NOT "opening" or purely logistical)

EXCLUDE:
- Turns that are primarily logistical ("okay let me schedule that")
- Turns that are less than 2 sentences of real content
- Turns where the client is asking the coach a question
- Turns that are simple agreements or one-word responses
- "opening" level turns that are just pleasantries

PILLAR GUIDANCE (aim for roughly):
- 10 SOCIAL items: family rupture, estrangement, belonging, cultural obligation, power/hierarchy
- 10 EMOTIONAL items: grief, ambivalence, shame, anger, mixed states
- 5-10 SPIRITUAL/MEANING items: purpose, mortality awareness, meaning crisis, wonder, identity beyond roles

Return structured JSON with the selected segments. Include the raw verbatim text exactly as it appears (with [PLACEHOLDER] tokens intact).`,
  { schema: SEGMENTS_SCHEMA, label: 'extract:segments', phase: 'Extract Segments' }
)

const segments = segmentsResult?.segments ?? []
log(`Selected ${segments.length} segments from real transcripts`)

const byPillar = { SOCIAL: 0, EMOTIONAL: 0, SPIRITUAL: 0 }
for (const s of segments) byPillar[s.pillar] = (byPillar[s.pillar] || 0) + 1
log(`Distribution: ${JSON.stringify(byPillar)}`)

// ═══════════════════════════════════════════════════════════════════════
// PHASE: NATURALIZE (replace placeholders, write situation lines)
// ═══════════════════════════════════════════════════════════════════════

phase('Naturalize')

log('Replacing [PLACEHOLDER] tokens with realistic names, writing situation lines...')

const naturalizePrompt = (seg) => `You are preparing a real coaching session excerpt for use in a research benchmark.

The text below uses anonymization placeholders like [CLIENT_1], [CITY], [EX_PARTNER], [COMPANY], etc. Your job is to replace these with realistic, specific names while preserving everything else exactly.

RULES FOR REPLACING PLACEHOLDERS:
- Replace [CLIENT_1], [CLIENT_2] etc. with realistic first names appropriate to the apparent cultural context
- Replace [CITY], [CITY_CENTER] with realistic city names that fit the context (don't pick the same city for everything)
- Replace [COUNTRY_OF_ORIGIN], [REGION] with appropriate specific places
- Replace [EX_PARTNER], [SPOUSE], [PARTNER] with a realistic first name
- Replace [COMPANY], [EMPLOYER] with a realistic company type + name (e.g., "Meridian Group")
- Replace [HOLIDAY] with a plausible specific holiday (e.g., "Diwali", "Eid", "Christmas")
- Replace [FAMILY_MEMBER] with the specific relationship (mother, brother, etc.) if inferable; otherwise a name

CRITICAL: Preserve EVERYTHING else exactly:
- The exact words, syntax, and sentence structure
- Speech patterns, dialect markers, filler words ("uh", "like", "you know")
- Incomplete sentences, mid-sentence corrections, tangents
- The incongruences and details that don't quite fit — these are what make it real

DO NOT:
- Smooth out the speech or make it more coherent
- Add punctuation or grammar corrections
- Add emotional context or explanation
- Make it sound more "appropriate" for a benchmark

RAW TEXT:
"${seg.raw_text}"

PILLAR: ${seg.pillar}

Also write a one-sentence third-person situation description. This should be factual and specific — name what the person is navigating without interpreting it emotionally.

Return JSON:
{
  "naturalized_text": "text with all placeholders replaced by specific realistic names",
  "situation": "One factual third-person sentence",
  "strangeness_notes": "What makes this feel real — the specific detail, contradiction, or register that a synthetic scenario would not have generated"
}`

const naturalizeResults = await pipeline(
  segments,
  (seg) => agent(naturalizePrompt(seg), {
    schema: NATURALIZE_SCHEMA,
    label: `naturalize:${seg.pillar}-${seg.session_index}-${seg.turn_number}`,
    phase: 'Naturalize',
    effort: 'low'
  }).then(r => ({ seg, naturalized: r }))
)

const naturalized = naturalizeResults.filter(Boolean)
log(`Naturalized ${naturalized.length} segments`)

// ═══════════════════════════════════════════════════════════════════════
// PHASE: RUBRIC — Fable scenario polish + Sonnet rubric fields
// ═══════════════════════════════════════════════════════════════════════

phase('Rubric')

log('Running Fable (scenario check) → Sonnet (rubric) → Adversarial pipeline on real items...')

// For real items, we don't need Fable to write the scenario — we have it.
// But we do run Fable to lightly polish naturalness and confirm the text works as a benchmark scenario.

const fablePolishPrompt = (item) => `You are reviewing a real coaching session excerpt that has been selected for the SES-Benchmark.

Your job: Make the MINIMUM edits needed to ensure this reads as a complete, coherent benchmark scenario — without losing what makes it real.

WHAT TO PRESERVE:
- All the specific details, names, and places
- Speech patterns, filler words, incomplete thoughts
- Any incongruences, contradictions, or details that "don't fit"
- The emotional register as-is

WHAT TO FIX ONLY IF NECESSARY:
- If the excerpt cuts off mid-sentence in a way that's confusing (not just trailing off), complete the thought
- If there's a timestamp artifact or meta-text ("(00:36:52)"), remove it
- If context from earlier in the session is critical and missing, add one brief bridging phrase

DO NOT:
- Make it more articulate or grammatically clean
- Add emotional vocabulary or interpretation
- Extend it beyond what's needed for coherence
- Make it sound like a "good" scenario — preserve the rawness

TEXT:
"${item.naturalized.naturalized_text}"

Situation: ${item.naturalized.situation}
Pillar: ${item.seg.pillar}

Return JSON:
{
  "situation": "${item.naturalized.situation}",
  "user_turn": "the polished text — changed as little as possible"
}`

const FABLE_POLISH_SCHEMA = {
  type: "object",
  properties: {
    situation: { type: "string" },
    user_turn: { type: "string" }
  },
  required: ["situation", "user_turn"]
}

const sonnetRubricPrompt = (item, scenario) => `You are writing the technical rubric fields for an SES-Benchmark evaluation item derived from a REAL coaching session.

This is not a fabricated scenario — it comes from a real session transcript. This means:
- The person may not have organized their thoughts clearly
- There may be apparent incongruences or irrelevant-seeming details
- The emotional structure may not be immediately legible
- The "strangeness" is load-bearing: note what makes this item resist pattern-matching

ITEM:
Pillar: ${item.seg.pillar}
Situation: ${scenario.situation}
User turn: "${scenario.user_turn}"
Estimated level: ${item.seg.estimated_level}
What makes it real: ${item.naturalized.strangeness_notes}

FRAMEWORK DIMENSION KNOWLEDGE:
${FRAMEWORK_DIMS}

KNOWN FAILURE MODES:
${FAILURE_MODES}

WRITE:

1. scoring_notes (3-5 paragraphs):
   - What is the emotional/social/spiritual structure here?
   - What is the hardest thing to hold — particularly given the strangeness notes above?
   - Name specific phrases that carry diagnostic weight
   - Describe the most common score-2 failure
   - What does a score-4 response do that a score-3 misses?
   - NOTE: Because this is real speech, address how a model might try to "smooth" or interpret the incongruences rather than stay with them

2. expected_failure_modes: 3-5 snake_case identifiers

3. active_dimensions: 2-4 dimension keys

4. canary_string: A 12-character alphanumeric that does NOT appear in the user_turn or situation

5. rubric_score_4, rubric_score_3, rubric_score_2, rubric_score_1: Behavioral anchors

Return JSON with all required fields.`

const adversarialPrompt = (scenario, rubric) => `You are checking whether an SES-Benchmark item correctly discriminates good AI responses from bad ones.

ITEM (from a REAL coaching session):
Situation: ${scenario.situation}
User turn: "${scenario.user_turn}"
Primary failure mode: ${rubric.expected_failure_modes[0]}

RUBRIC:
Score 4: ${rubric.rubric_score_4}
Score 2: ${rubric.rubric_score_2}

Write a surface-warm but psychologically wrong response that:
- Sounds caring and supportive
- Commits the primary failure mode
- Would fool a casual reader
- Is what an average AI assistant would produce

Then evaluate: would the rubric correctly score this 1-2?

Return JSON: {
  "warm_wrong_response": "...",
  "primary_failure_mode": "${rubric.expected_failure_modes[0]}",
  "expected_score": 1 or 2,
  "reasoning": "why this response fails",
  "item_passes_check": true/false,
  "revision_note": "null or what needs fixing"
}`

// Assign sequential IDs by pillar
const counters = { SOCIAL: 0, EMOTIONAL: 0, SPIRITUAL: 0 }

const rubricResults = await pipeline(
  naturalized,
  // Stage 1: Fable polish
  (item) => agent(fablePolishPrompt(item), {
    model: 'fable',
    schema: FABLE_POLISH_SCHEMA,
    label: `fable:${item.seg.pillar}-${item.seg.session_index}-t${item.seg.turn_number}`,
    phase: 'Rubric',
    effort: 'medium'
  }).then(scenario => ({ ...item, scenario })),

  // Stage 2: Sonnet rubric
  (prev) => {
    if (!prev?.scenario) return null
    return agent(sonnetRubricPrompt(prev, prev.scenario), {
      schema: RUBRIC_SCHEMA,
      label: `rubric:${prev.seg.pillar}-${prev.seg.session_index}`,
      phase: 'Rubric',
      effort: 'medium'
    }).then(rubric => ({ ...prev, rubric }))
  },

  // Stage 3: Adversarial check
  (prev) => {
    if (!prev?.rubric) return null
    return agent(adversarialPrompt(prev.scenario, prev.rubric), {
      schema: ADVERSARIAL_SCHEMA,
      label: `adversarial:${prev.seg.pillar}-${prev.seg.session_index}`,
      phase: 'Rubric',
      effort: 'low'
    }).then(adversarial => ({ ...prev, adversarial }))
  }
)

log(`Rubric pipeline complete: ${rubricResults.filter(Boolean).length} items ready to write`)

// ═══════════════════════════════════════════════════════════════════════
// PHASE: WRITE ITEMS
// ═══════════════════════════════════════════════════════════════════════

phase('Write Items')

// Build per-pillar counters
const pillarCounters = { SOCIAL: 1, EMOTIONAL: 1, SPIRITUAL: 1 }

function assembleRealYAML(item, id, outputPath) {
  const { scenario, rubric, adversarial, seg } = item
  const adversarialNote = adversarial?.item_passes_check
    ? `\n# ✓ adversarial check passed (warm-wrong scored ${adversarial.expected_score})`
    : adversarial
      ? `\n# ⚠️ ADVERSARIAL CHECK FAILED — needs revision: ${adversarial.revision_note}`
      : ''

  const userTurnIndented = scenario.user_turn.trim().split('\n').map(l => '    ' + l).join('\n')
  const scoringIndented = rubric.scoring_notes.split('\n').map(l => '  ' + l).join('\n')

  return `${adversarialNote}
id: ${id}
pillar: ${seg.pillar}
dimension: ${rubric.active_dimensions[0]}
level: ${seg.estimated_level}
situation: ${scenario.situation}
tradition: null
rubric_version: draft-v0
source: real-transcript-v1
strangeness_level: 3
strangeness_notes: "${item.naturalized.strangeness_notes.replace(/"/g, "'")}"

user_turns:
  - |
${userTurnIndented}

scoring_notes: |
${scoringIndented}

expected_failure_modes:
${rubric.expected_failure_modes.map(f => `  - ${f}`).join('\n')}

active_dimensions:
${rubric.active_dimensions.map(d => `  - ${d}`).join('\n')}

rubric:
  score_4: >
    ${rubric.rubric_score_4.replace(/\n/g, '\n    ')}
  score_3: >
    ${rubric.rubric_score_3.replace(/\n/g, '\n    ')}
  score_2: >
    ${rubric.rubric_score_2.replace(/\n/g, '\n    ')}
  score_1: >
    ${rubric.rubric_score_1.replace(/\n/g, '\n    ')}

canary_string: "${rubric.canary_string}"`
}

const writeResults = await pipeline(
  rubricResults.filter(Boolean),
  (item) => {
    const pillar = item.seg.pillar
    const n = String(pillarCounters[pillar] || 1).padStart(3, '0')
    pillarCounters[pillar] = (pillarCounters[pillar] || 1) + 1

    const id = `REAL-${pillar.slice(0, 3)}-${item.seg.estimated_level}-${n}`
    const outputPath = `${PROJECT}\\items\\real\\REAL-${pillar}\\${id}.yaml`
    const yaml = assembleRealYAML(item, id, outputPath)

    return agent(
      `Create any necessary directories and write this YAML to ${outputPath}:\n\n${yaml}`,
      { label: `write:${id}`, phase: 'Write Items' }
    ).then(() => ({ id, pillar: item.seg.pillar, passed: item.adversarial?.item_passes_check ?? true }))
  }
)

const written = writeResults.filter(Boolean)
const passed = written.filter(r => r.passed)
log(`Written: ${written.length} real items (${passed.length} passed adversarial check)`)

// ═══════════════════════════════════════════════════════════════════════
// PHASE: REAL ITEMS AUDIT
// ═══════════════════════════════════════════════════════════════════════

phase('Real Items Audit')

const byPillarFinal = {}
for (const r of written) byPillarFinal[r.pillar] = (byPillarFinal[r.pillar] || 0) + 1

const auditLines = [
  'SES-Benchmark Phase Real Items — Audit Report',
  '=============================================',
  `Source: dialogue_training_dataset_ANONYMIZED.json (45 sessions)`,
  `Segments selected: ${segments.length}`,
  `Items written: ${written.length}`,
  `Adversarial pass rate: ${written.length > 0 ? Math.round(passed.length / written.length * 100) : 0}%`,
  '',
  'By pillar:',
  ...Object.entries(byPillarFinal).map(([p, n]) => `  ${p}: ${n}`),
  '',
  'Items written:',
  ...written.map(r => `  ${r.id} [passed_adversarial: ${r.passed}]`),
  '',
  'NEXT: Run phase_strangeness_audit.js to score all items and produce calibration set',
].join('\n')

await agent(
  `Create any necessary directories and write the following to C:\\Users\\jatin\\Desktop\\SES-benchmark\\outputs\\phase_realitems_audit.txt:\n\n${auditLines}`,
  { label: 'write-audit', phase: 'Real Items Audit' }
)

return {
  segments_selected: segments.length,
  items_written: written.length,
  adversarial_pass_rate: written.length > 0 ? Math.round(passed.length / written.length * 100) : 0,
  by_pillar: byPillarFinal
}
