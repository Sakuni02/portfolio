"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

function GSAPConnector() {
  const lenis = useLenis();

  useLayoutEffect(() => {
    if (!lenis) return;

    const root = document.documentElement;

    lenis.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(root, {
      scrollTop(value) {
        if (typeof value === "number") {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: root.style.transform ? "transform" : "fixed",
    });

    ScrollTrigger.defaults({ scroller: root });

    const onRefresh = () => lenis.resize();
    ScrollTrigger.addEventListener("refresh", onRefresh);

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(update);
      lenis.off("scroll", ScrollTrigger.update);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      ScrollTrigger.scrollerProxy(root, {});
      ScrollTrigger.defaults({ scroller: window });
    };
  }, [lenis]);

  return null;
}

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        syncTouch: false,
        autoRaf: false,
      }}
    >
      <GSAPConnector />
      {children}
    </ReactLenis>
  );
}
