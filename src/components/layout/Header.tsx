'use client';

import Link from 'next/link';
import { useLang } from '@/lib/i18n/lang-provider';

export function Header({ minimal = false }: { minimal?: boolean }) {
  const { t } = useLang();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-[10px] border-b border-border">
      <div className="max-w-[1400px] mx-auto px-15 py-5 flex items-center max-md:px-6 max-md:py-4 max-[992px]:px-10">
        <Link href="/" className="font-display text-[19px] font-semibold tracking-[0.08em] text-deep-charcoal no-underline">
          Young Cosmed
        </Link>
        {!minimal && (
          <>
            <nav className="flex gap-12 ml-auto mr-12 max-md:hidden max-[992px]:gap-8">
              <a href="#products" className="text-sm font-normal text-text-secondary no-underline hover:text-deep-charcoal transition-colors">
                {t.nav.products}
              </a>
              <a href="#about" className="text-sm font-normal text-text-secondary no-underline hover:text-deep-charcoal transition-colors">
                {t.nav.about}
              </a>
              <a href="#contact" className="text-sm font-normal text-text-secondary no-underline hover:text-deep-charcoal transition-colors">
                {t.nav.contact}
              </a>
            </nav>
            <Link
              href="/admin"
              className="text-sm font-medium text-text-secondary no-underline hover:text-deep-charcoal transition-colors max-md:text-xs"
            >
              Dashboard
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
