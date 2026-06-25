import React from "react";
import { DATA } from "@/data/resume";

export default function SchemaMarkup() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Fardeen NB",
    "givenName": "Fardeen",
    "familyName": "NB",
    "additionalName": "Fardeen Noor Basha",
    "alternateName": [
      "Fardeen Noor Basha",
      "Fardeen N.B.",
      "F. NB",
      "NB Fardeen"
    ],
    "birthDate": "2001-04-24",
    "birthPlace": {
      "@type": "Place",
      "name": "India"
    },
    "url": "https://fardeen.net",
    "image": "https://fardeen.net/me.png",
    "jobTitle": "Artificial Intelligence Scientist",
    "description": "Fardeen NB (Fardeen Noor Basha) is an Artificial Intelligence Scientist at Mercurion AI, a deep learning researcher specializing in transformer architectures and model compression, and the creator of the Neutrino-Instruct LLM.",
    "gender": "http://schema.org/Male",
    "nationality": {
      "@type": "Country",
      "name": "United States"
    },
    "worksFor": {
      "@type": "Organization",
      "name": "Mercurion AI, Inc.",
      "url": "https://mercurion.ai"
    },
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "University of Cincinnati",
      "url": "https://www.uc.edu",
      "sameAs": "https://en.wikipedia.org/wiki/University_of_Cincinnati"
    },
    "knowsAbout": [
      "Artificial Intelligence",
      "Deep Learning",
      "Large Language Models",
      "Transformer Architectures",
      "Model Compression",
      "Neural Networks",
      "Natural Language Processing",
      "Supervised Fine-Tuning",
      "Reinforcement Learning from Human Feedback (RLHF)",
      "Neural Network Pruning",
      "Attention Mechanism",
      "Compositional Data Augmentation",
      "Algorithmic Pattern Identification"
    ],
    "sameAs": [
      "https://scholar.google.com/citations?user=RyRxxs8AAAAJ",
      "https://huggingface.co/neuralcrew/neutrino-instruct",
      "https://www.researchgate.net/profile/Fardeen-Nb",
      "https://github.com/fardeen0424",
      "https://linkedin.com/in/fardeen0424",
      "https://x.com/fardeen0424"
    ],
    "creator": [
      {
        "@type": "SoftwareApplication",
        "name": "Neutrino-Instruct",
        "applicationCategory": "Artificial Intelligence Software / Large Language Model",
        "operatingSystem": "All",
        "url": "https://huggingface.co/neuralcrew/neutrino-instruct",
        "description": "A 7-billion parameter open-source language model pre-trained and post-trained entirely from scratch to champion high-quality data curation."
      },
      {
        "@type": "SoftwareApplication",
        "name": "FX Pattern Pro",
        "applicationCategory": "Fintech / Quantitative Trading Software",
        "dateCreated": "2019",
        "description": "Desktop-based fintech application developed to help quantitative traders identify algorithmic pattern structures."
      }
    ],
    "hasPart": [
      {
        "@type": "Book",
        "name": "Inside Large Language Models From Tokens to Intelligence",
        "author": {
          "@type": "Person",
          "name": "Fardeen NB"
        },
        "datePublished": "2025",
        "description": "A comprehensive analysis exploring token processing and emergent intelligence in large language models."
      },
      {
        "@type": "Book",
        "name": "The Fragility of AI Reasoning Systems",
        "author": {
          "@type": "Person",
          "name": "Fardeen NB"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Geh Press"
        },
        "datePublished": "2026",
        "description": "An investigation into structural vulnerabilities and failure modes of current neural network reasoning paradigms."
      },
      {
        "@type": "Book",
        "name": "Why Language Models Fail",
        "author": {
          "@type": "Person",
          "name": "Fardeen NB"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Geh Press"
        },
        "description": "A study on boundary cases, hallucination rates, and mechanical limitations of autoregressive models."
      },
      {
        "@type": "ScholarlyArticle",
        "name": "THE ATTENTION DISTANCE PROBLEM: THEORETICAL ANALYSIS OF LONG-RANGE DEPENDENCIES IN TRANSFORMERS",
        "author": ["NB Fardeen", "NB Sameer"],
        "datePublished": "2024",
        "journal": "Dianli Xitong Baohu yu Kongzhi/Power System Protection and Control"
      },
      {
        "@type": "ScholarlyArticle",
        "name": "Emergent Complex Reasoning Through Compositional Data Augmentation: How Synthetic Task Diversity Shapes Cognitive Capabilities in Large Language Models",
        "author": ["NB Fardeen", "NB Sameer"],
        "datePublished": "2023",
        "journal": "Journal of Information Systems Engineering & Management"
      },
      {
        "@type": "ScholarlyArticle",
        "name": "Prompt Engineering Paradigms: Optimizing LLM Performance Through Strategic Input Design",
        "author": ["NB Fardeen", "NB Sameer"],
        "datePublished": "2023",
        "journal": "Journal of Information Systems Engineering & Management"
      },
      {
        "@type": "ScholarlyArticle",
        "name": "From BERT To GPT-3: Architectural Innovations and Emergent Capabilities in Large Language Models",
        "author": ["F NB", "NB Sameer"],
        "datePublished": "2023"
      },
      {
        "@type": "ScholarlyArticle",
        "name": "Attention-Guided Pruning: A Systematic Approach for Compressing Transformer Models",
        "author": ["NB Fardeen", "NB Sameer"],
        "datePublished": "2022",
        "journal": "International Journal of Intelligent Systems and Applications in Engineering"
      },
      {
        "@type": "ScholarlyArticle",
        "name": "Artificial Intelligence-Based Real-Time Vision System for Autonomous Vehicles with Lane and Object Awareness",
        "author": ["NB Fardeen", "NB Sameer"],
        "datePublished": "2023",
        "journal": "Journal of Information Systems Engineering & Management"
      },
      {
        "@type": "ScholarlyArticle",
        "name": "EffiLLM: A Comprehensive Framework for Benchmarking and Optimizing Large Language Models in Resource-Constrained Environments",
        "author": ["NB Fardeen", "NB Sameer"],
        "datePublished": "2024"
      },
      {
        "@type": "ScholarlyArticle",
        "name": "A Comparative Analysis of Dimension Reduction Techniques for High-Dimensional Classification Tasks",
        "author": ["NB Fardeen", "NB Sameer"],
        "datePublished": "2022",
        "journal": "International Journal of Intelligent Systems and Applications in Engineering"
      },
      {
        "@type": "ScholarlyArticle",
        "name": "Automatic Classification of Leukemia Cells via Flow Cytometry and Mitral Regurgitation Detection Using Machine Learning Algorithms",
        "author": ["NB Fardeen", "NB Sameer"],
        "datePublished": "2021",
        "journal": "Power System Protection and Control"
      },
      {
        "@type": "ScholarlyArticle",
        "name": "BEYOND THE PIXEL: ASSESSING REAL-TIME OBJECT DETECTION MODELS IN LOW-VISIBILITY AUTONOMOUS DRIVING ENVIRONMENTS",
        "author": ["NB Fardeen", "NB Sameer"],
        "datePublished": "2025",
        "journal": "Power System Protection and Control"
      },
      {
        "@type": "ScholarlyArticle",
        "name": "Rethinking Intelligence in Machines",
        "author": ["NB Fardeen"],
        "datePublished": "2025"
      },
      {
        "@type": "ScholarlyArticle",
        "name": "Engineering LLMs: Design, Optimization, and Deployment",
        "author": ["NB Fardeen"],
        "datePublished": "2024"
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}
