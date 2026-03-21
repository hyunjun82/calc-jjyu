'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function UnemploymentBenefitCalculator() {
  const [age, setAge] = useState('');
  const [insurancePeriod, setInsurancePeriod] = useState('under1');
  const [ageGroup, setAgeGroup] = useState('under50');
  const [totalSalary3Months, setTotalSalary3Months] = useState('');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const getBenefitDays = (group: string, period: string): number => {
    if (group === 'under50') {
      switch (period) {
        case 'under1': return 120;
        case '1to3': return 150;
        case '3to5': return 180;
        case '5to10': return 210;
        case 'over10': return 240;
        default: return 120;
      }
    } else {
      // 50세 이상 또는 장애인
      switch (period) {
        case 'under1': return 120;
        case '1to3': return 180;
        case '3to5': return 210;
        case '5to10': return 240;
        case 'over10': return 270;
        default: return 120;
      }
    }
  };

  const handleCalculate = () => {
    const salary = parseFloat(totalSalary3Months) || 0;

    if (salary <= 0) {
      alert('퇴직 전 3개월 급여 합계를 입력해주세요.');
      return;
    }

    const avgDailyWage = salary / 90; // 3개월 = 약 90일
    const dailyBenefit = avgDailyWage * 0.6;

    // 상한/하한 적용
    const upperLimit = 66000;
    const lowerLimit = 64192; // 2025년: 최저임금 80% x 8시간

    const adjustedDailyBenefit = Math.min(Math.max(dailyBenefit, lowerLimit), upperLimit);
    const benefitDays = getBenefitDays(ageGroup, insurancePeriod);
    const totalBenefit = adjustedDailyBenefit * benefitDays;

    setResults({
      avgDailyWage,
      rawDailyBenefit: dailyBenefit,
      dailyBenefit: adjustedDailyBenefit,
      benefitDays,
      totalBenefit,
      isUpperLimited: dailyBenefit > upperLimit,
      isLowerLimited: dailyBenefit < lowerLimit,
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
        <span className="text-fg font-medium">실업급여 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">실업급여 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        비자발적 퇴사 시 받을 수 있는 실업급여(구직급여)를 계산합니다. 나이와 고용보험 가입기간에 따라 수급 기간이 달라집니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 나이 구분 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              퇴직 시 나이
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'under50', label: '50세 미만' },
                { val: 'over50', label: '50세 이상 / 장애인' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAgeGroup(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    ageGroup === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 고용보험 가입기간 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              고용보험 가입기간
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'under1', label: '1년 미만' },
                { val: '1to3', label: '1~3년' },
                { val: '3to5', label: '3~5년' },
                { val: '5to10', label: '5~10년' },
                { val: 'over10', label: '10년 이상' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setInsurancePeriod(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    insurancePeriod === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 퇴직전 3개월 급여 합계 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              퇴직 전 3개월 급여 합계 (원) *
            </label>
            <input
              type="number"
              value={totalSalary3Months}
              onChange={(e) => setTotalSalary3Months(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              세전 급여 기준, 최근 3개월간 받은 총 급여
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
            <span className="text-[13px] text-fg-secondary">평균 일급 (3개월 평균)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.avgDailyWage)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">
              1일 수급액 (60%)
              {results.isUpperLimited ? ' - 상한 적용' : results.isLowerLimited ? ' - 하한 적용' : ''}
            </span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.dailyBenefit)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">수급 기간</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.benefitDays}일
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">총 수급액</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {formatNumber(results.totalBenefit)}원
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 실업급여는 비자발적 퇴사(권고사직, 계약만료 등)인 경우에만 수급 가능합니다.</li>
          <li>· 고용보험에 180일 이상 가입되어 있어야 합니다.</li>
          <li>· 1일 수급액 상한: 66,000원, 하한: 64,192원 (2025년 기준)</li>
          <li>· 50세 이상이거나 장애인인 경우 수급 기간이 더 길어집니다.</li>
        </ul>
      </div>
    </div>
  );
}
