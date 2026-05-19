import { getPearlApiBaseUrl } from "@/lib/pearlApiBaseUrl";

const apiBase = getPearlApiBaseUrl();

export type MarketingLeadPayload =
  | { source: "patient-welcome"; phone: string }
  | {
      source: "care-contact";
      name: string;
      phone: string;
      email: string;
    };

export type SubmitMarketingLeadResult =
  | { ok: true }
  | {
      ok: false;
      message: string;
      fields?: Record<string, string[]>;
    };

export async function submitMarketingLead(
  payload: MarketingLeadPayload,
): Promise<SubmitMarketingLeadResult> {
  let res: Response;
  try {
    res = await fetch(`${apiBase}/v1/lead-requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return {
      ok: false,
      message:
        "Could not reach the server. Check that the API is running or try again shortly.",
    };
  }

  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;

  if (!res.ok) {
    const fields =
      data.fields && typeof data.fields === "object" && data.fields !== null
        ? (data.fields as Record<string, string[]>)
        : undefined;

    const firstPhone = fields?.phone?.[0];
    const firstName = fields?.name?.[0];
    const firstEmail = fields?.email?.[0];

    const msg =
      typeof firstPhone === "string"
        ? firstPhone
        : typeof firstName === "string"
          ? firstName
          : typeof firstEmail === "string"
            ? firstEmail
            : "Something went wrong. Please try again in a few minutes.";

    return {
      ok: false,
      message:
        res.status === 400 && (firstPhone ?? firstName ?? firstEmail)
          ? msg
          : "Something went wrong. Please try again in a few minutes.",
      fields,
    };
  }

  return { ok: true };
}
