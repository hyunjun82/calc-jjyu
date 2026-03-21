'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function GasCalculator() {
  const [usage, setUsage] = useState('');
  const [purpose, setPurpose] = useState('cooking');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const handleCalculate = () => {
    const m3 = parseFloat(usage) || 0;

    if (m3 <= 0) {
      alert('월 사용량을 입력해주세요.');
      return;
    }

    // 1㎥ ≈ 43.1 MJ (보정계수 적용)
    const mjPerM3 = 43.1;
    const totalMJ = m3 * mjPerM3;

    // 단가: MJ당 약 18.07원
    const ratePerMJ = 18.07;

    // 기본요금
    const baseFee = 1000;

    // 사용요금
    const usageFee = totalMJ * ratePerMJ;

    // 소계
    const subtotal = baseFee + usageFee;

    // 부가세 (10%)
    const vat = Math.round(subtotal * 0.1);

    // 총 요금
    const totalFee = subtotal + vat;

    setResults({
      baseFee,
      totalMJ: Math.round(totalMJ * 10) / 10,
      usageFee,
      subtotal,
      vat,
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
        <span className="text-fg font-medium">가스요금 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">가스요금 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        도시가스 요금을 계산합니다. 서울 기준 2024년 요금 단가가 적용됩니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 용도 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              사용 용도
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'cooking', label: '취사용' },
                { val: 'heating', label: '난방용' },
                { val: 'both', label: '겸용' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setPurpose(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    purpose === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 월 사용량 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              월 사용량 (㎥) *
            </label>
            <input
              type="number"
              value={usage}
              onChange={(e) => setUsage(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="30"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              가스 고지서의 사용량(㎥)을 입력하세요
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
            <span className="text-[13px] text-fg-secondary">열량 환산</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.totalMJ} MJ
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">사용요금 (MJ당 18.07원)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.usageFee)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">소계</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.subtotal)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">부가가치세 (10%)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.vat)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">총 가스요금</span>
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
          <li>· 도시가스 요금은 열량(MJ) 기준으로 계산됩니다. 1㎥ ≈ 43.1 MJ입니다.</li>
          <li>· 지역별, 공급사별로 요금 단가가 다를 수 있습니다. 본 계산기는 서울 기준입니다.</li>
          <li>· 겨울철 난방 시 사용량이 급증하므로 절약 계획을 세우는 것이 좋습니다.</li>
          <li>· 실제 요금은 고지서와 다소 차이가 있을 수 있습니다.</li>
        </ul>
      </div>
    </div>
  );
}
