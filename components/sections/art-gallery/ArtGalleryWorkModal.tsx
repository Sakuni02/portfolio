"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useLenis } from "lenis/react";
import type { ArtGalleryItem } from "@/lib/art-gallery";

interface ArtGalleryWorkModalProps {
  item: ArtGalleryItem;
  onClose: () => void;
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close artwork"
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#a89f94]/90 text-offwhite transition-colors hover:bg-[#968c82] dark:bg-offwhite/15 dark:hover:bg-offwhite/25"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <path
          d="M2 2L12 12M12 2L2 12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}

export function ArtGalleryWorkModal({ item, onClose }: ArtGalleryWorkModalProps) {
  const reducedMotion = useReducedMotion();
  const lenis = useLenis();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    lenis?.stop();
    return () => {
      lenis?.start();
    };
  }, [lenis]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const modal = (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="artwork-modal-title"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[9990] flex items-stretch justify-center overflow-hidden bg-charcoal/75 p-5 backdrop-blur-[2px] md:p-8 lg:p-10"
      onClick={onClose}
    >
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative min-h-0 w-full max-w-[720px] overflow-y-auto overscroll-contain rounded-sm bg-offwhite shadow-2xl hide-scrollbar dark:bg-[#222220] dark:ring-1 dark:ring-offwhite/10 [-webkit-overflow-scrolling:touch]"
        data-lenis-prevent
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        <section className="relative min-h-[360px] w-full md:min-h-[480px]">
          <Image
            src={item.src}
            alt={item.alt}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 720px) 100vw, 720px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-offwhite via-offwhite/50 to-transparent dark:from-[#222220] dark:via-[#222220]/50" />

          <div className="absolute right-5 top-5 z-10 md:right-8 md:top-8">
            <CloseButton onClick={onClose} />
          </div>

          <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 md:px-10 md:pb-10">
            <h1
              id="artwork-modal-title"
              className="font-display text-[2rem] leading-[1.05] text-charcoal/85 dark:text-offwhite/90 md:text-[2.75rem]"
            >
              {item.title}
            </h1>
            <p className="mt-2 font-sans text-[11px] uppercase tracking-[0.22em] text-charcoal/55 dark:text-offwhite/55">
              {item.category} · {item.year}
            </p>
          </div>
        </section>

        <section className="grid gap-10 px-6 py-10 md:grid-cols-[1fr_180px] md:gap-12 md:px-10 md:py-12">
          <div>
            <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-charcoal dark:text-offwhite">
              About this work
            </h2>
            <p className="mt-5 font-sans text-sm leading-[1.85] text-charcoal/70 dark:text-offwhite/70 md:text-[15px]">
              {item.alt}
            </p>
          </div>

          <aside className="h-fit bg-warmgray/70 px-5 py-6 dark:bg-offwhite/[0.06] dark:ring-1 dark:ring-offwhite/10">
            <dl className="space-y-5">
              <div>
                <dt className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/50 dark:text-offwhite/50">
                  Archive code
                </dt>
                <dd className="mt-1.5 font-mono text-sm text-charcoal/80 dark:text-offwhite/80">{item.code}</dd>
              </div>
              <div>
                <dt className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/50 dark:text-offwhite/50">
                  Category
                </dt>
                <dd className="mt-1.5 font-sans text-sm text-charcoal/80 dark:text-offwhite/80">{item.category}</dd>
              </div>
              <div>
                <dt className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/50 dark:text-offwhite/50">
                  Year
                </dt>
                <dd className="mt-1.5 font-sans text-sm text-charcoal/80 dark:text-offwhite/80">{item.year}</dd>
              </div>
            </dl>
          </aside>
        </section>
      </motion.div>
    </motion.div>
  );

  if (!mounted) return null;

  return createPortal(modal, document.body);
}
