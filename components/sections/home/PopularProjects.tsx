"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { SplitText } from "@/components/animations/SplitText";
import { CoverflowCarousel } from "@/components/sections/home/CoverflowCarousel";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/types";

interface PopularProjectsProps {
  projects: Project[];
}

const AUTOPLAY_INTERVAL_MS = 3200;
const SECTION_HEIGHT = "min-h-[calc(100svh-5rem)] max-h-[calc(100svh-5rem)]";

export function PopularProjects({ projects }: PopularProjectsProps) {
  const displayProjects = projects;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const reducedMotion = useReducedMotion();
  const count = displayProjects.length;
  const autoplayActive =
    !reducedMotion && !isHovered && !tabHidden && count > 1;

  const goTo = useCallback(
    (index: number) => {
      if (count === 0 || index < 0 || index >= count) return;
      setActiveIndex(index);
    },
    [count]
  );

  const paginate = useCallback(
    (step: number) => {
      if (count === 0) return;
      setActiveIndex((prev) => (prev + step + count) % count);
    },
    [count]
  );

  useEffect(() => {
    if (!autoplayActive) return;

    const id = window.setInterval(() => paginate(1), AUTOPLAY_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [autoplayActive, paginate]);

  useEffect(() => {
    const onVisibilityChange = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  if (count === 0) return null;

  return (
    <section
      id="popular-projects"
      className={cn(
        "flex snap-start flex-col overflow-visible bg-charcoal text-offwhite max-md:overflow-x-visible md:overflow-x-clip md:overflow-y-hidden",
        SECTION_HEIGHT
      )}
    >
      <div className="mx-auto w-full max-w-7xl shrink-0 px-[max(1.25rem,env(safe-area-inset-left))] pt-4 pb-2 pr-[max(1.25rem,env(safe-area-inset-right))] sm:px-6 md:px-10 md:pt-5 lg:px-16">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0 max-w-2xl">
            <SplitText
              text="My Signature Projects"
              as="h2"
              className="font-display text-2xl font-light sm:text-3xl md:text-4xl lg:text-5xl"
            />
            <p className="mt-1.5 font-sans text-xs leading-snug text-offwhite/60 sm:mt-2 sm:text-sm lg:max-w-md">
              A curated selection of our most recognized architectural studies and
              hand-rendered perspectives.
            </p>
          </div>
          <Link
            href="/projects"
            className="group inline-flex shrink-0 items-center gap-2 font-sans text-[10px] uppercase tracking-[0.2em] text-offwhite transition-colors hover:text-sepia md:gap-3 md:text-xs"
          >
            View Archive
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-offwhite/20 transition-colors group-hover:border-sepia md:h-8 md:w-8">
              <svg
                width="12"
                height="12"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 11L11 3M11 3H5M11 3V9" />
              </svg>
            </span>
          </Link>
        </div>
      </div>

      <div
        className="mx-auto flex w-full min-h-0 max-w-[100vw] flex-1 flex-col justify-center px-0"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocusCapture={() => setIsHovered(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
            setIsHovered(false);
          }
        }}
      >
        <CoverflowCarousel
          projects={displayProjects}
          activeIndex={activeIndex}
          onGoTo={goTo}
          onPaginate={paginate}
        />
      </div>
    </section>
  );
}
