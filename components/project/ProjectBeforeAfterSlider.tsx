import { getProjectCompareImages } from "@/lib/project-assets";
import { BeforeAfterSlider } from "@/components/project/BeforeAfterSlider";

interface ProjectBeforeAfterSliderProps {
  slug: string;
  projectTitle: string;
}

/**
 * Auto-renders when public/projects/[slug]/ contains
 * drawing.webp and real.webp.
 */
export function ProjectBeforeAfterSlider({
  slug,
  projectTitle,
}: ProjectBeforeAfterSliderProps) {
  const images = getProjectCompareImages(slug);
  if (!images) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-12 md:px-10">
      <h2 className="mb-2 font-display text-3xl text-foreground md:text-4xl">
        Drawing &amp; Reality
      </h2>
      <p className="mb-8 max-w-xl font-sans text-sm text-foreground/55">
        Compare the hand-rendered pencil study against the built environment.
      </p>
      <BeforeAfterSlider
        drawingSrc={images.drawing}
        realSrc={images.real}
        projectTitle={projectTitle}
      />
    </section>
  );
}
