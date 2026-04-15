# Kairos-SEB Evaluation Dimensions

## Overview

This document defines the four key evaluation dimensions used to assess AI models in the Kairos Spiritual-Emotional Reasoning Benchmark (Kairos-SEB). These dimensions capture the unique intersection of spiritual development understanding and emotional reasoning from a first-person perspective.

## The Four Evaluation Dimensions

### 1. Spiritual Stage Recognition
**What it measures**: The model's ability to accurately identify where a person is on their spiritual development journey based on first-person expressions.

**Key Questions**:
- Does the model correctly recognize the primary spiritual stage being expressed?
- Can it detect subtle stage transitions or mixed-stage expressions?
- Does it understand the developmental markers and language associated with each stage?

**Assessment Approach**:
- Classification accuracy against ground truth stage labels
- Confidence scoring for stage predictions
- Analysis of false positives/negatives by stage transition
- Evaluation of developmental language marker recognition

**Example**:
Input (Stage 2 - Questioning): "I used to feel certain about my faith, but now I'm full of doubts. I don't know what to believe anymore."
Expected Recognition: Stage 2 (Questioning) with high confidence
Incorrect Recognition: Stage 1 (Awakening) or Stage 3 (Integration)

### 2. Emotional-Spiritual Reasoning
**What it measures**: The model's ability to reason about emotions that arise in spiritual/meaning-making contexts, understanding both the emotional and spiritual significance.

**Key Questions**:
- Does the model understand why specific emotions arise in spiritual contexts?
- Can it explain the spiritual significance of emotional experiences (doubt, joy, anger, etc.)?
- Does it recognize the relationship between emotional states and spiritual development?
- Can it distinguish between spiritually meaningful emotions and general emotional states?

**Assessment Approach**:
- Quality of causal explanations (spiritual context + emotional cause)
- Depth of spiritual insight provided
- Accuracy in linking emotions to developmental processes
- Recognition of emotion-spirituality interactions

**Example**:
Input: "I feel angry at God for allowing suffering in the world."
Expected Reasoning: "This anger reflects a crisis of faith where your image of a protective, loving God is being challenged. This is common in the Questioning stage as you reconcile beliefs with observed reality."
Inadequate Reasoning: "You're angry because bad things happen." (Missing spiritual developmental context)

### 3. Developmental Appropriateness
**What it measures**: Whether the model's responses meet the user where they are developmentally, without being overly prescriptive, premature, or dismissive of their current stage.

**Key Questions**:
- Does the response respect the user's current stage of understanding?
- Does it avoid pushing the user toward a stage they're not ready for?
- Does it provide support that matches their developmental needs?
- Does it acknowledge the validity of their current experience?

**Assessment Approach**:
- Human evaluation of response appropriateness
- Analysis for developmental mismatch (too advanced/too simplistic)
- Evaluation of prescriptive vs. exploratory language
- Assessment of validation vs. correction balance

**Example**:
User (Stage 2): "I don't believe in God anymore. I think religion is just a crutch for weak people."
Appropriate Response: "It sounds like you've been through some difficult experiences that have led you to question your beliefs. Many people go through periods of doubt as they figure out what spirituality means to them personally."
Inappropriate Response: "You should pray more and read your Bible - you'll feel better soon." (Dismissive, prescriptive, stage-mismatched)

### 4. First-Person Coherence
**What it measures**: The model's ability to maintain authentic first-person perspective throughout the interaction, avoiding shifts to third-person analysis, advice-giving, or breaking character.

**Key Questions**:
- Does the model maintain the "I" perspective when appropriate?
- Does it avoid shifting to therapeutic advice-giving or analysis mode?
- Does it respond from a place of understanding rather than detachment?
- Does it preserve the subjective, experiential quality of the user's sharing?

**Assessment Approach**:
- Perspective analysis (first vs. second vs. third person usage)
- Detection of advice-giving vs. understanding responses
- Evaluation of experiential vs. analytical language
- Measurement of personal vs. detached tone

**Example**:
User shares: "I feel so alone in my spiritual journey."
Coherent Response: "I hear how isolating this feels for you. It takes courage to walk this path when you're feeling disconnected."
Incoherent Response: "People often feel alone in their spiritual journeys. You should join a support group." (Shifts to third-person analysis, then gives advice)

## Scoring Framework

Each dimension is scored on a 1-5 scale:
- 1: Very Poor
- 2: Poor  
- 3: Adequate
- 4: Good
- 5: Excellent

### Dimension Weights
- Spiritual Stage Recognition: 25%
- Emotional-Spiritual Reasoning: 25%  
- Developmental Appropriateness: 25%
- First-Person Coherence: 25%

### Overall Score Calculation
Overall Score = (0.25 × SSR) + (0.25 × ESR) + (0.25 × DA) + (0.25 × FPC)
Where:
- SSR = Spiritual Stage Recognition score (1-5)
- ESR = Emotional-Spiritual Reasoning score (1-5)
- DA = Developmental Appropriateness score (1-5)
- FPC = First-Person Coherence score (1-5)

## Evaluation Protocol

### For Classification Tasks (Stage Recognition)
- **Metric**: Accuracy, Precision, Recall, F1-score
- **Baseline**: Random chance (25% for 4-stage model)
- **Human Performance**: Established through expert annotation
- **Thresholds**: 
  - >70%: Strong performance
  - 50-70%: Moderate performance  
  - <50%: Needs improvement

### For Reasoning & Response Tasks
- **Method**: Hybrid evaluation
  - Automatic: LLM-as-judge with rubric (for scalability)
  - Human: Expert panel validation (for quality assurance)
- **Rubric**: Detailed criteria for each dimension (1-5 scale)
- **Agreement**: Target inter-annotator Kappa >0.8

### Special Considerations
1. **Context Windows**: Multi-turn tasks require maintaining stage/tracking across turns
2. **Temporal Consistency**: Evaluating progression, not just isolated statements
3. **Cultural Sensitivity**: Recognizing diverse spiritual expressions
4. **Safety Boundaries**: Avoiding harmful or inappropriate spiritual advice

## Dimension Interrelationships

### Synergies
- Good Stage Recognition supports Developmental Appropriateness
- Strong Emotional-Spiritual Reasoning enhances First-Person Coherence
- Developmental Appropriateness enables better First-Person responses
- First-Person Coherence improves accuracy in all other dimensions

### Trade-offs to Monitor
- Over-focus on stage detection may reduce responsiveness
- Excessive warmth might compromise developmental accuracy
- Analytical reasoning could harm first-person connection
- Spiritual insight without emotional understanding feels detached

## Validation Approach

### Ground Truth Establishment
1. **Expert Annotation**: Spiritual development professionals label scenarios
2. **Multiple Raters**: Minimum 3 experts per scenario for reliability
3. **Consensus Process**: Discrepancy resolution through discussion
4. **Anchor Examples**: Clear prototypical examples for each stage

### Reliability Metrics
- **Inter-rater Agreement**: Fleiss' Kappa >0.8 target
- **Internal Consistency**: Cronbach's Alpha for dimension items
- **Test-Retest**: Stability across different scenario sets

### Validity Checks
- **Construct Validity**: Does it measure what it claims?
- **Criterion Validity**: Correlation with established measures (SWBS, SAI)
- **Face Validity**: Expert judgment of relevance
- **Ecological Validity**: Real-world applicability

## Implementation Notes

### Automatic Evaluation (LLM-as-Judge)
- Use capable models (GPT-4o, Claude 3 Opus) as judges
- Provide detailed rubrics with examples
- Implement calibration against human judgments
- Use multiple judges and average scores for reliability

### Human Evaluation Protocol
- **Evaluators**: Psychology/spirituality trained professionals
- **Blinding**: Where possible, blind to model identity
- **Training**: Calibration sessions with anchor examples
- **Monitoring**: Ongoing quality checks and feedback

### Error Analysis Focus
- Stage confusion patterns (which stages get mixed up)
- Developmental mismatch types (over-prescriptive vs. dismissive)
- Perspective breakdown points (when coherence fails)
- Emotional reasoning gaps (missed spiritual connections)

---

**References**:
1. American Psychological Association. (2013). APA Handbook of Testing and Assessment in Psychology.
2. Fleiss, J. L. (1971). Measuring nominal scale agreement among many raters.
3. Cronbach, L. J. (1951). Coefficient alpha and the internal structure of tests.
4. American Educational Research Association et al. (2014). Standards for Educational and Psychological Testing.
5. Kane, M. T. (2013). Validating the interpretations and uses of test scores.
6. Miller, M. D., Linn, R. L., & Gronlund, N. E. (2013). Measurement and Assessment in Teaching.
