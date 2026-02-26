import { useInfiniteQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import type { Brand } from '@/types/brand';
import type { PaginatedResponse } from '@/types/api';

export function useBrands(categoryId?: number) {
  return useInfiniteQuery({
    queryKey: ['brands', 'list', categoryId],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      if (typeof categoryId === 'number' && categoryId > 0) {
        params.set('categoryId', String(categoryId));
      }
      if (typeof pageParam === 'number') {
        params.set('cursor', String(pageParam));
      }
      const qs = params.toString();
      const response = await apiFetch<PaginatedResponse<Brand>>(
        `/brands${qs ? `?${qs}` : ''}`,
      );

      return {
        data: Array.isArray(response?.data) ? response.data : [],
        nextCursor: response?.nextCursor ?? null,
      };
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      typeof lastPage?.nextCursor === 'number' ? lastPage.nextCursor : undefined,
  });
}
