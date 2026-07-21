import { NextResponse } from "next/server";
import { submitFormToN8n } from "@/app/lib/api/n8n";
import {
  badRequest,
  conflict,
  notFound,
} from "@/app/lib/api/responses";
import { isSurveyId, type SurveyId } from "@/app/lib/api/types";
import {
  isHandoffSecretConfigured,
  verifyWpHandoffToken,
} from "@/app/lib/api/wpToken";

export const runtime = "nodejs";

type N8nSubmitRequestBody = {
  surveyId: SurveyId;
  status: "draft" | "completed";
  answers: Record<string, string>;
  completedAt?: string;
  normalizedAnswers?: unknown;
};

function parseBody(
  body: unknown,
): { ok: true; data: N8nSubmitRequestBody } | { ok: false; message: string } {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, message: "Request body must be a JSON object" };
  }

  const record = body as Record<string, unknown>;
  const { surveyId, status, answers, completedAt } = record;

  if (typeof surveyId !== "string" || !isSurveyId(surveyId)) {
    return { ok: false, message: "surveyId must be a valid survey slug" };
  }

  if (status !== "draft" && status !== "completed") {
    return { ok: false, message: 'status must be "draft" or "completed"' };
  }

  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    return { ok: false, message: "answers must be an object keyed by step_{id}" };
  }

  for (const [key, value] of Object.entries(answers)) {
    if (!key.startsWith("step_")) {
      return { ok: false, message: `Invalid answer key "${key}" — expected step_{id}` };
    }
    if (typeof value !== "string") {
      return { ok: false, message: `Answer "${key}" must be a string` };
    }
  }

  if (status === "completed") {
    if (typeof completedAt !== "string" || !completedAt.trim()) {
      return { ok: false, message: "completedAt is required when status is completed" };
    }
  } else if (completedAt !== undefined && typeof completedAt !== "string") {
    return { ok: false, message: "completedAt must be an ISO date string when provided" };
  }

  return {
    ok: true,
    data: {
      surveyId,
      status,
      answers: answers as Record<string, string>,
      ...(typeof completedAt === "string" ? { completedAt } : {}),
      normalizedAnswers: record.normalizedAnswers,
    },
  };
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  const verified = verifyWpHandoffToken(token);
  if (!verified.ok) {
    // Server-only diagnostic — never logs the secret or full token.
    console.error("[n8n-submit] handoff token rejected", {
      reason: verified.reason,
      secretConfigured: isHandoffSecretConfigured(),
      tokenPresent: Boolean(token),
      tokenParts: token ? token.split(".").length : 0,
    });
    return NextResponse.json(
      {
        error: "unauthorized",
        message:
          "لطفاً به صفحه‌ی سفارش‌ها برگردید و دوباره روی دکمه کلیک کنید",
        details: {
          reason: verified.reason,
          secretConfigured: isHandoffSecretConfigured(),
        },
      },
      { status: 401 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const parsed = parseBody(json);
  if (!parsed.ok) return badRequest(parsed.message);

  const orderIdFromUrl = url.searchParams.get("order_id")?.trim() || null;
  const orderSkuFromUrl = url.searchParams.get("order_sku")?.trim() || null;

  // Signed token claims are authoritative. URL may fill gaps, never override.
  if (
    orderIdFromUrl &&
    verified.claims.orderId &&
    orderIdFromUrl !== verified.claims.orderId
  ) {
    return badRequest("order_id does not match handoff token");
  }

  if (
    orderSkuFromUrl &&
    verified.claims.orderSku &&
    orderSkuFromUrl !== verified.claims.orderSku
  ) {
    return badRequest("order_sku does not match handoff token");
  }

  const claims = {
    ...verified.claims,
    orderId: verified.claims.orderId ?? orderIdFromUrl,
    orderSku: verified.claims.orderSku ?? orderSkuFromUrl,
  };

  const result = await submitFormToN8n(claims, parsed.data);

  if (result.ok) {
    return NextResponse.json(
      { ok: true, message: "accepted" },
      { status: 202 },
    );
  }

  console.error("[n8n-submit] n8n forward failed", {
    status: result.status,
    message: result.message,
    body: result.body,
  });

  if (result.status === 404) {
    return notFound("سفارش پیدا نشد، با پشتیبانی تماس بگیرید");
  }

  if (result.status === 409) {
    return conflict("این فرم قبلاً ثبت شده است");
  }

  if (result.status === 502) {
    return NextResponse.json(
      {
        error: "bad_gateway",
        message: "مشکلی پیش آمد، لطفاً کمی بعد دوباره امتحان کنید",
        details: { upstream: result.message },
      },
      { status: 502 },
    );
  }

  // Includes n8n 401 Invalid secret and other upstream failures.
  return NextResponse.json(
    {
      error: "internal_error",
      message: "مشکلی پیش آمد، لطفاً کمی بعد دوباره امتحان کنید",
      details: {
        upstreamStatus: result.status,
        upstream: result.message,
      },
    },
    { status: 500 },
  );
}
