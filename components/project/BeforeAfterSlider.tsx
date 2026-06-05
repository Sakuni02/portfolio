"use client";

import {
  ReactCompareSlider,
  ReactCompareSliderHandle,
  ReactCompareSliderImage,
} from "react-compare-slider";

export interface BeforeAfterSliderProps {
  drawingSrc: string;
  realSrc: string;
  projectTitle?: string;
  drawingLabel?: string;
  realLabel?: string;
  className?: string;
}

export function BeforeAfterSlider({
  drawingSrc,
  realSrc,
  projectTitle = "Project",
  drawingLabel = "Drawing",
  realLabel = "Photograph",
  className,
}: BeforeAfterSliderProps) {
  return (
    <div className={className}>
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-warmgray/30">
        <ReactCompareSlider
          className="h-full w-full"
          handle={
            <ReactCompareSliderHandle
              buttonStyle={{
                backdropFilter: "none",
                background: "transparent",
                border: "none",
                boxShadow: "none",
                width: "100%",
                height: "100%",
              }}
              linesStyle={{ opacity: 0, width: 0 }}
            >
              <span className="pointer-events-none relative flex h-full w-10 -translate-x-1/2 items-center justify-center">
                <span className="absolute h-full w-px bg-offwhite/90" />
                <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-offwhite/80 bg-charcoal/75 shadow-lg backdrop-blur-sm">
                  <span className="flex gap-1">
                    <span className="block h-1.5 w-1.5 rounded-full bg-offwhite" />
                    <span className="block h-1.5 w-1.5 rounded-full bg-offwhite" />
                  </span>
                </span>
              </span>
            </ReactCompareSliderHandle>
          }
          itemOne={
            <ReactCompareSliderImage
              src={drawingSrc}
              alt={`${projectTitle} — pencil drawing`}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          }
          itemTwo={
            <ReactCompareSliderImage
              src={realSrc}
              alt={`${projectTitle} — photograph`}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          }
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between bg-gradient-to-t from-charcoal/55 to-transparent px-5 pb-4 pt-12">
          <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-offwhite/90">
            {drawingLabel}
          </span>
          <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-offwhite/90">
            {realLabel}
          </span>
        </div>
      </div>

      <p className="mt-3 text-center font-sans text-[11px] uppercase tracking-[0.18em] text-foreground/40">
        Drag to compare
      </p>
    </div>
  );
}
