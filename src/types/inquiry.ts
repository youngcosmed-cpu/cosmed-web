export type InquiryStatus = 'new' | 'reviewed' | 'responded';
export type ContactMethod = 'whatsapp' | 'email';

export interface ConversationMessage {
  type: 'user' | 'assistant';
  content: string;
  time: string;
}

export interface Inquiry {
  id: number;
  productName: string;
  productCategory: string;
  productImage: string;
  status: InquiryStatus;
  contactMethod: ContactMethod;
  contactValue: string;
  timestamp: string;
  conversation: ConversationMessage[];
}
