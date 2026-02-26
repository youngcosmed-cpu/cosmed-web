'use client';

import { useState, use } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useInquiry } from '@/hooks/queries/use-inquiry';
import { useUpdateInquiryStatus } from '@/hooks/mutations/use-inquiry-mutations';
import type { InquiryStatus } from '@/types/inquiry';

const statusLabels: Record<InquiryStatus, string> = {
  new_inquiry: '신규',
  reviewed: '검토중',
  responded: '응답완료',
};

function isPriceMessage(content: string) {
  const lower = content.toLowerCase();
  return (
    lower.includes('price') ||
    lower.includes('cost') ||
    lower.includes('pricing') ||
    lower.includes('how much') ||
    content.includes('가격') ||
    content.includes('얼마')
  );
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
}

interface InquiryDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function InquiryDetailPage({ params }: InquiryDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data: inquiry, isLoading } = useInquiry(Number(id));
  const updateStatus = useUpdateInquiryStatus();
  const [copied, setCopied] = useState(false);

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpdateStatus = (status: InquiryStatus) => {
    if (!inquiry) return;
    updateStatus.mutate({ id: inquiry.id, status });
  };

  if (isLoading || !inquiry) {
    return (
      <div className="p-8 max-md:p-5">
        <div className="flex items-center justify-center py-20">
          <span className="font-body text-sm text-text-muted">로딩 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-md:p-5">
      {/* Back Button */}
      <button
        onClick={() => router.push('/admin/inquiries')}
        className="font-body text-sm text-text-label hover:text-admin-dark transition-colors cursor-pointer mb-6"
      >
        &larr; 목록으로
      </button>

      {/* Two Column Grid */}
      <div className="grid grid-cols-[340px_1fr] gap-10 max-lg:grid-cols-[300px_1fr] max-lg:gap-7 max-md:grid-cols-1">
        {/* Left: Brand Panel */}
        <div className="bg-white border border-border-strong rounded-2xl p-8 self-start">
          <div className="w-full aspect-square rounded-xl bg-bg-light overflow-hidden relative flex items-center justify-center font-display text-2xl text-admin-nav mb-6">
            {inquiry.brand.imageUrl ? (
              <Image
                src={inquiry.brand.imageUrl}
                alt={inquiry.brand.name}
                fill
                sizes="340px"
                className="object-cover"
              />
            ) : (
              inquiry.brand.name
            )}
          </div>

          <h3 className="font-display text-xl font-bold text-admin-dark mb-1">
            {inquiry.brand.name}
          </h3>
          <p className="font-body text-sm text-text-muted mb-8">
            {inquiry.brand.category.name}
          </p>

          {/* Status Buttons */}
          <div className="border-t border-border pt-6 mb-6">
            <span className="block font-body text-xs font-bold uppercase tracking-wider text-text-label mb-3">
              상태 변경
            </span>
            <div className="flex gap-2">
              {(['new_inquiry', 'reviewed', 'responded'] as InquiryStatus[]).map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => handleUpdateStatus(status)}
                    className={`flex-1 py-2.5 px-3 rounded-lg font-body text-xs font-medium transition-colors cursor-pointer ${
                      inquiry.status === status
                        ? 'bg-admin-dark text-white font-semibold'
                        : 'bg-white border border-border-strong text-text-strong hover:border-text-placeholder'
                    }`}
                  >
                    {statusLabels[status]}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Interested Products */}
          {inquiry.products && inquiry.products.length > 0 && (
            <div className="mb-6">
              <span className="block font-body text-xs font-bold uppercase tracking-wider text-text-label mb-3">
                관심 제품
              </span>
              <div className="flex flex-col gap-2">
                {inquiry.products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-bg-input border border-border-strong rounded-lg px-4 py-3"
                  >
                    <p className="font-body text-sm font-semibold text-admin-dark">
                      {product.name}
                    </p>
                    {product.description && (
                      <p className="font-body text-xs text-text-muted mt-1 whitespace-pre-line break-words">
                        {product.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Info */}
          <div>
            <span className="block font-body text-xs font-bold uppercase tracking-wider text-text-label mb-3">
              연락처 정보
            </span>
            <div className="bg-bg-input border border-border-strong rounded-xl p-5">
              <span
                className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold mb-3 ${
                  inquiry.contactMethod === 'whatsapp'
                    ? 'bg-contact-whatsapp text-contact-whatsapp-text'
                    : 'bg-contact-email text-text-strong'
                }`}
              >
                {inquiry.contactMethod === 'whatsapp' ? 'WhatsApp' : 'Email'}
              </span>
              <p className="font-body text-base font-bold text-admin-dark mb-3">
                {inquiry.contactValue}
              </p>
              <button
                onClick={() => handleCopy(inquiry.contactValue)}
                className="bg-white border border-border-medium rounded-lg px-4 py-2 font-body text-xs font-semibold text-text-strong hover:border-admin-dark hover:text-admin-dark transition-colors cursor-pointer"
              >
                {copied ? '복사됨!' : '복사'}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Conversation Timeline */}
        <div className="bg-white border border-border-strong rounded-2xl p-8">
          <h3 className="font-display text-xl font-bold text-admin-dark mb-6">
            대화 기록
          </h3>

          <div className="flex flex-col gap-4">
            {inquiry.messages.map((msg) => {
              const isPrice =
                isPriceMessage(msg.content) && msg.senderType === 'user';

              return (
                <div key={msg.id} className="flex gap-4">
                  <span className="shrink-0 w-14 font-body text-sm text-text-muted pt-4">
                    {formatTime(msg.createdAt)}
                  </span>
                  <div
                    className={`flex-1 rounded-xl px-5 py-4 ${
                      isPrice
                        ? 'bg-bg-price border border-border-price'
                        : msg.senderType === 'user'
                          ? 'bg-bg-light'
                          : 'bg-white border border-border'
                    }`}
                  >
                    {isPrice && (
                      <span className="inline-block bg-beige text-[#4A3F33] text-xs font-bold tracking-wider px-3 py-1.5 rounded-md mb-2">
                        가격 문의 발생
                      </span>
                    )}
                    <p
                      className={`font-body text-sm leading-relaxed ${
                        msg.senderType === 'user'
                          ? 'text-admin-dark'
                          : 'text-text-strong'
                      }`}
                    >
                      {msg.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
