import {
  GEO_COUNTRY_OPTIONS,
  IRAN_PROVINCE_OPTIONS,
  isIranCountry,
} from "./geoLocation";

export const PERSONA_AGE_OPTIONS = [
  "زیر ۱۸",
  "۱۸ تا ۲۴",
  "۲۵ تا ۳۴",
  "۳۵ تا ۴۴",
  "۴۵ تا ۵۴",
  "۵۵ به بالا",
] as const;

export const PERSONA_GENDER_OPTIONS = ["زن", "مرد", "آقا و خانم"] as const;

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

export const PERSONA_COUNTRY_OPTIONS = GEO_COUNTRY_OPTIONS;
export const PERSONA_PROVINCE_OPTIONS = IRAN_PROVINCE_OPTIONS;

export const PERSONA_CITY_OPTIONS_BY_PROVINCE: Record<string, string[]> = {
  "آذربایجان شرقی": ["تبریز", "مراغه", "مرند", "میانه", "بناب", "سایر"],
  "آذربایجان غربی": ["ارومیه", "خوی", "مهاباد", "بوکان", "سایر"],
  اردبیل: ["اردبیل", "مشگین شهر", "پارس آباد", "خلخال", "سایر"],
  اصفهان: ["اصفهان", "کاشان", "نجف آباد", "خمینی شهر", "سایر"],
  البرز: ["کرج", "فردیس", "نظرآباد", "هشتگرد", "سایر"],
  ایلام: ["ایلام", "دهلران", "ایوان", "آبدانان", "سایر"],
  بوشهر: ["بوشهر", "برازجان", "گناوه", "کنگان", "سایر"],
  تهران: ["تهران", "شهریار", "اسلامشهر", "پردیس", "دماوند", "سایر"],
  "چهارمحال و بختیاری": ["شهرکرد", "بروجن", "فارسان", "سایر"],
  "خراسان جنوبی": ["بیرجند", "قائن", "فردوس", "سایر"],
  "خراسان رضوی": ["مشهد", "نیشابور", "سبزوار", "تربت حیدریه", "سایر"],
  "خراسان شمالی": ["بجنورد", "شیروان", "اسفراین", "سایر"],
  خوزستان: ["اهواز", "آبادان", "دزفول", "ماهشهر", "خرمشهر", "سایر"],
  زنجان: ["زنجان", "ابهر", "خرمدره", "سایر"],
  سمنان: ["سمنان", "شاهرود", "گرمسار", "دامغان", "سایر"],
  "سیستان و بلوچستان": ["زاهدان", "چابهار", "زابل", "ایرانشهر", "سایر"],
  فارس: ["شیراز", "مرودشت", "کازرون", "لار", "جهرم", "سایر"],
  قزوین: ["قزوین", "الوند", "تاکستان", "سایر"],
  قم: ["قم", "سایر"],
  کردستان: ["سنندج", "سقز", "مریوان", "بانه", "سایر"],
  کرمان: ["کرمان", "رفسنجان", "سیرجان", "جیرفت", "سایر"],
  کرمانشاه: ["کرمانشاه", "اسلام آباد غرب", "جوانرود", "سایر"],
  "کهگیلویه و بویراحمد": ["یاسوج", "دوگنبدان", "سایر"],
  گلستان: ["گرگان", "گنبد کاووس", "علی آباد", "سایر"],
  گیلان: ["رشت", "انزلی", "لاهیجان", "آستانه اشرفیه", "سایر"],
  لرستان: ["خرم آباد", "بروجرد", "دورود", "الیگودرز", "سایر"],
  مازندران: ["ساری", "بابل", "آمل", "قائمشهر", "چالوس", "سایر"],
  مرکزی: ["اراک", "ساوه", "خمین", "سایر"],
  هرمزگان: ["بندرعباس", "قشم", "کیش", "میناب", "سایر"],
  همدان: ["همدان", "ملایر", "نهاوند", "کبودرآهنگ", "سایر"],
  یزد: ["یزد", "میبد", "اردکان", "سایر"],
};

const NON_IRAN_LOCATION_OPTIONS = ["سایر / خارج از ایران"];

export function getPersonaProvinceOptions(country: string): readonly string[] {
  if (!country.trim()) return [];
  if (isIranCountry(country)) return PERSONA_PROVINCE_OPTIONS;
  return NON_IRAN_LOCATION_OPTIONS;
}

export function getPersonaCityOptions(
  country: string,
  province: string,
): readonly string[] {
  if (!country.trim() || !province.trim()) return [];
  if (!isIranCountry(country)) return NON_IRAN_LOCATION_OPTIONS;
  return PERSONA_CITY_OPTIONS_BY_PROVINCE[province] ?? ["سایر"];
}

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

export const PERSONA_EMPTY_FIELD_MESSAGE = "این فیلد الزامی است.";

function isPersonaSelectValueValid(
  value: string,
  options: readonly string[],
): boolean {
  return Boolean(value.trim()) && options.includes(value);
}

export function getPersonaFieldsValidationErrors(
  value: PersonaFieldsValue,
): Partial<Record<keyof PersonaFieldsValue, string>> {
  const errors: Partial<Record<keyof PersonaFieldsValue, string>> = {};

  if (!isPersonaSelectValueValid(value.ageRange, PERSONA_AGE_OPTIONS)) {
    errors.ageRange = PERSONA_EMPTY_FIELD_MESSAGE;
  }
  if (!isPersonaSelectValueValid(value.gender, PERSONA_GENDER_OPTIONS)) {
    errors.gender = PERSONA_EMPTY_FIELD_MESSAGE;
  }
  if (!isPersonaSelectValueValid(value.country, PERSONA_COUNTRY_OPTIONS)) {
    errors.country = PERSONA_EMPTY_FIELD_MESSAGE;
  } else {
    const provinceOptions = getPersonaProvinceOptions(value.country);
    const province = provinceOptions.includes(value.province)
      ? value.province
      : "";
    if (!province) {
      errors.province = PERSONA_EMPTY_FIELD_MESSAGE;
    } else {
      const cityOptions = getPersonaCityOptions(value.country, province);
      if (!isPersonaSelectValueValid(value.city, cityOptions)) {
        errors.city = PERSONA_EMPTY_FIELD_MESSAGE;
      }
    }
  }
  if (!isPersonaSelectValueValid(value.job, PERSONA_JOB_OPTIONS)) {
    errors.job = PERSONA_EMPTY_FIELD_MESSAGE;
  }
  if (!isPersonaSelectValueValid(value.incomeLevel, PERSONA_INCOME_OPTIONS)) {
    errors.incomeLevel = PERSONA_EMPTY_FIELD_MESSAGE;
  }

  return errors;
}

export function isPersonaFieldsEmpty(value: PersonaFieldsValue): boolean {
  return Object.keys(getPersonaFieldsValidationErrors(value)).length > 0;
}
