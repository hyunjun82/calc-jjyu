'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function StockReturnCalculator() {
  const [buyPrice, setBuyPrice] = useState('');
  const [buyQuantity, setBuyQuantity] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [commissionRate, setCommissionRate] = useState('0.015');
  const [market, setMarket] = useState('kospi');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const handleCalculate = () => {
    const bp = parseFloat(buyPrice) || 0;
    const qty = parseFloat(buyQuantity) || 0;
    const sp = parseFloat(sellPrice) || 0;
    const cr = parseFloat(commissionRate) / 100 || 0;

    if (bp <= 0 || qty <= 0 || sp <= 0) {
      alert('매수단가, 매수수량, 매도단가를 입력해주세요.');
      return;
    }

    const buyAmount = bp * qty;
    const sellAmount = sp * qty;

    const buyCommission = buyAmount * cr;
    const sellCommission = sellAmount * cr;
    const totalCommission = buyCommission + sellCommission;

    // 증권거래세: 코스피 0.18%, 코스닥 0.18% (2025년)
    const transactionTaxRate = market === 'kospi' ? 0.0018 : 0.0018;
    const transactionTax = sellAmount * transactionTaxRate;

    const netProfit = sellAmount - buyAmount - totalCommission - transactionTax;
    const returnRate = (netProfit / buyAmount) * 100;

    setResults({
      buyAmount,
      sellAmount,
      buyCommission,
      sellCommission,
      totalCommission,
      transactionTax,
      netProfit,
      returnRate,
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
        <span className="text-fg font-medium">주식 수익률 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">주식 수익률 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        주식 매매 시 수수료와 세금을 반영한 실제 수익률을 계산합니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 매수단가 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              매수단가 (원) *
            </label>
            <input
              type="number"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
          </div>

          {/* 매수수량 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              매수수량 (주) *
            </label>
            <input
              type="number"
              value={buyQuantity}
              onChange={(e) => setBuyQuantity(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
          </div>

          {/* 매도단가 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              매도단가 (원) *
            </label>
            <input
              type="number"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
          </div>

          {/* 수수료율 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              수수료율 (%)
            </label>
            <input
              type="number"
              value={commissionRate}
              onChange={(e) => setCommissionRate(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0.015"
              step="0.001"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              온라인 거래 기준 약 0.015%
            </p>
          </div>

          {/* 시장 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              시장 선택
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'kospi', label: '코스피' },
                { val: 'kosdaq', label: '코스닥' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setMarket(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    market === val
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
            <span className="text-[13px] text-fg-secondary">매수금액</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.buyAmount)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">매도금액</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.sellAmount)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">수수료 합계 (매수 {formatNumber(results.buyCommission)}원 + 매도 {formatNumber(results.sellCommission)}원)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.totalCommission)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">증권거래세 (0.18%)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.transactionTax)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">순이익</span>
            <span className={`text-[14px] font-medium tabular-nums ${results.netProfit >= 0 ? 'text-fg' : 'text-red-500'}`}>
              {results.netProfit >= 0 ? '+' : ''}{formatNumber(results.netProfit)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">수익률</span>
            <span className={`text-[24px] font-bold tabular-nums ${results.returnRate >= 0 ? 'text-fg' : 'text-red-500'}`}>
              {results.returnRate >= 0 ? '+' : ''}{results.returnRate.toFixed(2)}%
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 온라인 증권사 수수료는 보통 0.015% 내외입니다.</li>
          <li>· 증권거래세는 매도 시에만 부과되며, 코스피·코스닥 모두 2025년 기준 0.18%입니다.</li>
          <li>· 실제 수익률은 수수료와 세금을 반영해야 정확합니다.</li>
          <li>· 대주주 양도소득세는 별도로 계산해야 합니다.</li>
        </ul>
      </div>
    </div>
  );
}
