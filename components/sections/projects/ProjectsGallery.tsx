"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Project, ProjectCategory } from "@/lib/types";
import { FilterBar } from "@/components/sections/projects/FilterBar";
import { MasonryGrid } from "@/components/sections/projects/MasonryGrid";

const EASE = [0.22, 1, 0.36, 1] as const;

interface ProjectsGalleryProps {
  projects: Project[];
}

export function ProjectsGallery({ projects }: ProjectsGalleryProps) {
  const [active, setActive] = useState<ProjectCategory | "All">("All");
  const reducedMotion = useReducedMotion();

  const filtered =
    active === "All"
      ? projects
      : projects.filter((p) => p.category === active);

  const fade = (delay: number) =>
    reducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 20 } as const,
          whileInView: { opacity: 1, y: 0 } as const,
          viewport: { once: true, margin: "-40px" } as const,
          transition: { duration: 0.65, delay, ease: EASE },
        };

  return (
    <section className="px-[max(1.25rem,env(safe-area-inset-left))] pb-24 pr-[max(1.25rem,env(safe-area-inset-right))] pt-16 sm:px-6 sm:pt-20 md:px-12 md:pt-24 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col gap-10 border-b border-sepia/15 pb-10 sm:gap-12 sm:pb-12 md:mb-16 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <motion.div className="min-w-0" {...fade(0)}>
            <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-foreground/40">
              Selected Works
            </p>
            <h1 className="mt-4 font-display text-4xl font-light leading-tight text-charcoal dark:text-offwhite sm:mt-5 md:text-5xl">
              Projects
            </h1>
          </motion.div>
          <motion.div
            className="w-full shrink-0 border-t border-sepia/10 pt-8 lg:w-auto lg:border-t-0 lg:pt-0 lg:pb-1"
            {...fade(0.1)}
          >
            <FilterBar active={active} onChange={setActive} />
          </motion.div>
        </div>

        <MasonryGrid key={active} projects={filtered} />
      </div>
    </section>
  );
}
