import { isSurveyId, type CreateSubmissionRequest, type SubmissionStatus } from "./types";

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
      answers: answers as Record<string, string>,
      completedAt,
    },
  };
}
