'use client';

import { useState } from 'react';

type ContactMethod = 'whatsapp' | 'email';

interface ContactFormProps {
  onSubmit: (method: ContactMethod, value: string) => void;
  isLoading: boolean;
}

export function ContactForm({ onSubmit, isLoading }: ContactFormProps) {
  const [method, setMethod] = useState<ContactMethod>('whatsapp');
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || isLoading) return;
    onSubmit(method, value.trim());
  };

  return (
    <div className="border-t border-border-light px-4 py-6">
      <div className="max-w-[900px] mx-auto">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-bg-light rounded-full flex items-center justify-center mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-admin-dark">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h3 className="font-display text-lg font-bold text-admin-dark mb-1">
            Leave your contact
          </h3>
          <p className="font-body text-sm text-text-muted text-center mb-6 max-w-[280px]">
            Our Sales Operations Team will get back to you with pricing details.
          </p>

          <form onSubmit={handleSubmit} className="w-full max-w-[320px] flex flex-col gap-4">
            <div className="flex gap-2">
              <label
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold text-center transition-colors cursor-pointer ${
                  method === 'whatsapp'
                    ? 'bg-admin-dark text-white'
                    : 'bg-white border border-border-strong text-text-label hover:border-text-placeholder'
                }`}
              >
                <input
                  type="radio"
                  name="contactMethod"
                  value="whatsapp"
                  checked={method === 'whatsapp'}
                  onChange={() => setMethod('whatsapp')}
                  className="sr-only"
                />
                WhatsApp
              </label>
              <label
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold text-center transition-colors cursor-pointer ${
                  method === 'email'
                    ? 'bg-admin-dark text-white'
                    : 'bg-white border border-border-strong text-text-label hover:border-text-placeholder'
                }`}
              >
                <input
                  type="radio"
                  name="contactMethod"
                  value="email"
                  checked={method === 'email'}
                  onChange={() => setMethod('email')}
                  className="sr-only"
                />
                Email
              </label>
            </div>

            <input
              type={method === 'email' ? 'email' : 'tel'}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={method === 'whatsapp' ? '+1 555-0123' : 'you@example.com'}
              className="w-full border border-border-strong rounded-lg px-3 py-2.5 text-sm outline-none focus:border-admin-dark transition-colors"
            />

            <button
              type="submit"
              disabled={isLoading || !value.trim()}
              className="w-full bg-admin-dark text-white rounded-lg py-3 text-sm font-semibold transition-colors hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
