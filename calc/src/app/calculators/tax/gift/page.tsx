'use client';

import { useState } from 'react';

export default function GiftTaxCalculator() {
  const [relationship, setRelationship] = useState('child');
  const [giftAmount, setGiftAmount] = useState('');
  const [debt, setDebt] = useState('');
  const [previousGift10Years, setPreviousGift10Years] = useState('');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const getGiftDeduction = (rel: string): number => {
    switch (rel) {
      case 'spouse':
        return 600000000; // 배우자: 6억원
      case 'parent':
        return 50000000; // 직계존속: 5천만원
      case 'child':
        return 50000000; // 직계비속: 5천만원
      case 'relative':
        return 10000000; // 기타친족: 1천만원
      case 'other':
        return 0; // 그외: 0원
      default:
        return 0;
    }
  };

  const getTaxRateAndDeduction = (taxableIncome: number): { rate: number; deduction: number } => {
    if (taxableIncome <= 100000000) return { rate: 0.1, deduction: 0 };
    if (taxableIncome <= 500000000) return { rate: 0.2, deduction: 10000000 };
    if (taxableIncome <= 1000000000) return { rate: 0.3, deduction: 60000000 };
    if (taxableIncome <= 3000000000) return { rate: 0.4, deduction: 160000000 };
    return { rate: 0.5, deduction: 460000000 };
  };

  const handleCalculate = () => {
    const gift = parseFloat(giftAmount) || 0;
    const debtAmount = parseFloat(debt) || 0;
    const previous = parseFloat(previousGift10Years) || 0;

    if (gift <= 0) {
      alert('증여재산가액을 입력해주세요.');
      return;
    }

    // 증여재산가액 = 증여가액 - 채무부담액
    const giftableAmount = gift - debtAmount;

    // 공제액
    const giftDeduction = getGiftDeduction(relationship);

    // 과세표준 = 증여재산가액 + 10년 이내 동일인 증여액 - 공제액
    const taxableIncome = giftableAmount + previous - giftDeduction;

    if (taxableIncome <= 0) {
      setResults({
        giftAmount: gift,
        debtAmount,
        giftableAmount,
        giftDeduction,
        taxableIncome: 0,
        giftTax: 0,
        reportingCredit: 0,
        payableAmount: 0,
      });
      return;
    }

    // 세율 및 누진공제
    const { rate, deduction } = getTaxRateAndDeduction(taxableIncome);
    const giftTax = taxableIncome * rate - deduction;

    // 신고세액공제 (3%)
    const reportingCredit = giftTax * 0.03;
    const payableAmount = giftTax - reportingCredit;

    setResults({
      giftAmount: gift,
      debtAmount,
      giftableAmount,
      giftDeduction,
      taxableIncome,
      giftTax,
      reportingCredit,
      payableAmount,
      taxRate: (rate * 100).toFixed(1),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-6">
          홈 &gt; 세금 &gt; 증여세 계산기
        </nav>

        {/* Title */}
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">증여세 계산기</h1>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
            세금
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          재산을 증여받을 때 발생하는 증여세를 계산합니다. 증여자와의 관계에 따른 공제액과 누진세율이 적용됩니다.
        </p>

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          {/* 증여자와의 관계 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              증여자와의 관계
            </label>
            <div className="space-y-2">
              {[
                { val: 'spouse', label: '배우자 (공제 6억원)' },
                { val: 'parent', label: '직계존속 (공제 5천만원)' },
                { val: 'child', label: '직계비속 (공제 5천만원)' },
                { val: 'relative', label: '기타친족 (공제 1천만원)' },
                { val: 'other', label: '그 외 (공제 없음)' },
              ].map(({ val, label }) => (
                <label key={val} className="flex items-center">
                  <input
                    type="radio"
                    name="relationship"
                    value={val}
                    checked={relationship === val}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="ml-2 text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 증여재산가액 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              증여재산가액 (원) *
            </label>
            <input
              type="number"
              value={giftAmount}
              onChange={(e) => setGiftAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              증여받은 재산의 평가액 (현금, 부동산 등)
            </p>
          </div>

          {/* 채무부담액 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              채무부담액 (원)
            </label>
            <input
              type="number"
              value={debt}
              onChange={(e) => setDebt(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              증여받은 부동산의 담보 대출금
            </p>
          </div>

          {/* 10년 이내 동일인 증여액 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              10년 이내 동일인 증여액 (원)
            </label>
            <input
              type="number"
              value={previousGift10Years}
              onChange={(e) => setPreviousGift10Years(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              지난 10년 이내 동일인으로부터 받은 증여액
            </p>
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
                <span className="text-gray-700">증여재산가액</span>
                <span className="font-semibold text-gray-900">
                  {formatNumber(results.giftAmount)}원
                </span>
              </div>

              {results.debtAmount > 0 && (
                <div className="flex justify-between items-center border-b pb-3">
                  <span className="text-gray-700">채무부담액</span>
                  <span className="font-semibold text-gray-900">
                    -{formatNumber(results.debtAmount)}원
                  </span>
                </div>
              )}

              {results.debtAmount > 0 && (
                <div className="flex justify-between items-center border-b pb-3">
                  <span className="text-gray-700">증여받은 순 가액</span>
                  <span className="font-semibold text-gray-900">
                    {formatNumber(results.giftableAmount)}원
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-gray-700">증여공제액</span>
                <span className="font-semibold text-blue-600">
                  -{formatNumber(results.giftDeduction)}원
                </span>
              </div>

              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-gray-700">과세표준</span>
                <span className="font-semibold text-gray-900">
                  {formatNumber(results.taxableIncome)}원
                </span>
              </div>

              {results.giftTax > 0 && (
                <>
                  <div className="flex justify-between items-center border-b pb-3">
                    <span className="text-gray-700">세율</span>
                    <span className="font-semibold text-gray-900">
                      {results.taxRate}%
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-b pb-3">
                    <span className="text-gray-700">증여세</span>
                    <span className="font-semibold text-gray-900">
                      {formatNumber(results.giftTax)}원
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-b pb-3">
                    <span className="text-gray-700">신고세액공제 (3%)</span>
                    <span className="font-semibold text-blue-600">
                      -{formatNumber(results.reportingCredit)}원
                    </span>
                  </div>
                </>
              )}

              <div className="flex justify-between items-center pt-3 bg-green-50 p-4 rounded-lg">
                <span className="text-lg font-bold text-gray-900">납부할 세액</span>
                <span className="text-2xl font-bold text-green-600">
                  {formatNumber(results.payableAmount)}원
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-bold text-gray-900 mb-4">계산 팁</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• 배우자의 경우 가장 높은 6억원의 공제를 받습니다.</li>
            <li>• 10년 이내에 받은 동일인의 증여는 누적되어 과세됩니다.</li>
            <li>• 신고세액공제는 성실 신고 시 자동으로 적용됩니다.</li>
            <li>• 금융자산의 경우 평가액이 증여세의 중요한 요소입니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
