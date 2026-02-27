import { useToastStore } from '@/stores/toast-store';

export function useToast() {
  const addToast = useToastStore((state) => state.addToast);

  return {
    success: (message: string) => addToast(message, 'success'),
    error: (message: string) => addToast(message, 'error'),
  };
}
