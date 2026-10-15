"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type Transition,
  type Variants,
} from "framer-motion";

export type RulerSection = { id: string; label: string };

type TickKind = "minor" | "medium" | "major";
type Mark = RulerSection & { index: number; ratio: number };
type PillLabel = { label: string; direction: 1 | -1 };

// Ruler scale: a major every 10 ticks and a medium every 5, at the original ruler's lengths.
// Ticks sit on a fixed whole-pixel pitch with whole-pixel thicknesses, and the count comes
// from the track height, so no tick lands between device pixels and rounds away.
const TICK_PITCH = 8;
const TRACK_INSET = 12;
const PRESETS: Record<TickKind, { base: number; bump: number; thickness: number }> = {
  minor: { base: 15, bump: 50, thickness: 1 },
  medium: { base: 27, bump: 60, thickness: 2 },
  major: { base: 42, bump: 72, thickness: 2 },
};
const MAX_WIDTH = PRESETS.major.base + PRESETS.major.bump;
// Swell radius as a share of the track, the original ruler's envelope.
const RADIUS_SHARE = 0.075;
const SPINE_WIDTH = 2;

// Tick motion from rare-ui ProximitySidebar.
const TICK_SPRING = { stiffness: 320, damping: 34, mass: 0.7 };
const FOLLOW_SPRING = { stiffness: 420, damping: 38, mass: 0.6 };

// Pill motion, on the transitions.dev token scale.
const PILL_GAP = 16;
const INTENT_DELAY = 0.08; // --duration-micro: filters a passing cursor
const TEXT_SHIFT = 4; // --distance-micro: text swap
const BLUR = "blur(2px)"; // --blur-small
const RESIZE: Transition = { type: "spring", visualDuration: 0.35, bounce: 0.15 };
const SWAP: Transition = { duration: 0.15, ease: "easeInOut" }; // --duration-quick, text swap
const CLOSE: Transition = { duration: 0.15, ease: [0.22, 1, 0.36, 1] }; // closes beat opens

const KEY_STEP = 80;

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const tickKind = (index: number): TickKind =>
  index % 10 === 0 ? "major" : index % 5 === 0 ? "medium" : "minor";

function markAt(marks: Mark[], ratio: number) {
  let current = marks[0];
  for (const mark of marks) {
    if (mark.ratio <= ratio + 0.001) current = mark;
  }
  return current;
}

function Tick({
  index,
  trackHeight,
  focusY,
  reduceMotion,
}: {
  index: number;
  trackHeight: number;
  focusY: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const preset = PRESETS[tickKind(index)];
  const y = index * TICK_PITCH;
  const radius = Math.max(TICK_PITCH, trackHeight * RADIUS_SHARE);

  const target = useTransform(focusY, (focus) => {
    const falloff = Math.max(0, 1 - Math.abs(focus - y) / radius);
    return (preset.base + preset.bump * falloff) / MAX_WIDTH;
  });
  const spring = useSpring(target, TICK_SPRING);

  return (
    <motion.span
      className="absolute right-0 block"
      style={{
        // Whole-pixel top keeps every tick crisp instead of splitting across two rows
        top: y - Math.floor(preset.thickness / 2),
        width: MAX_WIDTH,
        height: preset.thickness,
        originX: 1,
        scaleX: reduceMotion ? target : spring,
        backgroundColor: "var(--ruler-tick)",
      }}
    />
  );
}

const textVariants: Variants = {
  enter: (direction: number) => ({ opacity: 0, y: direction * TEXT_SHIFT, filter: BLUR }),
  center: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { ...SWAP, y: { type: "spring", visualDuration: 0.25, bounce: 0 } },
  },
  exit: (direction: number) => ({
    opacity: 0,
    y: direction * -TEXT_SHIFT,
    filter: BLUR,
    transition: SWAP,
  }),
};

const reducedTextVariants: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: SWAP },
  exit: { opacity: 0, transition: SWAP },
};

/**
 * Names the section under the pointer. It opens after a short intent delay, resizes
 * to each label on a spring and swaps text with a directional blur.
 */
function RulerPill({
  visible,
  label,
  width,
  y,
  reduceMotion,
}: {
  visible: boolean;
  label: PillLabel;
  width: number | null;
  y: MotionValue<number>;
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute top-0 -translate-y-1/2"
      style={{ right: MAX_WIDTH + SPINE_WIDTH + PILL_GAP, y }}
    >
      <AnimatePresence>
        {visible && (
          <motion.div
            key="pill"
            className="h-7 overflow-hidden rounded-full bg-foreground text-background shadow-[0_1px_2px_rgb(0_0_0/0.12),0_8px_24px_rgb(0_0_0/0.14)]"
            style={{ originX: 1 }}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, filter: BLUR }}
            animate={{
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
              transition: reduceMotion
                ? { duration: 0.15, delay: INTENT_DELAY }
                : {
                    ...RESIZE,
                    delay: INTENT_DELAY,
                    // Tweened so the spring's overshoot never drives blur below zero
                    opacity: { duration: 0.15, delay: INTENT_DELAY },
                    filter: { duration: 0.15, delay: INTENT_DELAY },
                  },
            }}
            exit={reduceMotion ? { opacity: 0, transition: CLOSE } : { opacity: 0, scale: 0.99, transition: CLOSE }}
          >
            <motion.div
              className="relative flex h-full items-center justify-center"
              initial={false}
              animate={{ width: width ?? "auto" }}
              transition={reduceMotion ? { duration: 0 } : RESIZE}
            >
              <AnimatePresence mode="popLayout" initial={false} custom={label.direction}>
                <motion.span
                  key={label.label}
                  custom={label.direction}
                  variants={reduceMotion ? reducedTextVariants : textVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="whitespace-nowrap px-3 font-mono text-[11px] font-medium"
                >
                  {label.label}
                </motion.span>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * A ruler-style page scrubber pinned to the right edge. Ticks swell toward the pointer
 * on a spring and follow the reading position at rest; a pill names the section a
 * click will land on.
 */
export default function RulerScrollbar({ sections }: { sections: RulerSection[] }) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const marksRef = useRef<Mark[]>([]);
  const labelIndexRef = useRef(0);
  const draggingRef = useRef(false);
  const keyboardFocusRef = useRef(false);
  const reduceMotion = useReducedMotion() ?? false;

  const [hovering, setHovering] = useState(false);
  const [keyboardFocused, setKeyboardFocused] = useState(false);
  const [pillLabel, setPillLabel] = useState<PillLabel>({
    label: sections[0]?.label ?? "",
    direction: 1,
  });
  const [pillWidth, setPillWidth] = useState<number | null>(null);
  // Measured track height (whole px) and how many ticks fit on the pitch.
  const [track, setTrack] = useState({ height: 0, count: 0 });

  // Scroll progress places the resting swell directly, so it never trails the
  // page; the tick springs alone supply the softness.
  const { scrollYProgress: progress } = useScroll();

  const trackHeight = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const pointerInside = useMotionValue(0);
  // Where the swell sits: under the pointer while hovering, else at the reading position.
  const focusY = useTransform(
    [pointerInside, pointerY, progress, trackHeight],
    ([inside, pointer, p, height]: number[]) => (inside ? pointer : p * height)
  );
  // The pill trails its own target: the pointer while hovering, the reading position under
  // keyboard focus. It never chases the resting swell, so leaving fades it in place.
  const pillTarget = useMotionValue(0);
  const followY = useSpring(pillTarget, FOLLOW_SPRING);
  const pillY = reduceMotion ? pillTarget : followY;

  // Place the pill without travel, so it opens where it is needed instead of gliding in.
  const placePill = useCallback(
    (y: number) => {
      pillTarget.set(y);
      followY.jump(y);
    },
    [pillTarget, followY]
  );

  const showLabelAt = useCallback((ratio: number) => {
    const mark = markAt(marksRef.current, ratio);
    if (!mark || mark.index === labelIndexRef.current) return;
    const direction = mark.index > labelIndexRef.current ? 1 : -1;
    labelIndexRef.current = mark.index;
    setPillLabel({ label: mark.label, direction });
  }, []);

  const sectionKey = sections.map((section) => section.id).join("|");

  // Section start ratios, re-measured whenever the page height changes.
  useEffect(() => {
    const measure = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      marksRef.current = sections.flatMap((section, index) => {
        const element = document.getElementById(section.id);
        if (!element) return [];
        const top = element.getBoundingClientRect().top + window.scrollY;
        return [{ ...section, index, ratio: maxScroll > 0 ? clamp01(top / maxScroll) : 0 }];
      });
    };
    // ResizeObserver reports once on observe, which covers the first measurement.
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    return () => observer.disconnect();
    // sectionKey stands in for the sections array identity
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionKey]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(([entry]) => {
      const height = Math.floor(entry.contentRect.height);
      trackHeight.set(height);
      setTrack((current) =>
        current.height === height
          ? current
          : { height, count: Math.floor(height / TICK_PITCH) + 1 }
      );
    });
    observer.observe(track);
    return () => observer.disconnect();
  }, [trackHeight]);

  // The hidden twin of the label reports its natural width, which the pill springs to.
  useEffect(() => {
    const measurer = measureRef.current;
    if (!measurer) return;
    const observer = new ResizeObserver(() => setPillWidth(measurer.offsetWidth));
    observer.observe(measurer);
    return () => observer.disconnect();
  }, []);

  // Keep assistive technology (and the keyboard pill) in sync without re-rendering
  // every tick per scroll frame.
  useMotionValueEvent(progress, "change", (latest) => {
    const percent = Math.round(latest * 100);
    const slider = sliderRef.current;
    const mark = markAt(marksRef.current, latest);
    if (slider) {
      slider.setAttribute("aria-valuenow", String(percent));
      if (mark) slider.setAttribute("aria-valuetext", `${mark.label}, ${percent}%`);
    }
    if (keyboardFocusRef.current && !draggingRef.current) {
      showLabelAt(latest);
      pillTarget.set(latest * trackHeight.get());
    }
  });

  const scrollToRatio = useCallback(
    (ratio: number, smooth: boolean) => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      window.scrollTo({
        top: clamp01(ratio) * maxScroll,
        behavior: smooth && !reduceMotion ? "smooth" : "auto",
      });
    },
    [reduceMotion]
  );

  const trackPointer = (event: React.PointerEvent) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || rect.height <= 0) return null;
    const y = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
    pointerY.set(y);
    pillTarget.set(y);
    const ratio = y / rect.height;
    showLabelAt(ratio);
    return ratio;
  };

  const leave = () => {
    pointerInside.set(0);
    setHovering(false);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    draggingRef.current = true;
    const ratio = trackPointer(event);
    if (ratio !== null) scrollToRatio(ratio, true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const ratio = trackPointer(event);
    if (draggingRef.current && ratio !== null) scrollToRatio(ratio, false);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const inside =
      event.clientX >= rect.left && event.clientX <= rect.right &&
      event.clientY >= rect.top && event.clientY <= rect.bottom;
    if (!inside) leave();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const behavior: ScrollBehavior = reduceMotion ? "auto" : "smooth";
    const steps: Record<string, () => void> = {
      ArrowDown: () => window.scrollBy({ top: KEY_STEP, behavior }),
      ArrowUp: () => window.scrollBy({ top: -KEY_STEP, behavior }),
      PageDown: () => window.scrollBy({ top: window.innerHeight * 0.8, behavior }),
      PageUp: () => window.scrollBy({ top: -window.innerHeight * 0.8, behavior }),
      Home: () => window.scrollTo({ top: 0, behavior }),
      End: () => window.scrollTo({ top: maxScroll, behavior }),
    };
    const step = steps[event.key];
    if (!step) return;
    event.preventDefault();
    step();
  };

  return (
    <div
      ref={sliderRef}
      role="slider"
      tabIndex={0}
      aria-label="Page position"
      aria-orientation="vertical"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      aria-valuetext={sections[0]?.label}
      onPointerEnter={(event) => {
        trackPointer(event);
        placePill(pointerY.get());
        pointerInside.set(1);
        setHovering(true);
      }}
      onPointerLeave={() => {
        if (!draggingRef.current) leave();
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={handleKeyDown}
      onFocus={(event) => {
        if (!event.currentTarget.matches(":focus-visible")) return;
        keyboardFocusRef.current = true;
        showLabelAt(progress.get());
        placePill(progress.get() * trackHeight.get());
        setKeyboardFocused(true);
      }}
      onBlur={() => {
        keyboardFocusRef.current = false;
        setKeyboardFocused(false);
      }}
      className="fixed inset-y-0 right-0 z-40 hidden w-36 cursor-pointer touch-none select-none outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:-outline-offset-2 focus-visible:outline-[var(--ruler-progress)] lg:block"
    >
      <div ref={trackRef} className="absolute inset-x-0" style={{ top: TRACK_INSET, bottom: TRACK_INSET }}>
        <span
          aria-hidden="true"
          className="absolute inset-y-0 right-0"
          style={{ width: SPINE_WIDTH, backgroundColor: "var(--ruler-tick)" }}
        />

        <div aria-hidden="true" className="absolute inset-y-0" style={{ right: SPINE_WIDTH, width: MAX_WIDTH }}>
          {Array.from({ length: track.count }, (_, index) => (
            <Tick
              // Remount on resize so each tick re-derives its position from the new height
              key={`${track.height}-${index}`}
              index={index}
              trackHeight={track.height}
              focusY={focusY}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>

        <RulerPill
          visible={hovering || keyboardFocused}
          label={pillLabel}
          width={pillWidth}
          y={pillY}
          reduceMotion={reduceMotion}
        />

        {/* Invisible twin of the label; its size drives the pill width */}
        <span
          ref={measureRef}
          aria-hidden="true"
          className="pointer-events-none invisible absolute left-0 top-0 whitespace-nowrap px-3 font-mono text-[11px] font-medium"
        >
          {pillLabel.label}
        </span>
      </div>
    </div>
  );
}
