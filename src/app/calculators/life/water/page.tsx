'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function WaterCalculator() {
  const [usage, setUsage] = useState('');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const calculateWaterFee = (m3: number): number => {
    let fee = 0;
    if (m3 <= 30) {
      fee = m3 * 360;
    } else if (m3 <= 50) {
      fee = 30 * 360 + (m3 - 30) * 550;
    } else {
      fee = 30 * 360 + 20 * 550 + (m3 - 50) * 790;
    }
    return fee;
  };

  const calculateSewerFee = (m3: number): number => {
    let fee = 0;
    if (m3 <= 30) {
      fee = m3 * 340;
    } else if (m3 <= 50) {
      fee = 30 * 340 + (m3 - 30) * 430;
    } else {
      fee = 30 * 340 + 20 * 430 + (m3 - 50) * 580;
    }
    return fee;
  };

  const handleCalculate = () => {
    const m3 = parseFloat(usage) || 0;

    if (m3 <= 0) {
      alert('월 사용량을 입력해주세요.');
      return;
    }

    const waterFee = calculateWaterFee(m3);
    const sewerFee = calculateSewerFee(m3);
    const waterUseFund = Math.round(m3 * 170); // 물이용부담금
    const totalFee = waterFee + sewerFee + waterUseFund;

    setResults({
      waterFee,
      sewerFee,
      waterUseFund,
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
        <span className="text-fg font-medium">수도요금 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">수도요금 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        가정용 수도요금을 계산합니다. 서울 기준 상수도, 하수도, 물이용부담금이 포함됩니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
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
              placeholder="20"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              수도 고지서의 사용량(㎥)을 입력하세요 (구경 13mm 기준)
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
            <span className="text-[13px] text-fg-secondary">상수도요금</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.waterFee)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">하수도요금</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.sewerFee)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">물이용부담금 (170원/㎥)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.waterUseFund)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">총 수도요금</span>
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
          <li>· 상수도 요금은 사용량 구간별로 단가가 다릅니다 (30㎥ 이하, 31~50㎥, 51㎥ 이상).</li>
          <li>· 하수도 요금은 상수도 사용량과 동일한 양을 기준으로 부과됩니다.</li>
          <li>· 물이용부담금은 수자원 보전을 위해 ㎥당 170원이 부과됩니다.</li>
          <li>· 지역별로 요금 체계가 다를 수 있으며, 본 계산기는 서울 기준입니다.</li>
        </ul>
      </div>
    </div>
  );
}
