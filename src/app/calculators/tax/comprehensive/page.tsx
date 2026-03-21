'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { FormStep, FormProgress } from '@/components/FormStep';

export default function ComprehensiveRealPropertyTaxCalculator() {
  const [ownerType, setOwnerType] = useState('single');
  const [publicPrice, setPublicPrice] = useState('');
  const [isElderly, setIsElderly] = useState('no');
  const [elderlyAge, setElderlyAge] = useState('60');
  const [isLongTermHolder, setIsLongTermHolder] = useState('no');
  const [holdingYears, setHoldingYears] = useState('5');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const getComprehensiveTaxRate = (
    taxableStandard: number,
    type: string
  ): { rate: number; deduction: number } => {
    if (type === 'single') {
      // 1세대1주택
      if (taxableStandard <= 300000000) return { rate: 0.005, deduction: 0 };
      if (taxableStandard <= 600000000) return { rate: 0.007, deduction: 600000 };
      if (taxableStandard <= 1200000000) return { rate: 0.01, deduction: 2400000 };
      if (taxableStandard <= 2500000000) return { rate: 0.013, deduction: 6000000 };
      if (taxableStandard <= 5000000000) return { rate: 0.015, deduction: 11000000 };
      return { rate: 0.02, deduction: 36000000 };
    } else {
      // 일반, 법인
      if (taxableStandard <= 300000000) return { rate: 0.005, deduction: 0 };
      if (taxableStandard <= 600000000) return { rate: 0.007, deduction: 600000 };
      if (taxableStandard <= 1200000000) return { rate: 0.01, deduction: 2400000 };
      if (taxableStandard <= 2500000000) return { rate: 0.013, deduction: 6000000 };
      if (taxableStandard <= 5000000000) return { rate: 0.015, deduction: 11000000 };
      if (taxableStandard <= 9400000000) return { rate: 0.02, deduction: 36000000 };
      return { rate: 0.027, deduction: 101800000 };
    }
  };

  const handleCalculate = () => {
    const price = parseFloat(publicPrice) || 0;

    if (price <= 0) {
      alert('공시가격을 입력해주세요.');
      return;
    }

    const fairMarketRatio = 0.6;

    // 세액공제 기준액 결정
    const exemptionAmount = ownerType === 'single' ? 1200000000 : 900000000;
    let deductibleAmount = (price - exemptionAmount) * fairMarketRatio;
    if (deductibleAmount < 0) deductibleAmount = 0;

    const taxableStandard = price * fairMarketRatio;

    const { rate, deduction } = getComprehensiveTaxRate(
      deductibleAmount,
      ownerType
    );

    let comprehensiveTax = deductibleAmount * rate - deduction;
    if (comprehensiveTax < 0) comprehensiveTax = 0;

    // 세액공제 계산
    let taxCredit = 0;
    if (ownerType === 'single') {
      // 고령자 공제
      if (isElderly === 'yes') {
        const age = parseInt(elderlyAge) || 60;
        let elderlyCredit = 0;
        if (age >= 70) elderlyCredit = comprehensiveTax * 0.4;
        else if (age >= 65) elderlyCredit = comprehensiveTax * 0.3;
        else if (age >= 60) elderlyCredit = comprehensiveTax * 0.2;
        taxCredit += elderlyCredit;
      }

      // 장기보유 공제
      if (isLongTermHolder === 'yes') {
        const years = parseInt(holdingYears) || 5;
        let holdingCredit = 0;
        if (years >= 15) holdingCredit = comprehensiveTax * 0.5;
        else if (years >= 10) holdingCredit = comprehensiveTax * 0.4;
        else if (years >= 5) holdingCredit = comprehensiveTax * 0.2;
        taxCredit += holdingCredit;
      }

      // 합산 한도 80%
      taxCredit = Math.min(taxCredit, comprehensiveTax * 0.8);
    }

    const comprehensiveTaxAfterCredit = comprehensiveTax - taxCredit;
    const ruralSpecialTax = comprehensiveTaxAfterCredit * 0.2;
    const totalTax = comprehensiveTaxAfterCredit + ruralSpecialTax;

    setResults({
      price,
      taxableStandard,
      exemptionAmount,
      deductibleAmount,
      comprehensiveTax,
      taxCredit,
      comprehensiveTaxAfterCredit,
      ruralSpecialTax,
      totalTax,
      taxRate: (rate * 100).toFixed(2),
    });
  };

  const totalSteps = ownerType === 'single'
    ? 2 + 1 + (isElderly === 'yes' ? 1 : 0) + 1 + (isLongTermHolder === 'yes' ? 1 : 0)
    : 2;

  const completedSteps = (() => {
    let count = 0;
    if (ownerType) count++;
    if (publicPrice) count++;
    if (ownerType === 'single') {
      if (isElderly) count++;
      if (isElderly === 'yes' && elderlyAge) count++;
      if (isLongTermHolder) count++;
      if (isLongTermHolder === 'yes' && holdingYears) count++;
    }
    return count;
  })();

  let stepCounter = 0;

  return (
    <div className="mx-auto max-w-[1200px] px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-fg-muted mb-8">
        <Link href="/" className="hover:text-fg transition-colors">홈</Link>
        <ChevronRight size={12} />
        <span className="text-fg-secondary">세금</span>
        <ChevronRight size={12} />
        <span className="text-fg font-medium">종합부동산세 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">종합부동산세 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        일정 금액 이상의 주택을 소유한 경우 부과되는 종합부동산세를 계산합니다. 소유 유형과 공제 조건에 따라 세액이 결정됩니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          <FormProgress current={completedSteps} total={totalSteps} />

          {/* 주택 유형 */}
          <FormStep step={stepCounter = 1} label="소유유형 선택" required completed={!!ownerType}>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'single', label: '1세대 1주택자' },
                { val: 'general', label: '일반' },
                { val: 'corp', label: '법인' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setOwnerType(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    ownerType === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </FormStep>

          {/* 공시가격 합계 */}
          <FormStep step={stepCounter = 2} label="공시가격 입력" required completed={!!publicPrice}>
            <input
              type="number"
              value={publicPrice}
              onChange={(e) => setPublicPrice(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
          </FormStep>

          {/* 고령자 공제 */}
          {ownerType === 'single' && (
            <>
              <FormStep step={stepCounter = 3} label="고령자 공제 적용" required completed={!!isElderly}>
                <div className="flex flex-wrap gap-2">
                  {[
                    { val: 'no', label: '아니오' },
                    { val: 'yes', label: '예' },
                  ].map(({ val, label }) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setIsElderly(val)}
                      className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                        isElderly === val
                          ? 'bg-accent text-accent-fg'
                          : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </FormStep>

              {isElderly === 'yes' && (
                <FormStep step={++stepCounter} label="나이 선택" required completed={!!elderlyAge}>
                  <select
                    value={elderlyAge}
                    onChange={(e) => setElderlyAge(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                  >
                    <option value="60">60세~64세 (20% 공제)</option>
                    <option value="65">65세~69세 (30% 공제)</option>
                    <option value="70">70세 이상 (40% 공제)</option>
                  </select>
                </FormStep>
              )}

              {/* 장기보유 공제 */}
              <FormStep step={++stepCounter} label="장기보유 공제 적용" required completed={!!isLongTermHolder}>
                <div className="flex flex-wrap gap-2">
                  {[
                    { val: 'no', label: '아니오' },
                    { val: 'yes', label: '예' },
                  ].map(({ val, label }) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setIsLongTermHolder(val)}
                      className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                        isLongTermHolder === val
                          ? 'bg-accent text-accent-fg'
                          : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </FormStep>

              {isLongTermHolder === 'yes' && (
                <FormStep step={++stepCounter} label="보유 기간 선택" required completed={!!holdingYears}>
                  <select
                    value={holdingYears}
                    onChange={(e) => setHoldingYears(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                  >
                    <option value="5">5년 이상 (20% 공제)</option>
                    <option value="10">10년 이상 (40% 공제)</option>
                    <option value="15">15년 이상 (50% 공제)</option>
                  </select>
                </FormStep>
              )}
            </>
          )}

          {/* Calculate Button */}
          <div className="pl-[30px]">
            <button
              onClick={handleCalculate}
              className="w-full h-11 bg-accent hover:bg-accent-hover text-accent-fg font-medium rounded-xl transition-colors"
            >
              계산하기
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="border border-border rounded-2xl bg-surface p-6 md:p-8 mb-8">
          <h2 className="text-[18px] font-bold text-fg mb-6">계산 결과</h2>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">공시가격 합계</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.price)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">
              공시가격 x 60% (참고)
            </span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.taxableStandard)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">
              세액공제 기준액 ({ownerType === 'single' ? '12억' : '9억'}원)
            </span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.exemptionAmount)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">과세 대상</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.deductibleAmount)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">종합부동산세율</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.taxRate}%
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">종합부동산세</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.comprehensiveTax)}원
            </span>
          </div>

          {results.taxCredit > 0 && (
            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-[13px] text-fg-secondary">세액공제</span>
              <span className="text-[14px] font-medium text-fg tabular-nums">
                -{formatNumber(results.taxCredit)}원
              </span>
            </div>
          )}

          {results.taxCredit > 0 && (
            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-[13px] text-fg-secondary">공제 후 종부세</span>
              <span className="text-[14px] font-medium text-fg tabular-nums">
                {formatNumber(results.comprehensiveTaxAfterCredit)}원
              </span>
            </div>
          )}

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">농어촌특별세 (20%)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.ruralSpecialTax)}원
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
          <li>· 1세대1주택자는 12억원, 일반인은 9억원의 기본공제가 적용됩니다.</li>
          <li>· 고령자와 장기보유자는 종부세 세액의 최대 80%까지 공제받을 수 있습니다.</li>
          <li>· 종부세는 보유 주택의 총 공시가격을 기준으로 계산됩니다.</li>
          <li>· 농어촌특별세는 종부세의 20%가 추가로 부과됩니다.</li>
        </ul>
      </div>
    </div>
  );
}
