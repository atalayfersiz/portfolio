"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/portfolio.config";
import { SlidersHorizontal, Sun, Moon } from "lucide-react";

interface Props {
  onOpenConfig?: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const Header: React.FC<Props> = ({
  onOpenConfig,
  darkMode: externalDarkMode,
  onToggleDarkMode: externalToggleDarkMode,
}) => {
  const pathname = usePathname();
  const [internalDarkMode, setInternalDarkMode] = useState(false);

  useEffect(() => {
    // Sync initial state from documentElement
    const isDark = document.documentElement.classList.contains("dark");
    setInternalDarkMode(isDark);

    // Watch for class mutations on documentElement (e.g. from ConfigDrawer or parent state)
    const observer = new MutationObserver(() => {
      setInternalDarkMode(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const isDark =
    externalDarkMode !== undefined ? externalDarkMode : internalDarkMode;

  const handleToggleDarkMode = () => {
    if (externalToggleDarkMode) {
      externalToggleDarkMode();
    } else {
      const nextDark = !document.documentElement.classList.contains("dark");
      if (nextDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      setInternalDarkMode(nextDark);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border/40 transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Top Left Name (Paule Perron style: Short P.P. / A.F. expands to Full Name on hover) */}
        <Link
          href="/"
          className="group relative font-mono text-xs uppercase tracking-widest text-foreground"
        >
          <span className="inline-block transition-opacity duration-300 group-hover:opacity-0">
            {siteConfig.shortName}
          </span>
          <span className="absolute left-0 top-0 whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100 font-sans font-medium tracking-wider">
            {siteConfig.name}
          </span>
        </Link>

        {/* Center / Right Nav Links */}
        <nav className="flex items-center gap-6 sm:gap-8 text-xs font-mono uppercase tracking-widest">
          {/* Dark/Light Mode Toggle + Works */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleToggleDarkMode}
              aria-label="Toggle dark/light mode"
              className="p-1 rounded-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer inline-flex items-center justify-center mr-0.5"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <Sun className="w-3.5 h-3.5 stroke-[1.75]" />
              ) : (
                <Moon className="w-3.5 h-3.5 stroke-[1.75]" />
              )}
            </button>
            <Link
              href="/"
              className={`transition-colors hover:text-foreground ${
                pathname === "/"
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              works
            </Link>
          </div>

          <Link
            href="/about"
            className={`transition-colors hover:text-foreground ${
              pathname === "/about"
                ? "text-foreground font-semibold"
                : "text-muted-foreground"
            }`}
          >
            about
          </Link>

          {/* Settings Trigger */}
          {onOpenConfig && (
            <button
              onClick={onOpenConfig}
              aria-label="Open settings"
              className="p-1.5 rounded text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Settings"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 stroke-[1.5]" />
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
