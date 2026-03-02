'use client';

import type { InvoicePdfData } from '@/lib/invoice/generate-invoice-pdf';

interface FormItem {
  product: string;
  qty: string;
  price: string;
}

interface CiFields {
  portOfLoading: string;
  destination: string;
  width: string;
  height: string;
  depth: string;
  weight: string;
  cartons: string;
}

interface InvoiceFormProps {
  onGenerate: (data: InvoicePdfData) => Promise<void>;
  isLoading: boolean;
}

import { useState } from 'react';

export default function InvoiceForm({ onGenerate, isLoading }: InvoiceFormProps) {
  const [invoiceType, setInvoiceType] = useState<'PI' | 'CI'>('PI');
  const [buyer, setBuyer] = useState({ name: '', address: '', contact: '' });
  const [items, setItems] = useState<FormItem[]>([
    { product: '', qty: '', price: '' },
  ]);
  const [shipping, setShipping] = useState({ method: '', cost: '' });
  const [ciFields, setCiFields] = useState<CiFields>({
    portOfLoading: 'KOREA',
    destination: '',
    width: '',
    height: '',
    depth: '',
    weight: '',
    cartons: '',
  });

  const getSubtotal = (item: FormItem) => {
    const qty = parseFloat(item.qty) || 0;
    const price = parseFloat(item.price) || 0;
    return qty * price;
  };

  const itemsTotal = items.reduce((sum, item) => sum + getSubtotal(item), 0);
  const shippingCost = parseFloat(shipping.cost) || 0;
  const grandTotal = itemsTotal + shippingCost;

  const formatCurrency = (num: number) =>
    num.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

  const updateItem = (index: number, field: keyof FormItem, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const addItem = () => {
    setItems((prev) => [...prev, { product: '', qty: '', price: '' }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleGenerate = () => {
    if (!buyer.name.trim()) {
      alert('바이어 이름을 입력해주세요');
      return;
    }

    const pdfItems = items
      .filter((item) => item.product)
      .map((item) => ({
        productName: item.product,
        quantity: parseFloat(item.qty) || 0,
        unitPrice: parseFloat(item.price) || 0,
      }));

    if (pdfItems.length === 0) {
      alert('제품을 하나 이상 입력해주세요');
      return;
    }

    onGenerate({
      type: invoiceType,
      buyerName: buyer.name,
      buyerAddress: buyer.address,
      buyerContact: buyer.contact,
      items: pdfItems,
      shippingMethod: shipping.method,
      shippingCost,
      total: grandTotal,
      ciFields: invoiceType === 'CI' ? ciFields : undefined,
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Type Toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          className={`rounded-lg px-5 py-2 text-sm font-medium transition ${
            invoiceType === 'PI'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setInvoiceType('PI')}
        >
          PI (견적서)
        </button>
        <button
          type="button"
          className={`rounded-lg px-5 py-2 text-sm font-medium transition ${
            invoiceType === 'CI'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setInvoiceType('CI')}
        >
          CI (상업송장)
        </button>
      </div>

      {/* Buyer Info */}
      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="mb-4 text-sm font-semibold text-gray-900">바이어 정보</h3>
        <div className="grid gap-4 sm:grid-cols-1">
          <div>
            <label className="mb-1 block text-xs text-gray-500">이름/회사</label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
              value={buyer.name}
              onChange={(e) => setBuyer((p) => ({ ...p, name: e.target.value }))}
              placeholder="예: ABC Trading Co."
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">주소</label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
              value={buyer.address}
              onChange={(e) =>
                setBuyer((p) => ({ ...p, address: e.target.value }))
              }
              placeholder="예: 123 Main St, Bangkok, Thailand"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">연락처</label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
              value={buyer.contact}
              onChange={(e) =>
                setBuyer((p) => ({ ...p, contact: e.target.value }))
              }
              placeholder="예: +66-2-123-4567"
            />
          </div>
        </div>
      </section>

      {/* Product Items */}
      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="mb-4 text-sm font-semibold text-gray-900">제품 목록</h3>
        {/* Desktop Table */}
        <div className="overflow-x-auto max-sm:hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs text-gray-500">
                <th className="w-10 py-2 text-center">No</th>
                <th className="py-2">제품명</th>
                <th className="w-20 py-2 text-center">수량</th>
                <th className="w-28 py-2 text-center">단가 (US$)</th>
                <th className="w-28 py-2 text-right">소계 (US$)</th>
                <th className="w-10 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-2 text-center text-gray-400">{index + 1}</td>
                  <td className="py-2 pr-2">
                    <input
                      type="text"
                      className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm focus:border-gray-400 focus:outline-none"
                      value={item.product}
                      onChange={(e) => updateItem(index, 'product', e.target.value)}
                      placeholder="제품명"
                    />
                  </td>
                  <td className="py-2 px-1">
                    <input
                      type="number"
                      className="w-full rounded border border-gray-200 px-2 py-1.5 text-center text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:border-gray-400 focus:outline-none"
                      value={item.qty}
                      onChange={(e) => updateItem(index, 'qty', e.target.value)}
                      placeholder="0"
                    />
                  </td>
                  <td className="py-2 px-1">
                    <input
                      type="number"
                      className="w-full rounded border border-gray-200 px-2 py-1.5 text-center text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:border-gray-400 focus:outline-none"
                      value={item.price}
                      onChange={(e) => updateItem(index, 'price', e.target.value)}
                      placeholder="0"
                      step="0.01"
                    />
                  </td>
                  <td className="py-2 text-right font-medium tabular-nums">
                    {formatCurrency(getSubtotal(item))}
                  </td>
                  <td className="py-2 text-center">
                    {items.length > 1 && (
                      <button
                        type="button"
                        className="text-gray-400 hover:text-red-500"
                        onClick={() => removeItem(index)}
                      >
                        &times;
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List */}
        <div className="sm:hidden flex flex-col gap-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">#{index + 1}</span>
                {items.length > 1 && (
                  <button
                    type="button"
                    className="text-gray-400 hover:text-red-500 text-lg leading-none"
                    onClick={() => removeItem(index)}
                  >
                    &times;
                  </button>
                )}
              </div>
              <input
                type="text"
                className="w-full rounded border border-gray-200 px-2.5 py-2 text-sm focus:border-gray-400 focus:outline-none"
                value={item.product}
                onChange={(e) => updateItem(index, 'product', e.target.value)}
                placeholder="제품명"
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-0.5 block text-xs text-gray-500">수량</label>
                  <input
                    type="number"
                    className="w-full rounded border border-gray-200 px-2.5 py-1.5 text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:border-gray-400 focus:outline-none"
                    value={item.qty}
                    onChange={(e) => updateItem(index, 'qty', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="mb-0.5 block text-xs text-gray-500">단가 (US$)</label>
                  <input
                    type="number"
                    className="w-full rounded border border-gray-200 px-2.5 py-1.5 text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:border-gray-400 focus:outline-none"
                    value={item.price}
                    onChange={(e) => updateItem(index, 'price', e.target.value)}
                    placeholder="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="text-right text-sm font-medium tabular-nums text-gray-700">
                소계: US$ {formatCurrency(getSubtotal(item))}
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="mt-3 text-sm text-gray-500 hover:text-gray-800"
          onClick={addItem}
        >
          + 행 추가
        </button>
      </section>

      {/* Shipping */}
      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="mb-4 text-sm font-semibold text-gray-900">배송비</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-gray-500">배송 방법</label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
              value={shipping.method}
              onChange={(e) =>
                setShipping((p) => ({ ...p, method: e.target.value }))
              }
              placeholder="예: EMS, DHL, Sea Freight"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">US$</label>
            <input
              type="number"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:border-gray-500 focus:outline-none"
              value={shipping.cost}
              onChange={(e) =>
                setShipping((p) => ({ ...p, cost: e.target.value }))
              }
              placeholder="0"
              step="0.01"
            />
          </div>
        </div>
      </section>

      {/* CI-only fields */}
      {invoiceType === 'CI' && (
        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">
            CI 추가 정보
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-gray-500">출발</label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                value={ciFields.portOfLoading}
                onChange={(e) =>
                  setCiFields((p) => ({ ...p, portOfLoading: e.target.value }))
                }
                placeholder="예: KOREA"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">도착</label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                value={ciFields.destination}
                onChange={(e) =>
                  setCiFields((p) => ({ ...p, destination: e.target.value }))
                }
                placeholder="예: Bangkok, Thailand"
              />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-xs text-gray-500">가로 (cm)</label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                value={ciFields.width}
                onChange={(e) =>
                  setCiFields((p) => ({ ...p, width: e.target.value }))
                }
                placeholder="40"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">세로 (cm)</label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                value={ciFields.height}
                onChange={(e) =>
                  setCiFields((p) => ({ ...p, height: e.target.value }))
                }
                placeholder="30"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">높이 (cm)</label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                value={ciFields.depth}
                onChange={(e) =>
                  setCiFields((p) => ({ ...p, depth: e.target.value }))
                }
                placeholder="20"
              />
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-gray-500">무게 (kg)</label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                value={ciFields.weight}
                onChange={(e) =>
                  setCiFields((p) => ({ ...p, weight: e.target.value }))
                }
                placeholder="예: 15.5"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">Carton 개수</label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                value={ciFields.cartons}
                onChange={(e) =>
                  setCiFields((p) => ({ ...p, cartons: e.target.value }))
                }
                placeholder="예: 3"
              />
            </div>
          </div>
        </section>
      )}

      {/* Total */}
      <div className="flex items-center justify-between rounded-xl bg-gray-900 px-6 py-4 text-white">
        <span className="text-sm font-medium">TOTAL</span>
        <span className="text-lg font-bold tabular-nums">
          US$ {formatCurrency(grandTotal)}
        </span>
      </div>

      {/* Generate Button */}
      <div className="flex justify-end">
        <button
          type="button"
          className="rounded-xl bg-gray-900 px-8 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
          onClick={handleGenerate}
          disabled={isLoading}
        >
          {isLoading ? '생성 중...' : '인보이스 생성'}
        </button>
      </div>
    </div>
  );
}
