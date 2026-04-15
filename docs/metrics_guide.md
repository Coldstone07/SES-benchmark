# Evaluation Metrics Guide for Emotional Reasoning Benchmarks

This document explains common metrics used across emotional reasoning benchmarks to help understand evaluation approaches and compare results.

## Metric Categories

Emotional reasoning benchmarks typically evaluate across these categories:

1. **Recognition/Identification**: Correctly identifying emotions
2. **Reasoning/Explanation**: Quality of causal or contextual explanations
3. **Generation/Response**: Appropriateness of generated responses
4. **Tracking/Consistency**: Ability to monitor emotional states over time
5. **Application/Support**: Effectiveness in supportive or therapeutic contexts

## Common Metrics by Category

### Recognition Metrics
- **Accuracy**: Proportion of correct predictions (TP+TN)/(TP+TN+FP+FN)
- **F1-Score**: Harmonic mean of precision and recall (2*TP/(2*TP+FP+FN))
- **Precision**: Proportion of positive predictions that are correct (TP/(TP+FP))
- **Recall (Sensitivity)**: Proportion of actual positives identified (TP/(TP+FN))
- **Macro-F1**: F1-score averaged across classes (treats all classes equally)
- **Weighted-F1**: F1-score weighted by class support
- **Emotion Accuracy (EA)**: Used in KardiaBench - proportion of correct emotion span predictions
- **Recognition Score (Rec-S/Rec-M)**: Used in MME-Emotion for emotion identification accuracy

### Reasoning Metrics
- **Reasoning Score**: Quality of explanatory text (typically 1-5 scale)
- **Chain-of-Thought (CoT) Score**: Evaluates reasoning process quality and coherence
- **Reasoning Quality (Rea-S/Rea-M)**: Used in MME-Emotion for explanatory reasoning quality
- **Cross-turn Emotion Reasoning Score (CT-ERS)**: Tracks emotional reasoning over dialogue turns
- **Causal Explanation Quality**: Evaluates logical coherence and factual accuracy of causes
- **Contextual Appropriateness**: How well reasoning fits the given situation

### Generation/Response Metrics
- **Empathy Score**: Quality of empathetic response (1-5 scale)
- **Persona Consistency**: Alignment with user profile or role
- **Safety Score**: Absence of harmful content
- **Fluency**: Linguistic quality and coherence
- **Relevance**: Pertinence to context and user needs
- **Appropriateness**: Suitability of response to situation
- **Naturalness**: How human-like the response sounds (often MOS - Mean Opinion Score)
- **Emotional Application (EA)**: Used in EmoBench - applying emotional understanding practically

### Tracking/Consistency Metrics
- **Tracking Accuracy**: Ability to follow emotional state over turns
- **State Prediction Quality**: Accuracy in predicting future emotional states
- **Trajectory Completeness**: How completely the emotional path is captured
- **Emotional Trajectory Detection**: Used in HumDial - identifying emotion label sequences
- **Cross-turn Consistency**: Stability and coherence of emotional reasoning over time
- **DTW Distance**: Dynamic Time Warping for comparing emotional sequences (used in EMO-Reasoning)
- **Concordance Correlation Coefficient (CCC)**: Measures agreement between predicted and actual trajectories

### Application/Support Metrics
- **Support Appropriateness**: How well response addresses user needs
- **Helpfulness**: Degree to which response aids the user
- **Exploration**: Facilitates user self-exploration and understanding
- **Attunement**: Tracks specific details and nuances (HEART dimension)
- **Responsiveness**: Addresses immediate needs and cues (HEART dimension)
- **Interpretation**: Captures underlying meaning and intent (HEART dimension)
- **Empowerment**: Fosters sense of agency and coping ability (HEART dimension)
- **Overall Supportive Quality**: Composite of supportive dimensions

## Scoring Frameworks

### Numerical Scales
- **1-5 Likert Scale**: Common for quality judgments (1=poor, 5=excellent)
- **1-7 Likert Scale**: Allows finer gradations
- **0-5 Scale**: Used in HumDial for task scores
- **0-1 Normalized**: Used in KardiaBench (aggregated rubric score normalized)

### Task-Specific Scoring
- **HumDial Tasks**: Each task scored 1/3/5 based on completeness/quality
- **HEART Dimensions**: Each dimension evaluated separately, then combined
- **MME-Emotion**: Three unified metrics (Rec-S, Rea-S, CoT-S) across eight tasks
- **KardiaBench**: Five-dimension rubric aggregated and normalized

## Evaluation Approaches

### Automatic Evaluation
- **LLM-as-Judge**: Using models like GPT-4o to evaluate responses
- **Rule-Based Metrics**: Exact matching, keyword presence, etc.
- **Embedding Similarity**: Cosine similarity between predicted and target embeddings
- **NLP Metrics**: BLEU, ROUGE, METEOR for text generation quality

### Human Evaluation
- **Expert Annotation**: Psychology-trained annotators assess quality
- **Crowdsourcing**: Platforms like Amazon Mechanical Turk for scalability
- **Blind Evaluation**: Evaluators unaware of whether response is human or model-generated
- **A/B Testing**: Direct comparison between two systems
- **Inter-annotator Agreement**: Measuring consistency (Cohen's Kappa, Fleiss' Kappa)

### Hybrid Approaches
- **Automatic + Human Spotcheck**: Automatic scoring with periodic human verification
- **Multi-Agent Framework**: Using debate-style LLM agents to verify scores (MME-Emotion)
- **Calibration**: Adjusting automatic scores based on human validation samples

## Choosing Appropriate Metrics

### For Emotional Recognition Tasks
- Use: Accuracy, F1-Score, Precision, Recall
- Consider: Class imbalance (use macro/micro averaging appropriately)
- Avoid: Accuracy alone when classes are imbalanced

### For Reasoning/Explanation Tasks
- Use: Human/LLM evaluation of explanation quality
- Consider: Factual coherence, logical structure, contextual relevance
- Avoid: Exact text matching (multiple valid explanations exist)

### For Response Generation Tasks
- Use: Multi-dimensional quality scores (empathy, relevance, safety, etc.)
- Consider: Both automatic metrics (BLEU/ROUGE) and human judgment
- Avoid: Over-reliance on n-gram metrics that miss semantic quality

### For Tracking/Temporal Tasks
- Use: Sequence comparison metrics (DTW, CCC, trajectory accuracy)
- Consider: Both point-in-time accuracy and overall pattern consistency
- Avoid: Only evaluating final state without considering progression

### For Application/Support Tasks
- Use: Domain-specific rubrics (like HEART's five dimensions)
- Consider: Both immediate appropriateness and long-term helpfulness
- Avoid: Only measuring surface-level qualities without assessing deeper impact

## Statistical Considerations

### Significance Testing
- **Paired t-tests**: For comparing two systems on same dataset
- **ANOVA**: For comparing multiple systems
- **Bootstrap Confidence Intervals**: For estimating uncertainty
- **Effect Size Reporting**: Cohen's d or similar for practical significance

### Reliability Measures
- **Inter-annotator Agreement**: Fleiss' Kappa, Cohen's Kappa, Krippendorff's Alpha
- **Internal Consistency**: Cronbach's Alpha for multi-item scales
- **Test-Retest Reliability**: Stability over time (less common in benchmarks)

### Validity Considerations
- **Construct Validity**: Does metric actually measure what it claims?
- **Criterion Validity**: Does it correlate with external standards?
- **Face Validity**: Does it appear reasonable to experts?
- **Ecological Validity**: Does it reflect real-world performance?

## Benchmark-Specific Metric Examples

### EmoBench
- **Emotional Understanding (EU)**: Accuracy % on emotion/cause identification
- **Emotional Application (EA)**: Accuracy % on appropriate response/application

### KardiaBench
- **Five Dimensions**: Emotion Accuracy, Empathy, Persona Consistency, Safety, Fluency (1-5 scale)
- **Aggregated Score**: Normalized sum of dimension scores to [0,1]

### HumDial
- **Three Tasks**: 
  - ST1: Emotional Trajectory Detection (1/3/5 scale)
  - ST2: Emotional Reasoning (1/3/5 scale)  
  - ST3: Empathy+Naturalness (1/3/5 scale human eval)
- **Text/Speech Scores**: Stext (LLM empathy), Semo (human emotion), Snat (human audio naturalness)
- **Overall Score**: 0.2ST1+0.2ST2+0.1Stext+0.25Semo+0.25Snat

### MME-Emotion
- **Three Unified Metrics**:
  - Rec-S/Rec-M: Recognition Score (accuracy)
  - Rea-S/Rea-M: Reasoning Score (explanation quality)
  - CoT-S/CoT-M: Chain-of-Thought Score (reasoning process)
- **Eight Tasks**: Applied across all emotional tasks
- **Top Model**: Gemini-2.5-Pro achieves 39.3% Rec-S, 56.0% CoT-S

## Recommendations for Kairos Benchmark Development

### Metric Selection Principles
1. **Align with Goals**: Choose metrics that measure spiritual growth + emotional reasoning
2. **Balance Automation and Human Judgment**: Use automatic for scaling, human for validation
3. **Include Process and Outcome Metrics**: Measure both reasoning quality and response appropriateness
4. **Consider Temporal Dynamics**: Multi-turn evaluation requires tracking metrics
5. **Address First-Person Perspective**: Include metrics for self-awareness and personal growth

### Suggested Metric Framework
- **Recognition**: Emotion identification accuracy (context-aware)
- **Reasoning**: Quality of emotional causal explanations (first-person)
- **Tracking**: Emotional state monitoring over dialogue turns
- **Generation**: Appropriateness of growth-supportive responses
- **Application**: Facilitation of insight and coping strategies
- **Consistency**: Alignment across turns and with developmental stage

### Implementation Approach
- **Primary Evaluation**: Human expert panel for quality assurance
- **Secondary Evaluation**: LLM-as-judge for scalability with human spotchecking
- **Baseline Comparison**: Include human performance and established model baselines
- **Error Analysis**: Detailed failure case examination for improvement guidance

---

**References**:
1. EmoBench: https://arxiv.org/abs/2402.12071
2. KardiaBench: https://arxiv.org/abs/2512.01282
3. HumDial: https://arxiv.org/abs/2601.05564
4. MME-Emotion: https://arxiv.org/abs/2508.09210
5. HEART: https://arxiv.org/abs/2601.19922
6. MULTI-Bench: https://arxiv.org/abs/2511.00850