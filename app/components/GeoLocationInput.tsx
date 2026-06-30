"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  EMPTY_GEO_LOCATION_ENTRY,
  GEO_COUNTRY_OPTIONS,
  IRAN_PROVINCE_OPTIONS,
  isIranCountry,
  isKnownCountry,
  type GeoLocationEntry,
  type GeoLocationValue,
} from "../lib/geoLocation";

function GeoSelect({
  id,
  label,
  value,
  options,
  onChange,
  hasError,
  disabled,
}: {
  id: string;
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  hasError?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </Label>
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={hasError}
        className={cn(
          "h-11 w-full rounded-lg border border-input bg-white px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
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

function GeoLocationRow({
  index,
  entry,
  onChange,
  onRemove,
  canRemove,
  hasError,
}: {
  index: number;
  entry: GeoLocationEntry;
  onChange: (patch: Partial<GeoLocationEntry>) => void;
  onRemove: () => void;
  canRemove: boolean;
  hasError?: boolean;
}) {
  const countrySelectValue = isKnownCountry(entry.country)
    ? entry.country
    : entry.country
      ? "سایر"
      : "";
  const showCustomCountry = countrySelectValue === "سایر";
  const customCountry = showCustomCountry && !isKnownCountry(entry.country) ? entry.country : "";

  function updateCountry(next: string) {
    onChange({ country: next, province: "", city: "" });
  }

  return (
    <div className="rounded-xl border border-input bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-foreground">موقعیت {index + 1}</p>
        {canRemove ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onRemove}
            aria-label={`حذف موقعیت ${index + 1}`}
          >
            <Trash2 className="size-4" />
          </Button>
        ) : null}
      </div>

      <div className="flex flex-col gap-4">
        <GeoSelect
          id={`geo-country-${index}`}
          label="کشور"
          value={countrySelectValue}
          options={GEO_COUNTRY_OPTIONS}
          onChange={updateCountry}
          hasError={hasError}
        />

        {showCustomCountry ? (
          <div className="flex flex-col gap-2">
            <Label htmlFor={`geo-custom-country-${index}`} className="text-sm font-medium text-foreground">
              نام کشور
            </Label>
            <Input
              id={`geo-custom-country-${index}`}
              value={customCountry}
              onChange={(event) =>
                onChange({
                  country: event.target.value,
                  province: "",
                  city: "",
                })
              }
              placeholder="نام کشور را وارد کنید"
              aria-invalid={hasError}
              className={cn("h-11 bg-white text-base", hasError && "border-destructive")}
            />
          </div>
        ) : null}

        {isIranCountry(entry.country) ? (
          <GeoSelect
            id={`geo-province-${index}`}
            label="استان"
            value={entry.province}
            options={IRAN_PROVINCE_OPTIONS}
            onChange={(next) => onChange({ province: next, city: entry.city })}
            hasError={hasError}
            disabled={!entry.country}
          />
        ) : (
          <div className="flex flex-col gap-2">
            <Label htmlFor={`geo-province-${index}`} className="text-sm font-medium text-foreground">
              استان / ایالت
            </Label>
            <Input
              id={`geo-province-${index}`}
              value={entry.province}
              onChange={(event) => onChange({ province: event.target.value })}
              placeholder="استان یا ایالت"
              disabled={!entry.country || entry.country === "سایر"}
              aria-invalid={hasError}
              className={cn("h-11 bg-white text-base", hasError && "border-destructive")}
            />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Label htmlFor={`geo-city-${index}`} className="text-sm font-medium text-foreground">
            شهر
          </Label>
          <Input
            id={`geo-city-${index}`}
            value={entry.city}
            onChange={(event) => onChange({ city: event.target.value })}
            placeholder="شهر"
            disabled={!entry.province}
            aria-invalid={hasError}
            className={cn("h-11 bg-white text-base", hasError && "border-destructive")}
          />
        </div>
      </div>
    </div>
  );
}

export default function GeoLocationInput({
  value,
  onChange,
  hasError,
}: {
  value: GeoLocationValue;
  onChange: (value: GeoLocationValue) => void;
  hasError?: boolean;
}) {
  function updateLocation(index: number, patch: Partial<GeoLocationEntry>) {
    const locations = value.locations.map((entry, entryIndex) =>
      entryIndex === index ? { ...entry, ...patch } : entry,
    );
    onChange({ locations });
  }

  function addLocation() {
    onChange({
      locations: [...value.locations, { ...EMPTY_GEO_LOCATION_ENTRY }],
    });
  }

  function removeLocation(index: number) {
    if (value.locations.length === 1) {
      onChange({ locations: [{ ...EMPTY_GEO_LOCATION_ENTRY }] });
      return;
    }
    onChange({ locations: value.locations.filter((_, entryIndex) => entryIndex !== index) });
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        hasError && "rounded-xl border border-destructive p-3",
      )}
    >
      {value.locations.map((entry, index) => (
        <GeoLocationRow
          key={`geo-${index}`}
          index={index}
          entry={entry}
          onChange={(patch) => updateLocation(index, patch)}
          onRemove={() => removeLocation(index)}
          canRemove={value.locations.length > 1}
          hasError={hasError}
        />
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addLocation}
        className="h-10 w-full rounded-xl font-semibold"
      >
        <Plus className="size-4" />
        افزودن موقعیت دیگر
      </Button>
    </div>
  );
}
