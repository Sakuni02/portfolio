"use client";

import { useRef, useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { AboutPortraitSlot } from "@/components/sections/about/AboutPortrait";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Ref } from "react";

gsap.registerPlugin(ScrollTrigger);

function PencilIcon() {
  const pathRef = useRef<SVGPathElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !pathRef.current) return;

    const path = pathRef.current;
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 2,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: path,
        start: "top 80%",
        once: true,
      },
    });
  }, [reducedMotion]);

  return (
    <svg viewBox="0 0 60 120" className="h-20 w-10 md:h-24 md:w-12">
      <path
        ref={pathRef}
        d="M30 5 L45 25 L35 115 L25 115 L15 25 Z M30 5 L15 25 M30 5 L45 25 M20 30 L40 30"
        fill="none"
        stroke="#8B6F47"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface DrawingInstrumentSectionProps {
  sectionRef?: Ref<HTMLElement>;
  imageSlotRef?: Ref<HTMLDivElement>;
  showDesktopImage?: boolean;
  showTabletImage?: boolean;
  imageBlend?: number;
}

export function DrawingInstrumentSection({
  sectionRef,
  imageSlotRef,
  showDesktopImage = false,
  showTabletImage = false,
  imageBlend = 0,
}: DrawingInstrumentSectionProps) {
  return (
    <section
      ref={sectionRef}
      className="border-t border-foreground/10 bg-background px-[max(1.25rem,env(safe-area-inset-left))] py-14 pr-[max(1.25rem,env(safe-area-inset-right))] sm:px-6 sm:py-20 md:px-10 lg:px-16 lg:py-28"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-0 lg:grid-cols-12 lg:gap-10 xl:gap-14">
        <div
          className={
            showTabletImage
              ? "hidden lg:col-span-5 lg:block"
              : "hidden xl:col-span-5 xl:block"
          }
        >
          {imageSlotRef ? (
            <AboutPortraitSlot
              slotRef={imageSlotRef}
              showStaticImage={showTabletImage}
              showDesktopImage={showDesktopImage}
              imageBlend={imageBlend}
              className="mx-auto lg:mx-0"
            />
          ) : null}
        </div>

        <div className="flex flex-col items-start justify-center lg:col-span-7">
          <PencilIcon />
          <h2 className="mt-8 font-display text-3xl font-light text-foreground md:text-4xl">
            The Drawing Instrument
          </h2>
          <p className="mt-5 max-w-xl font-sans text-sm leading-relaxed text-foreground/60 md:text-base">
            Every line is drawn by hand with graphite on cotton paper — no digital
            shortcuts, no filters. The pencil remains the most honest tool for
            seeing architecture.
          </p>
        </div>
      </div>
    </section>
  );
}
