import type { SurveyId } from "./types";
import type { WpHandoffClaims } from "./wpToken";

export type N8nFormSubmitBody = {
  surveyId: SurveyId;
  status: "draft" | "completed";
  answers: Record<string, string>;
  completedAt?: string;
  normalizedAnswers?: unknown;
};

export type N8nSubmitResult =
  | { ok: true; status: 202; body: unknown }
  | { ok: false; status: 404 | 409 | 500 | 502; body: unknown; message: string };

function getN8nConfig(): { url: string; secret: string } | null {
  const url = process.env.N8N_FORM_SUBMIT_URL?.trim();
  const secret = process.env.N8N_SHARED_SECRET?.trim();
  if (!url || !secret) return null;
  return { url, secret };
}

function mapN8nStatus(status: number): 404 | 409 | 500 | 502 | null {
  if (status === 404) return 404;
  if (status === 409) return 409;
  if (status >= 500) return 500;
  return null;
}

/**
 * Forwards form payload (draft or completed) to n8n with the shared secret header.
 */
export async function submitFormToN8n(
  claims: WpHandoffClaims,
  body: N8nFormSubmitBody,
): Promise<N8nSubmitResult> {
  const config = getN8nConfig();
  if (!config) {
    return {
      ok: false,
      status: 500,
      body: null,
      message: "N8N_FORM_SUBMIT_URL or N8N_SHARED_SECRET is not configured",
    };
  }

  const payload = {
    surveyId: body.surveyId,
    status: body.status,
    answers: body.answers,
    ...(body.status === "completed" && body.completedAt
      ? { completedAt: body.completedAt }
      : {}),
    ...(body.normalizedAnswers !== undefined
      ? { normalizedAnswers: body.normalizedAnswers }
      : {}),
    user_id: claims.userId || null,
    order_id: claims.orderId,
    order_sku: claims.orderSku,
  };

  let response: Response;
  try {
    response = await fetch(config.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-flowin-secret": config.secret,
      },
      body: JSON.stringify(payload),
    });
  } catch {
    return {
      ok: false,
      status: 502,
      body: null,
      message: "Failed to reach n8n",
    };
  }

  let responseBody: unknown = null;
  const contentType = response.headers.get("content-type") ?? "";
  try {
    if (contentType.includes("application/json")) {
      responseBody = await response.json();
    } else {
      responseBody = await response.text();
    }
  } catch {
    responseBody = null;
  }

  if (response.status === 202 || response.ok) {
    return { ok: true, status: 202, body: responseBody };
  }

  const mapped = mapN8nStatus(response.status);
  if (mapped) {
    return {
      ok: false,
      status: mapped,
      body: responseBody,
      message: `n8n returned ${response.status}`,
    };
  }

  return {
    ok: false,
    status: 500,
    body: responseBody,
    message: `Unexpected n8n status ${response.status}`,
  };
}
