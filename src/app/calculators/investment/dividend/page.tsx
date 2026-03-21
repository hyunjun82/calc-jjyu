'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function DividendCalculator() {
  const [stockPrice, setStockPrice] = useState('');
  const [dividendPerShare, setDividendPerShare] = useState('');
  const [holdingQuantity, setHoldingQuantity] = useState('');
  const [dividendCycle, setDividendCycle] = useState('annual');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const handleCalculate = () => {
    const price = parseFloat(stockPrice) || 0;
    const dividend = parseFloat(dividendPerShare) || 0;
    const qty = parseFloat(holdingQuantity) || 0;

    if (price <= 0 || dividend <= 0 || qty <= 0) {
      alert('주가, 주당 배당금, 보유수량을 입력해주세요.');
      return;
    }

    const investmentAmount = price * qty;
    const annualDividend = dividendCycle === 'quarterly' ? dividend * 4 : dividend;
    const totalDividend = annualDividend * qty;

    const dividendYield = (annualDividend / price) * 100;

    // 배당소득세 15.4% (소득세 14% + 지방소득세 1.4%)
    const dividendTax = totalDividend * 0.154;
    const afterTaxDividend = totalDividend - dividendTax;
    const afterTaxYield = (afterTaxDividend / investmentAmount) * 100;

    setResults({
      investmentAmount,
      dividendYield,
      totalDividend,
      dividendTax,
      afterTaxDividend,
      afterTaxYield,
    });
  };

  return (
    <div className="mx-auto max-w-[1200px] px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-fg-muted mb-8">
        <Link href="/" className="hover:text-fg transition-colors">홈</Link>
        <ChevronRight size={12} />
        <span className="text-fg-secondary">투자</span>
        <ChevronRight size={12} />
        <span className="text-fg font-medium">배당수익률 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">배당수익률 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        배당주 투자 시 세전·세후 배당수익률과 실수령 배당금을 계산합니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 주가 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              주가 (원) *
            </label>
            <input
              type="number"
              value={stockPrice}
              onChange={(e) => setStockPrice(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
          </div>

          {/* 주당 배당금 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              주당 배당금 (원) *
            </label>
            <input
              type="number"
              value={dividendPerShare}
              onChange={(e) => setDividendPerShare(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              분기 배당의 경우 1회 배당금을 입력하세요
            </p>
          </div>

          {/* 보유수량 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              보유수량 (주) *
            </label>
            <input
              type="number"
              value={holdingQuantity}
              onChange={(e) => setHoldingQuantity(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
          </div>

          {/* 배당주기 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              배당주기
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'annual', label: '연 1회' },
                { val: 'quarterly', label: '분기 (연 4회)' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setDividendCycle(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    dividendCycle === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
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
            <span className="text-[13px] text-fg-secondary">배당수익률 (세전)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.dividendYield.toFixed(2)}%
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">총 배당금 (연간)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.totalDividend)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">배당소득세 (15.4%)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.dividendTax)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">세후 배당금</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.afterTaxDividend)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">세후 배당수익률</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {results.afterTaxYield.toFixed(2)}%
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 배당소득세는 소득세 14% + 지방소득세 1.4% = 15.4%가 원천징수됩니다.</li>
          <li>· 금융소득이 연 2,000만원을 초과하면 종합소득세 신고 대상이 됩니다.</li>
          <li>· 분기 배당주는 연 4회 배당이 지급되어 현금흐름 관리에 유리합니다.</li>
          <li>· ISA 계좌를 활용하면 배당소득세를 절세할 수 있습니다.</li>
        </ul>
      </div>
    </div>
  );
}
