import { useInfiniteQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import type { Brand } from '@/types/brand';
import type { PaginatedResponse } from '@/types/api';

export function useBrands(categoryId?: number) {
  return useInfiniteQuery({
    queryKey: ['brands', categoryId],
    queryFn: ({ pageParam }) => {
      const params = new URLSearchParams();
      if (categoryId) params.set('categoryId', String(categoryId));
      if (pageParam) params.set('cursor', String(pageParam));
      const qs = params.toString();
      return apiFetch<PaginatedResponse<Brand>>(`/brands${qs ? `?${qs}` : ''}`);
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}
