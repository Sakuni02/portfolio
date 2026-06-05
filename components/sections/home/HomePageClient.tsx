"use client";

import { useState, useCallback } from "react";
import { Preloader } from "@/components/sections/home/Preloader";
import { HeroSection } from "@/components/sections/home/HeroSection";
import { FeaturedWorks } from "@/components/sections/home/FeaturedWorks";
import { ArchitectIntro } from "@/components/sections/home/ArchitectIntro";
import { ProcessTeaser } from "@/components/sections/home/ProcessTeaser";
import { AmbientVideoReel } from "@/components/sections/home/AmbientVideoReel";
import { StatsSection } from "@/components/sections/home/StatsSection";
import { WhatIDoSection } from "@/components/sections/home/WhatIDoSection";
import { ClientTestimonials } from "@/components/sections/home/ClientTestimonials";
import { PopularProjects } from "@/components/sections/home/PopularProjects";
import type { Project } from "@/lib/types";

interface HomePageClientProps {
  latestProjects: Project[];
  popular: Project[];
}

export function HomePageClient({ latestProjects, popular }: HomePageClientProps) {
  const [loaded, setLoaded] = useState(false);
  const handleComplete = useCallback(() => setLoaded(true), []);

  return (
    <>
      {!loaded && <Preloader onComplete={handleComplete} />}
      <div className="relative">
        <HeroSection />
        <ArchitectIntro />
      </div>
      <StatsSection />
      <WhatIDoSection />
      <PopularProjects projects={popular} />
      <ProcessTeaser />
      <AmbientVideoReel />
      <FeaturedWorks projects={latestProjects} />
      <ClientTestimonials />
    </>
  );
}
