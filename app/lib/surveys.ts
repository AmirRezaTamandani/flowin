import { brandFormSurvey } from "./brandForm";
import { campaignFormSurvey } from "./campaignForm";

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
};

export type NavItem = {
  id: string;
  label: string;
  children?: { id: string; label: string }[];
};

export const navItems: NavItem[] = [
  { id: "branding", label: "افزودن اطلاعات برند" },
  { id: "campaign", label: "فرم کمپین" },
  // {
  //   id: "content",
  //   label: "محتوا",
  //   children: [
  //     { id: "content-blog", label: "بلاگ" },
  //     { id: "content-social", label: "محتوای شبکه اجتماعی" },
  //   ],
  // },
  // {
  //   id: "social",
  //   label: "شبکه‌های اجتماعی",
  //   children: [
  //     { id: "social-instagram", label: "اینستاگرام" },
  //     { id: "social-linkedin", label: "لینکدین" },
  //   ],
  // },
  // {
  //   id: "seo-menu",
  //   label: "سئو",
  //   children: [{ id: "seo", label: "بهینه‌سازی سایت" }],
  // },
  // {
  //   id: "media",
  //   label: "مدیا",
  //   children: [
  //     { id: "media-video", label: "ویدیو" },
  //     { id: "media-photo", label: "عکاسی" },
  //   ],
  // },
  // {
  //   id: "campaign",
  //   label: "کمپین",
  //   children: [{ id: "campaign-ads", label: "تبلیغات" }],
  // },
  // {
  //   id: "notification",
  //   label: "اطلاع‌رسانی",
  //   children: [{ id: "notification-sms", label: "پیامک" }],
  // },
  // {
  //   id: "performance",
  //   label: "پرفورمنس",
  //   children: [{ id: "performance-report", label: "گزارش عملکرد" }],
  // },
  // { id: "orders", label: "سفارش‌های من" },
  // { id: "support", label: "پشتیبانی" },
  // { id: "wallet", label: "کیف پول من" },
  // { id: "profile", label: "اطلاعات حساب کاربری" },
];
