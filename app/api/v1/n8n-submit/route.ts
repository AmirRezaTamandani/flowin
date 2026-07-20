import { NextResponse } from "next/server";
import { submitFormToN8n } from "@/app/lib/api/n8n";
import {
  badRequest,
  conflict,
  notFound,
  unauthorized,
} from "@/app/lib/api/responses";
import { isSurveyId, type SurveyId } from "@/app/lib/api/types";
import { verifyWpHandoffToken } from "@/app/lib/api/wpToken";

export const runtime = "nodejs";

type N8nSubmitRequestBody = {
  surveyId: SurveyId;
  status: "completed";
  answers: Record<string, string>;
  completedAt: string;
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

  if (status !== "completed") {
    return { ok: false, message: 'status must be "completed"' };
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

  if (typeof completedAt !== "string" || !completedAt.trim()) {
    return { ok: false, message: "completedAt must be an ISO date string" };
  }

  return {
    ok: true,
    data: {
      surveyId,
      status: "completed",
      answers: answers as Record<string, string>,
      completedAt,
      normalizedAnswers: record.normalizedAnswers,
    },
  };
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  const verified = verifyWpHandoffToken(token);
  if (!verified.ok) {
    return unauthorized(
      "لطفاً به صفحه‌ی سفارش‌ها برگردید و دوباره روی دکمه کلیک کنید",
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

  const orderIdFromUrl = url.searchParams.get("order_id");
  const orderSkuFromUrl = url.searchParams.get("order_sku");

  // Prefer URL params when present (they match the signed token per handoff).
  const claims = {
    ...verified.claims,
    orderId: orderIdFromUrl?.trim() || verified.claims.orderId,
    orderSku: orderSkuFromUrl?.trim() || verified.claims.orderSku,
  };

  if (
    orderIdFromUrl &&
    verified.claims.orderId &&
    orderIdFromUrl.trim() !== verified.claims.orderId
  ) {
    return badRequest("order_id does not match handoff token");
  }

  const result = await submitFormToN8n(claims, parsed.data);

  if (result.ok) {
    return NextResponse.json(
      { ok: true, message: "accepted" },
      { status: 202 },
    );
  }

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
      },
      { status: 502 },
    );
  }

  return NextResponse.json(
    {
      error: "internal_error",
      message: "مشکلی پیش آمد، لطفاً کمی بعد دوباره امتحان کنید",
    },
    { status: 500 },
  );
}
