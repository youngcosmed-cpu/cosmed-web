import type { Metadata } from 'next';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query/get-query-client';
import { serverFetch } from '@/lib/api/server';
import { queryKeys } from '@/lib/query/query-keys';
import { BrandDetail } from '@/components/ui/BrandDetail';
import { JsonLd } from '@/components/seo/JsonLd';
import type { Brand } from '@/types/brand';
import type { Review } from '@/types/review';
import type { PaginatedResponse } from '@/types/api';

const SITE_URL = process.env.SITE_URL || 'https://youngcosmed.com';

interface BrandPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: BrandPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const brand = await serverFetch<Brand>(`/brands/${id}`);
    const title = brand.name;
    const description =
      brand.description ||
      `${brand.name} — medical aesthetic products available for B2B wholesale at Young Cosmed.`;

    return {
      title,
      description,
      alternates: { canonical: `/brands/${id}` },
      openGraph: {
        title,
        description,
        ...(brand.imageUrl && {
          images: [{ url: brand.imageUrl, alt: brand.name }],
        }),
      },
    };
  } catch {
    return { title: 'Brand' };
  }
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { id } = await params;
  const numericId = Number(id);
  const queryClient = getQueryClient();

  let brand: Brand | null = null;
  try {
    brand = await serverFetch<Brand>(`/brands/${id}`);
    // Seed the query cache so BrandDetail renders with data on the server
    queryClient.setQueryData(queryKeys.brands.detail(numericId), brand);
  } catch {
    // BrandDetail will handle the error via client-side query
  }

  // Prefetch reviews in parallel (non-blocking)
  await queryClient.prefetchInfiniteQuery({
    queryKey: queryKeys.reviews.list(numericId),
    queryFn: () =>
      serverFetch<PaginatedResponse<Review>>(
        `/reviews?brandId=${id}`,
      ),
    initialPageParam: undefined as number | undefined,
  }).catch(() => {});

  return (
    <>
      {brand && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Brand',
            name: brand.name,
            url: `${SITE_URL}/brands/${brand.id}`,
            ...(brand.description && { description: brand.description }),
            ...(brand.imageUrl && { image: brand.imageUrl }),
          }}
        />
      )}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <BrandDetail id={numericId} />
      </HydrationBoundary>
    </>
  );
}
