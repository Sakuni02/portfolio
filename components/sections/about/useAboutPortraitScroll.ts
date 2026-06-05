"use client";

import { useLenis } from "lenis/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { RefObject } from "react";

gsap.registerPlugin(ScrollTrigger);

export type SlotCoords = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export function measureSlot(slot: HTMLElement | null): SlotCoords | null {
  if (!slot) return null;
  const rect = slot.getBoundingClientRect();
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };
}

function applyCoords(portrait: HTMLElement, coords: SlotCoords | null) {
  if (!coords) return;
  gsap.set(portrait, {
    top: coords.top,
    left: coords.left,
    width: coords.width,
    height: coords.height,
    opacity: 1,
    visibility: "visible",
  });
}

function hidePortrait(portrait: HTMLElement) {
  gsap.set(portrait, { opacity: 0, visibility: "hidden" });
}

function blendCoords(
  from: SlotCoords,
  to: SlotCoords,
  progress: number
): SlotCoords {
  const t = gsap.utils.clamp(0, 1, progress);
  return {
    top: gsap.utils.interpolate(from.top, to.top, t),
    left: gsap.utils.interpolate(from.left, to.left, t),
    width: gsap.utils.interpolate(from.width, to.width, t),
    height: gsap.utils.interpolate(from.height, to.height, t),
  };
}

export type ScrollWaypoints = {
  introToTimeline: { start: number; end: number };
  timelineToInstrument: { start: number; end: number };
  animationEnd: number;
};

export function computeWaypoints(
  timelineSection: HTMLElement,
  instrumentSection: HTMLElement
): ScrollWaypoints {
  const viewport = window.innerHeight;

  const timelineToInstrument = {
    start: instrumentSection.offsetTop - viewport,
    end: instrumentSection.offsetTop - viewport * 0.32,
  };

  return {
    introToTimeline: {
      start: timelineSection.offsetTop - viewport,
      end: timelineSection.offsetTop - viewport * 0.28,
    },
    timelineToInstrument,
    animationEnd: timelineToInstrument.end,
  };
}

function getScrollSpan(introSection: HTMLElement, instrumentSection: HTMLElement) {
  return {
    start: introSection.offsetTop,
    end:
      instrumentSection.offsetTop +
      instrumentSection.offsetHeight -
      window.innerHeight * 0.32,
  };
}

function updatePortraitPosition(
  portrait: HTMLElement,
  scrollY: number,
  waypoints: ScrollWaypoints,
  introSlot: HTMLElement | null,
  timelineSlot: HTMLElement | null,
  instrumentSlot: HTMLElement | null
) {
  const intro = measureSlot(introSlot);
  const timeline = measureSlot(timelineSlot);
  const instrument = measureSlot(instrumentSlot);
  if (!intro || !timeline || !instrument) return;

  const clampedScroll = Math.min(scrollY, waypoints.animationEnd);
  const { introToTimeline, timelineToInstrument } = waypoints;

  if (clampedScroll <= introToTimeline.start) {
    applyCoords(portrait, intro);
    return;
  }

  if (clampedScroll < introToTimeline.end) {
    const span = introToTimeline.end - introToTimeline.start;
    const t = span <= 0 ? 1 : (clampedScroll - introToTimeline.start) / span;
    applyCoords(portrait, blendCoords(intro, timeline, t));
    return;
  }

  if (clampedScroll < timelineToInstrument.start) {
    applyCoords(portrait, timeline);
    return;
  }

  if (clampedScroll < timelineToInstrument.end) {
    const span = timelineToInstrument.end - timelineToInstrument.start;
    const t =
      span <= 0 ? 1 : (clampedScroll - timelineToInstrument.start) / span;
    applyCoords(portrait, blendCoords(timeline, instrument, t));
    return;
  }

  applyCoords(portrait, instrument);
}

interface AboutPortraitScrollRefs {
  containerRef: RefObject<HTMLDivElement | null>;
  portraitRef: RefObject<HTMLDivElement | null>;
  introSlotRef: RefObject<HTMLDivElement | null>;
  timelineSlotRef: RefObject<HTMLDivElement | null>;
  instrumentSlotRef: RefObject<HTMLDivElement | null>;
  introSectionRef: RefObject<HTMLElement | null>;
  timelineSectionRef: RefObject<HTMLElement | null>;
  instrumentSectionRef: RefObject<HTMLElement | null>;
}

export function useAboutPortraitScroll(
  refs: AboutPortraitScrollRefs,
  enabled: boolean,
  onInstrumentHandoff: (handedOff: boolean) => void
) {
  const lenis = useLenis();

  useGSAP(
    () => {
      if (!enabled || !lenis) return;

      const {
        containerRef,
        portraitRef,
        introSlotRef,
        timelineSlotRef,
        instrumentSlotRef,
        introSectionRef,
        timelineSectionRef,
        instrumentSectionRef,
      } = refs;

      const container = containerRef.current;
      const portrait = portraitRef.current;
      const introSection = introSectionRef.current;
      const timelineSection = timelineSectionRef.current;
      const instrumentSection = instrumentSectionRef.current;

      if (
        !container ||
        !portrait ||
        !introSection ||
        !timelineSection ||
        !instrumentSection
      ) {
        return;
      }

      const scroller = document.documentElement;

      gsap.set(portrait, {
        position: "fixed",
        zIndex: 30,
        pointerEvents: "none",
        margin: 0,
        opacity: 1,
        transformOrigin: "center center",
      });

      let waypoints = computeWaypoints(timelineSection, instrumentSection);
      let scrollSpan = getScrollSpan(introSection, instrumentSection);
      let isHandedOff = false;

      const setHandoff = (next: boolean) => {
        if (isHandedOff === next) return;
        isHandedOff = next;
        onInstrumentHandoff(next);
      };

      const getScrubbedScroll = (progress: number) =>
        scrollSpan.start + (scrollSpan.end - scrollSpan.start) * progress;

      const render = (scrubbedScroll: number, actualScroll: number) => {
        const reachedInstrument = actualScroll >= waypoints.animationEnd;

        if (reachedInstrument) {
          hidePortrait(portrait);
          setHandoff(true);
          return;
        }

        setHandoff(false);

        const effectiveScroll = Math.min(scrubbedScroll, waypoints.animationEnd);
        updatePortraitPosition(
          portrait,
          effectiveScroll,
          waypoints,
          introSlotRef.current,
          timelineSlotRef.current,
          instrumentSlotRef.current
        );
      };

      const st = ScrollTrigger.create({
        trigger: container,
        scroller,
        start: "top top",
        endTrigger: instrumentSection,
        end: "bottom 32%",
        scrub: 0.9,
        invalidateOnRefresh: true,
        onRefresh: (self) => {
          waypoints = computeWaypoints(timelineSection, instrumentSection);
          scrollSpan = getScrollSpan(introSection, instrumentSection);
          render(getScrubbedScroll(self.progress ?? 0), lenis.scroll);
        },
        onUpdate: (self) => {
          render(getScrubbedScroll(self.progress), lenis.scroll);
        },
      });

      const onLenisScroll = () => {
        render(getScrubbedScroll(st.progress ?? 0), lenis.scroll);
      };
      lenis.on("scroll", onLenisScroll);

      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", onResize);

      const images = container.querySelectorAll("img");
      const onImageLoad = () => ScrollTrigger.refresh();
      images.forEach((img) => {
        if (!img.complete) img.addEventListener("load", onImageLoad, { once: true });
      });

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        render(lenis.scroll, lenis.scroll);
      });

      return () => {
        setHandoff(false);
        window.removeEventListener("resize", onResize);
        images.forEach((img) => img.removeEventListener("load", onImageLoad));
        lenis.off("scroll", onLenisScroll);
        st.kill();
        gsap.set(portrait, { clearProps: "all" });
      };
    },
    {
      dependencies: [
        enabled,
        lenis,
        onInstrumentHandoff,
        refs.containerRef,
        refs.portraitRef,
        refs.introSlotRef,
        refs.timelineSlotRef,
        refs.instrumentSlotRef,
        refs.introSectionRef,
        refs.timelineSectionRef,
        refs.instrumentSectionRef,
      ],
    }
  );
}
