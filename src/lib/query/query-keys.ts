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
    list: (brandId: number) => ['reviews', 'list', brandId] as const,
  },
  adminReviews: {
    all: ['admin-reviews'] as const,
    list: (brandId?: number) => ['admin-reviews', 'list', brandId] as const,
  },
  inquiries: {
    all: ['inquiries'] as const,
    list: (params?: { status?: string; contactMethod?: string }) =>
      ['inquiries', 'list', params] as const,
    detail: (id: number) => ['inquiries', 'detail', id] as const,
  },
  savedBuyers: {
    all: ['saved-buyers'] as const,
  },
  invoices: {
    all: ['invoices'] as const,
    list: (params?: { type?: 'PI' | 'CI'; from?: string; to?: string }) =>
      ['invoices', 'list', params] as const,
    stats: (params?: { from?: string; to?: string }) =>
      ['invoices', 'stats', params] as const,
  },
} as const;
