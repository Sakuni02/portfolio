"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { AboutIntro } from "@/components/sections/about/AboutIntro";
import { AboutPortrait } from "@/components/sections/about/AboutPortrait";
import { CareerTimeline } from "@/components/sections/about/CareerTimeline";
import { DrawingInstrumentSection } from "@/components/sections/about/DrawingInstrumentSection";
import { useAboutPortraitScroll } from "@/components/sections/about/useAboutPortraitScroll";
import { useAboutImageBlend } from "@/components/sections/about/useAboutImageBlend";

export function AboutScrollExperience() {
  const reducedMotion = useReducedMotion();
  const [desktopScroll, setDesktopScroll] = useState(false);
  const [instrumentHandoff, setInstrumentHandoff] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const introSlotRef = useRef<HTMLDivElement>(null);
  const timelineSlotRef = useRef<HTMLDivElement>(null);
  const instrumentSlotRef = useRef<HTMLDivElement>(null);
  const introSectionRef = useRef<HTMLElement>(null);
  const timelineSectionRef = useRef<HTMLElement>(null);
  const instrumentSectionRef = useRef<HTMLElement>(null);

  const handleInstrumentHandoff = useCallback((handedOff: boolean) => {
    setInstrumentHandoff(handedOff);
  }, []);

  useEffect(() => {
    // iPad Pro 12.9 (1024px) uses static layout; scroll animation from 1280px up
    const mq = window.matchMedia("(min-width: 1280px)");
    const update = () => setDesktopScroll(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const scrollEnabled = desktopScroll && !reducedMotion;
  const imageBlend = useAboutImageBlend(
    introSectionRef,
    timelineSectionRef,
    instrumentSectionRef,
    reducedMotion !== true
  );

  useAboutPortraitScroll(
    {
      containerRef,
      portraitRef,
      introSlotRef,
      timelineSlotRef,
      instrumentSlotRef,
      introSectionRef,
      timelineSectionRef,
      instrumentSectionRef,
    },
    scrollEnabled,
    handleInstrumentHandoff
  );

  return (
    <div ref={containerRef} className="relative">
      {scrollEnabled && (
        <AboutPortrait
          ref={portraitRef}
          fillContainer
          imageBlend={imageBlend}
          className="pointer-events-none fixed left-0 top-0 z-30 hidden xl:block"
        />
      )}

      <AboutIntro
        sectionRef={introSectionRef}
        imageSlotRef={introSlotRef}
        imageBlend={imageBlend}
        showStaticPortrait={!scrollEnabled}
      />
      <CareerTimeline
        sectionRef={timelineSectionRef}
        imageSlotRef={timelineSlotRef}
      />
      <DrawingInstrumentSection
        sectionRef={instrumentSectionRef}
        imageSlotRef={instrumentSlotRef}
        imageBlend={imageBlend}
        showDesktopImage={scrollEnabled && instrumentHandoff}
        showTabletImage={!scrollEnabled}
      />
    </div>
  );
}
