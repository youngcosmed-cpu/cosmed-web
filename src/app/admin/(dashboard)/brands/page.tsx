'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useCategories } from '@/hooks/queries/use-categories';
import { useBrands } from '@/hooks/queries/use-brands';
import { useReorderBrands } from '@/hooks/mutations/use-brand-mutations';
import { CategoryModal } from '@/components/admin/CategoryModal';
import type { Brand } from '@/types/brand';

function DragHandle() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      className="text-text-placeholder shrink-0"
    >
      <circle cx="5.5" cy="3" r="1.2" />
      <circle cx="10.5" cy="3" r="1.2" />
      <circle cx="5.5" cy="8" r="1.2" />
      <circle cx="10.5" cy="8" r="1.2" />
      <circle cx="5.5" cy="13" r="1.2" />
      <circle cx="10.5" cy="13" r="1.2" />
    </svg>
  );
}

function SortableBrandCard({ brand }: { brand: Brand }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: brand.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-xl overflow-hidden group relative ${isDragging ? 'opacity-50 shadow-lg z-10' : 'hover:shadow-md'} transition-shadow`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 z-10 p-1.5 rounded-lg bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing touch-none transition-opacity shadow-sm"
      >
        <DragHandle />
      </button>
      <Link
        href={`/admin/brands/${brand.id}`}
        className="block no-underline"
      >
        <div className="aspect-[4/5] bg-bg-light overflow-hidden">
          {brand.imageUrl ? (
            <img
              src={brand.imageUrl}
              alt={brand.name}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-display text-lg text-admin-nav">
              {brand.name}
            </div>
          )}
        </div>
        <div className="p-4">
          <p className="font-body text-sm font-semibold text-admin-dark">
            {brand.name}
          </p>
          <p className="font-body text-xs text-text-placeholder mt-1">
            {brand.category?.name}
          </p>
        </div>
      </Link>
    </div>
  );
}

export default function BrandsPage() {
  const [selectedCategory, setSelectedCategory] = useState<number>();
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const { data: categoryData } = useCategories();
  const categories = categoryData?.data ?? [];

  const { data: brandData, isLoading } = useBrands(selectedCategory);
  const queryBrands =
    brandData?.pages.flatMap((page) => page.data) ?? [];

  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    setBrands(queryBrands);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandData]);

  const reorderBrands = useReorderBrands();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setBrands((prev) => {
      const oldIndex = prev.findIndex((b) => b.id === active.id);
      const newIndex = prev.findIndex((b) => b.id === over.id);
      const reordered = arrayMove(prev, oldIndex, newIndex);
      reorderBrands.mutate(reordered.map((b) => b.id));
      return reordered;
    });
  };

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
                ? 'bg-admin-dark text-white font-semibold'
                : 'bg-white border border-border-strong text-text-label hover:border-text-placeholder'
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
                  ? 'bg-admin-dark text-white font-semibold'
                  : 'bg-white border border-border-strong text-text-label hover:border-text-placeholder'
              }`}
            >
              {cat.name}
            </button>
          ))}

          {/* Category manage button */}
          <button
            onClick={() => setCategoryModalOpen(true)}
            className="px-3 py-2 rounded-lg border border-dashed border-border-medium font-body text-sm text-text-placeholder hover:border-text-placeholder hover:text-text-label transition-colors cursor-pointer"
          >
            + 카테고리 관리
          </button>
        </div>

        <Link
          href="/admin/brands/new"
          className="px-5 py-2.5 bg-admin-dark text-white rounded-lg font-body text-sm font-semibold hover:bg-admin-dark-hover transition-colors no-underline shrink-0"
        >
          + 제품 등록
        </Link>
      </div>

      {/* Brand list */}
      {isLoading ? (
        <div className="grid grid-cols-4 gap-5 max-lg:grid-cols-3 max-md:grid-cols-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden">
              <div className="aspect-[4/5] bg-bg-muted animate-pulse" />
              <div className="p-4">
                <div className="h-4 w-24 bg-bg-muted rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : brands.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="font-body text-sm text-text-placeholder mb-4">
            {selectedCategory
              ? '이 카테고리에 등록된 제품이 없습니다'
              : '등록된 제품이 없습니다'}
          </p>
          <Link
            href="/admin/brands/new"
            className="px-5 py-2.5 bg-admin-dark text-white rounded-lg font-body text-sm font-semibold hover:bg-admin-dark-hover transition-colors no-underline"
          >
            첫 제품 등록하기
          </Link>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={brands.map((b) => b.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-4 gap-5 max-lg:grid-cols-3 max-md:grid-cols-2">
              {brands.map((brand) => (
                <SortableBrandCard key={brand.id} brand={brand} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Category modal */}
      <CategoryModal
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
      />
    </div>
  );
}
