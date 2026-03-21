'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function FIRECalculator() {
  const [currentAssets, setCurrentAssets] = useState('');
  const [monthlySaving, setMonthlySaving] = useState('');
  const [monthlyExpense, setMonthlyExpense] = useState('');
  const [investmentReturn, setInvestmentReturn] = useState('');
  const [inflationRate, setInflationRate] = useState('');
  const [currentAge, setCurrentAge] = useState('');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const handleCalculate = () => {
    const pv = parseFloat(currentAssets) || 0;
    const pmt = parseFloat(monthlySaving) || 0;
    const expense = parseFloat(monthlyExpense) || 0;
    const returnRate = (parseFloat(investmentReturn) || 0) / 100;
    const inflation = (parseFloat(inflationRate) || 0) / 100;
    const age = parseFloat(currentAge) || 0;

    if (expense <= 0) {
      alert('월 생활비를 입력해주세요.');
      return;
    }

    // FIRE 목표금액 = 연간 생활비 × 25 (4% 룰)
    const annualExpense = expense * 12;
    const fireTarget = annualExpense * 25;

    // 실질 수익률 (물가상승률 반영)
    const realReturn = (1 + returnRate) / (1 + inflation) - 1;
    const monthlyRealReturn = realReturn / 12;

    // FV = PV × (1+r)^n + PMT × ((1+r)^n - 1) / r 에서 n 구하기
    // fireTarget = pv * (1+mr)^n + pmt * ((1+mr)^n - 1) / mr
    // 수치 탐색으로 n 계산
    let yearsToFire = 0;
    if (pv >= fireTarget) {
      yearsToFire = 0;
    } else if (pmt <= 0 && pv < fireTarget) {
      if (monthlyRealReturn <= 0) {
        yearsToFire = -1; // 달성 불가
      } else {
        // PV * (1+r)^n = fireTarget
        const n = Math.log(fireTarget / pv) / Math.log(1 + monthlyRealReturn);
        yearsToFire = n / 12;
      }
    } else {
      let balance = pv;
      let months = 0;
      const maxMonths = 100 * 12; // 최대 100년

      while (balance < fireTarget && months < maxMonths) {
        balance = balance * (1 + monthlyRealReturn) + pmt;
        months++;
      }

      if (months >= maxMonths) {
        yearsToFire = -1; // 달성 불가
      } else {
        yearsToFire = months / 12;
      }
    }

    const retirementAge = age > 0 ? Math.ceil(age + yearsToFire) : null;

    setResults({
      fireTarget,
      annualExpense,
      yearsToFire,
      retirementAge,
      realReturn: realReturn * 100,
    });
  };

  return (
    <div className="mx-auto max-w-[1200px] px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-fg-muted mb-8">
        <Link href="/" className="hover:text-fg transition-colors">홈</Link>
        <ChevronRight size={12} />
        <span className="text-fg-secondary">투자</span>
        <ChevronRight size={12} />
        <span className="text-fg font-medium">FIRE 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">FIRE(조기은퇴) 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        4% 룰 기반으로 경제적 자유(FIRE) 달성에 필요한 목표금액과 소요 기간을 계산합니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 현재 자산 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              현재 자산 (원)
            </label>
            <input
              type="number"
              value={currentAssets}
              onChange={(e) => setCurrentAssets(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
          </div>

          {/* 월 저축액 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              월 저축액 (원) *
            </label>
            <input
              type="number"
              value={monthlySaving}
              onChange={(e) => setMonthlySaving(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
          </div>

          {/* 월 생활비 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              월 생활비 (원) *
            </label>
            <input
              type="number"
              value={monthlyExpense}
              onChange={(e) => setMonthlyExpense(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              은퇴 후 예상 월 생활비
            </p>
          </div>

          {/* 예상 투자수익률 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              예상 투자수익률 (연 %) *
            </label>
            <input
              type="number"
              value={investmentReturn}
              onChange={(e) => setInvestmentReturn(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="7"
              step="0.1"
            />
          </div>

          {/* 예상 물가상승률 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              예상 물가상승률 (연 %)
            </label>
            <input
              type="number"
              value={inflationRate}
              onChange={(e) => setInflationRate(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="3"
              step="0.1"
            />
          </div>

          {/* 현재 나이 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              현재 나이 (선택)
            </label>
            <input
              type="number"
              value={currentAge}
              onChange={(e) => setCurrentAge(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="30"
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
            <span className="text-[13px] text-fg-secondary">연간 생활비</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.annualExpense)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">FIRE 목표금액 (연 생활비 x 25)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.fireTarget)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">실질 수익률 (물가 반영)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.realReturn.toFixed(2)}%
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">달성까지 소요 기간</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.yearsToFire === -1
                ? '달성 불가'
                : results.yearsToFire === 0
                ? '이미 달성'
                : `약 ${results.yearsToFire.toFixed(1)}년`}
            </span>
          </div>

          {results.retirementAge && (
            <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
              <span className="text-[15px] font-semibold text-fg">은퇴 가능 나이</span>
              <span className="text-[24px] font-bold text-fg tabular-nums">
                {results.yearsToFire === -1 ? '달성 불가' : `${results.retirementAge}세`}
              </span>
            </div>
          )}

          {!results.retirementAge && (
            <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
              <span className="text-[15px] font-semibold text-fg">FIRE 목표금액</span>
              <span className="text-[24px] font-bold text-fg tabular-nums">
                {formatNumber(results.fireTarget)}원
              </span>
            </div>
          )}
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 4% 룰: 은퇴 자산의 4%를 매년 인출하면 30년 이상 유지 가능하다는 원칙입니다.</li>
          <li>· FIRE 목표금액 = 연간 생활비 x 25로 계산합니다.</li>
          <li>· 물가상승률을 반영한 실질 수익률로 계산하면 더 정확합니다.</li>
          <li>· 저축률을 높이면 FIRE 달성 기간을 크게 단축할 수 있습니다.</li>
        </ul>
      </div>
    </div>
  );
}
