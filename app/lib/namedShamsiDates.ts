export type NamedShamsiDateEntry = {
  name: string;
  date: string;
};

export type NamedShamsiDatesValue = {
  events: NamedShamsiDateEntry[];
};

export const EMPTY_NAMED_SHAMSI_DATES: NamedShamsiDatesValue = {
  events: [{ name: "", date: "" }],
};

export function parseNamedShamsiDatesValue(
  value: string | string[] | undefined,
): NamedShamsiDatesValue {
  if (!value || Array.isArray(value)) {
    return { events: [{ name: "", date: "" }] };
  }

  try {
    const parsed = JSON.parse(value) as Partial<NamedShamsiDatesValue>;
    const events = Array.isArray(parsed.events)
      ? parsed.events
          .filter((event) => event && typeof event === "object")
          .map((event) => ({
            name: typeof event.name === "string" ? event.name : "",
            date: typeof event.date === "string" ? event.date : "",
          }))
      : [];

    return events.length > 0 ? { events } : { events: [{ name: "", date: "" }] };
  } catch {
    return { events: [{ name: "", date: "" }] };
  }
}

export function serializeNamedShamsiDatesValue(value: NamedShamsiDatesValue): string {
  return JSON.stringify(value);
}

export function isNamedShamsiDateEntryComplete(entry: NamedShamsiDateEntry): boolean {
  return Boolean(entry.name.trim() && entry.date.trim());
}

export function isNamedShamsiDateEntryPartial(entry: NamedShamsiDateEntry): boolean {
  const hasName = Boolean(entry.name.trim());
  const hasDate = Boolean(entry.date.trim());
  return hasName !== hasDate;
}

export function isNamedShamsiDatesEmpty(value: NamedShamsiDatesValue): boolean {
  return !value.events.some(isNamedShamsiDateEntryComplete);
}

export function hasIncompleteNamedShamsiDates(value: NamedShamsiDatesValue): boolean {
  return value.events.some(isNamedShamsiDateEntryPartial);
}
