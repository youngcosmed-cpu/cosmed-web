import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

export function useUploadImage() {
  const mutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post<{ url: string }>(
        '/upload/image',
        formData,
      );
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
