"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { PROCESS } from "@/lib/data";

function Step({ step, index }: { step: (typeof PROCESS)[number]; index: number }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(!!reduce);
  const onRight = index % 2 === 1; // 0:left, 1:right, 2:left, 3:right

  return (
    <motion.div
      onViewportEnter={() => setActive(true)}
      onViewportLeave={() => !reduce && setActive(false)}
      viewport={{ margin: "-35% 0px -50% 0px" }}
      style={{ opacity: active ? 1 : 0.3 }}
      className="relative grid grid-cols-[32px_1fr] items-center gap-5 py-9 transition-opacity duration-500 md:grid-cols-[1fr_80px_1fr] md:gap-0 md:py-14"
    >
      {/* node on the rail */}
      <div
        className="relative z-[2] col-start-1 h-4 w-4 justify-self-start rounded-full border transition-all duration-500 md:col-start-2 md:justify-self-center"
        style={
          active
            ? { background: "var(--color-ion)", borderColor: "var(--color-ion)", boxShadow: "var(--shadow-bloom)" }
            : { background: "var(--color-obsidian)", borderColor: "var(--hairline-strong)" }
        }
      />

      {/* content, alternating sides on desktop */}
      <div
        className={`col-start-2 max-w-[420px] text-left ${
          onRight
            ? "md:col-start-3 md:text-left md:justify-self-start"
            : "md:col-start-1 md:text-right md:justify-self-end"
        }`}
      >
        <div className="font-mono text-xs tracking-[0.2em] text-ion">{step.vb}</div>
        <h3 className="my-3 text-[clamp(30px,4vw,58px)] tracking-[-0.02em]">{step.t}</h3>
        <p className="font-light text-smoke">{step.d}</p>
      </div>
    </motion.div>
  );
}

export default function Process() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.6", "end 0.7"] });
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="py-24 md:py-40">
      <div className="mx-auto max-w-[1320px] px-5 md:px-8">
        <div className="mb-12 flex flex-col items-center gap-5 text-center md:mb-20">
          <h2 className="text-[clamp(34px,5.5vw,76px)]">How the pull is built</h2>
        </div>

        <div ref={ref} className="relative mt-12">
          {/* rail: left on mobile, centered on desktop */}
          <div className="absolute bottom-0 top-0 left-2 w-px bg-[var(--hairline)] md:left-1/2 md:-translate-x-1/2" />
          <motion.div
            className="absolute top-0 left-2 w-px md:left-1/2 md:-translate-x-1/2"
            style={{
              height: reduce ? "100%" : height,
              background: "var(--grad-ion)",
              boxShadow: "var(--shadow-bloom)",
            }}
          />
          {PROCESS.map((s, i) => (
            <Step key={s.t} step={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
