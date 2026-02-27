import type { MetadataRoute } from 'next';
import { serverFetch } from '@/lib/api/server';
import type { PaginatedResponse } from '@/types/api';
import type { Brand } from '@/types/brand';

const SITE_URL = process.env.SITE_URL || 'https://youngcosmed.com';

export const revalidate = 3600;

async function fetchAllBrands(): Promise<Brand[]> {
  const brands: Brand[] = [];
  let cursor: number | undefined;

  for (;;) {
    const params = new URLSearchParams();
    if (cursor !== undefined) params.set('cursor', String(cursor));

    const path = `/brands${params.size > 0 ? `?${params}` : ''}`;
    const res = await serverFetch<PaginatedResponse<Brand>>(path, {
      revalidate: 3600,
    });

    brands.push(...res.data);

    if (res.nextCursor === null) break;
    cursor = res.nextCursor;
  }

  return brands;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const brands = await fetchAllBrands();

  const brandEntries: MetadataRoute.Sitemap = brands.map((brand) => ({
    url: `${SITE_URL}/brands/${brand.id}`,
    lastModified: brand.updatedAt,
    priority: 0.9,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      priority: 1.0,
    },
    ...brandEntries,
  ];
}
