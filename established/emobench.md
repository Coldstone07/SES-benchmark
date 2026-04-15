# EmoBench: Evaluating the Emotional Intelligence of Large Language Models

**Paper**: [EmoBench: Evaluating the Emotional Intelligence of Large Language Models](https://arxiv.org/abs/2402.12071) (ACL 2024)  
**Authors**: Sahand Sabour, Siyang Liu, Zheyuan Zhang, June M. Liu, Jinfeng Zhou, Alvionna S. Sunaryo, Tatia M.C. Lee, Rada Mihalcea, Minlie Huang  
**Code & Data**: [GitHub Repository](https://github.com/Sahandfer/EmoBench)  
**Venue**: 62nd Annual Meeting of the Association for Computational Linguistics (ACL 2024)  

## Overview

EmoBench is a comprehensive benchmark designed to evaluate the Emotional Intelligence (EI) of Large Language Models (LLMs) by focusing on both emotion recognition and advanced EI capabilities such as emotional reasoning and application. Unlike traditional datasets that mainly focus on emotion recognition, EmoBench introduces a two-task framework requiring thorough reasoning and understanding. The benchmark includes 400 hand-crafted scenarios in English and Chinese, designed to highlight the considerable gap between existing LLMs' EI capabilities and those of humans.

## Key Features

- **Two Evaluation Tasks**:
  1. **Emotional Understanding (EU)**: Recognizing emotions and their causes in complex scenarios requiring reasoning
  2. **Emotional Application (EA)**: Applying emotional understanding to practical situations involving emotional regulation and thought facilitation

- **Psychological Foundation**: Grounded in established theories of Emotional Intelligence (Salovey & Mayer, 1990)
- **Multilingual**: Includes scenarios in both English and Chinese
- **High-Quality Annotations**: Multi-label annotations verified with Fleiss' Kappa = 0.852
- **Categories Covered**: Complex Emotions, Emotional Cues, Personal Beliefs and Experiences, Perspective-taking

## Evaluation Tasks

### Emotional Understanding (EU)
Models are presented with complex scenarios requiring them to identify:
- What emotion is being expressed
- What caused that emotion
- Why it makes sense in the given context

### Emotional Application (EA)
Models must demonstrate:
- How to appropriately respond to emotional situations
- Emotional regulation strategies
- Thought facilitation through emotional understanding

## Model Performance (Key Results)

The benchmark revealed a significant gap between LLMs and human emotional intelligence:

**Emotional Understanding Accuracy (%):**
- Human (Best): 86.77 (English), 91.29 (Chinese)
- Human (Average): ~75-80
- GPT-4: 75.88 (best LLM, still below human average)
- Other LLMs: Range from 7.84 to 24.11 (smaller models significantly underperformed)

**Emotional Application Accuracy (%):**
- GPT-4 (CoT): 80.50 (best result)
- Human performance established baseline showing LLMs still lag behind

## Key Findings

1. **Considerable Gap**: Even the best-performing LLM (GPT-4) falls short of average human performance on both tasks
2. **Scaling Helps**: Performance consistently improved with increased model parameters
3. **Chain-of-Thought Limitations**: Step-by-step reasoning generally had little to no improvement, sometimes hindering performance
4. **Language Independence**: No significant impact from language (English vs Chinese) on performance

## For Rebuilding

- **Dataset**: Available on GitHub at https://github.com/Sahandfer/EmoBench
- **Evaluation Code**: Included in the repository with scripts for both tasks
- **Paper**: Full details at https://arxiv.org/abs/2402.12071
- **Leaderboard**: Informal leaderboard available through paper results and GitHub issues

## Limitations Noted by Authors

- Focus on text-only scenarios (no multimodal aspects)
- Hand-crafted nature limits scalability
- Primarily evaluates understanding and application, not generation in open-ended contexts

---

**References**:
1. Sabour et al. (2024). EmoBench: Evaluating the Emotional Intelligence of Large Language Models. ACL 2024.
2. GitHub: https://github.com/Sahandfer/EmoBench
3. ACL Anthology: https://aclanthology.org/2024.acl-long.326.pdf