import { home1 } from "./home1";
import { home2 } from "./home2";
import { home3 } from "./home3";
import { home4 } from "./home4";
import { home5 } from "./home5";
import { home6 } from "./home6";
import { home7 } from "./home7";
import { villaGeometrica } from "./villa-geometrica";
import type { ProjectDefinition } from "@/lib/types";

export type { ProjectDefinition };

/**
 * Project metadata registry.
 * Images for each slug live in public/projects/[slug]/ (real.webp required; drawing.webp optional).
 */
export const allProjectDefinitions: ProjectDefinition[] = [
  home1,
  home2,
  home3,
  home4,
  home5,
  home6,
  home7,
  villaGeometrica,
];

export {
  home1,
  home2,
  home3,
  home4,
  home5,
  home6,
  home7,
  villaGeometrica,
};
