import type { Metadata, Viewport } from "next";
import "./globals.css";

import SmoothScroll from "@/components/providers/SmoothScroll";
import StartProjectProvider from "@/components/providers/StartProjectProvider";
import Cursor from "@/components/ui/Cursor";
import Grain from "@/components/ui/Grain";
import ScrollProgress from "@/components/ui/ScrollProgress";
import Nav from "@/components/layout/Nav";

const SITE = "https://nazaara.studio";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Nazaara — We build digital gravity",
    template: "%s — Nazaara",
  },
  description:
    "Nazaara is a digital studio building premium website experiences, brand identity, motion systems, SEO, GEO and AI growth systems. Interfaces engineered to pull attention and refuse release.",
  keywords: [
    "digital studio",
    "web design",
    "motion design",
    "brand identity",
    "SEO",
    "GEO",
    "generative engine optimization",
    "AI growth",
    "Next.js studio",
  ],
  authors: [{ name: "Nazaara" }],
  creator: "Nazaara Digital Studio",
  openGraph: {
    type: "website",
    url: SITE,
    siteName: "Nazaara",
    title: "Nazaara — We build digital gravity",
    description: "Interfaces engineered to pull attention and refuse release.",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Nazaara" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nazaara — We build digital gravity",
    description: "Interfaces engineered to pull attention and refuse release.",
    images: ["/og.jpg"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE },
};

export const viewport: Viewport = {
  themeColor: "#07070a",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Nazaara Digital Studio",
  url: SITE,
  description:
    "Premium website experiences, brand identity, motion systems, SEO, GEO and AI growth systems.",
  founder: [
    { "@type": "Person", name: "Aaryaveer", jobTitle: "Strategy & Vision (The Eye)" },
    { "@type": "Person", name: "Prakhar", jobTitle: "Engineering & Execution (The Hand)" },
  ],
  areaServed: "Worldwide",
  knowsAbout: ["Web Design", "Motion Design", "SEO", "Generative Engine Optimization", "AI Growth"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Fontshare delivery. Preconnect to both the CSS host and the font CDN,
            and preload the stylesheet so the brand fonts arrive fast and don't
            fall back to system fonts. For maximum reliability, self-host via
            next/font/local. */}
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="" />
        <link
          rel="preload"
          as="style"
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=general-sans@300,400,500,600&f[]=space-mono@400&display=swap"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=general-sans@300,400,500,600&f[]=space-mono@400&display=swap"
          rel="stylesheet"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <StartProjectProvider>
          <Grain />
          <Cursor />
          <ScrollProgress />
          <Nav />
          <SmoothScroll>{children}</SmoothScroll>
        </StartProjectProvider>
      </body>
    </html>
  );
}
