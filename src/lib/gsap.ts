// Single registration point for GSAP + ScrollTrigger.
// Import { gsap, ScrollTrigger } from "@/lib/gsap" in client components only.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
