'use client';

interface SuccessModalProps {
  onClose: () => void;
  onBrowseMore: () => void;
}

export function SuccessModal({ onClose, onBrowseMore }: SuccessModalProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl px-8 py-10 max-w-[400px] w-full mx-4 flex flex-col items-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-8 h-8 text-green-600">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="font-display text-xl font-bold text-admin-dark mb-2">
          Inquiry Submitted Successfully!
        </h3>
        <p className="font-body text-sm text-text-muted text-center mb-8 max-w-[280px] leading-relaxed">
          Our team will contact you within 24 hours with pricing information.
        </p>
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={onBrowseMore}
            className="w-full bg-admin-dark text-white rounded-lg py-3 text-sm font-semibold transition-colors hover:bg-black cursor-pointer"
          >
            Browse More Products
          </button>
          <button
            onClick={onClose}
            className="w-full bg-white border border-border-strong text-text-label rounded-lg py-3 text-sm font-semibold transition-colors hover:border-admin-dark cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
