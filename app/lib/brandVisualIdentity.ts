export type UploadedFile = {
  name: string;
  dataUrl: string;
};

export type BrandVisualIdentityValue = {
  logo: UploadedFile | null;
  colors: string[];
  font: UploadedFile | null;
};

export const EMPTY_BRAND_VISUAL_IDENTITY: BrandVisualIdentityValue = {
  logo: null,
  colors: [],
  font: null,
};

const HEX_COLOR_PATTERN = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export function normalizeHexColor(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  if (!HEX_COLOR_PATTERN.test(withHash)) return null;

  if (withHash.length === 4) {
    const [, r, g, b] = withHash;
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }

  return withHash.toLowerCase();
}

export function parseBrandVisualIdentityValue(
  value: string | string[] | undefined,
): BrandVisualIdentityValue {
  if (!value || Array.isArray(value)) return { ...EMPTY_BRAND_VISUAL_IDENTITY };
  try {
    const parsed = JSON.parse(value) as Partial<BrandVisualIdentityValue>;
    return {
      logo: parsed.logo ?? null,
      colors: Array.isArray(parsed.colors)
        ? parsed.colors
            .map((color) => (typeof color === "string" ? normalizeHexColor(color) : null))
            .filter((color): color is string => Boolean(color))
        : [],
      font: parsed.font ?? null,
    };
  } catch {
    return { ...EMPTY_BRAND_VISUAL_IDENTITY };
  }
}

export function serializeBrandVisualIdentityValue(value: BrandVisualIdentityValue): string {
  return JSON.stringify(value);
}

export function isBrandVisualIdentityEmpty(value: BrandVisualIdentityValue): boolean {
  return !value.logo && value.colors.length === 0 && !value.font;
}

export function isValidHexColor(value: string): boolean {
  return normalizeHexColor(value) !== null;
}
