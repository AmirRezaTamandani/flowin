import type { CheckboxSubOptionsConfig } from "./checkboxWithSubOptions";

export const CAMPAIGN_CHANNEL_PARENT_OPTIONS = [
  "Social & Content",
  "Paid Ads",
  "Direct Marketing",
  "Influencer / PR / Partnership",
  "Marketplace / Classified / Local",
  "Audio / Webinar",
  "Offline / OOH",
] as const;

export const CAMPAIGN_CHANNEL_SUB_OPTIONS: CheckboxSubOptionsConfig[] = [
  {
    parentOption: "Social & Content",
    options: [
      "اینستاگرام",
      "تلگرام",
      "لینکدین",
      "یوتیوب",
      "آپارات",
      "نماشا",
      "تیک‌تاک",
      "ایکس",
      "فیسبوک",
      "پینترست",
      "روبیکا",
      "بله",
      "ایتا",
      "سروش پلاس",
      "فیلیمو",
      "نماوا",
    ],
  },
  {
    parentOption: "Paid Ads",
    options: [
      "گوگل ادز",
      "گوگل دیسپلی",
      "یکتانت",
      "تپسل",
      "دیما",
      "کافه بازار ادز",
      "اسنپ اد",
      "تپسی اد",
      "دیجی کالا ادز",
      "دیوار ادز",
      "Amazon Ads",
      "eBay Ads",
      "تبلیغات بنری در سایت‌ها",
    ],
  },
  {
    parentOption: "Direct Marketing",
    options: ["ایمیل", "پیامک", "نوتیف اپ", "پوش نوتیف وب"],
  },
  {
    parentOption: "Influencer / PR / Partnership",
    options: [
      "اینفلوئنسر مارکتینگ",
      "سفیر برند",
      "اسپانسرینگ",
      "رپورتاژ",
      "افیلیت مارکتینگ",
    ],
  },
  {
    parentOption: "Marketplace / Classified / Local",
    options: ["ترب", "اسنپ مارکت", "باما", "شیپور", "نقشه نشان", "نقشه بلد"],
  },
  {
    parentOption: "Audio / Webinar",
    options: ["اسپاتیفای", "اپل پادکست", "ایسمینار", "اسکای روم"],
  },
  {
    parentOption: "Offline / OOH",
    options: [
      "بیلبورد",
      "تلویزیون",
      "رادیو",
      "مترو و اتوبوس",
      "تبلیغات روی لباس یا وسایل نقلیه",
      "نمایشگاه‌ها و رویدادها",
      "سایر تبلیغات محیطی",
    ],
  },
];
