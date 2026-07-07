import { isPhoneStepValueValid } from "./phoneValidation";
import { isBrandVisualIdentityEmpty, parseBrandVisualIdentityValue } from "./brandVisualIdentity";
import {
  getCheckboxSubOptionConfigs,
  hasInvalidCheckboxSubSelections,
  parseCheckboxStepValueWithSubs,
  stepHasCheckboxSubOptions,
} from "./checkboxWithSubOptions";
import {
  isCheckboxStepEmpty,
  parseCheckboxStepValue,
  stepHasOtherOption,
} from "./checkboxWithOther";
import {
  hasIncompleteGeoLocationEntries,
  isGeoLocationEmpty,
  parseGeoLocationValue,
} from "./geoLocation";
import { isFileUploadEmpty, parseFileUploadValue } from "./fileUpload";
import {
  hasIncompleteNamedShamsiDates,
  isNamedShamsiDateEntryPartial,
  isNamedShamsiDatesEmpty,
  parseNamedShamsiDatesValue,
} from "./namedShamsiDates";
import {
  countCompleteNestedRows,
  getNestedRepeaterConfig,
  hasIncompleteNestedRepeaterRows,
  isNestedRepeaterEmpty,
  isNestedRowFieldsPartial,
  parseNestedRepeaterValue,
} from "./nestedRepeater";
import {
  isPercentageAllocationTotalComplete,
  isPercentageAllocationEmpty,
  parsePercentageAllocationValue,
  getPercentageAllocationTotal,
} from "./percentageAllocation";
import {
  getPersonaFieldsValidationErrors,
  isPersonaFieldsEmpty,
  parsePersonaFieldsValue,
} from "./personaFields";
import {
  countCompleteRepeaterRows,
  getPlainCheckboxSelections,
  getRepeaterFields,
  getRepeaterPercentageTotal,
  hasIncompleteRepeaterRows,
  hasInvalidRepeaterUrls,
  hasRepeaterPercentageField,
  isRepeaterCellValid,
  isRepeaterEmpty,
  isRepeaterRowPartial,
  isRepeaterTimeValueValid,
  isSyncedRepeaterEmpty,
  parseRepeaterValue,
  repeaterTimeToMinutes,
  type RepeaterFieldConfig,
  type RepeaterRow,
} from "./repeater";
import type { SurveyStep } from "./surveys";
import { getPlatformUrlValidationMessage } from "./platformUrlValidation";
import { INVALID_WEBSITE_URL_MESSAGE, isWebsiteUrlStepValueValid } from "./urlValidation";

export type FormValues = Record<string, string | string[]>;

export type StepValidationErrors = {
  stepMessage: string | null;
  fields: Record<string, string>;
};

export const ROOT_FIELD_KEY = "value";
export const EMPTY_FIELD_MESSAGE = "این فیلد الزامی است.";
export const EMPTY_ANSWER_MESSAGE = "لطفاً این سوال را پاسخ دهید.";
export const INVALID_NUMBER_MESSAGE = "مقدار وارد شده معتبر نیست.";
export const INVALID_TIME_MESSAGE = "ساعت وارد شده معتبر نیست.";
export const INVALID_TIME_RANGE_MESSAGE = "بازه زمانی واردشده معتبر نیست.";
export const INVALID_SELECT_MESSAGE = "لطفاً یک گزینه انتخاب کنید.";
export const INVALID_MULTI_CHECKBOX_MESSAGE = "حداقل یک گزینه انتخاب کنید.";

export const NESTED_REPEATER_MIN_ROWS_MESSAGE = "حداقل ۲ رقیب با اطلاعات کامل وارد کنید.";
export const NESTED_REPEATER_MAX_ROWS_MESSAGE = "حداکثر ۱۰ رقیب مجاز است.";

export function fieldName(stepId: number) {
  return `step_${stepId}`;
}

export function hasStepValidationErrors(errors: StepValidationErrors): boolean {
  return Boolean(errors.stepMessage) || Object.keys(errors.fields).length > 0;
}

export function repeaterFieldKey(rowIndex: number, fieldKey: string): string {
  return `${rowIndex}.${fieldKey}`;
}

export function nestedParentFieldKey(rowIndex: number, fieldKey: string): string {
  return `${rowIndex}.${fieldKey}`;
}

export function nestedChildFieldKey(
  rowIndex: number,
  nestedIndex: number,
  fieldKey: string,
): string {
  return `${rowIndex}.nested.${nestedIndex}.${fieldKey}`;
}

export function geoFieldKey(index: number, field: string): string {
  return `${index}.${field}`;
}

export function getRepeaterCellErrorMessage(
  field: RepeaterFieldConfig,
  value: string,
  row?: RepeaterRow,
): string {
  if (isRepeaterCellValid(field, value, row)) return "";
  const trimmed = value.trim();
  if (!trimmed) return EMPTY_FIELD_MESSAGE;
  if (field.type === "url") {
    const platform =
      field.urlPlatformDependsOnKey && row
        ? row[field.urlPlatformDependsOnKey]
        : undefined;
    const requireSocialLink = Boolean(field.urlPlatformDependsOnKey);
    return (
      getPlatformUrlValidationMessage(trimmed, platform, { requireSocialLink }) ||
      INVALID_WEBSITE_URL_MESSAGE
    );
  }
  if (field.type === "time") {
    if (!isRepeaterTimeValueValid(trimmed)) return INVALID_TIME_MESSAGE;
    if (field.timeMustBeAfterKey && row) {
      const start = row[field.timeMustBeAfterKey]?.trim() ?? "";
      if (
        start &&
        isRepeaterTimeValueValid(start) &&
        repeaterTimeToMinutes(trimmed) <= repeaterTimeToMinutes(start)
      ) {
        return INVALID_TIME_RANGE_MESSAGE;
      }
    }
    if (field.timeMustBeBeforeKey && row) {
      const end = row[field.timeMustBeBeforeKey]?.trim() ?? "";
      if (
        end &&
        isRepeaterTimeValueValid(end) &&
        repeaterTimeToMinutes(trimmed) >= repeaterTimeToMinutes(end)
      ) {
        return INVALID_TIME_RANGE_MESSAGE;
      }
    }
    return INVALID_TIME_MESSAGE;
  }
  if (field.type === "number") return INVALID_NUMBER_MESSAGE;
  if (field.type === "select") return INVALID_SELECT_MESSAGE;
  if (field.type === "multiCheckbox") return INVALID_MULTI_CHECKBOX_MESSAGE;
  return EMPTY_FIELD_MESSAGE;
}

function isNumericStepValueValid(
  value: string | string[] | undefined,
  min?: number,
  max?: number,
  format: "default" | "phone" = "default",
): boolean {
  if (!value || typeof value !== "string" || !value.trim()) return false;
  if (format === "phone") return isPhoneStepValueValid(value);
  const parsed = Number.parseFloat(value);
  if (Number.isNaN(parsed)) return false;
  if (min !== undefined && parsed < min) return false;
  if (max !== undefined && parsed > max) return false;
  return true;
}

function emptyErrors(): StepValidationErrors {
  return { stepMessage: null, fields: {} };
}

function getAnswerByQuestion(
  steps: SurveyStep[],
  values: FormValues,
  question: string,
): string {
  const parent = steps.find((item) => item.question === question);
  if (!parent) return "";
  const value = values[fieldName(parent.id)];
  return typeof value === "string" ? value : "";
}

function getPercentageAllocationOptionsForStep(
  step: SurveyStep,
  steps: SurveyStep[],
  values: FormValues,
): string[] {
  if (step.percentageAllocationSyncFromParent) {
    const parent = steps.find(
      (item) => item.question === step.percentageAllocationSyncFromParent!.parentQuestion,
    );
    const parentSelections = parent
      ? getPlainCheckboxSelections(values[fieldName(parent.id)])
      : [];
    return parentSelections.flatMap((item) => [item, ""]);
  }
  return step.options ?? [];
}

function collectRepeaterValidationErrors(
  step: SurveyStep,
  value: string | string[] | undefined,
  values: FormValues,
  steps: SurveyStep[],
): StepValidationErrors {
  const result = emptyErrors();
  const fields = getRepeaterFields(step);
  const parsed = parseRepeaterValue(value, fields);
  const minRows = Math.max(step.repeaterMinRows ?? 1, 1);

  if (step.repeaterSyncFromParent) {
    const parent = steps.find(
      (item) => item.question === step.repeaterSyncFromParent!.parentQuestion,
    );
    const parentPlatforms = parent
      ? getPlainCheckboxSelections(values[fieldName(parent.id)])
      : [];
    if (step.isAllowedEmpty) {
      const editableFields = fields.filter((field) => !field.readOnly);
      const allEditableEmpty =
        parentPlatforms.length === 0 ||
        parsed.rows.every((row) =>
          editableFields.every((field) => !row[field.key]?.trim()),
        );
      if (allEditableEmpty) return result;
    }
  }

  if (step.isAllowedEmpty && !hasIncompleteRepeaterRows(parsed, fields) && !hasInvalidRepeaterUrls(parsed, fields)) {
    const editableFields = fields.filter((field) => !field.readOnly);
    const allEditableEmpty = parsed.rows.every((row) =>
      editableFields.every((field) => !row[field.key]?.trim()),
    );
    if (allEditableEmpty) return result;
  }

  if (hasRepeaterPercentageField(fields)) {
    const completeCount = countCompleteRepeaterRows(parsed, fields);
    if (completeCount > 0) {
      const total = getRepeaterPercentageTotal(parsed);
      if (total !== 100) {
        result.stepMessage = "مجموع درصدها باید دقیقاً 100٪ باشد.";
      }
    }
  }

  const hasPartial = hasIncompleteRepeaterRows(parsed, fields);
  const completelyEmpty =
    isRepeaterEmpty(parsed, fields) && !hasPartial && !parsed.rows.some((row) =>
      fields.some((field) => !field.readOnly && row[field.key]?.trim()),
    );

  if (completelyEmpty && !step.isAllowedEmpty) {
    result.stepMessage = EMPTY_ANSWER_MESSAGE;
    return result;
  }

  parsed.rows.forEach((row, rowIndex) => {
    const editableFields = fields.filter((field) => !field.readOnly);
    const rowHasAny = editableFields.some((field) => row[field.key]?.trim());
    if (!rowHasAny) return;

    for (const field of editableFields) {
      const cellValue = row[field.key] ?? "";
      if (isRepeaterCellValid(field, cellValue, row)) continue;
      const message = getRepeaterCellErrorMessage(field, cellValue, row);
      if (message) {
        result.fields[repeaterFieldKey(rowIndex, field.key)] = message;
      }
    }
  });

  const completeCount = countCompleteRepeaterRows(parsed, fields);
  if (completeCount < minRows && !hasPartial && !hasStepValidationErrors(result)) {
    result.stepMessage = `حداقل ${minRows} مرحله با اطلاعات کامل وارد کنید.`;
  }

  return result;
}

function collectNestedRepeaterValidationErrors(
  step: SurveyStep,
  value: string | string[] | undefined,
): StepValidationErrors {
  const result = emptyErrors();
  const config = getNestedRepeaterConfig(step);
  if (!config) return result;

  const parsed = parseNestedRepeaterValue(value, config);
  const completelyEmpty = isNestedRepeaterEmpty(parsed, config) && !hasIncompleteNestedRepeaterRows(parsed, config);

  if (completelyEmpty && !step.isAllowedEmpty) {
    result.stepMessage = EMPTY_ANSWER_MESSAGE;
    return result;
  }

  parsed.rows.forEach((row, rowIndex) => {
    if (isNestedRowFieldsPartial(row, config)) {
      for (const field of config.fields) {
        if (!row.fields[field.key]?.trim()) {
          result.fields[nestedParentFieldKey(rowIndex, field.key)] = EMPTY_FIELD_MESSAGE;
        }
      }
    }

    row.nested.forEach((child, nestedIndex) => {
      const nestedFields = config.nestedFields.filter((field) => !field.readOnly);
      const nestedHasAny = nestedFields.some((field) => child[field.key]?.trim());
      if (!nestedHasAny) return;

      for (const field of nestedFields) {
        const cellValue = child[field.key] ?? "";
        if (isRepeaterCellValid(field, cellValue, child)) continue;
        const message = getRepeaterCellErrorMessage(field, cellValue, child);
        if (message) {
          result.fields[nestedChildFieldKey(rowIndex, nestedIndex, field.key)] = message;
        }
      }
    });
  });

  const completeCount = countCompleteNestedRows(parsed, config);
  if (config.minRows !== undefined && completeCount < config.minRows && !hasIncompleteNestedRepeaterRows(parsed, config)) {
    if (!hasStepValidationErrors(result)) {
      result.stepMessage = NESTED_REPEATER_MIN_ROWS_MESSAGE;
    }
  }
  if (config.maxRows !== undefined && completeCount > config.maxRows) {
    result.stepMessage = NESTED_REPEATER_MAX_ROWS_MESSAGE;
  }

  return result;
}

function collectPersonaFieldErrors(
  value: ReturnType<typeof parsePersonaFieldsValue>,
): StepValidationErrors {
  const fieldErrors = getPersonaFieldsValidationErrors(value);
  const errorCount = Object.keys(fieldErrors).length;
  if (errorCount === 0) return emptyErrors();
  if (errorCount === 7) {
    return { stepMessage: EMPTY_ANSWER_MESSAGE, fields: {} };
  }
  return { stepMessage: null, fields: fieldErrors as Record<string, string> };
}

function collectGeoLocationErrors(
  value: ReturnType<typeof parseGeoLocationValue>,
): StepValidationErrors {
  const result = emptyErrors();
  if (isGeoLocationEmpty(value) && !hasIncompleteGeoLocationEntries(value)) {
    result.stepMessage = EMPTY_ANSWER_MESSAGE;
    return result;
  }

  value.locations.forEach((entry, index) => {
    const hasAny = Boolean(entry.country.trim() || entry.province.trim() || entry.city.trim());
    if (!hasAny) return;
    if (!entry.country.trim() || entry.country === "سایر") {
      result.fields[geoFieldKey(index, "country")] = EMPTY_FIELD_MESSAGE;
    }
    if (!entry.province.trim()) {
      result.fields[geoFieldKey(index, "province")] = EMPTY_FIELD_MESSAGE;
    }
    if (!entry.city.trim()) {
      result.fields[geoFieldKey(index, "city")] = EMPTY_FIELD_MESSAGE;
    }
  });

  return result;
}

function collectCheckboxSubOptionErrors(
  step: SurveyStep,
  value: string | string[] | undefined,
): StepValidationErrors {
  const result = emptyErrors();
  const parsed = parseCheckboxStepValueWithSubs(step, value);
  if (Array.isArray(parsed)) {
    result.stepMessage = EMPTY_ANSWER_MESSAGE;
    return result;
  }

  if (parsed.selected.length === 0) {
    result.stepMessage = EMPTY_ANSWER_MESSAGE;
    return result;
  }

  for (const config of getCheckboxSubOptionConfigs(step)) {
    if (!parsed.selected.includes(config.parentOption)) continue;
    const subSelected = parsed.subSelections[config.parentOption] ?? [];
    if (subSelected.length === 0) {
      result.fields[`sub.${config.parentOption}`] = EMPTY_FIELD_MESSAGE;
    }
    if (
      config.otherOption &&
      subSelected.includes(config.otherOption) &&
      !(parsed.subOther[config.parentOption] ?? "").trim()
    ) {
      result.fields[`subOther.${config.parentOption}`] = EMPTY_FIELD_MESSAGE;
    }
  }

  return result;
}

export function getStepValidationErrors(
  step: SurveyStep,
  value: string | string[] | undefined,
  values: FormValues = {},
  steps: SurveyStep[] = [],
): StepValidationErrors {
  if (
    step.type === "checkbox" &&
    step.optionsFromParent
  ) {
    const parentAnswer = getAnswerByQuestion(
      steps,
      values,
      step.optionsFromParent.parentQuestion,
    );
    const options = step.optionsFromParent.optionMap[parentAnswer] ?? [];
    if (!options.length) return emptyErrors();
    if (!parentAnswer) return { stepMessage: EMPTY_ANSWER_MESSAGE, fields: {} };
  }

  if (
    (step.type === "radio" || step.type === "select") &&
    step.optionsFromParent
  ) {
    const parentAnswer = getAnswerByQuestion(
      steps,
      values,
      step.optionsFromParent.parentQuestion,
    );
    const options = step.optionsFromParent.optionMap[parentAnswer] ?? [];
    if (!options.length) return emptyErrors();
    if (!parentAnswer) return { stepMessage: EMPTY_ANSWER_MESSAGE, fields: {} };
  }

  if (step.isAllowedEmpty) {
    const isEmpty = isStepValueEmpty(step, value, steps, values);
    if (isEmpty) return emptyErrors();
  }

  if (step.type === "repeater") {
    return collectRepeaterValidationErrors(step, value, values, steps);
  }

  if (step.type === "nestedRepeater") {
    return collectNestedRepeaterValidationErrors(step, value);
  }

  if (step.type === "percentageAllocation") {
    const options = getPercentageAllocationOptionsForStep(step, steps, values);
    const parsed = parsePercentageAllocationValue(value, options);
    const total = getPercentageAllocationTotal(parsed);
    if (options.length > 0 && total > 0 && !isPercentageAllocationTotalComplete(parsed, options)) {
      return { stepMessage: "مجموع درصدها باید دقیقاً 100٪ باشد.", fields: {} };
    }
    if (isPercentageAllocationEmpty(parsed, options) && !step.isAllowedEmpty) {
      return { stepMessage: EMPTY_ANSWER_MESSAGE, fields: {} };
    }
    return emptyErrors();
  }

  if (step.type === "personaFields") {
    const parsed = parsePersonaFieldsValue(value);
    if (isPersonaFieldsEmpty(parsed)) {
      return collectPersonaFieldErrors(parsed);
    }
    return emptyErrors();
  }

  if (step.type === "geoLocation") {
    const parsed = parseGeoLocationValue(value);
    if (isGeoLocationEmpty(parsed) || hasIncompleteGeoLocationEntries(parsed)) {
      return collectGeoLocationErrors(parsed);
    }
    return emptyErrors();
  }

  if (step.type === "fileUpload") {
    const parsed = parseFileUploadValue(value);
    if (isFileUploadEmpty(parsed)) {
      const result = emptyErrors();
      result.stepMessage = EMPTY_ANSWER_MESSAGE;
      if (!parsed.description.trim()) result.fields.description = EMPTY_FIELD_MESSAGE;
      if (parsed.files.length === 0) result.fields.files = EMPTY_FIELD_MESSAGE;
      return result;
    }
    return emptyErrors();
  }

  if (step.type === "brandVisualIdentity") {
    const parsed = parseBrandVisualIdentityValue(value);
    if (isBrandVisualIdentityEmpty(parsed)) {
      const result = emptyErrors();
      result.stepMessage = EMPTY_ANSWER_MESSAGE;
      if (!parsed.logo) result.fields.logo = EMPTY_FIELD_MESSAGE;
      if (parsed.colors.length === 0) result.fields.colors = EMPTY_FIELD_MESSAGE;
      if (!parsed.font) result.fields.font = EMPTY_FIELD_MESSAGE;
      return result;
    }
    return emptyErrors();
  }

  if (step.type === "namedShamsiDates") {
    const parsed = parseNamedShamsiDatesValue(value);
    if (isNamedShamsiDatesEmpty(parsed) && !hasIncompleteNamedShamsiDates(parsed)) {
      return { stepMessage: EMPTY_ANSWER_MESSAGE, fields: {} };
    }
    const result = emptyErrors();
    parsed.events.forEach((event, index) => {
      if (isNamedShamsiDateEntryPartial(event)) {
        if (!event.name.trim()) result.fields[`${index}.name`] = EMPTY_FIELD_MESSAGE;
        if (!event.date.trim()) result.fields[`${index}.date`] = EMPTY_FIELD_MESSAGE;
      }
    });
    return result;
  }

  if (step.type === "checkbox") {
    if (stepHasCheckboxSubOptions(step)) {
      const parsed = parseCheckboxStepValueWithSubs(step, value);
      if (Array.isArray(parsed) || parsed.selected.length === 0 || hasInvalidCheckboxSubSelections(step, parsed)) {
        return collectCheckboxSubOptionErrors(step, value);
      }
      return emptyErrors();
    }
    if (isCheckboxStepEmpty(step, value)) {
      const result = emptyErrors();
      result.stepMessage = EMPTY_ANSWER_MESSAGE;
      if (stepHasOtherOption(step)) {
        const parsed = parseCheckboxStepValue(step, value);
        if (!Array.isArray(parsed) && parsed.selected.includes(step.otherOption!) && !parsed.other.trim()) {
          result.fields.other = EMPTY_FIELD_MESSAGE;
        }
      }
      return result;
    }
    return emptyErrors();
  }

  if (step.type === "url") {
    const trimmed = typeof value === "string" ? value.trim() : "";
    if (!trimmed) {
      return { stepMessage: null, fields: { [ROOT_FIELD_KEY]: EMPTY_FIELD_MESSAGE } };
    }
    if (!isWebsiteUrlStepValueValid(value)) {
      return { stepMessage: null, fields: { [ROOT_FIELD_KEY]: INVALID_WEBSITE_URL_MESSAGE } };
    }
    return emptyErrors();
  }

  if (step.type === "number") {
    const trimmed = typeof value === "string" ? value.trim() : "";
    if (!trimmed) {
      return { stepMessage: null, fields: { [ROOT_FIELD_KEY]: EMPTY_FIELD_MESSAGE } };
    }
    if (
      !isNumericStepValueValid(
        value,
        step.numberMin,
        step.numberMax,
        step.numberFormat ?? "default",
      )
    ) {
      return { stepMessage: null, fields: { [ROOT_FIELD_KEY]: INVALID_NUMBER_MESSAGE } };
    }
    return emptyErrors();
  }

  if (step.type === "radio" || step.type === "select") {
    const trimmed = typeof value === "string" ? value.trim() : "";
    if (!trimmed) {
      return { stepMessage: null, fields: { [ROOT_FIELD_KEY]: EMPTY_FIELD_MESSAGE } };
    }
    if (step.optionsFromParent) {
      const parentAnswer = getAnswerByQuestion(steps, values, step.optionsFromParent.parentQuestion);
      const options = step.optionsFromParent.optionMap[parentAnswer] ?? [];
      if (options.length && !options.includes(trimmed)) {
        return { stepMessage: null, fields: { [ROOT_FIELD_KEY]: INVALID_SELECT_MESSAGE } };
      }
    }
    return emptyErrors();
  }

  const trimmed = typeof value === "string" ? value.trim() : "";
  if (!value || (typeof value === "string" && !trimmed)) {
    return { stepMessage: null, fields: { [ROOT_FIELD_KEY]: EMPTY_FIELD_MESSAGE } };
  }

  return emptyErrors();
}

function isStepValueEmpty(
  step: SurveyStep,
  value: string | string[] | undefined,
  steps: SurveyStep[],
  values: FormValues,
): boolean {
  if (step.type === "checkbox") {
    if (stepHasCheckboxSubOptions(step)) {
      const parsed = parseCheckboxStepValueWithSubs(step, value);
      if (Array.isArray(parsed)) return true;
      return parsed.selected.length === 0;
    }
    return isCheckboxStepEmpty(step, value);
  }
  if (step.type === "brandVisualIdentity") {
    return isBrandVisualIdentityEmpty(parseBrandVisualIdentityValue(value));
  }
  if (step.type === "personaFields") {
    return isPersonaFieldsEmpty(parsePersonaFieldsValue(value));
  }
  if (step.type === "geoLocation") {
    const parsed = parseGeoLocationValue(value);
    return isGeoLocationEmpty(parsed) && !hasIncompleteGeoLocationEntries(parsed);
  }
  if (step.type === "percentageAllocation") {
    const options = getPercentageAllocationOptionsForStep(step, steps, values);
    return isPercentageAllocationEmpty(parsePercentageAllocationValue(value, options), options);
  }
  if (step.type === "fileUpload") {
    return isFileUploadEmpty(parseFileUploadValue(value));
  }
  if (step.type === "repeater") {
    const fields = getRepeaterFields(step);
    const parsed = parseRepeaterValue(value, fields);
    if (step.repeaterSyncFromParent) {
      const parent = steps.find(
        (item) => item.question === step.repeaterSyncFromParent!.parentQuestion,
      );
      const parentPlatforms = parent
        ? getPlainCheckboxSelections(values[fieldName(parent.id)])
        : [];
      if (parentPlatforms.length === 0) return true;
      const editableFields = fields.filter((field) => !field.readOnly);
      return parsed.rows.every((row) =>
        editableFields.every((field) => !row[field.key]?.trim()),
      );
    }
    return isRepeaterEmpty(parsed, fields) && !hasIncompleteRepeaterRows(parsed, fields);
  }
  if (step.type === "nestedRepeater") {
    const config = getNestedRepeaterConfig(step);
    if (!config) return true;
    const parsed = parseNestedRepeaterValue(value, config);
    return isNestedRepeaterEmpty(parsed, config) && !hasIncompleteNestedRepeaterRows(parsed, config);
  }
  if (step.type === "namedShamsiDates") {
    const parsed = parseNamedShamsiDatesValue(value);
    return isNamedShamsiDatesEmpty(parsed) && !hasIncompleteNamedShamsiDates(parsed);
  }
  if (step.type === "number") {
    return !isNumericStepValueValid(
      value,
      step.numberMin,
      step.numberMax,
      step.numberFormat ?? "default",
    );
  }
  return !value || (typeof value === "string" && !value.trim());
}

export function isStepAnswerValid(
  step: SurveyStep,
  values: FormValues,
  steps: SurveyStep[],
): boolean {
  return !hasStepValidationErrors(
    getStepValidationErrors(step, values[fieldName(step.id)], values, steps),
  );
}
