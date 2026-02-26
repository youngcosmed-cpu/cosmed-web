export interface Review {
  id: number;
  brandId: number;
  rating: number;
  content: string;
  photos: string[];
  createdAt: string;
}

export interface AdminReview extends Review {
  brand: { id: number; name: string };
}
