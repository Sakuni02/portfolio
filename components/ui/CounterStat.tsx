"use client";

import { useRef } from "react";
import { useLenis } from "lenis/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

interface CounterStatProps {
  value: number;
  suffix?: string;
  label: string;
}

function formatCount(n: number, suffix: string) {
  return suffix ? `${n}${suffix}` : `${n}`;
}

export function CounterStat({ value, suffix = "", label }: CounterStatProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();
  const lenis = useLenis();

  useGSAP(
    () => {
      const el = counterRef.current;
      const trigger = rootRef.current;
      if (!el || !trigger) return;

      const setText = (n: number) => {
        el.textContent = formatCount(n, suffix);
      };

      if (reducedMotion === null) return;

      if (reducedMotion) {
        setText(value);
        return;
      }

      // Wait until Lenis + ScrollTrigger scroller proxy are configured
      if (!lenis) return;

      const obj = { val: 0 };
      const scroller = document.documentElement;

      const tween = gsap.fromTo(
        obj,
        { val: 0 },
        {
          val: value,
          duration: 2,
          ease: "power2.out",
          paused: true,
          onUpdate: () => setText(Math.round(obj.val)),
          onComplete: () => setText(value),
        }
      );

      const play = () => {
        if (tween.progress() < 1) tween.play();
      };

      const st = ScrollTrigger.create({
        trigger,
        scroller,
        start: "top 82%",
        once: true,
        invalidateOnRefresh: true,
        onEnter: play,
      });

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        if (ScrollTrigger.isInViewport(trigger, 0.1)) {
          play();
        }
      });

      return () => {
        st.kill();
        tween.kill();
      };
    },
    { scope: rootRef, dependencies: [value, suffix, reducedMotion, lenis] }
  );

  return (
    <div ref={rootRef} className="text-center">
      <span
        ref={counterRef}
        className="inline-block pl-2 font-display text-5xl font-light text-sepia md:pl-3 md:text-7xl"
      >
        {formatCount(0, suffix)}
      </span>
      <p className="mt-2 font-sans text-sm uppercase tracking-[0.2em] text-foreground/60">
        {label}
      </p>
    </div>
  );
}
