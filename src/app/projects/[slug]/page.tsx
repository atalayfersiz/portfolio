import { getProjectBySlug, getOtherProjects, sampleProjects } from "@/content/projects";
import { notFound } from "next/navigation";
import ProjectDetailClient from "@/components/core/ProjectDetailClient";

export function generateStaticParams() {
  return sampleProjects.map((p) => ({
    slug: p.slug,
  }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const otherProjects = getOtherProjects(slug);

  return <ProjectDetailClient project={project} otherProjects={otherProjects} />;
}
