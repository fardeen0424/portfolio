// Home page sections in reading order: ids match the <section> elements in src/app/page.tsx.
// `label` names the section in full (ruler pill); `short` fits the left rail and island menu.
export const PAGE_SECTIONS = [
  { id: "hero", label: "Introduction", short: "Introduction" },
  { id: "about", label: "Biography", short: "Biography" },
  { id: "work", label: "Work Experience", short: "Experience" },
  { id: "education", label: "Education", short: "Education" },
  { id: "skills", label: "Skills & Technologies", short: "Skills" },
  { id: "certifications", label: "Certifications", short: "Certifications" },
  { id: "model", label: "Pre-trained LLM", short: "Model" },
  { id: "scholar", label: "Publications & Research", short: "Research" },
  { id: "contact", label: "Get in Touch", short: "Contact" },
];

export type PageSectionId = (typeof PAGE_SECTIONS)[number]["id"];
