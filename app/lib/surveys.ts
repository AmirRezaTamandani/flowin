import type { CheckboxSubOptionsConfig } from "./checkboxWithSubOptions";
import type { NestedRepeaterConfig } from "./nestedRepeater";
import type {
  RepeaterFieldConfig,
  RepeaterSyncFromParentConfig,
} from "./repeater";
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
  /** Show when the parent step has any non-empty answer (radio, select, text, etc.). */
  whenParentAnswered?: boolean;
};

export type SurveyStep = {
  id: number;
  page?: number;
  question: string;
  type:
    | "text"
    | "textarea"
    | "radio"
    | "select"
    | "checkbox"
    | "brandVisualIdentity"
    | "personaFields"
    | "percentageAllocation"
    | "geoLocation"
    | "fileUpload"
    | "repeater"
    | "nestedRepeater"
    | "shamsiDate"
    | "namedShamsiDates"
    | "number"
    | "url";
  /** MIME/extensions for `fileUpload` steps. */
  fileAccept?: string;
  uploadHint?: string;
  /** Max files for `fileUpload` steps. Defaults to 5. */
  maxFiles?: number;
  /** Columns for `repeater` steps. */
  repeaterFields?: RepeaterFieldConfig[];
  /** Alternate UI for repeater steps, e.g. customer journey funnel. */
  repeaterVariant?: "default" | "journeyFunnel";
  /** Minimum complete rows required for repeater validation. */
  repeaterMinRows?: number;
  /** Pre-fill repeater rows from a parent checkbox step. */
  repeaterSyncFromParent?: RepeaterSyncFromParentConfig;
  /** Nested repeater config for competitor + social pages pattern. */
  nestedRepeaterConfig?: NestedRepeaterConfig;
  /** `number` steps: `phone` for mobile numbers, `default` for counts. */
  numberFormat?: "default" | "phone";
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
  /** Checkbox option(s) that reveal nested checkbox options when selected. */
  checkboxSubOptions?: CheckboxSubOptionsConfig | CheckboxSubOptionsConfig[];
  /** Max number of selections for plain `checkbox` steps. */
  checkboxMaxSelections?: number;
  /** Dynamic options for checkbox, radio, or select based on a parent step answer. */
  optionsFromParent?: {
    parentQuestion: string;
    optionMap: Record<string, string[]>;
  };
  /** Build percentage-allocation items from a parent checkbox answer. */
  percentageAllocationSyncFromParent?: {
    parentQuestion: string;
  };
  /** When true, the user may leave this answer empty. Defaults to false (required). */
  isAllowedEmpty?: boolean;
  /** When true, only one location (no numbered header or add-more control). */
  geoLocationSingle?: boolean;
  showIf?: ShowIfCondition;
  /**
   * Backend attribution key for this question (e.g. `brand_name`).
   * When set, submission `answers` use this key instead of `step_{id}`.
   */
  backendKey?: string;
  /**
   * When the user selects this radio option, show a confirm dialog before continuing.
   * After confirm, the stepper advances to the next visible step.
   */
  optionDialog?: {
    option: string;
    message: string;
    confirmLabel?: string;
  };
};

export type SurveyConfig = {
  id: string;
  label: string;
  title: string;
  description: string;
  steps: SurveyStep[];
  /** Product / form SKU for order APIs. Defaults to survey `id` when omitted. */
  orderSku?: string;
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
