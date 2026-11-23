export interface InventoryItem {
  id: number;
  name: string;
  category?: string;
  price: number;
  quantity: number;
  lastUpdated: string;
}

export interface CategorySummary {
  category: string;
  totalInventoryValue: number;
  availableRecordCount: number;
  mostRecentlyUpdated: Pick<InventoryItem, "id" | "name" | "lastUpdated"> | null;
  items: InventoryItem[];
}

export interface InventoryResponse {
  categories: CategorySummary[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchInventory(signal?: AbortSignal): Promise<InventoryResponse> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not set. Add it to your .env file.");
  }

  const res = await fetch(API_URL, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
    signal,
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }

  // The API returns a bare array of categories; also accept a { categories } wrapper.
  const data = (await res.json()) as CategorySummary[] | InventoryResponse;
  const categories = Array.isArray(data)
    ? data
    : Array.isArray(data?.categories)
      ? data.categories
      : [];
  return { categories };
}

export const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}
