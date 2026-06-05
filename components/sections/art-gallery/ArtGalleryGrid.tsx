"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import { useLenis } from "lenis/react";
import { useReducedMotion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ArtGalleryItem } from "@/lib/art-gallery";
import type { Project } from "@/lib/types";
import { ProjectModal } from "@/components/project/ProjectModal";
import { ArtGalleryWorkModal } from "@/components/sections/art-gallery/ArtGalleryWorkModal";

gsap.registerPlugin(ScrollTrigger);

interface ArtGalleryProjectEntry {
  project: Project;
  galleryImages: string[];
}

interface ArtGalleryGridProps {
  items: ArtGalleryItem[];
  projectEntries: ArtGalleryProjectEntry[];
}

const FRAME_ROTATIONS = [-2.5, 1.8, -1.2, 2.2, -1.8, 0.8, -2, 1.5, -0.9, 2.5, -1.5, 1.2];

const windTimelines = new WeakMap<HTMLElement, gsap.core.Timeline>();

function getWindTargets(stack: HTMLElement) {
  return {
    frame: stack.querySelector<HTMLElement>(".polaroid-frame"),
    shadow: stack.querySelector<HTMLElement>(".polaroid-shadow"),
    photo: stack.querySelector<HTMLElement>(".art-gallery-photo"),
    tapeTl: stack.querySelector<HTMLElement>(".polaroid-tape-tl"),
    tapeBr: stack.querySelector<HTMLElement>(".polaroid-tape-br"),
  };
}

function stopWind(stack: HTMLElement, baseRotate: number) {
  const existing = windTimelines.get(stack);
  if (existing) {
    existing.kill();
    windTimelines.delete(stack);
  }

  const { frame, shadow, photo, tapeTl, tapeBr } = getWindTargets(stack);
  const targets = [frame, shadow, photo, tapeTl, tapeBr].filter(Boolean);
  gsap.killTweensOf(targets);

  if (frame) {
    gsap.to(frame, {
      rotation: baseRotate,
      x: 0,
      y: 0,
      duration: 0.85,
      ease: "power2.out",
    });
  }
  if (shadow) {
    gsap.to(shadow, {
      rotation: baseRotate + 4,
      x: 0,
      y: 0,
      duration: 1,
      ease: "power2.out",
    });
  }
  if (photo) gsap.to(photo, { x: 0, y: 0, duration: 0.7, ease: "power2.out" });
  if (tapeTl) gsap.to(tapeTl, { rotation: -38, x: 0, duration: 0.6, ease: "power2.out" });
  if (tapeBr) gsap.to(tapeBr, { rotation: 32, x: 0, duration: 0.6, ease: "power2.out" });
}

function startWind(stack: HTMLElement, baseRotate: number) {
  stopWind(stack, baseRotate);

  const { frame, shadow, photo, tapeTl, tapeBr } = getWindTargets(stack);
  if (!frame) return;

  const tl = gsap.timeline({ repeat: -1, defaults: { ease: "sine.inOut" } });

  tl.to(frame, { rotation: baseRotate + 3.5, x: 7, y: 2, duration: 1.7 })
    .to(frame, { rotation: baseRotate - 2.8, x: -8, y: -1, duration: 2.2 })
    .to(frame, { rotation: baseRotate + 1.8, x: 4, y: 1, duration: 1.5 })
    .to(frame, { rotation: baseRotate - 1.2, x: -3, y: 0, duration: 1.9 });

  if (shadow) {
    tl.to(
      shadow,
      { rotation: baseRotate + 6, x: 4, y: 1, duration: 2.4 },
      0
    ).to(shadow, { rotation: baseRotate + 2, x: -3, y: -1, duration: 2.8 }, 2.4);
  }

  if (photo) {
    gsap.to(photo, {
      x: -5,
      y: 2,
      duration: 1.6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }

  if (tapeTl) {
    gsap.to(tapeTl, {
      rotation: -44,
      x: 3,
      duration: 1.1,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }

  if (tapeBr) {
    gsap.to(tapeBr, {
      rotation: 28,
      x: -3,
      duration: 1.6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 0.25,
    });
  }

  windTimelines.set(stack, tl);
}

export function ArtGalleryGrid({ items, projectEntries }: ArtGalleryGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const lenis = useLenis();
  const [activeItem, setActiveItem] = useState<ArtGalleryItem | null>(null);

  useGSAP(
    () => {
      const grid = gridRef.current;
      if (!grid || reducedMotion === null) return;

      const cards = gsap.utils.toArray<HTMLElement>(".art-gallery-card", grid);
      if (!cards.length) return;

      if (reducedMotion) {
        gsap.set(cards, { clearProps: "all" });
        return;
      }

      if (!lenis) return;

      cards.forEach((card) => {
        const stack = card.querySelector<HTMLElement>(".polaroid-stack");
        const frame = card.querySelector<HTMLElement>(".polaroid-frame");
        gsap.set(card, { opacity: 0 });
        if (stack) {
          gsap.set(stack, {
            y: 72,
            scale: 0.93,
            filter: "blur(2px)",
          });
        }
        if (frame) {
          gsap.set(frame, { rotateZ: 6, transformOrigin: "50% 0%" });
        }
      });

      const batch = ScrollTrigger.batch(cards, {
        start: "top 90%",
        once: true,
        onEnter: (batch) => {
          batch.forEach((card, i) => {
            const stack = card.querySelector<HTMLElement>(".polaroid-stack");
            const frame = card.querySelector<HTMLElement>(".polaroid-frame");

            gsap.to(card, { opacity: 1, duration: 0.55, delay: i * 0.11, ease: "power2.out" });

            if (stack) {
              gsap.to(stack, {
                y: 0,
                scale: 1,
                filter: "blur(0px)",
                duration: 1.15,
                delay: i * 0.11,
                ease: "power3.out",
                onComplete: () => gsap.set(stack, { clearProps: "filter" }),
              });
            }

            if (frame) {
              gsap.to(frame, {
                rotateZ: 0,
                duration: 1.2,
                delay: i * 0.11,
                ease: "power2.out",
                onComplete: () => gsap.set(frame, { clearProps: "rotateZ" }),
              });
            }
          });
        },
      });

      return () => batch.forEach((st) => st.kill());
    },
    { scope: gridRef, dependencies: [items.length, reducedMotion, lenis] }
  );

  const projectMap = useMemo(
    () => Object.fromEntries(projectEntries.map((entry) => [entry.project.slug, entry])),
    [projectEntries]
  );

  const activeProjectEntry = activeItem?.projectSlug
    ? projectMap[activeItem.projectSlug]
    : undefined;

  const handleOpen = useCallback((item: ArtGalleryItem, stack: HTMLElement, rotation: number) => {
    stopWind(stack, rotation);
    setActiveItem(item);
  }, []);

  const handleClose = useCallback(() => {
    setActiveItem(null);
  }, []);

  const handleWindEnter = useCallback(
    (stack: HTMLElement, baseRotate: number) => {
      if (reducedMotion) return;
      startWind(stack, baseRotate);
    },
    [reducedMotion]
  );

  const handleWindLeave = useCallback(
    (stack: HTMLElement, baseRotate: number) => {
      if (reducedMotion) return;
      stopWind(stack, baseRotate);
    },
    [reducedMotion]
  );

  return (
    <>
      <div
        ref={gridRef}
        className="art-gallery-grid grid grid-cols-2 gap-x-4 gap-y-14 sm:gap-x-6 sm:gap-y-16 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-20"
      >
        {items.map((item, index) => {
          const rotation = FRAME_ROTATIONS[index % FRAME_ROTATIONS.length];

          return (
            <article
              key={item.id}
              className="art-gallery-card flex justify-center px-1 pt-4 sm:px-2 sm:pt-5"
              data-cursor="hover"
            >
              <button
                type="button"
                className="polaroid-stack relative w-full max-w-[15rem] cursor-pointer border-0 bg-transparent p-0 text-left sm:max-w-none"
                style={{ "--frame-rotate": `${rotation}deg` } as CSSProperties}
                aria-label={`View ${item.title}, ${item.code}`}
                onMouseEnter={(e) => handleWindEnter(e.currentTarget, rotation)}
                onMouseLeave={(e) => handleWindLeave(e.currentTarget, rotation)}
                onClick={(e) => handleOpen(item, e.currentTarget, rotation)}
              >
              <div className="polaroid-shadow" aria-hidden />

              <span className="polaroid-tape polaroid-tape-tl" aria-hidden />
              <span className="polaroid-tape polaroid-tape-br" aria-hidden />

              <div className="polaroid-frame">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-warmgray/30">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    loading="lazy"
                    className="art-gallery-photo object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </div>

                <div className="px-2.5 pb-4 pt-4 sm:px-3 sm:pb-5 sm:pt-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <h2 className="truncate font-display text-[0.95rem] italic leading-snug text-charcoal sm:text-[1.05rem]">
                      {item.title}
                    </h2>
                    <span className="shrink-0 font-mono text-[10px] tabular-nums text-charcoal/55 sm:text-[11px]">
                      {item.code}
                    </span>
                  </div>
                  <p className="mt-1 font-sans text-[8px] uppercase tracking-[0.2em] text-charcoal/40 sm:text-[9px]">
                    {item.category} · {item.year}
                  </p>
                </div>
              </div>
            </button>
          </article>
        );
      })}
      </div>

      {activeItem && activeProjectEntry && (
        <ProjectModal
          project={activeProjectEntry.project}
          galleryImages={activeProjectEntry.galleryImages}
          heroImage={activeItem.src}
          onClose={handleClose}
        />
      )}

      {activeItem && !activeProjectEntry && (
        <ArtGalleryWorkModal item={activeItem} onClose={handleClose} />
      )}
    </>
  );
}
