import { NextResponse } from "next/server";
import type { ApiError } from "@/app/lib/api/types";

/** Stubs return 501 until the real backend is connected. */
export function notImplemented(endpoint: string, hint?: string) {
  const body: ApiError = {
    error: "not_implemented",
    message: `Endpoint ${endpoint} is not implemented yet. See docs/openapi.yaml for the contract.`,
    ...(hint ? { details: { hint } } : {}),
  };
  return NextResponse.json(body, { status: 501 });
}

export function badRequest(message: string, details?: Record<string, unknown>) {
  const body: ApiError = { error: "bad_request", message, details };
  return NextResponse.json(body, { status: 400 });
}

export function unauthorized(message = "Authentication required") {
  const body: ApiError = { error: "unauthorized", message };
  return NextResponse.json(body, { status: 401 });
}
