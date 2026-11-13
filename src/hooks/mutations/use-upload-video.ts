import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

export const MAX_VIDEO_SIZE = 200 * 1024 * 1024; // 200MB
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

export function useUploadVideo() {
  const mutation = useMutation({
    mutationFn: async (file: File) => {
      if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
        throw new Error('mp4, webm, mov 영상만 업로드할 수 있습니다');
      }
      if (file.size > MAX_VIDEO_SIZE) {
        throw new Error('영상 크기는 200MB 이하만 가능합니다');
      }

      const { data } = await api.post<{ uploadUrl: string; publicUrl: string }>(
        '/upload/video-url',
        { contentType: file.type, size: file.size },
      );

      // Upload directly to R2 (bypasses the Next.js proxy body-size limit)
      const res = await fetch(data.uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });
      if (!res.ok) {
        throw new Error('영상 업로드에 실패했습니다');
      }

      return data.publicUrl;
    },
  });

  return {
    upload: mutation.mutateAsync,
    isUploading: mutation.isPending,
    error: mutation.error
      ? mutation.error instanceof Error
        ? mutation.error.message
        : '영상 업로드에 실패했습니다'
      : null,
  };
}
