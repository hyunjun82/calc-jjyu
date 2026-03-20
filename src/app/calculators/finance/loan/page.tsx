'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface ScheduleItem {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

interface LoanResult {
  monthlyPayment: number;
  firstMonthPayment?: number;
  lastMonthPayment?: number;
  totalPayment: number;
  totalInterest: number;
  schedule: ScheduleItem[];
}

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(50000000);
  const [annualRate, setAnnualRate] = useState(3.5);
  const [duration, setDuration] = useState(10);
  const [durationType, setDurationType] = useState('year');
  const [repaymentType, setRepaymentType] = useState('equal-payment');
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  const result = useMemo<LoanResult | null>(() => {
    if (!loanAmount || annualRate === null || annualRate === undefined || !duration) return null;

    const totalMonths = durationType === 'year' ? duration * 12 : duration;
    const monthlyRate = annualRate / 100 / 12;

    if (repaymentType === 'equal-payment') {
      // 원리금균등
      const monthlyPayment = monthlyRate === 0
        ? loanAmount / totalMonths
        : loanAmount *
          ((monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
            (Math.pow(1 + monthlyRate, totalMonths) - 1));

      let balance = loanAmount;
      const schedule: ScheduleItem[] = [];

      for (let month = 1; month <= totalMonths; month++) {
        const interest = balance * monthlyRate;
        const principal = monthlyPayment - interest;
        balance -= principal;

        schedule.push({
          month,
          payment: monthlyPayment,
          principal,
          interest,
          balance: Math.max(0, balance),
        });
      }

      return {
        monthlyPayment,
        totalPayment: monthlyPayment * totalMonths,
        totalInterest: monthlyPayment * totalMonths - loanAmount,
        schedule,
      };
    } else if (repaymentType === 'equal-principal') {
      // 원금균등
      const principalPayment = loanAmount / totalMonths;
      let balance = loanAmount;
      const schedule: ScheduleItem[] = [];

      for (let month = 1; month <= totalMonths; month++) {
        const interest = balance * monthlyRate;
        const payment = principalPayment + interest;
        balance -= principalPayment;

        schedule.push({
          month,
          payment,
          principal: principalPayment,
          interest,
          balance: Math.max(0, balance),
        });
      }

      const firstPayment = schedule[0].payment;
      const lastPayment = schedule[schedule.length - 1].payment;
      const totalPayment = schedule.reduce((sum, item) => sum + item.payment, 0);

      return {
        monthlyPayment: principalPayment,
        firstMonthPayment: firstPayment,
        lastMonthPayment: lastPayment,
        totalPayment,
        totalInterest: totalPayment - loanAmount,
        schedule,
      };
    } else {
      // 만기일시상환
      const monthlyInterest = loanAmount * monthlyRate;
      const totalPayment = loanAmount + monthlyInterest * totalMonths;
      const schedule: ScheduleItem[] = [];

      for (let month = 1; month <= totalMonths; month++) {
        const isLastMonth = month === totalMonths;
        const payment = isLastMonth ? loanAmount + monthlyInterest : monthlyInterest;

        schedule.push({
          month,
          payment,
          principal: isLastMonth ? loanAmount : 0,
          interest: monthlyInterest,
          balance: isLastMonth ? 0 : loanAmount,
        });
      }

      return {
        monthlyPayment: monthlyInterest,
        totalPayment,
        totalInterest: monthlyInterest * totalMonths,
        schedule,
      };
    }
  }, [loanAmount, annualRate, duration, durationType, repaymentType]);

  const handleCalculate = () => {
    // 계산은 useMemo에 의해 자동으로 수행됨
  };

  const displaySchedule = showFullSchedule ? result?.schedule : result?.schedule.slice(0, 12);

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-fg-muted mb-8">
        <Link href="/" className="hover:text-fg transition-colors">홈</Link>
        <ChevronRight size={12} />
        <span className="text-fg-secondary">금융 계산기</span>
        <ChevronRight size={12} />
        <span className="text-fg font-medium">대출이자 계산기</span>
      </nav>

      {/* Title */}
      <div className="mb-8">
        <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-3">대출이자 계산기</h1>
        <p className="text-[15px] text-fg-secondary">
          대출 상환 방식에 따른 월 납부액, 총 이자, 상환 스케줄을 계산해보세요.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="border border-border rounded-2xl bg-surface p-6 sticky top-20">
            <h2 className="text-[16px] font-semibold text-fg mb-5">계산 설정</h2>

            <div className="space-y-4">
              {/* 대출금액 */}
              <div>
                <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                  대출금액 <span className="text-negative">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                  />
                  <span className="text-[13px] text-fg-muted">원</span>
                </div>
                <p className="text-[12px] text-fg-muted mt-1.5">
                  {loanAmount.toLocaleString('ko-KR')} 원
                </p>
              </div>

              {/* 연이율 */}
              <div>
                <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                  연이율 <span className="text-negative">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={annualRate}
                    onChange={(e) => setAnnualRate(Number(e.target.value))}
                    step="0.01"
                    className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                  />
                  <span className="text-[13px] text-fg-muted">%</span>
                </div>
              </div>

              {/* 대출기간 */}
              <div>
                <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                  대출기간 <span className="text-negative">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                  />
                  <select
                    value={durationType}
                    onChange={(e) => setDurationType(e.target.value)}
                    className="h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                  >
                    <option value="year">년</option>
                    <option value="month">개월</option>
                  </select>
                </div>
              </div>

              {/* 상환방식 */}
              <div>
                <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                  상환방식 <span className="text-negative">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'equal-payment', label: '원리금균등' },
                    { value: 'equal-principal', label: '원금균등' },
                    { value: 'bullet', label: '만기일시상환' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setRepaymentType(option.value)}
                      className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                        repaymentType === option.value
                          ? 'bg-accent text-accent-fg'
                          : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCalculate}
                className="w-full h-11 bg-accent hover:bg-accent-hover text-accent-fg font-medium rounded-xl transition-colors"
              >
                계산하기
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          {result && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="border border-border rounded-xl bg-surface p-4">
                  <p className="text-[13px] text-fg-secondary mb-1">월 납부액</p>
                  <p className="text-[22px] font-bold text-fg tabular-nums">
                    {result.monthlyPayment.toLocaleString('ko-KR', {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p className="text-[12px] text-fg-muted mt-1">원</p>
                </div>

                <div className="border border-border rounded-xl bg-surface p-4">
                  <p className="text-[13px] text-fg-secondary mb-1">총 이자</p>
                  <p className="text-[22px] font-bold text-fg tabular-nums">
                    {result.totalInterest.toLocaleString('ko-KR', {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p className="text-[12px] text-fg-muted mt-1">원</p>
                </div>

                <div className="border border-border rounded-xl bg-surface p-4">
                  <p className="text-[13px] text-fg-secondary mb-1">총 상환금액</p>
                  <p className="text-[22px] font-bold text-fg tabular-nums">
                    {result.totalPayment.toLocaleString('ko-KR', {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p className="text-[12px] text-fg-muted mt-1">원</p>
                </div>

                {result.firstMonthPayment && (
                  <div className="border border-border rounded-xl bg-surface p-4">
                    <p className="text-[13px] text-fg-secondary mb-1">첫 달 / 마지막 달</p>
                    <p className="text-[14px] font-bold text-fg tabular-nums">
                      {result.firstMonthPayment.toLocaleString('ko-KR', {
                        maximumFractionDigits: 0,
                      })}
                      <span className="text-fg-muted mx-1">/</span>
                      {result.lastMonthPayment?.toLocaleString('ko-KR', {
                        maximumFractionDigits: 0,
                      })}
                    </p>
                    <p className="text-[12px] text-fg-muted mt-1">원</p>
                  </div>
                )}
              </div>

              {/* Schedule Table */}
              <div className="border border-border rounded-xl bg-surface overflow-hidden">
                <div className="flex items-center justify-between p-4">
                  <h3 className="text-[16px] font-semibold text-fg">상환 스케줄</h3>
                  {result.schedule.length > 12 && (
                    <button
                      onClick={() => setShowFullSchedule(!showFullSchedule)}
                      className="text-[13px] text-fg-secondary hover:text-fg font-medium"
                    >
                      {showFullSchedule ? '접기' : '펼치기'}
                    </button>
                  )}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-bg-secondary border-b border-border">
                      <tr>
                        <th className="text-left text-[13px] font-medium text-fg-secondary px-4 py-3">
                          월
                        </th>
                        <th className="text-right text-[13px] font-medium text-fg-secondary px-4 py-3">
                          납부액
                        </th>
                        <th className="text-right text-[13px] font-medium text-fg-secondary px-4 py-3">
                          원금
                        </th>
                        <th className="text-right text-[13px] font-medium text-fg-secondary px-4 py-3">
                          이자
                        </th>
                        <th className="text-right text-[13px] font-medium text-fg-secondary px-4 py-3">
                          잔금
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {displaySchedule?.map((item, idx) => (
                        <tr
                          key={idx}
                          className={
                            idx % 2 === 0
                              ? 'bg-surface'
                              : 'bg-bg-secondary'
                          }
                        >
                          <td className="text-[13px] text-fg tabular-nums px-4 py-2.5 font-medium">
                            {item.month}
                          </td>
                          <td className="text-right text-[13px] text-fg tabular-nums px-4 py-2.5">
                            {item.payment.toLocaleString('ko-KR', {
                              maximumFractionDigits: 0,
                            })}
                          </td>
                          <td className="text-right text-[13px] text-fg tabular-nums px-4 py-2.5">
                            {item.principal.toLocaleString('ko-KR', {
                              maximumFractionDigits: 0,
                            })}
                          </td>
                          <td className="text-right text-[13px] text-fg tabular-nums px-4 py-2.5">
                            {item.interest.toLocaleString('ko-KR', {
                              maximumFractionDigits: 0,
                            })}
                          </td>
                          <td className="text-right text-[13px] text-fg tabular-nums px-4 py-2.5 font-medium">
                            {item.balance.toLocaleString('ko-KR', {
                              maximumFractionDigits: 0,
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {!showFullSchedule && result.schedule.length > 12 && (
                  <p className="text-[12px] text-fg-muted px-4 py-3">
                    처음 12개월만 표시됩니다.
                  </p>
                )}
              </div>

              {/* Tips */}
              <div className="border border-border rounded-xl bg-bg-secondary p-5">
                <h3 className="text-[14px] font-semibold text-fg mb-3">팁</h3>
                <ul className="text-[13px] text-fg-secondary leading-relaxed space-y-1">
                  <li>· 원리금균등: 매월 동일한 금액을 납부하는 가장 일반적인 방식</li>
                  <li>· 원금균등: 초반에는 많이 내고 점차 감소하는 방식</li>
                  <li>· 만기일시상환: 이자만 내다가 마지막에 원금을 일시 상환</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
