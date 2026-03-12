'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface SeveranceResult {
  startDate: string;
  endDate: string;
  employmentDays: number;
  employmentYears: number;
  last3MonthsWages: number;
  bonus3MonthsProportion: number;
  annualLeaveProportion: number;
  totalWagesBase: number;
  dailyAverageWage: number;
  severancePay: number;
  isEligible: boolean;
  eligibilityMessage: string;
}

export default function SeveranceCalculator() {
  const [startDate, setStartDate] = useState('2019-01-15');
  const [endDate, setEndDate] = useState('2024-03-12');
  const [last3MonthsWages, setLast3MonthsWages] = useState(15000000);
  const [bonus3Months, setBonus3Months] = useState(3000000);
  const [annualLeave, setAnnualLeave] = useState(1500000);

  const result = useMemo<SeveranceResult | null>(() => {
    if (!startDate || !endDate || !last3MonthsWages) return null;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // 재직일수 계산
    const employmentDays = Math.floor(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    const employmentYears = employmentDays / 365;

    // 1일 평균임금 계산
    // 3개월 임금 + 상여금 비례분 + 연차수당 비례분
    const bonus3MonthsProportion = bonus3Months * (3 / 12);
    const annualLeaveProportion = annualLeave * (3 / 12);
    const totalWagesBase =
      last3MonthsWages + bonus3MonthsProportion + annualLeaveProportion;

    // 3개월의 일수 (평균 약 90일)
    const daysIn3Months = 90;
    const dailyAverageWage = totalWagesBase / daysIn3Months;

    // 퇴직금 = 1일 평균임금 × 30일 × (재직일수 / 365)
    const severancePay = dailyAverageWage * 30 * (employmentDays / 365);

    // 1년 이상 근무 여부
    const isEligible = employmentDays >= 365;
    const eligibilityMessage = isEligible
      ? `${Math.floor(employmentYears)}년 ${Math.floor((employmentYears % 1) * 12)}개월 근무로 퇴직금 지급 대상입니다.`
      : `${Math.floor(employmentYears)}년 ${Math.floor((employmentYears % 1) * 12)}개월 근무로 퇴직금 미지급 대상입니다. (1년 이상 필요)`;

    return {
      startDate,
      endDate,
      employmentDays,
      employmentYears,
      last3MonthsWages,
      bonus3MonthsProportion,
      annualLeaveProportion,
      totalWagesBase,
      dailyAverageWage,
      severancePay: isEligible ? severancePay : 0,
      isEligible,
      eligibilityMessage,
    };
  }, [startDate, endDate, last3MonthsWages, bonus3Months, annualLeave]);

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
            근로 계산기
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900 font-medium">퇴직금 계산기</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-3xl font-bold text-slate-900">퇴직금 계산기</h1>
            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
              근로
            </span>
          </div>
          <p className="text-slate-600">
            입사일과 퇴사일을 기준으로 퇴직금을 정확하게 계산해보세요.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">계산 설정</h2>

              <div className="space-y-4">
                {/* 입사일 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    입사일 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 퇴사일 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    퇴사일 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 최근 3개월 임금총액 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    최근 3개월 임금총액 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={last3MonthsWages}
                      onChange={(e) => setLast3MonthsWages(Number(e.target.value))}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-slate-600">원</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {last3MonthsWages.toLocaleString('ko-KR')} 원
                  </p>
                </div>

                {/* 최근 3개월 상여금 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    최근 3개월 상여금 (연간기준)
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={bonus3Months}
                      onChange={(e) => setBonus3Months(Number(e.target.value))}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-slate-600">원</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {bonus3Months.toLocaleString('ko-KR')} 원
                  </p>
                </div>

                {/* 연차수당 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    미사용 연차수당 (연간기준)
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={annualLeave}
                      onChange={(e) => setAnnualLeave(Number(e.target.value))}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-slate-600">원</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {annualLeave.toLocaleString('ko-KR')} 원
                  </p>
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
                {/* Eligibility Alert */}
                <div
                  className={`rounded-lg p-4 border ${
                    result.isEligible
                      ? 'bg-green-50 border-green-200'
                      : 'bg-yellow-50 border-yellow-200'
                  }`}
                >
                  <p
                    className={`text-sm font-medium ${
                      result.isEligible ? 'text-green-800' : 'text-yellow-800'
                    }`}
                  >
                    {result.isEligible ? '✓' : '⚠'} {result.eligibilityMessage}
                  </p>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="bg-white rounded-lg shadow-md p-4">
                    <p className="text-sm text-slate-600 mb-1">재직기간</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {Math.floor(result.employmentYears)}년 {Math.floor((result.employmentYears % 1) * 12)}개월
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {result.employmentDays}일
                    </p>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-4">
                    <p className="text-sm text-slate-600 mb-1">1일 평균임금</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {result.dailyAverageWage.toLocaleString('ko-KR', {
                        maximumFractionDigits: 0,
                      })}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">원</p>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-4">
                    <p className="text-sm text-slate-600 mb-1">3개월 임금총액</p>
                    <p className="text-lg font-bold text-slate-900">
                      {result.last3MonthsWages.toLocaleString('ko-KR', {
                        maximumFractionDigits: 0,
                      })}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">원</p>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-4">
                    <p className="text-sm text-slate-600 mb-1">추가 포함항목</p>
                    <p className="text-sm font-semibold text-slate-900 mt-2">
                      상여금 비례: {result.bonus3MonthsProportion.toLocaleString('ko-KR', {
                        maximumFractionDigits: 0,
                      })}원
                    </p>
                    <p className="text-sm font-semibold text-slate-900 mt-1">
                      연차수당 비례: {result.annualLeaveProportion.toLocaleString('ko-KR', {
                        maximumFractionDigits: 0,
                      })}원
                    </p>
                  </div>
                </div>

                {/* Main Result */}
                <div
                  className={`rounded-lg border p-6 ${
                    result.isEligible
                      ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-200'
                      : 'bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200'
                  }`}
                >
                  <p className="text-sm text-slate-600 mb-2">퇴직금</p>
                  <p className="text-4xl font-bold text-green-600">
                    {result.severancePay.toLocaleString('ko-KR', {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    = 1일 평균임금({result.dailyAverageWage.toLocaleString('ko-KR', {
                      maximumFractionDigits: 0,
                    })}원) × 30일 × (재직일수/365)
                  </p>
                </div>

                {/* Calculation Breakdown */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">계산 과정</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                      <span className="text-slate-700">입사일</span>
                      <span className="font-semibold text-slate-900">{result.startDate}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                      <span className="text-slate-700">퇴사일</span>
                      <span className="font-semibold text-slate-900">{result.endDate}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                      <span className="text-slate-700">재직일수</span>
                      <span className="font-semibold text-slate-900">
                        {result.employmentDays}일
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                      <span className="text-slate-700">3개월 임금 기준액</span>
                      <span className="font-semibold text-slate-900">
                        {result.totalWagesBase.toLocaleString('ko-KR', {
                          maximumFractionDigits: 0,
                        })}원
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-3">
                      <span className="text-slate-700 font-semibold">퇴직금</span>
                      <span className="font-bold text-green-600 text-lg">
                        {result.severancePay.toLocaleString('ko-KR', {
                          maximumFractionDigits: 0,
                        })}원
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-900 mb-2">💡 팁</h3>
                  <ul className="text-sm text-slate-700 space-y-1">
                    <li>• 퇴직금은 <strong>1년 이상 근무</strong>한 근로자에게만 지급됩니다.</li>
                    <li>
                      • 1일 평균임금은 최근 3개월 임금, 상여금, 연차수당을 포함하여 계산합니다.
                    </li>
                    <li>• 퇴직금 = 1일 평균임금 × 30일 × (재직일수/365)</li>
                    <li>
                      • 퇴직금은 소득세 및 지방소득세에서 일부 비과세 대상입니다
                      (2023년 기준 1,200만원 한도)
                    </li>
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
