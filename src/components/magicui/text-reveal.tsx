"use client";

import { motion } from "motion/react";
import { ComponentPropsWithoutRef, FC, useEffect, useRef, useState, Fragment } from "react";
import { useLenis } from "lenis/react";

import { cn } from "@/lib/utils";

export interface TextRevealProps extends ComponentPropsWithoutRef<"div"> {
  children: string;
  title?: string;
}

export const TextReveal: FC<TextRevealProps> = ({ children, title, className }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [revealedCount, setRevealedCount] = useState(0);
  const [totalLockWords, setTotalLockWords] = useState(0);
  const lenis = useLenis();

  if (typeof children !== "string") {
    throw new Error("TextReveal: children must be a string");
  }

  // Split content by paragraph boundaries
  const paragraphs = children.split("\n\n");
  let wordCount = 0;
  
  // Create a structured representation of words with global indices
  const paragraphsWithWords = paragraphs.map((para) => {
    const words = para.trim().split(/\s+/);
    const wordsWithIndices = words.map((word) => {
      const index = wordCount;
      wordCount++;
      return { word, index };
    });
    return wordsWithIndices;
  });

  const totalWords = wordCount;
  const revealedCountRef = useRef(0);
  revealedCountRef.current = revealedCount;

  // Limit for scroll lock (only lock for words visible at scroll 0)
  const lockLimit = totalLockWords;
  const lockLimitRef = useRef(0);
  lockLimitRef.current = lockLimit;

  // Accumulators to throttle scroll/touch inputs
  const accumulatedWheelRef = useRef(0);
  const accumulatedTouchRef = useRef(0);
  const touchStartRef = useRef<number | null>(null);
  const isResettingRef = useRef(false);

  // Calculate how many words are visible within the current viewport height on mount/resize
  useEffect(() => {
    const calculateVisibleWords = () => {
      if (!containerRef.current) return;
      const wordElements = containerRef.current.querySelectorAll(".word-item");
      const viewportHeight = window.innerHeight;
      
      let count = 0;
      wordElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // Check if the word bottom is above the viewport height (minus offset for navbar/gradient)
        if (rect.bottom <= viewportHeight - 120) {
          count++;
        }
      });
      
      setTotalLockWords(count);
    };

    calculateVisibleWords();
    const timer = setTimeout(calculateVisibleWords, 200);
    window.addEventListener("resize", calculateVisibleWords);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", calculateVisibleWords);
    };
  }, [totalWords]);

  // Lock or unlock Lenis scrolling based on reveal state
  useEffect(() => {
    if (!lenis) return;
    
    const count = revealedCount;
    const currentScroll = window.scrollY || lenis.scroll;
    
    if (currentScroll <= 5 && count < lockLimit) {
      lenis.stop();
    } else {
      lenis.start();
    }
    
    return () => {
      lenis.start();
    };
  }, [lenis, revealedCount, lockLimit]);

  // Handle scroll/touch input to reveal/hide words
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const currentScroll = window.scrollY || (lenis ? lenis.scroll : 0);
      
      // Only lock and intercept scroll if we are at the top of the page
      if (currentScroll <= 5) {
        const count = revealedCountRef.current;
        const limit = lockLimitRef.current;
        
        if (e.deltaY > 0 && count < limit) {
          // Scrolling down, visible text not fully revealed -> block scroll and reveal words
          e.preventDefault();
          accumulatedWheelRef.current += e.deltaY;
          if (accumulatedWheelRef.current >= 100) {
            const steps = Math.floor(accumulatedWheelRef.current / 100);
            setRevealedCount(prev => Math.min(prev + steps, limit));
            accumulatedWheelRef.current = accumulatedWheelRef.current % 100;
          }
        } else if (e.deltaY < 0 && count > 0) {
          // Scrolling up, text is revealed -> block scroll and hide words
          e.preventDefault();
          accumulatedWheelRef.current += e.deltaY;
          if (accumulatedWheelRef.current <= -100) {
            const steps = Math.floor(Math.abs(accumulatedWheelRef.current) / 100);
            setRevealedCount(prev => Math.max(prev - steps, 0));
            accumulatedWheelRef.current = accumulatedWheelRef.current % 100;
          }
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartRef.current = e.touches[0].clientY;
        accumulatedTouchRef.current = 0;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const currentScroll = window.scrollY || (lenis ? lenis.scroll : 0);
      if (currentScroll <= 5 && touchStartRef.current !== null && e.touches.length === 1) {
        const currentY = e.touches[0].clientY;
        const deltaY = touchStartRef.current - currentY; // positive means swiping up (scrolling down)
        touchStartRef.current = currentY;

        const count = revealedCountRef.current;
        const limit = lockLimitRef.current;
        
        if (deltaY > 0 && count < limit) {
          e.preventDefault();
          accumulatedTouchRef.current += deltaY;
          if (accumulatedTouchRef.current >= 30) {
            const steps = Math.floor(accumulatedTouchRef.current / 30);
            setRevealedCount(prev => Math.min(prev + steps, limit));
            accumulatedTouchRef.current = accumulatedTouchRef.current % 30;
          }
        } else if (deltaY < 0 && count > 0) {
          e.preventDefault();
          accumulatedTouchRef.current += deltaY;
          if (accumulatedTouchRef.current <= -30) {
            const steps = Math.floor(Math.abs(accumulatedTouchRef.current) / 30);
            setRevealedCount(prev => Math.max(prev - steps, 0));
            accumulatedTouchRef.current = accumulatedTouchRef.current % 30;
          }
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const currentScroll = window.scrollY || (lenis ? lenis.scroll : 0);
      if (currentScroll <= 5) {
        const count = revealedCountRef.current;
        const limit = lockLimitRef.current;
        
        if ((e.key === "ArrowDown" || e.key === " " || e.key === "PageDown") && count < limit) {
          e.preventDefault();
          const step = e.key === "ArrowDown" ? 1 : 5;
          setRevealedCount(prev => Math.min(prev + step, limit));
        } else if ((e.key === "ArrowUp" || e.key === "PageUp") && count > 0) {
          e.preventDefault();
          const step = e.key === "ArrowUp" ? 1 : 5;
          setRevealedCount(prev => Math.max(prev - step, 0));
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("keydown", handleKeyDown, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [totalWords, lockLimit, lenis]);

  // Synchronize revealedCount with scrolling down past the top fold
  useEffect(() => {
    if (!lenis) return;
    const handleScroll = () => {
      const currentScroll = window.scrollY || lenis.scroll;
      if (currentScroll <= 5) {
        isResettingRef.current = false;
      }
      if (isResettingRef.current) return;

      if (currentScroll > 10) {
        // Fully reveal all words (including those below the fold) once scrolling down
        setRevealedCount(totalWords);
      } else {
        // Clamp back to lock limit when scrolled back to the top
        setRevealedCount(prev => Math.min(prev, lockLimit));
      }
    };
    lenis.on("scroll", handleScroll);

    const handleCustomReset = () => {
      isResettingRef.current = true;
      lenis.start();
      setRevealedCount(0);
      lenis.scrollTo(0, { immediate: false });
      // Safety release of reset state once scroll animation finishes
      setTimeout(() => {
        isResettingRef.current = false;
        setRevealedCount(0);
        lenis.stop();
      }, 1000);
    };

    window.addEventListener("reset-reveal", handleCustomReset);

    return () => {
      lenis.off("scroll", handleScroll);
      window.removeEventListener("reset-reveal", handleCustomReset);
    };
  }, [lenis, totalWords, lockLimit]);

  return (
    <div ref={containerRef} className={cn("w-full h-auto bg-transparent", className)}>
      <div className="flex min-h-0 flex-col gap-y-8">
        {title && (
          <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">
            {title}
          </h2>
        )}
        <div className="space-y-6">
          {paragraphsWithWords.map((paragraph, pIdx) => (
            <p
              key={pIdx}
              className="text-justify text-base md:text-lg lg:text-xl leading-relaxed font-sans font-normal"
            >
              {paragraph.map(({ word, index }) => {
                const isRevealed = index < revealedCount;
                return (
                  <Fragment key={index}>
                    <Word isRevealed={isRevealed} className="word-item">
                      {word}
                    </Word>
                    {" "}
                  </Fragment>
                );
              })}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

interface WordProps {
  children: React.ReactNode;
  isRevealed: boolean;
  className?: string;
}

const Word: FC<WordProps> = ({ children, isRevealed, className }) => {
  return (
    <span
      className={cn(
        "transition-colors duration-300 font-normal",
        isRevealed
          ? "text-muted-foreground opacity-100"
          : "text-[#eaeaea] dark:text-[#262626] opacity-100",
        className
      )}
    >
      {children}
    </span>
  );
};
