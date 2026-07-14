import { getCheckboxSelectionsFromValue, stepHasCheckboxSubOptions } from "./checkboxWithSubOptions";
import { getCheckboxSelections } from "./checkboxWithOther";
import type { FormValues } from "./api/formValues";
import type { ShowIfCondition, SurveyStep } from "./surveys";

export function fieldName(stepId: number): string {
  return `step_${stepId}`;
}

function getParentValue(
  condition: ShowIfCondition,
  steps: SurveyStep[],
  values: FormValues,
): string | string[] {
  const parent = steps.find((step) => step.question === condition.parentQuestion);
  if (!parent) return "";
  return values[fieldName(parent.id)] ?? "";
}

function getCheckboxSelectionsForStep(
  step: SurveyStep,
  value: string | string[] | undefined,
): string[] {
  if (step.type !== "checkbox") return [];
  if (stepHasCheckboxSubOptions(step)) {
    return getCheckboxSelectionsFromValue(step, value);
  }
  return getCheckboxSelections(step, value);
}

export function isStepVisible(
  step: SurveyStep,
  steps: SurveyStep[],
  values: FormValues,
): boolean {
  if (!step.showIf) return true;
  const parentValue = getParentValue(step.showIf, steps, values);
  if (step.showIf.whenParentAnswered) {
    if (typeof parentValue === "string") return parentValue.trim().length > 0;
    if (Array.isArray(parentValue)) return parentValue.length > 0;
    return false;
  }
  if (step.showIf.equals !== undefined) {
    return parentValue === step.showIf.equals;
  }
  if (step.showIf.includes !== undefined) {
    const parent = steps.find((item) => item.question === step.showIf!.parentQuestion);
    if (!parent) return false;
    return getCheckboxSelectionsForStep(parent, parentValue).includes(step.showIf.includes);
  }
  return true;
}

/** Raw answers for API storage — only visible steps, values as strings. */
export function getVisibleFormAnswers(
  steps: SurveyStep[],
  values: FormValues,
): Record<string, string> {
  const answers: Record<string, string> = {};
  for (const step of steps) {
    if (!isStepVisible(step, steps, values)) continue;
    const key = fieldName(step.id);
    const value = values[key];
    if (value === undefined) continue;
    answers[key] = Array.isArray(value) ? JSON.stringify(value) : value;
  }
  return answers;
}
