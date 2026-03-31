export interface SavedBuyer {
  id: number;
  name: string;
  address: string;
  contact: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSavedBuyerPayload {
  name: string;
  address?: string;
  contact?: string;
}

export interface UpdateSavedBuyerPayload {
  name?: string;
  address?: string;
  contact?: string;
}
