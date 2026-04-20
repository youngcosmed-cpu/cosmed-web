'use client';

import { useState } from 'react';
import InvoiceForm from '@/components/invoice/InvoiceForm';
import InvoicePreview from '@/components/invoice/InvoicePreview';
import SalesSummary from '@/components/invoice/SalesSummary';
import type { InvoicePdfData } from '@/lib/invoice/generate-invoice-pdf';

type TabKey = 'create' | 'summary';

export default function InvoicesPage() {
  const [tab, setTab] = useState<TabKey>('create');
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [previewData, setPreviewData] = useState<InvoicePdfData | null>(null);

  const handleGenerate = async (data: InvoicePdfData) => {
    setPreviewData(data);
    setMode('preview');
  };

  const handleEdit = () => {
    setMode('edit');
  };

  return (
    <div className="p-8 max-md:p-5">
      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border-light mb-6">
        <button
          type="button"
          onClick={() => setTab('create')}
          className={`px-4 py-2.5 font-body text-sm font-semibold transition-colors relative cursor-pointer ${
            tab === 'create'
              ? 'text-admin-dark'
              : 'text-text-muted hover:text-text-label'
          }`}
        >
          인보이스 생성
          {tab === 'create' && (
            <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-admin-dark" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setTab('summary')}
          className={`px-4 py-2.5 font-body text-sm font-semibold transition-colors relative cursor-pointer ${
            tab === 'summary'
              ? 'text-admin-dark'
              : 'text-text-muted hover:text-text-label'
          }`}
        >
          매출 기록
          {tab === 'summary' && (
            <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-admin-dark" />
          )}
        </button>
      </div>

      {tab === 'create' ? (
        mode === 'edit' ? (
          <InvoiceForm
            onGenerate={handleGenerate}
            isLoading={false}
            initialData={previewData}
          />
        ) : previewData ? (
          <InvoicePreview data={previewData} onEdit={handleEdit} />
        ) : null
      ) : (
        <SalesSummary />
      )}
    </div>
  );
}
