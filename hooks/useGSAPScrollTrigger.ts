"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollTriggerConfig {
  trigger: string | Element;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean;
  animation: gsap.core.Tween | gsap.core.Timeline;
}

export function useGSAPScrollTrigger(config: ScrollTriggerConfig | null) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!config) return;

      const st = ScrollTrigger.create({
        trigger: config.trigger,
        start: config.start ?? "top top",
        end: config.end,
        scrub: config.scrub ?? false,
        pin: config.pin ?? false,
        animation: config.animation,
      });

      return () => st.kill();
    },
    { scope: scopeRef, dependencies: [config] }
  );

  return scopeRef;
}
