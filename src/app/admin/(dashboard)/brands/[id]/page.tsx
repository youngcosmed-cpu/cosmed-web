'use client';

import { use } from 'react';
import { useBrand } from '@/hooks/queries/use-brand';
import { BrandForm } from '@/components/admin/BrandForm';

export default function EditBrandPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: brand, isLoading, isError } = useBrand(Number(id));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="font-body text-sm text-[#888]">로딩 중...</span>
      </div>
    );
  }

  if (isError || !brand) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="font-body text-sm text-[#999]">
          브랜드를 찾을 수 없습니다
        </span>
      </div>
    );
  }

  return <BrandForm brand={brand} />;
}
