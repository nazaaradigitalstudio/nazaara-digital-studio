import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { leadSchema, sanitize } from "@/lib/leadSchema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function verifyTurnstile(token: string, ip?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // no secret configured: skip (local dev). Set it in production.
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.append("remoteip", ip);
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
    });
    const data = (await res.json()) as { success?: boolean };
    return !!data.success;
  } catch {
    return false;
  }
}

type LeadRow = {
  full_name: string;
  business_name: string;
  website: string | null;
  business_stage: string;
  core_problem: string[];
  current_flow: string;
  growth_goal: string;
  budget: string;
  preferred_contact: string;
  contact_detail: string;
};

// Escape user-provided values before placing them in the notification email.
function esc(s: string): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Sends a notification email via Resend. No-ops if not configured, and never
// throws: a failed notification must not fail the lead submission itself.
async function notifyLead(row: LeadRow): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_TO;
  if (!key || !to) return;

  const from = process.env.LEAD_NOTIFY_FROM || "Nazaara Leads <onboarding@resend.dev>";
  const recipients = to.split(",").map((s) => s.trim()).filter(Boolean);

  const r = (label: string, value: string) =>
    `<tr><td style="padding:6px 14px 6px 0;color:#6b7280;font:500 12px/1.4 system-ui;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:6px 0;color:#111827;font:400 14px/1.5 system-ui">${value}</td></tr>`;

  const html = `
  <div style="max-width:560px;margin:0 auto;padding:28px;background:#ffffff">
    <div style="font:600 12px/1 system-ui;letter-spacing:.18em;text-transform:uppercase;color:#6e8bff">New lead</div>
    <h2 style="margin:10px 0 4px;font:600 24px/1.2 system-ui;color:#0b0c11">${esc(row.business_name)}</h2>
    <div style="font:400 14px/1.4 system-ui;color:#6b7280">${esc(row.full_name)}</div>
    <table style="margin-top:20px;border-top:1px solid #eee;width:100%;border-collapse:collapse">
      ${r("Contact", `${esc(row.contact_detail)} <span style="color:#9ca3af">(${esc(row.preferred_contact)})</span>`)}
      ${row.website ? r("Website", esc(row.website)) : ""}
      ${r("Stage", esc(row.business_stage))}
      ${r("Budget", esc(row.budget))}
      ${r("Focus", esc(row.core_problem.join(", ")))}
      ${r("Discovery", esc(row.current_flow))}
      ${r("Growth goal", esc(row.growth_goal))}
    </table>
  </div>`;

  // If they prefer email, set reply-to so you can answer them directly.
  const replyTo =
    row.preferred_contact === "Email" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.contact_detail)
      ? row.contact_detail
      : undefined;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: recipients,
        subject: `New lead: ${row.business_name} (${row.full_name})`,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[lead] Resend rejected the email:", res.status, text);
    } else if (process.env.NODE_ENV !== "production") {
      console.log("[lead] Notification email sent to:", recipients.join(", "));
    }
  } catch (e) {
    console.error("[lead] Notification email network error:", e);
  }
}

export async function POST(req: Request) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }

    // 1. Honeypot: a hidden field only a bot would fill.
    if (typeof body.hp_website === "string" && body.hp_website.trim() !== "") {
      return NextResponse.json({ ok: true }); // pretend success, store nothing
    }

    // 2. Timing heuristic: instant submits are almost always bots.
    if (typeof body.elapsed === "number" && body.elapsed < 1200) {
      return NextResponse.json({ error: "Too fast" }, { status: 400 });
    }

    // 3. Cloudflare Turnstile.
    const ip =
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      undefined;
    const human = await verifyTurnstile(String(body.turnstileToken ?? ""), ip);
    if (!human) {
      return NextResponse.json({ error: "Verification failed" }, { status: 400 });
    }

    // 4. Zod validation (authoritative).
    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid submission", issues: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }
    const d = parsed.data;

    // 5. Sanitize + insert.
    const row = {
      full_name: sanitize(d.full_name, 80),
      business_name: sanitize(d.business_name, 120),
      website: d.website ? sanitize(d.website, 200) : null,
      business_stage: d.business_stage,
      core_problem: d.core_problem,
      current_flow: sanitize(d.current_flow, 1500),
      growth_goal: sanitize(d.growth_goal, 1500),
      budget: d.budget,
      preferred_contact: d.preferred_contact,
      contact_detail: sanitize(d.contact_detail, 120),
    };

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/+$/, "");
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
    if (!url || !key) {
      return NextResponse.json({ error: "Server not configured (missing Supabase env vars)" }, { status: 500 });
    }

    const supabase = createClient(url, key, { auth: { persistSession: false } });
    const { error } = await supabase.from("leads").insert(row);
    if (error) {
      console.error("Supabase insert failed:", error.message);
      const detail =
        process.env.NODE_ENV === "production" ? "Insert failed" : `Insert failed: ${error.message}`;
      return NextResponse.json({ error: detail }, { status: 500 });
    }

    // Lead is saved; ping the studio. Awaited but guarded so it can't fail the request.
    await notifyLead(row);

    return NextResponse.json({ ok: true });
  } catch (e) {
    // Anything unexpected (e.g. a missing dependency) lands here instead of an
    // empty 500. In dev we return the real message so it shows in the modal.
    console.error("[lead route] unhandled error:", e);
    const detail = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      { error: process.env.NODE_ENV === "production" ? "Server error" : `Server error: ${detail}` },
      { status: 500 }
    );
  }
}
