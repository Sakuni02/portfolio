"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cleanupScrollTriggers } from "@/lib/gsap-cleanup";

/** Reset scroll position and tear down GSAP pins on every route change. */
export function RouteScrollReset() {
  const pathname = usePathname();
  const lenis = useLenis();
  const lenisRef = useRef(lenis);

  lenisRef.current = lenis;

  useEffect(() => {
    cleanupScrollTriggers();

    const scrollTarget = lenisRef.current;
    if (scrollTarget) {
      scrollTarget.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }

    const refreshId = requestAnimationFrame(() => {
      ScrollTrigger.refresh(true);
    });

    return () => cancelAnimationFrame(refreshId);
  }, [pathname]);

  useEffect(() => {
    if (!lenis) return;

    const refreshId = requestAnimationFrame(() => {
      ScrollTrigger.refresh(true);
    });

    return () => cancelAnimationFrame(refreshId);
  }, [lenis]);

  return null;
}
