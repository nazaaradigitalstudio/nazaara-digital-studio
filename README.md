# Nazaara

> We don't make websites. We build digital gravity.

Production codebase for the Nazaara Digital Studio site. Cinematic, dark-only, motion-led single page built on the App Router.

## Stack

- **Next.js 15** (App Router, React 19, RSC by default)
- **TypeScript** (strict)
- **Tailwind CSS v4** (CSS-first `@theme` tokens in `globals.css`)
- **Framer Motion** (`framer-motion`) for component motion and physics
- **Lenis** for smooth scroll, wired to the GSAP ticker
- **GSAP + ScrollTrigger** for scroll-linked work
- **Lucide** icons

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Architecture

```
src/
├── app/
│   ├── layout.tsx          # metadata, OG, JSON-LD, fonts, global chrome, providers
│   ├── page.tsx            # section composition
│   ├── globals.css         # Tailwind v4 + design tokens + grain
│   ├── sitemap.ts          # sitemap route
│   ├── robots.ts           # robots, welcomes AI crawlers (GEO)
│   └── manifest.ts         # PWA manifest
├── components/
│   ├── providers/
│   │   └── SmoothScroll.tsx # Lenis ↔ GSAP ticker, anchor smoothing
│   ├── ui/
│   │   ├── Cursor.tsx        # two-part custom cursor, motion values
│   │   ├── Grain.tsx         # fixed grain overlay (own GPU layer)
│   │   ├── ScrollProgress.tsx# useScroll progress bar
│   │   ├── MagneticButton.tsx# reusable magnetic wrapper
│   │   └── RevealText.tsx    # masked staggered line reveal
│   ├── layout/
│   │   └── Nav.tsx           # scroll-aware glass nav
│   └── sections/
│       ├── Hero.tsx          # kinetic type, parallax blooms
│       ├── GravityField.tsx  # signature canvas dot-lattice (gravity)
│       ├── Manifesto.tsx     # marquee + scroll-scrubbed word reveal
│       ├── Founders.tsx      # opposing reveal + animated connector (Eye/Hand)
│       ├── Services.tsx      # 3D tilt cards, click-to-expand, glow
│       ├── Portfolio.tsx     # parallax cards + case-study modal
│       ├── Process.tsx       # scroll-traced timeline (Observe→Amplify)
│       ├── CTA.tsx           # cursor-follow spotlight + magnetic button
│       └── Footer.tsx        # breathing ambient glow
├── hooks/
│   └── useMagnetic.ts        # magnetic physics via motion values
└── lib/
    ├── data.ts               # all copy/content
    ├── gsap.ts               # single GSAP/ScrollTrigger registration
    └── utils.ts              # lerp, cn
```

## Motion principles applied

- Continuous pointer / scroll values live in **motion values**, never React state, so movement never re-renders the tree.
- Scroll listeners are never hand-rolled. We use `useScroll`, `ScrollTrigger`, or `onViewportEnter`.
- Only `transform` and `opacity` animate. Grain sits on a fixed, `pointer-events-none` layer.
- Every animation collapses under `prefers-reduced-motion` (Lenis, parallax, tilt, magnetic, cursor all degrade to static).

## To do before launch

- **`public/og.jpg`** (1200×630) is referenced in metadata. Add a real share image.
- Work section uses real screenshots in `public/work/` (Star Public Career H.S. School, plus the LiftLab and Cozy Campfires explorations). Replace or add to these as new projects ship; the "Your business here" invitation card is the last entry in `WORK` and links to the contact section.
- **Fonts:** loaded from Fontshare via `<link>` in `layout.tsx`. For strict performance, self-host (Clash Display, General Sans, Space Mono) with `next/font/local` and `font-display: swap`.
- Point `SITE` in `layout.tsx`, `sitemap.ts`, `robots.ts` at the real domain.
- Wire the CTA `mailto:` to your real inbox or a form endpoint.

## License

Private. © Nazaara Digital Studio.
