"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { WORK, type Work } from "@/lib/data";
import { useStartProject } from "@/components/providers/StartProjectProvider";

function Card({ work, onOpen, large }: { work: Work; onOpen: () => void; large: boolean }) {
  const reduce = useReducedMotion();

  return (
    <motion.button
      onClick={onOpen}
      data-cursor="view"
      data-card
      initial={reduce ? false : { y: 60, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative block w-full overflow-hidden rounded-[18px] bg-ash text-left ${large ? "aspect-[16/11]" : "aspect-[4/3]"}`}
    >
      <div className="absolute inset-0">
        <Image
          src={(work.cardImg ?? work.img) as string}
          alt={`${work.title} site`}
          fill
          sizes="(max-width:780px) 100vw, 50vw"
          className="object-cover object-top brightness-[0.96] transition-[filter,transform] duration-700 group-hover:scale-[1.04] group-hover:brightness-100"
        />
      </div>
      <div className="absolute inset-0 z-[1]" style={{ background: "linear-gradient(180deg,rgba(7,7,10,0) 48%,rgba(7,7,10,.82))" }} />
      <div className="absolute inset-x-0 bottom-0 z-[2] translate-y-2 p-7 transition-transform duration-500 group-hover:translate-y-0">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-cyan">{work.cat}</span>
        <h3 className="mt-2.5 text-[clamp(24px,2.6vw,38px)]">{work.title}</h3>
      </div>
      {work.yr && <span className="absolute right-7 top-7 z-[2] font-mono text-xs text-smoke">{work.yr}</span>}
    </motion.button>
  );
}

function InviteCard({ work, large }: { work: Work; large: boolean }) {
  const reduce = useReducedMotion();
  const { open } = useStartProject();
  return (
    <motion.button
      type="button"
      onClick={open}
      data-cursor="let's talk"
      data-card
      initial={reduce ? false : { y: 60, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative grid w-full place-items-center overflow-hidden rounded-[18px] border border-dashed border-[var(--hairline-strong)] text-center transition-colors duration-500 hover:border-ion ${large ? "aspect-[16/11]" : "aspect-[4/3]"}`}
      style={{ background: "radial-gradient(120% 120% at 50% 0%, rgba(110,139,255,.10), rgba(255,255,255,.01))" }}
    >
      <div className="max-w-[460px] p-10">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-cyan">{work.cat}</span>
        <h3 className="my-4 text-[clamp(28px,3vw,46px)]">{work.title}</h3>
        <p className="mb-7 font-light text-smoke">{work.summary}</p>
        <span className="inline-flex items-center gap-2.5 font-display text-lg font-semibold text-chrome">
          Start a project
          <ArrowRight className="h-5 w-5 transition-transform duration-500 group-hover:translate-x-1.5" />
        </span>
      </div>
    </motion.button>
  );
}

function Modal({ work, onClose }: { work: Work; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[95] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="absolute inset-0 bg-[rgba(4,4,7,.8)] backdrop-blur-[18px]" onClick={onClose} data-cursor="close" />
      <motion.div
        data-lenis-prevent
        className="relative z-[1] max-h-[88vh] w-[min(960px,92vw)] overflow-auto rounded-[20px] border border-[var(--hairline)] bg-obsidian"
        initial={{ y: 30, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 30, scale: 0.98, opacity: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          data-cursor="close"
          className="absolute right-5 top-5 z-[2] grid h-11 w-11 place-items-center rounded-full border border-[var(--hairline-strong)] bg-[rgba(7,7,10,.5)] text-chrome"
        >
          <X className="h-4 w-4" />
        </button>
        {work.img && (
          <div className="relative h-[340px] overflow-hidden">
            <Image src={work.img} alt={work.title} fill sizes="960px" className="object-cover object-top brightness-[0.9]" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,transparent,rgba(11,12,17,.9))" }} />
          </div>
        )}
        <div className="p-7 md:p-12">
          <div className="font-mono text-xs uppercase tracking-[0.24em] text-cyan">{work.cat}</div>
          <h3 className="mb-2 mt-3.5 text-[clamp(34px,5vw,60px)]">{work.title}</h3>
          <p className="max-w-[620px] text-lg font-light text-smoke">{work.summary}</p>
          {work.url && (
            <a
              href={work.url}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="visit"
              className="mt-5 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-cyan transition-colors hover:text-chrome"
            >
              {work.url.replace(/^https?:\/\//, "")}
              <ArrowRight className="h-4 w-4 -rotate-45" />
            </a>
          )}
          {work.stats && (
            <div className="my-10 grid grid-cols-1 gap-6 border-y border-[var(--hairline)] py-7 md:grid-cols-3">
              {work.stats.map(([n, l]) => (
                <div key={l}>
                  <div className="font-display text-[clamp(32px,4vw,52px)] font-semibold">{n}</div>
                  <div className="mt-1.5 text-[13px] text-faint">{l}</div>
                </div>
              ))}
            </div>
          )}
          <p className="max-w-[640px] font-light leading-[1.7] text-smoke">{work.copy}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Portfolio() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="work" className="py-20 pb-10 md:py-32 md:pb-16">
      <div className="mx-auto max-w-[1320px] px-5 md:px-8">
        <div className="mb-12 flex flex-col gap-5 md:mb-20">
          <span className="eyebrow">Selected work</span>
          <h2 className="text-[clamp(34px,5.5vw,76px)]">Gravity, applied.</h2>
          <p className="max-w-[560px] font-light text-smoke">
            One live client build, two studio explorations across genres, and an open slot for what comes next.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {WORK.map((w, i) =>
            w.invite ? (
              <InviteCard key={w.title} work={w} large={i === 0 || i === 3} />
            ) : (
              <Card key={w.title} work={w} large={i === 0 || i === 3} onOpen={() => setActive(i)} />
            )
          )}
        </div>
      </div>

      <AnimatePresence>
        {active !== null && <Modal work={WORK[active]} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  );
}
