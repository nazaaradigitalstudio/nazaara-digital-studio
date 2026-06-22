"use client";

import { useEffect, useRef } from "react";

type Pt = { ox: number; oy: number; x: number; y: number; vx: number; vy: number; pd: number };

/**
 * The signature element: a lattice of points that bends toward the cursor like
 * mass under gravity, springs back to rest, and draws faint constellation lines
 * near the pointer. Canvas + rAF only, no React state per frame.
 */
export default function GravityField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0,
      h = 0,
      cols = 0,
      pts: Pt[] = [],
      raf = 0;
    const pointer = { x: -999, y: -999 };
    const R = 215;

    function resize() {
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const gap = w < 680 ? 42 : 36;
      const xs: number[] = [];
      const ys: number[] = [];
      for (let x = gap / 2; x < w; x += gap) xs.push(x);
      for (let y = gap / 2; y < h; y += gap) ys.push(y);
      cols = xs.length;
      pts = [];
      for (const y of ys) for (const x of xs) pts.push({ ox: x, oy: y, x, y, vx: 0, vy: 0, pd: 9999 });
    }

    const onMove = (e: MouseEvent) => {
      const r = cv.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
    };
    const onLeave = () => {
      pointer.x = -999;
      pointer.y = -999;
    };

    function meshLine(p: Pt, q: Pt) {
      const near = Math.min(p.pd, q.pd);
      const op = near < R ? 0.14 + (1 - near / R) * 0.5 : 0.14;
      ctx.strokeStyle = `rgba(130,155,255,${op})`;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(q.x, q.y);
      ctx.stroke();
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const dist = Math.hypot(dx, dy) || 0.0001;
        p.pd = dist;
        if (dist < R) {
          const force = (1 - dist / R) * 3.0;
          p.vx -= (dx / dist) * force;
          p.vy -= (dy / dist) * force;
        }
        p.vx += (p.ox - p.x) * 0.022;
        p.vy += (p.oy - p.y) * 0.022;
        p.vx *= 0.87;
        p.vy *= 0.87;
        p.x += p.vx;
        p.y += p.vy;
      }
      // always-on grid mesh
      ctx.lineWidth = 0.9;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        if (i % cols < cols - 1) meshLine(p, pts[i + 1]);
        const below = i + cols;
        if (below < pts.length) meshLine(p, pts[below]);
      }
      // dots
      for (const p of pts) {
        const disp = Math.hypot(p.x - p.ox, p.y - p.oy);
        const near = p.pd < R ? 1 - p.pd / R : 0;
        const a = Math.min(0.95, 0.34 + disp * 0.025 + near * 0.4);
        const rad = 1.7 + near * 1.4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, rad, 0, 6.283);
        ctx.fillStyle = `rgba(168,188,255,${a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }

    resize();
    frame();
    window.addEventListener("resize", resize);
    const hero = cv.parentElement!;
    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 z-0 h-full w-full" aria-hidden />;
}
