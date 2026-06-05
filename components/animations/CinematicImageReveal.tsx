"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CinematicImageRevealProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  index?: number;
  sizes?: string;
  priority?: boolean;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export function CinematicImageReveal({
  src,
  alt,
  className,
  imageClassName,
  index = 0,
  sizes = "100vw",
  priority = false,
}: CinematicImageRevealProps) {
  const reducedMotion = useReducedMotion();
  const stagger = (index % 3) * 0.08;

  if (reducedMotion) {
    return (
      <div className={cn("relative overflow-hidden bg-warmgray/20", className)}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className={cn("object-cover", imageClassName)}
          sizes={sizes}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-warmgray/25 dark:bg-charcoal/30",
        className
      )}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.05 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-40px", amount: 0.2 }}
        transition={{ duration: 0.9, delay: stagger, ease: EASE }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className={cn("object-cover", imageClassName)}
          sizes={sizes}
        />
      </motion.div>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 bg-offwhite/75 dark:bg-charcoal/65"
        initial={{ opacity: 1 }}
        whileInView={{ opacity: 0 }}
        viewport={{ once: true, margin: "-40px", amount: 0.2 }}
        transition={{ duration: 0.7, delay: stagger + 0.05, ease: EASE }}
      />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-sepia/60"
        initial={{ y: 0, opacity: 0.75 }}
        whileInView={{ y: "100%", opacity: 0 }}
        viewport={{ once: true, margin: "-40px", amount: 0.2 }}
        transition={{ duration: 0.85, delay: stagger, ease: EASE }}
      />
    </div>
  );
}
