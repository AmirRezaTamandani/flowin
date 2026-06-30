export const PERSONA_AGE_OPTIONS = [
  "زیر ۱۸",
  "۱۸ تا ۲۴",
  "۲۵ تا ۳۴",
  "۳۵ تا ۴۴",
  "۴۵ تا ۵۴",
  "۵۵ به بالا",
] as const;

export const PERSONA_GENDER_OPTIONS = ["زن", "مرد", "ترجیح میدهم نگویم"] as const;

export const PERSONA_JOB_OPTIONS = [
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
] as const;

export const PERSONA_INCOME_OPTIONS = ["بالا", "متوسط", "ضعیف"] as const;

export type PersonaFieldsValue = {
  ageRange: string;
  gender: string;
  country: string;
  province: string;
  city: string;
  job: string;
  incomeLevel: string;
};

export const EMPTY_PERSONA_FIELDS: PersonaFieldsValue = {
  ageRange: "",
  gender: "",
  country: "",
  province: "",
  city: "",
  job: "",
  incomeLevel: "",
};

export function parsePersonaFieldsValue(
  value: string | string[] | undefined,
): PersonaFieldsValue {
  if (!value || Array.isArray(value)) return { ...EMPTY_PERSONA_FIELDS };
  try {
    const parsed = JSON.parse(value) as Partial<PersonaFieldsValue>;
    return {
      ageRange: parsed.ageRange ?? "",
      gender: parsed.gender ?? "",
      country: parsed.country ?? "",
      province: parsed.province ?? "",
      city: parsed.city ?? "",
      job: parsed.job ?? "",
      incomeLevel: parsed.incomeLevel ?? "",
    };
  } catch {
    return { ...EMPTY_PERSONA_FIELDS };
  }
}

export function serializePersonaFieldsValue(value: PersonaFieldsValue): string {
  return JSON.stringify(value);
}

export function isPersonaFieldsEmpty(value: PersonaFieldsValue): boolean {
  return (
    !value.ageRange.trim() ||
    !value.gender.trim() ||
    !value.country.trim() ||
    !value.province.trim() ||
    !value.city.trim() ||
    !value.job.trim() ||
    !value.incomeLevel.trim()
  );
}
