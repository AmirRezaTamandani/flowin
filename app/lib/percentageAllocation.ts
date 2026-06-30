export type PercentageAllocationItem = {
  id: string;
  label: string;
  description?: string;
};

export type PercentageAllocationValue = Record<string, number>;

export function getPercentageAllocationItems(options: string[] = []): PercentageAllocationItem[] {
  const items: PercentageAllocationItem[] = [];
  for (let index = 0; index < options.length; index += 2) {
    const label = options[index];
    if (!label) continue;
    items.push({
      id: label,
      label,
      description: options[index + 1],
    });
  }
  return items;
}

export function createEmptyPercentageAllocation(
  options: string[] = [],
): PercentageAllocationValue {
  const values: PercentageAllocationValue = {};
  for (const item of getPercentageAllocationItems(options)) {
    values[item.id] = 0;
  }
  return values;
}

export function parsePercentageAllocationValue(
  value: string | string[] | undefined,
  options: string[] = [],
): PercentageAllocationValue {
  const empty = createEmptyPercentageAllocation(options);
  if (!value || Array.isArray(value)) return empty;
  try {
    const parsed = JSON.parse(value) as PercentageAllocationValue;
    const result = { ...empty };
    for (const item of getPercentageAllocationItems(options)) {
      const raw = parsed[item.id];
      result[item.id] = typeof raw === "number" && Number.isFinite(raw)
        ? Math.max(0, Math.min(100, Math.round(raw)))
        : 0;
    }
    return result;
  } catch {
    return empty;
  }
}

export function serializePercentageAllocationValue(value: PercentageAllocationValue): string {
  return JSON.stringify(value);
}

export function getPercentageAllocationTotal(value: PercentageAllocationValue): number {
  return Object.values(value).reduce((sum, amount) => sum + amount, 0);
}

export function getPercentageAllocationMaxForItem(
  itemId: string,
  value: PercentageAllocationValue,
): number {
  const othersTotal = Object.entries(value).reduce(
    (sum, [key, amount]) => (key === itemId ? sum : sum + amount),
    0,
  );
  return Math.max(0, 100 - othersTotal);
}

export function setPercentageAllocationItem(
  itemId: string,
  nextValue: number,
  value: PercentageAllocationValue,
): PercentageAllocationValue {
  const maxAllowed = getPercentageAllocationMaxForItem(itemId, value);
  const clamped = Math.max(0, Math.min(maxAllowed, Math.round(nextValue)));
  return { ...value, [itemId]: clamped };
}

export function isPercentageAllocationEmpty(
  value: PercentageAllocationValue,
  options: string[] = [],
): boolean {
  if (getPercentageAllocationItems(options).length === 0) return true;
  return getPercentageAllocationTotal(value) === 0;
}
