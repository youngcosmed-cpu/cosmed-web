export interface InvoiceItem {
  id: number;
  invoiceId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id: number;
  type: string;
  buyerName: string;
  buyerAddress: string | null;
  buyerContact: string | null;
  shippingMethod: string | null;
  shippingCost: number;
  total: number;
  createdAt: string;
  items: InvoiceItem[];
}

export interface CreateInvoicePayload {
  type: string;
  buyerName: string;
  buyerAddress?: string;
  buyerContact?: string;
  shippingMethod?: string;
  shippingCost?: number;
  total: number;
  items: {
    productName: string;
    quantity: number;
    unitPrice: number;
  }[];
}
