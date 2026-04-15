---
title: Kairos-SEB
emoji: 🧘
colorFrom: purple
colorTo: blue
sdk: static
pinned: false
---

# Kairos Spiritual-Emotional Reasoning Benchmark (Kairos-SEB)

## Overview

**Version 2.0** - A benchmark evaluating AI models' ability to understand human spiritual development from first-person narratives, across multiple religious traditions and emotional-spiritual integration scenarios.

## Key Features (V2)

- **7 Religious Traditions**: Christianity, Buddhism, Judaism, Islam, Hinduism, Indigenous, Secular
- **Emotional-Spiritual Categories**: Pure Emotional, Pure Spiritual, Blended
- **4 Difficulty Levels**: Level 1 (easy) to Level 4 (expert)
- **High Pass Bar**: ~50% failure expected on hard questions

## The 4-Stage Model

| Stage | Name | Description |
|-------|------|-------------|
| 1 | Awakening | Unquestioning belief, external authority |
| 2 | Questioning | Doubt, deconstruction, crisis |
| 3 | Integration | Personal path, selectivity |
| 4 | Unity | Transcendence, service |

## Results

### V1 Core Test (n=12)
| Model | Accuracy |
|-------|----------|
| Claude Sonnet 4.6 | 100% |
| Qwen 3.6 Plus | 91.6% |
| GPT-5.4 | 91.6% |
| Claude Opus 4.6 | 75% |

### V2 Hard Questions Test (n=10)
| Model | Pass Rate |
|-------|---------|
| Qwen 3.6 Plus | ~50% |
| GPT-5.4 | ~50% |

**Key Insight**: Current AI excels at basic spiritual detection but struggles with nuanced questions and religious literacy.

## Dataset Files (on HuggingFace)

- `scenarios.md` - V1 core (15)
- `scenarios_expanded.md` - V1 edge cases (20+)
- `scenarios_kairos_framework.md` - Framework-specific (~35)
- `seb_v2_religious_expanded.md` - **V2 full dataset** (~45)

## Usage

```python
from datasets import load_dataset
ds = load_dataset("coldstone7/kairos-seb")
```

## Citation

```bibtex
@misc{kairos-seb2026,
  title = {Kairos Spiritual-Emotional Reasoning Benchmark V2},
  author = {Kairos Technical Team},
  year = {2026},
  url = {https://huggingface.co/datasets/coldstone7/kairos-seb}
}
```

---

**Last Updated**: April 2026  
**Status**: Private  
**Version**: 2.0