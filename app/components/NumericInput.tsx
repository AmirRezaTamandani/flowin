"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { isPhoneStepValueValid, sanitizePhoneValue } from "../lib/phoneValidation";

function sanitizeNumericValue(value: string, allowDecimal: boolean): string {
  const cleaned = value.replace(allowDecimal ? /[^\d.]/g : /\D/g, "");
  if (!allowDecimal) return cleaned;

  const [whole, ...fraction] = cleaned.split(".");
  if (fraction.length === 0) return whole;
  return `${whole}.${fraction.join("")}`;
}

function clampNumericValue(value: string, min?: number, max?: number): string {
  if (!value || value === ".") return value;
  const parsed = Number.parseFloat(value);
  if (Number.isNaN(parsed)) return value;

  if (min !== undefined && parsed < min) return String(min);
  if (max !== undefined && parsed > max) return String(max);
  return value;
}

export type NumberFormat = "default" | "phone";

export default function NumericInput({
  value,
  onChange,
  suffix,
  placeholder,
  hasError,
  min,
  max,
  allowDecimal = false,
  format = "default",
}: {
  value: string;
  onChange: (value: string) => void;
  suffix?: string;
  placeholder?: string;
  hasError?: boolean;
  min?: number;
  max?: number;
  allowDecimal?: boolean;
  format?: NumberFormat;
}) {
  function handleChange(nextRaw: string) {
    if (format === "phone") {
      onChange(sanitizePhoneValue(nextRaw));
      return;
    }
    const sanitized = sanitizeNumericValue(nextRaw, allowDecimal);
    onChange(clampNumericValue(sanitized, min, max));
  }

  const inputMode = format === "phone" ? "tel" : allowDecimal ? "decimal" : "numeric";

  return (
    <div
      className={cn(
        "relative bg-white border border-input focus-within:border-ring rounded-lg focus-within:ring-3 focus-within:ring-ring/50 w-full h-11 transition-colors",
        hasError && "border-destructive ring-destructive/20",
      )}
    >
      <input
        type="text"
        inputMode={inputMode}
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        placeholder={placeholder}
        aria-invalid={hasError}
        dir="ltr"
        className={cn(
          "bg-transparent outline-none w-full h-full text-foreground placeholder:text-muted-foreground text-base text-left",
          suffix ? "pl-3 pr-10" : "px-3",
        )}
      />
      {suffix ? (
        <span className="top-1/2 right-3 absolute text-muted-foreground text-base -translate-y-1/2 pointer-events-none">
          {suffix}
        </span>
      ) : null}
    </div>
  );
}

export function isNumericStepValueValid(
  value: string | string[] | undefined,
  min?: number,
  max?: number,
  format: NumberFormat = "default",
): boolean {
  if (!value || typeof value !== "string" || !value.trim()) return false;
  if (format === "phone") return isPhoneStepValueValid(value);

  const parsed = Number.parseFloat(value);
  if (Number.isNaN(parsed)) return false;
  if (min !== undefined && parsed < min) return false;
  if (max !== undefined && parsed > max) return false;
  return true;
}
