'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCategories } from '@/hooks/queries/use-categories';
import { useBrands } from '@/hooks/queries/use-brands';
import { CategoryModal } from '@/components/admin/CategoryModal';
import type { Brand } from '@/types/brand';

export default function BrandsPage() {
  const [selectedCategory, setSelectedCategory] = useState<number>();
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const { data: categoryData } = useCategories();
  const categories = categoryData?.data ?? [];

  const { data: brandData, isLoading } = useBrands(selectedCategory);
  const brands =
    brandData?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="p-8 max-md:p-5">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Category filter chips */}
          <button
            onClick={() => setSelectedCategory(undefined)}
            className={`px-3.5 py-2 rounded-lg font-body text-sm transition-colors cursor-pointer ${
              selectedCategory === undefined
                ? 'bg-[#1A1A1A] text-white font-semibold'
                : 'bg-white border border-[#DDD] text-[#666] hover:border-[#999]'
            }`}
          >
            전체
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-lg font-body text-sm transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#1A1A1A] text-white font-semibold'
                  : 'bg-white border border-[#DDD] text-[#666] hover:border-[#999]'
              }`}
            >
              {cat.name}
            </button>
          ))}

          {/* Category manage button */}
          <button
            onClick={() => setCategoryModalOpen(true)}
            className="px-3 py-2 rounded-lg border border-dashed border-[#CCC] font-body text-sm text-[#999] hover:border-[#999] hover:text-[#666] transition-colors cursor-pointer"
          >
            + 카테고리 관리
          </button>
        </div>

        <Link
          href="/admin/brands/new"
          className="px-5 py-2.5 bg-[#1A1A1A] text-white rounded-lg font-body text-sm font-semibold hover:bg-[#333] transition-colors no-underline shrink-0"
        >
          + 제품 등록
        </Link>
      </div>

      {/* Brand list */}
      {isLoading ? (
        <div className="grid grid-cols-4 gap-5 max-lg:grid-cols-3 max-md:grid-cols-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden">
              <div className="aspect-[4/5] bg-[#F0F0F0] animate-pulse" />
              <div className="p-4">
                <div className="h-4 w-24 bg-[#F0F0F0] rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : brands.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="font-body text-sm text-[#999] mb-4">
            {selectedCategory
              ? '이 카테고리에 등록된 제품이 없습니다'
              : '등록된 제품이 없습니다'}
          </p>
          <Link
            href="/admin/brands/new"
            className="px-5 py-2.5 bg-[#1A1A1A] text-white rounded-lg font-body text-sm font-semibold hover:bg-[#333] transition-colors no-underline"
          >
            첫 제품 등록하기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-5 max-lg:grid-cols-3 max-md:grid-cols-2">
          {brands.map((brand: Brand) => (
            <Link
              key={brand.id}
              href={`/admin/brands/${brand.id}`}
              className="bg-white rounded-xl overflow-hidden hover:shadow-md transition-shadow no-underline group"
            >
              <div className="aspect-[4/5] bg-[#F5F5F5] overflow-hidden">
                {brand.imageUrl ? (
                  <img
                    src={brand.imageUrl}
                    alt={brand.name}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-display text-lg text-[#CCC]">
                    {brand.name}
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="font-body text-sm font-semibold text-[#1A1A1A]">
                  {brand.name}
                </p>
                <p className="font-body text-xs text-[#999] mt-1">
                  {brand.category?.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Category modal */}
      <CategoryModal
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
      />
    </div>
  );
}
