import Image from 'next/image';

export function LandingHero() {
  return (
    <section className="relative h-dvh min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <Image
        src="/예시사진/배경.jpeg"
        alt=""
        fill
        priority
        className="object-cover object-center"
        quality={90}
      />

      {/* Warm light overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F5F2EF]/25 via-transparent to-[#F5F2EF]/70" />

      {/* Content */}
      <div className="relative z-10 text-center">
        <p
          className="font-body text-[15px] font-medium tracking-[0.2em] uppercase text-text-strong mb-6 max-md:mb-4 max-md:text-[13px]"
          style={{ animation: 'fadeSlideUp 0.8s ease-out both' }}
        >
          GLOBAL AESTHETIC SOLUTION &middot; YOUNGCOSMED
        </p>
        <h1
          className="font-display text-[72px] font-semibold tracking-[-0.02em] leading-[1.1] text-primary mb-8 max-md:text-[38px] max-lg:text-[52px]"
          style={{ animation: 'fadeSlideUp 0.8s ease-out 0.15s both' }}
        >
          Precision You Trust,
          <br />
          Beauty That Lasts
        </h1>
        <p
          className="font-body text-lg font-normal leading-relaxed text-text-strong max-w-[520px] mx-auto mb-12 max-md:text-base max-md:mb-8 max-md:px-6"
          style={{ animation: 'fadeSlideUp 0.8s ease-out 0.3s both' }}
        >
          From OEM manufacturing to globally trusted aesthetic brands,
          we supply premium Korean products to partners across 30+ countries.
        </p>
        <div
          style={{ animation: 'fadeSlideUp 0.8s ease-out 0.45s both' }}
        >
          <a
            href="#products"
            className="inline-flex items-center justify-center px-14 py-5 bg-primary text-white text-base font-semibold tracking-[0.04em] no-underline hover:bg-primary-hover transition-colors"
          >
            Browse Products
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 max-md:hidden"
        style={{ animation: 'fadeIn 1s ease-out 1s both' }}
      >
        <span className="block w-px h-8 bg-primary/30 animate-pulse" />
      </div>
    </section>
  );
}
