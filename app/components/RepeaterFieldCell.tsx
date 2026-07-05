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
import { getPlatformUrlPattern } from "../lib/platformUrlValidation";
import NumericInput from "./NumericInput";
import FieldErrorMessage from "./FieldErrorMessage";

export function RepeaterFieldCell({
  field,
  value,
  onChange,
  id,
  hasError,
  errorMessage,
  className,
  row,
}: {
  field: RepeaterFieldConfig;
  value: string;
  onChange: (value: string) => void;
  id: string;
  hasError?: boolean;
  errorMessage?: string;
  className?: string;
  row?: RepeaterRow;
}) {
  const showError = hasError || Boolean(errorMessage);
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
          hasError={showError}
        />
        <FieldErrorMessage message={errorMessage} />
      </div>
    );
  }

  if (field.type === "url") {
    const inputDir = field.inputDir ?? "ltr";
    const platformLabel =
      field.urlPlatformDependsOnKey && row
        ? row[field.urlPlatformDependsOnKey]?.trim()
        : "";
    const platformExample = platformLabel
      ? getPlatformUrlPattern(platformLabel)?.example
      : undefined;
    return (
      <div className={cn("min-w-0", className)}>
        <Input
          id={id}
          type="url"
          inputMode="url"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder ?? platformExample ?? "https://example.com"}
          aria-invalid={showError}
          dir={inputDir}
          className={cn(
            "h-11 bg-white text-base text-foreground placeholder:text-muted-foreground",
            inputDir === "rtl" ? "text-right" : "text-left",
            showError && "border-destructive",
          )}
        />
        <FieldErrorMessage message={errorMessage} />
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
          aria-invalid={showError}
          className={cn(
            "h-11 w-full rounded-lg border border-input bg-white px-3 text-base text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            !value && "text-muted-foreground",
            showError && "border-destructive ring-destructive/20",
          )}
        >
          <option value="">{field.placeholder || "انتخاب کنید"}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <FieldErrorMessage message={errorMessage} />
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
          showError && "border-destructive ring-1 ring-destructive/20",
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
                  aria-invalid={showError}
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
        <FieldErrorMessage message={errorMessage} />
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
          aria-invalid={showError}
          className={cn(
            "h-11 bg-white text-base text-foreground",
            showError && "border-destructive",
          )}
        />
        <FieldErrorMessage message={errorMessage} />
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
        aria-invalid={showError}
        dir={field.inputDir}
        className={cn(
          "h-11 bg-white text-base text-foreground placeholder:text-muted-foreground",
          field.inputDir === "rtl" && "text-right",
          field.inputDir === "ltr" && "text-left",
          showError && "border-destructive",
        )}
      />
      <FieldErrorMessage message={errorMessage} />
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
