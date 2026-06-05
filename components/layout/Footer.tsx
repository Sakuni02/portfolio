import Link from "next/link";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t-2 border-sepia/40 bg-[#121110] text-offwhite">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-sepia/[0.1] to-transparent"
      />
      <div className="relative mx-auto max-w-7xl px-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] sm:px-6 md:px-10 lg:px-16">
        <div className="flex flex-col gap-10 py-12 pb-[max(3rem,env(safe-area-inset-bottom)+1.5rem)] sm:gap-12 sm:py-14 md:py-16">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-12 lg:gap-20">
            <div className="min-w-0 max-w-md">
              <p className="font-display text-[clamp(1.5rem,6vw,1.875rem)] leading-tight sm:text-3xl">
                {SITE_NAME}
              </p>
              <p className="mt-2 font-sans text-sm leading-relaxed text-offwhite/60 sm:mt-3">
                Architectural pencil drawing studio — hand-rendered perspectives,
                elevations, and conceptual studies since 2010.
              </p>
            </div>

            <nav
              aria-label="Footer navigation"
              className="border-t border-offwhite/10 pt-8 md:border-t-0 md:pt-1 lg:min-w-[28rem]"
            >
              <ul className="grid grid-cols-2 gap-x-6 gap-y-3 sm:gap-x-8 md:flex md:flex-wrap md:justify-end md:gap-x-8 md:gap-y-2 lg:flex-nowrap lg:gap-x-10">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group relative inline-block py-0.5 font-sans text-[11px] uppercase tracking-[0.18em] text-offwhite/70 transition-colors hover:text-offwhite sm:text-xs sm:tracking-[0.2em]"
                    >
                      {link.label}
                      <span className="absolute -bottom-1 left-0 h-px w-0 bg-sepia transition-all duration-300 group-hover:w-full" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="border-t border-offwhite/10 pt-6">
            <p className="font-sans text-[11px] leading-relaxed text-offwhite/40 sm:text-xs">
              © {year} {SITE_NAME}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
