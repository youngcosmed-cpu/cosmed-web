export function CtaSection() {
  return (
    <section className="py-30 bg-primary text-center max-md:py-20" id="contact">
      <div className="max-w-[700px] mx-auto px-15 max-md:px-6">
        <h2 className="font-display text-4xl font-semibold text-white tracking-[-0.01em] mb-5 max-md:text-[28px]">
          Start your wholesale sourcing with confidence.
        </h2>
        <p className="text-base font-normal text-cool-gray mb-12 leading-relaxed">
          Get in touch with our team for pricing, samples, and partnership opportunities.
        </p>
        <a
          href="mailto:wholesale@youngcosmed.com"
          className="inline-block font-body text-sm font-medium no-underline tracking-[0.02em] px-8 py-4 bg-beige text-primary hover:bg-beige-hover transition-all"
        >
          Contact for Wholesale
        </a>
      </div>
    </section>
  );
}
