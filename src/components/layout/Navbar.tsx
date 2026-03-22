"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

import { signOutAction } from "~/app/actions/auth";
import { UserRole } from "../../../generated/prisma";

export function Navbar() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const isBusiness = user?.role === UserRole.BUSINESS;

  return (
    <header className="sticky top-0 z-50 border-b border-charcoal/10 bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/80">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3"
        aria-label="Main"
      >
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight text-charcoal"
        >
          <span aria-hidden className="text-xl">
            🍁
          </span>
          <span className="hidden sm:inline">Maple Tariff Disruptors</span>
          <span className="sm:hidden">Maple</span>
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
          {status === "loading" ? (
            <span className="h-9 w-20 animate-pulse rounded-lg bg-charcoal/10" />
          ) : user ? (
            <>
              {isBusiness ? (
                <Link
                  href="/business/dashboard"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-charcoal transition hover:bg-charcoal/5"
                >
                  Business dashboard
                </Link>
              ) : (
                <Link
                  href="/marketplace"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-charcoal transition hover:bg-charcoal/5"
                >
                  Marketplace
                </Link>
              )}
              <span className="hidden text-sm text-charcoal/70 md:inline">
                <span className="font-medium text-charcoal">{user.username}</span>
                <span className="ml-1.5 rounded bg-charcoal/10 px-1.5 py-0.5 text-xs uppercase tracking-wide">
                  {user.role.toLowerCase()}
                </span>
              </span>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="rounded-lg border border-charcoal/20 bg-white px-3 py-2 text-sm font-semibold text-charcoal transition hover:bg-charcoal/5"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-charcoal transition hover:bg-charcoal/5"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-maple px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-maple/90"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
