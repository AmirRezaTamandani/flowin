import { brandFormSurvey } from "./brandForm";
import { campaignFormSurvey } from "./campaignForm";
import { emailFormSurvey } from "./emailForm";
import { smsFormSurvey } from "./smsForm";
import { pushFormSurvey } from "./pushForm";
import { seoFormSurvey } from "./seoForm";
import { socialCompetitorFormSurvey } from "./socialCompetitorForm";
import { socialStrategyFormSurvey } from "./socialStrategyForm";

export type ShowIfCondition = {
  parentQuestion: string;
  equals?: string;
  includes?: string;
};

export type SurveyStep = {
  id: number;
  page?: number;
  question: string;
  type: "text" | "textarea" | "radio" | "select" | "checkbox" | "brandVisualIdentity" | "personaFields" | "percentageAllocation" | "shamsiDate" | "namedShamsiDates" | "number" | "url";
  placeholder?: string;
  options?: string[];
  /** Suffix shown beside numeric input, e.g. "%" */
  numberSuffix?: string;
  numberMin?: number;
  numberMax?: number;
  numberAllowDecimal?: boolean;
  /** Shamsi calendar mode for `shamsiDate` steps. Defaults to `date`. */
  shamsiPickerMode?: "year" | "date";
  /** Checkbox option that reveals a free-text input when selected. */
  otherOption?: string;
  otherPlaceholder?: string;
  /** Checkbox option that reveals nested checkbox options when selected. */
  checkboxSubOptions?: {
    parentOption: string;
    label?: string;
    options: string[];
  };
  /** Dynamic checkbox options based on a parent step answer. */
  optionsFromParent?: {
    parentQuestion: string;
    optionMap: Record<string, string[]>;
  };
  /** When true, the user may leave this answer empty. Defaults to false (required). */
  isAllowedEmpty?: boolean;
  showIf?: ShowIfCondition;
};

export type SurveyConfig = {
  id: string;
  label: string;
  title: string;
  description: string;
  pageCount?: number;
  pageLabels?: string[];
  steps: SurveyStep[];
};

export const surveyMap: Record<string, SurveyConfig> = {
  branding: brandFormSurvey,
  campaign: campaignFormSurvey,
  email: emailFormSurvey,
  sms: smsFormSurvey,
  push: pushFormSurvey,
  seo: seoFormSurvey,
  "social-competitor": socialCompetitorFormSurvey,
  "social-strategy": socialStrategyFormSurvey,
};

export type NavItem = {
  id: string;
  label: string;
  children?: { id: string; label: string }[];
};

export const navItems: NavItem[] = [
  { id: "branding", label: "افزودن اطلاعات برند" },
  { id: "campaign", label: "فرم کمپین" },
  { id: "email", label: "فرم ایمیل" },
  { id: "sms", label: "فرم پیامک" },
  { id: "push", label: "فرم پوش" },
  { id: "seo", label: "فرم سئو" },
  { id: "social-competitor", label: "تحلیل رقبای سوشال" },
  { id: "social-strategy", label: "استراتژی و کلندر سوشال" },
];
