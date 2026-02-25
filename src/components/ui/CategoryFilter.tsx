'use client';

import { useCategories } from '@/hooks/queries/use-categories';
import type { Category } from '@/types/brand';

interface CategoryFilterProps {
  selected: number | undefined;
  onSelect: (categoryId: number | undefined) => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  const { data } = useCategories();
  const categories = data?.data;

  return (
    <div className="flex items-center gap-8 max-[992px]:gap-5 max-[992px]:flex-wrap max-md:gap-3 max-md:flex-wrap">
      <button
        className={`font-body text-sm font-light bg-transparent border-none py-2 px-0 cursor-pointer relative tracking-[0.01em] transition-colors max-md:text-[13px] max-md:py-1.5 ${
          selected === undefined
            ? 'text-deep-charcoal font-normal after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-deep-charcoal'
            : 'text-text-muted hover:text-text-secondary'
        }`}
        onClick={() => onSelect(undefined)}
      >
        All
      </button>
      {categories?.map((cat: Category) => (
        <button
          key={cat.id}
          className={`font-body text-sm font-light bg-transparent border-none py-2 px-0 cursor-pointer relative tracking-[0.01em] transition-colors max-md:text-[13px] max-md:py-1.5 ${
            selected === cat.id
              ? 'text-deep-charcoal font-normal after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-deep-charcoal'
              : 'text-text-muted hover:text-text-secondary'
          }`}
          onClick={() => onSelect(cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
