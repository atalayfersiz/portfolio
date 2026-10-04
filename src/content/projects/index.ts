import { Project, Category } from "@/types/portfolio";
import { academicProjects } from "./academic";
import { professionalProjects } from "./professional";
import { explorationProjects } from "./explorations";

export { academicProjects } from "./academic";
export { professionalProjects } from "./professional";
export { explorationProjects } from "./explorations";

export const sampleProjects: Project[] = [
  ...academicProjects,
  ...professionalProjects,
  ...explorationProjects,
];

export const CATEGORY_DEFINITIONS: { id: Category; label: string; description?: string }[] = [
  { id: "selected", label: "s e l e c t e d", description: "Curated highlight portfolio projects" },
  { id: "academic", label: "a c a d e m i c", description: "Academic research and university design projects" },
  { id: "professional", label: "p r o f e s s i o n a l", description: "Architectural office commissions and built work" },
  { id: "explorations", label: "e x p l o r a t i o n s", description: "Parametric geometry, kinetic mechanisms, and computational studies" },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return sampleProjects.find((p) => p.slug === slug);
}

export function getOtherProjects(currentSlug: string): Project[] {
  return sampleProjects.filter((p) => p.slug !== currentSlug);
}

export function getProjectsByCategory(category: Category): Project[] {
  if (category === "all") return sampleProjects;
  return sampleProjects.filter((p) => p.categories.includes(category));
}
