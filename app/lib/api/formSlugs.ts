import { surveyMap, type SurveyConfig } from "../surveys";
import type { SurveyId } from "./types";

/** URL path segment → survey id (WP uses shorter aliases like brand/social). */
const SLUG_ALIASES: Record<string, SurveyId> = {
  brand: "branding",
  campaign_design: "campaign",
  email_content_calendar: "email",
  sms_content_calendar: "sms",
  push_content_calendar: "push",
  seo: "seo",
  seo_strategy: "seo",
  social_strategy: "social-strategy",
  social_content_strategy: "social-strategy",
  social_content_calendar: "social-strategy",
  social_competitor_analyse: "social-competitor",
};

/** Display name for each order SKU (used in form page headings). */
export const ORDER_SKU_PRODUCT_NAMES: Record<string, string> = {
  social_content_calendar: "تقویم محتوای شبکه‌های اجتماعی",
  social_content_strategy: "استراتژی محتوای شبکه‌های اجتماعی",
  social_competitor_analyse: "تحلیل رقبای شبکه‌های اجتماعی",
  sms_content_calendar: "تقویم محتوای پیامک",
  push_content_calendar: "تقویم محتوای پوش نوتیفیکیشن",
  email_content_calendar: "تقویم محتوای ایمیل",
  campaign_design: "طراحی کمپین",
  seo_strategy: "استراتژی سئو",
};

/** Shared social strategy form can be opened for either of these products. */
const SOCIAL_STRATEGY_ORDER_SKUS = new Set([
  "social_content_strategy",
  "social_content_calendar",
]);

export function getSurveyFormHeading(
  survey: SurveyConfig,
  orderSkuFromUrl?: string | null,
): string {
  if (survey.id === "branding") {
    return "فرم برند را تکمیل کنید.";
  }

  const fromUrl = orderSkuFromUrl?.trim() || "";
  // Prefer the form's own SKU so switching forms (or sticky URL params) can't
  // force every page to show the same product title.
  let orderSku = survey.orderSku || "";

  if (survey.id === "social-strategy" && SOCIAL_STRATEGY_ORDER_SKUS.has(fromUrl)) {
    orderSku = fromUrl;
  } else if (!orderSku && fromUrl) {
    orderSku = fromUrl;
  }

  const productName = ORDER_SKU_PRODUCT_NAMES[orderSku];
  if (productName) {
    return `برای دریافت ${productName} فرم را تکمیل کنید`;
  }

  return survey.label;
}

export function resolveSurveySlug(slug: string): SurveyConfig | null {
  const surveyId = SLUG_ALIASES[slug];
  if (!surveyId) return null;
  return surveyMap[surveyId] ?? null;
}

export function isKnownFormSlug(slug: string): boolean {
  return slug in SLUG_ALIASES;
}
