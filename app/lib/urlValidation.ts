export const INVALID_WEBSITE_URL_MESSAGE = "لطفاً یک آدرس اینترنتی معتبر وارد کنید.";

export function normalizeWebsiteUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function isValidWebsiteUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;

  try {
    const url = new URL(normalizeWebsiteUrl(trimmed));
    if (!["http:", "https:"].includes(url.protocol)) return false;

    const hostname = url.hostname.toLowerCase();
    if (!hostname) return false;
    if (hostname === "localhost") return true;
    if (!hostname.includes(".")) return false;
    if (!/^[a-z0-9.-]+$/i.test(hostname)) return false;

    const tld = hostname.split(".").at(-1);
    return Boolean(tld && tld.length >= 2);
  } catch {
    return false;
  }
}

export function isWebsiteUrlStepValueValid(value: string | string[] | undefined): boolean {
  return typeof value === "string" && isValidWebsiteUrl(value);
}
