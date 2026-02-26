export function BrandGridSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[4/5] bg-warm-gray" />
          <div className="py-4">
            <div className="h-4 w-24 bg-warm-gray rounded" />
          </div>
        </div>
      ))}
    </>
  );
}
