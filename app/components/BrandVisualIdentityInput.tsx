"use client";

import React, { useRef, useState } from "react";
import { Pipette, Plus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  type BrandVisualIdentityValue,
  type UploadedFile,
  isValidHexColor,
  normalizeHexColor,
} from "../lib/brandVisualIdentity";

type EyeDropperConstructor = new () => {
  open: () => Promise<{ sRGBHex: string }>;
};

declare global {
  interface Window {
    EyeDropper?: EyeDropperConstructor;
  }
}

const LOGO_ACCEPT = "image/png,image/jpeg,image/webp,image/svg+xml,image/x-icon,.ico";
const FONT_ACCEPT = ".ttf,.otf,.woff,.woff2,font/ttf,font/otf,font/woff,font/woff2";

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function FileUploadField({
  id,
  label,
  hint,
  accept,
  file,
  onChange,
  previewType,
}: {
  id: string;
  label: string;
  hint: string;
  accept: string;
  file: UploadedFile | null;
  onChange: (file: UploadedFile | null) => void;
  previewType: "image" | "file";
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    if (!selected) return;
    const dataUrl = await readFileAsDataUrl(selected);
    onChange({ name: selected.name, dataUrl });
    event.target.value = "";
  }

  return (
    <div className="rounded-xl border border-input bg-white p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <Label htmlFor={id} className="text-sm font-semibold text-foreground">
            {label}
          </Label>
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        </div>
        {file && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onChange(null)}
            aria-label={`حذف ${label}`}
          >
            <Trash2 className="size-4" />
          </Button>
        )}
      </div>

      {file && previewType === "image" ? (
        <div className="mb-3 flex items-center gap-3 rounded-lg border border-dashed border-input bg-muted/20 p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={file.dataUrl}
            alt={file.name}
            className="size-16 rounded-lg border border-input bg-white object-contain"
          />
          <span className="text-sm text-foreground">{file.name}</span>
        </div>
      ) : null}

      {file && previewType === "file" ? (
        <p className="mb-3 rounded-lg border border-dashed border-input bg-muted/20 px-3 py-2 text-sm text-foreground">
          {file.name}
        </p>
      ) : null}

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        type="button"
        variant="outline"
        className="h-10 w-full justify-center gap-2"
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="size-4" />
        {file ? "تغییر فایل" : "بارگذاری فایل"}
      </Button>
    </div>
  );
}

function ColorRow({
  color,
  onChange,
  onRemove,
}: {
  color: string;
  onChange: (color: string) => void;
  onRemove: () => void;
}) {
  const [draft, setDraft] = useState(color);
  const [pickerError, setPickerError] = useState<string | null>(null);
  const normalized = normalizeHexColor(color) ?? "#000000";

  function commitDraft() {
    const next = normalizeHexColor(draft);
    if (!next) {
      setDraft(color);
      return;
    }
    onChange(next);
    setDraft(next);
  }

  async function pickFromScreen() {
    if (!window.EyeDropper) {
      setPickerError("مرورگر شما از قطره‌چکان پشتیبانی نمی‌کند. از Chrome یا Edge استفاده کنید.");
      return;
    }

    try {
      setPickerError(null);
      const dropper = new window.EyeDropper();
      const result = await dropper.open();
      const next = normalizeHexColor(result.sRGBHex);
      if (next) {
        onChange(next);
        setDraft(next);
      }
    } catch {
      // User cancelled the eyedropper.
    }
  }

  return (
    <div className="rounded-xl border border-input bg-white p-3">
      <div className="flex flex-wrap items-center gap-2">
        <div
          className="size-11 shrink-0 rounded-lg border border-input shadow-inner"
          style={{ backgroundColor: normalized }}
          aria-hidden="true"
        />

        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commitDraft}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commitDraft();
            }
          }}
          onPaste={(event) => {
            const pasted = event.clipboardData.getData("text");
            const next = normalizeHexColor(pasted);
            if (!next) return;
            event.preventDefault();
            onChange(next);
            setDraft(next);
          }}
          placeholder="#57d1d1"
          dir="ltr"
          className="h-11 min-w-[120px] flex-1 bg-white font-mono text-sm"
          aria-label="کد رنگ"
        />

        <input
          type="color"
          value={normalized}
          onChange={(event) => {
            const next = normalizeHexColor(event.target.value);
            if (!next) return;
            onChange(next);
            setDraft(next);
          }}
          className="size-11 shrink-0 cursor-pointer rounded-lg border border-input bg-white p-1"
          aria-label="انتخاب رنگ"
        />

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-11 shrink-0"
          onClick={pickFromScreen}
          title="انتخاب رنگ از صفحه"
          aria-label="انتخاب رنگ از صفحه"
        >
          <Pipette className="size-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-11 shrink-0"
          onClick={onRemove}
          aria-label="حذف رنگ"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      {pickerError ? <p className="mt-2 text-xs text-destructive">{pickerError}</p> : null}
      {!isValidHexColor(draft) && draft.trim() ? (
        <p className="mt-2 text-xs text-destructive">فرمت رنگ معتبر نیست. مثال: #57d1d1</p>
      ) : null}
    </div>
  );
}

export default function BrandVisualIdentityInput({
  value,
  onChange,
  hasError,
}: {
  value: BrandVisualIdentityValue;
  onChange: (value: BrandVisualIdentityValue) => void;
  hasError?: boolean;
}) {
  function update(partial: Partial<BrandVisualIdentityValue>) {
    onChange({ ...value, ...partial });
  }

  function addColor() {
    update({ colors: [...value.colors, "#57d1d1"] });
  }

  function updateColor(index: number, color: string) {
    const colors = [...value.colors];
    colors[index] = color;
    update({ colors });
  }

  function removeColor(index: number) {
    update({ colors: value.colors.filter((_, itemIndex) => itemIndex !== index) });
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        hasError && "rounded-xl border border-destructive p-3",
      )}
    >
      <FileUploadField
        id="brand-logo-upload"
        label="لوگو / آیکون"
        hint="PNG، JPG، WEBP، SVG یا ICO"
        accept={LOGO_ACCEPT}
        file={value.logo}
        onChange={(logo) => update({ logo })}
        previewType="image"
      />

      <div className="rounded-xl border border-input bg-white p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-foreground">رنگ‌های برند</p>
            <p className="mt-1 text-xs text-muted-foreground">
              کد رنگ را وارد یا paste کنید، از پالت انتخاب کنید، یا با قطره‌چکان از صفحه بردارید.
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" className="gap-1" onClick={addColor}>
            <Plus className="size-4" />
            افزودن رنگ
          </Button>
        </div>

        {value.colors.length === 0 ? (
          <p className="rounded-lg border border-dashed border-input px-3 py-4 text-center text-sm text-muted-foreground">
            هنوز رنگی اضافه نشده است.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {value.colors.map((color, index) => (
              <ColorRow
                key={`${color}-${index}`}
                color={color}
                onChange={(next) => updateColor(index, next)}
                onRemove={() => removeColor(index)}
              />
            ))}
          </div>
        )}
      </div>

      <FileUploadField
        id="brand-font-upload"
        label="فونت برند"
        hint="TTF، OTF، WOFF یا WOFF2"
        accept={FONT_ACCEPT}
        file={value.font}
        onChange={(font) => update({ font })}
        previewType="file"
      />
    </div>
  );
}
