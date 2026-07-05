import { isValidPlatformUrl } from "./platformUrlValidation";
import { isPhoneStepValueValid } from "./phoneValidation";

export type RepeaterConditionalOption = {
  option: string;
  whenDependsOnIncludes: string[];
  insertAfter?: string;
};

export type RepeaterFieldConfig = {
  key: string;
  label?: string;
  type: "text" | "number" | "url" | "select" | "multiCheckbox" | "time";
  placeholder?: string;
  options?: string[];
  conditionalOptions?: {
    dependsOnKey: string;
    extraOptions: RepeaterConditionalOption[];
  };
  numberMin?: number;
  numberMax?: number;
  numberFormat?: "default" | "phone";
  numberSuffix?: string;
  inputDir?: "ltr" | "rtl";
  readOnly?: boolean;
  /** Validate URL against a platform-specific regex from the given row field. */
  urlPlatformDependsOnKey?: string;
  /** End time must be strictly after this row field (HH:mm). */
  timeMustBeAfterKey?: string;
  /** Start time must be strictly before this row field (HH:mm). */
  timeMustBeBeforeKey?: string;
};

export type RepeaterSyncFromParentConfig = {
  parentQuestion: string;
  platformFieldKey: string;
  /** Allow multiple time slots per synced platform (e.g. Sat 12:00 and Mon 14:00). */
  allowMultipleRowsPerPlatform?: boolean;
};

export function resolveRepeaterSelectOptions(
  field: RepeaterFieldConfig,
  row: RepeaterRow,
): string[] {
  const options = [...(field.options ?? [])];
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

export function parseRepeaterMultiCheckboxValue(value: string): string[] {
  if (!value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

export function serializeRepeaterMultiCheckboxValue(values: string[]): string {
  return values.length ? JSON.stringify(values) : "";
}

export function isRepeaterTimeValueValid(value: string): boolean {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value.trim());
}

export function repeaterTimeToMinutes(value: string): number {
  const [hours, minutes] = value.trim().split(":").map(Number);
  return hours * 60 + minutes;
}

export function isRepeaterTimeRangeValid(
  row: RepeaterRow,
  startKey: string,
  endKey: string,
): boolean {
  const start = row[startKey]?.trim() ?? "";
  const end = row[endKey]?.trim() ?? "";
  if (!start || !end) return true;
  if (!isRepeaterTimeValueValid(start) || !isRepeaterTimeValueValid(end)) return true;
  return repeaterTimeToMinutes(start) < repeaterTimeToMinutes(end);
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
    case "url": {
      const platform =
        field.urlPlatformDependsOnKey && row
          ? row[field.urlPlatformDependsOnKey]
          : undefined;
      const requireSocialLink = Boolean(field.urlPlatformDependsOnKey);
      return isValidPlatformUrl(trimmed, platform, { requireSocialLink });
    }
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
    case "multiCheckbox": {
      const selected = parseRepeaterMultiCheckboxValue(value);
      if (!selected.length) return false;
      return field.options?.length
        ? selected.every((item) => field.options!.includes(item))
        : true;
    }
    case "time": {
      if (!isRepeaterTimeValueValid(trimmed)) return false;
      if (field.timeMustBeAfterKey && row) {
        const start = row[field.timeMustBeAfterKey]?.trim() ?? "";
        if (
          start &&
          isRepeaterTimeValueValid(start) &&
          repeaterTimeToMinutes(trimmed) <= repeaterTimeToMinutes(start)
        ) {
          return false;
        }
      }
      if (field.timeMustBeBeforeKey && row) {
        const end = row[field.timeMustBeBeforeKey]?.trim() ?? "";
        if (
          end &&
          isRepeaterTimeValueValid(end) &&
          repeaterTimeToMinutes(trimmed) >= repeaterTimeToMinutes(end)
        ) {
          return false;
        }
      }
      return true;
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

export function createEmptyRepeaterValue(
  fields: RepeaterFieldConfig[],
  rowCount = 1,
): RepeaterValue {
  const safeRowCount = Math.max(rowCount, 1);
  return {
    rows: Array.from({ length: safeRowCount }, () => createEmptyRepeaterRow(fields)),
  };
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
  const editableFields = fields.filter((field) => !field.readOnly);
  if (editableFields.length === 0) return false;
  const filledCount = editableFields.filter((field) => Boolean(row[field.key]?.trim())).length;
  return filledCount > 0 && filledCount < editableFields.length;
}

export function isRepeaterEmpty(value: RepeaterValue, fields: RepeaterFieldConfig[]): boolean {
  return !value.rows.some((row) => isRepeaterRowComplete(row, fields));
}

export function countCompleteRepeaterRows(
  value: RepeaterValue,
  fields: RepeaterFieldConfig[],
): number {
  return value.rows.filter((row) => isRepeaterRowComplete(row, fields)).length;
}

export function hasRepeaterPercentageField(fields: RepeaterFieldConfig[]): boolean {
  return fields.some((field) => field.key === "percentage" && field.type === "number");
}

export function getRepeaterPercentageTotal(value: RepeaterValue): number {
  return value.rows.reduce((sum, row) => {
    const raw = row.percentage?.trim() ?? "";
    if (!raw) return sum;
    const parsed = Number.parseFloat(raw);
    return Number.isFinite(parsed) ? sum + parsed : sum;
  }, 0);
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
  syncConfig: RepeaterSyncFromParentConfig,
): RepeaterValue {
  const { platformFieldKey, allowMultipleRowsPerPlatform } = syncConfig;

  if (allowMultipleRowsPerPlatform) {
    const parentSet = new Set(parentPlatforms);
    const filteredRows = value.rows.filter((row) => {
      const platform = row[platformFieldKey]?.trim();
      return platform && parentSet.has(platform);
    });

    const rowsByPlatform = new Map<string, RepeaterRow[]>();
    for (const row of filteredRows) {
      const platform = row[platformFieldKey]!;
      const bucket = rowsByPlatform.get(platform) ?? [];
      bucket.push(row);
      rowsByPlatform.set(platform, bucket);
    }

    const orderedRows: RepeaterRow[] = [];
    for (const platform of parentPlatforms) {
      const existing = rowsByPlatform.get(platform);
      if (existing?.length) {
        orderedRows.push(
          ...existing.map((row) => ({ ...row, [platformFieldKey]: platform })),
        );
      } else {
        const empty = createEmptyRepeaterRow(fields);
        empty[platformFieldKey] = platform;
        orderedRows.push(empty);
      }
    }

    return {
      rows: orderedRows.map((row) => sanitizeRepeaterRowSelectValues(row, fields)),
    };
  }

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
  syncConfig: RepeaterSyncFromParentConfig,
  options?: { allowEmpty?: boolean },
): boolean {
  const { platformFieldKey, allowMultipleRowsPerPlatform } = syncConfig;

  if (parentPlatforms.length === 0) return !options?.allowEmpty;

  if (allowMultipleRowsPerPlatform) {
    for (const platform of parentPlatforms) {
      if (!value.rows.some((row) => row[platformFieldKey] === platform)) {
        return true;
      }
    }
  } else if (value.rows.length !== parentPlatforms.length) {
    return true;
  }

  if (hasIncompleteRepeaterRows(value, fields)) return true;

  const editableFields = fields.filter((field) => !field.readOnly);
  const allEditableEmpty = value.rows.every((row) =>
    editableFields.every((field) => !row[field.key]?.trim()),
  );
  if (options?.allowEmpty && allEditableEmpty) return false;

  if (
    value.rows.some(
      (row) =>
        editableFields.some((field) => row[field.key]?.trim()) &&
        !isRepeaterRowComplete(row, fields),
    )
  ) {
    return true;
  }

  return false;
}
