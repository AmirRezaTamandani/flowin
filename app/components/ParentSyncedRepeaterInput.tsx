"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  type RepeaterFieldConfig,
  type RepeaterSyncFromParentConfig,
  type RepeaterValue,
  syncRepeaterWithParentPlatforms,
} from "../lib/repeater";
import { RepeaterFieldCell, RepeaterFieldLabel } from "./RepeaterFieldCell";

export default function ParentSyncedRepeaterInput({
  value,
  onChange,
  fields,
  syncConfig,
  parentPlatforms,
  hasError,
}: {
  value: RepeaterValue;
  onChange: (value: RepeaterValue) => void;
  fields: RepeaterFieldConfig[];
  syncConfig: RepeaterSyncFromParentConfig;
  parentPlatforms: string[];
  hasError?: boolean;
}) {
  const platformsKey = parentPlatforms.join("\0");

  useEffect(() => {
    const synced = syncRepeaterWithParentPlatforms(
      value,
      fields,
      parentPlatforms,
      syncConfig.platformFieldKey,
    );
    const unchanged =
      synced.rows.length === value.rows.length &&
      synced.rows.every((row, index) => {
        const current = value.rows[index];
        if (!current) return false;
        return fields.every((field) => row[field.key] === current[field.key]);
      });
    if (!unchanged) onChange(synced);
  }, [platformsKey, fields, onChange, syncConfig.platformFieldKey, value]);

  function updateRow(index: number, key: string, next: string) {
    onChange({
      rows: value.rows.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [key]: next } : row,
      ),
    });
  }

  if (parentPlatforms.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-input bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
        ابتدا در سوال قبل شبکه‌های اجتماعی موردنظر خود را انتخاب کنید.
      </p>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        hasError && "rounded-xl border border-destructive p-3",
      )}
    >
      {value.rows.map((row, index) => (
        <div
          key={`${row[syncConfig.platformFieldKey]}-${index}`}
          className="grid gap-3 sm:grid-cols-2"
        >
          {fields.map((field) => {
            const fieldId = `synced-repeater-${index}-${field.key}`;
            return (
              <div key={field.key}>
                <RepeaterFieldLabel field={field} htmlFor={fieldId} />
                <RepeaterFieldCell
                  field={field}
                  id={fieldId}
                  value={row[field.key] ?? ""}
                  onChange={(next) => updateRow(index, field.key, next)}
                  hasError={hasError}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
