"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CinematicImageReveal } from "@/components/animations/CinematicImageReveal";
import type { Project } from "@/lib/types";
import { ProjectLink } from "@/components/project/ProjectLink";

const ASPECT_PATTERNS = [
  "aspect-[4/5]",
  "aspect-[3/4]",
  "aspect-[5/7]",
  "aspect-[3/5]",
  "aspect-[4/5]",
  "aspect-[2/3]",
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

interface MasonryGridProps {
  projects: Project[];
}

export function MasonryGrid({ projects }: MasonryGridProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="columns-1 gap-x-8 space-y-10 md:columns-2 md:gap-x-10 lg:columns-3 lg:gap-x-12">
      {projects.map((project, i) => (
        <motion.article
          key={project.slug}
          initial={reducedMotion ? false : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-48px", amount: 0.15 }}
          transition={{
            duration: 0.7,
            delay: (i % 3) * 0.1,
            ease: EASE,
          }}
          className="break-inside-avoid"
        >
          <ProjectLink slug={project.slug} className="group block">
            <CinematicImageReveal
              src={project.coverImage}
              alt={project.title}
              index={i}
              className={ASPECT_PATTERNS[i % ASPECT_PATTERNS.length]}
              imageClassName="transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />

            <motion.div
              className="mt-5"
              initial={reducedMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.55,
                delay: (i % 3) * 0.1 + 0.12,
                ease: EASE,
              }}
            >
              <div className="flex items-start justify-between gap-6">
                <h3 className="font-display text-[1.65rem] leading-[1.15] text-charcoal dark:text-offwhite md:text-[1.85rem]">
                  {project.title}
                </h3>
                <span className="shrink-0 pt-1 font-mono text-[11px] tracking-wide text-foreground/35">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <p className="mt-1.5 font-sans text-[11px] uppercase tracking-[0.14em] text-foreground/45">
                {project.category} · {project.year}
              </p>
            </motion.div>
          </ProjectLink>
        </motion.article>
      ))}
    </div>
  );
}
