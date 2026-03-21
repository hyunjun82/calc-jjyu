'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function MaternityLeaveCalculator() {
  const [monthlyWage, setMonthlyWage] = useState('');
  const [companySize, setCompanySize] = useState('small');
  const [isMultiple, setIsMultiple] = useState('no');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const handleCalculate = () => {
    const wage = parseFloat(monthlyWage) || 0;

    if (wage <= 0) {
      alert('통상임금을 입력해주세요.');
      return;
    }

    const totalDays = isMultiple === 'yes' ? 120 : 90;
    const insuranceUpperLimit = 2100000; // 월 상한 210만원

    let employerPay = 0;
    let insurancePay = 0;

    if (companySize === 'small') {
      // 우선지원대상기업: 전체 기간 고용보험에서 지급
      const totalMonths = totalDays / 30;
      const monthlyInsurance = Math.min(wage, insuranceUpperLimit);
      insurancePay = monthlyInsurance * totalMonths;
      employerPay = 0;
    } else {
      // 대규모기업: 최초 60일 사업주, 나머지 고용보험
      const employerDays = 60;
      const insuranceDays = totalDays - employerDays;

      employerPay = wage * (employerDays / 30);
      const monthlyInsurance = Math.min(wage, insuranceUpperLimit);
      insurancePay = monthlyInsurance * (insuranceDays / 30);
    }

    const totalPay = employerPay + insurancePay;

    setResults({
      totalDays,
      employerPay,
      insurancePay,
      totalPay,
      companyType: companySize === 'small' ? '우선지원대상기업' : '대규모기업',
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
        <span className="text-fg font-medium">출산휴가 급여 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">출산휴가 급여 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        출산전후휴가 시 사업주 부담분과 고용보험 지급분을 계산합니다. 기업 규모와 다태아 여부에 따라 달라집니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 통상임금 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              통상임금 - 월 (원) *
            </label>
            <input
              type="number"
              value={monthlyWage}
              onChange={(e) => setMonthlyWage(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
          </div>

          {/* 기업 규모 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              기업 규모
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'small', label: '우선지원대상기업' },
                { val: 'large', label: '대규모기업' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setCompanySize(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    companySize === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 다태아 여부 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              다태아 여부
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'no', label: '단태아 (90일)' },
                { val: 'yes', label: '다태아 (120일)' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setIsMultiple(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    isMultiple === val
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
            <span className="text-[13px] text-fg-secondary">기업 유형</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.companyType}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">총 휴가일수</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.totalDays}일
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">사업주 부담분</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.employerPay)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">고용보험 지급분 (상한 월 210만원)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.insurancePay)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">총 수령액</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {formatNumber(results.totalPay)}원
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 출산전후휴가는 단태아 90일, 다태아 120일입니다.</li>
          <li>· 우선지원대상기업: 전체 기간 고용보험에서 지급 (상한 월 210만원)</li>
          <li>· 대규모기업: 최초 60일은 사업주 부담, 나머지 30일은 고용보험 지급</li>
          <li>· 고용보험 지급 상한은 월 210만원입니다.</li>
        </ul>
      </div>
    </div>
  );
}
