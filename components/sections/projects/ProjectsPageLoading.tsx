"use client";

import { motion, useReducedMotion } from "framer-motion";

const ASPECTS = ["aspect-[4/5]", "aspect-[3/4]", "aspect-[5/7]"] as const;
const EASE = [0.22, 1, 0.36, 1] as const;

export function ProjectsPageLoading() {
  const reducedMotion = useReducedMotion();

  const item = (delay: number) =>
    reducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay, ease: EASE },
        };

  return (
    <div className="px-[max(1.25rem,env(safe-area-inset-left))] pb-24 pr-[max(1.25rem,env(safe-area-inset-right))] pt-16 sm:px-6 sm:pt-20 md:px-12 md:pt-24 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mb-14 flex flex-col gap-10 border-b border-sepia/15 pb-10 sm:gap-12 sm:pb-12 md:mb-16 lg:flex-row lg:items-end lg:justify-between lg:gap-12"
          {...item(0)}
        >
          <div className="min-w-0 space-y-4">
            <div className="skeleton-line h-3 w-28" />
            <div className="skeleton-line h-12 w-48" />
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-3 pt-8 lg:pt-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton-line h-3 w-16" />
            ))}
          </div>
        </motion.div>

        <div className="columns-1 gap-x-8 space-y-10 md:columns-2 md:gap-x-10 lg:columns-3 lg:gap-x-12">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="break-inside-avoid"
              {...item(0.08 + (i % 3) * 0.07)}
            >
              <div className={`skeleton-shimmer ${ASPECTS[i % ASPECTS.length]}`} />
              <div className="mt-5 flex justify-between gap-6">
                <div className="skeleton-line h-7 w-2/3" />
                <div className="skeleton-line h-3 w-6" />
              </div>
              <div className="skeleton-line mt-2 h-3 w-32" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
