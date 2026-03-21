'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function RentalYieldCalculator() {
  const [purchasePrice, setPurchasePrice] = useState('');
  const [deposit, setDeposit] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [loanAmount, setLoanAmount] = useState('0');
  const [loanRate, setLoanRate] = useState('4.0');
  const [annualCosts, setAnnualCosts] = useState('');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const handleCalculate = () => {
    const price = parseFloat(purchasePrice) || 0;
    const dep = parseFloat(deposit) || 0;
    const rent = parseFloat(monthlyRent) || 0;
    const loan = parseFloat(loanAmount) || 0;
    const rate = parseFloat(loanRate) || 0;
    const costs = parseFloat(annualCosts) || 0;

    if (price <= 0 || rent <= 0) {
      alert('매입가격과 월세를 입력해주세요.');
      return;
    }

    // 취득세 약 1% 가정 (간이)
    const acquisitionTax = price * 0.01;
    const totalInvestment = price + acquisitionTax;

    const annualRentalIncome = rent * 12;
    const annualLoanInterest = loan * (rate / 100);
    const annualExpenses = costs + annualLoanInterest;
    const netIncome = annualRentalIncome - annualExpenses;

    // 자기자본 = 매입가 - 보증금 - 대출금 + 취득세
    const equity = price - dep - loan + acquisitionTax;

    const grossYield = (annualRentalIncome / totalInvestment) * 100;
    const netYield = (netIncome / totalInvestment) * 100;
    const leverageYield = equity > 0 ? (netIncome / equity) * 100 : 0;

    setResults({
      totalInvestment,
      acquisitionTax,
      annualRentalIncome,
      annualLoanInterest,
      annualExpenses,
      netIncome,
      equity,
      grossYield,
      netYield,
      leverageYield,
    });
  };

  return (
    <div className="mx-auto max-w-[1200px] px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-fg-muted mb-8">
        <Link href="/" className="hover:text-fg transition-colors">홈</Link>
        <ChevronRight size={12} />
        <span className="text-fg-secondary">부동산</span>
        <ChevronRight size={12} />
        <span className="text-fg font-medium">임대수익률 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">임대수익률 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        부동산 임대 투자의 총수익률, 순수익률, 레버리지 수익률을 계산합니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 매입가격 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              매입가격 (원) *
            </label>
            <input
              type="number"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
          </div>

          {/* 보증금 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              보증금 (원)
            </label>
            <input
              type="number"
              value={deposit}
              onChange={(e) => setDeposit(e.target.value)}
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

          {/* 대출금액 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              대출금액 (원)
            </label>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
          </div>

          {/* 대출금리 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              대출금리 (%)
            </label>
            <input
              type="number"
              value={loanRate}
              onChange={(e) => setLoanRate(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="4.0"
              step="0.1"
            />
          </div>

          {/* 기타 연간비용 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              기타 연간비용 (관리비, 세금 등, 원)
            </label>
            <input
              type="number"
              value={annualCosts}
              onChange={(e) => setAnnualCosts(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              재산세, 관리비, 수선비 등 연간 합계
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
            <span className="text-[13px] text-fg-secondary">총 투자비용 (매입가 + 취득세)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.totalInvestment)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">자기자본</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.equity)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">연간 임대수익</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.annualRentalIncome)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">연간 비용 (대출이자 + 기타)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.annualExpenses)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">연간 순수익</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.netIncome)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">총수익률</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.grossYield.toFixed(2)}%
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">순수익률</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.netYield.toFixed(2)}%
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">레버리지 수익률</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {results.leverageYield.toFixed(2)}%
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 총수익률은 연간 임대수익을 총 투자비용으로 나눈 비율입니다.</li>
          <li>· 순수익률은 비용을 제외한 순수익 기준입니다.</li>
          <li>· 레버리지 수익률은 자기자본 대비 수익률로, 대출 활용 효과를 보여줍니다.</li>
          <li>· 공실률, 수선비 등 실제 비용을 고려하면 수익률이 낮아질 수 있습니다.</li>
        </ul>
      </div>
    </div>
  );
}
