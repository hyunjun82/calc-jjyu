'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function CarAcquisitionTaxCalculator() {
  const [price, setPrice] = useState('');
  const [vehicleType, setVehicleType] = useState('sedan');
  const [usage, setUsage] = useState<'non-commercial' | 'commercial'>('non-commercial');
  const [isElectric, setIsElectric] = useState<'no' | 'yes'>('no');
  const [region, setRegion] = useState<'seoul' | 'other'>('seoul');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const handleCalculate = () => {
    const amount = parseFloat(price) || 0;

    if (amount <= 0) {
      alert('차량 가격을 입력해주세요.');
      return;
    }

    let taxRate = 0;
    let isExempt = false;

    if (usage === 'commercial') {
      taxRate = 0.04;
    } else {
      switch (vehicleType) {
        case 'light':
          if (amount <= 40000000) {
            taxRate = 0;
            isExempt = true;
          } else {
            taxRate = 0.07;
          }
          break;
        case 'sedan':
        case 'van-small':
          taxRate = 0.07;
          break;
        case 'van-large':
        case 'truck':
          taxRate = 0.05;
          break;
        default:
          taxRate = 0.07;
      }
    }

    let acquisitionTax = amount * taxRate;
    let electricDiscount = 0;

    if (isElectric === 'yes' && !isExempt) {
      electricDiscount = Math.min(acquisitionTax, 1400000);
      acquisitionTax = acquisitionTax - electricDiscount;
    }

    // 공채매입비 계산 (비영업용 승용차 기준)
    let bondRate = 0;
    if (usage === 'non-commercial' && (vehicleType === 'sedan' || vehicleType === 'van-small')) {
      if (region === 'seoul') {
        bondRate = 0.05; // 2000cc 이하 기본값
        // 간소화: 서울 기준
      } else {
        bondRate = 0.04;
      }
    } else if (usage === 'non-commercial' && (vehicleType === 'van-large' || vehicleType === 'truck')) {
      bondRate = 0.03;
    } else if (usage === 'commercial') {
      bondRate = 0.02;
    }

    const bondAmount = amount * bondRate;
    const bondDiscountRate = 0.04; // 공채 할인율 약 4% 가정
    const bondCost = bondAmount * bondDiscountRate;

    const totalCost = acquisitionTax + bondCost;

    setResults({
      taxRate: isExempt ? '면제' : `${(taxRate * 100).toFixed(0)}%`,
      acquisitionTax: isExempt ? 0 : acquisitionTax,
      isExempt,
      electricDiscount,
      bondAmount,
      bondCost,
      totalCost: isExempt ? bondCost : totalCost,
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
        <span className="text-fg font-medium">자동차 취등록세 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">자동차 취등록세 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        신차 및 중고차 구매 시 발생하는 취득세와 등록비용을 계산합니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 차량 가격 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              차량 가격 (취득가액, 원) *
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              차량 구매 가격 (부가세 포함)
            </p>
          </div>

          {/* 차량 유형 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              차량 유형
            </label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
            >
              <option value="sedan">승용차</option>
              <option value="van-small">승합차 (7~10인승)</option>
              <option value="van-large">승합차 (11인승 이상)</option>
              <option value="truck">화물차</option>
              <option value="light">경차 (1,000cc 이하)</option>
            </select>
          </div>

          {/* 영업/비영업 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              영업/비영업 구분
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'non-commercial' as const, label: '비영업용' },
                { val: 'commercial' as const, label: '영업용' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setUsage(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    usage === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 전기차 여부 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              전기차 여부
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'no' as const, label: '아니오' },
                { val: 'yes' as const, label: '예' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setIsElectric(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    isElectric === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 등록 지역 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              등록 지역
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'seoul' as const, label: '서울' },
                { val: 'other' as const, label: '기타 지역' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setRegion(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    region === val
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
              {results.taxRate}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">취득세</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.isExempt ? '면제' : `${formatNumber(results.acquisitionTax)}원`}
            </span>
          </div>

          {results.electricDiscount > 0 && (
            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-[13px] text-fg-secondary">전기차 감면액</span>
              <span className="text-[14px] font-medium text-fg tabular-nums">
                -{formatNumber(results.electricDiscount)}원
              </span>
            </div>
          )}

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">공채매입비 (추정)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.bondCost)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">총 취등록비용</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {formatNumber(results.totalCost)}원
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 경차(1,000cc 이하)는 취득가 4,000만원 이하 시 취득세가 면제됩니다 (2024년까지 한시적).</li>
          <li>· 전기차는 취득세 최대 140만원까지 감면 혜택이 있습니다.</li>
          <li>· 공채매입비는 지역 및 차량에 따라 달라지며, 할인율은 시세에 따라 변동됩니다.</li>
          <li>· 영업용 차량은 승용/승합/화물 구분 없이 4% 세율이 적용됩니다.</li>
        </ul>
      </div>
    </div>
  );
}
