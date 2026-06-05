import type { Metadata } from "next";
import { getAllProjects } from "@/lib/projects";
import { ProjectsHero } from "@/components/sections/projects/ProjectsHero";
import { ProjectsGallery } from "@/components/sections/projects/ProjectsGallery";
import { HorizontalScrollSection } from "@/components/sections/projects/HorizontalScrollSection";
import { InfiniteMarquee } from "@/components/sections/projects/InfiniteMarquee";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Browse architectural pencil drawings across residential, commercial, urban, and conceptual categories.",
};

export default function ProjectsPage() {
  const projects = getAllProjects();
  const marqueeImages = projects.flatMap((p) => p.gallery.slice(0, 2));

  return (
    <>
      <ProjectsHero />

      <div id="projects-works">
        <HorizontalScrollSection projects={projects} />
      </div>
      <ProjectsGallery projects={projects} />
      <InfiniteMarquee images={marqueeImages} />
    </>
  );
}
