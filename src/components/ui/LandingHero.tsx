'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const heroImages = [
  '/images/랜딩 1번.png',
  '/images/랜딩 2..jpg',
  '/images/랜딩 3번 최종.jpg',
  '/images/랜딩 4..jpg',
];

export function LandingHero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000); // 6s duration

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-dvh min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Slideshow */}
      {heroImages.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          priority={index === 0}
          sizes="100vw"
          className="object-cover object-center"
          style={{
            opacity: currentIndex === index ? 1 : 0,
            transition: 'opacity 1.5s ease-in-out',
          }}
        />
      ))}

      {/* Warm light overlay for text readability */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(245,242,238,0.45)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#F5F2EF]/80" />

      {/* Bottom fade into body-bg for seamless transition */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-body-bg" />

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
          Powering Korean
          <br />
          Aesthetics Worldwide
        </h1>
        <p
          className="font-body text-lg font-normal leading-relaxed text-text-strong max-w-[520px] mx-auto mb-12 max-md:text-base max-md:mb-8 max-md:px-6"
          style={{ animation: 'fadeSlideUp 0.8s ease-out 0.3s both' }}
        >
          From OEM to globally trusted aesthetic brands —
          <br />
          premium Korean products, delivered to 30+ countries.
        </p>
      </div>

      {/* Scroll down indicator */}
      <a
        href="#products"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 group cursor-pointer no-underline"
        style={{ animation: 'fadeIn 1s ease-out 1s both' }}
      >
        <span className="text-[11px] font-body font-medium tracking-[0.15em] uppercase text-primary/50 group-hover:text-primary/80 transition-colors">
          Scroll
        </span>
        <svg
          width="20"
          height="28"
          viewBox="0 0 20 28"
          fill="none"
          className="text-primary/40 group-hover:text-primary/70 transition-colors animate-bounce"
          style={{ animationDuration: '2s' }}
        >
          <path
            d="M10 4 L10 22 M4 16 L10 22 L16 16"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </section>
  );
}
