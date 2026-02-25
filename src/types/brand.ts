export interface Category {
  id: number;
  name: string;
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
}
