"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgressLine() {
  const [height, setHeight] = useState(800);
  const [mounted, setMounted] = useState(false);
  const pathRef = useRef<SVGPathElement | null>(null);
  const [bugPosition, setBugPosition] = useState({ x: 40, y: 0 });

  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001
  });

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Track the exact x,y coordinate of the scroll progress tip
  useEffect(() => {
    if (!mounted) return;

    const updatePosition = () => {
      const path = pathRef.current;
      if (!path) return;
      const pathLength = path.getTotalLength();
      // Get position matching spring-smoothed scroll progress
      const currentProgress = scaleY.get();
      const point = path.getPointAtLength(currentProgress * pathLength);
      setBugPosition({ x: point.x, y: point.y });
    };

    // Listen to changes on scaleY spring progress
    const unsubscribe = scaleY.on("change", updatePosition);
    
    // Initial compute
    setTimeout(updatePosition, 100);

    return () => unsubscribe();
  }, [mounted, scaleY, height]);

  if (!mounted) return null;

  // Dynamic positions for consistent, medium-length techno dips (80px long each)
  const y1 = 0.20 * height;
  const y2 = y1 + 80;
  
  const y3 = 0.50 * height;
  const y4 = y3 + 80;
  
  const y5 = 0.80 * height;
  const y6 = y5 + 80;

  // Generates sharp, angular techno/gaming UI dips with 45-degree slants
  const makeTechnoDip = (yStart: number, yEnd: number, targetX: number) => {
    const slantHeight = 10; // Vertical distance of the slant
    return `L 40 ${yStart} L ${targetX} ${yStart + slantHeight} L ${targetX} ${yEnd - slantHeight} L 40 ${yEnd}`;
  };

  const leftPath = `
    M 40 0 
    L 40 ${y1} 
    ${makeTechnoDip(y1, y2, 50)} 
    L 40 ${y3} 
    ${makeTechnoDip(y3, y4, 30)} 
    L 40 ${y5} 
    ${makeTechnoDip(y5, y6, 50)} 
    L 40 ${height}
  `.replace(/\s+/g, " ").trim();

  return (
    <>
      {/* Left side progress line, centered in the left gutter margin */}
      <div className="fixed top-0 bottom-0 left-[calc((50%-336px)/2-40px)] w-20 z-10 pointer-events-none hidden lg:block">
        <svg className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Base track line */}
          <path
            d={leftPath}
            className="stroke-neutral-300 dark:stroke-neutral-800"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Animated fill line */}
          <motion.path
            ref={pathRef}
            d={leftPath}
            stroke="#ff4300"
            strokeWidth="2"
            strokeLinecap="round"
            style={{ pathLength: scaleY }}
          />

          {/* Cyber traveler leading the progress fill (clean glowing diamond) */}
          <g transform={`translate(${bugPosition.x}, ${bugPosition.y})`}>
            {/* Pulsing glow ring */}
            <circle r="8" stroke="#ff4300" strokeWidth="1" className="opacity-40 animate-pulse" />
            {/* Center solid diamond */}
            <rect x="-3" y="-3" width="6" height="6" transform="rotate(45)" fill="#ff4300" />
            {/* Tiny center core dot */}
            <circle r="1" fill="#fff" />
          </g>
        </svg>
      </div>
    </>
  );
}
