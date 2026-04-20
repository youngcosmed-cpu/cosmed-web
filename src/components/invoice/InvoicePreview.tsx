'use client';

import { useEffect, useRef, useState } from 'react';
import {
  generateInvoicePdf,
  type InvoicePdfData,
} from '@/lib/invoice/generate-invoice-pdf';
import { generateInvoiceExcel } from '@/lib/invoice/generate-invoice-excel';
import { useCreateInvoice } from '@/hooks/mutations/use-invoice-mutations';
import { useToast } from '@/hooks/use-toast';

interface InvoicePreviewProps {
  data: InvoicePdfData;
  onEdit: () => void;
}

export default function InvoicePreview({ data, onEdit }: InvoicePreviewProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<number | null>(null);
  const printIframeRef = useRef<HTMLIFrameElement | null>(null);
  const createInvoice = useCreateInvoice();
  const toast = useToast();

  useEffect(() => {
    let url: string | null = null;

    generateInvoicePdf(data)
      .then((blob) => {
        url = URL.createObjectURL(blob);
        setBlobUrl(url);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'PDF 생성 실패');
      });

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [data]);

  const handleDownload = () => {
    if (!blobUrl) return;
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `${data.type}_${data.buyerName || 'invoice'}_${dateStr}.pdf`;
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    a.click();
  };

  const handleExcelDownload = () => {
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `${data.type}_${data.buyerName || 'invoice'}_${dateStr}.xlsx`;
    const blob = generateInvoiceExcel(data);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    if (savedId || createInvoice.isPending) return;
    createInvoice.mutate(
      {
        type: data.type,
        buyerName: data.buyerName,
        buyerAddress: data.buyerAddress,
        buyerContact: data.buyerContact,
        items: data.items,
        shippingMethod: data.shippingMethod,
        shippingCost: data.shippingCost,
        total: data.total,
        ciFields: data.ciFields,
      },
      {
        onSuccess: (record) => {
          setSavedId(record.id);
          toast.success('매출 기록에 저장되었습니다');
        },
        onError: () => toast.error('저장에 실패했습니다'),
      },
    );
  };

  const handlePrint = () => {
    if (!blobUrl) return;
    const iframe = printIframeRef.current;
    if (!iframe) return;
    iframe.src = blobUrl;
    iframe.onload = () => {
      iframe.contentWindow?.print();
    };
  };

  if (error) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
          {error}
        </div>
        <button
          type="button"
          className="text-sm text-gray-500 hover:text-gray-800"
          onClick={onEdit}
        >
          &larr; 수정하기
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          className="text-sm text-gray-500 hover:text-gray-800"
          onClick={onEdit}
        >
          &larr; 수정하기
        </button>
        <div className="flex gap-2 flex-wrap justify-end">
          <button
            type="button"
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              savedId
                ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 cursor-default'
                : 'border border-gray-900 bg-white text-gray-900 hover:bg-gray-900 hover:text-white disabled:opacity-50'
            }`}
            onClick={handleSave}
            disabled={!!savedId || createInvoice.isPending}
            title="이 인보이스의 매출액을 기록에 저장합니다"
          >
            {savedId
              ? '✓ 저장됨'
              : createInvoice.isPending
                ? '저장 중...'
                : '매출 기록 저장'}
          </button>
          <button
            type="button"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            onClick={handleDownload}
            disabled={!blobUrl}
          >
            PDF
          </button>
          <button
            type="button"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            onClick={handleExcelDownload}
          >
            Excel
          </button>
          <button
            type="button"
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
            onClick={handlePrint}
            disabled={!blobUrl}
          >
            인쇄
          </button>
        </div>
      </div>

      {/* PDF Preview */}
      {blobUrl ? (
        <iframe
          src={blobUrl}
          className="h-[80vh] max-sm:h-[60vh] w-full rounded-xl border border-gray-200"
          title="Invoice Preview"
        />
      ) : (
        <div className="flex h-[80vh] max-sm:h-[60vh] items-center justify-center rounded-xl border border-gray-200 bg-gray-50">
          <span className="text-sm text-gray-400">PDF 생성 중...</span>
        </div>
      )}

      {/* Hidden iframe for printing */}
      <iframe
        ref={printIframeRef}
        className="hidden"
        title="Print Frame"
      />
    </div>
  );
}
