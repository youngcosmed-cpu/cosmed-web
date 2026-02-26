import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import type { InquiryDetail } from '@/types/inquiry';

export function useInquiry(id: number) {
  return useQuery({
    queryKey: ['inquiries', id],
    queryFn: () => apiFetch<InquiryDetail>(`/inquiries/${id}`),
    enabled: id > 0,
  });
}
