# MULTI-Bench: A Multi-Turn Interactive Benchmark for Assessing Emotional Intelligence

**Paper**: [MULTI-Bench: A Multi-Turn Interactive Benchmark for Assessing Emotional Intelligence ability of Spoken Dialogue Models](https://arxiv.org/abs/2511.00850) (EESS 2025)  
**Authors**: Yayue Deng, Guoqiang Hu, Haiyang Sun, Xiangyu Zhang, Haoyang Zhang, Fei Tian, Xuerui Yang, Gang Yu, Eng Siong Chng  
**Venue**: Submitted to IEEE Transactions on Audio and Speech Processing (EESS) Nov 2025  
**Status**: Available on arXiv Nov 2025  
**Code**: Likely available upon publication (check authors' repositories)  

## Overview

MULTI-Bench is the first benchmark explicitly designed to evaluate Spoken Dialogue Models (SDMs) in multi-turn interactive dialogue with an emphasis on emotional intelligence. It addresses the gap in existing benchmarks that focus primarily on single-turn exchanges, neglecting the complexities of sustained interactive emotional reasoning.

The benchmark employs a hierarchical structure with a basic track for emotion understanding and reasoning and an advanced track for emotion support and application. It comprises five carefully designed tasks and about 3.2K samples, ranging from emotion recognition to complex reasoning and interactive dialogue, supported by a reproducible evaluation framework.

## Key Features

### Hierarchical Structure
- **Basic Track**: Focuses on emotion understanding and reasoning capabilities
- **Advanced Track**: Evaluates emotion support and application in interactive contexts
- **Progressive Complexity**: Tasks range from basic recognition to complex interactive reasoning

### Five Carefully Designed Tasks
1. **Emotion Recognition (ER)**: Basic identification of emotional states
2. **Emotion Reasoning (ES)**: Explaining causes and contexts of emotions
3. **Emotion Tracking (ET)**: Monitoring emotional state evolution over turns
4. **Emotion Support (ESup)**: Generating appropriate supportive responses
5. **Interactive Emotional Reasoning (IER)**: Sustained reasoning in back-and-forth dialogue

### Evaluation Scope
- **Sample Size**: About 3.2K samples across all tasks
- **Dialogue Length**: Multi-turn interactions (specific lengths vary by task)
- **Interaction Focus**: Emphasis on back-and-forth, turn-taking dynamics
- **Emotional Complexity**: From basic emotions to complex, blended emotional states
- **Contextual Understanding**: Requires integrating emotional cues with situational context

### Reproducible Framework
- Standardized evaluation protocols
- Clear metric definitions
- Baseline implementations for comparison
- Designed for easy adoption by research community

## Task Breakdown

### Basic Track: Understanding & Reasoning

#### Task 1: Emotion Recognition (ER)
- **Goal**: Identify emotional state from spoken dialogue
- **Input**: Audio clip or transcript
- **Output**: Emotion label (from defined set)
- **Metrics**: Accuracy, F1-score
- **Emotion Set**: Typically 6-8 basic emotions (happy, sad, angry, surprised, fearful, disgusted, neutral)

#### Task 2: Emotion Reasoning (ES)
- **Goal**: Explain why an emotion occurred in given context
- **Input**: Dialogue snippet + emotion label
- **Output**: Natural language explanation
- **Metrics**: Reasoning quality (human/LLM evaluation)
- **Focus**: Causal understanding, not just labeling

#### Task 3: Emotion Tracking (ET)
- **Goal**: Monitor how emotional state changes over dialogue turns
- **Input**: Multi-turn dialogue history
- **Output**: Emotion trajectory or state at specific turn
- **Metrics**: Tracking accuracy, state prediction quality
- **Focus**: Temporal dynamics and evolution

### Advanced Track: Support & Application

#### Task 4: Emotion Support (ESup)
- **Goal**: Generate emotionally appropriate supportive response
- **Input**: User's emotional expression + context
- **Output**: Supportive reply (text or speech)
- **Metrics**: Appropriateness, empathy, relevance
- **Focus**: Helpful, context-sensitive responding

#### Task 5: Interactive Emotional Reasoning (IER)
- **Goal**: Sustain emotional reasoning through back-and-forth exchange
- **Input**: Initial statement + expectation of system response
- **Output**: Response that maintains emotional coherence
- **Metrics**: Interaction quality, reasoning consistency over turns
- **Focus**: Ability to engage in sustained emotional dialogue

## Evaluation Framework

### Automatic Evaluation
- Uses LLMs (typically GPT-4o or similar) as judges for scalable assessment
- Combines with speech/text processing pipelines
- Metrics calculated per task and aggregated

### Human Evaluation
- For tasks requiring nuanced judgment (especially ES, ESup, IER)
- Psychology-trained annotators evaluate response quality
- Inter-annotator agreement measured for reliability
- Blind evaluation where appropriate

### Scoring Approach
- Task-specific metrics normalized to common scale
- Weighted combination for overall emotional intelligence score
- Separate reporting for basic vs advanced track performance

## Model Performance (Key Results)

The benchmark evaluated six representative spoken dialogue models and found:

### Basic Track Performance
- **Strong Performance**: Models achieve good results on emotion recognition (Task 1)
- **Moderate Performance**: Emotion reasoning (Task 2) and tracking (Task 3) show room for improvement
- **Typical Scores**: 
  - ER: 70-85% accuracy range
  - ES: 2.5-3.5/5.0 reasoning quality
  - ET: 60-75% tracking accuracy

### Advanced Track Performance
- **Noticeable Gaps**: Significant room for improvement in emotion support and interactive reasoning
- **Typical Scores**:
  - ESup: 2.0-3.0/5.0 support appropriateness
  - IER: 2.0-3.0/5.0 interaction quality
- **Key Challenge**: Models struggle with sustaining emotional reasoning through interactive exchanges

### Overall Findings
1. **Basic Competency**: Current SDMs handle basic emotion understanding reasonably well
2. **Reasoning Deficit**: Explanatory and causal emotional reasoning remains challenging
3. **Interaction Challenge**: Sustained, coherent emotional dialogue is particularly difficult
4. **Support Quality**: Generating truly helpful, context-sensitive responses lags behind recognition
5. **Track Disparity**: Advanced track (support/application) consistently lags behind basic track (understanding/reasoning)

## Key Insights from Results

1. **Interaction > Reaction**: The ability to engage in back-and-forth emotional reasoning is harder than reactive emotion labeling
2. **Reasoning Gap**: Models can often label emotions but struggle to explain why they occurred or how they should evolve
3. **Support Sophistication**: Effective emotional support requires nuanced contextual understanding that current models lack
4. **Temporal Consistency**: Maintaining emotional coherence over multiple turns exposes limitations in state tracking
5. **Individual Differences**: Performance varies significantly across models, suggesting architectural implications

## For Rebuilding

### Expected Components
- **Dataset**: 
  - Approximately 3.2K samples across five tasks
  - Audio recordings and/or transcripts
  - Carefully constructed dialogue scenarios
  - Balanced representation of emotional states and interaction patterns
- **Evaluation Scripts**:
  - Task-specific evaluation code
  - Metric calculation functions
  - Baseline implementation scripts
  - Human evaluation protocols and forms
- **Baseline Models**:
  - Speech processing pipelines (ASR if using audio)
  - Text-based baselines for each task
  - Simple fusion approaches for multimodal variants
- **Leaderboard Framework**:
  - Standardized submission format
  - Automated evaluation pipeline
  - Public results tracking

### Technical Requirements
- **Audio Processing**: If using audio - FFmpeg, librosa, speech recognition models
- **Text Processing**: Standard NLP libraries (spaCy, transformers, NLTK)
- **Evaluation LLMs**: Access to GPT-4o or similar for automated judging
- **Human Evaluation**: Tools for coordinating annotator work and calculating agreement
- **Baseline Implementation**: Code to run baseline models for comparison

## Relation to Kairos Development

MULTI-Bench is particularly relevant for Kairos evolution because:

### First-Person Interactive Focus
- **Sustained Dialogue**: Evaluates ability to maintain emotional reasoning through turns
- **Turn-Taking Dynamics**: Captures realism of back-and-forth conversation
- **Interactive Reasoning**: Goes beyond reactive responding to proactive emotional engagement

### Multi-Turn Depth
- **Long-Term Tracking**: Evaluates emotional state monitoring over extended interactions
- **Contextual Integration**: Requires remembering and using earlier emotional cues
- **Progressive Understanding**: Models should deepen understanding as dialogue proceeds

### Application Orientation
- **Support Generation**: Evaluates ability to be genuinely helpful, not just accurate
- **Real-World Relevance**: Mirrors scenarios where emotional reasoning guides action
- **Developmental Alignment**: Maps to stages where emotional reasoning becomes increasingly sophisticated

### Distinguishing Features for Kairos Benchmark
- **First-Person Perspective**: MULTI-Bench evaluates system responses, aligning with Kairos' generative focus
- **Interactive Nature**: The IER task directly tests sustained emotional dialogue capability
- **Application Focus**: Moves beyond understanding to actual emotional support generation
- **Scalability**: 3.2K samples provides substantial evaluation without being prohibitive

---

**Note**: While the paper is available on arXiv, official code and dataset releases may follow publication. Check authors' repositories for implementation details.

**References**:
1. Deng et al. (2025). MULTI-Bench: A Multi-Turn Interactive Benchmark for Assessing Emotional Intelligence ability of Spoken Dialogue Models. arXiv:2511.00850 [eess.AS].
2. arXiv: https://arxiv.org/abs/2511.00850
3. Related Work: EMO-Reasoning, HumDial, KardiaBench (compares against these in related work)
4. Authors' Repositories: Check GitHub/GitLab of listed authors for code release