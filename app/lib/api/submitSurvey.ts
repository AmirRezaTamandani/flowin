import type {
  Brand,
  CreateSubmissionRequest,
  DraftSubmissionRequest,
  SurveySubmission,
  UpdateSubmissionRequest,
} from "./types";
import type { NormalizedAnswer } from "./types";

const API_BASE = "/api/v1";

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
