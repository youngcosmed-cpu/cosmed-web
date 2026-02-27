'use client';

import { Suspense, useState, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useBrand } from '@/hooks/queries/use-brand';
import { useSendMessage } from '@/hooks/mutations/use-chat';
import { useCreateInquiry } from '@/hooks/mutations/use-inquiry-mutations';
import { ChatMessages } from '@/components/chat/ChatMessages';
import { ChatInput } from '@/components/chat/ChatInput';
import { ContactForm } from '@/components/chat/ContactForm';
import { SuccessModal } from '@/components/chat/SuccessModal';
import type { Message } from '@/components/chat/ChatMessages';

function ChatContentInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const brandIdParam = searchParams.get('brandId');
  const brandId = brandIdParam ? Number(brandIdParam) : null;
  const productIdsParam = searchParams.get('productIds');
  const urlProductIds = productIdsParam
    ? productIdsParam.split(',').map(Number).filter((n) => !isNaN(n) && n > 0)
    : [];

  const [messages, setMessages] = useState<Message[]>([]);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Hooks
  const { data: brand, isLoading: brandLoading } = useBrand(brandId);
  const sendMessage = useSendMessage();
  const createInquiry = useCreateInquiry();

  // Redirect to home if no brandId
  useEffect(() => {
    if (!brandId) {
      router.replace('/');
    }
  }, [brandId, router]);

  // Initialize with greeting messages
  useEffect(() => {
    if (initialized || !brandId) return;
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
    setInitialized(true);
  }, [brandId, brand, brandLoading, initialized]);

  const handleSendMessage = useCallback(
    (text: string) => {
      if (!brandId) return;

      const userMsg: Message = { sender_type: 'user', content: text };
      setMessages((prev) => [...prev, userMsg]);

      sendMessage.mutate(
        {
          brand_id: brandId,
          message: text,
          conversation_history: messages
            .filter((m) => m.content)
            .map((m) => ({ sender_type: m.sender_type, content: m.content })),
        },
        {
          onSuccess: (data) => {
            setMessages((prev) => [
              ...prev,
              { sender_type: 'assistant', content: data.reply },
            ]);
            if (data.show_contact_form) {
              setTimeout(() => setShowContactForm(true), 800);
            }
          },
        },
      );
    },
    [brandId, messages, sendMessage],
  );

  const handleSubmitContact = (method: 'whatsapp' | 'email', value: string, countryCode?: string) => {
    if (!brandId) return;

    createInquiry.mutate(
      {
        brand_id: brandId,
        contact_method: method,
        contact_value: value,
        ...(countryCode && { country_code: countryCode }),
        messages: messages
          .filter((m) => m.content)
          .map((m) => ({ sender_type: m.sender_type, content: m.content })),
        ...(urlProductIds.length > 0 && { product_ids: urlProductIds }),
      },
      {
        onSuccess: () => {
          setShowContactForm(false);
          setShowSuccess(true);
          setInquirySubmitted(true);
        },
      },
    );
  };

  // Don't render chat UI if no brandId (redirecting)
  if (!brandId) return null;

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
        showContactForm={showContactForm}
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
        disabled={sendMessage.isPending || showContactForm || inquirySubmitted}
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

export function ChatContent() {
  return (
    <Suspense fallback={null}>
      <ChatContentInner />
    </Suspense>
  );
}
