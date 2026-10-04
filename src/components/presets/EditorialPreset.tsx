"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Project, Category } from "@/types/portfolio";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

interface Props {
  projects: Project[];
  onSelectProject?: (project: Project) => void;
}

export const EditorialPreset: React.FC<Props> = ({ projects, onSelectProject }) => {
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
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Category Navigation */}
      <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-16 text-xs font-mono">
        <div className="flex items-center gap-6">
          {(["all", "selected", "academic", "professional", "explorations"] as Category[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`uppercase tracking-widest transition-colors ${
                activeCategory === cat
                  ? "text-foreground font-semibold underline underline-offset-8"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <span className="text-muted-foreground font-mono">{filteredProjects.length}</span>
      </div>

      {/* Editorial Story Layout */}
      <div className="flex flex-col gap-24">
        {filteredProjects.map((project, idx) => {
          const isEven = idx % 2 === 0;

          return (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center border-b border-border/40 pb-20"
            >
              {/* Image Side */}
              <div
                className={`md:col-span-7 cursor-pointer group ${
                  isEven ? "md:order-1" : "md:order-2"
                }`}
                onClick={() => handleCardClick(project)}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-muted dynamic-radius border border-border/40">
                  <Image
                    src={project.coverImage.url}
                    alt={project.coverImage.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 60vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-103"
                  />
                </div>
              </div>

              {/* Story / Specs Side */}
              <div
                className={`md:col-span-5 flex flex-col gap-4 ${
                  isEven ? "md:order-2" : "md:order-1"
                }`}
              >
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  <span className="text-foreground font-medium">{project.category}</span>
                  <span>/</span>
                  <span>{project.year}</span>
                  {project.location && (
                    <>
                      <span>/</span>
                      <span>{project.location}</span>
                    </>
                  )}
                </div>

                <h3
                  onClick={() => handleCardClick(project)}
                  className="text-2xl font-light tracking-tight cursor-pointer hover:text-muted-foreground transition-colors"
                >
                  {project.title}
                </h3>

                <p className="text-xs leading-relaxed text-muted-foreground font-light">
                  {project.description}
                </p>

                {project.technicalSpecs && (
                  <div className="mt-2 py-3 border-y border-border/40 grid grid-cols-2 gap-2 text-[11px] font-mono">
                    {project.technicalSpecs.slice(0, 2).map((spec, i) => (
                      <div key={i}>
                        <span className="text-muted-foreground block text-[10px]">{spec.label}</span>
                        <span className="truncate block text-foreground font-medium">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => handleCardClick(project)}
                  className="mt-2 inline-flex items-center gap-2 text-xs uppercase tracking-widest font-mono text-foreground hover:gap-3 transition-all group cursor-pointer"
                >
                  <span>View Project</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[1.5] text-muted-foreground group-hover:text-foreground" />
                </button>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
};
