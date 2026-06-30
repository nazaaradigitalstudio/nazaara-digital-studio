export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[var(--hairline)] pb-12 pt-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-[280px] left-1/2 h-[560px] w-[760px] -translate-x-1/2 rounded-full blur-[40px]"
        style={{
          background: "radial-gradient(circle,rgba(110,139,255,.16),transparent 60%)",
          animation: "breathe 7s var(--ease-out-expo) infinite",
        }}
      />
      <div className="relative z-[1] mx-auto max-w-[1320px] px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-10">
          <h3 className="max-w-[600px] text-[clamp(34px,5vw,68px)] tracking-[-0.02em]">
            Let&apos;s build something with mass.
          </h3>
          <div className="flex flex-wrap gap-8 md:gap-14">
            <div>
              <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-faint">Studio</div>
              {[
                ["#work", "Work"],
                ["#services", "Services"],
              ].map(([h, l]) => (
                <a key={l} href={h} className="mb-2.5 block text-smoke transition-colors hover:text-chrome">
                  {l}
                </a>
              ))}
            </div>
            <div>
              <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-faint">Talk to us</div>
              <a href="tel:+917799339922" className="mb-2.5 block text-smoke transition-colors hover:text-chrome">
                +91 77993 39922
              </a>
              <a href="tel:+917428257741" className="mb-2.5 block text-smoke transition-colors hover:text-chrome">
                +91 74282 57741
              </a>
              <a href="mailto:nazaaradigitalstudio@gmail.com" className="mb-2.5 block text-smoke transition-colors hover:text-chrome">
                nazaaradigitalstudio@gmail.com
              </a>
            </div>
            <div>
              <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-faint">Elsewhere</div>
              {["Instagram", "LinkedIn"].map((l) => (
                <a key={l} href="#" className="mb-2.5 block text-smoke transition-colors hover:text-chrome">
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-14 flex flex-wrap justify-between gap-3.5 md:mt-20 border-t border-[var(--hairline)] pt-7 text-[13px] text-faint">
          <span>© 2026 Nazaara Digital Studio</span>
          <span className="font-mono">नज़ारा · a view worth beholding</span>
        </div>
      </div>

      <style>{`@keyframes breathe {
        0%,100% { opacity: .5; transform: translateX(-50%) scale(1); }
        50% { opacity: .9; transform: translateX(-50%) scale(1.08); }
      }`}</style>
    </footer>
  );
}
