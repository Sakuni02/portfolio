"use client";

import { useLenis } from "lenis/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useState, type RefObject } from "react";

gsap.registerPlugin(ScrollTrigger);

/** 0 = first portrait, 1 = second, 2 = third (with crossfades between). */
export function useAboutImageBlend(
  introSectionRef: RefObject<HTMLElement | null>,
  timelineSectionRef: RefObject<HTMLElement | null>,
  instrumentSectionRef: RefObject<HTMLElement | null>,
  enabled: boolean
): number {
  const lenis = useLenis();
  const [progress, setProgress] = useState(0);

  useGSAP(
    () => {
      if (!enabled || !lenis) {
        setProgress(0);
        return;
      }

      const introSection = introSectionRef.current;
      const timelineSection = timelineSectionRef.current;
      const instrumentSection = instrumentSectionRef.current;
      if (!introSection || !timelineSection || !instrumentSection) return;

      const scroller = document.documentElement;

      const st = ScrollTrigger.create({
        trigger: introSection,
        scroller,
        start: "top top",
        endTrigger: instrumentSection,
        end: "top 32%",
        scrub: 0.55,
        invalidateOnRefresh: true,
        onUpdate: (self) => setProgress(self.progress * 2),
      });

      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", onResize);

      requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => {
        window.removeEventListener("resize", onResize);
        st.kill();
        setProgress(0);
      };
    },
    {
      dependencies: [
        enabled,
        lenis,
        introSectionRef,
        timelineSectionRef,
        instrumentSectionRef,
      ],
    }
  );

  return progress;
}

export function getPortraitOpacities(progress: number): [number, number, number] {
  const p = Math.min(2, Math.max(0, progress));
  if (p <= 1) return [1 - p, p, 0];
  const t = p - 1;
  return [0, 1 - t, t];
}
