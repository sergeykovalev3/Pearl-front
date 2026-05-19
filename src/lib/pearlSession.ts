import { getPearlApiBaseUrl } from "@/lib/pearlApiBaseUrl";

const apiBase = getPearlApiBaseUrl();

export const PEARL_AUTH_CHANGE_EVENT = "pearl-auth-change";

export type PearlSessionUser = {
  id: string;
  email: string;
  fullName: string;
};

const SESSION_HINT_KEY = "pearl_session_hint";

export function readPearlSessionHint(): PearlSessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_HINT_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as unknown;
    if (!data || typeof data !== "object" || Array.isArray(data)) return null;
    const o = data as Record<string, unknown>;
    if (
      typeof o.id !== "string" ||
      typeof o.email !== "string" ||
      typeof o.fullName !== "string"
    ) {
      return null;
    }
    return { id: o.id, email: o.email, fullName: o.fullName };
  } catch {
    return null;
  }
}

export function writePearlSessionHint(user: PearlSessionUser | null): void {
  if (typeof window === "undefined") return;
  try {
    if (!user) {
      sessionStorage.removeItem(SESSION_HINT_KEY);
    } else {
      sessionStorage.setItem(SESSION_HINT_KEY, JSON.stringify(user));
    }
  } catch {
    void 0;
  }
}

async function fetchMe(): Promise<Response> {
  return fetch(`${apiBase}/v1/me`, { credentials: "include" });
}

async function parseMe(res: Response): Promise<PearlSessionUser | null> {
  if (!res.ok) return null;
  const data = (await res.json()) as Record<string, unknown>;
  if (
    typeof data.id !== "string" ||
    typeof data.email !== "string" ||
    typeof data.fullName !== "string"
  ) {
    return null;
  }
  return {
    id: data.id,
    email: data.email,
    fullName: data.fullName,
  };
}

async function tryRefresh(): Promise<boolean> {
  const refreshed = await fetch(`${apiBase}/v1/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });
  return refreshed.ok;
}

export async function pearlFetchSessionUser(): Promise<PearlSessionUser | null> {
  let res = await fetchMe();
  let user = await parseMe(res);
  if (user) return user;

  if (res.status === 401 && (await tryRefresh())) {
    res = await fetchMe();
    user = await parseMe(res);
    if (user) return user;
  }

  return null;
}

export async function pearlFetchSession(): Promise<boolean> {
  const user = await pearlFetchSessionUser();
  return user !== null;
}

export async function logoutPearl(): Promise<void> {
  await fetch(`${apiBase}/v1/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  window.dispatchEvent(new Event(PEARL_AUTH_CHANGE_EVENT));
}
