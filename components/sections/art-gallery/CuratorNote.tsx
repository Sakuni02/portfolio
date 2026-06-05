import { ARCHITECT } from "@/lib/constants";

const QUOTE =
  "Spend longer than you think you should with the smaller drawings. They are the ones doing the quiet work.";

export function CuratorNote() {
  const [beforeDrawings, afterDrawings] = QUOTE.split("drawings");

  return (
    <section
      className="mt-24 border-t border-charcoal/[0.06] pt-20 text-center dark:border-offwhite/10 md:mt-32 md:pt-28 lg:mt-40 lg:pt-32"
      aria-labelledby="curator-note-heading"
    >
      <p
        id="curator-note-heading"
        className="font-sans text-[10px] uppercase tracking-[0.34em] text-charcoal/45 dark:text-offwhite/45 sm:text-[11px]"
      >
        A note from the curator
      </p>

      <blockquote className="mx-auto mt-10 max-w-[42rem] px-2 font-display text-[1.65rem] font-normal italic leading-[1.35] text-charcoal dark:text-offwhite sm:mt-12 sm:max-w-3xl sm:text-3xl md:mt-14 md:text-[2.125rem] lg:max-w-4xl lg:text-[2.5rem] lg:leading-[1.32]">
        <span aria-hidden className="text-charcoal/90 dark:text-offwhite/90">
          &ldquo;
        </span>
        {beforeDrawings}
        <span className="relative inline-block">
          drawings
          <span
            className="absolute left-[0.55em] top-full mt-1.5 block h-1.5 w-1.5 rounded-full bg-charcoal dark:bg-offwhite"
            aria-hidden
          />
        </span>
        {afterDrawings}
        <span aria-hidden className="text-charcoal/90 dark:text-offwhite/90">
          &rdquo;
        </span>
      </blockquote>

      <div className="relative mx-auto mt-16 max-w-md px-4 sm:mt-20 md:mt-24">
        <span
          className="mx-auto mb-8 block h-10 w-10 rounded-full border border-charcoal/25 dark:border-offwhite/25 sm:h-11 sm:w-11"
          aria-hidden
        />

        <div className="flex items-center justify-center gap-4 sm:gap-6">
          <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.22em] text-charcoal/70 dark:text-offwhite/70 sm:text-[10px]">
            {ARCHITECT.name}
          </span>
          <span
            className="h-px min-w-[3rem] flex-1 max-w-[8rem] bg-charcoal/20 dark:bg-offwhite/20 sm:max-w-[10rem]"
            aria-hidden
          />
          <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.22em] text-charcoal/70 dark:text-offwhite/70 sm:text-[10px]">
            {ARCHITECT.city} · 09:54
          </span>
        </div>
      </div>
    </section>
  );
}
