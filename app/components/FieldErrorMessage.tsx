"use client";

import React from "react";
import { cn } from "@/lib/utils";

export default function FieldErrorMessage({
  message,
  className,
}: {
  message?: string | null;
  className?: string;
}) {
  if (!message) return null;
  return (
    <p className={cn("field-error", className)} role="alert">
      {message}
    </p>
  );
}
