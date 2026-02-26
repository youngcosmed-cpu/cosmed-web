'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCategories } from '@/hooks/queries/use-categories';
import {
  useCreateBrand,
  useUpdateBrand,
  useDeleteBrand,
} from '@/hooks/mutations/use-brand-mutations';
import { useUploadImage } from '@/hooks/mutations/use-upload-image';
import type { Brand } from '@/types/brand';

interface Model {
  name: string;
  description: string;
}

interface Props {
  brand?: Brand;
}

export function BrandForm({ brand }: Props) {
  const router = useRouter();
  const isEdit = !!brand;

  const { data: categoryData } = useCategories();
  const categories = categoryData?.data ?? [];

  const createBrand = useCreateBrand();
  const updateBrand = useUpdateBrand();
  const deleteBrand = useDeleteBrand();
  const { upload, isUploading } = useUploadImage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categoryId, setCategoryId] = useState<number | null>(
    brand?.categoryId ?? null,
  );
  const [brandName, setBrandName] = useState(brand?.name ?? '');
  const [description, setDescription] = useState(brand?.description ?? '');
  const [certifications, setCertifications] = useState<string[]>(
    brand?.certifications ?? [],
  );
  const [imageUrl, setImageUrl] = useState<string | null>(
    brand?.imageUrl ?? null,
  );
  const [certInput, setCertInput] = useState('');
  const [models, setModels] = useState<Model[]>(() => {
    if (brand?.products && brand.products.length > 0) {
      return brand.products.map((p) => ({
        name: p.name,
        description: p.description ?? '',
      }));
    }
    return [{ name: '', description: '' }];
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const isSaving = createBrand.isPending || updateBrand.isPending;
  const isDeleting = deleteBrand.isPending;

  const updateModel = (index: number, field: keyof Model, value: string) => {
    setModels((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)),
    );
  };

  const addModel = () => {
    setModels((prev) => [...prev, { name: '', description: '' }]);
  };

  const removeModel = (index: number) => {
    if (models.length > 1) {
      setModels((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!categoryId) newErrors.category = '카테고리를 선택해주세요';
    if (!brandName.trim()) newErrors.brandName = '브랜드명은 필수입니다';
    const hasValidModel = models.some((m) => m.name.trim());
    if (!hasValidModel)
      newErrors.models = '최소 1개 모델의 제품명을 입력해주세요';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const products = models
      .filter((m) => m.name.trim())
      .map((m) => ({
        name: m.name.trim(),
        ...(m.description.trim() ? { description: m.description.trim() } : {}),
      }));

    if (isEdit && brand) {
      await updateBrand.mutateAsync({
        id: brand.id,
        categoryId: categoryId!,
        name: brandName.trim(),
        description: description.trim() || undefined,
        imageUrl,
        certifications,
        products,
      });
    } else {
      await createBrand.mutateAsync({
        categoryId: categoryId!,
        name: brandName.trim(),
        description: description.trim() || undefined,
        imageUrl,
        certifications,
        products,
      });
    }

    router.push('/admin/brands');
  };

  const handleDelete = async () => {
    if (!brand) return;
    if (!window.confirm(`"${brand.name}" 브랜드를 삭제하시겠습니까?`)) return;
    await deleteBrand.mutateAsync(brand.id);
    router.push('/admin/brands');
  };

  const selectedCategory = categories.find((c) => c.id === categoryId);

  return (
    <div className="relative min-h-full pb-24">
      <div className="mx-auto max-w-[800px] px-8 py-8 max-md:px-5">
        {/* Back button */}
        <button
          onClick={() => router.push('/admin/brands')}
          className="mb-6 font-body text-sm font-semibold text-text-label hover:text-admin-dark transition-colors cursor-pointer bg-transparent border-none"
        >
          &larr; 뒤로
        </button>

        {/* Context header */}
        <div className="mb-8 flex items-center gap-3">
          {isEdit && brand ? (
            <>
              <span className="rounded-md bg-admin-dark px-3 py-1 font-body text-xs font-semibold text-white">
                {brand.category?.name}
              </span>
              <span className="font-display text-[22px] font-bold text-admin-dark">
                {brand.name} 수정 중
              </span>
            </>
          ) : (
            <span className="font-display text-[22px] font-bold text-admin-dark">
              새 제품 등록
            </span>
          )}
        </div>

        {/* Form */}
        <div className="flex flex-col gap-8">
          {/* Category */}
          <div>
            <label className="mb-2 block font-body text-base font-bold text-admin-dark">
              카테고리
            </label>
            {errors.category && (
              <p className="mb-2 font-body text-sm text-red-500">
                {errors.category}
              </p>
            )}
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setCategoryId(cat.id);
                    if (errors.category) {
                      setErrors((prev) => ({ ...prev, category: '' }));
                    }
                  }}
                  className={`rounded-[10px] border-2 px-4 py-3.5 font-body text-base font-semibold transition-colors cursor-pointer ${
                    categoryId === cat.id
                      ? 'border-admin-dark bg-admin-dark text-white'
                      : 'border-border-strong bg-white text-text-label hover:border-text-placeholder'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Brand name */}
          <div>
            <label className="mb-2 block font-body text-base font-bold text-admin-dark">
              브랜드명 *
            </label>
            {errors.brandName && (
              <p className="mb-2 font-body text-sm text-red-500">
                {errors.brandName}
              </p>
            )}
            <input
              type="text"
              value={brandName}
              onChange={(e) => {
                setBrandName(e.target.value);
                if (errors.brandName) {
                  setErrors((prev) => ({ ...prev, brandName: '' }));
                }
              }}
              placeholder="예: Neuramis"
              className={`w-full rounded-[10px] border-2 px-4 py-3.5 font-body text-base text-admin-dark outline-none transition-colors placeholder:text-text-disabled ${
                errors.brandName
                  ? 'border-red-400'
                  : 'border-border-strong focus:border-admin-dark'
              }`}
            />
          </div>

          {/* Brand image */}
          <div>
            <label className="mb-2 block font-body text-base font-bold text-admin-dark">
              브랜드 사진
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  const url = await upload(file);
                  setImageUrl(url);
                } catch {
                  // error is handled by the hook
                }
                e.target.value = '';
              }}
            />
            {isUploading ? (
              <div className="flex h-40 items-center justify-center rounded-[10px] border-2 border-dashed border-border-strong bg-bg-input">
                <span className="font-body text-sm text-text-placeholder">
                  업로드 중...
                </span>
              </div>
            ) : imageUrl ? (
              <div className="relative inline-block">
                <Image
                  src={imageUrl}
                  alt="브랜드 이미지"
                  width={200}
                  height={200}
                  className="rounded-[10px] border-2 border-border-light object-cover"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() => setImageUrl(null)}
                  className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 font-body text-xs text-white hover:bg-red-600 transition-colors cursor-pointer border-none"
                >
                  &times;
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-40 w-full items-center justify-center rounded-[10px] border-2 border-dashed border-border-strong bg-bg-input hover:border-text-placeholder transition-colors cursor-pointer"
              >
                <span className="font-body text-sm text-text-placeholder">
                  클릭하여 이미지 선택 (최대 5MB)
                </span>
              </button>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block font-body text-base font-bold text-admin-dark">
              설명
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="브랜드/제품에 대한 자유로운 설명을 입력하세요"
              rows={4}
              className="w-full resize-none rounded-[10px] border-2 border-border-strong px-4 py-3.5 font-body text-base text-admin-dark outline-none transition-colors placeholder:text-text-disabled focus:border-admin-dark"
            />
          </div>

          {/* Certifications */}
          <div>
            <label className="mb-2 block font-body text-base font-bold text-admin-dark">
              인증/자격
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {certifications.map((cert, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 rounded-full border-2 border-border-light bg-bg-light px-3 py-1.5 font-body text-sm text-admin-dark"
                >
                  {cert}
                  <button
                    type="button"
                    onClick={() =>
                      setCertifications((prev) =>
                        prev.filter((_, i) => i !== index),
                      )
                    }
                    className="ml-0.5 font-body text-sm text-text-placeholder hover:text-red-500 transition-colors cursor-pointer bg-transparent border-none p-0 leading-none"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={certInput}
              onChange={(e) => setCertInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const value = certInput.trim();
                  if (value && !certifications.includes(value)) {
                    setCertifications((prev) => [...prev, value]);
                    setCertInput('');
                  }
                }
              }}
              placeholder="인증명을 입력 후 Enter (예: KFDA, CE, FDA)"
              className="w-full rounded-[10px] border-2 border-border-strong px-4 py-3.5 font-body text-base text-admin-dark outline-none transition-colors placeholder:text-text-disabled focus:border-admin-dark"
            />
          </div>

          {/* Models */}
          <div>
            <label className="mb-2 block font-body text-base font-bold text-admin-dark">
              모델 목록
            </label>
            {errors.models && (
              <p className="mb-2 font-body text-sm text-red-500">
                {errors.models}
              </p>
            )}
            <div className="flex flex-col gap-4">
              {models.map((model, index) => (
                <div
                  key={index}
                  className="rounded-[10px] border-2 border-border-light bg-white p-5"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-body text-sm font-bold text-admin-dark">
                      모델 {index + 1}
                    </span>
                    {models.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeModel(index)}
                        className="font-body text-sm font-semibold text-text-placeholder hover:text-red-500 transition-colors cursor-pointer bg-transparent border-none"
                      >
                        삭제
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="mb-1 block font-body text-sm text-text-label">
                        제품명
                      </label>
                      <input
                        type="text"
                        value={model.name}
                        onChange={(e) =>
                          updateModel(index, 'name', e.target.value)
                        }
                        placeholder="예: Neuramis Volume Lidocaine"
                        className="w-full rounded-lg border-2 border-border-strong px-3.5 py-2.5 font-body text-sm text-admin-dark outline-none transition-colors placeholder:text-text-disabled focus:border-admin-dark"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block font-body text-sm text-text-label">
                        설명
                      </label>
                      <input
                        type="text"
                        value={model.description}
                        onChange={(e) =>
                          updateModel(index, 'description', e.target.value)
                        }
                        placeholder="예: 1.1ml, Deep layer filler with lidocaine"
                        className="w-full rounded-lg border-2 border-border-strong px-3.5 py-2.5 font-body text-sm text-admin-dark outline-none transition-colors placeholder:text-text-disabled focus:border-admin-dark"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addModel}
              className="mt-3 w-full rounded-[10px] border-2 border-dashed border-border-medium py-3 font-body text-sm font-semibold text-text-placeholder hover:border-text-placeholder hover:text-text-label transition-colors cursor-pointer bg-transparent"
            >
              + 모델 추가
            </button>
          </div>
        </div>
      </div>

      {/* Fixed footer */}
      <div className="fixed bottom-0 right-0 left-[224px] z-10 border-t-2 border-border-light bg-white px-8 py-4 max-lg:left-[196px] max-md:left-[182px] max-sm:left-0">
        <div className="mx-auto flex max-w-[800px] items-center justify-between">
          <div>
            {isEdit && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-lg border-2 border-red-400 px-5 py-2.5 font-body text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors cursor-pointer bg-transparent disabled:opacity-50"
              >
                {isDeleting ? '삭제 중...' : '삭제'}
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push('/admin/brands')}
              className="rounded-lg border-2 border-border-strong px-5 py-2.5 font-body text-sm font-semibold text-text-label hover:border-text-placeholder transition-colors cursor-pointer bg-transparent"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-lg bg-admin-dark px-6 py-2.5 font-body text-sm font-semibold text-white hover:bg-admin-dark-hover transition-colors cursor-pointer border-none disabled:opacity-50"
            >
              {isSaving ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
