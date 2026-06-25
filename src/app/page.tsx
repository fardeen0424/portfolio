/* eslint-disable @next/next/no-img-element */
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DATA } from "@/data/resume";
import Link from "next/link";
import Markdown from "react-markdown";
import ContactSection from "@/components/section/contact-section";
import NeutrinoSection from "@/components/section/neutrino-section";
import WorkSection from "@/components/section/work-section";
import { ArrowUpRight } from "lucide-react";
import { TextReveal } from "@/components/magicui/text-reveal";
import EducationSection from "@/components/section/education-section";
import ScholarSection from "@/components/section/scholar-section";

const BLUR_FADE_DELAY = 0.04;

export default function Page() {
  return (
    <main className="min-h-dvh flex flex-col gap-14 relative">
      <section id="hero">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <div className="gap-2 gap-y-6 flex flex-col md:flex-row justify-between">
            <div className="gap-2 flex flex-col order-2 md:order-1">
              <BlurFadeText
                delay={BLUR_FADE_DELAY}
                className="text-2xl font-medium text-neutral-800 dark:text-neutral-200 sm:text-3xl lg:text-4xl"
                yOffset={8}
                text="I'm Fardeen NB"
                as="h1"
              />
              <BlurFadeText
                className="text-muted-foreground max-w-[600px] md:text-lg lg:text-xl"
                delay={BLUR_FADE_DELAY}
                text={DATA.description}
              />
            </div>
            <BlurFade delay={BLUR_FADE_DELAY} className="order-1 md:order-2">
              <Avatar className="size-24 md:size-32 border rounded-full shadow-lg ring-4 ring-muted">
                <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
                <AvatarFallback>{DATA.initials}</AvatarFallback>
              </Avatar>
            </BlurFade>
          </div>
        </div>
      </section>
      <hr className="border-0 border-t-[1.5px] border-dashed border-neutral-500/40 dark:border-[#5e5e5e] -mx-6" />
      <section id="about">
        <TextReveal title="Biography">
          {DATA.summary}
        </TextReveal>
      </section>
      <hr className="border-0 border-t-[1.5px] border-dashed border-neutral-500/40 dark:border-[#5e5e5e] -mx-6" />
      <section id="work">
        <div className="flex min-h-0 flex-col gap-y-10">
          <BlurFade delay={BLUR_FADE_DELAY * 5}>
            <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">Work Experience</h2>
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 6}>
            <WorkSection />
          </BlurFade>
        </div>
      </section>
      <hr className="border-0 border-t-[1.5px] border-dashed border-neutral-500/40 dark:border-[#5e5e5e] -mx-6" />
      <section id="education">
        <div className="flex min-h-0 flex-col gap-y-10">
          <BlurFade delay={BLUR_FADE_DELAY * 7}>
            <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">Education</h2>
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 8}>
            <EducationSection />
          </BlurFade>
        </div>
      </section>
      <hr className="border-0 border-t-[1.5px] border-dashed border-neutral-500/40 dark:border-[#5e5e5e] -mx-6" />
      <section id="skills">
        <div className="flex min-h-0 flex-col gap-y-8">
          <BlurFade delay={BLUR_FADE_DELAY * 9}>
            <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">Skills</h2>
          </BlurFade>
          <div className="flex flex-wrap gap-2 justify-center">
            {DATA.skills.map((skill, id) => (
              <BlurFade key={skill.name} delay={BLUR_FADE_DELAY * 10 + id * 0.05}>
                <div className="border bg-background border-border ring-2 ring-border/20 rounded-full h-8 w-fit px-4 flex items-center gap-2">
                  {skill.icon && <skill.icon className="size-4 rounded overflow-hidden object-contain" />}
                  <span className="text-foreground text-sm font-medium">{skill.name}</span>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>
      <hr className="border-0 border-t-[1.5px] border-dashed border-neutral-500/40 dark:border-[#5e5e5e] -mx-6" />
      <section id="model">
        <div className="flex min-h-0 flex-col gap-y-10">
          <BlurFade delay={BLUR_FADE_DELAY * 11}>
            <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">Pretrained LLM</h2>
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 12}>
            <NeutrinoSection />
          </BlurFade>
        </div>
      </section>
      <hr className="border-0 border-t-[1.5px] border-dashed border-neutral-500/40 dark:border-[#5e5e5e] -mx-6" />
      <section id="scholar">
        <div className="flex min-h-0 flex-col gap-y-10">
          <BlurFade delay={BLUR_FADE_DELAY * 13}>
            <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">Publications & Research</h2>
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 14}>
            <ScholarSection />
          </BlurFade>
        </div>
      </section>
      <section id="contact">
        <BlurFade delay={BLUR_FADE_DELAY * 16}>
          <ContactSection />
        </BlurFade>
      </section>
      <hr className="border-0 border-t-[1.5px] border-dashed border-neutral-500/40 dark:border-[#5e5e5e] -mx-6" />
      <footer className="mt-8 flex flex-col gap-6 pb-0 -mb-20 sm:-mb-24">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground pt-2">
          <p>© {new Date().getFullYear()} Fardeen NB. All rights reserved.</p>
          <div className="flex gap-4">
            {Object.entries(DATA.contact.social).map(([name, social]) => (
              <a
                key={name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                {name}
              </a>
            ))}
          </div>
        </div>
        <div className="w-full overflow-hidden select-none pointer-events-none mt-4 flex justify-center">
          <div className="text-[4.5rem] sm:text-[7rem] md:text-[9.5rem] lg:text-[11rem] font-bold tracking-tight text-neutral-200 dark:text-neutral-800 text-center leading-none w-full font-sans">
            Fardeen
          </div>
        </div>
      </footer>
    </main>
  );
}
