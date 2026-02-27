'use client';

import { useState } from 'react';
import { useAdminReviews } from '@/hooks/queries/use-admin-reviews';
import { useBrands } from '@/hooks/queries/use-brands';
import { useDeleteReview } from '@/hooks/mutations/use-review-mutations';
import { ReviewEditModal } from '@/components/admin/ReviewEditModal';
import { useToast } from '@/hooks/use-toast';
import type { AdminReview } from '@/types/review';

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

function renderStars(rating: number) {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

export default function ReviewsPage() {
  const [selectedBrandId, setSelectedBrandId] = useState<number | undefined>(
    undefined,
  );
  const [editingReview, setEditingReview] = useState<AdminReview | null>(null);

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } =
    useAdminReviews(selectedBrandId);
  const { data: brandsData } = useBrands();
  const deleteMutation = useDeleteReview();
  const toast = useToast();

  const reviews = data?.pages.flatMap((p) => p.data) ?? [];
  const brands = brandsData?.pages.flatMap((p) => p.data) ?? [];

  const stats = {
    total: reviews.length,
    avgRating:
      reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : '0',
    withPhotos: reviews.filter((r) => r.photos.length > 0).length,
  };

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!confirm('이 리뷰를 삭제하시겠습니까?')) return;
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success('리뷰가 삭제되었습니다'),
      onError: () => toast.error('리뷰 삭제에 실패했습니다'),
    });
  };

  return (
    <div className="p-8 max-md:p-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-5 mb-6 max-sm:grid-cols-1">
        <div className="bg-white border border-border-strong rounded-xl p-5">
          <span className="font-body text-xs uppercase tracking-wider text-text-label">
            전체 리뷰
          </span>
          <p className="font-display text-3xl font-bold text-admin-dark mt-1">
            {stats.total}
          </p>
        </div>
        <div className="bg-bg-warm border border-admin-dark rounded-xl p-5">
          <span className="font-body text-xs uppercase tracking-wider text-text-label">
            평균 평점
          </span>
          <p className="font-display text-3xl font-bold text-admin-dark mt-1">
            {stats.avgRating}
          </p>
        </div>
        <div className="bg-white border border-border-strong rounded-xl p-5">
          <span className="font-body text-xs uppercase tracking-wider text-text-label">
            사진 포함 리뷰
          </span>
          <p className="font-display text-3xl font-bold text-admin-dark mt-1">
            {stats.withPhotos}
          </p>
        </div>
      </div>

      {/* Brand Filter */}
      <div className="flex items-center gap-3 flex-wrap mb-6">
        <button
          onClick={() => setSelectedBrandId(undefined)}
          className={`px-3.5 py-2 rounded-lg font-body text-sm transition-colors cursor-pointer ${
            selectedBrandId === undefined
              ? 'bg-admin-dark text-white font-semibold'
              : 'bg-white border border-border-strong text-text-label hover:border-text-placeholder'
          }`}
        >
          전체
        </button>
        {brands.map((brand) => (
          <button
            key={brand.id}
            onClick={() => setSelectedBrandId(brand.id)}
            className={`px-3.5 py-2 rounded-lg font-body text-sm transition-colors cursor-pointer ${
              selectedBrandId === brand.id
                ? 'bg-admin-dark text-white font-semibold'
                : 'bg-white border border-border-strong text-text-label hover:border-text-placeholder'
            }`}
          >
            {brand.name}
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
          <div className="overflow-x-auto max-sm:-mx-5 max-sm:px-5">
            <table className="w-full border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-border-strong">
                  <th className="font-body text-xs uppercase tracking-wider text-text-muted text-left py-3 px-4">
                    평점
                  </th>
                  <th className="font-body text-xs uppercase tracking-wider text-text-muted text-left py-3 px-4">
                    브랜드
                  </th>
                  <th className="font-body text-xs uppercase tracking-wider text-text-muted text-left py-3 px-4">
                    내용
                  </th>
                  <th className="font-body text-xs uppercase tracking-wider text-text-muted text-left py-3 px-4">
                    사진
                  </th>
                  <th className="font-body text-xs uppercase tracking-wider text-text-muted text-left py-3 px-4">
                    작성일
                  </th>
                  <th className="font-body text-xs uppercase tracking-wider text-text-muted text-left py-3 px-4">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr
                    key={review.id}
                    className="border-b border-border-light hover:bg-bg-light transition-colors"
                  >
                    <td className="py-3.5 px-4 font-body text-sm text-yellow-400 whitespace-nowrap">
                      {renderStars(review.rating)}
                    </td>
                    <td className="py-3.5 px-4 font-body text-sm font-semibold text-admin-dark">
                      {review.brand.name}
                    </td>
                    <td className="py-3.5 px-4 font-body text-sm text-text-strong max-w-[300px]">
                      <span className="line-clamp-1">
                        {review.content.length > 80
                          ? review.content.slice(0, 80) + '…'
                          : review.content}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-body text-sm text-text-label">
                      {review.photos.length > 0
                        ? `${review.photos.length}장`
                        : '-'}
                    </td>
                    <td className="py-3.5 px-4 font-body text-sm text-text-label whitespace-nowrap">
                      {formatDate(review.createdAt)}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingReview(review)}
                          className="font-body text-sm text-text-label hover:text-admin-dark transition-colors cursor-pointer"
                        >
                          수정
                        </button>
                        <span className="text-border-strong">·</span>
                        <button
                          onClick={(e) => handleDelete(e, review.id)}
                          disabled={deleteMutation.isPending}
                          className="font-body text-sm text-error hover:text-red-700 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {deleteMutation.isPending && deleteMutation.variables === review.id
                            ? '삭제 중...'
                            : '삭제'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {reviews.length === 0 && (
            <div className="flex items-center justify-center py-20">
              <span className="font-body text-sm text-text-muted">
                리뷰가 없습니다.
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

      {/* Edit Modal */}
      <ReviewEditModal
        review={editingReview}
        onClose={() => setEditingReview(null)}
      />
    </div>
  );
}
