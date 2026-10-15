/* eslint-disable @next/next/no-img-element */
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DATA } from "@/data/resume";
import Link from "next/link";
import ContactSection from "@/components/section/contact-section";
import NeutrinoSection from "@/components/section/neutrino-section";
import WorkSection from "@/components/section/work-section";
import EducationSection from "@/components/section/education-section";
import CertificationsSection from "@/components/section/certifications-section";
import ScholarSection from "@/components/section/scholar-section";

const BLUR_FADE_DELAY = 0.04;

/** Option 3: Pure Architectural Whitespace: High-contrast editorial typography with generous rhythm */
function SectionHeading({ title }: { title: string }) {
  return (
    <div className="pt-4 pb-1">
      <h2 className="text-2xl sm:text-3xl font-normal text-foreground font-serif italic tracking-tight">
        {title}
      </h2>
    </div>
  );
}

export default function Page() {
  return (
    <main className="min-h-dvh flex flex-col gap-16 relative">

      {/* ── Hero ──────────────────────────────────── */}
      <section id="hero">
        <div className="flex flex-col gap-3">
          <BlurFade delay={BLUR_FADE_DELAY} className="mb-2">
            <Avatar
              className="size-20 sm:size-24 rounded-full"
              style={{ boxShadow: "var(--ring-card)" }}
            >
              <AvatarImage alt="Portrait of Fardeen NB" src={DATA.avatarUrl} className="object-cover rounded-full" />
              <AvatarFallback className="rounded-full">{DATA.initials}</AvatarFallback>
            </Avatar>
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY}>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-foreground leading-[1.15] tracking-[-0.02em] font-serif italic text-balance">
              I&apos;m Fardeen NB
            </h1>
          </BlurFade>
          <BlurFadeText
            className="text-muted-foreground max-w-[520px] text-sm md:text-base leading-relaxed text-pretty"
            delay={BLUR_FADE_DELAY}
            text={DATA.description}
          />
        </div>
      </section>

      {/* ── About ─────────────────────────────────── */}
      <section id="about">
        <BlurFade delay={BLUR_FADE_DELAY * 3} inView>
          <div className="flex flex-col gap-6">
            <SectionHeading title="Biography" />
            <div className="flex flex-col gap-4">
              {DATA.summary.split("\n\n").map((para, idx) => (
                <p key={idx} className="text-sm md:text-base leading-relaxed text-muted-foreground font-normal text-pretty max-w-[600px]">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </BlurFade>
      </section>

      {/* ── Work Experience ───────────────────────── */}
      <section id="work">
        <div className="flex min-h-0 flex-col gap-y-8">
          <BlurFade delay={BLUR_FADE_DELAY * 4} inView>
            <SectionHeading title="Work Experience" />
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 5} inView>
            <WorkSection />
          </BlurFade>
        </div>
      </section>

      {/* ── Education ─────────────────────────────── */}
      <section id="education">
        <div className="flex min-h-0 flex-col gap-y-8">
          <BlurFade delay={BLUR_FADE_DELAY * 4} inView>
            <SectionHeading title="Education" />
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 5} inView>
            <EducationSection />
          </BlurFade>
        </div>
      </section>

      {/* ── Skills ────────────────────────────────── */}
      <section id="skills">
        <div className="flex min-h-0 flex-col gap-y-8">
          <BlurFade delay={BLUR_FADE_DELAY * 4} inView>
            <SectionHeading title="Skills & Technologies" />
          </BlurFade>
          <div className="flex flex-wrap gap-x-4 gap-y-5 sm:gap-y-6">
            {DATA.skills.map((skill, id) => (
              <BlurFade key={skill.name} delay={BLUR_FADE_DELAY * 5 + id * 0.03} inView>
                <div
                  className="rounded-full h-8 w-fit px-3.5 flex items-center gap-2 bg-card transition-[transform] duration-150 active:scale-[0.96] cursor-default"
                  style={{ boxShadow: "var(--ring-card)" }}
                >
                  {skill.icon && <skill.icon className="size-3.5 rounded overflow-hidden object-contain" />}
                  <span className="text-foreground text-[13px] font-medium font-mono">{skill.name}</span>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* ── Certifications ────────────────────────── */}
      <section id="certifications">
        <div className="flex min-h-0 flex-col gap-y-8">
          <BlurFade delay={BLUR_FADE_DELAY * 4} inView>
            <SectionHeading title="Certifications" />
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 5} inView>
            <CertificationsSection />
          </BlurFade>
        </div>
      </section>

      {/* ── Pre-trained LLM ───────────────────────── */}
      <section id="model">
        <div className="flex min-h-0 flex-col gap-y-8">
          <BlurFade delay={BLUR_FADE_DELAY * 4} inView>
            <SectionHeading title="Pre-trained LLM" />
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 5} inView>
            <NeutrinoSection />
          </BlurFade>
        </div>
      </section>

      {/* ── Publications ──────────────────────────── */}
      <section id="scholar">
        <div className="flex min-h-0 flex-col gap-y-8">
          <BlurFade delay={BLUR_FADE_DELAY * 4} inView>
            <SectionHeading title="Publications & Research" />
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 5} inView>
            <ScholarSection />
          </BlurFade>
        </div>
      </section>

      {/* ── Contact ───────────────────────────────── */}
      <section id="contact">
        <div className="flex min-h-0 flex-col gap-y-8">
          <BlurFade delay={BLUR_FADE_DELAY * 4} inView>
            <SectionHeading title="Get in Touch" />
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 5} inView>
            <ContactSection />
          </BlurFade>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────── */}
      <footer className="mt-4 flex flex-col gap-6 pb-0 -mb-20 sm:-mb-24">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground pt-2">
          <p>© {new Date().getFullYear()} Fardeen NB. All rights reserved.</p>
          <div className="flex gap-4">
            {Object.entries(DATA.contact.social).map(([key, social]) => (
              <a
                key={key}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors duration-150"
              >
                {social.name}
              </a>
            ))}
          </div>
        </div>
        <div className="w-full overflow-hidden select-none pointer-events-none mt-4 flex justify-center" aria-hidden="true">
          <div className="text-[4rem] sm:text-[5.8rem] md:text-[8rem] lg:text-[9.2rem] font-normal italic tracking-tight text-neutral-200 dark:text-neutral-800 text-center leading-none w-full font-serif">
            FARDEEN
          </div>
        </div>
      </footer>
    </main>
  );
}
