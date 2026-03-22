"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "~/components/ui/Button";
import { StarRating } from "~/components/ui/StarRating";

export type ReviewFormProps = {
  productId: string;
};

/**
 * Star rating + review body; POSTs to `/api/products/[id]/reviews` and refreshes the page on success.
 */
export function ReviewForm({ productId }: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
import { useState } from "react";

import { StarRating } from "~/components/ui/StarRating";

type ReviewFormProps = {
  productId: string;
  /** Called after a successful submit so the parent can reload reviews. */
  onSuccess?: () => void;
};

/**
 * Lets a signed-in customer submit a 1–5 star rating and written review via
 * `POST /api/products/[id]/reviews`.
 */
export function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (rating < 1 || rating > 5) {
      setError("Please choose a star rating.");
      return;
    }
    if (!body.trim()) {
      setError("Please write a short review.");
      return;
    }

    setPending(true);
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, body }),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(json.error ?? "Could not submit review.");
        return;
      }
      setBody("");
      setRating(5);
      router.refresh();
    } finally {
      setLoading(false);
        body: JSON.stringify({ rating, body: body.trim() }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Could not submit your review.");
        return;
      }
      setRating(0);
      setBody("");
      onSuccess?.();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-charcoal/10 bg-white p-8 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-charcoal">Write a review</h2>
      <div className="mt-4 flex flex-col gap-2">
        <span className="text-sm font-medium text-charcoal">Rating</span>
        <StarRating value={rating} onChange={setRating} />
      </div>
      <label htmlFor="review-body" className="mt-4 block text-sm font-medium text-charcoal">
        Your review
      </label>
      <textarea
        id="review-body"
        name="body"
        rows={4}
        required
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="mt-2 w-full rounded-lg border border-charcoal/15 px-3 py-2 text-sm text-charcoal shadow-sm placeholder:text-charcoal/40 focus:border-maple focus:outline-none focus:ring-2 focus:ring-maple/20"
        placeholder="Share what you liked about this product…"
        maxLength={10_000}
      />
      {error && (
        <p className="mt-2 text-sm text-red-800" role="alert">
          {error}
        </p>
      )}
      <div className="mt-4">
        <Button type="submit" variant="primary" isLoading={loading}>
          Submit review
        </Button>
      </div>
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <p className="mb-1 text-sm font-medium text-charcoal">Your rating</p>
        <StarRating value={rating} onChange={setRating} />
      </div>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-charcoal">Review</span>
        <textarea
          required
          rows={4}
          className="rounded-lg border border-charcoal/15 px-3 py-2 text-charcoal focus:border-maple focus:outline-none focus:ring-1 focus:ring-maple"
          placeholder="What did you think of this product?"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </label>
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-lg bg-maple px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-95 disabled:opacity-50"
      >
        {pending ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}
