'use client';

import { useState } from 'react';
import { dummyInquiries } from '@/data/dummy-inquiries';
import type { Inquiry, InquiryStatus } from '@/types/inquiry';

type FilterType = 'all' | 'newOnly' | 'whatsapp' | 'email';

const filterLabels: Record<FilterType, string> = {
  all: '전체',
  newOnly: '신규만',
  whatsapp: 'WhatsApp',
  email: '이메일',
};

const statusLabels: Record<InquiryStatus, string> = {
  new: '신규',
  reviewed: '검토중',
  responded: '응답완료',
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function isPriceMessage(content: string) {
  const lower = content.toLowerCase();
  return (
    lower.includes('price') ||
    lower.includes('cost') ||
    lower.includes('pricing') ||
    content.includes('가격') ||
    content.includes('얼마')
  );
}

export default function InquiriesPage() {
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [inquiries, setInquiries] = useState<Inquiry[]>(dummyInquiries);
  const [copied, setCopied] = useState(false);

  const stats = {
    total: inquiries.length,
    new: inquiries.filter((i) => i.status === 'new').length,
    responded: inquiries.filter((i) => i.status === 'responded').length,
  };

  const filteredInquiries = inquiries.filter((i) => {
    if (filter === 'newOnly') return i.status === 'new';
    if (filter === 'whatsapp') return i.contactMethod === 'whatsapp';
    if (filter === 'email') return i.contactMethod === 'email';
    return true;
  });

  function handleSelectInquiry(inquiry: Inquiry) {
    setSelectedInquiry(inquiry);
    setView('detail');
  }

  function handleBack() {
    setView('list');
    setSelectedInquiry(null);
  }

  function handleUpdateStatus(id: number, status: InquiryStatus) {
    setInquiries((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status } : i)),
    );
    if (selectedInquiry?.id === id) {
      setSelectedInquiry((prev) => (prev ? { ...prev, status } : prev));
    }
  }

  function handleCopy(value: string) {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ── List View ──
  if (view === 'list') {
    return (
      <div className="p-8 max-md:p-5">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-5 mb-6 max-sm:grid-cols-1">
          <div className="bg-white border border-border-strong rounded-xl p-5">
            <span className="font-body text-xs uppercase tracking-wider text-text-label">
              전체 문의
            </span>
            <p className="font-display text-3xl font-bold text-admin-dark mt-1">
              {stats.total}
            </p>
            <span className="font-body text-xs text-text-muted">이번 주</span>
          </div>
          <div className="bg-bg-warm border border-admin-dark rounded-xl p-5">
            <span className="font-body text-xs uppercase tracking-wider text-text-label">
              신규
            </span>
            <p className="font-display text-3xl font-bold text-admin-dark mt-1">
              {stats.new}
            </p>
            <span className="font-body text-xs text-text-muted">오늘</span>
          </div>
          <div className="bg-white border border-border-strong rounded-xl p-5">
            <span className="font-body text-xs uppercase tracking-wider text-text-label">
              응답 완료
            </span>
            <p className="font-display text-3xl font-bold text-admin-dark mt-1">
              {stats.responded}
            </p>
            <span className="font-body text-xs text-text-muted">이번 주</span>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-3 flex-wrap mb-6">
          {(Object.keys(filterLabels) as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-2 rounded-lg font-body text-sm transition-colors cursor-pointer ${
                filter === f
                  ? 'bg-admin-dark text-white font-semibold'
                  : 'bg-white border border-border-strong text-text-label hover:border-text-placeholder'
              }`}
            >
              {filterLabels[f]}
            </button>
          ))}
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto max-sm:-mx-5 max-sm:px-5">
          <table className="w-full border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-border-strong">
                <th className="font-body text-xs uppercase tracking-wider text-text-muted text-left py-3 px-4">
                  상태
                </th>
                <th className="font-body text-xs uppercase tracking-wider text-text-muted text-left py-3 px-4">
                  제품
                </th>
                <th className="font-body text-xs uppercase tracking-wider text-text-muted text-left py-3 px-4">
                  연락 방법
                </th>
                <th className="font-body text-xs uppercase tracking-wider text-text-muted text-left py-3 px-4">
                  연락처
                </th>
                <th className="font-body text-xs uppercase tracking-wider text-text-muted text-left py-3 px-4">
                  문의 일시
                </th>
                <th className="font-body text-xs uppercase tracking-wider text-text-muted text-left py-3 px-4">
                  마지막 메시지
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredInquiries.map((inquiry) => (
                <tr
                  key={inquiry.id}
                  onClick={() => handleSelectInquiry(inquiry)}
                  className={`border-b border-border-light cursor-pointer hover:bg-bg-light transition-colors ${
                    inquiry.status === 'new' ? 'bg-bg-warm-row' : ''
                  }`}
                >
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold ${
                        inquiry.status === 'new'
                          ? 'bg-status-new text-status-new-text'
                          : inquiry.status === 'reviewed'
                            ? 'bg-status-reviewed text-status-reviewed-text'
                            : 'bg-status-responded text-status-responded-text'
                      }`}
                    >
                      {statusLabels[inquiry.status]}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-bg-light flex items-center justify-center font-display text-xs text-admin-nav shrink-0">
                        {inquiry.productName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-body text-sm font-semibold text-admin-dark">
                          {inquiry.productName}
                        </p>
                        <p className="font-body text-xs text-text-placeholder">
                          {inquiry.productCategory}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold ${
                        inquiry.contactMethod === 'whatsapp'
                          ? 'bg-contact-whatsapp text-contact-whatsapp-text'
                          : 'bg-contact-email text-text-strong'
                      }`}
                    >
                      {inquiry.contactMethod === 'whatsapp'
                        ? 'WhatsApp'
                        : 'Email'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-body text-sm text-text-strong">
                    {inquiry.contactValue}
                  </td>
                  <td className="py-3.5 px-4 font-body text-sm text-text-label">
                    {formatDate(inquiry.timestamp)}
                  </td>
                  <td className="py-3.5 px-4 font-body text-sm text-text-label max-w-[200px] truncate">
                    {inquiry.conversation[
                      inquiry.conversation.length - 2
                    ]?.content.substring(0, 40)}
                    ...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ── Detail View ──
  if (!selectedInquiry) return null;

  return (
    <div className="p-8 max-md:p-5">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="font-body text-sm text-text-label hover:text-admin-dark transition-colors cursor-pointer mb-6"
      >
        ← 목록으로
      </button>

      {/* Two Column Grid */}
      <div className="grid grid-cols-[340px_1fr] gap-10 max-lg:grid-cols-[300px_1fr] max-lg:gap-7 max-md:grid-cols-1">
        {/* Left: Product Panel */}
        <div className="bg-white border border-border-strong rounded-2xl p-8 self-start">
          {/* Product Image Placeholder */}
          <div className="w-full aspect-square rounded-xl bg-bg-light flex items-center justify-center font-display text-2xl text-admin-nav mb-6">
            {selectedInquiry.productName}
          </div>

          <h3 className="font-display text-xl font-bold text-admin-dark mb-1">
            {selectedInquiry.productName}
          </h3>
          <p className="font-body text-sm text-text-muted mb-8">
            {selectedInquiry.productCategory}
          </p>

          {/* Status Buttons */}
          <div className="border-t border-border pt-6 mb-6">
            <span className="block font-body text-xs font-bold uppercase tracking-wider text-text-label mb-3">
              상태 변경
            </span>
            <div className="flex gap-2">
              {(['new', 'reviewed', 'responded'] as InquiryStatus[]).map(
                (status) => (
                  <button
                    key={status}
                    onClick={() =>
                      handleUpdateStatus(selectedInquiry.id, status)
                    }
                    className={`flex-1 py-2.5 px-3 rounded-lg font-body text-xs font-medium transition-colors cursor-pointer ${
                      selectedInquiry.status === status
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

          {/* Contact Info */}
          <div>
            <span className="block font-body text-xs font-bold uppercase tracking-wider text-text-label mb-3">
              연락처 정보
            </span>
            <div className="bg-bg-input border border-border-strong rounded-xl p-5">
              <span
                className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold mb-3 ${
                  selectedInquiry.contactMethod === 'whatsapp'
                    ? 'bg-contact-whatsapp text-contact-whatsapp-text'
                    : 'bg-contact-email text-text-strong'
                }`}
              >
                {selectedInquiry.contactMethod === 'whatsapp'
                  ? 'WhatsApp'
                  : 'Email'}
              </span>
              <p className="font-body text-base font-bold text-admin-dark mb-3">
                {selectedInquiry.contactValue}
              </p>
              <button
                onClick={() => handleCopy(selectedInquiry.contactValue)}
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
            {selectedInquiry.conversation.map((msg, idx) => {
              const isPrice =
                isPriceMessage(msg.content) && msg.type === 'user';

              return (
                <div key={idx} className="flex gap-4">
                  <span className="shrink-0 w-14 font-body text-sm text-text-muted pt-4">
                    {msg.time}
                  </span>
                  <div
                    className={`flex-1 rounded-xl px-5 py-4 ${
                      isPrice
                        ? 'bg-bg-price border border-border-price'
                        : msg.type === 'user'
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
                        msg.type === 'user'
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
