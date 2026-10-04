import { SiteConfig } from "@/types/portfolio";

export const siteConfig: SiteConfig = {
  name: "Atalay Fersiz",
  shortName: "A.F.",
  title: "Architectural Portfolio",
  subtitle: "Exploring spatial tension, material tactility, and procedural form.",
  bio: "Architectural designer at Dilekci Architects (DDA), graduate of Yıldız Technical University (High Honour). Specializing in urban design, high-rise developments, environmental synthesis, and computational workflows.",
  activePreset: "paule-perron", // Default preset: 'paule-perron' | 'minimal-grid' | 'editorial' | 'fullscreen'
  availablePresets: [
    {
      id: "paule-perron",
      name: "Spatial Category Matrix (Paule Perron style)",
      description: "Interactive category text matrix revealing a 10x4 spatial project grid on selection.",
    },
    {
      id: "minimal-grid",
      name: "Minimal Grid",
      description: "Clean architectural grid layout with quick filter tabs.",
    },
    {
      id: "editorial",
      name: "Editorial / Magazine",
      description: "Typography-focused narrative layout highlighting competition awards and structural specs.",
    },
    {
      id: "fullscreen",
      name: "Fullscreen Showcase",
      description: "High-impact visual slider presentation highlighting renders and section drawings.",
    },
  ],
  socials: {
    email: "atalayfersiz@outlook.com",
    linkedin: "https://linkedin.com/in/atalayfersiz",
    instagram: "https://instagram.com",
  },
};
