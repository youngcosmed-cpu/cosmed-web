import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { Review } from '@/types/review';

interface CreateReviewPayload {
  brandId: number;
  rating: number;
  content: string;
  photos?: string[];
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateReviewPayload) => {
      const { data } = await api.post<Review>('/reviews', body);
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.brandId] });
    },
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...body }: { id: number; rating?: number; content?: string }) => {
      const { data } = await api.patch<Review>(`/reviews/${id}`, body);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/reviews/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

export function useUploadReviewPhoto() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File): Promise<string> => {
    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post<{ url: string }>(
        '/reviews/upload/photo',
        formData,
      );
      return data.url;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : '이미지 업로드에 실패했습니다';
      setError(message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return { upload, isUploading, error };
}
