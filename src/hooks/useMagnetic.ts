"use client";
import { useEffect, useRef } from "react";
import { useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/**
 * Proximity "gravity": the element leans toward the cursor as it approaches,
 * not only on contact. The pull begins once the cursor enters a reach zone
 * around the element, scales with how close it is, and is hard-capped so the
 * element drifts just enough to be felt, never all the way to the cursor.
 * Driven entirely by motion values (never useState) so pointer movement
 * doesn't re-render the tree.
 *
 * strength - how strongly it follows the cursor (0..1-ish)
 * reach    - how many px beyond the element edge the field activates
 * max      - hard cap on displacement in px
 */
export function useMagnetic(strength = 0.5, reach = 130, max = 24) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 140, damping: 16, mass: 0.12 });
  const sy = useSpring(y, { stiffness: 140, damping: 16, mass: 0.12 });

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    // skip on touch / no-hover devices
    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);

      // 1 while the cursor is over the element, fading to 0 by `reach` px outside it
      const innerReach = Math.max(r.width, r.height) / 2;
      const fade = dist <= innerReach ? 1 : Math.max(0, 1 - (dist - innerReach) / reach);

      if (fade <= 0) {
        x.set(0);
        y.set(0);
        return;
      }

      let ox = dx * strength * fade;
      let oy = dy * strength * fade;
      const m = Math.hypot(ox, oy);
      if (m > max) {
        ox = (ox / m) * max;
        oy = (oy / m) * max;
      }
      x.set(ox);
      y.set(oy);
    };

    const reset = () => {
      x.set(0);
      y.set(0);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", reset, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", reset);
    };
  }, [strength, reach, max, reduce, x, y]);

  return { ref, x: sx, y: sy };
}
