'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState('');
  const [annualRate, setAnnualRate] = useState('');
  const [years, setYears] = useState('');
  const [compoundType, setCompoundType] = useState('12');
  const [monthlyDeposit, setMonthlyDeposit] = useState('');
  const [calcType, setCalcType] = useState('compound');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const handleCalculate = () => {
    const P = parseFloat(principal) || 0;
    const r = (parseFloat(annualRate) || 0) / 100;
    const t = parseFloat(years) || 0;
    const monthly = parseFloat(monthlyDeposit) || 0;

    if (P <= 0 || r <= 0 || t <= 0) {
      alert('원금, 연이율, 기간을 모두 입력해주세요.');
      return;
    }

    let finalAmount = 0;

    if (calcType === 'simple') {
      // 단리: 원금 × (1 + 이율 × 기간)
      finalAmount = P * (1 + r * t);
    } else {
      // 복리: 원금 × (1 + 이율/복리주기)^(복리주기×기간)
      const n = parseInt(compoundType);
      finalAmount = P * Math.pow(1 + r / n, n * t);

      // 적립식 복리
      if (monthly > 0) {
        const monthlyRate = r / 12;
        const totalMonths = t * 12;
        for (let i = 0; i < totalMonths; i++) {
          finalAmount += monthly * Math.pow(1 + monthlyRate, totalMonths - i);
        }
      }
    }

    const totalDeposit = P + (monthly > 0 ? monthly * t * 12 : 0);
    const totalInterest = finalAmount - totalDeposit;
    const returnRate = totalDeposit > 0 ? (totalInterest / totalDeposit) * 100 : 0;

    setResults({
      finalAmount,
      totalDeposit,
      totalInterest,
      returnRate,
    });
  };

  return (
    <div className="mx-auto max-w-[1200px] px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-fg-muted mb-8">
        <Link href="/" className="hover:text-fg transition-colors">홈</Link>
        <ChevronRight size={12} />
        <span className="text-fg-secondary">금융</span>
        <ChevronRight size={12} />
        <span className="text-fg font-medium">복리 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">복리 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        단리와 복리 이자를 계산합니다. 복리주기 설정과 월 적립식 계산도 지원합니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 계산 방식 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              계산 방식
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'simple', label: '단리' },
                { val: 'compound', label: '복리' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setCalcType(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    calcType === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 원금 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              원금 (원) *
            </label>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
          </div>

          {/* 연이율 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              연이율 (%) *
            </label>
            <input
              type="number"
              value={annualRate}
              onChange={(e) => setAnnualRate(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
              step="0.1"
            />
          </div>

          {/* 기간 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              기간 (년) *
            </label>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
          </div>

          {/* 복리주기 (복리 선택 시만) */}
          {calcType === 'compound' && (
            <div className="mb-6">
              <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                복리주기
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { val: '1', label: '연' },
                  { val: '2', label: '반기' },
                  { val: '4', label: '분기' },
                  { val: '12', label: '월' },
                  { val: '365', label: '일' },
                ].map(({ val, label }) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setCompoundType(val)}
                    className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                      compoundType === val
                        ? 'bg-accent text-accent-fg'
                        : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 월적립액 */}
          {calcType === 'compound' && (
            <div className="mb-6">
              <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                월 적립액 (원, 선택)
              </label>
              <input
                type="number"
                value={monthlyDeposit}
                onChange={(e) => setMonthlyDeposit(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                placeholder="0"
              />
              <p className="text-[12px] text-fg-muted mt-1.5">
                매월 추가 납입할 금액 (없으면 비워두세요)
              </p>
            </div>
          )}

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
            <span className="text-[13px] text-fg-secondary">총 투자원금</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.totalDeposit)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">총 이자</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.totalInterest)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">원금 대비 수익률</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.returnRate.toFixed(2)}%
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">최종 금액</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {formatNumber(results.finalAmount)}원
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 복리는 이자에 이자가 붙어 단리보다 높은 수익을 제공합니다.</li>
          <li>· 복리주기가 짧을수록 (월 &gt; 분기 &gt; 반기 &gt; 연) 최종 금액이 커집니다.</li>
          <li>· 적립식 투자는 매월 일정 금액을 추가 납입하여 복리 효과를 극대화합니다.</li>
          <li>· 72의 법칙: 72 ÷ 연이율 = 원금이 2배가 되는 대략적인 기간(년)입니다.</li>
        </ul>
      </div>
    </div>
  );
}
