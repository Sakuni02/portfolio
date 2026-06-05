"use client";

import { SplitText } from "@/components/animations/SplitText";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { AboutPortraitSlot } from "@/components/sections/about/AboutPortrait";
import { cn } from "@/lib/utils";
import type { Ref } from "react";

export type CareerTimelineEntry = {
  year: string;
  title: string;
  description: string;
};

export const CAREER_TIMELINE_ENTRIES: CareerTimelineEntry[] = [
  {
    year: "2010",
    title: "Studio Founded",
    description:
      "Opened independent drawing practice in Sri Lanka — first commission: a private library study for a coastal residence.",
  },
  {
    year: "2014",
    title: "First Exhibition",
    description:
      "Galerie Linie, Zurich. Twenty-two drawings on cotton paper; three works acquired on opening night.",
  },
  {
    year: "2018",
    title: "Urban Studies Series",
    description:
      "Began documenting European waterfront districts in pencil — light, proportion, and material recorded on site.",
  },
  {
    year: "2022",
    title: "Gallery Exhibition",
    description:
      "Solo show of architectural drawings; residential perspectives and hand-rendered elevations.",
  },
  {
    year: "2024",
    title: "Conceptual Pavilion",
    description:
      "Published Floating Pavilion study — awarded by ArchDrawing Forum for conceptual architectural drawing.",
  },
];

function TimelineYearBlock({ year, title }: Pick<CareerTimelineEntry, "year" | "title">) {
  return (
    <div>
      <p className="font-display text-4xl italic leading-none text-offwhite md:text-5xl lg:text-6xl">
        {year}
      </p>
      <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.28em] text-sepia">
        {title}
      </p>
    </div>
  );
}

function TimelineDescription({ description }: Pick<CareerTimelineEntry, "description">) {
  return (
    <p className="font-display text-base leading-snug text-offwhite/90 md:text-lg md:leading-snug">
      {description}
    </p>
  );
}

interface CareerTimelineProps {
  entries?: CareerTimelineEntry[];
  className?: string;
  sectionRef?: Ref<HTMLElement>;
  imageSlotRef?: Ref<HTMLDivElement>;
}

export function CareerTimeline({
  entries = CAREER_TIMELINE_ENTRIES,
  className,
  sectionRef,
  imageSlotRef,
}: CareerTimelineProps) {
  return (
    <section
      ref={sectionRef}
      className={cn(
        "bg-[#0D0D0D] px-6 py-12 text-offwhite sm:py-16 md:px-10 md:py-20 lg:px-16",
        className
      )}
    >
      <div className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-12 lg:items-start lg:gap-10 xl:gap-14">
        <div className="lg:col-span-7">
          <SplitText
            text="Career Timeline"
            as="h2"
            className="mb-10 font-display text-4xl font-light text-offwhite md:mb-12 md:text-5xl"
          />

          <div className="relative mx-auto max-w-4xl lg:mx-0">
        {/* Center axis — desktop */}
        <div
          className="pointer-events-none absolute left-1/2 top-4 bottom-4 hidden w-px -translate-x-1/2 bg-sepia/60 md:block"
          aria-hidden
        />

        <ul className="flex flex-col">
          {entries.map((entry, i) => {
            const yearOnLeft = i % 2 === 0;

            return (
              <li key={`${entry.year}-${entry.title}`}>
                <ScrollReveal delay={i * 0.08}>
                  {/* Mobile: stacked */}
                  <div className="relative border-l border-sepia/40 py-6 pl-6 md:hidden">
                    <span
                      className="absolute -left-[5px] top-6 block h-2 w-2 rounded-full bg-sepia"
                      aria-hidden
                    />
                    <TimelineYearBlock year={entry.year} title={entry.title} />
                    <div className="mt-3">
                      <TimelineDescription description={entry.description} />
                    </div>
                  </div>

                  {/* Desktop: zigzag — text blocks hug center (~32px gap) */}
                  <div className="relative hidden items-center py-7 md:grid md:grid-cols-[1fr_12px_1fr] md:gap-x-8 md:py-9">
                    <div
                      className={cn(
                        "flex md:order-1",
                        yearOnLeft ? "justify-end text-right" : "justify-end text-right"
                      )}
                    >
                      <div className="w-full max-w-[17rem] lg:max-w-[19rem]">
                        {yearOnLeft ? (
                          <TimelineYearBlock year={entry.year} title={entry.title} />
                        ) : (
                          <TimelineDescription description={entry.description} />
                        )}
                      </div>
                    </div>

                    <div className="relative flex justify-center md:order-2">
                      <span
                        className="relative z-10 block h-2 w-2 shrink-0 rounded-full bg-sepia ring-4 ring-[#0D0D0D]"
                        aria-hidden
                      />
                    </div>

                    <div className="flex justify-start text-left md:order-3">
                      <div className="w-full max-w-[17rem] lg:max-w-[19rem]">
                        {yearOnLeft ? (
                          <TimelineDescription description={entry.description} />
                        ) : (
                          <TimelineYearBlock year={entry.year} title={entry.title} />
                        )}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </li>
            );
          })}
        </ul>
          </div>
        </div>

        <div className="hidden xl:col-span-5 xl:block xl:pt-24">
          {imageSlotRef ? (
            <AboutPortraitSlot
              slotRef={imageSlotRef}
              className="mx-auto lg:ml-auto lg:max-w-md"
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
