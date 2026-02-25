import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import type { Category } from '@/types/brand';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => apiFetch<{ data: Category[] }>('/categories'),
  });
}
