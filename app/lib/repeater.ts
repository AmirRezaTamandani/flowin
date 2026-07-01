import { isPhoneStepValueValid } from "./phoneValidation";
import { isValidWebsiteUrl } from "./urlValidation";

export type RepeaterConditionalOption = {
  option: string;
  whenDependsOnIncludes: string[];
  insertAfter?: string;
};

export type RepeaterFieldConfig = {
  key: string;
  label?: string;
  type: "text" | "number" | "url" | "select";
  placeholder?: string;
  options?: string[];
  conditionalOptions?: {
    dependsOnKey: string;
    extraOptions: RepeaterConditionalOption[];
  };
  numberMin?: number;
  numberMax?: number;
  numberFormat?: "default" | "phone";
  readOnly?: boolean;
};

export type RepeaterSyncFromParentConfig = {
  parentQuestion: string;
  platformFieldKey: string;
};

export function resolveRepeaterSelectOptions(
  field: RepeaterFieldConfig,
  row: RepeaterRow,
): string[] {
  let options = [...(field.options ?? [])];
  if (!field.conditionalOptions) return options;

  const dependsOnValue = row[field.conditionalOptions.dependsOnKey] ?? "";
  for (const extra of field.conditionalOptions.extraOptions) {
    if (!extra.whenDependsOnIncludes.includes(dependsOnValue)) continue;
    if (options.includes(extra.option)) continue;

    const anchorIndex = extra.insertAfter
      ? options.indexOf(extra.insertAfter)
      : options.length - 1;
    if (anchorIndex >= 0) {
      options.splice(anchorIndex + 1, 0, extra.option);
    } else {
      options.push(extra.option);
    }
  }

  return options;
}

export function sanitizeRepeaterRowSelectValues(
  row: RepeaterRow,
  fields: RepeaterFieldConfig[],
): RepeaterRow {
  const next = { ...row };
  for (const field of fields) {
    if (field.type !== "select") continue;
    const options = resolveRepeaterSelectOptions(field, row);
    if (next[field.key] && !options.includes(next[field.key])) {
      next[field.key] = "";
    }
  }
  return next;
}

export function isRepeaterCellValid(
  field: RepeaterFieldConfig,
  value: string,
  row?: RepeaterRow,
): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;

  switch (field.type) {
    case "url":
      return isValidWebsiteUrl(trimmed);
    case "number": {
      if (field.numberFormat === "phone") return isPhoneStepValueValid(trimmed);
      const parsed = Number.parseFloat(trimmed);
      if (Number.isNaN(parsed)) return false;
      if (field.numberMin !== undefined && parsed < field.numberMin) return false;
      if (field.numberMax !== undefined && parsed > field.numberMax) return false;
      return true;
    }
    case "select": {
      const options = row ? resolveRepeaterSelectOptions(field, row) : (field.options ?? []);
      return options.length ? options.includes(trimmed) : Boolean(trimmed);
    }
    default:
      return true;
  }
}

export type RepeaterRow = Record<string, string>;

export type RepeaterValue = {
  rows: RepeaterRow[];
};

export const DEFAULT_OPERATOR_REPEATER_FIELDS: RepeaterFieldConfig[] = [
  { key: "operator", type: "text", placeholder: "نام اپراتور" },
  { key: "count", type: "number", placeholder: "تعداد کاربران", numberMin: 0 },
];

export function createEmptyRepeaterRow(fields: RepeaterFieldConfig[]): RepeaterRow {
  return Object.fromEntries(fields.map((field) => [field.key, ""]));
}

export function createEmptyRepeaterValue(fields: RepeaterFieldConfig[]): RepeaterValue {
  return { rows: [createEmptyRepeaterRow(fields)] };
}

export function parseRepeaterValue(
  value: string | string[] | undefined,
  fields: RepeaterFieldConfig[],
): RepeaterValue {
  const empty = createEmptyRepeaterValue(fields);
  if (!value || Array.isArray(value)) return empty;

  try {
    const parsed = JSON.parse(value) as Partial<RepeaterValue>;
    const rows = Array.isArray(parsed.rows)
      ? parsed.rows
          .filter((row) => row && typeof row === "object")
          .map((row) => {
            const next = createEmptyRepeaterRow(fields);
            for (const field of fields) {
              const cell = (row as RepeaterRow)[field.key];
              next[field.key] = typeof cell === "string" ? cell : "";
            }
            return next;
          })
      : [];

    return rows.length > 0 ? { rows } : empty;
  } catch {
    return empty;
  }
}

export function serializeRepeaterValue(value: RepeaterValue): string {
  return JSON.stringify(value);
}

export function isRepeaterRowComplete(
  row: RepeaterRow,
  fields: RepeaterFieldConfig[],
): boolean {
  return fields.every((field) =>
    isRepeaterCellValid(field, row[field.key] ?? "", row),
  );
}

export function isRepeaterRowPartial(
  row: RepeaterRow,
  fields: RepeaterFieldConfig[],
): boolean {
  const filledCount = fields.filter((field) => Boolean(row[field.key]?.trim())).length;
  return filledCount > 0 && filledCount < fields.length;
}

export function isRepeaterEmpty(value: RepeaterValue, fields: RepeaterFieldConfig[]): boolean {
  return !value.rows.some((row) => isRepeaterRowComplete(row, fields));
}

export function hasIncompleteRepeaterRows(
  value: RepeaterValue,
  fields: RepeaterFieldConfig[],
): boolean {
  return value.rows.some((row) => isRepeaterRowPartial(row, fields));
}

export function getRepeaterFields(step: {
  repeaterFields?: RepeaterFieldConfig[];
}): RepeaterFieldConfig[] {
  return step.repeaterFields?.length
    ? step.repeaterFields
    : DEFAULT_OPERATOR_REPEATER_FIELDS;
}

export function getPlainCheckboxSelections(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
    if (parsed && typeof parsed === "object" && Array.isArray(parsed.selected)) {
      return parsed.selected;
    }
    return [];
  } catch {
    return value ? [value] : [];
  }
}

export function syncRepeaterWithParentPlatforms(
  value: RepeaterValue,
  fields: RepeaterFieldConfig[],
  parentPlatforms: string[],
  platformFieldKey: string,
): RepeaterValue {
  const existingByPlatform = Object.fromEntries(
    value.rows
      .filter((row) => row[platformFieldKey]?.trim())
      .map((row) => [row[platformFieldKey], row]),
  );

  const rows = parentPlatforms.map((platform) => {
    const existing = existingByPlatform[platform];
    const row = existing
      ? { ...existing, [platformFieldKey]: platform }
      : (() => {
          const empty = createEmptyRepeaterRow(fields);
          empty[platformFieldKey] = platform;
          return empty;
        })();
    return sanitizeRepeaterRowSelectValues(row, fields);
  });

  return { rows };
}

export function isSyncedRepeaterEmpty(
  value: RepeaterValue,
  fields: RepeaterFieldConfig[],
  parentPlatforms: string[],
  options?: { allowEmpty?: boolean },
): boolean {
  if (parentPlatforms.length === 0) return !options?.allowEmpty;
  if (value.rows.length !== parentPlatforms.length) return true;
  if (hasIncompleteRepeaterRows(value, fields)) return true;

  const editableFields = fields.filter((field) => !field.readOnly);
  const allEditableEmpty = value.rows.every((row) =>
    editableFields.every((field) => !row[field.key]?.trim()),
  );
  if (options?.allowEmpty && allEditableEmpty) return false;

  return !value.rows.every((row) => isRepeaterRowComplete(row, fields));
}
