import type { SurveyConfig } from "./surveys";

import { SOCIAL_PLATFORM_OPTIONS } from "./socialPlatforms";

const SOCIAL_COMPETITOR_ANALYZE_GOAL_OPTIONS = [
  "پیدا کردن ایده محتوا",

  "شناسایی نقاط ضعف رقبا",

  "پیدا کردن فرصت‌های تمایز در محتوا",

  "پیدا کردن ترندهای صنعت",

  "مقایسه جایگاه برند با رقبا",

  "پیدا کردن الگوی فعالیت مناسب برند",
] as const;

const COMPETITORS_SOCIAL_LACKS_OPTIONS = [
  "پاسخگویی ضعیف به کامنت‌ها و دایرکت‌ها",

  "تعامل پایین با مخاطبان",

  "انتشار نامنظم محتوا",

  "محتوای تکراری یا کم‌خلاقیت",

  "کیفیت پایین طراحی و هویت بصری",

  "کیفیت پایین تولید ویدئو",

  "محتوای بیش از حد تبلیغاتی",

  "کمبود محتوای آموزشی",

  "معرفی ضعیف محصولات یا خدمات",

  "اعتمادسازی ضعیف و کمبود اثبات اجتماعی",

  "استفاده نکردن از محتوای تولیدشده توسط کاربران (UGC)",

  "عدم نمایش پشت صحنه، فرهنگ سازمانی یا هویت برند",

  "ضعف در تبدیل مخاطب به مشتری",

  "عدم حضور مؤثر در برخی شبکه‌های اجتماعی",

  "نمی‌دانم / نیاز به بررسی شما دارم",
] as const;

const COMPETITORS_SOCIAL_FEEDBACK_OPTIONS = [
  "فقط بازخورد مثبت دیده یا شنیده‌ام",

  "فقط بازخورد منفی دیده یا شنیده‌ام",

  "هم بازخورد مثبت و هم منفی دیده یا شنیده‌ام",

  "خیر / اطلاعی ندارم",
] as const;

const COMPETITORS_ENGAGEMENT_OPTIONS = [
  "خیلی ضعیف",

  "ضعیف",

  "متوسط",

  "خوب",

  "خیلی خوب",

  "اطلاعی ندارم",
] as const;

const FEEDBACK_QUESTION =
  "آیا بازخورد مثبت یا منفی مشخصی از مخاطبان درباره صفحات یا محتوای رقبا دیده یا شنیده‌اید؟";

const FEEDBACK_SAMPLE_QUESTION =
  "لطفاً چند نمونه از این بازخوردها را ذکر کنید.";

const SOCIAL_PAGE_REPEATER_FIELDS = [
  {
    key: "platform",

    type: "select" as const,

    placeholder: "پلتفرم",

    options: [...SOCIAL_PLATFORM_OPTIONS],
  },

  {
    key: "url",

    type: "url" as const,

    placeholder: "لینک صفحه",
  },
];

export const socialCompetitorFormSurvey: SurveyConfig = {
  id: "social-competitor",

  label: "تحلیل رقبای سوشال",

  title: "تحلیل رقبای شبکه‌های اجتماعی",

  description: "",

  steps: [
    {
      id: 1,

      question: "با چه هدفی می‌خواهید تحلیل رقبای شبکه‌های اجتماعی انجام دهید؟",

      type: "checkbox",

      options: [...SOCIAL_COMPETITOR_ANALYZE_GOAL_OPTIONS],
    },

    {
      id: 2,

      question:
        "لینک صفحات رسمی و فعال برند خود در شبکه‌های اجتماعی را وارد کنید.",

      type: "repeater",

      repeaterFields: SOCIAL_PAGE_REPEATER_FIELDS,
    },

    {
      id: 3,

      question:
        "مهم‌ترین رقبای شما در شبکه‌های اجتماعی به ترتیب کدام برندها هستند؟ حداقل ۲ و حداکثر ۱۰ مورد وارد کنید و برای هر رقیب، لینک صفحات فعال او را بنویسید.",

      type: "nestedRepeater",

      nestedRepeaterConfig: {
        minRows: 2,

        maxRows: 10,

        minNestedPerRow: 1,

        nestedKey: "pages",

        nestedAddLabel: "افزودن صفحه اجتماعی",

        fields: [
          {
            key: "name",

            type: "text",

            label: "نام رقیب",

            placeholder: "نام رقیب",
          },

          {
            key: "priority",

            type: "number",

            label: "اولویت",

            placeholder: "۱ تا ۱۰",

            numberMin: 1,

            numberMax: 10,
          },
        ],

        nestedFields: SOCIAL_PAGE_REPEATER_FIELDS,
      },
    },

    {
      id: 4,

      question:
        "آیا صفحه یا صفحاتی، چه رقیب و چه برند غیررقیب، وجود دارد که سبک محتوایی آن‌ها را برای برند خود می‌پسندید؟ اگر بله، نام و لینک صفحه را وارد کنید.",

      type: "repeater",
      repeaterFields: [
        { key: "name", type: "text", placeholder: "نام برند یا صفحه" },
        { key: "platform", type: "text", placeholder: "پلتفرم" },
        { key: "url", type: "url", placeholder: "لینک" },
        {
          key: "reason",
          type: "text",
          placeholder:
            "چه چیزی را می‌پسندید (طراحی، لحن، ویدئوها، تعامل، نظم انتشار، ایده‌های محتوا)",
        },
      ],

      placeholder:
        "هر صفحه در یک خط:\nنام برند یا صفحه | پلتفرم | لینک | چه چیزی را می‌پسندید (طراحی، لحن، ویدئوها، تعامل، نظم انتشار، ایده‌های محتوا)\nمثال:\nبرند نمونه | اینستاگرام | https://instagram.com/sample | لحن صمیمی و ویدئوهای آموزشی",

      isAllowedEmpty: true,
    },

    {
      id: 5,

      question:
        "به نظر شما رقبا در شبکه‌های اجتماعی چه ضعف‌ها یا فرصت‌های استفاده‌نشده‌ای دارند که برند شما می‌تواند از آن‌ها برای تمایز استفاده کند؟",

      type: "checkbox",

      options: [...COMPETITORS_SOCIAL_LACKS_OPTIONS],
    },

    {
      id: 6,

      question: FEEDBACK_QUESTION,

      type: "radio",

      options: [...COMPETITORS_SOCIAL_FEEDBACK_OPTIONS],
    },

    {
      id: 7,

      question: FEEDBACK_SAMPLE_QUESTION,

      type: "textarea",

      placeholder: "نمونه بازخوردهای مثبت را بنویسید",

      isAllowedEmpty: true,

      showIf: {
        parentQuestion: FEEDBACK_QUESTION,

        equals: "فقط بازخورد مثبت دیده یا شنیده‌ام",
      },
    },

    {
      id: 8,

      question: FEEDBACK_SAMPLE_QUESTION,

      type: "textarea",

      placeholder: "نمونه بازخوردهای منفی را بنویسید",

      isAllowedEmpty: true,

      showIf: {
        parentQuestion: FEEDBACK_QUESTION,

        equals: "فقط بازخورد منفی دیده یا شنیده‌ام",
      },
    },

    {
      id: 9,

      question: FEEDBACK_SAMPLE_QUESTION,

      type: "textarea",

      placeholder: "نمونه بازخوردهای مثبت و منفی را بنویسید",

      isAllowedEmpty: true,

      showIf: {
        parentQuestion: FEEDBACK_QUESTION,

        equals: "هم بازخورد مثبت و هم منفی دیده یا شنیده‌ام",
      },
    },

    {
      id: 10,

      question:
        "در مجموع، تعامل رقبای اصلی با مخاطبان را چگونه ارزیابی می‌کنید؟",

      type: "radio",

      options: [...COMPETITORS_ENGAGEMENT_OPTIONS],
    },
  ],
};
