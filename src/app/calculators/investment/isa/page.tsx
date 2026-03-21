'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function ISACalculator() {
  const [isaType, setIsaType] = useState('general');
  const [annualDeposit, setAnnualDeposit] = useState('');
  const [expectedReturn, setExpectedReturn] = useState('');
  const [period, setPeriod] = useState('');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const handleCalculate = () => {
    const deposit = parseFloat(annualDeposit) || 0;
    const returnRate = (parseFloat(expectedReturn) || 0) / 100;
    const years = parseFloat(period) || 0;

    if (deposit <= 0 || returnRate <= 0 || years < 3) {
      alert('연간 납입액, 예상 수익률을 입력하고, 가입기간은 3년 이상이어야 합니다.');
      return;
    }

    // 연 납입한도 2,000만원 체크
    const actualDeposit = Math.min(deposit, 20000000);
    const totalDeposit = actualDeposit * years;

    // 총 1억원 한도 체크
    const cappedTotalDeposit = Math.min(totalDeposit, 100000000);

    // 수익 계산 (매년 납입, 복리)
    const monthlyRate = returnRate / 12;
    const months = years * 12;
    const monthlyDeposit = actualDeposit / 12;

    let totalValue = 0;
    for (let i = 0; i < months; i++) {
      totalValue = (totalValue + monthlyDeposit) * (1 + monthlyRate);
    }
    const totalProfit = totalValue - cappedTotalDeposit;

    // 일반계좌 세금: 15.4%
    const normalTax = totalProfit * 0.154;

    // ISA 세금 계산
    const taxFreeLimit = isaType === 'general' ? 2000000 : 4000000;
    const taxableProfit = Math.max(0, totalProfit - taxFreeLimit);
    const isaTax = taxableProfit * 0.099; // 9.9% 분리과세

    const taxSaving = normalTax - isaTax;

    setResults({
      totalDeposit: cappedTotalDeposit,
      totalProfit,
      normalTax,
      isaTax,
      taxSaving,
      taxFreeLimit,
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
        <span className="text-fg font-medium">ISA 절세 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">ISA 절세 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        ISA(개인종합자산관리계좌)를 활용한 절세 효과를 일반 계좌와 비교합니다. 의무가입기간은 3년입니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* ISA 유형 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              ISA 유형
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'general', label: '일반형 (비과세 200만원)' },
                { val: 'special', label: '서민/농어민형 (비과세 400만원)' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setIsaType(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    isaType === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 연간 납입액 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              연간 납입액 (원) *
            </label>
            <input
              type="number"
              value={annualDeposit}
              onChange={(e) => setAnnualDeposit(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              연 납입한도 2,000만원 (총 1억원)
            </p>
          </div>

          {/* 예상 수익률 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              예상 수익률 (연 %) *
            </label>
            <input
              type="number"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="5"
              step="0.1"
            />
          </div>

          {/* 가입기간 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              가입기간 (년) *
            </label>
            <input
              type="number"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="3"
              min="3"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              의무가입기간 최소 3년
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
            <span className="text-[13px] text-fg-secondary">총 납입액</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.totalDeposit)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">예상 수익</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.totalProfit)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">일반계좌 세금 (15.4%)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.normalTax)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">ISA 세금 (비과세 {formatNumber(results.taxFreeLimit)}원 + 초과분 9.9%)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.isaTax)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">절세 금액</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {formatNumber(results.taxSaving)}원
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· ISA는 의무가입기간 3년 이후 해지 가능합니다.</li>
          <li>· 일반형은 200만원, 서민/농어민형은 400만원까지 비과세됩니다.</li>
          <li>· 비과세 한도 초과분은 9.9% 분리과세로 일반 과세(15.4%)보다 유리합니다.</li>
          <li>· 연 납입한도 2,000만원, 총 납입한도 1억원입니다.</li>
        </ul>
      </div>
    </div>
  );
}
