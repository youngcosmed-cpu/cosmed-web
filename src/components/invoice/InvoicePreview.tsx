'use client';

import { useEffect, useRef, useState } from 'react';
import {
  generateInvoicePdf,
  type InvoicePdfData,
} from '@/lib/invoice/generate-invoice-pdf';

interface InvoicePreviewProps {
  data: InvoicePdfData;
  onEdit: () => void;
}

export default function InvoicePreview({ data, onEdit }: InvoicePreviewProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const printIframeRef = useRef<HTMLIFrameElement | null>(null);

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
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            onClick={handleDownload}
            disabled={!blobUrl}
          >
            다운로드
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
          className="h-[80vh] w-full rounded-xl border border-gray-200"
          title="Invoice Preview"
        />
      ) : (
        <div className="flex h-[80vh] items-center justify-center rounded-xl border border-gray-200 bg-gray-50">
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
