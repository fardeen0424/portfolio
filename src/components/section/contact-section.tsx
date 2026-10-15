"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Copy, Mail, MapPin } from "lucide-react";
import { Icons } from "@/components/icons";
import { DATA } from "@/data/resume";
import CrtMascot from "@/components/crt-mascot";
import * as FancyButton from "@/components/ui/fancy-button";

export default function ContactSection() {
  const [copied, setCopied] = useState(false);
  const email = DATA.contact.email;

  const handleCopyEmail = () => {
    if (typeof window !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {});
    }
  };

  const specializations = [
    "Full-Stack AI Engineering",
    "RAG & AI Agents",
    "LLM Inference & Optimization",
    "Foundation Model Pre-training",
    "Distributed Training (DeepSpeed, CUDA)",
  ];

  return (
    <div className="w-full">
      <div
        className="rounded-[14px] bg-card px-6 py-8 sm:px-10 sm:py-12 overflow-hidden relative"
        style={{ boxShadow: "var(--ring-card)" }}
      >
        {/* Availability, with the mascot greeting from the corner */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col items-start">
            <div className="inline-flex items-center gap-2 whitespace-nowrap px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium font-mono">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full motion-safe:animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              {/* Shorter on phones, where the pill shares its row with the mascot */}
              <span className="sm:hidden">Open to AI roles</span>
              <span className="hidden sm:inline">Open to full-time AI engineering roles</span>
            </div>
          </div>
          {/* The drawing sits ~25% in from its cell's right edge, 16% from the top and 28% from
              the bottom; pull the button out so the CRT meets the card's content edges. */}
          <CrtMascot className="-mr-7 -mt-4 -mb-8" />
        </div>

        {/* Headline & Value Proposition */}
        <div className="flex flex-col gap-3 mt-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-foreground leading-[1.12] tracking-[-0.02em] font-serif italic text-balance">
            Let&apos;s build the next generation of AI systems.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed text-pretty max-w-2xl">
            I build production LLM systems, from retrieval pipelines and agents to models trained from scratch. I&apos;m looking for AI engineering roles where deep technical work ships to real users.
          </p>
        </div>

        {/* Recruiter Focus Areas / Specializations */}
        <div className="flex flex-wrap gap-x-4 gap-y-5 sm:gap-y-6 mt-8">
          {specializations.map((spec) => (
            <div
              key={spec}
              className="rounded-full min-h-8 py-1 w-fit px-3.5 flex items-center gap-2 bg-card transition-[transform] duration-150 active:scale-[0.96] cursor-default"
              style={{ boxShadow: "var(--ring-card)" }}
            >
              <span className="text-foreground text-[13px] font-medium font-mono">{spec}</span>
            </div>
          ))}
        </div>

        {/* Full-width separation line */}
        <div className="-mx-6 sm:-mx-10 border-b border-border my-8" />

        {/* Action Buttons & Links */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Primary actions: AlignUI fancy buttons in the brand orange */}
            <FancyButton.Root asChild variant="primary" className="shrink-0">
              <Link
                href={DATA.contact.social.LinkedIn.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FancyButton.Icon as={Icons.linkedin} className="size-4" aria-hidden="true" />
                <span className="relative z-10">Connect on LinkedIn</span>
                <ArrowUpRight className="relative z-10 -ml-1 size-3.5 opacity-80" aria-hidden="true" />
              </Link>
            </FancyButton.Root>

            <FancyButton.Root
              variant="primary"
              onClick={handleCopyEmail}
              aria-label="Copy email address"
              className="shrink-0"
            >
              {copied ? (
                <>
                  <FancyButton.Icon as={Check} className="size-4" aria-hidden="true" />
                  <span className="relative z-10">Copied</span>
                </>
              ) : (
                <>
                  <FancyButton.Icon as={Mail} className="size-4" aria-hidden="true" />
                  <span className="relative z-10">Copy email</span>
                  <Copy className="relative z-10 -ml-1 size-3.5 opacity-80" aria-hidden="true" />
                </>
              )}
            </FancyButton.Root>
            <span role="status" className="sr-only">
              {copied ? "Email address copied" : ""}
            </span>
          </div>

          {/* Secondary Quick Links: GitHub & Hugging Face */}
          <div className="flex items-center gap-2 sm:justify-end">
            <Link
              href={DATA.contact.social.GitHub.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full size-9 flex items-center justify-center bg-background border border-border text-foreground hover:bg-muted transition-[transform,colors] duration-150 active:scale-[0.96] cursor-pointer"
              aria-label="GitHub profile"
            >
              <Icons.github className="size-4" />
            </Link>
            <Link
              href={DATA.contact.huggingface}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full size-9 flex items-center justify-center bg-background border border-border text-foreground hover:bg-muted transition-[transform,colors] duration-150 active:scale-[0.96] cursor-pointer"
              aria-label="Hugging Face models"
            >
              <Icons.huggingface className="size-4" />
            </Link>
          </div>
        </div>

        {/* Location */}
        <div className="mt-8 pt-6 border-t border-border/60 flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <MapPin className="size-3.5 text-muted-foreground/70 shrink-0" aria-hidden="true" />
          <span>Cincinnati, OH · Open to relocation</span>
        </div>
      </div>
    </div>
  );
}
