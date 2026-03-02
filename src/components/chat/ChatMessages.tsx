'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import type { Brand } from '@/types/brand';

export interface Message {
  sender_type: 'user' | 'assistant';
  content: string;
  brandCard?: Brand;
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  showContactForm?: boolean;
}

export function ChatMessages({
  messages,
  isLoading,
  showContactForm,
}: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, showContactForm]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-[900px] mx-auto flex flex-col gap-6">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender_type === 'user' ? 'justify-end' : 'justify-start'} gap-3`}
          >
            {msg.sender_type === 'assistant' && (
              <div className="w-9 h-9 rounded-full bg-admin-dark text-white flex items-center justify-center text-sm font-bold shrink-0 mt-1">
                B
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl px-5 py-4 text-sm leading-relaxed ${
                msg.sender_type === 'user'
                  ? 'bg-admin-dark text-white rounded-br-sm'
                  : 'bg-bg-light text-text-strong rounded-bl-sm'
              }`}
            >
              {msg.brandCard && (
                <div className="flex items-center gap-4 p-3 bg-white rounded-xl border border-border-light mb-3">
                  {msg.brandCard.imageUrl ? (
                    <div className="w-16 h-16 rounded-lg overflow-hidden relative shrink-0">
                      <Image
                        src={msg.brandCard.imageUrl}
                        alt={msg.brandCard.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-bg-light flex items-center justify-center font-display text-lg text-admin-nav shrink-0">
                      {msg.brandCard.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <span className="text-xs text-text-muted">{msg.brandCard.categories?.map((c) => c.name).join(', ')}</span>
                    <h4 className="font-display text-base font-bold text-admin-dark">
                      {msg.brandCard.name}
                    </h4>
                    {msg.brandCard.description && (
                      <p className="text-xs text-text-muted mt-1 line-clamp-2 whitespace-pre-line break-words">
                        {msg.brandCard.description}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {msg.content && <p className="whitespace-pre-line">{msg.content}</p>}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start gap-3">
            <div className="w-9 h-9 rounded-full bg-admin-dark text-white flex items-center justify-center text-sm font-bold shrink-0">
              B
            </div>
            <div className="bg-bg-light rounded-2xl rounded-bl-sm px-5 py-4 flex gap-1.5 items-center">
              <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
