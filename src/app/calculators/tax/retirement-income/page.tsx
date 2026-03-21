'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function RetirementIncomeTaxCalculator() {
  const [retirementPay, setRetirementPay] = useState('');
  const [inputMode, setInputMode] = useState<'years' | 'dates'>('years');
  const [serviceYears, setServiceYears] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const calculateServiceYears = (): number => {
    if (inputMode === 'years') {
      return Math.max(1, Math.floor(parseFloat(serviceYears) || 0));
    }
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffMs = end.getTime() - start.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    const years = Math.ceil(diffDays / 365);
    return Math.max(1, years);
  };

  const getServiceYearsDeduction = (years: number): number => {
    if (years <= 5) return 1_000_000 * years;
    if (years <= 10) return 5_000_000 + 2_000_000 * (years - 5);
    if (years <= 20) return 15_000_000 + 2_500_000 * (years - 10);
    return 40_000_000 + 3_000_000 * (years - 20);
  };

  const getConvertedPayDeduction = (convertedPay: number): number => {
    if (convertedPay <= 0) return 0;
    if (convertedPay <= 8_000_000) return convertedPay;
    if (convertedPay <= 70_000_000) return 8_000_000 + (convertedPay - 8_000_000) * 0.6;
    if (convertedPay <= 100_000_000) return 45_200_000 + (convertedPay - 70_000_000) * 0.55;
    if (convertedPay <= 300_000_000) return 61_700_000 + (convertedPay - 100_000_000) * 0.45;
    return 151_700_000 + (convertedPay - 300_000_000) * 0.35;
  };

  const getIncomeTax = (taxBase: number): number => {
    if (taxBase <= 0) return 0;
    if (taxBase <= 14_000_000) return taxBase * 0.06;
    if (taxBase <= 50_000_000) return 840_000 + (taxBase - 14_000_000) * 0.15;
    if (taxBase <= 88_000_000) return 6_240_000 + (taxBase - 50_000_000) * 0.24;
    if (taxBase <= 150_000_000) return 15_360_000 + (taxBase - 88_000_000) * 0.35;
    if (taxBase <= 300_000_000) return 37_060_000 + (taxBase - 150_000_000) * 0.38;
    if (taxBase <= 500_000_000) return 94_060_000 + (taxBase - 300_000_000) * 0.40;
    if (taxBase <= 1_000_000_000) return 174_060_000 + (taxBase - 500_000_000) * 0.42;
    return 384_060_000 + (taxBase - 1_000_000_000) * 0.45;
  };

  const handleCalculate = () => {
    const pay = parseFloat(retirementPay) || 0;
    const years = calculateServiceYears();

    if (pay <= 0) {
      alert('퇴직급여액을 입력해주세요.');
      return;
    }
    if (years <= 0) {
      alert(inputMode === 'years' ? '근속연수를 입력해주세요.' : '입사일과 퇴사일을 입력해주세요.');
      return;
    }

    // 1. 근속연수공제
    const serviceDeduction = getServiceYearsDeduction(years);

    // 2. 환산급여
    const convertedPay = Math.max(0, (pay - serviceDeduction) * 12 / years);

    // 3. 환산급여공제
    const convertedPayDeduction = getConvertedPayDeduction(convertedPay);

    // 4. 과세표준
    const taxBase = Math.max(0, convertedPay - convertedPayDeduction);

    // 5. 환산산출세액
    const convertedTax = getIncomeTax(taxBase);

    // 6. 퇴직소득 산출세액
    const retirementTax = Math.max(0, convertedTax * years / 12);

    // 7. 지방소득세
    const localTax = retirementTax * 0.1;

    // 8. 총 세금 & 실수령액
    const totalTax = retirementTax + localTax;
    const netAmount = pay - totalTax;

    setResults({
      retirementPay: pay,
      serviceYears: years,
      serviceDeduction,
      convertedPay,
      convertedPayDeduction,
      taxBase,
      retirementTax,
      localTax,
      totalTax,
      netAmount,
    });
  };

  return (
    <div className="mx-auto max-w-[1200px] px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-fg-muted mb-8">
        <Link href="/" className="hover:text-fg transition-colors">홈</Link>
        <ChevronRight size={12} />
        <span className="text-fg-secondary">세금</span>
        <ChevronRight size={12} />
        <span className="text-fg font-medium">퇴직소득세 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">퇴직소득세 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        퇴직금 수령 시 발생하는 퇴직소득세를 계산합니다. 근속연수공제, 환산급여공제를 반영한 정확한 세액을 산출합니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 퇴직급여액 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              퇴직급여액 (원) *
            </label>
            <input
              type="number"
              value={retirementPay}
              onChange={(e) => setRetirementPay(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              퇴직 시 수령하는 퇴직금 총액
            </p>
          </div>

          {/* 입력 방식 선택 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              근속연수 입력 방식
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'years' as const, label: '직접 입력' },
                { val: 'dates' as const, label: '입사일/퇴사일' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setInputMode(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    inputMode === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 근속연수 직접 입력 */}
          {inputMode === 'years' && (
            <div className="mb-6">
              <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                근속연수 (년) *
              </label>
              <input
                type="number"
                value={serviceYears}
                onChange={(e) => setServiceYears(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                placeholder="0"
                min="1"
              />
              <p className="text-[12px] text-fg-muted mt-1.5">
                1년 미만은 1년으로 계산됩니다
              </p>
            </div>
          )}

          {/* 입사일/퇴사일 */}
          {inputMode === 'dates' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                  입사일 *
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                  퇴사일 *
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                />
              </div>
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
            <span className="text-[13px] text-fg-secondary">퇴직급여액</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.retirementPay)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">근속연수</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.serviceYears}년
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">근속연수공제</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.serviceDeduction)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">환산급여</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.convertedPay)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">환산급여공제</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.convertedPayDeduction)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">과세표준</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.taxBase)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">퇴직소득세</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.retirementTax)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">지방소득세 (10%)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.localTax)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">총 세금</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.totalTax)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">실수령액</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {formatNumber(results.netAmount)}원
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 근속연수가 길수록 근속연수공제가 커져 세금이 줄어듭니다.</li>
          <li>· 퇴직소득세는 분류과세로, 다른 소득과 합산되지 않습니다.</li>
          <li>· 퇴직금을 IRP(개인형 퇴직연금)로 이체하면 퇴직소득세가 이연됩니다.</li>
          <li>· 실제 세액은 비과세 퇴직소득, 이연퇴직소득세 등에 따라 달라질 수 있습니다.</li>
        </ul>
      </div>
    </div>
  );
}
