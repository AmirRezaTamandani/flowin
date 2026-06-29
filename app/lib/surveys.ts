export type SurveyStep = {
  id: number;
  question: string;
  type: "text" | "radio" | "select";
  placeholder?: string;
  options?: string[];
  required?: boolean;
};

export type SurveyConfig = {
  id: string;
  label: string;
  title: string;
  description: string;
  steps: SurveyStep[];
};

export const surveyMap: Record<string, SurveyConfig> = {
  dashboard: {
    id: "dashboard",
    label: "داشبورد",
    title: "اطلاعات اولیه کسب و کار",
    description: "این بخش برای جمع آوری داده های پایه شما طراحی شده است.",
    steps: [
      {
        id: 1,
        question: "نام برند شما چیست؟",
        type: "text",
        placeholder: "مثلاً آرتین استور",
        required: true,
      },
      {
        id: 2,
        question: "هدف شما از راه اندازی فروشگاه چیست؟",
        type: "radio",
        options: ["فروش بیشتر", "برندسازی", "آشنایی با مشتری"],
      },
      {
        id: 3,
        question: "اولویت شما در ماه جاری چیست؟",
        type: "select",
        options: ["تولید محتوا", "بهینه سازی سایت", "تبلیغات"],
      },
    ],
  },
  profile: {
    id: "profile",
    label: "پروفایل",
    title: "تکمیل پروفایل کاربری",
    description: "اطلاعات شما را برای تجربه بهتر شخصی سازی می کنیم.",
    steps: [
      {
        id: 1,
        question: "نام و نام خانوادگی شما چیست؟",
        type: "text",
        placeholder: "مثلاً امیررضا",
      },
      {
        id: 2,
        question: "به کدام حوزه علاقه دارید؟",
        type: "radio",
        options: ["طراحی", "توسعه", "بازاریابی"],
      },
      {
        id: 3,
        question: "مناسب ترین زمان تماس چه زمانی است؟",
        type: "select",
        options: ["صبح", "ظهر", "عصر"],
      },
      {
        id: 4,
        question: "ملاحظات حقوقی یا فنی دارید؟",
        type: "text",
        placeholder: "توضیح کوتاه",
      },
    ],
  },
  branding: {
    id: "branding",
    label: "افزودن اطلاعات برند",
    title: "افزودن اطلاعات برند",
    description: "",
    steps: [
      {
        id: 1,
        question: "هویت برند شما چگونه باید دیده شود؟",
        type: "text",
        placeholder: "توضیح کوتاه",
      },
      {
        id: 2,
        question: "رنگ برند شما چیست؟",
        type: "radio",
        options: ["آبی", "سبز", "نارنجی", "مشکی"],
      },
      {
        id: 3,
        question: "آیا به یک هویت تصویری تازه نیاز دارید؟",
        type: "select",
        options: ["بله", "خیر", "ممکن است"],
      },
      {
        id: 4,
        question: "توضیح کوتاه درباره پیام برندتان",
        type: "text",
        placeholder: "پیام برند",
      },
    ],
  },
  seo: {
    id: "seo",
    label: "سئو",
    title: "سئو و رشد ارگانیک",
    description: "برای برنامه ریزی سئو، چند سوال ساده را کامل کنید.",
    steps: [
      {
        id: 1,
        question: "دامنه فعلی شما چیست؟",
        type: "text",
        placeholder: "example.com",
      },
      {
        id: 2,
        question: "حجم فعالیت محتوایی شما چقدر است؟",
        type: "radio",
        options: ["کم", "متوسط", "زیاد"],
      },
      {
        id: 3,
        question: "هدف اصلی سئو چیست؟",
        type: "select",
        options: ["رشد ترافیک", "فروش بیشتر", "بهبود برند"],
      },
      {
        id: 4,
        question: "به کدام کلمات کلیدی توجه می کنید؟",
        type: "text",
        placeholder: "کلمات کلیدی",
      },
    ],
  },
};

export type NavItem = {
  id: string;
  label: string;
  children?: { id: string; label: string }[];
};

export const navItems: NavItem[] = [
  { id: "branding", label: "افزودن اطلاعات برند" },
  {
    id: "content",
    label: "محتوا",
    children: [
      { id: "content-blog", label: "بلاگ" },
      { id: "content-social", label: "محتوای شبکه اجتماعی" },
    ],
  },
  {
    id: "social",
    label: "شبکه‌های اجتماعی",
    children: [
      { id: "social-instagram", label: "اینستاگرام" },
      { id: "social-linkedin", label: "لینکدین" },
    ],
  },
  {
    id: "seo-menu",
    label: "سئو",
    children: [{ id: "seo", label: "بهینه‌سازی سایت" }],
  },
  {
    id: "media",
    label: "مدیا",
    children: [
      { id: "media-video", label: "ویدیو" },
      { id: "media-photo", label: "عکاسی" },
    ],
  },
  {
    id: "campaign",
    label: "کمپین",
    children: [{ id: "campaign-ads", label: "تبلیغات" }],
  },
  {
    id: "notification",
    label: "اطلاع‌رسانی",
    children: [{ id: "notification-sms", label: "پیامک" }],
  },
  {
    id: "performance",
    label: "پرفورمنس",
    children: [{ id: "performance-report", label: "گزارش عملکرد" }],
  },
  { id: "orders", label: "سفارش‌های من" },
  { id: "support", label: "پشتیبانی" },
  { id: "wallet", label: "کیف پول من" },
  { id: "profile", label: "اطلاعات حساب کاربری" },
];
