'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface DepositResult {
  principal: number;
  preInterest: number;
  tax: number;
  postInterest: number;
  maturityAmount: number;
  monthlyInterest?: number;
  monthlyTax?: number;
  monthlyPostInterest?: number;
}

export default function DepositCalculator() {
  const [principal, setPrincipal] = useState(10000000);
  const [annualRate, setAnnualRate] = useState(3.5);
  const [duration, setDuration] = useState(12);
  const [taxType, setTaxType] = useState('general');
  const [interestType, setInterestType] = useState('maturity');

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

  const result = useMemo<DepositResult | null>(() => {
    if (!principal || !annualRate || !duration) return null;

    // 세전이자 = 원금 × 이율 × (기간/12)
    const preInterest = principal * (annualRate / 100) * (duration / 12);
    const tax = preInterest * taxRate;
    const postInterest = preInterest - tax;
    const maturityAmount = principal + postInterest;

    if (interestType === 'maturity') {
      return {
        principal,
        preInterest,
        tax,
        postInterest,
        maturityAmount,
      };
    } else {
      // 월이자지급
      const monthlyInterest = (principal * (annualRate / 100)) / 12;
      const monthlyTax = monthlyInterest * taxRate;
      const monthlyPostInterest = monthlyInterest - monthlyTax;

      return {
        principal,
        preInterest,
        tax,
        postInterest,
        maturityAmount,
        monthlyInterest,
        monthlyTax,
        monthlyPostInterest,
      };
    }
  }, [principal, annualRate, duration, taxRate, interestType]);

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
          <span className="text-slate-900 font-medium">예금 계산기</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-3xl font-bold text-slate-900">예금 계산기</h1>
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
              금융
            </span>
          </div>
          <p className="text-slate-600">
            예금의 만기수령액과 이자를 세금을 고려하여 정확하게 계산해보세요.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">계산 설정</h2>

              <div className="space-y-4">
                {/* 예치금액 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    예치금액 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={principal}
                      onChange={(e) => setPrincipal(Number(e.target.value))}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-slate-600">원</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {principal.toLocaleString('ko-KR')} 원
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

                {/* 예치기간 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    예치기간 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>1개월</option>
                    <option value={3}>3개월</option>
                    <option value={6}>6개월</option>
                    <option value={12}>12개월</option>
                    <option value={24}>24개월</option>
                    <option value={36}>36개월</option>
                  </select>
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

                {/* 이자지급방식 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    이자지급방식 <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="maturity"
                        checked={interestType === 'maturity'}
                        onChange={(e) => setInterestType(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm text-slate-700">만기일시지급</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="monthly"
                        checked={interestType === 'monthly'}
                        onChange={(e) => setInterestType(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm text-slate-700">월이자지급</span>
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
                <div className="grid gap-4">
                  <div className="bg-white rounded-lg shadow-md p-4">
                    <p className="text-sm text-slate-600 mb-1">예치금액</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {result.principal.toLocaleString('ko-KR', {
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

                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-4">
                    <p className="text-sm text-slate-600 mb-1">만기수령액</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {result.maturityAmount.toLocaleString('ko-KR', {
                        maximumFractionDigits: 0,
                      })}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">원</p>
                  </div>

                  {result.monthlyInterest && (
                    <>
                      <div className="border-t border-slate-200 pt-4 mt-4">
                        <p className="text-sm font-semibold text-slate-900 mb-3">
                          월 이자 수령액
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-white rounded-lg p-3 border border-slate-200">
                            <p className="text-xs text-slate-600 mb-1">세전</p>
                            <p className="text-lg font-bold text-slate-900">
                              {result.monthlyInterest.toLocaleString('ko-KR', {
                                maximumFractionDigits: 0,
                              })}
                            </p>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-slate-200">
                            <p className="text-xs text-slate-600 mb-1">세금</p>
                            <p className="text-lg font-bold text-red-600">
                              {result.monthlyTax?.toLocaleString('ko-KR', {
                                maximumFractionDigits: 0,
                              })}
                            </p>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-slate-200">
                            <p className="text-xs text-slate-600 mb-1">세후</p>
                            <p className="text-lg font-bold text-green-600">
                              {result.monthlyPostInterest?.toLocaleString('ko-KR', {
                                maximumFractionDigits: 0,
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-900 mb-2">💡 팁</h3>
                  <ul className="text-sm text-slate-700 space-y-1">
                    <li>• 일반과세: 대부분의 일반인이 적용받는 세율</li>
                    <li>• 세금우대: 장애인, 국가유공자 등 특정 대상자 적용</li>
                    <li>• 비과세: 개인종합자산관리계좌(ISA) 등 특정 상품 적용</li>
                    <li>• 만기일시지급이 월이자지급보다 복리 이득을 볼 수 있음</li>
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
