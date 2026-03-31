import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { queryKeys } from '@/lib/query/query-keys';
import type { SavedBuyer } from '@/types/saved-buyer';

export function useSavedBuyers() {
  return useQuery({
    queryKey: queryKeys.savedBuyers.all,
    queryFn: async () => {
      const { data } = await api.get<SavedBuyer[]>('/saved-buyers');
      return data;
    },
  });
}
