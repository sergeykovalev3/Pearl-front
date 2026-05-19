export const US_PHONE_DIGIT_COUNT = 10;

export function takeUsPhoneDigits(input: string): string {
  return input.replace(/\D/g, "").slice(0, US_PHONE_DIGIT_COUNT);
}

export function formatUsPhoneMask(digits: string): string {
  const d = digits.slice(0, US_PHONE_DIGIT_COUNT);
  const n = d.length;
  if (n === 0) return "";
  if (n <= 3) return `(${d}`;
  if (n <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export function isCompleteUsPhone(digits: string): boolean {
  return digits.length === US_PHONE_DIGIT_COUNT;
}

export function displayUsPhoneFromE164(e164: string): string {
  const digits = e164.replace(/\D/g, "");
  const core =
    digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  if (core.length === US_PHONE_DIGIT_COUNT) {
    return formatUsPhoneMask(core);
  }
  return e164;
}
