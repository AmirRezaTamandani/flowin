import type { SurveyConfig } from "./surveys";
import {
  CHANNEL_EVENT_TYPE_OPTIONS,
  CHANNEL_TONE_OPTIONS,
  MONTHLY_BUDGET_OPTIONS,
} from "./formShared";

export const smsFormSurvey: SurveyConfig = {
  id: "sms",
  label: "فرم پیامک",
  title: "فرم پیامک",
  description: "",
  orderSku: "sms_content_calendar",
  steps: [
    {
      id: 1,
      backendKey: "sms_types_sent",
      question: "تا به حال چه نوع پیامک‌هایی ارسال کرده‌اید؟",
      type: "checkbox",
      options: [
        "انبوه",
        "باشگاه مشتریان",
        "منطقه‌ای (Location based)",
        "تبلیغاتی",
        "OTP",
        "شخصی‌سازی شده",
      ],
    },
    {
      id: 2,
      backendKey: "sms_sending_times",
      question:
        "معمولاً در چه بازه‌های زمانی پیامک ارسال می‌کنید؟ (مثال: صبح ۹ تا ۱۲، بعدازظهر ۱۶ تا ۲۰)",
      type: "textarea",
      placeholder: "بازه‌های زمانی ارسال را بنویسید",
    },
    {
      id: 3,
      backendKey: "previous_sms_panels",
      question: "تا به حال از کدام پنل‌های پیامکی استفاده کرده‌اید؟",
      type: "checkbox",
      otherOption: "سایر",
      otherPlaceholder: "نام پنل را بنویسید",
      options: [
        "مدیانا",
        "ملی پیامک",
        "کاوه نگار",
        "فراز اس ام اس",
        "مدیر پیامک",
        "sms.ir",
        "آتیه پرداز",
        "فرا پیامک",
        "سامانه پیامک ملی",
        "سایر",
      ],
    },
    {
      id: 4,
      backendKey: "dedicated_service_line",
      question:
        "آیا خط خدماتی اختصاصی دارید؟ (منظور از خط خدماتی خطی است که با استفاده از آن برای مشتریان خود پیامک ارسال می‌کنید.)",
      type: "radio",
      options: ["بله", "خیر"],
    },
    {
      id: 5,
      backendKey: "dedicated_service_line_number",
      question: "لطفاً شماره این خط خود را وارد کنید.",
      type: "number",
      numberSuffix: "شماره خط",
      showIf: {
        parentQuestion:
          "آیا خط خدماتی اختصاصی دارید؟ (منظور از خط خدماتی خطی است که با استفاده از آن برای مشتریان خود پیامک ارسال می‌کنید.)",
        equals: "بله",
      },
    },
    {
      id: 6,
      backendKey: "dedicated_transactional_line",
      question:
        "آیا خط خدماتی اختصاصی برای ارسال OTP یا پیامک‌های تراکنشی دارید؟",
      type: "radio",
      options: ["بله", "خیر"],
    },
    {
      id: 7,
      backendKey: "dedicated_transactional_number",
      question: "لطفاً شماره این خط خود را وارد کنید.",
      type: "number",
      numberSuffix: "شماره خط",
      showIf: {
        parentQuestion:
          "آیا خط خدماتی اختصاصی برای ارسال OTP یا پیامک‌های تراکنشی دارید؟",
        equals: "بله",
      },
    },
    {
      id: 8,
      backendKey: "has_dedicated_promotional_line",
      question:
        "آیا خط تبلیغاتی اختصاصی دارید؟ (منظور از خط تبلیغاتی اختصاصی خطی است که با استفاده از آن برای افرادی که مشتریان شما نیستند یا در لیست سیاه قرار دارند، پیامک ارسال می‌کنید.)",
      type: "radio",
      options: ["بله", "خیر"],
    },
    {
      id: 9,
      backendKey: "dedicated_promotional_line_number",
      question: "لطفاً شماره این خط خود را وارد کنید.",
      type: "number",
      numberSuffix: "شماره خط",
      showIf: {
        parentQuestion:
          "آیا خط تبلیغاتی اختصاصی دارید؟ (منظور از خط تبلیغاتی اختصاصی خطی است که با استفاده از آن برای افرادی که مشتریان شما نیستند یا در لیست سیاه قرار دارند، پیامک ارسال می‌کنید.)",
        equals: "بله",
      },
    },
    {
      id: 10,
      question: "لطفاً شماره این خط خود را وارد کنید.",
      type: "number",
      numberSuffix: "شماره خط",
      showIf: {
        parentQuestion:
          "آیا خط تبلیغاتی اختصاصی دارید؟ (منظور از خط تبلیغاتی خطی است که با استفاده از آن برای باشگاه مشتریان یا مشتریان عادی خود پیامک ارسال می‌کنید.)",
        equals: "بله",
      },
    },

    {
      id: 11,
      question: "لطفاً شماره این خط خود را وارد کنید.",
      type: "number",
      numberSuffix: "شماره خط",
      numberMin: 0,
      showIf: {
        parentQuestion:
          "آیا خط تبلیغاتی اختصاصی دارید؟ (منظور از خط تبلیغاتی خطی است که با استفاده از آن برای باشگاه مشتریان یا مشتریان عادی و مشتریانی که در لیست سیاه هستند، پیامک ارسال می‌کنید.)",
        equals: "بله",
      },
    },
    {
      id: 12,
      backendKey: "rfm_analysis",
      question: "آیا تا به حال تحلیل RFM انجام داده‌اید؟",
      type: "radio",
      options: ["بله", "خیر"],
    },
    {
      id: 13,
      backendKey: "sms_tracking",
      question: "آیا پیامک‌های ارسالی خود را ردیابی (Track) می‌کنید؟",
      type: "radio",
      options: ["بله", "خیر"],
    },
    {
      id: 14,
      backendKey: "operator_user_distribution",
      question:
        "آیا اطلاع دارید که تعداد کاربران همراه اول و ایرانسل شما چقدر است؟",
      type: "radio",
      options: ["بله", "خیر"],
    },
    {
      id: 15,
      backendKey: "operator_user_distribution_specific",
      question: "تعداد کاربران هر اپراتور را به تفکیک وارد کنید.",
      type: "repeater",
      repeaterFields: [
        { key: "operator", type: "text", placeholder: "نام اپراتور" },
        {
          key: "count",
          type: "number",
          placeholder: "تعداد کاربران",
          numberMin: 0,
        },
      ],
      showIf: {
        parentQuestion:
          "آیا اطلاع دارید که تعداد کاربران همراه اول و ایرانسل شما چقدر است؟",
        equals: "بله",
      },
    },
    {
      id: 16,
      backendKey: "sms_satisfaction",
      question: "در حال حاضر از وضعیت پیامک‌های ارسالی راضی هستید؟",
      type: "radio",
      options: ["بله", "خیر"],
    },
    {
      id: 17,
      backendKey: "sms_satisfaction_reason",
      question: "دلیل عدم رضایت خود را بنویسید.",
      type: "textarea",
      showIf: {
        parentQuestion: "در حال حاضر از وضعیت پیامک‌های ارسالی راضی هستید؟",
        equals: "خیر",
      },
    },
    {
      id: 18,
      backendKey: "previous_monthly_sms_budget",
      question: "میانگین هزینه ماهانه شما چقدر بوده است؟",
      type: "radio",
      options: [...MONTHLY_BUDGET_OPTIONS],
    },
    {
      id: 19,
      backendKey: "sends_sms_purchase_confirmation",
      question:
        "آیا پس از خرید یا تکمیل فرآیند خرید، به مشتری پیامک تأیید یا تشکر ارسال می‌شود؟",
      type: "radio",
      options: ["بله", "خیر"],
    },
    {
      id: 20,
      backendKey: "link_shortener",
      question: "آیا از کوتاه‌کننده لینک استفاده کرده‌اید؟",
      type: "radio",
      options: ["بله", "خیر"],
    },
    {
      id: 21,
      backendKey: "has_link_shortener",
      question: "نام ابزار کوتاه‌کننده لینک را بنویسید.",
      type: "url",
      placeholder: "https://example.com",
      showIf: {
        parentQuestion: "آیا از کوتاه‌کننده لینک استفاده کرده‌اید؟",
        equals: "بله",
      },
    },
    {
      id: 22,
      backendKey: "max_sms_campaign_volume",
      question: "بیشترین حجم پیامک ارسالی شما در یک ماه چقدر بوده است؟",
      type: "radio",
      options: [
        "بیش از ۱۰۰ هزار پیامک",
        "بیش از ۵۰۰ هزار پیامک",
        "بیش از ۱ ملیون پیامک",
      ],
    },
    {
      id: 23,
      backendKey: "sent_to_non_customer_database",
      question:
        "آیا تاکنون به دیتابیس‌های غیرمشتری (مثلاً دیتابیس خریداری‌شده) پیامک ارسال کرده‌اید؟",
      type: "radio",
      options: ["بله", "خیر"],
    },
    {
      id: 24,
      backendKey: "sms_co_branding_experience",
      question:
        "آیا تا به حال با یک برند، به صورت Co-Branding همکاری داشته‌اید؟",
      type: "radio",
      options: ["بله", "خیر"],
    },
    {
      id: 25,
      backendKey: "has_sms_co_branding",
      question: "نام برند را بنویسید.",
      type: "text",
      showIf: {
        parentQuestion:
          "آیا تا به حال با یک برند، به صورت Co-Branding همکاری داشته‌اید؟",
        equals: "بله",
      },
    },
    {
      id: 26,
      backendKey: "sms_tone",
      question: "لحن و سبک محتوایی مدنظر شما برای ارسال چیست؟",
      type: "radio",
      options: [...CHANNEL_TONE_OPTIONS],
    },
    {
      id: 27,
      backendKey: "sms_event_type",
      question:
        "کدام مناسبت‌های عمومی باید در برنامه‌ریزی و تقویم محتوایی این کانال پوشش داده شوند؟",
      type: "checkbox",
      options: [...CHANNEL_EVENT_TYPE_OPTIONS],
    },
    {
      id: 28,
      backendKey: "sms_optimization_priority",
      question:
        "کدام بخش از ارسال پیامک را علاقه دارید بهینه کنید؟ (بعنوان مثال: گزارش‌گیری و آمار تحویل، چون گزارش‌ها دقیق و لحظه‌ای نیستند.)",
      type: "textarea",
      placeholder:
        "بعنوان مثال: گزارش‌گیری و آمار تحویل، چون گزارش‌ها دقیق و لحظه‌ای نیستند.",
      isAllowedEmpty: true,
    },
    {
      id: 29,
      backendKey: "last_sms_sample",
      question:
        "یک نمونه از پیامک‌های ارسالی خود را که هم مورد تأیید شما بوده و هم عملکرد خوبی داشته است، بنویسید.",
      type: "textarea",
      isAllowedEmpty: true,
    },
  ],
};
