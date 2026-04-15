# KardiaBench & Kardia-R1: Unleashing LLMs to Reason toward Understanding and Empathy for Emotional Support

**Paper**: [Kardia-R1: Unleashing LLMs to Reason toward Understanding and Empathy for Emotional Support via Rubric-as-Judge Reinforcement Learning](https://arxiv.org/abs/2512.01282) (WWW 2026)  
**Authors**: Jiahao Yuan, Zhiqing Cui, Hanqing Wang, Yuansheng Gao, Yucheng Zhou, Usman Naseem  
**Dataset**: [KardiaBench on HuggingFace](https://huggingface.co/datasets/Jhcircle/KardiaBench)  
**Model**: [Kardia-R1 on HuggingFace](https://huggingface.co/JhCircle/Kardia-R1)  
**Venue**: Accepted at WWW 2026 (The ACM Web Conference)  
**Code**: [GitHub Repository](https://github.com/JhCircle/Kardia-R1)  

## Overview

KardiaBench is a large-scale, user-grounded benchmark designed for empathetic dialogue modeling and emotional reasoning. Unlike situation-driven benchmarks, KardiaBench incorporates real user identities and explicit four-stage empathetic reasoning structure. The benchmark comprises 22,080 multi-turn conversations anchored to 671 real-world anonymized user profiles, with each assistant response containing four structured spans: `<understanding>`, `<reasoning>`, `<emotion>`, and `<response>`.

Kardia-R1 is the corresponding model trained on KardiaBench using Rubric-as-Judge Reinforcement Learning, which achieves state-of-the-art performance in empathetic dialogue by making the reward signal interpretable and verifiable.

## Key Features

- **User-Grounded**: Anchored to 671 real online user profiles (including MBTI, About, Signature, Recent Activities)
- **Multi-Turn Conversations**: 22,080 dialogues with average of 8.07 turns per conversation
- **Structured Reasoning**: Each turn contains four explicit components:
  - `<understanding>`: Comprehension of user's situation
  - `<reasoning>`: Contextual analysis and emotional inference
  - `<emotion>`: Identified emotional state
  - `<response>`: Supportive reply
- **Scale**: 178,080 turn-level QA pairs across all dialogues
- **Psychological Plausibility**: Built via model-in-the-loop pipeline with rubric-guided refinement
- **Emotion Labels**: 32 fine-grained emotion categories
- **Rubric-as-Judge RL**: Human-interpretable reward based on Relevance, Empathy, Persona Consistency, Safety, Fluency

## Evaluation Metrics

KardiaBench evaluates models across five key dimensions:

1. **Emotion Accuracy**: Proportion of correct emotion span predictions
2. **Empathy**: Quality of empathetic response generation (1-5 scale)
3. **Persona Consistency**: Alignment with user's profile traits
4. **Safety**: Absence of harmful or inappropriate content
5. **Fluency**: Linguistic quality and coherence

The aggregated rubric score is normalized to [0,1] for final evaluation.

## Model Performance (Key Results)

Kardia-R1 consistently outperforms baseline methods across all LLMs tested:

**Qwen2.5-3B Results:**
- Emotion Accuracy: 9.54% → 66.53% (+57.0)
- Empathy: 2.59 → 3.68 (+1.09)
- Persona Consistency: 3.75 → 4.52 (+0.77)
- Safety: 4.49 → 4.53 (+0.04)

**Qwen2.5-7B Results:**
- Emotion Accuracy: 9.54% → 66.53% (+57.0)
- Empathy: 2.59 → 3.79 (+1.20)
- Persona Consistency: 3.75 → 4.64 (+0.89)
- Safety: 4.49 → 4.66 (+0.17)

**Gemma-7B Results:**
- Emotion Accuracy: 2.46% → 64.48% (+62.0)
- Empathy: 2.41 → 3.75 (+1.34)
- Persona Consistency: 3.34 → 4.52 (+1.18)
- Safety: 4.16 → 4.75 (+0.59)

## Key Findings

1. **Trade-off Mitigation**: Kardia-R1 improves both empathy and safety simultaneously, addressing the common trade-off where LLMs either become overly empathetic (unsafe) or overly safe (lacking empathy)
2. **Identity-Aware Reasoning**: By grounding conversations in real user profiles, the model demonstrates superior persona consistency
3. **Structured Supervision**: The four-span format provides explicit supervision for each step of empathetic cognition
4. **Backbone Agnostic**: Improvements transfer across different LLM architectures (Qwen, Gemma families)
5. **Human Preference**: Psychology-trained annotators consistently prefer Kardia-R1 over GPT-4o and specialized baselines

## For Rebuilding

- **Dataset**: Load via HuggingFace: `from datasets import load_dataset; ds = load_dataset("Jhcircle/KardiaBench")`
- **Evaluation Scripts**: Available in Kardia-R1 GitHub repository
- **Paper**: Full details at https://arxiv.org/abs/2512.01282
- **Leaderboard**: Informal rankings in paper tables; model checkpoints on HuggingFace
- **Training Code**: RL framework with rubric-as-judge available in GitHub repo

## Limitations Noted by Authors

- **LLM-Synthesized**: While grounded in real profiles, dialogues are LLM-generated (may lack full human variability)
- **Fixed Profile Traits**: User profiles have static traits; real users exhibit more complex, evolving characteristics
- **Synthetic Constraints**: Despite psychological grounding, may not capture full richness of real therapeutic dialogues
- **Safety Disclaimer**: Models should not be used as real psychological counseling tools

---

**References**:
1. Yuan et al. (2025). Kardia-R1: Unleashing LLMs to Reason toward Understanding and Empathy for Emotional Support via Rubric-as-Judge Reinforcement Learning. WWW 2026.
2. HuggingFace Dataset: https://huggingface.co/datasets/Jhcircle/KardiaBench
3. HuggingFace Model: https://huggingface.co/JhCircle/Kardia-R1
4. GitHub: https://github.com/JhCircle/Kardia-R1