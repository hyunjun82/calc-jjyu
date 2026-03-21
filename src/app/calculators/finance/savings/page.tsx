'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { FormStep, FormProgress } from '@/components/FormStep';

interface SavingsResult {
  monthlyAmount: number;
  totalDeposit: number;
  preInterest: number;
  tax: number;
  postInterest: number;
  maturityAmount: number;
}

export default function SavingsCalculator() {
  const [monthlyAmount, setMonthlyAmount] = useState(500000);
  const [annualRate, setAnnualRate] = useState(3.5);
  const [duration, setDuration] = useState(24);
  const [taxType, setTaxType] = useState('general');

  const taxRate = useMemo(() => {
    switch (taxType) {
      case 'general':
        return 0.154;
      case 'preferred':
        return 0.095;
      case 'taxfree':
        return 0;
      default:
        return 0.154;
    }
  }, [taxType]);

  const result = useMemo<SavingsResult | null>(() => {
    if (!monthlyAmount || annualRate === null || annualRate === undefined || !duration) return null;

    const totalDeposit = monthlyAmount * duration;
    const monthlyRate = annualRate / 100 / 12;

    // 정액적립식 이자 계산
    // 세전이자 = 월적립액 × (연이율/12) × n(n+1)/2
    const preInterest =
      monthlyAmount * monthlyRate * (duration * (duration + 1)) / 2;

    const tax = preInterest * taxRate;
    const postInterest = preInterest - tax;
    const maturityAmount = totalDeposit + postInterest;

    return {
      monthlyAmount,
      totalDeposit,
      preInterest,
      tax,
      postInterest,
      maturityAmount,
    };
  }, [monthlyAmount, annualRate, duration, taxRate]);

  const handleCalculate = () => {
    // 계산은 useMemo에 의해 자동으로 수행됨
  };

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-fg-muted mb-8">
        <Link href="/" className="hover:text-fg transition-colors">홈</Link>
        <ChevronRight size={12} />
        <span className="text-fg-secondary">금융 계산기</span>
        <ChevronRight size={12} />
        <span className="text-fg font-medium">적금 계산기</span>
      </nav>

      {/* Title */}
      <div className="mb-8">
        <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-3">적금 계산기</h1>
        <p className="text-[15px] text-fg-secondary">
          매월 일정액을 적립했을 때 세금을 고려하여 만기수령액을 계산해보세요.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="border border-border rounded-2xl bg-surface p-6 sticky top-20">
            <h2 className="text-[16px] font-semibold text-fg mb-5">계산 설정</h2>

            <div className="space-y-4">
              <FormProgress current={[monthlyAmount > 0, annualRate > 0, duration > 0, true].filter(Boolean).length} total={4} />

              {/* 월 적립액 */}
              <FormStep step={1} label="월적립액" required completed={monthlyAmount > 0}>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={monthlyAmount}
                    onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                  />
                  <span className="text-[13px] text-fg-muted">원</span>
                </div>
                <p className="text-[12px] text-fg-muted mt-1.5">
                  {monthlyAmount.toLocaleString('ko-KR')} 원
                </p>
              </FormStep>

              {/* 연이율 */}
              <FormStep step={2} label="연이율" required completed={annualRate > 0}>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={annualRate}
                    onChange={(e) => setAnnualRate(Number(e.target.value))}
                    step="0.01"
                    className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                  />
                  <span className="text-[13px] text-fg-muted">%</span>
                </div>
              </FormStep>

              {/* 적립기간 */}
              <FormStep step={3} label="적립기간" required completed={duration > 0}>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                  />
                  <span className="text-[13px] text-fg-muted">개월</span>
                </div>
              </FormStep>

              {/* 이자과세 */}
              <FormStep step={4} label="이자과세" required completed={true}>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'general', label: '일반과세 (15.4%)' },
                    { value: 'preferred', label: '세금우대 (9.5%)' },
                    { value: 'taxfree', label: '비과세 (0%)' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setTaxType(option.value)}
                      className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                        taxType === option.value
                          ? 'bg-accent text-accent-fg'
                          : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </FormStep>

              <div className="pl-[30px]">
                <button
                  onClick={handleCalculate}
                  className="w-full h-11 bg-accent hover:bg-accent-hover text-accent-fg font-medium rounded-xl transition-colors"
                >
                  계산하기
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          {result && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="border border-border rounded-xl bg-surface p-4">
                  <p className="text-[13px] text-fg-secondary mb-1">월 적립액</p>
                  <p className="text-[22px] font-bold text-fg tabular-nums">
                    {result.monthlyAmount.toLocaleString('ko-KR', {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p className="text-[12px] text-fg-muted mt-1">원</p>
                </div>

                <div className="border border-border rounded-xl bg-surface p-4">
                  <p className="text-[13px] text-fg-secondary mb-1">적립기간</p>
                  <p className="text-[22px] font-bold text-fg tabular-nums">{duration}</p>
                  <p className="text-[12px] text-fg-muted mt-1">개월</p>
                </div>

                <div className="border border-border rounded-xl bg-surface p-4">
                  <p className="text-[13px] text-fg-secondary mb-1">총 납입액</p>
                  <p className="text-[22px] font-bold text-fg tabular-nums">
                    {result.totalDeposit.toLocaleString('ko-KR', {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p className="text-[12px] text-fg-muted mt-1">원</p>
                </div>

                <div className="border border-border rounded-xl bg-surface p-4">
                  <p className="text-[13px] text-fg-secondary mb-1">세전이자</p>
                  <p className="text-[22px] font-bold text-fg tabular-nums">
                    {result.preInterest.toLocaleString('ko-KR', {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p className="text-[12px] text-fg-muted mt-1">원</p>
                </div>

                <div className="border border-border rounded-xl bg-surface p-4">
                  <p className="text-[13px] text-fg-secondary mb-1">세금</p>
                  <p className="text-[22px] font-bold text-fg tabular-nums">
                    {result.tax.toLocaleString('ko-KR', {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p className="text-[12px] text-fg-muted mt-1">원</p>
                </div>

                <div className="border border-border rounded-xl bg-surface p-4">
                  <p className="text-[13px] text-fg-secondary mb-1">세후이자</p>
                  <p className="text-[22px] font-bold text-fg tabular-nums">
                    {result.postInterest.toLocaleString('ko-KR', {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p className="text-[12px] text-fg-muted mt-1">원</p>
                </div>

                <div className="border border-border rounded-xl bg-bg-secondary p-5 sm:col-span-2">
                  <p className="text-[13px] text-fg-secondary mb-1">만기수령액</p>
                  <p className="text-[32px] font-bold text-fg tabular-nums">
                    {result.maturityAmount.toLocaleString('ko-KR', {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p className="text-[12px] text-fg-muted mt-1">원</p>
                </div>
              </div>

              {/* Analysis */}
              <div className="border border-border rounded-xl bg-surface overflow-hidden">
                <div className="p-4">
                  <h3 className="text-[16px] font-semibold text-fg mb-3">비교</h3>
                  <div className="space-y-2 text-[13px]">
                    <div className="flex justify-between">
                      <span className="text-fg-secondary">이자 비율</span>
                      <span className="font-semibold text-fg tabular-nums">
                        {((result.preInterest / result.totalDeposit) * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-fg-secondary">세후 이자 비율</span>
                      <span className="font-semibold text-fg tabular-nums">
                        {((result.postInterest / result.totalDeposit) * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border">
                      <span className="text-fg-secondary">순 수익률</span>
                      <span className="font-semibold text-fg tabular-nums">
                        {((result.postInterest / result.totalDeposit) * 100).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="border border-border rounded-xl bg-bg-secondary p-5">
                <h3 className="text-[14px] font-semibold text-fg mb-3">팁</h3>
                <ul className="text-[13px] text-fg-secondary leading-relaxed space-y-1">
                  <li>· 적금은 매월 일정액을 저축하는 상품으로 저축 습관에 좋음</li>
                  <li>· 예금보다 이자가 높은 편이나, 중도해지 시 페널티가 있을 수 있음</li>
                  <li>· 세금우대 대상자는 더 높은 세후 수익을 기대할 수 있음</li>
                  <li>· 금리가 높아질 것으로 예상되면 짧은 기간 적금이 유리</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
