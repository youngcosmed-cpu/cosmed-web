'use client';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-5">
      <h2 className="mb-3 font-display text-xl font-bold text-admin-dark">
        오류가 발생했습니다
      </h2>
      <p className="mb-6 font-body text-sm text-text-muted">
        {error.message || '예기치 않은 오류가 발생했습니다.'}
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-admin-dark px-5 py-2.5 font-body text-sm font-semibold text-white transition-colors hover:bg-admin-dark-hover cursor-pointer border-none"
      >
        다시 시도
      </button>
    </div>
  );
}
