'use client';

export default function ShopError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-5">
      <h2 className="mb-3 font-display text-2xl font-bold text-admin-dark">
        Something went wrong
      </h2>
      <p className="mb-6 font-body text-base text-text-muted">
        {error.message || 'An unexpected error occurred.'}
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-admin-dark px-6 py-3 font-body text-sm font-semibold text-white transition-colors hover:bg-black cursor-pointer border-none"
      >
        Try again
      </button>
    </div>
  );
}
