"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import Switch from "@/components/Switch";
import { Home, Briefcase, GraduationCap, Brain, BookOpen, Menu, X } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  isExternal: boolean;
  id?: string;
  icon: any;
}

export default function Navbar() {
  const { theme } = useTheme();
  const pathname = usePathname();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  const internalItems: NavItem[] = [
    { label: "Home", href: "#hero", isExternal: false, id: "hero", icon: Home },
    { label: "Experience", href: "#work", isExternal: false, id: "work", icon: Briefcase },
    { label: "Alma mater", href: "#education", isExternal: false, id: "education", icon: GraduationCap },
    { label: "My LLM", href: "#model", isExternal: false, id: "model", icon: Brain },
    { label: "Research", href: "#scholar", isExternal: false, id: "scholar", icon: BookOpen },
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
      setMobileOpen(false); // Close menu on click
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
    <>
      {/* DESKTOP/TABLET NAVBAR */}
      <div className="hidden sm:flex pointer-events-none fixed inset-x-0 top-4 z-30 justify-center">
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

      {/* MOBILE CREATIVE EXPANDABLE DOCK NAVBAR */}
      <div className="sm:hidden fixed bottom-6 inset-x-0 z-50 flex justify-center pointer-events-none">
        {mounted && (
          <div className="relative flex flex-col items-center pointer-events-auto">
            {/* The Main Expandable Drawer Container */}
            <motion.div
              layout
              style={{ borderRadius: mobileOpen ? "24px" : "9999px" }}
              animate={{
                width: mobileOpen ? "280px" : "56px",
                height: mobileOpen ? "320px" : "56px",
                boxShadow: mobileOpen 
                  ? "0 20px 40px rgba(0,0,0,0.25)" 
                  : "0 10px 25px rgba(0,0,0,0.15)",
              }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              className={cn(
                "border flex flex-col overflow-hidden backdrop-blur-lg select-none",
                "bg-neutral-900 border-neutral-850 text-white",
                "dark:bg-white dark:border-neutral-200 dark:text-neutral-900"
              )}
            >
              {/* Closed State Toggle Button (Acts as the floating bubble) */}
              <div className="flex justify-end p-2.5 h-[56px] w-full flex-none items-center">
                {/* Menu items displayed when open */}
                {mobileOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mr-auto pl-3 font-semibold text-sm tracking-wider uppercase opacity-80"
                  >
                    Menu
                  </motion.span>
                )}

                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center transition-colors focus-visible:outline-none",
                    "hover:bg-neutral-800 active:bg-neutral-700",
                    "dark:hover:bg-neutral-100 dark:active:bg-neutral-200"
                  )}
                  aria-label="Toggle navigation menu"
                >
                  <motion.div
                    key={mobileOpen ? "open" : "closed"}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </motion.div>
                </button>
              </div>

              {/* Opened Drawer Contents */}
              <AnimatePresence>
                {mobileOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col px-4 pb-4 overflow-y-auto"
                  >
                    {/* Vertical Links Stack */}
                    <div className="flex-1 flex flex-col gap-1 justify-center">
                      {navItems.map((item, idx) => {
                        const isActive = activeIdx === idx;
                        const Icon = item.icon;

                        return (
                          <motion.a
                            initial={{ x: -15, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.04 }}
                            key={item.href}
                            href={pathname === "/" ? item.href : `/${item.href}`}
                            onClick={(e) => handleClick(e, item)}
                            className={cn(
                              "flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                              isActive
                                ? "bg-[#ff4300] text-white"
                                : "text-neutral-400 hover:text-white hover:bg-neutral-850 dark:text-neutral-500 dark:hover:text-neutral-900 dark:hover:bg-neutral-100"
                            )}
                          >
                            <Icon className="w-4 h-4 flex-none" />
                            <span>{item.label}</span>
                          </motion.a>
                        );
                      })}
                    </div>

                    {/* Divider and Theme Switcher at bottom */}
                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.25 }}
                      className="border-t border-neutral-800 dark:border-neutral-200 mt-3 pt-3 pb-2 flex items-center justify-between px-2"
                    >
                      <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">Appearance</span>
                      <Switch />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
}
