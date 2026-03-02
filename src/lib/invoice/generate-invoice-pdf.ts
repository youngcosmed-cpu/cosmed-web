import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface InvoicePdfData {
  type: 'PI' | 'CI';
  buyerName: string;
  buyerAddress: string;
  buyerContact: string;
  items: { productName: string; quantity: number; unitPrice: number }[];
  shippingMethod: string;
  shippingCost: number;
  total: number;
  ciFields?: {
    portOfLoading: string;
    destination: string;
    width: string;
    height: string;
    depth: string;
    weight: string;
    cartons: string;
  };
}

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

const FONT = 'NanumGothic';

/* ── Font cache (TTF → base64) ── */
let fontCache: { regular: string; bold: string } | null = null;

async function loadFonts(): Promise<{ regular: string; bold: string }> {
  if (fontCache) return fontCache;

  const [regBuf, boldBuf] = await Promise.all([
    fetch('/fonts/NanumGothic-Regular.ttf').then((r) => r.arrayBuffer()),
    fetch('/fonts/NanumGothic-Bold.ttf').then((r) => r.arrayBuffer()),
  ]);

  const toBase64 = (buf: ArrayBuffer) => {
    const bytes = new Uint8Array(buf);
    const chunks: string[] = [];
    const CHUNK = 8192;
    for (let i = 0; i < bytes.length; i += CHUNK) {
      chunks.push(String.fromCharCode(...bytes.subarray(i, i + CHUNK)));
    }
    return btoa(chunks.join(''));
  };

  fontCache = { regular: toBase64(regBuf), bold: toBase64(boldBuf) };
  return fontCache;
}

/* ── Stamp image cache ── */
let stampCache: { company: string; ceo: string } | null = null;

async function loadStampImages(): Promise<{ company: string; ceo: string }> {
  if (stampCache) return stampCache;

  const toDataUrl = async (path: string) => {
    const buf = await fetch(path).then((r) => r.arrayBuffer());
    const bytes = new Uint8Array(buf);
    const chunks: string[] = [];
    const CHUNK = 8192;
    for (let i = 0; i < bytes.length; i += CHUNK) {
      chunks.push(String.fromCharCode(...bytes.subarray(i, i + CHUNK)));
    }
    return 'data:image/png;base64,' + btoa(chunks.join(''));
  };

  const [company, ceo] = await Promise.all([
    toDataUrl('/stamps/company-stamp.png'),
    toDataUrl('/stamps/ceo-stamp.png'),
  ]);

  stampCache = { company, ceo };
  return stampCache;
}

function formatCurrency(num: number): string {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export async function generateInvoicePdf(
  data: InvoicePdfData,
): Promise<Blob> {
  const [fonts, stamps] = await Promise.all([
    loadFonts(),
    data.type === 'CI' ? loadStampImages() : Promise.resolve(null),
  ]);

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;

  /* ── Register fonts ── */
  doc.addFileToVFS('NanumGothic-Regular.ttf', fonts.regular);
  doc.addFont('NanumGothic-Regular.ttf', FONT, 'normal');
  doc.addFileToVFS('NanumGothic-Bold.ttf', fonts.bold);
  doc.addFont('NanumGothic-Bold.ttf', FONT, 'bold');
  doc.setFont(FONT, 'normal');

  let y = 20;

  /* ── Title ── */
  const title =
    data.type === 'PI' ? 'PROFORMA INVOICE' : 'COMMERCIAL INVOICE';
  doc.setFont(FONT, 'bold');
  doc.setFontSize(18);
  doc.setTextColor(17, 24, 39);
  doc.text(title, pageWidth / 2, y, { align: 'center' });
  y += 12;

  /* ── Header: From / To ── */
  doc.setFontSize(9);
  doc.setFont(FONT, 'bold');
  doc.text('From:', margin, y);
  doc.text('To:', pageWidth / 2 + 5, y);

  doc.setFont(FONT, 'normal');
  y += 5;
  const fromLines = [
    COMPANY_INFO.name,
    COMPANY_INFO.company,
    COMPANY_INFO.address,
    COMPANY_INFO.email,
  ];
  const toLines = [
    data.buyerName || '-',
    data.buyerAddress || '-',
    data.buyerContact || '-',
  ];

  fromLines.forEach((line, i) => {
    doc.text(line, margin, y + i * 4.5);
  });
  toLines.forEach((line, i) => {
    doc.text(line, pageWidth / 2 + 5, y + i * 4.5);
  });
  y += Math.max(fromLines.length, toLines.length) * 4.5 + 4;

  /* ── Date & Ref ── */
  const dateStr = new Date().toISOString().split('T')[0];
  const refNo = `EY${dateStr}`;
  doc.setFontSize(9);
  doc.setFont(FONT, 'bold');
  doc.text('Date:', margin, y);
  doc.setFont(FONT, 'normal');
  doc.text(dateStr, margin + 14, y);
  doc.setFont(FONT, 'bold');
  doc.text('Ref:', margin + 50, y);
  doc.setFont(FONT, 'normal');
  doc.text(refNo, margin + 60, y);
  y += 6;

  /* ── CI additional info ── */
  if (data.type === 'CI' && data.ciFields) {
    const ci = data.ciFields;
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;

    const dimensions =
      ci.width || ci.height || ci.depth
        ? `${ci.width || '-'} x ${ci.height || '-'} x ${ci.depth || '-'} cm`
        : '-';
    const ciInfo = [
      ['Port of Loading:', ci.portOfLoading],
      ['Destination:', ci.destination || '-'],
      ['Dimensions:', dimensions],
      ['Weight:', ci.weight ? `${ci.weight} kg` : '-'],
      ['Cartons:', ci.cartons || '-'],
      ['HS Code:', '3304.99'],
    ];

    ciInfo.forEach(([label, value]) => {
      doc.setFont(FONT, 'bold');
      doc.setFontSize(9);
      doc.text(label, margin, y);
      doc.setFont(FONT, 'normal');
      doc.text(value, margin + 32, y);
      y += 4.5;
    });
    y += 2;
  }

  /* ── Items Table ── */
  const tableBody = data.items
    .filter((item) => item.productName)
    .map((item, i) => [
      String(i + 1),
      item.productName,
      String(item.quantity),
      formatCurrency(item.unitPrice),
      formatCurrency(item.quantity * item.unitPrice),
    ]);

  autoTable(doc, {
    startY: y,
    theme: 'grid',
    margin: { left: margin, right: margin },
    head: [['No', 'Description', 'Qty', 'Unit Price (US$)', 'Amount (US$)']],
    body: tableBody,
    styles: {
      font: FONT,
      fontSize: 9,
      textColor: [17, 24, 39],
      lineColor: [229, 231, 235],
      lineWidth: 0.3,
      cellPadding: { top: 3, right: 4, bottom: 3, left: 4 },
    },
    headStyles: {
      fillColor: [245, 245, 245],
      textColor: [17, 24, 39],
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      2: { cellWidth: 18, halign: 'center' },
      3: { cellWidth: 30, halign: 'right' },
      4: { cellWidth: 30, halign: 'right' },
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 6;

  /* ── Totals ── */
  const totalsX = pageWidth - margin - 70;
  doc.setFontSize(9);

  if (data.shippingCost > 0) {
    const label = data.shippingMethod
      ? `Delivery Fee (${data.shippingMethod}):`
      : 'Delivery Fee:';
    doc.setFont(FONT, 'normal');
    doc.text(label, totalsX, y);
    doc.text(`US$ ${formatCurrency(data.shippingCost)}`, pageWidth - margin, y, {
      align: 'right',
    });
    y += 5;
  }

  doc.setFont(FONT, 'bold');
  doc.setFontSize(11);
  doc.text('TOTAL:', totalsX, y);
  doc.text(`US$ ${formatCurrency(data.total)}`, pageWidth - margin, y, {
    align: 'right',
  });
  y += 10;

  /* ── Payment Terms + Signature ── */
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  const sectionY = y + 6;

  /* Left: Payment Terms */
  doc.setFont(FONT, 'bold');
  doc.setFontSize(9);
  doc.text('Payment Terms', margin, sectionY);

  doc.setFont(FONT, 'normal');
  let payY = sectionY + 5;
  const paymentLines = [
    `Payment: ${BANK_INFO.payment}`,
    `Bank: ${BANK_INFO.bank}`,
    `A/C: ${BANK_INFO.account}`,
    `Swift: ${BANK_INFO.swift}`,
  ];
  paymentLines.forEach((line) => {
    doc.text(line, margin, payY);
    payY += 4.5;
  });

  /* Right: Signature + Stamps (same baseline as payment) */
  let sigY = sectionY;
  doc.setFont(FONT, 'normal');
  doc.setFontSize(9);
  doc.text(`${BANK_INFO.holder}, CEO`, pageWidth - margin, sigY, {
    align: 'right',
  });
  sigY += 4.5;
  doc.text(COMPANY_INFO.company, pageWidth - margin, sigY, { align: 'right' });

  if (data.type === 'CI' && stamps) {
    const stampSize = 30;
    const ceoW = 36;
    const ceoH = 18;
    const stampX = pageWidth - margin - stampSize + 5;
    const stampY = sigY + 3;
    const ceoX = stampX - ceoW - 2;
    const ceoY = stampY + (stampSize - ceoH) / 2;
    doc.addImage(stamps.ceo, 'PNG', ceoX, ceoY, ceoW, ceoH);
    doc.addImage(stamps.company, 'PNG', stampX, stampY, stampSize, stampSize);
  }

  y = Math.max(payY, sigY + 35);

  return doc.output('blob');
}
