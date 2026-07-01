import { isPhoneStepValueValid } from "./phoneValidation";
import { isValidWebsiteUrl } from "./urlValidation";

export type RepeaterFieldConfig = {
  key: string;
  label?: string;
  type: "text" | "number" | "url" | "select";
  placeholder?: string;
  options?: string[];
  numberMin?: number;
  numberMax?: number;
  numberFormat?: "default" | "phone";
};

export function isRepeaterCellValid(field: RepeaterFieldConfig, value: string): boolean {
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
    case "select":
      return field.options?.length ? field.options.includes(trimmed) : Boolean(trimmed);
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
  return fields.every((field) => Boolean(row[field.key]?.trim()));
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
