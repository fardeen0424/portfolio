"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import Switch from "@/components/Switch";

interface NavItem {
  label: string;
  href: string;
  isExternal: boolean;
  id?: string;
}

export default function Navbar() {
  const { theme } = useTheme();
  const pathname = usePathname();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  const internalItems: NavItem[] = [
    { label: "Home", href: "#hero", isExternal: false, id: "hero" },
    { label: "Experience", href: "#work", isExternal: false, id: "work" },
    { label: "Alma mater", href: "#education", isExternal: false, id: "education" },
    { label: "My LLM", href: "#model", isExternal: false, id: "model" },
    { label: "Research", href: "#scholar", isExternal: false, id: "scholar" },
  ];

  const navItems = internalItems;

  useEffect(() => {
    if (pathname !== "/") return;

    const handleScroll = () => {
      let current = "hero";
      const scrollY = window.scrollY;

      // Bottom of page check
      if (window.innerHeight + scrollY >= document.documentElement.scrollHeight - 100) {
        current = "scholar";
      } else {
        for (const item of internalItems) {
          if (!item.id) continue;
          const el = document.getElementById(item.id);
          if (el) {
            // If scrolled past the section top minus a threshold, set it as current
            if (scrollY + window.innerHeight / 3 >= el.offsetTop) {
              current = item.id;
            }
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    if (item.isExternal) return;
    
    if (pathname === "/") {
      e.preventDefault();
      if (item.id === "hero") {
        window.dispatchEvent(new Event("reset-reveal"));
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        document.documentElement.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        document.body.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        window.history.pushState(null, "", "/");
        setActiveSection("hero");
      } else if (item.id) {
        const el = document.getElementById(item.id);
        if (el) {
          const targetScrollY = el.offsetTop - 70;
          window.scrollTo({ top: targetScrollY, behavior: "smooth" });
          window.history.pushState(null, "", `#${item.id}`);
          setActiveSection(item.id);
        }
      }
    }
  };

  // Find active index
  const activeIdx = navItems.findIndex((item) => {
    if (item.isExternal) return false;
    if (pathname === "/") {
      return item.id === activeSection;
    }
    return item.href === "/";
  });

  const currentHighlightIdx = hoveredIdx !== null ? hoveredIdx : (activeIdx !== -1 ? activeIdx : null);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-30 flex justify-center">
      {mounted && (
        <div
          className={cn(
            "pointer-events-auto flex items-center gap-1.5 border px-3.5 py-1.5 rounded-full select-none transition-all duration-300",
            "bg-neutral-900 border-neutral-850",
            "dark:bg-white dark:border-neutral-200 dark:shadow-[0_8px_32px_rgba(0,0,0,0.1)]"
          )}
          onMouseLeave={() => setHoveredIdx(null)}
        >
          <div
            className="flex items-center gap-1.5 w-full h-full"
            onMouseLeave={() => setHoveredIdx(null)}
          >
            {navItems.map((item, idx) => {
              const isHighlighted = currentHighlightIdx === idx;

              return (
                <a
                  key={item.href}
                  href={pathname === "/" ? item.href : `/${item.href}`}
                  target={item.isExternal ? "_blank" : undefined}
                  rel={item.isExternal ? "noopener noreferrer" : undefined}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onClick={(e) => handleClick(e, item)}
                  className={cn(
                    "relative z-10 px-3.5 py-1 text-sm transition-colors rounded-full font-medium",
                    isHighlighted
                      ? "text-white dark:text-white"
                      : "text-neutral-400 hover:text-white dark:text-neutral-500 dark:hover:text-neutral-800"
                  )}
                >
                  {/* Shared layout sliding hover highlight pill */}
                  {isHighlighted && (
                    <motion.span
                      layoutId="navbar-hover-bg"
                      className="absolute inset-0 rounded-full bg-[#ff4300] dark:bg-[#ff4300] -z-10"
                      transition={{ type: "spring", stiffness: 140, damping: 22 }}
                    />
                  )}
                  {item.label}
                </a>
              );
            })}
            
            <div className="h-4 w-px bg-neutral-850 dark:bg-neutral-200 mx-1.5" />
            
            <Switch />
          </div>
        </div>
      )}
    </div>
  );
}
