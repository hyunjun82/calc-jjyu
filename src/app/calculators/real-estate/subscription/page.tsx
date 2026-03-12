'use client';

import { useState } from 'react';

interface ScoreBreakdown {
  housingPeriod: number;
  dependents: number;
  accountPeriod: number;
  total: number;
}

export default function SubscriptionPointsPage() {
  const [isMarried, setIsMarried] = useState<boolean>(false);
  const [age, setAge] = useState<string>('30');
  const [housingYears, setHousingYears] = useState<string>('5');
  const [dependents, setDependents] = useState<string>('0');
  const [accountMonths, setAccountMonths] = useState<string>('12');

  const calculateHousingPeriodPoints = (): number => {
    const years = parseFloat(housingYears) || 0;
    const ageNum = parseFloat(age) || 0;

    // 만 30세 미만 미혼
    if (ageNum < 30 && !isMarried) {
      return 0;
    }

    // 1년 미만: 2점
    if (years < 1) return 2;
    // 1~2년: 4점
    if (years < 2) return 4;
    // 2~3년: 6점
    if (years < 3) return 6;
    // 3~4년: 8점
    if (years < 4) return 8;
    // 4~5년: 10점
    if (years < 5) return 10;
    // 5~6년: 12점
    if (years < 6) return 12;
    // 6~7년: 14점
    if (years < 7) return 14;
    // 7~8년: 16점
    if (years < 8) return 16;
    // 8~9년: 18점
    if (years < 9) return 18;
    // 9~10년: 20점
    if (years < 10) return 20;
    // 10~11년: 22점
    if (years < 11) return 22;
    // 11~12년: 24점
    if (years < 12) return 24;
    // 12~13년: 26점
    if (years < 13) return 26;
    // 13~14년: 28점
    if (years < 14) return 28;
    // 14~15년: 30점
    if (years < 15) return 30;
    // 15년 이상: 32점
    return 32;
  };

  const calculateDependentPoints = (): number => {
    const num = parseInt(dependents) || 0;

    if (num === 0) return 5;
    if (num === 1) return 10;
    if (num === 2) return 15;
    if (num === 3) return 20;
    if (num === 4) return 25;
    if (num === 5) return 30;
    if (num >= 6) return 35;

    return 0;
  };

  const calculateAccountPeriodPoints = (): number => {
    const months = parseFloat(accountMonths) || 0;
    const years = months / 12;

    // 6개월 미만: 1점
    if (months < 6) return 1;
    // 6개월~1년: 2점
    if (years < 1) return 2;
    // 1~2년: 3점
    if (years < 2) return 3;
    // 2~3년: 4점
    if (years < 3) return 4;
    // 3~4년: 5점
    if (years < 4) return 5;
    // 4~5년: 6점
    if (years < 5) return 6;
    // 5~6년: 7점
    if (years < 6) return 7;
    // 6~7년: 8점
    if (years < 7) return 8;
    // 7~8년: 9점
    if (years < 8) return 9;
    // 8~9년: 10점
    if (years < 9) return 10;
    // 9~10년: 11점
    if (years < 10) return 11;
    // 10~11년: 12점
    if (years < 11) return 12;
    // 11~12년: 13점
    if (years < 12) return 13;
    // 12~13년: 14점
    if (years < 13) return 14;
    // 13~14년: 15점
    if (years < 14) return 15;
    // 14~15년: 16점
    if (years < 15) return 16;
    // 15년 이상: 17점
    return 17;
  };

  const housingScore = calculateHousingPeriodPoints();
  const dependentScore = calculateDependentPoints();
  const accountScore = calculateAccountPeriodPoints();
  const totalScore = housingScore + dependentScore + accountScore;

  const getCompetitivenessLevel = (): { level: string; color: string; description: string } => {
    if (totalScore >= 70) {
      return {
        level: '매우 높음',
        color: 'text-red-600 bg-red-50',
        description: '당첨 가능성이 높습니다',
      };
    }
    if (totalScore >= 60) {
      return {
        level: '높음',
        color: 'text-orange-600 bg-orange-50',
        description: '당첨 가능성이 있습니다',
      };
    }
    if (totalScore >= 45) {
      return {
        level: '중간',
        color: 'text-yellow-600 bg-yellow-50',
        description: '당첨 가능성이 있으나 경쟁이 있습니다',
      };
    }
    if (totalScore >= 30) {
      return {
        level: '낮음',
        color: 'text-blue-600 bg-blue-50',
        description: '경쟁이 치열합니다',
      };
    }
    return {
      level: '매우 낮음',
      color: 'text-gray-600 bg-gray-50',
      description: '가점 획득이 필요합니다',
    };
  };

  const competitiveness = getCompetitivenessLevel();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 text-sm text-gray-600">
          <span>홈</span>
          <span className="mx-2">&gt;</span>
          <span>부동산</span>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-900 font-medium">청약가점</span>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl font-bold text-gray-900">청약가점 계산기</h1>
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
              부동산
            </span>
          </div>
          <p className="text-gray-600 text-lg">
            주택청약 시 필요한 가점을 정확하게 계산합니다. 무주택기간, 부양가족수, 청약통장 가입기간을 고려합니다.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Calculator Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-blue-25 px-8 py-6 border-b-2 border-blue-200">
            <h2 className="text-xl font-bold text-gray-900">청약가점 입력</h2>
          </div>

          <div className="p-8">
            {/* Category 1: Housing Period (32점 만점) */}
            <div className="mb-8 pb-8 border-b-2 border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="inline-block w-8 h-8 bg-blue-500 text-white rounded-full text-center leading-8 text-sm font-bold">
                  1
                </span>
                무주택기간 (32점 만점)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    나이 (만 나이)
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min="20"
                    max="100"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
                    placeholder="30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    결혼 여부
                  </label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setIsMarried(false)}
                      className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                        !isMarried
                          ? 'bg-blue-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      미혼
                    </button>
                    <button
                      onClick={() => setIsMarried(true)}
                      className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                        isMarried
                          ? 'bg-blue-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      기혼
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  무주택기간 (년)
                </label>
                <input
                  type="number"
                  value={housingYears}
                  onChange={(e) => setHousingYears(e.target.value)}
                  min="0"
                  step="0.1"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
                  placeholder="5"
                />
                <p className="text-xs text-gray-500 mt-2">
                  주택을 소유하지 않은 기간을 입력하세요. (소수점 입력 가능)
                </p>
              </div>
            </div>

            {/* Category 2: Dependents (35점 만점) */}
            <div className="mb-8 pb-8 border-b-2 border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="inline-block w-8 h-8 bg-green-500 text-white rounded-full text-center leading-8 text-sm font-bold">
                  2
                </span>
                부양가족수 (35점 만점)
              </h3>

              <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    onClick={() => setDependents(num.toString())}
                    className={`py-3 px-2 rounded-lg font-semibold transition-all duration-200 text-sm ${
                      dependents === num.toString()
                        ? 'bg-green-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {num === 6 ? '6명+' : num + '명'}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4">
                배우자, 미혼 자녀, 부모님 등 생계를 같이 하는 가족을 포함합니다.
              </p>
            </div>

            {/* Category 3: Account Period (17점 만점) */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="inline-block w-8 h-8 bg-purple-500 text-white rounded-full text-center leading-8 text-sm font-bold">
                  3
                </span>
                청약통장 가입기간 (17점 만점)
              </h3>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  가입기간 (개월)
                </label>
                <input
                  type="number"
                  value={accountMonths}
                  onChange={(e) => setAccountMonths(e.target.value)}
                  min="0"
                  step="1"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
                  placeholder="12"
                />
                <p className="text-xs text-gray-500 mt-2">
                  청약통장을 개설한 이후 현재까지의 개월 수를 입력하세요.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-green-50 to-green-25 px-8 py-6 border-b-2 border-green-200">
            <h2 className="text-xl font-bold text-gray-900">계산 결과</h2>
          </div>

          <div className="p-8">
            {/* Score Breakdown */}
            <div className="space-y-4 mb-8">
              {/* Housing Period Score */}
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <p className="font-semibold text-gray-700">무주택기간</p>
                  <p className="text-xs text-gray-500">최대 32점</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-blue-600">{housingScore}</p>
                  <p className="text-xs text-gray-500">점</p>
                </div>
              </div>

              {/* Dependent Score */}
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <p className="font-semibold text-gray-700">부양가족수</p>
                  <p className="text-xs text-gray-500">최대 35점</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-green-600">{dependentScore}</p>
                  <p className="text-xs text-gray-500">점</p>
                </div>
              </div>

              {/* Account Period Score */}
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div>
                  <p className="font-semibold text-gray-700">청약통장 가입기간</p>
                  <p className="text-xs text-gray-500">최대 17점</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-purple-600">{accountScore}</p>
                  <p className="text-xs text-gray-500">점</p>
                </div>
              </div>
            </div>

            {/* Total Score */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white mb-8">
              <p className="text-lg font-semibold mb-2">총 청약가점</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold">{totalScore}</span>
                <span className="text-lg font-semibold">/ 84점</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-blue-500 h-full transition-all duration-300"
                  style={{ width: `${(totalScore / 84) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 text-right">
                {((totalScore / 84) * 100).toFixed(1)}%
              </p>
            </div>

            {/* Competitiveness Level */}
            <div className={`p-6 rounded-lg border-2 border-current ${competitiveness.color}`}>
              <p className="text-sm font-semibold text-gray-600 mb-2">경쟁력 평가</p>
              <p className="text-2xl font-bold mb-2">{competitiveness.level}</p>
              <p className="text-sm">{competitiveness.description}</p>
            </div>
          </div>
        </div>

        {/* Score Guidelines */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-gray-50 to-gray-25 px-8 py-6 border-b-2 border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">가점 기준표</h2>
          </div>

          {/* Housing Period Table */}
          <div className="p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">1. 무주택기간 (32점 만점)</h3>
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b-2 border-gray-200">
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">기간</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">가점</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">기간</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">가점</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 hover:bg-blue-50">
                    <td className="px-4 py-3">만 30세 미만 미혼</td>
                    <td className="px-4 py-3 font-medium">0점</td>
                    <td className="px-4 py-3">10~11년</td>
                    <td className="px-4 py-3 font-medium">22점</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-blue-50">
                    <td className="px-4 py-3">1년 미만</td>
                    <td className="px-4 py-3 font-medium">2점</td>
                    <td className="px-4 py-3">11~12년</td>
                    <td className="px-4 py-3 font-medium">24점</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-blue-50">
                    <td className="px-4 py-3">1~2년</td>
                    <td className="px-4 py-3 font-medium">4점</td>
                    <td className="px-4 py-3">12~13년</td>
                    <td className="px-4 py-3 font-medium">26점</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-blue-50">
                    <td className="px-4 py-3">2~3년</td>
                    <td className="px-4 py-3 font-medium">6점</td>
                    <td className="px-4 py-3">13~14년</td>
                    <td className="px-4 py-3 font-medium">28점</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-blue-50">
                    <td className="px-4 py-3">3~4년</td>
                    <td className="px-4 py-3 font-medium">8점</td>
                    <td className="px-4 py-3">14~15년</td>
                    <td className="px-4 py-3 font-medium">30점</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-blue-50">
                    <td className="px-4 py-3">4~5년</td>
                    <td className="px-4 py-3 font-medium">10점</td>
                    <td className="px-4 py-3">15년 이상</td>
                    <td className="px-4 py-3 font-medium">32점</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-blue-50">
                    <td className="px-4 py-3">5~6년</td>
                    <td className="px-4 py-3 font-medium">12점</td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-blue-50">
                    <td className="px-4 py-3">6~7년</td>
                    <td className="px-4 py-3 font-medium">14점</td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-blue-50">
                    <td className="px-4 py-3">7~8년</td>
                    <td className="px-4 py-3 font-medium">16점</td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-blue-50">
                    <td className="px-4 py-3">8~9년</td>
                    <td className="px-4 py-3 font-medium">18점</td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr className="hover:bg-blue-50">
                    <td className="px-4 py-3">9~10년</td>
                    <td className="px-4 py-3 font-medium">20점</td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Dependent Table */}
            <h3 className="text-lg font-bold text-gray-900 mb-4">2. 부양가족수 (35점 만점)</h3>
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b-2 border-gray-200">
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">가족수</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">0명</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">1명</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">2명</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">3명</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">4명</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">5명</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">6명+</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-gray-50 border-b border-gray-200 hover:bg-blue-50">
                    <td className="px-4 py-3 font-semibold text-gray-700">가점</td>
                    <td className="px-4 py-3 font-medium">5점</td>
                    <td className="px-4 py-3 font-medium">10점</td>
                    <td className="px-4 py-3 font-medium">15점</td>
                    <td className="px-4 py-3 font-medium">20점</td>
                    <td className="px-4 py-3 font-medium">25점</td>
                    <td className="px-4 py-3 font-medium">30점</td>
                    <td className="px-4 py-3 font-medium">35점</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Account Period Table */}
            <h3 className="text-lg font-bold text-gray-900 mb-4">3. 청약통장 가입기간 (17점 만점)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b-2 border-gray-200">
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">기간</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">가점</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">기간</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">가점</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 hover:bg-blue-50">
                    <td className="px-4 py-3">6개월 미만</td>
                    <td className="px-4 py-3 font-medium">1점</td>
                    <td className="px-4 py-3">9~10년</td>
                    <td className="px-4 py-3 font-medium">11점</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-blue-50">
                    <td className="px-4 py-3">6개월~1년</td>
                    <td className="px-4 py-3 font-medium">2점</td>
                    <td className="px-4 py-3">10~11년</td>
                    <td className="px-4 py-3 font-medium">12점</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-blue-50">
                    <td className="px-4 py-3">1~2년</td>
                    <td className="px-4 py-3 font-medium">3점</td>
                    <td className="px-4 py-3">11~12년</td>
                    <td className="px-4 py-3 font-medium">13점</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-blue-50">
                    <td className="px-4 py-3">2~3년</td>
                    <td className="px-4 py-3 font-medium">4점</td>
                    <td className="px-4 py-3">12~13년</td>
                    <td className="px-4 py-3 font-medium">14점</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-blue-50">
                    <td className="px-4 py-3">3~4년</td>
                    <td className="px-4 py-3 font-medium">5점</td>
                    <td className="px-4 py-3">13~14년</td>
                    <td className="px-4 py-3 font-medium">15점</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-blue-50">
                    <td className="px-4 py-3">4~5년</td>
                    <td className="px-4 py-3 font-medium">6점</td>
                    <td className="px-4 py-3">14~15년</td>
                    <td className="px-4 py-3 font-medium">16점</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-blue-50">
                    <td className="px-4 py-3">5~6년</td>
                    <td className="px-4 py-3 font-medium">7점</td>
                    <td className="px-4 py-3">15년 이상</td>
                    <td className="px-4 py-3 font-medium">17점</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-blue-50">
                    <td className="px-4 py-3">6~7년</td>
                    <td className="px-4 py-3 font-medium">8점</td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-blue-50">
                    <td className="px-4 py-3">7~8년</td>
                    <td className="px-4 py-3 font-medium">9점</td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr className="hover:bg-blue-50">
                    <td className="px-4 py-3">8~9년</td>
                    <td className="px-4 py-3 font-medium">10점</td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
            <span className="text-xl">💡</span> 알아두기
          </h3>
          <ul className="space-y-3 text-sm text-blue-800">
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span>
                청약가점은 주택청약 시 당첨 순위를 결정하는 중요한 요소입니다. 최대 84점입니다.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span>
                무주택기간은 주택을 소유하지 않은 기간으로, 혼인, 신청인의 나이 등에 따라 달라집니다.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span>
                부양가족수는 배우자, 미혼 자녀, 부모님 등 생계를 같이 하는 가족을 포함합니다.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span>
                청약통장은 6개월 이상 가입해야 일반 청약에 참가할 수 있습니다.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span>
                정확한 가점 계산은 LH 주택청약 시스템에서 확인하시기 바랍니다.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
