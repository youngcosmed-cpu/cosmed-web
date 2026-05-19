'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEsc);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const modal = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
      style={{ animation: 'fadeIn 0.8s ease-out both' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative"
        style={{ animation: 'fadeIn 1s ease-out 0.2s both' }}
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src="/images/cosmed_about.png"
          alt="Young Cosmed - Global Aesthetic & Healthcare Solutions from Korea"
          width={1024}
          height={1536}
          className="block rounded-lg shadow-2xl"
          style={{
            maxWidth: 'calc(100vw - 2rem)',
            maxHeight: 'calc(100vh - 2rem)',
            width: 'auto',
            height: 'auto',
          }}
          priority
        />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/95 text-primary shadow-lg hover:bg-white transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
