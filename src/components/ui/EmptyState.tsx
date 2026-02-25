'use client';

import { useLang } from '@/lib/i18n/lang-provider';

export function EmptyState() {
  const { t } = useLang();

  return (
    <div className="col-span-full flex items-center justify-center py-20">
      <p className="text-text-muted text-sm font-light tracking-[0.01em]">
        {t.products.emptyState}
      </p>
    </div>
  );
}
