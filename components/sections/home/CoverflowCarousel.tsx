"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  type PanInfo,
  type Transition,
} from "framer-motion";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

const SWIPE_THRESHOLD = 56;
const DRAG_COMMIT_RATIO = 0.22;
const HOVER_INTENT_MS = 200;
const LAYOUT_LOCK_MS = 380;

const COVERFLOW = {
  maxVisibleOffset: 5,
  activeScale: 1.12,
  wingScale: 0.88,
  farScale: 0.78,
  /** translateZ (px) — center forward; wings ~depth 150–200 for layered overlap */
  activeZ: 110,
  wingZ: -150,
  farZ: -200,
  farZStep: 28,
  perspective: 1400,
  /** Sharp iTunes fold (50–55°) */
  rotateYMax: 52,
  /** Base horizontal push (fraction of stage width) */
  xSpreadFirstRatio: 0.26,
  xSpreadStepRatio: 0.075,
  /** Negative-stretch pull inward per index — layered overlap */
  xOverlapPullRatio: 0.048,
};

const ACTIVE_Z_INDEX = 30;
const ACTIVE_Z_INDEX_HOVER = 32;

/** Premium layout spring when cards swap on hover (~0.45s feel) */
const LAYOUT_SPRING: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 32,
  mass: 0.72,
};

const LUXURY_EASE = [0.25, 1, 0.5, 1] as const;

const HOVER_POP_TRANSITION: Transition = {
  duration: 0.32,
  ease: LUXURY_EASE,
};

/** Center-only hover pop (inner layer; layout scale stays on parent) */
const ACTIVE_CARD_REST = {
  scale: 1,
  y: 0,
  z: 0,
  filter: "brightness(1)",
};

const ACTIVE_CARD_HOVER = {
  scale: 1.12,
  y: -10,
  z: 32,
  filter: "brightness(1.06)",
};

const REFLECT_HOVER = { opacity: 0.5, y: 10 };
const REFLECT_REST = { opacity: 0.34, y: 0 };

interface CoverflowCarouselProps {
  projects: Project[];
  activeIndex: number;
  onGoTo: (index: number) => void;
  onPaginate: (step: number) => void;
  className?: string;
}

function getWrappedOffset(
  index: number,
  virtualActive: number,
  count: number
): number {
  let offset = index - virtualActive;
  const half = count / 2;
  if (offset > half) offset -= count;
  if (offset < -half) offset += count;
  return offset;
}

type CardMotion = {
  rotateY: number;
  x: number;
  scale: number;
  opacity: number;
  z: number;
  filter: string;
  pointerEvents: "auto" | "none";
};

function getSpreadConfig(stageWidth: number) {
  const isNarrow = stageWidth < 640;

  return {
    firstRatio: isNarrow ? 0.21 : COVERFLOW.xSpreadFirstRatio,
    stepRatio: isNarrow ? 0.058 : COVERFLOW.xSpreadStepRatio,
    overlapRatio: isNarrow ? 0.04 : COVERFLOW.xOverlapPullRatio,
  };
}

function getHorizontalSpreadPx(offset: number, stageWidth: number): number {
  const abs = Math.abs(offset);
  if (abs < 0.35) return 0;

  const { firstRatio, stepRatio, overlapRatio } = getSpreadConfig(stageWidth);
  const sign = Math.sign(offset);
  const first = Math.min(abs, 1) * stageWidth * firstRatio;
  const stack = Math.max(0, abs - 1) * stageWidth * stepRatio;
  const gross = first + stack;
  /** Pull wings inward (Swiper stretch: -40 to -60 equivalent) */
  const overlapPull = stageWidth * overlapRatio * abs;

  return sign * Math.max(0, gross - overlapPull);
}

function getCardMotion(
  offset: number,
  reducedMotion: boolean,
  maxOffset: number,
  stageWidth: number
): CardMotion {
  const abs = Math.abs(offset);

  if (abs > maxOffset) {
    return {
      rotateY: 0,
      x: 0,
      scale: 0.5,
      opacity: 0,
      z: -200,
      filter: "brightness(0.4)",
      pointerEvents: "none",
    };
  }

  if (reducedMotion) {
    const scale =
      abs < 0.35
        ? COVERFLOW.activeScale
        : Math.max(COVERFLOW.farScale, COVERFLOW.activeScale - abs * 0.4);
    return {
      rotateY: 0,
      x: getHorizontalSpreadPx(offset, stageWidth),
      scale,
      opacity: 1 - Math.min(abs, 1) * 0.4,
      z: abs < 0.35 ? COVERFLOW.activeZ : COVERFLOW.wingZ,
      filter: "brightness(1)",
      pointerEvents: "auto",
    };
  }

  const sign = Math.sign(offset);
  const rotateY =
    abs < 0.35
      ? 0
      : -sign * Math.min(COVERFLOW.rotateYMax, abs * COVERFLOW.rotateYMax);

  const translateX = getHorizontalSpreadPx(offset, stageWidth);

  const z =
    abs < 0.35
      ? COVERFLOW.activeZ
      : abs < 1.05
        ? COVERFLOW.wingZ
        : COVERFLOW.farZ -
          Math.max(0, abs - 1.05) * COVERFLOW.farZStep;
  const opacity = Math.max(0, 1 - Math.max(0, abs - (maxOffset - 1.2)) * 0.42);
  const brightness = abs < 0.35 ? 1 : Math.max(0.45, 0.85 - abs * 0.04);

  const scale =
    abs < 0.35
      ? COVERFLOW.activeScale
      : abs < 1.05
        ? COVERFLOW.wingScale
        : Math.max(
            COVERFLOW.farScale,
            COVERFLOW.wingScale - (abs - 1) * 0.07
          );

  return {
    rotateY,
    x: translateX,
    scale,
    opacity: abs > maxOffset ? 0 : opacity,
    z,
    filter: `brightness(${brightness})`,
    pointerEvents: "auto",
  };
}

export function CoverflowCarousel({
  projects,
  activeIndex,
  onGoTo,
  onPaginate,
  className,
}: CoverflowCarouselProps) {
  const reducedMotion = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageWidth, setStageWidth] = useState(400);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [centerHovered, setCenterHovered] = useState(false);
  const [isLayoutLocked, setIsLayoutLocked] = useState(false);
  const count = projects.length;

  const activeIndexRef = useRef(activeIndex);
  const isLayoutLockedRef = useRef(false);
  const hoverIntentRef = useRef<number | null>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const layoutLockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstActiveIndexRef = useRef(true);

  activeIndexRef.current = activeIndex;
  isLayoutLockedRef.current = isLayoutLocked;

  const clearHoverIntent = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    hoverIntentRef.current = null;
  }, []);

  const lockLayout = useCallback(() => {
    if (layoutLockTimerRef.current) {
      clearTimeout(layoutLockTimerRef.current);
    }
    setIsLayoutLocked(true);
    setCenterHovered(false);
    layoutLockTimerRef.current = setTimeout(() => {
      setIsLayoutLocked(false);
      layoutLockTimerRef.current = null;
    }, LAYOUT_LOCK_MS);
  }, []);

  useEffect(() => {
    if (isFirstActiveIndexRef.current) {
      isFirstActiveIndexRef.current = false;
      return;
    }
    lockLayout();
    return () => {
      if (layoutLockTimerRef.current) {
        clearTimeout(layoutLockTimerRef.current);
      }
    };
  }, [activeIndex, lockLayout]);

  useEffect(() => {
    return () => {
      clearHoverIntent();
      if (layoutLockTimerRef.current) {
        clearTimeout(layoutLockTimerRef.current);
      }
    };
  }, [clearHoverIntent]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const ro = new ResizeObserver(([entry]) => {
      setStageWidth(entry.contentRect.width || 400);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const virtualActive =
    activeIndex - (reducedMotion ? 0 : dragOffset / Math.max(stageWidth, 280));

  const layoutTransition: Transition =
    isDragging || reducedMotion ? { duration: reducedMotion ? 0.2 : 0 } : LAYOUT_SPRING;

  const scheduleHoverToCenter = useCallback(
    (index: number) => {
      if (reducedMotion || isDragging || isLayoutLockedRef.current) return;
      if (index === activeIndexRef.current) return;

      clearHoverIntent();
      hoverIntentRef.current = index;

      hoverTimerRef.current = setTimeout(() => {
        if (hoverIntentRef.current !== index) return;
        if (index === activeIndexRef.current) return;
        if (isDragging || isLayoutLockedRef.current) return;

        hoverIntentRef.current = null;
        hoverTimerRef.current = null;
        onGoTo(index);
      }, HOVER_INTENT_MS);
    },
    [clearHoverIntent, isDragging, onGoTo, reducedMotion]
  );

  const cancelHoverIntent = useCallback(
    (index: number) => {
      if (hoverIntentRef.current === index) {
        clearHoverIntent();
      }
    },
    [clearHoverIntent]
  );

  const handleStageMouseLeave = useCallback(() => {
    clearHoverIntent();
    setCenterHovered(false);
  }, [clearHoverIntent]);

  const handleDrag = useCallback(
    (_: unknown, info: PanInfo) => {
      if (reducedMotion) return;
      setDragOffset(info.offset.x);
    },
    [reducedMotion]
  );

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
    setCenterHovered(false);
    clearHoverIntent();
  }, [clearHoverIntent]);

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      setIsDragging(false);
      setDragOffset(0);

      const commitDistance = stageWidth * DRAG_COMMIT_RATIO;
      if (info.offset.x < -SWIPE_THRESHOLD || info.offset.x < -commitDistance) {
        onPaginate(1);
      } else if (info.offset.x > SWIPE_THRESHOLD || info.offset.x > commitDistance) {
        onPaginate(-1);
      }
    },
    [onPaginate, stageWidth]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        onPaginate(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onPaginate(1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onPaginate]);

  if (count === 0) return null;

  return (
    <div
      className={cn("relative w-full shrink-0", className)}
      role="region"
      aria-roledescription="carousel"
      aria-label={`Signature projects. ${projects[activeIndex]?.title ?? ""}, ${activeIndex + 1} of ${count}`}
      onMouseLeave={handleStageMouseLeave}
    >
      <div className="relative mx-auto w-full max-w-[100vw] overflow-visible px-1 sm:px-4 lg:px-6">
      <motion.div
        ref={stageRef}
        className="relative mx-auto h-[min(54vh,400px)] w-full cursor-grab touch-pan-y active:cursor-grabbing overflow-visible sm:h-[min(56vh,500px)] md:h-[min(58vh,540px)] lg:h-[min(62vh,580px)]"
        drag={reducedMotion ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.08}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        style={{
          perspective: reducedMotion ? undefined : COVERFLOW.perspective,
          perspectiveOrigin: "50% 50%",
        }}
      >
        <div
          className="relative h-full w-full overflow-visible"
          style={{
            transformStyle: reducedMotion ? undefined : "preserve-3d",
          }}
        >
          {projects.map((project, i) => {
            const offset = getWrappedOffset(i, virtualActive, count);
            const isCenter = i === activeIndex;
            const motionState = getCardMotion(
              offset,
              !!reducedMotion,
              COVERFLOW.maxVisibleOffset,
              stageWidth
            );

            const transformOrigin =
              offset < -0.05
                ? "right center"
                : offset > 0.05
                  ? "left center"
                  : "center center";

            const zIndex = isCenter
              ? centerHovered
                ? ACTIVE_Z_INDEX_HOVER
                : ACTIVE_Z_INDEX
              : Math.max(8, Math.round(20 - Math.abs(offset) * 1.75));

            const canCenterHover =
              isCenter && !reducedMotion && !isDragging && !isLayoutLocked;

            return (
              <div
                key={project.slug}
                className="absolute left-1/2 top-1/2 aspect-square h-[min(74%,320px)] w-auto max-w-[min(54vw,300px)] -translate-x-1/2 -translate-y-1/2 sm:h-[min(88%,400px)] sm:max-w-[min(72vw,420px)] md:h-[min(92%,500px)] md:max-w-[min(54vw,520px)] lg:max-w-[min(48vw,560px)]"
                style={{
                  zIndex,
                  pointerEvents: motionState.pointerEvents,
                }}
              >
                <motion.div
                  className="h-full w-full"
                  style={{
                    transformStyle: "preserve-3d",
                    transformOrigin,
                    backfaceVisibility: "hidden",
                  }}
                  initial={false}
                  animate={{
                    rotateY: motionState.rotateY,
                    x: motionState.x,
                    scale: motionState.scale,
                    opacity: motionState.opacity,
                    z: motionState.z,
                    filter: motionState.filter,
                  }}
                  transition={layoutTransition}
                >
                  {isCenter ? (
                    <div className="relative h-full w-full">
                      <motion.div
                        className="relative z-10 h-full w-full"
                        style={{ transformStyle: "preserve-3d" }}
                        initial={false}
                        animate={
                          canCenterHover && centerHovered
                            ? ACTIVE_CARD_HOVER
                            : ACTIVE_CARD_REST
                        }
                        onHoverStart={() => {
                          if (canCenterHover) setCenterHovered(true);
                        }}
                        onHoverEnd={() => {
                          if (canCenterHover) setCenterHovered(false);
                        }}
                        transition={{
                          scale: HOVER_POP_TRANSITION,
                          y: HOVER_POP_TRANSITION,
                          z: HOVER_POP_TRANSITION,
                          filter: HOVER_POP_TRANSITION,
                        }}
                      >
                        <Link
                          href={`/projects/${project.slug}`}
                          className={cn(
                            "relative block h-full w-full overflow-hidden bg-white/5",
                            "border border-offwhite/30",
                            "shadow-[0_28px_70px_-16px_rgba(0,0,0,0.65)]",
                            "transition-[box-shadow] duration-[420ms] ease-[cubic-bezier(0.25,1,0.5,1)]",
                            centerHovered &&
                              canCenterHover &&
                              "shadow-[0_48px_100px_-20px_rgba(0,0,0,0.8)]"
                          )}
                        >
                          <CardImage
                            project={project}
                            priority
                            dimmed={false}
                          />
                        </Link>
                      </motion.div>

                      <motion.div
                        aria-hidden
                        className="pointer-events-none absolute inset-x-0 top-full mt-1 h-[min(22%,4.5rem)] overflow-hidden"
                        initial={false}
                        animate={
                          centerHovered && canCenterHover
                            ? REFLECT_HOVER
                            : REFLECT_REST
                        }
                        transition={HOVER_POP_TRANSITION}
                        style={{ transformOrigin: "top center" }}
                      >
                        <div className="relative h-full w-full scale-y-[-1]">
                          <Image
                            src={project.coverImage}
                            alt=""
                            fill
                            className="object-cover object-top"
                            sizes="(max-width: 640px) 320px, 650px"
                            draggable={false}
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/20 via-charcoal/50 to-charcoal" />
                        </div>
                      </motion.div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      aria-label={`Show ${project.title}`}
                      onClick={() => onGoTo(i)}
                      onMouseEnter={() => scheduleHoverToCenter(i)}
                      onMouseLeave={() => cancelHoverIntent(i)}
                      onFocus={() => scheduleHoverToCenter(i)}
                      onBlur={() => cancelHoverIntent(i)}
                      disabled={isLayoutLocked}
                      className={cn(
                        "relative block h-full w-full cursor-pointer overflow-hidden bg-white/5",
                        "border border-offwhite/15 transition-colors hover:border-offwhite/30",
                        isLayoutLocked && "pointer-events-none"
                      )}
                    >
                      <CardImage project={project} priority={false} dimmed />
                    </button>
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {count > 1 && (
          <div className="mt-3 flex items-center justify-center gap-2 px-4 sm:mt-4">
            {projects.map((project, i) => (
              <button
                key={project.slug}
                type="button"
                aria-label={`Go to ${project.title}`}
                aria-current={i === activeIndex ? "true" : undefined}
                onClick={() => onGoTo(i)}
                onMouseEnter={() => scheduleHoverToCenter(i)}
                onMouseLeave={() => cancelHoverIntent(i)}
                className={cn(
                  "rounded-full transition-all duration-500 ease-out",
                  i === activeIndex
                    ? "h-2 w-8 bg-sepia"
                    : "h-2 w-2 bg-offwhite/25 hover:bg-offwhite/50"
                )}
              />
            ))}
          </div>
      )}
      </div>
    </div>
  );
}

function CardImage({
  project,
  priority,
  dimmed,
}: {
  project: Project;
  priority: boolean;
  dimmed: boolean;
}) {
  return (
    <>
      <Image
        src={project.coverImage}
        alt={project.title}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 320px, 650px"
        priority={priority}
        draggable={false}
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-transparent to-sepia/5"
        aria-hidden
      />
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-300",
          dimmed
            ? "bg-charcoal/35"
            : "bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(26,26,24,0.35)_100%)]"
        )}
        aria-hidden
      />
    </>
  );
}
