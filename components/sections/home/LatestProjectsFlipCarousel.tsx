"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { useReducedMotion } from "framer-motion";
import type { Project } from "@/lib/types";
import { ProjectLink } from "@/components/project/ProjectLink";

gsap.registerPlugin(Flip);

/**
 * GSAP FLIP Carousel (caterpillar) — matches official demo:
 * https://demos.gsap.com/demo/flip-carousel/
 * https://codepen.io/GreenSock/pen/eYwbjdz
 */
const AUTOPLAY_MS = 3200;
const FLIP_DURATION = 0.48;

interface LatestProjectsFlipCarouselProps {
  projects: Project[];
}

function formatMeta(project: Project) {
  const location = project.location?.toUpperCase() ?? "";
  return location
    ? `${project.category.toUpperCase()} · ${location}`
    : project.category.toUpperCase();
}

export function LatestProjectsFlipCarousel({
  projects,
}: LatestProjectsFlipCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const orderRef = useRef<number[]>([]);
  const isAnimatingRef = useRef(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [order, setOrder] = useState<number[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const reducedMotion = useReducedMotion();
  const count = projects.length;

  useEffect(() => {
    const initial = projects.map((_, i) => i);
    setOrder(initial);
    orderRef.current = initial;
  }, [projects]);

  const autoplayOn =
    Boolean(reducedMotion === false) &&
    !isHovered &&
    count > 1 &&
    order.length > 0;

  const syncOrder = useCallback((next: number[]) => {
    orderRef.current = next;
    setOrder(next);
  }, []);

  const updateCaterpillar = useCallback(
    (forward: boolean, onDone?: () => void) => {
      const container = trackRef.current;
      if (!container || isAnimatingRef.current || count <= 1) {
        onDone?.();
        return;
      }

      const cards = gsap.utils.toArray<HTMLElement>(
        "[data-flip-card]",
        container
      );
      if (cards.length === 0) {
        onDone?.();
        return;
      }

      if (reducedMotion) {
        const prev = orderRef.current;
        const next = forward
          ? [...prev.slice(1), prev[0]!]
          : [prev[prev.length - 1]!, ...prev.slice(0, -1)];
        syncOrder(next);
        onDone?.();
        return;
      }

      isAnimatingRef.current = true;
      setIsAnimating(true);
      const state = Flip.getState(cards);
      const first = cards[0]!;
      const last = cards[cards.length - 1]!;
      const source = forward ? first : last;

      const enter = source.cloneNode(true) as HTMLElement;
      enter.setAttribute("data-flip-enter", "true");
      enter.removeAttribute("data-flip-card");
      enter.removeAttribute("data-flip-id"); // Crucial: so Flip treats it as a new element
      enter.setAttribute("aria-hidden", "true");
      enter.classList.add("pointer-events-none");
      gsap.set(enter, { scale: 0, opacity: 0 });

      if (forward) {
        container.appendChild(enter);
        first.classList.add("flip-carousel-hide");
      } else {
        container.insertBefore(enter, first);
        last.classList.add("flip-carousel-hide");
      }

      Flip.from(state, {
        targets: "[data-flip-card], [data-flip-enter]",
        fade: true,
        absoluteOnLeave: true,
        duration: FLIP_DURATION,
        ease: "power1.inOut",
        onEnter: (elements) => {
          gsap.to(elements, {
            opacity: 1,
            scale: 1,
            duration: FLIP_DURATION,
            ease: "power1.inOut",
            transformOrigin: forward ? "bottom right" : "bottom left",
          });
        },
        onLeave: (elements) => {
          gsap.to(elements, {
            opacity: 0,
            scale: 0,
            duration: FLIP_DURATION,
            ease: "power1.inOut",
            transformOrigin: forward ? "bottom left" : "bottom right",
            onComplete: () => {
              gsap.set(elements, { clearProps: "all" });
              enter.remove();
              cards.forEach((card) =>
                card.classList.remove("flip-carousel-hide")
              );

              const prev = orderRef.current;
              const next = forward
                ? [...prev.slice(1), prev[0]!]
                : [prev[prev.length - 1]!, ...prev.slice(0, -1)];
              syncOrder(next);
              isAnimatingRef.current = false;
              setIsAnimating(false);
              onDone?.();
            },
          });
        },
      });
    },
    [count, reducedMotion, syncOrder]
  );

  const rotate = useCallback(
    (forward: boolean) => {
      updateCaterpillar(forward);
    },
    [updateCaterpillar]
  );

  useEffect(() => {
    if (!autoplayOn) return;
    const id = window.setInterval(() => rotate(true), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [autoplayOn, rotate]);

  if (count === 0 || order.length === 0) return null;

  return (
    <div
      className="mx-auto w-full max-w-7xl overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsHovered(true)}
      onBlurCapture={() => setIsHovered(false)}
    >
      <div
        ref={trackRef}
        className="flip-carousel-track hide-scrollbar flex justify-center gap-3 overflow-x-hidden rounded-xl border border-dashed border-foreground/15 bg-foreground/[0.02] p-3 sm:gap-4 sm:overflow-x-auto sm:p-4 md:gap-5"
        aria-live="polite"
        aria-roledescription="carousel"
      >
        {order.map((projectIndex) => {
          const project = projects[projectIndex];
          if (!project) return null;

          return (
            <article
              key={project.slug}
              data-flip-card
              data-flip-id={project.slug}
              className="flip-carousel-card w-[min(82vw,280px)] shrink-0 sm:w-[min(36vw,240px)] md:w-[min(20vw,260px)]"
            >
              <ProjectLink slug={project.slug} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden bg-warmgray/30">
                  <Image
                    src={project.coverImage}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 68vw, 260px"
                  />

                  <span className="absolute left-0 top-0 z-10 bg-charcoal px-3 py-2 font-mono text-[11px] tracking-wide text-offwhite">
                    {String(projectIndex + 1).padStart(2, "0")}
                  </span>

                  <span
                    aria-hidden
                    className="absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-offwhite text-charcoal shadow-sm transition-transform duration-500 group-hover:scale-105"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="translate-x-[1px] -translate-y-[1px]"
                    >
                      <path
                        d="M3 11L11 3M11 3H5M11 3V9"
                        stroke="currentColor"
                        strokeWidth="1.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>

                <div className="mt-3 flex items-start justify-between gap-3 sm:mt-4 sm:items-end sm:gap-4">
                  <div className="min-w-0">
                    <h3 className="font-display text-lg leading-tight text-foreground sm:text-xl md:text-2xl">
                      {project.title}
                    </h3>
                    <p className="mt-1 font-sans text-[9px] uppercase tracking-[0.14em] text-foreground/45 sm:mt-1.5 sm:text-[10px] sm:tracking-[0.18em]">
                      {formatMeta(project)}
                    </p>
                  </div>
                  <span className="shrink-0 pt-0.5 font-sans text-xs text-foreground/70 sm:text-sm">
                    {project.year}
                  </span>
                </div>
              </ProjectLink>
            </article>
          );
        })}
      </div>

      {count > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2 sm:mt-8 sm:gap-3">
          <button
            type="button"
            aria-label="Previous project"
            onClick={() => rotate(false)}
            disabled={isAnimating}
            className="rounded-full border border-foreground/20 px-4 py-2 font-sans text-[10px] uppercase tracking-[0.12em] text-foreground transition-colors hover:border-sepia hover:text-sepia disabled:opacity-40 sm:px-5 sm:text-xs sm:tracking-[0.15em]"
          >
            Previous
          </button>
          <button
            type="button"
            aria-label="Next project"
            onClick={() => rotate(true)}
            disabled={isAnimating}
            className="rounded-full border border-foreground/20 px-4 py-2 font-sans text-[10px] uppercase tracking-[0.12em] text-foreground transition-colors hover:border-sepia hover:text-sepia disabled:opacity-40 sm:px-5 sm:text-xs sm:tracking-[0.15em]"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
