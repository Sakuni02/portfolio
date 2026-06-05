"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";
import type { Project } from "@/lib/types";
import { ProjectLink } from "@/components/project/ProjectLink";

gsap.registerPlugin(ScrollTrigger);

interface RelatedProjectsProps {
  projects: Project[];
}

export function RelatedProjects({ projects }: RelatedProjectsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion || !sectionRef.current || !trackRef.current) return;

      const track = trackRef.current;
      const totalScroll = track.scrollWidth - window.innerWidth;

      if (totalScroll <= 0) return;

      gsap.to(track, {
        x: -totalScroll,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: () => `+=${totalScroll * 0.5}`,
          scrub: 1,
        },
      });
    },
    { scope: sectionRef, dependencies: [projects, reducedMotion] }
  );

  return (
    <section ref={sectionRef} className="overflow-hidden px-6 py-24 md:px-10">
      <h2 className="mb-8 font-display text-3xl text-foreground md:text-4xl">
        Related Projects
      </h2>
      <div ref={trackRef} className="flex gap-6">
        {projects.map((project) => (
          <ProjectLink
            key={project.slug}
            slug={project.slug}
            className="group relative h-64 w-80 shrink-0 overflow-hidden md:h-80 md:w-96"
          >
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              loading="lazy"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="384px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <h3 className="font-display text-xl text-offwhite">{project.title}</h3>
              <p className="font-sans text-xs text-offwhite/60">{project.year}</p>
            </div>
          </ProjectLink>
        ))}
      </div>
    </section>
  );
}
