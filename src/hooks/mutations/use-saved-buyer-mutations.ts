import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { queryKeys } from '@/lib/query/query-keys';
import type {
  SavedBuyer,
  CreateSavedBuyerPayload,
  UpdateSavedBuyerPayload,
} from '@/types/saved-buyer';

export function useCreateSavedBuyer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateSavedBuyerPayload) => {
      const { data } = await api.post<SavedBuyer>('/saved-buyers', body);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.savedBuyers.all });
    },
  });
}

export function useUpdateSavedBuyer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...body }: UpdateSavedBuyerPayload & { id: number }) => {
      const { data } = await api.patch<SavedBuyer>(`/saved-buyers/${id}`, body);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.savedBuyers.all });
    },
  });
}

export function useDeleteSavedBuyer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/saved-buyers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.savedBuyers.all });
    },
  });
}
