"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Eye, Hand } from "lucide-react";

const drawPath = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 1.8, ease: [0.65, 0, 0.35, 1] as const, delay: 0.2 * i }, opacity: { duration: 0.3, delay: 0.2 * i } },
  }),
};

export default function Founders() {
  const reduce = useReducedMotion();

  return (
    <section className="py-20 md:py-40">
      <div className="mx-auto max-w-[1320px] px-5 md:px-8">
        <div className="mb-12 flex flex-col gap-5 md:mb-20">
          <span className="eyebrow">The studio</span>
          <h2 className="text-[clamp(34px,5.5vw,76px)]">
            Two instincts.
            <br />
            One trajectory.
          </h2>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2">
          <svg className="pointer-events-none absolute inset-0 z-[1] hidden h-full w-full overflow-visible md:block" viewBox="0 0 1000 360" preserveAspectRatio="none" aria-hidden>
            <defs>
              <linearGradient id="cgrad" x1="0" x2="1">
                <stop offset="0" stopColor="#6e8bff" />
                <stop offset="1" stopColor="#b98bff" />
              </linearGradient>
            </defs>
            {["M 250 120 C 450 120, 550 240, 750 240", "M 250 240 C 450 240, 550 120, 750 120"].map((d, i) => (
              <motion.path
                key={i}
                d={d}
                fill="none"
                stroke="url(#cgrad)"
                strokeWidth={1.4}
                variants={reduce ? undefined : drawPath}
                custom={i}
                initial={reduce ? undefined : "hidden"}
                whileInView={reduce ? undefined : "show"}
                viewport={{ once: true, amount: 0.5 }}
              />
            ))}
          </svg>

          {/* The Eye */}
          <motion.div
            className="relative border-b border-[var(--hairline)] px-6 py-11 md:border-b-0 md:border-r md:px-12"
            initial={reduce ? false : { x: -60, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Eye className="mb-8 h-16 w-16 text-chrome" strokeWidth={1} />
            <div className="font-mono text-xs uppercase tracking-[0.28em] text-ion">The Eye</div>
            <h3 className="mb-1.5 mt-4 text-[clamp(40px,6vw,92px)] tracking-[-0.03em]">Aaryaveer</h3>
            <div className="mb-5 text-lg text-chrome">Strategy. Perception. Vision.</div>
            <p className="max-w-[340px] font-light text-smoke">
              Reads the market before it moves. Decides what a brand should mean, where attention will travel, and which idea is worth building gravity around.
            </p>
          </motion.div>

          {/* The Hand */}
          <motion.div
            className="relative flex flex-col items-start px-6 py-11 text-left md:items-end md:px-12 md:text-right"
            initial={reduce ? false : { x: 60, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Hand className="mb-8 h-16 w-16 text-chrome" strokeWidth={1} />
            <div className="font-mono text-xs uppercase tracking-[0.28em] text-plasma">The Hand</div>
            <h3 className="mb-1.5 mt-4 text-[clamp(40px,6vw,92px)] tracking-[-0.03em]">Prakhar</h3>
            <div className="mb-5 text-lg text-chrome">Systems. Engineering. Execution.</div>
            <p className="max-w-[340px] font-light text-smoke md:ml-auto">
              Turns intention into something that ships and holds up. Builds the motion, the architecture and the performance that make the vision real.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
