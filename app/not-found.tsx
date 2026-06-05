"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useReducedMotion } from "framer-motion";
import { MagneticButton } from "@/components/animations/MagneticButton";

export default function NotFound() {
  const pathRef = useRef<SVGPathElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion || !pathRef.current) return;

      const path = pathRef.current;
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;

      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 2,
        ease: "power2.inOut",
      });
    },
    { dependencies: [reducedMotion] }
  );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <svg viewBox="0 0 100 120" className="mb-8 h-32 w-24">
        <path
          ref={pathRef}
          d="M50 10 Q70 10 70 35 Q70 55 50 55 Q30 55 30 35 Q30 10 50 10 M50 55 L50 90 M35 75 Q50 85 65 75"
          fill="none"
          stroke="#8B6F47"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <h1 className="font-display text-6xl text-foreground">404</h1>
      <p className="mt-4 font-sans text-foreground/60">
        This drawing hasn&apos;t been rendered yet.
      </p>
      <div className="mt-8">
        <MagneticButton
          href="/"
          className="border border-sepia/40 px-6 py-3 font-sans text-xs uppercase tracking-[0.25em] text-foreground hover:bg-sepia hover:text-offwhite"
        >
          Return Home
        </MagneticButton>
      </div>
    </div>
  );
}
