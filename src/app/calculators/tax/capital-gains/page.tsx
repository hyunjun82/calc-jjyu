'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function CapitalGainsTaxCalculator() {
  const [householdCount, setHouseholdCount] = useState('1');
  const [isAdjustedArea, setIsAdjustedArea] = useState('no');
  const [acquisitionDate, setAcquisitionDate] = useState('');
  const [disposalDate, setDisposalDate] = useState('');
  const [isResiding, setIsResiding] = useState('yes');
  const [residingYears, setResidingYears] = useState(0);
  const [disposalAmount, setDisposalAmount] = useState('');
  const [acquisitionAmount, setAcquisitionAmount] = useState('');
  const [necessaryExpenses, setNecessaryExpenses] = useState('');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const calculateHoldingYears = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return Math.floor(diffDays / 365.25);
  };

  const calculateLongTermHoldingDiscount = (
    holdingYears: number,
    residingYears: number,
    isSingleHouse: boolean,
    isAdjusted: boolean
  ): number => {
    if (isSingleHouse && !isAdjusted) {
      // 1세대1주택: 보유 연 4% + 거주 연 4% (최대 80%)
      const holdingDiscount = Math.min(holdingYears * 4, 40);
      const residingDiscount = isResiding === 'yes' ? Math.min(residingYears * 4, 40) : 0;
      return Math.min(holdingDiscount + residingDiscount, 80);
    }

    if (isAdjusted) {
      // 조정지역: 장기보유특별공제 없음
      return 0;
    }

    // 일반: 3년이상 6%, 매년 2%p 추가 (최대 30%)
    if (holdingYears >= 3) {
      return Math.min(6 + (holdingYears - 3) * 2, 30);
    }
    return 0;
  };

  const getProgressiveTaxDeduction = (taxableIncome: number): number => {
    if (taxableIncome <= 14000000) return 0;
    if (taxableIncome <= 50000000) return 1260000;
    if (taxableIncome <= 88000000) return 5760000;
    if (taxableIncome <= 150000000) return 15440000;
    if (taxableIncome <= 300000000) return 19940000;
    if (taxableIncome <= 500000000) return 25940000;
    if (taxableIncome <= 1000000000) return 35940000;
    return 65940000;
  };

  const getTaxRate = (taxableIncome: number): number => {
    if (taxableIncome <= 14000000) return 0.06;
    if (taxableIncome <= 50000000) return 0.15;
    if (taxableIncome <= 88000000) return 0.24;
    if (taxableIncome <= 150000000) return 0.35;
    if (taxableIncome <= 300000000) return 0.38;
    if (taxableIncome <= 500000000) return 0.40;
    if (taxableIncome <= 1000000000) return 0.42;
    return 0.45;
  };

  const handleCalculate = () => {
    const disposal = parseFloat(disposalAmount) || 0;
    const acquisition = parseFloat(acquisitionAmount) || 0;
    const expenses = parseFloat(necessaryExpenses) || 0;

    if (!disposalDate || !acquisitionDate) {
      alert('취득일자와 양도일자를 입력해주세요.');
      return;
    }

    const holdingYears = calculateHoldingYears(acquisitionDate, disposalDate);
    const capitalGain = disposal - acquisition - expenses;

    if (capitalGain <= 0) {
      alert('양도차익이 0 이상이어야 합니다.');
      return;
    }

    const isSingleHouse = householdCount === '1';
    const discountRate = calculateLongTermHoldingDiscount(
      holdingYears,
      residingYears,
      isSingleHouse,
      isAdjustedArea === 'yes'
    );
    const longTermDiscount = capitalGain * (discountRate / 100);

    const basicDeduction = 2500000;
    let taxableIncome = capitalGain - longTermDiscount - basicDeduction;
    if (taxableIncome < 0) taxableIncome = 0;

    const baseTaxRate = getTaxRate(taxableIncome);
    const progressiveDeduction = getProgressiveTaxDeduction(taxableIncome);
    let calculatedTax = taxableIncome * baseTaxRate - progressiveDeduction;

    // 중과세율 적용
    if (isAdjustedArea === 'yes') {
      if (householdCount === '2') {
        calculatedTax *= 1.2; // +20%p
      } else if (householdCount === '3') {
        calculatedTax *= 1.3; // +30%p
      }
    }

    const localTax = calculatedTax * 0.1;
    const totalTax = calculatedTax + localTax;

    setResults({
      capitalGain,
      longTermDiscount,
      taxableIncome,
      calculatedTax,
      localTax,
      totalTax,
      holdingYears,
      discountRate,
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
        <span className="text-fg font-medium">양도소득세 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">양도소득세 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        주택 양도 시 발생하는 양도소득세를 계산합니다. 보유기간, 거주여부 등에 따른 장기보유특별공제를 적용하여 정확한 세액을 산출합니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 주택수 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              주택수 선택
            </label>
            <div className="flex flex-wrap gap-2">
              {['1', '2', '3'].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setHouseholdCount(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    householdCount === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {val === '1' && '1주택'}
                  {val === '2' && '2주택'}
                  {val === '3' && '3주택 이상'}
                </button>
              ))}
            </div>
          </div>

          {/* 조정대상지역 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              조정대상지역 여부
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'no', label: '아니오' },
                { val: 'yes', label: '예' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setIsAdjustedArea(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    isAdjustedArea === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 취득일자 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              취득일자 *
            </label>
            <input
              type="date"
              value={acquisitionDate}
              onChange={(e) => setAcquisitionDate(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
            />
          </div>

          {/* 양도일자 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              양도일자 *
            </label>
            <input
              type="date"
              value={disposalDate}
              onChange={(e) => setDisposalDate(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
            />
          </div>

          {/* 거주여부 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              거주여부
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'yes', label: '예' },
                { val: 'no', label: '아니오' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setIsResiding(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    isResiding === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 거주기간 */}
          {isResiding === 'yes' && (
            <div className="mb-6">
              <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                거주기간 (년)
              </label>
              <input
                type="number"
                value={residingYears}
                onChange={(e) => setResidingYears(parseInt(e.target.value) || 0)}
                className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                min="0"
              />
            </div>
          )}

          {/* 양도가액 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              양도가액 (원) *
            </label>
            <input
              type="number"
              value={disposalAmount}
              onChange={(e) => setDisposalAmount(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
          </div>

          {/* 취득가액 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              취득가액 (원) *
            </label>
            <input
              type="number"
              value={acquisitionAmount}
              onChange={(e) => setAcquisitionAmount(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
          </div>

          {/* 필요경비 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              필요경비 (원)
            </label>
            <input
              type="number"
              value={necessaryExpenses}
              onChange={(e) => setNecessaryExpenses(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
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
            <span className="text-[13px] text-fg-secondary">보유기간</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.holdingYears}년
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">양도차익</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.capitalGain)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">장기보유특별공제 ({results.discountRate}%)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.longTermDiscount)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">기본공제</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">2,500,000원</span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">과세표준</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.taxableIncome)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">산출세액</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.calculatedTax)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">지방소득세 (10%)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.localTax)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">총 납부세액</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {formatNumber(results.totalTax)}원
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 1주택은 장기보유특별공제율이 높아 세부담이 낮을 수 있습니다.</li>
          <li>· 조정대상지역의 2주택·3주택은 중과세율이 적용됩니다.</li>
          <li>· 거주기간이 길수록 1주택의 공제율이 높아집니다.</li>
          <li>· 필요경비는 중개수수료, 등기료 등을 포함할 수 있습니다.</li>
        </ul>
      </div>
    </div>
  );
}
