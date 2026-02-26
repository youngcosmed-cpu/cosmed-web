import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { queryKeys } from '@/lib/query/query-keys';
import type { Review } from '@/types/review';
import type { PaginatedResponse } from '@/types/api';

export function useReviews(brandId: number) {
  return useInfiniteQuery({
    queryKey: queryKeys.reviews.list(brandId),
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      params.set('brandId', String(brandId));
      if (pageParam) params.set('cursor', String(pageParam));
      const { data } = await api.get<PaginatedResponse<Review>>(`/reviews?${params.toString()}`);
      return data;
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}
