import type { UploadedFile } from "./brandVisualIdentity";

export type FileUploadValue = {
  description: string;
  files: UploadedFile[];
};

export const EMPTY_FILE_UPLOAD: FileUploadValue = {
  description: "",
  files: [],
};

export const DEFAULT_TEMPLATE_FILE_ACCEPT =
  "image/*,.pdf,.html,.htm,.zip,application/pdf,application/zip";

export function parseFileUploadValue(
  value: string | string[] | undefined,
): FileUploadValue {
  if (!value || Array.isArray(value)) return { ...EMPTY_FILE_UPLOAD };
  try {
    const parsed = JSON.parse(value) as Partial<FileUploadValue>;
    return {
      description: parsed.description ?? "",
      files: Array.isArray(parsed.files) ? parsed.files : [],
    };
  } catch {
    return { description: typeof value === "string" ? value : "", files: [] };
  }
}

export function serializeFileUploadValue(value: FileUploadValue): string {
  return JSON.stringify(value);
}

export function isFileUploadEmpty(value: FileUploadValue): boolean {
  return !value.description.trim() && value.files.length === 0;
}
