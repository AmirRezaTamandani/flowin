"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  PERSONA_AGE_OPTIONS,
  PERSONA_COUNTRY_OPTIONS,
  PERSONA_GENDER_OPTIONS,
  PERSONA_INCOME_OPTIONS,
  PERSONA_JOB_OPTIONS,
  getPersonaCityOptions,
  getPersonaProvinceOptions,
  type PersonaFieldsValue,
} from "../lib/personaFields";

function PersonaSelect({
  id,
  label,
  value,
  options,
  onChange,
  hasError,
  placeholder = "انتخاب کنید",
  disabled,
}: {
  id: string;
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  hasError?: boolean;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </Label>
      <div className="relative">
        <select
          id={id}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={hasError}
          className={cn(
            "h-11 w-full appearance-none rounded-lg border border-input bg-white px-3 pl-10 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-muted/40 disabled:text-muted-foreground",
            hasError && "border-destructive ring-destructive/20",
          )}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
      </div>
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

  const provinceOptions = getPersonaProvinceOptions(value.country);
  const cityOptions = getPersonaCityOptions(value.country, value.province);

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
          <PersonaSelect
            id="persona-country"
            label="کشور"
            value={value.country}
            options={PERSONA_COUNTRY_OPTIONS}
            onChange={(next) =>
              onChange({ ...value, country: next, province: "", city: "" })
            }
            hasError={hasError}
          />
          <PersonaSelect
            id="persona-province"
            label="استان"
            value={provinceOptions.includes(value.province) ? value.province : ""}
            options={provinceOptions}
            onChange={(next) => onChange({ ...value, province: next, city: "" })}
            hasError={hasError}
            placeholder={value.country ? "استان را انتخاب کنید" : "ابتدا کشور را انتخاب کنید"}
            disabled={!value.country}
          />
          <PersonaSelect
            id="persona-city"
            label="شهر"
            value={cityOptions.includes(value.city) ? value.city : ""}
            options={cityOptions}
            onChange={(next) => updateField("city", next)}
            hasError={hasError}
            placeholder={value.province ? "شهر را انتخاب کنید" : "ابتدا استان را انتخاب کنید"}
            disabled={!value.province}
          />
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
