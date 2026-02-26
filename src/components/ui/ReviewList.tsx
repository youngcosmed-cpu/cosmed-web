'use client';

import Image from 'next/image';
import { useReviews } from '@/hooks/queries/use-reviews';
import type { Review } from '@/types/review';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          viewBox="0 0 24 24"
          fill={star <= rating ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.5"
          className={`w-4 h-4 ${star <= rating ? 'text-amber-400' : 'text-border-strong'}`}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function formatRelativeTime(dateStr: string) {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = now - date;

  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;

  const years = Math.floor(months / 12);
  return `${years}y ago`;
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="bg-white p-6 max-md:p-4">
      <div className="flex items-center justify-between mb-3">
        <StarRating rating={review.rating} />
        <span className="text-xs text-text-placeholder">
          {formatRelativeTime(review.createdAt)}
        </span>
      </div>
      <p className="text-[15px] text-admin-dark leading-relaxed whitespace-pre-wrap">
        {review.content}
      </p>
      {review.photos.length > 0 && (
        <div className="flex gap-2 flex-wrap mt-4">
          {review.photos.map((url, i) => (
            <div key={url} className="relative w-20 h-20">
              <Image
                src={url}
                alt={`Review photo ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ReviewList({ brandId }: { brandId: number }) {
  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useReviews(brandId);

  const reviews = data?.pages.flatMap((page) => page.data) ?? [];

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 animate-pulse">
            <div className="h-4 w-24 bg-bg-input rounded mb-3" />
            <div className="h-4 w-full bg-bg-input rounded mb-2" />
            <div className="h-4 w-3/4 bg-bg-input rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="space-y-3">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
      {hasNextPage && (
        <div className="text-center mt-6">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-8 py-3 border border-border-light text-sm text-text-label font-medium hover:bg-bg-input transition-colors duration-200 disabled:opacity-50"
          >
            {isFetchingNextPage ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
