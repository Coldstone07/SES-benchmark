# MME-Emotion: A Holistic Evaluation Benchmark for Emotional Intelligence in Multimodal Large Language Models

**Paper**: [MME-Emotion: A Holistic Evaluation Benchmark for Emotional Intelligence in Multimodal Large Language Models](https://arxiv.org/abs/2508.09210) (ICLR 2026 Poster)  
**Authors**: Fan Zhang, Zebang Cheng, Chong Deng, Haoxuan Li, Zheng Lian, Qian Chen, Huadai Liu, Wen Wang, Yi-Fan Zhang, Renrui Zhang, et al.  
**Code & Dataset**: [GitHub Repository](https://github.com/FunAudioLLM/MME-Emotion)  
**Venue**: ICLR 2026 Poster  
**Leaderboard**: [GitHub Leaderboard Section](https://github.com/FunAudioLLM/MME-Emotion#leaderboard)  

## Overview

MME-Emotion is the largest emotional intelligence benchmark for Multimodal Large Language Models (MLLMs), containing over 6,500 curated video clips with task-specific questioning-answering (QA) pairs. It assesses both emotional understanding and reasoning capabilities through eight emotional tasks spanning broad scenarios. The benchmark introduces a holistic evaluation suite with unified protocols and a multi-agent system framework for analysis.

As part of the MME (Multimodal Benchmark) family, MME-Emotion extends the general MME benchmark to focus specifically on affective computing and emotional intelligence in multimodal settings.

## Key Features

- **Scale**: 6,500+ curated video clips with task-specific QA pairs (>6,500 QA pairs total)
- **Eight Emotional Tasks**: 
  1. Rec-S (Recognition - Single label): Basic emotion recognition
  2. Rea-S (Reasoning - Single label): Emotional reasoning about causes
  3. Rec-M (Recognition - Multiple label): Multi-label emotion recognition
  4. Rea-M (Reasoning - Multiple label): Multi-label emotional reasoning
  5. CoT-S (Chain-of-Thought - Single label): Reasoning process for single-label
  6. CoT-M (Chain-of-Thought - Multiple label): Reasoning process for multi-label
  7. FG-ER (Fine-Grained Emotion Recognition): Subtle/nnuanced emotion detection
  8. Noise-ER (Noise-resistant Emotion Recognition): Emotion recognition in noisy conditions
- **Three Unified Metrics**:
  - **Recognition Score (Rec-S/Rec-M)**: Accuracy for emotion identification
  - **Reasoning Score (Rea-S/Rea-M)**: Quality of explanatory reasoning
  - **Chain-of-Thought Score (CoT-S/CoT-M)**: Reasoning process quality and coherence
- **Modalities**: Video/Audio/Text (each video clip includes corresponding audio and text transcripts)
- **Diverse Settings**: Controlled lab conditions, wild/in-the-wild scenarios, noisy environments
- **Multi-Agent Framework**: Analysis through debate-style LLM agent system for robust evaluation
- **Unified Protocols**: Consistent evaluation across all tasks and modalities

## Task Categories

### Basic Emotion Tasks (6 categories + neutral)
- Happy, Sad, Angry, Surprised, Fearful, Disgusted, Neutral

### Complex Scenario Coverage
- **Controlled**: Lab-recorded emotional expressions
- **Wild/In-the-wild**: Naturalistic emotional expressions from real-world settings
- **Noisy Conditions**: Audio/visual impairments simulating real-world deployment challenges
- **Temporal Dynamics**: Emotional transitions and evolving states over time
- **Contextual Understanding**: Emotions interpreted within situational context

## Evaluation Suite

### Automatic Evaluation Strategy
- Uses MLLM-as-judge approach (typically GPT-4o) for scalable, reliable evaluation
- Aligns closely with human judgment for emotion recognition and reasoning tasks
- Hybrid approach combining automatic scoring with human expert verification

### Multi-Agent System Framework
- Employs debate-style LLM agents to analyze and verify evaluation results
- Provides interpretable, step-by-step reasoning for scores
- Enhances reliability through multiple perspectives and cross-verification

### Human Verification
- Five human experts verify the automated evaluation strategy
- Ensures alignment between machine and human evaluation standards

## Model Performance (Key Results)

The benchmark revealed significant challenges in current MLLMs' emotional intelligence:

### Top Performers (20 Advanced MLLMs Evaluated)
**Best Overall Model**: Gemini-2.5-Pro
- **Recognition Score**: 39.3% 
- **Chain-of-Thought (CoT) Score**: 56.0%

**Other Strong Performers**:
- General models in 54-56% CoT score range
- Recognition scores consistently below 40% for all evaluated MLLMs
- Most closed-source MLLMs also below 40% in CoT quality

### Performance Landscape
1. **Recognition Challenge**: Even top models struggle with accurate emotion identification (<40%)
2. **Reasoning Strength**: Better performance on explanatory reasoning (~56% CoT for top models)
3. **Generalist vs Specialist**: 
   - Generalist models (e.g., Gemini-2.5-Pro) derive EI from multimodal understanding
   - Specialist models (e.g., R1-Omni) achieve comparable performance via domain-specific adaptation
4. **Task Variability**: Performance varies significantly across the eight emotional tasks
5. **Modality Fusion**: Challenges remain in effectively combining video/audio/text information

## Key Findings

1. **Unsatisfactory EI Levels**: Current MLLMs exhibit unsatisfactory emotional intelligence, with best model achieving only 39.3% recognition
2. **Reasoning Advantage**: Models perform better on explaining emotions (CoT ~56%) than recognizing them (Rec ~39%)
3. **Multimodal Foundation**: General multimodal understanding supports but doesn't guarantee emotional intelligence
4. **Domain Adaptation**: Specialist models can close gap through targeted post-training
5. **Evaluation Rigor**: Unified metrics and multi-agent framework provide reliable comparison
6. **Room for Improvement**: Significant headroom exists for advancing MLLM emotional intelligence

## For Rebuilding

- **Dataset**: 
  - Full dataset uploaded Jan 2026: https://github.com/FunAudioLLM/MME-Emotion (see [2026.01] release)
  - 6,500 curated video clips with corresponding audio and text
  - Task-specific QA pairs for all eight emotional tasks
- **Evaluation Code**:
  - Available in GitHub repository under `eval_cot/`, `eval_rec/`, `eval_rea/` directories
  - Python scripts for each task type
  - Uses GPT-4o as default judge model (configurable)
  - Includes metric calculation scripts (`cal_metrics.py`)
- **Paper**: Full details at https://arxiv.org/abs/2508.09210
- **Leaderboard**: 
  - Maintained in GitHub README
  - Accepts community submissions via issue/PR
  - Overall performance and task-level comparisons available
- **Dependencies**: 
  - Python 3.x, PyTorch/TensorFlow (for models)
  - FFmpeg for video/audio processing
  - Access to judge LLM API (GPT-4o or similar)

## Limitations Noted by Authors

- **Video Focus**: Primarily video-based; may not fully represent real-world multimodal diversity
- **Curated Scenarios**: While diverse, still represents sampled scenarios from broader emotional landscape
- **Metric Correlation**: Recognition and reasoning scores show some independence (models strong in one may be weak in other)
- **Temporal Scope**: Captures emotional states but long-term evolution tracking limited to clip duration
- **Cultural Bias**: Despite diverse settings, may reflect certain cultural emotional expression patterns more than others

---

**References**:
1. Zhang et al. (2025). MME-Emotion: A Holistic Evaluation Benchmark for Emotional Intelligence in Multimodal Large Language Models. ICLR 2026 Poster.
2. GitHub: https://github.com/FunAudioLLM/MME-Emotion
3. arXiv: https://arxiv.org/abs/2508.09210
4. OpenReview: https://openreview.net/forum?id=oSX9aenbea
5. Emergent Mind: https://www.emergentmind.com/topics/mme-benchmark