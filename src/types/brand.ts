export interface Category {
  id: number;
  name: string;
  sortOrder: number;
  _count?: { brands: number };
}

export interface Product {
  id: number;
  brandId: number;
  name: string;
  description: string | null;
  sortOrder: number;
}

export interface BrandMedia {
  type: 'image' | 'video';
  url: string;
}

export interface Brand {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  certifications: string[];
  media?: BrandMedia[];
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  categories: Category[];
  products?: Product[];
}

export interface CreateBrandPayload {
  categoryIds: number[];
  name: string;
  description?: string;
  imageUrl?: string | null;
  certifications?: string[];
  media?: BrandMedia[];
  products: { name: string; description?: string; sortOrder?: number }[];
}

export interface UpdateBrandPayload {
  categoryIds?: number[];
  name?: string;
  description?: string;
  imageUrl?: string | null;
  certifications?: string[];
  media?: BrandMedia[];
  products?: { name: string; description?: string; sortOrder?: number }[];
}

export interface ReorderBrandsPayload {
  orderedIds: number[];
}
