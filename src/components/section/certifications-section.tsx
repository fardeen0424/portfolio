/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import { DATA } from "@/data/resume";

function LogoImage({ src, alt }: { src?: string; alt: string }) {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return (
      <div className="size-14 sm:size-16 rounded-2xl bg-muted flex items-center justify-center font-serif text-xl text-foreground/70 flex-none outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10 select-none">
        {alt?.charAt(0) || "C"}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={64}
      height={64}
      className="size-14 sm:size-16 rounded-2xl overflow-hidden object-cover flex-none outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10"
      onError={() => setImageError(true)}
    />
  );
}

/** Parses resume description lines into bulleted list per better-writing standards */
function CertificationDescription({ text }: { text: string }) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <ul className="space-y-3 list-none p-0 m-0">
      {lines.map((line, i) => {
        const content = line.replace(/^[•→\-\*]\s*/, "");
        return (
          <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground font-normal text-pretty">
            <span
              className="mt-[7px] size-1.5 rounded-full bg-foreground/45 shrink-0"
              aria-hidden="true"
            />
            <span className="flex-1">{content}</span>
          </li>
        );
      })}
    </ul>
  );
}

export default function CertificationsSection() {
  return (
    <div className="w-full">
      <div
        className="rounded-[14px] bg-card px-6 py-7 sm:px-8 sm:py-8"
        style={{ boxShadow: "var(--ring-card)" }}
      >
        {DATA.certifications.map((cert, index) => (
          <div key={cert.title}>
            {/* Divider between certification items */}
            {index > 0 && (
              <div className="-mx-6 sm:-mx-8 border-b border-border my-7 sm:my-8" />
            )}

            {/* Header row: resume layout with right-aligned timeline */}
            <div className="flex items-center gap-4 sm:gap-5">
              <LogoImage src={cert.logoUrl} alt={cert.issuer} />
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                {/* Top line: Certification title on left, Issued date on right */}
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
                  <h3 className="text-xl sm:text-[22px] font-normal leading-tight tracking-tight text-foreground font-serif italic">
                    {cert.title}
                  </h3>
                  <div className="text-sm font-medium text-foreground sm:text-right shrink-0">
                    {cert.issued}
                  </div>
                </div>
                {/* Second line: Issuing organization */}
                <h4 className="text-sm font-medium leading-snug text-muted-foreground font-sans">
                  {cert.issuer}
                </h4>
              </div>
            </div>

            {/* Description bullets */}
            {cert.description && (
              <div className="mt-6">
                <CertificationDescription text={cert.description} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
