"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Project } from "@/types/portfolio";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface Props {
  projects: Project[];
  onSelectProject?: (project: Project) => void;
}

export const FullscreenPreset: React.FC<Props> = ({ projects, onSelectProject }) => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const current = projects[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const handleCardClick = (project: Project) => {
    if (onSelectProject) {
      onSelectProject(project);
    } else {
      router.push(`/projects/${project.slug}`);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden bg-background text-foreground flex flex-col justify-between">
      {/* Background Image Carousel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={current.coverImage.url}
            alt={current.coverImage.alt}
            fill
            priority
            className="object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-background/40" />
        </motion.div>
      </AnimatePresence>

      {/* Top Indicator */}
      <div className="relative z-10 p-6 flex justify-between items-center text-xs font-mono uppercase tracking-widest">
        <span className="bg-background/80 backdrop-blur-xs px-3 py-1 border border-border/50 dynamic-radius">
          {currentIndex + 1} / {projects.length} — {current.category}
        </span>
        <button
          onClick={() => handleCardClick(current)}
          className="bg-background/80 hover:bg-background backdrop-blur-xs px-4 py-1.5 border border-border/50 text-foreground transition-all dynamic-radius cursor-pointer"
        >
          View Project
        </button>
      </div>

      {/* Center Navigation Controls */}
      <div className="relative z-10 px-6 flex justify-between items-center pointer-events-none">
        <button
          onClick={handlePrev}
          className="pointer-events-auto p-3 bg-background/80 hover:bg-background backdrop-blur-xs border border-border/50 text-foreground transition-all dynamic-radius cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 stroke-[1.5]" />
        </button>
        <button
          onClick={handleNext}
          className="pointer-events-auto p-3 bg-background/80 hover:bg-background backdrop-blur-xs border border-border/50 text-foreground transition-all dynamic-radius cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 stroke-[1.5]" />
        </button>
      </div>

      {/* Bottom Content Bar */}
      <div className="relative z-10 p-8 max-w-4xl">
        <motion.div
          key={current.id + "-info"}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest block mb-1">
            {current.year} — {current.location || current.medium}
          </span>
          <h2
            onClick={() => handleCardClick(current)}
            className="text-3xl sm:text-4xl font-light tracking-tight cursor-pointer hover:text-muted-foreground transition-colors mb-2 uppercase"
          >
            {current.title}
          </h2>
          <p className="text-xs text-muted-foreground line-clamp-2 max-w-2xl font-light">
            {current.description}
          </p>
        </motion.div>
      </div>
    </div>
  );
};
