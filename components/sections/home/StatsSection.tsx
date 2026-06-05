"use client";

import { useRef } from "react";
import { useLenis } from "lenis/react";
import { useReducedMotion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { STATS } from "@/lib/constants";
import { SplitText } from "@/components/animations/SplitText";

gsap.registerPlugin(ScrollTrigger);

function formatCount(n: number, suffix: string) {
  return suffix ? `${n}${suffix}` : `${n}`;
}

interface StatsSectionProps {
  className?: string;
}

export function StatsSection({ className }: StatsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const reducedMotion = useReducedMotion();
  const lenis = useLenis();

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const setAll = (values: number[]) => {
        STATS.forEach((stat, i) => {
          const el = counterRefs.current[i];
          if (el) el.textContent = formatCount(values[i] ?? stat.value, stat.suffix);
        });
      };

      if (reducedMotion === null) return;

      if (reducedMotion) {
        setAll(STATS.map((s) => s.value));
        return;
      }

      if (!lenis) return;

      const scroller = document.documentElement;
      const targets = STATS.map((stat, i) => ({
        stat,
        el: counterRefs.current[i],
        obj: { val: 0 },
      })).filter((t): t is typeof t & { el: HTMLSpanElement } => t.el !== null);

      const tweens = targets.map(({ stat, el, obj }) =>
        gsap.fromTo(
          obj,
          { val: 0 },
          {
            val: stat.value,
            duration: 2,
            ease: "power2.out",
            paused: true,
            onUpdate: () => {
              el.textContent = formatCount(Math.round(obj.val), stat.suffix);
            },
            onComplete: () => {
              el.textContent = formatCount(stat.value, stat.suffix);
            },
          }
        )
      );

      const playAll = () => {
        tweens.forEach((tween) => {
          if (tween.progress() < 1) tween.play();
        });
      };

      const st = ScrollTrigger.create({
        trigger: section,
        scroller,
        start: "top 82%",
        once: true,
        invalidateOnRefresh: true,
        onEnter: playAll,
      });

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        if (ScrollTrigger.isInViewport(section, 0.1)) {
          playAll();
        }
      });

      return () => {
        st.kill();
        tweens.forEach((tween) => tween.kill());
      };
    },
    { scope: sectionRef, dependencies: [lenis, reducedMotion] }
  );

  return (
    <section
      ref={sectionRef}
      className={`relative z-10 border-y border-sepia/20 bg-background py-24 md:py-32 ${className ?? ""}`}
    >
      <div className="mx-auto max-w-7xl px-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] sm:px-6 md:px-10 lg:px-16">
        <SplitText
          text="Studio in Numbers"
          as="h2"
          by="word"
          className="mb-20 font-display text-4xl text-foreground md:mb-24 md:text-5xl"
        />

        <div className="mx-auto grid max-w-4xl gap-x-10 gap-y-12 md:grid-cols-3 md:gap-x-16 lg:gap-x-20">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="text-center">
              <span
                ref={(el) => {
                  counterRefs.current[i] = el;
                }}
                className="inline-block pl-2 font-display text-5xl font-light text-sepia md:pl-3 md:text-7xl"
              >
                {formatCount(0, stat.suffix)}
              </span>
              <p className="mt-2 font-sans text-sm uppercase tracking-[0.2em] text-foreground/60">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
