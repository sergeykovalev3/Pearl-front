const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

export function sanitizeEmailInput(raw: string): string {
  return raw.replace(/\s/g, "");
}

const EMAIL_TYPED_CHARS_RE = /[^a-zA-Z0-9@._+-]/g;

export function sanitizeEmailTypedInput(raw: string): string {
  return sanitizeEmailInput(raw).replace(EMAIL_TYPED_CHARS_RE, "");
}
