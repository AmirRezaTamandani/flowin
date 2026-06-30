"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  PERSONA_AGE_OPTIONS,
  PERSONA_GENDER_OPTIONS,
  PERSONA_INCOME_OPTIONS,
  PERSONA_JOB_OPTIONS,
  type PersonaFieldsValue,
} from "../lib/personaFields";

function PersonaSelect({
  id,
  label,
  value,
  options,
  onChange,
  hasError,
}: {
  id: string;
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  hasError?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </Label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={hasError}
        className={cn(
          "h-11 w-full rounded-lg border border-input bg-white px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          hasError && "border-destructive ring-destructive/20",
        )}
      >
        <option value="">انتخاب کنید</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function PersonaFieldsInput({
  value,
  onChange,
  hasError,
}: {
  value: PersonaFieldsValue;
  onChange: (value: PersonaFieldsValue) => void;
  hasError?: boolean;
}) {
  function updateField<K extends keyof PersonaFieldsValue>(key: K, next: string) {
    onChange({ ...value, [key]: next });
  }

  return (
    <div className="flex flex-col gap-4">
      <PersonaSelect
        id="persona-age"
        label="بازه سنی"
        value={value.ageRange}
        options={PERSONA_AGE_OPTIONS}
        onChange={(next) => updateField("ageRange", next)}
        hasError={hasError}
      />
      <PersonaSelect
        id="persona-gender"
        label="جنسیت"
        value={value.gender}
        options={PERSONA_GENDER_OPTIONS}
        onChange={(next) => updateField("gender", next)}
        hasError={hasError}
      />
      <div className="flex flex-col gap-3 rounded-xl border border-input bg-white p-4">
        <Label className="text-sm font-medium text-foreground">موقعیت جغرافیایی</Label>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="persona-country" className="text-xs text-muted-foreground">
              کشور
            </Label>
            <Input
              id="persona-country"
              value={value.country}
              onChange={(event) => updateField("country", event.target.value)}
              placeholder="کشور"
              aria-invalid={hasError}
              className={cn("h-11 bg-white text-base", hasError && "border-destructive")}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="persona-province" className="text-xs text-muted-foreground">
              استان
            </Label>
            <Input
              id="persona-province"
              value={value.province}
              onChange={(event) => updateField("province", event.target.value)}
              placeholder="استان"
              aria-invalid={hasError}
              className={cn("h-11 bg-white text-base", hasError && "border-destructive")}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="persona-city" className="text-xs text-muted-foreground">
              شهر
            </Label>
            <Input
              id="persona-city"
              value={value.city}
              onChange={(event) => updateField("city", event.target.value)}
              placeholder="شهر"
              aria-invalid={hasError}
              className={cn("h-11 bg-white text-base", hasError && "border-destructive")}
            />
          </div>
        </div>
      </div>
      <PersonaSelect
        id="persona-job"
        label="شغل"
        value={value.job}
        options={PERSONA_JOB_OPTIONS}
        onChange={(next) => updateField("job", next)}
        hasError={hasError}
      />
      <PersonaSelect
        id="persona-income"
        label="سطح درامد"
        value={value.incomeLevel}
        options={PERSONA_INCOME_OPTIONS}
        onChange={(next) => updateField("incomeLevel", next)}
        hasError={hasError}
      />
    </div>
  );
}
