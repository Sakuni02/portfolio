"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SplitTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  by?: "char" | "word";
}

export function SplitText({
  text,
  className,
  as: Tag = "h2",
  delay = 0,
  by = "char",
}: SplitTextProps) {
  const reducedMotion = useReducedMotion();
  const items = by === "char" ? text.split("") : text.split(" ");

  if (reducedMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag
      className={cn(
        className,
        "w-full",
        by === "word"
          ? "flex flex-wrap gap-x-[0.35em] gap-y-0.5 sm:gap-x-[0.45em]"
          : "inline-flex flex-wrap"
      )}
      aria-label={text}
    >
      {items.map((item, i) => (
        <motion.span
          key={`${item}-${i}`}
          className={cn(
            "inline-block",
            by === "char" ? "overflow-hidden" : "overflow-visible"
          )}
          initial={{ y: "100%", opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            delay: delay + i * (by === "char" ? 0.03 : 0.08),
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {by === "word" ? item : item === " " ? "\u00A0" : item}
        </motion.span>
      ))}
    </Tag>
  );
}
