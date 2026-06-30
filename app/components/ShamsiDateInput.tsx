"use client";

import React from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import "react-multi-date-picker/styles/colors/teal.css";

const MIN_FOUNDING_YEAR = 1300;

type ShamsiPickerMode = "year" | "date";

function toLatinDigits(value: string): string {
  const persian = "۰۱۲۳۴۵۶۷۸۹";
  const arabic = "٠١٢٣٤٥٦٧٨٩";
  return value.replace(/[۰-۹]/g, (digit) => String(persian.indexOf(digit))).replace(/[٠-٩]/g, (digit) => String(arabic.indexOf(digit)));
}

function padDatePart(value: number): string {
  return String(value).padStart(2, "0");
}

function toDateObject(
  value: string,
  mode: ShamsiPickerMode,
): DateObject | undefined {
  const normalized = toLatinDigits(value.trim());
  if (!normalized) return undefined;

  if (mode === "year") {
    const year = Number.parseInt(normalized, 10);
    if (Number.isNaN(year)) return undefined;
    return new DateObject({ calendar: persian, locale: persian_fa, year, month: 1, day: 1 });
  }

  const parts = normalized.split("/").map((part) => Number.parseInt(part, 10));
  if (parts.length === 3 && !parts.some((part) => Number.isNaN(part))) {
    const [year, month, day] = parts;
    return new DateObject({ calendar: persian, locale: persian_fa, year, month, day });
  }

  const yearOnly = Number.parseInt(normalized, 10);
  if (!Number.isNaN(yearOnly) && String(yearOnly) === normalized) {
    return new DateObject({
      calendar: persian,
      locale: persian_fa,
      year: yearOnly,
      month: 1,
      day: 1,
    });
  }

  return undefined;
}

function formatShamsiValue(
  date: DateObject | null,
  mode: ShamsiPickerMode,
): string {
  if (!date) return "";
  if (mode === "year") return String(date.year);
  return `${date.year}/${padDatePart(date.month.number)}/${padDatePart(date.day)}`;
}

function currentShamsiDate(): DateObject {
  return new DateObject({ calendar: persian, locale: persian_fa });
}

export default function ShamsiDateInput({
  value,
  onChange,
  mode = "date",
  placeholder,
  hasError,
}: {
  value: string;
  onChange: (value: string) => void;
  mode?: ShamsiPickerMode;
  placeholder?: string;
  hasError?: boolean;
}) {
  const today = currentShamsiDate();
  const minDate = new DateObject({
    calendar: persian,
    locale: persian_fa,
    year: MIN_FOUNDING_YEAR,
    month: 1,
    day: 1,
  });
  const selected = toDateObject(value, mode);
  const displayValue = selected
    ? formatShamsiValue(selected, mode)
    : mode === "year"
      ? placeholder || "سال را انتخاب کنید"
      : placeholder || "تاریخ را انتخاب کنید";

  return (
    <div className="shamsi-date-input" dir="rtl">
      <DatePicker
        calendar={persian}
        locale={persian_fa}
        value={selected}
        onChange={(date) => {
          const next = Array.isArray(date) ? date[0] : date;
          onChange(formatShamsiValue(next ?? null, mode));
        }}
        onlyYearPicker={mode === "year"}
        format={mode === "year" ? "YYYY" : "YYYY/MM/DD"}
        minDate={minDate}
        maxDate={today}
        calendarPosition="bottom-right"
        containerClassName="w-full"
        inputClass="hidden"
        render={(_formattedValue, openCalendar) => (
          <button
            type="button"
            onClick={openCalendar}
            aria-invalid={hasError}
            className={cn(
              "flex justify-between items-center bg-white px-3 border border-input hover:border-ring focus-visible:border-ring rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50 w-full h-11 text-foreground text-base transition-colors",
              hasError && "border-destructive ring-destructive/20",
              !selected && "text-muted-foreground",
            )}
          >
            <span dir="rtl">{displayValue}</span>
            <CalendarDays className="size-5 text-muted-foreground shrink-0" />
          </button>
        )}
      />
    </div>
  );
}
