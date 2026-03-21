'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function RentConversionCalculator() {
  const [direction, setDirection] = useState<'toMonthly' | 'toDeposit'>('toMonthly');
  const [jeonseDeposit, setJeonseDeposit] = useState('');
  const [monthlyDeposit, setMonthlyDeposit] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [conversionRate, setConversionRate] = useState('5.0');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const handleCalculate = () => {
    const rate = parseFloat(conversionRate) || 0;

    if (rate <= 0) {
      alert('전환율을 입력해주세요.');
      return;
    }

    if (direction === 'toMonthly') {
      const jeonse = parseFloat(jeonseDeposit) || 0;
      const monthly = parseFloat(monthlyDeposit) || 0;

      if (jeonse <= 0) {
        alert('전세보증금을 입력해주세요.');
        return;
      }

      if (monthly >= jeonse) {
        alert('월세보증금은 전세보증금보다 작아야 합니다.');
        return;
      }

      const convertedMonthlyRent = (jeonse - monthly) * (rate / 100) / 12;

      setResults({
        direction: 'toMonthly',
        jeonseDeposit: jeonse,
        monthlyDeposit: monthly,
        convertedMonthlyRent,
        conversionRate: rate,
        difference: jeonse - monthly,
      });
    } else {
      const rent = parseFloat(monthlyRent) || 0;
      const monthly = parseFloat(monthlyDeposit) || 0;

      if (rent <= 0) {
        alert('월세를 입력해주세요.');
        return;
      }

      const convertedJeonse = monthly + (rent * 12 / (rate / 100));

      setResults({
        direction: 'toDeposit',
        monthlyDeposit: monthly,
        monthlyRent: rent,
        convertedJeonse,
        conversionRate: rate,
      });
    }
  };

  return (
    <div className="mx-auto max-w-[1200px] px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-fg-muted mb-8">
        <Link href="/" className="hover:text-fg transition-colors">홈</Link>
        <ChevronRight size={12} />
        <span className="text-fg-secondary">부동산</span>
        <ChevronRight size={12} />
        <span className="text-fg font-medium">전월세 전환 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">전월세 전환 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        전세와 월세 간 전환 금액을 계산합니다. 주택임대차보호법 기준 법정 전환율 상한은 기준금리(3.0%) + 2% = 5.0%입니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 변환 방향 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              변환 방향
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'toMonthly' as const, label: '전세 → 월세' },
                { val: 'toDeposit' as const, label: '월세 → 전세' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => { setDirection(val); setResults(null); }}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    direction === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {direction === 'toMonthly' ? (
            <>
              {/* 전세보증금 */}
              <div className="mb-6">
                <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                  전세보증금 (원) *
                </label>
                <input
                  type="number"
                  value={jeonseDeposit}
                  onChange={(e) => setJeonseDeposit(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                  placeholder="0"
                />
              </div>

              {/* 월세보증금 */}
              <div className="mb-6">
                <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                  월세보증금 (원)
                </label>
                <input
                  type="number"
                  value={monthlyDeposit}
                  onChange={(e) => setMonthlyDeposit(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                  placeholder="0"
                />
                <p className="text-[12px] text-fg-muted mt-1.5">
                  전환 후 유지할 보증금 (기본 0)
                </p>
              </div>
            </>
          ) : (
            <>
              {/* 월세보증금 */}
              <div className="mb-6">
                <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                  월세보증금 (원)
                </label>
                <input
                  type="number"
                  value={monthlyDeposit}
                  onChange={(e) => setMonthlyDeposit(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                  placeholder="0"
                />
              </div>

              {/* 월세 */}
              <div className="mb-6">
                <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                  월세 (원) *
                </label>
                <input
                  type="number"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                  placeholder="0"
                />
              </div>
            </>
          )}

          {/* 전환율 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              전환율 (%)
            </label>
            <input
              type="number"
              value={conversionRate}
              onChange={(e) => setConversionRate(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="5.0"
              step="0.1"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              법정 전환율 상한: 기준금리(3.0%) + 2% = 5.0%
            </p>
          </div>

          {/* Calculate Button */}
          <button
            onClick={handleCalculate}
            className="w-full h-11 bg-accent hover:bg-accent-hover text-accent-fg font-medium rounded-xl transition-colors"
          >
            계산하기
          </button>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="border border-border rounded-2xl bg-surface p-6 md:p-8 mb-8">
          <h2 className="text-[18px] font-bold text-fg mb-6">계산 결과</h2>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">적용 전환율</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.conversionRate}%
            </span>
          </div>

          {results.direction === 'toMonthly' ? (
            <>
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-[13px] text-fg-secondary">전세보증금</span>
                <span className="text-[14px] font-medium text-fg tabular-nums">
                  {formatNumber(results.jeonseDeposit)}원
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-[13px] text-fg-secondary">월세보증금</span>
                <span className="text-[14px] font-medium text-fg tabular-nums">
                  {formatNumber(results.monthlyDeposit)}원
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-[13px] text-fg-secondary">전환 대상 금액</span>
                <span className="text-[14px] font-medium text-fg tabular-nums">
                  {formatNumber(results.difference)}원
                </span>
              </div>

              <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
                <span className="text-[15px] font-semibold text-fg">전환 월세</span>
                <span className="text-[24px] font-bold text-fg tabular-nums">
                  {formatNumber(results.convertedMonthlyRent)}원
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-[13px] text-fg-secondary">월세보증금</span>
                <span className="text-[14px] font-medium text-fg tabular-nums">
                  {formatNumber(results.monthlyDeposit)}원
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-[13px] text-fg-secondary">현재 월세</span>
                <span className="text-[14px] font-medium text-fg tabular-nums">
                  {formatNumber(results.monthlyRent)}원
                </span>
              </div>

              <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
                <span className="text-[15px] font-semibold text-fg">전환 전세보증금</span>
                <span className="text-[24px] font-bold text-fg tabular-nums">
                  {formatNumber(results.convertedJeonse)}원
                </span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 법정 전환율 상한은 한국은행 기준금리 + 2%입니다 (현재 5.0%).</li>
          <li>· 임대인이 법정 전환율 상한을 초과하여 전환할 수 없습니다.</li>
          <li>· 실제 전환 시 임대인과 협의하여 전환율을 결정합니다.</li>
          <li>· 전환율이 낮을수록 임차인에게 유리합니다.</li>
        </ul>
      </div>
    </div>
  );
}
