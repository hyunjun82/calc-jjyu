'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function DSRCalculator() {
  const [annualIncome, setAnnualIncome] = useState('');
  const [housePrice, setHousePrice] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanPeriod, setLoanPeriod] = useState('');
  const [existingRepayment, setExistingRepayment] = useState('0');
  const [regionType, setRegionType] = useState('general');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const handleCalculate = () => {
    const income = parseFloat(annualIncome) || 0;
    const price = parseFloat(housePrice) || 0;
    const loan = parseFloat(loanAmount) || 0;
    const rate = parseFloat(interestRate) || 0;
    const period = parseFloat(loanPeriod) || 0;
    const existing = parseFloat(existingRepayment) || 0;

    if (income <= 0 || price <= 0 || loan <= 0 || rate <= 0 || period <= 0) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    // LTV 계산
    const ltv = (loan / price) * 100;
    const ltvLimit = regionType === 'general' ? 70 : regionType === 'adjusted' ? 50 : 40;
    const maxLoanByLTV = price * (ltvLimit / 100);

    // 연간 원리금상환액 (원리금균등상환 기준)
    const monthlyRate = rate / 100 / 12;
    const totalMonths = period * 12;
    const monthlyPayment = loan * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    const annualRepayment = monthlyPayment * 12;

    // DTI 계산: (주담대 연원리금 + 기타대출 연이자) / 연소득
    const dti = ((annualRepayment + existing) / income) * 100;

    // DSR 계산: (모든 대출 연원리금 합계 / 연소득)
    const dsr = ((annualRepayment + existing) / income) * 100;
    const dsrLimit = 40;

    // DSR 기준 최대 대출 가능액
    const maxAnnualRepayment = income * (dsrLimit / 100) - existing;
    const maxLoanByDSR = maxAnnualRepayment > 0
      ? maxAnnualRepayment / 12 * (Math.pow(1 + monthlyRate, totalMonths) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))
      : 0;

    const maxLoan = Math.min(maxLoanByLTV, maxLoanByDSR > 0 ? maxLoanByDSR : maxLoanByLTV);

    setResults({
      ltv,
      ltvLimit,
      ltvExceeded: ltv > ltvLimit,
      dti,
      dsr,
      dsrLimit,
      dsrExceeded: dsr > dsrLimit,
      annualRepayment,
      monthlyPayment,
      maxLoanByLTV,
      maxLoanByDSR: maxLoanByDSR > 0 ? maxLoanByDSR : 0,
      maxLoan: maxLoan > 0 ? maxLoan : 0,
    });
  };

  return (
    <div className="mx-auto max-w-[1200px] px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-fg-muted mb-8">
        <Link href="/" className="hover:text-fg transition-colors">홈</Link>
        <ChevronRight size={12} />
        <span className="text-fg-secondary">부동산</span>
        <ChevronRight size={12} />
        <span className="text-fg font-medium">DSR 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">주택담보대출 한도(DSR) 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        DSR(총부채원리금상환비율), LTV, DTI를 계산하여 대출 한도를 확인합니다.
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

          {/* 주택가격 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              주택가격 (담보가치, 원) *
            </label>
            <input
              type="number"
              value={housePrice}
              onChange={(e) => setHousePrice(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
          </div>

          {/* 희망 대출금액 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              희망 대출금액 (원) *
            </label>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
          </div>

          {/* 대출금리 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              대출금리 (%) *
            </label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
              step="0.1"
            />
          </div>

          {/* 대출기간 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              대출기간 (년) *
            </label>
            <input
              type="number"
              value={loanPeriod}
              onChange={(e) => setLoanPeriod(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="30"
            />
          </div>

          {/* 기존 대출 연상환액 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              기존 대출 연상환액 (원)
            </label>
            <input
              type="number"
              value={existingRepayment}
              onChange={(e) => setExistingRepayment(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              기존 보유 대출의 연간 원리금 상환 합계
            </p>
          </div>

          {/* 지역구분 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              지역 구분
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'general', label: '일반 (LTV 70%)' },
                { val: 'adjusted', label: '조정지역 (LTV 50%)' },
                { val: 'speculative', label: '투기과열 (LTV 40%)' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setRegionType(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    regionType === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
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
            <span className="text-[13px] text-fg-secondary">LTV (담보인정비율)</span>
            <span className={`text-[14px] font-medium tabular-nums ${results.ltvExceeded ? 'text-red-500' : 'text-fg'}`}>
              {results.ltv.toFixed(1)}% {results.ltvExceeded ? '(한도 초과)' : `(한도 ${results.ltvLimit}%)`}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">DTI (총부채상환비율)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.dti.toFixed(1)}%
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">DSR (총부채원리금상환비율)</span>
            <span className={`text-[14px] font-medium tabular-nums ${results.dsrExceeded ? 'text-red-500' : 'text-fg'}`}>
              {results.dsr.toFixed(1)}% {results.dsrExceeded ? '(한도 초과)' : `(한도 ${results.dsrLimit}%)`}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">월 상환액</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.monthlyPayment)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">연간 원리금 상환액</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.annualRepayment)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">LTV 기준 최대 대출액</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.maxLoanByLTV)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">DSR 기준 최대 대출액</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.maxLoanByDSR)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">최대 대출 가능액</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {formatNumber(results.maxLoan)}원
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· DSR은 모든 대출의 연간 원리금 상환액을 연소득으로 나눈 비율입니다.</li>
          <li>· 1억 초과 대출 시 DSR 40% 규제가 적용됩니다.</li>
          <li>· LTV 한도는 지역에 따라 일반 70%, 조정 50%, 투기과열 40%입니다.</li>
          <li>· 실제 대출 한도는 은행 심사 기준에 따라 달라질 수 있습니다.</li>
        </ul>
      </div>
    </div>
  );
}
