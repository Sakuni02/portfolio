"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface ParallaxLayerProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  clip?: boolean;
}

export function ParallaxLayer({
  children,
  speed = 0.5,
  className,
  clip = true,
}: ParallaxLayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion || !containerRef.current || !targetRef.current) return;

      gsap.to(targetRef.current, {
        y: () => speed * 100,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: containerRef, dependencies: [speed, reducedMotion] }
  );

  return (
    <div
      ref={containerRef}
      className={cn(clip && "overflow-hidden", className)}
    >
      <div ref={targetRef}>{children}</div>
    </div>
  );
}
