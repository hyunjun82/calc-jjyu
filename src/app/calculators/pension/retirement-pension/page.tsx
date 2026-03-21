'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function RetirementPensionCalculator() {
  const [pensionType, setPensionType] = useState('DC');
  const [annualSalary, setAnnualSalary] = useState('');
  const [serviceYears, setServiceYears] = useState('');
  const [returnRate, setReturnRate] = useState('');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const handleCalculate = () => {
    const salary = parseFloat(annualSalary) || 0;
    const years = parseFloat(serviceYears) || 0;
    const rate = (parseFloat(returnRate) || 0) / 100;

    if (salary <= 0) {
      alert('연봉(또는 월급)을 입력해주세요.');
      return;
    }
    if (years <= 0) {
      alert('근속 예상기간을 입력해주세요.');
      return;
    }

    let totalAccumulated = 0;

    if (pensionType === 'DC') {
      // DC형: 매년 연봉/12 적립, 복리 운용
      const annualContribution = salary / 12;
      for (let i = 0; i < years; i++) {
        totalAccumulated = (totalAccumulated + annualContribution) * (1 + rate);
      }
    } else {
      // DB형: 퇴직 시 평균임금 × 30일 × 근속년수
      const monthlySalary = salary / 12;
      totalAccumulated = monthlySalary * years;
    }

    // 20년 수령 기준 월 연금액
    const monthlyPension = totalAccumulated / (20 * 12);

    setResults({
      totalAccumulated,
      monthlyPension,
      annualPension: monthlyPension * 12,
      pensionType,
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
        <span className="text-fg font-medium">퇴직연금 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">퇴직연금 수령액 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        DC형(확정기여형)과 DB형(확정급여형) 퇴직연금의 예상 수령액을 계산합니다. 운용수익률에 따른 적립금을 확인하세요.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 연금유형 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              퇴직연금 유형
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'DC', label: 'DC형 (확정기여)' },
                { val: 'DB', label: 'DB형 (확정급여)' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setPensionType(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    pensionType === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 연봉 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              연봉 (원) *
            </label>
            <input
              type="number"
              value={annualSalary}
              onChange={(e) => setAnnualSalary(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              {pensionType === 'DC' ? '매년 연봉의 1/12이 적립됩니다' : '퇴직 시 평균임금 기준으로 산정됩니다'}
            </p>
          </div>

          {/* 근속기간 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              근속 예상기간 (년) *
            </label>
            <input
              type="number"
              value={serviceYears}
              onChange={(e) => setServiceYears(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="20"
            />
          </div>

          {/* 운용수익률 (DC형만) */}
          {pensionType === 'DC' && (
            <div className="mb-6">
              <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                예상 운용수익률 (%) *
              </label>
              <input
                type="number"
                value={returnRate}
                onChange={(e) => setReturnRate(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                placeholder="3"
              />
              <p className="text-[12px] text-fg-muted mt-1.5">
                연평균 운용수익률 (복리 적용)
              </p>
            </div>
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
            <span className="text-[13px] text-fg-secondary">연금 유형</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.pensionType === 'DC' ? 'DC형 (확정기여)' : 'DB형 (확정급여)'}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">총 적립 예상액</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.totalAccumulated)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">연간 연금수령액 (20년 기준)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.annualPension)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">월 연금수령액 (20년 기준)</span>
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
          <li>· DC형은 매년 연봉의 1/12이 적립되며, 근로자가 직접 운용합니다.</li>
          <li>· DB형은 퇴직 시 평균임금 x 근속년수로 퇴직급여가 확정됩니다.</li>
          <li>· IRP(개인형 퇴직연금)에 추가 납입하면 세액공제 혜택을 받을 수 있습니다.</li>
          <li>· 퇴직연금을 연금으로 수령하면 퇴직소득세의 60~70%만 과세됩니다.</li>
        </ul>
      </div>
    </div>
  );
}
