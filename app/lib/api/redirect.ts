import type { SurveyId } from "./types";

/**
 * تعیین می‌کنه بعد از submit موفق (202)، مرورگر به کجا هدایت بشه.
 *
 * نکته‌ی مهم: همه‌ی این مقصدها صفحاتی هستند که در خودِ وردپرس هستند،
 * نه بخشی از اپ Next.js (که فقط مسیر /form/* رو داره).
 * پس باید حتماً از window.location.href استفاده بشه، نه router.push() —
 * چون router.push() به‌اشتباه basePath ("/form") رو جلوی
 * این آدرس‌ها اضافه می‌کنه و لینک خراب میشه.
 */
export function getSuccessRedirectUrl(
  surveyId: SurveyId,
  orderId?: string | null,
  orderSku?: string | null,
): string {
  // فرم برند سفارشی نداره — همیشه به صفحه‌ی حساب کاربری برمی‌گرده
  if (surveyId === "branding") {
    return "/my-account";
  }

  // حالت احتیاطی: اگه به هر دلیلی این مقادیر نبودن، جای امن بفرستش
  if (!orderId || !orderSku) {
    return "/my-account";
  }

  const slug = `${orderId}-${orderSku}`;

  switch (surveyId) {
    case "push":
    case "email":
    case "sms":
      return `/notification_outputs/${slug}`;

    case "seo":
      return `/seo_outputs/${slug}`;

    case "social-competitor":
    case "social-strategy":
      return `/social_outputs/${slug}`;

    case "campaign":
      return `/campaign_outputs/${slug}`;

    default:
      return "/my-account";
  }
}
