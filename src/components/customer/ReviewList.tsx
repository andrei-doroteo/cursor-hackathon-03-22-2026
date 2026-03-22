import { format } from "date-fns";

import { StarRating } from "~/components/ui/StarRating";
import type { ReviewWithAuthor } from "~/types";

export type ReviewListProps = {
  reviews: ReviewWithAuthor[];
};

/**
 * Displays a list of product reviews with author, stars, date, and body.

export type ReviewListItem = {
  id: string;
  authorName: string;
  rating: number;
  body: string;
  createdAt: string;
};

type ReviewListProps = {
  reviews: ReviewListItem[];
};

/**
 * Displays customer reviews with name, star rating (read-only), date, and body.
 */
export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <p className="text-sm text-charcoal/70">No reviews yet. Be the first to share your thoughts.</p>
      <p className="text-sm text-charcoal/65">No reviews yet. Be the first to share your experience.</p>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {reviews.map((r) => (
        <li
          key={r.id}
          className="rounded-lg border border-charcoal/10 bg-white px-4 py-3 shadow-sm"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-charcoal">
              {r.customer.name ?? r.customer.email ?? "Customer"}
            </span>
            <StarRating value={r.rating} className="text-maple" />
            <time
              dateTime={r.createdAt.toISOString()}
              className="text-xs text-charcoal/40"
            >
              {format(r.createdAt, "MMM d, yyyy")}
            </time>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-charcoal/85">
          className="rounded-xl border border-charcoal/10 bg-white p-4 shadow-sm"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-medium text-charcoal">{r.authorName}</p>
            <time
              className="text-xs text-charcoal/60"
              dateTime={r.createdAt}
            >
              {format(new Date(r.createdAt), "MMM d, yyyy")}
            </time>
          </div>
          <div className="mt-1">
            <StarRating value={r.rating} className="text-maple" />
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-charcoal/85">
            {r.body}
          </p>
        </li>
      ))}
    </ul>
  );
}
