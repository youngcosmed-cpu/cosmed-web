'use client';

import { useState, useRef, useEffect } from 'react';
import { useBrands } from '@/hooks/queries/use-brands';
import { BrandCard } from './BrandCard';
import { EmptyState } from './EmptyState';
import { BrandGridSkeleton } from './BrandGridSkeleton';
import { CategoryFilter } from './CategoryFilter';

export function BrandGrid() {
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
    undefined,
  );
  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useBrands(selectedCategory);

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const brands = (data?.pages ?? [])
    .flatMap((page) => (Array.isArray(page?.data) ? page.data : []))
    .filter(Boolean);

  return (
    <section className="pt-6 pb-20 bg-body-bg max-md:pt-4 max-md:pb-15" id="products">
      <div className="max-w-[1400px] mx-auto px-15 max-md:px-6 max-[992px]:px-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-10 max-md:flex-col max-md:items-start max-md:gap-5 max-md:mb-6 max-[992px]:gap-5">
          <CategoryFilter
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-6 max-[992px]:grid-cols-2 max-md:grid-cols-2 max-md:gap-4">
          {isLoading ? (
            <BrandGridSkeleton />
          ) : brands.length === 0 ? (
            <EmptyState />
          ) : (
            brands.map((brand, index) => (
              <BrandCard key={brand.id} brand={brand} priority={index < 6} />
            ))
          )}
        </div>

        {/* Infinite scroll sentinel */}
        {hasNextPage && (
          <div ref={sentinelRef} className="h-px" />
        )}
        {isFetchingNextPage && (
          <div className="grid grid-cols-3 gap-6 mt-6 max-[992px]:grid-cols-2 max-md:grid-cols-2 max-md:gap-4">
            <BrandGridSkeleton />
          </div>
        )}
      </div>
    </section>
  );
}
