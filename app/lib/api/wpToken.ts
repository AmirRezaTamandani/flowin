import { createHmac, timingSafeEqual } from "crypto";

export type WpHandoffClaims = {
  userId: string;
  orderId: string | null;
  orderSku: string | null;
  exp: number | null;
  raw: Record<string, unknown>;
};

export type VerifyWpTokenResult =
  | { ok: true; claims: WpHandoffClaims }
  | { ok: false; reason: "missing_secret" | "malformed" | "bad_signature" | "expired" };

function getHandoffSecret(): string | null {
  const secret =
    process.env.FLOWIN_HANDOFF_SECRET?.trim() ||
    process.env.WP_HANDOFF_SECRET?.trim() ||
    "";
  return secret || null;
}

function normalizeBase64(input: string): string {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const mod = padded.length % 4;
  if (mod === 0) return padded;
  return padded + "=".repeat(4 - mod);
}

function decodePayloadJson(payloadPart: string): Record<string, unknown> | null {
  try {
    const json = Buffer.from(normalizeBase64(payloadPart), "base64").toString("utf8");
    const parsed = JSON.parse(json) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

function safeEqualStrings(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

function hmacHex(secret: string, message: string): string {
  return createHmac("sha256", secret).update(message, "utf8").digest("hex");
}

function hmacBase64Url(secret: string, message: string): string {
  return createHmac("sha256", secret)
    .update(message, "utf8")
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function signatureMatches(secret: string, payloadPart: string, signature: string): boolean {
  const candidates = [
    hmacHex(secret, payloadPart),
    hmacBase64Url(secret, payloadPart),
  ];

  // Also accept HMAC over the decoded JSON string (some WP helpers sign raw JSON).
  try {
    const rawJson = Buffer.from(normalizeBase64(payloadPart), "base64").toString("utf8");
    candidates.push(hmacHex(secret, rawJson), hmacBase64Url(secret, rawJson));
  } catch {
    // ignore decode errors — payload validation happens separately
  }

  return candidates.some((candidate) => safeEqualStrings(candidate, signature));
}

function readStringClaim(
  raw: Record<string, unknown>,
  keys: string[],
): string | null {
  for (const key of keys) {
    const value = raw[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
  return null;
}

function readExpClaim(raw: Record<string, unknown>): number | null {
  const value = raw.exp ?? raw.expires_at ?? raw.expiresAt;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const asNumber = Number(value);
    if (Number.isFinite(asNumber)) return asNumber;
    const asDate = Date.parse(value);
    if (Number.isFinite(asDate)) return Math.floor(asDate / 1000);
  }
  return null;
}

function toClaims(raw: Record<string, unknown>): WpHandoffClaims {
  return {
    userId:
      readStringClaim(raw, ["user_id", "userId", "uid", "customer_id", "customerId"]) ??
      "",
    orderId: readStringClaim(raw, ["order_id", "orderId", "oid"]),
    orderSku: readStringClaim(raw, ["order_sku", "orderSku", "sku"]),
    exp: readExpClaim(raw),
    raw,
  };
}

/**
 * Verifies the WordPress handoff token from the form URL (`?token=`).
 * Expected shape: `<base64url(json)>.<hmac-sha256>` where HMAC uses FLOWIN_HANDOFF_SECRET.
 */
export function verifyWpHandoffToken(token: string | null | undefined): VerifyWpTokenResult {
  const secret = getHandoffSecret();
  if (!secret) return { ok: false, reason: "missing_secret" };

  if (!token || typeof token !== "string") return { ok: false, reason: "malformed" };

  const parts = token.trim().split(".");
  if (parts.length !== 2) return { ok: false, reason: "malformed" };

  const [payloadPart, signature] = parts;
  if (!payloadPart || !signature) return { ok: false, reason: "malformed" };

  if (!signatureMatches(secret, payloadPart, signature)) {
    return { ok: false, reason: "bad_signature" };
  }

  const raw = decodePayloadJson(payloadPart);
  if (!raw) return { ok: false, reason: "malformed" };

  const claims = toClaims(raw);
  if (claims.exp !== null) {
    const nowSec = Math.floor(Date.now() / 1000);
    // Allow small clock skew
    if (claims.exp + 30 < nowSec) return { ok: false, reason: "expired" };
  }

  return { ok: true, claims };
}
