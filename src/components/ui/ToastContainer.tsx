'use client';

import { useToastStore } from '@/stores/toast-store';
import type { ToastVariant } from '@/stores/toast-store';

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function variantStyles(variant: ToastVariant) {
  if (variant === 'success') {
    return 'bg-status-responded text-status-responded-text border-status-responded-text/20';
  }
  return 'bg-[#FEF2F2] text-error border-error/20';
}

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 max-sm:top-3 max-sm:right-3 max-sm:left-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          aria-live="polite"
          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-sm font-body text-sm font-medium animate-[slideInRight_0.25s_ease-out] ${variantStyles(toast.variant)}`}
        >
          {toast.variant === 'success' ? <CheckIcon /> : <AlertIcon />}
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 p-0.5 rounded hover:opacity-70 transition-opacity cursor-pointer"
          >
            <CloseIcon />
          </button>
        </div>
      ))}
    </div>
  );
}
