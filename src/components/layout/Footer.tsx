import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#E6DED3] border-t border-primary/10 pt-15 pb-10">
      <div className="max-w-[1400px] mx-auto px-15 max-md:px-6 max-[992px]:px-10">
        {/* Top */}
        <div className="flex justify-between items-start max-md:flex-col max-md:gap-6">
          <div>
            <div className="font-display text-[19px] font-semibold tracking-[0.08em] text-primary mb-2">
              Young Cosmed
            </div>
            <p className="text-[13px] font-light tracking-[0.02em] text-text-secondary">
              Medical Aesthetic Products
            </p>
          </div>
          <nav className="flex gap-8 max-md:gap-6">
            <a href="#products" className="font-body text-[13px] font-normal text-text-secondary no-underline tracking-[0.02em] hover:text-primary transition-colors">
              Products
            </a>
            <a href="#about" className="font-body text-[13px] font-normal text-text-secondary no-underline tracking-[0.02em] hover:text-primary transition-colors">
              About
            </a>
            <a href="#contact" className="font-body text-[13px] font-normal text-text-secondary no-underline tracking-[0.02em] hover:text-primary transition-colors">
              Contact
            </a>
          </nav>
        </div>

        {/* Divider */}
        <div className="h-px bg-primary/10 my-8" />

        {/* Info */}
        <div className="grid grid-cols-2 gap-x-12 gap-y-4 max-md:grid-cols-1 max-md:gap-3">
          <div className="flex gap-3 items-baseline max-md:flex-col max-md:gap-0.5">
            <span className="font-body text-xs font-light text-primary/45 tracking-[0.02em] whitespace-nowrap min-w-[100px] max-md:min-w-0">
              CEO
            </span>
            <span className="font-body text-[13px] font-normal text-text-secondary">
              Eun Young Kwak
            </span>
          </div>
          <div className="flex gap-3 items-baseline max-md:flex-col max-md:gap-0.5">
            <span className="font-body text-xs font-light text-primary/45 tracking-[0.02em] whitespace-nowrap min-w-[100px] max-md:min-w-0">
              Business Reg. No.
            </span>
            <span className="font-body text-[13px] font-normal text-text-secondary">
              763-58-00698
            </span>
          </div>
          <div className="flex gap-3 items-baseline max-md:flex-col max-md:gap-0.5">
            <span className="font-body text-xs font-light text-primary/45 tracking-[0.02em] whitespace-nowrap min-w-[100px] max-md:min-w-0">
              Address
            </span>
            <span className="font-body text-[13px] font-normal text-text-secondary">
              #1603, 118, Seongsui-ro, Seongdong-gu, Seoul
            </span>
          </div>
          <div className="flex gap-3 items-baseline max-md:flex-col max-md:gap-0.5">
            <span className="font-body text-xs font-light text-primary/45 tracking-[0.02em] whitespace-nowrap min-w-[100px] max-md:min-w-0">
              WhatsApp
            </span>
            <a
              href="https://wa.me/821063040851"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-[13px] font-normal text-text-secondary no-underline hover:text-primary transition-colors"
            >
              +82 10 6304 0851
            </a>
          </div>
          <div className="flex gap-3 items-baseline max-md:flex-col max-md:gap-0.5">
            <span className="font-body text-xs font-light text-primary/45 tracking-[0.02em] whitespace-nowrap min-w-[100px] max-md:min-w-0">
              Email
            </span>
            <a
              href="mailto:youngcosmed@gmail.com"
              className="font-body text-[13px] font-normal text-text-secondary no-underline hover:text-primary transition-colors"
            >
              youngcosmed@gmail.com
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-primary/10 my-8" />

        {/* Bottom */}
        <div className="flex justify-between items-center max-md:flex-col max-md:gap-4 max-md:text-center">
          <p className="text-xs font-light tracking-[0.02em] text-primary/50">
            © 2025 Young Cosmed. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="https://instagram.com/young_cosmed"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-light tracking-[0.02em] text-primary/50 no-underline hover:text-primary transition-colors"
            >
              Instagram
            </a>
            <Link
              href="/admin"
              className="text-xs font-light tracking-[0.02em] text-primary/50 no-underline hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
