import { Suspense } from "react";

import { ProductGrid } from "~/components/customer/ProductGrid";
import { SearchBar } from "~/components/customer/SearchBar";

export default function MarketplacePage() {
  return (
    <main className="min-h-screen bg-cream px-4 py-10 text-charcoal">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header>
          <h1 className="text-2xl font-bold tracking-tight">Marketplace</h1>
          <p className="mt-1 text-sm text-charcoal/70">
            Discover products from Canadian businesses.
          </p>
        </header>

        <Suspense
          fallback={
            <div className="flex flex-col gap-8">
              <div className="h-11 max-w-xl animate-pulse rounded-lg bg-charcoal/10" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-72 animate-pulse rounded-xl border border-charcoal/10 bg-charcoal/5"
                  />
                ))}
              </div>
            </div>
          }
        >
          <div className="flex flex-col gap-8">
            <SearchBar />
            <ProductGrid />
          </div>
        </Suspense>
      </div>
    </main>
  );
}
