export const SITE_NAME = "Ariya Gallege";
export const ARTIST_INITIALS = "AG";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/art-gallery", label: "Art Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const PROJECTS_HERO = {
  image: "/textures/A_luxury_cinematic_hero_image.jpeg",
  eyebrow: "Residential · commercial · conceptual",
  title: "Every line, by hand.",
  description:
    "Plans, sections, and perspectives in graphite — from cliffside residences to museum studies, each sheet built line by line.",
} as const;

export const HERO_VIDEO = "/textures/vedio 01.mp4";

export const HERO_POSTER = "/achitecture.jpeg";

export const PROCESS_VIDEO =
  "https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_25fps.mp4";

export const DRAWING_IN_MOTION_VIDEO = "/textures/Pencil_drawing_morphs.mp4";

export const STATS = [
  { label: "Years of Experience", value: 14, suffix: "+" },
  { label: "Projects Completed", value: 120, suffix: "+" },
  { label: "Countries", value: 18, suffix: "" },
] as const;

export const WHAT_I_DO = {
  eyebrow: "Practice",
  title: "What I Do",
  description:
    "Hand-rendered architectural drawing for studios, developers, and cultural projects — from early concept to final presentation.",
  sketchBackdrop: [
    {
      src: "/textures/An_artistic_and_detailed.jpeg",
      alt: "",
      corner: "top-left",
    },
    {
      src: "/projects/home2/drawing.webp",
      alt: "",
      corner: "top-right",
    },
    {
      src: "/projects/home3/drawing.webp",
      alt: "",
      corner: "bottom-left",
    },
    {
      src: "/projects/home1/drawing.webp",
      alt: "",
      corner: "bottom-right",
    },
  ],
  services: [
    {
      title: "Perspectives",
      description:
        "Atmospheric exterior and interior views that communicate light, scale, and material.",
    },
    {
      title: "Elevations & Sections",
      description:
        "Precise orthographic studies that clarify proportion, structure, and spatial hierarchy.",
    },
    {
      title: "Conceptual Studies",
      description:
        "Early-stage explorations for competitions, client pitches, and design development.",
    },
    {
      title: "Commissioned Sheets",
      description:
        "Bespoke drawings for architects, developers, and institutions — exhibition-ready on cotton paper.",
    },
  ],
} as const;

export const CLIENT_TESTIMONIALS = {
  eyebrow: "Testimonials",
  title: "What My Clients Say",
  description:
    "Architects, developers, and curators who commission hand-rendered work for presentations, competitions, and exhibition.",
  items: [
    {
      quote:
        "The perspectives arrived with a depth our renders could not touch — clients understood the atmosphere of the scheme before a single model was built.",
      name: "Elena Vasquez",
      role: "Design Director",
      company: "Atelier Meridian",
      project: "Coastal Residence",
    },
    {
      quote:
        "Every elevation read with the clarity of a built survey, yet the graphite carried warmth. The boards became the centerpiece of our competition entry.",
      name: "James Okonkwo",
      role: "Principal Architect",
      company: "Form & Field Studio",
      project: "Cultural Pavilion",
    },
    {
      quote:
        "Ariya translated our massing studies into sheets that felt both precise and poetic. The developer signed off on the first presentation.",
      name: "Priya Menon",
      role: "Lead Designer",
      company: "Northgate Developments",
      project: "Urban Mixed-Use",
    },
    {
      quote:
        "For the museum commission, the hand drawings gave trustees an emotional connection to the space — documentation and art in one.",
      name: "Thomas Berg",
      role: "Exhibition Curator",
      company: "Lund Contemporary",
      project: "Gallery Extension",
    },
  ],
} as const;

export const ARCHITECT = {
  name: "Ariya Gallege",
  role: "Architectural Pencil Drawing Artist",
  location: "Colombo, Sri Lanka",
  city: "Colombo",
  image: "/textures/achitecture.jpeg",
  imageAlt: "Ariya Gallege in the drawing studio",
  aboutPortraits: [
    {
      src: "/textures/achitecture.jpeg",
      alt: "Ariya Gallege in the drawing studio",
      objectPosition: "center 22%",
    },
    {
      src: "/about/architect-portrait-01.png",
      alt: "Ariya Gallege on a balcony overlooking the forest",
      objectPosition: "center 28%",
    },
    {
      src: "/about/architect-portrait-02.png",
      alt: "Ariya Gallege reviewing drawings outdoors",
      objectPosition: "center 42%",
    },
  ],
  studio: {
    street: "41 Horton Place",
    postal: "Colombo 07",
    country: "Sri Lanka",
    mapQuery: "Colombo+Sri+Lanka",
  },
  intro: [
    "Ariya Gallege is an architectural pencil drawing artist based in Sri Lanka, working at the intersection of technical precision and atmospheric rendering.",
    "Each drawing begins with on-site observation — tracing light, proportion, and material before returning to the studio for layered graphite work on cotton paper.",
    "The practice collaborates with architects, developers, and cultural institutions worldwide, producing perspectives, elevations, and conceptual studies.",
  ],
  aboutPage: {
    eyebrow: "About",
    title: "The Practice",
  },
  briefIntro: {
    eyebrow: "The Mind Behind the Designs",
    segments: [
      { text: "An architect dedicated to creating exceptional living environments through drawing. My expertise lies in ", muted: false },
      { text: "hand-rendered perspectives", muted: true },
      { text: " and ", muted: false },
      { text: "contemporary architectural studies", muted: true },
      { text: " that celebrate both beauty and precision. Every project I take on is tailored to reflect the architect's vision, the building's character, and the light of the site — resulting in sheets that inspire and endure.", muted: false },
    ],
    cta: "About Me",
  },
} as const;
