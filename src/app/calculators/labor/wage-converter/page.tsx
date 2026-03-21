'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function WageConverterCalculator() {
  const [conversionType, setConversionType] = useState('hourly');
  const [amount, setAmount] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState('40');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const handleCalculate = () => {
    const value = parseFloat(amount) || 0;
    const weeklyHours = parseFloat(hoursPerWeek) || 40;

    if (value <= 0) {
      alert('금액을 입력해주세요.');
      return;
    }

    const dailyHours = weeklyHours / 5;
    const weeklyHolidayHours = weeklyHours >= 15 ? dailyHours : 0;
    const totalWeeklyHours = weeklyHours + weeklyHolidayHours;
    const monthlyHours = totalWeeklyHours * (365 / 7 / 12);

    let hourly = 0;

    if (conversionType === 'hourly') {
      hourly = value;
    } else if (conversionType === 'monthly') {
      hourly = value / monthlyHours;
    } else if (conversionType === 'annual') {
      hourly = value / 12 / monthlyHours;
    }

    const daily = hourly * dailyHours;
    const weekly = hourly * weeklyHours + hourly * weeklyHolidayHours;
    const monthly = hourly * monthlyHours;
    const annual = monthly * 12;

    setResults({
      hourly,
      daily,
      weekly,
      monthly,
      annual,
      monthlyHours,
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
        <span className="text-fg font-medium">시급/월급 변환 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">시급/월급 변환 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        시급, 월급, 연봉을 상호 변환합니다. 주당 근무시간에 따라 정확한 환산이 가능합니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 변환 방향 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              입력 기준 선택
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'hourly', label: '시급 기준' },
                { val: 'monthly', label: '월급 기준' },
                { val: 'annual', label: '연봉 기준' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setConversionType(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    conversionType === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 금액 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              {conversionType === 'hourly' ? '시급' : conversionType === 'monthly' ? '월급' : '연봉'} (원) *
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
          </div>

          {/* 주당 근무시간 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              주당 근무시간
            </label>
            <input
              type="number"
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="40"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              기본 주 40시간 (주휴수당 포함 기준 209시간/월)
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
            <span className="text-[13px] text-fg-secondary">시급</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.hourly)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">일급 (8시간 기준)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.daily)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">주급 (주휴수당 포함)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.weekly)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">월급</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.monthly)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">월 소정근로시간 (주휴 포함)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.monthlyHours.toFixed(1)}시간
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">연봉</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {formatNumber(results.annual)}원
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 시급에서 월급 변환: 시급 x 209시간 (주 40시간 기준)</li>
          <li>· 월급에서 시급 변환: 월급 / 209시간</li>
          <li>· 연봉에서 월급 변환: 연봉 / 12개월</li>
          <li>· 209시간은 주휴수당이 포함된 월 소정근로시간입니다.</li>
        </ul>
      </div>
    </div>
  );
}
