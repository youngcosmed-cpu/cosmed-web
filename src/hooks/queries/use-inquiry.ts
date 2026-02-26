import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import { queryKeys } from '@/lib/query/query-keys';
import type { InquiryDetail } from '@/types/inquiry';

export function useInquiry(id: number) {
  return useQuery({
    queryKey: queryKeys.inquiries.detail(id),
    queryFn: () => apiFetch<InquiryDetail>(`/inquiries/${id}`),
    enabled: id > 0,
  });
}
