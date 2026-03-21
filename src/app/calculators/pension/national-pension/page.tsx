'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function NationalPensionCalculator() {
  const [inputType, setInputType] = useState('salary');
  const [monthlySalary, setMonthlySalary] = useState('');
  const [monthlyPremium, setMonthlyPremium] = useState('');
  const [enrollmentYears, setEnrollmentYears] = useState('');
  const [startAge, setStartAge] = useState('65');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const handleCalculate = () => {
    const years = parseFloat(enrollmentYears) || 0;
    if (years <= 0) {
      alert('가입기간을 입력해주세요.');
      return;
    }

    let monthlyIncome = 0;
    let premium = 0;

    if (inputType === 'salary') {
      monthlyIncome = parseFloat(monthlySalary) || 0;
      if (monthlyIncome <= 0) {
        alert('월소득을 입력해주세요.');
        return;
      }
      premium = monthlyIncome * 0.045;
    } else {
      premium = parseFloat(monthlyPremium) || 0;
      if (premium <= 0) {
        alert('월 보험료를 입력해주세요.');
        return;
      }
      monthlyIncome = premium / 0.045;
    }

    const A = 2860000;
    const B = monthlyIncome;
    const totalMonths = years * 12;
    const overMonths = totalMonths > 240 ? totalMonths - 240 : 0;

    const basicPension = 1.2 * (A + B) * (1 + 0.05 * overMonths / 12);
    const monthlyPension = basicPension * (years / 40);

    const totalPaid = premium * totalMonths;
    const age = parseInt(startAge) || 65;
    const expectedReceiveYears = 85 - age;
    const totalReceive = monthlyPension * 12 * expectedReceiveYears;
    const returnRate = totalPaid > 0 ? ((totalReceive - totalPaid) / totalPaid) * 100 : 0;

    setResults({
      monthlyPension,
      annualPension: monthlyPension * 12,
      totalPaid,
      totalReceive,
      returnRate,
      premium,
    });
  };

  return (
    <div className="mx-auto max-w-[1200px] px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-fg-muted mb-8">
        <Link href="/" className="hover:text-fg transition-colors">홈</Link>
        <ChevronRight size={12} />
        <span className="text-fg-secondary">연금/보험</span>
        <ChevronRight size={12} />
        <span className="text-fg font-medium">국민연금 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">국민연금 예상수령액 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        국민연금 가입기간과 소득을 기반으로 예상 수령액을 계산합니다. 보험료율은 9%(근로자 4.5% + 사업주 4.5%)가 적용됩니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 입력 방식 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              입력 방식
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'salary', label: '월소득 기준' },
                { val: 'premium', label: '월 보험료 기준' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setInputType(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    inputType === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 월소득 or 보험료 */}
          {inputType === 'salary' ? (
            <div className="mb-6">
              <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                현재 월소득 (원) *
              </label>
              <input
                type="number"
                value={monthlySalary}
                onChange={(e) => setMonthlySalary(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                placeholder="0"
              />
              <p className="text-[12px] text-fg-muted mt-1.5">
                세전 월급여 기준 (기준소득월액)
              </p>
            </div>
          ) : (
            <div className="mb-6">
              <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                월 납부 보험료 (원) *
              </label>
              <input
                type="number"
                value={monthlyPremium}
                onChange={(e) => setMonthlyPremium(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                placeholder="0"
              />
              <p className="text-[12px] text-fg-muted mt-1.5">
                근로자 본인 부담분 (4.5%)
              </p>
            </div>
          )}

          {/* 가입기간 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              가입기간 (년) *
            </label>
            <input
              type="number"
              value={enrollmentYears}
              onChange={(e) => setEnrollmentYears(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="20"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              최소 10년 이상 가입해야 연금 수령 가능
            </p>
          </div>

          {/* 수령개시 나이 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              수령개시 나이
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: '60', label: '60세 (조기수령)' },
                { val: '65', label: '65세 (정상)' },
                { val: '70', label: '70세 (연기수령)' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setStartAge(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    startAge === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
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
            <span className="text-[13px] text-fg-secondary">월 납부 보험료 (본인 부담)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.premium)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">총 납부액</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.totalPaid)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">연간 예상연금액</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.annualPension)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">납부 대비 수익률</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.returnRate.toFixed(1)}%
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">월 예상연금액</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {formatNumber(results.monthlyPension)}원
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 국민연금은 최소 10년(120개월) 이상 가입해야 노령연금을 수령할 수 있습니다.</li>
          <li>· 10년 가입 시 월 약 20~30만원, 20년 시 약 50~70만원, 30년 시 약 80~120만원 수준입니다.</li>
          <li>· 조기수령(60세) 시 매년 6%씩 감액, 연기수령(최대 70세) 시 매년 7.2%씩 증액됩니다.</li>
          <li>· 2024년 기준 A값(전체가입자 평균소득월액)은 약 286만원입니다.</li>
        </ul>
      </div>
    </div>
  );
}
