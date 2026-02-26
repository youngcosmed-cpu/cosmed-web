'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
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

  const brands = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <section className="pt-25 pb-20 bg-body-bg max-md:pt-20 max-md:pb-15 max-[992px]:pt-[90px]" id="products">
      <div className="max-w-[1400px] mx-auto px-15 max-md:px-6 max-[992px]:px-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-10 max-md:flex-col max-md:items-start max-md:gap-5 max-md:mb-6 max-[992px]:gap-5">
          <CategoryFilter
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 font-body text-[13px] font-normal text-white tracking-[0.02em] px-6 py-3 bg-primary border-none cursor-pointer hover:bg-admin-dark transition-all max-md:px-[18px] max-md:py-2.5 max-md:text-xs"
          >
            <span>Request Bulk Pricing</span>
            <span className="text-sm transition-transform group-hover:translate-x-[3px]">→</span>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-6 max-[992px]:grid-cols-2 max-md:grid-cols-2 max-md:gap-4">
          {isLoading ? (
            <BrandGridSkeleton />
          ) : brands.length === 0 ? (
            <EmptyState />
          ) : (
            brands.map((brand) => <BrandCard key={brand.id} brand={brand} />)
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
