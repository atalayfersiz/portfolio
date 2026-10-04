"use client";

import React, { useState, useEffect } from "react";
import { siteConfig } from "@/config/portfolio.config";
import { sampleProjects } from "@/content/projects";
import { LayoutPreset } from "@/types/portfolio";
import { Header } from "@/components/core/Header";
import { ConfigDrawer } from "@/components/core/ConfigDrawer";
import { PaulePerronPreset } from "@/components/presets/PaulePerronPreset";
import { MinimalGridPreset } from "@/components/presets/MinimalGridPreset";
import { EditorialPreset } from "@/components/presets/EditorialPreset";
import { FullscreenPreset } from "@/components/presets/FullscreenPreset";

export default function Home() {
  const [activePreset, setActivePreset] = useState<LayoutPreset>(siteConfig.activePreset);
  const [darkMode, setDarkMode] = useState(false);
  const [edgeStyle, setEdgeStyle] = useState<"straight" | "curved">("straight");
  const [showShadows, setShowShadows] = useState(false);
  const [showTitles, setShowTitles] = useState(true);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  // Apply CSS custom property for edge geometry
  useEffect(() => {
    const radiusValue = edgeStyle === "curved" ? "8px" : "0px";
    document.documentElement.style.setProperty("--radius", radiusValue);
  }, [edgeStyle]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return next;
    });
  };

  const toggleShadows = () => {
    setShowShadows((prev) => !prev);
  };

  const toggleTitles = () => {
    setShowTitles((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <Header onOpenConfig={() => setIsConfigOpen(true)} />

      {/* Dynamic Layout Preset Renderer */}
      <main className="flex-1">
        {activePreset === "paule-perron" && (
          <PaulePerronPreset
            projects={sampleProjects}
            showShadows={showShadows}
            showTitles={showTitles}
          />
        )}

        {activePreset === "minimal-grid" && <MinimalGridPreset projects={sampleProjects} />}

        {activePreset === "editorial" && <EditorialPreset projects={sampleProjects} />}

        {activePreset === "fullscreen" && <FullscreenPreset projects={sampleProjects} />}
      </main>

      {/* Right Configuration Drawer */}
      <ConfigDrawer
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        activePreset={activePreset}
        onPresetChange={setActivePreset}
        edgeStyle={edgeStyle}
        onEdgeStyleChange={setEdgeStyle}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        showShadows={showShadows}
        onToggleShadows={toggleShadows}
        showTitles={showTitles}
        onToggleTitles={toggleTitles}
      />

      {/* Minimal Footer */}
      <footer className="border-t border-border/40 py-4 px-6 text-[11px] font-mono text-muted-foreground bg-background">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <p>© {new Date().getFullYear()} {siteConfig.name}</p>
          <div className="flex items-center gap-4">
            {activePreset === "paule-perron" && (
              <>
                <button
                  onClick={toggleTitles}
                  className="hover:text-foreground transition-colors text-[10px] uppercase tracking-wider"
                >
                  names: {showTitles ? "on" : "off"}
                </button>
                <button
                  onClick={toggleShadows}
                  className="hover:text-foreground transition-colors text-[10px] uppercase tracking-wider"
                >
                  shadows: {showShadows ? "on" : "off"}
                </button>
              </>
            )}
            <button onClick={() => setIsConfigOpen(true)} className="hover:text-foreground transition-colors">
              settings
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
