const whyCards = [
  {
    title: 'Global-Ready Products',
    desc: 'Export-ready formulations and packaging compliant with international regulations.',
  },
  {
    title: 'Clear MOQ & Pricing',
    desc: 'Transparent wholesale conditions with no hidden costs or complicated tiers.',
  },
  {
    title: 'Direct Communication',
    desc: 'No middleman. Direct response from our sourcing team within 24 hours.',
  },
  {
    title: 'Curated Selection',
    desc: 'Only verified Korean medical aesthetic products from trusted manufacturers.',
  },
];

export function WhySection() {
  return (
    <section className="py-30 bg-white max-md:py-20" id="about">
      <div className="max-w-[1400px] mx-auto px-15 max-md:px-6 max-[992px]:px-10">
        <h2 className="font-display text-4xl font-semibold tracking-[-0.01em] text-deep-charcoal mb-16 max-md:text-[28px] max-md:mb-12">
          Why Young Cosmed
        </h2>
        <div className="grid grid-cols-4 gap-10 max-lg:grid-cols-2 max-md:grid-cols-1 max-md:gap-6">
          {whyCards.map((card, index) => (
            <div
              key={index}
              className="p-10 px-8 border border-border hover:border-deep-charcoal transition-colors max-md:p-8 max-md:px-6"
            >
              <span className="block font-body text-xs font-light text-olive tracking-[0.02em] mb-6">
                0{index + 1}
              </span>
              <h3 className="font-display text-lg font-semibold text-deep-charcoal mb-4 tracking-[-0.01em]">
                {card.title}
              </h3>
              <p className="text-sm font-normal leading-relaxed text-text-secondary">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
