import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { queryKeys } from '@/lib/query/query-keys';
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
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.list(variables.brandId) });
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminReviews.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.list(data.brandId) });
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
      queryClient.invalidateQueries({ queryKey: queryKeys.adminReviews.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all });
    },
  });
}

export function useUploadReviewPhoto() {
  const mutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post<{ url: string }>('/reviews/upload/photo', formData);
      return data.url;
    },
  });

  return {
    upload: mutation.mutateAsync,
    isUploading: mutation.isPending,
    error: mutation.error
      ? mutation.error instanceof Error
        ? mutation.error.message
        : '이미지 업로드에 실패했습니다'
      : null,
  };
}
