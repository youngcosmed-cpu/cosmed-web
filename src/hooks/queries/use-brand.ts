import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { Brand } from '@/types/brand';

export function useBrand(id: number | null) {
  return useQuery({
    queryKey: ['brands', id],
    queryFn: async () => {
      const { data } = await api.get<Brand>(`/brands/${id}`);
      return data;
    },
    enabled: id !== null,
  });
}
