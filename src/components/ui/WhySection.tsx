'use client';

import { useEffect, useRef, useState } from 'react';

const whyCards = [
  {
    number: '30+',
    title: 'Global-Ready Products',
    desc: 'Export-ready formulations and packaging compliant with international regulations.',
  },
  {
    number: '200+',
    title: 'Clear MOQ & Pricing',
    desc: 'Transparent wholesale conditions with no hidden costs or complicated tiers.',
  },
  {
    number: '24h',
    title: 'Direct Communication',
    desc: 'No middleman. Direct response from our sourcing team within 24 hours.',
  },
  {
    number: '100%',
    title: 'Curated Selection',
    desc: 'Only verified Korean medical aesthetic products from trusted manufacturers.',
  },
];

export function WhySection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-30 max-md:py-20 overflow-hidden"
      id="about"
      style={{
        background: 'linear-gradient(to bottom, #F8F6F3, #F1EEE9)',
      }}
    >
      {/* Grain texture overlay - 3% opacity */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-[1400px] mx-auto px-15 max-md:px-6 max-[992px]:px-10">
        {/* Section Header */}
        <div className="mb-16 max-md:mb-12 text-center">
          <h2 className="font-display text-4xl font-semibold tracking-[-0.01em] text-primary max-md:text-[28px]">
            Why Global Buyers Choose Young Cosmed
          </h2>
          <p
            style={{
              fontSize: '18px',
              color: '#6B6B6B',
              marginTop: '12px',
            }}
          >
            Trusted by clinics, distributors, and aesthetic professionals worldwide.
          </p>
        </div>

        {/* Cards Grid - 4 columns desktop, 2 tablet, 1 mobile */}
        <div className="grid grid-cols-4 gap-10 max-lg:grid-cols-2 max-md:grid-cols-1 max-md:gap-6">
          {whyCards.map((card, index) => (
            <div
              key={index}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: `all 0.6s ease ${index * 0.1}s`,
              }}
            >
              <div
                className="h-full"
                style={{
                  backgroundColor: '#F6F4F1',
                  borderRadius: '12px',
                  padding: '40px',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  const target = e.currentTarget;
                  target.style.transform = 'translateY(-6px)';
                  target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget;
                  target.style.transform = 'translateY(0)';
                  target.style.boxShadow = 'none';
                }}
              >
                {/* Accent Line */}
                <div
                  style={{
                    width: '40px',
                    height: '3px',
                    backgroundColor: '#C9B9A6',
                    marginBottom: '16px',
                  }}
                />

                {/* Number - 48px, bold */}
                <span
                  className="block font-display"
                  style={{
                    fontSize: '48px',
                    fontWeight: 700,
                    color: '#1a1a1a',
                    marginBottom: '6px',
                    lineHeight: 1,
                  }}
                >
                  {card.number}
                </span>

                {/* Title - 16px */}
                <h3
                  className="font-display font-semibold text-primary tracking-[-0.01em]"
                  style={{
                    fontSize: '16px',
                    marginBottom: '12px',
                  }}
                >
                  {card.title}
                </h3>

                {/* Description - 14px, line-height 1.6 */}
                <p
                  className="text-text-secondary"
                  style={{
                    fontSize: '14px',
                    lineHeight: 1.6,
                  }}
                >
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Divider */}
        <div
          style={{
            width: '120px',
            height: '1px',
            backgroundColor: '#E6E2DD',
            margin: '60px auto',
          }}
        />

        {/* Trust Statement */}
        <p
          style={{
            fontSize: '14px',
            color: '#8A8A8A',
            textAlign: 'center',
          }}
        >
          Trusted by aesthetic clinics and distributors worldwide since 2024.
        </p>
      </div>
    </section>
  );
}
