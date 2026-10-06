"use client";

import React, { useState, useEffect } from "react";
import { siteConfig } from "@/config/portfolio.config";
import {
  contactInfo,
  educationData,
  experienceData,
  competitionsData,
  languagesData,
  softwareSkills,
} from "@/content/bio";
import Link from "next/link";
import { Header } from "@/components/core/Header";
import { ConfigDrawer } from "@/components/core/ConfigDrawer";
import { LayoutPreset } from "@/types/portfolio";
import { ArrowUpRight } from "lucide-react";
import { getAssetPath } from "@/utils/asset";

export default function AboutPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [edgeStyle, setEdgeStyle] = useState<"straight" | "curved">("straight");
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [activePreset, setActivePreset] = useState<LayoutPreset>("minimal-grid");

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

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      {/* Top Header */}
      <Header
        onOpenConfig={() => setIsConfigOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main Text-Only About Content (No Icons, No Buttons) */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full space-y-16">
        {/* Intro Header Section with Watercolor Painting */}
        <section className="border-b border-border/40 pb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl font-light tracking-tight uppercase">
                {siteConfig.name}
              </h1>
            </div>

            {/* Contact Information Text Line */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs font-mono text-muted-foreground pt-2">
              <span className="text-foreground">{contactInfo.location}</span>
              <span>•</span>
              <a
                href={`mailto:${contactInfo.email}`}
                className="hover:text-foreground transition-colors"
              >
                {contactInfo.email}
              </a>
            </div>
          </div>

          {/* Watercolor Painting Artwork (Original uncropped proportions, no border line) */}
          <div className="shrink-0 max-w-[280px] sm:max-w-[340px] md:max-w-[380px]">
            <img
              src={getAssetPath("/images/watercolor1.jpg")}
              alt="Atalay Fersiz Watercolor Artwork"
              className="w-full h-auto object-contain block"
            />
          </div>
        </section>

        {/* Education Section */}
        <section className="space-y-6">
          <div className="border-b border-border/40 pb-3">
            <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-foreground font-semibold">
              Education
            </h2>
          </div>

          <div className="space-y-8 font-mono text-xs">
            {educationData.map((edu, idx) => (
              <div key={idx} className="space-y-1.5 border-l border-border/40 pl-4 py-0.5">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <h3 className="text-sm font-sans font-medium text-foreground tracking-tight">
                    {edu.institution}
                  </h3>
                  <span className="text-muted-foreground text-[11px]">{edu.location}</span>
                </div>
                <div className="flex flex-wrap justify-between items-center text-muted-foreground text-xs">
                  <span className="text-foreground font-medium">{edu.degree} — {edu.department}</span>
                  {edu.gpa && (
                    <span className="text-foreground font-mono text-[11px] bg-muted px-2 py-0.5 border border-border/50 dynamic-radius">
                      {edu.gpa}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Work Experience Section */}
        <section className="space-y-6">
          <div className="border-b border-border/40 pb-3">
            <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-foreground font-semibold">
              Experience
            </h2>
          </div>

          <div className="space-y-10 font-mono text-xs">
            {experienceData.map((exp, idx) => (
              <div key={idx} className="space-y-3 border-l border-border/40 pl-4 py-0.5">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <div>
                    <h3 className="text-base font-sans font-medium text-foreground tracking-tight">
                      {exp.role}
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono">
                      {exp.company} • <span className="text-foreground">{exp.location}</span>
                    </p>
                  </div>
                  <span className="text-muted-foreground text-[11px] whitespace-nowrap">
                    {exp.period}
                  </span>
                </div>

                <ul className="space-y-1.5 text-xs text-muted-foreground font-light font-sans list-disc list-inside leading-relaxed">
                  {exp.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="text-foreground/85">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Competitions Section */}
        <section className="space-y-6">
          <div className="border-b border-border/40 pb-3">
            <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-foreground font-semibold">
              Competitions & Honors
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            {competitionsData.map((comp, idx) => {
              const cardContent = (
                <div className="p-4 border border-border/40 bg-muted/20 hover:bg-muted/30 hover:border-foreground/40 transition-all flex flex-col justify-between gap-3 dynamic-radius h-full group">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-sans font-medium text-foreground group-hover:text-foreground transition-colors">
                      {comp.title}
                    </h3>
                    {comp.projectSlug && (
                      <ArrowUpRight className="w-3.5 h-3.5 stroke-[1.5] text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                    )}
                  </div>
                  <div>
                    {comp.award ? (
                      <span className="text-[10px] uppercase tracking-wider text-foreground font-medium border border-border px-2 py-0.5 inline-block w-max bg-background dynamic-radius">
                        {comp.award}
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground inline-block">
                        Competition Entry
                      </span>
                    )}
                  </div>
                </div>
              );

              return comp.projectSlug ? (
                <Link key={idx} href={`/projects/${comp.projectSlug}`} className="block h-full">
                  {cardContent}
                </Link>
              ) : (
                <div key={idx} className="block h-full">
                  {cardContent}
                </div>
              );
            })}
          </div>
        </section>

        {/* Languages Section */}
        <section className="space-y-6">
          <div className="border-b border-border/40 pb-3">
            <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-foreground font-semibold">
              Languages
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            {languagesData.map((lang) => (
              <div
                key={lang.language}
                className="p-4 border border-border/40 dynamic-radius bg-muted/10 flex justify-between items-center"
              >
                <div>
                  <span className="text-foreground uppercase tracking-wider block font-semibold">
                    {lang.language}
                  </span>
                  {lang.detail && (
                    <span className="text-[10px] text-muted-foreground font-sans block pt-0.5">
                      {lang.detail}
                    </span>
                  )}
                </div>
                <span className="px-2.5 py-0.5 bg-background border border-border/50 text-foreground dynamic-radius font-medium text-[11px]">
                  {lang.level}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Software & Digital Tools Section */}
        <section className="space-y-6">
          <div className="border-b border-border/40 pb-3">
            <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-foreground font-semibold">
              Software & Digital Tools
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            <div className="space-y-3 p-4 border border-border/40 dynamic-radius bg-muted/10">
              <span className="text-foreground uppercase tracking-wider block font-semibold border-b border-border/40 pb-1">
                Advanced
              </span>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                {softwareSkills.advanced.map((tool) => (
                  <span
                    key={tool}
                    className="px-2 py-0.5 bg-background border border-border/50 text-foreground dynamic-radius"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3 p-4 border border-border/40 dynamic-radius bg-muted/10">
              <span className="text-foreground uppercase tracking-wider block font-semibold border-b border-border/40 pb-1">
                Intermediate
              </span>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                {softwareSkills.intermediate.map((tool) => (
                  <span
                    key={tool}
                    className="px-2 py-0.5 bg-background border border-border/50 text-muted-foreground dynamic-radius"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3 p-4 border border-border/40 dynamic-radius bg-muted/10">
              <span className="text-foreground uppercase tracking-wider block font-semibold border-b border-border/40 pb-1">
                Basic
              </span>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                {softwareSkills.basic.map((tool) => (
                  <span
                    key={tool}
                    className="px-2 py-0.5 bg-background border border-border/50 text-muted-foreground dynamic-radius"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Right Drawer Config */}
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

      {/* Footer */}
      <footer className="border-t border-border/40 py-6 px-6 text-[11px] font-mono text-muted-foreground bg-background">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <p>© {new Date().getFullYear()} {siteConfig.name}</p>
          <a
            href={`mailto:${contactInfo.email}`}
            className="hover:text-foreground transition-colors"
          >
            {contactInfo.email}
          </a>
        </div>
      </footer>
    </div>
  );
}
