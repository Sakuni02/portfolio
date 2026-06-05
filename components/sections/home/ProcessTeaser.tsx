"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const PROCESS_IMAGE = "/textures/An_artistic_and_detailed.jpeg";

const STEPS = [
  {
    number: "01",
    title: "Observation",
    description: "Site study, light conditions, and proportional analysis.",
  },
  {
    number: "02",
    title: "Composition",
    description: "Structural hierarchy mapped in light graphite underdrawing.",
  },
  {
    number: "03",
    title: "Rendering",
    description: "Layered tonal values build depth, texture, and atmosphere.",
  },
];

export function ProcessTeaser() {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useGSAP(
    () => {
      if (reducedMotion || !containerRef.current || !imageRef.current) return;

      gsap.to(imageRef.current, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: containerRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-warmgray/20 text-charcoal"
    >
      {/* <div className="absolute inset-0 z-0 overflow-hidden opacity-30 dark:opacity-20">
        <Image
          ref={imageRef}
          src={PROCESS_IMAGE}
          alt="Architectural drawing background"
          fill
          className="scale-110 object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div> */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-30 dark:opacity-20">
        <Image
          ref={imageRef}
          src={PROCESS_IMAGE}
          alt="Architectural drawing background"
          fill
          className="scale-110 object-cover object-center"
          sizes="100vw"
        />
        {/* Added backdrop blur and base fade to reduce noise */}
        <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] dark:bg-charcoal/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:px-10 lg:px-16 lg:py-32">
        <div className="grid gap-16 lg:grid-cols-12 lg:items-center lg:gap-8">
          <div className="lg:col-span-4 lg:col-start-1">
            <div>
              <motion.p
                initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="font-sans text-[11px] uppercase tracking-[0.35em] text-charcoal/60 dark:text-offwhite/60"
              >
                The Process
              </motion.p>
              <motion.h2
                initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="mt-6 font-display text-5xl leading-tight text-charcoal dark:text-offwhite md:text-6xl"
              >
                From sight <br />
                to paper.
              </motion.h2>
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <div className="flex flex-col border-t border-charcoal/15 dark:border-offwhite/15">
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.number}
                  initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="group flex flex-col justify-center border-b border-charcoal/15 py-8 transition-colors hover:bg-charcoal/5 dark:border-offwhite/15 dark:hover:bg-offwhite/5 md:flex-row md:items-baseline md:justify-between md:px-6 md:py-10"
                >
                  <div className="flex items-baseline gap-6 md:w-1/3">
                    <span className="font-mono text-sm tracking-widest text-sepia">
                      {step.number}
                    </span>
                    <h3 className="font-display text-3xl text-charcoal dark:text-offwhite md:text-4xl">
                      {step.title}
                    </h3>
                  </div>
                  <div className="mt-4 pl-[3.25rem] md:mt-0 md:w-1/2 md:pl-0">
                    <p className="max-w-md font-sans text-base leading-relaxed text-charcoal/70 dark:text-offwhite/70">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
