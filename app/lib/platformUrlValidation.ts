import { INVALID_WEBSITE_URL_MESSAGE, isValidWebsiteUrl, normalizeWebsiteUrl } from "./urlValidation";

export type PlatformPatternKey =
  | "rubika"
  | "linkedin"
  | "instagram"
  | "telegram"
  | "aparat"
  | "reddit"
  | "facebook"
  | "youtube"
  | "tiktok"
  | "whatsapp"
  | "x"
  | "pinterest"
  | "discord"
  | "twitch"
  | "threads"
  | "bale"
  | "eitaa"
  | "soroushplus";

export const PLATFORM_URL_PATTERNS: Record<
  PlatformPatternKey,
  { regex: RegExp; example: string }
> = {
  rubika: {
    regex: /^https?:\/\/(www\.)?rubika\.ir\/.+/i,
    example: "https://rubika.ir/username",
  },
  linkedin: {
    regex: /^https?:\/\/(www\.)?linkedin\.com\/(in|company|pub)\/.+/i,
    example: "https://linkedin.com/in/username",
  },
  instagram: {
    regex: /^https?:\/\/(www\.)?instagram\.com\/.+/i,
    example: "https://instagram.com/username",
  },
  telegram: {
    regex: /^https?:\/\/(t\.me|telegram\.me|web\.telegram\.org)\/.+/i,
    example: "https://t.me/username",
  },
  aparat: {
    regex: /^https?:\/\/(www\.)?aparat\.com\/.+/i,
    example: "https://www.aparat.com/username",
  },
  reddit: {
    regex: /^https?:\/\/(www\.)?reddit\.com\/.+/i,
    example: "https://reddit.com/user/username",
  },
  facebook: {
    regex: /^https?:\/\/(www\.|m\.)?facebook\.com\/.+/i,
    example: "https://facebook.com/username",
  },
  youtube: {
    regex: /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/i,
    example: "https://youtube.com/@channel",
  },
  tiktok: {
    regex: /^https?:\/\/((www\.)?tiktok\.com|vm\.tiktok\.com)\/.+/i,
    example: "https://tiktok.com/@username",
  },
  whatsapp: {
    regex:
      /^https?:\/\/(wa\.me|chat\.whatsapp\.com|api\.whatsapp\.com|(www\.)?whatsapp\.com)\/.+/i,
    example: "https://wa.me/989123456789",
  },
  x: {
    regex: /^https?:\/\/(www\.)?(x\.com|twitter\.com)\/.+/i,
    example: "https://x.com/username",
  },
  pinterest: {
    regex: /^https?:\/\/(www\.)?pinterest\.com\/.+/i,
    example: "https://pinterest.com/username",
  },
  discord: {
    regex: /^https?:\/\/(discord\.gg|(www\.)?discord\.com)\/.+/i,
    example: "https://discord.gg/invite",
  },
  twitch: {
    regex: /^https?:\/\/(www\.)?twitch\.tv\/.+/i,
    example: "https://twitch.tv/username",
  },
  threads: {
    regex: /^https?:\/\/(www\.)?threads\.net\/.+/i,
    example: "https://threads.net/@username",
  },
  bale: {
    regex: /^https?:\/\/(ble\.ir|bale\.ai)\/.+/i,
    example: "https://ble.ir/username",
  },
  eitaa: {
    regex: /^https?:\/\/(web\.)?eitaa\.com\/.+/i,
    example: "https://eitaa.com/username",
  },
  soroushplus: {
    regex: /^https?:\/\/((www\.)?splus\.ir|profile\.splus\.ir|soroushplus\.com)\/.+/i,
    example: "https://splus.ir/username",
  },
};

const PLATFORM_LABEL_TO_KEY: Record<string, PlatformPatternKey> = {
  روبیکا: "rubika",
  rubika: "rubika",
  لینکدین: "linkedin",
  linkedin: "linkedin",
  اینستاگرام: "instagram",
  instagram: "instagram",
  تلگرام: "telegram",
  telegram: "telegram",
  آپارات: "aparat",
  aparat: "aparat",
  ردیت: "reddit",
  reddit: "reddit",
  فیسبوک: "facebook",
  facebook: "facebook",
  یوتیوب: "youtube",
  youtube: "youtube",
  "تیک‌تاک": "tiktok",
  tiktok: "tiktok",
  واتساپ: "whatsapp",
  whatsapp: "whatsapp",
  "ایکس (توئیتر)": "x",
  ایکس: "x",
  توئیتر: "x",
  twitter: "x",
  x: "x",
  پینترست: "pinterest",
  pinterest: "pinterest",
  دیسکورد: "discord",
  discord: "discord",
  توئیچ: "twitch",
  twitch: "twitch",
  تردز: "threads",
  threads: "threads",
  بله: "bale",
  bale: "bale",
  ایتا: "eitaa",
  eitaa: "eitaa",
  سروش‌پلاس: "soroushplus",
  soroushplus: "soroushplus",
  "سروش پلاس": "soroushplus",
};

export const INVALID_SOCIAL_LINK_MESSAGE =
  "لینک باید آدرس عمومی و معتبر شبکه اجتماعی باشد.";

export const LOCALHOST_URL_MESSAGE =
  "آدرس localhost برای لینک شبکه اجتماعی مجاز نیست.";

export function resolvePlatformPatternKey(platform: string): PlatformPatternKey | null {
  const trimmed = platform.trim();
  if (!trimmed) return null;
  return PLATFORM_LABEL_TO_KEY[trimmed] ?? PLATFORM_LABEL_TO_KEY[trimmed.toLowerCase()] ?? null;
}

export function getPlatformUrlPattern(platform: string) {
  const key = resolvePlatformPatternKey(platform);
  return key ? PLATFORM_URL_PATTERNS[key] : null;
}

function isDevOrLocalUrl(url: string): boolean {
  try {
    const hostname = new URL(normalizeWebsiteUrl(url)).hostname.toLowerCase();
    return (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.endsWith(".local")
    );
  } catch {
    return true;
  }
}

export function isValidPlatformUrl(
  url: string,
  platform?: string,
  options?: { requireSocialLink?: boolean },
): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;

  if (options?.requireSocialLink && isDevOrLocalUrl(trimmed)) {
    return false;
  }

  const platformLabel = platform?.trim() ?? "";
  const pattern = platformLabel ? getPlatformUrlPattern(platformLabel) : null;

  if (pattern) {
    return pattern.regex.test(normalizeWebsiteUrl(trimmed));
  }

  if (options?.requireSocialLink) {
    return isValidWebsiteUrl(trimmed) && !isDevOrLocalUrl(trimmed);
  }

  return isValidWebsiteUrl(trimmed);
}

export function getPlatformUrlValidationMessage(
  url: string,
  platform?: string,
  options?: { requireSocialLink?: boolean },
): string {
  const trimmed = url.trim();
  if (!trimmed) return "";

  if (options?.requireSocialLink && isDevOrLocalUrl(trimmed)) {
    return LOCALHOST_URL_MESSAGE;
  }

  const platformLabel = platform?.trim() ?? "";
  const pattern = platformLabel ? getPlatformUrlPattern(platformLabel) : null;

  if (pattern) {
    if (pattern.regex.test(normalizeWebsiteUrl(trimmed))) return "";
    return `لینک باید متعلق به ${platformLabel} باشد. مثال: ${pattern.example}`;
  }

  if (options?.requireSocialLink) {
    return isValidWebsiteUrl(trimmed) ? "" : INVALID_SOCIAL_LINK_MESSAGE;
  }

  return isValidWebsiteUrl(trimmed) ? "" : INVALID_WEBSITE_URL_MESSAGE;
}
