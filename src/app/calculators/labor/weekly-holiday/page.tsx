'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function WeeklyHolidayPayCalculator() {
  const [hourlyWage, setHourlyWage] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState('40');
  const [daysPerWeek, setDaysPerWeek] = useState('5');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const handleCalculate = () => {
    const wage = parseFloat(hourlyWage) || 0;
    const hours = parseFloat(hoursPerWeek) || 0;
    const days = parseFloat(daysPerWeek) || 0;

    if (wage <= 0 || hours <= 0 || days <= 0) {
      alert('시급, 근무시간, 근무일수를 입력해주세요.');
      return;
    }

    const isEligible = hours >= 15;
    const dailyWorkHours = hours / days;
    const weeklyHolidayPay = isEligible ? dailyWorkHours * wage : 0;
    const monthlyHolidayPay = weeklyHolidayPay * (365 / 7 / 12);
    const effectiveHourlyWage = isEligible
      ? wage * (hours + dailyWorkHours) / hours
      : wage;

    setResults({
      isEligible,
      dailyWorkHours,
      weeklyHolidayPay,
      monthlyHolidayPay,
      effectiveHourlyWage,
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
        <span className="text-fg font-medium">주휴수당 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">주휴수당 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        주 15시간 이상 근무하고 개근한 경우 지급되는 주휴수당을 계산합니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 시급 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              시급 (원) *
            </label>
            <input
              type="number"
              value={hourlyWage}
              onChange={(e) => setHourlyWage(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="10030"
            />
          </div>

          {/* 주당 근무시간 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              주당 근무시간 *
            </label>
            <input
              type="number"
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="40"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              주 15시간 이상 근무해야 주휴수당이 발생합니다
            </p>
          </div>

          {/* 주당 근무일수 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              주당 근무일수 *
            </label>
            <input
              type="number"
              value={daysPerWeek}
              onChange={(e) => setDaysPerWeek(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="5"
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
            <span className="text-[13px] text-fg-secondary">주휴수당 대상 여부</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.isEligible ? '대상 (주 15시간 이상)' : '비대상 (주 15시간 미만)'}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">1일 소정근로시간</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.dailyWorkHours.toFixed(1)}시간
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">주휴수당 (주)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.weeklyHolidayPay)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">월 환산 주휴수당</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.monthlyHolidayPay)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">주휴수당 포함 실질시급</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {formatNumber(results.effectiveHourlyWage)}원
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 주휴수당은 주 15시간 이상 근무하고 개근한 경우에 발생합니다.</li>
          <li>· 주휴수당 = 1일 소정근로시간 x 시급</li>
          <li>· 1일 소정근로시간 = 주당 근로시간 / 주당 근무일수</li>
          <li>· 주 40시간, 5일 근무 시 주휴수당은 8시간 x 시급입니다.</li>
        </ul>
      </div>
    </div>
  );
}
