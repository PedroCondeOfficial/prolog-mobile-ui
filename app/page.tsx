"use client";

import { useRef, useState } from "react";
import CategoryTable from "./components/CategoryTable";
import CircuitLoader from "./components/CircuitLoader";
import { CategorySummary, fetchInventory } from "./lib/inventory";

export default function Home() {
  const [categories, setCategories] = useState<CategorySummary[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  async function handleFetch() {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const data = await fetchInventory(controller.signal);
      setCategories(data.categories);
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setError((err as Error).message || "Something went wrong");
    } finally {
      if (abortRef.current === controller) setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-10 sm:px-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Inventory by Category</h1>
          <p className="text-sm text-zinc-500">Tap a row to see its items.</p>
        </div>
        <button
          type="button"
          onClick={handleFetch}
          disabled={loading}
          className="h-11 rounded-full bg-emerald-600 px-6 font-medium text-white shadow transition hover:bg-emerald-500 active:scale-95 disabled:opacity-60"
        >
          {loading ? "Fetching…" : categories ? "Refresh" : "Fetch data"}
        </button>
      </header>

      {error && (
        <div role="alert" className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
          {error}
        </div>
      )}

      {categories ? (
        <CategoryTable categories={categories} />
      ) : (
        !error && (
          <p className="py-16 text-center text-zinc-500">
            Press <span className="font-medium">Fetch data</span> to load categories.
          </p>
        )
      )}

      {loading && <CircuitLoader />}
    </main>
  );
}
