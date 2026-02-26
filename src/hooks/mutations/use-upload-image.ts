import { useState } from 'react';
import { api } from '@/lib/api/client';

export function useUploadImage() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File): Promise<string> => {
    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post<{ url: string }>(
        '/upload/image',
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
