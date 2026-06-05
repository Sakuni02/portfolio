"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";

export function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const dotX = useSpring(cursorX, { stiffness: 500, damping: 28, mass: 0.5 });
  const dotY = useSpring(cursorY, { stiffness: 500, damping: 28, mass: 0.5 });
  const trailX = useSpring(cursorX, { stiffness: 150, damping: 20, mass: 0.8 });
  const trailY = useSpring(cursorY, { stiffness: 150, damping: 20, mass: 0.8 });
  const reducedMotion = useReducedMotion();
  const isHovering = useRef(false);

  useEffect(() => {
    if (reducedMotion) return;

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      isHovering.current = !!target.closest("a, button, [data-cursor='hover']");
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", onOver);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", onOver);
    };
  }, [cursorX, cursorY, reducedMotion]);

  if (reducedMotion) return null;

  return (
    <>
      <motion.div
        className="custom-cursor pointer-events-none fixed left-0 top-0 z-[9999] hidden h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-sepia/40 md:block"
        style={{ x: trailX, y: trailY }}
      />
      <motion.div
        className="custom-cursor pointer-events-none fixed left-0 top-0 z-[9999] hidden h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sepia md:block"
        style={{ x: dotX, y: dotY, scale: isHovering.current ? 1.5 : 1 }}
      />
    </>
  );
}
