'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface DepositResult {
  principal: number;
  preInterest: number;
  tax: number;
  postInterest: number;
  maturityAmount: number;
  monthlyInterest?: number;
  monthlyTax?: number;
  monthlyPostInterest?: number;
}

export default function DepositCalculator() {
  const [principal, setPrincipal] = useState(10000000);
  const [annualRate, setAnnualRate] = useState(3.5);
  const [duration, setDuration] = useState(12);
  const [taxType, setTaxType] = useState('general');
  const [interestType, setInterestType] = useState('maturity');

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

  const result = useMemo<DepositResult | null>(() => {
    if (!principal || !annualRate || !duration) return null;

    // 세전이자 = 원금 × 이율 × (기간/12)
    const preInterest = principal * (annualRate / 100) * (duration / 12);
    const tax = preInterest * taxRate;
    const postInterest = preInterest - tax;
    const maturityAmount = principal + postInterest;

    if (interestType === 'maturity') {
      return {
        principal,
        preInterest,
        tax,
        postInterest,
        maturityAmount,
      };
    } else {
      // 월이자지급
      const monthlyInterest = (principal * (annualRate / 100)) / 12;
      const monthlyTax = monthlyInterest * taxRate;
      const monthlyPostInterest = monthlyInterest - monthlyTax;

      return {
        principal,
        preInterest,
        tax,
        postInterest,
        maturityAmount,
        monthlyInterest,
        monthlyTax,
        monthlyPostInterest,
      };
    }
  }, [principal, annualRate, duration, taxRate, interestType]);

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
        <span className="text-fg font-medium">예금 계산기</span>
      </nav>

      {/* Title */}
      <div className="mb-8">
        <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-3">예금 계산기</h1>
        <p className="text-[15px] text-fg-secondary">
          예금의 만기수령액과 이자를 세금을 고려하여 정확하게 계산해보세요.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="border border-border rounded-2xl bg-surface p-6 sticky top-20">
            <h2 className="text-[16px] font-semibold text-fg mb-5">계산 설정</h2>

            <div className="space-y-4">
              {/* 예치금액 */}
              <div>
                <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                  예치금액 <span className="text-negative">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={principal}
                    onChange={(e) => setPrincipal(Number(e.target.value))}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                  />
                  <span className="text-[13px] text-fg-muted">원</span>
                </div>
                <p className="text-[12px] text-fg-muted mt-1.5">
                  {principal.toLocaleString('ko-KR')} 원
                </p>
              </div>

              {/* 연이율 */}
              <div>
                <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                  연이율 <span className="text-negative">*</span>
                </label>
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
              </div>

              {/* 예치기간 */}
              <div>
                <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                  예치기간 <span className="text-negative">*</span>
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                >
                  <option value={1}>1개월</option>
                  <option value={3}>3개월</option>
                  <option value={6}>6개월</option>
                  <option value={12}>12개월</option>
                  <option value={24}>24개월</option>
                  <option value={36}>36개월</option>
                </select>
              </div>

              {/* 이자과세 */}
              <div>
                <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                  이자과세 <span className="text-negative">*</span>
                </label>
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
              </div>

              {/* 이자지급방식 */}
              <div>
                <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                  이자지급방식 <span className="text-negative">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'maturity', label: '만기일시지급' },
                    { value: 'monthly', label: '월이자지급' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setInterestType(option.value)}
                      className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                        interestType === option.value
                          ? 'bg-accent text-accent-fg'
                          : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCalculate}
                className="w-full h-11 bg-accent hover:bg-accent-hover text-accent-fg font-medium rounded-xl transition-colors"
              >
                계산하기
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          {result && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid gap-4">
                <div className="border border-border rounded-xl bg-surface p-4">
                  <p className="text-[13px] text-fg-secondary mb-1">예치금액</p>
                  <p className="text-[22px] font-bold text-fg tabular-nums">
                    {result.principal.toLocaleString('ko-KR', {
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

                <div className="border border-border rounded-xl bg-bg-secondary p-5">
                  <p className="text-[13px] text-fg-secondary mb-1">만기수령액</p>
                  <p className="text-[32px] font-bold text-fg tabular-nums">
                    {result.maturityAmount.toLocaleString('ko-KR', {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p className="text-[12px] text-fg-muted mt-1">원</p>
                </div>

                {result.monthlyInterest && (
                  <>
                    <div className="border-t border-border pt-4 mt-4">
                      <p className="text-[14px] font-semibold text-fg mb-3">
                        월 이자 수령액
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="border border-border rounded-xl bg-surface p-3">
                          <p className="text-[12px] text-fg-secondary mb-1">세전</p>
                          <p className="text-lg font-bold text-fg tabular-nums">
                            {result.monthlyInterest.toLocaleString('ko-KR', {
                              maximumFractionDigits: 0,
                            })}
                          </p>
                        </div>
                        <div className="border border-border rounded-xl bg-surface p-3">
                          <p className="text-[12px] text-fg-secondary mb-1">세금</p>
                          <p className="text-lg font-bold text-fg tabular-nums">
                            {result.monthlyTax?.toLocaleString('ko-KR', {
                              maximumFractionDigits: 0,
                            })}
                          </p>
                        </div>
                        <div className="border border-border rounded-xl bg-surface p-3">
                          <p className="text-[12px] text-fg-secondary mb-1">세후</p>
                          <p className="text-lg font-bold text-fg tabular-nums">
                            {result.monthlyPostInterest?.toLocaleString('ko-KR', {
                              maximumFractionDigits: 0,
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Tips */}
              <div className="border border-border rounded-xl bg-bg-secondary p-5">
                <h3 className="text-[14px] font-semibold text-fg mb-3">팁</h3>
                <ul className="text-[13px] text-fg-secondary leading-relaxed space-y-1">
                  <li>· 일반과세: 대부분의 일반인이 적용받는 세율</li>
                  <li>· 세금우대: 장애인, 국가유공자 등 특정 대상자 적용</li>
                  <li>· 비과세: 개인종합자산관리계좌(ISA) 등 특정 상품 적용</li>
                  <li>· 만기일시지급이 월이자지급보다 복리 이득을 볼 수 있음</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
