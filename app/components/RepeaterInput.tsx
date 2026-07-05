"use client";

import React from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
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
    <div className="flex items-center gap-1.5 shrink-0">
      <Button
        type="button"
        variant="secondary"
        size="icon"
        className="rounded-full size-9"
        onClick={() => removeRow(index)}
        aria-label={`حذف ردیف ${index + 1}`}
      >
        <Minus className="size-4" />
      </Button>
      <Button
        type="button"
        variant="secondary"
        size="icon"
        className="rounded-full size-9"
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
        <div className="bg-white p-4 border border-input rounded-xl">
          <Progress value={percentageTotal} className="gap-2">
            <div className="flex justify-between items-center gap-3 w-full text-sm">
              <ProgressLabel>مجموع تخصیص</ProgressLabel>
              <ProgressValue />
            </div>
          </Progress>
          <p
            className={cn(
              "mt-2 text-xs",
              remainingPercentage === 0
                ? "text-muted-foreground"
                : "text-destructive",
            )}
          >
            {remainingPercentage > 0
              ? `${remainingPercentage}% باقی‌مانده است. مجموع باید دقیقاً %100 شود.`
              : "مجموع درصدها کامل و برابر با %100 است."}
          </p>
        </div>
      ) : null}

      {value.rows.map((row, index) =>
        hasLabels ? (
          <div
            key={`repeater-row-${index}`}
            className="bg-white p-4 border border-input rounded-xl"
          >
            <div className="flex justify-between items-center gap-3 mb-3">
              <p className="font-semibold text-foreground text-sm">
                فرد {index + 1}
              </p>
              {rowControls(index)}
            </div>
            <div className="gap-3 grid sm:grid-cols-2">
              {fields.map((field) => {
                const fieldId = `repeater-${index}-${field.key}`;
                const cellError =
                  fieldErrors[repeaterFieldKey(index, field.key)];
                return (
                  <div
                    key={field.key}
                    className={
                      field.numberFormat === "percentage"
                        ? "sm:col-span-2"
                        : undefined
                    }
                  >
                    <RepeaterFieldLabel field={field} htmlFor={fieldId} />
                    <RepeaterFieldCell
                      field={field}
                      id={fieldId}
                      row={row}
                      repeaterRows={value.rows}
                      rowIndex={index}
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
          <div
            key={`repeater-row-${index}`}
            className="flex items-center gap-2"
          >
            {rowControls(index)}
            {fields.map((field, fieldIndex) => {
              const cellError = fieldErrors[repeaterFieldKey(index, field.key)];
              return (
                <RepeaterFieldCell
                  key={`${index}-${field.key}`}
                  field={field}
                  id={`repeater-${index}-${field.key}`}
                  row={row}
                  repeaterRows={value.rows}
                  rowIndex={index}
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
