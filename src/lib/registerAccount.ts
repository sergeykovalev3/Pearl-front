import { getPearlApiBaseUrl } from "@/lib/pearlApiBaseUrl";

const apiBase = getPearlApiBaseUrl();

export type RegisterAccountPayload = {
  name: string;
  phone: string;
  email: string;
  password: string;
  termsAccepted: boolean;
};

export type RegisterAccountFieldErrors = Partial<
  Record<"name" | "phone" | "email" | "password" | "termsAccepted", string[]>
>;

export type RegisterAccountSuccessUser = {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  createdAt: string;
};

export type RegisterAccountResult =
  | {
      ok: true;
      status: number;
      user: RegisterAccountSuccessUser;
    }
  | {
      ok: false;
      status: number;
      error?: string;
      fields?: RegisterAccountFieldErrors;
      message?: string;
    };

export async function registerAccount(
  payload: RegisterAccountPayload,
): Promise<RegisterAccountResult> {
  const res = await fetch(`${apiBase}/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      password: payload.password,
      termsAccepted: payload.termsAccepted,
    }),
  });

  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;

  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      error: typeof data.error === "string" ? data.error : undefined,
      message: typeof data.message === "string" ? data.message : undefined,
      fields:
        data.fields && typeof data.fields === "object" && data.fields !== null
          ? (data.fields as RegisterAccountFieldErrors)
          : undefined,
    };
  }

  const rawUser = data.user;
  if (
    !rawUser ||
    typeof rawUser !== "object" ||
    Array.isArray(rawUser)
  ) {
    return {
      ok: false,
      status: res.status,
      error: "invalid_response",
      message: "Unexpected response from server.",
    };
  }

  const u = rawUser as Record<string, unknown>;
  if (
    typeof u.id !== "string" ||
    typeof u.email !== "string" ||
    typeof u.fullName !== "string" ||
    typeof u.phone !== "string" ||
    typeof u.createdAt !== "string"
  ) {
    return {
      ok: false,
      status: res.status,
      error: "invalid_response",
      message: "Unexpected response from server.",
    };
  }

  return {
    ok: true,
    status: res.status,
    user: {
      id: u.id,
      email: u.email,
      fullName: u.fullName,
      phone: u.phone,
      createdAt: u.createdAt,
    },
  };
}
