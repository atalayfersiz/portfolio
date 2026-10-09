"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/types/portfolio";
import { Header } from "@/components/core/Header";
import { ConfigDrawer } from "@/components/core/ConfigDrawer";
import { siteConfig } from "@/config/portfolio.config";
import {
  ArrowLeft,
  ArrowUpRight,
  X,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Play,
  Film,
} from "lucide-react";
import { getAssetPath } from "@/utils/asset";

interface Props {
  project: Project;
  otherProjects: Project[];
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 240 : -240,
    opacity: 0,
    scale: 0.98,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: "spring", stiffness: 350, damping: 32 },
      opacity: { duration: 0.18 },
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 240 : -240,
    opacity: 0,
    scale: 0.98,
    transition: {
      x: { type: "spring", stiffness: 350, damping: 32 },
      opacity: { duration: 0.18 },
    },
  }),
};

export default function ProjectDetailClient({ project, otherProjects }: Props) {
  const router = useRouter();
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [edgeStyle, setEdgeStyle] = useState<"straight" | "curved">("straight");
  const [activePreset, setActivePreset] = useState(siteConfig.activePreset);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
  const [isPanning, setIsPanning] = useState(false);

  // Dragging detection to prevent opening lightbox when dragging cards
  const isDraggingCardRef = useRef<boolean>(false);

  // Canvas Viewport and Physics Engine
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const targetTransformRef = useRef<{ x: number; y: number; scale: number }>({
    x: 40,
    y: 30,
    scale: 0.85,
  });

  const currentTransformRef = useRef<{ x: number; y: number; scale: number }>({
    x: 40,
    y: 30,
    scale: 0.85,
  });

  const animFrameRef = useRef<number | null>(null);
  const panStartRef = useRef<{
    startX: number;
    startY: number;
    initX: number;
    initY: number;
  }>({
    startX: 0,
    startY: 0,
    initX: 40,
    initY: 30,
  });

  // Apply CSS custom property for edge geometry
  useEffect(() => {
    const radiusValue = edgeStyle === "curved" ? "8px" : "0px";
    document.documentElement.style.setProperty("--radius", radiusValue);
  }, [edgeStyle]);

  // Lock background body scroll when Lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxIndex]);

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

  // Smooth lerp loop for 60/120fps physics
  const updateTransform = useCallback(() => {
    const target = targetTransformRef.current;
    const current = currentTransformRef.current;

    const lerpFactor = 0.18;
    const dx = target.x - current.x;
    const dy = target.y - current.y;
    const ds = target.scale - current.scale;

    const isSettled =
      Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05 && Math.abs(ds) < 0.0005;

    if (isSettled) {
      current.x = target.x;
      current.y = target.y;
      current.scale = target.scale;
    } else {
      current.x += dx * lerpFactor;
      current.y += dy * lerpFactor;
      current.scale += ds * lerpFactor;
    }

    if (canvasRef.current) {
      canvasRef.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) scale(${current.scale})`;
    }

    if (!isSettled) {
      animFrameRef.current = requestAnimationFrame(updateTransform);
    } else {
      animFrameRef.current = null;
    }
  }, []);

  const triggerAnimation = useCallback(() => {
    if (!animFrameRef.current) {
      animFrameRef.current = requestAnimationFrame(updateTransform);
    }
  }, [updateTransform]);

  // Cursor-Anchored Smooth Wheel Zoom Handler (Range: 0.25 to 1.25)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      let zoomFactor: number;
      if (Math.abs(e.deltaY) >= 50) {
        zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
      } else {
        zoomFactor = Math.exp(-e.deltaY * 0.0035);
      }

      const target = targetTransformRef.current;
      const newScale = Math.min(Math.max(target.scale * zoomFactor, 0.25), 1.25);

      if (Math.abs(newScale - target.scale) < 0.0001) return;

      const ratio = newScale / target.scale;
      target.x = mouseX - (mouseX - target.x) * ratio;
      target.y = mouseY - (mouseY - target.y) * ratio;
      target.scale = newScale;

      triggerAnimation();
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [triggerAnimation]);

  // Mouse drag panning on canvas background
  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest(".board-card") ||
      target.closest(".board-hud") ||
      target.closest("button") ||
      target.closest("a")
    ) {
      return;
    }

    setIsPanning(true);
    panStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: currentTransformRef.current.x,
      initY: currentTransformRef.current.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    const dx = e.clientX - panStartRef.current.startX;
    const dy = e.clientY - panStartRef.current.startY;

    const nextX = panStartRef.current.initX + dx;
    const nextY = panStartRef.current.initY + dy;

    targetTransformRef.current.x = nextX;
    targetTransformRef.current.y = nextY;
    currentTransformRef.current.x = nextX;
    currentTransformRef.current.y = nextY;

    if (canvasRef.current) {
      canvasRef.current.style.transform = `translate3d(${nextX}px, ${nextY}px, 0) scale(${currentTransformRef.current.scale})`;
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Reset zoom & pan to default
  const handleResetView = () => {
    targetTransformRef.current = { x: 40, y: 30, scale: 0.85 };
    triggerAnimation();
  };

  const handleZoomIn = () => {
    const target = targetTransformRef.current;
    target.scale = Math.min(target.scale * 1.25, 1.25);
    triggerAnimation();
  };

  const handleZoomOut = () => {
    const target = targetTransformRef.current;
    target.scale = Math.max(target.scale * 0.8, 0.25);
    triggerAnimation();
  };

  // Lightbox handlers
  const handleNext = () => {
    if (project.gallery && project.gallery.length > 1) {
      setSlideDirection(1);
      setLightboxIndex((prev) =>
        prev !== null ? (prev + 1) % project.gallery.length : 0
      );
    }
  };

  const handlePrev = () => {
    if (project.gallery && project.gallery.length > 1) {
      setSlideDirection(-1);
      setLightboxIndex((prev) =>
        prev !== null
          ? (prev - 1 + project.gallery.length) % project.gallery.length
          : 0
      );
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") {
        setLightboxIndex(null);
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, project.gallery]);

  // Spatial placement calculation for gallery items
  const galleryItems = project.gallery || [];
  const galleryCount = galleryItems.length;

  // Compute number of columns for spatial board grid
  let numCols = 2;
  if (galleryCount >= 20) {
    numCols = 5;
  } else if (galleryCount >= 10) {
    numCols = 4;
  } else if (galleryCount >= 5) {
    numCols = 3;
  }

  const cardWidth = 460;
  const gapX = 36;
  const gapY = 36;
  const startX = 640; // Starts to the right of the main text block

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-background text-foreground transition-colors duration-300 select-none">
      {/* Top Header */}
      <Header
        onOpenConfig={() => setIsConfigOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main Miro Board Canvas Viewport */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`flex-1 relative w-full h-[calc(100vh-4rem)] overflow-hidden bg-background text-foreground touch-none ${
          isPanning ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        {/* Spatial Canvas World Container */}
        <div
          ref={canvasRef}
          className="w-full h-full absolute inset-0 will-change-transform"
          style={{
            transform: `translate3d(40px, 30px, 0) scale(0.85)`,
            transformOrigin: "0 0",
          }}
        >
          {/* Dot Grid Background Layer */}
          <div
            className="absolute pointer-events-none opacity-[0.04] dark:opacity-[0.08]"
            style={{
              top: "-200%",
              left: "-200%",
              width: "600%",
              height: "600%",
              backgroundImage: "radial-gradient(currentColor 1.2px, transparent 1.2px)",
              backgroundSize: "32px 32px",
            }}
          />

          {/* ========================================================================= */}
          {/* 1. PROJECT NARRATIVE & SPECS CARD (MAIN TEXT BLOCK RECTANGLE)             */}
          {/* ========================================================================= */}
          <motion.div
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              position: "absolute",
              top: 50,
              left: 50,
              width: 540,
            }}
            className="board-card pointer-events-auto cursor-grab active:cursor-grabbing bg-card/92 backdrop-blur-md border border-border/80 dynamic-radius shadow-xl hover:shadow-2xl transition-shadow p-7 sm:p-8 flex flex-col gap-6 z-20 select-text"
          >
            {/* Top Navigation & Meta Header */}
            <div className="flex items-center justify-between border-b border-border/60 pb-3.5 text-xs font-mono">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest pointer-events-auto"
              >
                <ArrowLeft className="w-3.5 h-3.5 stroke-[1.5]" />
                <span>back to works</span>
              </Link>
              <div className="flex items-center gap-2 text-muted-foreground uppercase tracking-widest text-[11px]">
                <span className="text-foreground font-semibold px-2 py-0.5 border border-border dynamic-radius bg-muted/20">
                  {project.category}
                </span>
                <span>•</span>
                <span>{project.year}</span>
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-light tracking-tight uppercase text-foreground leading-tight">
                {project.title}
              </h1>
              <p className="text-sm font-light text-muted-foreground leading-relaxed">
                {project.subtitle}
              </p>
            </div>

            {/* Narrative Description */}
            <div className="space-y-3.5 text-xs sm:text-[13px] leading-relaxed text-foreground font-light border-t border-border/50 pt-4">
              <p>{project.description}</p>
              {project.fullStory && (
                <p className="text-muted-foreground leading-relaxed">
                  {project.fullStory}
                </p>
              )}
            </div>

            {/* Technical Specifications */}
            {project.technicalSpecs && project.technicalSpecs.length > 0 && (
              <div className="border-t border-border/60 pt-4 divide-y divide-border/40 font-mono text-[11px]">
                {project.technicalSpecs.map((spec, idx) => (
                  <div key={idx} className="py-2 flex justify-between gap-4">
                    <span className="text-muted-foreground uppercase">
                      {spec.label}
                    </span>
                    <span className="text-foreground font-medium text-right">
                      {spec.value}
                    </span>
                  </div>
                ))}
                {project.location && (
                  <div className="py-2 flex justify-between gap-4">
                    <span className="text-muted-foreground uppercase">
                      Location
                    </span>
                    <span className="text-foreground font-medium text-right">
                      {project.location}
                    </span>
                  </div>
                )}
                {project.instagramReelUrl && (
                  <div className="py-2 flex justify-between gap-4 items-center">
                    <span className="text-muted-foreground uppercase">
                      Instagram
                    </span>
                    <a
                      href={project.instagramReelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground hover:underline font-medium inline-flex items-center gap-1"
                    >
                      <span>Watch Reel</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* ========================================================================= */}
          {/* 2. INSTAGRAM REEL EMBED CARD (IF AVAILABLE)                               */}
          {/* ========================================================================= */}
          {project.instagramEmbedUrl && (
            <motion.div
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              style={{
                position: "absolute",
                top: 50,
                left: startX,
                width: 380,
              }}
              className="board-card pointer-events-auto cursor-grab active:cursor-grabbing bg-card/90 backdrop-blur-md border border-border/80 dynamic-radius shadow-xl p-4 flex flex-col gap-3 z-20"
            >
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground uppercase pb-1 border-b border-border/40">
                <span className="flex items-center gap-1.5 text-foreground font-medium">
                  <Film className="w-3.5 h-3.5 stroke-[1.5]" />
                  <span>Instagram Reel</span>
                </span>
                <span>@atalay.zip</span>
              </div>
              <div className="relative w-full aspect-[9/16] rounded overflow-hidden bg-black border border-border/60">
                <iframe
                  src={`${project.instagramEmbedUrl}`}
                  className="w-full h-full border-0"
                  allowFullScreen
                  allow="encrypted-media"
                  title={`${project.title} Instagram Reel`}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono pt-1">
                <span className="text-muted-foreground">{project.title}</span>
                <a
                  href={project.instagramReelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-foreground hover:underline font-medium"
                >
                  <span>Open Reel</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* 3. GALLERY MEDIA RECTANGLES (DRAGGABLE MOODBOARD TILES)                   */}
          {/* ========================================================================= */}
          {galleryItems.map((item, idx) => {
            const isVideo = item.url.toLowerCase().endsWith(".mp4");
            const col = idx % numCols;
            const row = Math.floor(idx / numCols);

            // Shift gallery right if Instagram embed exists in first position
            const offsetStartX = project.instagramEmbedUrl ? startX + 420 : startX;
            const cardX = offsetStartX + col * (cardWidth + gapX);
            // Slight organic stagger per column for an artistic Miro pinboard aesthetic
            const staggerY = (col % 2 === 1 ? 28 : 0);
            const cardY = 50 + row * (380 + gapY) + staggerY;

            return (
              <motion.div
                key={idx}
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
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, delay: Math.min(idx * 0.03, 0.5) }}
                style={{
                  position: "absolute",
                  top: cardY,
                  left: cardX,
                  width: cardWidth,
                }}
                onClick={() => {
                  if (!isDraggingCardRef.current && !isVideo) {
                    setSlideDirection(1);
                    setLightboxIndex(idx);
                  }
                }}
                className={`board-card pointer-events-auto cursor-grab active:cursor-grabbing bg-card/90 backdrop-blur-md border border-border/80 hover:border-foreground/50 dynamic-radius shadow-lg hover:shadow-2xl transition-all duration-300 p-3 flex flex-col gap-2.5 z-10 hover:z-30 group ${
                  !isVideo ? "hover:scale-[1.01]" : ""
                }`}
              >
                {/* Media Container */}
                <div className="relative w-full aspect-[4/3] bg-muted/30 overflow-hidden dynamic-radius border border-border/50 flex items-center justify-center">
                  {isVideo ? (
                    <video
                      src={getAssetPath(item.url)}
                      autoPlay
                      loop
                      muted
                      playsInline
                      controls
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <>
                      <img
                        src={getAssetPath(item.url)}
                        alt={item.alt || `${project.title} Drawing ${idx + 1}`}
                        loading={idx < 4 ? "eager" : "lazy"}
                        draggable={false}
                        className="w-full h-full object-contain pointer-events-none select-none transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                      {/* Zoom Indicator Icon on Hover */}
                      <div className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-background/80 backdrop-blur-xs border border-border/60 text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="w-3.5 h-3.5 stroke-[1.5]" />
                      </div>
                    </>
                  )}
                </div>

                {/* Card Meta Caption / Drawing Label */}
                <div className="flex items-center justify-between px-1 text-[11px] font-mono text-muted-foreground">
                  <span className="truncate max-w-[340px] uppercase">
                    {item.alt || item.caption || `Drawing ${idx + 1}`}
                  </span>
                  <span className="text-[10px] font-mono opacity-60">
                    [{idx + 1}/{galleryCount}]
                  </span>
                </div>
              </motion.div>
            );
          })}

          {/* ========================================================================= */}
          {/* 4. OTHER PROJECTS QUICK SWITCHER CARD                                     */}
          {/* ========================================================================= */}
          {otherProjects && otherProjects.length > 0 && (
            <motion.div
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              style={{
                position: "absolute",
                top: 50 + (project.technicalSpecs ? 680 : 540),
                left: 50,
                width: 540,
              }}
              className="board-card pointer-events-auto cursor-grab active:cursor-grabbing bg-card/90 backdrop-blur-md border border-border/80 dynamic-radius shadow-xl p-6 flex flex-col gap-4 z-20"
            >
              <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
                <span className="text-xs font-mono uppercase tracking-widest text-foreground font-medium">
                  Other Projects
                </span>
                <Link
                  href="/"
                  className="text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 pointer-events-auto"
                >
                  <span>All Works</span>
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[1.5]" />
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {otherProjects.slice(0, 3).map((other) => (
                  <Link
                    key={other.id}
                    href={`/projects/${other.slug}`}
                    className="group flex flex-col gap-2 p-2 bg-muted/20 border border-border/60 hover:border-foreground/40 transition-colors dynamic-radius pointer-events-auto"
                  >
                    <div className="relative aspect-square w-full overflow-hidden bg-muted dynamic-radius border border-border/50">
                      <img
                        src={getAssetPath(other.coverImage.url)}
                        alt={other.coverImage.alt}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="px-0.5">
                      <h4 className="text-[10px] font-medium tracking-tight uppercase truncate text-foreground group-hover:text-muted-foreground transition-colors">
                        {other.title}
                      </h4>
                      <p className="text-[9px] font-mono text-muted-foreground truncate">
                        {other.year}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* FLOATING BOARD HUD (BOTTOM CONTROLS & BREADCRUMBS)                        */}
        {/* ========================================================================= */}
        <div className="board-hud absolute bottom-5 left-6 right-6 flex items-center justify-between pointer-events-none z-30">
          {/* Left Breadcrumb Badge */}
          <div className="pointer-events-auto flex items-center gap-3 bg-card/85 backdrop-blur-md border border-border/80 px-4 py-2 dynamic-radius shadow-md text-xs font-mono uppercase tracking-widest">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3 h-3 stroke-[1.5]" />
              <span>Works</span>
            </Link>
            <span className="text-border">/</span>
            <span className="text-foreground font-semibold truncate max-w-[200px] sm:max-w-xs">
              {project.title}
            </span>
            <span className="text-muted-foreground text-[10px]">
              ({galleryCount} {galleryCount === 1 ? "card" : "cards"})
            </span>
          </div>

          {/* Right Navigation & Zoom Controls */}
          <div className="pointer-events-auto flex items-center gap-1.5 bg-card/85 backdrop-blur-md border border-border/80 p-1.5 dynamic-radius shadow-md text-xs font-mono">
            <button
              onClick={handleZoomIn}
              aria-label="Zoom in"
              className="p-1.5 rounded-sm hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5 stroke-[1.75]" />
            </button>
            <button
              onClick={handleZoomOut}
              aria-label="Zoom out"
              className="p-1.5 rounded-sm hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5 stroke-[1.75]" />
            </button>
            <div className="h-4 w-[1px] bg-border/80 mx-1" />
            <button
              onClick={handleResetView}
              aria-label="Reset zoom & position"
              className="flex items-center gap-1 px-2.5 py-1 rounded-sm hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer uppercase tracking-wider text-[11px]"
              title="Reset View (Fit)"
            >
              <RotateCcw className="w-3 h-3 stroke-[1.75]" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FULLSCREEN HIGH-RESOLUTION LIGHTBOX MODAL                                 */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {lightboxIndex !== null &&
          galleryItems[lightboxIndex] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/94 backdrop-blur-md cursor-zoom-out select-none p-4 sm:p-6"
              onClick={() => setLightboxIndex(null)}
            >
              {/* Top Bar Indicator & Close Button */}
              <div
                className="absolute top-4 left-6 right-6 flex items-center justify-between z-50 text-white/80 text-xs font-mono uppercase tracking-widest pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="bg-black/60 px-2.5 py-1 rounded border border-white/15">
                  [{lightboxIndex + 1} / {galleryCount}]
                </span>
                <button
                  onClick={() => setLightboxIndex(null)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/25 text-white border border-white/20 transition-all cursor-pointer shadow-lg"
                  title="Close (Esc or click background)"
                >
                  <span>close</span>
                  <X className="w-3.5 h-3.5 stroke-[2]" />
                </button>
              </div>

              {/* Left Navigation Arrow */}
              {galleryCount > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-black/60 hover:bg-white hover:text-black text-white border border-white/20 transition-all cursor-pointer shadow-xl active:scale-95"
                  title="Previous drawing (Left Arrow)"
                >
                  <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                </button>
              )}

              {/* Right Navigation Arrow */}
              {galleryCount > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-black/60 hover:bg-white hover:text-black text-white border border-white/20 transition-all cursor-pointer shadow-xl active:scale-95"
                  title="Next drawing (Right Arrow)"
                >
                  <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                </button>
              )}

              {/* Sliding Image Container */}
              <div className="relative max-w-[92vw] max-h-[86vh] flex items-center justify-center cursor-default">
                <AnimatePresence
                  initial={false}
                  custom={slideDirection}
                  mode="wait"
                >
                  <motion.div
                    key={lightboxIndex}
                    custom={slideDirection}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    drag={
                      !galleryItems[lightboxIndex].url
                        .toLowerCase()
                        .endsWith(".mp4")
                        ? "x"
                        : false
                    }
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.4}
                    onDragEnd={(e, { offset, velocity }) => {
                      if (offset.x < -50 || velocity.x < -250) {
                        handleNext();
                      } else if (offset.x > 50 || velocity.x > 250) {
                        handlePrev();
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="max-w-[92vw] max-h-[86vh] flex items-center justify-center cursor-grab active:cursor-grabbing touch-none select-none"
                  >
                    <img
                      src={getAssetPath(galleryItems[lightboxIndex].url)}
                      alt={
                        galleryItems[lightboxIndex].alt || project.title
                      }
                      draggable={false}
                      className="max-w-[92vw] max-h-[86vh] w-auto h-auto object-contain rounded-xs shadow-2xl pointer-events-none select-none"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
      </AnimatePresence>

      {/* Config Drawer */}
      <ConfigDrawer
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        activePreset={activePreset}
        onPresetChange={setActivePreset}
        edgeStyle={edgeStyle}
        onEdgeStyleChange={setEdgeStyle}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />
    </div>
  );
}
