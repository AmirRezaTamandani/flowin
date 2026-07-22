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
  social_strategy: "social-strategy",
  social_competitor_analyse: "social-competitor",
};

export function resolveSurveySlug(slug: string): SurveyConfig | null {
  const surveyId = SLUG_ALIASES[slug];
  if (!surveyId) return null;
  return surveyMap[surveyId] ?? null;
}

export function isKnownFormSlug(slug: string): boolean {
  return slug in SLUG_ALIASES;
}
