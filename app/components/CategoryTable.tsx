"use client";

import { Fragment, useState } from "react";
import { CategorySummary, currency, formatDate } from "../lib/inventory";

export default function CategoryTable({ categories }: { categories: CategorySummary[] }) {
  const [open, setOpen] = useState<string | null>(null);

  if (categories.length === 0) {
    return <p className="py-10 text-center text-zinc-500">No categories returned.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="bg-zinc-100 text-xs uppercase tracking-wide text-zinc-500 dark:bg-zinc-900">
          <tr>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3 text-right">Total value</th>
            <th className="px-4 py-3 text-right">Available</th>
            <th className="px-4 py-3">Most recently updated</th>
            <th className="px-4 py-3 text-right">Items</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {categories.map((c) => {
            const isOpen = open === c.category;
            return (
              <Fragment key={c.category}>
                <tr
                  onClick={() => setOpen(isOpen ? null : c.category)}
                  className="cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/60"
                  aria-expanded={isOpen}
                >
                  <td className="px-4 py-3 font-medium">
                    <span className="mr-2 inline-block w-3 text-zinc-400">{isOpen ? "▾" : "▸"}</span>
                    {c.category}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {currency.format(c.totalInventoryValue)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{c.availableRecordCount}</td>
                  <td className="px-4 py-3">
                    {c.mostRecentlyUpdated ? (
                      <>
                        <div>{c.mostRecentlyUpdated.name}</div>
                        <div className="text-xs text-zinc-500">
                          {formatDate(c.mostRecentlyUpdated.lastUpdated)}
                        </div>
                      </>
                    ) : (
                      <span className="text-zinc-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{c.items.length}</td>
                </tr>

                {isOpen && (
                  <tr className="bg-zinc-50 dark:bg-zinc-900/40">
                    <td colSpan={5} className="px-4 py-3">
                      <table className="w-full text-xs">
                        <thead className="text-zinc-500">
                          <tr>
                            <th className="py-1 pr-3 text-left">ID</th>
                            <th className="py-1 pr-3 text-left">Name</th>
                            <th className="py-1 pr-3 text-right">Price</th>
                            <th className="py-1 pr-3 text-right">Qty</th>
                            <th className="py-1 text-left">Last updated</th>
                          </tr>
                        </thead>
                        <tbody>
                          {c.items.map((item) => (
                            <tr key={item.id}>
                              <td className="py-1 pr-3 font-mono text-zinc-500">{item.id}</td>
                              <td className="py-1 pr-3">{item.name}</td>
                              <td className="py-1 pr-3 text-right tabular-nums">
                                {currency.format(item.price)}
                              </td>
                              <td className="py-1 pr-3 text-right tabular-nums">{item.quantity}</td>
                              <td className="py-1">{formatDate(item.lastUpdated)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
