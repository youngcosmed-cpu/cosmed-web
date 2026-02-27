export type InquiryStatus = 'new_inquiry' | 'reviewed' | 'responded';
export type ContactMethod = 'whatsapp' | 'email';
export type SenderType = 'user' | 'assistant';

export interface InquiryMessage {
  id: number;
  inquiryId: number;
  senderType: SenderType;
  content: string;
  createdAt: string;
}

export interface InquiryListItem {
  id: number;
  brandId: number;
  contactMethod: ContactMethod;
  contactValue: string;
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string;
  brand: {
    id: number;
    name: string;
    imageUrl: string | null;
    category: { id: number; name: string };
  };
  messages: [] | [InquiryMessage];
}

export interface InquiryDetail {
  id: number;
  brandId: number;
  contactMethod: ContactMethod;
  contactValue: string;
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string;
  brand: {
    id: number;
    name: string;
    imageUrl: string | null;
    category: { id: number; name: string };
  };
  messages: InquiryMessage[];
  products: { id: number; name: string; description: string | null }[];
}
