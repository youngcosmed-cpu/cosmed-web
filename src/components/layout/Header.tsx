'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AboutModal } from '@/components/ui/AboutModal';

export function Header({ minimal = false }: { minimal?: boolean }) {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAboutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
    setTimeout(() => {
      setIsAboutModalOpen(true);
    }, 700);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-[10px] border-b border-border">
      <div className="max-w-[1400px] mx-auto px-15 py-5 flex items-center max-md:px-6 max-md:py-4 max-[992px]:px-10">
        <Link
          href="/"
          onClick={handleLogoClick}
          className="font-display text-[19px] font-semibold tracking-[0.08em] text-primary no-underline"
        >
          Young Cosmed
        </Link>
        {!minimal && (
          <>
            <nav className="flex gap-12 ml-auto max-[992px]:gap-8 max-md:gap-4">
              <a href="#products" className="text-sm font-normal text-text-secondary no-underline hover:text-primary transition-colors max-md:hidden">
                Products
              </a>
              <a
                href="#about"
                onClick={handleAboutClick}
                className="text-sm font-normal text-text-secondary no-underline hover:text-primary transition-colors"
              >
                About us
              </a>
              <a href="#contact" className="text-sm font-normal text-text-secondary no-underline hover:text-primary transition-colors max-md:hidden">
                Contact
              </a>
            </nav>
          </>
        )}
      </div>
      <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
    </header>
  );
}
