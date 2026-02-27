'use client';

import { Suspense, useState, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useBrands } from '@/hooks/queries/use-brands';
import { useBrand } from '@/hooks/queries/use-brand';
import { useCategories } from '@/hooks/queries/use-categories';
import { useSendMessage } from '@/hooks/mutations/use-chat';
import { useCreateInquiry } from '@/hooks/mutations/use-inquiry-mutations';
import { ChatMessages } from '@/components/chat/ChatMessages';
import { ChatInput } from '@/components/chat/ChatInput';
import { ContactForm } from '@/components/chat/ContactForm';
import { SuccessModal } from '@/components/chat/SuccessModal';
import type { Message } from '@/components/chat/ChatMessages';
import type { Brand, Category } from '@/types/brand';

type SelectionStep = 'category' | 'brand' | 'product' | 'chatting';

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
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(brandId);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Step-based selection state
  const [selectionStep, setSelectionStep] = useState<SelectionStep>(brandId ? 'chatting' : 'category');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);

  // Hooks
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const { data: categoryBrandsPages, isLoading: categoryBrandsLoading } = useBrands(selectedCategoryId ?? undefined);
  const { data: brand, isLoading: brandLoading } = useBrand(selectedBrandId);
  const sendMessage = useSendMessage();
  const createInquiry = useCreateInquiry();

  // Initialize with greeting messages
  useEffect(() => {
    if (initialized) return;

    if (brandId) {
      // URL has brandId — existing flow
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
      // No brandId — show categories
      if (categoriesLoading) return;
      const categories = categoriesData?.data ?? [];
      setMessages([
        {
          sender_type: 'assistant',
          content: `Nice to meet you! This is Young Cosmed, a professional global K-beauty wholesale platform.\n\nWhich category are you interested in?`,
          categories: categories.length > 0 ? categories : undefined,
        },
      ]);
      setInitialized(true);
    }
  }, [brandId, brand, brandLoading, categoriesData, categoriesLoading, initialized]);

  // After category selected → brands loaded → add brands message
  useEffect(() => {
    if (selectionStep !== 'brand' || categoryBrandsLoading || !selectedCategoryId) return;
    const brands = categoryBrandsPages?.pages.flatMap((p) => p.data) ?? [];
    if (brands.length === 0) return;

    // Only add if last assistant message doesn't already have brands
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (last?.brands) return prev;
      return [
        ...prev,
        {
          sender_type: 'assistant' as const,
          content: 'Great choice! Which brand would you like to explore?',
          brands,
        },
      ];
    });
  }, [selectionStep, categoryBrandsLoading, categoryBrandsPages, selectedCategoryId]);

  // After brand selected → brand detail loaded → add products message
  useEffect(() => {
    if (selectionStep !== 'product' || brandLoading || !brand) return;

    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (last?.products !== undefined) return prev;
      return [
        ...prev,
        {
          sender_type: 'assistant' as const,
          content: brand.products && brand.products.length > 0
            ? `Here are the products from ${brand.name}. Select the ones you're interested in, then click "Start Chat" to begin!`
            : `Let's discuss ${brand.name}! Click "Start Chat" to begin.`,
          products: brand.products ?? [],
        },
      ];
    });
  }, [selectionStep, brandLoading, brand]);

  const handleSelectCategory = useCallback((category: Category) => {
    setSelectedCategoryId(category.id);
    setSelectionStep('brand');
    const text = `I'm interested in ${category.name}`;
    setMessages((prev) => [...prev, { sender_type: 'user', content: text }]);
  }, []);

  const handleSelectBrand = useCallback(
    (b: Brand) => {
      setSelectedBrandId(b.id);
      const text = `I'm interested in ${b.name}`;
      const userMsg: Message = { sender_type: 'user', content: text };
      setMessages((prev) => [...prev, userMsg]);

      if (brandId) {
        // Came from URL with brandId — existing flow: send message immediately
        sendMessage.mutate(
          {
            brand_id: b.id,
            message: text,
            conversation_history: [],
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
      } else {
        // Step-based flow: move to product selection
        setSelectionStep('product');
      }
    },
    [brandId, sendMessage],
  );

  const handleToggleProduct = useCallback((productId: number) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  }, []);

  const handleStartChat = useCallback(() => {
    if (!selectedBrandId) return;

    // Mark products as confirmed in the last products message
    setMessages((prev) =>
      prev.map((msg, idx) => {
        if (idx === prev.length - 1 && msg.products !== undefined) {
          return { ...msg, productsConfirmed: true };
        }
        return msg;
      }),
    );

    // Add user summary message
    const productNames = selectedProductIds.length > 0 && brand?.products
      ? brand.products
          .filter((p) => selectedProductIds.includes(p.id))
          .map((p) => p.name)
      : [];
    const text = productNames.length > 0
      ? `I'd like to discuss: ${productNames.join(', ')}`
      : `I'd like to learn more about ${brand?.name ?? 'this brand'}`;

    setMessages((prev) => [...prev, { sender_type: 'user', content: text }]);
    setSelectionStep('chatting');

    // Send to API
    sendMessage.mutate(
      {
        brand_id: selectedBrandId,
        message: text,
        conversation_history: [],
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
  }, [selectedBrandId, selectedProductIds, brand, sendMessage]);

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
    [selectedBrandId, messages, sendMessage],
  );

  const handleSubmitContact = (method: 'whatsapp' | 'email', value: string) => {
    if (!selectedBrandId) return;

    const finalProductIds = selectedProductIds.length > 0 ? selectedProductIds : urlProductIds;

    createInquiry.mutate(
      {
        brand_id: selectedBrandId,
        contact_method: method,
        contact_value: value,
        messages: messages
          .filter((m) => m.content)
          .map((m) => ({ sender_type: m.sender_type, content: m.content })),
        ...(finalProductIds.length > 0 && { product_ids: finalProductIds }),
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
        isLoading={sendMessage.isPending || categoryBrandsLoading || (selectionStep === 'product' && brandLoading)}
        onSelectBrand={handleSelectBrand}
        onSelectCategory={handleSelectCategory}
        onToggleProduct={handleToggleProduct}
        onStartChat={handleStartChat}
        selectedProductIds={selectedProductIds}
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
        disabled={sendMessage.isPending || selectionStep !== 'chatting' || showContactForm || inquirySubmitted}
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
