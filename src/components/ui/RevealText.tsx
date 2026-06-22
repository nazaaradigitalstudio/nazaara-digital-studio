"use client";

import { motion, useReducedMotion } from "framer-motion";

type Props = {
  lines: React.ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3";
};

/**
 * Masked line reveal. Each line sits in an overflow-hidden track and slides up
 * from 105% with a staggered cubic ease. Degrades to a static block under
 * reduced motion.
 */
export default function RevealText({
  lines,
  className,
  lineClassName,
  delay = 0,
  as = "h2",
}: Props) {
  const reduce = useReducedMotion();
  const Tag = as;

  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className={`block ${lineClassName ?? ""}`}
            initial={reduce ? false : { y: "105%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{
              duration: 1.1,
              delay: delay + i * 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
