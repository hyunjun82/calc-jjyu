'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function OvertimeCalculator() {
  const [wageType, setWageType] = useState('hourly');
  const [wageAmount, setWageAmount] = useState('');
  const [overtimeHours, setOvertimeHours] = useState('');
  const [nightHours, setNightHours] = useState('');
  const [holidayHours, setHolidayHours] = useState('');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const handleCalculate = () => {
    const wage = parseFloat(wageAmount) || 0;
    const overtime = parseFloat(overtimeHours) || 0;
    const night = parseFloat(nightHours) || 0;
    const holiday = parseFloat(holidayHours) || 0;

    if (wage <= 0) {
      alert('임금을 입력해주세요.');
      return;
    }

    // 통상시급 계산
    const hourlyWage = wageType === 'hourly' ? wage : wage / 209;

    // 연장근로수당 (주40시간 초과): 통상시급 x 1.5
    const overtimePay = hourlyWage * 1.5 * overtime;

    // 야간근로수당 (22시~06시): 통상시급 x 0.5 가산 (기본급 별도이므로 0.5만 가산)
    const nightPay = hourlyWage * 1.5 * night;

    // 휴일근로수당: 8시간 이내 1.5배, 8시간 초과 2.0배
    const holidayWithin8 = Math.min(holiday, 8);
    const holidayOver8 = Math.max(holiday - 8, 0);
    const holidayPay = hourlyWage * 1.5 * holidayWithin8 + hourlyWage * 2.0 * holidayOver8;

    const totalExtra = overtimePay + nightPay + holidayPay;

    setResults({
      hourlyWage,
      overtimePay,
      nightPay,
      holidayPay,
      totalExtra,
      overtimeHours: overtime,
      nightHours: night,
      holidayHours: holiday,
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
        <span className="text-fg font-medium">야근수당 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">야근수당 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        연장근로, 야간근로, 휴일근로에 따른 추가 수당을 계산합니다. 근로기준법에 따른 가산율이 적용됩니다.
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
                { val: 'hourly', label: '시급으로 입력' },
                { val: 'monthly', label: '월급으로 입력' },
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
              {wageType === 'hourly' ? '통상시급' : '월 통상임금'} (원) *
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
                월급 / 209시간으로 시급 환산
              </p>
            )}
          </div>

          {/* 연장근로 시간 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              연장근로 시간 (주 40시간 초과분)
            </label>
            <input
              type="number"
              value={overtimeHours}
              onChange={(e) => setOvertimeHours(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              통상시급의 150% 적용
            </p>
          </div>

          {/* 야간근로 시간 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              야간근로 시간 (22시~06시)
            </label>
            <input
              type="number"
              value={nightHours}
              onChange={(e) => setNightHours(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              통상시급의 150% 적용 (야간가산)
            </p>
          </div>

          {/* 휴일근로 시간 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              휴일근로 시간
            </label>
            <input
              type="number"
              value={holidayHours}
              onChange={(e) => setHolidayHours(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              8시간 이내 150%, 8시간 초과 200% 적용
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
            <span className="text-[13px] text-fg-secondary">통상시급</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.hourlyWage)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">연장근로수당 ({results.overtimeHours}시간 x 150%)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.overtimePay)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">야간근로수당 ({results.nightHours}시간 x 150%)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.nightPay)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">휴일근로수당 ({results.holidayHours}시간)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.holidayPay)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">총 추가수당</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {formatNumber(results.totalExtra)}원
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 연장근로: 주 40시간을 초과하는 근로시간에 대해 통상시급의 150%를 지급합니다.</li>
          <li>· 야간근로: 22시부터 06시 사이 근로에 대해 통상시급의 150%를 지급합니다.</li>
          <li>· 휴일근로: 8시간 이내는 150%, 8시간 초과는 200%가 적용됩니다.</li>
          <li>· 야간 + 연장 근로가 중복되면 통상시급의 200%가 적용될 수 있습니다.</li>
        </ul>
      </div>
    </div>
  );
}
