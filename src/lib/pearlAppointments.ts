import { getPearlApiBaseUrl } from "@/lib/pearlApiBaseUrl";

const apiBase = getPearlApiBaseUrl();

export type AppointmentRequestFieldErrors = Partial<
  Record<
    "firstName" | "lastName" | "email" | "phone" | "date" | "message",
    string[]
  >
>;

export type SubmitAppointmentRequestPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  date: string;
  message: string;
};

export type SubmitAppointmentRequestResult =
  | { ok: true; status: number }
  | {
      ok: false;
      status: number;
      error?: string;
      fields?: AppointmentRequestFieldErrors;
      message?: string;
    };

export async function submitAppointmentRequest(
  payload: SubmitAppointmentRequestPayload,
): Promise<SubmitAppointmentRequestResult> {
  try {
    const res = await fetch(`${apiBase}/v1/appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        phone: payload.phone,
        date: payload.date,
        message: payload.message,
      }),
    });

    const data = (await res.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        error: typeof data.error === "string" ? data.error : undefined,
        message: typeof data.message === "string" ? data.message : undefined,
        fields:
          data.fields &&
          typeof data.fields === "object" &&
          data.fields !== null
            ? (data.fields as AppointmentRequestFieldErrors)
            : undefined,
      };
    }

    return { ok: true, status: res.status };
  } catch {
    return {
      ok: false,
      status: 0,
      error: "network_error",
      message: "Something went wrong. Check your connection and try again.",
    };
  }
}

export type PearlAppointmentRecord = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneE164: string;
  scheduledOn: string;
  message: string;
  createdAt: string;
};

async function tryRefreshSession(): Promise<boolean> {
  const refreshed = await fetch(`${apiBase}/v1/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });
  return refreshed.ok;
}

export async function fetchMyAppointments(): Promise<
  PearlAppointmentRecord[] | null
> {
  let res = await fetch(`${apiBase}/v1/me/appointments`, {
    credentials: "include",
  });
  if (res.status === 401 && (await tryRefreshSession())) {
    res = await fetch(`${apiBase}/v1/me/appointments`, {
      credentials: "include",
    });
  }
  if (!res.ok) return null;

  const data = (await res.json()) as { appointments?: unknown };
  const raw = data.appointments;
  if (!Array.isArray(raw)) return null;

  const out: PearlAppointmentRecord[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object" || Array.isArray(item)) continue;
    const row = item as Record<string, unknown>;
    if (
      typeof row.id === "string" &&
      typeof row.firstName === "string" &&
      typeof row.lastName === "string" &&
      typeof row.email === "string" &&
      typeof row.phoneE164 === "string" &&
      typeof row.scheduledOn === "string" &&
      typeof row.message === "string" &&
      typeof row.createdAt === "string"
    ) {
      out.push({
        id: row.id,
        firstName: row.firstName,
        lastName: row.lastName,
        email: row.email,
        phoneE164: row.phoneE164,
        scheduledOn: row.scheduledOn,
        message: row.message,
        createdAt: row.createdAt,
      });
    }
  }
  return out;
}
