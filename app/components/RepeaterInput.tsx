"use client";

import React from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  createEmptyRepeaterRow,
  type RepeaterFieldConfig,
  type RepeaterValue,
} from "../lib/repeater";
import { RepeaterFieldCell } from "./RepeaterFieldCell";

export default function RepeaterInput({
  value,
  onChange,
  fields,
  hasError,
}: {
  value: RepeaterValue;
  onChange: (value: RepeaterValue) => void;
  fields: RepeaterFieldConfig[];
  hasError?: boolean;
}) {
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

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        hasError && "rounded-xl border border-destructive p-3",
      )}
    >
      {value.rows.map((row, index) => (
        <div key={`repeater-row-${index}`} className="flex items-center gap-2">
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

          {fields.map((field, fieldIndex) => (
            <RepeaterFieldCell
              key={field.key}
              field={field}
              id={`repeater-${index}-${field.key}`}
              value={row[field.key] ?? ""}
              onChange={(next) => updateRow(index, field.key, next)}
              hasError={hasError}
              className={fieldIndex === 0 ? "flex-[2]" : "flex-[3]"}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
