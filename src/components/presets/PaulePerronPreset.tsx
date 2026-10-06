"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Project, Category } from "@/types/portfolio";
import { motion, AnimatePresence } from "framer-motion";
import { getAssetPath } from "@/utils/asset";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface Props {
  projects: Project[];
  onSelectProject?: (project: Project) => void;
  showShadows?: boolean;
  showTitles?: boolean;
}

const CATEGORIES: { id: Category; label: string; isBold?: boolean }[] = [
  { id: "selected", label: "s e l e c t e d", isBold: true },
  { id: "academic", label: "a c a d e m i c" },
  { id: "professional", label: "p r o f e s s i o n a l" },
  { id: "explorations", label: "e x p l o r a t i o n s" },
];

// Balanced, non-colliding spatial positions filling the canvas organically
const FLOATING_LAYOUT: Record<
  string,
  {
    desktop: { top: string; left: string };
    duration: number;
    floatY: number[];
    floatX: number[];
    floatRotate: number[];
  }
> = {
  // ==========================================
  // BAND 1 — Top Band (Y: ~5% - 7%)
  // ==========================================
  "tower-in-kadikoy": {
    desktop: { top: "6%", left: "4%" },
    duration: 8.2,
    floatY: [0, 3, -3, 2, 0],
    floatX: [0, -2, 2, -1, 0],
    floatRotate: [0.3, -0.3, 0.2, -0.2, 0.3],
  },
  tidescape: {
    desktop: { top: "5%", left: "20%" },
    duration: 7.2,
    floatY: [0, -3, 2, -2, 0],
    floatX: [0, 2, -2, 1, 0],
    floatRotate: [-0.2, 0.3, -0.2, 0.2, -0.2],
  },
  "curve-growth": {
    desktop: { top: "5%", left: "37%" },
    duration: 7.5,
    floatY: [0, 2, -3, 2, 0],
    floatX: [0, -2, 2, -1, 0],
    floatRotate: [0.3, -0.2, 0.2, -0.3, 0.3],
  },
  kartalkaya: {
    desktop: { top: "5%", left: "54%" },
    duration: 7.8,
    floatY: [0, 3, -2, 2, 0],
    floatX: [0, -2, 2, -1, 0],
    floatRotate: [0.2, -0.3, 0.2, -0.2, 0.2],
  },
  "tower-in-ihsaniye": {
    desktop: { top: "5%", left: "71%" },
    duration: 6.8,
    floatY: [0, -2, 3, -2, 0],
    floatX: [0, -2, 2, -2, 0],
    floatRotate: [-0.2, 0.3, -0.2, 0.2, -0.2],
  },
  canography: {
    desktop: { top: "6%", left: "87%" },
    duration: 6.9,
    floatY: [0, -3, 2, -2, 0],
    floatX: [0, 2, -2, 1, 0],
    floatRotate: [-0.2, 0.3, -0.2, 0.2, -0.2],
  },

  // ==========================================
  // BAND 2 — Upper-Mid Band (Y: ~22% - 24%)
  // ==========================================
  "pb-workshop": {
    desktop: { top: "22%", left: "3%" },
    duration: 8.5,
    floatY: [0, 3, -2, 2, 0],
    floatX: [0, -2, 2, -1, 0],
    floatRotate: [0.2, -0.2, 0.2, -0.2, 0.2],
  },
  cb: {
    desktop: { top: "23%", left: "18%" },
    duration: 7.3,
    floatY: [0, 2, -3, 2, 0],
    floatX: [0, -2, 2, -1, 0],
    floatRotate: [0.2, -0.2, 0.2, -0.2, 0.2],
  },
  origami: {
    desktop: { top: "24%", left: "33%" },
    duration: 8.1,
    floatY: [0, -3, 2, -2, 0],
    floatX: [0, 2, -2, 1, 0],
    floatRotate: [-0.3, 0.2, -0.2, 0.2, -0.3],
  },
  urla: {
    desktop: { top: "24%", left: "58%" },
    duration: 8.5,
    floatY: [0, 2, -3, 2, 0],
    floatX: [0, -2, 2, -1, 0],
    floatRotate: [0.2, -0.3, 0.2, -0.2, 0.2],
  },
  hansapocene: {
    desktop: { top: "23%", left: "73%" },
    duration: 8.0,
    floatY: [0, -3, 2, -2, 0],
    floatX: [0, 2, -2, 1, 0],
    floatRotate: [-0.2, 0.3, -0.2, 0.2, -0.2],
  },
  fields: {
    desktop: { top: "22%", left: "88%" },
    duration: 7.4,
    floatY: [0, 3, -2, 2, 0],
    floatX: [0, -2, 2, -1, 0],
    floatRotate: [0.2, -0.3, 0.2, -0.2, 0.2],
  },

  // ==========================================
  // BAND 3 — Mid Band / Outer Wings (Y: ~42% - 44%)
  // ==========================================
  "unite-dhabitation-to-daw": {
    desktop: { top: "42%", left: "4%" },
    duration: 8.6,
    floatY: [0, 3, -2, 2, 0],
    floatX: [0, -2, 2, -1, 0],
    floatRotate: [0.2, -0.2, 0.2, -0.2, 0.2],
  },
  aggregation: {
    desktop: { top: "43%", left: "18%" },
    duration: 7.9,
    floatY: [0, 2, -3, 2, 0],
    floatX: [0, -2, 2, -1, 0],
    floatRotate: [0.2, -0.2, 0.2, -0.2, 0.2],
  },
  "blended-mesh": {
    desktop: { top: "44%", left: "31%" },
    duration: 8.3,
    floatY: [0, -2, 3, -2, 0],
    floatX: [0, 2, -2, 1, 0],
    floatRotate: [-0.2, 0.2, -0.2, 0.2, -0.2],
  },
  "steglitzer-kreisel": {
    desktop: { top: "44%", left: "60%" },
    duration: 8.2,
    floatY: [0, -2, 2, -2, 0],
    floatX: [0, 2, -2, 1, 0],
    floatRotate: [-0.2, 0.2, -0.2, 0.2, -0.2],
  },
  mdc: {
    desktop: { top: "43%", left: "74%" },
    duration: 7.0,
    floatY: [0, 2, -3, 2, 0],
    floatX: [0, -2, 2, -1, 0],
    floatRotate: [0.2, -0.2, 0.2, -0.2, 0.2],
  },
  "james-simon-galerie-audio-path": {
    desktop: { top: "42%", left: "87%" },
    duration: 8.1,
    floatY: [0, -2, 3, -2, 0],
    floatX: [0, 2, -2, 1, 0],
    floatRotate: [-0.2, 0.2, -0.2, 0.2, -0.2],
  },

  // ==========================================
  // BAND 4 — Lower-Mid Band (Y: ~62% - 64%)
  // ==========================================
  "denkmal-fuer-die-ermordeten-juden-europas": {
    desktop: { top: "62%", left: "5%" },
    duration: 8.3,
    floatY: [0, 2, -3, 2, 0],
    floatX: [0, -2, 2, -1, 0],
    floatRotate: [0.2, -0.2, 0.2, -0.2, 0.2],
  },
  amorf: {
    desktop: { top: "63%", left: "21%" },
    duration: 7.1,
    floatY: [0, -2, 2, -2, 0],
    floatX: [0, 2, -2, 1, 0],
    floatRotate: [-0.2, 0.2, -0.2, 0.2, -0.2],
  },
  if: {
    desktop: { top: "64%", left: "36%" },
    duration: 7.6,
    floatY: [0, 3, -2, 2, 0],
    floatX: [0, -2, 2, -1, 0],
    floatRotate: [0.2, -0.2, 0.2, -0.2, 0.2],
  },
  particle: {
    desktop: { top: "63%", left: "70%" },
    duration: 7.7,
    floatY: [0, -3, 2, -2, 0],
    floatX: [0, 2, -2, 1, 0],
    floatRotate: [-0.2, 0.2, -0.2, 0.2, -0.2],
  },
  mavisehir: {
    desktop: { top: "62%", left: "86%" },
    duration: 8.0,
    floatY: [0, -3, 2, -2, 0],
    floatX: [0, 2, -2, 1, 0],
    floatRotate: [-0.2, 0.2, -0.2, 0.2, -0.2],
  },

  // ==========================================
  // BAND 5 — Bottom Band (Y: ~78% - 80%)
  // ==========================================
  "iris-tower": {
    desktop: { top: "79%", left: "8%" },
    duration: 8.8,
    floatY: [0, 3, -3, 2, 0],
    floatX: [0, 2, -2, 1, 0],
    floatRotate: [0.3, -0.2, 0.3, -0.2, 0.3],
  },
  "kairo-looro": {
    desktop: { top: "80%", left: "27%" },
    duration: 8.0,
    floatY: [0, -3, 2, -2, 0],
    floatX: [0, 2, -2, 1, 0],
    floatRotate: [-0.2, 0.2, -0.2, 0.2, -0.2],
  },
  "friedrichstrasse-to-daw": {
    desktop: { top: "79%", left: "46%" },
    duration: 7.9,
    floatY: [0, -2, 2, -2, 0],
    floatX: [0, 2, -2, 1, 0],
    floatRotate: [-0.2, 0.2, -0.2, 0.2, -0.2],
  },
  "kreuzberg-tower-to-daw": {
    desktop: { top: "80%", left: "65%" },
    duration: 8.4,
    floatY: [0, 2, -3, 2, 0],
    floatX: [0, -2, 2, -1, 0],
    floatRotate: [0.2, -0.3, 0.2, -0.2, 0.2],
  },
  roboshore: {
    desktop: { top: "79%", left: "83%" },
    duration: 7.8,
    floatY: [0, -3, 2, -2, 0],
    floatX: [0, 2, -2, 1, 0],
    floatRotate: [0.2, -0.3, 0.2, -0.2, 0.2],
  },
};

export const PaulePerronPreset: React.FC<Props> = ({
  projects,
  onSelectProject,
  showShadows = false,
  showTitles = true,
}) => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);

  // Single unified transform state (atomic 2D affine transform)
  const [transform, setTransform] = useState<{ x: number; y: number; scale: number }>({
    x: 0,
    y: 0,
    scale: 1.0,
  });

  const [isPanning, setIsPanning] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef<{ x: number; y: number; scale: number }>({
    x: 0,
    y: 0,
    scale: 1.0,
  });

  const isDraggingCardRef = useRef<boolean>(false);
  const panStartRef = useRef<{ startX: number; startY: number; initX: number; initY: number }>({
    startX: 0,
    startY: 0,
    initX: 0,
    initY: 0,
  });

  // Keep transformRef synchronously in sync with state
  useEffect(() => {
    transformRef.current = transform;
  }, [transform]);

  // Reset Viewport to Default
  const resetView = useCallback(() => {
    const next = { x: 0, y: 0, scale: 1.0 };
    transformRef.current = next;
    setTransform(next);
  }, []);

  // Viewport-centered HUD zoom buttons
  const handleZoomIn = () => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const curr = transformRef.current;
    const newScale = Math.min(Number((curr.scale * 1.2).toFixed(3)), 3.0);
    const ratio = newScale / curr.scale;

    const next = {
      x: centerX - (centerX - curr.x) * ratio,
      y: centerY - (centerY - curr.y) * ratio,
      scale: newScale,
    };
    transformRef.current = next;
    setTransform(next);
  };

  const handleZoomOut = () => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const curr = transformRef.current;
    const newScale = Math.max(Number((curr.scale / 1.2).toFixed(3)), 0.35);
    const ratio = newScale / curr.scale;

    const next = {
      x: centerX - (centerX - curr.x) * ratio,
      y: centerY - (centerY - curr.y) * ratio,
      scale: newScale,
    };
    transformRef.current = next;
    setTransform(next);
  };

  // Precise Cursor-Anchored Wheel Zoom Handler
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Prevent browser default window scrolling
      e.preventDefault();

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Determine zoom step: smooth continuous for trackpads, stepped for physical scroll wheels
      let zoomFactor: number;
      if (Math.abs(e.deltaY) >= 50) {
        // Discrete mouse wheel notch
        zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
      } else {
        // Continuous precision trackpad pinch / micro scroll
        zoomFactor = Math.exp(-e.deltaY * 0.003);
      }

      const curr = transformRef.current;
      const newScale = Math.min(Math.max(curr.scale * zoomFactor, 0.35), 3.0);
      if (Math.abs(newScale - curr.scale) < 0.0001) return;

      const ratio = newScale / curr.scale;

      // Anchor zoom exactly to (mouseX, mouseY)
      const newX = mouseX - (mouseX - curr.x) * ratio;
      const newY = mouseY - (mouseY - curr.y) * ratio;

      const next = {
        x: newX,
        y: newY,
        scale: newScale,
      };

      transformRef.current = next;
      setTransform(next);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // Mouse drag panning on canvas background
  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest(".project-floating-card") ||
      target.closest(".paule-cat-btn") ||
      target.closest(".miro-hud")
    ) {
      return;
    }

    setIsPanning(true);
    panStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: transformRef.current.x,
      initY: transformRef.current.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    const dx = e.clientX - panStartRef.current.startX;
    const dy = e.clientY - panStartRef.current.startY;
    const next = {
      ...transformRef.current,
      x: panStartRef.current.initX + dx,
      y: panStartRef.current.initY + dy,
    };
    transformRef.current = next;
    setTransform(next);
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Clear category filter when clicking empty background space
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest(".project-floating-card") ||
        target.closest(".paule-cat-btn") ||
        target.closest(".miro-hud")
      ) {
        return;
      }
      if (activeCategory) {
        setActiveCategory(null);
      }
    };
    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, [activeCategory]);

  const handleCategoryClick = (e: React.MouseEvent, cat: Category) => {
    e.stopPropagation();
    if (activeCategory === cat) {
      setActiveCategory(null);
    } else {
      setActiveCategory(cat);
    }
  };

  const handleCardClick = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    if (isDraggingCardRef.current) return;
    if (onSelectProject) {
      onSelectProject(project);
    } else {
      router.push(`/projects/${project.slug}`);
    }
  };

  const filteredMobileProjects = activeCategory
    ? projects.filter((p) => p.categories.includes(activeCategory))
    : projects;

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`relative w-full h-full overflow-hidden bg-background text-foreground select-none font-heading touch-none ${
        isPanning ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      {/* ========================================================================= */}
      {/* MOBILE VIEW (< lg): 3-Column Touch Grid                                   */}
      {/* ========================================================================= */}
      <div className="lg:hidden w-full h-full overflow-y-auto flex flex-col items-center z-10 px-4 py-8 max-w-lg mx-auto pointer-events-auto">
        {/* Category Filter Buttons */}
        <div className="flex flex-col items-center gap-3 text-center my-4 w-full">
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.id;
            const count = projects.filter((p) => p.categories.includes(cat.id)).length;

            return (
              <button
                key={cat.id}
                onClick={(e) => handleCategoryClick(e, cat.id)}
                className={`paule-cat-btn group relative cursor-pointer text-xs sm:text-sm font-heading tracking-[0.35em] uppercase py-1.5 px-4 transition-all duration-300 ${
                  cat.isBold ? "font-bold" : "font-light"
                } ${
                  isSelected
                    ? "text-foreground font-semibold"
                    : activeCategory
                    ? "text-muted-foreground/35 hover:text-muted-foreground"
                    : "text-foreground/80 hover:text-foreground"
                }`}
              >
                <span className={`inline-block transition-all duration-300 ${cat.isBold ? "font-bold" : ""}`}>
                  {cat.label}
                </span>
                <span
                  className={`ml-2.5 text-[9px] font-mono tracking-widest px-1.5 py-0.2 border dynamic-radius align-middle transition-all duration-300 ${
                    isSelected
                      ? "border-foreground text-foreground bg-foreground/5 font-semibold"
                      : "border-border/60 text-muted-foreground/60 opacity-60"
                  }`}
                >
                  {count}
                </span>
                {isSelected && (
                  <motion.div
                    layoutId="active-cat-indicator-mobile"
                    className="absolute -bottom-0.5 left-1/4 right-1/4 h-[1px] bg-foreground/70"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* 3-Column Project Grid */}
        <motion.div layout className="grid grid-cols-3 gap-3 sm:gap-4 w-full mt-6 px-1 pb-16">
          <AnimatePresence mode="popLayout">
            {filteredMobileProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.25 }}
                onClick={(e) => handleCardClick(e, project)}
                className="group flex flex-col items-center cursor-pointer pointer-events-auto select-none"
              >
                <div
                  className={`relative w-full aspect-square overflow-hidden dynamic-radius bg-muted/20 border border-border/70 group-hover:border-foreground/60 active:scale-95 transition-all ${
                    showShadows ? "shadow-sm group-hover:shadow-md" : "shadow-none"
                  }`}
                >
                  {project.coverImage?.url ? (
                    <img
                      src={getAssetPath(project.coverImage.url)}
                      alt={project.coverImage.alt || project.title}
                      loading="lazy"
                      draggable={false}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : null}
                </div>

                {showTitles && (
                  <div className="w-full text-center mt-1.5 px-0.5">
                    <h3 className="text-[9px] sm:text-[10px] font-heading font-medium tracking-wider text-foreground/80 uppercase truncate group-hover:text-foreground transition-colors">
                      {project.title}
                    </h3>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP INFINITE MIRO CANVAS (>= lg): Pan, Zoom, Drag & Orbit             */}
      {/* ========================================================================= */}
      <div
        className="hidden lg:block w-full h-full absolute inset-0 will-change-transform"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: "0 0",
        }}
      >
        {/* Background Dot Grid that scales & translates seamlessly with the canvas */}
        <div
          className="absolute pointer-events-none opacity-[0.04] dark:opacity-[0.08]"
          style={{
            top: "-150%",
            left: "-150%",
            width: "400%",
            height: "400%",
            backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Center Category Typography Menu */}
        <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none z-10">
          <div className="paule-container relative flex flex-col justify-center items-center gap-4 text-center pointer-events-auto">
            {CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat.id;
              const count = projects.filter((p) => p.categories.includes(cat.id)).length;

              return (
                <button
                  key={cat.id}
                  onClick={(e) => handleCategoryClick(e, cat.id)}
                  className={`paule-cat-btn group relative cursor-pointer text-xs sm:text-sm md:text-[15px] font-heading tracking-[0.35em] uppercase py-2 px-5 transition-all duration-300 ${
                    cat.isBold ? "font-bold" : "font-light"
                  } ${
                    isSelected
                      ? "text-foreground font-semibold"
                      : activeCategory
                      ? "text-muted-foreground/35 hover:text-muted-foreground"
                      : "text-foreground/75 hover:text-foreground"
                  }`}
                >
                  <span className={`inline-block transition-all duration-300 ${cat.isBold ? "font-bold" : ""}`}>
                    {cat.label}
                  </span>
                  <span
                    className={`ml-2.5 text-[9px] font-mono tracking-widest px-1.5 py-0.2 border dynamic-radius align-middle transition-all duration-300 ${
                      isSelected
                        ? "border-foreground text-foreground bg-foreground/5 font-semibold"
                        : "border-border/60 text-muted-foreground/60 opacity-60 group-hover:opacity-100"
                    }`}
                  >
                    {count}
                  </span>
                  {isSelected && (
                    <motion.div
                      layoutId="active-cat-indicator-desktop"
                      className="absolute -bottom-0.5 left-1/4 right-1/4 h-[1px] bg-foreground/60"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Floating Interactive Project Cards Layer */}
        <div className="w-full h-full absolute inset-0 z-20 pointer-events-none">
          {projects.map((project) => {
            const config = FLOATING_LAYOUT[project.slug] || {
              desktop: { top: "20%", left: "20%" },
              duration: 7,
              floatY: [0, -3, 3, -2, 0],
              floatX: [0, 2, -2, 1, 0],
              floatRotate: [0, 0.3, -0.3, 0],
            };

            const isFilteredActive = activeCategory && project.categories.includes(activeCategory);
            const isHovered = hoveredProjectId === project.id;

            let cardStateClass = "";
            if (activeCategory) {
              if (isFilteredActive) {
                cardStateClass = isHovered ? "opacity-100 grayscale-0 z-40" : "opacity-100 grayscale-0 z-30";
              } else {
                cardStateClass = "opacity-10 grayscale pointer-events-none z-10";
              }
            } else {
              cardStateClass = isHovered
                ? "opacity-100 grayscale-0 z-40"
                : "opacity-55 hover:opacity-100 grayscale hover:grayscale-0 z-20 hover:z-30";
            }

            const shadowClass = showShadows
              ? isHovered
                ? "shadow-2xl"
                : "shadow-md"
              : "shadow-none";

            return (
              <motion.div
                key={project.id}
                drag
                dragMomentum={false}
                dragElastic={0.05}
                onDragStart={() => {
                  isDraggingCardRef.current = true;
                }}
                onDragEnd={() => {
                  setTimeout(() => {
                    isDraggingCardRef.current = false;
                  }, 120);
                }}
                animate={{
                  y: config.floatY,
                  x: config.floatX,
                  rotate: config.floatRotate,
                }}
                transition={{
                  duration: config.duration,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
                style={{
                  top: config.desktop.top,
                  left: config.desktop.left,
                }}
                onMouseEnter={() => setHoveredProjectId(project.id)}
                onMouseLeave={() => setHoveredProjectId(null)}
                onClick={(e) => handleCardClick(e, project)}
                className={`project-floating-card pointer-events-auto cursor-grab active:cursor-grabbing absolute w-24 sm:w-26 lg:w-28 xl:w-30 flex flex-col items-center gap-1.5 transition-opacity duration-300 touch-none select-none ${cardStateClass}`}
              >
                {/* Square Cover Card Image */}
                <div
                  className={`relative w-full aspect-square overflow-hidden dynamic-radius bg-muted/20 border border-border/70 hover:border-foreground/60 transition-colors pointer-events-none select-none ${shadowClass}`}
                  style={{ userSelect: "none", WebkitUserSelect: "none" } as React.CSSProperties}
                >
                  {project.coverImage?.url ? (
                    <img
                      src={getAssetPath(project.coverImage.url)}
                      alt={project.coverImage.alt || project.title}
                      draggable={false}
                      className="w-full h-full object-cover pointer-events-none select-none"
                      style={{ userSelect: "none", WebkitUserSelect: "none" } as React.CSSProperties}
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : null}
                </div>

                {/* Project Title Text */}
                {showTitles && (
                  <div className="w-full text-center pointer-events-none select-none px-0.5">
                    <h3 className="text-[10px] sm:text-[11px] font-heading font-medium tracking-wide text-foreground uppercase truncate group-hover:text-foreground transition-colors">
                      {project.title}
                    </h3>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MIRO-STYLE FLOATING HUD TOOLBAR (Bottom-Right on Desktop)                  */}
      {/* ========================================================================= */}
      <div className="miro-hud hidden lg:flex items-center gap-1.5 absolute bottom-5 right-5 z-40 bg-background/80 backdrop-blur-md border border-border/50 dynamic-radius px-2 py-1 shadow-sm font-mono text-[11px] text-muted-foreground select-none pointer-events-auto">
        <button
          onClick={handleZoomOut}
          className="p-1 hover:text-foreground transition-colors rounded hover:bg-muted/40"
          title="Zoom Out (Scroll Down)"
          aria-label="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={resetView}
          className="px-1.5 py-0.5 text-[10px] tracking-wider font-medium hover:text-foreground transition-colors rounded hover:bg-muted/40"
          title="Reset View (100%)"
        >
          {Math.round(transform.scale * 100)}%
        </button>

        <button
          onClick={handleZoomIn}
          className="p-1 hover:text-foreground transition-colors rounded hover:bg-muted/40"
          title="Zoom In (Scroll Up)"
          aria-label="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <div className="h-3 w-[1px] bg-border/60 mx-0.5" />

        <button
          onClick={resetView}
          className="p-1 hover:text-foreground transition-colors rounded hover:bg-muted/40"
          title="Reset Pan & Zoom"
          aria-label="Reset View"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
