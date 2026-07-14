import fs from "node:fs/promises";
import path from "node:path";
import type { Brand, SurveySubmission } from "@/app/lib/api/types";

type Store = {
  brands: Brand[];
  submissions: SurveySubmission[];
};

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "flowin-store.json");

const emptyStore = (): Store => ({ brands: [], submissions: [] });

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readStore(): Promise<Store> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<Store>;
    return {
      brands: Array.isArray(parsed.brands) ? parsed.brands : [],
      submissions: Array.isArray(parsed.submissions) ? parsed.submissions : [],
    };
  } catch {
    return emptyStore();
  }
}

export async function writeStore(store: Store): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

export async function updateStore(
  mutator: (store: Store) => void | Promise<void>,
): Promise<Store> {
  const store = await readStore();
  await mutator(store);
  await writeStore(store);
  return store;
}
