import type { SurveyStep } from "./surveys";

export type CheckboxWithOtherValue = {
  selected: string[];
  other: string;
};

export const EMPTY_CHECKBOX_WITH_OTHER: CheckboxWithOtherValue = {
  selected: [],
  other: "",
};

function parsePlainCheckboxValue(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return value ? [value] : [];
  }
}

export function stepHasOtherOption(step: SurveyStep): step is SurveyStep & { otherOption: string } {
  return Boolean(step.otherOption);
}

export function parseCheckboxStepValue(
  step: SurveyStep,
  value: string | string[] | undefined,
): CheckboxWithOtherValue | string[] {
  if (!stepHasOtherOption(step)) {
    return parsePlainCheckboxValue(value);
  }

  if (!value || Array.isArray(value)) {
    return { ...EMPTY_CHECKBOX_WITH_OTHER };
  }

  try {
    const parsed = JSON.parse(value) as Partial<CheckboxWithOtherValue>;
    return {
      selected: Array.isArray(parsed.selected) ? parsed.selected : [],
      other: typeof parsed.other === "string" ? parsed.other : "",
    };
  } catch {
    return { ...EMPTY_CHECKBOX_WITH_OTHER };
  }
}

export function serializeCheckboxStepValue(
  step: SurveyStep,
  value: CheckboxWithOtherValue | string[],
): string | string[] {
  if (!stepHasOtherOption(step)) {
    return value as string[];
  }
  return JSON.stringify(value);
}

export function getCheckboxSelections(
  step: SurveyStep,
  value: string | string[] | undefined,
): string[] {
  const parsed = parseCheckboxStepValue(step, value);
  return Array.isArray(parsed) ? parsed : parsed.selected;
}

export function isCheckboxStepEmpty(
  step: SurveyStep,
  value: string | string[] | undefined,
): boolean {
  const parsed = parseCheckboxStepValue(step, value);

  if (Array.isArray(parsed)) {
    return parsed.length === 0;
  }

  if (parsed.selected.length === 0) return true;

  if (step.otherOption && parsed.selected.includes(step.otherOption)) {
    return !parsed.other.trim();
  }

  return false;
}
