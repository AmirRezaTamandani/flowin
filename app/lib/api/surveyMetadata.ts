import { surveyMap } from "../surveys";
import type { SurveyId, SurveyMetadata } from "./types";
import { SURVEY_IDS } from "./types";

export function getSurveyMetadataList(): SurveyMetadata[] {
  return SURVEY_IDS.map((id) => {
    const survey = surveyMap[id];
    return {
      id,
      label: survey.label,
      title: survey.title,
      stepCount: survey.steps.length,
      stepTypes: [...new Set(survey.steps.map((step) => step.type))],
    };
  });
}

export function getSurveyMetadata(id: SurveyId): SurveyMetadata {
  const survey = surveyMap[id];
  return {
    id,
    label: survey.label,
    title: survey.title,
    stepCount: survey.steps.length,
    stepTypes: [...new Set(survey.steps.map((step) => step.type))],
  };
}
