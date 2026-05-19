import { getPearlApiBaseUrl } from "@/lib/pearlApiBaseUrl";

const apiBase = getPearlApiBaseUrl();

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginFieldErrors = Partial<
  Record<"email" | "password", string[]>
>;

export type LoginSuccessUser = {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  createdAt: string;
};

export type LoginResult =
  | { ok: true; status: number; user: LoginSuccessUser }
  | {
      ok: false;
      status: number;
      error?: string;
      fields?: LoginFieldErrors;
      message?: string;
    };

export async function loginAccount(payload: LoginPayload): Promise<LoginResult> {
  const res = await fetch(`${apiBase}/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      email: payload.email,
      password: payload.password,
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
          ? (data.fields as LoginFieldErrors)
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
