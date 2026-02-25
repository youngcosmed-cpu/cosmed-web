'use client';

import { useState } from 'react';
import InvoiceForm from '@/components/invoice/InvoiceForm';
import InvoicePreview from '@/components/invoice/InvoicePreview';
import { useCreateInvoice } from '@/hooks/queries/use-invoices';
import type { InvoicePdfData } from '@/lib/invoice/generate-invoice-pdf';

export default function InvoicesPage() {
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [previewData, setPreviewData] = useState<InvoicePdfData | null>(null);
  const createInvoice = useCreateInvoice();

  const handleGenerate = async (data: InvoicePdfData) => {
    await createInvoice.mutateAsync({
      type: data.type,
      buyerName: data.buyerName,
      buyerAddress: data.buyerAddress || undefined,
      buyerContact: data.buyerContact || undefined,
      shippingMethod: data.shippingMethod || undefined,
      shippingCost: data.shippingCost,
      total: data.total,
      items: data.items,
    });
    setPreviewData(data);
    setMode('preview');
  };

  const handleEdit = () => {
    setMode('edit');
    setPreviewData(null);
  };

  return (
    <div className="p-8">
      {mode === 'edit' ? (
        <InvoiceForm
          onGenerate={handleGenerate}
          isLoading={createInvoice.isPending}
        />
      ) : previewData ? (
        <InvoicePreview data={previewData} onEdit={handleEdit} />
      ) : null}
    </div>
  );
}
