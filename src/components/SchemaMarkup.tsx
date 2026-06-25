import React from "react";
import { DATA } from "@/data/resume";

export default function SchemaMarkup() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Fardeen NB",
    "givenName": "Fardeen",
    "familyName": "NB",
    "url": DATA.url,
    "image": `${DATA.url}${DATA.avatarUrl}`,
    "jobTitle": "Artificial Intelligence Scientist",
    "worksFor": {
      "@type": "Organization",
      "name": "Mercurion AI, Inc"
    },
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "University of Cincinnati",
      "sameAs": "https://en.wikipedia.org/wiki/University_of_Cincinnati"
    },
    "knowsAbout": [
      "Artificial Intelligence",
      "Deep Learning",
      "Large Language Models",
      "Transformer Architectures",
      "Autonomous Vehicles",
      "Model Compression"
    ],
    "sameAs": [
      "https://scholar.google.com/citations?user=RyRxxs8AAAAJ",
      "https://huggingface.co/neuralcrew/neutrino-instruct",
      "https://www.researchgate.net/profile/Fardeen-Nb",
      "https://github.com/fardeen0424",
      "https://linkedin.com/in/fardeen0424"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}
