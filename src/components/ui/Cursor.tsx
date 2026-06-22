"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue, useSpring, motion, useReducedMotion } from "framer-motion";

/**
 * Two-part custom cursor: a tight dot that tracks fast and a lagging ring that
 * expands into a labelled pill over interactive elements. Positions live in
 * motion values + springs, so pointer movement never re-renders the tree.
 * Disabled on touch / coarse pointers and under reduced motion.
 */
export default function Cursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const [label, setLabel] = useState("");

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 220, damping: 28, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 220, damping: 28, mass: 0.4 });
  const dotX = useSpring(x, { stiffness: 900, damping: 45 });
  const dotY = useSpring(y, { stiffness: 900, damping: 45 });

  const hotSelector = "a, button, [data-cursor], .magnetic";
  const lastTarget = useRef<HTMLElement | null>(null);

  // Explicit data-cursor wins; otherwise short link/button text becomes the
  // label so small controls aren't hidden under the cursor ring.
  function labelFor(el: HTMLElement) {
    if (el.dataset.cursor !== undefined) return el.dataset.cursor;
    const small = el.matches("a, button") && !el.matches(".magnetic, [data-card]");
    const t = (el.textContent || "").replace(/\s+/g, " ").trim();
    return small && t.length <= 16 ? t : "";
  }

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || reduce) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = (e.target as HTMLElement).closest(hotSelector) as HTMLElement | null;
      if (t !== lastTarget.current) {
        lastTarget.current = t;
        setHover(!!t);
        setLabel(t ? labelFor(t) : "");
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [reduce, x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="fixed top-0 left-0 z-[100] grid place-items-center rounded-full pointer-events-none"
        style={{
          x: ringX,
          y: ringY,
          width: hover ? 84 : 38,
          height: hover ? 84 : 38,
          marginLeft: hover ? -42 : -19,
          marginTop: hover ? -42 : -19,
          border: hover ? "1px solid transparent" : "1px solid rgba(231,232,240,.16)",
          background: hover ? "var(--color-chrome)" : "transparent",
          transition: "width .35s var(--ease-out-expo), height .35s var(--ease-out-expo), background .35s, margin .35s var(--ease-out-expo)",
        }}
      >
        {hover && label && (
          <span className="max-w-[66px] text-center font-mono text-[9px] uppercase leading-[1.12] tracking-[0.02em] text-void [overflow-wrap:anywhere]">
            {label}
          </span>
        )}
      </motion.div>
      <motion.div
        aria-hidden
        className="fixed top-0 left-0 z-[100] h-1.5 w-1.5 -ml-[3px] -mt-[3px] rounded-full bg-chrome pointer-events-none"
        style={{ x: dotX, y: dotY, opacity: hover ? 0 : 1 }}
      />
    </>
  );
}
