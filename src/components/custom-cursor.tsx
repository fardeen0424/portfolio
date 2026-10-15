"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [coordsText, setCoordsText] = useState("X: 0 Y: 0");
  const { resolvedTheme } = useTheme();

  // Raw cursor position motion values
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Slight trailing spring config for a smooth, high-fidelity follow effect
  const springConfig = { damping: 25, stiffness: 220, mass: 0.5 };
  const pillX = useSpring(cursorX, springConfig);
  const pillY = useSpring(cursorY, springConfig);

  useEffect(() => {
    setMounted(true);

    // Disable on non-hover (touch) devices
    const isTouch = !window.matchMedia("(hover: hover)").matches;
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Offset coordinates slightly to the bottom-right of the default system cursor
      cursorX.set(e.clientX + 16);
      cursorY.set(e.clientY + 22);
      setCoordsText(`X: ${Math.round(e.clientX)} Y: ${Math.round(e.clientY)}`);
      
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeaveWindow = () => {
      setIsVisible(false);
    };

    const handleMouseEnterWindow = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseLeaveWindow);
    document.addEventListener("mouseleave", handleMouseLeaveWindow);
    document.addEventListener("mouseenter", handleMouseEnterWindow);

    // Inject styles to set custom orange SVG cursors
    const style = document.createElement("style");
    style.innerHTML = `
      @media (hover: hover) {
        body, html, * {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="%23ea4f1a" stroke="%23ffffff" stroke-width="1.5" d="M4.5 3v15.2l3.8-3.8 2.9 6.8 2.2-.9-2.9-6.8h5.7L4.5 3z"/></svg>') 0 0, auto !important;
        }
        a, button, [role="button"], input, select, textarea, .cursor-pointer, .hover-hand {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="%23ea4f1a" stroke="%23ffffff" stroke-width="1.5" d="M12 2a3 3 0 0 0-3 3v5.3L7.7 9.7a1.5 1.5 0 0 0-2.1 2.1l4.4 4.4v2.8a4 4 0 0 0 8 0v-8a3 3 0 0 0-3-3 3 3 0 0 0-3 0v1.3L11 11V5a3 3 0 0 0-3-3z"/></svg>') 8 2, pointer !important;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseLeaveWindow);
      document.removeEventListener("mouseleave", handleMouseLeaveWindow);
      document.removeEventListener("mouseenter", handleMouseEnterWindow);
      document.head.removeChild(style);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!mounted || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Floating Coordinate Pill following Navbar glassmorphic styling */}
      <motion.div
        style={{
          x: pillX,
          y: pillY,
          border: "1px solid transparent",
          backgroundImage: resolvedTheme === "dark"
            ? "linear-gradient(rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.75)), linear-gradient(to right, #e5e5e5, #a3a3a3, #e5e5e5)"
            : "linear-gradient(rgba(10, 10, 10, 0.75), rgba(10, 10, 10, 0.75)), linear-gradient(to right, #404040, #a3a3a3, #404040)",
          backgroundClip: "padding-box, border-box",
          backgroundOrigin: "padding-box, border-box",
        }}
        className={cn(
          "fixed left-0 top-0 rounded-full px-3 py-1.5 text-xs font-mono font-semibold tracking-wider shadow-[0_4px_16px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-all duration-300",
          resolvedTheme === "dark" ? "text-neutral-900" : "text-white"
        )}
      >
        {coordsText}
      </motion.div>
    </div>
  );
}
