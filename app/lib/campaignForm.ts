import type { SurveyConfig } from "./surveys";
import {
  CAMPAIGN_CHANNEL_PARENT_OPTIONS,
  CAMPAIGN_CHANNEL_SUB_OPTIONS,
} from "./campaignChannels";
import { CAMPAIGN_TYPES } from "./campaignKpis";
import {
  CAMPAIGN_SUBTYPE_MAP,
  CAMPAIGN_SUBTYPE_QUESTION,
  CAMPAIGN_TYPE_QUESTION,
} from "./campaignSubTypes";

export const campaignFormSurvey: SurveyConfig = {
  id: "campaign",
  label: "فرم کمپین",
  title: "فرم کمپین",
  description: "",
  pageCount: 1,
  pageLabels: ["فرم کمپین"],
  steps: [
    {
      id: 1,
      question: "اصلی‌ ترین دلایل شما براجرای این کمپین چیست؟",
      type: "textarea",
      placeholder:
        "مثال: به دلیل افت فروش کلی با یک کمپین میخام حضورم رو تو بازار پر رنگ کنم",
    },
    {
      id: 2,
      question: CAMPAIGN_TYPE_QUESTION,
      type: "radio",
      options: [...CAMPAIGN_TYPES],
    },
    {
      id: 27,
      question: CAMPAIGN_SUBTYPE_QUESTION,
      type: "radio",
      optionsFromParent: {
        parentQuestion: CAMPAIGN_TYPE_QUESTION,
        optionMap: CAMPAIGN_SUBTYPE_MAP,
      },
      showIf: {
        parentQuestion: CAMPAIGN_TYPE_QUESTION,
        whenParentAnswered: true,
      },
    },
    {
      id: 3,
      question: "تاریخ شروع کمپین خود را انتخاب کنید",
      type: "shamsiDate",
      placeholder: "تاریخ شروع را انتخاب کنید",
    },
    {
      id: 4,
      question: "تاریخ پایان کمپین خود را انتخاب کنید",
      type: "shamsiDate",
      placeholder: "تاریخ پایان را انتخاب کنید",
    },
    {
      id: 5,
      question: "بودجه کمپین را وارد کنید(تومان)",
      type: "number",
      placeholder: "0",
      numberSuffix: "تومان",
      numberMin: 0,
    },
    {
      id: 6,
      question: "اصلی‌ترین محدودیت در اجرای کمپین چیست؟",
      type: "checkbox",
      options: [
        "بودجه",
        "زمان محدود",
        "منابع تیمی",
        "محدودیت تولید محتوا",
        "محدودیت کانال ها",
        "محدودیت قانونی یا تبلیغاتی",
        "محدودیت در تخفیف",
        "محدودیت موجودی محصول",
      ],
      otherOption: "سایر",
      otherPlaceholder: "محدودیت مورد نظر خود را بنویسید",
    },
    {
      id: 7,
      question: "در این کمپین چه ارزش یا پیشنهادی به کاربر ارائه می‌دهید؟",
      type: "checkbox",
      options: [
        "تخفیف",
        "کش‌بک",
        "هدیه همراه خرید",
        "قرعه‌کشی",
        "ارسال رایگان",
        "امتیاز باشگاه مشتریان",
        "شارژ کیف پول",
      ],
    },
    {
      id: 8,
      question:
        "شرایط تخفیف خود را توضیح دهید درصد تخفیف، محدودیت تخفیف ، سقف و کف،‌و هر اطلاعات مورد نیاز",
      type: "textarea",
      showIf: {
        parentQuestion:
          "در این کمپین چه ارزش یا پیشنهادی به کاربر ارائه می‌دهید؟",
        includes: "تخفیف",
      },
    },
    {
      id: 9,
      question:
        "چند درصد کش بک به کاربر میدهید و کاربر این کش بک را از چه طریق دریافت میکند",
      type: "textarea",
      showIf: {
        parentQuestion:
          "در این کمپین چه ارزش یا پیشنهادی به کاربر ارائه می‌دهید؟",
        includes: "کش‌بک",
      },
    },
    {
      id: 10,
      question: "چه جایزه یا هدیه خریدی به کاربر میدهید؟",
      type: "textarea",
      showIf: {
        parentQuestion:
          "در این کمپین چه ارزش یا پیشنهادی به کاربر ارائه می‌دهید؟",
        includes: "هدیه همراه خرید",
      },
    },
    {
      id: 11,
      question: "جایزه بزرگ را نام ببرید و شرایط قرعه کشی را نیز توضیح دهید",
      type: "textarea",
      showIf: {
        parentQuestion:
          "در این کمپین چه ارزش یا پیشنهادی به کاربر ارائه می‌دهید؟",
        includes: "قرعه‌کشی",
      },
    },
    {
      id: 12,
      question: "به چه کاربرانی ارسال رایگان تعلق میگیرد؟",
      type: "textarea",
      showIf: {
        parentQuestion:
          "در این کمپین چه ارزش یا پیشنهادی به کاربر ارائه می‌دهید؟",
        includes: "ارسال رایگان",
      },
    },
    {
      id: 13,
      question: "شرایط دریافت امتیاز و میزان امتیاز دریافتی را توضیح دهید",
      type: "textarea",
      showIf: {
        parentQuestion:
          "در این کمپین چه ارزش یا پیشنهادی به کاربر ارائه می‌دهید؟",
        includes: "امتیاز باشگاه مشتریان",
      },
    },
    {
      id: 14,
      question: "شرایط دریافت شارژ و میزان شارژ کیف پول را توضیح دهید",
      type: "textarea",
      showIf: {
        parentQuestion:
          "در این کمپین چه ارزش یا پیشنهادی به کاربر ارائه می‌دهید؟",
        includes: "شارژ کیف پول",
      },
    },
    {
      id: 15,
      question:
        "آیا محصول خاصی و یا دسته بندی خاصی را برای پروموت در کمپین مدنظر دارید ؟",
      type: "radio",
      options: ["بله", "خیر"],
    },
    {
      id: 16,
      question: "محصول را نام ببرید و یا لینک آن را بگذارید",
      type: "textarea",
      showIf: {
        parentQuestion:
          "آیا محصول خاصی و یا دسته بندی خاصی را برای پروموت در کمپین مدنظر دارید ؟",
        equals: "بله",
      },
    },
    {
      id: 17,
      question: "پرسونای کمپین - موقعیت جغرافیایی",
      type: "geoLocation",
      geoLocationSingle: true,
    },
    {
      id: 18,
      question: "پرسونای کمپین- موقعیت اجتماعی",
      type: "checkbox",
      options: [
        "جوان جویای کار",
        "دانشجوی دانشگاه",
        "فریلنسر تازه‌کار",
        "مدیر میانی شرکت",
        "صاحب کسب‌وکار کوچک",
        "بانوان خانه‌دار",
        "والدین کودکان",
        "گیمر حرفه‌ای",
        "علاقه‌مند به فیتنس و سلامت",
        "سرمایه‌گذار خرد",
        "توسعه‌دهنده نرم‌افزار",
        "معلم یا مدرس",
        "خریدار آنلاین حرفه‌ای",
        "طرفدار تکنولوژی و گجت",
        "کارمند دورکار",
        "هنرمند یا طراح",
        "علاقه‌مند به مد و فشن",
        "کارآفرین",
        "بازنشسته فعال",
        "پزشک/درمانگر",
        "تاجر/ بازرگان",
        "وکیل/ مشاور حقوقی",
        "بدون محدودیت مشاغل",
      ],
    },

    {
      id: 19,
      question: "پرسونای کمپین-رده سنی",
      type: "checkbox",
      options: [
        "کودک و خردسال",
        "نوجوانان",
        "18 تا 35 سال",
        "35 تا 50 سال",
        "50 تا 60 سال",
        "60 سال به بالا",
      ],
    },
    {
      id: 20,
      question: "پرسونای کمپین-جنسیت",
      type: "radio",
      options: ["آقا", "خانم", "هر دو"],
    },
    {
      id: 21,
      question: "زبان و لحن کمپین",
      type: "radio",
      options: [
        "رسمی",
        "دوستانه",
        "محاوره‌ای",
        "طنزآمیز",
        "جسورانه",
        "الهام‌بخش",
        "ساده و مستقیم",
        "احساسی",
        "ترغیب‌کننده",
        "آموزشی",
        "مینیمال",
        "لوکس",
      ],
    },
    {
      id: 22,
      question: "چنل هایی که برای کمپین میخواهید استفاده کنید",
      type: "checkbox",
      options: [...CAMPAIGN_CHANNEL_PARENT_OPTIONS],
      checkboxSubOptions: CAMPAIGN_CHANNEL_SUB_OPTIONS,
    },
    {
      id: 23,
      question:
        "اگر لندینگ و یا صفحه خاصی از سایت خود را برای کمپین مدنظر دارید لطفا لینک آن را در باکس قرار دهید.",
      type: "url",
      placeholder: "https://example.com/landing",
      isAllowedEmpty: true,
    },
    {
      id: 24,
      question:
        "از نظر شما بد ترین چالش و تجربه منفی در کمپین هایی که داشته اید چه بوده است ؟‌ علت آن را چه می دانید؟",
      type: "textarea",
      isAllowedEmpty: true,
    },
    {
      id: 25,
      question: "آیا تا به حال تجربه کمپین مشترک با برند دیگری داشتید؟",
      type: "radio",
      options: ["بله", "خیر"],
    },
    {
      id: 26,
      question: "با چه برندی این تجربه را داشتید؟ توضیح دهید.",
      type: "textarea",
      showIf: {
        parentQuestion: "آیا تا به حال تجربه کمپین مشترک با برند دیگری داشتید؟",
        equals: "بله",
      },
    },
  ],
};
