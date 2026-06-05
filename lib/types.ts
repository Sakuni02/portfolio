export type ProjectCategory =
  | "Residential"
  | "Commercial"
  | "Urban"
  | "Conceptual";

/** Author-editable fields — defined in public-projects/*.ts */
export interface ProjectMeta {
  title: string;
  year: number;
  category: ProjectCategory;
  description: string;
  subtitle?: string;
  client?: string;
  location?: string;
  featured?: boolean;
  body?: string;
  videoUrl?: string;
}

export interface ProjectDefinition extends ProjectMeta {
  slug: string;
}

export interface Project extends ProjectMeta {
  slug: string;
  coverImage: string;
  gallery: string[];
}

export interface ProjectCompareImages {
  slug: string;
  drawing: string;
  real: string;
}
