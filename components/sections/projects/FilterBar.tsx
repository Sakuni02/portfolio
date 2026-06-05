"use client";

import { motion } from "framer-motion";
import type { ProjectCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORIES: (ProjectCategory | "All")[] = [
  "All",
  "Residential",
  "Commercial",
  "Urban",
  "Conceptual",
];

interface FilterBarProps {
  active: ProjectCategory | "All";
  onChange: (category: ProjectCategory | "All") => void;
}

export function FilterBar({ active, onChange }: FilterBarProps) {
  return (
    <nav className="flex flex-wrap items-center gap-x-5 gap-y-3 sm:gap-x-6 sm:gap-y-2">
      {CATEGORIES.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onChange(category)}
          className="group relative py-1"
          data-cursor="hover"
        >
          <span
            className={cn(
              "font-sans text-[11px] uppercase tracking-[0.18em] transition-colors",
              active === category
                ? "text-charcoal dark:text-offwhite"
                : "text-foreground/40 hover:text-foreground/70"
            )}
          >
            {category}
          </span>
          {active === category && (
            <motion.span
              layoutId="projects-filter-underline"
              className="absolute -bottom-0.5 left-0 h-px w-full bg-sepia"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </button>
      ))}
    </nav>
  );
}
