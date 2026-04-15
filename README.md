# Kairos Benchmarking

A living documentation of emotional reasoning benchmarks for evaluating AI models in the Kairos ecosystem.

## Overview

This repository documents existing emotional reasoning benchmarks to understand how Kairos compares against other models. The focus is on evaluating capabilities in:
- Multi-turn conversational emotional reasoning
- Empathy and emotional support
- Spiritual growth and developmental trajectory understanding

## Quick Reference

| Benchmark | Focus Area | Modality | Key Link |
|-----------|------------|----------|----------|
| [EmoBench](./established/emobench.md) | Text-based EI | Text | [GitHub](https://github.com/Sahandfer/EmoBench) |
| [KardiaBench](./established/kardiabench.md) | Empathetic dialogue | Text | [HuggingFace](https://huggingface.co/datasets/Jhcircle/KardiaBench) |
| [HumDial](./established/humdial.md) | Spoken dialogue | Audio/Text | [Challenge](https://aslp-lab.github.io/HumDial-Challenge/) |
| [MME-Emotion](./established/mme-emotion.md) | Video-based EI | Video/Audio | [GitHub](https://github.com/FunAudioLLM/MME-Emotion) |

## Directory Structure

```
kairos-benchmarking/
├── README.md                    # This file
├── established/                 # Documented benchmarks
│   ├── emobench.md
│   ├── kardiabench.md
│   ├── humdial.md
│   └── mme-emotion.md
├── upcoming/                   # Upcoming/new benchmarks
│   ├── av-emo-reasoning.md
│   ├── heart.md
│   └── multibench.md
└── docs/                       # Guides
    ├── metrics_guide.md
    └── rebuild_guide.md
```

## Established Benchmarks

### Phase 1: Core Benchmarks (2024-2025)

1. **EmoBench** - Text-based emotional intelligence (ACL 2024)
2. **KardiaBench** - User-grounded empathetic dialogue (WWW 2026)
3. **HumDial** - Spoken dialogue emotional tracking (ICASSP 2026)
4. **MME-Emotion** - Video-based multimodal emotion (ICLR 2026)

### Phase 2: Emerging Benchmarks

1. **AV-EMO-Reasoning** - Audio-visual extension
2. **HEART** - Human-LLM emotional support comparison
3. **Multi-Bench** - Multi-turn interactive emotional intelligence

## For Rebuilding

See [Rebuild Guide](./docs/rebuild_guide.md) for links to:
- Dataset downloads
- Evaluation scripts
- Leaderboards
- Paper implementations

## Notes

- This is a **living document** - will be updated as new benchmarks emerge
- Focus: Spiritual growth + emotional reasoning in multi-turn conversations
- First-person/deep emotional reasoning is a distinguishing gap not covered by existing benchmarks

---

**Last Updated**: April 2026