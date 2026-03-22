"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

const DEBOUNCE_MS = 300;

/**
 * Search field whose value is driven by the `search` URL param. Typing updates the
 * query string after a short debounce; other params (e.g. `tag`) are preserved and
 * `page` is cleared when the search text changes.
 */
export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const committedSearch = searchParams.get("search") ?? "";
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const el = inputRef.current;
    if (!el || document.activeElement === el) return;
    el.value = committedSearch;
  }, [committedSearch]);

  useEffect(() => {
    return () => window.clearTimeout(debounceRef.current);
  }, []);

  const pushSearch = useCallback(() => {
    const raw = inputRef.current?.value ?? "";
    const q = raw.trim();
    const next = new URLSearchParams(searchParams.toString());
    const prevSearch = (searchParams.get("search") ?? "").trim();
    if (q) {
      next.set("search", q);
    } else {
      next.delete("search");
    }
    if (q !== prevSearch) {
      next.delete("page");
    }
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }, [pathname, router, searchParams]);

  const onChange = useCallback(() => {
    window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(pushSearch, DEBOUNCE_MS);
  }, [pushSearch]);

  return (
    <div className="w-full max-w-xl">
      <label htmlFor="marketplace-search" className="sr-only">
        Search products
      </label>
      <input
        id="marketplace-search"
        ref={inputRef}
        type="search"
        name="search"
        defaultValue={committedSearch}
        placeholder="Search Canadian products…"
        onChange={onChange}
        className="w-full rounded-lg border border-charcoal/15 bg-white px-4 py-2.5 text-sm text-charcoal shadow-sm placeholder:text-charcoal/40 focus:border-maple focus:outline-none focus:ring-2 focus:ring-maple/20"
      />
    </div>
  );
}
