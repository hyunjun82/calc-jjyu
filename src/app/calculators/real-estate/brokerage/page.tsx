'use client';

import { useState } from 'react';

type TransactionType = 'sale' | 'jeonse' | 'monthly';

interface FeeResult {
  baseAmount: number;
  fee: number;
  tax: number;
  total: number;
  note: string;
}

export default function BrokerageFeeCalculatorPage() {
  const [transactionType, setTransactionType] = useState<TransactionType>('sale');
  const [amount, setAmount] = useState<string>('100000000');
  const [deposit, setDeposit] = useState<string>('100000000');
  const [monthlyRent, setMonthlyRent] = useState<string>('500000');

  const calculateBrokerageFee = (): FeeResult => {
    let baseAmount = 0;
    let note = '';

    if (transactionType === 'monthly') {
      // 월세: 거래금액 = 보증금 + (월세 × 100) or 보증금 + (월세 × 70)
      const depositNum = parseFloat(deposit) || 0;
      const monthlyNum = parseFloat(monthlyRent) || 0;

      const calculatedAmount = depositNum + monthlyNum * 100;
      const fallbackAmount = depositNum + monthlyNum * 70;

      baseAmount = calculatedAmount < 50000000 ? fallbackAmount : calculatedAmount;
      note = `보증금: ${formatCurrency(depositNum)}, 월세: ${formatCurrency(monthlyNum)}`;
    } else {
      baseAmount = parseFloat(amount) || 0;
    }

    let feeRate = 0;
    let feeLimit = 0;
    let exceedsLimit = false;

    if (baseAmount < 50000000) {
      feeRate = 0.006;
      feeLimit = 250000;
    } else if (baseAmount < 200000000) {
      feeRate = 0.005;
      feeLimit = 800000;
    } else if (baseAmount < 900000000) {
      feeRate = 0.004;
      feeLimit = 0; // 상한 없음
    } else if (baseAmount < 1200000000) {
      feeRate = 0.005;
      feeLimit = 0;
    } else if (baseAmount < 1500000000) {
      feeRate = 0.006;
      feeLimit = 0;
    } else {
      feeRate = 0.007;
      feeLimit = 0;
    }

    let fee = baseAmount * feeRate;

    if (feeLimit > 0 && fee > feeLimit) {
      fee = feeLimit;
      exceedsLimit = true;
      note = `${note}${note ? ' | ' : ''}상한요율(${formatCurrency(fee)}) 적용`;
    }

    const tax = fee * 0.1;
    const total = fee + tax;

    return {
      baseAmount,
      fee,
      tax,
      total,
      note,
    };
  };

  const result = calculateBrokerageFee();

  const formatNumber = (num: number): string => {
    return Math.floor(num)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const formatCurrency = (num: number): string => {
    return formatNumber(num) + '원';
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    setAmount(value);
  };

  const handleDepositChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    setDeposit(value);
  };

  const handleMonthlyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    setMonthlyRent(value);
  };

  const commonAmounts = [50000000, 100000000, 200000000, 300000000, 500000000];

  const handlePreset = (value: number) => {
    setAmount(value.toString());
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 text-sm text-gray-600">
          <span>홈</span>
          <span className="mx-2">&gt;</span>
          <span>부동산</span>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-900 font-medium">중개수수료</span>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl font-bold text-gray-900">중개수수료 계산기</h1>
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
              부동산
            </span>
          </div>
          <p className="text-gray-600 text-lg">
            2024년 기준 한국 부동산 중개수수료를 정확하게 계산합니다. 매매, 전세, 월세 거래를 지원합니다.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Calculator Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-blue-25 px-8 py-6 border-b-2 border-blue-200">
            <h2 className="text-xl font-bold text-gray-900">계산 정보 입력</h2>
          </div>

          <div className="p-8">
            {/* Transaction Type */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                거래 유형
              </label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: 'sale' as const, label: '매매' },
                  { value: 'jeonse' as const, label: '전세' },
                  { value: 'monthly' as const, label: '월세' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTransactionType(option.value)}
                    className={`py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                      transactionType === option.value
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Transaction Amount Input */}
            {transactionType !== 'monthly' && (
              <>
                {/* Quick Presets */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    자주 사용하는 거래금액
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {commonAmounts.map((value) => (
                      <button
                        key={value}
                        onClick={() => handlePreset(value)}
                        className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                          amount === value.toString()
                            ? 'bg-blue-500 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {formatNumber(value)}원
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount Input */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    거래금액 (원)
                  </label>
                  <input
                    type="text"
                    value={formatNumber(parseFloat(amount) || 0)}
                    onChange={handleAmountChange}
                    placeholder="금액을 입력하세요"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
                  />
                </div>
              </>
            )}

            {/* Monthly Rent Inputs */}
            {transactionType === 'monthly' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    보증금 (원)
                  </label>
                  <input
                    type="text"
                    value={formatNumber(parseFloat(deposit) || 0)}
                    onChange={handleDepositChange}
                    placeholder="보증금을 입력하세요"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    월세 (원)
                  </label>
                  <input
                    type="text"
                    value={formatNumber(parseFloat(monthlyRent) || 0)}
                    onChange={handleMonthlyChange}
                    placeholder="월세를 입력하세요"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
                  />
                </div>
              </div>
            )}

            {/* Calculate Button */}
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg">
              계산하기
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-green-50 to-green-25 px-8 py-6 border-b-2 border-green-200">
            <h2 className="text-xl font-bold text-gray-900">계산 결과</h2>
          </div>

          <div className="p-8">
            {result.baseAmount > 0 ? (
              <>
                {/* Base Amount */}
                {transactionType !== 'monthly' && (
                  <div className="flex justify-between items-center py-4 border-b border-gray-200">
                    <span className="text-gray-700 font-medium">거래금액</span>
                    <span className="text-xl font-bold text-gray-900">
                      {formatCurrency(result.baseAmount)}
                    </span>
                  </div>
                )}

                {/* Fee */}
                <div className="flex justify-between items-center py-4 border-b border-gray-200">
                  <span className="text-gray-700 font-medium">중개수수료</span>
                  <span className="text-xl font-bold text-blue-600">
                    {formatCurrency(result.fee)}
                  </span>
                </div>

                {/* Tax */}
                <div className="flex justify-between items-center py-4 border-b border-gray-200">
                  <span className="text-gray-700 font-medium">부가세 (10%)</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {formatCurrency(result.tax)}
                  </span>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center py-4 bg-blue-50 -mx-8 px-8 rounded-b-lg">
                  <span className="text-gray-900 font-bold text-lg">합계</span>
                  <span className="text-3xl font-bold text-blue-600">
                    {formatCurrency(result.total)}
                  </span>
                </div>

                {/* Note */}
                {result.note && (
                  <div className="mt-6 p-4 bg-amber-50 border-l-4 border-amber-400 rounded">
                    <p className="text-sm text-amber-800">
                      <strong>참고:</strong> {result.note}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                거래금액을 입력하고 계산하기를 클릭하세요.
              </div>
            )}
          </div>
        </div>

        {/* Fee Rate Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-gray-50 to-gray-25 px-8 py-6 border-b-2 border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">2024년 중개수수료 기준</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="px-8 py-4 text-left font-semibold text-gray-700">거래금액</th>
                  <th className="px-8 py-4 text-left font-semibold text-gray-700">수수료율</th>
                  <th className="px-8 py-4 text-left font-semibold text-gray-700">상한</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 hover:bg-blue-50">
                  <td className="px-8 py-4 text-gray-700">5천만원 미만</td>
                  <td className="px-8 py-4 text-gray-700 font-medium">0.6%</td>
                  <td className="px-8 py-4 text-gray-700 font-medium">25만원</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-blue-50">
                  <td className="px-8 py-4 text-gray-700">5천만원 ~ 2억원 미만</td>
                  <td className="px-8 py-4 text-gray-700 font-medium">0.5%</td>
                  <td className="px-8 py-4 text-gray-700 font-medium">80만원</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-blue-50">
                  <td className="px-8 py-4 text-gray-700">2억원 ~ 9억원 미만</td>
                  <td className="px-8 py-4 text-gray-700 font-medium">0.4%</td>
                  <td className="px-8 py-4 text-gray-700 font-medium">상한 없음</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-blue-50">
                  <td className="px-8 py-4 text-gray-700">9억원 ~ 12억원 미만</td>
                  <td className="px-8 py-4 text-gray-700 font-medium">0.5%</td>
                  <td className="px-8 py-4 text-gray-700 font-medium">상한 없음</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-blue-50">
                  <td className="px-8 py-4 text-gray-700">12억원 ~ 15억원 미만</td>
                  <td className="px-8 py-4 text-gray-700 font-medium">0.6%</td>
                  <td className="px-8 py-4 text-gray-700 font-medium">상한 없음</td>
                </tr>
                <tr className="hover:bg-blue-50">
                  <td className="px-8 py-4 text-gray-700">15억원 이상</td>
                  <td className="px-8 py-4 text-gray-700 font-medium">0.7%</td>
                  <td className="px-8 py-4 text-gray-700 font-medium">상한 없음</td>
                </tr>
              </tbody>
            </table>
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
                중개수수료는 거래금액의 일정 비율로 계산되며, 부가가치세(VAT 10%)가 추가됩니다.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span>
                <strong>월세의 경우</strong>, 거래금액은 보증금 + (월세 × 100) 또는 보증금 + (월세 × 70)으로 계산됩니다.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span>
                상한요율을 초과하는 경우 상한가가 적용되어 더 저렴할 수 있습니다.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span>
                실제 거래 시 중개업소와 협의하여 수수료율이 결정될 수 있으므로 참고만 하세요.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
