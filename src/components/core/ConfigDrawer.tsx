"use client";

import React, { useEffect } from "react";
import { LayoutPreset } from "@/types/portfolio";
import { siteConfig } from "@/config/portfolio.config";
import { X, Moon, Sun, Square, Circle, Sparkles, Type } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activePreset: LayoutPreset;
  onPresetChange: (preset: LayoutPreset) => void;
  edgeStyle: "straight" | "curved";
  onEdgeStyleChange: (style: "straight" | "curved") => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  showShadows?: boolean;
  onToggleShadows?: () => void;
  showTitles?: boolean;
  onToggleTitles?: () => void;
}

export const ConfigDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  activePreset,
  onPresetChange,
  edgeStyle,
  onEdgeStyleChange,
  darkMode,
  onToggleDarkMode,
  showShadows = false,
  onToggleShadows,
  showTitles = true,
  onToggleTitles,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        {/* Small Right Drawer */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="relative w-80 bg-background text-foreground h-full border-l border-border p-6 shadow-2xl z-10 flex flex-col justify-between overflow-y-auto"
        >
          {/* Drawer Header & Controls */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                Display Settings
              </span>
              <button
                onClick={onClose}
                className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>

            {/* Layout Preset Switcher */}
            <div className="space-y-3">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block">
                Layout Preset
              </label>
              <div className="flex flex-col gap-1.5">
                {siteConfig.availablePresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => onPresetChange(preset.id)}
                    className={`text-left px-3 py-2 text-xs font-mono uppercase tracking-wider transition-all border cursor-pointer ${
                      activePreset === preset.id
                        ? "bg-foreground text-background border-foreground font-medium"
                        : "bg-transparent text-muted-foreground border-border hover:text-foreground hover:border-foreground/50"
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Floating Rectangle Project Titles Toggle */}
            {onToggleTitles && (
              <div className="space-y-3 pt-2">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block">
                  Project Names on Canvas
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <button
                    onClick={() => !showTitles && onToggleTitles()}
                    className={`flex items-center justify-center gap-2 p-2 border uppercase tracking-wider transition-all cursor-pointer ${
                      showTitles
                        ? "bg-foreground text-background border-foreground font-medium"
                        : "bg-transparent text-muted-foreground border-border hover:text-foreground"
                    }`}
                  >
                    <Type className="w-3.5 h-3.5 stroke-[1.5]" />
                    <span>Show Names</span>
                  </button>
                  <button
                    onClick={() => showTitles && onToggleTitles()}
                    className={`flex items-center justify-center gap-2 p-2 border uppercase tracking-wider transition-all cursor-pointer ${
                      !showTitles
                        ? "bg-foreground text-background border-foreground font-medium"
                        : "bg-transparent text-muted-foreground border-border hover:text-foreground"
                    }`}
                  >
                    <span>Hide Names</span>
                  </button>
                </div>
              </div>
            )}

            {/* Floating Rectangle Shadows Toggle */}
            {onToggleShadows && (
              <div className="space-y-3 pt-2">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block">
                  Floating Card Shadows
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <button
                    onClick={() => !showShadows && onToggleShadows()}
                    className={`flex items-center justify-center gap-2 p-2 border uppercase tracking-wider transition-all cursor-pointer ${
                      showShadows
                        ? "bg-foreground text-background border-foreground font-medium"
                        : "bg-transparent text-muted-foreground border-border hover:text-foreground"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 stroke-[1.5]" />
                    <span>Shadow On</span>
                  </button>
                  <button
                    onClick={() => showShadows && onToggleShadows()}
                    className={`flex items-center justify-center gap-2 p-2 border uppercase tracking-wider transition-all cursor-pointer ${
                      !showShadows
                        ? "bg-foreground text-background border-foreground font-medium"
                        : "bg-transparent text-muted-foreground border-border hover:text-foreground"
                    }`}
                  >
                    <span>Shadow Off</span>
                  </button>
                </div>
              </div>
            )}

            {/* Edge Style Switcher (Curved vs Straight) */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block">
                Edge Geometry
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <button
                  onClick={() => onEdgeStyleChange("straight")}
                  className={`flex items-center justify-center gap-2 p-2 border uppercase tracking-wider transition-all cursor-pointer ${
                    edgeStyle === "straight"
                      ? "bg-foreground text-background border-foreground font-medium"
                      : "bg-transparent text-muted-foreground border-border hover:text-foreground"
                  }`}
                >
                  <Square className="w-3.5 h-3.5 stroke-[1.5]" />
                  <span>Straight</span>
                </button>
                <button
                  onClick={() => onEdgeStyleChange("curved")}
                  className={`flex items-center justify-center gap-2 p-2 border uppercase tracking-wider transition-all cursor-pointer ${
                    edgeStyle === "curved"
                      ? "bg-foreground text-background border-foreground font-medium"
                      : "bg-transparent text-muted-foreground border-border hover:text-foreground"
                  }`}
                >
                  <Circle className="w-3.5 h-3.5 stroke-[1.5]" />
                  <span>Curved</span>
                </button>
              </div>
            </div>

            {/* Theme Toggle */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block">
                Color Mode
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <button
                  onClick={() => !darkMode && onToggleDarkMode()}
                  className={`flex items-center justify-center gap-2 p-2 border uppercase tracking-wider transition-all cursor-pointer ${
                    darkMode
                      ? "bg-foreground text-background border-foreground font-medium"
                      : "bg-transparent text-muted-foreground border-border hover:text-foreground"
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 stroke-[1.5]" />
                  <span>Dark</span>
                </button>
                <button
                  onClick={() => darkMode && onToggleDarkMode()}
                  className={`flex items-center justify-center gap-2 p-2 border uppercase tracking-wider transition-all cursor-pointer ${
                    !darkMode
                      ? "bg-foreground text-background border-foreground font-medium"
                      : "bg-transparent text-muted-foreground border-border hover:text-foreground"
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 stroke-[1.5]" />
                  <span>Light</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer note inside drawer */}
          <div className="pt-6 border-t border-border text-[10px] font-mono text-muted-foreground text-center">
            ATALAY FERSIZ PORTFOLIO SYSTEM
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
