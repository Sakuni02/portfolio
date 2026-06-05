"use client";

import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export function MagneticButton({
  children,
  className,
  strength = 0.3,
  href,
  onClick,
  type = "button",
}: MagneticButtonProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });
  const reducedMotion = useReducedMotion();

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - (rect.left + rect.width / 2);
    const offsetY = e.clientY - (rect.top + rect.height / 2);
    x.set(offsetX * strength);
    y.set(offsetY * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const content = href ? (
    <Link
      href={href}
      scroll={false}
      className={cn("inline-block", className)}
      data-cursor="hover"
      onClick={onClick}
    >
      {children}
    </Link>
  ) : (
    <button
      type={type}
      className={cn("inline-block", className)}
      onClick={onClick}
      data-cursor="hover"
    >
      {children}
    </button>
  );

  return (
    <motion.div
      className="inline-block"
      style={reducedMotion ? undefined : { x: springX, y: springY }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {content}
    </motion.div>
  );
}
