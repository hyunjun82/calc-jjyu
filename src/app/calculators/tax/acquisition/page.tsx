'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function AcquisitionTaxCalculator() {
  const [householdCount, setHouseholdCount] = useState('1');
  const [acquisitionAmount, setAcquisitionAmount] = useState('');
  const [isAdjustedArea, setIsAdjustedArea] = useState('no');
  const [houseSize, setHouseSize] = useState('small');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const getAcquisitionTaxRate = (
    household: string,
    amount: number,
    adjusted: boolean
  ): number => {
    if (household === '1') {
      // 1주택: 조정/비조정 동일
      if (amount <= 600000000) return 0.01;
      if (amount <= 900000000) return 0.01 + ((amount - 600000000) / 300000000) * 0.02;
      return 0.03;
    }

    if (household === '2') {
      if (adjusted) return 0.08; // 조정: 8%
      // 비조정: 1~3%
      if (amount <= 600000000) return 0.01;
      if (amount <= 900000000) return 0.01 + ((amount - 600000000) / 300000000) * 0.02;
      return 0.03;
    }

    if (household === '3') {
      if (adjusted) return 0.12; // 조정: 12%
      return 0.08; // 비조정: 8%
    }

    // 4주택 이상, 법인: 12%
    return 0.12;
  };

  const handleCalculate = () => {
    const amount = parseFloat(acquisitionAmount) || 0;

    if (amount <= 0) {
      alert('취득가액을 입력해주세요.');
      return;
    }

    const isAdjusted = isAdjustedArea === 'yes';
    const taxRate = getAcquisitionTaxRate(householdCount, amount, isAdjusted);
    const acquisitionTax = amount * taxRate;

    // 농특세: 85㎡ 이하 비과세, 85㎡ 초과 취득세의 10%
    const ruralSpecialTax = houseSize === 'large' ? acquisitionTax * 0.1 : 0;
    const localEducationTax = acquisitionTax * 0.1; // 10%
    const totalTax = acquisitionTax + ruralSpecialTax + localEducationTax;

    setResults({
      acquisitionTax,
      ruralSpecialTax,
      localEducationTax,
      totalTax,
      taxRate: (taxRate * 100).toFixed(2),
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
        <span className="text-fg font-medium">취득세 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">취득세 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        부동산 취득 시 발생하는 취득세를 계산합니다. 주택 수, 조정대상지역 여부에 따른 세율이 적용됩니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 주택수 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              주택 수 선택
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: '1', label: '1주택' },
                { val: '2', label: '2주택' },
                { val: '3', label: '3주택' },
                { val: '4', label: '4주택 이상' },
                { val: 'corp', label: '법인' },
              ].map(({ val, label }) => (
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
                  {label}
                </button>
              ))}
            </div>
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
            <p className="text-[12px] text-fg-muted mt-1.5">
              계약금 + 잔금 합계 금액
            </p>
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

          {/* 주택 면적 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              주택 면적
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'small', label: '85m² 이하' },
                { val: 'large', label: '85m² 초과' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setHouseSize(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    houseSize === val
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
            <span className="text-[13px] text-fg-secondary">취득세율</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.taxRate}%
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">취득세</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.acquisitionTax)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">농어촌특별세 {results.ruralSpecialTax === 0 ? '(비과세)' : '(취득세의 10%)'}</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.ruralSpecialTax)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">지방교육세 (10%)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.localEducationTax)}원
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
          <li>· 1주택의 취득세율은 비교적 낮으나, 2주택 이상은 세율이 인상됩니다.</li>
          <li>· 조정대상지역의 2주택은 8%, 3주택은 12% 세율이 적용됩니다.</li>
          <li>· 농어촌특별세와 지방교육세도 함께 부과됩니다.</li>
          <li>· 취득세는 등기 전에 납부해야 하므로 계획적인 자금 관리가 필요합니다.</li>
        </ul>
      </div>
    </div>
  );
}
