"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SplitText } from "@/components/animations/SplitText";
import { AboutPortraitSlot } from "@/components/sections/about/AboutPortrait";
import { ARCHITECT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Ref } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

const META = [
  { label: "Based in", value: ARCHITECT.location },
  { label: "Discipline", value: "Architectural Drawing" },
  { label: "Medium", value: "Graphite on cotton paper" },
] as const;

interface AboutIntroProps {
  sectionRef?: Ref<HTMLElement>;
  imageSlotRef?: Ref<HTMLDivElement>;
  imageBlend?: number;
  /** Static in-flow portrait below xl (phones + iPad Pro 12.9) */
  showStaticPortrait?: boolean;
}

export function AboutIntro({
  sectionRef,
  imageSlotRef,
  imageBlend = 0,
  showStaticPortrait = false,
}: AboutIntroProps) {
  const reducedMotion = useReducedMotion();
  const { aboutPage, intro, name, role } = ARCHITECT;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-background pt-28 sm:pt-32 md:pt-36"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full bg-sepia/[0.07] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-charcoal/[0.04] blur-3xl dark:bg-offwhite/[0.03]"
      />

      <div className="relative mx-auto max-w-7xl px-[max(1.25rem,env(safe-area-inset-left))] pb-14 pr-[max(1.25rem,env(safe-area-inset-right))] sm:px-6 sm:pb-20 md:px-10 md:pb-28 lg:px-16 lg:pb-32">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-10 xl:gap-14">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.75, ease: EASE }}
            className="lg:col-span-5 xl:col-span-5"
          >
            {imageSlotRef ? (
              <>
                <AboutPortraitSlot
                  slotRef={imageSlotRef}
                  showMobileImage
                  showStaticImage={showStaticPortrait}
                  imageBlend={imageBlend}
                  className="mx-auto lg:mx-0"
                />
                {!showStaticPortrait ? (
                  <div className="mt-5 hidden items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/40 sm:text-[11px] xl:flex">
                    <span className="h-px w-8 bg-sepia/50" aria-hidden />
                    {aboutPage.title}
                  </div>
                ) : null}
              </>
            ) : null}
          </motion.div>

          <div className="flex flex-col justify-center lg:col-span-7 xl:col-span-7">
            <motion.p
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, ease: EASE }}
              className="font-sans text-[11px] uppercase tracking-[0.35em] text-foreground/45"
            >
              {aboutPage.eyebrow}
            </motion.p>

            <SplitText
              text={name}
              as="h1"
              by="word"
              className="mt-4 font-display text-[clamp(2.75rem,8vw,4.5rem)] font-light leading-[0.95] text-foreground sm:mt-5"
            />

            <motion.p
              initial={reducedMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
              className="mt-5 max-w-xl font-sans text-sm leading-relaxed text-foreground/55 sm:text-base"
            >
              {role}
              <span className="mx-2 text-sepia/70" aria-hidden>
                ·
              </span>
              {ARCHITECT.location}
            </motion.p>

            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.65, delay: 0.14, ease: EASE }}
              className="mt-8 space-y-5 border-t border-foreground/10 pt-8"
            >
              <p className="font-display text-xl font-light leading-snug text-foreground sm:text-2xl md:text-[1.65rem] md:leading-[1.35]">
                {intro[0]}
              </p>
              {intro.slice(1).map((line) => (
                <p
                  key={line}
                  className="max-w-2xl font-sans text-sm leading-[1.85] text-foreground/65 sm:text-[15px] md:text-base"
                >
                  {line}
                </p>
              ))}
            </motion.div>

            <motion.ul
              initial={reducedMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, delay: 0.22, ease: EASE }}
              className="mt-10 grid gap-3 sm:grid-cols-3 sm:gap-4"
            >
              {META.map((item) => (
                <li
                  key={item.label}
                  className={cn(
                    "rounded-sm border border-foreground/10 bg-foreground/[0.02] px-4 py-3",
                    "dark:border-offwhite/10 dark:bg-offwhite/[0.03]"
                  )}
                >
                  <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-foreground/40">
                    {item.label}
                  </p>
                  <p className="mt-1.5 font-sans text-xs leading-snug text-foreground/75 sm:text-sm">
                    {item.value}
                  </p>
                </li>
              ))}
            </motion.ul>
          </div>
        </div>
      </div>
    </section>
  );
}
