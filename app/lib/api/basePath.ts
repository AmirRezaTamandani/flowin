/**
 * Must stay in sync with `basePath` in next.config.ts.
 * Runtime fallback also detects `/form` from the current URL so API calls
 * never drop the prefix if the env inlining misses on the client.
 */
export const CONFIGURED_BASE_PATH = "/form";

export function getAppBasePath(): string {
  const fromEnv = process.env.NEXT_PUBLIC_BASE_PATH?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  if (typeof window !== "undefined") {
    const path = window.location.pathname;
    if (path === CONFIGURED_BASE_PATH || path.startsWith(`${CONFIGURED_BASE_PATH}/`)) {
      return CONFIGURED_BASE_PATH;
    }
  }

  return CONFIGURED_BASE_PATH;
}

export function getApiV1Base(): string {
  return `${getAppBasePath()}/api/v1`;
}
