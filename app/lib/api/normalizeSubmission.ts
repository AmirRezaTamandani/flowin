import { stepHasCheckboxSubOptions } from "../checkboxWithSubOptions";
import { stepHasOtherOption } from "../checkboxWithOther";
import type { SurveyConfig, SurveyStep } from "../surveys";
import { fieldName, getVisibleFormAnswers, isStepVisible } from "../stepVisibility";
import type { FormValues } from "./formValues";
import type { NormalizedAnswer, ParsedAnswerValue } from "./types";
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

/** Build the submission payload the frontend will POST to the API. */
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

export function buildSubmissionPayload(
  survey: SurveyConfig,
  values: FormValues,
  status: "draft" | "completed",
) {
  const answers = getVisibleFormAnswers(survey.steps, values);

  return {
    surveyId: survey.id,
    status,
    answers,
    normalizedAnswers: normalizeSubmissionAnswers(survey, values),
    completedAt: status === "completed" ? new Date().toISOString() : undefined,
  };
}