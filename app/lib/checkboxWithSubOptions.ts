import type { SurveyStep } from "./surveys";

export type CheckboxSubOptionsConfig = {
  parentOption: string;
  label?: string;
  options: string[];
};

export type CheckboxWithSubOptionsValue = {
  selected: string[];
  subSelections: Record<string, string[]>;
};

export const EMPTY_CHECKBOX_WITH_SUB_OPTIONS: CheckboxWithSubOptionsValue = {
  selected: [],
  subSelections: {},
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

export function stepHasCheckboxSubOptions(
  step: SurveyStep,
): step is SurveyStep & { checkboxSubOptions: CheckboxSubOptionsConfig } {
  return Boolean(step.checkboxSubOptions);
}

export function parseCheckboxStepValueWithSubs(
  step: SurveyStep,
  value: string | string[] | undefined,
): CheckboxWithSubOptionsValue | string[] {
  if (!stepHasCheckboxSubOptions(step)) {
    return parsePlainCheckboxValue(value);
  }

  if (!value || Array.isArray(value)) {
    return { ...EMPTY_CHECKBOX_WITH_SUB_OPTIONS };
  }

  try {
    const parsed = JSON.parse(value) as Partial<CheckboxWithSubOptionsValue>;
    return {
      selected: Array.isArray(parsed.selected) ? parsed.selected : [],
      subSelections:
        parsed.subSelections && typeof parsed.subSelections === "object"
          ? Object.fromEntries(
              Object.entries(parsed.subSelections).map(([key, items]) => [
                key,
                Array.isArray(items) ? items : [],
              ]),
            )
          : {},
    };
  } catch {
    return { ...EMPTY_CHECKBOX_WITH_SUB_OPTIONS };
  }
}

export function serializeCheckboxStepValueWithSubs(
  step: SurveyStep,
  value: CheckboxWithSubOptionsValue | string[],
): string | string[] {
  if (!stepHasCheckboxSubOptions(step)) {
    return value as string[];
  }
  return JSON.stringify(value);
}

export function isCheckboxWithSubOptionsEmpty(value: CheckboxWithSubOptionsValue): boolean {
  return value.selected.length === 0;
}

export function hasInvalidCheckboxSubSelections(
  step: SurveyStep,
  value: CheckboxWithSubOptionsValue,
): boolean {
  if (!stepHasCheckboxSubOptions(step)) return false;

  const { parentOption } = step.checkboxSubOptions;
  if (!value.selected.includes(parentOption)) return false;

  const subSelected = value.subSelections[parentOption] ?? [];
  return subSelected.length === 0;
}

export function getCheckboxSelectionsFromValue(
  step: SurveyStep,
  value: string | string[] | undefined,
): string[] {
  const parsed = parseCheckboxStepValueWithSubs(step, value);
  return Array.isArray(parsed) ? parsed : parsed.selected;
}
