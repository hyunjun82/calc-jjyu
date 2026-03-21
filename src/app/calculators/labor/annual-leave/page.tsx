'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function AnnualLeaveCalculator() {
  const [yearsWorked, setYearsWorked] = useState('');
  const [monthlyWage, setMonthlyWage] = useState('');
  const [usedDays, setUsedDays] = useState('0');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const calculateAnnualLeave = (years: number): number => {
    if (years < 1) {
      // 1년 미만: 1개월 개근 시 1일 (최대 11일)
      return Math.min(Math.floor(years * 12), 11);
    }

    // 1년 이상: 15일 기본
    let days = 15;

    if (years >= 3) {
      // 3년 이상: 매 2년마다 1일 추가
      const extraDays = Math.floor((years - 1) / 2);
      days += extraDays;
    }

    // 최대 25일
    return Math.min(days, 25);
  };

  const handleCalculate = () => {
    const years = parseFloat(yearsWorked) || 0;
    const wage = parseFloat(monthlyWage) || 0;
    const used = parseFloat(usedDays) || 0;

    if (wage <= 0) {
      alert('월 통상임금을 입력해주세요.');
      return;
    }

    const totalLeave = calculateAnnualLeave(years);
    const unusedLeave = Math.max(totalLeave - used, 0);

    // 1일 통상임금 = 월급 / 209 × 8
    const hourlyWage = wage / 209;
    const dailyWage = hourlyWage * 8;
    const annualLeavePay = dailyWage * unusedLeave;

    setResults({
      totalLeave,
      usedLeave: used,
      unusedLeave,
      dailyWage,
      annualLeavePay,
      hourlyWage,
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
        <span className="text-fg font-medium">연차수당 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">연차수당 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        근속연수에 따른 연차 발생일수와 미사용 연차에 대한 수당을 계산합니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 근속연수 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              근속연수 (년) *
            </label>
            <input
              type="number"
              value={yearsWorked}
              onChange={(e) => setYearsWorked(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="1"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              1년 미만은 소수점으로 입력 (예: 0.5 = 6개월)
            </p>
          </div>

          {/* 월 통상임금 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              월 통상임금 (원) *
            </label>
            <input
              type="number"
              value={monthlyWage}
              onChange={(e) => setMonthlyWage(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
          </div>

          {/* 사용한 연차일수 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              사용한 연차일수
            </label>
            <input
              type="number"
              value={usedDays}
              onChange={(e) => setUsedDays(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
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
            <span className="text-[13px] text-fg-secondary">총 발생 연차</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.totalLeave}일
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">사용한 연차</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.usedLeave}일
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">미사용 연차</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.unusedLeave}일
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">1일 통상임금</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.dailyWage)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">연차수당</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {formatNumber(results.annualLeavePay)}원
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 1년 미만: 1개월 개근 시 1일 발생 (최대 11일)</li>
          <li>· 1년 이상: 15일 발생</li>
          <li>· 3년 이상: 매 2년마다 1일 추가 (최대 25일)</li>
          <li>· 미사용 연차수당 = 1일 통상임금 x 미사용 일수</li>
          <li>· 1일 통상임금 = 월급 / 209시간 x 8시간</li>
        </ul>
      </div>
    </div>
  );
}
