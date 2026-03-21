'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function FourInsuranceCalculator() {
  const [monthlySalary, setMonthlySalary] = useState('');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const handleCalculate = () => {
    const salary = parseFloat(monthlySalary) || 0;
    if (salary <= 0) {
      alert('월 보수액을 입력해주세요.');
      return;
    }

    // 국민연금 기준소득월액 상한/하한 적용
    const pensionBase = Math.min(Math.max(salary, 370000), 5900000);
    const nationalPensionEmployee = pensionBase * 0.045;
    const nationalPensionEmployer = pensionBase * 0.045;

    // 건강보험
    const healthInsuranceEmployee = salary * 0.03545;
    const healthInsuranceEmployer = salary * 0.03545;

    // 장기요양보험
    const longTermCareEmployee = healthInsuranceEmployee * 0.1295;
    const longTermCareEmployer = healthInsuranceEmployer * 0.1295;

    // 고용보험
    const employmentInsuranceEmployee = salary * 0.009;
    const employmentInsuranceEmployer = salary * 0.009;

    // 산재보험 (사업주만, 평균 약 1.4% 참고)
    const industrialAccidentEmployer = salary * 0.014;

    const totalEmployee = nationalPensionEmployee + healthInsuranceEmployee + longTermCareEmployee + employmentInsuranceEmployee;
    const totalEmployer = nationalPensionEmployer + healthInsuranceEmployer + longTermCareEmployer + employmentInsuranceEmployer + industrialAccidentEmployer;

    setResults({
      nationalPensionEmployee,
      nationalPensionEmployer,
      healthInsuranceEmployee,
      healthInsuranceEmployer,
      longTermCareEmployee,
      longTermCareEmployer,
      employmentInsuranceEmployee,
      employmentInsuranceEmployer,
      industrialAccidentEmployer,
      totalEmployee,
      totalEmployer,
      totalAll: totalEmployee + totalEmployer,
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
        <span className="text-fg font-medium">4대보험료 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">4대보험료 종합 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        국민연금, 건강보험, 고용보험, 산재보험 4대 사회보험료를 한번에 계산합니다. 근로자와 사업주 부담분을 구분하여 보여드립니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 월 보수액 */}
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

          {/* 항목별 표 */}
          <div className="mb-4">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-[13px] font-medium text-fg">구분</span>
              <div className="flex gap-8">
                <span className="text-[13px] font-medium text-fg w-24 text-right">근로자</span>
                <span className="text-[13px] font-medium text-fg w-24 text-right">사업주</span>
              </div>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-[13px] text-fg-secondary">국민연금 (4.5%)</span>
              <div className="flex gap-8">
                <span className="text-[14px] font-medium text-fg tabular-nums w-24 text-right">{formatNumber(results.nationalPensionEmployee)}원</span>
                <span className="text-[14px] font-medium text-fg tabular-nums w-24 text-right">{formatNumber(results.nationalPensionEmployer)}원</span>
              </div>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-[13px] text-fg-secondary">건강보험 (3.545%)</span>
              <div className="flex gap-8">
                <span className="text-[14px] font-medium text-fg tabular-nums w-24 text-right">{formatNumber(results.healthInsuranceEmployee)}원</span>
                <span className="text-[14px] font-medium text-fg tabular-nums w-24 text-right">{formatNumber(results.healthInsuranceEmployer)}원</span>
              </div>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-[13px] text-fg-secondary">장기요양 (12.95%)</span>
              <div className="flex gap-8">
                <span className="text-[14px] font-medium text-fg tabular-nums w-24 text-right">{formatNumber(results.longTermCareEmployee)}원</span>
                <span className="text-[14px] font-medium text-fg tabular-nums w-24 text-right">{formatNumber(results.longTermCareEmployer)}원</span>
              </div>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-[13px] text-fg-secondary">고용보험 (0.9%)</span>
              <div className="flex gap-8">
                <span className="text-[14px] font-medium text-fg tabular-nums w-24 text-right">{formatNumber(results.employmentInsuranceEmployee)}원</span>
                <span className="text-[14px] font-medium text-fg tabular-nums w-24 text-right">{formatNumber(results.employmentInsuranceEmployer)}원</span>
              </div>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-[13px] text-fg-secondary">산재보험 (약 1.4%, 참고)</span>
              <div className="flex gap-8">
                <span className="text-[14px] font-medium text-fg tabular-nums w-24 text-right">-</span>
                <span className="text-[14px] font-medium text-fg tabular-nums w-24 text-right">{formatNumber(results.industrialAccidentEmployer)}원</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">총 근로자 부담</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.totalEmployee)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">총 사업주 부담</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.totalEmployer)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">합계 (근로자 + 사업주)</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {formatNumber(results.totalAll)}원
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 국민연금 기준소득월액은 상한 590만원, 하한 37만원이 적용됩니다.</li>
          <li>· 건강보험료율은 2024년 기준 7.09%(근로자·사업주 각 3.545%)입니다.</li>
          <li>· 고용보험 실업급여 부분 근로자 부담분은 0.9%입니다.</li>
          <li>· 산재보험은 전액 사업주 부담이며 업종별로 요율이 다릅니다 (평균 약 1.4%).</li>
        </ul>
      </div>
    </div>
  );
}
