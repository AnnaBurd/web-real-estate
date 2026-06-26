/**
 * Netlify Function: lead delivery for the contact form (provider-agnostic).
 *
 * Served at /api/lead. The contact form (src/components/site/LeadDialog.astro)
 * POSTs its JSON submission here; this validates it and forwards it onward.
 *
 * Delivery is intentionally NOT tied to any specific provider. It forwards the
 * lead as JSON to whatever URL you put in LEAD_WEBHOOK_URL — point that at a
 * Vietnamese email/SMS service, a Telegram bot, a no-code webhook (Make / n8n /
 * Google Apps Script), or your own backend. Swap providers by changing one env
 * var; no code change. Dependency-free (uses fetch).
 *
 * Configure in Netlify → Site settings → Environment variables (server-side):
 *   LEAD_WEBHOOK_URL  - URL that receives the lead as a JSON POST
 *
 * If LEAD_WEBHOOK_URL is not set, this returns 501 and the form automatically
 * falls back to opening the visitor's mail client (so no lead is lost).
 */

const env = (k: string): string => process.env[k]?.trim() || "";

export default async (req: Request): Promise<Response> => {
  if (req.method !== "POST") {
    return json({ ok: false, error: "Method not allowed" }, 405);
  }

  let lead: Record<string, unknown>;
  try {
    lead = await req.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON" }, 400);
  }

  const name = String(lead.name ?? "").trim();
  const phone = String(lead.phone ?? "").trim();
  const email = String(lead.email ?? "").trim();
  if (!name || (!phone && !email)) {
    return json({ ok: false, error: "Missing name or contact" }, 422);
  }

  const webhook = env("LEAD_WEBHOOK_URL");
  if (!webhook) {
    // Not configured yet — let the form fall back to mailto.
    return json({ ok: false, error: "Lead delivery not configured" }, 501);
  }

  const res = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead),
  }).catch(() => null);

  if (!res || !res.ok) {
    console.error("Lead webhook failed", res ? res.status : "no response");
    return json({ ok: false, error: "Lead delivery failed" }, 502);
  }

  return json({ ok: true }, 200);
};

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const config = { path: "/api/lead" };
