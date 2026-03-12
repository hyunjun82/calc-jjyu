'use client';

import { useState } from 'react';

export default function CapitalGainsTaxCalculator() {
  const [householdCount, setHouseholdCount] = useState('1');
  const [isAdjustedArea, setIsAdjustedArea] = useState('no');
  const [acquisitionDate, setAcquisitionDate] = useState('');
  const [disposalDate, setDisposalDate] = useState('');
  const [isResiding, setIsResiding] = useState('yes');
  const [residingYears, setResidingYears] = useState(0);
  const [disposalAmount, setDisposalAmount] = useState('');
  const [acquisitionAmount, setAcquisitionAmount] = useState('');
  const [necessaryExpenses, setNecessaryExpenses] = useState('');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const calculateHoldingYears = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return Math.floor(diffDays / 365.25);
  };

  const calculateLongTermHoldingDiscount = (
    holdingYears: number,
    residingYears: number,
    isSingleHouse: boolean,
    isAdjusted: boolean
  ): number => {
    if (isSingleHouse && !isAdjusted) {
      // 1세대1주택: 보유 연 4% + 거주 연 4% (최대 80%)
      const holdingDiscount = Math.min(holdingYears * 4, 40);
      const residingDiscount = isResiding === 'yes' ? Math.min(residingYears * 4, 40) : 0;
      return Math.min(holdingDiscount + residingDiscount, 80);
    }

    if (isAdjusted) {
      // 조정지역: 장기보유특별공제 없음
      return 0;
    }

    // 일반: 3년이상 6%, 매년 2%p 추가 (최대 30%)
    if (holdingYears >= 3) {
      return Math.min(6 + (holdingYears - 3) * 2, 30);
    }
    return 0;
  };

  const getProgressiveTaxDeduction = (taxableIncome: number): number => {
    if (taxableIncome <= 14000000) return 0;
    if (taxableIncome <= 50000000) return 1260000;
    if (taxableIncome <= 88000000) return 5760000;
    if (taxableIncome <= 150000000) return 15440000;
    if (taxableIncome <= 300000000) return 19940000;
    if (taxableIncome <= 500000000) return 25940000;
    if (taxableIncome <= 1000000000) return 35940000;
    return 65940000;
  };

  const getTaxRate = (taxableIncome: number): number => {
    if (taxableIncome <= 14000000) return 0.06;
    if (taxableIncome <= 50000000) return 0.15;
    if (taxableIncome <= 88000000) return 0.24;
    if (taxableIncome <= 150000000) return 0.35;
    if (taxableIncome <= 300000000) return 0.38;
    if (taxableIncome <= 500000000) return 0.40;
    if (taxableIncome <= 1000000000) return 0.42;
    return 0.45;
  };

  const handleCalculate = () => {
    const disposal = parseFloat(disposalAmount) || 0;
    const acquisition = parseFloat(acquisitionAmount) || 0;
    const expenses = parseFloat(necessaryExpenses) || 0;

    if (!disposalDate || !acquisitionDate) {
      alert('취득일자와 양도일자를 입력해주세요.');
      return;
    }

    const holdingYears = calculateHoldingYears(acquisitionDate, disposalDate);
    const capitalGain = disposal - acquisition - expenses;

    if (capitalGain <= 0) {
      alert('양도차익이 0 이상이어야 합니다.');
      return;
    }

    const isSingleHouse = householdCount === '1';
    const discountRate = calculateLongTermHoldingDiscount(
      holdingYears,
      residingYears,
      isSingleHouse,
      isAdjustedArea === 'yes'
    );
    const longTermDiscount = capitalGain * (discountRate / 100);

    const basicDeduction = 2500000;
    let taxableIncome = capitalGain - longTermDiscount - basicDeduction;
    if (taxableIncome < 0) taxableIncome = 0;

    const baseTaxRate = getTaxRate(taxableIncome);
    const progressiveDeduction = getProgressiveTaxDeduction(taxableIncome);
    let calculatedTax = taxableIncome * baseTaxRate - progressiveDeduction;

    // 중과세율 적용
    if (isAdjustedArea === 'yes') {
      if (householdCount === '2') {
        calculatedTax *= 1.2; // +20%p
      } else if (householdCount === '3') {
        calculatedTax *= 1.3; // +30%p
      }
    }

    const localTax = calculatedTax * 0.1;
    const totalTax = calculatedTax + localTax;

    setResults({
      capitalGain,
      longTermDiscount,
      taxableIncome,
      calculatedTax,
      localTax,
      totalTax,
      holdingYears,
      discountRate,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-6">
          홈 &gt; 세금 &gt; 양도소득세 계산기
        </nav>

        {/* Title */}
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">양도소득세 계산기</h1>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
            세금
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          주택 양도 시 발생하는 양도소득세를 계산합니다. 보유기간, 거주여부 등에 따른 장기보유특별공제를 적용하여 정확한 세액을 산출합니다.
        </p>

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          {/* 주택수 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              주택수 선택
            </label>
            <div className="space-y-2">
              {['1', '2', '3'].map((val) => (
                <label key={val} className="flex items-center">
                  <input
                    type="radio"
                    name="household"
                    value={val}
                    checked={householdCount === val}
                    onChange={(e) => setHouseholdCount(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="ml-2 text-gray-700">
                    {val === '1' && '1주택'}
                    {val === '2' && '2주택'}
                    {val === '3' && '3주택 이상'}
                  </span>
                </label>
              ))}
            </div>
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

          {/* 취득일자 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              취득일자 *
            </label>
            <input
              type="date"
              value={acquisitionDate}
              onChange={(e) => setAcquisitionDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* 양도일자 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              양도일자 *
            </label>
            <input
              type="date"
              value={disposalDate}
              onChange={(e) => setDisposalDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* 거주여부 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              거주여부
            </label>
            <div className="space-y-2">
              {[
                { val: 'yes', label: '예' },
                { val: 'no', label: '아니오' },
              ].map(({ val, label }) => (
                <label key={val} className="flex items-center">
                  <input
                    type="radio"
                    name="residing"
                    value={val}
                    checked={isResiding === val}
                    onChange={(e) => setIsResiding(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="ml-2 text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 거주기간 */}
          {isResiding === 'yes' && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                거주기간 (년)
              </label>
              <input
                type="number"
                value={residingYears}
                onChange={(e) => setResidingYears(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0"
              />
            </div>
          )}

          {/* 양도가액 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              양도가액 (원) *
            </label>
            <input
              type="number"
              value={disposalAmount}
              onChange={(e) => setDisposalAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="0"
            />
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
          </div>

          {/* 필요경비 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              필요경비 (원)
            </label>
            <input
              type="number"
              value={necessaryExpenses}
              onChange={(e) => setNecessaryExpenses(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="0"
            />
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
                <span className="text-gray-700">보유기간</span>
                <span className="font-semibold text-gray-900">
                  {results.holdingYears}년
                </span>
              </div>

              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-gray-700">양도차익</span>
                <span className="font-semibold text-gray-900">
                  {formatNumber(results.capitalGain)}원
                </span>
              </div>

              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-gray-700">장기보유특별공제 ({results.discountRate}%)</span>
                <span className="font-semibold text-gray-900">
                  {formatNumber(results.longTermDiscount)}원
                </span>
              </div>

              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-gray-700">기본공제</span>
                <span className="font-semibold text-gray-900">2,500,000원</span>
              </div>

              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-gray-700">과세표준</span>
                <span className="font-semibold text-gray-900">
                  {formatNumber(results.taxableIncome)}원
                </span>
              </div>

              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-gray-700">산출세액</span>
                <span className="font-semibold text-gray-900">
                  {formatNumber(results.calculatedTax)}원
                </span>
              </div>

              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-gray-700">지방소득세 (10%)</span>
                <span className="font-semibold text-gray-900">
                  {formatNumber(results.localTax)}원
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
            <li>• 1주택은 장기보유특별공제율이 높아 세부담이 낮을 수 있습니다.</li>
            <li>• 조정대상지역의 2주택·3주택은 중과세율이 적용됩니다.</li>
            <li>• 거주기간이 길수록 1주택의 공제율이 높아집니다.</li>
            <li>• 필요경비는 중개수수료, 등기료 등을 포함할 수 있습니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
