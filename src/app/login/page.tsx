"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import { Suspense, useState } from "react";

import { UserRole } from "../../../generated/prisma";

function safeCallbackPath(raw: string | null): string | null {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return null;
  return raw;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const result = await signIn("credentials", {
        username: email.trim(),
        password,
        redirect: false,
      });
      if (result?.error) {
        setError("Invalid email or password.");
        return;
      }
      const session = await getSession();
      const role = session?.user?.role ?? UserRole.CUSTOMER;
      const callbackUrl = safeCallbackPath(searchParams.get("callbackUrl"));
      const defaultPath =
        role === UserRole.BUSINESS
          ? "/business/dashboard"
          : "/marketplace";
      router.push(callbackUrl ?? defaultPath);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="w-full max-w-sm rounded-xl bg-white/10 p-8 shadow-lg backdrop-blur">
      <h1 className="mb-6 text-center text-2xl font-bold tracking-tight">
        Log in
      </h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-white/80">Email</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-white/40 focus:border-[hsl(280,100%,70%)] focus:outline-none focus:ring-1 focus:ring-[hsl(280,100%,70%)]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-white/80">Password</span>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-white/40 focus:border-[hsl(280,100%,70%)] focus:outline-none focus:ring-1 focus:ring-[hsl(280,100%,70%)]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error ? (
          <p className="text-sm text-red-300" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="mt-2 rounded-lg bg-[hsl(280,100%,70%)] px-4 py-2 font-semibold text-[#15162c] transition hover:brightness-110 disabled:opacity-50"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-white/70">
        No account?{" "}
        <Link
          href="/register"
          className="font-medium text-[hsl(280,100%,70%)] hover:underline"
        >
          Register
        </Link>
      </p>
      <p className="mt-4 text-center">
        <Link href="/" className="text-sm text-white/50 hover:text-white/80">
          ← Back home
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] px-4 text-white">
      <Suspense
        fallback={
          <div className="w-full max-w-sm rounded-xl bg-white/10 p-8 text-center text-white/70 backdrop-blur">
            Loading…
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
