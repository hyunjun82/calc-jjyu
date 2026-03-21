'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function FinancialIncomeTaxCalculator() {
  const [interestIncome, setInterestIncome] = useState('');
  const [dividendIncome, setDividendIncome] = useState('');
  const [otherIncome, setOtherIncome] = useState('');
  const [deduction, setDeduction] = useState('1500000');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const calcProgressiveTax = (taxableIncome: number): number => {
    // 종합소득세율 누진세
    const brackets = [
      { limit: 14000000, rate: 0.06 },
      { limit: 50000000, rate: 0.15 },
      { limit: 88000000, rate: 0.24 },
      { limit: 150000000, rate: 0.35 },
      { limit: 300000000, rate: 0.38 },
      { limit: 500000000, rate: 0.40 },
      { limit: 1000000000, rate: 0.42 },
      { limit: Infinity, rate: 0.45 },
    ];

    let tax = 0;
    let prev = 0;

    for (const bracket of brackets) {
      if (taxableIncome <= prev) break;
      const taxable = Math.min(taxableIncome, bracket.limit) - prev;
      tax += taxable * bracket.rate;
      prev = bracket.limit;
    }

    return tax;
  };

  const handleCalculate = () => {
    const interest = parseFloat(interestIncome) || 0;
    const dividend = parseFloat(dividendIncome) || 0;
    const other = parseFloat(otherIncome) || 0;
    const deductionAmt = parseFloat(deduction) || 1500000;

    const financialTotal = interest + dividend;

    if (financialTotal <= 0) {
      alert('이자소득 또는 배당소득을 입력해주세요.');
      return;
    }

    const isComprehensive = financialTotal > 20000000;

    if (!isComprehensive) {
      // 2,000만원 이하: 원천징수 15.4%로 분리과세 종결
      const withholdingTax = financialTotal * 0.154;
      setResults({
        financialTotal,
        isComprehensive: false,
        withholdingTax,
        totalTax: withholdingTax,
      });
      return;
    }

    // 2,000만원 초과: 비교과세
    // 방법1: 2,000만원 × 14% + 초과분을 다른 소득과 합산하여 종합과세
    const separatedTax = 20000000 * 0.14; // 2,000만원에 대한 원천징수 세액
    const excessFinancial = financialTotal - 20000000;
    const totalIncomeForExcess = excessFinancial + other - deductionAmt;
    const excessProgressiveTax = totalIncomeForExcess > 0 ? calcProgressiveTax(totalIncomeForExcess) : 0;
    const method1Tax = separatedTax + excessProgressiveTax;

    // 방법2: 전체 종합과세 (금융소득 전체 + 기타소득 합산)
    const totalIncomeAll = financialTotal + other - deductionAmt;
    const method2Tax = totalIncomeAll > 0 ? calcProgressiveTax(totalIncomeAll) : 0;

    // 비교과세: 둘 중 큰 금액
    const incomeTax = Math.max(method1Tax, method2Tax);
    const localTax = incomeTax * 0.1;
    const totalTax = incomeTax + localTax;

    setResults({
      financialTotal,
      isComprehensive: true,
      separatedTax,
      excessAmount: excessFinancial,
      excessProgressiveTax,
      method1Tax,
      method2Tax,
      incomeTax,
      localTax,
      totalTax,
    });
  };

  return (
    <div className="mx-auto max-w-[1200px] px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-fg-muted mb-8">
        <Link href="/" className="hover:text-fg transition-colors">홈</Link>
        <ChevronRight size={12} />
        <span className="text-fg-secondary">세금</span>
        <ChevronRight size={12} />
        <span className="text-fg font-medium">금융소득종합과세 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">금융소득종합과세 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        이자소득과 배당소득의 합계가 연 2,000만원을 초과하면 종합과세 대상이 됩니다. 비교과세 방식으로 세액을 계산합니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 이자소득 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              이자소득 (연간, 원) *
            </label>
            <input
              type="number"
              value={interestIncome}
              onChange={(e) => setInterestIncome(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              예금, 적금, 채권 등에서 발생한 이자소득
            </p>
          </div>

          {/* 배당소득 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              배당소득 (연간, 원) *
            </label>
            <input
              type="number"
              value={dividendIncome}
              onChange={(e) => setDividendIncome(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              주식 배당금, 펀드 분배금 등
            </p>
          </div>

          {/* 기타 종합소득 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              기타 종합소득 (근로/사업/연금 등, 원)
            </label>
            <input
              type="number"
              value={otherIncome}
              onChange={(e) => setOtherIncome(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              금융소득 외 다른 종합소득이 있는 경우 입력
            </p>
          </div>

          {/* 종합소득공제액 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              종합소득공제액 (원)
            </label>
            <input
              type="number"
              value={deduction}
              onChange={(e) => setDeduction(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="1500000"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              기본공제 150만원 (본인)이 기본 적용됩니다
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
            <span className="text-[13px] text-fg-secondary">금융소득 합계</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.financialTotal)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">종합과세 대상 여부</span>
            <span className={`text-[14px] font-medium tabular-nums ${results.isComprehensive ? 'text-fg' : 'text-fg-secondary'}`}>
              {results.isComprehensive ? '종합과세 대상 (2,000만원 초과)' : '분리과세 (2,000만원 이하)'}
            </span>
          </div>

          {!results.isComprehensive && (
            <>
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-[13px] text-fg-secondary">원천징수 세액 (15.4%)</span>
                <span className="text-[14px] font-medium text-fg tabular-nums">
                  {formatNumber(results.withholdingTax)}원
                </span>
              </div>

              <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
                <span className="text-[15px] font-semibold text-fg">총 납부세액</span>
                <span className="text-[24px] font-bold text-fg tabular-nums">
                  {formatNumber(results.totalTax)}원
                </span>
              </div>
            </>
          )}

          {results.isComprehensive && (
            <>
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-[13px] text-fg-secondary">분리과세 세액 (2,000만원 x 14%)</span>
                <span className="text-[14px] font-medium text-fg tabular-nums">
                  {formatNumber(results.separatedTax)}원
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-[13px] text-fg-secondary">초과분</span>
                <span className="text-[14px] font-medium text-fg tabular-nums">
                  {formatNumber(results.excessAmount)}원
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-[13px] text-fg-secondary">초과분 종합과세 세액</span>
                <span className="text-[14px] font-medium text-fg tabular-nums">
                  {formatNumber(results.excessProgressiveTax)}원
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-[13px] text-fg-secondary">소득세</span>
                <span className="text-[14px] font-medium text-fg tabular-nums">
                  {formatNumber(results.incomeTax)}원
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-[13px] text-fg-secondary">지방소득세 (10%)</span>
                <span className="text-[14px] font-medium text-fg tabular-nums">
                  {formatNumber(results.localTax)}원
                </span>
              </div>

              <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
                <span className="text-[15px] font-semibold text-fg">총 납부세액</span>
                <span className="text-[24px] font-bold text-fg tabular-nums">
                  {formatNumber(results.totalTax)}원
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
          <li>· 금융소득(이자+배당) 합계가 연 2,000만원 이하이면 15.4% 원천징수로 납세의무가 종결됩니다.</li>
          <li>· 2,000만원 초과 시 비교과세 방식으로, 분리과세와 종합과세 중 큰 금액이 적용됩니다.</li>
          <li>· 종합소득세율은 6%~45%의 누진세율이 적용됩니다.</li>
          <li>· 금융소득종합과세 대상자는 매년 5월 종합소득세 확정신고를 해야 합니다.</li>
        </ul>
      </div>
    </div>
  );
}
