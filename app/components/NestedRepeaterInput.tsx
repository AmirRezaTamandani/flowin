"use client";

import React from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  createEmptyNestedChildRow,
  createEmptyNestedRow,
  type NestedRepeaterConfig,
  type NestedRepeaterValue,
} from "../lib/nestedRepeater";
import { RepeaterFieldCell, RepeaterFieldLabel } from "./RepeaterFieldCell";

export default function NestedRepeaterInput({
  value,
  onChange,
  config,
  hasError,
}: {
  value: NestedRepeaterValue;
  onChange: (value: NestedRepeaterValue) => void;
  config: NestedRepeaterConfig;
  hasError?: boolean;
}) {
  const nestedAddLabel = config.nestedAddLabel ?? "افزودن صفحه اجتماعی";

  function updateRowFields(rowIndex: number, key: string, next: string) {
    onChange({
      rows: value.rows.map((row, index) =>
        index === rowIndex ? { ...row, fields: { ...row.fields, [key]: next } } : row,
      ),
    });
  }

  function updateNestedCell(
    rowIndex: number,
    nestedIndex: number,
    key: string,
    next: string,
  ) {
    onChange({
      rows: value.rows.map((row, index) => {
        if (index !== rowIndex) return row;
        return {
          ...row,
          nested: row.nested.map((child, childIndex) =>
            childIndex === nestedIndex ? { ...child, [key]: next } : child,
          ),
        };
      }),
    });
  }

  function addCompetitorAfter(index: number) {
    if (config.maxRows !== undefined && value.rows.length >= config.maxRows) return;
    const rows = [...value.rows];
    rows.splice(index + 1, 0, createEmptyNestedRow(config));
    onChange({ rows });
  }

  function removeCompetitor(index: number) {
    if (value.rows.length === 1) {
      onChange({ rows: [createEmptyNestedRow(config)] });
      return;
    }
    onChange({ rows: value.rows.filter((_, rowIndex) => rowIndex !== index) });
  }

  function addNestedPage(rowIndex: number) {
    onChange({
      rows: value.rows.map((row, index) =>
        index === rowIndex
          ? {
              ...row,
              nested: [...row.nested, createEmptyNestedChildRow(config.nestedFields)],
            }
          : row,
      ),
    });
  }

  function removeNestedPage(rowIndex: number, nestedIndex: number) {
    onChange({
      rows: value.rows.map((row, index) => {
        if (index !== rowIndex) return row;
        if (row.nested.length === 1) {
          return { ...row, nested: [createEmptyNestedChildRow(config.nestedFields)] };
        }
        return {
          ...row,
          nested: row.nested.filter((_, childIndex) => childIndex !== nestedIndex),
        };
      }),
    });
  }

  const canAddCompetitor =
    config.maxRows === undefined || value.rows.length < config.maxRows;

  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        hasError && "rounded-xl border border-destructive p-3",
      )}
    >
      {value.rows.map((row, rowIndex) => (
        <div
          key={`competitor-${rowIndex}`}
          className="rounded-xl border border-input bg-white p-4"
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-foreground">رقیب {rowIndex + 1}</p>
            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="size-9 rounded-full"
                onClick={() => removeCompetitor(rowIndex)}
                aria-label={`حذف رقیب ${rowIndex + 1}`}
              >
                <Minus className="size-4" />
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="size-9 rounded-full"
                disabled={!canAddCompetitor}
                onClick={() => addCompetitorAfter(rowIndex)}
                aria-label="افزودن رقیب"
              >
                <Plus className="size-4" />
              </Button>
            </div>
          </div>

          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            {config.fields.map((field) => {
              const fieldId = `nested-${rowIndex}-${field.key}`;
              return (
                <div key={field.key}>
                  <RepeaterFieldLabel field={field} htmlFor={fieldId} />
                  <RepeaterFieldCell
                    field={field}
                    id={fieldId}
                    value={row.fields[field.key] ?? ""}
                    onChange={(next) => updateRowFields(rowIndex, field.key, next)}
                    hasError={hasError}
                  />
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-foreground">صفحات اجتماعی</p>
            {row.nested.map((child, nestedIndex) => (
              <div
                key={`nested-${rowIndex}-${nestedIndex}`}
                className="flex items-center gap-2"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeNestedPage(rowIndex, nestedIndex)}
                  aria-label={`حذف صفحه ${nestedIndex + 1}`}
                >
                  <Minus className="size-4" />
                </Button>
                {config.nestedFields.map((field, fieldIndex) => (
                  <RepeaterFieldCell
                    key={field.key}
                    field={field}
                    id={`nested-${rowIndex}-${nestedIndex}-${field.key}`}
                    value={child[field.key] ?? ""}
                    onChange={(next) =>
                      updateNestedCell(rowIndex, nestedIndex, field.key, next)
                    }
                    hasError={hasError}
                    className={fieldIndex === 0 ? "flex-[2]" : "flex-[3]"}
                  />
                ))}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="mt-1 h-10 w-full gap-2"
              onClick={() => addNestedPage(rowIndex)}
            >
              <Plus className="size-4" />
              {nestedAddLabel}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
