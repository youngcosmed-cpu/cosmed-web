import type { Metadata } from 'next';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query/get-query-client';
import { serverFetch } from '@/lib/api/server';
import { queryKeys } from '@/lib/query/query-keys';
import { BrandGrid } from '@/components/ui/BrandGrid';
import { WhySection } from '@/components/ui/WhySection';
import { CtaSection } from '@/components/ui/CtaSection';
import { JsonLd } from '@/components/seo/JsonLd';
import type { PaginatedResponse } from '@/types/api';
import type { Brand } from '@/types/brand';

const SITE_URL = process.env.SITE_URL || 'https://youngcosmed.com';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default async function HomePage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: queryKeys.brands.list(undefined),
    queryFn: () => serverFetch<PaginatedResponse<Brand>>('/brands'),
    initialPageParam: undefined as number | undefined,
  });

  return (
    <main>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Young Cosmed',
          url: SITE_URL,
          description:
            'K-Beauty B2B wholesale platform for medical aesthetic products. Fillers, skin boosters, and more from trusted Korean manufacturers.',
        }}
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <BrandGrid />
      </HydrationBoundary>
      <WhySection />
      <CtaSection />
    </main>
  );
}
