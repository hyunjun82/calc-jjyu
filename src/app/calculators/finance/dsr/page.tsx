'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function DSRCalculator() {
  const [annualIncome, setAnnualIncome] = useState('');
  const [newLoanAmount, setNewLoanAmount] = useState('');
  const [newLoanRate, setNewLoanRate] = useState('');
  const [newLoanYears, setNewLoanYears] = useState('30');
  const [existingLoan1, setExistingLoan1] = useState({ type: 'annual', annualPayment: '', amount: '', rate: '', years: '' });
  const [existingLoan2, setExistingLoan2] = useState({ type: 'annual', annualPayment: '', amount: '', rate: '', years: '' });
  const [existingLoan3, setExistingLoan3] = useState({ type: 'annual', annualPayment: '', amount: '', rate: '', years: '' });
  const [stressDSR, setStressDSR] = useState('no');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const calcAnnualPayment = (principal: number, annualRate: number, years: number): number => {
    if (principal <= 0 || annualRate <= 0 || years <= 0) return 0;
    const monthlyRate = annualRate / 12;
    const months = years * 12;
    const monthlyPayment =
      principal *
      (monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    return monthlyPayment * 12;
  };

  const getExistingAnnualPayment = (loan: typeof existingLoan1): number => {
    if (loan.type === 'annual') {
      return parseFloat(loan.annualPayment) || 0;
    }
    const amount = parseFloat(loan.amount) || 0;
    const rate = (parseFloat(loan.rate) || 0) / 100;
    const years = parseFloat(loan.years) || 0;
    return calcAnnualPayment(amount, rate, years);
  };

  const handleCalculate = () => {
    const income = parseFloat(annualIncome) || 0;
    const newAmount = parseFloat(newLoanAmount) || 0;
    let newRate = (parseFloat(newLoanRate) || 0) / 100;
    const newYears = parseFloat(newLoanYears) || 0;

    if (income <= 0) {
      alert('연소득을 입력해주세요.');
      return;
    }

    // 스트레스 DSR 적용 시 가산금리
    if (stressDSR === 'yes') {
      newRate += 0.0038; // 0.38%p 가산
    }

    const newLoanAnnualPayment = calcAnnualPayment(newAmount, newRate, newYears);
    const existing1 = getExistingAnnualPayment(existingLoan1);
    const existing2 = getExistingAnnualPayment(existingLoan2);
    const existing3 = getExistingAnnualPayment(existingLoan3);

    const totalAnnualPayment = newLoanAnnualPayment + existing1 + existing2 + existing3;
    const dsrRatio = (totalAnnualPayment / income) * 100;

    // 최대 대출 가능액 (은행권 40% 기준)
    const maxAnnualPayment40 = income * 0.4 - (existing1 + existing2 + existing3);
    let maxLoanAmount40 = 0;
    if (maxAnnualPayment40 > 0 && newRate > 0 && newYears > 0) {
      const monthlyRate = newRate / 12;
      const months = newYears * 12;
      const maxMonthlyPayment = maxAnnualPayment40 / 12;
      maxLoanAmount40 =
        maxMonthlyPayment *
        (Math.pow(1 + monthlyRate, months) - 1) /
        (monthlyRate * Math.pow(1 + monthlyRate, months));
    }

    // 최대 대출 가능액 (비은행권 50% 기준)
    const maxAnnualPayment50 = income * 0.5 - (existing1 + existing2 + existing3);
    let maxLoanAmount50 = 0;
    if (maxAnnualPayment50 > 0 && newRate > 0 && newYears > 0) {
      const monthlyRate = newRate / 12;
      const months = newYears * 12;
      const maxMonthlyPayment = maxAnnualPayment50 / 12;
      maxLoanAmount50 =
        maxMonthlyPayment *
        (Math.pow(1 + monthlyRate, months) - 1) /
        (monthlyRate * Math.pow(1 + monthlyRate, months));
    }

    const exceeds40 = dsrRatio > 40;
    const exceeds50 = dsrRatio > 50;

    setResults({
      dsrRatio,
      totalAnnualPayment,
      newLoanAnnualPayment,
      existingTotal: existing1 + existing2 + existing3,
      exceeds40,
      exceeds50,
      maxLoanAmount40: Math.max(0, maxLoanAmount40),
      maxLoanAmount50: Math.max(0, maxLoanAmount50),
    });
  };

  const renderExistingLoan = (
    label: string,
    loan: typeof existingLoan1,
    setLoan: React.Dispatch<React.SetStateAction<typeof existingLoan1>>
  ) => (
    <div className="mb-6 p-4 border border-border rounded-xl">
      <label className="block text-[13px] font-medium text-fg-secondary mb-2">{label}</label>
      <div className="flex flex-wrap gap-2 mb-3">
        {[
          { val: 'annual', label: '연간상환액 직접 입력' },
          { val: 'detail', label: '금액+금리+기간 입력' },
        ].map(({ val, label: btnLabel }) => (
          <button
            key={val}
            type="button"
            onClick={() => setLoan({ ...loan, type: val })}
            className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
              loan.type === val
                ? 'bg-accent text-accent-fg'
                : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
            }`}
          >
            {btnLabel}
          </button>
        ))}
      </div>
      {loan.type === 'annual' ? (
        <input
          type="number"
          value={loan.annualPayment}
          onChange={(e) => setLoan({ ...loan, annualPayment: e.target.value })}
          className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
          placeholder="연간 원리금 상환액 (원)"
        />
      ) : (
        <div className="space-y-3">
          <input
            type="number"
            value={loan.amount}
            onChange={(e) => setLoan({ ...loan, amount: e.target.value })}
            className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
            placeholder="대출금액 (원)"
          />
          <input
            type="number"
            value={loan.rate}
            onChange={(e) => setLoan({ ...loan, rate: e.target.value })}
            className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
            placeholder="연이율 (%)"
            step="0.1"
          />
          <input
            type="number"
            value={loan.years}
            onChange={(e) => setLoan({ ...loan, years: e.target.value })}
            className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
            placeholder="대출기간 (년)"
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-[1200px] px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-fg-muted mb-8">
        <Link href="/" className="hover:text-fg transition-colors">홈</Link>
        <ChevronRight size={12} />
        <span className="text-fg-secondary">금융</span>
        <ChevronRight size={12} />
        <span className="text-fg font-medium">DSR 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">DSR 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        총부채원리금상환비율(DSR)을 계산합니다. 모든 대출의 연간 원리금 상환액을 연소득으로 나누어 대출 가능 여부를 확인할 수 있습니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 연소득 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              연소득 (원) *
            </label>
            <input
              type="number"
              value={annualIncome}
              onChange={(e) => setAnnualIncome(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
          </div>

          {/* 스트레스 DSR */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              스트레스 DSR 적용
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'no', label: '미적용' },
                { val: 'yes', label: '적용 (+0.38%p)' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setStressDSR(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    stressDSR === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 신규대출 */}
          <div className="mb-6 p-4 border border-border rounded-xl">
            <label className="block text-[13px] font-medium text-fg mb-3">신규 대출</label>
            <div className="space-y-3">
              <div>
                <label className="block text-[12px] text-fg-muted mb-1">대출금액 (원)</label>
                <input
                  type="number"
                  value={newLoanAmount}
                  onChange={(e) => setNewLoanAmount(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-[12px] text-fg-muted mb-1">연이율 (%)</label>
                <input
                  type="number"
                  value={newLoanRate}
                  onChange={(e) => setNewLoanRate(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                  placeholder="0"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-[12px] text-fg-muted mb-1">대출기간 (년)</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { val: '10', label: '10년' },
                    { val: '20', label: '20년' },
                    { val: '30', label: '30년' },
                    { val: '40', label: '40년' },
                  ].map(({ val, label }) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setNewLoanYears(val)}
                      className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                        newLoanYears === val
                          ? 'bg-accent text-accent-fg'
                          : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 기존대출 */}
          {renderExistingLoan('기존대출 1', existingLoan1, setExistingLoan1)}
          {renderExistingLoan('기존대출 2', existingLoan2, setExistingLoan2)}
          {renderExistingLoan('기존대출 3', existingLoan3, setExistingLoan3)}

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
            <span className="text-[13px] text-fg-secondary">신규대출 연간 원리금</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.newLoanAnnualPayment)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">기존대출 연간 원리금</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.existingTotal)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">총 연간 원리금 상환액</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.totalAnnualPayment)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">은행권 규제 (40%)</span>
            <span className={`text-[14px] font-medium tabular-nums ${results.exceeds40 ? 'text-red-500' : 'text-green-600'}`}>
              {results.exceeds40 ? '초과' : '충족'}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">비은행권 규제 (50%)</span>
            <span className={`text-[14px] font-medium tabular-nums ${results.exceeds50 ? 'text-red-500' : 'text-green-600'}`}>
              {results.exceeds50 ? '초과' : '충족'}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">은행권 최대 대출 가능액 (40% 기준)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.maxLoanAmount40)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">비은행권 최대 대출 가능액 (50% 기준)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.maxLoanAmount50)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">DSR 비율</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {results.dsrRatio.toFixed(2)}%
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· DSR은 모든 대출의 연간 원리금상환액을 연소득으로 나눈 비율입니다.</li>
          <li>· 은행권은 40%, 비은행권은 50%가 규제 기준입니다.</li>
          <li>· 스트레스 DSR은 금리 상승 가능성을 반영하여 가산금리를 적용합니다.</li>
          <li>· 대출기간이 길수록 월 상환액이 줄어 DSR이 낮아집니다.</li>
        </ul>
      </div>
    </div>
  );
}
