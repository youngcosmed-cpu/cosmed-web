'use client';

import { useState } from 'react';
import InvoiceForm from '@/components/invoice/InvoiceForm';
import InvoicePreview from '@/components/invoice/InvoicePreview';
import type { InvoicePdfData } from '@/lib/invoice/generate-invoice-pdf';

export default function InvoicesPage() {
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [previewData, setPreviewData] = useState<InvoicePdfData | null>(null);

  const handleGenerate = async (data: InvoicePdfData) => {
    setPreviewData(data);
    setMode('preview');
  };

  const handleEdit = () => {
    setMode('edit');
    setPreviewData(null);
  };

  return (
    <div className="p-8 max-md:p-5">
      {mode === 'edit' ? (
        <InvoiceForm
          onGenerate={handleGenerate}
          isLoading={false}
        />
      ) : previewData ? (
        <InvoicePreview data={previewData} onEdit={handleEdit} />
      ) : null}
    </div>
  );
}
