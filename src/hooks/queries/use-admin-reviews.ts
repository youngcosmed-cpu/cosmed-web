import { useInfiniteQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import { queryKeys } from '@/lib/query/query-keys';
import type { AdminReview } from '@/types/review';
import type { PaginatedResponse } from '@/types/api';

export function useAdminReviews(brandId?: number) {
  return useInfiniteQuery({
    queryKey: queryKeys.adminReviews.list(brandId),
    queryFn: ({ pageParam }) => {
      const params = new URLSearchParams();
      if (typeof brandId === 'number') params.set('brandId', String(brandId));
      if (pageParam) params.set('cursor', String(pageParam));
      const qs = params.toString();
      return apiFetch<PaginatedResponse<AdminReview>>(
        `/reviews/admin${qs ? `?${qs}` : ''}`,
      );
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}
