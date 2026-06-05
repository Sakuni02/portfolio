import { notFound } from "next/navigation";
import { getProjectGalleryImages } from "@/lib/project-assets";
import { getProjectBySlug } from "@/lib/projects";
import { ProjectModal } from "./ProjectModal";

interface ProjectModalPageProps {
  slug: string;
  standalone?: boolean;
}

export function ProjectModalPage({ slug, standalone }: ProjectModalPageProps) {
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const extras = getProjectGalleryImages(slug);
  const galleryImages = extras.length > 0 ? extras : project.gallery;

  return (
    <ProjectModal
      project={project}
      galleryImages={galleryImages}
      standalone={standalone}
    />
  );
}
