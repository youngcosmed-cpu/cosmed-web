'use client';

import Image from 'next/image';

const distributionRegions = [
  { region: 'Europe', role: 'Wholesale Partners' },
  { region: 'Middle East', role: 'Active Distribution' },
  { region: 'Southeast Asia', role: 'Fast Logistics' },
  { region: 'North America', role: 'Expanding Market' },
];

export function HeroSection() {
  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-24 pb-20 max-md:pt-20 max-md:pb-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/background.jpg"
            alt=""
            fill
            priority
            className="object-cover object-center"
            quality={90}
          />
          {/* Subtle overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F5F2EF]/80 via-[#F5F2EF]/50 to-transparent max-md:bg-[#F5F2EF]/60" />
        </div>

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-15 max-md:px-6 max-[992px]:px-10">
          <div className="flex flex-col items-center text-center">
            {/* Brand Visual */}
            <div
              className="mb-10 max-md:mb-8"
              style={{
                opacity: 0,
                animation: 'fadeIn 1s ease-out forwards',
                animationDelay: '0.1s',
              }}
            >
              <div className="relative w-full max-w-[420px] max-md:max-w-[280px]">
                <Image
                  src="/YOUNG 1..png"
                  alt="Young Cosmed"
                  width={800}
                  height={400}
                  className="w-full h-auto object-contain"
                  priority
                />
              </div>
            </div>

            {/* Eyebrow */}
            <span
              className="inline-block font-body text-[10px] font-medium tracking-[0.25em] uppercase text-olive mb-5 max-md:mb-4 max-md:text-[9px]"
              style={{
                opacity: 0,
                animation: 'fadeIn 1s ease-out forwards',
                animationDelay: '0.2s',
              }}
            >
              Medical Aesthetic Export
            </span>

            {/* Headline */}
            <h1
              className="font-display text-[48px] font-semibold tracking-[-0.03em] text-primary leading-[1.15] mb-2 max-md:text-[28px] max-md:mb-1 max-[992px]:text-[40px]"
              style={{
                opacity: 0,
                animation: 'fadeIn 1s ease-out forwards',
                animationDelay: '0.3s',
              }}
            >
              Exporting Korean Aesthetics
            </h1>
            <h2
              className="font-display text-[48px] font-medium tracking-[-0.03em] text-text-secondary leading-[1.15] mb-6 max-md:text-[28px] max-md:mb-5 max-[992px]:text-[40px]"
              style={{
                opacity: 0,
                animation: 'fadeIn 1s ease-out forwards',
                animationDelay: '0.4s',
              }}
            >
              Worldwide
            </h2>

            {/* Subline */}
            <p
              className="font-body text-[15px] font-normal text-text-secondary leading-relaxed mb-10 max-md:mb-8 max-md:text-[14px] max-w-[400px]"
              style={{
                opacity: 0,
                animation: 'fadeIn 1s ease-out forwards',
                animationDelay: '0.5s',
              }}
            >
              Structured B2B distribution for clinics and partners.
            </p>

            {/* CTA Row */}
            <div
              className="flex gap-3 max-md:flex-col max-md:gap-3 max-md:w-full max-md:px-4"
              style={{
                opacity: 0,
                animation: 'fadeIn 1s ease-out forwards',
                animationDelay: '0.6s',
              }}
            >
              <button
                onClick={() => handleScrollTo('products')}
                className="px-8 py-4 bg-[#1a1a1a] text-white text-[13px] font-medium tracking-[0.03em] hover:bg-[#333] transition-colors duration-300 max-md:w-full"
              >
                View Catalog
              </button>
              <button
                onClick={() => handleScrollTo('contact')}
                className="px-8 py-4 border border-[#c5c0b8] text-primary text-[13px] font-medium tracking-[0.03em] hover:border-[#1a1a1a] transition-colors duration-300 max-md:w-full"
              >
                Partner With Us
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center max-md:bottom-8"
          style={{
            opacity: 0,
            animation: 'fadeIn 1s ease-out forwards',
            animationDelay: '0.8s',
          }}
        >
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-[#a8a29e]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#918b85] mt-2" />
        </div>
      </section>

      {/* Distribution Network Section */}
      <section className="py-20 bg-white max-md:py-14">
        <div className="max-w-[1400px] mx-auto px-15 max-md:px-6 max-[992px]:px-10">
          {/* Section header */}
          <div className="mb-14 max-md:mb-10">
            <span className="block text-[10px] font-medium tracking-[0.2em] uppercase text-olive mb-4 max-md:mb-3">
              Global Network
            </span>
            <h2 className="font-display text-[32px] font-semibold tracking-[-0.02em] text-primary max-md:text-[26px]">
              Distribution Coverage
            </h2>
          </div>

          {/* Distribution grid */}
          <div className="grid grid-cols-4 gap-6 mb-16 max-[992px]:grid-cols-2 max-md:gap-4 max-md:mb-12">
            {distributionRegions.map((item) => (
              <div
                key={item.region}
                className="p-6 bg-[#faf9f7] rounded-xl border border-[#edeae6] max-md:p-5"
              >
                <span className="block text-[15px] font-semibold text-primary tracking-[-0.01em] mb-2 max-md:text-[14px]">
                  {item.region}
                </span>
                <span className="text-[12px] text-text-muted tracking-[0.01em] max-md:text-[11px]">
                  {item.role}
                </span>
              </div>
            ))}
          </div>

          {/* Metrics */}
          <div className="flex gap-16 max-md:gap-8 max-md:flex-wrap">
            <div>
              <span className="block text-[36px] font-semibold text-primary tracking-[-0.02em] mb-1 max-md:text-[28px]">
                20+
              </span>
              <span className="text-[11px] text-text-muted tracking-[0.08em] uppercase">
                Countries
              </span>
            </div>
            <div>
              <span className="block text-[36px] font-semibold text-primary tracking-[-0.02em] mb-1 max-md:text-[28px]">
                B2B
              </span>
              <span className="text-[11px] text-text-muted tracking-[0.08em] uppercase">
                Wholesale
              </span>
            </div>
            <div>
              <span className="block text-[36px] font-semibold text-primary tracking-[-0.02em] mb-1 max-md:text-[28px]">
                OEM
              </span>
              <span className="text-[11px] text-text-muted tracking-[0.08em] uppercase">
                Available
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Section Header */}
      <section className="pt-16 pb-5 bg-body-bg max-md:pt-10 max-md:pb-3" id="catalog-intro">
        <div className="max-w-[1400px] mx-auto px-15 max-md:px-6 max-[992px]:px-10">
          <div className="flex items-baseline gap-4 max-md:flex-col max-md:gap-1">
            <h2 className="font-display text-[26px] font-semibold tracking-[-0.015em] text-primary max-md:text-[22px]">
              Product Catalog
            </h2>
            <span className="font-body text-[13px] text-text-muted max-md:text-[12px]">
              Certified Korean aesthetic products.
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
