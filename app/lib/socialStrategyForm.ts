import type { SurveyConfig } from "./surveys";
import {
  CONTENT_TIME_PERIOD_OPTIONS,
  SOCIAL_PLATFORM_OPTIONS,
} from "./socialPlatforms";

const INTENDED_SOCIAL_PLATFORMS_QUESTION =
  "قصد دارید روی کدام شبکه‌های اجتماعی فعالیت داشته باشید؟";

const INTENDED_SOCIAL_PLATFORMS_OPTIONS = SOCIAL_PLATFORM_OPTIONS;

const PLATFORM_ACTIVITY_STATUS_OPTIONS = [
  "فعال و منظم",
  "فعال ولی نامنظم",
  "قبلاً فعال بوده‌ایم",
  "تازه می‌خواهیم شروع کنیم",
  "حساب کاربری داریم ولی تا‌کنون فعالیت مؤثری نداشته‌ایم",
  "این پلتفرم در حال حاضر در اولویت ما نیست",
] as const;

const SOCIAL_MEDIA_GOALS_OPTIONS = [
  "آگاهی از برند",
  "مدیریت اعتبار و شهرت برند",
  "تقویت اعتماد به برند",
  "جذب/افزایش مخاطبان",
  "افزایش تعامل با مخاطبان",
  "معرفی محصولات یا خدمات جدید",
  "آموزش و آگاه‌سازی مخاطبان",
  "جذب لید",
  "ایجاد/افزایش فروش مستقیم",
  "هدایت ترافیک به سایت",
  "خدمات پس از فروش و پشتیبانی مشتریان",
  "حفظ مشتریان فعال / افزایش وفاداری مشتریان",
] as const;

const SOCIAL_MEDIA_CHALLENGES_OPTIONS = [
  "ایده‌پردازی محتوا",
  "طراحی و اجرا",
  "تولید محتوای ویدئویی",
  "افزایش دیده‌شدن محتوا (Reach)",
  "انتشار منظم",
  "مدیریت چند پلتفرم",
  "افزایش تعامل",
  "افزایش فالوئر",
  "تبدیل مخاطب به مشتری",
  "دریافت دایرکت",
  "فروش از طریق محتوا",
  "تحلیل عملکرد",
  "کمبود منابع یا زمان",
] as const;

const CONTENT_CALENDAR_OCCASIONS_OPTIONS = [
  "مناسبت‌های ایرانی",
  "مناسبت‌های اسلامی",
  "مناسبت‌های بین‌المللی",
  "مناسبت‌های صنعتی/تخصصی صنعت",
] as const;

const PREFERRED_CONTENT_TONE_OPTIONS = [
  "رسمی",
  "دوستانه",
  "حرفه‌ای",
  "صمیمی",
  "آموزشی",
  "الهام‌بخش",
  "طنزآمیز",
  "جسورانه",
  "مینیمال",
  "لوکس",
] as const;

const DESIRED_BRAND_PERCEPTION_OPTIONS = [
  "قابل اعتماد",
  "حرفه‌ای",
  "نوآور",
  "اقتصادی",
  "لوکس",
  "صمیمی",
  "متخصص",
  "خلاق",
  "سرگرم‌کننده",
  "پیشرو",
] as const;

const CONTENT_ASSETS_OPTIONS = [
  "تیم داخلی تولید محتوا",
  "طراح گرافیک",
  "عکاس",
  "فیلمبردار",
  "استودیو",
  "آرشیو عکس",
  "آرشیو ویدئو",
  "برندبوک",
  "راهنمای هویت برند",
  "ابزار طراحی و ویرایش آنلاین",
] as const;

const CONTENT_PROCESS_ROLE_OPTIONS = [
  "تولید محتوا",
  "تأیید محتوا",
  "تأمین ایده / اطلاعات تخصصی محتوا",
  "بازبینی حقوقی",
  "مدیریت برند",
  "انتشار محتوا",
  "تحلیل و گزارش‌گیری",
] as const;

const WEEKDAY_OPTIONS = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
] as const;

const CONTENT_TYPE_POST_PLATFORMS = [
  "اینستاگرام",
  "فیسبوک",
  "یوتیوب",
  "واتساپ",
  "تلگرام",
  "تیک‌تاک",
  "ایکس (توئیتر)",
  "لینکدین",
  "پینترست",
  "دیسکورد",
  "تردز",
  "روبیکا",
  "بله",
  "ایتا",
  "سروش‌پلاس",
  "آپارات",
  "ردیت",
] as const;

const CONTENT_TYPE_STORY_PLATFORMS = [
  "اینستاگرام",
  "فیسبوک",
  "تلگرام",
  "روبیکا",
  "بله",
  "ایتا",
  "سروش‌پلاس",
] as const;

const CONTENT_TYPE_STATUS_PLATFORMS = ["واتساپ"] as const;

const CONTENT_TYPE_LIVE_PLATFORMS = [
  "اینستاگرام",
  "فیسبوک",
  "یوتیوب",
  "تلگرام",
  "تیک‌تاک",
  "ایکس (توئیتر)",
  "لینکدین",
  "دیسکورد",
  "توئیچ",
  "روبیکا",
  "آپارات",
] as const;

export const socialStrategyFormSurvey: SurveyConfig = {
  id: "social-strategy",
  label: "استراتژی و کلندر سوشال",
  title: "استراتژی و تقویم محتوای شبکه‌های اجتماعی",
  description: "",
  steps: [
    {
      id: 1,
      question: INTENDED_SOCIAL_PLATFORMS_QUESTION,
      type: "checkbox",
      options: [...INTENDED_SOCIAL_PLATFORMS_OPTIONS],
    },
    {
      id: 2,
      question: "درصد اهمیت و اولویت شبکه‌های اجتماعی مد نظرتان را مشخص کنید.",
      type: "percentageAllocation",
      percentageAllocationSyncFromParent: {
        parentQuestion: INTENDED_SOCIAL_PLATFORMS_QUESTION,
      },
    },
    {
      id: 3,
      question: "برای هر پلتفرم، وضعیت فعلی فعالیت شما چگونه است؟",
      type: "repeater",
      repeaterFields: [
        {
          key: "platform",
          type: "text",
          label: "پلتفرم",
          readOnly: true,
        },
        {
          key: "status",
          type: "select",
          label: "وضعیت",
          placeholder: "انتخاب کنید",
          options: [...PLATFORM_ACTIVITY_STATUS_OPTIONS],
        },
      ],
      repeaterSyncFromParent: {
        parentQuestion: INTENDED_SOCIAL_PLATFORMS_QUESTION,
        platformFieldKey: "platform",
      },
    },
    {
      id: 4,
      question:
        "اهداف اصلی شما از فعالیت در شبکه‌های اجتماعی، به‌ترتیب اهمیت و اولویت، کدام‌اند؟ (حداکثر ۴ گزینه انتخاب کنید)",
      type: "percentageAllocation",
      options: [...SOCIAL_MEDIA_GOALS_OPTIONS],
    },
    {
      id: 5,
      question:
        "محصولات یا خدماتی که می‌خواهید در ماه آینده تمرکز محتوایی بیشتری روی آن‌ها داشته باشیم کدام‌اند؟ لطفاً برای هر مورد، سهم تقریبی آن از محتوای ماه آینده را مشخص کنید. (اگر کسب‌وکار شما چندبرندی یا مارکت‌پلیس است، نام محصول را همراه با جزئیاتی مثل دسته محصول یا برند وارد کنید.)",
      type: "repeater",
      repeaterFields: [
        {
          key: "product",
          type: "text",
          label: "محصول یا خدمت",
          placeholder: "نام محصول یا خدمت",
        },
        {
          key: "percentage",
          type: "number",
          label: "سهم",
          placeholder: "درصد",
          numberMin: 0,
          numberMax: 100,
          numberSuffix: "%",
        },
      ],
    },
    {
      id: 6,
      question:
        "در حال حاضر، بزرگ‌ترین چالش‌های شما در شبکه‌های اجتماعی چیست؟ (از هر نظر، مانند ایده‌پردازی، تولید محتوا، انتشار محتوا، مدیریت شبکه‌ها، تعامل، جذب مخاطب، تبدیل مخاطب به مشتری و ...)",
      type: "checkbox",
      options: [...SOCIAL_MEDIA_CHALLENGES_OPTIONS],
    },
    {
      id: 7,
      question: "اگر لازم می‌دانید، چالش‌های اصلی خود را کمی توضیح دهید.",
      type: "textarea",
      placeholder: "توضیحات تکمیلی درباره چالش‌های انتخاب‌شده",
      isAllowedEmpty: true,
    },
    {
      id: 8,
      question:
        "بر اساس تجربیات قبلی شما، چه الگویی برای انتشار محتوا بهترین نتیجه را داشته است؟",
      type: "repeater",
      isAllowedEmpty: true,
      repeaterFields: [
        {
          key: "platform",
          type: "text",
          label: "پلتفرم",
          readOnly: true,
        },
        {
          key: "contentType",
          type: "select",
          label: "نوع محتوا",
          placeholder: "انتخاب کنید",
          options: [],
          conditionalOptions: {
            dependsOnKey: "platform",
            extraOptions: [
              {
                option: "پست",
                whenDependsOnIncludes: [...CONTENT_TYPE_POST_PLATFORMS],
              },
              {
                option: "استوری",
                whenDependsOnIncludes: [...CONTENT_TYPE_STORY_PLATFORMS],
                insertAfter: "پست",
              },
              {
                option: "استتوس",
                whenDependsOnIncludes: [...CONTENT_TYPE_STATUS_PLATFORMS],
                insertAfter: "پست",
              },
              {
                option: "لایو",
                whenDependsOnIncludes: [...CONTENT_TYPE_LIVE_PLATFORMS],
                insertAfter: "استوری",
              },
            ],
          },
        },

        {
          key: "timePeriod",
          type: "select",
          label: "در چه بازه زمانی؟",
          placeholder: "انتخاب کنید",
          options: [...CONTENT_TIME_PERIOD_OPTIONS],
        },
        {
          key: "count",
          type: "number",
          label: "چه تعداد؟",
          placeholder: "تعداد محتوا",
          numberMin: 0,
        },
      ],
      repeaterSyncFromParent: {
        parentQuestion: INTENDED_SOCIAL_PLATFORMS_QUESTION,
        platformFieldKey: "platform",
      },
    },
    {
      id: 9,
      question:
        "در صورت وجود تجربه قبلی، چه زمان‌هایی بیشترین بازده را برای انتشار محتوا داشته‌اید؟",
      type: "repeater",
      repeaterFields: [
        {
          key: "platform",
          type: "text",
          label: "پلتفرم",
          readOnly: true,
        },
        {
          key: "days",
          type: "multiCheckbox",
          label: "روز هفته",
          options: [...WEEKDAY_OPTIONS],
        },
        {
          key: "startTime",
          type: "time",
          label: "از ساعت",
        },
        {
          key: "endTime",
          type: "time",
          label: "تا ساعت",
        },
      ],
      repeaterSyncFromParent: {
        parentQuestion: INTENDED_SOCIAL_PLATFORMS_QUESTION,
        platformFieldKey: "platform",
      },
      isAllowedEmpty: true,
    },
    {
      id: 10,
      question: "چه نوع مناسبت‌هایی باید در تقویم محتوا پوشش داده شوند؟",
      type: "checkbox",
      options: [...CONTENT_CALENDAR_OCCASIONS_OPTIONS],
    },
    {
      id: 11,
      question: "چه لحن و سبک محتوایی را ترجیح می‌دهید؟",
      checkboxMaxSelections: 3,
      type: "checkbox",
      options: [...PREFERRED_CONTENT_TONE_OPTIONS],
    },
    {
      id: 12,
      question:
        "سه ویژگی اصلی که دوست دارید مخاطبان پس از مشاهده محتوای شما به برندتان نسبت دهند چیست؟ (حداکثر ۳ گزینه)",
      type: "checkbox",
      checkboxMaxSelections: 3,
      options: [...DESIRED_BRAND_PERCEPTION_OPTIONS],
    },
    {
      id: 13,
      question:
        "چه موضوعات یا ستون‌های محتوایی باید حتماً در محتوای شما پوشش داده شوند؟ لطفاً برای هر مورد، سهم آن از محتوای ماه آینده را مشخص کنید. مجموع درصدها باید دقیقاً ۱۰۰٪ باشد.",
      type: "repeater",
      repeaterFields: [
        {
          key: "topic",
          type: "select",
          label: "موضوع یا ستون محتوایی",
          placeholder: "انتخاب کنید",
          options: [
            "معرفی محصولات/خدمات",
            "آموزش",
            "مزیت رقابتی",
            "اخبار و اطلاعیه‌ها",
            "اثبات اجتماعی / رضایت مشتری",
            "محتوای ترند / وایرال / مناسبتی",
            "پشت صحنه",
            "تخفیف و پیشنهاد فروش",
            "مقایسه",
            "پاسخ به سوالات متداول",
            "داستان برند",
            "سرگرمی / تعامل",
          ],
        },
        {
          key: "percentage",
          type: "number",
          label: "سهم",
          placeholder: "درصد",
          numberMin: 0,
          numberMax: 100,
          numberSuffix: "%",
        },
      ],
    },
    {
      id: 14,
      question:
        "لینک حداکثر ۵ نمونه از محتواهایی که فکر می‌کنید در ۳ ماه اخیر عملکرد خوبی داشته‌اند یا شخصاً از نتیجه آن‌ها راضی بوده‌اید را ارسال کنید.",
      type: "repeater",
      repeaterFields: [
        {
          key: "platform",
          type: "select",
          placeholder: "پلتفرم",
          options: [...INTENDED_SOCIAL_PLATFORMS_OPTIONS],
        },
        {
          key: "url",
          type: "url",
          placeholder: "لینک محتوا",
          inputDir: "rtl",
          urlPlatformDependsOnKey: "platform",
        },
        { key: "reason", type: "text", placeholder: "دلیل انتخاب این محتوا" },
      ],

      isAllowedEmpty: true,
    },
    {
      id: 15,
      question: "در حال حاضر چه دارایی‌هایی برای تولید محتوا در اختیار دارید؟",
      type: "checkbox",
      options: [...CONTENT_ASSETS_OPTIONS],
    },
    {
      id: 16,
      question:
        "چه افرادی از سمت مجموعه در تولید یا تأیید محتوا مشارکت خواهند داشت؟",
      type: "repeater",
      repeaterFields: [
        {
          key: "title",
          type: "text",
          label: "سمت",
          placeholder: "مثال: مدیر بازاریابی",
        },
        {
          key: "role",
          type: "select",
          label: "نقش در فرایند محتوا",
          placeholder: "انتخاب کنید",
          options: [...CONTENT_PROCESS_ROLE_OPTIONS],
        },
      ],
    },
  ],
};
