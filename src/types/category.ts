export interface CreateCategoryPayload {
  name: string;
  sortOrder?: number;
}

export interface UpdateCategoryPayload {
  name?: string;
  sortOrder?: number;
}

export interface ReorderCategoriesPayload {
  orderedIds: number[];
}
