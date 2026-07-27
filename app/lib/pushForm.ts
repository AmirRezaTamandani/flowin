import type { SurveyConfig } from "./surveys";
import {
  CHANNEL_EVENT_TYPE_OPTIONS,
  CHANNEL_TONE_OPTIONS,
  MONTHLY_BUDGET_OPTIONS,
} from "./formShared";

export const pushFormSurvey: SurveyConfig = {
  id: "push",
  label: "فرم پوش",
  title: "فرم پوش نوتیفیکیشن",
  description: "",
  orderSku: "push_content_calendar",
  steps: [
    {
      id: 1,
      backendKey: "push_types",
      question: "چه نوع پوش نوتیفیکیشنی ارسال می‌کنید؟",
      type: "radio",
      options: ["پوش نوتیفیکیشن وب", "پوش نوتیفیکیشن اپ", "هر دو"],
    },
    {
      id: 2,
      backendKey: "web_push_subscribers",
      question: "تعداد مشترکین پوش نوتیفیکیشن وب را وارد کنید.",
      type: "number",
      numberMin: 0,
      showIf: {
        parentQuestion: "چه نوع پوش نوتیفیکیشنی ارسال می‌کنید؟",
        includes: "پوش نوتیفیکیشن وب",
      },
    },
    {
      id: 3,
      backendKey: "app_push_subscribers",
      question: "تعداد مشترکین پوش نوتیفیکیشن اپ را وارد کنید.",
      type: "number",
      numberMin: 0,
      showIf: {
        parentQuestion: "چه نوع پوش نوتیفیکیشنی ارسال می‌کنید؟",
        includes: "پوش نوتیفیکیشن اپ",
      },
    },
    {
      id: 4,
      backendKey: "both_web_push_subscribers",
      question: "تعداد مشترکین پوش نوتیفیکیشن وب را وارد کنید.",
      type: "number",
      numberMin: 0,
      showIf: {
        parentQuestion: "چه نوع پوش نوتیفیکیشنی ارسال می‌کنید؟",
        includes: "هر دو",
      },
    },
    {
      id: 5,
      backendKey: "both_app_push_subscribers",
      question: "تعداد مشترکین پوش نوتیفیکیشن اپ را وارد کنید.",
      type: "number",
      numberMin: 0,
      showIf: {
        parentQuestion: "چه نوع پوش نوتیفیکیشنی ارسال می‌کنید؟",
        includes: "هر دو",
      },
    },
    {
      id: 6,
      backendKey: "push_script",
      question: "آیا اسکریپت روی سایت خود دارید؟",
      type: "radio",
      options: ["بله", "خیر"],
    },
    {
      id: 7,
      backendKey: "has_push_script",
      question: "آیا در حال حاضر در سایت فعال است؟",
      type: "radio",
      options: ["بله", "خیر"],
      showIf: {
        parentQuestion: "آیا اسکریپت روی سایت خود دارید؟",
        equals: "بله",
      },
    },
    {
      id: 8,
      backendKey: "push_service",
      question: "با چه سرویسی ارسال می‌کنید؟",
      type: "checkbox",
      options: ["سرویس های خارجی", "سرویس های ایرانی", "درون سازمانی"],
      checkboxSubOptions: [
        {
          parentOption: "سرویس های ایرانی",
          options: ["نجوا", "پوشه", "تیزپوش", "سایر"],
          otherOption: "سایر",
          otherPlaceholder: "نام سرویس را بنویسید",
        },
        {
          parentOption: "سرویس های خارجی",
          options: ["OneSignal", "PushEngage", "Firebase", "سایر"],
          otherOption: "سایر",
          otherPlaceholder: "نام سرویس را بنویسید",
        },
      ],
    },
    {
      id: 9,
      backendKey: "targeted_user_segments",
      question: "آیا برای بخش خاصی از کاربران خود ارسال می‌کنید؟",
      type: "radio",
      options: ["بله", "خیر"],
    },
    {
      id: 10,
      backendKey: "previous_push_notification_panels",
      question: "در گذشته از کدام پنل‌ها جهت ارسال استفاده کرده‌اید؟",
      type: "checkbox",
      otherOption: "سایر",
      otherPlaceholder: "نام پنل را بنویسید",
      options: [
        "نجوا",
        "فایربیس",
        "پوشه",
        "چابک",
        "تیزپوش",
        "درون سازمانی",
        "سایر",
      ],
    },
    {
      id: 11,
      backendKey: "push_notification_triggers",
      question: "در چه موقعیت‌هایی پوش نوتیفیکیشن ارسال می‌کنید؟",
      type: "checkbox",
      options: [
        "فروش و بازاریابی",
        "نگهداری کاربر",
        "محتوا و خبر",
        "تراکنشی و مهم",
        "رویداد و زمان‌محور",
        "شخصی‌سازی و رفتاری",
      ],
    },
    {
      id: 12,
      backendKey: "previous_monthly_push_budget",
      question: "در گذشته، میانگین هزینه ماهانه شما چقدر بوده است؟",
      type: "radio",
      options: ["۰", ...MONTHLY_BUDGET_OPTIONS],
    },
    {
      id: 13,
      backendKey: "push_tone",
      question: "لحن و سبک محتوایی مدنظر شما برای ارسال چیست؟",
      type: "radio",
      options: [...CHANNEL_TONE_OPTIONS],
    },
    {
      id: 14,
      backendKey: "push_event_type",
      question:
        "کدام مناسبت‌های عمومی باید در برنامه‌ریزی و تقویم محتوایی این کانال پوشش داده شوند؟",
      type: "checkbox",
      options: [...CHANNEL_EVENT_TYPE_OPTIONS],
    },
    {
      id: 15,
      backendKey: "push_template",
      question:
        "اگر دیزاین یا تمپلیت یکپارچه و خاص در این کانال دارید، لینک یا توضیح نمونه مورد تأیید خود را بنویسید.",
      type: "fileUpload",
      isAllowedEmpty: true,
    },
  ],
};
