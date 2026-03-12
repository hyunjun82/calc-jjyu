'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface InflationYear {
  year: number;
  amount: number;
  purchasingPower: number;
  decline: number;
}

interface InflationResult {
  currentAmount: number;
  inflationRate: number;
  years: number;
  futureAmount: number;
  purchasingPower: number;
  declineAmount: number;
  declineRate: number;
  yearlyData: InflationYear[];
}

export default function InflationCalculator() {
  const [currentAmount, setCurrentAmount] = useState(100000000);
  const [inflationRate, setInflationRate] = useState(3);
  const [years, setYears] = useState(10);

  const result = useMemo<InflationResult | null>(() => {
    if (!currentAmount || inflationRate === null || !years) return null;

    const inflationFactor = 1 + inflationRate / 100;
    const futureAmount = currentAmount * Math.pow(inflationFactor, years);
    const purchasingPower = currentAmount / Math.pow(inflationFactor, years);
    const declineAmount = futureAmount - currentAmount;
    const declineRate = (1 - purchasingPower / currentAmount) * 100;

    // 연도별 데이터
    const yearlyData: InflationYear[] = [];
    for (let year = 0; year <= years; year++) {
      const amount = currentAmount * Math.pow(inflationFactor, year);
      const power = currentAmount / Math.pow(inflationFactor, year);
      yearlyData.push({
        year,
        amount,
        purchasingPower: power,
        decline: ((1 - power / currentAmount) * 100),
      });
    }

    return {
      currentAmount,
      inflationRate,
      years,
      futureAmount,
      purchasingPower,
      declineAmount,
      declineRate,
      yearlyData,
    };
  }, [currentAmount, inflationRate, years]);

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
          <span className="text-slate-900 font-medium">인플레이션 계산기</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-3xl font-bold text-slate-900">인플레이션 계산기</h1>
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
              금융
            </span>
          </div>
          <p className="text-slate-600">
            물가상승으로 인한 화폐 가치 하락을 계산하고, 미래의 실질 구매력을 알아보세요.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">계산 설정</h2>

              <div className="space-y-4">
                {/* 현재 금액 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    현재 금액 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={currentAmount}
                      onChange={(e) => setCurrentAmount(Number(e.target.value))}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-slate-600">원</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {currentAmount.toLocaleString('ko-KR')} 원
                  </p>
                </div>

                {/* 연간 물가상승률 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    연간 물가상승률 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={inflationRate}
                      onChange={(e) => setInflationRate(Number(e.target.value))}
                      step="0.1"
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-slate-600">%</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">기본값: 3% (한국 평균)</p>
                </div>

                {/* 기간 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    기간 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={years}
                      onChange={(e) => setYears(Number(e.target.value))}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-slate-600">년</span>
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
                    <p className="text-sm text-slate-600 mb-1">현재 금액</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {result.currentAmount.toLocaleString('ko-KR', {
                        maximumFractionDigits: 0,
                      })}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">원</p>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-4">
                    <p className="text-sm text-slate-600 mb-1">{result.years}년 후 명목가치</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {result.futureAmount.toLocaleString('ko-KR', {
                        maximumFractionDigits: 0,
                      })}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">원</p>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-4">
                    <p className="text-sm text-slate-600 mb-1">{result.years}년 후 실질 구매력</p>
                    <p className="text-2xl font-bold text-red-600">
                      {result.purchasingPower.toLocaleString('ko-KR', {
                        maximumFractionDigits: 0,
                      })}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">원</p>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-4">
                    <p className="text-sm text-slate-600 mb-1">구매력 감소율</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {result.declineRate.toFixed(2)}%
                    </p>
                    <p className="text-xs text-slate-500 mt-1">감소</p>
                  </div>

                  <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200 p-4 sm:col-span-2">
                    <p className="text-sm text-slate-600 mb-1">실질가치 감소액</p>
                    <p className="text-3xl font-bold text-red-600">
                      {(result.currentAmount - result.purchasingPower).toLocaleString('ko-KR', {
                        maximumFractionDigits: 0,
                      })}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">원</p>
                  </div>
                </div>

                {/* Year-by-Year Table */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">연도별 물가상승 현황</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b border-slate-300 bg-slate-50">
                        <tr>
                          <th className="text-left px-3 py-2 font-semibold text-slate-700">
                            연도
                          </th>
                          <th className="text-right px-3 py-2 font-semibold text-slate-700">
                            명목가치
                          </th>
                          <th className="text-right px-3 py-2 font-semibold text-slate-700">
                            실질구매력
                          </th>
                          <th className="text-right px-3 py-2 font-semibold text-slate-700">
                            구매력감소
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.yearlyData.map((item, idx) => (
                          <tr
                            key={idx}
                            className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
                          >
                            <td className="px-3 py-2 text-slate-900 font-medium">
                              {item.year}년
                            </td>
                            <td className="text-right px-3 py-2 text-slate-900">
                              {item.amount.toLocaleString('ko-KR', {
                                maximumFractionDigits: 0,
                              })}
                            </td>
                            <td className="text-right px-3 py-2 text-blue-600">
                              {item.purchasingPower.toLocaleString('ko-KR', {
                                maximumFractionDigits: 0,
                              })}
                            </td>
                            <td className="text-right px-3 py-2 text-red-600 font-medium">
                              {item.decline.toFixed(2)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-900 mb-2">💡 팁</h3>
                  <ul className="text-sm text-slate-700 space-y-1">
                    <li>• 인플레이션은 시간이 지나면서 화폐의 실질 가치를 낮춥니다</li>
                    <li>• 현재 1억원이 10년 후 실질가치로는 얼마나 될지 쉽게 계산할 수 있음</li>
                    <li>• 장기 자산 운용 시 인플레이션을 반드시 고려해야 함</li>
                    <li>• 금리 &gt; 인플레이션율이면 실질 수익이 발생</li>
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
