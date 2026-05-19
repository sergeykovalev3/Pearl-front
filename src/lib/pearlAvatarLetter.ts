export function pearlAvatarLetter(fullName: string, email: string): string {
  const name = fullName.trim();
  const nameMatch = name.match(/\p{L}/u);
  if (nameMatch) return nameMatch[0].toUpperCase();

  const local = email.trim().split("@")[0] ?? "";
  const emailMatch = local.match(/[\p{L}\d]/u);
  if (emailMatch) return emailMatch[0].toUpperCase();

  return "?";
}
