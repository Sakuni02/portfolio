"use client";

import { useRef } from "react";
import Image from "next/image";
import { useLenis } from "lenis/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";
import type { Project } from "@/lib/types";
import { ProjectLink } from "@/components/project/ProjectLink";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface HorizontalScrollSectionProps {
  projects: Project[];
}

function getScrollDistance(track: HTMLElement) {
  return Math.max(0, track.scrollWidth - window.innerWidth);
}

export function HorizontalScrollSection({ projects }: HorizontalScrollSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();
  const lenis = useLenis();
  const count = projects.length;

  useGSAP(
    () => {
      if (reducedMotion || !lenis || !sectionRef.current || !trackRef.current) return;

      const section = sectionRef.current;
      const track = trackRef.current;
      const scroller = document.documentElement;
      let tween: gsap.core.Tween | undefined;
      let cancelled = false;

      const buildScroll = () => {
        tween?.scrollTrigger?.kill(true);
        tween?.kill();

        const distance = getScrollDistance(track);
        if (distance <= 0) return;

        gsap.set(track, { x: 0 });

        tween = gsap.to(track, {
          x: -distance,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            scroller,
            start: "top top",
            end: () => `+=${distance}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progressRef.current) {
                progressRef.current.style.transform = `scaleX(${self.progress})`;
              }
              if (counterRef.current && count > 0) {
                const index = Math.min(
                  count - 1,
                  Math.round(self.progress * Math.max(count - 1, 0))
                );
                counterRef.current.textContent = String(index + 1).padStart(2, "0");
              }
            },
          },
        });

        ScrollTrigger.refresh();
      };

      const rafId = requestAnimationFrame(buildScroll);

      const images = track.querySelectorAll("img");
      const onImageLoad = () => {
        if (!cancelled) buildScroll();
      };

      images.forEach((img) => {
        if (!img.complete) img.addEventListener("load", onImageLoad, { once: true });
      });

      const onResize = () => {
        if (!cancelled) buildScroll();
      };
      window.addEventListener("resize", onResize);

      return () => {
        cancelled = true;
        cancelAnimationFrame(rafId);
        window.removeEventListener("resize", onResize);
        images.forEach((img) => img.removeEventListener("load", onImageLoad));
        tween?.scrollTrigger?.kill(true);
        tween?.kill();
        gsap.set(track, { clearProps: "transform" });
      };
    },
    { scope: sectionRef, dependencies: [projects, reducedMotion, lenis, count], revertOnUpdate: true }
  );

  if (count === 0) return null;

  if (reducedMotion) {
    return (
      <section className="bg-charcoal px-6 py-16 text-offwhite md:px-10 lg:px-16">
        <div className="mb-8">
          <p className="font-sans text-[11px] uppercase tracking-[0.35em] text-offwhite/50">
            Selected Archive
          </p>
          <h2 className="mt-3 font-display text-3xl font-light md:text-4xl">Projects</h2>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {projects.map((project, i) => (
            <ProjectLink
              key={project.slug}
              slug={project.slug}
              className="relative h-[60vh] w-[78vw] min-w-[280px] shrink-0 overflow-hidden border border-offwhite/10"
            >
              <Image
                src={project.coverImage}
                alt={project.title}
                fill
                className="object-cover"
                sizes="78vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/10 to-transparent" />
              <div className="absolute bottom-5 left-5">
                <span className="font-mono text-xs text-sepia">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-1 font-display text-2xl text-offwhite">{project.title}</h3>
              </div>
            </ProjectLink>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-charcoal text-offwhite"
      aria-label="Projects horizontal gallery"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between px-6 pt-8 md:px-10 md:pt-10 lg:px-16">
        <div>
          <p className="font-sans text-[11px] uppercase tracking-[0.35em] text-offwhite/50">
            Selected Archive
          </p>
          <p className="mt-2 font-sans text-xs text-offwhite/45">Scroll to explore</p>
        </div>
        <p className="font-mono text-xs tracking-[0.25em] text-offwhite/45">
          <span ref={counterRef}>01</span>
          <span className="mx-1.5 text-offwhite/25">/</span>
          {String(count).padStart(2, "0")}
        </p>
      </div>

      <div
        ref={trackRef}
        className="flex h-screen min-h-[32rem] items-center gap-5 px-6 will-change-transform md:gap-8 md:px-10 lg:gap-10 lg:px-16"
      >
        <div className="flex h-[min(72vh,40rem)] w-[min(82vw,22rem)] shrink-0 flex-col justify-end pb-6 sm:w-[min(70vw,26rem)] md:w-[34vw] md:max-w-md lg:w-[28vw]">
          <h2 className="font-display text-[clamp(2.5rem,8vw,4rem)] font-light leading-[0.95]">
            Projects
          </h2>
          <p className="mt-5 max-w-xs font-sans text-sm leading-relaxed text-offwhite/55">
            A horizontal study of residential, commercial, and conceptual work — each
            sheet drawn by hand.
          </p>
        </div>

        {projects.map((project, i) => (
          <ProjectLink
            key={project.slug}
            slug={project.slug}
            className={cn(
              "group relative h-[min(72vh,40rem)] w-[min(88vw,34rem)] shrink-0 overflow-hidden",
              "border border-offwhite/10 bg-charcoal shadow-[0_24px_80px_-24px_rgba(0,0,0,0.75)]",
              "transition-[border-color,box-shadow] duration-500",
              "hover:border-sepia/35 hover:shadow-[0_32px_90px_-20px_rgba(0,0,0,0.85)]"
            )}
          >
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              priority={i < 2}
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 88vw, 34rem"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/15 to-sepia/5" />
            <div className="absolute inset-0 bg-charcoal/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-7">
              <span className="font-mono text-xs tracking-[0.2em] text-sepia">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 font-display text-2xl leading-tight text-offwhite md:text-3xl">
                {project.title}
              </h3>
              <div className="mt-3 flex items-center gap-3 font-sans text-[11px] uppercase tracking-[0.18em] text-offwhite/55">
                <span>{project.category}</span>
                <span className="h-1 w-1 rounded-full bg-sepia/70" aria-hidden />
                <span>{project.year}</span>
              </div>
            </div>
          </ProjectLink>
        ))}

        <div className="h-px w-[12vw] shrink-0 md:w-[8vw]" aria-hidden />
      </div>

      <div className="pointer-events-none absolute inset-x-6 bottom-8 z-20 md:inset-x-10 lg:inset-x-16">
        <div className="h-px w-full bg-offwhite/15">
          <div
            ref={progressRef}
            className="h-full origin-left bg-sepia will-change-transform"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </section>
  );
}
