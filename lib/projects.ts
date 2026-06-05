import "server-only";
import type { Project, ProjectCategory } from "./types";
import {
  buildProjectFromFolder,
  getProjectDefinitions,
} from "./project-assets";

export function getAllProjects(): Project[] {
  return getProjectDefinitions()
    .map((def) => buildProjectFromFolder(def.slug))
    .filter((p): p is Project => p !== null)
    .sort((a, b) => b.year - a.year);
}

export function getProjectBySlug(slug: string): Project | null {
  return buildProjectFromFolder(slug);
}

export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter((p) => p.featured).slice(0, 3);
}

/** Most recent projects by year (newest first). */
export function getLatestProjects(limit = 3): Project[] {
  return getAllProjects().slice(0, limit);
}

export function getProjectsByCategory(category: ProjectCategory | "All"): Project[] {
  const projects = getAllProjects();
  if (category === "All") return projects;
  return projects.filter((p) => p.category === category);
}

export function getRelatedProjects(slug: string, limit = 4): Project[] {
  const current = getProjectBySlug(slug);
  if (!current) return getAllProjects().slice(0, limit);

  return getAllProjects()
    .filter((p) => p.slug !== slug && p.category === current.category)
    .slice(0, limit);
}

export function getAllProjectSlugs(): string[] {
  return getAllProjects().map((p) => p.slug);
}
