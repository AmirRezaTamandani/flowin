import type {
  NormalizedAnswer,
  SubmissionStatus,
  SurveyId,
  SurveySubmission,
} from "@/app/lib/api/types";
import { readStore, updateStore } from "./store";

function nowIso() {
  return new Date().toISOString();
}

export async function listSubmissions(
  brandId: string,
  filters?: { surveyId?: SurveyId; status?: SubmissionStatus },
): Promise<SurveySubmission[]> {
  const store = await readStore();
  return store.submissions.filter((item) => {
    if (item.brandId !== brandId) return false;
    if (filters?.surveyId && item.surveyId !== filters.surveyId) return false;
    if (filters?.status && item.status !== filters.status) return false;
    return true;
  });
}

export async function getSubmissionById(
  brandId: string,
  submissionId: string,
): Promise<SurveySubmission | null> {
  const store = await readStore();
  const submission = store.submissions.find(
    (item) => item.id === submissionId && item.brandId === brandId,
  );
  return submission ?? null;
}

function findDraft(
  submissions: SurveySubmission[],
  brandId: string,
  surveyId: SurveyId,
): SurveySubmission | undefined {
  return submissions.find(
    (item) =>
      item.brandId === brandId && item.surveyId === surveyId && item.status === "draft",
  );
}

function hasCompletedBranding(
  submissions: SurveySubmission[],
  brandId: string,
): boolean {
  return submissions.some(
    (item) =>
      item.brandId === brandId &&
      item.surveyId === "branding" &&
      item.status === "completed",
  );
}

export async function upsertDraftSubmission(input: {
  brandId: string;
  surveyId: SurveyId;
  answers: Record<string, string>;
  normalizedAnswers: NormalizedAnswer[];
}): Promise<SurveySubmission> {
  let result!: SurveySubmission;
  await updateStore((store) => {
    const existing = findDraft(store.submissions, input.brandId, input.surveyId);
    const timestamp = nowIso();
    if (existing) {
      existing.answers = input.answers;
      existing.normalizedAnswers = input.normalizedAnswers;
      existing.updatedAt = timestamp;
      result = existing;
      return;
    }
    const submission: SurveySubmission = {
      id: crypto.randomUUID(),
      brandId: input.brandId,
      surveyId: input.surveyId,
      status: "draft",
      answers: input.answers,
      normalizedAnswers: input.normalizedAnswers,
      completedAt: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    store.submissions.push(submission);
    result = submission;
  });
  return result;
}

export async function createSubmission(input: {
  brandId: string;
  surveyId: SurveyId;
  status: SubmissionStatus;
  answers: Record<string, string>;
  normalizedAnswers: NormalizedAnswer[];
  completedAt?: string;
}): Promise<SurveySubmission | "branding_conflict"> {
  let result: SurveySubmission | "branding_conflict" = "branding_conflict";
  await updateStore((store) => {
    if (
      input.surveyId === "branding" &&
      input.status === "completed" &&
      hasCompletedBranding(store.submissions, input.brandId)
    ) {
      result = "branding_conflict";
      return;
    }
    const timestamp = nowIso();
    const submission: SurveySubmission = {
      id: crypto.randomUUID(),
      brandId: input.brandId,
      surveyId: input.surveyId,
      status: input.status,
      answers: input.answers,
      normalizedAnswers: input.normalizedAnswers,
      completedAt: input.status === "completed" ? (input.completedAt ?? timestamp) : null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    store.submissions.push(submission);
    result = submission;
  });
  return result;
}

export async function updateSubmission(
  brandId: string,
  submissionId: string,
  patch: {
    status?: SubmissionStatus;
    answers?: Record<string, string>;
    normalizedAnswers?: NormalizedAnswer[];
    completedAt?: string | null;
  },
): Promise<SurveySubmission | "not_found" | "branding_conflict"> {
  let result: SurveySubmission | "not_found" | "branding_conflict" = "not_found";
  await updateStore((store) => {
    const submission = store.submissions.find(
      (item) => item.id === submissionId && item.brandId === brandId,
    );
    if (!submission) {
      result = "not_found";
      return;
    }
    const nextStatus = patch.status ?? submission.status;
    if (
      submission.surveyId === "branding" &&
      nextStatus === "completed" &&
      submission.status !== "completed" &&
      hasCompletedBranding(store.submissions, brandId)
    ) {
      result = "branding_conflict";
      return;
    }
    if (patch.answers) submission.answers = patch.answers;
    if (patch.normalizedAnswers) submission.normalizedAnswers = patch.normalizedAnswers;
    if (patch.status) submission.status = patch.status;
    if (patch.completedAt !== undefined) submission.completedAt = patch.completedAt;
    else if (nextStatus === "completed" && !submission.completedAt) {
      submission.completedAt = nowIso();
    }
    submission.updatedAt = nowIso();
    result = submission;
  });
  return result;
}

export async function removeDraftIfCompleted(
  brandId: string,
  surveyId: SurveyId,
  keepSubmissionId: string,
): Promise<void> {
  await updateStore((store) => {
    store.submissions = store.submissions.filter(
      (item) =>
        !(
          item.brandId === brandId &&
          item.surveyId === surveyId &&
          item.status === "draft" &&
          item.id !== keepSubmissionId
        ),
    );
  });
}
