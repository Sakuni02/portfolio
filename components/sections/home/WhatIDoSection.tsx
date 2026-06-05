"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { SplitText } from "@/components/animations/SplitText";
import { PinnedPaperNote } from "@/components/sections/home/PinnedPaperNote";
import { WHAT_I_DO } from "@/lib/constants";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

const SECTION_HEIGHT = "lg:h-[calc(100dvh-5.5rem)] lg:max-h-[calc(100dvh-5.5rem)]";

const CORNER_ORDER = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
] as const;

type Corner = (typeof CORNER_ORDER)[number];

const OBJECT_POSITION: Record<Corner, string> = {
  "top-left": "object-left-top",
  "top-right": "object-right-top",
  "bottom-left": "object-left-bottom",
  "bottom-right": "object-right-bottom",
};

/** Slight tilt per note — casual pin-board feel */
const PAPER_ROTATIONS = {
  intro: -2.5,
  services: [1.75, -1.5, 2.25, -1.25] as const,
};

function SketchGridBackdrop({
  pieces,
}: {
  pieces: readonly { src: string; alt: string; corner: Corner }[];
}) {
  const tiles = CORNER_ORDER.map(
    (corner) => pieces.find((p) => p.corner === corner)!
  );

  return (
    <div className="absolute inset-0 grid h-full w-full grid-cols-2 grid-rows-2 gap-0">
      {tiles.map((piece) => (
        <div
          key={piece.corner}
          className="relative min-h-0 min-w-0 overflow-hidden"
        >
          <Image
            src={piece.src}
            alt={piece.alt}
            fill
            className={cn(
              "scale-[1.04] object-cover grayscale opacity-[0.48]",
              OBJECT_POSITION[piece.corner]
            )}
            sizes="50vw"
          />
        </div>
      ))}
    </div>
  );
}

export function WhatIDoSection() {
  const reducedMotion = useReducedMotion();
  const { eyebrow, title, description, services, sketchBackdrop } = WHAT_I_DO;

  return (
    <section
      aria-label={title}
      className={cn(
        "relative z-10 overflow-x-hidden bg-background",
        SECTION_HEIGHT
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]">
        <SketchGridBackdrop pieces={sketchBackdrop} />
        <div className="absolute inset-0 bg-background/10" />
      </div>

      <div className="relative z-10 flex h-full min-h-0 w-full items-center overflow-visible px-5 py-14 lg:px-10 lg:py-8">
        <div className="grid h-full min-h-0 w-full max-w-7xl grid-rows-[auto_auto] gap-10 overflow-visible lg:grid-cols-12 lg:grid-rows-1 lg:items-center lg:gap-8 xl:gap-10">
          <div className="flex justify-center overflow-visible lg:col-span-4 lg:justify-end lg:pr-2">
            <PinnedPaperNote
              rotation={PAPER_ROTATIONS.intro}
              variant="intro"
              delay={0}
              className="lg:mr-0"
            >
              <motion.p
                initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: EASE }}
                className="font-sans text-[10px] uppercase tracking-[0.35em] text-charcoal/60"
              >
                {eyebrow}
              </motion.p>
              <SplitText
                text={title}
                as="h2"
                className="mt-3 block font-display text-[clamp(1.75rem,3.5vw,2.5rem)] leading-tight text-charcoal"
              />
              <motion.p
                initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.12, ease: EASE }}
                className="mt-3 font-sans text-sm leading-relaxed text-charcoal/80 md:text-[0.9375rem] md:leading-[1.8]"
              >
                {description}
              </motion.p>
            </PinnedPaperNote>
          </div>

          <div className="grid min-h-0 grid-cols-1 gap-8 overflow-visible sm:grid-cols-2 sm:gap-6 lg:col-span-8 lg:gap-5 xl:gap-6">
            {services.map((service, i) => (
              <PinnedPaperNote
                key={service.title}
                rotation={PAPER_ROTATIONS.services[i]}
                delay={0.08 + i * 0.07}
                className={cn(
                  i % 2 === 0 ? "sm:justify-self-end sm:pr-2" : "sm:justify-self-start sm:pl-2",
                  i < 2 ? "lg:-mt-2" : "lg:mt-2"
                )}
              >
                <span
                  aria-hidden
                  className="font-mono text-[10px] tracking-[0.3em] text-sepia/90"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-display text-xl text-charcoal transition-colors group-hover:text-sepia md:text-2xl">
                  {service.title}
                </h3>
                <p className="mt-2.5 font-sans text-sm leading-relaxed text-charcoal/75">
                  {service.description}
                </p>
              </PinnedPaperNote>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
