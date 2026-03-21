'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { FormStep, FormProgress } from '@/components/FormStep';

export default function PropertyTaxCalculator() {
  const [publicPrice, setPublicPrice] = useState('');
  const [propertyType, setPropertyType] = useState('house');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const getPropertyTaxRate = (taxableStandard: number, type: string): number => {
    if (type === 'building') {
      // 건물: 0.25% 단일세율
      return 0.0025;
    }
    if (type === 'land') {
      // 토지(종합합산): 누진세율
      if (taxableStandard <= 50000000) return 0.002;
      if (taxableStandard <= 100000000) return 0.003;
      return 0.005;
    }
    // 주택: 4단계 누진세율
    if (taxableStandard <= 60000000) return 0.001;
    if (taxableStandard <= 150000000) return 0.0015;
    if (taxableStandard <= 300000000) return 0.0025;
    return 0.004;
  };

  const getProgressiveDeduction = (taxableStandard: number, type: string): number => {
    if (type === 'building') {
      // 건물: 단일세율이므로 누진공제 없음
      return 0;
    }
    if (type === 'land') {
      // 토지(종합합산) 누진공제
      if (taxableStandard <= 50000000) return 0;
      if (taxableStandard <= 100000000) return 50000;
      return 250000;
    }
    // 주택 누진공제
    if (taxableStandard <= 60000000) return 0;
    if (taxableStandard <= 150000000) return 30000;
    if (taxableStandard <= 300000000) return 180000;
    return 630000;
  };

  const handleCalculate = () => {
    const price = parseFloat(publicPrice) || 0;

    if (price <= 0) {
      alert('공시가격을 입력해주세요.');
      return;
    }

    // 공정시장가액비율: 60%
    const fairMarketRatio = 0.6;
    const taxableStandard = price * fairMarketRatio;

    // 재산세
    const taxRate = getPropertyTaxRate(taxableStandard, propertyType);
    const deduction = getProgressiveDeduction(taxableStandard, propertyType);
    const propertyTax = taxableStandard * taxRate - deduction;

    // 도시지역분
    const urbanAreaTax = taxableStandard * 0.0014;

    // 지방교육세
    const localEducationTax = propertyTax * 0.2;

    // 총 세액
    const totalTax = propertyTax + urbanAreaTax + localEducationTax;

    setResults({
      publicPrice: price,
      taxableStandard,
      propertyTax,
      urbanAreaTax,
      localEducationTax,
      totalTax,
      taxRate: (taxRate * 100).toFixed(3),
    });
  };

  const completedCount = [
    !!publicPrice,
    !!propertyType,
  ].filter(Boolean).length;

  return (
    <div className="mx-auto max-w-[1200px] px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-fg-muted mb-8">
        <Link href="/" className="hover:text-fg transition-colors">홈</Link>
        <ChevronRight size={12} />
        <span className="text-fg-secondary">세금</span>
        <ChevronRight size={12} />
        <span className="text-fg font-medium">재산세 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">재산세 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        주택, 건물, 토지의 공시가격을 기준으로 매년 부과되는 재산세를 계산합니다. 공정시장가액비율 60%를 적용합니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          <FormProgress current={completedCount} total={2} />

          {/* 주택 공시가격 */}
          <FormStep step={1} label="공시가격 입력" required completed={!!publicPrice}>
            <input
              type="number"
              value={publicPrice}
              onChange={(e) => setPublicPrice(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              국세청에서 고시한 주택의 공시가격
            </p>
            <p className="text-[12px] text-fg-muted mt-1">
              ※ 공정시장가액비율은 매년 정부 고시에 따라 변동될 수 있습니다.
            </p>
          </FormStep>

          {/* 주택 유형 */}
          <FormStep step={2} label="주택유형 선택" required completed={!!propertyType}>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'house', label: '주택' },
                { val: 'building', label: '건물' },
                { val: 'land', label: '토지' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setPropertyType(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    propertyType === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </FormStep>

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
            <span className="text-[13px] text-fg-secondary">공시가격</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.publicPrice)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">과세표준 (공시가격 x 60%)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.taxableStandard)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">재산세율</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.taxRate}%
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">재산세</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.propertyTax)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">도시지역분 (0.14%)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.urbanAreaTax)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">지방교육세 (20%)</span>
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
          <li>· 재산세는 매년 6월에 고지되며, 8월 31일까지 납부합니다.</li>
          <li>· 공정시장가액비율은 국세청에서 매년 결정합니다 (현재 60%).</li>
          <li>· 공시가격 100억 이상일 경우 세율이 인상될 수 있습니다.</li>
          <li>· 일시적 거주용 주택, 임차인 등 감면 대상이 있을 수 있습니다.</li>
        </ul>
      </div>
    </div>
  );
}
