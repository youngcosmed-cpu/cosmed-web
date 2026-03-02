'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useInquiries } from '@/hooks/queries/use-inquiries';
import { useDeleteInquiry } from '@/hooks/mutations/use-inquiry-mutations';
import { useToast } from '@/hooks/use-toast';
import type { InquiryStatus } from '@/types/inquiry';

type FilterType = 'all' | 'newOnly' | 'whatsapp' | 'email';

const filterLabels: Record<FilterType, string> = {
  all: '전체',
  newOnly: '신규만',
  whatsapp: 'WhatsApp',
  email: '이메일',
};

const statusLabels: Record<InquiryStatus, string> = {
  new_inquiry: '신규',
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

function getQueryParams(filter: FilterType) {
  const params: { status?: string; contactMethod?: string } = {};
  if (filter === 'newOnly') params.status = 'new_inquiry';
  if (filter === 'whatsapp') params.contactMethod = 'whatsapp';
  if (filter === 'email') params.contactMethod = 'email';
  return params;
}

export default function InquiriesPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>('all');

  const queryParams = getQueryParams(filter);
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } =
    useInquiries(queryParams);
  const deleteMutation = useDeleteInquiry();
  const toast = useToast();

  const inquiries = data?.pages.flatMap((p) => p.data) ?? [];

  const stats = {
    total: inquiries.length,
    new: inquiries.filter((i) => i.status === 'new_inquiry').length,
    responded: inquiries.filter((i) => i.status === 'responded').length,
  };

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!confirm('이 문의를 삭제하시겠습니까?')) return;
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success('문의가 삭제되었습니다'),
      onError: () => toast.error('문의 삭제에 실패했습니다'),
    });
  };

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
        </div>
        <div className="bg-bg-warm border border-admin-dark rounded-xl p-5">
          <span className="font-body text-xs uppercase tracking-wider text-text-label">
            신규
          </span>
          <p className="font-display text-3xl font-bold text-admin-dark mt-1">
            {stats.new}
          </p>
        </div>
        <div className="bg-white border border-border-strong rounded-xl p-5">
          <span className="font-body text-xs uppercase tracking-wider text-text-label">
            응답 완료
          </span>
          <p className="font-display text-3xl font-bold text-admin-dark mt-1">
            {stats.responded}
          </p>
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

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <span className="font-body text-sm text-text-muted">로딩 중...</span>
        </div>
      )}

      {/* Data Table */}
      {!isLoading && (
        <>
          {/* Desktop Table */}
          <div className="overflow-x-auto max-sm:hidden">
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
                    작업
                  </th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inquiry) => (
                  <tr
                    key={inquiry.id}
                    onClick={() => router.push(`/admin/inquiries/${inquiry.id}`)}
                    className={`border-b border-border-light cursor-pointer hover:bg-bg-light transition-colors ${
                      inquiry.status === 'new_inquiry' ? 'bg-bg-warm-row' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold ${
                          inquiry.status === 'new_inquiry'
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
                        <div className="w-10 h-10 rounded-lg bg-bg-light flex items-center justify-center font-display text-xs text-admin-nav shrink-0 overflow-hidden">
                          {inquiry.brand.imageUrl ? (
                            <Image
                              src={inquiry.brand.imageUrl}
                              alt={inquiry.brand.name}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            inquiry.brand.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <p className="font-body text-sm font-semibold text-admin-dark">
                            {inquiry.brand.name}
                          </p>
                          <p className="font-body text-xs text-text-placeholder">
                            {inquiry.brand.categories?.map((c) => c.name).join(', ')}
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
                      {formatDate(inquiry.createdAt)}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={(e) => handleDelete(e, inquiry.id)}
                        disabled={deleteMutation.isPending}
                        className="font-body text-sm text-error hover:text-red-700 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {deleteMutation.isPending && deleteMutation.variables === inquiry.id
                          ? '삭제 중...'
                          : '삭제'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="sm:hidden flex flex-col gap-3">
            {inquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                onClick={() => router.push(`/admin/inquiries/${inquiry.id}`)}
                className={`border border-border-strong rounded-xl p-4 cursor-pointer active:bg-bg-light transition-colors ${
                  inquiry.status === 'new_inquiry' ? 'bg-bg-warm-row' : 'bg-white'
                }`}
              >
                {/* Top: Status + Date */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold ${
                      inquiry.status === 'new_inquiry'
                        ? 'bg-status-new text-status-new-text'
                        : inquiry.status === 'reviewed'
                          ? 'bg-status-reviewed text-status-reviewed-text'
                          : 'bg-status-responded text-status-responded-text'
                    }`}
                  >
                    {statusLabels[inquiry.status]}
                  </span>
                  <span className="font-body text-xs text-text-label">
                    {formatDate(inquiry.createdAt)}
                  </span>
                </div>

                {/* Middle: Brand image + name/category */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-bg-light flex items-center justify-center font-display text-xs text-admin-nav shrink-0 overflow-hidden">
                    {inquiry.brand.imageUrl ? (
                      <Image
                        src={inquiry.brand.imageUrl}
                        alt={inquiry.brand.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      inquiry.brand.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold text-admin-dark">
                      {inquiry.brand.name}
                    </p>
                    <p className="font-body text-xs text-text-placeholder">
                      {inquiry.brand.categories?.map((c) => c.name).join(', ')}
                    </p>
                  </div>
                </div>

                {/* Bottom: Contact method + value + delete */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold shrink-0 ${
                        inquiry.contactMethod === 'whatsapp'
                          ? 'bg-contact-whatsapp text-contact-whatsapp-text'
                          : 'bg-contact-email text-text-strong'
                      }`}
                    >
                      {inquiry.contactMethod === 'whatsapp'
                        ? 'WhatsApp'
                        : 'Email'}
                    </span>
                    <span className="font-body text-sm text-text-strong truncate">
                      {inquiry.contactValue}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, inquiry.id)}
                    disabled={deleteMutation.isPending}
                    className="font-body text-sm text-error hover:text-red-700 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0 ml-2"
                  >
                    {deleteMutation.isPending && deleteMutation.variables === inquiry.id
                      ? '삭제 중...'
                      : '삭제'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {inquiries.length === 0 && (
            <div className="flex items-center justify-center py-20">
              <span className="font-body text-sm text-text-muted">
                문의가 없습니다.
              </span>
            </div>
          )}

          {/* Load More */}
          {hasNextPage && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="px-6 py-2.5 rounded-lg border border-border-strong font-body text-sm font-semibold text-text-label hover:border-admin-dark hover:text-admin-dark transition-colors cursor-pointer disabled:opacity-50"
              >
                {isFetchingNextPage ? '로딩 중...' : '더 보기'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
