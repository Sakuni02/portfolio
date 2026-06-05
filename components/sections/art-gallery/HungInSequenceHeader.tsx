"use client";

import { useRef } from "react";
import { useLenis } from "lenis/react";
import { useReducedMotion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface HungInSequenceHeaderProps {
  workCount: number;
}

const TITLE_WORDS = ["Hung", "in", "sequence."];

export function HungInSequenceHeader({ workCount }: HungInSequenceHeaderProps) {
  const headerRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const lenis = useLenis();

  useGSAP(
    () => {
      const header = headerRef.current;
      if (!header || reducedMotion === null) return;

      const meta = gsap.utils.toArray<HTMLElement>(".hung-seq-meta", header);
      const words = gsap.utils.toArray<HTMLElement>(".hung-seq-word", header);
      const rule = header.querySelector<HTMLElement>(".hung-seq-rule");

      if (reducedMotion) {
        gsap.set([...meta, ...words, rule], { opacity: 1, y: 0, scaleX: 1 });
        return;
      }

      if (!lenis) return;

      gsap.set(meta, { y: 18, opacity: 0 });
      gsap.set(words, { y: "108%", opacity: 0, rotateZ: 2.5 });
      if (rule) gsap.set(rule, { scaleX: 0, opacity: 0, transformOrigin: "left center" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: header,
          start: "top 82%",
          once: true,
        },
      });

      tl.to(meta, { y: 0, opacity: 1, duration: 0.65, stagger: 0.07, ease: "power3.out" })
        .to(
          words,
          {
            y: 0,
            opacity: 1,
            rotateZ: 0,
            duration: 0.9,
            stagger: 0.1,
            ease: "power4.out",
          },
          "-=0.35"
        )
        .to(
          rule,
          { scaleX: 1, opacity: 1, duration: 0.8, ease: "power2.inOut" },
          "-=0.5"
        );

      return () => tl.kill();
    },
    { scope: headerRef, dependencies: [reducedMotion, lenis] }
  );

  return (
    <header ref={headerRef} className="mb-12 md:mb-16 lg:mb-20">
      <div className="flex items-start justify-between gap-6">
        <p className="hung-seq-meta font-sans text-[10px] uppercase tracking-[0.28em] text-charcoal/45 dark:text-offwhite/45 sm:text-[11px]">
          Selected archive
        </p>
        <p className="hung-seq-meta shrink-0 font-sans text-[10px] uppercase tracking-[0.28em] text-charcoal/45 dark:text-offwhite/45 sm:text-[11px]">
          {workCount} works
        </p>
      </div>

      <h2 className="mt-6 max-w-3xl overflow-hidden font-display text-[2.75rem] font-normal italic leading-[1.05] text-charcoal dark:text-offwhite sm:mt-8 sm:text-5xl md:text-6xl lg:text-[4.25rem]">
        {TITLE_WORDS.map((word) => (
          <span key={word} className="mr-[0.22em] inline-block overflow-hidden">
            <span className="hung-seq-word inline-block will-change-transform">{word}</span>
          </span>
        ))}
      </h2>

      <span
        className="hung-seq-rule mt-6 block h-px w-full max-w-md bg-gradient-to-r from-charcoal/25 via-charcoal/10 to-transparent dark:from-offwhite/25 dark:via-offwhite/10 sm:mt-8"
        aria-hidden
      />
    </header>
  );
}
