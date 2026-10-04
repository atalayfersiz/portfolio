"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Project, Category } from "@/types/portfolio";
import { motion, AnimatePresence } from "framer-motion";

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

// Shuffled spatial positions intermixing Academic, Professional, and Parametric projects across canvas
const FLOATING_LAYOUT: Record<
  string,
  {
    desktop: { top?: string; bottom?: string; left?: string; right?: string };
    duration: number;
    floatY: number[];
    floatX: number[];
    floatRotate: number[];
  }
> = {
  // Top Row
  "tower-in-kadikoy": {
    desktop: { top: "5%", left: "4%" },
    duration: 8.2,
    floatY: [0, 10, -8, 6, 0],
    floatX: [0, -7, 5, -4, 0],
    floatRotate: [0.5, -0.7, 0.6, -0.4, 0.5],
  },
  tidescape: {
    desktop: { top: "4%", left: "26%" },
    duration: 7.2,
    floatY: [0, -11, 7, -8, 0],
    floatX: [0, 7, -5, 5, 0],
    floatRotate: [-0.4, 0.7, -0.5, 0.5, -0.4],
  },
  "curve-growth": {
    desktop: { top: "5%", left: "48%" },
    duration: 7.5,
    floatY: [0, 9, -7, 6, 0],
    floatX: [0, -6, 6, -5, 0],
    floatRotate: [0.6, -0.5, 0.4, -0.6, 0.6],
  },
  kartalkaya: {
    desktop: { top: "4%", right: "26%" },
    duration: 7.8,
    floatY: [0, 10, -8, 6, 0],
    floatX: [0, -6, 7, -4, 0],
    floatRotate: [0.4, -0.6, 0.5, -0.4, 0.4],
  },
  "tower-in-ihsaniye": {
    desktop: { top: "6%", right: "4%" },
    duration: 6.8,
    floatY: [0, -8, 10, -6, 0],
    floatX: [0, -7, 6, -7, 0],
    floatRotate: [-0.5, 0.7, -0.6, 0.5, -0.5],
  },

  // Upper-Mid Row
  "pb-workshop": {
    desktop: { top: "33%", left: "3%" },
    duration: 8.5,
    floatY: [0, 9, -8, 6, 0],
    floatX: [0, -5, 7, -4, 0],
    floatRotate: [0.5, -0.6, 0.5, -0.4, 0.5],
  },
  origami: {
    desktop: { top: "31%", left: "22%" },
    duration: 8.1,
    floatY: [0, -10, 8, -6, 0],
    floatX: [0, 6, -7, 5, 0],
    floatRotate: [-0.6, 0.5, -0.5, 0.6, -0.6],
  },
  fields: {
    desktop: { top: "31%", right: "22%" },
    duration: 7.4,
    floatY: [0, 9, -9, 7, 0],
    floatX: [0, -6, 6, -5, 0],
    floatRotate: [0.5, -0.6, 0.6, -0.4, 0.5],
  },
  canography: {
    desktop: { top: "33%", right: "3%" },
    duration: 6.9,
    floatY: [0, -9, 8, -5, 0],
    floatX: [0, 7, -6, 5, 0],
    floatRotate: [-0.5, 0.6, -0.4, 0.5, -0.5],
  },

  // Lower-Mid Row
  aggregation: {
    desktop: { top: "58%", left: "10%" },
    duration: 7.9,
    floatY: [0, 8, -9, 6, 0],
    floatX: [0, -6, 5, -4, 0],
    floatRotate: [0.4, -0.5, 0.5, -0.4, 0.4],
  },
  amorf: {
    desktop: { top: "59%", left: "29%" },
    duration: 7.1,
    floatY: [0, -8, 6, -7, 0],
    floatX: [0, 6, -5, 4, 0],
    floatRotate: [-0.4, 0.6, -0.5, 0.4, -0.4],
  },
  mdc: {
    desktop: { top: "59%", right: "29%" },
    duration: 7.0,
    floatY: [0, 8, -9, 6, 0],
    floatX: [0, -6, 5, -5, 0],
    floatRotate: [0.5, -0.5, 0.4, -0.4, 0.5],
  },
  particle: {
    desktop: { top: "58%", right: "10%" },
    duration: 7.7,
    floatY: [0, -9, 7, -6, 0],
    floatX: [0, 7, -6, 5, 0],
    floatRotate: [-0.5, 0.6, -0.5, 0.4, -0.5],
  },

  // Mid-Floating Intermediate Cluster
  cb: {
    desktop: { top: "19%", left: "13%" },
    duration: 7.3,
    floatY: [0, 8, -7, 5, 0],
    floatX: [0, -5, 6, -4, 0],
    floatRotate: [0.5, -0.4, 0.5, -0.3, 0.5],
  },
  hansapocene: {
    desktop: { top: "19%", right: "13%" },
    duration: 8.0,
    floatY: [0, -9, 8, -6, 0],
    floatX: [0, 6, -5, 4, 0],
    floatRotate: [-0.4, 0.6, -0.5, 0.4, -0.4],
  },
  if: {
    desktop: { bottom: "18%", left: "16%" },
    duration: 7.6,
    floatY: [0, 9, -8, 6, 0],
    floatX: [0, -6, 5, -4, 0],
    floatRotate: [0.5, -0.5, 0.4, -0.4, 0.5],
  },
  "steglitzer-kreisel": {
    desktop: { bottom: "18%", right: "16%" },
    duration: 8.2,
    floatY: [0, -8, 7, -5, 0],
    floatX: [0, 5, -6, 4, 0],
    floatRotate: [-0.4, 0.5, -0.4, 0.5, -0.4],
  },

  // Bottom Row
  "iris-tower": {
    desktop: { bottom: "4%", left: "4%" },
    duration: 8.8,
    floatY: [0, 9, -10, 7, 0],
    floatX: [0, 6, -6, 5, 0],
    floatRotate: [0.6, -0.5, 0.7, -0.5, 0.6],
  },
  "blended-mesh": {
    desktop: { bottom: "3%", left: "24%" },
    duration: 8.3,
    floatY: [0, -8, 9, -5, 0],
    floatX: [0, 6, -6, 4, 0],
    floatRotate: [-0.4, 0.5, -0.5, 0.4, -0.4],
  },
  "kairo-looro": {
    desktop: { bottom: "3%", left: "44%" },
    duration: 8.0,
    floatY: [0, -10, 8, -5, 0],
    floatX: [0, 6, -5, 4, 0],
    floatRotate: [-0.4, 0.5, -0.5, 0.4, -0.4],
  },
  roboshore: {
    desktop: { bottom: "4%", right: "4%" },
    duration: 7.8,
    floatY: [0, -10, 8, -6, 0],
    floatX: [0, 7, -6, 5, 0],
    floatRotate: [0.4, -0.6, 0.5, -0.4, 0.4],
  },
  "kreuzberg-tower-to-daw": {
    desktop: { bottom: "4%", right: "24%" },
    duration: 8.4,
    floatY: [0, 8, -9, 6, 0],
    floatX: [0, -5, 6, -4, 0],
    floatRotate: [0.5, -0.6, 0.4, -0.5, 0.5],
  },
  "friedrichstrasse-to-daw": {
    desktop: { bottom: "4%", right: "44%" },
    duration: 7.9,
    floatY: [0, -9, 8, -5, 0],
    floatX: [0, 6, -5, 4, 0],
    floatRotate: [-0.4, 0.5, -0.6, 0.4, -0.4],
  },
  "unite-dhabitation-to-daw": {
    desktop: { top: "45%", left: "1%" },
    duration: 8.6,
    floatY: [0, 9, -7, 6, 0],
    floatX: [0, -6, 5, -4, 0],
    floatRotate: [0.4, -0.5, 0.6, -0.4, 0.4],
  },
  "james-simon-galerie-audio-path": {
    desktop: { top: "45%", right: "1%" },
    duration: 8.1,
    floatY: [0, -8, 9, -6, 0],
    floatX: [0, 5, -6, 5, 0],
    floatRotate: [-0.5, 0.4, -0.5, 0.6, -0.5],
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
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);

  // Clear category filter when clicking empty background space
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest(".project-floating-card") ||
        target.closest(".paule-cat-btn")
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
    if (isDraggingRef.current) return;
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
      className="relative w-full min-h-[calc(100vh-4.5rem)] h-auto lg:h-[calc(100vh-4.5rem)] lg:overflow-hidden flex flex-col justify-start lg:justify-center items-center bg-background text-foreground select-none font-heading cursor-default px-4 py-8 lg:p-0"
    >
      {/* Background Subtle Architectural Dot Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.06] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* ========================================================================= */}
      {/* MOBILE LAYOUT (< lg): Category List at Top + 3-Column Filtered Grid       */}
      {/* ========================================================================= */}
      <div className="lg:hidden w-full flex flex-col items-center z-10 max-w-lg mx-auto">
        {/* Category Filter Buttons */}
        <div className="flex flex-col items-center gap-3.5 text-center my-4 w-full">
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
        <motion.div
          layout
          className="grid grid-cols-3 gap-3 sm:gap-4 w-full mt-6 px-1"
        >
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
                {/* Pure Square Cover Image */}
                <div
                  className={`relative w-full aspect-square overflow-hidden dynamic-radius bg-muted/20 border border-border/70 group-hover:border-foreground/60 active:scale-95 transition-all ${
                    showShadows ? "shadow-sm group-hover:shadow-md" : "shadow-none"
                  }`}
                >
                  {project.coverImage?.url ? (
                    <img
                      src={project.coverImage.url}
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

                {/* Single Project Name Directly Underneath */}
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
      {/* DESKTOP LAYOUT (>= lg): Center Category Typography + Floating Canvas      */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex w-full h-full inset-0 absolute flex-col justify-center items-center">
        {/* Center Fixed Category Typography */}
        <div className="paule-container relative z-10 flex flex-col justify-center items-center gap-4 sm:gap-5 text-center my-6 lg:my-0 pointer-events-auto">
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

        {/* Floating Square Cover Images Layer (No Outer Rectangle Boundary) */}
        <div className="w-full absolute inset-0 z-20 pointer-events-none">
          {projects.map((project) => {
            const config = FLOATING_LAYOUT[project.slug] || {
              desktop: { top: "20%", left: "20%" },
              duration: 7,
              floatY: [0, -10, 6, -8, 0],
              floatX: [0, 6, -6, 4, 0],
              floatRotate: [0, 0.6, -0.6, 0],
            };

            const isFilteredActive = activeCategory && project.categories.includes(activeCategory);
            const isHovered = hoveredProjectId === project.id;

            // State styling:
            // 1. Filtered active: fully opaque (100%), full color (grayscale 0%)
            // 2. Default: half transparent (55%), B&W (grayscale 100%), full color & opaque on hover
            // 3. Non-matching filtered: dimmed (10%), grayscale
            let cardStateClass = "";
            if (activeCategory) {
              if (isFilteredActive) {
                cardStateClass = isHovered
                  ? "opacity-100 grayscale-0 z-40"
                  : "opacity-100 grayscale-0 z-30";
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
                dragConstraints={containerRef}
                dragElastic={0.2}
                dragMomentum={true}
                onDragStart={() => {
                  isDraggingRef.current = true;
                }}
                onDragEnd={() => {
                  setTimeout(() => {
                    isDraggingRef.current = false;
                  }, 150);
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
                  bottom: config.desktop.bottom,
                  left: config.desktop.left,
                  right: config.desktop.right,
                }}
                onMouseEnter={() => setHoveredProjectId(project.id)}
                onMouseLeave={() => setHoveredProjectId(null)}
                onClick={(e) => handleCardClick(e, project)}
                className={`project-floating-card pointer-events-auto cursor-grab active:cursor-grabbing absolute w-24 sm:w-26 lg:w-28 xl:w-30 flex flex-col items-center gap-1.5 transition-all duration-300 touch-none select-none ${cardStateClass}`}
              >
                {/* Pure Square Cover Image (50% smaller, no outer rectangular boundary) */}
                <div
                  className={`relative w-full aspect-square overflow-hidden dynamic-radius bg-muted/20 border border-border/70 hover:border-foreground/60 transition-colors pointer-events-none select-none ${shadowClass}`}
                  style={
                    {
                      userSelect: "none",
                      WebkitUserSelect: "none",
                    } as React.CSSProperties
                  }
                >
                  {project.coverImage?.url ? (
                    <img
                      src={project.coverImage.url}
                      alt={project.coverImage.alt || project.title}
                      draggable={false}
                      className="w-full h-full object-cover pointer-events-none select-none"
                      style={
                        {
                          userSelect: "none",
                          WebkitUserSelect: "none",
                        } as React.CSSProperties
                      }
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : null}
                </div>

                {/* Single Project Name Directly Underneath (Toggled) */}
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
    </div>
  );
};
