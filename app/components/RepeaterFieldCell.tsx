"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { RepeaterFieldConfig } from "../lib/repeater";
import NumericInput from "./NumericInput";

export function RepeaterFieldCell({
  field,
  value,
  onChange,
  id,
  hasError,
  className,
}: {
  field: RepeaterFieldConfig;
  value: string;
  onChange: (value: string) => void;
  id: string;
  hasError?: boolean;
  className?: string;
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
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
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
