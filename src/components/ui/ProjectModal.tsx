"use client";

import React, { useEffect } from "react";
import { Project } from "@/types/portfolio";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";

interface Props {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<Props> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs overflow-hidden">
        {/* Backdrop click */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        {/* Modal Drawer */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-background text-foreground h-full overflow-y-auto shadow-2xl z-10 border-l border-border flex flex-col"
        >
          {/* Header */}
          <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-md px-8 py-5 border-b border-border flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              {project.category} / {project.year}
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4 stroke-[1.5]" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8 flex-1">
            {/* Title & Subtitle */}
            <div>
              <h2 className="text-3xl font-light tracking-tight mb-2">
                {project.title}
              </h2>
              <p className="text-xs font-mono text-muted-foreground">{project.subtitle}</p>
            </div>

            {/* Metadata Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 border-y border-border text-xs font-mono">
              <div>
                <span className="text-muted-foreground block text-[10px]">YEAR</span>
                <span className="font-medium text-foreground">{project.year}</span>
              </div>
              {project.location && (
                <div>
                  <span className="text-muted-foreground block text-[10px]">LOCATION</span>
                  <span className="font-medium text-foreground">{project.location}</span>
                </div>
              )}
              {project.architecturalScale && (
                <div>
                  <span className="text-muted-foreground block text-[10px]">SCALE</span>
                  <span className="font-medium text-foreground">{project.architecturalScale}</span>
                </div>
              )}
            </div>

            {/* Cover Image */}
            <div className="relative aspect-[16/10] overflow-hidden bg-muted dynamic-radius border border-border/40">
              <Image
                src={project.coverImage.url}
                alt={project.coverImage.alt}
                fill
                className="object-cover"
              />
            </div>

            {/* Story */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                Overview
              </h3>
              <p className="text-xs leading-relaxed text-foreground font-light">
                {project.description}
              </p>
              {project.fullStory && (
                <p className="text-xs leading-relaxed text-muted-foreground font-light">
                  {project.fullStory}
                </p>
              )}
            </div>

            {/* Technical Specifications */}
            {project.technicalSpecs && (
              <div className="space-y-3 pt-4 border-t border-border">
                <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  Specifications
                </h3>
                <div className="border border-border p-4 space-y-2.5 dynamic-radius bg-muted/10">
                  {project.technicalSpecs.map((spec, i) => (
                    <div key={i} className="flex justify-between items-baseline text-xs font-mono">
                      <span className="text-muted-foreground">{spec.label}</span>
                      <span className="font-medium text-right text-foreground">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery Images */}
            {project.gallery.length > 0 && (
              <div className="space-y-6 pt-4 border-t border-border">
                <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  Media & Drawings
                </h3>
                <div className="space-y-6">
                  {project.gallery.map((img, i) => (
                    <div key={i} className="space-y-2">
                      <div className="relative aspect-[16/10] overflow-hidden bg-muted dynamic-radius border border-border/40">
                        <Image
                          src={img.url}
                          alt={img.alt}
                          fill
                          className="object-cover"
                        />
                      </div>
                      {img.caption && (
                        <p className="text-[11px] text-muted-foreground font-mono">{img.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-6 border-t border-border">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono px-2 py-0.5 border border-border text-muted-foreground uppercase tracking-wider dynamic-radius"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
