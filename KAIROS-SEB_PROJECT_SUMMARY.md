# Kairos-SEB Benchmark - Project Summary

**Created**: April 2026  
**Location**: `coldstone7/kairos-seb` (HuggingFace, Private)

---

## What is Kairos-SEB?

A benchmark to evaluate AI models' ability to understand human spiritual development from first-person narratives, across religious traditions and emotional-spiritual integration.

---

## Files Created (Private HuggingFace Dataset)

```
coldstone7/kairos-seb/
├── README.md                          # Main overview
├── dataset/
│   ├── scenarios.md                  # V1 core scenarios (15)
│   ├── scenarios_expanded.md        # V1 edge cases (20+)
│   ├── scenarios_kairos_framework.md # Framework-specific (~35)
│   └── seb_v2_religious_expanded.md # V2 full (~45) ✅ NEW
├── framework/
│   ├── developmental_model.md       # 4-stage theory
│   ├── evaluation_dimensions.md     # 4 evaluation dimensions
│   └── task_definitions.md          # 4 tasks
├── scripts/
│   ├── evaluate.py                  # Main evaluation
│   └── test_*.sh                    # Various test scripts
├── docs/
│   ├── model_card.md                # HuggingFace model card
│   └── rebuild_guide.md             # Rebuild instructions
└── results/
    └── model_comparison.json         # Test results
```

---

## Key Features V2

1. **7 Religious Traditions**:
   - Christianity (Evangelical, Catholic, Orthodox, Progressive)
   - Buddhism (Theravada, Zen, Tibetan, Secular)
   - Judaism (Orthodox, Reform, Kabbalistic)
   - Islam (Sunni, Sufi, Progressive)
   - Hinduism (Bhakti, Advaita, Neo-Hindu)
   - Indigenous/African Diasporic
   - Secular/Spiritual-but-not-religious

2. **Emotional-Spiritual Categories**:
   - Pure Emotional (should NOT inject faith)
   - Pure Spiritual (intellectual exploration)
   - Blended (most challenging)

3. **4 Difficulty Levels**:
   - Level 1: Clear, obvious
   - Level 2: Moderate
   - Level 3: High complexity
   - Level 4: Expert/Edge cases

4. **High Pass Bar**: ~50% failure expected on hard questions

---

## Results Summary

### V1 Core (Easy Questions)
| Model | Accuracy |
|-------|----------|
| Claude Sonnet 4.6 | 100% |
| Qwen 3.6 Plus | 91.6% |
| GPT-5.4 | 91.6% |

### V2 Hard Questions
| Model | Pass Rate |
|-------|----------|
| Qwen 3.6 Plus | ~50% |
| GPT-5.4 | ~50% |

**Key Insight**: Current AI handles basic spiritual detection well but struggles with nuanced questions, religious literacy, and emotional-spiritual blending.

---

## Internal Documentation

- `Kairos Technical/benchmarks/KAIROS-SEB_SUMMARY.md` - Internal summary
- `Kairos Technical/benchmarks/kairos-seb/V2_SUMMARY.md` - V2 specific

---

## Usage

```python
from datasets import load_dataset
ds = load_dataset("coldstone7/kairos-seb")
```

---

## Next Steps (If Needed)

1. Make dataset public on HuggingFace
2. Expand dataset to 100+
3. Test additional models
4. Write formal paper

---

**Status**: Complete, private, documented  
**Last Updated**: April 2026