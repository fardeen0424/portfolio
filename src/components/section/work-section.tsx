/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";

function LogoImage({ src, alt }: { src: string; alt: string }) {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return (
      <div className="size-14 sm:size-16 rounded-2xl bg-muted flex items-center justify-center font-serif text-xl text-foreground/70 flex-none outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10 select-none">
        {alt?.charAt(0) || "W"}
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
function WorkDescription({ text }: { text: string }) {
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

export default function WorkSection() {
  return (
    <div className="w-full flex flex-col gap-6">
      {DATA.work.map((work) => (
        <div
          key={work.company}
          className="rounded-[14px] bg-card px-6 py-7 sm:px-8 sm:py-8"
          style={{ boxShadow: "var(--ring-card)" }}
        >
          {/* Header row: resume layout with right-aligned timeline */}
          <div className="flex items-center gap-4 sm:gap-5">
            <LogoImage src={work.logoUrl} alt={work.company} />
            <div className="flex-1 min-w-0 flex flex-col gap-1">
              {/* Top line: Institution on left, Timeline on right */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
                <h3 className="text-xl sm:text-[22px] font-normal leading-tight tracking-tight text-foreground font-serif italic">
                  {work.company}
                </h3>
                <div className="text-sm font-medium text-foreground sm:text-right shrink-0">
                  {work.start} - {work.end ?? "Present"}
                </div>
              </div>
              {/* Second line: Role on left, Location on right */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-4 text-sm">
                <h4 className="font-medium text-muted-foreground font-sans">
                  {work.title}
                </h4>
                <span className="text-xs text-muted-foreground/80 font-mono tabular-nums">
                  {work.location}
                </span>
              </div>
            </div>
          </div>

          {/* Full-width separation line touching both ends */}
          <div className="-mx-6 sm:-mx-8 border-b border-border my-6" />

          {/* Resume bullet list */}
          <WorkDescription text={work.description} />
        </div>
      ))}
    </div>
  );
}
