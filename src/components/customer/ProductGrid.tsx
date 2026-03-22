"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";

import { ProductCard } from "~/components/ui/ProductCard";
import type { ProductListItem } from "~/lib/actions/products";

type ApiResponse = {
  products: ProductListItem[];
  total: number;
  page: number;
  pageSize: number;
};

/**
 * Loads `/api/products` with the current URL query (`search`, `tag`, `page`) and
 * renders a grid of product cards plus pagination links.
 */
export function ProductGrid() {
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (signal: AbortSignal) => {
    setError(null);
    const res = await fetch(
      `/api/products${queryString ? `?${queryString}` : ""}`,
      { signal },
    );
    if (!res.ok) {
      setError("Could not load products.");
      setData(null);
      return;
    }
    const json = (await res.json()) as ApiResponse;
    setData(json);
  }, [queryString]);

  useEffect(() => {
    const ac = new AbortController();
    void load(ac.signal);
    return () => ac.abort();
  }, [load]);

  if (error) {
    return (
      <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
        {error}
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { ProductCard } from "~/components/ui/ProductCard";

type ProductApiRow = {
  id: string;
  name: string;
  price: unknown;
  imageUrl: string | null;
  averageRating: number;
  business: { companyName: string };
};

type ProductsApiJson = {
  products: ProductApiRow[];
  total: number;
  page: number;
  pageSize: number;
  error?: string;
};

/**
 * Loads marketplace products from `/api/products` using the current URL search params
 * (`search`, `tag`, `page`) and renders a responsive grid with pagination controls.
 */
export function ProductGrid() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  const [data, setData] = useState<ProductsApiJson | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFetchError(null);
    const url = `/api/products${queryString ? `?${queryString}` : ""}`;
    fetch(url)
      .then(async (res) => {
        const json = (await res.json()) as ProductsApiJson & { error?: string };
        if (!res.ok) {
          throw new Error(json.error ?? "Could not load products.");
        }
        return json;
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setFetchError(e instanceof Error ? e.message : "Could not load products.");
          setData(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [queryString]);

  function goToPage(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (nextPage <= 1) params.delete("page");
    else params.set("page", String(nextPage));
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  if (loading) {
    return (
      <p className="text-sm text-charcoal/70" role="status">
        Loading products…
      </p>
    );
  }

  if (!data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-72 animate-pulse rounded-xl border border-charcoal/10 bg-charcoal/5"
          />
        ))}
      </div>
    );
  }

  const { products, total, page, pageSize } = data;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const buildHref = (pageNum: number) => {
    const next = new URLSearchParams(queryString);
    if (pageNum <= 1) {
      next.delete("page");
    } else {
      next.set("page", String(pageNum));
    }
    const qs = next.toString();
    return qs ? `/marketplace?${qs}` : "/marketplace";
  };

  if (products.length === 0) {
    return (
      <p className="rounded-lg border border-charcoal/10 bg-white px-4 py-8 text-center text-sm text-charcoal/70">
        No products match your filters. Try a different search.
  if (fetchError) {
    return (
      <p className="text-sm text-red-600" role="alert">
        {fetchError}
      </p>
    );
  }

  if (!data || data.products.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-charcoal/20 bg-cream/40 px-4 py-10 text-center text-sm text-charcoal/70">
        No products match your filters yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            id={p.id}
            name={p.name}
            price={p.price}
            imageUrl={p.imageUrl}
            averageRating={p.averageRating}
            businessName={p.business.companyName}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <nav
          className="flex flex-wrap items-center justify-center gap-2"
          aria-label="Pagination"
        >
          <PaginationLink
            href={buildHref(page - 1)}
            disabled={page <= 1}
            label="Previous page"
          >
            Previous
          </PaginationLink>
          <span className="text-sm text-charcoal/70">
            Page {page} of {totalPages}
          </span>
          <PaginationLink
            href={buildHref(page + 1)}
            disabled={page >= totalPages}
            label="Next page"
          >
            Next
          </PaginationLink>
        </nav>
      )}
    </div>
  );
}

function PaginationLink({
  href,
  disabled,
  label,
  children,
}: {
  href: string;
  disabled: boolean;
  label: string;
  children: ReactNode;
}) {
  if (disabled) {
    return (
      <span
        className="rounded-lg border border-charcoal/10 bg-charcoal/5 px-3 py-1.5 text-sm text-charcoal/35"
        aria-disabled
      >
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className="rounded-lg border border-charcoal/15 bg-white px-3 py-1.5 text-sm font-medium text-maple shadow-sm transition hover:border-maple/40"
      aria-label={label}
    >
      {children}
    </Link>
  );
}
  const { products, total, page, pageSize } = data;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="flex flex-col gap-8">
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((p) => (
          <li key={p.id}>
            <ProductCard
              id={p.id}
              name={p.name}
              price={p.price as number | string}
              imageUrl={p.imageUrl}
              averageRating={p.averageRating}
              businessName={p.business.companyName}
            />
          </li>
        ))}
      </ul>

      {totalPages > 1 ? (
        <nav
          className="flex flex-wrap items-center justify-center gap-3 border-t border-charcoal/10 pt-6"
          aria-label="Product list pagination"
        >
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => goToPage(page - 1)}
            className="rounded-lg border border-charcoal/20 px-4 py-2 text-sm font-medium text-charcoal transition hover:bg-cream disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-charcoal/75">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => goToPage(page + 1)}
            className="rounded-lg border border-charcoal/20 px-4 py-2 text-sm font-medium text-charcoal transition hover:bg-cream disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </nav>
      ) : null}
    </div>
  );
}
