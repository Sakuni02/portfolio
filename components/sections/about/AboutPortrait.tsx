"use client";

import Image from "next/image";
import { forwardRef, type Ref } from "react";
import { ARCHITECT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { getPortraitOpacities } from "@/components/sections/about/useAboutImageBlend";

interface AboutPortraitProps {
  className?: string;
  fillContainer?: boolean;
  /** 0 → 1 → 2 across intro, timeline, and instrument sections */
  imageBlend?: number;
}

function PortraitImages({ imageBlend = 0 }: { imageBlend?: number }) {
  const [opacity0, opacity1, opacity2] = getPortraitOpacities(imageBlend);
  const portraits = ARCHITECT.aboutPortraits;

  return (
    <>
      {portraits.map((portrait, index) => {
        const opacity = index === 0 ? opacity0 : index === 1 ? opacity1 : opacity2;
        return (
          <Image
            key={portrait.src}
            src={portrait.src}
            alt={portrait.alt}
            fill
            priority={index === 0}
            className="object-cover transition-opacity duration-150"
            style={{
              opacity,
              objectPosition: portrait.objectPosition,
            }}
            sizes="(max-width: 1280px) 42vw, 360px"
          />
        );
      })}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/35 via-transparent to-foreground/[0.04]" />
    </>
  );
}

export const AboutPortrait = forwardRef<HTMLDivElement, AboutPortraitProps>(
  function AboutPortrait({ className, fillContainer = false, imageBlend = 0 }, ref) {
    return (
      <div ref={ref} className={cn("will-change-transform", className)}>
        <div className="relative h-full w-full">
          <div
            aria-hidden
            className="absolute -bottom-3 -right-3 hidden h-full w-full border border-sepia/25 xl:block"
          />
          <div
            className={cn(
              "relative overflow-hidden bg-charcoal ring-1 ring-inset ring-foreground/10",
              fillContainer ? "h-full w-full" : "aspect-[4/5] w-full"
            )}
          >
            <PortraitImages imageBlend={imageBlend} />
          </div>
        </div>
      </div>
    );
  }
);

export function AboutPortraitSlot({
  slotRef,
  className,
  showMobileImage = false,
  showStaticImage = false,
  showDesktopImage = false,
  imageBlend = 0,
}: {
  slotRef: Ref<HTMLDivElement>;
  className?: string;
  showMobileImage?: boolean;
  /** In-flow portrait on tablet (lg–xl) when scroll animation is off */
  showStaticImage?: boolean;
  showDesktopImage?: boolean;
  imageBlend?: number;
}) {
  const showPlaceholder = !showMobileImage && !showStaticImage && !showDesktopImage;

  return (
    <div ref={slotRef} className={cn("relative w-full max-w-md lg:max-w-none", className)}>
      {showMobileImage ? (
        <div className="lg:hidden">
          <AboutPortrait imageBlend={imageBlend} />
          <div className="mt-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/40 sm:text-[11px]">
            <span className="h-px w-8 bg-sepia/50" aria-hidden />
            {ARCHITECT.aboutPage.title}
          </div>
        </div>
      ) : null}

      {showStaticImage ? (
        <div className="hidden lg:block xl:hidden">
          <AboutPortrait imageBlend={imageBlend} />
          <div className="mt-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/40 sm:text-[11px]">
            <span className="h-px w-8 bg-sepia/50" aria-hidden />
            {ARCHITECT.aboutPage.title}
          </div>
        </div>
      ) : null}

      {showDesktopImage ? (
        <div className="hidden xl:block">
          <AboutPortrait imageBlend={imageBlend} />
        </div>
      ) : null}

      {showPlaceholder ? (
        <div className="hidden aspect-[4/5] w-full xl:block" aria-hidden />
      ) : null}

      {showMobileImage && !showStaticImage && !showDesktopImage ? (
        <div className="hidden aspect-[4/5] w-full xl:block" aria-hidden />
      ) : null}
    </div>
  );
}
