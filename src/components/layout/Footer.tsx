import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-primary border-t border-white/[0.08] pt-15 pb-10">
      <div className="max-w-[1400px] mx-auto px-15 max-md:px-6 max-[992px]:px-10">
        {/* Top */}
        <div className="flex justify-between items-start max-md:flex-col max-md:gap-6">
          <div>
            <div className="font-display text-[19px] font-semibold tracking-[0.08em] text-white mb-2">
              Young Cosmed
            </div>
            <p className="text-[13px] font-light tracking-[0.02em] text-text-muted">
              Medical Aesthetic Products
            </p>
          </div>
          <nav className="flex gap-8 max-md:gap-6">
            <a href="#products" className="font-body text-[13px] font-normal text-text-muted no-underline tracking-[0.02em] hover:text-white transition-colors">
              Products
            </a>
            <a href="#about" className="font-body text-[13px] font-normal text-text-muted no-underline tracking-[0.02em] hover:text-white transition-colors">
              About
            </a>
            <a href="#contact" className="font-body text-[13px] font-normal text-text-muted no-underline tracking-[0.02em] hover:text-white transition-colors">
              Contact
            </a>
          </nav>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/[0.08] my-8" />

        {/* Info */}
        <div className="grid grid-cols-2 gap-x-12 gap-y-4 max-md:grid-cols-1 max-md:gap-3">
          <div className="flex gap-3 items-baseline max-md:flex-col max-md:gap-0.5">
            <span className="font-body text-xs font-light text-white/35 tracking-[0.02em] whitespace-nowrap min-w-[100px] max-md:min-w-0">
              CEO
            </span>
            <span className="font-body text-[13px] font-normal text-text-muted">
              Eun Young Kwak
            </span>
          </div>
          <div className="flex gap-3 items-baseline max-md:flex-col max-md:gap-0.5">
            <span className="font-body text-xs font-light text-white/35 tracking-[0.02em] whitespace-nowrap min-w-[100px] max-md:min-w-0">
              Business Reg. No.
            </span>
            <span className="font-body text-[13px] font-normal text-text-muted">
              763-58-00698
            </span>
          </div>
          <div className="flex gap-3 items-baseline max-md:flex-col max-md:gap-0.5">
            <span className="font-body text-xs font-light text-white/35 tracking-[0.02em] whitespace-nowrap min-w-[100px] max-md:min-w-0">
              Address
            </span>
            <span className="font-body text-[13px] font-normal text-text-muted">
              #1603, 118, Seongsui-ro, Seongdong-gu, Seoul
            </span>
          </div>
          <div className="flex gap-3 items-baseline max-md:flex-col max-md:gap-0.5">
            <span className="font-body text-xs font-light text-white/35 tracking-[0.02em] whitespace-nowrap min-w-[100px] max-md:min-w-0">
              Email
            </span>
            <a
              href="mailto:youngcosmed@gmail.com"
              className="font-body text-[13px] font-normal text-text-muted no-underline hover:text-white transition-colors"
            >
              youngcosmed@gmail.com
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/[0.08] my-8" />

        {/* Bottom */}
        <div className="flex justify-between items-center max-md:flex-col max-md:gap-4 max-md:text-center">
          <p className="text-xs font-light tracking-[0.02em] text-white/30">
            © 2025 Young Cosmed. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="https://instagram.com/young_cosmed"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-light tracking-[0.02em] text-white/30 no-underline hover:text-white transition-colors"
            >
              Instagram
            </a>
            <Link
              href="/admin"
              className="text-xs font-light tracking-[0.02em] text-white/30 no-underline hover:text-white transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
