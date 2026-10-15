import React from "react";
import { DATA } from "@/data/resume";
import scholarData from "@/data/scholar.json";

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
    "birthDate": "2002-04-24",
    "birthPlace": {
      "@type": "Place",
      "name": "Vijayawada, India"
    },
    "height": {
      "@type": "QuantitativeValue",
      "value": 180,
      "unitCode": "CMT"
    },
    "homeLocation": {
      "@type": "Place",
      "name": "Cincinnati, Ohio, United States"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Cincinnati",
      "addressRegion": "OH",
      "addressCountry": "US"
    },
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "h-index",
        "value": scholarData.hIndex
      },
      {
        "@type": "PropertyValue",
        "name": "i10-index",
        "value": scholarData.i10Index
      },
      {
        "@type": "PropertyValue",
        "name": "Total Citations",
        "value": scholarData.totalCitations
      }
    ],
    "url": "https://fardeen.net",
    "image": "https://fardeen.net/me.png",
    "jobTitle": "AI Engineer",
    "description": "Fardeen NB (Fardeen Noor Basha) is an AI Engineer based in Cincinnati, Ohio, who builds production LLM systems and trains models from scratch. He has shipped six AI features into the revenue cycle at Insight Hospital and Medical Center, pre-trained and post-trained Neutrino-Instruct, an open 7-billion-parameter language model, and publishes research on long-range dependencies in transformers.",
    "gender": "http://schema.org/Male",
    "nationality": {
      "@type": "Country",
      "name": "India"
    },
    "worksFor": {
      "@type": "Organization",
      "name": "Insight Hospital and Medical Center",
      "url": "https://www.insightchicago.com/"
    },
    "affiliation": [
      {
        "@type": "Organization",
        "name": "Insight Hospital and Medical Center",
        "url": "https://www.insightchicago.com/"
      },
      {
        "@type": "Organization",
        "name": "Accenture",
        "url": "https://accenture.com"
      },
      {
        "@type": "Organization",
        "name": "FX Pattern Pro",
        "description": "Founder"
      }
    ],
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "University of Cincinnati",
      "url": "https://www.uc.edu",
      "sameAs": "https://en.wikipedia.org/wiki/University_of_Cincinnati"
    },
    "memberOf": [
      {
        "@type": "Organization",
        "name": "Institute of Electrical and Electronics Engineers (IEEE)",
        "url": "https://www.ieee.org",
        "sameAs": "https://en.wikipedia.org/wiki/Institute_of_Electrical_and_Electronics_Engineers",
        "description": "Senior Member"
      },
      {
        "@type": "Organization",
        "name": "NeuralCrew",
        "url": "https://github.com/neuralcrew",
        "description": "Founder and lead researcher"
      },
      {
        "@type": "Organization",
        "name": "Power System Protection and Control (Journal)",
        "url": "https://pspac.info/index.php/dlbh/about/editorialTeam",
        "sameAs": "http://www.pspac.info",
        "description": "Reviewer Board Member"
      }
    ],
    "colleague": [
      {
        "@type": "Person",
        "name": "NB Sameer",
        "jobTitle": "Researcher"
      }
    ],
    "hasCredential": [
      {
        "@type": "EducationalOccupationalCredential",
        "name": "Master of Engineering in Artificial Intelligence",
        "credentialCategory": "degree",
        "educationalLevel": "Master's degree",
        "about": [
          {
            "@type": "Thing",
            "name": "Artificial Intelligence"
          }
        ],
        "recognizedBy": {
          "@type": "EducationalOrganization",
          "name": "University of Cincinnati",
          "url": "https://www.uc.edu",
          "sameAs": "https://en.wikipedia.org/wiki/University_of_Cincinnati"
        }
      },
      {
        "@type": "EducationalOccupationalCredential",
        "name": "Certified Artificial Intelligence Scientist (CAIS™)",
        "credentialCategory": "certification",
        "recognizedBy": {
          "@type": "Organization",
          "name": "United States Artificial Intelligence Institute (USAII®)",
          "url": "https://www.usaii.org"
        }
      },
      {
        "@type": "EducationalOccupationalCredential",
        "name": "NVIDIA-Certified Associate: Generative AI and LLMs (NCA-GENL)",
        "credentialCategory": "certification",
        "recognizedBy": {
          "@type": "Organization",
          "name": "NVIDIA Corporation",
          "url": "https://www.nvidia.com"
        }
      },
      {
        "@type": "EducationalOccupationalCredential",
        "name": "NVIDIA-Certified Associate: Generative AI and Multimodal (NCA-GENM)",
        "credentialCategory": "certification",
        "recognizedBy": {
          "@type": "Organization",
          "name": "NVIDIA Corporation",
          "url": "https://www.nvidia.com"
        }
      }
    ],
    "email": "mailto:fardeen0424@gmail.com",
    "knowsLanguage": [
      {
        "@type": "Language",
        "name": "English"
      },
      {
        "@type": "Language",
        "name": "Telugu"
      },
      {
        "@type": "Language",
        "name": "Hindi"
      }
    ],
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
      "Algorithmic Pattern Identification",
      "Machine Learning",
      "Software Engineering",
      "Distributed Systems",
      "Full-Stack Development",
      "API Design",
      "PyTorch",
      "Model Deployment",
      "Computer Vision",
      "Time-Series Forecasting",
      "Data Augmentation",
      "Low-Rank Adaptation (LoRA)",
      "Parameter-Efficient Fine-Tuning (PEFT)",
      "GGUF Quantization",
      "Model Distillation",
      "Autoregressive Models",
      "Model Optimization",
      "Distributed Training",
      "High-Performance Computing (HPC)"
    ],
    "sameAs": [
      "https://huggingface.co/neuralcrew/neutrino-instruct",
      "https://www.researchgate.net/profile/Fardeen-Nb",
      "https://github.com/fardeen0424",
      "https://www.linkedin.com/in/fardeennb/",
      "https://orcid.org/0009-0005-4765-1382",
      "https://pspac.info/index.php/dlbh/about/editorialTeam"
    ],
    "creator": [
      {
        "@type": "SoftwareApplication",
        "name": "Neutrino-Instruct",
        "applicationCategory": "Artificial Intelligence Software / Large Language Model",
        "operatingSystem": "All",
        "url": "https://huggingface.co/neuralcrew/neutrino-instruct",
        "description": "An open 7-billion-parameter language model, pre-trained and post-trained from scratch by Fardeen NB, that tests how far careful curation of open data can go without frontier-scale compute."
      },
      {
        "@type": "SoftwareApplication",
        "name": "FX Pattern Pro",
        "applicationCategory": "Fintech / Quantitative Trading Software",
        "dateCreated": "2019",
        "description": "A desktop application, founded by Fardeen NB in 2019, that helps quantitative traders detect algorithmic chart patterns."
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
        "@type": "Book",
        "name": "Rethinking Intelligence in Machines",
        "author": {
          "@type": "Person",
          "name": "Fardeen NB"
        },
        "datePublished": "2025",
        "description": "A book exploring cognitive architecture, intelligence limits, and computational paradigms of machine intelligence."
      },
      {
        "@type": "Book",
        "name": "Engineering LLMs: Design, Optimization, and Deployment",
        "author": {
          "@type": "Person",
          "name": "Fardeen NB"
        },
        "datePublished": "2024",
        "description": "A comprehensive guide on engineering foundations, optimization systems, and deployment workflows for LLMs."
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
