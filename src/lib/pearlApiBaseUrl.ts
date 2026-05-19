/**
 * Resolves the public API base URL. If `NEXT_PUBLIC_API_URL` is set without a
 * scheme (e.g. `api.example.com`), browsers treat `fetch()` targets as paths on the
 * current origin — always include `https://…` in env when you can.
 */
export function getPearlApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL;
  const trimmed = raw?.replace(/\/$/, "").trim();
  if (!trimmed) return "http://localhost:4000";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const isLocal =
    /^(localhost|127\.0\.0\.1)(\:|$)/i.test(trimmed) || trimmed.startsWith("[::1]");
  return `${isLocal ? "http" : "https"}://${trimmed}`;
}
