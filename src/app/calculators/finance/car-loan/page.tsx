'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function CarLoanCalculator() {
  const [carPrice, setCarPrice] = useState('');
  const [downPaymentPercent, setDownPaymentPercent] = useState('20');
  const [loanPeriod, setLoanPeriod] = useState('48');
  const [interestRate, setInterestRate] = useState('');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const handleCalculate = () => {
    const price = parseFloat(carPrice) || 0;
    const downPercent = parseFloat(downPaymentPercent) || 0;
    const months = parseInt(loanPeriod) || 0;
    const rate = (parseFloat(interestRate) || 0) / 100;

    if (price <= 0 || rate <= 0) {
      alert('차량가격과 금리를 입력해주세요.');
      return;
    }

    const downPayment = price * (downPercent / 100);
    const loanAmount = price - downPayment;
    const monthlyRate = rate / 12;

    // 원리금균등 상환: M = P × r(1+r)^n / ((1+r)^n - 1)
    const monthlyPayment =
      loanAmount *
      (monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    const totalPayment = monthlyPayment * months;
    const totalInterest = totalPayment - loanAmount;

    setResults({
      downPayment,
      loanAmount,
      monthlyPayment,
      totalInterest,
      totalPayment,
    });
  };

  return (
    <div className="mx-auto max-w-[1200px] px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-fg-muted mb-8">
        <Link href="/" className="hover:text-fg transition-colors">홈</Link>
        <ChevronRight size={12} />
        <span className="text-fg-secondary">금융</span>
        <ChevronRight size={12} />
        <span className="text-fg font-medium">자동차 할부 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">자동차 할부 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        자동차 구매 시 할부 금융의 월 납부액과 총 이자를 계산합니다. 선수금 비율과 할부 기간을 조정하여 비교해보세요.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 차량가격 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              차량가격 (원) *
            </label>
            <input
              type="number"
              value={carPrice}
              onChange={(e) => setCarPrice(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
          </div>

          {/* 선수금 비율 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              선수금 비율 (%)
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: '0', label: '0%' },
                { val: '10', label: '10%' },
                { val: '20', label: '20%' },
                { val: '30', label: '30%' },
                { val: '40', label: '40%' },
                { val: '50', label: '50%' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setDownPaymentPercent(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    downPaymentPercent === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 할부기간 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              할부기간
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: '12', label: '12개월' },
                { val: '24', label: '24개월' },
                { val: '36', label: '36개월' },
                { val: '48', label: '48개월' },
                { val: '60', label: '60개월' },
                { val: '72', label: '72개월' },
                { val: '84', label: '84개월' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setLoanPeriod(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    loanPeriod === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 금리 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              금리 (연, %) *
            </label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
              step="0.1"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              자동차 할부금리는 보통 연 4~8% 수준입니다.
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
            <span className="text-[13px] text-fg-secondary">선수금 (계약금)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.downPayment)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">대출원금</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.loanAmount)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">월 납부액</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.monthlyPayment)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">총 이자</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.totalInterest)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">총 납부액</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {formatNumber(results.totalPayment)}원
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 선수금을 많이 낼수록 대출원금이 줄어 총 이자 부담이 감소합니다.</li>
          <li>· 할부기간이 짧을수록 월 납부액은 높지만 총 이자는 적어집니다.</li>
          <li>· 캐피탈사 금리보다 은행 자동차대출 금리가 낮은 경우가 많습니다.</li>
          <li>· 원리금균등 상환 방식으로 매월 동일한 금액을 납부합니다.</li>
        </ul>
      </div>
    </div>
  );
}
