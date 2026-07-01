import type { SurveyStep } from "../surveys";

/** Survey slugs used across the app and API. */
export const SURVEY_IDS = [
  "branding",
  "campaign",
  "email",
  "sms",
  "push",
  "seo",
  "social-competitor",
  "social-strategy",
] as const;

export type SurveyId = (typeof SURVEY_IDS)[number];

export type SubmissionStatus = "draft" | "completed";

export type UploadPurpose = "logo" | "font" | "template" | "other";

// ── Answer value shapes (parsed from JSON strings) ──────────────────────────

export type CheckboxWithOtherAnswer = {
  selected: string[];
  other: string;
};

export type CheckboxWithSubOptionsAnswer = {
  selected: string[];
  subSelections: Record<string, string[]>;
};

export type BrandVisualIdentityAnswer = {
  logo: {
    name: string;
    fileId?: string;
    url?: string;
    dataUrl?: string;
  } | null;
  colors: string[];
  font: {
    name: string;
    fileId?: string;
    url?: string;
    dataUrl?: string;
  } | null;
};

export type PersonaFieldsAnswer = {
  ageRange: string;
  gender: string;
  country: string;
  province: string;
  city: string;
  job: string;
  incomeLevel: string;
};

export type GeoLocationAnswer = {
  locations: Array<{ country: string; province: string; city: string }>;
};

export type NamedShamsiDatesAnswer = {
  events: Array<{ name: string; date: string }>;
};

export type PercentageAllocationAnswer = Record<string, number>;

export type FileUploadAnswer = {
  description: string;
  files: Array<{
    name: string;
    fileId?: string;
    url?: string;
    dataUrl?: string;
  }>;
};

export type ParsedAnswerValue =
  | string
  | string[]
  | CheckboxWithOtherAnswer
  | CheckboxWithSubOptionsAnswer
  | BrandVisualIdentityAnswer
  | PersonaFieldsAnswer
  | GeoLocationAnswer
  | NamedShamsiDatesAnswer
  | PercentageAllocationAnswer
  | FileUploadAnswer;

/** One answer after normalization (recommended for storage / analytics). */
export type NormalizedAnswer = {
  stepId: number;
  question: string;
  type: SurveyStep["type"];
  value: ParsedAnswerValue;
  /** Original form field value before parsing. */
  raw: string;
};

// ── API entities ──────────────────────────────────────────────────────────

export type Brand = {
  id: string;
  userId: string;
  name: string | null;
  websiteUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UploadedFileRecord = {
  id: string;
  brandId: string;
  submissionId: string | null;
  stepId: number | null;
  field: string;
  purpose: UploadPurpose;
  url: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
};

export type SurveySubmission = {
  id: string;
  brandId: string;
  surveyId: SurveyId;
  status: SubmissionStatus;
  /** Raw answers keyed by `step_{id}` — matches current frontend payload. */
  answers: Record<string, string>;
  /** Parsed answers — optional denormalized column or separate table. */
  normalizedAnswers?: NormalizedAnswer[];
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

// ── Request / response DTOs ───────────────────────────────────────────────

export type ApiError = {
  error: string;
  message: string;
  details?: Record<string, unknown>;
};

export type CreateBrandRequest = {
  name?: string;
  websiteUrl?: string;
};

export type CreateBrandResponse = Brand;

export type GetBrandResponse = Brand | null;

/**
 * Primary submission payload from the frontend (current SurveyStepper output).
 * Keys in `answers` are `step_1`, `step_2`, … Values are strings; complex
 * types are JSON-encoded strings.
 */
export type CreateSubmissionRequest = {
  surveyId: SurveyId;
  status: SubmissionStatus;
  answers: Record<string, string>;
  completedAt?: string;
};

export type UpdateSubmissionRequest = {
  status?: SubmissionStatus;
  answers?: Record<string, string>;
  completedAt?: string | null;
};

export type CreateSubmissionResponse = SurveySubmission;

export type GetSubmissionResponse = SurveySubmission;

export type ListSubmissionsResponse = {
  items: SurveySubmission[];
};

export type UploadFileRequest = {
  purpose: UploadPurpose;
  brandId: string;
  submissionId?: string;
  stepId?: number;
  field?: string;
  /** multipart file field name: `file` */
};

export type UploadFileResponse = UploadedFileRecord;

/** Metadata exported for backend reference (survey definitions live in frontend for now). */
export type SurveyMetadata = {
  id: SurveyId;
  label: string;
  title: string;
  stepCount: number;
  stepTypes: SurveyStep["type"][];
};

export function isSurveyId(value: string): value is SurveyId {
  return (SURVEY_IDS as readonly string[]).includes(value);
}
