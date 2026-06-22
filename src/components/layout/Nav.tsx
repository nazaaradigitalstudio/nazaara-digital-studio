"use client";

import { useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { NAV_LINKS } from "@/lib/data";
import { useStartProject } from "@/components/providers/StartProjectProvider";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const { open } = useStartProject();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 60));

  return (
    <nav
      className="fixed inset-x-0 top-0 z-[70] flex h-[72px] items-center transition-[background,backdrop-filter] duration-500"
      style={
        scrolled
          ? { background: "rgba(7,7,10,.6)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--hairline)" }
          : undefined
      }
    >
      <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between px-5 md:px-8">
        <a href="#top" data-cursor="home" className="flex items-center gap-3 font-display text-[19px] font-semibold">
          <span className="relative block h-[22px] w-[22px]">
            <span className="absolute inset-0 rounded-full border-[1.5px] border-chrome" />
            <span
              className="absolute inset-[6px] rounded-full"
              style={{ background: "var(--grad-ion)", boxShadow: "var(--shadow-bloom)" }}
            />
          </span>
          Nazaara
        </a>

        <div className="flex items-center gap-9">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="hidden text-sm text-smoke transition-colors hover:text-chrome md:inline">
              {l.label}
            </a>
          ))}
          <button
            type="button"
            onClick={open}
            className="rounded-full border border-[var(--hairline-strong)] px-[18px] py-2.5 font-mono text-xs uppercase tracking-[0.08em] text-chrome transition-colors hover:bg-chrome hover:text-void"
          >
            Start a project
          </button>
        </div>
      </div>
    </nav>
  );
}
