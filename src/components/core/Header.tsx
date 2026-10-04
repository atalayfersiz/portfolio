"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/portfolio.config";
import { SlidersHorizontal } from "lucide-react";

interface Props {
  onOpenConfig?: () => void;
}

export const Header: React.FC<Props> = ({ onOpenConfig }) => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border/40 transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Top Left Name (Paule Perron style: Short P.P. / A.F. expands to Full Name on hover) */}
        <Link href="/" className="group relative font-mono text-xs uppercase tracking-widest text-foreground">
          <span className="inline-block transition-opacity duration-300 group-hover:opacity-0">
            {siteConfig.shortName}
          </span>
          <span className="absolute left-0 top-0 whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100 font-sans font-medium tracking-wider">
            {siteConfig.name}
          </span>
        </Link>

        {/* Center / Right Nav Links */}
        <nav className="flex items-center gap-8 text-xs font-mono uppercase tracking-widest">
          <Link
            href="/"
            className={`transition-colors hover:text-foreground ${
              pathname === "/" ? "text-foreground font-semibold" : "text-muted-foreground"
            }`}
          >
            work
          </Link>
          <Link
            href="/about"
            className={`transition-colors hover:text-foreground ${
              pathname === "/about" ? "text-foreground font-semibold" : "text-muted-foreground"
            }`}
          >
            about
          </Link>

          {/* Settings Trigger */}
          {onOpenConfig && (
            <button
              onClick={onOpenConfig}
              aria-label="Open settings"
              className="p-1.5 rounded text-muted-foreground hover:text-foreground transition-colors"
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
