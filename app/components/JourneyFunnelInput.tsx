"use client";

import React from "react";
import {
  Eye,
  Headphones,
  Megaphone,
  Minus,
  PhoneCall,
  Plus,
  Repeat2,
  Search,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  createEmptyRepeaterRow,
  type RepeaterFieldConfig,
  type RepeaterValue,
} from "../lib/repeater";

const previewIcons = [
  Search,
  Eye,
  PhoneCall,
  Headphones,
  ShoppingBag,
  Megaphone,
  Repeat2,
];

const previewGradients = [
  "from-indigo-700 to-violet-700",
  "from-violet-600 to-indigo-600",
  "from-violet-500 to-indigo-500",
  "from-fuchsia-500 to-violet-500",
  "from-sky-500 to-indigo-500",
  "from-cyan-500 to-sky-500",
  "from-emerald-500 to-teal-500",
];

export default function JourneyFunnelInput({
  value,
  onChange,
  fields,
  hasError,
  minRows = 3,
}: {
  value: RepeaterValue;
  onChange: (value: RepeaterValue) => void;
  fields: RepeaterFieldConfig[];
  hasError?: boolean;
  minRows?: number;
}) {
  const titleField = fields[0];
  const descriptionField = fields[1];

  if (!titleField || !descriptionField) {
    return null;
  }

  function updateRow(index: number, key: string, next: string) {
    onChange({
      rows: value.rows.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [key]: next } : row,
      ),
    });
  }

  function addRow() {
    onChange({
      rows: [...value.rows, createEmptyRepeaterRow(fields)],
    });
  }

  function removeRow(index: number) {
    if (value.rows.length <= minRows) {
      return;
    }
    onChange({
      rows: value.rows.filter((_, rowIndex) => rowIndex !== index),
    });
  }

  return (
    <div
      className={cn(
        "grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]",
        hasError && "rounded-2xl border border-destructive p-3",
      )}
    >
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">
            مراحل آشنایی تا خرید مشتری را وارد کنید.
          </p>
        </div>

        {value.rows.map((row, index) => {
          const isRequired = index < minRows;
          return (
            <div
              key={`journey-row-${index}`}
              className="rounded-2xl border border-input bg-white p-4 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {index + 1}
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    مرحله {index + 1} {isRequired ? "(اجباری)" : "(اختیاری)"}
                  </p>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeRow(index)}
                  disabled={value.rows.length <= minRows}
                  aria-label={`حذف مرحله ${index + 1}`}
                >
                  <Minus className="size-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor={`journey-title-${index}`}>
                    {titleField.label ?? "عنوان مرحله"}
                  </Label>
                  <Input
                    id={`journey-title-${index}`}
                    value={row[titleField.key] ?? ""}
                    onChange={(event) =>
                      updateRow(index, titleField.key, event.target.value)
                    }
                    placeholder={titleField.placeholder ?? "مثلاً آشنایی"}
                    aria-invalid={hasError}
                    className={cn("h-11 bg-white text-base", hasError && "border-destructive")}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor={`journey-description-${index}`}>
                    {descriptionField.label ?? "توضیح مرحله"}
                  </Label>
                  <Textarea
                    id={`journey-description-${index}`}
                    value={row[descriptionField.key] ?? ""}
                    onChange={(event) =>
                      updateRow(index, descriptionField.key, event.target.value)
                    }
                    placeholder={
                      descriptionField.placeholder ?? "مثلاً آشنایی با محصول از طریق سرچ گوگل"
                    }
                    rows={2}
                    aria-invalid={hasError}
                    className={cn(
                      "min-h-24 resize-y bg-white text-base",
                      hasError && "border-destructive",
                    )}
                  />
                </div>
              </div>
            </div>
          );
        })}

        <Button
          type="button"
          variant="outline"
          className="h-11 w-full rounded-2xl border-dashed text-sm font-semibold"
          onClick={addRow}
        >
          <Plus className="size-4" />
          افزودن مرحله
        </Button>

        <p className="text-sm text-muted-foreground">
          حداقل باید {minRows} مرحله با عنوان و توضیح کامل وارد کنید.
        </p>
      </div>

      <div className="rounded-3xl border border-input bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-center text-lg font-semibold text-foreground">
          پیش نمایش مسیر خرید
        </h3>

        <div className="space-y-3">
          {value.rows.map((row, index) => {
            const Icon = previewIcons[index % previewIcons.length];
            const gradient = previewGradients[index % previewGradients.length];
            const width = Math.max(100 - index * 8, 56);
            const title = row[titleField.key]?.trim() || `مرحله ${index + 1}`;
            const description =
              row[descriptionField.key]?.trim() || "توضیح این مرحله هنوز وارد نشده است";

            return (
              <div
                key={`journey-preview-${index}`}
                className={cn(
                  "mx-auto flex min-h-28 items-center gap-4 rounded-2xl bg-linear-to-l px-5 py-4 text-white shadow-lg",
                  gradient,
                )}
                style={{
                  width: `${width}%`,
                  clipPath: "polygon(3% 0%, 97% 0%, 91% 100%, 9% 100%)",
                }}
              >
                <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-white/95 text-indigo-700 shadow-sm">
                  <Icon className="size-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-lg font-semibold">
                    {index + 1}. {title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-white/90">
                    {description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
