import {
  isSurveyId,
  type CreateSubmissionRequest,
  type DraftSubmissionRequest,
  type SubmissionStatus,
  type UpdateSubmissionRequest,
} from "./types";
import type { NormalizedAnswer } from "./types";

function isValidAnswerKey(key: string): boolean {
  return /^step_\d+$/.test(key) || /^[a-z][a-z0-9_]*$/.test(key);
}

function parseAnswersObject(
  answers: unknown,
): { ok: true; data: Record<string, string> } | { ok: false; message: string } {
  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    return {
      ok: false,
      message: "answers must be an object keyed by backendKey or step_{id}",
    };
  }
  for (const [key, value] of Object.entries(answers)) {
    if (!isValidAnswerKey(key)) {
      return {
        ok: false,
        message: `Invalid answer key "${key}" — expected backendKey or step_{id}`,
      };
    }
    if (typeof value !== "string") {
      return { ok: false, message: `Answer "${key}" must be a string` };
    }
  }
  return { ok: true, data: answers as Record<string, string> };
}

function parseNormalizedAnswers(
  value: unknown,
): NormalizedAnswer[] | undefined {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) return undefined;
  return value as NormalizedAnswer[];
}

export function parseDraftSubmissionRequest(
  body: unknown,
): { ok: true; data: DraftSubmissionRequest & { normalizedAnswers?: NormalizedAnswer[] } } | { ok: false; message: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, message: "Request body must be a JSON object" };
  }
  const record = body as Record<string, unknown>;
  const surveyId = record.surveyId;
  if (typeof surveyId !== "string" || !isSurveyId(surveyId)) {
    return { ok: false, message: "surveyId must be a valid survey slug" };
  }
  const parsedAnswers = parseAnswersObject(record.answers);
  if (!parsedAnswers.ok) return parsedAnswers;
  return {
    ok: true,
    data: {
      surveyId,
      answers: parsedAnswers.data,
      normalizedAnswers: parseNormalizedAnswers(record.normalizedAnswers),
    },
  };
}

export function parseUpdateSubmissionRequest(
  body: unknown,
):
  | { ok: true; data: UpdateSubmissionRequest & { normalizedAnswers?: NormalizedAnswer[] } }
  | { ok: false; message: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, message: "Request body must be a JSON object" };
  }
  const record = body as Record<string, unknown>;
  const result: UpdateSubmissionRequest & { normalizedAnswers?: NormalizedAnswer[] } = {};

  if (record.status !== undefined) {
    if (record.status !== "draft" && record.status !== "completed") {
      return { ok: false, message: "status must be draft or completed" };
    }
    result.status = record.status as SubmissionStatus;
  }

  if (record.answers !== undefined) {
    const parsedAnswers = parseAnswersObject(record.answers);
    if (!parsedAnswers.ok) return parsedAnswers;
    result.answers = parsedAnswers.data;
  }

  if (record.completedAt !== undefined) {
    if (record.completedAt !== null && typeof record.completedAt !== "string") {
      return { ok: false, message: "completedAt must be an ISO date string or null" };
    }
    result.completedAt = record.completedAt as string | null;
  }

  if (result.status === "completed" && result.completedAt === undefined) {
    result.completedAt = new Date().toISOString();
  }

  result.normalizedAnswers = parseNormalizedAnswers(record.normalizedAnswers);

  return { ok: true, data: result };
}

export function parseCreateSubmissionRequest(
  body: unknown,
): { ok: true; data: CreateSubmissionRequest } | { ok: false; message: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, message: "Request body must be a JSON object" };
  }

  const record = body as Record<string, unknown>;
  const surveyId = record.surveyId;
  const status = record.status;
  const answers = record.answers;

  if (typeof surveyId !== "string" || !isSurveyId(surveyId)) {
    return { ok: false, message: "surveyId must be a valid survey slug" };
  }

  if (status !== "draft" && status !== "completed") {
    return { ok: false, message: "status must be draft or completed" };
  }

  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    return {
      ok: false,
      message: "answers must be an object keyed by backendKey or step_{id}",
    };
  }

  const parsedAnswers = parseAnswersObject(answers);
  if (!parsedAnswers.ok) return parsedAnswers;

  const completedAt =
    record.completedAt === undefined
      ? undefined
      : typeof record.completedAt === "string"
        ? record.completedAt
        : null;

  if (completedAt === null) {
    return { ok: false, message: "completedAt must be an ISO date string when provided" };
  }

  if (status === "completed" && !completedAt) {
    return { ok: false, message: "completedAt is required when status is completed" };
  }

  return {
    ok: true,
    data: {
      surveyId,
      status: status as SubmissionStatus,
      answers: parsedAnswers.data,
      completedAt,
      normalizedAnswers: parseNormalizedAnswers(record.normalizedAnswers),
    },
  };
}
