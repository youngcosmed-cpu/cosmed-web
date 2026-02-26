import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { queryKeys } from '@/lib/query/query-keys';
import type { InquiryDetail } from '@/types/inquiry';

export function useInquiry(id: number) {
  return useQuery({
    queryKey: queryKeys.inquiries.detail(id),
    queryFn: async () => {
      const { data } = await api.get<InquiryDetail>(`/inquiries/${id}`);
      return data;
    },
    enabled: id > 0,
  });
}
