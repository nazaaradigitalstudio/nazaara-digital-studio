"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import { useStartProject } from "@/components/providers/StartProjectProvider";

export default function CTA() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { open } = useStartProject();

  const sx = useMotionValue(0);
  const sy = useMotionValue(0);
  const spotX = useSpring(sx, { stiffness: 80, damping: 20 });
  const spotY = useSpring(sy, { stiffness: 80, damping: 20 });

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const ghostY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-8%", "18%"]);

  function onMove(e: React.MouseEvent) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    sx.set(e.clientX - r.left);
    sy.set(e.clientY - r.top);
  }

  return (
    <section id="contact" ref={ref} onMouseMove={onMove} className="relative overflow-hidden py-28 text-center md:py-48">
      <motion.div
        aria-hidden
        style={{ left: spotX, top: spotY, x: "-50%", y: "-50%" }}
        className="pointer-events-none absolute z-0 h-[600px] w-[600px] rounded-full blur-[30px]"
      >
        <div className="h-full w-full rounded-full" style={{ background: "radial-gradient(circle,rgba(110,139,255,.18),transparent 60%)" }} />
      </motion.div>

      <motion.div
        aria-hidden
        style={{ y: ghostY }}
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-display text-[clamp(48px,18vw,400px)] font-semibold tracking-[-0.04em] text-[rgba(255,255,255,.025)]"
      >
        NAZAARA
      </motion.div>

      <div className="relative z-[1] mx-auto max-w-[1320px] px-5 md:px-8">
        <motion.h2
          className="text-[clamp(40px,8vw,120px)] leading-[0.95] tracking-[-0.03em]"
          initial={reduce ? false : { y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Gravity is
          <br />
          a decision.
        </motion.h2>
        <motion.p
          className="mx-auto mb-12 mt-7 max-w-[520px] text-lg font-light text-smoke"
          initial={reduce ? false : { y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          The brands that hold attention chose to build for it. Make yours one of them.
        </motion.p>
        <MagneticButton onClick={open} cursorLabel="let's talk" strength={0.5}>
          <span className="inline-flex items-center gap-4 rounded-full bg-chrome px-12 py-5 font-display text-lg font-semibold text-void">
            Start a project
            <ArrowRight className="h-5 w-5 transition-transform duration-500 group-hover:translate-x-1.5" />
          </span>
        </MagneticButton>
      </div>
    </section>
  );
}
