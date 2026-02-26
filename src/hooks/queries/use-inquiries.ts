import { useInfiniteQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import type { InquiryListItem } from '@/types/inquiry';
import type { PaginatedResponse } from '@/types/api';

interface UseInquiriesParams {
  status?: string;
  contactMethod?: string;
}

export function useInquiries(params?: UseInquiriesParams) {
  return useInfiniteQuery({
    queryKey: ['inquiries', params?.status, params?.contactMethod],
    queryFn: ({ pageParam }) => {
      const searchParams = new URLSearchParams();
      if (params?.status) searchParams.set('status', params.status);
      if (params?.contactMethod) searchParams.set('contactMethod', params.contactMethod);
      if (pageParam) searchParams.set('cursor', String(pageParam));
      const qs = searchParams.toString();
      return apiFetch<PaginatedResponse<InquiryListItem>>(`/inquiries${qs ? `?${qs}` : ''}`);
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}
