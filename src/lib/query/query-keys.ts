export const queryKeys = {
  brands: {
    all: ['brands'] as const,
    list: (categoryId?: number) => ['brands', 'list', categoryId] as const,
    detail: (id: number | null) => ['brands', 'detail', id] as const,
  },
  categories: {
    all: ['categories'] as const,
  },
  reviews: {
    all: ['reviews'] as const,
    list: (brandId: number) => ['reviews', brandId] as const,
  },
  adminReviews: {
    all: ['admin-reviews'] as const,
    list: (brandId?: number) => ['admin-reviews', brandId] as const,
  },
  inquiries: {
    all: ['inquiries'] as const,
    list: (params?: { status?: string; contactMethod?: string }) =>
      ['inquiries', params?.status, params?.contactMethod] as const,
    detail: (id: number) => ['inquiries', id] as const,
  },
  invoices: {
    all: ['invoices'] as const,
  },
} as const;
