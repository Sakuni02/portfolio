export const ART_GALLERY_HERO = {
  image: "/textures/A_cinematic_hero_banner_image.jpeg",
  eyebrow: "Exhibition — open daily · entry by appointment",
  title: "The Art Gallery.",
  description:
    "Fourteen years of graphite. Three rooms. Walk slowly — the light is set for the drawings, not for the visitor.",
} as const;

export interface ArtGalleryItem {
  id: string;
  src: string;
  alt: string;
  title: string;
  code: string;
  category: string;
  year: number;
  /** Opens the full project modal when set. */
  projectSlug?: string;
}

export function getArtGalleryItemById(id: string): ArtGalleryItem | undefined {
  return ART_GALLERY_ITEMS.find((item) => item.id === id);
}

export const ART_GALLERY_ITEMS: ArtGalleryItem[] = [
  {
    id: "coastal-drawing",
    src: "/projects/home1/drawing.webp",
    alt: "Coastal residence pencil elevation study",
    title: "Coastal Residence",
    code: "05.01",
    category: "Conceptual",
    year: 2024,
    projectSlug: "home1",
  },
  {
    id: "coastal-real",
    src: "/projects/home1/real.webp",
    alt: "Coastal residence architectural photograph reference",
    title: "Coastal Residence",
    code: "05.02",
    category: "Reference",
    year: 2024,
    projectSlug: "home1",
  },
  {
    id: "home2-drawing",
    src: "/projects/home2/drawing.webp",
    alt: "Residential perspective graphite rendering",
    title: "Hillside Perspective",
    code: "05.03",
    category: "Residential",
    year: 2023,
    projectSlug: "home2",
  },
  {
    id: "home2-gallery",
    src: "/projects/home2/gallery/01.webp",
    alt: "Interior pencil study with tonal depth",
    title: "Interior Study I",
    code: "05.04",
    category: "Study",
    year: 2023,
    projectSlug: "home2",
  },
  {
    id: "home2-real",
    src: "/projects/home2/real.webp",
    alt: "Built form light and shadow reference",
    title: "Hillside Perspective",
    code: "05.05",
    category: "Residential",
    year: 2023,
    projectSlug: "home2",
  },
  {
    id: "home3-drawing",
    src: "/projects/home3/drawing.webp",
    alt: "Coastal facade hand-rendered drawing",
    title: "Shoreline Facade",
    code: "06.01",
    category: "Commercial",
    year: 2022,
    projectSlug: "home3",
  },
  {
    id: "home3-gallery",
    src: "/projects/home3/gallery/01.webp",
    alt: "Architectural detail pencil sketch",
    title: "Detail Fragment",
    code: "06.02",
    category: "Study",
    year: 2022,
    projectSlug: "home3",
  },
  {
    id: "home3-real",
    src: "/projects/home3/real.webp",
    alt: "Shoreline architecture atmospheric study",
    title: "Shoreline Facade",
    code: "06.03",
    category: "Commercial",
    year: 2022,
    projectSlug: "home3",
  },
  {
    id: "villa-drawing",
    src: "/projects/villa-geometrica/drawing.webp",
    alt: "Villa Geometrica conceptual elevation",
    title: "Villa Geometrica",
    code: "06.04",
    category: "Conceptual",
    year: 2024,
    projectSlug: "villa-geometrica",
  },
  {
    id: "villa-real",
    src: "/projects/villa-geometrica/real.webp",
    alt: "Villa Geometrica built perspective",
    title: "Villa Geometrica",
    code: "06.05",
    category: "Conceptual",
    year: 2024,
    projectSlug: "villa-geometrica",
  },
];
