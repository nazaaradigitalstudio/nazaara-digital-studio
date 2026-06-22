// Central content. Keep all copy here so sections stay presentational.

export type Service = {
  num: string;
  title: string;
  tag: string;
  items: [string, string][];
};

export const SERVICES: Service[] = [
  {
    num: "01",
    title: "Web Systems",
    tag: "Sites architected to load fast, feel inevitable and convert without asking twice.",
    items: [
      ["Next.js + headless", "frontend"],
      ["Design systems", "scalable"],
      ["Core Web Vitals", "sub-2s LCP"],
      ["Edge deployment", "global"],
    ],
  },
  {
    num: "02",
    title: "Motion Identity",
    tag: "Brand expressed as movement. Logos, type and interfaces that behave with intent.",
    items: [
      ["Motion language", "GSAP · Lenis"],
      ["Kinetic typography", "custom"],
      ["Micro-interactions", "tactile"],
      ["Reveal systems", "scroll-linked"],
    ],
  },
  {
    num: "03",
    title: "Social Media Management",
    tag: "Presence engineered as a system. Content, cadence and craft that compound into a following.",
    items: [
      ["Content systems", "always-on"],
      ["Brand voice", "consistent"],
      ["Calendar + cadence", "managed"],
      ["Performance", "tracked"],
    ],
  },
  {
    num: "04",
    title: "AI Growth Systems",
    tag: "Pipelines that turn traffic into compounding momentum, instrumented end to end.",
    items: [
      ["Conversion loops", "automated"],
      ["Analytics", "event-level"],
      ["AI workflows", "custom agents"],
      ["Experiment engine", "always-on"],
    ],
  },
];

export type Work = {
  cat: string;
  title: string;
  yr?: string;
  img?: string;
  invite?: boolean;
  summary: string;
  stats?: [string, string][];
  copy: string;
};

export const WORK: Work[] = [
  {
    cat: "Live client · Education",
    title: "Star Public Career H.S. School",
    yr: "2026",
    img: "/work/star.jpg",
    summary:
      "A complete digital presence for an MP Board senior secondary school in Sehore, Madhya Pradesh.",
    stats: [
      ["Live", "shipped on Vercel"],
      ["AI-ready", "JSON-LD + GEO"],
      ["3", "valid rich results"],
    ],
    copy: "A constellation hero, animated board results, real leadership portraits and an admissions enquiry flow, wrapped in structured data so the school surfaces cleanly in both search and AI answers. The brief was trust at first glance, and the site earns it before a parent reads a word.",
  },
  {
    cat: "Exploration · Fitness",
    title: "LiftLab",
    yr: "2026",
    img: "/work/liftlab.jpg",
    summary: "A studio exploration in adrenaline. A gym brand that should hit like the first rep.",
    stats: [
      ["Emotion", "drive + urgency"],
      ["Type", "heavy, kinetic"],
      ["Goal", "make you move"],
    ],
    copy: "An exploration into how far motion and contrast can push intent. Hard black, a single electric accent and oversized type built to feel like force. The point was to learn the exact visual language that turns intention into action for a performance brand.",
  },
  {
    cat: "Exploration · Hospitality",
    title: "Cozy Campfires",
    yr: "2026",
    img: "/work/cozy.jpg",
    summary: "A studio exploration in warmth. A cafe that should feel like a slow morning.",
    stats: [
      ["Emotion", "calm + comfort"],
      ["Type", "soft, editorial"],
      ["Goal", "invite lingering"],
    ],
    copy: "The opposite end of the emotional range from LiftLab. Warm browns, generous space and unhurried pacing, tuned to lower the heart rate rather than raise it. An exercise in delivering the precise feeling a hospitality brand lives or dies on.",
  },
  {
    cat: "Open slot",
    title: "Your business here.",
    invite: true,
    summary: "The next case study is yours.",
    copy: "We take on a small number of builds at a time so each one gets obsessive attention. If your brand should pull attention and refuse release, this is where it goes next.",
  },
];

export type Step = { vb: string; t: string; d: string };

export const PROCESS: Step[] = [
  { vb: "01 / Observe", t: "Observe", d: "We read the market, the audience and the gap before a single pixel exists. Strategy is the first deliverable." },
  { vb: "02 / Design", t: "Design", d: "Direction becomes form. Type, motion and layout are composed as one weighted system, not decorated afterward." },
  { vb: "03 / Build", t: "Build", d: "Engineered to ship. Fast, accessible, instrumented, and built to hold up long after launch day." },
  { vb: "04 / Amplify", t: "Amplify", d: "Search, social and growth loops turn the experience into momentum that compounds on its own." },
];

export const NAV_LINKS = [
  { href: "#work", label: "Work" },
  { href: "#services", label: "Services" },
  { href: "#studio", label: "Studio" },
];
