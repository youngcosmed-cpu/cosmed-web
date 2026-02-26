'use client';

import { Suspense, useState, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useBrands } from '@/hooks/queries/use-brands';
import { useBrand } from '@/hooks/queries/use-brand';
import { useSendMessage } from '@/hooks/mutations/use-chat';
import { useCreateInquiry } from '@/hooks/mutations/use-inquiry-mutations';
import { ChatMessages } from '@/components/chat/ChatMessages';
import { ChatInput } from '@/components/chat/ChatInput';
import { ContactForm } from '@/components/chat/ContactForm';
import { SuccessModal } from '@/components/chat/SuccessModal';
import type { Message } from '@/components/chat/ChatMessages';

function ChatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const brandIdParam = searchParams.get('brandId');
  const brandId = brandIdParam ? Number(brandIdParam) : null;

  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(brandId);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const { data: brandsPages, isLoading: brandsLoading } = useBrands();
  const { data: brand, isLoading: brandLoading } = useBrand(brandId);
  const sendMessage = useSendMessage();
  const createInquiry = useCreateInquiry();

  // Initialize with greeting messages
  useEffect(() => {
    if (initialized) return;

    if (brandId) {
      if (brandLoading || !brand) return;
      setMessages([
        {
          sender_type: 'assistant',
          content: `Welcome! Here's the product you're interested in.`,
          brandCard: brand,
        },
        {
          sender_type: 'assistant',
          content: `Feel free to ask anything about ${brand.name} — ingredients, certifications, product benefits, and more!`,
        },
      ]);
      setSelectedBrandId(brandId);
      setInitialized(true);
    } else {
      if (brandsLoading) return;
      const brands = brandsPages?.pages.flatMap((p) => p.data) ?? [];
      setMessages([
        {
          sender_type: 'assistant',
          content: `Nice to meet you! This is Young Cosmed, a professional global K-beauty wholesale platform.\n\nWhich brand are you interested in?`,
          brands: brands.length > 0 ? brands : undefined,
        },
      ]);
      setInitialized(true);
    }
  }, [brandId, brand, brandLoading, brandsPages, brandsLoading, initialized]);

  const handleSelectBrand = useCallback(
    (b: typeof brand & { id: number; name: string }) => {
      setSelectedBrandId(b.id);
      const text = `I'm interested in ${b.name}`;
      const userMsg: Message = { sender_type: 'user', content: text };
      setMessages((prev) => [...prev, userMsg]);

      sendMessage.mutate(
        {
          brand_id: b.id,
          message: text,
          conversation_history: [],
        },
        {
          onSuccess: (data) => {
            const assistantMsg: Message = {
              sender_type: 'assistant',
              content: data.reply,
            };
            setMessages((prev) => [...prev, assistantMsg]);
            if (data.show_contact_form) {
              setTimeout(() => setShowContactForm(true), 800);
            }
          },
        },
      );
    },
    [sendMessage],
  );

  const handleSendMessage = useCallback(
    (text: string) => {
      if (!selectedBrandId) return;

      const userMsg: Message = { sender_type: 'user', content: text };
      setMessages((prev) => [...prev, userMsg]);

      sendMessage.mutate(
        {
          brand_id: selectedBrandId,
          message: text,
          conversation_history: messages
            .filter((m) => m.content)
            .map((m) => ({ sender_type: m.sender_type, content: m.content })),
        },
        {
          onSuccess: (data) => {
            const assistantMsg: Message = {
              sender_type: 'assistant',
              content: data.reply,
            };
            setMessages((prev) => [...prev, assistantMsg]);
            if (data.show_contact_form) {
              setTimeout(() => setShowContactForm(true), 800);
            }
          },
        },
      );
    },
    [selectedBrandId, messages, sendMessage],
  );

  const handleSubmitContact = (method: 'whatsapp' | 'email', value: string) => {
    if (!selectedBrandId) return;

    createInquiry.mutate(
      {
        brand_id: selectedBrandId,
        contact_method: method,
        contact_value: value,
        messages: messages
          .filter((m) => m.content)
          .map((m) => ({ sender_type: m.sender_type, content: m.content })),
      },
      {
        onSuccess: () => {
          setShowContactForm(false);
          setShowSuccess(true);
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border-light bg-white shrink-0">
        <Link
          href="/"
          className="text-sm text-text-label hover:text-admin-dark transition-colors"
        >
          ← Back to Home
        </Link>
        <span className="font-display text-base font-bold text-admin-dark">
          Young Cosmed
        </span>
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          Online
        </div>
      </header>

      {/* Messages */}
      <ChatMessages
        messages={messages}
        isLoading={sendMessage.isPending}
        onSelectBrand={handleSelectBrand}
      />

      {/* Contact Form */}
      {showContactForm && (
        <ContactForm
          onSubmit={handleSubmitContact}
          isLoading={createInquiry.isPending}
        />
      )}

      {/* Input */}
      <ChatInput
        onSend={handleSendMessage}
        disabled={sendMessage.isPending || !selectedBrandId || showContactForm}
      />

      {/* Success Modal */}
      {showSuccess && (
        <SuccessModal
          onClose={() => setShowSuccess(false)}
          onBrowseMore={() => router.push('/')}
        />
      )}
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense>
      <ChatContent />
    </Suspense>
  );
}
