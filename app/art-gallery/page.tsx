import type { Metadata } from "next";
import { ART_GALLERY_ITEMS } from "@/lib/art-gallery";
import { getProjectGalleryImages } from "@/lib/project-assets";
import { getAllProjects } from "@/lib/projects";
import { ArtGalleryHero } from "@/components/sections/art-gallery/ArtGalleryHero";
import { ArtGalleryGrid } from "@/components/sections/art-gallery/ArtGalleryGrid";
import { HungInSequenceHeader } from "@/components/sections/art-gallery/HungInSequenceHeader";
import { CuratorNote } from "@/components/sections/art-gallery/CuratorNote";

export const metadata: Metadata = {
  title: "Art Gallery",
  description:
    "A curated grid of architectural pencil drawings, studies, and atmospheric graphite works.",
};

export default function ArtGalleryPage() {
  const projectEntries = getAllProjects().map((project) => {
    const extras = getProjectGalleryImages(project.slug);
    return {
      project,
      galleryImages: extras.length > 0 ? extras : project.gallery,
    };
  });

  return (
    <>
      <ArtGalleryHero />

      <section
        id="gallery"
        className="bg-[#F5F2EB] px-4 pb-28 pt-16 dark:bg-charcoal sm:px-6 md:px-10 md:pt-20 lg:px-14"
      >
        <div className="mx-auto max-w-[1600px]">
          <HungInSequenceHeader workCount={ART_GALLERY_ITEMS.length} />

          <ArtGalleryGrid items={ART_GALLERY_ITEMS} projectEntries={projectEntries} />

          <CuratorNote />
        </div>
      </section>
    </>
  );
}
