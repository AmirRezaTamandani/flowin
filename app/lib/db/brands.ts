import type { Brand } from "@/app/lib/api/types";
import { readStore, updateStore } from "./store";

function nowIso() {
  return new Date().toISOString();
}

export async function getBrandByUserId(userId: string): Promise<Brand | null> {
  const store = await readStore();
  return store.brands.find((brand) => brand.userId === userId) ?? null;
}

export async function createBrand(
  userId: string,
  input: { name?: string; websiteUrl?: string } = {},
): Promise<Brand | "conflict"> {
  let created: Brand | "conflict" = "conflict";
  await updateStore((store) => {
    if (store.brands.some((brand) => brand.userId === userId)) {
      created = "conflict";
      return;
    }
    const timestamp = nowIso();
    const brand: Brand = {
      id: crypto.randomUUID(),
      userId,
      name: input.name?.trim() || null,
      websiteUrl: input.websiteUrl?.trim() || null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    store.brands.push(brand);
    created = brand;
  });
  return created;
}

export async function getBrandForUser(
  brandId: string,
  userId: string,
): Promise<Brand | null> {
  const store = await readStore();
  const brand = store.brands.find((item) => item.id === brandId);
  if (!brand || brand.userId !== userId) return null;
  return brand;
}
