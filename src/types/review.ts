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

export interface CreateReviewPayload {
  brandId: number;
  rating: number;
  content: string;
  photos?: string[];
}

export interface UpdateReviewPayload {
  rating?: number;
  content?: string;
}
