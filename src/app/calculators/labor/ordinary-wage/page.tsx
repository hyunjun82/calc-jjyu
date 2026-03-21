'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function OrdinaryWageCalculator() {
  const [basePay, setBasePay] = useState('');
  const [allowance1Name, setAllowance1Name] = useState('');
  const [allowance1Amount, setAllowance1Amount] = useState('');
  const [allowance2Name, setAllowance2Name] = useState('');
  const [allowance2Amount, setAllowance2Amount] = useState('');
  const [allowance3Name, setAllowance3Name] = useState('');
  const [allowance3Amount, setAllowance3Amount] = useState('');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const handleCalculate = () => {
    const base = parseFloat(basePay) || 0;
    const a1 = parseFloat(allowance1Amount) || 0;
    const a2 = parseFloat(allowance2Amount) || 0;
    const a3 = parseFloat(allowance3Amount) || 0;

    if (base <= 0) {
      alert('기본급을 입력해주세요.');
      return;
    }

    const monthlyOrdinaryWage = base + a1 + a2 + a3;
    const hourlyWage = monthlyOrdinaryWage / 209;
    const dailyWage = hourlyWage * 8;

    // 각종 수당 단가
    const overtimeRate = hourlyWage * 1.5; // 연장근로
    const nightRate = hourlyWage * 1.5; // 야간근로
    const holidayRate = hourlyWage * 1.5; // 휴일근로 (8시간 이내)
    const holidayOvertimeRate = hourlyWage * 2.0; // 휴일근로 (8시간 초과)

    setResults({
      monthlyOrdinaryWage,
      hourlyWage,
      dailyWage,
      overtimeRate,
      nightRate,
      holidayRate,
      holidayOvertimeRate,
      allowances: [
        { name: allowance1Name || '고정수당1', amount: a1 },
        { name: allowance2Name || '고정수당2', amount: a2 },
        { name: allowance3Name || '고정수당3', amount: a3 },
      ].filter(a => a.amount > 0),
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
        <span className="text-fg font-medium">통상임금 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">통상임금 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        기본급과 고정수당을 합산하여 통상임금을 계산하고, 연장/야간/휴일 근로수당 단가를 확인합니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 기본급 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              기본급 (원) *
            </label>
            <input
              type="number"
              value={basePay}
              onChange={(e) => setBasePay(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
          </div>

          {/* 고정수당 1 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              고정수당 1
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={allowance1Name}
                onChange={(e) => setAllowance1Name(e.target.value)}
                className="w-1/3 h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                placeholder="수당 명칭"
              />
              <input
                type="number"
                value={allowance1Amount}
                onChange={(e) => setAllowance1Amount(e.target.value)}
                className="w-2/3 h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                placeholder="금액 (원)"
              />
            </div>
          </div>

          {/* 고정수당 2 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              고정수당 2
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={allowance2Name}
                onChange={(e) => setAllowance2Name(e.target.value)}
                className="w-1/3 h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                placeholder="수당 명칭"
              />
              <input
                type="number"
                value={allowance2Amount}
                onChange={(e) => setAllowance2Amount(e.target.value)}
                className="w-2/3 h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                placeholder="금액 (원)"
              />
            </div>
          </div>

          {/* 고정수당 3 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              고정수당 3
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={allowance3Name}
                onChange={(e) => setAllowance3Name(e.target.value)}
                className="w-1/3 h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                placeholder="수당 명칭"
              />
              <input
                type="number"
                value={allowance3Amount}
                onChange={(e) => setAllowance3Amount(e.target.value)}
                className="w-2/3 h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                placeholder="금액 (원)"
              />
            </div>
            <p className="text-[12px] text-fg-muted mt-1.5">
              정기성, 일률성, 고정성을 갖춘 수당만 포함 (성과급, 식대 등 제외)
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
            <span className="text-[13px] text-fg-secondary">월 통상임금</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.monthlyOrdinaryWage)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">시간급 (월 통상임금 / 209)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.hourlyWage)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">일급 (시간급 x 8시간)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.dailyWage)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">연장근로 수당 단가 (시간당, 150%)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.overtimeRate)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">야간근로 수당 단가 (시간당, 150%)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.nightRate)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">휴일근로 수당 단가 (시간당, 150%)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.holidayRate)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">휴일초과 수당 단가 (시간당, 200%)</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {formatNumber(results.holidayOvertimeRate)}원
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 통상임금은 정기적, 일률적, 고정적으로 지급되는 임금입니다.</li>
          <li>· 기본급 + 직무수당, 직책수당 등 고정 수당이 포함됩니다.</li>
          <li>· 성과급(비고정), 식대(실비변상), 교통비(실비변상) 등은 제외됩니다.</li>
          <li>· 시급 환산: 월 통상임금 / 209시간</li>
        </ul>
      </div>
    </div>
  );
}
