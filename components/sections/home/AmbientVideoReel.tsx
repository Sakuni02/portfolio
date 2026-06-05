"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";
import { DRAWING_IN_MOTION_VIDEO } from "@/lib/constants";
import { SplitText } from "@/components/animations/SplitText";

gsap.registerPlugin(ScrollTrigger);

export function AmbientVideoReel() {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion || !containerRef.current || !videoRef.current || !textRef.current) return;

      gsap.to(videoRef.current, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.fromTo(
        textRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            end: "center center",
            scrub: 1,
          },
        }
      );
    },
    { scope: containerRef, dependencies: [reducedMotion] }
  );

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-[100dvh] min-h-screen items-center justify-center overflow-hidden bg-background px-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] sm:px-6 md:px-10"
    >
      <div
        className="absolute inset-x-0 top-[3%] bottom-[3%] z-0 bg-charcoal md:top-[4%] md:bottom-[4%]"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
      >
        <div className="relative h-full w-full">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="absolute -top-[8%] left-0 h-[125%] w-full object-cover opacity-35 mix-blend-screen"
          >
            <source src={DRAWING_IN_MOTION_VIDEO} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-charcoal/30" />
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[14%] min-h-24 max-h-36 bg-gradient-to-b from-background via-background/75 to-transparent md:min-h-28 md:max-h-40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[14%] min-h-24 max-h-36 bg-gradient-to-t from-background via-background/75 to-transparent md:min-h-28 md:max-h-40"
      />

      <div
        ref={textRef}
        className="relative z-10 w-full max-w-4xl px-2 text-center sm:px-0"
      >
        <p className="mb-4 font-sans text-[10px] uppercase tracking-[0.22em] text-sepia sm:mb-6 sm:text-xs sm:tracking-[0.35em] md:tracking-[0.4em]">
          Atmospheric Studies
        </p>
        <SplitText
          text="Drawing in Motion"
          as="h2"
          by="word"
          className="mx-auto justify-center font-display text-[clamp(2rem,9.5vw,3rem)] font-light leading-[1.12] text-offwhite sm:text-5xl sm:leading-tight md:text-7xl lg:text-8xl"
        />
        <p className="mx-auto mt-6 max-w-lg text-pretty font-sans text-sm leading-relaxed text-offwhite/60 sm:mt-8 md:text-base">
          Graphite perspectives reimagined through dimensional space. A subtle
          exploration of light, shadow, and architectural atmosphere.
        </p>
      </div>
    </section>
  );
}
