"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

const PIN_CLEARANCE = "pt-7";

function PushPin() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-3 z-30 -translate-x-1/2"
    >
      <div className="relative flex flex-col items-center">
        <div className="h-4 w-4 rounded-full bg-[#d62828] shadow-[inset_0_-2px_4px_rgba(0,0,0,0.25),0_3px_6px_rgba(0,0,0,0.32)]" />
        <div className="h-[11px] w-[3px] rounded-full bg-gradient-to-b from-neutral-300 via-neutral-400 to-neutral-600" />
      </div>
      <div className="absolute left-1/2 top-2 h-6 w-10 -translate-x-1/2 rounded-full bg-black/[0.14] blur-[5px]" />
    </div>
  );
}

function PaperCurl({ side }: { side: "left" | "right" }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute bottom-0 z-[2] h-10 w-10",
        side === "left" ? "left-0" : "right-0"
      )}
    >
      <div
        className={cn(
          "absolute bottom-0 h-full w-full opacity-90",
          side === "left"
            ? "left-0 origin-bottom-left rounded-tr-[100%] bg-gradient-to-tr from-[#e8e0d4] via-[#f5efe6] to-transparent shadow-[2px_-1px_4px_rgba(26,26,24,0.12)]"
            : "right-0 origin-bottom-right rounded-tl-[100%] bg-gradient-to-tl from-[#e5ddd0] via-[#f2ebe2] to-transparent shadow-[-2px_-1px_5px_rgba(26,26,24,0.14)]"
        )}
      />
    </div>
  );
}

interface PinnedPaperNoteProps {
  children: React.ReactNode;
  rotation: number;
  className?: string;
  delay?: number;
  variant?: "intro" | "service";
}

export function PinnedPaperNote({
  children,
  rotation,
  className,
  delay = 0,
  variant = "service",
}: PinnedPaperNoteProps) {
  const reducedMotion = useReducedMotion();
  const curlSide = rotation >= 0 ? "right" : "left";

  return (
    <motion.article
      initial={reducedMotion ? false : { opacity: 0, y: 28, rotate: rotation - 2 }}
      whileInView={{ opacity: 1, y: 0, rotate: rotation }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, delay, ease: EASE }}
      whileHover={
        reducedMotion
          ? undefined
          : {
              y: -10,
              rotate: rotation + 1.5,
              transition: { duration: 0.35, ease: EASE },
            }
      }
      className={cn(
        "group relative mx-auto w-full max-w-[340px] overflow-visible",
        variant === "intro" && "max-w-sm lg:max-w-none",
        className
      )}
      style={{ perspective: 1200 }}
    >
      {/* Pin sits above the sheet — never clipped */}
      <PushPin />

      {/* Shadow slab — reads as paper lifted off the board */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-3 bottom-0 top-8 -z-10 rounded-sm",
          "bg-black/[0.06] blur-[1px]",
          "translate-x-1 translate-y-3 rotate-[0.5deg]",
          "shadow-[4px_10px_0_rgba(139,111,71,0.04),6px_18px_28px_rgba(26,26,24,0.14)]",
          "transition-transform duration-300 group-hover:translate-x-1.5 group-hover:translate-y-4"
        )}
      />

      <div
        className={cn(
          "relative mt-1 overflow-visible rounded-[3px]",
          PIN_CLEARANCE,
          "transition-transform duration-300 group-hover:-translate-y-0.5",
          "[transform-style:preserve-3d]"
        )}
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-[3px]",
            "bg-gradient-to-br from-[#fdf9f2] via-[#faf6ef] to-[#f0e9de]",
            "before:pointer-events-none before:absolute before:inset-0 before:z-[1]",
            "before:bg-gradient-to-b before:from-white/50 before:via-transparent before:to-black/[0.03]",
            "after:pointer-events-none after:absolute after:inset-x-0 after:top-0 after:z-[1] after:h-px after:bg-white/70",
            "shadow-[inset_0_1px_0_rgba(255,255,255,0.85),1px_2px_0_rgba(139,111,71,0.08),3px_8px_0_rgba(26,26,24,0.04),5px_14px_24px_rgba(26,26,24,0.11),12px_32px_48px_rgba(26,26,24,0.08)]",
            "ring-1 ring-[#d4c9b8]/40",
            "transition-[box-shadow,transform] duration-300",
            "group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.9),2px_4px_0_rgba(139,111,71,0.1),6px_16px_0_rgba(26,26,24,0.05),8px_22px_32px_rgba(26,26,24,0.15),16px_40px_56px_rgba(26,26,24,0.1)]",
            variant === "intro"
              ? "min-h-[280px] px-7 pb-9 md:min-h-[300px]"
              : "min-h-[220px] px-6 pb-8 md:min-h-[240px]"
          )}
          style={
            reducedMotion
              ? undefined
              : {
                  transform: `rotateX(2deg) rotateY(${rotation > 0 ? 1.5 : -1.5}deg)`,
                }
          }
        >
          <PaperCurl side={curlSide} />
          <div className="relative z-10 pt-2 text-charcoal">{children}</div>
        </div>
      </div>
    </motion.article>
  );
}
