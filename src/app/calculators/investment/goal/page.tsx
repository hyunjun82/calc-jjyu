'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function GoalCalculator() {
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [expectedReturn, setExpectedReturn] = useState('');
  const [mode, setMode] = useState('monthly');
  const [periodYears, setPeriodYears] = useState('');
  const [monthlySaving, setMonthlySaving] = useState('');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const handleCalculate = () => {
    const fv = parseFloat(targetAmount) || 0;
    const pv = parseFloat(currentAmount) || 0;
    const annualRate = (parseFloat(expectedReturn) || 0) / 100;
    const monthlyRate = annualRate / 12;

    if (fv <= 0) {
      alert('목표금액을 입력해주세요.');
      return;
    }

    if (mode === 'monthly') {
      // 월 저축액 계산
      const years = parseFloat(periodYears) || 0;
      if (years <= 0) {
        alert('기간을 입력해주세요.');
        return;
      }

      const n = years * 12;

      let requiredMonthly: number;
      if (monthlyRate === 0) {
        requiredMonthly = (fv - pv) / n;
      } else {
        // PMT = (FV - PV*(1+r)^n) / (((1+r)^n - 1) / r)
        const compoundFactor = Math.pow(1 + monthlyRate, n);
        requiredMonthly = (fv - pv * compoundFactor) / ((compoundFactor - 1) / monthlyRate);
      }

      const totalDeposit = pv + requiredMonthly * n;
      const totalInterest = fv - totalDeposit;

      // 달성과정 표 (연도별)
      const progressTable: { year: number; deposit: number; balance: number }[] = [];
      let balance = pv;
      for (let y = 1; y <= years; y++) {
        for (let m = 0; m < 12; m++) {
          balance = balance * (1 + monthlyRate) + requiredMonthly;
        }
        progressTable.push({
          year: y,
          deposit: pv + requiredMonthly * y * 12,
          balance: Math.round(balance),
        });
      }

      setResults({
        mode: 'monthly',
        requiredMonthly: Math.max(0, requiredMonthly),
        totalDeposit,
        totalInterest,
        targetAmount: fv,
        progressTable,
      });
    } else {
      // 기간 계산
      const pmt = parseFloat(monthlySaving) || 0;
      if (pmt <= 0) {
        alert('월 저축액을 입력해주세요.');
        return;
      }

      // 수치 탐색으로 기간 계산
      let balance = pv;
      let months = 0;
      const maxMonths = 100 * 12;

      while (balance < fv && months < maxMonths) {
        balance = balance * (1 + monthlyRate) + pmt;
        months++;
      }

      if (months >= maxMonths) {
        alert('목표 달성이 어렵습니다. 저축액이나 수익률을 조정해주세요.');
        return;
      }

      const years = months / 12;
      const totalDeposit = pv + pmt * months;
      const totalInterest = balance - totalDeposit;

      // 달성과정 표 (연도별)
      const progressTable: { year: number; deposit: number; balance: number }[] = [];
      let bal = pv;
      const totalYears = Math.ceil(years);
      for (let y = 1; y <= totalYears; y++) {
        const monthsThisYear = y === totalYears ? months - (totalYears - 1) * 12 : 12;
        for (let m = 0; m < monthsThisYear; m++) {
          bal = bal * (1 + monthlyRate) + pmt;
        }
        progressTable.push({
          year: y,
          deposit: pv + pmt * Math.min(y * 12, months),
          balance: Math.round(bal),
        });
      }

      setResults({
        mode: 'period',
        requiredYears: years,
        requiredMonths: months,
        totalDeposit,
        totalInterest,
        targetAmount: fv,
        actualAmount: balance,
        progressTable,
      });
    }
  };

  return (
    <div className="mx-auto max-w-[1200px] px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-fg-muted mb-8">
        <Link href="/" className="hover:text-fg transition-colors">홈</Link>
        <ChevronRight size={12} />
        <span className="text-fg-secondary">투자</span>
        <ChevronRight size={12} />
        <span className="text-fg font-medium">목돈 마련 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">목돈 마련 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        목표 금액 달성을 위한 필요 월 저축액 또는 소요 기간을 계산합니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 목표금액 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              목표금액 (원) *
            </label>
            <input
              type="number"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
          </div>

          {/* 현재 보유액 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              현재 보유액 (원)
            </label>
            <input
              type="number"
              value={currentAmount}
              onChange={(e) => setCurrentAmount(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
          </div>

          {/* 예상 수익률 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              예상 수익률 (연 %)
            </label>
            <input
              type="number"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="5"
              step="0.1"
            />
          </div>

          {/* 계산 모드 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              계산 모드
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'monthly', label: '월 저축액 계산' },
                { val: 'period', label: '기간 계산' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    setMode(val);
                    setResults(null);
                  }}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    mode === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 기간 입력 (월 저축액 계산 모드) */}
          {mode === 'monthly' && (
            <div className="mb-6">
              <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                기간 (년) *
              </label>
              <input
                type="number"
                value={periodYears}
                onChange={(e) => setPeriodYears(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                placeholder="5"
              />
            </div>
          )}

          {/* 월 저축액 입력 (기간 계산 모드) */}
          {mode === 'period' && (
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
      {results && results.mode === 'monthly' && (
        <div className="border border-border rounded-2xl bg-surface p-6 md:p-8 mb-8">
          <h2 className="text-[18px] font-bold text-fg mb-6">계산 결과</h2>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">목표금액</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.targetAmount)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">총 납입원금</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.totalDeposit)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">총 이자 수익</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.totalInterest)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">필요 월 저축액</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {formatNumber(results.requiredMonthly)}원
            </span>
          </div>

          {/* 달성과정 표 */}
          {results.progressTable && results.progressTable.length > 0 && (
            <div className="mt-6">
              <h3 className="text-[14px] font-semibold text-fg mb-3">연도별 달성 과정</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-fg-secondary font-medium">연차</th>
                      <th className="text-right py-2 text-fg-secondary font-medium">누적 납입액</th>
                      <th className="text-right py-2 text-fg-secondary font-medium">예상 잔액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.progressTable.map((row: any) => (
                      <tr key={row.year} className="border-b border-border">
                        <td className="py-2 text-fg">{row.year}년</td>
                        <td className="py-2 text-right text-fg tabular-nums">{formatNumber(row.deposit)}원</td>
                        <td className="py-2 text-right text-fg tabular-nums">{formatNumber(row.balance)}원</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {results && results.mode === 'period' && (
        <div className="border border-border rounded-2xl bg-surface p-6 md:p-8 mb-8">
          <h2 className="text-[18px] font-bold text-fg mb-6">계산 결과</h2>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">목표금액</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.targetAmount)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">총 납입원금</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.totalDeposit)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">총 이자 수익</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.totalInterest)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">달성 기간</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              약 {results.requiredYears.toFixed(1)}년 ({results.requiredMonths}개월)
            </span>
          </div>

          {/* 달성과정 표 */}
          {results.progressTable && results.progressTable.length > 0 && (
            <div className="mt-6">
              <h3 className="text-[14px] font-semibold text-fg mb-3">연도별 달성 과정</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-fg-secondary font-medium">연차</th>
                      <th className="text-right py-2 text-fg-secondary font-medium">누적 납입액</th>
                      <th className="text-right py-2 text-fg-secondary font-medium">예상 잔액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.progressTable.map((row: any) => (
                      <tr key={row.year} className="border-b border-border">
                        <td className="py-2 text-fg">{row.year}년</td>
                        <td className="py-2 text-right text-fg tabular-nums">{formatNumber(row.deposit)}원</td>
                        <td className="py-2 text-right text-fg tabular-nums">{formatNumber(row.balance)}원</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 복리 효과로 기간이 길수록 이자 수익이 크게 늘어납니다.</li>
          <li>· 초기 자금(시드머니)이 클수록 목표 달성 기간이 단축됩니다.</li>
          <li>· 수익률은 세전 기준이므로, 실제 수익은 세금을 고려해야 합니다.</li>
          <li>· 정기적으로 저축 계획을 점검하고 수정하는 것이 중요합니다.</li>
        </ul>
      </div>
    </div>
  );
}
