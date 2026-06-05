"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SplitText } from "@/components/animations/SplitText";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { Toast } from "@/components/ui/Toast";
import { ARCHITECT } from "@/lib/constants";

function FloatingInput({
  id,
  label,
  type = "text",
  required,
  rows,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  rows?: number;
}) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");

  const isActive = focused || value.length > 0;

  return (
    <div className="relative">
      <motion.label
        htmlFor={id}
        animate={{
          y: isActive ? -24 : 0,
          scale: isActive ? 0.85 : 1,
          color: isActive ? "#8B6F47" : "rgba(26,26,24,0.5)",
        }}
        transition={{ duration: 0.2 }}
        className="pointer-events-none absolute left-0 top-3 origin-left font-sans text-sm uppercase tracking-[0.15em]"
      >
        {label}
      </motion.label>
      {rows ? (
        <textarea
          id={id}
          rows={rows}
          required={required}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full resize-none border-b border-sepia/30 bg-transparent pb-2 pt-6 font-sans text-foreground outline-none transition-colors focus:border-sepia"
        />
      ) : (
        <input
          id={id}
          type={type}
          required={required}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full border-b border-sepia/30 bg-transparent pb-2 pt-6 font-sans text-foreground outline-none transition-colors focus:border-sepia"
        />
      )}
    </div>
  );
}

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Behance", href: "https://behance.net" },
  { label: "LinkedIn", href: "https://linkedin.com" },
];

export default function ContactPage() {
  const [toastVisible, setToastVisible] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setToastVisible(true);
  };

  return (
    <>
      <section className="px-6 pb-16 pt-32 md:px-10">
        <SplitText
          text="Contact"
          as="h1"
          className="font-display text-5xl text-foreground md:text-7xl"
        />
        <p className="mt-4 max-w-xl font-sans text-foreground/60">
          Commission inquiries, collaboration proposals, and studio visits —
          reach out to begin a conversation.
        </p>
      </section>

      <section className="grid gap-16 px-6 pb-24 md:grid-cols-2 md:px-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          <FloatingInput id="name" label="Name" required />
          <FloatingInput id="email" label="Email" type="email" required />
          <FloatingInput id="message" label="Message" rows={4} required />

          <MagneticButton type="submit" className="border border-sepia/40 px-8 py-4 font-sans text-xs uppercase tracking-[0.25em] text-foreground transition-colors hover:bg-sepia hover:text-offwhite">
            Send Message
          </MagneticButton>
        </form>

        <div className="space-y-8">
          <div>
            <h2 className="font-display text-2xl text-foreground">Studio</h2>
            <p className="mt-2 font-sans text-sm text-foreground/60">
              {ARCHITECT.studio.street}
              <br />
              {ARCHITECT.studio.postal}, {ARCHITECT.studio.country}
            </p>
          </div>

          <div className="relative aspect-video overflow-hidden bg-warmgray/30">
            <iframe
              title="Studio location"
              src={`https://maps.google.com/maps?q=${ARCHITECT.studio.mapQuery}&output=embed`}
              className="h-full w-full border-0 grayscale"
              loading="lazy"
            />
          </div>

          <div className="flex gap-6">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative font-sans text-xs uppercase tracking-[0.2em] text-foreground/60"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-sepia transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>
        </div>
      </section>

      <Toast
        message="Message sent — we'll be in touch shortly."
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </>
  );
}
