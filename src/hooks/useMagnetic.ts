"use client";
import { useRef } from "react";
import { useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/**
 * Magnetic hover physics driven by motion values (never useState),
 * so continuous pointer movement does not re-render the React tree.
 * `strength` scales how far the element follows the cursor.
 */
export function useMagnetic(strength = 0.5) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const sy = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  function onMove(e: React.MouseEvent) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * strength);
    y.set((e.clientY - r.top - r.height / 2) * strength);
  }
  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return { ref, x: sx, y: sy, onMove, onLeave };
}
