import type { SurveyConfig } from "./surveys";
import {
  CHANNEL_EVENT_TYPE_OPTIONS,
  CHANNEL_TONE_OPTIONS,
  EMAIL_GOAL_OPTIONS,
  MONTHLY_BUDGET_OPTIONS,
} from "./formShared";

export const emailFormSurvey: SurveyConfig = {
  id: "email",
  label: "فرم ایمیل",
  title: "فرم ایمیل",
  description: "",
  steps: [
    {
      id: 1,
      question: "آیا تا بحال ایمیل ارسال کرده‌اید؟",
      type: "radio",
      options: ["بله", "خیر"],
    },
    {
      id: 2,
      question: "تعداد ایمیل‌های ارسال شده خود را وارد کنید.",
      type: "text",
      showIf: {
        parentQuestion: "آیا تا بحال ایمیل ارسال کرده‌اید؟",
        equals: "بله",
      },
    },
    {
      id: 3,
      question: "کدام نوع ایمیل را ارسال کرده‌اید؟",
      type: "checkbox",
      otherOption: "سایر",
      otherPlaceholder: "نوع ایمیل دیگر را بنویسید",
      options: [
        "تراکنشی",
        "اطلاع‌رسانی",
        "خبرنامه",
        "تبلیغاتی",
        "فصلی و تعطیلات",
        "ایمیل‌هایی برای جمع‌آوری لید",
        "ایمیل‌هایی برای بازگرداندن کاربران غیرفعال",
        "نظرسنجی",
        "محتوایی",
        "تولد یا سالگرد",
      ],
      showIf: {
        parentQuestion: "آیا تا بحال ایمیل ارسال کرده‌اید؟",
        equals: "بله",
      },
    },
    {
      id: 4,
      question: "فرکانس ارسال ایمیل شما چقدر است؟",
      type: "checkbox",
      otherOption: "سایر",
      otherPlaceholder: "فرکانس ارسال را بنویسید",
      options: ["هفتگی", "دو بار در هفته", "ماهی یکبار", "هرروز"],
      showIf: {
        parentQuestion: "آیا تا بحال ایمیل ارسال کرده‌اید؟",
        equals: "بله",
      },
    },
    {
      id: 5,
      question: "آیا از بازخورد ایمیل‌ها راضی بوده‌اید؟",
      type: "radio",
      options: ["بله", "خیر"],
      showIf: {
        parentQuestion: "آیا تا بحال ایمیل ارسال کرده‌اید؟",
        equals: "بله",
      },
    },
    {
      id: 6,
      question: "آیا با استفاده از ایمیل، کاربر جدید جذب کرده‌اید؟",
      type: "radio",
      options: ["بله", "خیر"],
      showIf: {
        parentQuestion: "آیا تا بحال ایمیل ارسال کرده‌اید؟",
        equals: "بله",
      },
    },
    {
      id: 7,
      question: "آیا کاربران هنگام ثبت‌نام در سایت شما، مجبور به وارد کردن ایمیل هستند؟",
      type: "radio",
      options: ["بله", "خیر"],
    },
    {
      id: 8,
      question: "برای ثبت‌نام یا ورود کاربر با ایمیل، گزینه استفاده از Gmail را دارید؟",
      type: "radio",
      options: ["بله", "خیر"],
      showIf: {
        parentQuestion:
          "آیا کاربران هنگام ثبت‌نام در سایت شما، مجبور به وارد کردن ایمیل هستند؟",
        equals: "بله",
      },
    },
    {
      id: 9,
      question: "آیا تا به حال با یک برند، به صورت Co-Branding همکاری داشته‌اید؟",
      type: "radio",
      options: ["بله", "خیر"],
    },
    {
      id: 10,
      question: "نام برند را بنویسید.",
      type: "text",
      showIf: {
        parentQuestion: "آیا تا به حال با یک برند، به صورت Co-Branding همکاری داشته‌اید؟",
        equals: "بله",
      },
    },
    {
      id: 11,
      question: "هدف اصلی شما از ارسال ایمیل در مناسبت‌ها و رویدادها چیست؟",
      type: "checkbox",
      options: [...EMAIL_GOAL_OPTIONS],
    },
    {
      id: 12,
      question:
        "برای هر هدف انتخاب‌شده، لینک مدنظر مرتبط با آن هدف را وارد کنید (هر هدف و لینک را در یک خط جداگانه بنویسید).",
      type: "textarea",
      placeholder: "مثال: افزایش فروش | https://example.com/sale",
      isAllowedEmpty: true,
    },
    {
      id: 13,
      question: "در گذشته از کدام پنل‌های ایمیل مارکتینگ استفاده کرده‌اید؟",
      type: "checkbox",
      otherOption: "سایر",
      otherPlaceholder: "نام پنل را بنویسید",
      options: [
        "MailerLite",
        "Mailchimp",
        "HubSpot",
        "نجوا",
        "میلزیلا",
        "آونگ میل",
        "پاکت",
        "ایمیل ایرانی",
        "سرور داخلی",
      ],
    },
    {
      id: 14,
      question: "میانگین هزینه ماهانه شما برای ایمیل مارکتینگ چقدر بوده است؟",
      type: "radio",
      options: [...MONTHLY_BUDGET_OPTIONS],
    },
    {
      id: 15,
      question: "آیا پس از خرید یا تکمیل فرآیند، به مشتری ایمیل تأیید یا تشکر ارسال می‌شود؟",
      type: "radio",
      options: ["بله", "خیر"],
    },
    {
      id: 16,
      question: "آیا به‌صورت منظم خبرنامه (هفتگی/ماهانه) ارسال کرده‌اید؟",
      type: "radio",
      options: ["بله", "خیر"],
    },
    {
      id: 17,
      question: "موضوع یا موضوعات خبرنامه را بنویسید.",
      type: "textarea",
      showIf: {
        parentQuestion: "آیا به‌صورت منظم خبرنامه (هفتگی/ماهانه) ارسال کرده‌اید؟",
        equals: "بله",
      },
    },
    {
      id: 18,
      question: "لحن و سبک محتوایی مدنظر شما برای ارسال چیست؟",
      type: "radio",
      options: [...CHANNEL_TONE_OPTIONS],
    },
    {
      id: 19,
      question: "کدام مناسبت‌های عمومی باید در برنامه‌ریزی و تقویم محتوایی این کانال پوشش داده شوند؟",
      type: "checkbox",
      options: [...CHANNEL_EVENT_TYPE_OPTIONS],
    },
    {
      id: 20,
      question:
        "کدام بخش از ارسال ایمیل را علاقه دارید بهینه کنید؟ (برای هر بخش، دلیل را در خط بعدی بنویسید)",
      type: "textarea",
      placeholder: "مثال:\nموضوع ایمیل\nنیاز به A/B تست بیشتر داریم",
      isAllowedEmpty: true,
    },
    {
      id: 21,
      question:
        "اگر دیزاین یا تمپلیت یکپارچه و خاص در این کانال دارید، لینک یا توضیح نمونه مورد تأیید خود را بنویسید.",
      type: "textarea",
      isAllowedEmpty: true,
    },
  ],
};
