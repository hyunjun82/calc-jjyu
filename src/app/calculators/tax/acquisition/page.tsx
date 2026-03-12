'use client';

import { useState } from 'react';

export default function AcquisitionTaxCalculator() {
  const [householdCount, setHouseholdCount] = useState('1');
  const [acquisitionAmount, setAcquisitionAmount] = useState('');
  const [isAdjustedArea, setIsAdjustedArea] = useState('no');
  const [houseSize, setHouseSize] = useState('small');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const getAcquisitionTaxRate = (
    household: string,
    amount: number,
    adjusted: boolean
  ): number => {
    if (household === '1') {
      // 1주택: 조정/비조정 동일
      if (amount <= 600000000) return 0.01;
      if (amount <= 900000000) return 0.01 + ((amount - 600000000) / 300000000) * 0.02;
      return 0.03;
    }

    if (household === '2') {
      if (adjusted) return 0.08; // 조정: 8%
      // 비조정: 1~3%
      if (amount <= 600000000) return 0.01;
      if (amount <= 900000000) return 0.01 + ((amount - 600000000) / 300000000) * 0.02;
      return 0.03;
    }

    if (household === '3') {
      if (adjusted) return 0.12; // 조정: 12%
      return 0.08; // 비조정: 8%
    }

    // 4주택 이상, 법인: 12%
    return 0.12;
  };

  const handleCalculate = () => {
    const amount = parseFloat(acquisitionAmount) || 0;

    if (amount <= 0) {
      alert('취득가액을 입력해주세요.');
      return;
    }

    const isAdjusted = isAdjustedArea === 'yes';
    const taxRate = getAcquisitionTaxRate(householdCount, amount, isAdjusted);
    const acquisitionTax = amount * taxRate;

    const ruralSpecialTax = amount * 0.002; // 0.2%
    const localEducationTax = acquisitionTax * 0.1; // 10%
    const totalTax = acquisitionTax + ruralSpecialTax + localEducationTax;

    setResults({
      acquisitionTax,
      ruralSpecialTax,
      localEducationTax,
      totalTax,
      taxRate: (taxRate * 100).toFixed(2),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-6">
          홈 &gt; 세금 &gt; 취득세 계산기
        </nav>

        {/* Title */}
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">취득세 계산기</h1>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
            세금
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          부동산 취득 시 발생하는 취득세를 계산합니다. 주택 수, 조정대상지역 여부에 따른 세율이 적용됩니다.
        </p>

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          {/* 주택수 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              주택 수 선택
            </label>
            <div className="space-y-2">
              {[
                { val: '1', label: '1주택' },
                { val: '2', label: '2주택' },
                { val: '3', label: '3주택' },
                { val: '4', label: '4주택 이상' },
                { val: 'corp', label: '법인' },
              ].map(({ val, label }) => (
                <label key={val} className="flex items-center">
                  <input
                    type="radio"
                    name="household"
                    value={val}
                    checked={householdCount === val}
                    onChange={(e) => setHouseholdCount(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="ml-2 text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 취득가액 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              취득가액 (원) *
            </label>
            <input
              type="number"
              value={acquisitionAmount}
              onChange={(e) => setAcquisitionAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              계약금 + 잔금 합계 금액
            </p>
          </div>

          {/* 조정대상지역 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              조정대상지역 여부
            </label>
            <div className="space-y-2">
              {[
                { val: 'no', label: '아니오' },
                { val: 'yes', label: '예' },
              ].map(({ val, label }) => (
                <label key={val} className="flex items-center">
                  <input
                    type="radio"
                    name="adjusted"
                    value={val}
                    checked={isAdjustedArea === val}
                    onChange={(e) => setIsAdjustedArea(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="ml-2 text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 주택 면적 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              주택 면적
            </label>
            <div className="space-y-2">
              {[
                { val: 'small', label: '85m² 이하' },
                { val: 'large', label: '85m² 초과' },
              ].map(({ val, label }) => (
                <label key={val} className="flex items-center">
                  <input
                    type="radio"
                    name="size"
                    value={val}
                    checked={houseSize === val}
                    onChange={(e) => setHouseSize(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="ml-2 text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Calculate Button */}
          <button
            onClick={handleCalculate}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition"
          >
            계산하기
          </button>
        </div>

        {/* Results */}
        {results && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">계산 결과</h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-gray-700">
                  취득세율
                </span>
                <span className="font-semibold text-gray-900">
                  {results.taxRate}%
                </span>
              </div>

              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-gray-700">취득세</span>
                <span className="font-semibold text-gray-900">
                  {formatNumber(results.acquisitionTax)}원
                </span>
              </div>

              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-gray-700">농어촌특별세 (0.2%)</span>
                <span className="font-semibold text-gray-900">
                  {formatNumber(results.ruralSpecialTax)}원
                </span>
              </div>

              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-gray-700">지방교육세 (10%)</span>
                <span className="font-semibold text-gray-900">
                  {formatNumber(results.localEducationTax)}원
                </span>
              </div>

              <div className="flex justify-between items-center pt-3 bg-green-50 p-4 rounded-lg">
                <span className="text-lg font-bold text-gray-900">총 납부세액</span>
                <span className="text-2xl font-bold text-green-600">
                  {formatNumber(results.totalTax)}원
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-bold text-gray-900 mb-4">계산 팁</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• 1주택의 취득세율은 비교적 낮으나, 2주택 이상은 세율이 인상됩니다.</li>
            <li>• 조정대상지역의 2주택은 8%, 3주택은 12% 세율이 적용됩니다.</li>
            <li>• 농어촌특별세와 지방교육세도 함께 부과됩니다.</li>
            <li>• 취득세는 등기 전에 납부해야 하므로 계획적인 자금 관리가 필요합니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
