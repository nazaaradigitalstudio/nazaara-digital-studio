"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { Code2, Sparkles, Share2, TrendingUp, Plus } from "lucide-react";
import { SERVICES, type Service } from "@/lib/data";

const ICONS = [Code2, Sparkles, Share2, TrendingUp];

function Card({ service, Icon }: { service: Service; Icon: typeof Code2 }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 150, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 150, damping: 18 });
  const glowX = useTransform(mx, (v) => `${v * 100}%`);
  const glowY = useTransform(my, (v) => `${v * 100}%`);

  function onMove(e: React.MouseEvent) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  }
  function onLeave() {
    mx.set(0.5);
    my.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={() => setOpen((v) => !v)}
      data-card
      data-cursor={open ? "close" : "open"}
      style={{ rotateX: reduce ? 0 : rx, rotateY: reduce ? 0 : ry, transformPerspective: 900 }}
      className="group relative cursor-pointer overflow-hidden rounded-[20px] border border-[var(--hairline)] p-10 transition-colors duration-500 hover:border-[var(--hairline-strong)]"
    >
      <motion.div
        aria-hidden
        style={{ left: glowX, top: glowY, x: "-50%", y: "-50%" }}
        className="pointer-events-none absolute h-[340px] w-[340px] rounded-full opacity-0 blur-[20px] transition-opacity duration-500 group-hover:opacity-100"
      >
        <div className="h-full w-full rounded-full" style={{ background: "radial-gradient(circle,rgba(110,139,255,.22),transparent 60%)" }} />
      </motion.div>

      {/* state indicator: + rotates to x when open */}
      <span aria-hidden className="pointer-events-none absolute right-9 top-9 h-[18px] w-[18px]">
        <Plus
          className={`h-[18px] w-[18px] text-smoke transition-transform duration-500 group-hover:text-chrome ${open ? "rotate-[135deg]" : ""}`}
          strokeWidth={1.25}
        />
      </span>

      <div className="relative z-[1]">
        <div className="font-mono text-xs tracking-[0.2em] text-faint">{service.num}</div>
        <Icon className="mb-7 mt-14 h-11 w-11 text-chrome transition-transform duration-500 group-hover:scale-110" strokeWidth={1.25} />
        <h3 className="text-[clamp(26px,3vw,40px)] tracking-[-0.02em]">{service.title}</h3>
        <p className="mt-3.5 max-w-[380px] font-light text-smoke">{service.tag}</p>

        <motion.div
          initial={false}
          animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0, marginTop: open ? 26 : 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <ul className="grid gap-3">
            {service.items.map(([a, b]) => (
              <li key={a} className="flex justify-between border-t border-[var(--hairline)] pt-3 text-sm font-light text-smoke">
                <span>{a}</span>
                <span className="font-mono text-xs text-ion">{b}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Services() {
  return (
    <section id="services" className="py-20 md:py-32">
      <div className="mx-auto max-w-[1320px] px-5 md:px-8">
        <div className="mb-12 md:mb-20">
          <h2 className="text-[clamp(34px,5.5vw,76px)]">What we build</h2>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {SERVICES.map((s, i) => (
            <Card key={s.num} service={s} Icon={ICONS[i]} />
          ))}
        </div>
      </div>
    </section>
  );
}
