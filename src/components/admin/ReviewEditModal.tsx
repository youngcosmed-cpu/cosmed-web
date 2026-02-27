'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useUpdateReview } from '@/hooks/mutations/use-review-mutations';
import { useToast } from '@/hooks/use-toast';
import type { AdminReview } from '@/types/review';

interface ReviewEditModalProps {
  review: AdminReview | null;
  onClose: () => void;
}

export function ReviewEditModal({ review, onClose }: ReviewEditModalProps) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const updateMutation = useUpdateReview();
  const toast = useToast();

  useEffect(() => {
    if (review) {
      setRating(review.rating);
      setContent(review.content);
    }
  }, [review]);

  if (!review) return null;

  const handleSave = () => {
    const trimmed = content.trim();
    if (!trimmed || rating < 1 || rating > 5) return;
    updateMutation.mutate(
      { id: review.id, rating, content: trimmed },
      {
        onSuccess: () => {
          toast.success('리뷰가 수정되었습니다');
          onClose();
        },
        onError: () => toast.error('리뷰 수정에 실패했습니다'),
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-border-light">
          <div>
            <h2 className="font-display text-lg font-bold text-admin-dark">
              리뷰 수정
            </h2>
            <p className="font-body text-sm text-text-label mt-0.5">
              {review.brand.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-text-placeholder hover:bg-bg-muted hover:text-admin-dark-hover transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-7 py-5 space-y-5">
          {/* Star Rating */}
          <div>
            <label className="font-body text-sm font-semibold text-admin-dark block mb-2">
              평점
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="text-2xl cursor-pointer transition-colors"
                >
                  {star <= rating ? (
                    <span className="text-yellow-400">★</span>
                  ) : (
                    <span className="text-border-strong">★</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="font-body text-sm font-semibold text-admin-dark block mb-2">
              내용
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              className="w-full px-3.5 py-2.5 border border-border-strong rounded-lg font-body text-sm text-admin-dark outline-none focus:border-admin-dark transition-colors resize-none placeholder:text-text-disabled"
            />
          </div>

          {/* Photos (read-only) */}
          {review.photos.length > 0 && (
            <div>
              <label className="font-body text-sm font-semibold text-admin-dark block mb-2">
                사진
              </label>
              <div className="flex gap-2 flex-wrap">
                {review.photos.map((url, i) => (
                  <div
                    key={i}
                    className="w-20 h-20 rounded-lg overflow-hidden bg-bg-light"
                  >
                    <Image
                      src={url}
                      alt={`리뷰 사진 ${i + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-7 py-5 border-t border-border-light">
          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-border-strong rounded-lg font-body text-sm font-semibold text-text-label hover:border-text-placeholder transition-colors cursor-pointer"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={!content.trim() || rating < 1 || updateMutation.isPending}
            className="px-4 py-2.5 bg-admin-dark text-white rounded-lg font-body text-sm font-semibold hover:bg-admin-dark-hover transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {updateMutation.isPending ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
}
