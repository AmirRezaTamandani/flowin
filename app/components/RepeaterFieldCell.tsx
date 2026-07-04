"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { RepeaterFieldConfig, RepeaterRow } from "../lib/repeater";
import {
  parseRepeaterMultiCheckboxValue,
  resolveRepeaterSelectOptions,
  serializeRepeaterMultiCheckboxValue,
} from "../lib/repeater";
import NumericInput from "./NumericInput";

export function RepeaterFieldCell({
  field,
  value,
  onChange,
  id,
  hasError,
  className,
  row,
}: {
  field: RepeaterFieldConfig;
  value: string;
  onChange: (value: string) => void;
  id: string;
  hasError?: boolean;
  className?: string;
  row?: RepeaterRow;
}) {
  if (field.type === "number") {
    return (
      <div className={cn("min-w-0", className)}>
        <NumericInput
          value={value}
          onChange={onChange}
          placeholder={field.placeholder}
          min={field.numberMin}
          max={field.numberMax}
          suffix={field.numberSuffix}
          format={field.numberFormat ?? "default"}
          hasError={hasError}
        />
      </div>
    );
  }

  if (field.type === "url") {
    return (
      <div className={cn("min-w-0", className)}>
        <Input
          id={id}
          type="url"
          inputMode="url"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder || "https://example.com"}
          aria-invalid={hasError}
          dir="ltr"
          className={cn(
            "h-11 bg-white text-base text-foreground text-left",
            hasError && "border-destructive",
          )}
        />
      </div>
    );
  }

  if (field.type === "select") {
    const options = row ? resolveRepeaterSelectOptions(field, row) : (field.options ?? []);
    return (
      <div className={cn("min-w-0", className)}>
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={hasError}
          className={cn(
            "h-11 w-full rounded-lg border border-input bg-white px-3 text-base text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            hasError && "border-destructive ring-destructive/20",
          )}
        >
          <option value="">{field.placeholder || "انتخاب کنید"}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === "multiCheckbox") {
    const selected = parseRepeaterMultiCheckboxValue(value);
    const options = field.options ?? [];
    return (
      <div
        className={cn(
          "min-w-0 rounded-lg border border-input bg-white p-3",
          hasError && "border-destructive ring-1 ring-destructive/20",
          className,
        )}
      >
        <div className="flex flex-wrap gap-x-4 gap-y-3">
          {options.map((option) => {
            const checked = selected.includes(option);
            return (
              <Label
                key={option}
                htmlFor={`${id}-${option}`}
                className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
              >
                <Checkbox
                  id={`${id}-${option}`}
                  checked={checked}
                  aria-invalid={hasError}
                  onCheckedChange={(nextChecked) => {
                    const nextSelected = nextChecked
                      ? [...selected, option]
                      : selected.filter((item) => item !== option);
                    onChange(serializeRepeaterMultiCheckboxValue(nextSelected));
                  }}
                />
                <span>{option}</span>
              </Label>
            );
          })}
        </div>
      </div>
    );
  }

  if (field.type === "time") {
    return (
      <div className={cn("min-w-0", className)}>
        <Input
          id={id}
          type="time"
          inputMode="numeric"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          aria-invalid={hasError}
          className={cn(
            "h-11 bg-white text-base text-foreground",
            hasError && "border-destructive",
          )}
        />
      </div>
    );
  }

  if (field.readOnly) {
    return (
      <div
        className={cn(
          "flex h-11 min-w-0 items-center rounded-lg border border-input bg-muted/30 px-3 text-sm text-foreground",
          className,
        )}
      >
        {value || field.placeholder}
      </div>
    );
  }

  return (
    <div className={cn("min-w-0", className)}>
      <Input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={field.placeholder}
        aria-invalid={hasError}
        className={cn(
          "h-11 bg-white text-base text-foreground",
          hasError && "border-destructive",
        )}
      />
    </div>
  );
}

export function RepeaterFieldLabel({
  field,
  htmlFor,
}: {
  field: RepeaterFieldConfig;
  htmlFor: string;
}) {
  if (!field.label) return null;
  return (
    <Label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-foreground">
      {field.label}
    </Label>
  );
}
