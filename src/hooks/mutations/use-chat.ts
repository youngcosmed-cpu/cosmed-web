import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

interface ChatRequest {
  brand_id: number;
  message: string;
  conversation_history?: { sender_type: 'user' | 'assistant'; content: string }[];
  lang?: 'en' | 'ko';
}

interface ChatResponse {
  reply: string;
  show_contact_form: boolean;
}

export function useSendMessage() {
  return useMutation({
    mutationFn: async (body: ChatRequest) => {
      const { data } = await api.post<ChatResponse>('/chat', body);
      return data;
    },
  });
}
