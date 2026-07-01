import { stepHasCheckboxSubOptions } from "../checkboxWithSubOptions";
import { stepHasOtherOption } from "../checkboxWithOther";
import type { SurveyConfig, SurveyStep } from "../surveys";
import type { FormValues } from "./formValues";
import type { NormalizedAnswer, ParsedAnswerValue } from "./types";

function fieldName(stepId: number): string {
  return `step_${stepId}`;
}

function parseAnswerValue(step: SurveyStep, raw: string): ParsedAnswerValue {
  if (!raw) return "";

  switch (step.type) {
    case "checkbox": {
      if (stepHasCheckboxSubOptions(step) || stepHasOtherOption(step)) {
        try {
          return JSON.parse(raw) as ParsedAnswerValue;
        } catch {
          return raw;
        }
      }
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : raw;
      } catch {
        return raw;
      }
    }
    case "brandVisualIdentity":
    case "personaFields":
    case "geoLocation":
    case "percentageAllocation":
    case "fileUpload":
    case "repeater":
    case "nestedRepeater":
    case "namedShamsiDates":
      try {
        return JSON.parse(raw) as ParsedAnswerValue;
      } catch {
        return raw;
      }
    default:
      return raw;
  }
}

function getParentValue(
  condition: NonNullable<SurveyStep["showIf"]>,
  steps: SurveyStep[],
  values: FormValues,
): string | string[] {
  const parent = steps.find((step) => step.question === condition.parentQuestion);
  if (!parent) return "";
  return values[fieldName(parent.id)] ?? "";
}

function isStepVisible(step: SurveyStep, steps: SurveyStep[], values: FormValues): boolean {
  if (!step.showIf) return true;
  const parentValue = getParentValue(step.showIf, steps, values);
  if (step.showIf.equals !== undefined) {
    return parentValue === step.showIf.equals;
  }
  if (step.showIf.includes !== undefined) {
    const parent = steps.find((item) => item.question === step.showIf!.parentQuestion);
    if (!parent) return false;
    const selected = typeof parentValue === "string" ? tryParseArray(parentValue) : parentValue;
    return Array.isArray(selected) && selected.includes(step.showIf.includes);
  }
  return true;
}

function tryParseArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : value ? [value] : [];
  } catch {
    return value ? [value] : [];
  }
}

/** Convert raw form values to normalized answers for API storage. */
export function normalizeSubmissionAnswers(
  survey: SurveyConfig,
  values: FormValues,
  options?: { includeHidden?: boolean },
): NormalizedAnswer[] {
  const includeHidden = options?.includeHidden ?? false;
  const results: NormalizedAnswer[] = [];

  for (const step of survey.steps) {
    const visible = isStepVisible(step, survey.steps, values);
    if (!visible && !includeHidden) continue;

    const rawValue = values[fieldName(step.id)];
    const raw =
      typeof rawValue === "string"
        ? rawValue
        : Array.isArray(rawValue)
          ? JSON.stringify(rawValue)
          : "";

    results.push({
      stepId: step.id,
      question: step.question,
      type: step.type,
      value: parseAnswerValue(step, raw),
      raw,
    });
  }

  return results;
}

/** Build the submission payload the frontend will POST to the API. */
export function buildSubmissionPayload(
  survey: SurveyConfig,
  values: FormValues,
  status: "draft" | "completed",
) {
  const answers = Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      key,
      Array.isArray(value) ? JSON.stringify(value) : value,
    ]),
  ) as Record<string, string>;

  return {
    surveyId: survey.id,
    status,
    answers,
    normalizedAnswers: normalizeSubmissionAnswers(survey, values),
    completedAt: status === "completed" ? new Date().toISOString() : undefined,
  };
}
