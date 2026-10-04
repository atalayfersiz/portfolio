"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Project, Category } from "@/types/portfolio";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

interface Props {
  projects: Project[];
  onSelectProject?: (project: Project) => void;
}

export const MinimalGridPreset: React.FC<Props> = ({ projects, onSelectProject }) => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const filteredProjects = projects.filter(
    (p) => activeCategory === "all" || p.categories.includes(activeCategory)
  );

  const handleCardClick = (project: Project) => {
    if (onSelectProject) {
      onSelectProject(project);
    } else {
      router.push(`/projects/${project.slug}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Category Filter Tabs */}
      <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-10 text-xs font-mono">
        <div className="flex items-center gap-6">
          {(["all", "selected", "academic", "professional", "explorations"] as Category[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`uppercase tracking-widest transition-colors ${
                activeCategory === cat
                  ? "text-foreground font-semibold underline underline-offset-4"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <span className="text-muted-foreground font-mono">
          {filteredProjects.length}
        </span>
      </div>

      {/* Project Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              key={project.id}
              onClick={() => handleCardClick(project)}
              className="group cursor-pointer flex flex-col gap-3"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted dynamic-radius border border-border/40">
                <Image
                  src={project.coverImage.url}
                  alt={project.coverImage.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-103"
                />
                <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-xs px-2 py-0.5 text-[10px] uppercase tracking-wider font-mono text-foreground border border-border/50 dynamic-radius">
                  {project.category}
                </div>
              </div>

              <div className="flex justify-between items-start pt-1">
                <div>
                  <h3 className="text-base font-light tracking-tight group-hover:text-muted-foreground transition-colors flex items-center gap-1">
                    {project.title}
                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[1.5] opacity-0 group-hover:opacity-100 transition-opacity text-foreground" />
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-1 font-mono">{project.subtitle}</p>
                </div>
                <span className="text-xs font-mono text-muted-foreground">{project.year}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
