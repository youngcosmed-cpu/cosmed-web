import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { ChatRequest, ChatResponse } from '@/types/chat';

export function useSendMessage() {
  return useMutation({
    mutationFn: async (body: ChatRequest) => {
      const { data } = await api.post<ChatResponse>('/chat', body);
      return data;
    },
  });
}
