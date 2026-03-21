'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function DismissalPayCalculator() {
  const [wageType, setWageType] = useState('monthly');
  const [wageAmount, setWageAmount] = useState('');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const handleCalculate = () => {
    const wage = parseFloat(wageAmount) || 0;

    if (wage <= 0) {
      alert('임금을 입력해주세요.');
      return;
    }

    let dailyWage = 0;

    if (wageType === 'monthly') {
      // 1일 통상임금 = 월급 / 209 × 8
      const hourlyWage = wage / 209;
      dailyWage = hourlyWage * 8;
    } else {
      // 시급 기준
      dailyWage = wage * 8;
    }

    const dismissalPay = dailyWage * 30;

    setResults({
      dailyWage,
      dismissalPay,
      hourlyWage: wageType === 'monthly' ? wage / 209 : wage,
    });
  };

  return (
    <div className="mx-auto max-w-[1200px] px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-fg-muted mb-8">
        <Link href="/" className="hover:text-fg transition-colors">홈</Link>
        <ChevronRight size={12} />
        <span className="text-fg-secondary">근로</span>
        <ChevronRight size={12} />
        <span className="text-fg font-medium">해고예고수당 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">해고예고수당 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        해고 시 30일 전 예고를 하지 않은 경우 지급해야 하는 해고예고수당을 계산합니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 임금 유형 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              임금 입력 방식
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'monthly', label: '월 통상임금' },
                { val: 'hourly', label: '시급' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setWageType(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    wageType === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 임금 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              {wageType === 'monthly' ? '월 통상임금' : '시급'} (원) *
            </label>
            <input
              type="number"
              value={wageAmount}
              onChange={(e) => setWageAmount(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
            {wageType === 'monthly' && (
              <p className="text-[12px] text-fg-muted mt-1.5">
                기본급 + 고정수당 합계 (통상임금)
              </p>
            )}
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
            <span className="text-[13px] text-fg-secondary">통상시급</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.hourlyWage)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">1일 통상임금 (시급 x 8시간)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.dailyWage)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">해고예고수당 (30일분)</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {formatNumber(results.dismissalPay)}원
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 사용자는 근로자를 해고하려면 최소 30일 전에 예고해야 합니다.</li>
          <li>· 30일 전 예고를 하지 않으면 30일분의 통상임금을 해고예고수당으로 지급해야 합니다.</li>
          <li>· 1일 통상임금 = 월 통상임금 / 209시간 x 8시간</li>
          <li>· 근속 3개월 미만인 경우 해고예고 의무가 면제됩니다.</li>
        </ul>
      </div>
    </div>
  );
}
