export const GEO_COUNTRY_OPTIONS = [
  "ایران",
  "عراق",
  "افغانستان",
  "ترکیه",
  "پاکستان",
  "امارات متحده عربی",
  "عربستان سعودی",
  "قطر",
  "کویت",
  "عمان",
  "بحرین",
  "آذربایجان",
  "ارمنستان",
  "گرجستان",
  "آلمان",
  "انگلستان",
  "فرانسه",
  "ایتالیا",
  "اسپانیا",
  "چین",
  "ژاپن",
  "کره جنوبی",
  "هند",
  "مالزی",
  "اندونزی",
  "استرالیا",
  "کانادا",
  "ایالات متحده آمریکا",
  "مصر",
  "سایر",
] as const;

export const IRAN_PROVINCE_OPTIONS = [
  "آذربایجان شرقی",
  "آذربایجان غربی",
  "اردبیل",
  "اصفهان",
  "البرز",
  "ایلام",
  "بوشهر",
  "تهران",
  "چهارمحال و بختیاری",
  "خراسان جنوبی",
  "خراسان رضوی",
  "خراسان شمالی",
  "خوزستان",
  "زنجان",
  "سمنان",
  "سیستان و بلوچستان",
  "فارس",
  "قزوین",
  "قم",
  "کردستان",
  "کرمان",
  "کرمانشاه",
  "کهگیلویه و بویراحمد",
  "گلستان",
  "گیلان",
  "لرستان",
  "مازندران",
  "مرکزی",
  "هرمزگان",
  "همدان",
  "یزد",
] as const;

export type GeoLocationEntry = {
  country: string;
  province: string;
  city: string;
};

export type GeoLocationValue = {
  locations: GeoLocationEntry[];
};

export const EMPTY_GEO_LOCATION_ENTRY: GeoLocationEntry = {
  country: "",
  province: "",
  city: "",
};

export const EMPTY_GEO_LOCATION: GeoLocationValue = {
  locations: [{ ...EMPTY_GEO_LOCATION_ENTRY }],
};

export function parseGeoLocationValue(
  value: string | string[] | undefined,
): GeoLocationValue {
  if (!value || Array.isArray(value)) return { locations: [{ ...EMPTY_GEO_LOCATION_ENTRY }] };
  try {
    const parsed = JSON.parse(value) as Partial<GeoLocationValue>;
    const locations = Array.isArray(parsed.locations)
      ? parsed.locations.map((entry) => ({
          country: entry?.country ?? "",
          province: entry?.province ?? "",
          city: entry?.city ?? "",
        }))
      : [];
    return locations.length > 0
      ? { locations }
      : { locations: [{ ...EMPTY_GEO_LOCATION_ENTRY }] };
  } catch {
    return { locations: [{ ...EMPTY_GEO_LOCATION_ENTRY }] };
  }
}

export function serializeGeoLocationValue(value: GeoLocationValue): string {
  return JSON.stringify(value);
}

function isGeoLocationEntryComplete(entry: GeoLocationEntry): boolean {
  if (!entry.country.trim() || entry.country === "سایر") return false;
  return Boolean(entry.province.trim() && entry.city.trim());
}

export function isGeoLocationEmpty(value: GeoLocationValue): boolean {
  return !value.locations.some(isGeoLocationEntryComplete);
}

export function hasIncompleteGeoLocationEntries(value: GeoLocationValue): boolean {
  return value.locations.some((entry) => {
    const hasAny = Boolean(entry.country.trim() || entry.province.trim() || entry.city.trim());
    return hasAny && !isGeoLocationEntryComplete(entry);
  });
}

export function isIranCountry(country: string): boolean {
  return country.trim() === "ایران";
}

export function isKnownCountry(country: string): boolean {
  return GEO_COUNTRY_OPTIONS.includes(country as (typeof GEO_COUNTRY_OPTIONS)[number]);
}
