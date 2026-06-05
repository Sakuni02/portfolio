import "server-only";
import fs from "fs";
import path from "path";
import { allProjectDefinitions } from "@/public-projects";
import type { ProjectCompareImages, ProjectDefinition } from "./types";

const PROJECTS_DIR = path.join(process.cwd(), "public/projects");

export const COMPARE_FILES = {
  drawing: "drawing.webp",
  real: "real.webp",
} as const;

export const GALLERY_DIR = "gallery";

const IMAGE_EXTENSIONS = new Set([".webp", ".jpg", ".jpeg", ".png"]);

function assetPath(slug: string, file: string) {
  return `/projects/${slug}/${file}`;
}

function isImageFile(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return IMAGE_EXTENSIONS.has(ext);
}

/** Additional images from public/projects/[slug]/gallery/ */
export function getProjectGalleryImages(slug: string): string[] {
  const galleryDir = path.join(PROJECTS_DIR, slug, GALLERY_DIR);
  if (!fs.existsSync(galleryDir)) return [];

  return fs
    .readdirSync(galleryDir)
    .filter(isImageFile)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((file) => assetPath(slug, `${GALLERY_DIR}/${file}`));
}

function buildGallery(slug: string, assets: ProjectCompareImages): string[] {
  const base =
    assets.drawing === assets.real
      ? [assets.real]
      : [assets.drawing, assets.real];
  const extras = getProjectGalleryImages(slug).filter(
    (src) => !base.includes(src)
  );
  return [...base, ...extras];
}

/** True when public/projects/[slug]/real.webp exists */
export function projectHasCoverImage(slug: string): boolean {
  const realPath = path.join(PROJECTS_DIR, slug, COMPARE_FILES.real);
  return fs.existsSync(realPath);
}

/** Returns drawing + real paths when real.webp exists (drawing.webp optional) */
export function getProjectCompareImages(slug: string): ProjectCompareImages | null {
  const folder = path.join(PROJECTS_DIR, slug);
  const drawingPath = path.join(folder, COMPARE_FILES.drawing);
  const realPath = path.join(folder, COMPARE_FILES.real);

  if (!fs.existsSync(realPath)) {
    return null;
  }

  const real = assetPath(slug, COMPARE_FILES.real);
  const drawing = fs.existsSync(drawingPath)
    ? assetPath(slug, COMPARE_FILES.drawing)
    : real;

  return { slug, drawing, real };
}

export function projectHasCompareSlider(slug: string): boolean {
  const folder = path.join(PROJECTS_DIR, slug);
  const drawingPath = path.join(folder, COMPARE_FILES.drawing);
  const realPath = path.join(folder, COMPARE_FILES.real);
  return fs.existsSync(drawingPath) && fs.existsSync(realPath);
}

export function getProjectDefinitions(): ProjectDefinition[] {
  return allProjectDefinitions.filter((def) => projectHasCoverImage(def.slug));
}

export function getProjectDefinitionBySlug(
  slug: string
): ProjectDefinition | null {
  const def = allProjectDefinitions.find((p) => p.slug === slug);
  if (!def || !projectHasCoverImage(slug)) return null;
  return def;
}

export function buildProjectFromFolder(slug: string) {
  const def = getProjectDefinitionBySlug(slug);
  const assets = getProjectCompareImages(slug);

  if (!def || !assets) return null;

  return {
    ...def,
    coverImage: assets.real,
    gallery: buildGallery(slug, assets),
  };
}
