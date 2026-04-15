# HumDial: Emotional Intelligence Benchmark for Human-like Spoken Dialogue Systems

**Challenge**: [The ICASSP 2026 HumDial Challenge: Benchmarking Human-like Spoken Dialogue Systems in the LLM Era](https://arxiv.org/abs/2601.05564) (ICASSP 2026)  
**Authors**: Chengyou Wang, Zhixian Zhao, Zihan Zhang, et al. (ASLP-lab)  
**Repository**: [ASLP-lab/Hum-Dial GitHub](https://github.com/ASLP-lab/Hum-Dial)  
**Venue**: ICASSP 2026 (IEEE International Conference on Acoustics, Speech, and Signal Processing)  
**Baseline Results**: Available in challenge documentation  

## Overview

HumDial is a comprehensive, multi-turn evaluation framework that measures emotional tracking, causal reasoning, and empathetic response generation in spoken dialogue systems. It addresses limitations of prior single-turn or text-only evaluation schemes by providing a multi-turn, speech-centric, and context-rich testbed with densely annotated multi-turn emotional trajectories in authentic full-duplex conversations.

The benchmark establishes evaluation standards and task protocols for advancing research on human-like spoken dialogue systems at the intersection of emotional intelligence and real-time interaction capabilities.

## Key Features

- **Authentic Dialogue Data**: Large-scale, high-fidelity multi-turn conversations derived from authentic human conversations
- **Dual-Track Evaluation**:
  - **Track I: Emotional Intelligence** - Long-term emotion understanding and empathetic generation
  - **Track II: Full-Duplex Interaction** - Real-time decision making in "edge listening-speaking" conditions
- **Rich Annotation**: Densely annotated for emotional trajectories, prosodic features, and interaction phenomena
- **Ecological Validity**: Designed to capture natural cognitive synchronization in human-machine communication
- **Multi-Resolution Metrics**: Combines automatic and human evaluation with perceptual validation

## Track I: Emotional Intelligence

This track evaluates three core tasks on multi-turn spoken dialogues:

### Task 1: Emotional Trajectory Detection
- **Goal**: Identify and summarize emotion label sequences per turn
- **Input**: Context C = {u₁, ..., uₙ} (dialogue history)
- **Output**: Per-turn emotion label sequence and trajectory summary
- **Metrics**: Accuracy_Completeness (strict matching), scored 1/3/5
- **Emotion Labels**: Happy, Sad, Angry, Surprised, Fearful, Disgusted, Neutral (6 basic + neutral)

### Task 2: Emotional Reasoning
- **Goal**: Infer and justify changes in emotional state (causal emotional reasoning)
- **Input**: Dialogue history with emotional shifts
- **Output**: Explanation for each emotional transition
- **Metrics**: Factual coherence of causal explanations, scored 1/3/5
- **Focus**: Ability to explain *why* emotions changed, not just *that* they changed

### Task 3: Empathy Assessment
- **Goal**: Generate empathetic replies in text and synthesized audio
- **Input**: Final user turn + preceding context
- **Output**: Empathetic response (text and audio)
- **Metrics**: 
  - Semantic appropriateness (human evaluation)
  - Audio naturalness (MOS - Mean Opinion Score)
  - Prosodic matching to emotional context
- **Human Evaluation**: 20 evaluators (10 English, 10 Chinese) with 6+ months annotation experience

## Track II: Full-Duplex Interaction

Evaluates real-time interaction capabilities:

### Task 1: Interruption Handling
- **Responsiveness**: Ability to detect and respond to user interruptions
- **Metrics**: Response rate, latency to respond

### Task 2: Rejection (Silence Maintenance)
- **Ability**: Maintain appropriate silence when user speaks over system output
- **Metrics**: Rejection rate (percentage of correct silence maintenance)

### Task 3: Delay Management
- **Latency Handling**: Cope with transmission delays in full-duplex scenarios
- **Metrics**: Appropriate response timing despite delays

## Evaluation Framework

### Automatic Evaluation (Tracks I & II)
- Uses Qwen3-Omni-30B as automatic judge for Tasks 1-2 (emotion tracking/reasoning)
- Combines with baseline ASR/TTS/TTS systems for end-to-end evaluation

### Human Evaluation (Track I, Task 3)
- 20 professional evaluators assess empathy and naturalness
- Blinded evaluation to reduce bias
- Inter-annotator agreement measured for reliability

### Scoring System
Overall score = 0.2×ST1 + 0.2×ST2 + 0.1×Stext + 0.25×Semo + 0.25×Snat
Where:
- ST1, ST2: Task 1 & 2 scores (LLM-derived, 0-5 scale)
- Stext: Text empathy score from LLM
- Semo: Human emotion appropriateness score
- Snat: Human audio naturalness score

## Baseline Systems & Key Results

### Baseline (ASR + GPT-3.5 + Tacotron 2/WaveGlow):
- Task 1 (trajectory): 2.62 / 5.00
- Task 2 (reasoning): 2.73 / 5.00  
- Task 3 (empathy+naturalness): 2.82 / 5.00

### Leading Results (ICASSP 2026 Challenge Winner - TeleAI):
- Task 1: 4.97 / 5.00
- Task 2: 4.98 / 5.00
- Task 3: 3.81 / 5.00
- **Overall Score**: 4.27 / 5.00 (Rank 1)

### Performance Trends:
- Top systems achieve near-ceiling performance on emotion detection/reasoning
- Empathy generation (especially audio naturalness/prosody) remains challenging
- Systems struggle with fine-grained emotional transitions and prosodic congruence
- Real-time interaction capabilities (interruption handling, rejection) vary significantly

## Key Findings

1. **Beyond Emotion Labeling**: HumDial moves past simple emotion classification to long-term trajectory tracking and causal reasoning
2. **Speech-Centric Advantage**: Captures prosodic and temporal dynamics missing in text-only benchmarks
3. **Full-Duplex Reality**: Tests real-time interaction capabilities often ignored in emotional AI research
4. **Annotation Density**: Provides multi-resolution affective and causal annotation for deeper analysis
5. **Human-Machine Gap**: While models track emotions well, generating truly empathetic responses (especially in audio) remains difficult

## For Rebuilding

- **Dataset**: Available through challenge organizers (contact via GitHub repository)
- **Evaluation Code**: 
  - Baseline implementations in GitHub repo
  - Task-specific evaluation scripts in `Emotional_Intelligence/` and `Full_Duplex_Interaction/` directories
  - Uses FFmpeg for audio processing, PyTorch/TensorFlow for models
- **Paper**: Challenge summary at https://arxiv.org/abs/2601.05564
- **Leaderboard**: Official results in challenge documentation; new submissions evaluated by organizers
- **Baseline**: Reproducible baseline system provided (OSUM-EChat + Easy Turn)

## Limitations Noted by Organizers

- **Synthetic Mixing Risk**: Existing benchmarks often use synthetic data that fails to capture natural cognitive synchronization
- **Rejection Capability**: Maintaining appropriate silence in noise remains a primary challenge for full-duplex systems
- **Ecological Boundaries**: While improved, still represents a controlled test environment
- **Multi-Party Extension**: Current focus on dyadic conversation; multi-party scenarios represent future work

---

**References**:
1. ICASSP 2026 HumDial Challenge Paper: https://arxiv.org/abs/2601.05564
2. GitHub Repository: https://github.com/ASLP-lab/Hum-Dial
3. Challenge Website: https://aslp-lab.github.io/HumDial-Challenge/
4. Emergent Mind Overview: https://www.emergentmind.com/topics/human-like-spoken-dialogue-systems-challenge-humdial-emotional-intelligence-benchmark