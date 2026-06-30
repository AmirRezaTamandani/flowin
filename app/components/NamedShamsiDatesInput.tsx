"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import ShamsiDateInput from "./ShamsiDateInput";
import type { NamedShamsiDatesValue } from "../lib/namedShamsiDates";

export default function NamedShamsiDatesInput({
  value,
  onChange,
  hasError,
  namePlaceholder = "نام رویداد یا مناسبت",
  datePlaceholder = "تاریخ را انتخاب کنید",
}: {
  value: NamedShamsiDatesValue;
  onChange: (value: NamedShamsiDatesValue) => void;
  hasError?: boolean;
  namePlaceholder?: string;
  datePlaceholder?: string;
}) {
  function updateEvent(index: number, patch: Partial<NamedShamsiDatesValue["events"][number]>) {
    const events = value.events.map((event, eventIndex) =>
      eventIndex === index ? { ...event, ...patch } : event,
    );
    onChange({ events });
  }

  function addEvent() {
    onChange({ events: [...value.events, { name: "", date: "" }] });
  }

  function removeEvent(index: number) {
    if (value.events.length === 1) {
      onChange({ events: [{ name: "", date: "" }] });
      return;
    }
    onChange({ events: value.events.filter((_, eventIndex) => eventIndex !== index) });
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        hasError && "rounded-xl border border-destructive p-3",
      )}
    >
      {value.events.map((event, index) => (
        <div
          key={`event-${index}`}
          className="rounded-xl border border-input bg-white p-4"
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-foreground">رویداد {index + 1}</p>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => removeEvent(index)}
              aria-label={`حذف رویداد ${index + 1}`}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`event-name-${index}`} className="text-sm text-foreground">
                نام رویداد
              </Label>
              <Input
                id={`event-name-${index}`}
                value={event.name}
                onChange={(changeEvent) => updateEvent(index, { name: changeEvent.target.value })}
                placeholder={namePlaceholder}
                className="h-11 bg-white text-base text-foreground"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm text-foreground">تاریخ</Label>
              <ShamsiDateInput
                value={event.date}
                onChange={(date) => updateEvent(index, { date })}
                placeholder={datePlaceholder}
              />
            </div>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        className="h-10 w-full gap-2"
        onClick={addEvent}
      >
        <Plus className="size-4" />
        افزودن رویداد
      </Button>
    </div>
  );
}
