import * as XLSX from 'xlsx';
import type { InvoicePdfData } from './generate-invoice-pdf';

const COMPANY_INFO = {
  name: 'eun young Kwak',
  company: 'YOUNG COSMED',
  address: '#1603, 118, Seongsui-ro, Seongdong-gu, Seoul',
  tel: '+82-10-1234-5678',
  email: 'youngcosmed@gmail.com',
};

const BANK_INFO = {
  payment: 'T/T in Advance',
  bank: 'KOOKMIN BANK',
  account: '093668-11-025748',
  swift: 'CZNBKRSEXXX',
  holder: 'Kwak Eunyoung',
};

export function generateInvoiceExcel(data: InvoicePdfData): Blob {
  const wb = XLSX.utils.book_new();
  const rows: (string | number | null)[][] = [];

  const title = data.type === 'PI' ? 'PROFORMA INVOICE' : 'COMMERCIAL INVOICE';
  const dateStr = new Date().toISOString().split('T')[0];
  const refNo = `EY${dateStr}`;

  /* ── Title ── */
  rows.push([title]);
  rows.push([]);

  /* ── From / To ── */
  rows.push(['From:', '', '', 'To:']);
  rows.push([COMPANY_INFO.name, '', '', data.buyerName || '-']);
  rows.push([COMPANY_INFO.company, '', '', data.buyerAddress || '-']);
  rows.push([COMPANY_INFO.address, '', '', data.buyerContact || '-']);
  rows.push([COMPANY_INFO.email]);
  rows.push([]);

  /* ── Date & Ref ── */
  rows.push(['Date:', dateStr, '', 'Ref:', refNo]);
  rows.push([]);

  /* ── CI additional info ── */
  if (data.type === 'CI' && data.ciFields) {
    const ci = data.ciFields;
    const dimensions =
      ci.width || ci.height || ci.depth
        ? `${ci.width || '-'} x ${ci.height || '-'} x ${ci.depth || '-'} cm`
        : '-';
    rows.push(['Port of Loading:', ci.portOfLoading]);
    rows.push(['Destination:', ci.destination || '-']);
    rows.push(['Dimensions:', dimensions]);
    rows.push(['Weight:', ci.weight ? `${ci.weight} kg` : '-']);
    rows.push(['Cartons:', ci.cartons || '-']);
    rows.push(['HS Code:', '3304.99']);
    rows.push([]);
  }

  /* ── Items Table ── */
  rows.push(['No', 'Description', 'Qty', 'Unit Price (US$)', 'Amount (US$)']);

  const validItems = data.items.filter((item) => item.productName);
  validItems.forEach((item, i) => {
    rows.push([
      i + 1,
      item.productName,
      item.quantity,
      item.unitPrice,
      item.quantity * item.unitPrice,
    ]);
  });

  rows.push([]);

  /* ── Totals ── */
  if (data.shippingCost > 0) {
    const label = data.shippingMethod
      ? `Delivery Fee (${data.shippingMethod})`
      : 'Delivery Fee';
    rows.push([null, null, null, label, data.shippingCost]);
  }
  rows.push([null, null, null, 'TOTAL', data.total]);
  rows.push([]);

  /* ── Payment Terms (left) + Signature Block (right) ── */
  rows.push(['Payment Terms', null, null, `${BANK_INFO.holder}, CEO`]);
  rows.push([`Payment: ${BANK_INFO.payment}`, null, null, COMPANY_INFO.company]);
  rows.push([`Bank: ${BANK_INFO.bank}`]);
  rows.push([`A/C: ${BANK_INFO.account}`]);
  rows.push([`Swift: ${BANK_INFO.swift}`]);

  const ws = XLSX.utils.aoa_to_sheet(rows);

  /* ── Column widths ── */
  ws['!cols'] = [
    { wch: 18 },
    { wch: 30 },
    { wch: 10 },
    { wch: 20 },
    { wch: 18 },
  ];

  /* ── Merge title cell across columns ── */
  ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }];

  XLSX.utils.book_append_sheet(wb, ws, 'Invoice');

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}
