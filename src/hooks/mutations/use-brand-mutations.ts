import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { queryKeys } from '@/lib/query/query-keys';
import type { Brand, CreateBrandPayload, UpdateBrandPayload } from '@/types/brand';

type BrandPage = { data: Brand[]; nextCursor: number | null };

export function useCreateBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateBrandPayload) => {
      const { data } = await api.post<Brand>('/brands', body);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.all });
    },
  });
}

export function useUpdateBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...body }: UpdateBrandPayload & { id: number }) => {
      const { data } = await api.patch<Brand>(`/brands/${id}`, body);
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.detail(variables.id) });
    },
  });
}

export function useReorderBrands() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderedIds: number[]) => {
      await api.patch('/brands/reorder', { orderedIds });
    },
    onMutate: async (orderedIds) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.brands.all });

      const previousData = queryClient.getQueriesData<InfiniteData<BrandPage>>({
        queryKey: queryKeys.brands.all,
      });

      previousData.forEach(([key, data]) => {
        if (!data?.pages) return;
        const allBrands = data.pages.flatMap((p) => p.data);
        const reordered = orderedIds
          .map((id, index) => {
            const brand = allBrands.find((b) => b.id === id);
            return brand ? { ...brand, sortOrder: index } : null;
          })
          .filter((b): b is Brand => b !== null);

        queryClient.setQueryData<InfiniteData<BrandPage>>(key, {
          ...data,
          pages: data.pages.map((page, i) => ({
            ...page,
            data: i === 0 ? reordered : [],
          })),
        });
      });

      return { previousData };
    },
    onError: (_err, _vars, context) => {
      context?.previousData?.forEach(([key, data]) => {
        if (data) queryClient.setQueryData(key, data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.all });
    },
  });
}

export function useDeleteBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/brands/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.all });
    },
  });
}
