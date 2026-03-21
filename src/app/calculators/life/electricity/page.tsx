'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function ElectricityCalculator() {
  const [usage, setUsage] = useState('');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const handleCalculate = () => {
    const kwh = parseFloat(usage) || 0;

    if (kwh <= 0) {
      alert('월 사용량을 입력해주세요.');
      return;
    }

    // 기본요금
    let baseFee: number;
    if (kwh <= 200) {
      baseFee = 910;
    } else if (kwh <= 400) {
      baseFee = 1600;
    } else {
      baseFee = 7300;
    }

    // 전력량요금 (누진제)
    let step1 = 0;
    let step2 = 0;
    let step3 = 0;

    if (kwh <= 200) {
      step1 = kwh * 120.0;
    } else if (kwh <= 400) {
      step1 = 200 * 120.0;
      step2 = (kwh - 200) * 214.6;
    } else {
      step1 = 200 * 120.0;
      step2 = 200 * 214.6;
      step3 = (kwh - 400) * 307.3;
    }

    const usageFee = step1 + step2 + step3;
    const electricityFee = baseFee + usageFee;

    // 부가세 (10%)
    const vat = Math.round(electricityFee * 0.1);

    // 전력산업기반기금 (3.7%)
    const fund = Math.floor(electricityFee * 0.037 / 10) * 10;

    const totalFee = electricityFee + vat + fund;

    setResults({
      baseFee,
      step1,
      step2,
      step3,
      usageFee,
      electricityFee,
      vat,
      fund,
      totalFee,
    });
  };

  return (
    <div className="mx-auto max-w-[1200px] px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-fg-muted mb-8">
        <Link href="/" className="hover:text-fg transition-colors">홈</Link>
        <ChevronRight size={12} />
        <span className="text-fg-secondary">생활</span>
        <ChevronRight size={12} />
        <span className="text-fg font-medium">전기요금 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">전기요금 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        주택용(저압) 전기요금을 누진제 기준으로 계산합니다. 2024년 기준 요금이 적용됩니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 월 사용량 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              월 사용량 (kWh) *
            </label>
            <input
              type="number"
              value={usage}
              onChange={(e) => setUsage(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="350"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              전기 고지서의 사용량(kWh)을 입력하세요
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
            <span className="text-[13px] text-fg-secondary">기본요금</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.baseFee)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">1단계 (1~200kWh, 120.0원)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.step1)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">2단계 (201~400kWh, 214.6원)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.step2)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">3단계 (401kWh~, 307.3원)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.step3)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">전기요금 소계</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.electricityFee)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">부가가치세 (10%)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.vat)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">전력산업기반기금 (3.7%)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.fund)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">총 전기요금</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {formatNumber(results.totalFee)}원
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 주택용 전기요금은 사용량이 많을수록 단가가 높아지는 누진제가 적용됩니다.</li>
          <li>· 하절기(7~8월)에는 사용량이 증가하여 높은 단계의 요금이 적용될 수 있습니다.</li>
          <li>· 부가세는 원 미만 절사, 기반기금은 10원 미만 절사됩니다.</li>
          <li>· 실제 요금은 한전 고지서와 다소 차이가 있을 수 있습니다.</li>
        </ul>
      </div>
    </div>
  );
}
