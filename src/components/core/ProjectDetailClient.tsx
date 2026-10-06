"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/types/portfolio";
import { Header } from "@/components/core/Header";
import { ConfigDrawer } from "@/components/core/ConfigDrawer";
import { siteConfig } from "@/config/portfolio.config";
import { ArrowLeft, ArrowUpRight, X, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [edgeStyle, setEdgeStyle] = useState<"straight" | "curved">("straight");
  const [activePreset, setActivePreset] = useState(siteConfig.activePreset);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);

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

  // Keyboard navigation for Lightbox
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

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      {/* Top Header */}
      <Header
        onOpenConfig={() => setIsConfigOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main Content Presentation */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12">
        {/* Back link & Top Breadcrumb */}
        <div className="flex items-center justify-between mb-10 pb-4 border-b border-border text-xs font-mono">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
          >
            <ArrowLeft className="w-3.5 h-3.5 stroke-[1.5]" />
            <span>back to works</span>
          </Link>
          <div className="flex items-center gap-3 text-muted-foreground uppercase tracking-widest">
            <span className="text-foreground font-medium">{project.category}</span>
            <span>•</span>
            <span>{project.year}</span>
            {project.location && (
              <>
                <span>•</span>
                <span className="hidden sm:inline">{project.location}</span>
              </>
            )}
          </div>
        </div>

        {/* Hero Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight uppercase mb-4">
            {project.title}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground font-light max-w-3xl leading-relaxed">
            {project.subtitle}
          </p>
        </motion.div>

        {/* Specs & Narrative Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 border-b border-border pb-14 mb-16">
          {/* Technical Specs Column */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-4 flex flex-col gap-4"
          >
            {project.technicalSpecs && (
              <div className="divide-y divide-border font-mono text-xs border-t border-border">
                {project.technicalSpecs.map((spec, idx) => (
                  <div key={idx} className="py-2.5 flex justify-between gap-4">
                    <span className="text-muted-foreground uppercase">{spec.label}</span>
                    <span className="text-foreground font-medium text-right">{spec.value}</span>
                  </div>
                ))}
                {project.instagramReelUrl && (
                  <div className="py-2.5 flex justify-between gap-4 items-center">
                    <span className="text-muted-foreground uppercase">Instagram</span>
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

          {/* Narrative Column */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-8 flex flex-col gap-4"
          >
            <div className="space-y-4 text-sm sm:text-base leading-relaxed text-foreground font-light">
              <p className="leading-relaxed">
                {project.description}
              </p>
              {project.fullStory && (
                <p className="text-muted-foreground leading-relaxed">
                  {project.fullStory}
                </p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Instagram Reel Embedded Video Section */}
        {project.instagramEmbedUrl && (
          <section className="mb-20 flex flex-col items-center">
            <div className="w-full max-w-md bg-card/60 backdrop-blur-xs border border-border/80 dynamic-radius p-3 sm:p-5 shadow-sm">
              <div className="relative w-full aspect-[9/16] max-h-[620px] rounded overflow-hidden bg-muted/20 border border-border/60">
                <iframe
                  src={`${project.instagramEmbedUrl}`}
                  className="w-full h-full border-0"
                  allowFullScreen
                  allow="encrypted-media"
                  title={`${project.title} Instagram Reel`}
                />
              </div>
              <div className="mt-3.5 flex items-center justify-between text-xs font-mono">
                <span className="text-muted-foreground">@atalay.zip</span>
                <a
                  href={project.instagramReelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-foreground hover:underline underline-offset-4"
                >
                  <span>Open on Instagram</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </section>
        )}

        {/* Full Vertical Continuous Presentation (Downward Flow, Clickable Zoom Images & Videos) */}
        {project.gallery && project.gallery.length > 0 && !project.instagramEmbedUrl && (
          <section className="mb-24 space-y-12">
            <div className="flex flex-col gap-12 sm:gap-16">
              {project.gallery.map((item, idx) => {
                const isVideo = item.url.toLowerCase().endsWith(".mp4");
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.4 }}
                    onClick={() => {
                      setSlideDirection(1);
                      setLightboxIndex(idx);
                    }}
                    className={`w-full overflow-hidden bg-muted/10 dynamic-radius border border-border/80 hover:border-foreground/40 transition-colors shadow-xs group relative ${
                      isVideo ? "cursor-pointer" : "cursor-zoom-in"
                    }`}
                    title={isVideo ? "Click to view fullscreen video" : "Click to enlarge"}
                  >
                    {isVideo ? (
                      <video
                        src={getAssetPath(item.url)}
                        autoPlay
                        loop
                        muted
                        playsInline
                        controls
                        className="w-full h-auto block object-contain"
                      />
                    ) : (
                      <img
                        src={getAssetPath(item.url)}
                        alt={item.alt || `${project.title} Drawing ${idx + 1}`}
                        loading={idx === 0 ? "eager" : "lazy"}
                        className="w-full h-auto block object-contain transition-opacity duration-300"
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* Other Projects Section */}
        <section className="pt-12 border-t border-border">
          <div className="flex items-center justify-between mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-foreground font-medium">
              Other Projects
            </span>
            <Link
              href="/"
              className="text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <span>View all projects</span>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[1.5]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherProjects.map((other) => (
              <Link
                key={other.id}
                href={`/projects/${other.slug}`}
                className="group flex flex-col gap-3 p-3 bg-muted/20 border border-border hover:border-foreground/40 transition-all duration-300 dynamic-radius"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted dynamic-radius border border-border">
                  <img
                    src={getAssetPath(other.coverImage.url)}
                    alt={other.coverImage.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-background/90 backdrop-blur-xs px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider text-foreground border border-border dynamic-radius">
                    {other.category}
                  </div>
                </div>

                <div className="flex justify-between items-start pt-1">
                  <div>
                    <h3 className="text-xs font-medium tracking-tight group-hover:text-muted-foreground transition-colors flex items-center gap-1 uppercase">
                      {other.title}
                      <ArrowUpRight className="w-3 h-3 stroke-[1.5] opacity-0 group-hover:opacity-100 transition-opacity text-foreground" />
                    </h3>
                    <p className="text-[10px] text-muted-foreground line-clamp-1 font-mono mt-0.5">
                      {other.subtitle}
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground">{other.year}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Fullscreen High-Resolution Image Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && project.gallery && project.gallery[lightboxIndex] && (
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
                [{lightboxIndex + 1} / {project.gallery.length}]
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
            {project.gallery.length > 1 && (
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
            {project.gallery.length > 1 && (
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

            {/* Sliding Image / Video Container */}
            <div className="relative max-w-[92vw] max-h-[86vh] flex items-center justify-center cursor-default">
              <AnimatePresence initial={false} custom={slideDirection} mode="wait">
                <motion.div
                  key={lightboxIndex}
                  custom={slideDirection}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  drag={!project.gallery[lightboxIndex].url.toLowerCase().endsWith(".mp4") ? "x" : false}
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
                  {project.gallery[lightboxIndex].url.toLowerCase().endsWith(".mp4") ? (
                    <video
                      src={getAssetPath(project.gallery[lightboxIndex].url)}
                      autoPlay
                      loop
                      muted
                      playsInline
                      controls
                      className="max-w-[92vw] max-h-[86vh] w-auto h-auto object-contain rounded-xs shadow-2xl"
                    />
                  ) : (
                    <img
                      src={getAssetPath(project.gallery[lightboxIndex].url)}
                      alt={project.gallery[lightboxIndex].alt || project.title}
                      draggable={false}
                      className="max-w-[92vw] max-h-[86vh] w-auto h-auto object-contain rounded-xs shadow-2xl pointer-events-none select-none"
                    />
                  )}
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

      {/* Minimal Footer */}
      <footer className="border-t border-border py-6 px-6 text-[11px] font-mono text-muted-foreground bg-background mt-20">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <p>© {new Date().getFullYear()} {siteConfig.name}</p>
          <button
            onClick={() => setIsConfigOpen(true)}
            className="hover:text-foreground transition-colors cursor-pointer"
          >
            settings
          </button>
        </div>
      </footer>
    </div>
  );
}
