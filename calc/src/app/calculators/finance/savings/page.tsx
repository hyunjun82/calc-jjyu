'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface SavingsResult {
  monthlyAmount: number;
  totalDeposit: number;
  preInterest: number;
  tax: number;
  postInterest: number;
  maturityAmount: number;
}

export default function SavingsCalculator() {
  const [monthlyAmount, setMonthlyAmount] = useState(500000);
  const [annualRate, setAnnualRate] = useState(3.5);
  const [duration, setDuration] = useState(24);
  const [taxType, setTaxType] = useState('general');

  const taxRate = useMemo(() => {
    switch (taxType) {
      case 'general':
        return 0.154;
      case 'preferred':
        return 0.095;
      case 'taxfree':
        return 0;
      default:
        return 0.154;
    }
  }, [taxType]);

  const result = useMemo<SavingsResult | null>(() => {
    if (!monthlyAmount || !annualRate || !duration) return null;

    const totalDeposit = monthlyAmount * duration;
    const monthlyRate = annualRate / 100 / 12;

    // 정액적립식 이자 계산
    // 세전이자 = 월적립액 × (연이율/12) × n(n+1)/2
    const preInterest =
      monthlyAmount * monthlyRate * (duration * (duration + 1)) / 2;

    const tax = preInterest * taxRate;
    const postInterest = preInterest - tax;
    const maturityAmount = totalDeposit + postInterest;

    return {
      monthlyAmount,
      totalDeposit,
      preInterest,
      tax,
      postInterest,
      maturityAmount,
    };
  }, [monthlyAmount, annualRate, duration, taxRate]);

  const handleCalculate = () => {
    // 계산은 useMemo에 의해 자동으로 수행됨
  };

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
          <span className="text-slate-900 font-medium">적금 계산기</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-3xl font-bold text-slate-900">적금 계산기</h1>
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
              금융
            </span>
          </div>
          <p className="text-slate-600">
            매월 일정액을 적립했을 때 세금을 고려하여 만기수령액을 계산해보세요.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">계산 설정</h2>

              <div className="space-y-4">
                {/* 월 적립액 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    월 적립액 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={monthlyAmount}
                      onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-slate-600">원</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {monthlyAmount.toLocaleString('ko-KR')} 원
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

                {/* 적립기간 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    적립기간 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-slate-600">개월</span>
                  </div>
                </div>

                {/* 이자과세 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    이자과세 <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="general"
                        checked={taxType === 'general'}
                        onChange={(e) => setTaxType(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm text-slate-700">일반과세 (15.4%)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="preferred"
                        checked={taxType === 'preferred'}
                        onChange={(e) => setTaxType(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm text-slate-700">세금우대 (9.5%)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="taxfree"
                        checked={taxType === 'taxfree'}
                        onChange={(e) => setTaxType(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm text-slate-700">비과세 (0%)</span>
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
                    <p className="text-sm text-slate-600 mb-1">월 적립액</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {result.monthlyAmount.toLocaleString('ko-KR', {
                        maximumFractionDigits: 0,
                      })}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">원</p>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-4">
                    <p className="text-sm text-slate-600 mb-1">적립기간</p>
                    <p className="text-2xl font-bold text-slate-900">{duration}</p>
                    <p className="text-xs text-slate-500 mt-1">개월</p>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-4">
                    <p className="text-sm text-slate-600 mb-1">총 납입액</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {result.totalDeposit.toLocaleString('ko-KR', {
                        maximumFractionDigits: 0,
                      })}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">원</p>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-4">
                    <p className="text-sm text-slate-600 mb-1">세전이자</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {result.preInterest.toLocaleString('ko-KR', {
                        maximumFractionDigits: 0,
                      })}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">원</p>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-4">
                    <p className="text-sm text-slate-600 mb-1">세금</p>
                    <p className="text-2xl font-bold text-red-600">
                      {result.tax.toLocaleString('ko-KR', {
                        maximumFractionDigits: 0,
                      })}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">원</p>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-4">
                    <p className="text-sm text-slate-600 mb-1">세후이자</p>
                    <p className="text-2xl font-bold text-green-600">
                      {result.postInterest.toLocaleString('ko-KR', {
                        maximumFractionDigits: 0,
                      })}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">원</p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-4 sm:col-span-2">
                    <p className="text-sm text-slate-600 mb-1">만기수령액</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {result.maturityAmount.toLocaleString('ko-KR', {
                        maximumFractionDigits: 0,
                      })}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">원</p>
                  </div>
                </div>

                {/* Analysis */}
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="font-semibold text-slate-900 mb-3">📊 비교</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-700">이자 비율</span>
                      <span className="font-semibold text-slate-900">
                        {((result.preInterest / result.totalDeposit) * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-700">세후 이자 비율</span>
                      <span className="font-semibold text-green-600">
                        {((result.postInterest / result.totalDeposit) * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-200">
                      <span className="text-slate-700">순 수익률</span>
                      <span className="font-semibold text-blue-600">
                        {((result.postInterest / result.totalDeposit) * 100).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-900 mb-2">💡 팁</h3>
                  <ul className="text-sm text-slate-700 space-y-1">
                    <li>• 적금은 매월 일정액을 저축하는 상품으로 저축 습관에 좋음</li>
                    <li>• 예금보다 이자가 높은 편이나, 중도해지 시 페널티가 있을 수 있음</li>
                    <li>• 세금우대 대상자는 더 높은 세후 수익을 기대할 수 있음</li>
                    <li>• 금리가 높아질 것으로 예상되면 짧은 기간 적금이 유리</li>
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
