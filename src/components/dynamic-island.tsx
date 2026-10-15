"use client";

/* eslint-disable @next/next/no-img-element */
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion, type Transition, type Variants } from "framer-motion";
import { Sparkline } from "@microcharts/react/sparkline";
import {
  BadgeCheck,
  BookOpen,
  Briefcase,
  Building2,
  ChevronDown,
  Cpu,
  Download,
  GraduationCap,
  House,
  Layers,
  Mail,
  MapPin,
  Plane,
  Quote,
  Rocket,
  School,
  ShieldCheck,
  Sparkles,
  UserRound,
  Wrench,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Icons } from "@/components/icons";
import { DATA } from "@/data/resume";
import scholarData from "@/data/scholar.json";
import { PAGE_SECTIONS } from "@/data/sections";
import { estimateDownloadSeries, useModelDownloads } from "@/lib/model-downloads";
import { cn } from "@/lib/utils";

// Morph springs: a touch of bounce on the shape, like the Dynamic Island; none on content.
const MORPH: Transition = { type: "spring", visualDuration: 0.45, bounce: 0.2 };
const SWAP: Transition = { duration: 0.2, ease: [0.22, 1, 0.36, 1] };
const BLUR = "blur(4px)";
const INSTANT: Transition = { duration: 0 };

// Geometry: an 8px inset around a 36px glyph (Apple keeps island content off the edges),
// and corner radii concentric with what they hold.
const COMPACT_RADIUS = 26; // 18px glyph radius + 8px inset
const EXPANDED_RADIUS = 34; // 24px row radius + 10px panel padding

// From this width the left rail handles navigation and the island only reports.
const DESKTOP_QUERY = "(min-width: 1024px)";
const SCROLL_OFFSET = 96;
// A section is current once its top passes this share of the viewport.
const ANCHOR = 0.35;
// Ambient loops stop well inside WCAG 2.2.2's five seconds.
const AMBIENT_REPEATS = 3;

/* ── Leading glyphs ─────────────────────────────────────────── */

function IconGlyph({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--island-chip)]">
      <Icon className="size-4 text-[var(--island-fg)]" strokeWidth={1.75} aria-hidden="true" />
    </span>
  );
}

function PortraitGlyph() {
  return (
    <img
      src={DATA.avatarUrl}
      alt=""
      className="size-9 shrink-0 rounded-full object-cover outline outline-1 -outline-offset-1 outline-[var(--island-outline)]"
    />
  );
}

function HuggingFaceGlyph() {
  return (
    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--island-chip)]">
      <Icons.huggingface className="size-5" aria-hidden="true" />
    </span>
  );
}

/** Equalizer bars: the model "running", in the spirit of the island's now-playing view. */
function EqualizerGlyph() {
  const reduceMotion = useReducedMotion();
  const bars = [
    [0.4, 1, 0.55, 0.85],
    [0.9, 0.45, 1, 0.5],
    [0.6, 0.95, 0.35, 0.8],
    [1, 0.5, 0.75, 0.4],
  ];
  return (
    <span className="flex size-9 shrink-0 items-center justify-center gap-[3px] rounded-full bg-[var(--island-chip)]">
      {bars.map((frames, i) => (
        <motion.span
          key={i}
          className="h-4 w-[2.5px] rounded-full bg-[var(--island-fg)]"
          style={{ originY: 0.5, scaleY: frames[0] }}
          animate={reduceMotion ? undefined : { scaleY: frames }}
          transition={{
            duration: 0.9,
            repeat: AMBIENT_REPEATS,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: i * 0.08,
          }}
        />
      ))}
    </span>
  );
}

/** Availability dot with a short pulse. */
function StatusGlyph() {
  const reduceMotion = useReducedMotion();
  return (
    <span className="relative grid size-9 shrink-0 place-items-center rounded-full bg-emerald-500/15">
      {!reduceMotion && (
        <motion.span
          className="absolute size-2.5 rounded-full bg-emerald-500"
          initial={{ scale: 1, opacity: 0.7 }}
          animate={{ scale: 2.6, opacity: 0 }}
          transition={{ duration: 1.2, repeat: AMBIENT_REPEATS, ease: "easeOut" }}
        />
      )}
      <span className="relative size-2.5 rounded-full bg-emerald-500" />
    </span>
  );
}

/* ── Trailing accessories ───────────────────────────────────── */

/** A quiet, non-interactive fact chip: no hover or press states, so it never reads as a control. */
function Chip({ icon: Icon, children }: { icon?: LucideIcon; children: ReactNode }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-[var(--island-chip)] px-2.5 py-1 text-xs font-medium [font-variant-numeric:tabular-nums] text-[var(--island-fg)]">
      {Icon && <Icon className="size-3.5 text-[var(--island-muted)]" strokeWidth={1.75} aria-hidden="true" />}
      {children}
    </span>
  );
}

const STACKED_SKILLS = ["PyTorch", "Hugging Face", "JAX"];

/** Overlapping tool logos, like an avatar stack, with the remainder counted. */
function SkillStack() {
  const shown = DATA.skills.filter((skill) => STACKED_SKILLS.includes(skill.name));
  return (
    <span className="flex items-center gap-2">
      <span className="flex">
        {shown.map((skill, i) => (
          <span
            key={skill.name}
            className={cn(
              "grid size-6 place-items-center rounded-full bg-white text-neutral-900 ring-2 ring-[var(--island-bg)]",
              i > 0 && "-ml-1.5"
            )}
          >
            <skill.icon className="size-3.5" aria-hidden="true" />
          </span>
        ))}
      </span>
      <span className="text-xs font-medium [font-variant-numeric:tabular-nums] text-[var(--island-muted)]">
        +{DATA.skills.length - shown.length}
      </span>
    </span>
  );
}

const compactNumber = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

function DownloadsTotal() {
  const { allTime } = useModelDownloads();
  return <>{allTime.toLocaleString("en-US")}</>;
}

/**
 * Cumulative downloads as a microcharts sparkline, drawn on left to right, plus the
 * 30-day gain. The ends are real totals; the curve between them is estimated.
 */
function DownloadsTrend({ reduceMotion }: { reduceMotion: boolean }) {
  const downloads = useModelDownloads();
  const series = useMemo(
    () => estimateDownloadSeries(downloads).map((point) => point.allTime),
    [downloads]
  );
  return (
    <span className="flex items-center gap-2.5">
      <motion.span
        className="block"
        initial={reduceMotion ? false : { clipPath: "inset(0 100% 0 0)" }}
        animate={{ clipPath: "inset(0 0% 0 0)" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
      >
        <Sparkline
          data={series}
          width={80}
          height={28}
          curve="smooth"
          dots="auto"
          color="var(--island-up)"
          summary={false}
          className="block h-7 w-20"
        />
      </motion.span>
      <span className="rounded-full bg-[var(--island-up)]/15 px-2 py-0.5 text-xs font-semibold [font-variant-numeric:tabular-nums] text-[var(--island-up)] max-[400px]:hidden">
        +{compactNumber.format(downloads.last30Days)}
      </span>
    </span>
  );
}

/* ── Activities ─────────────────────────────────────────────── */

type Activity = {
  glyph: ReactNode;
  /** First line: a small icon and a quiet label. */
  eyebrowIcon: LucideIcon;
  eyebrow: string;
  /** Second line: the headline fact. */
  title: ReactNode;
  /** Replaces the title below 480px, where the full one would crowd the screen. */
  shortTitle?: string;
  accessory?: ReactNode;
  /** Keep the accessory on narrow phones, where it is the point of the state. */
  keepAccessory?: boolean;
};

const currentRole = DATA.work[0];
const degree = DATA.education[0];
const pick = (names: string[]) =>
  DATA.skills.filter((skill) => names.includes(skill.name)).map((skill) => skill.name).join(" · ");

// What the island says in each section, drawn from the same data the page renders.
const ACTIVITIES: Record<string, Activity> = {
  hero: {
    glyph: <PortraitGlyph />,
    eyebrowIcon: Sparkles,
    eyebrow: "AI Engineer",
    title: DATA.name,
    accessory: <Chip icon={MapPin}>Cincinnati</Chip>,
  },
  about: {
    glyph: <IconGlyph icon={UserRound} />,
    eyebrowIcon: Rocket,
    eyebrow: "Biography",
    title: "Builder since 2019",
    accessory: <Chip>Founder → Engineer</Chip>,
  },
  work: {
    glyph: <IconGlyph icon={Briefcase} />,
    eyebrowIcon: Building2,
    eyebrow: `Now at ${currentRole.company.split(" and ")[0]}`,
    title: currentRole.title,
    accessory: <Chip icon={Zap}>6 AI features</Chip>,
  },
  education: {
    glyph: <IconGlyph icon={GraduationCap} />,
    eyebrowIcon: School,
    eyebrow: degree.school,
    title: "M.Eng, Artificial Intelligence",
    shortTitle: "M.Eng, AI",
    accessory: <Chip>Class of {degree.end.split(" ").pop()}</Chip>,
  },
  skills: {
    glyph: <IconGlyph icon={Layers} />,
    eyebrowIcon: Wrench,
    eyebrow: "Toolkit",
    title: pick(["PyTorch", "CUDA", "vLLM"]),
    accessory: <SkillStack />,
  },
  certifications: {
    glyph: <IconGlyph icon={BadgeCheck} />,
    eyebrowIcon: ShieldCheck,
    eyebrow: "Certified by",
    title: "NVIDIA · USAII",
    accessory: <Chip>{DATA.certifications.length} credentials</Chip>,
  },
  model: {
    glyph: <EqualizerGlyph />,
    eyebrowIcon: Cpu,
    eyebrow: "Pre-trained from scratch",
    title: "Neutrino-Instruct 7B",
    accessory: <Chip>Apache-2.0</Chip>,
  },
  downloads: {
    glyph: <HuggingFaceGlyph />,
    eyebrowIcon: Download,
    eyebrow: "Downloads",
    title: <DownloadsTotal />,
    keepAccessory: true,
  },
  scholar: {
    glyph: <IconGlyph icon={BookOpen} />,
    eyebrowIcon: Quote,
    eyebrow: "Google Scholar",
    title: `${scholarData.totalCitations.toLocaleString("en-US")} citations`,
    accessory: <Chip>h-index {scholarData.hIndex}</Chip>,
  },
  contact: {
    glyph: <StatusGlyph />,
    eyebrowIcon: Mail,
    eyebrow: "Get in touch",
    title: "Open to AI roles",
    accessory: <Chip icon={Plane}>Will relocate</Chip>,
  },
};

const MENU_ICONS: Record<string, LucideIcon> = {
  hero: House,
  about: UserRound,
  model: Cpu,
  scholar: BookOpen,
  work: Briefcase,
  education: GraduationCap,
  skills: Layers,
  certifications: BadgeCheck,
  contact: Mail,
};

function subscribeDesktop(onChange: () => void) {
  const query = window.matchMedia(DESKTOP_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function useIsDesktop() {
  return useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false
  );
}

// Island states in page order. "downloads" is a sub-state of the model section, keyed to
// the downloads chart rather than a navigation target.
const ISLAND_ANCHORS = PAGE_SECTIONS.flatMap((section) =>
  section.id === "model" ? [section.id, "downloads"] : [section.id]
);

// The navigation section an island state belongs to.
const sectionOf = (state: string) => (state === "downloads" ? "model" : state);

type IslandState = { id: string; direction: 1 | -1 };

/** The island state in view, and which way the reader travelled to reach it. */
function useActiveSection() {
  const [state, setState] = useState<IslandState>({ id: ISLAND_ANCHORS[0], direction: 1 });

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const last = ISLAND_ANCHORS[ISLAND_ANCHORS.length - 1];
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      let next = ISLAND_ANCHORS[0];
      if (atBottom && document.getElementById(last)) {
        next = last;
      } else {
        const anchor = window.innerHeight * ANCHOR;
        for (const id of ISLAND_ANCHORS) {
          const element = document.getElementById(id);
          if (element && element.getBoundingClientRect().top <= anchor) next = id;
        }
      }
      setState((current) =>
        current.id === next
          ? current
          : {
              id: next,
              direction: ISLAND_ANCHORS.indexOf(next) >= ISLAND_ANCHORS.indexOf(current.id) ? 1 : -1,
            }
      );
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return state;
}

// Each part rises in from the side the reader is travelling toward, 40ms apart
// (--duration-stagger); exits are quicker and unstaggered, so a close never lags.
const groupVariants: Variants = {
  enter: {},
  center: { transition: { staggerChildren: 0.04 } },
  exit: {},
};
const partVariants: Variants = {
  enter: (direction: number) => ({ opacity: 0, y: direction * 6, filter: BLUR }),
  center: { opacity: 1, y: 0, filter: "blur(0px)", transition: SWAP },
  exit: { opacity: 0, filter: BLUR, transition: { duration: 0.12 } },
};
const reducedPartVariants: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: SWAP },
  exit: { opacity: 0, transition: { duration: 0.12 } },
};

/** The compact island's content: glyph, two lines of text and a trailing accessory. */
function ActivityContent({ state, reduceMotion }: { state: IslandState; reduceMotion: boolean }) {
  const activity = ACTIVITIES[state.id] ?? ACTIVITIES.hero;
  const EyebrowIcon = activity.eyebrowIcon;
  const part = reduceMotion ? reducedPartVariants : partVariants;
  const accessory =
    state.id === "downloads" ? <DownloadsTrend reduceMotion={reduceMotion} /> : activity.accessory;

  return (
    <AnimatePresence mode="popLayout" initial={false} custom={state.direction}>
      <motion.span
        key={state.id}
        layout
        custom={state.direction}
        variants={groupVariants}
        initial="enter"
        animate="center"
        exit="exit"
        className="flex items-center gap-3.5 whitespace-nowrap"
      >
        <motion.span variants={part} custom={state.direction} className="flex">
          {activity.glyph}
        </motion.span>
        <span className="flex flex-col gap-0.5">
          <motion.span
            variants={part}
            custom={state.direction}
            className="flex items-center gap-1.5 text-xs leading-4 text-[var(--island-muted)]"
          >
            <EyebrowIcon className="size-3" strokeWidth={2} aria-hidden="true" />
            {activity.eyebrow}
          </motion.span>
          <motion.span
            variants={part}
            custom={state.direction}
            className="text-[15px] font-medium leading-5 [font-variant-numeric:tabular-nums] text-[var(--island-fg)]"
          >
            {activity.shortTitle ? (
              <>
                <span className="max-[480px]:hidden">{activity.title}</span>
                <span className="hidden max-[480px]:inline">{activity.shortTitle}</span>
              </>
            ) : (
              activity.title
            )}
          </motion.span>
        </span>
        {accessory && (
          <motion.span
            variants={part}
            custom={state.direction}
            className={cn("flex", !activity.keepAccessory && "max-[480px]:hidden")}
          >
            {accessory}
          </motion.span>
        )}
      </motion.span>
    </AnimatePresence>
  );
}

/**
 * Site status as a Dynamic Island: a capsule that says something specific about the
 * section in view. Below the desktop breakpoint it also opens into the section menu.
 */
export default function DynamicIsland() {
  const islandState = useActiveSection();
  const active = islandState.id;
  const isDesktop = useIsDesktop();
  const reduceMotion = useReducedMotion() ?? false;
  const [requestedOpen, setRequestedOpen] = useState(false);
  // The menu only exists below the desktop breakpoint, where there is no rail.
  const open = requestedOpen && !isDesktop;
  const islandRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const restoreFocusRef = useRef(false);
  const panelId = useId();

  const activeSection = sectionOf(active);
  const activeLabel = PAGE_SECTIONS.find((section) => section.id === activeSection)?.short ?? "";
  const morph = reduceMotion ? INSTANT : MORPH;
  const swap = reduceMotion ? INSTANT : SWAP;

  const close = useCallback((restoreFocus: boolean) => {
    restoreFocusRef.current = restoreFocus;
    setRequestedOpen(false);
  }, []);

  // Move focus into the menu on open, and back to the island when it closes by keyboard.
  useEffect(() => {
    if (open) {
      const frame = window.requestAnimationFrame(() => firstLinkRef.current?.focus());
      return () => window.cancelAnimationFrame(frame);
    }
    if (restoreFocusRef.current) {
      restoreFocusRef.current = false;
      triggerRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close(true);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!islandRef.current?.contains(event.target as Node)) close(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, close]);

  const goTo = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const element = document.getElementById(id);
    // Off the home page, let the link navigate to /#id.
    if (!element) return;
    event.preventDefault();
    close(false);
    const top = element.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
    window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
    window.history.replaceState(null, "", `#${id}`);
  };

  const focusRing =
    "outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:-outline-offset-2 focus-visible:outline-[var(--island-fg)]";

  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-4 sm:top-4">
      <motion.div
        ref={islandRef}
        layout
        initial={false}
        animate={{ borderRadius: open ? EXPANDED_RADIUS : COMPACT_RADIUS }}
        transition={morph}
        className="squircle pointer-events-auto overflow-hidden bg-[var(--island-bg)] text-[var(--island-fg)] shadow-[var(--island-shadow)]"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {open ? (
            <motion.div
              key="menu"
              id={panelId}
              layout
              initial={{ opacity: 0, filter: BLUR }}
              animate={{ opacity: 1, filter: "blur(0px)", transition: { ...swap, delay: reduceMotion ? 0 : 0.06 } }}
              exit={{ opacity: 0, filter: BLUR, transition: swap }}
              className="w-[min(344px,calc(100vw-32px))] p-2.5"
            >
              <div className="flex items-center gap-3 px-2 pb-2 pt-1.5">
                <img
                  src={DATA.avatarUrl}
                  alt=""
                  className="size-10 rounded-full object-cover outline outline-1 -outline-offset-1 outline-[var(--island-outline)]"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-medium">{DATA.name}</p>
                  <p className="truncate text-[13px] text-[var(--island-muted)]">AI Engineer · {DATA.location}</p>
                </div>
                <button
                  type="button"
                  onClick={() => close(true)}
                  aria-label="Close navigation"
                  className={cn(
                    "grid size-10 place-items-center rounded-full text-[var(--island-muted)] transition-[background-color,color,scale] duration-150 hover:bg-[var(--island-hover)] hover:text-[var(--island-fg)] active:scale-[0.96]",
                    focusRing
                  )}
                >
                  <X className="size-4" strokeWidth={1.75} aria-hidden="true" />
                </button>
              </div>

              <nav aria-label="Sections">
                <ul className="flex flex-col gap-0.5">
                  {PAGE_SECTIONS.map((section, index) => {
                    const Icon = MENU_ICONS[section.id] ?? UserRound;
                    const isActive = section.id === activeSection;
                    return (
                      <li key={section.id}>
                        <a
                          ref={index === 0 ? firstLinkRef : undefined}
                          href={`/#${section.id}`}
                          onClick={(event) => goTo(event, section.id)}
                          aria-current={isActive ? "location" : undefined}
                          className={cn(
                            "squircle flex h-12 items-center gap-3.5 rounded-[24px] px-4 text-[15px] transition-[background-color,color] duration-150",
                            focusRing,
                            isActive
                              ? "bg-[var(--island-chip)] text-[var(--island-fg)]"
                              : "text-[var(--island-muted)] hover:bg-[var(--island-hover)] hover:text-[var(--island-fg)]"
                          )}
                        >
                          <Icon className="size-[18px] shrink-0" strokeWidth={1.75} aria-hidden="true" />
                          <span className="flex-1">{section.short}</span>
                          {isActive && (
                            <span className="size-1.5 rounded-full bg-[var(--theme-orange)]" aria-hidden="true" />
                          )}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </motion.div>
          ) : isDesktop ? (
            // Desktop: a status readout only. The rail is the navigation, so this stays out of
            // the accessibility tree rather than announcing every section change.
            <motion.div
              key="status"
              layout
              aria-hidden="true"
              className="flex h-13 items-center pl-2 pr-5"
            >
              <ActivityContent state={islandState} reduceMotion={reduceMotion} />
            </motion.div>
          ) : (
            <motion.button
              key="compact"
              ref={triggerRef}
              layout
              type="button"
              onClick={() => setRequestedOpen(true)}
              aria-expanded={false}
              aria-controls={panelId}
              aria-label={`Open navigation. Current section: ${activeLabel}`}
              initial={{ opacity: 0, filter: BLUR }}
              animate={{ opacity: 1, filter: "blur(0px)", transition: swap }}
              exit={{ opacity: 0, filter: BLUR, transition: swap }}
              className={cn("flex h-13 items-center gap-3 pl-2 pr-4", focusRing)}
            >
              <span aria-hidden="true">
                <ActivityContent state={islandState} reduceMotion={reduceMotion} />
              </span>
              <motion.span layout="position" aria-hidden="true" className="grid place-items-center">
                <ChevronDown className="size-4 text-[var(--island-muted)]" strokeWidth={2} />
              </motion.span>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
