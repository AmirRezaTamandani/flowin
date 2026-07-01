import type { RepeaterFieldConfig } from "./repeater";
import {
  hasIncompleteRepeaterRows,
  isRepeaterCellValid,
  isRepeaterEmpty,
  isRepeaterRowComplete,
  isRepeaterRowPartial,
} from "./repeater";

export type NestedRepeaterConfig = {
  fields: RepeaterFieldConfig[];
  nestedKey: string;
  nestedFields: RepeaterFieldConfig[];
  nestedAddLabel?: string;
  minRows?: number;
  maxRows?: number;
  minNestedPerRow?: number;
};

export type NestedRepeaterChildRow = Record<string, string>;

export type NestedRepeaterRow = {
  fields: Record<string, string>;
  nested: NestedRepeaterChildRow[];
};

export type NestedRepeaterValue = {
  rows: NestedRepeaterRow[];
};

export function createEmptyNestedChildRow(
  nestedFields: RepeaterFieldConfig[],
): NestedRepeaterChildRow {
  return Object.fromEntries(nestedFields.map((field) => [field.key, ""]));
}

export function createEmptyNestedRow(config: NestedRepeaterConfig): NestedRepeaterRow {
  return {
    fields: Object.fromEntries(config.fields.map((field) => [field.key, ""])),
    nested: [createEmptyNestedChildRow(config.nestedFields)],
  };
}

export function createEmptyNestedRepeaterValue(config: NestedRepeaterConfig): NestedRepeaterValue {
  const rowCount = Math.max(config.minRows ?? 1, 1);
  return {
    rows: Array.from({ length: rowCount }, () => createEmptyNestedRow(config)),
  };
}

export function parseNestedRepeaterValue(
  value: string | string[] | undefined,
  config: NestedRepeaterConfig,
): NestedRepeaterValue {
  const empty = createEmptyNestedRepeaterValue(config);
  if (!value || Array.isArray(value)) return empty;

  try {
    const parsed = JSON.parse(value) as Partial<NestedRepeaterValue>;
    const rows = Array.isArray(parsed.rows)
      ? parsed.rows
          .filter((row) => row && typeof row === "object")
          .map((row) => {
            const fields = Object.fromEntries(
              config.fields.map((field) => [
                field.key,
                typeof row.fields?.[field.key] === "string" ? row.fields[field.key] : "",
              ]),
            );
            const nested = Array.isArray(row.nested)
              ? row.nested
                  .filter((child) => child && typeof child === "object")
                  .map((child) => {
                    const next = createEmptyNestedChildRow(config.nestedFields);
                    for (const field of config.nestedFields) {
                      const cell = (child as NestedRepeaterChildRow)[field.key];
                      next[field.key] = typeof cell === "string" ? cell : "";
                    }
                    return next;
                  })
              : [];
            return {
              fields,
              nested: nested.length > 0 ? nested : [createEmptyNestedChildRow(config.nestedFields)],
            };
          })
      : [];

    return rows.length > 0 ? { rows } : empty;
  } catch {
    return empty;
  }
}

export function serializeNestedRepeaterValue(value: NestedRepeaterValue): string {
  return JSON.stringify(value);
}

export function isNestedRowFieldsComplete(
  row: NestedRepeaterRow,
  config: NestedRepeaterConfig,
): boolean {
  return config.fields.every((field) => Boolean(row.fields[field.key]?.trim()));
}

export function isNestedRowFieldsPartial(
  row: NestedRepeaterRow,
  config: NestedRepeaterConfig,
): boolean {
  const filledCount = config.fields.filter((field) =>
    Boolean(row.fields[field.key]?.trim()),
  ).length;
  return filledCount > 0 && filledCount < config.fields.length;
}

export function isNestedCompetitorRowComplete(
  row: NestedRepeaterRow,
  config: NestedRepeaterConfig,
): boolean {
  if (!isNestedRowFieldsComplete(row, config)) return false;
  const minNested = config.minNestedPerRow ?? 1;
  const completePages = row.nested.filter((child) =>
    isRepeaterRowComplete(child, config.nestedFields),
  );
  if (completePages.length < minNested) return false;
  return completePages.every((child) =>
    config.nestedFields.every((field) => isRepeaterCellValid(field, child[field.key] ?? "")),
  );
}

export function hasIncompleteNestedRepeaterRows(
  value: NestedRepeaterValue,
  config: NestedRepeaterConfig,
): boolean {
  if (value.rows.some((row) => isNestedRowFieldsPartial(row, config))) return true;
  return value.rows.some((row) => {
    if (!isNestedRowFieldsComplete(row, config)) return false;
    return row.nested.some((child) => isRepeaterRowPartial(child, config.nestedFields));
  });
}

export function isNestedRepeaterEmpty(
  value: NestedRepeaterValue,
  config: NestedRepeaterConfig,
): boolean {
  return !value.rows.some((row) => isNestedCompetitorRowComplete(row, config));
}

export function countCompleteNestedRows(
  value: NestedRepeaterValue,
  config: NestedRepeaterConfig,
): number {
  return value.rows.filter((row) => isNestedCompetitorRowComplete(row, config)).length;
}

export function hasInvalidNestedRepeaterUrls(
  value: NestedRepeaterValue,
  config: NestedRepeaterConfig,
): boolean {
  return value.rows.some((row) =>
    row.nested.some((child) =>
      config.nestedFields.some(
        (field) =>
          field.type === "url" &&
          Boolean(child[field.key]?.trim()) &&
          !isRepeaterCellValid(field, child[field.key]),
      ),
    ),
  );
}

export function hasInvalidNestedRepeaterCells(
  value: NestedRepeaterValue,
  config: NestedRepeaterConfig,
): boolean {
  return value.rows.some((row) => {
    if (!isNestedRowFieldsComplete(row, config)) return false;
    const topInvalid = config.fields.some(
      (field) =>
        Boolean(row.fields[field.key]?.trim()) &&
        !isRepeaterCellValid(field, row.fields[field.key]),
    );
    if (topInvalid) return true;
    return row.nested.some(
      (child) =>
        isRepeaterRowComplete(child, config.nestedFields) &&
        config.nestedFields.some((field) => !isRepeaterCellValid(field, child[field.key] ?? "")),
    );
  });
}

export function getNestedRepeaterConfig(step: {
  nestedRepeaterConfig?: NestedRepeaterConfig;
}): NestedRepeaterConfig | null {
  return step.nestedRepeaterConfig ?? null;
}
