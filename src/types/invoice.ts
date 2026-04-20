export type InvoiceType = 'PI' | 'CI';

export interface InvoiceItem {
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceCiFields {
  portOfLoading: string;
  destination: string;
  width: string;
  height: string;
  depth: string;
  weight: string;
  cartons: string;
}

export interface InvoiceRecord {
  id: number;
  type: InvoiceType;
  buyerName: string;
  buyerAddress: string;
  buyerContact: string;
  items: InvoiceItem[];
  shippingMethod: string;
  shippingCost: number;
  total: number;
  ciFields: InvoiceCiFields | null;
  issuedAt: string;
  createdAt: string;
}

export interface CreateInvoicePayload {
  type: InvoiceType;
  buyerName: string;
  buyerAddress?: string;
  buyerContact?: string;
  items: InvoiceItem[];
  shippingMethod?: string;
  shippingCost: number;
  total: number;
  ciFields?: InvoiceCiFields;
}

export interface InvoiceListResponse {
  data: InvoiceRecord[];
  nextCursor: number | null;
}

export interface InvoiceMonthlyPoint {
  month: string;
  revenue: number;
  count: number;
  pi: number;
  ci: number;
}

export interface InvoiceStats {
  totalRevenue: number;
  count: number;
  avgRevenue: number;
  piRevenue: number;
  ciRevenue: number;
  piCount: number;
  ciCount: number;
  monthly: InvoiceMonthlyPoint[];
}

export interface InvoiceStatsParams {
  from?: string;
  to?: string;
}
