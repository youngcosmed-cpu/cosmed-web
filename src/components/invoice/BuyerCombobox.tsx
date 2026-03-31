'use client';

import { useState, useRef, useEffect } from 'react';
import type { SavedBuyer } from '@/types/saved-buyer';

interface BuyerComboboxProps {
  savedBuyers: SavedBuyer[];
  isLoading: boolean;
  onSelect: (buyer: SavedBuyer) => void;
}

export default function BuyerCombobox({
  savedBuyers,
  isLoading,
  onSelect,
}: BuyerComboboxProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query
    ? savedBuyers.filter(
        (b) =>
          b.name.toLowerCase().includes(query.toLowerCase()) ||
          b.address.toLowerCase().includes(query.toLowerCase()),
      )
    : savedBuyers;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setHighlightIndex(-1);
  }, [query]);

  const handleSelect = (buyer: SavedBuyer) => {
    onSelect(buyer);
    setQuery('');
    setOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === 'Enter' && highlightIndex >= 0) {
      e.preventDefault();
      handleSelect(filtered[highlightIndex]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative mb-4">
      <label className="mb-1 block text-xs text-gray-500">저장된 바이어</label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-8 text-sm focus:border-gray-500 focus:outline-none"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={isLoading ? '불러오는 중...' : '바이어 검색...'}
          disabled={isLoading}
        />
        <svg
          className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {open && (
        <ul className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-sm text-gray-400">
              {savedBuyers.length === 0
                ? '저장된 바이어가 없습니다'
                : '검색 결과가 없습니다'}
            </li>
          ) : (
            filtered.map((buyer, index) => (
              <li
                key={buyer.id}
                className={`cursor-pointer px-3 py-2 ${
                  index === highlightIndex
                    ? 'bg-gray-100'
                    : 'hover:bg-gray-50'
                }`}
                onMouseEnter={() => setHighlightIndex(index)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(buyer);
                }}
              >
                <div className="text-sm font-medium text-gray-900">{buyer.name}</div>
                {buyer.address && (
                  <div className="text-xs text-gray-400 truncate">{buyer.address}</div>
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
