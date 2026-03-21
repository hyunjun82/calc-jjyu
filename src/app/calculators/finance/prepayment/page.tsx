'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function PrepaymentFeeCalculator() {
  const [prepaymentAmount, setPrepaymentAmount] = useState('');
  const [feeRate, setFeeRate] = useState('1.4');
  const [loanDate, setLoanDate] = useState('');
  const [repaymentDate, setRepaymentDate] = useState('');
  const [maturityDate, setMaturityDate] = useState('');
  const [loanRate, setLoanRate] = useState('');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const daysBetween = (d1: string, d2: string): number => {
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    return Math.ceil((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24));
  };

  const handleCalculate = () => {
    const amount = parseFloat(prepaymentAmount) || 0;
    const rate = parseFloat(feeRate) || 0;

    if (amount <= 0) {
      alert('중도상환금액을 입력해주세요.');
      return;
    }

    if (!loanDate || !repaymentDate || !maturityDate) {
      alert('대출일, 상환예정일, 대출만기일을 모두 입력해주세요.');
      return;
    }

    const totalDays = daysBetween(loanDate, maturityDate);
    const elapsedDays = daysBetween(loanDate, repaymentDate);
    const remainingDays = totalDays - elapsedDays;

    // 3년(1095일) 경과 시 면제
    const isExempt = elapsedDays >= 1095;

    // 중도상환수수료 = 중도상환금액 × 수수료율 × (잔여기간/대출기간)
    const fee = isExempt ? 0 : amount * (rate / 100) * (remainingDays / totalDays);

    // 절감이자 추정 (중도상환으로 아낄 수 있는 이자)
    const loanAnnualRate = (parseFloat(loanRate) || 0) / 100;
    const savedInterest = amount * loanAnnualRate * (remainingDays / 365);

    const elapsedYears = Math.floor(elapsedDays / 365);
    const elapsedMonthsRemainder = Math.floor((elapsedDays % 365) / 30);
    const remainingYears = Math.floor(remainingDays / 365);
    const remainingMonthsRemainder = Math.floor((remainingDays % 365) / 30);

    setResults({
      fee,
      isExempt,
      elapsedDays,
      remainingDays,
      totalDays,
      elapsedYears,
      elapsedMonthsRemainder,
      remainingYears,
      remainingMonthsRemainder,
      savedInterest,
      netBenefit: savedInterest - fee,
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
        <span className="text-fg font-medium">중도상환 수수료 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">중도상환 수수료 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        대출 중도상환 시 발생하는 수수료를 계산합니다. 경과기간과 잔여기간에 따라 수수료가 달라지며, 3년 경과 시 대부분 면제됩니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 중도상환금액 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              중도상환금액 (원) *
            </label>
            <input
              type="number"
              value={prepaymentAmount}
              onChange={(e) => setPrepaymentAmount(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
          </div>

          {/* 수수료율 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              중도상환 수수료율 (%)
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: '1.0', label: '1.0%' },
                { val: '1.2', label: '1.2%' },
                { val: '1.4', label: '1.4% (기본)' },
                { val: '1.5', label: '1.5%' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setFeeRate(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    feeRate === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 대출일 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              대출일 *
            </label>
            <input
              type="date"
              value={loanDate}
              onChange={(e) => setLoanDate(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
            />
          </div>

          {/* 상환예정일 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              상환예정일 *
            </label>
            <input
              type="date"
              value={repaymentDate}
              onChange={(e) => setRepaymentDate(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
            />
          </div>

          {/* 대출만기일 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              대출만기일 *
            </label>
            <input
              type="date"
              value={maturityDate}
              onChange={(e) => setMaturityDate(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
            />
          </div>

          {/* 대출금리 (절감이자 추정용) */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              대출금리 (연, %, 절감이자 추정용)
            </label>
            <input
              type="number"
              value={loanRate}
              onChange={(e) => setLoanRate(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
              step="0.1"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              중도상환으로 절감되는 이자를 추정하기 위한 값입니다.
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
            <span className="text-[13px] text-fg-secondary">경과기간</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.elapsedYears}년 {results.elapsedMonthsRemainder}개월 ({formatNumber(results.elapsedDays)}일)
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">잔여기간</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.remainingYears}년 {results.remainingMonthsRemainder}개월 ({formatNumber(results.remainingDays)}일)
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">
              중도상환수수료 {results.isExempt ? '(3년 경과 면제)' : ''}
            </span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.fee)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">절감이자 추정</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.savedInterest)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">순이익 (절감이자 - 수수료)</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {formatNumber(results.netBenefit)}원
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 대부분의 은행은 대출 후 3년이 경과하면 중도상환수수료를 면제합니다.</li>
          <li>· 수수료율은 은행별로 1.0~1.5% 수준이며, 대출 약정서를 확인하세요.</li>
          <li>· 잔여기간이 짧을수록 중도상환수수료가 줄어듭니다.</li>
          <li>· 절감이자가 수수료보다 크면 중도상환이 유리합니다.</li>
        </ul>
      </div>
    </div>
  );
}
