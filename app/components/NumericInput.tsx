"use client";

import React from "react";
import { cn } from "@/lib/utils";

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

export default function NumericInput({
  value,
  onChange,
  suffix,
  placeholder,
  hasError,
  min,
  max,
  allowDecimal = false,
}: {
  value: string;
  onChange: (value: string) => void;
  suffix?: string;
  placeholder?: string;
  hasError?: boolean;
  min?: number;
  max?: number;
  allowDecimal?: boolean;
}) {
  function handleChange(nextRaw: string) {
    const sanitized = sanitizeNumericValue(nextRaw, allowDecimal);
    onChange(clampNumericValue(sanitized, min, max));
  }

  return (
    <div
      className={cn(
        "relative h-11 w-full rounded-lg border border-input bg-white transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
        hasError && "border-destructive ring-destructive/20",
      )}
    >
      <input
        type="text"
        inputMode={allowDecimal ? "decimal" : "numeric"}
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        placeholder={placeholder}
        aria-invalid={hasError}
        dir="ltr"
        className={cn(
          "h-full w-full bg-transparent text-left text-base text-foreground outline-none placeholder:text-muted-foreground",
          suffix ? "pl-3 pr-10" : "px-3",
        )}
      />
      {suffix ? (
        <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-base text-muted-foreground">
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
): boolean {
  if (!value || typeof value !== "string" || !value.trim()) return false;
  const parsed = Number.parseFloat(value);
  if (Number.isNaN(parsed)) return false;
  if (min !== undefined && parsed < min) return false;
  if (max !== undefined && parsed > max) return false;
  return true;
}
