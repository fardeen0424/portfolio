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
    "alternateName": ["Fardeen Noor Basha", "Fardeen N.B."],
    "url": "https://fardeen.net",
    "image": "https://fardeen.net/me.png",
    "jobTitle": "Artificial Intelligence Scientist",
    "description": "Fardeen NB (Fardeen Noor Basha) is an Artificial Intelligence Scientist at Mercurion AI, deep learning researcher specializing in transformer architectures, and creator of Neutrino-Instruct.",
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
      "Reinforcement Learning from Human Feedback (RLHF)"
    ],
    "sameAs": [
      "https://scholar.google.com/citations?user=RyRxxs8AAAAJ",
      "https://huggingface.co/neuralcrew/neutrino-instruct",
      "https://www.researchgate.net/profile/Fardeen-Nb",
      "https://github.com/fardeen0424",
      "https://linkedin.com/in/fardeen0424",
      "https://x.com/fardeen0424"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}
