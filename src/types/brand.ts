export interface Category {
  id: number;
  name: string;
  sortOrder: number;
}

export interface Product {
  id: number;
  brandId: number;
  name: string;
  description: string | null;
  sortOrder: number;
}

export interface Brand {
  id: number;
  categoryId: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  certifications: string[];
  createdAt: string;
  updatedAt: string;
  category: Category;
  products?: Product[];
}

export interface CreateBrandPayload {
  categoryId: number;
  name: string;
  description?: string;
  imageUrl?: string | null;
  certifications?: string[];
  products: { name: string; description?: string }[];
}

export interface UpdateBrandPayload {
  categoryId?: number;
  name?: string;
  description?: string;
  imageUrl?: string | null;
  certifications?: string[];
  products?: { name: string; description?: string }[];
}
