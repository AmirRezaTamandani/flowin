"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import FieldErrorMessage from "./FieldErrorMessage";

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, index) =>
  String(index).padStart(2, "0"),
);

const MINUTE_OPTIONS = Array.from({ length: 12 }, (_, index) =>
  String(index * 5).padStart(2, "0"),
);

function parseTimeValue(value: string): { hours: string; minutes: string } {
  const match = value.trim().match(/^([01]\d|2[0-3]):([0-5]\d)$/);
  if (!match) return { hours: "", minutes: "" };
  return { hours: match[1], minutes: match[2] };
}

function formatTimeValue(hours: string, minutes: string): string {
  if (!hours || !minutes) return "";
  return `${hours}:${minutes}`;
}

function TimeGrid({
  options,
  selected,
  onSelect,
}: {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-1 p-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onSelect(option)}
          className={cn(
            "rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted",
            selected === option && "bg-primary/15 font-medium text-foreground",
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

type PanelPosition = {
  top: number;
  left: number;
  width: number;
};

export default function TimePickerInput({
  id,
  value,
  onChange,
  hasError,
  errorMessage,
  className,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  errorMessage?: string;
  className?: string;
}) {
  const listboxId = useId();
  const [openPanel, setOpenPanel] = useState<"hours" | "minutes" | null>(null);
  const [panelPosition, setPanelPosition] = useState<PanelPosition | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const hoursTriggerRef = useRef<HTMLButtonElement>(null);
  const minutesTriggerRef = useRef<HTMLButtonElement>(null);
  const { hours, minutes } = parseTimeValue(value);
  const showError = hasError || Boolean(errorMessage);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (rootRef.current?.contains(target)) return;
      if ((target as HTMLElement).closest?.("[data-time-picker-panel]")) return;
      setOpenPanel(null);
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  useEffect(() => {
    if (!openPanel) {
      setPanelPosition(null);
      return;
    }

    function updatePosition() {
      const trigger =
        openPanel === "hours" ? hoursTriggerRef.current : minutesTriggerRef.current;
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      setPanelPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: Math.max(rect.width, 176),
      });
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [openPanel]);

  function setHours(nextHours: string) {
    onChange(formatTimeValue(nextHours, minutes || "00"));
    setOpenPanel(null);
  }

  function setMinutes(nextMinutes: string) {
    onChange(formatTimeValue(hours || "00", nextMinutes));
    setOpenPanel(null);
  }

  function adjustHours(delta: number) {
    const current = hours ? Number.parseInt(hours, 10) : 0;
    const next = (current + delta + 24) % 24;
    setHours(String(next).padStart(2, "0"));
  }

  function adjustMinutes(delta: number) {
    const current = minutes ? Number.parseInt(minutes, 10) : 0;
    const next = (current + delta * 5 + 60) % 60;
    setMinutes(String(next).padStart(2, "0"));
  }

  function togglePanel(panel: "hours" | "minutes") {
    setOpenPanel((current) => (current === panel ? null : panel));
  }

  const panelNode =
    openPanel && panelPosition
      ? createPortal(
          <div
            data-time-picker-panel
            id={listboxId}
            role="listbox"
            className="fixed z-[100] rounded-xl border border-input bg-popover shadow-lg"
            style={{
              top: panelPosition.top,
              left: panelPosition.left,
              width: panelPosition.width,
            }}
          >
            <TimeGrid
              options={openPanel === "hours" ? HOUR_OPTIONS : MINUTE_OPTIONS}
              selected={openPanel === "hours" ? hours : minutes}
              onSelect={openPanel === "hours" ? setHours : setMinutes}
            />
          </div>,
          document.body,
        )
      : null;

  return (
    <div ref={rootRef} className={cn("min-w-0 w-full", className)} data-time-picker>
      <div
        id={id}
        role="group"
        aria-invalid={showError}
        dir="ltr"
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-xl border border-input bg-white px-2 py-1 shadow-sm",
          showError && "border-destructive",
        )}
      >
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={() => adjustHours(1)}
            aria-label="افزایش ساعت"
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ChevronUp className="size-4" />
          </button>
          <button
            ref={hoursTriggerRef}
            type="button"
            onClick={() => togglePanel("hours")}
            aria-label="انتخاب ساعت"
            aria-expanded={openPanel === "hours"}
            aria-controls={openPanel === "hours" ? listboxId : undefined}
            className={cn(
              "min-w-12 rounded-md px-2 py-1 text-xl font-semibold tabular-nums text-foreground transition-colors hover:bg-muted/70",
              openPanel === "hours" && "bg-muted",
            )}
          >
            {hours || "--"}
          </button>
          <button
            type="button"
            onClick={() => adjustHours(-1)}
            aria-label="کاهش ساعت"
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ChevronDown className="size-4" />
          </button>
        </div>

        <span className="pb-1 text-xl font-semibold text-muted-foreground">:</span>

        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={() => adjustMinutes(1)}
            aria-label="افزایش دقیقه"
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ChevronUp className="size-4" />
          </button>
          <button
            ref={minutesTriggerRef}
            type="button"
            onClick={() => togglePanel("minutes")}
            aria-label="انتخاب دقیقه"
            aria-expanded={openPanel === "minutes"}
            aria-controls={openPanel === "minutes" ? listboxId : undefined}
            className={cn(
              "min-w-12 rounded-md px-2 py-1 text-xl font-semibold tabular-nums text-foreground transition-colors hover:bg-muted/70",
              openPanel === "minutes" && "bg-muted",
            )}
          >
            {minutes || "--"}
          </button>
          <button
            type="button"
            onClick={() => adjustMinutes(-1)}
            aria-label="کاهش دقیقه"
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ChevronDown className="size-4" />
          </button>
        </div>
      </div>
      {panelNode}
      <FieldErrorMessage message={errorMessage} />
    </div>
  );
}
