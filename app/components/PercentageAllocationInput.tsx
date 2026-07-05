"use client";

import React from "react";
import { Slider } from "@/components/ui/slider";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
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
      <div className="bg-white p-4 border border-input rounded-xl">
        <Progress value={total} className="gap-2">
          <div className="flex justify-between items-center gap-3 w-full text-sm">
            <ProgressLabel>مجموع تخصیص</ProgressLabel>
            <ProgressValue />
          </div>
        </Progress>
        <p
          className={cn(
            "mt-2 text-xs",
            remaining === 0 ? "text-muted-foreground" : "text-destructive",
          )}
        >
          {remaining > 0
            ? `${remaining}% باقی‌مانده است. مجموع باید دقیقاً %100 شود.`
            : "مجموع درصدها کامل و برابر با %100 است."}
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
                "bg-white p-4 border border-input rounded-xl",
                hasError &&
                  itemValue === 0 &&
                  total === 0 &&
                  "border-destructive/50",
              )}
            >
              <div className="flex justify-between items-start gap-3 mb-1">
                <div className="min-w-0">
                  <p className="font-semibold text-foreground text-sm">
                    {item.label}
                  </p>
                  {item.description ? (
                    <p className="mt-1 text-muted-foreground text-xs leading-5">
                      {item.description}
                    </p>
                  ) : null}
                </div>
                <span className="font-medium tabular-nums text-foreground text-sm shrink-0">
                  {itemValue}%
                </span>
              </div>

              <div className="space-y-3 mt-3" dir="ltr">
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
