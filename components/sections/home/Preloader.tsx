"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ARTIST_INITIALS } from "@/lib/constants";

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const text = textRef.current;
    const container = containerRef.current;
    if (!text || !container) return;

    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
      },
    });

    tl.fromTo(
      text,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power2.inOut" }
    )
      .to(container, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut",
      })
      .set(container, { display: "none" });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-charcoal"
    >
      <p
        ref={textRef}
        className="font-display text-5xl tracking-[0.4em] text-sepia sm:text-6xl"
        aria-label={`${ARTIST_INITIALS} logo`}
      >
        {ARTIST_INITIALS}
      </p>
    </div>
  );
}
