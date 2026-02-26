'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useBrand } from '@/hooks/queries/use-brand';
import { BrandDetailSkeleton } from './BrandDetailSkeleton';
import { ReviewForm } from './ReviewForm';
import { ReviewList } from './ReviewList';

// Check icon for selected variant checkbox
function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5 text-white">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function BrandDetail({ id }: { id: number }) {
  const router = useRouter();
  const { data: brand, isLoading } = useBrand(id);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  if (isLoading || !brand) {
    return <BrandDetailSkeleton />;
  }

  const handleProductToggle = (productId: number) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const handleOpenChat = () => {
    const params = new URLSearchParams({ brandId: String(id) });
    if (selectedProducts.length > 0) {
      params.set('productIds', selectedProducts.join(','));
    }
    router.push(`/chat?${params.toString()}`);
  };

  const categoryName = brand.category?.name ?? 'GENERAL';

  return (
    <div
      className="min-h-screen bg-white animate-[fadeIn_0.6s_ease-out]"
    >
      <div className="max-w-[1400px] mx-auto px-15 pt-10 pb-20 max-lg:px-10 max-md:px-5 max-md:pt-6 max-md:pb-15">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="group/back inline-flex items-center gap-2.5 bg-transparent border-none font-body text-[13px] font-normal text-text-label cursor-pointer py-3 mb-10 tracking-[0.02em] transition-all duration-300 hover:text-admin-dark max-md:mb-5 max-md:text-sm"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-[18px] h-[18px] transition-transform duration-300 group-hover/back:-translate-x-1"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>Back to Products</span>
        </button>

        {/* Header: Category + Brand Name */}
        <header
          className="mb-12 max-[992px]:mb-8 max-md:mb-6 animate-[fadeSlideUp_0.6s_cubic-bezier(0.16,1,0.3,1)_both]"
        >
          <span className="inline-block font-body text-[13px] font-semibold tracking-[0.2em] uppercase text-admin-dark bg-bg-light px-5 py-2.5 mb-4 max-md:text-xs max-md:px-4 max-md:py-2 max-md:mb-4">
            {categoryName}
          </span>
          <h1 className="font-display text-[56px] font-bold tracking-[-0.03em] leading-[1.05] text-admin-dark max-lg:text-5xl max-[992px]:text-[44px] max-md:text-4xl max-[480px]:text-[32px]">
            {brand.name}
          </h1>
        </header>

        {/* Hero Section: 2-column grid */}
        <section className="grid grid-cols-2 gap-25 items-start max-[992px]:grid-cols-1 max-[992px]:gap-10 max-lg:gap-[70px]">
          {/* Left: Brand Image */}
          <div
            className="sticky top-10 max-[992px]:static max-[992px]:top-0 max-[992px]:max-w-[480px] max-[992px]:mx-auto max-[992px]:w-full animate-[fadeSlideLeft_0.8s_cubic-bezier(0.16,1,0.3,1)_both]"
          >
            <div className="bg-bg-light aspect-square overflow-hidden relative group/img">
              {brand.imageUrl ? (
                <Image
                  src={brand.imageUrl}
                  alt={brand.name}
                  fill
                  sizes="(max-width: 992px) 480px, 50vw"
                  className="object-cover transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/img:scale-105"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-muted text-lg">
                  {brand.name}
                </div>
              )}
            </div>
          </div>

          {/* Right: Product Selector */}
          <div
            className="py-10 flex flex-col max-[992px]:py-0 animate-[fadeSlideUp_0.8s_cubic-bezier(0.16,1,0.3,1)_0.2s_both]"
          >
            <div className="flex flex-col h-full">
              {/* Selector Header */}
              <div className="mb-8 max-md:mb-6">
                <h2 className="font-display text-2xl font-bold text-admin-dark mb-2 tracking-[-0.02em] max-[992px]:text-[22px] max-md:text-xl">
                  Select Product Variants
                </h2>
                <p className="text-[15px] text-text-muted">
                  Choose one or more products for your inquiry
                </p>
              </div>

              {/* Product Variants List */}
              <div className="flex flex-col gap-3 flex-1">
                {brand.products && brand.products.length > 0 ? (
                  brand.products.map((product) => {
                    const isSelected = selectedProducts.includes(product.id);
                    return (
                      <div
                        key={product.id}
                        onClick={() => handleProductToggle(product.id)}
                        className={`flex items-center gap-4 px-6 py-5 cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] border-2 max-md:px-[18px] max-md:py-4 max-[480px]:gap-3 max-[480px]:px-4 max-[480px]:py-3.5 ${
                          isSelected
                            ? 'bg-white border-admin-dark'
                            : 'bg-bg-input border-transparent hover:bg-bg-muted hover:border-border-strong'
                        }`}
                      >
                        {/* Checkbox */}
                        <div
                          className={`w-[26px] h-[26px] border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${
                            isSelected
                              ? 'bg-admin-dark border-admin-dark'
                              : 'border-border-medium'
                          }`}
                        >
                          <span
                            className={`transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                              isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                            }`}
                          >
                            <CheckIcon />
                          </span>
                        </div>

                        {/* Variant Info */}
                        <div className="flex flex-col gap-1 flex-1">
                          <span className="text-[17px] font-semibold text-admin-dark max-md:text-[15px] max-[480px]:text-sm">
                            {product.name}
                          </span>
                          {product.description && (
                            <span className="text-sm text-text-muted leading-[1.4] max-md:text-[13px] max-[480px]:text-xs whitespace-pre-line break-words">
                              {product.description}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-[15px] text-text-muted py-4">
                    No product variants available.
                  </p>
                )}
              </div>

              {/* CTA Section */}
              <div className="mt-8 pt-8 border-t border-border-light max-md:mt-6 max-md:pt-6">
                {selectedProducts.length > 0 && (
                  <span className="inline-block text-[13px] font-semibold text-white bg-admin-dark px-4 py-2 mb-4">
                    {selectedProducts.length} selected
                  </span>
                )}
                <button
                  onClick={handleOpenChat}
                  className="w-full inline-flex items-center justify-center gap-4 text-lg font-semibold tracking-[0.01em] px-16 py-6 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] no-underline max-md:px-8 max-md:py-5 max-md:text-[15px] bg-admin-dark text-white cursor-pointer hover:bg-black hover:-translate-y-[3px] hover:shadow-[0_12px_32px_rgba(0,0,0,0.18)]"
                >
                  <span>Discuss Wholesale Terms</span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-[22px] h-[22px] transition-transform duration-300"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
                <p className="text-base font-normal text-text-muted text-center max-w-[450px] mx-auto leading-[1.5] mt-3 max-md:text-sm">
                  Ask about pricing, MOQ, certifications and global shipping.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Details Section */}
        <section className="py-20 border-t border-border-light max-[992px]:py-14 max-md:py-12">
          <div className="max-w-[1000px] mx-auto">
            {/* Certification Badges */}
            {(brand.certifications?.length > 0) && (
              <div className="flex flex-wrap gap-3 justify-center mb-10 max-md:gap-2.5 max-md:mb-8">
                {brand.certifications.map((cert, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center justify-center font-body text-[13px] font-semibold tracking-[0.04em] text-admin-dark px-6 py-3 bg-transparent border-[1.5px] border-admin-dark transition-all duration-300 hover:bg-admin-dark hover:text-white max-md:text-xs max-md:px-[18px] max-md:py-2.5"
                  >
                    {cert}
                  </span>
                ))}
                {/* Medical license badge — shown for all brands in this B2B medical context */}
                <span className="inline-flex items-center gap-2 font-body text-[13px] font-medium tracking-[0.02em] text-text-label px-6 py-3 bg-bg-light max-md:text-xs max-md:px-[18px] max-md:py-2.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Medical license required
                </span>
              </div>
            )}

            {/* Brand Description */}
            {brand.description && (
              <div className="max-w-[800px] mx-auto mb-16 text-center max-[992px]:mb-12 max-md:mb-10 max-md:text-left">
                <p className="text-xl font-normal leading-[1.8] text-text-strong max-[992px]:text-lg max-md:text-base whitespace-pre-line break-words">
                  {brand.description}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Reviews Section */}
        <section className="py-25 border-t border-border-light bg-gradient-to-b from-bg-input to-bg-light -mx-15 px-15 max-lg:-mx-10 max-lg:px-10 max-md:-mx-5 max-md:px-5 max-[992px]:py-[72px] max-md:py-16">
          <div className="max-w-[1100px] mx-auto">
            {/* Reviews Header */}
            <div className="text-center mb-14 max-md:mb-10">
              <span className="inline-block font-body text-xs font-semibold tracking-[0.2em] uppercase text-text-muted mb-4 max-md:text-[11px]">
                REVIEWS
              </span>
              <h2 className="font-display text-4xl font-bold text-admin-dark mb-3 tracking-[-0.02em] max-[992px]:text-[32px] max-md:text-[28px] max-[480px]:text-2xl">
                Customer Reviews
              </h2>
              <p className="text-[17px] text-text-label font-normal max-md:text-[15px]">
                Real feedback from our valued partners
              </p>
            </div>

            {/* Review Form */}
            <div className="mb-8">
              <ReviewForm brandId={id} />
            </div>

            {/* Review List */}
            <ReviewList brandId={id} />
          </div>
        </section>
      </div>
    </div>
  );
}
