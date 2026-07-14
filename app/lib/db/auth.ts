export function getUserIdFromRequest(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  const token = header.slice("Bearer ".length).trim();
  if (!token.startsWith("mock-jwt-")) return null;
  const body = token.slice("mock-jwt-".length);
  const lastDash = body.lastIndexOf("-");
  if (lastDash <= 0) return null;
  const userId = body.slice(0, lastDash);
  return userId || null;
}

export function requireUserId(request: Request): string | null {
  return getUserIdFromRequest(request);
}
