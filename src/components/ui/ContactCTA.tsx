export function ContactCTA() {
  return (
    <section className="py-30 bg-[#E6DED3] max-md:py-20" id="contact">
      <div className="max-w-[1400px] mx-auto px-15 max-md:px-6 max-[992px]:px-10 text-center">
        <h2 className="font-display text-4xl font-semibold tracking-[-0.01em] text-primary mb-5 max-md:text-[28px]">
          Feel Free to Contact Us
        </h2>
        <p className="font-body text-base font-light leading-relaxed text-text-secondary max-w-[520px] mx-auto mb-12 max-md:text-[15px] max-md:mb-10">
          Get in touch with our sourcing team for product catalogs, pricing,
          and MOQ details. We respond within 24 hours.
        </p>
        <div className="flex gap-4 justify-center max-md:flex-col max-md:gap-3">
          <a
            href="mailto:youngcosmed@gmail.com"
            className="inline-flex items-center justify-center px-10 py-4 bg-primary text-white text-sm font-semibold tracking-[0.04em] no-underline hover:bg-primary-hover transition-colors"
          >
            youngcosmed@gmail.com
          </a>
          <a
            href="https://instagram.com/young_cosmed"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-10 py-4 border border-primary/25 text-primary text-sm font-normal tracking-[0.04em] no-underline hover:bg-primary/5 transition-colors"
          >
            Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
