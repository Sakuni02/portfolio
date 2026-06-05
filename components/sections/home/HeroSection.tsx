"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { HERO_POSTER, HERO_VIDEO } from "@/lib/constants";
import { SplitText } from "@/components/animations/SplitText";
import { ParallaxLayer } from "@/components/animations/ParallaxLayer";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <section
      className={cn(
        "relative z-0 flex min-h-screen flex-col justify-end overflow-hidden bg-charcoal",
        "max-md:min-h-[100dvh]",
        "md:pb-44 lg:pb-52"
      )}
    >
      <ParallaxLayer speed={0.3} className="absolute inset-0">
        {!videoFailed ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            poster={HERO_POSTER}
            onError={() => setVideoFailed(true)}
            className={cn(
              "w-full object-cover",
              "h-full min-h-[100dvh] object-[center_35%]",
              "md:h-[110%] md:min-h-0 md:object-center"
            )}
          >
            <source src={HERO_VIDEO} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={HERO_POSTER}
            alt="Architecture drawing"
            fill
            priority
            className={cn(
              "object-cover",
              "object-[center_35%] md:object-center"
            )}
            sizes="100vw"
          />
        )}
      </ParallaxLayer>

      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t",
          "from-charcoal/95 via-charcoal/60 to-charcoal/85",
          "md:from-charcoal/90 md:via-charcoal/50 md:to-charcoal/80"
        )}
      />

      <ParallaxLayer
        speed={0.7}
        clip={false}
        className={cn(
          "relative z-10 w-full",
          "md:px-6 md:pb-32 md:pt-40 lg:px-10"
        )}
      >
        <div
          className={cn(
            "mx-auto w-full max-w-7xl",
            "px-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))]",
            "pb-[max(1.5rem,env(safe-area-inset-bottom,0px)+1rem)]",
            "max-md:pb-8",
            "md:px-0 md:pb-0 md:pt-0"
          )}
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className={cn(
              "font-sans uppercase text-offwhite/70",
              "mb-3 max-w-[18rem] text-[10px] leading-relaxed tracking-[0.28em]",
              "md:mb-4 md:max-w-none md:text-xs md:tracking-[0.35em]"
            )}
          >
            Architectural Pencil Drawing
          </motion.p>

          <SplitText
            text="Drawing Space Into Light"
            as="h1"
            by="word"
            className={cn(
              "max-w-4xl font-display font-light text-offwhite",
              "w-full text-[clamp(2rem,9.5vw,2.75rem)] leading-[1.08] tracking-tight text-balance",
              "md:text-7xl md:leading-tight lg:text-8xl"
            )}
            delay={0.6}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className={cn(
              "font-sans text-offwhite/70",
              "mt-4 max-w-md text-sm leading-relaxed",
              "md:mt-6 md:max-w-lg md:text-base md:text-lg"
            )}
          >
            Hand-rendered architectural studies that capture material, proportion,
            and atmosphere through the quiet precision of graphite.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="mt-6 md:mt-10"
          >
            <MagneticButton
              href="/projects"
              className={cn(
                "border border-offwhite/40 font-sans uppercase text-offwhite transition-colors hover:bg-offwhite hover:text-charcoal",
                "inline-flex min-h-11 items-center px-6 py-3 text-[10px] tracking-[0.22em]",
                "md:inline-block md:min-h-0 md:px-8 md:py-4 md:text-xs md:tracking-[0.25em]"
              )}
            >
              View Works
            </MagneticButton>
          </motion.div>
        </div>
      </ParallaxLayer>
    </section>
  );
}
