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
    </form>
  );
}
