"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

const STATEMENT =
  "Most studios ship pages. We engineer mass. Every interaction is weighted to draw the eye, hold the hand, and bend a visitor's path toward a single inevitable action.";
const STATEMENT_BOLD =
  "That force is what separates a brand people remember from a brand they scroll past.";

function Word({ children, progress, range }: { children: string; progress: any; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {children}&nbsp;
    </motion.span>
  );
}

export default function Manifesto() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.55"] });

  const words = [...STATEMENT.split(" "), ...STATEMENT_BOLD.split(" ")];
  const boldStart = STATEMENT.split(" ").length;

  return (
    <section id="studio" className="border-t border-[var(--hairline)] pb-32 pt-40">
      <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <motion.div
          className="flex gap-12 whitespace-nowrap"
          animate={reduce ? undefined : { x: ["0%", "-50%"] }}
          transition={{ duration: 24, ease: "linear", repeat: Infinity }}
        >
          {[0, 1].map((k) => (
            <span key={k} className="font-display text-[clamp(40px,7vw,96px)] font-medium tracking-[-0.02em] text-faint">
              Perception · Precision · Pull ·
            </span>
          ))}
        </motion.div>
      </div>

      <div className="mx-auto mt-16 max-w-[980px] md:mt-28 px-5 md:px-8">
        <p ref={ref} className="font-display text-[clamp(24px,4vw,46px)] font-normal leading-[1.18] tracking-[-0.02em] text-smoke">
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            const bold = i >= boldStart;
            return (
              <span key={i} className={bold ? "text-chrome" : undefined}>
                {reduce ? (
                  <span className="inline-block">{word}&nbsp;</span>
                ) : (
                  <Word progress={scrollYProgress} range={[start, end]}>
                    {word}
                  </Word>
                )}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
}
