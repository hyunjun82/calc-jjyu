'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

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
    if (!loanAmount || !annualRate || !duration) return null;

    const totalMonths = durationType === 'year' ? duration * 12 : duration;
    const monthlyRate = annualRate / 100 / 12;

    if (repaymentType === 'equal-payment') {
      // 원리금균등
      const monthlyPayment =
        loanAmount *
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4 text-sm text-slate-600">
          <Link href="/" className="hover:text-blue-600">
            홈
          </Link>
          <span className="mx-2">/</span>
          <Link href="/calculators" className="hover:text-blue-600">
            금융 계산기
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900 font-medium">대출이자 계산기</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-3xl font-bold text-slate-900">대출이자 계산기</h1>
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
              금융
            </span>
          </div>
          <p className="text-slate-600">
            대출 상환 방식에 따른 월 납부액, 총 이자, 상환 스케줄을 계산해보세요.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">계산 설정</h2>

              <div className="space-y-4">
                {/* 대출금액 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    대출금액 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-slate-600">원</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {loanAmount.toLocaleString('ko-KR')} 원
                  </p>
                </div>

                {/* 연이율 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    연이율 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={annualRate}
                      onChange={(e) => setAnnualRate(Number(e.target.value))}
                      step="0.01"
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-slate-600">%</span>
                  </div>
                </div>

                {/* 대출기간 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    대출기간 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={durationType}
                      onChange={(e) => setDurationType(e.target.value)}
                      className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="year">년</option>
                      <option value="month">개월</option>
                    </select>
                  </div>
                </div>

                {/* 상환방식 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    상환방식 <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="equal-payment"
                        checked={repaymentType === 'equal-payment'}
                        onChange={(e) => setRepaymentType(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm text-slate-700">원리금균등</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="equal-principal"
                        checked={repaymentType === 'equal-principal'}
                        onChange={(e) => setRepaymentType(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm text-slate-700">원금균등</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="bullet"
                        checked={repaymentType === 'bullet'}
                        onChange={(e) => setRepaymentType(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm text-slate-700">만기일시상환</span>
                    </label>
                  </div>
                </div>

                <button
                  onClick={handleCalculate}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
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
                  <div className="bg-white rounded-lg shadow-md p-4">
                    <p className="text-sm text-slate-600 mb-1">월 납부액</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {result.monthlyPayment.toLocaleString('ko-KR', {
                        maximumFractionDigits: 0,
                      })}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">원</p>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-4">
                    <p className="text-sm text-slate-600 mb-1">총 이자</p>
                    <p className="text-2xl font-bold text-red-600">
                      {result.totalInterest.toLocaleString('ko-KR', {
                        maximumFractionDigits: 0,
                      })}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">원</p>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-4">
                    <p className="text-sm text-slate-600 mb-1">총 상환금액</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {result.totalPayment.toLocaleString('ko-KR', {
                        maximumFractionDigits: 0,
                      })}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">원</p>
                  </div>

                  {result.firstMonthPayment && (
                    <div className="bg-white rounded-lg shadow-md p-4">
                      <p className="text-sm text-slate-600 mb-1">첫 달 / 마지막 달</p>
                      <p className="text-sm font-bold text-slate-900">
                        {result.firstMonthPayment.toLocaleString('ko-KR', {
                          maximumFractionDigits: 0,
                        })}
                        <span className="text-slate-500 mx-1">/</span>
                        {result.lastMonthPayment?.toLocaleString('ko-KR', {
                          maximumFractionDigits: 0,
                        })}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">원</p>
                    </div>
                  )}
                </div>

                {/* Schedule Table */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">상환 스케줄</h3>
                    {result.schedule.length > 12 && (
                      <button
                        onClick={() => setShowFullSchedule(!showFullSchedule)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {showFullSchedule ? '접기' : '펼치기'}
                      </button>
                    )}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b border-slate-300 bg-slate-50">
                        <tr>
                          <th className="text-left px-3 py-2 font-semibold text-slate-700">
                            월
                          </th>
                          <th className="text-right px-3 py-2 font-semibold text-slate-700">
                            납부액
                          </th>
                          <th className="text-right px-3 py-2 font-semibold text-slate-700">
                            원금
                          </th>
                          <th className="text-right px-3 py-2 font-semibold text-slate-700">
                            이자
                          </th>
                          <th className="text-right px-3 py-2 font-semibold text-slate-700">
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
                                ? 'bg-white'
                                : 'bg-slate-50'
                            }
                          >
                            <td className="px-3 py-2 text-slate-900 font-medium">
                              {item.month}
                            </td>
                            <td className="text-right px-3 py-2 text-slate-900">
                              {item.payment.toLocaleString('ko-KR', {
                                maximumFractionDigits: 0,
                              })}
                            </td>
                            <td className="text-right px-3 py-2 text-blue-600">
                              {item.principal.toLocaleString('ko-KR', {
                                maximumFractionDigits: 0,
                              })}
                            </td>
                            <td className="text-right px-3 py-2 text-red-600">
                              {item.interest.toLocaleString('ko-KR', {
                                maximumFractionDigits: 0,
                              })}
                            </td>
                            <td className="text-right px-3 py-2 text-slate-900 font-medium">
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
                    <p className="text-xs text-slate-500 mt-2">
                      처음 12개월만 표시됩니다.
                    </p>
                  )}
                </div>

                {/* Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-900 mb-2">💡 팁</h3>
                  <ul className="text-sm text-slate-700 space-y-1">
                    <li>• 원리금균등: 매월 동일한 금액을 납부하는 가장 일반적인 방식</li>
                    <li>• 원금균등: 초반에는 많이 내고 점차 감소하는 방식</li>
                    <li>• 만기일시상환: 이자만 내다가 마지막에 원금을 일시 상환</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
