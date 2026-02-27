import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { queryKeys } from '@/lib/query/query-keys';
import type { Category } from '@/types/brand';

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: async () => {
      const { data } = await api.get<{ data: Category[] }>('/categories');
      return data;
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: { name: string; sortOrder?: number }) => {
      const { data } = await api.post<Category>('/categories', body);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...body
    }: {
      id: number;
      name?: string;
      sortOrder?: number;
    }) => {
      const { data } = await api.patch<Category>(`/categories/${id}`, body);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });
}

export function useReorderCategories() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderedIds: number[]) => {
      await api.patch('/categories/reorder', { orderedIds });
    },
    onMutate: async (orderedIds) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.categories.all });
      const previous =
        queryClient.getQueryData<{ data: Category[] }>(
          queryKeys.categories.all,
        );
      if (previous) {
        const reordered = orderedIds
          .map((id, index) => {
            const cat = previous.data.find((c) => c.id === id);
            return cat ? { ...cat, sortOrder: index } : null;
          })
          .filter((c): c is Category => c !== null);
        queryClient.setQueryData(queryKeys.categories.all, {
          data: reordered,
        });
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.categories.all, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });
}
