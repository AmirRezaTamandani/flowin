export function sanitizePhoneValue(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("98")) return digits.slice(0, 12);
  if (digits.startsWith("0")) return digits.slice(0, 11);
  if (digits.startsWith("9")) return `0${digits}`.slice(0, 11);
  return digits.slice(0, 11);
}

export function normalizePhoneDigits(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("98")) return `0${digits.slice(2)}`;
  if (digits.startsWith("9") && !digits.startsWith("0")) return `0${digits}`;
  return digits;
}

export function isPhoneStepValueValid(value: string | string[] | undefined): boolean {
  if (!value || typeof value !== "string" || !value.trim()) return false;
  return /^09\d{9}$/.test(normalizePhoneDigits(value));
}
