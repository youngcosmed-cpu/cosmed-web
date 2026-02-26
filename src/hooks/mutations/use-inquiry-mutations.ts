import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { InquiryStatus } from '@/types/inquiry';

interface CreateInquiryRequest {
  brand_id: number;
  contact_method: 'whatsapp' | 'email';
  contact_value: string;
  messages: { sender_type: 'user' | 'assistant'; content: string }[];
}

export function useCreateInquiry() {
  return useMutation({
    mutationFn: async (body: CreateInquiryRequest) => {
      const { data } = await api.post('/inquiries', body);
      return data;
    },
  });
}

export function useUpdateInquiryStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: InquiryStatus }) => {
      const { data } = await api.patch(`/inquiries/${id}`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    },
  });
}
