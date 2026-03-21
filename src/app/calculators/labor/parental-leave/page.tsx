'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function ParentalLeaveCalculator() {
  const [monthlyWage, setMonthlyWage] = useState('');
  const [leavePeriod, setLeavePeriod] = useState('');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const handleCalculate = () => {
    const wage = parseFloat(monthlyWage) || 0;
    const months = parseInt(leavePeriod) || 0;

    if (wage <= 0 || months <= 0) {
      alert('통상임금과 휴직기간을 입력해주세요.');
      return;
    }

    const lowerLimit = 700000; // 하한 70만원
    const monthlyDetails: { month: number; amount: number; rate: string }[] = [];
    let totalAmount = 0;

    for (let i = 1; i <= months; i++) {
      let amount = 0;
      let rate = '';

      if (i <= 3) {
        // 1~3개월: 통상임금의 100% (상한 250만원)
        amount = Math.min(wage * 1.0, 2500000);
        rate = '100% (상한 250만원)';
      } else if (i <= 6) {
        // 4~6개월: 통상임금의 100% (상한 200만원)
        amount = Math.min(wage * 1.0, 2000000);
        rate = '100% (상한 200만원)';
      } else {
        // 7개월 이후: 통상임금의 80% (상한 150만원)
        amount = Math.min(wage * 0.8, 1500000);
        rate = '80% (상한 150만원)';
      }

      // 하한 적용
      amount = Math.max(amount, lowerLimit);

      monthlyDetails.push({ month: i, amount, rate });
      totalAmount += amount;
    }

    setResults({
      monthlyDetails,
      totalAmount,
    });
  };

  return (
    <div className="mx-auto max-w-[1200px] px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-fg-muted mb-8">
        <Link href="/" className="hover:text-fg transition-colors">홈</Link>
        <ChevronRight size={12} />
        <span className="text-fg-secondary">근로</span>
        <ChevronRight size={12} />
        <span className="text-fg font-medium">육아휴직 급여 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">육아휴직 급여 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        2025년 기준 육아휴직 급여를 계산합니다. 휴직 기간에 따라 지급률과 상한액이 달라집니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 통상임금 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              통상임금 - 월 (원) *
            </label>
            <input
              type="number"
              value={monthlyWage}
              onChange={(e) => setMonthlyWage(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              기본급 + 고정수당 합계
            </p>
          </div>

          {/* 휴직기간 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              육아휴직 기간 (개월) *
            </label>
            <input
              type="number"
              value={leavePeriod}
              onChange={(e) => setLeavePeriod(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="12"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              최대 12개월
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

          {results.monthlyDetails.map((detail: any) => (
            <div key={detail.month} className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-[13px] text-fg-secondary">
                {detail.month}개월차 ({detail.rate})
              </span>
              <span className="text-[14px] font-medium text-fg tabular-nums">
                {formatNumber(detail.amount)}원
              </span>
            </div>
          ))}

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">총 수령액</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {formatNumber(results.totalAmount)}원
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 1~3개월: 통상임금의 100% (상한 월 250만원)</li>
          <li>· 4~6개월: 통상임금의 100% (상한 월 200만원)</li>
          <li>· 7개월 이후: 통상임금의 80% (상한 월 150만원)</li>
          <li>· 하한액: 월 70만원</li>
          <li>· 아빠육아휴직보너스: 두 번째 사용자의 경우 첫 3개월 상한이 상향될 수 있습니다.</li>
        </ul>
      </div>
    </div>
  );
}
