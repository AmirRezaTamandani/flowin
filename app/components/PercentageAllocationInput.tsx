"use client";

import React from "react";
import { Slider } from "@/components/ui/slider";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  getPercentageAllocationItems,
  getPercentageAllocationMaxForItem,
  getPercentageAllocationTotal,
  setPercentageAllocationItem,
  type PercentageAllocationValue,
} from "../lib/percentageAllocation";

export default function PercentageAllocationInput({
  options = [],
  value,
  onChange,
  hasError,
}: {
  options?: string[];
  value: PercentageAllocationValue;
  onChange: (value: PercentageAllocationValue) => void;
  hasError?: boolean;
}) {
  const items = getPercentageAllocationItems(options);
  const total = getPercentageAllocationTotal(value);
  const remaining = 100 - total;

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-xl border border-input bg-white p-4">
        <Progress value={total} className="gap-2">
          <div className="flex w-full items-center justify-between gap-3 text-sm">
            <ProgressLabel>مجموع تخصیص</ProgressLabel>
            <ProgressValue />
          </div>
        </Progress>
        <p
          className={cn(
            "mt-2 text-xs",
            remaining === 0 ? "text-muted-foreground" : "text-foreground",
          )}
        >
          {remaining > 0
            ? `${remaining}% باقی‌مانده برای تخصیص`
            : "حداکثر ۱۰۰٪ تخصیص داده شده است"}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item) => {
          const itemValue = value[item.id] ?? 0;
          const maxAllowed = getPercentageAllocationMaxForItem(item.id, value);

          return (
            <div
              key={item.id}
              className={cn(
                "rounded-xl border border-input bg-white p-4",
                hasError && itemValue === 0 && total === 0 && "border-destructive/50",
              )}
            >
              <div className="mb-1 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{item.label}</p>
                  {item.description ? (
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {item.description}
                    </p>
                  ) : null}
                </div>
                <span className="shrink-0 text-sm font-medium tabular-nums text-foreground">
                  {itemValue}%
                </span>
              </div>

              <div className="mt-3 space-y-3" dir="ltr">
                <Progress value={itemValue} aria-hidden="true" />
                <Slider
                  value={[itemValue]}
                  min={0}
                  max={maxAllowed}
                  step={1}
                  onValueChange={(next) => {
                    const amount = Array.isArray(next) ? next[0] : next;
                    onChange(
                      setPercentageAllocationItem(item.id, amount ?? 0, value),
                    );
                  }}
                  aria-label={item.label}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
