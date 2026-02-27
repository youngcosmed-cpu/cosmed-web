export type SenderType = 'user' | 'assistant';

export interface ConversationMessage {
  sender_type: SenderType;
  content: string;
}

export interface ChatRequest {
  brand_id: number;
  message: string;
  conversation_history?: ConversationMessage[];
  lang?: 'en' | 'ko';
}

export interface ChatResponse {
  reply: string;
  show_contact_form: boolean;
}
