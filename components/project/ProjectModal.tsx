"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { useLenis } from "lenis/react";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProjectModalProps {
  project: Project;
  galleryImages: string[];
  standalone?: boolean;
  heroImage?: string;
  onClose?: () => void;
}

type RevealDirection = "left" | "right" | "bottom";

interface ModalRevealProps {
  children: React.ReactNode;
  from: RevealDirection;
  scrollRoot: React.RefObject<HTMLElement | null>;
  className?: string;
  delay?: number;
}

const REVEAL_OFFSET = 48;

function ModalReveal({
  children,
  from,
  scrollRoot,
  className,
  delay = 0,
}: ModalRevealProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const initial =
    from === "left"
      ? { opacity: 0, x: -REVEAL_OFFSET }
      : from === "right"
        ? { opacity: 0, x: REVEAL_OFFSET }
        : { opacity: 0, y: REVEAL_OFFSET };

  return (
    <motion.div
      className={cn(className)}
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.2, root: scrollRoot }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function galleryCaption(src: string, project: Project, index: number): string {
  if (src.includes("drawing")) return "Pencil drawing study";
  if (src.includes("real")) return "Rendered perspective";
  return `${project.title} — detail ${index + 1}`;
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close project"
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

export function ProjectModal({
  project,
  galleryImages,
  standalone = false,
  heroImage,
  onClose,
}: ProjectModalProps) {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const lenis = useLenis();
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    if (onClose) {
      onClose();
      return;
    }
    if (standalone) {
      router.push("/projects");
      return;
    }
    router.back();
  }, [router, standalone, onClose]);

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
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const subtitle =
    project.subtitle ?? `${project.category} · ${project.year}`;
  const overviewText = project.description;
  const detailImage = galleryImages[0] ?? project.coverImage;
  const projectTextPrimary = project.body ?? project.description;
  const projectTextSecondary = project.body ? project.description : null;

  const modal = (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[9990] flex items-stretch justify-center overflow-hidden bg-charcoal/75 p-5 backdrop-blur-[2px] md:p-8 lg:p-10"
      onClick={close}
    >
      <motion.div
        ref={scrollRef}
        initial={reducedMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative min-h-0 w-full max-w-[960px] overflow-y-auto overscroll-contain rounded-sm bg-offwhite shadow-2xl hide-scrollbar dark:bg-[#222220] dark:ring-1 dark:ring-offwhite/10 [-webkit-overflow-scrolling:touch]"
        data-lenis-prevent
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        {/* Hero */}
        <section className="relative min-h-[420px] w-full md:min-h-[520px]">
          <Image
            src={heroImage ?? project.coverImage}
            alt={project.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 960px) 100vw, 960px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-offwhite via-offwhite/55 to-transparent dark:from-[#222220] dark:via-[#222220]/55" />

          <div className="absolute right-5 top-5 z-10 md:right-8 md:top-8">
            <CloseButton onClick={close} />
          </div>

          <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 md:px-10 md:pb-10">
            <h1
              id="project-modal-title"
              className="font-display text-[2.5rem] leading-[1.05] text-charcoal/85 dark:text-offwhite/90 md:text-[3.25rem]"
            >
              {project.title}
            </h1>
            <p className="mt-2 font-sans text-[11px] uppercase tracking-[0.22em] text-charcoal/55 dark:text-offwhite/55">
              {subtitle}
            </p>
          </div>
        </section>

        {/* Overview + metadata */}
        <section className="grid gap-10 px-6 py-10 md:grid-cols-[1fr_220px] md:gap-14 md:px-10 md:py-12">
          <ModalReveal from="left" scrollRoot={scrollRef}>
            <div>
              <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-charcoal dark:text-offwhite">
                Overview
              </h2>
              <p className="mt-5 font-sans text-sm leading-[1.85] text-charcoal/70 dark:text-offwhite/70 md:text-[15px]">
                {overviewText}
              </p>
            </div>
          </ModalReveal>

          <ModalReveal from="right" scrollRoot={scrollRef} delay={0.08}>
            <aside className="h-fit bg-warmgray/70 px-5 py-6 dark:bg-offwhite/[0.06] dark:ring-1 dark:ring-offwhite/10">
              <dl className="space-y-5">
                {project.client && (
                  <div>
                    <dt className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/50 dark:text-offwhite/50">
                      Client
                    </dt>
                    <dd className="mt-1.5 font-sans text-sm text-charcoal/80 dark:text-offwhite/80">
                      {project.client}
                    </dd>
                  </div>
                )}
                {project.location && (
                  <div>
                    <dt className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/50 dark:text-offwhite/50">
                      Geography
                    </dt>
                    <dd className="mt-1.5 font-sans text-sm text-charcoal/80 dark:text-offwhite/80">
                      {project.location}
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/50 dark:text-offwhite/50">
                    Category
                  </dt>
                  <dd className="mt-1.5 font-sans text-sm text-charcoal/80 dark:text-offwhite/80">
                    {project.category}
                  </dd>
                </div>
                <div>
                  <dt className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/50 dark:text-offwhite/50">
                    Year
                  </dt>
                  <dd className="mt-1.5 font-sans text-sm text-charcoal/80 dark:text-offwhite/80">
                    {project.year}
                  </dd>
                </div>
              </dl>
            </aside>
          </ModalReveal>
        </section>

        {/* Image + project narrative */}
        <section className="grid gap-10 px-6 pb-12 md:grid-cols-2 md:items-start md:gap-12 md:px-10 md:pb-16">
          <ModalReveal from="left" scrollRoot={scrollRef}>
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-warmgray/30 dark:bg-offwhite/5">
              <Image
                src={detailImage}
                alt={`${project.title} detail`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 480px"
              />
            </div>
          </ModalReveal>

          <ModalReveal from="right" scrollRoot={scrollRef} delay={0.1}>
            <div className="flex flex-col justify-center pt-2">
              <h3 className="font-sans text-sm font-semibold text-charcoal dark:text-offwhite">
                The Project
              </h3>
              <p className="mt-4 font-sans text-sm leading-[1.85] text-charcoal/65 dark:text-offwhite/65 md:text-[15px]">
                {projectTextPrimary}
              </p>

              {projectTextSecondary && (
                <>
                  <hr className="my-8 border-charcoal/15 dark:border-offwhite/15" />
                  <h3 className="font-sans text-sm font-semibold text-charcoal dark:text-offwhite">
                    The Project
                  </h3>
                  <p className="mt-4 font-sans text-sm leading-[1.85] text-charcoal/65 dark:text-offwhite/65 md:text-[15px]">
                    {projectTextSecondary}
                  </p>
                </>
              )}
            </div>
          </ModalReveal>
        </section>

        {/* Two-column gallery */}
        {galleryImages.length > 0 && (
          <section className="px-6 pb-16 md:px-10 md:pb-20">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
              {galleryImages.map((src, i) => (
                <ModalReveal
                  key={src}
                  from="bottom"
                  scrollRoot={scrollRef}
                  delay={i * 0.12}
                >
                  <figure>
                    <div className="relative aspect-[3/4] overflow-hidden bg-warmgray/30 dark:bg-offwhite/5">
                      <Image
                        src={src}
                        alt={`${project.title} ${i + 1}`}
                        fill
                        loading="lazy"
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 440px"
                      />
                    </div>
                    <figcaption className="mt-3 font-sans text-sm text-charcoal/55 dark:text-offwhite/55">
                      {galleryCaption(src, project, i)}
                    </figcaption>
                  </figure>
                </ModalReveal>
              ))}
            </div>
          </section>
        )}
      </motion.div>
    </motion.div>
  );

  if (!mounted) return null;

  return createPortal(modal, document.body);
}
