# HEART: A Unified Benchmark for Assessing Humans and LLMs in Emotional Support Dialogue

**Paper**: [HEART: A Unified Benchmark for Assessing Humans and LLMs in Emotional Support Dialogue](https://arxiv.org/abs/2601.19922) (Expected 2026)  
**Authors**: J. Liu, Z. Hu, R. Mihalcea, et al. (Extended from ESConv work)  
**Expected Venue**: Likely ACL 2026 or EMNLP 2026  
**Status**: Preprint available Jan 2026, expected publication mid-2026  

## Overview

HEART (Human and LLMs Emotional Support Dialogue benchmark) is the first-ever framework that directly compares humans and LLMs on the same multi-turn emotional-support conversations. It addresses the fundamental challenge of evaluating supportive dialogue by placing humans and models side-by-side on identical dialogue histories, enabling direct comparison of their abilities in emotionally appropriate, supportive responding.

The benchmark evaluates conversations along five dimensions grounded in psychological theories of supportive communication, providing a principled foundation for assessing socially aligned conversational behavior.

## Key Features

### Direct Human-LLM Comparison
- **Identical Contexts**: Both humans and models respond to the same dialogue histories
- **Blinded Evaluation**: Responses evaluated without knowledge of origin (human vs model)
- **Side-by-Side Metrics**: Direct comparison of performance on identical tasks
- **Human Baselines**: Establishes realistic human performance benchmarks

### Multi-Turn Supportive Dialogue Focus
- **Source**: Drawn from ESConv (Emotional Support Conversation) dataset
- **Conversation Types**: Covers grief, relationship conflict, academic pressure, financial stress, job instability, depression, friendship problems, and family/health-related challenges
- **Turn Structure**: Alternating between seeker (person with problem) and supporter (helper)
- **Mean Length**: Approximately 7 turns per conversation
- **Authentic Elements**: Includes emotional disclosures, coping attempts, and follow-up questions

### Five-Dimensional Evaluation Framework
HEART evaluates supportive dialogue along five psychologically-grounded dimensions:

1. **Attunement (A)**: Does the response track specific details and nuances of the seeker's expression?
2. **Responsiveness (R)**: How well does the response address the seeker's immediate needs and cues?
3. **Interpretation (I)**: Does the response accurately capture the underlying meaning and intent?
4. **Exploration (E)**: To what extent does the response help the seeker explore feelings and perspectives?
5. **Empowerment (Emp)**: Does the response foster the seeker's sense of agency and coping ability?

## Dataset Construction

### Source Material
- Based on ESConv dataset with emotional support conversations
- Covers diverse problem types: grief, frustration, conflict, uncertainty, etc.
- Multi-turn structure with mean ≈7 turns per conversation
- Alternating seeker-supporter structure

### Filtering & Preparation
- Removal of safety-critical content (self-harm plans, hate speech, identifying information)
- Focus on emotionally complex, multi-turn support conversations
- 280 regular evaluation items + 20 adversarial items (for robustness testing)
- Each item: multi-turn context + single supporter turn to be completed

## Evaluation Protocol

### Response Generation
- **Human Participants**: Recruited to provide supportive responses to dialogue histories
- **LLM Models**: Evaluated models generate responses to same contexts
- **Blinding**: Evaluators unaware whether response came from human or model

### Evaluation Metrics
For each of the five dimensions (A, R, I, E, Emp):
- **Scoring Scale**: Typically 1-5 or 1-7 Likert scale
- **Criteria**: Specific behavioral indicators for each dimension
- **Aggregation**: Dimension scores combined for overall supportive quality

### Human Evaluation Process
- Psychology-trained annotators evaluate responses
- Inter-annotator agreement measured (typically Cohen's Kappa or Fleiss' Kappa)
- Blind presentation to prevent bias
- Consistency checks and quality control measures

## Model Performance (Expected/Reported)

Based on the preprint and related work:

### Key Insights from Related Benchmarks
- **MT-bench-101**: Achieves 80-87% human-model agreement but focuses on general helpfulness/reasoning, not interpersonal nuance
- **PersonConvBench & Beyond Prompts**: Emphasize multi-turn evaluation and personalization
- **EQBench & SENSE-7**: Focus on emotional quotient and sensory-emotional integration

### HEART-Specific Findings (Anticipated from Preprint)
1. **Human Advantage**: Expected significant gap between human and LLM performance
2. **Dimension Variation**: Models may perform better on some dimensions (e.g., Interpretation) than others (e.g., Empowerment)
3. **Adversarial Robustness**: Testing with 20 adversarial cases to evaluate robustness to manipulation attempts
4. **Model Differences**: Variations expected across LLM families and sizes
5. **Prompting Effects**: Potential for improvement through specialized prompting strategies

## Key Features for Kairos Relevance

### First-Person Perspective Alignment
- **Seeker Modeling**: Evaluates ability to understand and respond from the seeker's perspective
- **Emotional Tracking**: Requires monitoring emotional state across turns
- **Contextual Integration**: Responses must be grounded in specific dialogue history

### Multi-Turn Emotional Reasoning
- **Long-Term Tracking**: Evaluates sustained emotional understanding over conversation
- **Causal Understanding**: Responses should reflect understanding of how emotions developed
- **Progressive Support**: Ability to adjust support as conversation evolves

### Spiritual Growth Connection
- **Empowerment Dimension**: Directly relates to fostering agency - key in spiritual development
- **Exploration Dimension**: Supports self-exploration - important in growth processes
- **Non-Directive Support**: Aligns with supportive rather than prescriptive approaches
- **Meeting Users Where They Are**: Critical for developmental appropriateness

## For Anticipated Rebuilding

### Expected Components
- **Dataset**: 
  - 300 dialogue histories (280 regular + 20 adversarial)
  - Multi-turn contexts with alternating seeker-supporter structure
  - Source: Primarily ESConv with filtering and enhancement
- **Evaluation Scripts**:
  - Blind evaluation framework
  - Dimension-specific scoring rubrics
  - Human-LLM comparison analysis tools
  - Inter-annotator agreement calculators
- **Baseline Implementations**:
  - Human response collection protocols
  - LLM prompting strategies for supportive dialogue
  - Baseline model performances for comparison

### Technical Requirements
- **Text Processing**: Standard NLP libraries (spaCy, NLTK, transformers)
- **Evaluation Framework**: 
  - Web interface or CLI for blind evaluation
  - Scoring database/storage
  - Agreement calculation scripts
- **Human Recruitment**: Tools for participant screening and compensation
- **LLM Access**: API access to evaluated models (or local inference capabilities)

## Limitations Anticipated by Authors

- **Language Focus**: Primarily English (based on ESConv), may need multilingual extension
- **Turn Limitation**: Evaluates single supporter turn given multi-turn history (not full dialogue generation)
- **Adversarial Scope**: 20 adversarial cases may not cover all potential manipulation strategies
- **Cultural Context**: Based on specific cultural expressions of emotional support
- **Professional Boundary**: Not intended to replace professional therapeutic evaluation

---

**Note**: This document describes the HEART benchmark based on the available preprint. Specific details may evolve upon official publication.

**References**:
1. Liu et al. (2026). HEART: A Unified Benchmark for Assessing Humans and LLMs in Emotional Support Dialogue. arXiv:2601.19922.
2. ESConv Dataset: https://github.com/thu-coai/ESConv
3. Related Work: MT-bench-101, PersonConvBench, EQBench, SENSE-7