"use client";

import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.015, duration: 2.4, syncTouch: true }}>
      {children}
    </ReactLenis>
  );
}
