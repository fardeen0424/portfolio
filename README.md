# Fardeen NB: AI Engineer

Source for [fardeen.net](https://fardeen.net), the personal website of **Fardeen NB** (Fardeen Noor Basha). This README mirrors the information published on the site.

---

## About

Fardeen NB is an **AI Engineer** based in Cincinnati, Ohio, who builds production LLM systems and trains models from scratch.

He started out as a builder. In 2019, as a teenager, he founded **FX Pattern Pro**, a desktop application that helps quantitative traders detect algorithmic chart patterns. Shipping it taught him how to turn noisy, high-volume market data into software people could trust.

That work pulled him into machine learning. At **Accenture**, he fine-tuned enterprise language models and built production retrieval and evaluation pipelines. He then went deeper into the fundamentals with a **Master of Engineering in Artificial Intelligence at the University of Cincinnati**, where his research on attention and long-range dependencies in transformers led to peer-reviewed publications.

Today he builds production AI at **Insight Hospital and Medical Center**, where he has shipped six AI features across the hospital's revenue cycle, from medical coding to claims appeals and patient calls. He also leads **NeuralCrew**, his independent research effort, where he pre-trained and post-trained **Neutrino-Instruct**, a 7-billion-parameter language model, from scratch to test how far careful curation of open data can go without frontier-scale compute.

---

## Neutrino-Instruct

An open 7-billion-parameter language model, pre-trained and post-trained from scratch. It uses a custom architecture tuned for multi-turn conversation and instruction following, and it runs locally through GGUF and Ollama.

| Spec | Value |
| --- | --- |
| Parameters | 7 billion |
| Context length | 32,768 tokens |
| Formats | GGUF, Safetensors |
| License | Apache-2.0 |
| Architecture | Custom (Neutrino) |
| Language | English |

```bash
ollama run fardeen0424/neutrino
```

**Training datasets (13 curated sources):** FineWeb-Edu, FineWiki, Wikipedia (En), FinePDFs, GitHub Code, TinyStories, Awesome ChatGPT Prompts, SlimPajama, Cosmopedia, RedPajama-V2, Dolma, Stack-v2, UltraChat.

Model card: [huggingface.co/neuralcrew/neutrino-instruct](https://huggingface.co/neuralcrew/neutrino-instruct)

---

## Work experience

### Full Stack AI Engineer, Insight Hospital and Medical Center
*Jun 2025 – Present · Chicago, Illinois · Hybrid*
- Owned and shipped six production AI features across the hospital's revenue cycle management platform, covering medical coding, claims appeals, prior authorization and patient communications.
- Fine-tuned LLMs to predict ICD-10 and CPT codes from clinical documentation, with human-in-the-loop review by certified coders.
- Built a RAG-powered claims appeal agent and HIPAA-compliant agents for prior authorization and payer follow-ups.
- Designed real-time voice and SMS agents for call routing, appointment reminders and patient outreach.

### Artificial Intelligence Engineer, Accenture
*Jun 2022 – Aug 2024 · India · Hybrid*
- Fine-tuned enterprise LLMs for knowledge extraction, document summarization and semantic search.
- Engineered production RAG pipelines with hybrid sparse-dense retrieval and semantic reranking.
- Built LLM evaluation frameworks measuring accuracy, factual consistency, hallucination rate and latency.

---

## Education

### Master of Engineering, Artificial Intelligence, University of Cincinnati
*Aug 2024 – May 2026 · Cincinnati, OH*
- Specialized in deep learning, transformer mechanics, attention optimization and distributed pre-training.
- Graduate research on attention distance bottlenecks and long-range dependencies in transformers, leading to peer-reviewed publications.

---

## Certifications

- **Certified Artificial Intelligence Scientist**, United States Artificial Intelligence Institute (Jun 2025)
- **NVIDIA-Certified Associate: Generative AI LLMs**, NVIDIA (Apr 2025)
- **NVIDIA-Certified Associate: Generative AI Multimodal**, NVIDIA (May 2025)

---

## Publications

Selected work:

1. **The Attention Distance Problem: Theoretical Analysis of Long-Range Dependencies in Transformers** (2024)
2. **Emergent Complex Reasoning Through Compositional Data Augmentation: How Synthetic Task Diversity Shapes Cognitive Capabilities in Large Language Models** (2023)
3. **Attention-Guided Pruning: A Systematic Approach for Compressing Transformer Models** (2022)
4. **EffiLLM: A Comprehensive Framework for Benchmarking and Optimizing Large Language Models in Resource-Constrained Environments** (2024)
5. **From BERT to GPT-3: Architectural Innovations and Emergent Capabilities in Large Language Models** (2023)
6. **Prompt Engineering Paradigms: Optimizing LLM Performance Through Strategic Input Design** (2023)

Books: *Inside Large Language Models: From Tokens to Intelligence* (2025), *Rethinking Intelligence in Machines* (2025), *Engineering LLMs: Design, Optimization, and Deployment* (2024), *The Fragility of AI Reasoning Systems* (Geh Press, 2026), *Why Language Models Fail* (Geh Press).

---

## Links

- Website: [fardeen.net](https://fardeen.net)
- Hugging Face: [neuralcrew](https://huggingface.co/neuralcrew)
- ORCID: [0009-0005-4765-1382](https://orcid.org/0009-0005-4765-1382)
- GitHub: [fardeen0424](https://github.com/fardeen0424)
- LinkedIn: [fardeen0424](https://linkedin.com/in/fardeen0424)
- Email: fardeen0424@gmail.com

---

## Development

```bash
pnpm install
pnpm dev     # http://localhost:3080
pnpm build
```
