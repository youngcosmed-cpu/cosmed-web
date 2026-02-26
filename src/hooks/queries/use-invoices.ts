import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { queryKeys } from '@/lib/query/query-keys';
import type { CreateInvoicePayload, Invoice } from '@/types/invoice';

export function useInvoices() {
  return useQuery({
    queryKey: queryKeys.invoices.all,
    queryFn: async () => {
      const { data } = await api.get<{ data: Invoice[] }>('/invoices');
      return data;
    },
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateInvoicePayload) => {
      const { data } = await api.post<Invoice>('/invoices', body);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all });
    },
  });
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/invoices/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all });
    },
  });
}
