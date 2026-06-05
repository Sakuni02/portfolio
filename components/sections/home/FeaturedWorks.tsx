"use client";

import { SplitText } from "@/components/animations/SplitText";
import { LatestProjectsFlipCarousel } from "@/components/sections/home/LatestProjectsFlipCarousel";
import type { Project } from "@/lib/types";

interface FeaturedWorksProps {
  projects: Project[];
}

export function FeaturedWorks({ projects }: FeaturedWorksProps) {
  if (projects.length === 0) return null;

  return (
    <section className="relative z-10 overflow-hidden bg-background px-[max(1.25rem,env(safe-area-inset-left))] py-16 pr-[max(1.25rem,env(safe-area-inset-right))] sm:px-6 sm:py-20 md:px-10 md:py-32 lg:px-16">
      <SplitText
        text="Latest Projects"
        as="h2"
        className="mb-10 font-display text-[clamp(2rem,8vw,2.75rem)] text-foreground sm:mb-12 sm:text-4xl md:mb-16 md:text-6xl"
      />

      <LatestProjectsFlipCarousel projects={projects} />
    </section>
  );
}
