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
  steps: [
    {
      id: 1,
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
      question:
        "معمولاً در چه بازه‌های زمانی پیامک ارسال می‌کنید؟ (مثال: صبح ۹ تا ۱۲، بعدازظهر ۱۶ تا ۲۰)",
      type: "textarea",
      placeholder: "بازه‌های زمانی ارسال را بنویسید",
    },
    {
      id: 3,
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
      ],
    },
    {
      id: 4,
      question:
        "آیا خط خدماتی اختصاصی دارید؟ (منظور از خط خدماتی خطی است که با استفاده از آن برای مشتریان خود پیامک ارسال می‌کنید.)",
      type: "radio",
      options: ["بله", "خیر"],
    },
    {
      id: 5,
      question: "لطفاً شماره این خط خود را وارد کنید.",
      type: "number",
      numberFormat: "phone",
      numberSuffix: "شماره موبایل",
      showIf: {
        parentQuestion:
          "آیا خط خدماتی اختصاصی دارید؟ (منظور از خط خدماتی خطی است که با استفاده از آن برای مشتریان خود پیامک ارسال می‌کنید.)",
        equals: "بله",
      },
    },
    {
      id: 6,
      question:
        "آیا خط خدماتی اختصاصی برای ارسال OTP یا پیامک‌های تراکنشی دارید؟",
      type: "radio",
      options: ["بله", "خیر"],
    },
    {
      id: 7,
      question: "لطفاً شماره این خط خود را وارد کنید.",
      type: "number",
      numberFormat: "phone",
      numberSuffix: "شماره موبایل",
      showIf: {
        parentQuestion:
          "آیا خط خدماتی اختصاصی برای ارسال OTP یا پیامک‌های تراکنشی دارید؟",
        equals: "بله",
      },
    },
    {
      id: 8,
      question:
        "آیا خط تبلیغاتی اختصاصی دارید؟ (منظور از خط تبلیغاتی خطی است که با استفاده از آن برای باشگاه مشتریان یا مشتریان عادی خود پیامک ارسال می‌کنید.)",
      type: "radio",
      options: ["بله", "خیر"],
    },
    {
      id: 9,
      question: "لطفاً شماره این خط خود را وارد کنید.",
      type: "number",
      numberFormat: "phone",
      numberSuffix: "شماره موبایل",
      showIf: {
        parentQuestion:
          "آیا خط تبلیغاتی اختصاصی دارید؟ (منظور از خط تبلیغاتی خطی است که با استفاده از آن برای باشگاه مشتریان یا مشتریان عادی خود پیامک ارسال می‌کنید.)",
        equals: "بله",
      },
    },
    {
      id: 10,
      question:
        "آیا خط تبلیغاتی اختصاصی دارید؟ (منظور از خط تبلیغاتی خطی است که با استفاده از آن برای باشگاه مشتریان یا مشتریان عادی و مشتریانی که در لیست سیاه هستند، پیامک ارسال می‌کنید.)",
      type: "radio",
      options: ["بله", "خیر"],
    },
    {
      id: 11,
      question: "لطفاً شماره این خط خود را وارد کنید.",
      type: "number",
      numberFormat: "phone",
      numberSuffix: "شماره موبایل",
      numberMin: 0,
      showIf: {
        parentQuestion:
          "آیا خط تبلیغاتی اختصاصی دارید؟ (منظور از خط تبلیغاتی خطی است که با استفاده از آن برای باشگاه مشتریان یا مشتریان عادی و مشتریانی که در لیست سیاه هستند، پیامک ارسال می‌کنید.)",
        equals: "بله",
      },
    },
    {
      id: 12,
      question: "آیا تا به حال تحلیل RFM انجام داده‌اید؟",
      type: "radio",
      options: ["بله", "خیر"],
    },
    {
      id: 13,
      question: "آیا پیامک‌های ارسالی خود را ردیابی (Track) می‌کنید؟",
      type: "radio",
      options: ["بله", "خیر"],
    },
    {
      id: 14,
      question:
        "آیا اطلاع دارید که تعداد کاربران همراه اول و ایرانسل شما چقدر است؟",
      type: "radio",
      options: ["بله", "خیر"],
    },
    {
      id: 15,
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
      question: "در حال حاضر از وضعیت پیامک‌های ارسالی راضی هستید؟",
      type: "radio",
      options: ["بله", "خیر"],
    },
    {
      id: 17,
      question: "دلیل عدم رضایت خود را بنویسید.",
      type: "textarea",
      showIf: {
        parentQuestion: "در حال حاضر از وضعیت پیامک‌های ارسالی راضی هستید؟",
        equals: "خیر",
      },
    },
    {
      id: 18,
      question: "میانگین هزینه ماهانه شما چقدر بوده است؟",
      type: "radio",
      options: [...MONTHLY_BUDGET_OPTIONS],
    },
    {
      id: 19,
      question:
        "آیا پس از خرید یا تکمیل فرآیند خرید، به مشتری پیامک تأیید یا تشکر ارسال می‌شود؟",
      type: "radio",
      options: ["بله", "خیر"],
    },
    {
      id: 20,
      question: "آیا از کوتاه‌کننده لینک استفاده کرده‌اید؟",
      type: "radio",
      options: ["بله", "خیر"],
    },
    {
      id: 21,
      question: "نام ابزار کوتاه‌کننده لینک را بنویسید.",
      type: "text",
      showIf: {
        parentQuestion: "آیا از کوتاه‌کننده لینک استفاده کرده‌اید؟",
        equals: "بله",
      },
    },
    {
      id: 22,
      question: "بیشترین حجم پیامک ارسالی شما در یک ماه چقدر بوده است؟",
      type: "radio",
      options: [
        "هزار پیامک بیش از ۱۰۰",
        "هزار پیامک بیش از ۵۰۰",
        "میلیون پیامک بیش از ۱",
      ],
    },
    {
      id: 23,
      question:
        "آیا پاکنویس به دیتابیس‌های غیرمشتری (مثلاً دیتابیس خریداری‌شده) پیامک ارسال کرده‌اید؟",
      type: "radio",
      options: ["بله", "خیر"],
    },
    {
      id: 24,
      question:
        "آیا تا به حال با یک برند، به صورت Co-Branding همکاری داشته‌اید؟",
      type: "radio",
      options: ["بله", "خیر"],
    },
    {
      id: 25,
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
      question: "لحن و سبک محتوایی مدنظر شما برای ارسال چیست؟",
      type: "radio",
      options: [...CHANNEL_TONE_OPTIONS],
    },
    {
      id: 27,
      question:
        "کدام مناسبت‌های عمومی باید در برنامه‌ریزی و تقویم محتوایی این کانال پوشش داده شوند؟",
      type: "checkbox",
      options: [...CHANNEL_EVENT_TYPE_OPTIONS],
    },
    {
      id: 28,
      question:
        "کدام بخش از ارسال پیامک را علاقه دارید بهینه کنید؟ (برای هر بخش، دلیل را در خط بعدی بنویسید)",
      type: "textarea",
      placeholder: "بخش مورد نظر و دلیل بهینه‌سازی را بنویسید",
      isAllowedEmpty: true,
    },
    {
      id: 29,
      question:
        "یک نمونه از پیامک‌های ارسالی خود را که هم مورد تأیید شما بوده و هم عملکرد خوبی داشته است، بنویسید.",
      type: "textarea",
      isAllowedEmpty: true,
    },
  ],
};
