"use client";

import React, { useRef } from "react";
import { Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { UploadedFile } from "../lib/brandVisualIdentity";
import {
  DEFAULT_TEMPLATE_FILE_ACCEPT,
  type FileUploadValue,
} from "../lib/fileUpload";

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function isImageFile(file: UploadedFile): boolean {
  return file.dataUrl.startsWith("data:image/");
}

export default function FileUploadInput({
  value,
  onChange,
  hasError,
  accept = DEFAULT_TEMPLATE_FILE_ACCEPT,
  uploadHint = "فایل تمپلیت یا نمونه دیزاین (تصویر، PDF، HTML، ZIP و ...)",
  descriptionPlaceholder = "یا لینک / توضیح نمونه مورد تأیید خود را بنویسید",
  maxFiles = 5,
}: {
  value: FileUploadValue;
  onChange: (value: FileUploadValue) => void;
  hasError?: boolean;
  accept?: string;
  uploadHint?: string;
  descriptionPlaceholder?: string;
  maxFiles?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);
    if (!selected.length) return;

    const remaining = maxFiles - value.files.length;
    const toAdd = selected.slice(0, Math.max(remaining, 0));
    if (!toAdd.length) {
      event.target.value = "";
      return;
    }

    const uploaded = await Promise.all(
      toAdd.map(async (file) => ({
        name: file.name,
        dataUrl: await readFileAsDataUrl(file),
      })),
    );

    onChange({ ...value, files: [...value.files, ...uploaded] });
    event.target.value = "";
  }

  function removeFile(index: number) {
    onChange({ ...value, files: value.files.filter((_, i) => i !== index) });
  }

  const canAddMore = value.files.length < maxFiles;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="file-upload-description" className="text-sm font-medium text-foreground">
          لینک یا توضیح
        </Label>
        <Textarea
          id="file-upload-description"
          value={value.description}
          onChange={(event) => onChange({ ...value, description: event.target.value })}
          placeholder={descriptionPlaceholder}
          aria-invalid={hasError}
          className={cn(
            "min-h-24 resize-y text-base text-foreground bg-white",
            hasError && "border-destructive ring-destructive/20",
          )}
        />
      </div>

      <div className="rounded-xl border border-input bg-white p-4">
        <div className="mb-3">
          <p className="text-sm font-semibold text-foreground">بارگذاری فایل</p>
          <p className="mt-1 text-xs text-muted-foreground">{uploadHint}</p>
          {maxFiles > 1 ? (
            <p className="mt-1 text-xs text-muted-foreground">
              حداکثر {maxFiles} فایل ({value.files.length} / {maxFiles})
            </p>
          ) : null}
        </div>

        {value.files.length > 0 ? (
          <ul className="mb-3 flex flex-col gap-2">
            {value.files.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center justify-between gap-3 rounded-lg border border-dashed border-input bg-muted/20 p-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {isImageFile(file) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={file.dataUrl}
                      alt={file.name}
                      className="size-12 shrink-0 rounded-md border border-input bg-white object-contain"
                    />
                  ) : (
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-md border border-input bg-white text-xs text-muted-foreground">
                      فایل
                    </span>
                  )}
                  <span className="truncate text-sm text-foreground">{file.name}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeFile(index)}
                  aria-label={`حذف ${file.name}`}
                >
                  <Trash2 className="size-4" />
                </Button>
              </li>
            ))}
          </ul>
        ) : null}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={maxFiles > 1}
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="outline"
          className="h-10 w-full justify-center gap-2"
          disabled={!canAddMore}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="size-4" />
          {value.files.length ? "افزودن فایل دیگر" : "بارگذاری فایل"}
        </Button>
      </div>
    </div>
  );
}
