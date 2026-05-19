import { isValidEmail } from "@/lib/emailValidation";
import { isCompleteUsPhone } from "@/lib/usPhone";

export const AUTH_NAME_MIN_LEN = 2;
export const AUTH_NAME_MAX_LEN = 100;

export const AUTH_EMAIL_MIN_LEN = 5;
export const AUTH_EMAIL_MAX_LEN = 254;

export const AUTH_PASSWORD_MIN_LEN = 8;
export const AUTH_PASSWORD_MAX_LEN = 128;

export const AUTH_PHONE_DISPLAY_MAX_LEN = 14;

export function validateAuthName(value: string): string | null {
  const t = value.trim();
  if (!t) return "Please enter your name.";
  if (t.length < AUTH_NAME_MIN_LEN) {
    return `Name must be at least ${AUTH_NAME_MIN_LEN} characters.`;
  }
  return null;
}

export function validateAuthEmail(value: string): string | null {
  const t = value.trim();
  if (!t) return "Please enter your email address.";
  if (t.length < AUTH_EMAIL_MIN_LEN) {
    return `Email must be at least ${AUTH_EMAIL_MIN_LEN} characters.`;
  }
  if (t.length > AUTH_EMAIL_MAX_LEN) {
    return `Email must not exceed ${AUTH_EMAIL_MAX_LEN} characters.`;
  }
  if (!isValidEmail(t)) return "Enter a valid email address.";
  return null;
}

export function validateAuthPassword(value: string): string | null {
  if (!value) return "Please enter a password.";
  if (value.length < AUTH_PASSWORD_MIN_LEN) {
    return `Password must be at least ${AUTH_PASSWORD_MIN_LEN} characters.`;
  }
  if (value.length > AUTH_PASSWORD_MAX_LEN) {
    return `Password must not exceed ${AUTH_PASSWORD_MAX_LEN} characters.`;
  }
  return null;
}

export function validateLoginPassword(value: string): string | null {
  if (!value) return "Please enter your password.";
  if (value.length > AUTH_PASSWORD_MAX_LEN) {
    return `Password must not exceed ${AUTH_PASSWORD_MAX_LEN} characters.`;
  }
  return null;
}

export function validateAuthPhoneDigits(digits: string): string | null {
  if (!digits.length) return "Please enter your phone number.";
  if (!isCompleteUsPhone(digits)) {
    return "Enter a valid 10-digit US phone number.";
  }
  return null;
}
