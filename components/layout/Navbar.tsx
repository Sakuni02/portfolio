"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { DarkModeToggle } from "@/components/ui/DarkModeToggle";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { cn } from "@/lib/utils";

const SCROLL_THRESHOLD = 48;

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  const isHeroPage =
    pathname === "/" ||
    pathname === "/art-gallery" ||
    pathname === "/projects";

  const isFloating = isHeroPage && !scrolled;

  useLenis(
    (lenis) => {
      setScrolled(lenis.scroll > SCROLL_THRESHOLD);
    },
    [pathname]
  );

  useEffect(() => {
    const y =
      document.documentElement.scrollTop ||
      window.scrollY ||
      0;
    setScrolled(y > SCROLL_THRESHOLD);
  }, [pathname]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const floatingControlStyles = isFloating
    ? "border-offwhite/45 text-offwhite hover:border-offwhite/70 [text-shadow:0_1px_10px_rgba(0,0,0,0.45)]"
    : "border-sepia/35 text-charcoal hover:border-sepia dark:border-offwhite/25 dark:text-offwhite dark:hover:border-offwhite/50";

  return (
    <motion.header
      initial={reducedMotion ? false : { y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={cn(
        "fixed left-0 right-0 top-0 z-[100] transition-[background-color,border-color,box-shadow] duration-500",
        isFloating
          ? cn(
              "border-transparent bg-transparent",
              "max-md:border-b max-md:border-offwhite/10 max-md:bg-charcoal/50 max-md:backdrop-blur-md"
            )
          : cn(
              "border-b border-sepia/15 bg-offwhite/95 shadow-[0_8px_32px_rgba(26,26,24,0.08)] backdrop-blur-xl",
              "dark:border-offwhite/15 dark:bg-charcoal dark:shadow-[0_8px_32px_rgba(0,0,0,0.32)]"
            )
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-[max(1.25rem,env(safe-area-inset-left))] pb-4 pt-[max(1rem,env(safe-area-inset-top))] pr-[max(1.25rem,env(safe-area-inset-right))] sm:px-6 sm:pb-5 sm:pt-[max(1.25rem,env(safe-area-inset-top))] md:px-10 md:pb-6 md:pt-[max(1.5rem,env(safe-area-inset-top))]">
        <Link
          href="/"
          className={cn(
            "flex min-w-0 items-center gap-2 font-display tracking-wide transition-colors sm:gap-2.5 sm:text-lg md:text-xl",
            isFloating
              ? "text-base text-offwhite [text-shadow:0_1px_14px_rgba(0,0,0,0.55)]"
              : "text-base text-charcoal dark:text-offwhite"
          )}
        >
          {isFloating && (
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-offwhite"
              aria-hidden
            />
          )}
          <span className="truncate">{SITE_NAME}</span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(`${link.href}/`));

            return (
              <li key={link.href}>
                <MagneticButton href={link.href} strength={0.35}>
                  <span
                    className={cn(
                      "font-sans text-xs uppercase tracking-[0.2em] transition-colors",
                      isFloating
                        ? cn(
                            "[text-shadow:0_1px_12px_rgba(0,0,0,0.5)] hover:text-offwhite",
                            isActive ? "text-offwhite" : "text-offwhite/80"
                          )
                        : cn(
                            "hover:text-charcoal dark:hover:text-offwhite",
                            isActive
                              ? "text-sepia dark:text-offwhite"
                              : "text-charcoal/75 dark:text-offwhite/75"
                          )
                    )}
                  >
                    {link.label}
                  </span>
                </MagneticButton>
              </li>
            );
          })}
        </ul>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            className={cn(
              "relative flex h-10 w-10 items-center justify-center rounded-full border transition-colors md:hidden",
              floatingControlStyles
            )}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            <span
              className={cn(
                "absolute block h-px w-4 bg-current transition-transform duration-300",
                menuOpen ? "rotate-45" : "-translate-y-1"
              )}
            />
            <span
              className={cn(
                "absolute block h-px w-4 bg-current transition-opacity duration-300",
                menuOpen ? "opacity-0" : "opacity-100"
              )}
            />
            <span
              className={cn(
                "absolute block h-px w-4 bg-current transition-transform duration-300",
                menuOpen ? "-rotate-45" : "translate-y-1"
              )}
            />
          </button>

          <DarkModeToggle className={floatingControlStyles} />
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-nav-menu"
            initial={reducedMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-offwhite/10 bg-charcoal/95 backdrop-blur-xl md:hidden"
          >
            <ul className="mx-auto flex max-w-7xl flex-col px-[max(1.25rem,env(safe-area-inset-left))] py-4 pr-[max(1.25rem,env(safe-area-inset-right))] sm:px-6">
              {NAV_LINKS.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(`${link.href}/`));

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "block border-b border-offwhite/10 py-4 font-sans text-sm uppercase tracking-[0.2em] transition-colors",
                        isActive
                          ? "text-offwhite"
                          : "text-offwhite/70 hover:text-offwhite"
                      )}
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
