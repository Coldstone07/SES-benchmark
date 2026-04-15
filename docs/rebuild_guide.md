# Rebuilding and Running Emotional Reasoning Benchmarks

This guide provides links and instructions for accessing datasets, evaluation code, and resources to reproduce or benchmark against the established emotional reasoning evaluations.

## Quick Access Links

| Benchmark | Dataset | Code/Paper | Leaderboard |
|-----------|---------|------------|-------------|
| **EmoBench** | [GitHub](https://github.com/Sahandfer/EmoBench) | [Paper](https://arxiv.org/abs/2402.12071) | [Results in Paper](https://arxiv.org/abs/2402.12071#table2) |
| **KardiaBench** | [HuggingFace](https://huggingface.co/datasets/Jhcircle/KardiaBench) | [Paper](https://arxiv.org/abs/2512.01282) | [Model Hub](https://huggingface.co/JhCircle/Kardia-R1) |
| **HumDial** | [Contact Organizers](https://github.com/ASLP-lab/Hum-Dial) | [Paper](https://arxiv.org/abs/2601.05564) | [Challenge Results](https://aslp-lab.github.io/HumDial-Challenge/) |
| **MME-Emotion** | [GitHub](https://github.com/FunAudioLLM/MME-Emotion) | [Paper](https://arxiv.org/abs/2508.09210) | [GitHub Leaderboard](https://github.com/FunAudioLLM/MME-Emotion#leaderboard) |

## Detailed Rebuilding Instructions

### EmoBench (Text-based Emotional Intelligence)

**Dataset Access**:
- GitHub: https://github.com/Sahandfer/EmoBench
- Contains: 400 hand-crafted scenarios in English and Chinese
- Format: JSON or similar structured format with scenarios and annotations

**Evaluation Code**:
- Repository includes evaluation scripts for both tasks:
  - Emotional Understanding (EU) evaluation
  - Emotional Application (EA) evaluation
- Language: Python
- Dependencies: Standard NLP libraries (scikit-learn, numpy, pandas)

**Steps to Rebuild**:
1. Clone repository: `git clone https://github.com/Sahandfer/EmoBench.git`
2. Install dependencies: `pip install -r requirements.txt` (if available)
3. Run evaluation scripts: Typically `python evaluate_eu.py` and `python evaluate_ea.py`
4. Results: Outputs accuracy scores for both tasks

**Paper Reference**: https://arxiv.org/abs/2402.12071 (Section 5: Experiments)

### KardiaBench (User-Grounded Empathetic Dialogue)

**Dataset Access**:
- HuggingFace: `from datasets import load_dataset; ds = load_dataset("Jhcircle/KardiaBench")`
- Contains: 22,080 multi-turn conversations, 178,080 turn-level QA pairs
- Features: 671 real-world user profiles, 32 emotion labels, four-span format

**Model Access** (Kardia-R1):
- HuggingFace: Available for Qwen2.5 and Gemma variants
- Examples: `JhCircle/Kardia-R1-Qwen2.5-3B`, `JhCircle/Kardia-R1-Gemma-7B`

**Evaluation Code**:
- GitHub: https://github.com/JhCircle/Kardia-R1
- Includes: Dataset loading, model inference, metric calculation scripts
- Metrics: Emotion Accuracy, Empathy, Persona Consistency, Safety, Fluency

**Steps to Rebuild**:
1. Install dependencies: `pip install transformers datasets torch accelerate`
2. Load dataset: See HuggingFace documentation example above
3. Load model: Use AutoModelForCausalLM or similar from transformers
4. Run inference: Generate responses for test set
5. Calculate metrics: Use provided scoring scripts
6. Aggregate: Normalize five-dimension score to [0,1] range

**Paper Reference**: https://arxiv.org/abs/2512.01282 (Section 5: Experiment)

### HumDial (Spoken Dialogue Emotional Intelligence)

**Dataset Access**:
- Contact: Reach out to ASLP-lab via GitHub issues or email
- Expected: Audio files, transcripts, annotations for multi-turn dialogues
- Structure: Training/dev/test splits for Track I and Track II

**Evaluation Code**:
- GitHub: https://github.com/ASLP-lab/Hum-Dial
- Includes:
  - Baseline implementations (OSUM-EChat + Easy Turn)
  - Task evaluation scripts in `Emotional_Intelligence/` and `Full_Duplex_Interaction/` directories
  - Audio processing utilities

**Steps to Rebuild**:
1. Obtain dataset from organizers (after acceptance/registration)
2. Install audio dependencies: `pip install librosa torch torchaudio transformers`
3. Run baseline: See `baseline/` directory for instructions
4. Evaluate Task 1: Use scripts in `Emotional_Intelligence/` for trajectory detection
5. Evaluate Task 2: Use reasoning evaluation scripts
6. Evaluate Task 3: Requires human evaluation or TTS+LLM pipeline for empathy
7. Calculate overall score: 0.2×ST1 + 0.2×ST2 + 0.1×Stext + 0.25×Semo + 0.25×Snat

**Paper Reference**: https://arxiv.org/abs/2601.05564 (Section 3: Submission Requirements, Section 4: Baselines)

### MME-Emotion (Video-based Multimodal Emotional Intelligence)

**Dataset Access**:
- GitHub: https://github.com/FunAudioLLM/MME-Emotion
- Full dataset uploaded Jan 2026: See [2026.01] release
- Contains: 6,500+ curated video clips with audio/text, task-specific QA pairs

**Evaluation Code**:
- GitHub: https://github.com/FunAudioLLM/MME-Emotion
- Structure:
  - `eval_cot/`: Chain-of-Thought evaluation
  - `eval_rec/`: Recognition evaluation  
  - `eval_rea/`: Reasoning evaluation
  - Metrics calculation: `eval_cot/task/metrics/cal_metrics.py`

**Steps to Rebuild**:
1. Clone repository and download dataset (Jan 2026 release)
2. Install dependencies: `pip install torch torchvision transformers opencv-python`
3. Prepare environment: Ensure access to judge LLM (GPT-4o recommended)
4. Run evaluation:
   - Recognition: `python eval_rec/task/code/eval_rec_gpt4o.py`
   - Reasoning: `python eval_rea/task/code/eval_rea_gpt4o.py`  
   - CoT: `python eval_cot/task/code/eval_cot_gpt4o.py`
5. Calculate metrics: `python eval_cot/task/metrics/cal_metrics.py`
6. Results: Outputs Rec-S, Rea-S, CoT-S scores across eight tasks

**Paper Reference**: https://arxiv.org/abs/2508.09210 (Section 3: Benchmark Construction, Section 4: Evaluation Suite)

## General Rebuilding Considerations

### Computational Requirements
- **Lightweight (EmoBench)**: CPU sufficient, minimal GPU needed
- **Medium (KardiaBench)**: GPU recommended for LLM inference (6GB+ VRAM for 3B models)
- **Heavy (HumDial/MME-Emotion)**: Significant GPU resources needed for audio/video processing
- **Storage**: 
  - EmoBench: <100MB
  - KardiaBench: ~2-5GB (depending on audio if included)
  - HumDial: 10-50GB (audio dataset)
  - MME-Emotion: 100GB+ (video dataset)

### Dependencies Summary
- **Core**: Python 3.8+, PyTorch/TensorFlow, transformers
- **NLP**: spaCy, NLTK, scikit-learn, pandas, numpy
- **Audio**: librosa, torchaudio, FFmpeg (for HumDial)
- **Video**: OpenCV, FFmpeg (for MME-Emotion)
- **Evaluation LLMs**: Access to GPT-4o or similar for automated judging (where used)

### Evaluation Best Practices
1. **Fixed Seed**: Set random seeds for reproducible results
2. **Baseline Comparison**: Always compare against reported baselines
3. **Human Spotcheck**: For automatic evaluation, validate subset with human judges
4. **Error Analysis**: Examine failure cases to understand model limitations
5. **Statistical Significance**: Use appropriate tests when comparing systems
6. **Leaderboard Etiquette**: Follow submission guidelines when contributing results

## Troubleshooting Common Issues

### Dataset Access Problems
- **EmoBench**: Check GitHub releases if main branch has issues
- **KardiaBench**: Verify HuggingFace access and internet connectivity
- **HumDial**: Ensure proper authorization from challenge organizers
- **MME-Emotion**: Confirm Jan 2026 release is downloaded (earlier versions incomplete)

### Evaluation Failures
- **OOM Errors**: Reduce batch size, use gradient checkpointing, or switch to CPU
- **Missing Dependencies**: Check requirements.txt or installation instructions
- **API Limits**: For LLM-as-judge, implement rate limiting and retry logic
- **Format Mismatches**: Verify expected input/output formats match documentation

### Result Reproduction
- **Small Differences**: Expected due to randomness, floating point, or version differences
- **Large Differences**: Check:
  - Same dataset version/split
  - Same model version/checkpoint
  - Same evaluation protocol
  - Same preprocessing steps
  - Same metric calculation

## For Kairos Benchmark Development

When developing your own spiritual growth and emotional reasoning benchmark:

### Dataset Creation
- **Start Small**: Begin with 50-100 high-quality, hand-crafted scenarios
- **Inspiration**: Adapt patterns from EmoBench (scenarios) + KardiaBench (multi-turn)
- **Spiritual Integration**: Incorporate Fowler's/Peck's stages or SACRED connectedness concepts
- **First-Person Focus**: Design scenarios requiring perspective-taking and self-reflection

### Evaluation Framework
- **Hybrid Approach**: Automatic scoring with human validation (like MME-Emotion's multi-agent system)
- **Metrics**: Combine recognition, reasoning, tracking, and application measures
- **Baselines**: Include human performance and established model baselines
- **Scalability**: Design for expansion from pilot to full benchmark

### Technical Implementation
- **Modular Design**: Separate dataset loading, model inference, and evaluation
- **Configuration**: Use config files for easy experimentation
- **Logging**: Comprehensive logging for reproducibility
- **Containerization**: Consider Docker for consistent environments

### Community Engagement
- **Documentation**: Clear README with setup instructions
- **Licensing**: Choose appropriate open-source license (MIT/Apache common)
- **Citation**: Provide BibTeX for academic referencing
- **Feedback**: Include mechanism for community input and issue reporting

---

**Last Updated**: April 2026  
**Note**: Always check official repositories for most current instructions and updates.

**References**:
1. EmoBench: https://github.com/Sahandfer/EmoBench
2. KardiaBench: https://github.com/JhCircle/Kardia-R1
3. HumDial: https://github.com/ASLP-lab/Hum-Dial
4. MME-Emotion: https://github.com/FunAudioLLM/MME-Emotion