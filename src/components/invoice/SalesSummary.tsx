'use client';

import { useMemo, useState } from 'react';
import { useInvoices, useInvoiceStats } from '@/hooks/queries/use-invoices';
import { useDeleteInvoice } from '@/hooks/mutations/use-invoice-mutations';
import { useToast } from '@/hooks/use-toast';
import type { InvoiceMonthlyPoint, InvoiceRecord } from '@/types/invoice';

type RangeKey = 'all' | 'thisMonth' | 'thisYear' | 'last12';

const rangeLabels: Record<RangeKey, string> = {
  all: '전체',
  thisMonth: '이번 달',
  thisYear: '올해',
  last12: '최근 12개월',
};

function getRange(key: RangeKey): { from?: string; to?: string } {
  const now = new Date();
  if (key === 'all') return {};
  if (key === 'thisMonth') {
    const from = new Date(now.getFullYear(), now.getMonth(), 1);
    return { from: from.toISOString() };
  }
  if (key === 'thisYear') {
    const from = new Date(now.getFullYear(), 0, 1);
    return { from: from.toISOString() };
  }
  const from = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  return { from: from.toISOString() };
}

function formatUSD(v: number) {
  return `US$ ${v.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

function formatCompact(v: number) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}k`;
  return `$${Math.round(v)}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

function formatMonthLabel(key: string) {
  const [, m] = key.split('-');
  return `${parseInt(m, 10)}월`;
}

function MonthlyChart({ data }: { data: InvoiceMonthlyPoint[] }) {
  const max = Math.max(1, ...data.map((d) => d.revenue));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-text-muted">
        데이터 없음
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        className="grid items-end gap-2 h-56 px-1"
        style={{
          gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))`,
        }}
      >
        {data.map((d) => {
          const piPct = max > 0 ? (d.pi / max) * 100 : 0;
          const ciPct = max > 0 ? (d.ci / max) * 100 : 0;
          return (
            <div
              key={d.month}
              className="group flex flex-col items-center justify-end h-full relative"
            >
              {/* Tooltip */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-admin-dark text-white text-[11px] rounded-md px-2 py-1.5 whitespace-nowrap z-10 shadow-lg">
                <div className="font-semibold">{d.month}</div>
                <div>총 {formatUSD(d.revenue)}</div>
                <div className="text-admin-nav">PI {formatUSD(d.pi)}</div>
                <div className="text-admin-nav">CI {formatUSD(d.ci)}</div>
              </div>

              {/* Stacked bar */}
              <div className="w-full flex flex-col justify-end items-center h-full">
                <div
                  className="w-full max-w-[34px] bg-admin-dark rounded-t-sm transition-all group-hover:bg-admin-dark-hover"
                  style={{ height: `${ciPct}%` }}
                />
                <div
                  className="w-full max-w-[34px] bg-beige transition-all group-hover:bg-beige-hover"
                  style={{
                    height: `${piPct}%`,
                    borderBottomLeftRadius: ciPct === 0 ? 0 : 0,
                    borderBottomRightRadius: ciPct === 0 ? 0 : 0,
                  }}
                />
              </div>
              <div className="mt-2 text-[11px] text-text-muted tabular-nums">
                {formatMonthLabel(d.month)}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-4 mt-3 text-xs text-text-label">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-beige" />
          PI (견적서)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-admin-dark" />
          CI (상업송장)
        </span>
      </div>
    </div>
  );
}

function InvoiceRow({
  invoice,
  onDelete,
  isDeleting,
}: {
  invoice: InvoiceRecord;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}) {
  return (
    <tr className="border-b border-border-light hover:bg-bg-light transition-colors">
      <td className="py-3.5 px-4">
        <span
          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
            invoice.type === 'CI'
              ? 'bg-admin-dark text-white'
              : 'bg-beige text-admin-dark'
          }`}
        >
          {invoice.type}
        </span>
      </td>
      <td className="py-3.5 px-4 font-body text-sm text-admin-dark font-medium">
        {invoice.buyerName}
      </td>
      <td className="py-3.5 px-4 font-body text-sm text-text-label">
        {invoice.items.length}개
      </td>
      <td className="py-3.5 px-4 text-right font-body text-sm font-semibold text-admin-dark tabular-nums">
        {formatUSD(invoice.total)}
      </td>
      <td className="py-3.5 px-4 font-body text-sm text-text-label">
        {formatDate(invoice.issuedAt)}
      </td>
      <td className="py-3.5 px-4 text-right">
        <button
          onClick={() => {
            if (!confirm('이 매출 기록을 삭제하시겠습니까?')) return;
            onDelete(invoice.id);
          }}
          disabled={isDeleting}
          className="text-error hover:text-red-700 text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          삭제
        </button>
      </td>
    </tr>
  );
}

export default function SalesSummary() {
  const [range, setRange] = useState<RangeKey>('thisYear');
  const [typeFilter, setTypeFilter] = useState<'all' | 'PI' | 'CI'>('all');
  const rangeParams = getRange(range);

  const { data: stats, isLoading: statsLoading } = useInvoiceStats(rangeParams);
  const {
    data: listData,
    isLoading: listLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInvoices({
    ...rangeParams,
    type: typeFilter === 'all' ? undefined : typeFilter,
  });
  const deleteMutation = useDeleteInvoice();
  const toast = useToast();

  const invoices = useMemo(
    () => listData?.pages.flatMap((p) => p.data) ?? [],
    [listData],
  );

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success('매출 기록이 삭제되었습니다'),
      onError: () => toast.error('삭제에 실패했습니다'),
    });
  };

  const piShare =
    stats && stats.totalRevenue > 0
      ? Math.round((stats.piRevenue / stats.totalRevenue) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Range Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-body text-xs uppercase tracking-wider text-text-muted mr-1">
          기간
        </span>
        {(Object.keys(rangeLabels) as RangeKey[]).map((k) => (
          <button
            key={k}
            onClick={() => setRange(k)}
            className={`px-3.5 py-1.5 rounded-lg font-body text-sm transition-colors cursor-pointer ${
              range === k
                ? 'bg-admin-dark text-white font-semibold'
                : 'bg-white border border-border-strong text-text-label hover:border-admin-dark'
            }`}
          >
            {rangeLabels[k]}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 max-md:grid-cols-2 max-sm:grid-cols-1">
        <div className="bg-admin-dark text-white rounded-xl p-5">
          <span className="font-body text-xs uppercase tracking-wider text-admin-nav">
            매출 총합
          </span>
          <p className="font-display text-[26px] font-bold mt-1 tabular-nums">
            {statsLoading ? '—' : formatUSD(stats?.totalRevenue ?? 0)}
          </p>
          <p className="text-xs text-admin-nav mt-1">
            {rangeLabels[range]} 기준
          </p>
        </div>

        <div className="bg-white border border-border-strong rounded-xl p-5">
          <span className="font-body text-xs uppercase tracking-wider text-text-label">
            인보이스 건수
          </span>
          <p className="font-display text-[26px] font-bold text-admin-dark mt-1 tabular-nums">
            {statsLoading ? '—' : stats?.count ?? 0}
          </p>
          <p className="text-xs text-text-muted mt-1">
            PI {stats?.piCount ?? 0} · CI {stats?.ciCount ?? 0}
          </p>
        </div>

        <div className="bg-white border border-border-strong rounded-xl p-5">
          <span className="font-body text-xs uppercase tracking-wider text-text-label">
            평균 거래액
          </span>
          <p className="font-display text-[26px] font-bold text-admin-dark mt-1 tabular-nums">
            {statsLoading ? '—' : formatCompact(stats?.avgRevenue ?? 0)}
          </p>
          <p className="text-xs text-text-muted mt-1">건당 평균</p>
        </div>

        <div className="bg-bg-warm border border-border-price rounded-xl p-5">
          <span className="font-body text-xs uppercase tracking-wider text-text-label">
            PI / CI 비중
          </span>
          <p className="font-display text-[26px] font-bold text-admin-dark mt-1 tabular-nums">
            {statsLoading ? '—' : `${piShare}% / ${100 - piShare}%`}
          </p>
          <div className="flex h-1.5 rounded-full overflow-hidden mt-2 bg-border-light">
            <div
              className="bg-beige"
              style={{ width: `${piShare}%` }}
            />
            <div
              className="bg-admin-dark"
              style={{ width: `${100 - piShare}%` }}
            />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white border border-border-strong rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-base font-bold text-admin-dark">
            월별 매출 추이
          </h3>
          <span className="text-xs text-text-muted">
            최대 {stats ? formatCompact(Math.max(0, ...stats.monthly.map((m) => m.revenue))) : '—'}
          </span>
        </div>
        {statsLoading ? (
          <div className="flex items-center justify-center h-48 text-sm text-text-muted">
            로딩 중...
          </div>
        ) : (
          <MonthlyChart data={stats?.monthly ?? []} />
        )}
      </div>

      {/* Recent Invoices */}
      <div className="bg-white border border-border-strong rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border-light">
          <h3 className="font-display text-base font-bold text-admin-dark">
            인보이스 기록
          </h3>
          <div className="flex gap-1.5">
            {(['all', 'PI', 'CI'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1 rounded-md font-body text-xs transition-colors cursor-pointer ${
                  typeFilter === t
                    ? 'bg-admin-dark text-white font-semibold'
                    : 'bg-bg-light text-text-label hover:bg-bg-muted'
                }`}
              >
                {t === 'all' ? '전체' : t}
              </button>
            ))}
          </div>
        </div>

        {listLoading ? (
          <div className="flex items-center justify-center py-20 text-sm text-text-muted">
            로딩 중...
          </div>
        ) : invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <span className="text-sm text-text-muted">매출 기록이 없습니다</span>
            <span className="text-xs text-text-placeholder">
              인보이스 생성 후 &apos;매출 기록 저장&apos; 버튼을 눌러 추가하세요
            </span>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="overflow-x-auto max-sm:hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border-light">
                    <th className="font-body text-xs uppercase tracking-wider text-text-muted text-left py-3 px-4">
                      구분
                    </th>
                    <th className="font-body text-xs uppercase tracking-wider text-text-muted text-left py-3 px-4">
                      바이어
                    </th>
                    <th className="font-body text-xs uppercase tracking-wider text-text-muted text-left py-3 px-4">
                      품목
                    </th>
                    <th className="font-body text-xs uppercase tracking-wider text-text-muted text-right py-3 px-4">
                      금액
                    </th>
                    <th className="font-body text-xs uppercase tracking-wider text-text-muted text-left py-3 px-4">
                      일자
                    </th>
                    <th className="font-body text-xs uppercase tracking-wider text-text-muted text-right py-3 px-4">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <InvoiceRow
                      key={inv.id}
                      invoice={inv}
                      onDelete={handleDelete}
                      isDeleting={
                        deleteMutation.isPending &&
                        deleteMutation.variables === inv.id
                      }
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden flex flex-col divide-y divide-border-light">
              {invoices.map((inv) => (
                <div key={inv.id} className="p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                          inv.type === 'CI'
                            ? 'bg-admin-dark text-white'
                            : 'bg-beige text-admin-dark'
                        }`}
                      >
                        {inv.type}
                      </span>
                      <span className="font-body text-sm font-semibold text-admin-dark">
                        {inv.buyerName}
                      </span>
                    </div>
                    <span className="text-xs text-text-muted">
                      {formatDate(inv.issuedAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-label">
                      {inv.items.length}개 품목
                    </span>
                    <span className="font-body text-base font-bold text-admin-dark tabular-nums">
                      {formatUSD(inv.total)}
                    </span>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        if (!confirm('이 매출 기록을 삭제하시겠습니까?')) return;
                        handleDelete(inv.id);
                      }}
                      disabled={
                        deleteMutation.isPending &&
                        deleteMutation.variables === inv.id
                      }
                      className="text-error text-sm disabled:opacity-40 transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {hasNextPage && (
              <div className="flex justify-center p-4 border-t border-border-light">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="px-5 py-2 rounded-lg border border-border-strong font-body text-sm font-semibold text-text-label hover:border-admin-dark hover:text-admin-dark transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isFetchingNextPage ? '로딩 중...' : '더 보기'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
