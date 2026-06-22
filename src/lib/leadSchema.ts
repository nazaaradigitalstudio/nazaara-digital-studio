import { z } from "zod";

// Option sets are the single source of truth for both the form UI and validation.
export const BUSINESS_STAGES = [
  "Starting out",
  "Early traction",
  "Scaling",
  "Established",
] as const;

export const CORE_PROBLEMS = [
  "No visibility",
  "Weak website",
  "Poor conversions",
  "No lead flow",
  "Weak positioning",
  "Need better systems",
] as const;

export const BUDGETS = [
  "Under ₹5k",
  "₹5k - ₹10k",
  "₹10k - ₹20k",
  "₹20k+",
  "Not sure yet",
] as const;

export const CONTACT_METHODS = ["WhatsApp", "Call", "Email"] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[\d\s().-]{7,20}$/;

export const leadSchema = z
  .object({
    full_name: z.string().trim().min(2, "Tell us your name").max(80),
    business_name: z.string().trim().min(2, "Tell us your business name").max(120),
    website: z.string().trim().max(200).optional().or(z.literal("")),
    business_stage: z.enum(BUSINESS_STAGES),
    core_problem: z
      .array(z.enum(CORE_PROBLEMS))
      .min(1, "Choose at least one")
      .max(CORE_PROBLEMS.length),
    current_flow: z.string().trim().min(4, "A sentence is plenty").max(1500),
    growth_goal: z.string().trim().min(4, "A sentence is plenty").max(1500),
    budget: z.enum(BUDGETS),
    preferred_contact: z.enum(CONTACT_METHODS),
    contact_detail: z.string().trim().min(1, "Add your contact details").max(120),
  })
  .superRefine((data, ctx) => {
    // Email method -> validate an email. WhatsApp / Call -> validate a phone number.
    if (data.preferred_contact === "Email" && !EMAIL_RE.test(data.contact_detail)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["contact_detail"], message: "Enter a valid email address" });
    }
    if (
      (data.preferred_contact === "WhatsApp" || data.preferred_contact === "Call") &&
      !PHONE_RE.test(data.contact_detail)
    ) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["contact_detail"], message: "Enter a valid phone number" });
    }
  });

export type LeadInput = z.infer<typeof leadSchema>;

export const EMPTY_LEAD: LeadInput = {
  full_name: "",
  business_name: "",
  website: "",
  business_stage: "" as LeadInput["business_stage"],
  core_problem: [],
  current_flow: "",
  growth_goal: "",
  budget: "" as LeadInput["budget"],
  preferred_contact: "" as LeadInput["preferred_contact"],
  contact_detail: "",
};

// Defense in depth: strip control characters, trim, and cap length.
// Supabase parametrizes queries, so this is belt-and-suspenders, not the only guard.
export function sanitize(value: unknown, max = 2000): string {
  return String(value ?? "")
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .slice(0, max);
}
