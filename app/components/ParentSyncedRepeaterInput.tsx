"use client";

import React, { useEffect } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  createEmptyRepeaterRow,
  getRepeaterMaxRowsPerPlatform,
  type RepeaterFieldConfig,
  type RepeaterSyncFromParentConfig,
  type RepeaterValue,
  sanitizeRepeaterRowSelectValues,
  syncRepeaterWithParentPlatforms,
} from "../lib/repeater";
import { repeaterFieldKey } from "../lib/surveyValidation";
import { RepeaterFieldCell, RepeaterFieldLabel } from "./RepeaterFieldCell";

export default function ParentSyncedRepeaterInput({
  value,
  onChange,
  fields,
  syncConfig,
  parentPlatforms,
  hasError,
  fieldErrors = {},
}: {
  value: RepeaterValue;
  onChange: (value: RepeaterValue) => void;
  fields: RepeaterFieldConfig[];
  syncConfig: RepeaterSyncFromParentConfig;
  parentPlatforms: string[];
  hasError?: boolean;
  fieldErrors?: Record<string, string>;
}) {
  const platformsKey = parentPlatforms.join("\0");
  const allowMultiple = Boolean(syncConfig.allowMultipleRowsPerPlatform);
  const platformFieldKey = syncConfig.platformFieldKey;

  useEffect(() => {
    const synced = syncRepeaterWithParentPlatforms(
      value,
      fields,
      parentPlatforms,
      syncConfig,
    );
    const unchanged =
      synced.rows.length === value.rows.length &&
      synced.rows.every((row, index) => {
        const current = value.rows[index];
        if (!current) return false;
        return fields.every((field) => row[field.key] === current[field.key]);
      });
    if (!unchanged) onChange(synced);
  }, [platformsKey, fields, onChange, syncConfig, value]);

  function updateRow(index: number, key: string, next: string) {
    onChange({
      rows: value.rows.map((row, rowIndex) => {
        if (rowIndex !== index) return row;
        const updated = sanitizeRepeaterRowSelectValues(
          { ...row, [key]: next },
          fields,
        );
        return updated;
      }),
    });
  }

  function addRowForPlatform(platform: string) {
    const platformRowCount = value.rows.filter(
      (row) => row[platformFieldKey] === platform,
    ).length;
    const maxRows = syncConfig.maxRowsPerPlatformFieldKey
      ? getRepeaterMaxRowsPerPlatform(
          platform,
          fields,
          platformFieldKey,
          syncConfig.maxRowsPerPlatformFieldKey,
        )
      : undefined;
    if (maxRows !== undefined && platformRowCount >= maxRows) return;

    const lastIndex = value.rows.reduce(
      (last, row, index) => (row[platformFieldKey] === platform ? index : last),
      -1,
    );
    const empty = createEmptyRepeaterRow(fields);
    empty[platformFieldKey] = platform;
    const rows = [...value.rows];
    rows.splice(lastIndex + 1, 0, empty);
    onChange({ rows });
  }

  function removeRowAt(index: number, platform: string) {
    const platformRowCount = value.rows.filter(
      (row) => row[platformFieldKey] === platform,
    ).length;
    if (platformRowCount <= 1) return;
    onChange({ rows: value.rows.filter((_, rowIndex) => rowIndex !== index) });
  }

  function renderFieldCell(rowIndex: number, field: RepeaterFieldConfig) {
    const row = value.rows[rowIndex];
    const fieldId = `synced-repeater-${rowIndex}-${field.key}`;
    const cellError = fieldErrors[repeaterFieldKey(rowIndex, field.key)];
    const platform = row[platformFieldKey];
    const excludeSelectOptions =
      syncConfig.maxRowsPerPlatformFieldKey &&
      field.key === syncConfig.maxRowsPerPlatformFieldKey &&
      platform
        ? value.rows
            .filter(
              (otherRow, otherIndex) =>
                otherIndex !== rowIndex && otherRow[platformFieldKey] === platform,
            )
            .map((otherRow) => otherRow[field.key]?.trim() ?? "")
            .filter(Boolean)
        : undefined;
    return (
      <div key={field.key}>
        <RepeaterFieldLabel field={field} htmlFor={fieldId} />
        <RepeaterFieldCell
          field={field}
          id={fieldId}
          row={row}
          value={row[field.key] ?? ""}
          onChange={(next) => updateRow(rowIndex, field.key, next)}
          hasError={Boolean(cellError)}
          errorMessage={cellError}
          excludeSelectOptions={excludeSelectOptions}
        />
      </div>
    );
  }

  if (parentPlatforms.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-input bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
        ابتدا در سوال قبل شبکه‌های اجتماعی موردنظر خود را انتخاب کنید.
      </p>
    );
  }

  if (!allowMultiple) {
    return (
      <div
        className={cn(
          "flex flex-col gap-3",
          hasError && "rounded-xl border border-destructive p-3",
        )}
      >
        {value.rows.map((row, index) => (
          <div
            key={`${row[platformFieldKey]}-${index}`}
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          >
            {fields.map((field) => renderFieldCell(index, field))}
          </div>
        ))}
      </div>
    );
  }

  const platformGroups = parentPlatforms.map((platform) => ({
    platform,
    rowIndices: value.rows
      .map((row, index) => ({ row, index }))
      .filter(({ row }) => row[platformFieldKey] === platform)
      .map(({ index }) => index),
  }));

  const editableFields = fields.filter((field) => field.key !== platformFieldKey);

  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        hasError && "rounded-xl border border-destructive p-3",
      )}
    >
      {platformGroups.map(({ platform, rowIndices }) => {
        const maxRows = syncConfig.maxRowsPerPlatformFieldKey
          ? getRepeaterMaxRowsPerPlatform(
              platform,
              fields,
              platformFieldKey,
              syncConfig.maxRowsPerPlatformFieldKey,
            )
          : undefined;
        const canAddRow = maxRows === undefined || rowIndices.length < maxRows;

        return (
        <div
          key={platform}
          className="rounded-xl border border-input bg-white p-4"
        >
          <p className="mb-3 text-sm font-semibold text-foreground">{platform}</p>
          <div className="flex flex-col gap-3">
            {rowIndices.map((rowIndex, slotIndex) => (
              <div
                key={`${platform}-${rowIndex}`}
                className="flex items-start gap-2"
              >
                <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {editableFields.map((field) => renderFieldCell(rowIndex, field))}
                </div>
                <div className="flex shrink-0 flex-col gap-1.5 pt-7">
                  {rowIndices.length > 1 ? (
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="size-9 rounded-full"
                      onClick={() => removeRowAt(rowIndex, platform)}
                      aria-label={`حذف ردیف ${slotIndex + 1} برای ${platform}`}
                    >
                      <Minus className="size-4" />
                    </Button>
                  ) : null}
                  {slotIndex === rowIndices.length - 1 && canAddRow ? (
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="size-9 rounded-full"
                      onClick={() => addRowForPlatform(platform)}
                      aria-label={`افزودن ردیف برای ${platform}`}
                    >
                      <Plus className="size-4" />
                    </Button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
        );
      })}
    </div>
  );
}
