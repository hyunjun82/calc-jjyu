'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function HealthInsuranceCalculator() {
  const [insureeType, setInsureeType] = useState('employee');
  const [monthlySalary, setMonthlySalary] = useState('');
  const [annualIncome, setAnnualIncome] = useState('');
  const [property, setProperty] = useState('');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const handleCalculate = () => {
    let healthInsurance = 0;
    let longTermCare = 0;

    if (insureeType === 'employee') {
      const salary = parseFloat(monthlySalary) || 0;
      if (salary <= 0) {
        alert('월 보수액을 입력해주세요.');
        return;
      }
      healthInsurance = salary * 0.03545;
      longTermCare = healthInsurance * 0.1295;
    } else {
      const income = parseFloat(annualIncome) || 0;
      if (income <= 0) {
        alert('연소득을 입력해주세요.');
        return;
      }
      const monthlyIncome = income / 12;
      const incomeInsurance = monthlyIncome * 0.0709;
      const prop = parseFloat(property) || 0;
      const propertyInsurance = prop > 0 ? (prop * 0.04) / 12 * 0.01 : 0;
      healthInsurance = incomeInsurance + propertyInsurance;
      longTermCare = healthInsurance * 0.1295;
    }

    const totalMonthly = healthInsurance + longTermCare;

    setResults({
      healthInsurance,
      longTermCare,
      totalMonthly,
      totalAnnual: totalMonthly * 12,
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
        <span className="text-fg font-medium">건강보험료 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">건강보험료 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        직장가입자와 지역가입자의 건강보험료 및 장기요양보험료를 계산합니다. 2024년 기준 요율이 적용됩니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 가입자 유형 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              가입자 유형
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'employee', label: '직장가입자' },
                { val: 'regional', label: '지역가입자' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setInsureeType(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    insureeType === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {insureeType === 'employee' ? (
            <div className="mb-6">
              <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                월 보수액 (원) *
              </label>
              <input
                type="number"
                value={monthlySalary}
                onChange={(e) => setMonthlySalary(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                placeholder="0"
              />
              <p className="text-[12px] text-fg-muted mt-1.5">
                세전 월 급여 (비과세 수당 제외)
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                  연소득 (원) *
                </label>
                <input
                  type="number"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                  placeholder="0"
                />
                <p className="text-[12px] text-fg-muted mt-1.5">
                  사업소득, 이자/배당소득, 연금소득 등 합산
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                  재산 과세표준 (원, 선택)
                </label>
                <input
                  type="number"
                  value={property}
                  onChange={(e) => setProperty(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                  placeholder="0"
                />
                <p className="text-[12px] text-fg-muted mt-1.5">
                  부동산, 전월세 등 재산 과세표준 합계
                </p>
              </div>
            </>
          )}

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
            <span className="text-[13px] text-fg-secondary">건강보험료</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.healthInsurance)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">장기요양보험료 (건강보험료의 12.95%)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.longTermCare)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">연간 총 납부액</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.totalAnnual)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">월 총 납부액</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {formatNumber(results.totalMonthly)}원
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 직장가입자 건강보험료율은 2024년 기준 7.09%(근로자 3.545% + 사업주 3.545%)입니다.</li>
          <li>· 장기요양보험료는 건강보험료의 12.95%가 추가로 부과됩니다.</li>
          <li>· 지역가입자는 소득, 재산, 자동차 등을 종합하여 보험료가 산정됩니다.</li>
          <li>· 본 계산기는 간편 계산으로, 실제 보험료와 차이가 있을 수 있습니다.</li>
        </ul>
      </div>
    </div>
  );
}
