# Kairos-SEB Rebuild Guide

## Overview

This guide provides instructions for rebuilding and running the Kairos Spiritual-Emotional Reasoning Benchmark (Kairos-SEB) for your own evaluations or research.

---

## Quick Start

### 1. Clone/Access the Repository

```
git clone https://github.com/kairos-technical/kairos-seb.git
cd kairos-seb
```

### 2. Install Dependencies

```bash
# Core dependencies
pip install python3 pandas numpy

# For LLM evaluation (optional)
pip install openai anthropic

# For advanced analysis (optional)  
pip install scipy scikit-learn
```

### 3. Prepare Your Dataset

The benchmark expects JSON in this format:

```json
[
  {
    "scenario_id": "1.1",
    "text": "I know God loves me because the Bible tells me so...",
    "primary_stage": 1,
    "emotional_tags": ["peace", "certainty"],
    "is_first_person_verified": true,
    "difficulty": "easy"
  },
  ...
]
```

### 4. Run Evaluation

```bash
# Task 1: Stage Detection
python scripts/evaluate.py --task task1 --model gpt-4o --input dataset/scenarios.json --output results/task1_results.json

# Task 2: Explanation (requires human eval)
python scripts/evaluate.py --task task2 --model gpt-4o --input dataset/scenarios.json --output results/task2_results.json

# Task 4: Response Generation (requires human eval)  
python scripts/evaluate.py --task task4 --model gpt-4o --input dataset/scenarios.json --output results/task4_results.json
```

---

## Using Different Models

### OpenAI Models

```python
from scripts.evaluate import GPTAdapter

# GPT-4o
model = GPTAdapter("gpt-4o")

# GPT-4o-mini (faster, cheaper)
model = GPTAdapter("gpt-4o-mini")

# GPT-4 Turbo
model = GPTAdapter("gpt-4-0613")
```

Set API key via environment variable:
```bash
export OPENAI_API_KEY="your-key-here"
```

### Anthropic Models

```python
# Add Claude adapter to scripts/evaluate.py
import anthropic

class ClaudeAdapter:
    def __init__(self, model_name="claude-3-opus-20240229"):
        self.model_name = model_name
        self.client = anthropic.Anthropic()
    
    def predict_stage(self, text: str):
        # Similar implementation via Claude API
        pass
```

### Local Models

```python
# For local models via vLLM or similar
class LocalAdapter:
    def __init__(self, model_name="meta-llama/Llama-2-70b-chat"):
        self.model_name = model_name
        # Use vLLM or HuggingFace locally
        from transformers import AutoModelForCausalLM, AutoTokenizer
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForCausalLM.from_pretrained(model_name)
    
    def predict_stage(self, text: str):
        # Implement inference
        pass
```

### Baseline Comparisons

```bash
# Random baseline
python scripts/evaluate.py --task task1 --baseline --input dataset/scenarios.json

# Always predict most common stage
python scripts/evaluate.py --task task1 --baseline stage_distribution=2
```

---

## Dataset Structure

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| scenario_id | string | Unique identifier |
| text | string | First-person statement(s) |
| primary_stage | int | Ground truth stage (1-4) |
| emotional_tags | array | Emotion labels |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| secondary_indicators | array | Adjacent stage hints |
| difficulty | string | easy/medium/hard |
| ground_truth_explanation | string | For Task 2 |
| ground_truth_response | string | For Task 4 |

### Creating Your Own Scenarios

1. Follow the stage definitions in `framework/developmental_model.md`
2. Ensure first-person voice ("I" statements)
3. Include emotional tags
4. Validate with expert review
5. Test for inter-rater reliability (>0.8 Kappa)

---

## Evaluation Tasks

### Task 1: Stage Detection

**Quick Eval**:
```bash
python scripts/evaluate.py --task task1 --model gpt-4o --input dataset/scenarios.json
```

**Output**:
- Accuracy per stage
- Confusion matrix
- Confidence calibration

**Manual Calculation**:
```python
# Calculate per-stage precision/recall
from sklearn.metrics import precision_recall_fscore_support

y_true = [s.primary_stage for s in scenarios]
y_pred = [r["predicted"] for r in results["results"]]

precision_recall_fscore_support(y_true, y_pred, average=None)
```

### Task 2: Emotional-Spiritual Reasoning

**Generation**:
```bash
python scripts/evaluate.py --task task2 --model gpt-4o --input dataset/scenarios.json
```

**Manual Scoring** (Required):
- Use criteria in `framework/evaluation_dimensions.md`
- Score each explanation 1-5 on: emotional identification, causal explanation, spiritual significance, contextual understanding, clarity
- Minimum 3 evaluators for reliability
- Calculate inter-rater agreement (Kappa >0.8 target)

### Task 3: Multi-Turn Tracking

**Format Required**:
```json
[
  {
    "scenario_id": "multi_A",
    "turns": [
      {"turn": 1, "text": "I always believed..."},
      {"turn": 2, "text": "But then..."},
      ...
    ]
  }
]
```

**Tracking Eval**:
- Stage detection accuracy per turn
- Transition detection 
- Overall trajectory assessment

### Task 4: Response Generation

**Generation**:
```bash
python scripts/evaluate.py --task task4 --model gpt-4o --input dataset/scenarios.json
```

**Manual Scoring** (Required):
- 6 criteria from `framework/evaluation_dimensions.md`
- Developmental appropriateness, first-person coherence, emotional attunement, spiritual sensitivity, helpfulness, safety
- Blind evaluation where possible

---

## Calculating Final Scores

### Overall Score (4-dimension)

```python
# From human evaluation scores
scores = {
    "SSR": 4.2,  # Spiritual Stage Recognition
    "ESR": 3.8,  # Emotional-Spiritual Reasoning
    "DA": 4.0,    # Developmental Appropriateness
    "FPC": 3.5     # First-Person Coherence
}

weights = {"SSR": 0.25, "ESR": 0.25, "DA": 0.25, "FPC": 0.25}

overall = sum(scores[dim] * weights[dim] for dim in weights)
# Overall: 3.875
```

### Benchmark Comparison

```python
# Compare models
model_results = {
    "gpt-4o": {"task1_accuracy": 0.82, "task4_avg": 4.1},
    "claude-3-opus": {"task1_accuracy": 0.78, "task4_avg": 3.9},
    "baseline": {"task1_accuracy": 0.25, "task4_avg": 2.1}
}
```

---

## Troubleshooting

### Common Issues

**1. API Errors**
```
Error: Invalid API key
```
- Check: `echo $OPENAI_API_KEY`
- Fix: Set correct key or use `--api_key` parameter

**2. JSON Parse Errors**
```
Error: parsing stage...
```
- Check: Model output format inconsistent
- Fix: Update prompt in adapter or post-process output

**3. Rate Limiting**
```
Error: Rate limit exceeded
```
- Fix: Add delay between calls or reduce batch size

**4. Empty Results**
```
Warning: No scenarios processed
```
- Check: Input file path and format
- Fix: Validate JSON structure

---

## Extending the Benchmark

### Adding Tasks

1. Define task in `framework/task_definitions.md`
2. Add evaluation function in `scripts/evaluate.py`
3. Update CLI argument parser
4. Document in this guide

### Adding Stages

1. Modify Stage enum in `scripts/evaluate.py`
2. Update developmental model in `framework/developmental_model.md`
3. Add scenario examples by stage
4. Recalculate baselines

### Custom Evaluation Criteria

1. Edit rubric in `framework/evaluation_dimensions.md`
2. Update scoring functions
3. Document changes
4. Validate with human judges

---

## Citation

If you use Kairos-SEB in research, please cite:

```bibtex
@misc{kairos-seb2026,
  title = {Kairos Spiritual-Emotional Reasoning Benchmark},
  author = {Kairos Technical Team},
  year = {2026},
  url = {https://github.com/kairos-technical/kairos-seb}
}
```

---

## Contact & Contributions

- Report issues: GitHub Issues
- Discuss: Discord or discussion forum
- Contribute: Pull requests welcome

---

**Last Updated**: April 2026