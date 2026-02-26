'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCreateReview, useUploadReviewPhoto } from '@/hooks/mutations/use-review-mutations';

const MAX_PHOTOS = 5;

function StarIcon({ filled, hovered }: { filled: boolean; hovered: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled || hovered ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.5"
      className={`w-7 h-7 transition-colors duration-150 ${
        filled ? 'text-amber-400' : hovered ? 'text-amber-300' : 'text-border-strong'
      }`}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export function ReviewForm({ brandId }: { brandId: number }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [content, setContent] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createReview = useCreateReview();
  const { upload, isUploading } = useUploadReviewPhoto();
  const isSaving = createReview.isPending;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (rating < 1 || rating > 5) newErrors.rating = '별점을 선택해주세요';
    if (!content.trim()) newErrors.content = '리뷰 내용을 입력해주세요';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createReview.mutateAsync({
        brandId,
        rating,
        content: content.trim(),
        photos: photos.length > 0 ? photos : undefined,
      });
      setRating(0);
      setContent('');
      setPhotos([]);
      setErrors({});
    } catch {
      // mutation error handled by react-query
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remaining = MAX_PHOTOS - photos.length;
    const toUpload = Array.from(files).slice(0, remaining);

    for (const file of toUpload) {
      try {
        const url = await upload(file);
        setPhotos((prev) => [...prev, url]);
      } catch {
        // upload error handled by hook
      }
    }

    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 max-md:p-5">
      <h3 className="font-display text-lg font-semibold text-admin-dark mb-6">
        Write a Review
      </h3>

      {/* Star Rating */}
      <div className="mb-5">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(star)}
              className="cursor-pointer"
            >
              <StarIcon
                filled={star <= rating}
                hovered={star <= hoveredRating && star > rating}
              />
            </button>
          ))}
        </div>
        {errors.rating && (
          <p className="text-red-500 text-xs mt-1">{errors.rating}</p>
        )}
      </div>

      {/* Content */}
      <div className="mb-5">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your experience with this brand..."
          rows={4}
          className="w-full px-4 py-3 border border-border-light bg-bg-input text-[15px] text-admin-dark placeholder:text-text-placeholder focus:outline-none focus:border-admin-dark transition-colors duration-200 resize-none"
        />
        {errors.content && (
          <p className="text-red-500 text-xs mt-1">{errors.content}</p>
        )}
      </div>

      {/* Photo Upload */}
      <div className="mb-6">
        {photos.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-3">
            {photos.map((url, i) => (
              <div key={url} className="relative w-20 h-20 group">
                <Image
                  src={url}
                  alt={`Review photo ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-admin-dark text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
        {photos.length < MAX_PHOTOS && (
          <label className="inline-flex items-center gap-2 px-4 py-2 border border-border-light text-sm text-text-label cursor-pointer hover:bg-bg-input transition-colors duration-200">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            {isUploading ? 'Uploading...' : `Add Photo (${photos.length}/${MAX_PHOTOS})`}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              multiple
              onChange={handleFileChange}
              disabled={isUploading}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSaving || isUploading}
        className="px-8 py-3 bg-admin-dark text-white text-sm font-semibold tracking-wider uppercase hover:bg-opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
