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
  steps: [
    {
      id: 1,
      question: "چه نوع پوش نوتیفیکیشنی ارسال می‌کنید؟",
      type: "checkbox",
      options: [
        "پوش نوتیفیکیشن وب",
        "پوش نوتیفیکیشن اپ",
        "هر دو",
      ],
    },
    {
      id: 2,
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
      question: "آیا اسکریپت روی سایت خود دارید؟",
      type: "radio",
      options: ["بله", "خیر"],
    },
    {
      id: 7,
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
      question: "با چه سرویسی ارسال می‌کنید؟",
      type: "checkbox",
      otherOption: "سایر",
      otherPlaceholder: "نام سرویس را بنویسید",
      options: [
        "نجوا",
        "پوشه",
        "تپسی‌پوش",
        "OneSignal",
        "PushEngage",
        "Firebase",
        "چابک",
        "فایربیس",
        "درون سازمانی",
      ],
    },
    {
      id: 9,
      question: "آیا برای بخش خاصی از کاربران خود ارسال می‌کنید؟",
      type: "radio",
      options: ["بله", "خیر"],
    },
    {
      id: 10,
      question: "در گذشته از کدام پنل‌ها جهت ارسال استفاده کرده‌اید؟",
      type: "checkbox",
      otherOption: "سایر",
      otherPlaceholder: "نام پنل را بنویسید",
      options: ["نجوا", "فایربیس", "پوشه", "چابک", "تپسی‌پوش", "درون سازمانی"],
    },
    {
      id: 11,
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
      question: "در گذشته، میانگین هزینه ماهانه شما چقدر بوده است؟",
      type: "radio",
      options: ["۰", ...MONTHLY_BUDGET_OPTIONS],
    },
    {
      id: 13,
      question: "لحن و سبک محتوایی مدنظر شما برای ارسال چیست؟",
      type: "checkbox",
      options: [...CHANNEL_TONE_OPTIONS],
    },
    {
      id: 14,
      question: "کدام مناسبت‌های عمومی باید در برنامه‌ریزی و تقویم محتوایی این کانال پوشش داده شوند؟",
      type: "checkbox",
      options: [...CHANNEL_EVENT_TYPE_OPTIONS],
    },
    {
      id: 15,
      question:
        "اگر دیزاین یا تمپلیت یکپارچه و خاص در این کانال دارید، لینک یا توضیح نمونه مورد تأیید خود را بنویسید.",
      type: "textarea",
      isAllowedEmpty: true,
    },
  ],
};
