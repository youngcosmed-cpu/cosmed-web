'use client';

import Link from 'next/link';
import { useLang } from '@/lib/i18n/lang-provider';

export function Header() {
  const { lang, t, toggleLang } = useLang();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-[10px] border-b border-border">
      <div className="max-w-[1400px] mx-auto px-15 py-5 flex items-center max-md:px-6 max-md:py-4 max-[992px]:px-10">
        <Link href="/" className="font-display text-[19px] font-semibold tracking-[0.08em] text-deep-charcoal no-underline">
          Young Cosmed
        </Link>
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
        <div className="flex items-center gap-6 max-md:gap-3">
          <div className="flex items-center gap-2">
            <button
              className={`bg-transparent border-none font-body text-[13px] font-medium tracking-[0.02em] cursor-pointer px-[2px] py-1 transition-colors max-md:text-xs ${
                lang === 'en' ? 'text-deep-charcoal' : 'text-text-muted hover:text-text-secondary'
              }`}
              onClick={() => toggleLang('en')}
            >
              EN
            </button>
            <span className="text-border text-xs select-none">|</span>
            <button
              className={`bg-transparent border-none font-body text-[13px] font-medium tracking-[0.02em] cursor-pointer px-[2px] py-1 transition-colors max-md:text-xs ${
                lang === 'ko' ? 'text-deep-charcoal' : 'text-text-muted hover:text-text-secondary'
              }`}
              onClick={() => toggleLang('ko')}
            >
              KR
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
