"use client";

import React from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  createEmptyRepeaterRow,
  getRepeaterPercentageTotal,
  hasRepeaterPercentageField,
  type RepeaterFieldConfig,
  type RepeaterValue,
} from "../lib/repeater";
import { repeaterFieldKey } from "../lib/surveyValidation";
import { RepeaterFieldCell, RepeaterFieldLabel } from "./RepeaterFieldCell";

export default function RepeaterInput({
  value,
  onChange,
  fields,
  hasError,
  fieldErrors = {},
}: {
  value: RepeaterValue;
  onChange: (value: RepeaterValue) => void;
  fields: RepeaterFieldConfig[];
  hasError?: boolean;
  fieldErrors?: Record<string, string>;
}) {
  const hasLabels = fields.some((field) => field.label);
  const hasPercentageField = hasRepeaterPercentageField(fields);
  const percentageTotal = getRepeaterPercentageTotal(value);
  const remainingPercentage = 100 - percentageTotal;

  function updateRow(index: number, key: string, next: string) {
    onChange({
      rows: value.rows.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [key]: next } : row,
      ),
    });
  }

  function addRowAfter(index: number) {
    const rows = [...value.rows];
    rows.splice(index + 1, 0, createEmptyRepeaterRow(fields));
    onChange({ rows });
  }

  function removeRow(index: number) {
    if (value.rows.length === 1) {
      onChange({ rows: [createEmptyRepeaterRow(fields)] });
      return;
    }
    onChange({ rows: value.rows.filter((_, rowIndex) => rowIndex !== index) });
  }

  const rowControls = (index: number) => (
    <div className="flex shrink-0 items-center gap-1.5">
      <Button
        type="button"
        variant="secondary"
        size="icon"
        className="size-9 rounded-full"
        onClick={() => removeRow(index)}
        aria-label={`حذف ردیف ${index + 1}`}
      >
        <Minus className="size-4" />
      </Button>
      <Button
        type="button"
        variant="secondary"
        size="icon"
        className="size-9 rounded-full"
        onClick={() => addRowAfter(index)}
        aria-label="افزودن ردیف"
      >
        <Plus className="size-4" />
      </Button>
    </div>
  );

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        hasError && "rounded-xl border border-destructive p-3",
      )}
    >
      {hasPercentageField ? (
        <div className="rounded-xl border border-input bg-white p-4">
          <Progress value={percentageTotal} className="gap-2">
            <div className="flex w-full items-center justify-between gap-3 text-sm">
              <ProgressLabel>مجموع تخصیص</ProgressLabel>
              <ProgressValue />
            </div>
          </Progress>
          <p
            className={cn(
              "mt-2 text-xs",
              remainingPercentage === 0 ? "text-muted-foreground" : "text-destructive",
            )}
          >
            {remainingPercentage > 0
              ? `${remainingPercentage}% باقی‌مانده است. مجموع باید دقیقاً ۱۰۰٪ شود.`
              : "مجموع درصدها کامل و برابر با ۱۰۰٪ است."}
          </p>
        </div>
      ) : null}

      {value.rows.map((row, index) =>
        hasLabels ? (
          <div
            key={`repeater-row-${index}`}
            className="rounded-xl border border-input bg-white p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-foreground">فرد {index + 1}</p>
              {rowControls(index)}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {fields.map((field) => {
                const fieldId = `repeater-${index}-${field.key}`;
                const cellError = fieldErrors[repeaterFieldKey(index, field.key)];
                return (
                  <div key={field.key}>
                    <RepeaterFieldLabel field={field} htmlFor={fieldId} />
                    <RepeaterFieldCell
                      field={field}
                      id={fieldId}
                      row={row}
                      value={row[field.key] ?? ""}
                      onChange={(next) => updateRow(index, field.key, next)}
                      hasError={Boolean(cellError)}
                      errorMessage={cellError}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div key={`repeater-row-${index}`} className="flex items-center gap-2">
            {rowControls(index)}
            {fields.map((field, fieldIndex) => {
              const cellError = fieldErrors[repeaterFieldKey(index, field.key)];
              return (
                <RepeaterFieldCell
                  key={field.key}
                  field={field}
                  id={`repeater-${index}-${field.key}`}
                  row={row}
                  value={row[field.key] ?? ""}
                  onChange={(next) => updateRow(index, field.key, next)}
                  hasError={Boolean(cellError)}
                  errorMessage={cellError}
                  className={fieldIndex === 0 ? "flex-2" : "flex-3"}
                />
              );
            })}
          </div>
        ),
      )}
    </div>
  );
}
