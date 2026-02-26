import { useInfiniteQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import { queryKeys } from '@/lib/query/query-keys';
import type { Review } from '@/types/review';
import type { PaginatedResponse } from '@/types/api';

export function useReviews(brandId: number) {
  return useInfiniteQuery({
    queryKey: queryKeys.reviews.list(brandId),
    queryFn: ({ pageParam }) => {
      const params = new URLSearchParams();
      params.set('brandId', String(brandId));
      if (pageParam) params.set('cursor', String(pageParam));
      return apiFetch<PaginatedResponse<Review>>(`/reviews?${params.toString()}`);
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}
