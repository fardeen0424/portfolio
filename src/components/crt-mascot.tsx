"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Sprite logic adapted from page-mascot (MIT © Kamran Ahmed): two 3×3 sheets, one of
 * nine head directions and one of nine reactions. Framer Motion smooths it out: the
 * head leans toward the cursor on a spring, and each new frame fades in over the
 * previous one instead of snapping.
 */

const DIRECTIONS_SRC = "/mascots/crt-directions.webp";
const REACTIONS_SRC = "/mascots/crt-reactions.webp";
const SIZE = 112;

const DIRECTIONS = [
  "up-left", "up", "up-right",
  "left", "center", "right",
  "down-left", "down", "down-right",
] as const;
const REACTIONS = [
  "blink", "heart", "sparkle",
  "surprised", "wink", "bashful",
  "sleepy", "dizzy", "delighted",
] as const;
type Direction = (typeof DIRECTIONS)[number];
type Reaction = (typeof REACTIONS)[number];

// Clockwise from the right, matching atan2 with y pointing down.
const CLOCKWISE: Direction[] = [
  "right", "down-right", "down", "down-left", "left", "up-left", "up", "up-right",
];
const SECTOR = (Math.PI * 2) / CLOCKWISE.length;
const HYSTERESIS = 0.12;
const DEAD_ZONE = 70;

const PAYOFFS: Reaction[] = ["heart", "sparkle", "delighted"];
const BOOP_PAYOFF = 120;
const BOOP_END = 560;
const DIZZY_AFTER = 4;
const DIZZY_WINDOW = 1600;
const DIZZY_END = 1100;

// Pointer distance (px) at which the lean reaches its maximum.
const LEAN_REACH = 320;
const LEAN_PX = 3;
const LEAN_DEG = 4;
const LEAN_SPRING = { stiffness: 170, damping: 20, mass: 0.6 };
const FRAME_FADE = 0.14;

const clampUnit = (value: number) => Math.max(-1, Math.min(1, value));
const wrap = (angle: number) => Math.atan2(Math.sin(angle), Math.cos(angle));

// background-size 300% makes each cell a clean 0/50/100% step on both axes.
const cellPosition = (index: number) =>
  `${(index % 3) * 50}% ${Math.floor(index / 3) * 50}%`;

function Frame({ src, index, fade }: { src: string; index: number; fade: number }) {
  return (
    <motion.span
      aria-hidden="true"
      className="absolute inset-0 bg-no-repeat"
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: "300% 300%",
        backgroundPosition: cellPosition(index),
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: fade, ease: "easeOut" } }}
      // AnimatePresence keeps the outgoing frame earlier in the DOM, so the new frame
      // fades in on top of a solid one; drop the old frame once it is covered.
      exit={{ opacity: 0, transition: { duration: 0, delay: fade } }}
    />
  );
}

export default function CrtMascot({ className }: { className?: string }) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [squashScope, animate] = useAnimate<HTMLSpanElement>();
  const timersRef = useRef<number[]>([]);
  const boopsRef = useRef({ count: 0, at: 0 });
  const [direction, setDirection] = useState<Direction>("center");
  const [reaction, setReaction] = useState<Reaction | null>(null);
  const reduceMotion = useReducedMotion();

  // Normalised pointer offset (-1..1) drives a continuous, spring-smoothed lean.
  const leanX = useMotionValue(0);
  const leanY = useMotionValue(0);
  const x = useSpring(useTransform(leanX, (v) => v * LEAN_PX), LEAN_SPRING);
  const y = useSpring(useTransform(leanY, (v) => v * LEAN_PX), LEAN_SPRING);
  const rotate = useSpring(useTransform(leanX, (v) => v * LEAN_DEG), LEAN_SPRING);

  useEffect(() => {
    // Warm the reactions sheet so the first boop does not flash while it loads.
    new window.Image().src = REACTIONS_SRC;
  }, []);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let sector = -1;
    let pointer: { x: number; y: number } | null = null;

    const aim = () => {
      const button = buttonRef.current;
      if (!button || !pointer) return;

      const box = button.getBoundingClientRect();
      const dx = pointer.x - (box.left + box.width / 2);
      const dy = pointer.y - (box.top + box.height / 2);
      leanX.set(clampUnit(dx / LEAN_REACH));
      leanY.set(clampUnit(dy / LEAN_REACH));

      if (Math.hypot(dx, dy) < DEAD_ZONE) {
        sector = -1;
        setDirection("center");
        return;
      }

      // Hold the current sector until the pointer is well past its edge.
      const angle = Math.atan2(dy, dx);
      if (sector !== -1 && Math.abs(wrap(angle - sector * SECTOR)) < SECTOR / 2 + HYSTERESIS) {
        return;
      }
      sector = (Math.round(angle / SECTOR) + CLOCKWISE.length) % CLOCKWISE.length;
      setDirection(CLOCKWISE[sector]);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      aim();
    };

    // Settle back to centre when the pointer leaves the window.
    const onPointerLeave = () => {
      pointer = null;
      sector = -1;
      leanX.set(0);
      leanY.set(0);
      setDirection("center");
    };

    const root = document.documentElement;
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", aim, { passive: true });
    root.addEventListener("pointerleave", onPointerLeave);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", aim);
      root.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [leanX, leanY]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach(window.clearTimeout);
  }, []);

  const boop = () => {
    timersRef.current.forEach(window.clearTimeout);
    timersRef.current = [];
    const later = (ms: number, next: Reaction | null) => {
      timersRef.current.push(window.setTimeout(() => setReaction(next), ms));
    };

    const now = Date.now();
    const boops = boopsRef.current;
    boops.count = now - boops.at < DIZZY_WINDOW ? boops.count + 1 : 1;
    boops.at = now;

    if (boops.count >= DIZZY_AFTER) {
      boops.count = 0;
      setReaction("dizzy");
      later(DIZZY_END, null);
    } else {
      setReaction("blink");
      later(BOOP_PAYOFF, PAYOFFS[(boops.count - 1) % PAYOFFS.length]);
      later(BOOP_END, null);
    }

    if (reduceMotion) return;
    animate(
      squashScope.current,
      { scaleX: [1, 1.1, 0.95, 1.03, 1], scaleY: [1, 0.86, 1.08, 0.97, 1] },
      {
        duration: 0.42,
        times: [0, 0.18, 0.45, 0.72, 1],
        ease: ["easeIn", "easeOut", "easeInOut", "easeInOut"],
      }
    );
  };

  const fade = reduceMotion ? 0 : FRAME_FADE;

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={boop}
      aria-label="Boop the CRT computer mascot"
      className={cn("relative block shrink-0 cursor-pointer select-none rounded-2xl", className)}
      style={{ width: SIZE, height: SIZE }}
    >
      <motion.span
        className="relative block size-full"
        // Pivot at the neck so the lean reads as a head tilt, not a slide.
        style={reduceMotion ? undefined : { x, y, rotate, originX: 0.5, originY: 0.78 }}
      >
        <span ref={squashScope} className="relative block size-full" style={{ transformOrigin: "50% 78%" }}>
          <AnimatePresence initial={false}>
            {reaction ? (
              <Frame key={`reaction-${reaction}`} src={REACTIONS_SRC} index={REACTIONS.indexOf(reaction)} fade={fade} />
            ) : (
              <Frame key={`direction-${direction}`} src={DIRECTIONS_SRC} index={DIRECTIONS.indexOf(direction)} fade={fade} />
            )}
          </AnimatePresence>
        </span>
      </motion.span>
    </button>
  );
}
