import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { queryKeys } from '@/lib/query/query-keys';
import type { Brand } from '@/types/brand';

export function useBrand(id: number | null) {
  return useQuery({
    queryKey: queryKeys.brands.detail(id),
    queryFn: async () => {
      const { data } = await api.get<Brand>(`/brands/${id}`);
      return data;
    },
    enabled: id !== null,
  });
}
