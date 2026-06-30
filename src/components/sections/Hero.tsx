"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import GravityField from "./GravityField";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yTitle = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.35]);
  const bloomA = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const bloomB = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

  const lineReveal = (i: number) => ({
    initial: reduce ? false : { y: "105%" },
    animate: { y: 0 },
    transition: { duration: 1.3, delay: 0.25 + i * 0.12, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <header ref={ref} id="top" className="relative flex min-h-[100dvh] flex-col justify-center md:justify-start overflow-hidden px-5 pb-14 pt-16 md:px-8">
      <motion.div
        aria-hidden
        style={{ y: bloomA }}
        className="pointer-events-none absolute -left-[10vw] -top-[20vw] z-0 h-[60vw] w-[60vw] rounded-full opacity-55 blur-[80px]"
      >
        <div className="h-full w-full rounded-full" style={{ background: "radial-gradient(circle,rgba(110,139,255,.35),transparent 60%)" }} />
      </motion.div>
      <motion.div
        aria-hidden
        style={{ y: bloomB }}
        className="pointer-events-none absolute -bottom-[12vw] -right-[8vw] z-0 h-[46vw] w-[46vw] rounded-full opacity-55 blur-[80px]"
      >
        <div className="h-full w-full rounded-full" style={{ background: "radial-gradient(circle,rgba(185,139,255,.28),transparent 60%)" }} />
      </motion.div>

      <GravityField />

      <motion.div style={{ y: yTitle, opacity }} className="relative z-[2] mx-auto w-full max-w-[1320px] text-center">
        <motion.div
          className="eyebrow mb-6"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Digital studio. Built in India, tuned for the world.
        </motion.div>

        <h1 className="font-display text-[clamp(40px,10vw,168px)] font-semibold leading-[1.02] tracking-[-0.045em]">
          <span className="block overflow-hidden pb-[0.14em]">
            <motion.span className="block" {...lineReveal(0)}>We don&apos;t make</motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.14em]">
            <motion.span className="block font-normal text-faint" {...lineReveal(1)}>websites.</motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.14em]">
            <motion.span className="block" {...lineReveal(2)}>We build</motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.14em]">
            <motion.span className="block" {...lineReveal(3)}>
              <em className="ion-text inline-block pr-[0.12em] italic">digital gravity.</em>
            </motion.span>
          </span>
        </h1>

        <motion.p
          className="mx-auto mt-8 max-w-[560px] text-[clamp(16px,2vw,20px)] font-normal text-chrome/90"
          style={{ textShadow: "0 1px 26px rgba(7,7,10,0.95), 0 0 10px rgba(7,7,10,0.8)" }}
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 1.1 }}
        >
          Interfaces engineered to pull attention and refuse release. Strategy, motion and systems, composed into experiences that compound.
        </motion.p>
      </motion.div>

      <motion.div
        className="relative z-[2] mx-auto mt-11 hidden w-full max-w-[1320px] justify-center gap-12 [@media(min-height:920px)]:flex"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
      >
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-faint">Discipline</div>
          <div className="mt-1.5 text-sm text-smoke">Web. Motion. Growth.</div>
        </div>
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-faint">Approach</div>
          <div className="mt-1.5 text-sm text-smoke">Observe. Design. Build. Amplify.</div>
        </div>
      </motion.div>
    </header>
  );
}
