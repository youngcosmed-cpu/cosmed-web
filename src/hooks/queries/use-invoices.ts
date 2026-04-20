import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { queryKeys } from '@/lib/query/query-keys';
import type {
  InvoiceListResponse,
  InvoiceStats,
  InvoiceStatsParams,
} from '@/types/invoice';

interface UseInvoicesParams {
  type?: 'PI' | 'CI';
  from?: string;
  to?: string;
}

export function useInvoices(params?: UseInvoicesParams) {
  return useInfiniteQuery({
    queryKey: queryKeys.invoices.list(params),
    queryFn: async ({ pageParam }) => {
      const search = new URLSearchParams();
      if (params?.type) search.set('type', params.type);
      if (params?.from) search.set('from', params.from);
      if (params?.to) search.set('to', params.to);
      if (pageParam) search.set('cursor', String(pageParam));
      const qs = search.toString();
      const { data } = await api.get<InvoiceListResponse>(
        `/invoices${qs ? `?${qs}` : ''}`,
      );
      return data;
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

export function useInvoiceStats(params?: InvoiceStatsParams) {
  return useQuery({
    queryKey: queryKeys.invoices.stats(params),
    queryFn: async () => {
      const search = new URLSearchParams();
      if (params?.from) search.set('from', params.from);
      if (params?.to) search.set('to', params.to);
      const qs = search.toString();
      const { data } = await api.get<InvoiceStats>(
        `/invoices/stats${qs ? `?${qs}` : ''}`,
      );
      return data;
    },
  });
}
