'use client';

import { useState } from 'react';

export default function PropertyTaxCalculator() {
  const [publicPrice, setPublicPrice] = useState('');
  const [propertyType, setPropertyType] = useState('house');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const getPropertyTaxRate = (taxableStandard: number): number => {
    if (taxableStandard <= 60000000) return 0.001;
    if (taxableStandard <= 150000000) return 0.0015;
    if (taxableStandard <= 300000000) return 0.0025;
    return 0.004;
  };

  const getProgressiveDeduction = (taxableStandard: number): number => {
    if (taxableStandard <= 60000000) return 0;
    if (taxableStandard <= 150000000) return 30000;
    if (taxableStandard <= 300000000) return 180000;
    return 630000;
  };

  const handleCalculate = () => {
    const price = parseFloat(publicPrice) || 0;

    if (price <= 0) {
      alert('공시가격을 입력해주세요.');
      return;
    }

    // 공정시장가액비율: 60%
    const fairMarketRatio = 0.6;
    const taxableStandard = price * fairMarketRatio;

    // 재산세
    const taxRate = getPropertyTaxRate(taxableStandard);
    const deduction = getProgressiveDeduction(taxableStandard);
    const propertyTax = taxableStandard * taxRate - deduction;

    // 도시지역분
    const urbanAreaTax = taxableStandard * 0.0014;

    // 지방교육세
    const localEducationTax = propertyTax * 0.2;

    // 총 세액
    const totalTax = propertyTax + urbanAreaTax + localEducationTax;

    setResults({
      publicPrice: price,
      taxableStandard,
      propertyTax,
      urbanAreaTax,
      localEducationTax,
      totalTax,
      taxRate: (taxRate * 100).toFixed(3),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-6">
          홈 &gt; 세금 &gt; 재산세 계산기
        </nav>

        {/* Title */}
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">재산세 계산기</h1>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
            세금
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          주택, 건물, 토지의 공시가격을 기준으로 매년 부과되는 재산세를 계산합니다. 공정시장가액비율 60%를 적용합니다.
        </p>

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          {/* 주택 공시가격 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              공시가격 (원) *
            </label>
            <input
              type="number"
              value={publicPrice}
              onChange={(e) => setPublicPrice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              국세청에서 고시한 주택의 공시가격
            </p>
          </div>

          {/* 주택 유형 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              주택 유형
            </label>
            <div className="space-y-2">
              {[
                { val: 'house', label: '주택' },
                { val: 'building', label: '건물' },
                { val: 'land', label: '토지' },
              ].map(({ val, label }) => (
                <label key={val} className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value={val}
                    checked={propertyType === val}
                    onChange={(e) => setPropertyType(e.target.value)}
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
                <span className="text-gray-700">공시가격</span>
                <span className="font-semibold text-gray-900">
                  {formatNumber(results.publicPrice)}원
                </span>
              </div>

              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-gray-700">
                  과세표준 (공시가격 × 60%)
                </span>
                <span className="font-semibold text-gray-900">
                  {formatNumber(results.taxableStandard)}원
                </span>
              </div>

              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-gray-700">
                  재산세율
                </span>
                <span className="font-semibold text-gray-900">
                  {results.taxRate}%
                </span>
              </div>

              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-gray-700">재산세</span>
                <span className="font-semibold text-gray-900">
                  {formatNumber(results.propertyTax)}원
                </span>
              </div>

              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-gray-700">도시지역분 (0.14%)</span>
                <span className="font-semibold text-gray-900">
                  {formatNumber(results.urbanAreaTax)}원
                </span>
              </div>

              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-gray-700">지방교육세 (20%)</span>
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
            <li>• 재산세는 매년 6월에 고지되며, 8월 31일까지 납부합니다.</li>
            <li>• 공정시장가액비율은 국세청에서 매년 결정합니다 (현재 60%).</li>
            <li>• 공시가격 100억 이상일 경우 세율이 인상될 수 있습니다.</li>
            <li>• 일시적 거주용 주택, 임차인 등 감면 대상이 있을 수 있습니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
