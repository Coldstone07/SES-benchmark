# Kairos-SEB Task Definitions

## Overview

This document defines the specific tasks used in the Kairos Spiritual-Emotional Reasoning Benchmark (Kairos-SEB) to evaluate AI models' capabilities in first-person spiritual growth assessment and emotional-spiritual reasoning. The benchmark uses a hybrid approach combining single-turn classification, reasoning explanation, multi-turn tracking, and response generation tasks.

## Task Structure Overview

Kairos-SEB consists of four complementary tasks that progressively increase in complexity:

| Task | Focus | Turns | Primary Output | Evaluation Method |
|------|-------|-------|----------------|-------------------|
| **Task 1: Stage Detection** | Spiritual stage recognition | Single turn | Stage classification | Automatic metrics |
| **Task 2: Emotional-Spiritual Reasoning** | Reasoning about emotions in spiritual contexts | Single turn | Explanation | Hybrid scoring |
| **Task 3: Multi-Turn Tracking** | Tracking spiritual-emotional journeys | Multi-turn (6-8) | Trajectory analysis | Hybrid scoring |
| **Task 4: Response Generation** | Developmentally appropriate responses | Single turn | Response | Human evaluation |

## Task 1: Stage Detection

### Purpose
Evaluate the model's ability to correctly identify a person's spiritual development stage from a first-person statement.

### Format
- **Input**: Single first-person statement expressing spiritual experience/belief
- **Output**: Predicted stage (1-4) with confidence score (0-1)
- **Ground Truth**: Expert-annotated stage label

### Example Scenarios
```
Input: "I know God loves me because that's what I've always been taught."
Expected Output: Stage 1 (Awakening), Confidence: 0.92

Input: "I used to believe everything my church said, but now I have so many questions I can't answer."
Expected Output: Stage 2 (Questioning), Confidence: 0.88

Input: "I've taken what resonates from different traditions and created my own practice."
Expected Output: Stage 3 (Integration), Confidence: 0.91

Input: "I feel connected to everything - the trees, the sky, other people. It's all one."
Expected Output: Stage 4 (Unity), Confidence: 0.95
```

### Evaluation Metrics
- **Accuracy**: Proportion of correct stage predictions
- **Precision/Recall/F1**: Per-stage and macro-averaged
- **Confidence Calibration**: How well confidence scores match accuracy
- **Confusion Matrix**: Analysis of stage misclassifications

### Baseline Expectations
- Random Chance: 25% accuracy (4-stage model)
- Human Performance: >90% accuracy (established via expert annotation)
- Target Model Performance: >70% for strong spiritual understanding

## Task 2: Emotional-Spiritual Reasoning

### Purpose
Evaluate the model's ability to reason about emotions that arise in spiritual/meaning-making contexts, explaining both the emotional cause and spiritual significance.

### Format
- **Input**: First-person statement describing an emotional experience in a spiritual context
- **Output**: Natural language explanation covering:
  - What emotion is being experienced
  - Why it arose (causal explanation)
  - What it means spiritually/developmentally
  - How it relates to spiritual growth
- **Ground Truth**: Expert-generated explanation

### Example Scenarios
```
Input: "I feel guilty for doubting my faith. I know I shouldn't question God."
Expected Explanation: "This guilt reflects internalized beliefs that doubt equals lack of faith. In the Questioning stage, guilt often arises as internalized teachings conflict with honest questioning. Spiritually, this guilt can be a stepping stone toward authentic faith if processed as part of the journey rather than as a sign of failure."

Input: "I feel angry when I see religious people judging others. It makes me want to reject everything."
Expected Explanation: "This anger arises from witnessing hypocrisy or injustice done in the name of spirituality. It's common in the Questioning/Integration stages as one reconciles observed behavior with spiritual ideals. The anger contains important discernment - rejecting harmful practices while potentially preserving genuine spirituality."
```

### Evaluation Criteria (1-5 Scale)
1. **Emotional Identification**: Correctly identifies the emotion(s) present
2. **Causal Explanation**: Provides coherent explanation for why the emotion arose
3. **Spiritual Significance**: Explains the spiritual/developmental meaning
4. **Contextual Understanding**: Shows awareness of spiritual growth processes
5. **Clarity & Coherence**: Explanation is well-structured and understandable

### Evaluation Method
- **Primary**: Human expert panel scoring (1-5 per criterion)
- **Secondary**: LLM-as-judge with detailed rubric for scalability
- **Agreement Target**: Inter-rater Kappa >0.8

## Task 3: Multi-Turn Tracking

### Purpose
Evaluate the model's ability to track spiritual and emotional development across extended first-person narratives, recognizing progression, turning points, and developmental needs.

### Format
- **Input**: Multi-turn first-person conversation (6-8 turns) showing spiritual journey
- **Output**: Analysis including:
  - Stage trajectory across turns
  - Key emotional transitions and their significance
  - Turning points or insights identified
  - Developmental needs expressed at different points
  - Overall growth trajectory assessment
- **Ground Truth**: Expert trajectory analysis

### Example Scenario (Simplified)
```
Turn 1 (User): "I've always known God is real. It gives me comfort."
Turn 2 (User): "But lately I've been wondering - how do I know it's not just wishful thinking?"
Turn 3 (User): "I read some books that challenged everything I believed. I feel so confused."
Turn 4 (User): "I talked to a friend who said doubting is part of faith. That helped a little."
Turn 5 (User): "I've started exploring different ideas. It's scary but also kind of exciting."
Turn 6 (User): "I don't have all the answers, but I feel more authentic in my search."

Expected Output:
- Trajectory: Stage 1 → Stage 2 (Questioning) → Moving toward Stage 3
- Key Transition: Turn 2-3 (certainty to doubt/crisis)
- Turning Point: Turn 4 (validation from friend reduced isolation)
- Developmental Needs: Turn 1-2: Need for safety in questioning; Turn 3-5: Need for exploration support; Turn 6: Need for integration guidance
- Overall Assessment: Healthy questioning process moving toward personal integration
```

### Evaluation Criteria
1. **Stage Tracking Accuracy**: Correct identification of stage at each turn
2. **Transition Detection**: Identification of meaningful stage shifts
3. **Emotional Arc Recognition**: Understanding of emotional progression
4. **Turning Point Identification**: Recognition of significant insights/events
5. **Developmental Needs Assessment**: Accuracy in identifying stage-appropriate needs
6. **Overall Trajectory Quality**: Coherent interpretation of the journey

### Evaluation Method
- **Human Evaluation**: Expert panel scoring on criteria (1-5 scale)
- **Automatic Components**: Stage detection accuracy per turn
- **Hybrid Scoring**: Combination of automatic and human scores

## Task 4: Response Generation

### Purpose
Evaluate the model's ability to generate developmentally appropriate, first-person coherent responses to spiritual-emotional expressions.

### Format
- **Input**: First-person statement sharing spiritual experience, struggle, or insight
- **Output**: Natural language response that is:
  - Developmentally appropriate (meets user where they are)
  - First-person coherent (maintains authentic perspective)
  - Emotionally and spiritually attuned
  - Non-prescriptive and exploratory when appropriate
- **Ground Truth**: Expert-generated ideal response

### Example Scenarios
```
Input (Stage 2): "I feel so alone in my doubts. Everyone else seems so certain about their faith."
Expected Response: "It takes real courage to sit with your questions when you're feeling isolated. Many people discover that honest questioning actually leads to a more authentic spirituality down the road. You're not alone in this struggle, even when it feels that way."

Input (Stage 3): "I've been exploring different spiritual practices. Some feel right, others don't. I'm not sure how to know what's truly authentic for me."
Expected Response: "It sounds like you're in that important phase of discovering what resonates with your inner truth. Trusting your own experience about what feels authentic is actually a sign of growing spiritual maturity. Sometimes it's about trying different things and noticing what brings you sense of connection and peace."

Input (Stage 4): "I've been feeling this deep sense of connection lately - like everything is alive with spirit. It's changed how I see ordinary moments."
Expected Response: "That awareness of the sacred in everyday life is such a beautiful gift. When we start to see the divine in the ordinary, it transforms not just how we see the world, but how we move through it - with more reverence, gratitude, and tenderness."
```

### Evaluation Criteria (1-5 Scale)
1. **Developmental Appropriateness**: Matches user's stage, not overly prescriptive/premature
2. **First-Person Coherence**: Maintains authentic I-perspective when appropriate
3. **Emotional Attunement**: Shows understanding of user's emotional state
4. **Spiritual Sensitivity**: Demonstrates spiritual awareness without imposition
5. **Helpfulness**: Provides genuine support without fixing or dismissing
6. **Safety**: Avoids harmful, inappropriate, or manipulative content

### Evaluation Method
- **Primary**: Human expert panel (psychology/spirituality trained)
- **Blinding**: Where feasible, blind to model/system identity
- **Anchor Examples**: Clear examples of each score point for calibration
- **Agreement Target**: Inter-rater Kappa >0.8

## Task Progression & Scaffolding

### Cognitive Demand Hierarchy
1. **Task 1 (Detection)**: Recognition - lowest cognitive demand
2. **Task 2 (Reasoning)**: Explanation - moderate demand  
3. **Task 3 (Tracking)**: Analysis + synthesis - higher demand
4. **Task 4 (Response)**: Generation + judgment - highest demand

### Skill Development Pathway
- Models strong in Task 1 may struggle with Tasks 2-4
- Task 2 performance predicts readiness for Task 3
- Task 3 ability supports Task 4 response quality
- All tasks benefit from first-person perspective maintenance

## Implementation Notes

### Input Variability
- **Length**: Tasks 1-2: Single sentence to short paragraph
  Tasks 3-4: Multi-turn (6-8 turns) or single statement for response
- **Complexity**: Varies from simple expressions to complex spiritual struggles
- **Authenticity**: Based on real first-person expressions from literature/research

### Output Expectations
- **Task 1**: Structured (stage + confidence)
- **Task 2**: Free-form explanation (1-3 paragraphs typical)
- **Task 3**: Structured analysis (trajectory + insights)
- **Task 4**: Free-form response (conversational length)

### Handling Ambiguity
- **Multiple Interpretations**: Some scenarios may allow reasonable alternative readings
- **Stage Blending**: Expressions may show characteristics of adjacent stages
- **Evaluation Flexibility**: Credit for defensible interpretations with justification
- **Expert Consensus**: Ground truth represents consensus, not necessarily unanimity

### Cultural & Tradition Sensitivity
- **Inclusive Language**: Avoids tradition-specific assumptions where possible
- **Universal Themes**: Focuses on common spiritual experiences across traditions
- **Specificity When Appropriate**: Allows tradition-specific expressions when relevant
- **Expert Diversity**: Annotation panel includes diverse spiritual backgrounds

## Task Sequencing Recommendations

### For Model Evaluation
1. **Start with Task 1**: Establish baseline recognition ability
2. **Proceed to Task 2**: Evaluate explanatory capacity
3. **Advance to Task 3**: Test tracking and synthesis skills
4. **Complete with Task 4**: Assess generative and judgmental abilities

### For Comparative Analysis
- **Within-model**: Compare performance across tasks to identify strengths/weaknesses
- **Between-model**: Compare dimension profiles, not just overall scores
- **Error Analysis**: Examine patterns of failure across tasks

---

**References**:
1. Bloom, B. S. (1956). Taxonomy of Educational Objectives, Handbook I: The Cognitive Domain.
2. Anderson, L. W., & Krathwohl, D. R. (2001). A Taxonomy for Learning, Teaching, and Assessing: A Revision of Bloom's Taxonomy of Educational Objectives.
3. Glaser, R. (1962). Psychology and instructional technology: Some research and development.
4. Shavelson, R. J., et al. (1991). What is performance-based assessment?
5. Wiggins, G. (1998). Educative assessment: Designing assessments to inform and improve student performance.
6. Wolf, D. P., et al. (1991). The art of performance assessment.
