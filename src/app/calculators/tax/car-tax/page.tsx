'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function CarTaxCalculator() {
  const [usage, setUsage] = useState<'non-commercial' | 'commercial'>('non-commercial');
  const [fuelType, setFuelType] = useState<'general' | 'electric'>('general');
  const [displacement, setDisplacement] = useState('');
  const [registrationDate, setRegistrationDate] = useState('');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const getCarAge = (regDate: string): number => {
    if (!regDate) return 0;
    const reg = new Date(regDate);
    const now = new Date();
    let age = now.getFullYear() - reg.getFullYear();
    if (now.getMonth() < reg.getMonth() || (now.getMonth() === reg.getMonth() && now.getDate() < reg.getDate())) {
      age--;
    }
    return Math.max(0, age);
  };

  const getReductionRate = (age: number): number => {
    if (age < 3) return 0;
    if (age === 3) return 0.05;
    if (age === 4) return 0.10;
    if (age === 5) return 0.15;
    if (age === 6) return 0.20;
    if (age === 7) return 0.25;
    if (age === 8) return 0.30;
    if (age === 9) return 0.35;
    if (age === 10) return 0.40;
    if (age === 11) return 0.45;
    return 0.50; // 12년 이상
  };

  const handleCalculate = () => {
    const cc = parseFloat(displacement) || 0;

    if (fuelType === 'general' && cc <= 0) {
      alert('배기량을 입력해주세요.');
      return;
    }

    let annualTax = 0;

    if (fuelType === 'electric') {
      annualTax = usage === 'non-commercial' ? 100000 : 20000;
    } else {
      if (usage === 'non-commercial') {
        if (cc <= 1000) {
          annualTax = cc * 80;
        } else if (cc <= 1600) {
          annualTax = cc * 140;
        } else {
          annualTax = cc * 200;
        }
      } else {
        if (cc <= 1600) {
          annualTax = cc * 18;
        } else if (cc <= 2500) {
          annualTax = cc * 19;
        } else {
          annualTax = cc * 24;
        }
      }
    }

    const carAge = getCarAge(registrationDate);
    const reductionRate = usage === 'non-commercial' ? getReductionRate(carAge) : 0;
    const reductionAmount = annualTax * reductionRate;
    const reducedTax = annualTax - reductionAmount;
    const localEducationTax = reducedTax * 0.30;
    const totalAnnualTax = reducedTax + localEducationTax;
    const halfYearTax = totalAnnualTax / 2;

    setResults({
      annualTax,
      carAge,
      reductionRate,
      reductionAmount,
      reducedTax,
      localEducationTax,
      totalAnnualTax,
      firstHalf: halfYearTax,
      secondHalf: halfYearTax,
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
        <span className="text-fg font-medium">자동차세 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">자동차세 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        배기량과 차령에 따른 자동차세를 계산합니다. 비영업용/영업용, 전기차 세율을 적용합니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 차량 구분 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              차량 구분
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

          {/* 연료 타입 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              연료 타입
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'general' as const, label: '일반(내연기관)' },
                { val: 'electric' as const, label: '전기차' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setFuelType(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    fuelType === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 배기량 */}
          {fuelType === 'general' && (
            <div className="mb-6">
              <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                배기량 (cc) *
              </label>
              <input
                type="number"
                value={displacement}
                onChange={(e) => setDisplacement(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                placeholder="0"
              />
              <p className="text-[12px] text-fg-muted mt-1.5">
                차량 등록증에 기재된 배기량
              </p>
            </div>
          )}

          {/* 최초등록일 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              최초등록일
            </label>
            <input
              type="date"
              value={registrationDate}
              onChange={(e) => setRegistrationDate(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              차령 경감률 계산에 사용됩니다 (비영업용 3년 이상)
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
            <span className="text-[13px] text-fg-secondary">자동차세 (연간)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.annualTax)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">
              차령 경감 {results.reductionRate > 0 ? `(${results.carAge}년, ${(results.reductionRate * 100).toFixed(0)}% 경감)` : '(미적용)'}
            </span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              -{formatNumber(results.reductionAmount)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">경감 후 자동차세</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.reducedTax)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">지방교육세 (30%)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.localEducationTax)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2 mb-4">
            <span className="text-[15px] font-semibold text-fg">총 납부세액 (연간)</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {formatNumber(results.totalAnnualTax)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">1기분 (6월)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.firstHalf)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3">
            <span className="text-[13px] text-fg-secondary">2기분 (12월)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.secondHalf)}원
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 자동차세는 매년 6월(1기분)과 12월(2기분)에 부과됩니다.</li>
          <li>· 비영업용 승용차는 최초등록 후 3년부터 매년 5%씩 경감되며 최대 50%까지 적용됩니다.</li>
          <li>· 전기차는 배기량과 무관하게 비영업용 연 10만원, 영업용 연 2만원이 부과됩니다.</li>
          <li>· 1월 또는 3월에 연납 신청 시 할인 혜택을 받을 수 있습니다.</li>
        </ul>
      </div>
    </div>
  );
}
