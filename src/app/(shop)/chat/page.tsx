import type { Metadata } from 'next';
import { ChatContent } from '@/components/chat/ChatContent';

export const metadata: Metadata = {
  title: 'Chat',
  robots: { index: false },
};

export default function ChatPage() {
  return <ChatContent />;
}
