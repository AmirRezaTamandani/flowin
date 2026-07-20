import type {
  Brand,
  CreateSubmissionRequest,
  DraftSubmissionRequest,
  SurveyId,
  SurveySubmission,
  UpdateSubmissionRequest,
} from "./types";
import type { NormalizedAnswer } from "./types";
import { getSuccessRedirectUrl } from "./redirect";

const APP_BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const API_BASE = `${APP_BASE}/api/v1`;

export class SurveyApiError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function apiFetch<T>(
  path: string,
  token: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    let code = "request_failed";
    let message = `Request failed (${response.status})`;
    try {
      const body = (await response.json()) as { error?: string; message?: string };
      code = body.error ?? code;
      message = body.message ?? message;
    } catch {
      // ignore parse errors
    }
    throw new SurveyApiError(response.status, code, message);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export function messageForN8nSubmitStatus(status: number): string {
  switch (status) {
    case 401:
      return "لطفاً به صفحه‌ی سفارش‌ها برگردید و دوباره روی دکمه کلیک کنید";
    case 404:
      return "مشکلی در یافتن سفارش شما پیش آمد، با پشتیبانی تماس بگیرید";
    case 409:
      return "این فرم قبلاً ثبت شده است";
    case 400:
      return "مشکلی پیش آمد، دوباره تلاش کنید";
    case 500:
    case 502:
      return "مشکلی پیش آمد، لطفاً کمی بعد دوباره امتحان کنید";
    default:
      return "مشکلی پیش آمد، دوباره تلاش کنید";
  }
}

export type N8nClientSubmitPayload = {
  surveyId: SurveyId | string;
  status: "completed";
  answers: Record<string, string>;
  completedAt: string;
  normalizedAnswers?: NormalizedAnswer[];
};

/**
 * Final submit for WordPress-embedded forms → Next API → n8n.
 * On 202, performs a full-page redirect to the WordPress destination.
 */
export async function submitCompletedToN8n(options: {
  token: string;
  orderId?: string | null;
  orderSku?: string | null;
  payload: N8nClientSubmitPayload;
}): Promise<void> {
  const params = new URLSearchParams({ token: options.token });
  if (options.orderId) params.set("order_id", options.orderId);
  if (options.orderSku) params.set("order_sku", options.orderSku);

  const response = await fetch(`${API_BASE}/n8n-submit?${params.toString()}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options.payload),
  });

  if (response.status === 202) {
    const redirectUrl = getSuccessRedirectUrl(
      options.payload.surveyId as SurveyId,
      options.orderId,
      options.orderSku,
    );
    window.location.href = redirectUrl;
    return;
  }

  let message = messageForN8nSubmitStatus(response.status);
  try {
    const body = (await response.json()) as { message?: string };
    if (body.message) message = body.message;
  } catch {
    // keep mapped message
  }

  throw new SurveyApiError(response.status, "n8n_submit_failed", message);
}

export async function ensureBrand(token: string): Promise<Brand> {
  const existing = await apiFetch<Brand | null>("/brands/me", token);
  if (existing) return existing;
  return apiFetch<Brand>("/brands", token, { method: "POST", body: "{}" });
}

export async function fetchDraftSubmission(
  token: string,
  brandId: string,
  surveyId: string,
): Promise<SurveySubmission | null> {
  const result = await apiFetch<{ items: SurveySubmission[] }>(
    `/brands/${brandId}/submissions?surveyId=${encodeURIComponent(surveyId)}&status=draft`,
    token,
  );
  return result.items[0] ?? null;
}

export type SubmissionPayload = {
  surveyId: string;
  status: "draft" | "completed";
  answers: Record<string, string>;
  normalizedAnswers: NormalizedAnswer[];
  completedAt?: string;
};

export async function saveDraftSubmission(
  token: string,
  brandId: string,
  payload: Pick<SubmissionPayload, "surveyId" | "answers" | "normalizedAnswers">,
): Promise<SurveySubmission> {
  const body: DraftSubmissionRequest & { normalizedAnswers: NormalizedAnswer[] } = {
    surveyId: payload.surveyId as DraftSubmissionRequest["surveyId"],
    answers: payload.answers,
    normalizedAnswers: payload.normalizedAnswers,
  };
  return apiFetch<SurveySubmission>(`/brands/${brandId}/submissions/draft`, token, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function completeSubmission(
  token: string,
  brandId: string,
  draftId: string | null,
  payload: SubmissionPayload,
): Promise<SurveySubmission> {
  if (draftId) {
    const patch: UpdateSubmissionRequest & { normalizedAnswers: NormalizedAnswer[] } = {
      status: "completed",
      answers: payload.answers,
      normalizedAnswers: payload.normalizedAnswers,
      completedAt: payload.completedAt,
    };
    return apiFetch<SurveySubmission>(
      `/brands/${brandId}/submissions/${draftId}`,
      token,
      { method: "PATCH", body: JSON.stringify(patch) },
    );
  }

  const body: CreateSubmissionRequest = {
    surveyId: payload.surveyId as CreateSubmissionRequest["surveyId"],
    status: "completed",
    answers: payload.answers,
    normalizedAnswers: payload.normalizedAnswers,
    completedAt: payload.completedAt,
  };
  return apiFetch<SurveySubmission>(`/brands/${brandId}/submissions`, token, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
