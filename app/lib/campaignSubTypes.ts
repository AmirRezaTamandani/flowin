import { CAMPAIGN_TYPE_QUESTION } from "./campaignKpis";

export const CAMPAIGN_SUBTYPE_QUESTION =
  "با توجه به این که کدام یک از دسته بندی ها را انتخاب میکنید، زیر دسته ی همان کمپین را مشخص کنید";

export { CAMPAIGN_TYPE_QUESTION };

export const CAMPAIGN_SUBTYPE_MAP: Record<string, string[]> = {
  "کمپین Awareness": [
    "اورنس محصول",
    "کمپین Awareness",
    "کمپین معرفی برند",
    "کمپین Storytelling برند",
    "کمپین Positioning محصول",
    "کمپین Rebrand",
    "کمپین Brand Image",
    "کمپین Influencer Awareness",
    "Trendjacking Campaign (استفاده از ترندهای روز برای دیده‌شدن)"
  ],
  "کمپین لانچ و معرفی محصول": [
    "کمپین New Launch",
    "کمپین Product Reveal",
    "کمپین Pre-Launch",
    "کمپین Beta Launch",
    "کمپین Early Access",
    "کمپین Trial / تست محصول",
    "کمپین Demo محصول"
  ],
  "کمپین Acquisition (جذب کاربر / مشتری)": [
    "کمپین New User",
    "کمپین Lead Generation",
    "کمپین Referral (دعوتی)",
    "کمپین First Purchase",
    "کمپین Affiliate Marketing",
    "کمپین ثبت‌نام"
  ],
  "کمپین فروش": [
    "کمپین فروش",
    "کمپین تخفیف",
    "کمپین Flash Sale",
    "کمپین Bundle Sale",
    "کمپین Seasonal Sale",
    "کمپین مناسبتی (نوروز، یلدا، بلک فرایدی)",
    "کمپین Limited Offer"
  ],
  "کمپین Engagement (تعاملی)": [
    "کمپین تعاملی",
    "کمپین مسابقه",
    "کمپین چالش",
    "کمپین Quiz",
    "کمپین Poll",
    "کمپین Gamification",
    "Live Campaign (پخش زنده / لایو)",
    "Interactive Story / AR Filter Campaign"
  ],
  "کمپین محتوایی": [
    "کمپین UGC (محتوای تولید شده توسط کاربر)",
    "کمپین CGC (محتوای تولید شده توسط کاستومر)",
    "کمپین هشتگ",
    "کمپین Review",
    "کمپین Testimonial"
  ],
  "کمپین Retention (حفظ مشتری)": [
    "کمپین Retention",
    "کمپین Loyalty Program",
    "کمپین امتیاز و پاداش",
    "کمپین Cashback",
    "کمپین Reactivation",
    "کمپین Membership",
    "کمپین Retargeting",
    "کمپین Abandoned Cart",
    "کمپین Reminder",
    "Winback Campaign (بازگردانی مشتریان غیرفعال)",
    "Milestone Celebration Campaign (جشن سالگرد خرید / تولد مشتری)"
  ],
  "کمپین Revenue Expansion": [
    "کمپین Upsell",
    "کمپین Cross-Sell",
    "کمپین Upgrade",
    "کمپین Add-on",
    "Personalized Recommendation Campaign (پیشنهاد شخصی‌سازی‌شده)"
  ],
  "کمپین اجتماعی و برند": [
    "کمپین CSR",
    "پویش ملی",
    "کمپین خیریه",
    "کمپین محیط زیست",
    "Cause Marketing (حمایت از جنبش‌ها یا مسائل اجتماعی خاص مثل سلامت روان، تنوع فرهنگی و…)",
    "کمپین فرهنگی"
  ],
  "کمپین رویداد": [
    "کمپین Launch Event",
    "کمپین نمایشگاه",
    "کمپین کنفرانس",
    "کمپین وبینار",
    "Virtual Event / Metaverse Campaign",
    "Hybrid Event (ترکیب آنلاین و حضوری)",
    "کمپین فستیوال برند"
  ],
  "کمپین خلاق و وایرال": [
    "Guerrilla Marketing",
    "Stunt Marketing",
    "Experiential Marketing",
    "Viral Campaign",
    "Meme Marketing Campaign"
  ],
  "اکتیویشن": [
    "Brand Activation",
    "Sampling",
    "Street Marketing",
    "Guerrilla Outdoor"
  ],
  "Performance Marketing (مارکتینگ عملکردی / نتیجه‌محور)": [
    "Conversion Campaign (کمپین تبدیل مستقیم / فروش)",
    "ROI Optimization (کمپین بهینه‌سازی بازده)",
    "PPC / Paid Search (تبلیغات کلیکی)",
    "Attribution Campaign (ردیابی تأثیر کانال‌ها)",
    "Dynamic Remarketing (تبلیغات مجدد پویا بر اساس رفتار کاربر)"
  ],
  "CRM & Data-Driven (داده‌محور و شخصی‌سازی‌شده)": [
    "Personalized Email Marketing (ارسال ایمیل شخصی‌سازی‌شده)",
    "Automated Sequences (اتوماسیون کمپین)",
    "Behavioral Triggers (ارسال پیام بر اساس رفتار کاربر)",
    "Birthday / Anniversary Celebration (کمپین مناسبت مشتری)",
    "Segment-based Offers (پیشنهادهای هدفمند بر اساس دسته مشتری)",
    "Predictive Retention (پیش‌بینی ریزش و جلوگیری از آن)",
    "Brand Community Launch (راه‌اندازی انجمن یا گروه برند)"
  ],
  "Partnership & Co-Branding (همکاری برندها)": [
    "Co-Branded Product Launch (محصول مشترک)",
    "Cross-Promotion (تبلیغ متقابل در شبکه‌های دو برند)",
    "Joint Event (رویداد یا لایو مشترک)",
    "Shared Giveaway / Contest (قرعه‌کشی مشترک)",
    "Media Collaboration (همکاری محتوایی در رسانه‌ها)",
    "Affiliate Partnership (مشارکت در فروش)"
  ],
  "Employer Branding (برند کارفرمایی)": [
    "Career Stories (روایت تجربه کارکنان)",
    "Behind the Scenes (پشت صحنه سازمان)",
    "Recruitment Campaign (استخدام جذاب و دیجیتال)",
    "Employee Advocacy (محتوای تولیدی کارکنان)",
    "Culture Video / Blog (محتوای فرهنگی سازمانی)",
    "Internal Engagement Events (ایونت‌های داخلی یا تیمی)"
  ],
  "Crisis Management / PR (مدیریت بحران و روابط عمومی)": [
    "Official Statement Campaign (اطلاعیه رسمی / شفاف‌سازی)",
    "Apology & Redemption (جبران یا عذرخواهی رسمی)",
    "Media Outreach (تعامل با رسانه‌ها برای بازسازی اعتبار)"
  ],
  "Customer Education (آموزشی و آگاهی‌بخش)": [
    "How-to Series (آموزش نحوه استفاده)",
    "Webinar / Workshop (وبینار یا کارگاه آموزشی)",
    "Product Tips (ترفندهای کاربردی)",
    "Tutorial Video / Blog (ویدیو یا محتوای آموزشی)",
    "Knowledge Base Launch (ایجاد مرکز آموزش کاربران)",
    "Certification Program (دوره‌ها و گواهی‌نامه آموزشی)"
  ]
};

export function getCampaignSubTypes(campaignType: string): string[] {
  return CAMPAIGN_SUBTYPE_MAP[campaignType] ?? [];
}
