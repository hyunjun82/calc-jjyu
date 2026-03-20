'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface SeveranceResult {
  startDate: string;
  endDate: string;
  employmentDays: number;
  employmentYears: number;
  last3MonthsWages: number;
  bonus3MonthsProportion: number;
  annualLeaveProportion: number;
  totalWagesBase: number;
  dailyAverageWage: number;
  severancePay: number;
  isEligible: boolean;
  eligibilityMessage: string;
}

export default function SeveranceCalculator() {
  const [startDate, setStartDate] = useState('2019-01-15');
  const [endDate, setEndDate] = useState('2024-03-12');
  const [last3MonthsWages, setLast3MonthsWages] = useState(15000000);
  const [bonus3Months, setBonus3Months] = useState(3000000);
  const [annualLeave, setAnnualLeave] = useState(1500000);

  const result = useMemo<SeveranceResult | null>(() => {
    if (!startDate || !endDate || !last3MonthsWages) return null;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // 재직일수 계산 (퇴직일 포함)
    const employmentDays = Math.floor(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;
    const employmentYears = employmentDays / 365;

    // 1일 평균임금 계산
    // 3개월 임금 + 상여금 비례분 + 연차수당 비례분
    const bonus3MonthsProportion = bonus3Months * (3 / 12);
    const annualLeaveProportion = annualLeave * (3 / 12);
    const totalWagesBase =
      last3MonthsWages + bonus3MonthsProportion + annualLeaveProportion;

    // 3개월의 실제 역일수 계산
    const threeMonthsAgo = new Date(end);
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    const daysIn3Months = Math.floor((end.getTime() - threeMonthsAgo.getTime()) / (1000 * 60 * 60 * 24));
    const dailyAverageWage = totalWagesBase / daysIn3Months;

    // 퇴직금 = 1일 평균임금 × 30일 × (재직일수 / 365)
    const severancePay = dailyAverageWage * 30 * (employmentDays / 365);

    // 1년 이상 근무 여부
    const isEligible = employmentDays >= 365;
    const eligibilityMessage = isEligible
      ? `${Math.floor(employmentYears)}년 ${Math.floor((employmentYears % 1) * 12)}개월 근무로 퇴직금 지급 대상입니다.`
      : `${Math.floor(employmentYears)}년 ${Math.floor((employmentYears % 1) * 12)}개월 근무로 퇴직금 미지급 대상입니다. (1년 이상 필요)`;

    return {
      startDate,
      endDate,
      employmentDays,
      employmentYears,
      last3MonthsWages,
      bonus3MonthsProportion,
      annualLeaveProportion,
      totalWagesBase,
      dailyAverageWage,
      severancePay: isEligible ? severancePay : 0,
      isEligible,
      eligibilityMessage,
    };
  }, [startDate, endDate, last3MonthsWages, bonus3Months, annualLeave]);

  const handleCalculate = () => {
    // 계산은 useMemo에 의해 자동으로 수행됨
  };

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-fg-muted mb-8">
        <Link href="/" className="hover:text-fg transition-colors">홈</Link>
        <ChevronRight size={12} />
        <span className="text-fg-secondary">근로 계산기</span>
        <ChevronRight size={12} />
        <span className="text-fg font-medium">퇴직금 계산기</span>
      </nav>

      {/* Title */}
      <div className="mb-8">
        <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-3">퇴직금 계산기</h1>
        <p className="text-[15px] text-fg-secondary">
          입사일과 퇴사일을 기준으로 퇴직금을 정확하게 계산해보세요.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="border border-border rounded-2xl bg-surface p-6 sticky top-20">
            <h2 className="text-[16px] font-semibold text-fg mb-5">계산 설정</h2>

            <div className="space-y-4">
              {/* 입사일 */}
              <div>
                <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                  입사일 <span className="text-negative">*</span>
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                />
              </div>

              {/* 퇴사일 */}
              <div>
                <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                  퇴사일 <span className="text-negative">*</span>
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                />
              </div>

              {/* 최근 3개월 임금총액 */}
              <div>
                <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                  최근 3개월 임금총액 <span className="text-negative">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={last3MonthsWages}
                    onChange={(e) => setLast3MonthsWages(Number(e.target.value))}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                  />
                  <span className="text-[13px] text-fg-muted">원</span>
                </div>
                <p className="text-[12px] text-fg-muted mt-1.5">
                  {last3MonthsWages.toLocaleString('ko-KR')} 원
                </p>
              </div>

              {/* 최근 3개월 상여금 */}
              <div>
                <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                  최근 3개월 상여금 (연간기준)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={bonus3Months}
                    onChange={(e) => setBonus3Months(Number(e.target.value))}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                  />
                  <span className="text-[13px] text-fg-muted">원</span>
                </div>
                <p className="text-[12px] text-fg-muted mt-1.5">
                  {bonus3Months.toLocaleString('ko-KR')} 원
                </p>
              </div>

              {/* 연차수당 */}
              <div>
                <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                  미사용 연차수당 (연간기준)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={annualLeave}
                    onChange={(e) => setAnnualLeave(Number(e.target.value))}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                  />
                  <span className="text-[13px] text-fg-muted">원</span>
                </div>
                <p className="text-[12px] text-fg-muted mt-1.5">
                  {annualLeave.toLocaleString('ko-KR')} 원
                </p>
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
              {/* Eligibility Alert */}
              <div className="border border-border bg-bg-secondary rounded-xl p-4">
                <p className="text-[13px] font-medium text-fg">
                  {result.isEligible ? '✓' : '⚠'} {result.eligibilityMessage}
                </p>
              </div>

              {/* Summary Cards */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="border border-border rounded-xl bg-surface p-4">
                  <p className="text-[13px] text-fg-secondary mb-1">재직기간</p>
                  <p className="text-[22px] font-bold text-fg tabular-nums">
                    {Math.floor(result.employmentYears)}년 {Math.floor((result.employmentYears % 1) * 12)}개월
                  </p>
                  <p className="text-[12px] text-fg-muted mt-1">
                    {result.employmentDays}일
                  </p>
                </div>

                <div className="border border-border rounded-xl bg-surface p-4">
                  <p className="text-[13px] text-fg-secondary mb-1">1일 평균임금</p>
                  <p className="text-[22px] font-bold text-fg tabular-nums">
                    {result.dailyAverageWage.toLocaleString('ko-KR', {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p className="text-[12px] text-fg-muted mt-1">원</p>
                </div>

                <div className="border border-border rounded-xl bg-surface p-4">
                  <p className="text-[13px] text-fg-secondary mb-1">3개월 임금총액</p>
                  <p className="text-[22px] font-bold text-fg tabular-nums">
                    {result.last3MonthsWages.toLocaleString('ko-KR', {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p className="text-[12px] text-fg-muted mt-1">원</p>
                </div>

                <div className="border border-border rounded-xl bg-surface p-4">
                  <p className="text-[13px] text-fg-secondary mb-1">추가 포함항목</p>
                  <p className="text-[13px] font-semibold text-fg mt-2 tabular-nums">
                    상여금 비례: {result.bonus3MonthsProportion.toLocaleString('ko-KR', {
                      maximumFractionDigits: 0,
                    })}원
                  </p>
                  <p className="text-[13px] font-semibold text-fg mt-1 tabular-nums">
                    연차수당 비례: {result.annualLeaveProportion.toLocaleString('ko-KR', {
                      maximumFractionDigits: 0,
                    })}원
                  </p>
                </div>
              </div>

              {/* Main Result */}
              <div className="border border-border rounded-xl bg-bg-secondary p-5">
                <p className="text-[13px] text-fg-secondary mb-1">퇴직금</p>
                <p className="text-[32px] font-bold text-fg tabular-nums">
                  {result.severancePay.toLocaleString('ko-KR', {
                    maximumFractionDigits: 0,
                  })}
                </p>
                <p className="text-[12px] text-fg-muted mt-1">
                  = 1일 평균임금({result.dailyAverageWage.toLocaleString('ko-KR', {
                    maximumFractionDigits: 0,
                  })}원) × 30일 × (재직일수/365)
                </p>
              </div>

              {/* Calculation Breakdown */}
              <div className="border border-border rounded-xl bg-surface overflow-hidden">
                <div className="p-4">
                  <h3 className="text-[16px] font-semibold text-fg">계산 과정</h3>
                </div>
                <div className="px-4 pb-4 space-y-3 text-[13px]">
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-fg-secondary">입사일</span>
                    <span className="font-semibold text-fg">{result.startDate}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-fg-secondary">퇴사일</span>
                    <span className="font-semibold text-fg">{result.endDate}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-fg-secondary">재직일수</span>
                    <span className="font-semibold text-fg tabular-nums">
                      {result.employmentDays}일
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-fg-secondary">3개월 임금 기준액</span>
                    <span className="font-semibold text-fg tabular-nums">
                      {result.totalWagesBase.toLocaleString('ko-KR', {
                        maximumFractionDigits: 0,
                      })}원
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3">
                    <span className="text-fg-secondary font-semibold">퇴직금</span>
                    <span className="font-bold text-fg text-[16px] tabular-nums">
                      {result.severancePay.toLocaleString('ko-KR', {
                        maximumFractionDigits: 0,
                      })}원
                    </span>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="border border-border rounded-xl bg-bg-secondary p-5">
                <h3 className="text-[14px] font-semibold text-fg mb-3">팁</h3>
                <ul className="text-[13px] text-fg-secondary leading-relaxed space-y-1">
                  <li>· 퇴직금은 <strong>1년 이상 근무</strong>한 근로자에게만 지급됩니다.</li>
                  <li>
                    · 1일 평균임금은 최근 3개월 임금, 상여금, 연차수당을 포함하여 계산합니다.
                  </li>
                  <li>· 퇴직금 = 1일 평균임금 × 30일 × (재직일수/365)</li>
                  <li>
                    · 퇴직금에 대한 퇴직소득세는 근속연수공제 등 복잡한 공제 체계가 적용됩니다. 정확한 퇴직소득세는 국세청 홈택스에서 확인하세요.
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
