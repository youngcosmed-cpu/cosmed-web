export function BrandDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto px-15 pt-10 pb-20 max-lg:px-10 max-md:px-5 max-md:pt-6 max-md:pb-15">
        {/* Back button skeleton */}
        <div className="h-4 w-32 bg-warm-gray rounded mb-10 max-md:mb-5 animate-pulse" />

        {/* Header skeleton */}
        <div className="mb-12 max-md:mb-6">
          <div className="h-5 w-24 bg-warm-gray rounded mb-4 animate-pulse" />
          <div className="h-14 w-72 bg-warm-gray rounded animate-pulse max-md:h-9 max-md:w-48" />
        </div>

        {/* Hero section skeleton */}
        <div className="grid grid-cols-2 gap-25 max-[992px]:grid-cols-1 max-[992px]:gap-10 max-lg:gap-[70px]">
          {/* Image */}
          <div className="aspect-square bg-warm-gray animate-pulse max-[992px]:max-w-[480px] max-[992px]:mx-auto max-[992px]:w-full" />

          {/* Product selector */}
          <div className="py-10 max-[992px]:py-0">
            <div className="h-6 w-56 bg-warm-gray rounded mb-2 animate-pulse" />
            <div className="h-4 w-72 bg-warm-gray rounded mb-8 animate-pulse" />
            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-[72px] bg-[#FAFAFA] animate-pulse" />
              ))}
            </div>
            <div className="mt-8 pt-8 border-t border-[#e8e8e8]">
              <div className="h-[66px] bg-warm-gray rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Details section skeleton */}
        <div className="py-20 border-t border-[#e8e8e8] mt-0 max-md:py-12">
          <div className="max-w-[1000px] mx-auto">
            <div className="flex justify-center gap-3 mb-10">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-10 w-24 bg-warm-gray rounded animate-pulse" />
              ))}
            </div>
            <div className="max-w-[800px] mx-auto space-y-3">
              <div className="h-5 w-full bg-warm-gray rounded animate-pulse" />
              <div className="h-5 w-4/5 bg-warm-gray rounded animate-pulse mx-auto" />
              <div className="h-5 w-3/5 bg-warm-gray rounded animate-pulse mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
