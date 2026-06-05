"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SplitText } from "@/components/animations/SplitText";
import { CLIENT_TESTIMONIALS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;
const AUTOPLAY_MS = 3800;

function QuoteIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 40"
      className={cn("h-10 w-12 text-sepia/80 md:h-12 md:w-14", className)}
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M0 40V24.8C0 14.4 6.4 6.4 16 2.4L19.2 8.8C12 11.2 8 15.2 8 20.8H19.2V40H0ZM28.8 40V24.8c0-10.4 6.4-18.4 16-22.4L48 8.8c-7.2 2.4-11.2 6.4-11.2 12H48V40H28.8Z"
      />
    </svg>
  );
}

function NavButton({
  direction,
  onClick,
  label,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="group flex h-11 w-11 items-center justify-center rounded-full border border-offwhite/20 bg-offwhite/5 transition-colors hover:border-sepia/60 hover:bg-offwhite/10"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden
        className={cn(
          "text-offwhite transition-transform group-hover:text-sepia",
          direction === "prev" && "rotate-180"
        )}
      >
        <path
          d="M3 8H13M13 8L9 4M13 8L9 12"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export function ClientTestimonials() {
  const reducedMotion = useReducedMotion();
  const { eyebrow, title, description, items } = CLIENT_TESTIMONIALS;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const count = items.length;
  const active = items[activeIndex];

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(((index % count) + count) % count);
    },
    [count]
  );

  const paginate = useCallback(
    (step: number) => goTo(activeIndex + step),
    [activeIndex, goTo]
  );

  useEffect(() => {
    if (reducedMotion || isPaused || count <= 1) return;
    const id = window.setInterval(() => paginate(1), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [reducedMotion, isPaused, count, paginate]);

  return (
    <section
      aria-label={title}
      className="relative z-10 overflow-hidden border-b border-sepia/25 bg-charcoal text-offwhite"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(139,111,71,0.08)_0%,transparent_45%,rgba(245,243,238,0.03)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-sepia/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-offwhite/5 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-sepia/45 to-transparent"
      />

      <div className="relative mx-auto max-w-7xl px-[max(1.25rem,env(safe-area-inset-left))] py-16 pr-[max(1.25rem,env(safe-area-inset-right))] sm:px-6 sm:py-20 md:px-10 md:py-32 lg:px-16">
        <div className="grid gap-10 sm:gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4 lg:pt-2">
            <motion.p
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, ease: EASE }}
              className="font-sans text-[11px] uppercase tracking-[0.35em] text-offwhite/55"
            >
              {eyebrow}
            </motion.p>
            <SplitText
              text={title}
              as="h2"
              className="mt-4 block font-display text-[clamp(2rem,8vw,2.5rem)] font-light leading-tight text-offwhite sm:mt-5 sm:text-4xl md:text-5xl lg:text-[3.25rem]"
            />
            <motion.p
              initial={reducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.12, ease: EASE }}
              className="mt-6 max-w-xs font-sans text-sm leading-relaxed text-offwhite/60 md:text-base"
            >
              {description}
            </motion.p>

            <div className="mt-10 flex items-center gap-4">
              <NavButton
                direction="prev"
                onClick={() => paginate(-1)}
                label="Previous testimonial"
              />
              <NavButton
                direction="next"
                onClick={() => paginate(1)}
                label="Next testimonial"
              />
              <span className="ml-2 font-mono text-xs tracking-[0.25em] text-offwhite/45">
                {String(activeIndex + 1).padStart(2, "0")}
                <span className="mx-1.5 text-offwhite/25">/</span>
                {String(count).padStart(2, "0")}
              </span>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="relative overflow-hidden rounded-sm border border-offwhite/10 bg-offwhite/[0.03] p-5 backdrop-blur-sm sm:p-8 md:p-10 lg:p-12">
              <QuoteIcon className="mb-8" />

              <div className="min-h-[12rem] md:min-h-[10.5rem] lg:min-h-[9.5rem]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.figure
                    key={activeIndex}
                    initial={
                      reducedMotion ? false : { opacity: 0, y: 28, filter: "blur(6px)" }
                    }
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={
                      reducedMotion
                        ? undefined
                        : { opacity: 0, y: -20, filter: "blur(4px)" }
                    }
                    transition={{ duration: 0.32, ease: EASE }}
                  >
                    <blockquote className="font-display text-xl font-light leading-snug text-offwhite sm:text-2xl md:text-3xl lg:text-[2rem] lg:leading-[1.35]">
                      &ldquo;{active.quote}&rdquo;
                    </blockquote>

                    <figcaption className="mt-10 flex flex-col gap-6 border-t border-offwhite/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          aria-hidden
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-sepia/40 bg-sepia/15 font-display text-lg text-sepia"
                        >
                          {active.name
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-sans text-sm font-medium text-offwhite">
                            {active.name}
                          </p>
                          <p className="mt-0.5 font-sans text-xs text-offwhite/55">
                            {active.role}, {active.company}
                          </p>
                        </div>
                      </div>
                      <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-sepia">
                        {active.project}
                      </p>
                    </figcaption>
                  </motion.figure>
                </AnimatePresence>
              </div>
            </div>

            <div
              className="mt-6 flex gap-2"
              role="tablist"
              aria-label="Select testimonial"
            >
              {items.map((item, i) => (
                <button
                  key={item.name}
                  type="button"
                  role="tab"
                  aria-selected={i === activeIndex}
                  aria-label={`View testimonial from ${item.name}`}
                  onClick={() => goTo(i)}
                  className="group flex-1 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sepia/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
                >
                  <span
                    className={cn(
                      "block h-px w-full origin-left transition-all duration-500",
                      i === activeIndex
                        ? "scale-x-100 bg-sepia"
                        : "scale-x-100 bg-offwhite/20 group-hover:bg-offwhite/40"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
