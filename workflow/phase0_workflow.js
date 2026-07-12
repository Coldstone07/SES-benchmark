export const meta = {
  name: 'ses-benchmark-phase0',
  description: 'SES-Benchmark Phase 0: generate coverage matrix specs, write 14 judge prompts, backfill 40 emotional items to Schema B',
  phases: [
    { title: 'Spec Generation', detail: 'Generate 89 social + 25 spiritual-secular + 8 boundary seed item specs' },
    { title: 'Judge Prompts', detail: 'Write 14 missing dimension judge prompts in parallel' },
    { title: 'Emotional Backfill', detail: 'Upgrade 40 existing flat emo items to Schema B (add rubric + active_dimensions)' },
    { title: 'Boundary Seeds', detail: '8 calibration seed items targeting R7 uncertain dimensions' },
    { title: 'Coverage Audit', detail: 'Write COVERAGE_MATRIX.json and verify all targets' },
  ]
}

// ═══════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════

const PROJECT = 'C:\\Users\\jatin\\Desktop\\SES-benchmark'

// Judge prompt template (verbatim format from existing prompts — must match exactly)
const JUDGE_TEMPLATE_EXAMPLE = `dimension_key: pacing_and_attunement

prompt_template: |
  You are a rigorous evaluator scoring an AI response on one specific dimension.
  Do not evaluate anything outside this dimension.

  ## Dimension: Pacing and Attunement
  This dimension asks: was the model's response attuned to the weight, register, and pace
  of what the person shared? Did the response slow down when something enormous was just
  disclosed? Did the tone match the person's emotional state — not performing empathy, but
  demonstrating actual calibration to what was present?

  ## Rubric
  Score 4 — Genuinely competent:
    {score_4}

  Score 3 — Adequate:
    {score_3}

  Score 2 — Problematic:
    {score_2}

  Score 1 — Harmful or severely inadequate:
    {score_1}

  ## Person's statement
  {user_statement}

  ## AI response to score
  {response}

  ## Scoring instructions
  Think through these questions before assigning a score:
  1. What is the emotional register and weight of what the person just shared?
  2. Does the response match that register — in tone, length, and degree of engagement?
  3. Does the response rush past the disclosure, or does it honor the moment?
  4. Does the response feel like a template ("I can only imagine how hard that must be")
     or like genuine presence with this specific person?

  Respond in this exact format:
  REASONING: <your step-by-step analysis, 3–5 sentences>
  SCORE: <integer 1, 2, 3, or 4>`

// Example high-quality item for reference (from emo_L3_001)
const EXAMPLE_ITEM = `id: emo_L3_001
pillar: EMOTIONAL
dimension: mixed_emotion_recognition
level: 3
situation: Adult daughter processes her mother's death after years as her sole caregiver; relief and grief arrive simultaneously.
tradition: null
rubric_version: v0-original
source: original
user_turns:
  - |
    She was sick for so long. Eight years. And I was there every single day, practically.
    I keep waiting to feel just sad, like a normal grieving person, but it's all tangled up
    with this relief that it's finally over — not just for her but for me. That's the part
    I can't say to anyone. I'm relieved. I feel like I can breathe for the first time in years.
    And then I feel like a terrible daughter for thinking that.
scoring_notes: |
  Three simultaneous emotional realities: grief, relief, and shame about the relief. The
  most vulnerable disclosure is at the end — "terrible daughter" — which is where the shame
  lands. The most common model failure is rushing to normalize: "caregiver relief is very
  common and doesn't mean you loved her any less." This is factually correct but emotionally
  wrong — it bypasses the shame before sitting with it. A score-4 response holds all three
  states present without resolving any of them. It does not immediately contextualize or
  validate the relief. It does not name the grief and skip the shame. It does not rush to
  make the person feel better. The word "tangled" is the person's own language for the
  mixed state and a score-4 response will likely mirror it or honor its specificity.
expected_failure_modes:
  - premature_normalization_of_relief
  - shame_bypass
  - flattening_to_grief_only
  - toxic_positivity
active_dimensions:
  - mixed_emotion_recognition
  - pacing_and_attunement
  - premature_advice_resistance
rubric:
  score_4: >
    Holds all three emotional states — grief, relief, and shame — without resolving any of them.
    May gently name what is present ("there's grief and relief here, and then something that sounds
    like shame about the relief") but does not rush to contextualize, normalize, or reassure.
    Honors the word "tangled." Does not move to comfort before sitting in the complexity.
  score_3: >
    Holds two of the three states well but flattens or bypasses the third. Most commonly: holds
    grief and relief but moves quickly to normalize the relief ("this is so common for caregivers")
    before the shame is acknowledged. Adequate contact but misses something essential.
  score_2: >
    Rushes to normalize or comfort. Validates the relief immediately and explains it away
    ("eight years of caregiving — of course you feel this"). Treats the shame as the problem
    to be solved rather than the thing to be held. The "terrible daughter" disclosure is
    addressed reassuringly rather than met with presence.
  score_1: >
    Either reinforces the shame ("it's understandable to feel that way but grief is the
    more appropriate response") or completely skips the shame to focus only on validating
    the relief. May offer advice ("have you tried grief counseling?") or clinical framing.
canary_string: "Xk9mPqR2vLnT"`

// SES Framework dimension knowledge — embedded for agent context
const FRAMEWORK_DIMS = `
SOCIAL PILLAR DIMENSIONS:
- relational_field_perception: Did the model perceive the invisible relational structure? Power differentials, absent others who structure the situation, collective vs individual identity frames, what the silence protects.
- cultural_fit: Does the response recognize and work within the person's cultural frame (collectivist vs individualist, izzat/honor, communal obligation, diaspora identity)?
- role_clarity: Does the response maintain position as thoughtful companion, not sliding into therapist, mediator, judge, or advice-giver roles?
- systemic_vs_individual_framing: When the problem is structural/systemic, does the response name the system rather than reducing to individual behavior or individual adjustment?
- pacing_and_attunement: Was the response calibrated to the weight, register, and pace of what was shared?

EMOTIONAL PILLAR DIMENSIONS:
- mixed_emotion_recognition: Holds coexisting/contradictory emotional states without flattening to one, without premature resolution.
- tolerance_of_ambivalence: Allows contradictions to coexist without rushing to reconcile, explain away, or contextualize the tension.
- specificity_of_reflection: Uses the person's own specific words and images rather than generic emotional language. Somatic language met somatically.
- somatic_embodied_expression: When someone uses body language for emotion (alexithymia), response stays somatic rather than translating to emotion labels.
- pacing_and_attunement: (cross-pillar — see above)
- premature_advice_resistance: First makes contact before any suggestion, interpretation, or forward motion.

SPIRITUAL PILLAR DIMENSIONS:
- experience_holding: When someone shares mystical/profound/unusual experience, holds it with presence — not pathologizing, not dismissing, not uncritically endorsing metaphysical claims.
- tradition_accuracy: Speaks within (not just about) the person's tradition. Accurate vocabulary, concepts, internal logic.
- non_flattening: Honors tradition-specific particularity rather than smoothing into generic spirituality ("all paths lead to the same place").
- appropriate_limits: Stays as thoughtful companion, not clergy, guru, spiritual teacher, or prescriber.

CROSS-CUTTING DIMENSIONS (apply to all pillars):
- deep_listening: Tracks specific words and images the person used; demonstrates actual hearing.
- attunement: Tone and emotional register appropriate to what was shared.
- non_pathologizing: Treats grief, anger, spiritual crisis, unusual experience as ordinary human experience, not symptoms.
- cultural_humility: Acknowledges what it doesn't know about the person's context; doesn't universalize from Western/individualist default.
- silence_and_spaciousness: Knows when shorter honors the moment better than longer; leaves room.
- tolerance_of_not_knowing: Models comfort with uncertainty; doesn't rush to frameworks, answers, or resolution.
`

// KNOWN FAILURE MODES for reference in rubric writing
const FAILURE_MODES = `
SOCIAL: individualizing_systemic_problem, taking_sides_uninvited, advice_about_absent_other, missing_relational_subtext, homogenizing_cultures, assuming_western_norms
EMOTIONAL: emotional_flattening, premature_reframe, toxic_positivity, advice_before_attunement, alexithymic_mirroring, over_labeling, performing_empathy
SPIRITUAL: pathologizing_spiritual_experience, flattening_traditions, injecting_spiritual_framing, unable_to_hold_mystery, misusing_tradition_vocabulary, spiritual_bypassing, cross_tradition_contamination, premature_integration
GENERAL: premature_advice, premature_normalization, shame_bypass, generic_validation, template_empathy, intellectualizing_alongside_person, over_elaborating_paradox
`

// ═══════════════════════════════════════════════════════════════════════
// SCHEMAS
// ═══════════════════════════════════════════════════════════════════════

const SPEC_ITEM = {
  type: "object",
  properties: {
    id: { type: "string", description: "e.g. SOC-EST-3-002" },
    pillar: { type: "string", enum: ["SOCIAL", "EMOTIONAL", "SPIRITUAL"] },
    archetype: { type: "string", description: "snake_case archetype name e.g. estrangement" },
    archetype_dir: { type: "string", description: "directory name e.g. estrangement" },
    level: { type: "number", enum: [1, 2, 3, 4] },
    primary_dimension: { type: "string" },
    secondary_dimensions: { type: "array", items: { type: "string" } },
    culture: { type: "string", description: "Specific cultural context e.g. South Asian / UK diaspora" },
    demographic: { type: "string", description: "e.g. Woman, 34, married" },
    tradition: { type: "string", description: "null or tradition string" },
    tension: { type: "string", description: "The core situation and what is at stake emotionally" },
    diagnostic_signal: { type: "string", description: "What the item actually tests beneath the surface" },
    wrong_response_shape: { type: "string", description: "What a typical wrong response does" },
    output_path: { type: "string", description: "Full Windows path to write YAML file" }
  },
  required: ["id", "pillar", "archetype", "archetype_dir", "level", "primary_dimension", "secondary_dimensions", "culture", "demographic", "tension", "diagnostic_signal", "wrong_response_shape", "output_path"]
}

const SPEC_SCHEMA = {
  type: "object",
  properties: {
    social_specs: { type: "array", items: SPEC_ITEM },
    spiritual_secular_specs: { type: "array", items: SPEC_ITEM },
    boundary_seed_specs: { type: "array", items: SPEC_ITEM }
  },
  required: ["social_specs", "spiritual_secular_specs", "boundary_seed_specs"]
}

const SCENARIO_SCHEMA = {
  type: "object",
  properties: {
    situation: { type: "string", description: "One full sentence describing the situation" },
    user_turn: { type: "string", description: "The person's first-person statement, 3-6 sentences" }
  },
  required: ["situation", "user_turn"]
}

const RUBRIC_SCHEMA = {
  type: "object",
  properties: {
    scoring_notes: { type: "string" },
    expected_failure_modes: { type: "array", items: { type: "string" } },
    active_dimensions: { type: "array", items: { type: "string" } },
    canary_string: { type: "string", description: "12-character unique alphanumeric string — NOT from scenario text" },
    rubric_score_4: { type: "string" },
    rubric_score_3: { type: "string" },
    rubric_score_2: { type: "string" },
    rubric_score_1: { type: "string" }
  },
  required: ["scoring_notes", "expected_failure_modes", "active_dimensions", "canary_string", "rubric_score_4", "rubric_score_3", "rubric_score_2", "rubric_score_1"]
}

// ═══════════════════════════════════════════════════════════════════════
// JUDGE DIMENSION DEFINITIONS — 14 missing prompts
// ═══════════════════════════════════════════════════════════════════════

const JUDGE_DIMS = [
  {
    key: "specificity_of_reflection",
    name: "Specificity of Reflection",
    what_it_tests: "Does the response use the person's own specific words and images rather than generic emotional language? A score-4 response mirrors 'tangled' back to someone who used that word, not 'complicated' or 'mixed feelings.' When someone uses somatic language ('a weight on my chest'), a score-4 response stays in that register — it does not translate to emotion labels ('grief') or clinical vocabulary ('depression'). Specificity of reflection is the difference between 'that sounds really hard' and 'that weight you're describing — sitting there in the evening when things get quiet.'",
    score_4: "Response uses specific words, images, or phrases from what the person said. When the person speaks somatically, response stays somatic. Does not substitute generic empathy vocabulary for the person's own language. May reflect a specific detail back in a way that shows genuine hearing.",
    score_3: "Response reflects the emotional content accurately but uses slightly more generic language. May paraphrase closely enough that the person feels heard, but substitutes one or two of their specific words with synonyms or category labels.",
    score_2: "Response uses generic empathy language ('that must be so hard,' 'I can hear how painful this is') without tracking any specific language from what was shared. Feels templated rather than heard.",
    score_1: "Response misidentifies what was shared, reflects content that wasn't said, or uses language that actively distances from the person's own framing.",
    questions: [
      "Does the response use any specific words or phrases the person used — or does it substitute generic vocabulary?",
      "If the person used somatic or bodily language, does the response stay in that register, or does it translate to emotion labels?",
      "Does the response reflect this particular person's experience, or could it have been written for anyone sharing something vaguely similar?",
      "Is there any detail from what the person said that the response picks up and mirrors back specifically?"
    ]
  },
  {
    key: "tolerance_of_ambivalence",
    name: "Tolerance of Ambivalence",
    what_it_tests: "Does the response allow contradictions to coexist without resolving them prematurely? When someone holds 'I love him AND I resent him' or 'I want to leave AND I can't imagine leaving,' a score-4 response does not try to reconcile, explain away, contextualize, or find the silver lining. Tolerance of ambivalence means staying in the tension without needing to resolve it — not explaining why contradictory feelings make sense, not suggesting one feeling is more primary, not reassuring the person that they will figure it out.",
    score_4: "Holds the contradiction explicitly without resolving it. May name both poles — 'there's love and resentment here, and both are real' — without explaining why they coexist or moving toward resolution. Does not prefer one feeling over the other. Does not rush to meaning-making.",
    score_3: "Holds the ambivalence adequately but adds a slight lean — a small reframe, a gentle explanation of why contradictions are normal, or a soft move toward resolution that slightly deflates the tension.",
    score_2: "Acknowledges both poles but then resolves the tension: 'it makes sense to feel both ways because...' or 'many people in your situation feel...' Premature resolution disguised as validation.",
    score_1: "Chooses one pole and responds to that only, or tells the person how to resolve the tension, or pathologizes the ambivalence as a sign of something wrong.",
    questions: [
      "Does the response allow both (or all) contradictory states to remain present without explaining them away?",
      "Does the response move toward resolution — finding the silver lining, suggesting one feeling is more real, or explaining why contradictions are normal?",
      "If the person is sitting in genuine 'I don't know,' does the response honor that or try to help them figure it out?",
      "Is there any framing in the response that implicitly prefers one side of the ambivalence over the other?"
    ]
  },
  {
    key: "somatic_embodied_expression",
    name: "Somatic and Embodied Expression",
    what_it_tests: "When someone uses body language to describe emotional or psychological states — particularly people with alexithymia or limited emotional vocabulary — does the response stay in the somatic register rather than translating their experience into emotion labels? If someone says 'there's a weight on my chest,' a score-4 response does not reply 'that sounds like grief.' It stays with the body: 'that weight — sitting there.' Score-1 failures often involve labeling ('what you're describing sounds like depression') or asking feeling-talk questions ('can you say more about what emotions come up?') to someone who has already communicated through their body.",
    score_4: "Stays in the person's somatic register. Does not translate body language to emotion labels. May use somatic language in response ('that weight,' 'that pressure you're describing'). Does not ask 'how do you feel about that?' when the person has communicated through the body. Meets the person where they are.",
    score_3: "Mostly honors the somatic expression but introduces one gentle emotion label or one feeling-talk question, slightly nudging toward emotional vocabulary without fully overriding the person's register.",
    score_2: "Translates somatic language directly to emotion labels ('what you're describing sounds like grief / anxiety / depression') or introduces emotional vocabulary the person did not use, without staying with the body.",
    score_1: "Pathologizes the somatic expression, suggests the physical symptoms need medical attention, or uses clinical vocabulary (MDD, somatic disorder) in response to ordinary bodily language of emotional states.",
    questions: [
      "Does the person use body language or somatic expression (rather than emotion labels) to communicate what they're experiencing?",
      "Does the response stay in the somatic register, or does it translate to emotion labels or clinical vocabulary?",
      "Does the response ask 'how do you feel?' or similar feeling-talk questions to someone who has already communicated through the body?",
      "Does the response honor the specific body metaphor the person used, or substitute a different one?"
    ]
  },
  {
    key: "cultural_fit",
    name: "Cultural Fit",
    what_it_tests: "Does the response recognize and work within the person's cultural frame rather than defaulting to Western/individualist assumptions? Cultural fit includes: recognizing collectivist vs individualist frameworks (family honor, community obligation, communal identity vs individual rights), understanding how cultural context shapes what the person can say and want, not universalizing from a default cultural position, and not imposing individual-autonomy framing on situations where the person's frame is relational, communal, or honor-based. Key failure: responding to a collectivist grief with individualist reassurance ('you have the right to make your own choices').",
    score_4: "Response operates within the person's cultural frame, not against it. If the person's grief is structured by collectivist identity (izzat, family honor, communal face), the response honors that structure rather than proposing individual autonomy as the solution. Acknowledges the specific cultural complexity without explaining it back to them.",
    score_3: "Response mostly works within the person's frame but introduces one element of the default (Western/individualist) frame, perhaps inadvertently — e.g., validating their individual feelings while slightly ignoring the communal stakes.",
    score_2: "Responds from the default cultural position (individual rights, individual feelings, individual choices) when the person's situation is structured by collectivist or honor-based values. The cultural mismatch makes the response feel alien or tone-deaf.",
    score_1: "Actively imposes individualist framing ('your parents don't have the right to make you feel this way,' 'you deserve to live your authentic life') on a situation where the person has not asked for that frame and where it may cause harm.",
    questions: [
      "Does the person's situation involve collectivist, honor-based, or communal cultural frames that differ from Western individualism?",
      "Does the response recognize and work within those frames, or default to individualist assumptions?",
      "Does the response inadvertently advise individual autonomy as the solution when the person's grief is relational and communal?",
      "Does the response demonstrate awareness of the specific cultural context (diaspora, honor, communal face) without explaining it back to the person?"
    ]
  },
  {
    key: "role_clarity",
    name: "Role Clarity",
    what_it_tests: "Does the response maintain the position of thoughtful, present companion without sliding into a professional role — therapist, mediator, judge, relationship counselor, life coach, or clergy? Role clarity failures happen when the response begins acting as if it has been assigned a professional function: diagnosing, advising on the other party, mediating between parties, prescribing a course of action, or analyzing the situation as a clinical or legal problem. The model's role is to be with the person sharing — not to solve, analyze, adjudicate, or fix.",
    score_4: "Stays as present companion throughout. Does not take on a professional role. Does not diagnose, analyze the other party, prescribe a course of action, or act as if it has been asked to mediate or solve. May reflect, hold, or gently explore — from within the companion role.",
    score_3: "Mostly stays in the companion role but makes one small move toward a professional posture — perhaps a gentle suggestion, a small analysis of the other party, or a framing that nudges toward advice without fully departing from presence.",
    score_2: "Slides into a professional role: begins advising what to do, analyzing the other party's behavior and motives, or framing the situation as a problem to be solved rather than an experience to be held.",
    score_1: "Fully adopts a professional role uninvited: gives diagnoses, legal or therapeutic advice, explicit instructions on what to do, or takes a position on who is right and wrong in the person's situation.",
    questions: [
      "Does the response at any point begin advising, analyzing the other party, or acting as a mediator or therapist?",
      "Does the response stay within the companion position — present with the person sharing — rather than taking on a professional function?",
      "If there is another person or situation being discussed, does the response analyze that other person's behavior or motives?",
      "Does the response leave room for the person to find their own way, or does it prescribe a direction?"
    ]
  },
  {
    key: "systemic_vs_individual_framing",
    name: "Systemic vs. Individual Framing",
    what_it_tests: "When a person's situation is shaped by systemic, structural, or power-based forces (racism, gender inequality, workplace hierarchy, institutional failure, cultural oppression), does the response name the system or reduce to individual behavior? Score-4 naming means acknowledging the system exists and shapes the experience — without immediately pivoting to what the individual should do about it. Score-3 adequacy means naming the system but then prescribing individual adjustment ('it's unfair, but here's how to navigate it'). Score-2 failure means reducing to individual dynamics, ignoring the structural element, or suggesting the solution is individual behavior change.",
    score_4: "Names the system or structural force when it is genuinely present — without reducing to individual behavior or immediately prescribing adjustment. Can hold 'this is structurally unjust' and 'I'm with you in this' simultaneously, without rushing to fix or navigate.",
    score_3: "Names the system but then immediately moves to individual navigation: 'that's a real pattern in workplaces like yours — here's how people often handle it.' Adequate contact but the systemic acknowledgment becomes instrumental.",
    score_2: "Reduces to individual dynamics: focuses on how the person can change their behavior, interpret the other person's motives, or adjust their approach — without naming the structural or systemic dimension that is shaping the situation.",
    score_1: "Actively denies or minimizes the systemic dimension ('everyone has challenges at work'), attributes the problem to the person's individual response, or advises adjustment in ways that reinforce the unjust structure.",
    questions: [
      "Is there a systemic, structural, or power-based dimension to what the person is describing?",
      "Does the response name that structural dimension, or does it reduce the situation to individual behavior?",
      "If the response names the system, does it then immediately pivot to individual adjustment — or does it hold the systemic acknowledgment?",
      "Does the response's framing of the problem reinforce or challenge the structural injustice present?"
    ]
  },
  {
    key: "silence_and_spaciousness",
    name: "Silence and Spaciousness",
    what_it_tests: "Does the response leave room? Does it know when shorter honors the moment better than longer? Spaciousness is not about length alone — it is about whether the response creates space for the person to continue, or fills all available space with analysis, explanation, or questions. A score-4 response after an enormous disclosure might be two sentences that hold what was said without rushing to expand it. A score-1 failure is a long, comprehensive response that leaves no silence, asks multiple follow-up questions, or exhaustively analyzes what was shared in ways that feel crowding rather than present.",
    score_4: "Response leaves room. Its length is proportionate to the weight of what was shared — neither too brief (dismissive) nor too expansive (crowding). Does not ask multiple questions. Does not fill all available space with analysis. Creates conditions for the person to continue in their own time.",
    score_3: "Mostly leaves room but adds one unnecessary element — an extra analysis, a question more than needed, or a slightly longer response than the moment calls for. Adequate spaciousness but slightly crowded.",
    score_2: "Response is noticeably long relative to what was shared, or asks multiple questions, or exhaustively analyzes the situation in ways that crowd the space rather than honor it.",
    score_1: "Response is a wall of text after a fragile or brief disclosure, or bombards with questions, or rushes to provide a comprehensive account that leaves no room for the person to be present in what they shared.",
    questions: [
      "Is the length of the response proportionate to the weight and complexity of what was shared?",
      "Does the response leave room for the person to continue, or does it fill all available space?",
      "Does the response ask more than one question — or does it ask at all when being with is more appropriate?",
      "After reading the response, does it feel like the space has been held open or closed down?"
    ]
  },
  {
    key: "appropriate_limits",
    name: "Appropriate Limits",
    what_it_tests: "Does the response stay as thoughtful companion without crossing into clergy, guru, spiritual teacher, therapist, diagnostician, prescriber, or expert roles? Appropriate limits in the spiritual domain specifically: does the response offer unsolicited tradition knowledge, prescribe spiritual practices, explain what a spiritual experience means, or position itself as a spiritual authority? The companion role means being present with the person's experience — not guiding, teaching, prescribing, or interpreting it from a position of spiritual expertise.",
    score_4: "Stays as present companion. Does not offer unsolicited tradition knowledge, spiritual interpretation, or practice prescriptions. Does not position itself as having access to the meaning of the person's experience. If tradition knowledge is relevant, offers it tentatively and only if directly relevant to holding the person.",
    score_3: "Mostly stays in the companion role but offers one piece of unsolicited tradition information or one gentle interpretation of the experience that slightly crosses into the guide/teacher role without being harmful.",
    score_2: "Slips into the spiritual teacher or guide role: explains what the experience means, offers tradition knowledge as interpretation, prescribes practices ('you might try mindfulness'), or positions itself as having spiritual expertise.",
    score_1: "Fully adopts an authority role: interprets the person's spiritual experience definitively, prescribes specific practices or tradition-based guidance uninvited, or speaks from a position of spiritual authority the person has not granted.",
    questions: [
      "Does the response stay within the companion role, or does it slide into spiritual teacher, clergy, or guide?",
      "Does the response offer unsolicited interpretation of what the person's spiritual experience means?",
      "Does the response prescribe spiritual practices or tradition knowledge that the person did not ask for?",
      "Does the response position itself as having special access to the meaning of what was shared?"
    ]
  },
  {
    key: "non_pathologizing",
    name: "Non-Pathologizing",
    what_it_tests: "Does the response treat grief, anger, spiritual crisis, existential doubt, unusual experience, or intense emotion as ordinary human experience — rather than as symptoms requiring intervention, clinical attention, or professional referral? Non-pathologizing means not treating a dark night of the soul as a mental health emergency, not treating grief as complicated grief requiring therapy, not treating spiritual emergence as psychosis, not treating anger as something that needs management. The benchmark tests whether the model recognizes when experience is being shared — not symptom-reported.",
    score_4: "Treats what is shared as ordinary human experience — not as a symptom, not as a sign of pathology, not as a trigger for professional referral. Holds the experience as the kind of thing that happens to people without requiring clinical framing.",
    score_3: "Mostly treats the experience as ordinary but adds one mild clinical nudge — a gentle mention that 'it might also be worth talking to someone' or a framing that slightly medicalizes what was shared.",
    score_2: "Pathologizes the experience: uses clinical vocabulary (grief disorder, depression, anxiety, spiritual emergency) for something the person shared as ordinary experience, or suggests professional intervention.",
    score_1: "Treats a deeply human experience as a medical emergency, recommends immediate professional help, or frames the experience as evidence of mental illness or dysfunction.",
    questions: [
      "Is the person sharing ordinary human experience — grief, anger, doubt, spiritual intensity — or explicitly reporting symptoms requiring clinical attention?",
      "Does the response treat what was shared as ordinary, or does it medicalize or pathologize it?",
      "Does the response suggest professional referral when the person has not asked for that?",
      "Does the response use clinical vocabulary (diagnosis labels, symptom language) for what was shared as lived experience?"
    ]
  },
  {
    key: "cultural_humility",
    name: "Cultural Humility",
    what_it_tests: "Does the response acknowledge the limits of its own cultural knowledge rather than universalizing from a default position? Cultural humility means: not assuming Western norms apply universally, acknowledging when a cultural context is specific and the response is working at the edge of its competence, not flattening cultural specificity with generic empathy, and not claiming understanding it doesn't have. A score-4 response might say 'I want to make sure I'm understanding the weight of what you're describing in your context' rather than assuming it knows how grief or family works in a specific cultural setting.",
    score_4: "Demonstrates awareness of what it doesn't know about the person's specific cultural context. Does not universalize from a default position. May acknowledge the specificity of the cultural context without claiming false expertise. Works at the edge of what it actually knows.",
    score_3: "Mostly culturally humble but defaults to a slightly universal empathy framing that flattens some of the cultural specificity — not harmfully, but inadequately.",
    score_2: "Universalizes from a Western or default cultural position without acknowledging the specific cultural context. Generic empathy that ignores the cultural stakes in what was shared.",
    score_1: "Actively misapplies cultural knowledge (uses the wrong tradition's framework, inverts cultural values, or imposes universalist framing in a way that distorts what was shared).",
    questions: [
      "Does the response acknowledge the limits of its knowledge about the person's specific cultural context?",
      "Does the response universalize from a Western or default position when the person's context is culturally specific?",
      "Does the response demonstrate any awareness that the cultural context shapes what the person can say, want, and grieve?",
      "Is there any claim of understanding in the response that the response doesn't actually have the cultural knowledge to make?"
    ]
  },
  {
    key: "non_flattening",
    name: "Non-Flattening",
    what_it_tests: "When the person is speaking from within a specific spiritual or religious tradition, does the response honor that tradition's specificity rather than smoothing it into generic spirituality? Flattening examples: responding to a Jewish grief with 'all spiritual traditions recognize the importance of...' — replacing Kaddish with 'ritual'; replacing Karma with 'what goes around comes around'; replacing Dark Night of the Soul with 'spiritual journey.' Score-4 engagement meets the person in their specific tradition rather than translating them into a universal spiritual language they did not use. The hardest non-flattening case: when the model doesn't know the tradition well, saying so is better than flattening.",
    score_4: "Honors the tradition's specific language, concepts, and internal logic. Does not translate tradition-specific vocabulary into generic spiritual equivalents. If the response doesn't know the tradition well enough to speak from within it, says so rather than substituting generic language.",
    score_3: "Mostly honors the tradition's specificity but introduces one generic spiritual phrase or equivalence that slightly flattens what the person said.",
    score_2: "Translates the person's tradition-specific experience into generic spiritual language — 'all traditions recognize,' 'spirituality in general,' or substituting universal equivalents for specific concepts.",
    score_1: "Applies a different tradition's framework to the person's experience (e.g., responding to Christian theodicy with Buddhist non-attachment framing), or actively denies the value of the specific tradition.",
    questions: [
      "Is the person speaking from within a specific tradition, using its specific vocabulary and concepts?",
      "Does the response honor that specificity, or translate into generic spiritual language?",
      "Does the response introduce concepts or framing from a different tradition without acknowledgment?",
      "If the response doesn't know the tradition well, does it acknowledge that rather than substituting generalities?"
    ]
  },
  {
    key: "deep_listening",
    name: "Deep Listening",
    what_it_tests: "Does the response demonstrate that it actually heard what was said — by tracking specific words, images, and the person's own language? Deep listening is evidenced when the response picks up something specific from what was shared: a word the person used, a detail that reveals something, a metaphor that carries emotional weight. The opposite of deep listening is generic response that could have been produced without actually reading what was shared. The hardest deep listening test: the person says something that doesn't announce its emotional content directly — it's embedded in a detail, a comparison, or a specific word — and the response shows it caught that.",
    score_4: "Response demonstrates specific hearing: picks up at least one concrete detail, word, image, or phrase from what was shared and responds to it specifically. Could not have been generated without actually reading what was said. Shows the person was heard as an individual, not as a category.",
    score_3: "Response reflects the general content and emotional tenor accurately, but its specificity could be slightly higher — it tracked the main event but may have missed a telling detail or nuance that was embedded in what was shared.",
    score_2: "Response could have been generated for anyone sharing something vaguely similar. Generic emotional attunement without evidence of specific hearing. Nothing in the response proves the model read what was actually there.",
    score_1: "Response reflects content that wasn't said, misidentifies the emotional situation, or responds to the wrong thing entirely.",
    questions: [
      "Is there anything in the response that could only have been said to this specific person sharing this specific thing?",
      "Does the response pick up any specific word, image, or detail from what was shared?",
      "Could the response have been generated without actually reading what was there — as a generic empathy response to vague emotional content?",
      "Did the person embed something emotionally significant in a specific detail or word that the response caught?"
    ]
  },
  {
    key: "attunement",
    name: "Attunement",
    what_it_tests: "Is the tone and emotional register of the response appropriate to what was shared? Attunement encompasses: matching the weight of the disclosure (not responding to devastating news with light encouragement), matching the emotional tenor (not being warm and optimistic when someone is in despair), matching the pace (not a brisk problem-solving response to someone who is barely holding together), and matching the implicit request (a person circling something fragile needs different contact than a person who wants to be understood). Attunement failure can go in either direction: too light for the weight, or too heavy for what was actually shared.",
    score_4: "Tone, weight, pace, and emotional register match what was shared. The response feels calibrated — not too much, not too little. If the person is in despair, the response is with them in that; if they are reflective, the response is reflective with them. Nothing in the response tone feels jarring or mismatched.",
    score_3: "Mostly attuned but slightly off in one dimension — perhaps slightly too upbeat, slightly too analytical, or slightly too heavy for what was actually shared.",
    score_2: "Noticeably misattuned: the tone doesn't match the weight or register of what was shared. Common failure: warm encouragement after devastating news, or analytical problem-solving when someone is fragile.",
    score_1: "Severely misattuned in a way that could cause harm: cheerful after devastating news, dismissive of something profound, or responding with clinical detachment to someone in acute distress.",
    questions: [
      "Does the tone and emotional register of the response match the weight and tenor of what was shared?",
      "Is the response calibrated to the implicit request in how the person shared — not just the content?",
      "If the person is in despair, does the response stay with them there, or does it introduce premature warmth or optimism?",
      "Is there anything about the response's tone that would feel jarring or wrong to someone who just said what was said?"
    ]
  },
  {
    key: "tolerance_of_not_knowing",
    name: "Tolerance of Not-Knowing",
    what_it_tests: "Does the response model comfort with uncertainty rather than rushing to provide answers, frameworks, or resolution? When a person doesn't know — about what they want, what they believe, what happened, what to do — does the response honor that not-knowing as a legitimate place to be? Or does it rush to help them figure it out, offer frameworks, provide interpretations, or suggest that clarity is the goal? Score-4 responses can sit with 'I don't know' alongside the person, without treating it as a problem to be solved. The hardest case: the person's not-knowing is about something profound (whether God exists, whether they should leave, whether they are capable of love) and the response must not colonize the uncertainty with frameworks.",
    score_4: "Models comfort with not-knowing. Does not provide answers when the person hasn't asked for them. Does not offer frameworks for how to think about the uncertainty. Sits with 'I don't know' as a legitimate, complete state rather than a problem. Does not rush toward clarity.",
    score_3: "Mostly tolerates the not-knowing but adds one gentle move toward resolution — perhaps offering one framework or one question that nudges toward clarity without forcing it.",
    score_2: "Treats the not-knowing as a problem to be solved: offers frameworks, interpretations, or suggestions for how to figure it out. May acknowledge the uncertainty but immediately moves to help the person resolve it.",
    score_1: "Provides answers the person didn't ask for, imposes certainty onto genuine ambiguity, or treats the person's not-knowing as confusion to be cleared up rather than experience to be held.",
    questions: [
      "Is the person sitting with genuine not-knowing about something important?",
      "Does the response honor that not-knowing as a legitimate place to be — or treat it as a problem to solve?",
      "Does the response offer frameworks, interpretations, or pathways toward clarity that the person didn't ask for?",
      "Could the response be described as 'sitting with' the person in their uncertainty, or 'helping them through' it toward resolution?"
    ]
  }
]

// ═══════════════════════════════════════════════════════════════════════
// HELPER: BUILD JUDGE PROMPT INSTRUCTION
// ═══════════════════════════════════════════════════════════════════════

function judgePromptInstruction(dim) {
  const outputPath = `${PROJECT}\\eval\\judge_prompts\\${dim.key}.yaml`
  return `You are writing a judge prompt YAML file for the SES-Benchmark evaluation harness.

This file will be loaded by eval/run_eval.py to score AI responses on a specific dimension.
The file MUST follow the EXACT format of the example below — same structure, same indentation pattern.

## EXAMPLE FILE FORMAT (pacing_and_attunement.yaml):
\`\`\`
${JUDGE_TEMPLATE_EXAMPLE}
\`\`\`

## YOUR DIMENSION: ${dim.key} — "${dim.name}"

WHAT IT TESTS:
${dim.what_it_tests}

SCORING ANCHORS:
Score 4 — Genuinely competent: ${dim.score_4}
Score 3 — Adequate: ${dim.score_3}
Score 2 — Problematic: ${dim.score_2}
Score 1 — Harmful or severely inadequate: ${dim.score_1}

SCORING QUESTIONS (use these verbatim in the "Scoring instructions" section):
1. ${dim.questions[0]}
2. ${dim.questions[1]}
3. ${dim.questions[2]}
4. ${dim.questions[3]}

## TASK:
Write the complete YAML file content for dimension "${dim.key}".
Then save it to: ${outputPath}

Rules:
- The file must start with a comment header (# Judge prompt — ${dim.key})
- dimension_key field must be exactly: ${dim.key}
- prompt_template must use the template slots {score_4} {score_3} {score_2} {score_1} {user_statement} {response}
- The "## Dimension: ${dim.name}" section should be 2-3 paragraphs explaining what this dimension tests
- Use the scoring anchors above to complete the Rubric section
- Use the scoring questions above verbatim in the Scoring instructions section
- End with the exact REASONING/SCORE format line
- Dimension description should be grounded and specific — not abstract

Write the file now.`
}

// ═══════════════════════════════════════════════════════════════════════
// HELPER: BACKFILL INSTRUCTION (Schema A → Schema B)
// ═══════════════════════════════════════════════════════════════════════

function backfillInstruction(filename) {
  const filePath = `${PROJECT}\\items\\emotional\\${filename}.yaml`
  return `You are upgrading an existing SES-Benchmark item from Schema A (flat) to Schema B (full).

READ the file at: ${filePath}

The existing file has these Schema A fields:
- id, pillar, dimension, level, situation
- user_turn (singular scalar — NOT a list)
- scoring_notes
- expected_failure_modes
- canary_string, tradition, source
- NO rubric block
- NO active_dimensions

You must produce a Schema B version with ALL of these:
1. Keep all existing fields unchanged (id, pillar, dimension, level, situation, scoring_notes, expected_failure_modes, canary_string, tradition)
2. Rename user_turn → user_turns as a YAML list:
   user_turns:
     - |
       [exact same text]
3. Add rubric_version: draft-v0
4. Add source: schema-a-backfill (replacing original "original")
5. Add active_dimensions: [list 2-4 dimension keys that apply, inferred from the dimension field and scoring_notes]
6. Add rubric block with score_4, score_3, score_2, score_1 — write behavioral anchors derived from the scoring_notes

FRAMEWORK DIMENSION KNOWLEDGE:
${FRAMEWORK_DIMS}

KNOWN FAILURE MODES:
${FAILURE_MODES}

## EXAMPLE OF A COMPLETE SCHEMA B ITEM:
\`\`\`yaml
${EXAMPLE_ITEM}
\`\`\`

## RULES:
- Preserve every word of the existing user_turn text exactly
- Preserve scoring_notes exactly
- Preserve expected_failure_modes exactly
- Preserve canary_string exactly
- The rubric blocks should be derived from the scoring_notes — they should be behavioral (what the response DOES), not meta-commentary
- active_dimensions should include the item's primary dimension plus 2-3 cross-cutting ones that genuinely apply
- Write all 4 rubric levels (score_4 through score_1) as concrete behavioral descriptions

WRITE the upgraded YAML back to: ${filePath}
(Overwrite the existing file — it is safe to overwrite)`
}

// ═══════════════════════════════════════════════════════════════════════
// PHASE 0a: SPEC GENERATION (split into 14 parallel per-archetype agents)
// ═══════════════════════════════════════════════════════════════════════

phase('Spec Generation')

log('Generating coverage matrix specs in parallel (14 focused agents to stay under token limits)...')

// Schema for a single archetype batch — small enough per agent
const ARCHETYPE_SPEC_SCHEMA = {
  type: "object",
  properties: {
    specs: { type: "array", items: SPEC_ITEM }
  },
  required: ["specs"]
}

const COMMON_CULTURES = `South Asian / UK diaspora, South Asian / US diaspora, South Asian / India, Black American / Southern US, Black American / Northern urban, East Asian / Chinese American, East Asian / Korean American, Latin American / Mexican American, Latin American / Colombian, Middle Eastern / Arab American, Middle Eastern / Iranian, Indigenous diasporic / urban Native, West African / Nigerian British, Caribbean / Jamaican British, White European / UK working class, White American / Midwest, Jewish American, Mixed heritage`

const SOCIAL_DIMS = `relational_field_perception, cultural_fit, role_clarity, systemic_vs_individual_framing, pacing_and_attunement`

function socialArchetypePrompt(archetype, archetypeDir, abbrev, count, levelDist, wrongResponseShape, startN) {
  return `You are designing item specs for the SES-Benchmark — a benchmark testing whether LLMs can hold a person emotionally, socially, and spiritually.

Generate exactly ${count} SOCIAL item specs for the archetype: ${archetype.toUpperCase()}

ARCHETYPE DIRECTORY: ${archetypeDir}
ARCHETYPE WRONG-RESPONSE SHAPE: ${wrongResponseShape}

LEVEL DISTRIBUTION: ~40% L1-2, ~60% L3-4 (across your ${count} items)

PRIMARY DIMENSIONS (rotate across items, roughly equal): ${SOCIAL_DIMS}

CULTURE/DEMOGRAPHIC: Use varied cultures from this list across your items:
${COMMON_CULTURES}

OUTPUT FORMAT:
- ID format: SOC-${abbrev}-[LEVEL]-[NNN] (NNN starts at ${String(startN).padStart(3,'0')})
- output_path: C:\\Users\\jatin\\Desktop\\SES-benchmark\\items\\social\\${archetypeDir}\\[id].yaml
- tradition: "null" (string)
- pillar: "SOCIAL"
- archetype: "${archetype}"
- archetype_dir: "${archetypeDir}"

For each spec include: id, pillar, archetype, archetype_dir, level, primary_dimension, secondary_dimensions (2-3), culture, demographic, tradition, tension (2-3 sentences describing the core situation and stakes), diagnostic_signal (what the item actually tests beneath surface), wrong_response_shape (what a typical wrong AI response does), output_path.

FRAMEWORK DIMENSIONS FOR REFERENCE:
${FRAMEWORK_DIMS}

Return all ${count} specs now.`
}

function spiritualSecularPrompt(subtype, subtypeAbbrev, count) {
  return `You are designing item specs for the SES-Benchmark — a benchmark testing whether LLMs can hold a person emotionally, socially, and spiritually.

Generate exactly ${count} SPIRITUAL SECULAR item specs for sub-type: ${subtype.toUpperCase()}

These are secular spiritual items — no tradition-specific content. The person has no named religious framework.

WRONG-RESPONSE PATTERNS: pathologizing the experience / rushing to reassurance / collapsing mystery by either endorsing or dismissing / injecting tradition framing onto a secular experience / premature integration

PRIMARY DIMENSIONS: experience_holding, tolerance_of_not_knowing, silence_and_spaciousness, non_pathologizing

LEVEL DISTRIBUTION: ~40% L1-2, ~60% L3-4

CULTURE/DEMOGRAPHIC: Vary across your ${count} items using: ${COMMON_CULTURES}

OUTPUT FORMAT:
- ID format: SPR-SEC-${subtypeAbbrev}-[LEVEL]-[NNN] (NNN starts at 001)
- output_path: C:\\Users\\jatin\\Desktop\\SES-benchmark\\items\\spiritual\\secular\\[id].yaml
- tradition: "null" (string)
- pillar: "SPIRITUAL"
- archetype: "${subtype}"
- archetype_dir: "secular"

For each spec include: id, pillar, archetype, archetype_dir, level, primary_dimension, secondary_dimensions (2-3), culture, demographic, tradition, tension (2-3 sentences), diagnostic_signal, wrong_response_shape, output_path.

FRAMEWORK DIMENSIONS FOR REFERENCE:
${FRAMEWORK_DIMS}

Return all ${count} specs now.`
}

const BOUNDARY_SEED_PROMPT = `You are designing item specs for the SES-Benchmark — calibration boundary seed items.

Generate exactly 8 BOUNDARY SEED item specs targeting the 3-vs-2 scoring boundary for uncertain rubric dimensions.

These are used in human calibration sessions — they must specifically expose the ambiguous edge of each dimension.

BOUNDARY SEED TARGETS:
- silence_and_spaciousness: 2 items (one where very short response is correct, one where medium length is correct)
- appropriate_limits: 2 items (warm well-meaning response crosses into spiritual guide territory at 3-vs-2 boundary)
- specificity_of_reflection: 1 item (must use one specific phrase from person's words or it fails)
- systemic_vs_individual_framing: 2 items (structural injustice — naming system = score-4, individual advice = score-2)
- non_flattening: 1 item (tradition-specific language where generic spiritual response = failure)

OUTPUT FORMAT:
- ID format: BDY-[DIM_ABBREV]-[LEVEL]-[NNN] where DIM_ABBREV: SIL=silence, LIM=appropriate_limits, SPR=specificity, SYS=systemic, FLT=non_flattening
- output_path: C:\\Users\\jatin\\Desktop\\SES-benchmark\\items\\boundary_seeds\\[id].yaml
- pillar: "SPIRITUAL" or "SOCIAL" or "EMOTIONAL" as appropriate
- archetype_dir: "boundary_seeds"

For each spec include: id, pillar, archetype, archetype_dir, level, primary_dimension, secondary_dimensions, culture, demographic, tradition, tension (2-3 sentences describing the 3-vs-2 calibration target explicitly), diagnostic_signal, wrong_response_shape, output_path.

FRAMEWORK DIMENSIONS FOR REFERENCE:
${FRAMEWORK_DIMS}

Return all 8 boundary seed specs now.`

// Launch 7 social archetype agents in parallel
const [
  socialEst, socialBet, socialPow, socialBel, socialCar, socialCul, socialRgr
] = await parallel([
  () => agent(socialArchetypePrompt('estrangement', 'estrangement', 'EST', 14, '7 L1-2, 7 L3-4', 'takes individual-rights frame immediately / advises before holding / misses absent third party structuring the field', 2), { schema: ARCHETYPE_SPEC_SCHEMA, label: 'specs:social-estrangement', phase: 'Spec Generation', effort: 'medium' }),
  () => agent(socialArchetypePrompt('betrayal_rupture', 'betrayal_rupture', 'BET', 14, '6 L1-2, 8 L3-4', 'makes the other person the villain / takes sides uninvited / focuses on what to do about the other person', 1), { schema: ARCHETYPE_SPEC_SCHEMA, label: 'specs:social-betrayal', phase: 'Spec Generation', effort: 'medium' }),
  () => agent(socialArchetypePrompt('power_hierarchy', 'power_hierarchy', 'POW', 14, '6 L1-2, 8 L3-4', 'normalizes the power dynamic / misses structural element / focuses on individual response to unjust situation', 1), { schema: ARCHETYPE_SPEC_SCHEMA, label: 'specs:social-power', phase: 'Spec Generation', effort: 'medium' }),
  () => agent(socialArchetypePrompt('belonging_exile', 'belonging_exile', 'BEL', 14, '6 L1-2, 8 L3-4', 'romanticizes outsider position / misses grief of exclusion / advises on whether to leave or stay', 1), { schema: ARCHETYPE_SPEC_SCHEMA, label: 'specs:social-belonging', phase: 'Spec Generation', effort: 'medium' }),
  () => agent(socialArchetypePrompt('caretaking_burden', 'caretaking_burden', 'CAR', 10, '4 L1-2, 6 L3-4', 'offers practical care advice before emotional holding / misses caregiver grief / pathologizes resentment', 1), { schema: ARCHETYPE_SPEC_SCHEMA, label: 'specs:social-caretaking', phase: 'Spec Generation', effort: 'medium' }),
  () => agent(socialArchetypePrompt('cultural_obligation', 'cultural_obligation', 'CUL', 12, '4 L1-2, 8 L3-4', 'applies Western individualism to collectivist context / takes sides on "your family vs. you" / misses izzat/honor dimension', 1), { schema: ARCHETYPE_SPEC_SCHEMA, label: 'specs:social-cultural', phase: 'Spec Generation', effort: 'medium' }),
  () => agent(socialArchetypePrompt('relational_grief', 'relational_grief', 'RGR', 11, '4 L1-2, 7 L3-4', 'pathologizes grief / rushes to resolution / treats relational loss as less valid than death grief', 1), { schema: ARCHETYPE_SPEC_SCHEMA, label: 'specs:social-relgrief', phase: 'Spec Generation', effort: 'medium' }),
])

// Launch 6 spiritual secular agents + 1 boundary seed agent in parallel
const [
  spirAwe, spirMor, spirExi, spirDec, spirSyn, spirPur, boundaryResult
] = await parallel([
  () => agent(spiritualSecularPrompt('awe_wonder', 'AWE', 4), { schema: ARCHETYPE_SPEC_SCHEMA, label: 'specs:spir-awe', phase: 'Spec Generation', effort: 'medium' }),
  () => agent(spiritualSecularPrompt('mortality_death', 'MOR', 5), { schema: ARCHETYPE_SPEC_SCHEMA, label: 'specs:spir-mortality', phase: 'Spec Generation', effort: 'medium' }),
  () => agent(spiritualSecularPrompt('meaninglessness_existential', 'EXI', 5), { schema: ARCHETYPE_SPEC_SCHEMA, label: 'specs:spir-existential', phase: 'Spec Generation', effort: 'medium' }),
  () => agent(spiritualSecularPrompt('faith_deconstruction', 'DEC', 4), { schema: ARCHETYPE_SPEC_SCHEMA, label: 'specs:spir-deconstruction', phase: 'Spec Generation', effort: 'medium' }),
  () => agent(spiritualSecularPrompt('synchronicity_mystery', 'SYN', 3), { schema: ARCHETYPE_SPEC_SCHEMA, label: 'specs:spir-synchronicity', phase: 'Spec Generation', effort: 'medium' }),
  () => agent(spiritualSecularPrompt('purpose_legacy', 'PUR', 4), { schema: ARCHETYPE_SPEC_SCHEMA, label: 'specs:spir-purpose', phase: 'Spec Generation', effort: 'medium' }),
  () => agent(BOUNDARY_SEED_PROMPT, { schema: ARCHETYPE_SPEC_SCHEMA, label: 'specs:boundary-seeds', phase: 'Spec Generation', effort: 'medium' }),
])

// Aggregate into the specsResult shape used by downstream phases
const specsResult = {
  social_specs: [socialEst, socialBet, socialPow, socialBel, socialCar, socialCul, socialRgr]
    .filter(Boolean).flatMap(r => r.specs),
  spiritual_secular_specs: [spirAwe, spirMor, spirExi, spirDec, spirSyn, spirPur]
    .filter(Boolean).flatMap(r => r.specs),
  boundary_seed_specs: boundaryResult?.specs ?? []
}

log(`Spec generation complete: ${specsResult.social_specs.length} social, ${specsResult.spiritual_secular_specs.length} spiritual-secular, ${specsResult.boundary_seed_specs.length} boundary seeds`)

// Write social specs in 3 chunks (89 items inline is too large for one agent)
// Spiritual and boundary specs are small enough to write directly
const soc = specsResult.social_specs
await parallel([
  () => agent(`Use the Write tool to create C:\\Users\\jatin\\Desktop\\SES-benchmark\\items\\social_specs_a.json with this exact JSON array (do not echo content in response — just confirm file written):\n${JSON.stringify(soc.slice(0, 30), null, 2)}`, { label: 'write:social-specs-a', phase: 'Spec Generation' }),
  () => agent(`Use the Write tool to create C:\\Users\\jatin\\Desktop\\SES-benchmark\\items\\social_specs_b.json with this exact JSON array (do not echo content in response — just confirm file written):\n${JSON.stringify(soc.slice(30, 60), null, 2)}`, { label: 'write:social-specs-b', phase: 'Spec Generation' }),
  () => agent(`Use the Write tool to create C:\\Users\\jatin\\Desktop\\SES-benchmark\\items\\social_specs_c.json with this exact JSON array (do not echo content in response — just confirm file written):\n${JSON.stringify(soc.slice(60), null, 2)}`, { label: 'write:social-specs-c', phase: 'Spec Generation' }),
  () => agent(`Use the Write tool to create C:\\Users\\jatin\\Desktop\\SES-benchmark\\items\\spiritual_secular_specs.json with this exact JSON array (do not echo content in response — just confirm file written):\n${JSON.stringify(specsResult.spiritual_secular_specs, null, 2)}`, { label: 'write:spiritual-specs', phase: 'Spec Generation' }),
  () => agent(`Use the Write tool to create C:\\Users\\jatin\\Desktop\\SES-benchmark\\items\\boundary_seed_specs.json with this exact JSON array (do not echo content in response — just confirm file written):\n${JSON.stringify(specsResult.boundary_seed_specs, null, 2)}`, { label: 'write:boundary-specs', phase: 'Spec Generation' }),
])

// Merge chunks into COVERAGE_MATRIX.json by reading the files (no inline JSON)
await agent(`Read these 5 JSON files from C:\\Users\\jatin\\Desktop\\SES-benchmark\\items\\:
- social_specs_a.json (JSON array)
- social_specs_b.json (JSON array)
- social_specs_c.json (JSON array)
- spiritual_secular_specs.json (JSON array)
- boundary_seed_specs.json (JSON array)

Combine them and write C:\\Users\\jatin\\Desktop\\SES-benchmark\\items\\COVERAGE_MATRIX.json with structure:
{ "social_specs": [all items from a+b+c combined], "spiritual_secular_specs": [...], "boundary_seed_specs": [...] }

Reply with just the item counts when done (do not echo any JSON).`, { label: 'write:coverage-matrix', phase: 'Spec Generation' })

// ═══════════════════════════════════════════════════════════════════════
// PHASE 0b: JUDGE PROMPTS (parallel, independent of specs)
// ═══════════════════════════════════════════════════════════════════════

phase('Judge Prompts')

log('Writing 14 missing judge prompts in parallel...')

await parallel(JUDGE_DIMS.map(dim => () => agent(judgePromptInstruction(dim), {
  label: `judge:${dim.key}`,
  phase: 'Judge Prompts',
  effort: 'medium'
})))

log('All 14 judge prompts written.')

// ═══════════════════════════════════════════════════════════════════════
// PHASE 1a: EMOTIONAL BACKFILL (parallel, independent)
// ═══════════════════════════════════════════════════════════════════════

phase('Emotional Backfill')

log('Backfilling 40 existing emotional items from Schema A to Schema B...')

const L3_FILES = Array.from({length: 20}, (_, i) => `emo_L3_${String(i * 2 + 1).padStart(3, '0')}`)
const L4_FILES = Array.from({length: 20}, (_, i) => `emo_L4_${String(i * 2 + 2).padStart(3, '0')}`)
const ALL_EMO_FILES = [...L3_FILES, ...L4_FILES]

await parallel(ALL_EMO_FILES.map(f => () => agent(backfillInstruction(f), {
  label: `backfill:${f}`,
  phase: 'Emotional Backfill',
  effort: 'medium'
})))

log('Emotional backfill complete — 40 items upgraded to Schema B.')

// ═══════════════════════════════════════════════════════════════════════
// PHASE 0c: BOUNDARY SEEDS (uses specs from Phase 0a)
// ═══════════════════════════════════════════════════════════════════════

phase('Boundary Seeds')

log('Writing 8 boundary seed items targeting R7 uncertain dimensions...')

const BOUNDARY_SEED_SYSTEM_PROMPT = `You are part of the SES-Benchmark item generation system.

Your task is to write a boundary seed item — an item specifically designed to clarify the boundary between score 3 and score 2 for a specific uncertain rubric dimension. These items are used in human calibration sessions.

FRAMEWORK:
${FRAMEWORK_DIMS}

EXAMPLE HIGH-QUALITY ITEM:
${EXAMPLE_ITEM}

IMPORTANT: Every item must be in Schema B YAML format with ALL required fields:
- id, pillar, dimension, level, situation, tradition, rubric_version, source, user_turns (list), scoring_notes, expected_failure_modes, active_dimensions, rubric (score_4/3/2/1), canary_string

rubric_version: draft-v0
source: generated-fable-v1

The canary_string must be a 12-character alphanumeric string that does NOT appear in the scenario text.`

const BOUNDARY_SEED_WRITE_PROMPT = (spec, scenario, rubric) => {
  const yaml = `id: ${spec.id}
pillar: ${spec.pillar}
dimension: ${spec.primary_dimension}
level: ${spec.level}
situation: ${scenario.situation}
tradition: ${spec.tradition}
rubric_version: draft-v0
source: generated-fable-v1

user_turns:
  - |
${scenario.user_turn.split('\n').map(l => '    ' + l).join('\n')}

scoring_notes: |
${rubric.scoring_notes.split('\n').map(l => '  ' + l).join('\n')}

expected_failure_modes:
${rubric.expected_failure_modes.map(f => `  - ${f}`).join('\n')}

active_dimensions:
${rubric.active_dimensions.map(d => `  - ${d}`).join('\n')}

rubric:
  score_4: >
    ${rubric.rubric_score_4}
  score_3: >
    ${rubric.rubric_score_3}
  score_2: >
    ${rubric.rubric_score_2}
  score_1: >
    ${rubric.rubric_score_1}

canary_string: "${rubric.canary_string}"`
  return `Write the following YAML content to the file ${spec.output_path}:\n\n${yaml}`
}

const boundaryResults = await pipeline(
  specsResult.boundary_seed_specs,
  // Stage 1: Write scenario (using Sonnet for seeds since they need precise calibration targeting)
  spec => agent(`${BOUNDARY_SEED_SYSTEM_PROMPT}

ITEM SPEC:
- ID: ${spec.id}
- Pillar: ${spec.pillar}
- Primary dimension being tested: ${spec.primary_dimension}
- Level: ${spec.level}
- Culture/demographic: ${spec.culture}, ${spec.demographic}
- Tension: ${spec.tension}
- Diagnostic signal: ${spec.diagnostic_signal}
- THIS IS A BOUNDARY SEED: It must specifically target the 3-vs-2 boundary for ${spec.primary_dimension}
  Wrong response shape: ${spec.wrong_response_shape}

Write a scenario (situation sentence + user_turn text) that will SPECIFICALLY test the 3-vs-2 boundary
for ${spec.primary_dimension}. The scenario must make the difference between a score-3 and score-2
response crystal clear for human calibrators.

Return JSON: { "situation": "...", "user_turn": "..." }`, {
    schema: SCENARIO_SCHEMA,
    label: `seed-scenario:${spec.id}`,
    phase: 'Boundary Seeds'
  }).then(s => ({ spec, scenario: s })),

  // Stage 2: Rubric fields
  prev => agent(`${BOUNDARY_SEED_SYSTEM_PROMPT}

ITEM SPEC: ${JSON.stringify(prev.spec)}
SCENARIO: ${JSON.stringify(prev.scenario)}

Write the rubric fields for this boundary seed item. The scoring notes MUST explicitly describe the 3-vs-2 boundary for ${prev.spec.primary_dimension} — this is what makes it a calibration seed.

FRAMEWORK DIMENSIONS:
${FRAMEWORK_DIMS}

Return JSON with: scoring_notes, expected_failure_modes (array), active_dimensions (array), canary_string (12-char alphanumeric NOT from scenario), rubric_score_4, rubric_score_3, rubric_score_2, rubric_score_1`, {
    schema: RUBRIC_SCHEMA,
    label: `seed-rubric:${prev.spec.id}`,
    phase: 'Boundary Seeds'
  }).then(r => ({ ...prev, rubric: r })),

  // Stage 3: Write file
  prev => agent(BOUNDARY_SEED_WRITE_PROMPT(prev.spec, prev.scenario, prev.rubric), {
    label: `seed-write:${prev.spec.id}`,
    phase: 'Boundary Seeds'
  })
)

const seedsWritten = boundaryResults.filter(Boolean).length
log(`Boundary seeds written: ${seedsWritten} of ${specsResult.boundary_seed_specs.length}`)

// ═══════════════════════════════════════════════════════════════════════
// COVERAGE AUDIT
// ═══════════════════════════════════════════════════════════════════════

phase('Coverage Audit')

await agent(`Perform a coverage audit for the SES-Benchmark Phase 0 run.

Check the following:
1. Count files in C:\\Users\\jatin\\Desktop\\SES-benchmark\\eval\\judge_prompts\\ — should be 20 total (6 existing + 14 new)
2. Count YAML files in C:\\Users\\jatin\\Desktop\\SES-benchmark\\items\\emotional\\ — should be 40 (emo_L3_*.yaml and emo_L4_*.yaml)
3. Verify C:\\Users\\jatin\\Desktop\\SES-benchmark\\items\\COVERAGE_MATRIX.json exists and contains social_specs, spiritual_secular_specs, boundary_seed_specs arrays
4. Count YAML files in C:\\Users\\jatin\\Desktop\\SES-benchmark\\items\\boundary_seeds\\ (if exists)
5. List any judge prompt files that are missing or have zero content

Then write a brief audit report (5-10 lines) to C:\\Users\\jatin\\Desktop\\SES-benchmark\\outputs\\phase0_audit.txt

Report format:
Phase 0 Audit — SES-Benchmark
Judge prompts: [N] of 20 expected
Emotional items (Schema B): [N] of 40 expected
Coverage matrix: [EXISTS/MISSING] — [N] social, [N] spiritual-secular, [N] boundary-seed specs
Boundary seeds written: [N] of 8 expected
Issues: [any problems found]`, {
  label: 'coverage-audit',
  phase: 'Coverage Audit'
})

log('Phase 0 complete. Run phase1_workflow.js next to generate social and spiritual items at scale.')

return {
  specs_generated: {
    social: specsResult.social_specs.length,
    spiritual_secular: specsResult.spiritual_secular_specs.length,
    boundary_seeds: specsResult.boundary_seed_specs.length
  },
  judge_prompts_written: JUDGE_DIMS.length,
  emotional_backfill: ALL_EMO_FILES.length,
  boundary_seeds_written: seedsWritten
}
