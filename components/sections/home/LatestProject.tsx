"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { Project } from "@/lib/types";
import { MagneticButton } from "@/components/animations/MagneticButton";

interface LatestProjectProps {
  project: Project;
}

export function LatestProject({ project }: LatestProjectProps) {
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative min-h-[70vh] overflow-hidden">
      <Image
        src={project.coverImage}
        alt={project.title}
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-charcoal/50" />

      <motion.div
        initial={reducedMotion ? false : { y: 60, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-0 left-0 right-0 p-6 md:p-10"
      >
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-offwhite/70">
          Latest Project
        </p>
        <h2 className="mt-2 font-display text-4xl text-offwhite md:text-6xl">
          {project.title}
        </h2>
        <p className="mt-4 max-w-xl font-sans text-sm text-offwhite/70 md:text-base">
          {project.description.slice(0, 120)}...
        </p>
        <div className="mt-8">
          <MagneticButton
            href={`/projects/${project.slug}`}
            className="border border-offwhite/40 px-6 py-3 font-sans text-xs uppercase tracking-[0.25em] text-offwhite hover:bg-offwhite hover:text-charcoal"
          >
            View Project
          </MagneticButton>
        </div>
      </motion.div>
    </section>
  );
}
