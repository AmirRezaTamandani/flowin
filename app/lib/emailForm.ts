import {
  CHANNEL_EVENT_TYPE_OPTIONS,
  CHANNEL_TONE_OPTIONS,
  MONTHLY_BUDGET_OPTIONS,
} from "./formShared";
import type { SurveyConfig } from "./surveys";

export const emailFormSurvey: SurveyConfig = {
  id: "email",
  label: "فرم ایمیل",
  title: "فرم ایمیل",
  description: "",
  steps: [
    {
      id: 1,
      backendKey: "email_sending_experience",
      question: "آیا تا بحال ایمیل ارسال کرده‌اید؟",
      type: "radio",
      options: ["بله", "خیر"],
      optionDialog: {
        option: "خیر",
        confirmLabel: "تأیید",
        message:
          "اولین قدم را با هم شروع کنیم.\n\nاگر لیست ایمیل ندارید یا تا به حال ایمیل مارکتینگ انجام نداده‌اید، جای نگرانی نیست.\n\nفقط کافیست لینک صفحه‌ای را که می‌خواهید پروموت شود وارد کنید. ما صفحه را تحلیل می‌کنیم، مناسب‌ترین گروه مخاطبان را انتخاب می‌کنیم، برنامه ارسال ایمیل را می‌سازیم و کمپین را برای مرتبط‌ترین مخاطبان آغاز می‌کنیم.\n\nاگر آماده هستید، روی «تأیید» کلیک کنید تا شروع کنیم.",
      },
    },
    {
      id: 2,
      backendKey: "total_emails_sent",
      question: "تعداد ایمیل‌های ارسال شده خود را وارد کنید.",
      type: "number",
      placeholder: "0",
      numberSuffix: "تعداد ایمیل",
      numberMin: 0,
      showIf: {
        parentQuestion: "آیا تا بحال ایمیل ارسال کرده‌اید؟",
        equals: "بله",
      },
    },
    {
      id: 3,
      backendKey: "email_types_used",
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
        "سایر",
      ],
      showIf: {
        parentQuestion: "آیا تا بحال ایمیل ارسال کرده‌اید؟",
        equals: "بله",
      },
    },
    {
      id: 4,
      backendKey: "email_sending_frequency",
      question: "فرکانس ارسال ایمیل شما چقدر است؟",
      type: "radio",
      options: ["هفتگی", "دو بار در هفته", "ماهی یکبار", "هرروز"],
      showIf: {
        parentQuestion: "آیا تا بحال ایمیل ارسال کرده‌اید؟",
        equals: "بله",
      },
    },
    {
      id: 5,
      backendKey: "email_performance_satisfaction",
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
      backendKey: "email_user_acquisition",
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
      backendKey: "email_required_on_signup",
      question:
        "آیا کاربران هنگام ثبت‌نام در سایت شما، مجبور به وارد کردن ایمیل هستند؟",
      type: "radio",
      options: ["بله", "خیر"],
    },
    {
      id: 8,
      backendKey: "has_signup_with_gmail",
      question:
        "برای ثبت‌نام یا ورود کاربر با ایمیل، گزینه استفاده از Gmail را دارید؟",
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
      backendKey: "email_co_branding_experience",
      question:
        "آیا تا به حال با یک برند، به صورت Co-Branding همکاری داشته‌اید؟",
      type: "radio",
      options: ["بله", "خیر"],
    },
    {
      id: 10,
      backendKey: "has_email_co_branding",
      question: "نام برند را بنویسید.",
      type: "text",
      showIf: {
        parentQuestion:
          "آیا تا به حال با یک برند، به صورت Co-Branding همکاری داشته‌اید؟",
        equals: "بله",
      },
    },

    {
      id: 11,
      backendKey: "previous_email_panels",
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
        "سایر",
      ],
      showIf: {
        parentQuestion: "آیا تا بحال ایمیل ارسال کرده‌اید؟",
        equals: "خیر",
      },
    },
    {
      id: 12,
      backendKey: "previous_monthly_email_budget",
      question: "میانگین هزینه ماهانه شما برای ایمیل مارکتینگ چقدر بوده است؟",
      type: "radio",
      options: [...MONTHLY_BUDGET_OPTIONS],
      showIf: {
        parentQuestion: "آیا تا بحال ایمیل ارسال کرده‌اید؟",
        equals: "خیر",
      },
    },
    {
      id: 13,
      backendKey: "sends_email_purchase_confirmation",
      question:
        "آیا پس از خرید یا تکمیل فرآیند، به مشتری ایمیل تأیید یا تشکر ارسال می‌شود؟",
      type: "radio",
      options: ["بله", "خیر"],
    },
    {
      id: 14,
      backendKey: "sends_regular_newsletter",
      question: "آیا به‌صورت منظم خبرنامه (هفتگی/ماهانه) ارسال کرده‌اید؟",
      type: "radio",
      options: ["بله", "خیر"],
    },
    {
      id: 15,
      backendKey: "newsletter_topics",
      question: "موضوع یا موضوعات خبرنامه را بنویسید.",
      type: "textarea",
      showIf: {
        parentQuestion:
          "آیا به‌صورت منظم خبرنامه (هفتگی/ماهانه) ارسال کرده‌اید؟",
        equals: "بله",
      },
    },
    {
      id: 16,
      backendKey: "email_tone",
      question: "لحن و سبک محتوایی مدنظر شما برای ارسال چیست؟",
      type: "radio",
      options: [...CHANNEL_TONE_OPTIONS],
    },
    {
      id: 17,
      backendKey: "email_event_type",
      question:
        "کدام مناسبت‌های عمومی باید در برنامه‌ریزی و تقویم محتوایی این کانال پوشش داده شوند؟",
      type: "checkbox",
      options: [...CHANNEL_EVENT_TYPE_OPTIONS],
    },
    {
      id: 18,
      backendKey: "email_optimization_priority",
      question: "کدام بخش از فرآیند ارسال ایمیل را می‌خواهید بهینه کنید؟",
      type: "textarea",
      placeholder:
        "بعنوان مثال: نرخ باز شدن نوتیفیکیشن (Open Rate)، چون درصد زیادی از نوتیفیکیشن‌ها باز نمی‌شوند.",
      isAllowedEmpty: true,
      showIf: {
        parentQuestion: "آیا تا بحال ایمیل ارسال کرده‌اید؟",
        equals: "خیر",
      },
    },
    {
      id: 19,
      backendKey: "email_template",
      question:
        "اگر دیزاین یا تمپلیت یکپارچه و خاص در این کانال دارید، لینک یا توضیح نمونه مورد تأیید خود را بنویسید.",
      type: "fileUpload",
      isAllowedEmpty: true,
    },
  ],
};
