'use client';

import { useState } from 'react';

export default function ComprehensiveRealPropertyTaxCalculator() {
  const [ownerType, setOwnerType] = useState('single');
  const [publicPrice, setPublicPrice] = useState('');
  const [isElderly, setIsElderly] = useState('no');
  const [elderlyAge, setElderlyAge] = useState('60');
  const [isLongTermHolder, setIsLongTermHolder] = useState('no');
  const [holdingYears, setHoldingYears] = useState('5');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const getComprehensiveTaxRate = (
    taxableStandard: number,
    type: string
  ): { rate: number; deduction: number } => {
    if (type === 'single') {
      // 1세대1주택
      if (taxableStandard <= 300000000) return { rate: 0.005, deduction: 0 };
      if (taxableStandard <= 600000000) return { rate: 0.007, deduction: 600000 };
      if (taxableStandard <= 1200000000) return { rate: 0.01, deduction: 2400000 };
      if (taxableStandard <= 2500000000) return { rate: 0.013, deduction: 6000000 };
      if (taxableStandard <= 5000000000) return { rate: 0.015, deduction: 11000000 };
      return { rate: 0.02, deduction: 36000000 };
    } else {
      // 일반, 법인
      if (taxableStandard <= 300000000) return { rate: 0.005, deduction: 0 };
      if (taxableStandard <= 600000000) return { rate: 0.007, deduction: 600000 };
      if (taxableStandard <= 1200000000) return { rate: 0.01, deduction: 2400000 };
      if (taxableStandard <= 2500000000) return { rate: 0.013, deduction: 6000000 };
      if (taxableStandard <= 5000000000) return { rate: 0.015, deduction: 11000000 };
      if (taxableStandard <= 9400000000) return { rate: 0.02, deduction: 36000000 };
      return { rate: 0.027, deduction: 101800000 };
    }
  };

  const handleCalculate = () => {
    const price = parseFloat(publicPrice) || 0;

    if (price <= 0) {
      alert('공시가격을 입력해주세요.');
      return;
    }

    const fairMarketRatio = 0.6;
    const taxableStandard = price * fairMarketRatio;

    // 세액공제 기준액 결정
    const exemptionAmount = ownerType === 'single' ? 1200000000 : 900000000;
    let deductibleAmount = taxableStandard - exemptionAmount;
    if (deductibleAmount < 0) deductibleAmount = 0;

    const { rate, deduction } = getComprehensiveTaxRate(
      deductibleAmount,
      ownerType
    );

    let comprehensiveTax = deductibleAmount * rate - deduction;
    if (comprehensiveTax < 0) comprehensiveTax = 0;

    // 세액공제 계산
    let taxCredit = 0;
    if (ownerType === 'single') {
      // 고령자 공제
      if (isElderly === 'yes') {
        const age = parseInt(elderlyAge) || 60;
        let elderlyCredit = 0;
        if (age >= 70) elderlyCredit = comprehensiveTax * 0.4;
        else if (age >= 65) elderlyCredit = comprehensiveTax * 0.3;
        else if (age >= 60) elderlyCredit = comprehensiveTax * 0.2;
        taxCredit += elderlyCredit;
      }

      // 장기보유 공제
      if (isLongTermHolder === 'yes') {
        const years = parseInt(holdingYears) || 5;
        let holdingCredit = 0;
        if (years >= 15) holdingCredit = comprehensiveTax * 0.5;
        else if (years >= 10) holdingCredit = comprehensiveTax * 0.4;
        else if (years >= 5) holdingCredit = comprehensiveTax * 0.2;
        taxCredit += holdingCredit;
      }

      // 합산 한도 80%
      taxCredit = Math.min(taxCredit, comprehensiveTax * 0.8);
    }

    const comprehensiveTaxAfterCredit = comprehensiveTax - taxCredit;
    const ruralSpecialTax = comprehensiveTaxAfterCredit * 0.2;
    const totalTax = comprehensiveTaxAfterCredit + ruralSpecialTax;

    setResults({
      price,
      taxableStandard,
      exemptionAmount,
      deductibleAmount,
      comprehensiveTax,
      taxCredit,
      comprehensiveTaxAfterCredit,
      ruralSpecialTax,
      totalTax,
      taxRate: (rate * 100).toFixed(2),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-6">
          홈 &gt; 세금 &gt; 종합부동산세 계산기
        </nav>

        {/* Title */}
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">종합부동산세 계산기</h1>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
            세금
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          일정 금액 이상의 주택을 소유한 경우 부과되는 종합부동산세를 계산합니다. 소유 유형과 공제 조건에 따라 세액이 결정됩니다.
        </p>

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          {/* 주택 유형 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              소유 유형
            </label>
            <div className="space-y-2">
              {[
                { val: 'single', label: '1세대 1주택자' },
                { val: 'general', label: '일반' },
                { val: 'corp', label: '법인' },
              ].map(({ val, label }) => (
                <label key={val} className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value={val}
                    checked={ownerType === val}
                    onChange={(e) => setOwnerType(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="ml-2 text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 공시가격 합계 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              주택 공시가격 합계 (원) *
            </label>
            <input
              type="number"
              value={publicPrice}
              onChange={(e) => setPublicPrice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="0"
            />
          </div>

          {/* 고령자 공제 */}
          {ownerType === 'single' && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  고령자 공제 적용
                </label>
                <div className="space-y-2">
                  {[
                    { val: 'no', label: '아니오' },
                    { val: 'yes', label: '예' },
                  ].map(({ val, label }) => (
                    <label key={val} className="flex items-center">
                      <input
                        type="radio"
                        name="elderly"
                        value={val}
                        checked={isElderly === val}
                        onChange={(e) => setIsElderly(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="ml-2 text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {isElderly === 'yes' && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    나이
                  </label>
                  <select
                    value={elderlyAge}
                    onChange={(e) => setElderlyAge(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="60">60세~64세 (20% 공제)</option>
                    <option value="65">65세~69세 (30% 공제)</option>
                    <option value="70">70세 이상 (40% 공제)</option>
                  </select>
                </div>
              )}

              {/* 장기보유 공제 */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  장기보유 공제 적용
                </label>
                <div className="space-y-2">
                  {[
                    { val: 'no', label: '아니오' },
                    { val: 'yes', label: '예' },
                  ].map(({ val, label }) => (
                    <label key={val} className="flex items-center">
                      <input
                        type="radio"
                        name="longterm"
                        value={val}
                        checked={isLongTermHolder === val}
                        onChange={(e) => setIsLongTermHolder(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="ml-2 text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {isLongTermHolder === 'yes' && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    보유 기간
                  </label>
                  <select
                    value={holdingYears}
                    onChange={(e) => setHoldingYears(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="5">5년 이상 (20% 공제)</option>
                    <option value="10">10년 이상 (40% 공제)</option>
                    <option value="15">15년 이상 (50% 공제)</option>
                  </select>
                </div>
              )}
            </>
          )}

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
                <span className="text-gray-700">공시가격 합계</span>
                <span className="font-semibold text-gray-900">
                  {formatNumber(results.price)}원
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
                  세액공제 기준액 ({ownerType === 'single' ? '12억' : '9억'}원)
                </span>
                <span className="font-semibold text-gray-900">
                  {formatNumber(results.exemptionAmount)}원
                </span>
              </div>

              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-gray-700">과세 대상</span>
                <span className="font-semibold text-gray-900">
                  {formatNumber(results.deductibleAmount)}원
                </span>
              </div>

              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-gray-700">종합부동산세율</span>
                <span className="font-semibold text-gray-900">
                  {results.taxRate}%
                </span>
              </div>

              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-gray-700">종합부동산세</span>
                <span className="font-semibold text-gray-900">
                  {formatNumber(results.comprehensiveTax)}원
                </span>
              </div>

              {results.taxCredit > 0 && (
                <div className="flex justify-between items-center border-b pb-3">
                  <span className="text-gray-700">세액공제</span>
                  <span className="font-semibold text-blue-600">
                    -{formatNumber(results.taxCredit)}원
                  </span>
                </div>
              )}

              {results.taxCredit > 0 && (
                <div className="flex justify-between items-center border-b pb-3">
                  <span className="text-gray-700">공제 후 종부세</span>
                  <span className="font-semibold text-gray-900">
                    {formatNumber(results.comprehensiveTaxAfterCredit)}원
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-gray-700">농어촌특별세 (20%)</span>
                <span className="font-semibold text-gray-900">
                  {formatNumber(results.ruralSpecialTax)}원
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
            <li>• 1세대1주택자는 12억원, 일반인은 9억원의 기본공제가 적용됩니다.</li>
            <li>• 고령자와 장기보유자는 종부세 세액의 최대 80%까지 공제받을 수 있습니다.</li>
            <li>• 종부세는 보유 주택의 총 공시가격을 기준으로 계산됩니다.</li>
            <li>• 농어촌특별세는 종부세의 20%가 추가로 부과됩니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
