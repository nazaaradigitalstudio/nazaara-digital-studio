"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { X, ArrowRight, Check, Loader2 } from "lucide-react";
import {
  leadSchema,
  EMPTY_LEAD,
  BUSINESS_STAGES,
  CORE_PROBLEMS,
  BUDGETS,
  CONTACT_METHODS,
  type LeadInput,
} from "@/lib/leadSchema";
import Turnstile from "@/components/ui/Turnstile";

type Status = "idle" | "submitting" | "success" | "error";
type Errors = Partial<Record<keyof LeadInput | "turnstile", string>>;

const EASE = [0.16, 1, 0.3, 1] as const;

function whatsappHref(form: LeadInput, failure = false) {
  const num = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const intro = failure
    ? "Hi Nazaara, I tried submitting the form but the form failed. Here's my business."
    : "Hi Nazaara, I'd like to start a project.";
  const lines = [
    intro,
    "",
    form.full_name && `Name: ${form.full_name}`,
    form.business_name && `Business: ${form.business_name}`,
    form.website && `Website: ${form.website}`,
    form.business_stage && `Stage: ${form.business_stage}`,
    form.core_problem.length && `Focus: ${form.core_problem.join(", ")}`,
    form.budget && `Budget: ${form.budget}`,
    form.contact_detail && `Contact (${form.preferred_contact}): ${form.contact_detail}`,
  ].filter(Boolean);
  return `https://wa.me/${num}?text=${encodeURIComponent(lines.join("\n"))}`;
}

const labelCls = "mb-2.5 block font-mono text-[11px] uppercase tracking-[0.2em] text-faint";
const fieldCls =
  "w-full bg-transparent border-b border-[var(--hairline-strong)] py-3 text-chrome placeholder:text-faint outline-none transition-colors focus:border-ion";
const errCls = "mt-1.5 block font-mono text-[10px] uppercase tracking-[0.15em] text-[#ff8a8a]";

export default function StartProjectModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<LeadInput>(EMPTY_LEAD);
  const [hp, setHp] = useState(""); // honeypot
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [errorDetail, setErrorDetail] = useState("");
  const startedAt = useRef(Date.now());
  const firstFieldRef = useRef<HTMLInputElement>(null);

  // lock background scroll while open; restore on close
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstFieldRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const set = <K extends keyof LeadInput>(key: K, value: LeadInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleProblem = (p: (typeof CORE_PROBLEMS)[number]) =>
    setForm((f) => ({
      ...f,
      core_problem: f.core_problem.includes(p)
        ? f.core_problem.filter((x) => x !== p)
        : [...f.core_problem, p],
    }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (hp) return; // honeypot tripped: silently ignore

    const result = leadSchema.safeParse(form);
    if (!result.success) {
      const next: Errors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof LeadInput;
        if (key && !next[key]) next[key] = issue.message;
      }
      // friendlier copy for the dropdowns when left unselected
      if (!form.business_stage) next.business_stage = "Pick a stage";
      if (!form.budget) next.budget = "Pick a range";
      if (!form.preferred_contact) next.preferred_contact = "Pick a method";
      setErrors(next);
      return;
    }
    if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !token) {
      setErrors({ turnstile: "Please complete the verification" });
      return;
    }

    setErrors({});
    setStatus("submitting");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...result.data,
          hp_website: hp,
          turnstileToken: token,
          elapsed: Date.now() - startedAt.current,
        }),
      });
      if (!res.ok) {
        const detail = await res.json().catch(() => ({}));
        const msg = `${res.status} ${detail?.error ?? ""}`.trim();
        console.error("[Nazaara] Lead submit failed:", res.status, detail);
        setErrorDetail(msg);
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch (err) {
      console.error("[Nazaara] Lead submit error:", err);
      setErrorDetail("Could not reach /api/lead (network or server crash)");
      setStatus("error");
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-[95] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
      role="dialog"
      aria-modal="true"
      aria-label="Start a project"
    >
      <div className="absolute inset-0 bg-[rgba(4,4,7,.8)] backdrop-blur-[18px]" onClick={onClose} data-cursor="close" />

      <motion.div
        data-lenis-prevent
        className="relative z-[1] max-h-[90vh] w-[min(640px,96vw)] overflow-auto rounded-[20px] border border-[var(--hairline)] bg-obsidian"
        initial={{ y: 30, scale: 0.98, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 30, scale: 0.98, opacity: 0 }}
        transition={{ duration: 0.55, ease: EASE }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          data-cursor="close"
          className="absolute right-5 top-5 z-[2] grid h-10 w-10 place-items-center rounded-full border border-[var(--hairline-strong)] bg-[rgba(7,7,10,.5)] text-chrome"
        >
          <X className="h-4 w-4" />
        </button>

        {status === "success" ? (
          <div className="flex flex-col items-center px-8 py-20 text-center">
            <div className="mb-7 grid h-16 w-16 place-items-center rounded-full" style={{ background: "var(--grad-ion)", boxShadow: "var(--shadow-bloom)" }}>
              <Check className="h-7 w-7 text-void" strokeWidth={2.5} />
            </div>
            <h3 className="font-display text-[clamp(28px,4vw,40px)]">Received.</h3>
            <p className="mt-3 max-w-[380px] font-light text-smoke">
              We read every one of these properly. Expect us to reach out
              {form.preferred_contact ? ` via ${form.preferred_contact}` : ""} shortly, with a plan rather than a pitch.
            </p>
            <button onClick={onClose} className="mt-9 rounded-full bg-chrome px-9 py-3.5 font-display font-semibold text-void">
              Close
            </button>
          </div>
        ) : status === "error" ? (
          <div className="flex flex-col items-center px-8 py-20 text-center">
            <h3 className="font-display text-[clamp(26px,4vw,38px)]">That didn&apos;t go through.</h3>
            <p className="mt-3 max-w-[400px] font-light text-smoke">
              Something failed on our side, not yours. Send the same details straight to us on WhatsApp and we&apos;ll pick it up from there.
            </p>
            <a
              href={whatsappHref(form, true)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-9 inline-flex items-center gap-3 rounded-full bg-chrome px-9 py-3.5 font-display font-semibold text-void"
            >
              Continue on WhatsApp <ArrowRight className="h-5 w-5" />
            </a>
            <button onClick={() => setStatus("idle")} className="mt-5 font-mono text-xs uppercase tracking-[0.15em] text-smoke transition-colors hover:text-chrome">
              Try the form again
            </button>
            {process.env.NODE_ENV !== "production" && errorDetail && (
              <p className="mt-6 font-mono text-[11px] text-faint">debug: {errorDetail}</p>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-7 py-10 md:px-12 md:py-12">
            <span className="eyebrow">Start a project</span>
            <h3 className="mt-5 font-display text-[clamp(28px,4.5vw,46px)] leading-[1.02] tracking-[-0.02em]">
              Let&apos;s see if we should
              <br />
              build together.
            </h3>
            <p className="mt-4 max-w-[440px] font-light text-smoke">
              We build complete growth systems, not isolated services. A few questions so we arrive with a plan.
            </p>

            <div className="mt-10 grid gap-8">
              {/* honeypot: offscreen, never shown to humans */}
              <div aria-hidden className="pointer-events-none absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
                <label>
                  Company URL
                  <input tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
                </label>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <label className={labelCls} htmlFor="full_name">Full name</label>
                  <input
                    id="full_name"
                    ref={firstFieldRef}
                    className={fieldCls}
                    placeholder="Your name"
                    value={form.full_name}
                    onChange={(e) => set("full_name", e.target.value)}
                  />
                  {errors.full_name && <span className={errCls}>{errors.full_name}</span>}
                </div>
                <div>
                  <label className={labelCls} htmlFor="business_name">Business name</label>
                  <input
                    id="business_name"
                    className={fieldCls}
                    placeholder="What it's called"
                    value={form.business_name}
                    onChange={(e) => set("business_name", e.target.value)}
                  />
                  {errors.business_name && <span className={errCls}>{errors.business_name}</span>}
                </div>
              </div>

              <div>
                <label className={labelCls} htmlFor="website">Website <span className="text-faint/60">(optional)</span></label>
                <input
                  id="website"
                  className={fieldCls}
                  placeholder="nazaaradigitalstudio.com"
                  value={form.website}
                  onChange={(e) => set("website", e.target.value)}
                />
              </div>

              <div>
                <label className={labelCls} htmlFor="business_stage">Business stage</label>
                <Select
                  id="business_stage"
                  value={form.business_stage}
                  onChange={(v) => set("business_stage", v as LeadInput["business_stage"])}
                  placeholder="Where are you right now?"
                  options={BUSINESS_STAGES as readonly string[]}
                />
                {errors.business_stage && <span className={errCls}>{errors.business_stage}</span>}
              </div>

              <div>
                <label className={labelCls}>Core problem <span className="text-faint/60">(select all that apply)</span></label>
                <div className="flex flex-wrap gap-2.5">
                  {CORE_PROBLEMS.map((p) => {
                    const active = form.core_problem.includes(p);
                    return (
                      <button
                        type="button"
                        key={p}
                        onClick={() => toggleProblem(p)}
                        className={`rounded-full border px-4 py-2 text-sm transition-all duration-300 ${
                          active
                            ? "border-ion bg-[rgba(110,139,255,.14)] text-chrome"
                            : "border-[var(--hairline-strong)] text-smoke hover:text-chrome"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
                {errors.core_problem && <span className={errCls}>{errors.core_problem}</span>}
              </div>

              <div>
                <label className={labelCls} htmlFor="current_flow">How do people currently discover you?</label>
                <textarea
                  id="current_flow"
                  rows={2}
                  className={`${fieldCls} resize-none`}
                  placeholder="Referrals, Instagram, search, word of mouth..."
                  value={form.current_flow}
                  onChange={(e) => set("current_flow", e.target.value)}
                />
                {errors.current_flow && <span className={errCls}>{errors.current_flow}</span>}
              </div>

              <div>
                <label className={labelCls} htmlFor="growth_goal">What does growth look like over the next 3 to 6 months?</label>
                <textarea
                  id="growth_goal"
                  rows={2}
                  className={`${fieldCls} resize-none`}
                  placeholder="More qualified leads, a real brand, a site that converts..."
                  value={form.growth_goal}
                  onChange={(e) => set("growth_goal", e.target.value)}
                />
                {errors.growth_goal && <span className={errCls}>{errors.growth_goal}</span>}
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <label className={labelCls} htmlFor="budget">Budget</label>
                  <Select
                    id="budget"
                    value={form.budget}
                    onChange={(v) => set("budget", v as LeadInput["budget"])}
                    placeholder="A rough range is fine"
                    options={BUDGETS as readonly string[]}
                  />
                  {errors.budget && <span className={errCls}>{errors.budget}</span>}
                </div>
                <div>
                  <label className={labelCls} htmlFor="preferred_contact">Preferred contact</label>
                  <Select
                    id="preferred_contact"
                    value={form.preferred_contact}
                    onChange={(v) => {
                      set("preferred_contact", v as LeadInput["preferred_contact"]);
                      set("contact_detail", "");
                    }}
                    placeholder="How should we reach you?"
                    options={CONTACT_METHODS as readonly string[]}
                  />
                  {errors.preferred_contact && <span className={errCls}>{errors.preferred_contact}</span>}
                </div>
              </div>

              {form.preferred_contact && (
                <div>
                  <label className={labelCls} htmlFor="contact_detail">
                    {form.preferred_contact === "Email"
                      ? "Your email"
                      : form.preferred_contact === "WhatsApp"
                        ? "Your WhatsApp number"
                        : "Your phone number"}
                  </label>
                  <input
                    id="contact_detail"
                    type={form.preferred_contact === "Email" ? "email" : "tel"}
                    inputMode={form.preferred_contact === "Email" ? "email" : "tel"}
                    className={fieldCls}
                    placeholder={form.preferred_contact === "Email" ? "you@yourbusiness.com" : "+91 98765 43210"}
                    value={form.contact_detail}
                    onChange={(e) => set("contact_detail", e.target.value)}
                  />
                  {errors.contact_detail && <span className={errCls}>{errors.contact_detail}</span>}
                </div>
              )}

              {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
                <div>
                  <Turnstile onVerify={setToken} />
                  {errors.turnstile && <span className={errCls}>{errors.turnstile}</span>}
                </div>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                data-cursor={status === "submitting" ? "" : "send"}
                className="mt-2 inline-flex items-center justify-center gap-3 rounded-full bg-chrome px-9 py-4 font-display text-lg font-semibold text-void transition-opacity disabled:opacity-60"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Sending
                  </>
                ) : (
                  <>
                    Send it over <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

/* Minimal dark-themed native select with a custom chevron. */
function Select({
  id,
  value,
  onChange,
  options,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder: string;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ colorScheme: "dark" }}
        className={`${fieldCls} appearance-none pr-8 ${value ? "text-chrome" : "text-faint"}`}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o} className="bg-obsidian text-chrome">{o}</option>
        ))}
      </select>
      <svg className="pointer-events-none absolute right-1 top-1/2 h-4 w-4 -translate-y-1/2 text-smoke" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  );
}
