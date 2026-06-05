"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ART_GALLERY_HERO } from "@/lib/art-gallery";

export function ArtGalleryHero() {
  const reducedMotion = useReducedMotion();

  const fade = (delay: number) =>
    reducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden bg-charcoal">
      <div className="absolute inset-0">
        <Image
          src={ART_GALLERY_HERO.image}
          alt="Architect sketching in a sunlit studio"
          fill
          priority
          className="object-cover object-[center_35%] brightness-[0.72] saturate-[0.85]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/65 via-charcoal/35 to-charcoal/85" />
        <div className="absolute inset-0 bg-charcoal/25" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col justify-between px-6 pb-10 pt-28 sm:px-8 md:px-10 md:pb-12 md:pt-32 lg:px-14">
        <motion.p
          {...fade(0.35)}
          className="max-w-xl font-sans text-[9px] uppercase tracking-[0.32em] text-offwhite/55 sm:text-[10px]"
        >
          {ART_GALLERY_HERO.eyebrow}
        </motion.p>

        <div className="flex flex-1 flex-col justify-center py-16 md:py-20">
          <motion.h1
            {...fade(0.5)}
            className="max-w-[14ch] font-display text-[3.25rem] font-normal italic leading-[0.95] text-offwhite sm:text-6xl md:text-7xl lg:text-[5.5rem] lg:leading-[0.92]"
          >
            {ART_GALLERY_HERO.title}
          </motion.h1>
        </div>

        <div className="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
          <motion.p
            {...fade(0.7)}
            className="max-w-sm font-sans text-[11px] leading-relaxed text-offwhite/55 sm:text-xs sm:leading-relaxed"
          >
            {ART_GALLERY_HERO.description}
          </motion.p>

          <motion.div {...fade(0.85)}>
            <Link
              href="#gallery"
              className="group inline-flex items-center gap-3 font-sans text-[9px] uppercase tracking-[0.32em] text-offwhite/70 transition-colors hover:text-offwhite sm:text-[10px]"
              data-cursor="hover"
            >
              Scroll to enter
              <span
                className="inline-block transition-transform duration-300 group-hover:translate-y-0.5"
                aria-hidden
              >
                ↓
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
