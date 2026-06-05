"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { ARCHITECT } from "@/lib/constants";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

const copyContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const copyItem = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE },
  },
};

const GEOMETRIC_BLOCKS = [
  "top-[10%] left-[8%] h-10 w-10",
  "top-[32%] left-[24%] h-6 w-14",
  "bottom-[22%] left-[6%] h-12 w-12",
  "top-[16%] right-[12%] h-11 w-11",
] as const;

function GeometricBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {GEOMETRIC_BLOCKS.map((position) => (
        <div
          key={position}
          className={cn(
            "absolute border border-offwhite/10 bg-offwhite/[0.03]",
            position
          )}
        />
      ))}
    </div>
  );
}

function PortraitFrame({
  reducedMotion,
}: {
  reducedMotion: boolean | null;
}) {
  return (
    <div className="relative w-full shrink-0 sm:w-auto">
      <motion.div
        aria-hidden
        initial={reducedMotion ? false : { opacity: 0, x: 10, y: 10 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.75, delay: 0.35, ease: EASE }}
        className="absolute -bottom-2 -right-2 hidden h-full w-full border border-offwhite/15 sm:block"
      />
      <motion.div
        initial={
          reducedMotion
            ? false
            : { opacity: 0, clipPath: "inset(0 0 100% 0)" }
        }
        whileInView={{ opacity: 1, clipPath: "inset(0 0 0 0)" }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.95, ease: EASE }}
        className="relative aspect-[4/5] w-full overflow-hidden bg-charcoal sm:aspect-[803/1175] sm:w-[17rem] md:w-[19rem] lg:w-[21rem]"
      >
        <GeometricBackdrop />
        <motion.div
          className="absolute inset-0"
          initial={reducedMotion ? false : { scale: 1.03 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1.1, ease: EASE }}
        >
          <Image
            src={ARCHITECT.image}
            alt={ARCHITECT.imageAlt}
            fill
            className="object-cover object-[center_22%] brightness-[0.92] contrast-[1.08] saturate-0"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 17rem, 336px"
            priority
          />
        </motion.div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/50 via-charcoal/5 to-charcoal/20"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-offwhite/10"
        />
      </motion.div>
    </div>
  );
}

function WireframeWatermark() {
  return (
    <svg
      viewBox="0 0 400 320"
      className="pointer-events-none absolute right-0 top-1/2 h-32 w-32 -translate-y-1/2 text-offwhite opacity-[0.05] md:h-36 md:w-36"
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="0.75"
    >
      <path d="M40 280 L200 120 L360 280 Z" />
      <path d="M200 120 L200 40 L320 100 L200 120 Z" />
      <path d="M200 120 L80 100 L200 40" />
      <path d="M80 100 L80 220 L200 280 L200 120" />
      <path d="M320 100 L320 220 L200 280" />
      <line x1="200" y1="120" x2="200" y2="280" />
      <line x1="40" y1="280" x2="360" y2="280" />
    </svg>
  );
}

function IntroCopy({
  reducedMotion,
}: {
  reducedMotion: boolean | null;
}) {
  const { briefIntro } = ARCHITECT;

  if (reducedMotion) {
    return (
      <div className="relative z-10 flex w-full flex-col gap-5 sm:max-w-[24rem] md:w-fit md:max-w-[27rem] md:gap-6 lg:max-w-[29rem]">
        <p
          id="brief-intro-heading"
          className="font-display text-[clamp(1.35rem,5.5vw,1.75rem)] font-light leading-tight text-offwhite md:text-[1.875rem]"
        >
          {briefIntro.eyebrow}
        </p>
        <p className="font-sans text-sm leading-[1.8] text-offwhite/85 sm:text-[15px] sm:leading-[1.85] md:text-[17px] md:leading-[1.9]">
          {briefIntro.segments.map((segment) => (
            <span
              key={segment.text}
              className={segment.muted ? "font-medium text-sepia" : undefined}
            >
              {segment.text}
            </span>
          ))}
        </p>
        <div className="pt-1">
          <MagneticButton
            href="/about"
            strength={0.25}
            className="inline-flex items-center gap-3 rounded-full bg-offwhite px-7 py-3 font-sans text-sm font-medium text-charcoal transition-colors hover:bg-offwhite/90 md:px-8 md:py-3.5"
          >
            {briefIntro.cta}
            <ArrowIcon />
          </MagneticButton>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={copyContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="relative z-10 flex w-full flex-col gap-5 sm:max-w-[24rem] md:w-fit md:max-w-[27rem] md:gap-6 lg:max-w-[29rem]"
    >
      <motion.p
        variants={copyItem}
        id="brief-intro-heading"
        className="font-display text-[clamp(1.35rem,5.5vw,1.75rem)] font-light leading-tight text-offwhite md:text-[1.875rem]"
      >
        {briefIntro.eyebrow}
      </motion.p>

      <motion.p
        variants={copyItem}
        className="font-sans text-sm leading-[1.8] text-offwhite/85 sm:text-[15px] sm:leading-[1.85] md:text-[17px] md:leading-[1.9]"
      >
        {briefIntro.segments.map((segment) => (
          <span
            key={segment.text}
            className={segment.muted ? "font-medium text-sepia" : undefined}
          >
            {segment.text}
          </span>
        ))}
      </motion.p>

      <motion.div variants={copyItem} className="pt-1">
        <MagneticButton
          href="/about"
          strength={0.25}
          className="inline-flex items-center gap-3 rounded-full bg-offwhite px-7 py-3 font-sans text-sm font-medium text-charcoal transition-colors hover:bg-offwhite/90 md:px-8 md:py-3.5"
        >
          {briefIntro.cta}
          <ArrowIcon />
        </MagneticButton>
      </motion.div>
    </motion.div>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <path
        d="M3 11L11 3M11 3H5M11 3V9"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArchitectIntro() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="brief-intro-heading"
      className="pointer-events-none relative z-30 px-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] sm:px-6 md:px-10 lg:px-16"
    >
      <div className="pointer-events-auto mx-auto max-w-7xl max-md:mt-4 max-md:mb-8 md:-mt-44 md:mb-[-4rem] lg:-mt-52 lg:mb-[-4.5rem]">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.85, ease: EASE }}
          className="mx-auto w-full max-w-full overflow-hidden rounded-sm bg-charcoal text-offwhite shadow-[0_28px_90px_rgba(0,0,0,0.55)] ring-1 ring-offwhite/10 md:w-fit"
        >
          <div className="flex flex-col items-stretch gap-8 px-6 py-8 sm:gap-7 sm:p-6 md:flex-row md:items-center md:gap-10 md:p-8 lg:gap-11 lg:p-9">
            <PortraitFrame reducedMotion={reducedMotion} />

            <div className="relative w-full overflow-hidden md:w-fit">
              <motion.div
                initial={reducedMotion ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 1.2, delay: 0.45, ease: EASE }}
                className="pointer-events-none absolute inset-0"
                aria-hidden
              >
                <WireframeWatermark />
              </motion.div>
              <IntroCopy reducedMotion={reducedMotion} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
