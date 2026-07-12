export const meta = {
  name: 'ses-benchmark-phase1b-incongruence',
  description: 'Retroactively inject one incongruent element into each of the 114 generated items to break pattern-matching',
  phases: [
    { title: 'Discover Items', detail: 'Find all generated social + spiritual secular YAML files' },
    { title: 'Inject Incongruence', detail: 'Fable agent adds one strange element per item; rewrite YAML in-place' },
    { title: 'Incongruence Audit', detail: 'Write audit report: what was added per item' },
  ]
}

const PROJECT = 'C:\\Users\\jatin\\Desktop\\SES-benchmark'

// ═══════════════════════════════════════════════════════════════════════
// SCHEMAS
// ═══════════════════════════════════════════════════════════════════════

const ITEM_READ_SCHEMA = {
  type: "object",
  properties: {
    id: { type: "string" },
    pillar: { type: "string" },
    dimension: { type: "string" },
    level: { type: "number" },
    situation: { type: "string" },
    user_turn: { type: "string", description: "The text inside user_turns[0]" },
    source: { type: "string" },
    output_path: { type: "string", description: "The full file path that was read" }
  },
  required: ["id", "pillar", "dimension", "level", "situation", "user_turn", "output_path"]
}

const INCONGRUENCE_SCHEMA = {
  type: "object",
  properties: {
    user_turn: { type: "string", description: "Revised scenario text with one incongruent element woven in" },
    incongruence_type: { type: "string", description: "Label: dark_humor | defends_betrayer | flat_affect_shift | irrelevant_true_detail | contradicts_self | wants_opposite | calm_about_devastation | detail_doesnt_fit_arc" }
  },
  required: ["user_turn", "incongruence_type"]
}

// ═══════════════════════════════════════════════════════════════════════
// PROMPT
// ═══════════════════════════════════════════════════════════════════════

function incongruencePrompt(item) {
  return `You are revising a benchmark scenario for the SES-Benchmark — a test of whether AI models can hold a person with genuine presence.

This scenario was written to test a specific dimension. The problem: it's too coherent. Every detail serves the expected emotional arc, which means a model can score well by recognizing the archetype rather than genuinely perceiving this person.

Your job: Add ONE incongruent element that makes the scenario feel stranger and more real — without breaking it.

WHAT "INCONGRUENT" MEANS (pick whichever fits most naturally):
- dark_humor: The person laughs or makes a dry joke mid-sentence about something devastating
- defends_betrayer: They express warmth or loyalty toward the person who hurt them
- flat_affect_shift: One sentence drops to flat, factual affect when you'd expect emotional language
- irrelevant_true_detail: They include a specific detail that seems off-topic but is clearly real
- contradicts_self: They contradict something they said earlier without noticing or acknowledging it
- wants_opposite: They want something the situation suggests they shouldn't (e.g., wants advice when the rubric tests holding; feels relief about something they should grieve)
- calm_about_devastation: They are visibly calm or analytical about something that should be shattering
- detail_doesnt_fit_arc: A concrete detail doesn't match the emotional narrative in a way that feels real

RULES:
- Change as FEW words as possible — weave in one thing, don't rewrite
- The change must feel like it was always there, not bolted on
- The primary dimension being tested must still be detectable
- The item must still be scoreable — don't destroy the rubric
- Do NOT announce the incongruence ("I know this sounds strange, but...")
- Do NOT add meta-commentary ("I've been thinking about this")
- The incongruence should raise a question a model must notice, not explain itself

EXISTING SCENARIO:
Situation: ${item.situation}
User turn: "${item.user_turn}"

PRIMARY DIMENSION BEING TESTED: ${item.dimension}
LEVEL: ${item.level} (L1-2 = accessible complexity; L3-4 = embedded, the complexity is in the subtext)

Return JSON:
{
  "user_turn": "revised text with one incongruent element woven in — no longer than 20% more words than original",
  "incongruence_type": "one of the labels above"
}`
}

// ═══════════════════════════════════════════════════════════════════════
// PHASE: DISCOVER ITEMS
// ═══════════════════════════════════════════════════════════════════════

phase('Discover Items')

log('Finding all generated social + spiritual secular YAML files...')

const FILE_LIST_SCHEMA = {
  type: "object",
  properties: {
    files: { type: "array", items: { type: "string" }, description: "Full absolute paths to each YAML file" }
  },
  required: ["files"]
}

const [socialFiles, spiritualFiles] = await parallel([
  () => agent(
    `List all .yaml files recursively inside C:\\Users\\jatin\\Desktop\\SES-benchmark\\items\\social\\ and return their full absolute paths as { "files": ["path1", "path2", ...] }`,
    { schema: FILE_LIST_SCHEMA, label: 'list:social-files', phase: 'Discover Items' }
  ),
  () => agent(
    `List all .yaml files inside C:\\Users\\jatin\\Desktop\\SES-benchmark\\items\\spiritual\\secular\\ and return their full absolute paths as { "files": ["path1", "path2", ...] }`,
    { schema: FILE_LIST_SCHEMA, label: 'list:spiritual-files', phase: 'Discover Items' }
  )
])

const allFiles = [
  ...(socialFiles?.files ?? []),
  ...(spiritualFiles?.files ?? [])
]

log(`Found ${allFiles.length} items to process (${socialFiles?.files?.length ?? 0} social, ${spiritualFiles?.files?.length ?? 0} spiritual secular)`)

// ═══════════════════════════════════════════════════════════════════════
// PHASE: INJECT INCONGRUENCE
// Pipeline: read YAML → Fable incongruence → rewrite YAML in-place
// ═══════════════════════════════════════════════════════════════════════

phase('Inject Incongruence')

log('Pipeline: Read YAML → Fable incongruence → Rewrite YAML in-place')

// Stage 1: Read YAML and extract the fields we need
const stageRead = (filePath) => agent(
  `Read the YAML file at ${filePath}. Extract: id, pillar, dimension, level, situation, and the text content of the first element in the user_turns list (this is a multi-line block scalar starting with "  - |"). Return as JSON with output_path set to "${filePath}".`,
  { schema: ITEM_READ_SCHEMA, label: `read:${filePath.split('\\').pop()}`, phase: 'Inject Incongruence' }
).then(item => ({ item, filePath }))

// Stage 2: Fable writes the incongruent revision
const stageIncongruence = (prev, filePath) => {
  if (!prev?.item) return null
  return agent(incongruencePrompt(prev.item), {
    model: 'fable',
    schema: INCONGRUENCE_SCHEMA,
    label: `incongruence:${prev.item.id}`,
    phase: 'Inject Incongruence',
    effort: 'medium'
  }).then(result => ({ ...prev, result }))
}

// Stage 3: Rewrite the YAML file in-place, updating user_turns and metadata
const stageRewrite = (prev, filePath) => {
  if (!prev?.result) return null
  const { item, result } = prev

  const newUserTurn = result.user_turn.trim()
  const userTurnIndented = newUserTurn.split('\n').map(l => '    ' + l).join('\n')

  const rewriteInstruction = `Read the YAML file at ${filePath}.

Make these exact changes:
1. Find the "user_turns:" block and replace its content (the text after "  - |") with this new text:
${userTurnIndented}

2. Find the "source:" line and change its value to "generated-fable-v1-incongruenced"

3. After the "source:" line, add this new line (if not already present):
strangeness_level: 2

4. After the "rubric_version:" line, add this new line (if not already present):
incongruence_type: ${result.incongruence_type}

Write the modified content back to the same file at ${filePath}. Preserve all other fields exactly.`

  return agent(rewriteInstruction, {
    label: `rewrite:${item.id}`,
    phase: 'Inject Incongruence'
  }).then(() => ({
    id: item.id,
    filePath,
    incongruence_type: result.incongruence_type,
    original_turn: item.user_turn,
    revised_turn: result.user_turn
  }))
}

const results = await pipeline(
  allFiles,
  stageRead,
  stageIncongruence,
  stageRewrite
)

const succeeded = results.filter(Boolean)
log(`Incongruence injected: ${succeeded.length} of ${allFiles.length} items`)

// Tally by type
const typeCounts = {}
for (const r of succeeded) {
  typeCounts[r.incongruence_type] = (typeCounts[r.incongruence_type] || 0) + 1
}
log('Incongruence types used: ' + JSON.stringify(typeCounts))

// ═══════════════════════════════════════════════════════════════════════
// PHASE: INCONGRUENCE AUDIT
// ═══════════════════════════════════════════════════════════════════════

phase('Incongruence Audit')

const auditLines = [
  'SES-Benchmark Phase 1b — Incongruence Injection Audit',
  '======================================================',
  `Items processed: ${allFiles.length}`,
  `Items succeeded: ${succeeded.length}`,
  `Items failed: ${allFiles.length - succeeded.length}`,
  '',
  'Incongruence type distribution:',
  ...Object.entries(typeCounts).map(([k, v]) => `  ${k}: ${v}`),
  '',
  'Per-item detail:',
  ...succeeded.map(r => `  ${r.id} [${r.incongruence_type}]`),
  '',
  'NEXT: Run phase_realitems.js to add 20-30 real transcript items (strangeness_level: 3)',
  'THEN: Run phase_strangeness_audit.js to score all items and produce calibration set',
].join('\n')

await agent(
  `Create any necessary directories and write the following audit report to C:\\Users\\jatin\\Desktop\\SES-benchmark\\outputs\\phase1b_incongruence_audit.txt:\n\n${auditLines}`,
  { label: 'write-audit', phase: 'Incongruence Audit' }
)

return {
  items_processed: allFiles.length,
  items_incongruenced: succeeded.length,
  type_distribution: typeCounts,
  failed_items: results.filter(r => !r).length
}
