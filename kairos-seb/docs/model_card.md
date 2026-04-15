---
annotations_creators:
- expert-generated
language:
- en
license: cc-by-4.0
multilingual:
- en
paperswithcode_model_original: null
pretty_name: Kairos-SEB: Spiritual-Emotional Reasoning Benchmark
size_categories:
- n<1K
task_categories:
- sequence-modeling
- text-classification
- zero-shot-classification
task_ids:
- spiritual-development-staging
- emotional-intelligence-classification
- religious-text-understanding
- multi-class-classification
---

# Kairos-SEB: Kairos Spiritual-Emotional Reasoning Benchmark

## Overview

**Kairos-SEB V2** is an expanded benchmark testing AI understanding of spiritual development across religious traditions and emotional-spiritual integration. Version 2 introduces religious diversity, separate emotional/spiritual tests, and a much higher difficulty bar.

## V2 Key Features

### Religious Tradition Diversity (7 traditions)
- Christianity (Evangelical, Catholic, Orthodox, Progressive)
- Buddhism (Theravada, Zen, Tibetan, Secular)
- Judaism (Orthodox, Reform, Kabbalistic)
- Islam (Sunni, Sufi, Progressive)
- Hinduism (Bhakti, Advaita, Neo-Hindu)
- Indigenous/African Diasporic
- Secular/Spiritual-but-not-religious

### Emotional-Spiritual Categories
- **Pure Emotional**: No spiritual context (should NOT inject faith)
- **Pure Spiritual**: Intellectual exploration of spiritual concepts
- **Blended**: Both dimensions simultaneously (most challenging)

### Difficulty Levels
- Level 1: Clear, obvious statements
- Level 2: Moderate complexity
- Level 3: High complexity with ambiguity
- Level 4: Edge cases requiring religious literacy + nuanced interpretation

## V2 Results (High Bar)

| Model | Easy Qs | Hard Qs |
|-------|--------|---------|
| Qwen 3.6 Plus | ~92% | ~50% |
| GPT-5.4 | ~92% | ~50% |
| Claude Sonnet 4.6 | 100% | ~50% |

**Key Insight**: Current AI excels at basic spiritual detection but struggles significantly with:
- Religious tradition-specific language
- Distinguishing emotional vs spiritual focus
- Blended emotional-spiritual scenarios
- Nuanced, edge-case questions

## Dataset Contents

| File | Description | Size |
|------|-------------|------|
| `scenarios.md` | Core V1 scenarios | 15 |
| `scenarios_expanded.md` | V1 edge cases | 20+ |
| `scenarios_kairos_framework.md` | Enneagram, IFS, etc. | ~35 |
| `seb_v2_religious_expanded.md` | V2 religious + emotional-spiritual | ~45 |

## Pass Criteria (Very High Bar)

A response is acceptable ONLY if:
1. Correct stage classification with explanation
2. Shows awareness of specific tradition terms
3. Addresses BOTH dimensions when both present
4. Does NOT inject spirituality where none exists
5. Acknowledges ambiguity rather than forcing closure

## Limitations

1. Small dataset (pilot phase)
2. English only
3. Simplified 4-stage model
4. Not for professional counseling

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

**Created**: April 2026  
**Status**: Active Development  
**License**: CC-BY-4.0