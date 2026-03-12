'use client';

import { useState } from 'react';

export default function InheritanceTaxCalculator() {
  const [inheritanceAmount, setInheritanceAmount] = useState('');
  const [debt, setDebt] = useState('');
  const [funeralExpenses, setFuneralExpenses] = useState('');
  const [hasSpouse, setHasSpouse] = useState('yes');
  const [spouseAmount, setSpouseAmount] = useState('');
  const [childrenCount, setChildrenCount] = useState('1');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const getTaxRateAndDeduction = (taxableIncome: number): { rate: number; deduction: number } => {
    if (taxableIncome <= 100000000) return { rate: 0.1, deduction: 0 };
    if (taxableIncome <= 500000000) return { rate: 0.2, deduction: 10000000 };
    if (taxableIncome <= 1000000000) return { rate: 0.3, deduction: 60000000 };
    if (taxableIncome <= 3000000000) return { rate: 0.4, deduction: 160000000 };
    return { rate: 0.5, deduction: 460000000 };
  };

  const handleCalculate = () => {
    const inheritance = parseFloat(inheritanceAmount) || 0;
    const debtAmount = parseFloat(debt) || 0;
    let funeralCost = parseFloat(funeralExpenses) || 0;

    if (inheritance <= 0) {
      alert('상속재산가액을 입력해주세요.');
      return;
    }

    // 장례비용 범위: 500만원 ~ 1,500만원
    if (funeralCost < 5000000) funeralCost = 5000000;
    if (funeralCost > 15000000) funeralCost = 15000000;

    // 순상속재산 = 상속재산 - 채무 - 장례비용
    const netInheritance = inheritance - debtAmount - funeralCost;

    // 공제액 계산
    const basicDeduction = 200000000; // 기초공제
    const children = parseInt(childrenCount) || 1;
    const personalDeduction = children * 50000000; // 인적공제

    // 일괄공제: 기초+인적공제 합계와 비교하여 큰 금액
    const totalSpecialDeduction = basicDeduction + personalDeduction;
    const lumpSumDeduction = 500000000;
    const maxDeduction = Math.max(totalSpecialDeduction, lumpSumDeduction);

    // 배우자공제
    let spouseDeduction = 0;
    if (hasSpouse === 'yes') {
      const spouse = parseFloat(spouseAmount) || 0;
      // 배우자공제: 법정상속분 한도 내 (최소 5억, 최대 30억)
      const legalShare = (netInheritance / 2) * (1 / (children + 1));
      let spouseShare = spouse > legalShare ? legalShare : spouse;
      spouseDeduction = Math.max(Math.min(spouseShare, 3000000000), 500000000);
    }

    // 금융재산공제는 이 계산기에서는 단순화하여 0으로 처리
    const financialDeduction = 0;

    // 과세표준 = 순상속재산 - 각 공제
    const taxableIncome = Math.max(
      netInheritance - maxDeduction - spouseDeduction - financialDeduction,
      0
    );

    if (taxableIncome <= 0) {
      setResults({
        inheritanceAmount: inheritance,
        debtAmount,
        funeralExpenses: funeralCost,
        netInheritance,
        basicDeduction,
        personalDeduction,
        maxDeduction,
        spouseDeduction,
        financialDeduction,
        taxableIncome: 0,
        inheritanceTax: 0,
        reportingCredit: 0,
        payableAmount: 0,
      });
      return;
    }

    // 상속세 계산
    const { rate, deduction } = getTaxRateAndDeduction(taxableIncome);
    const inheritanceTax = taxableIncome * rate - deduction;

    // 신고세액공제 (3%)
    const reportingCredit = inheritanceTax * 0.03;
    const payableAmount = inheritanceTax - reportingCredit;

    setResults({
      inheritanceAmount: inheritance,
      debtAmount,
      funeralExpenses: funeralCost,
      netInheritance,
      basicDeduction,
      personalDeduction,
      maxDeduction,
      spouseDeduction,
      financialDeduction,
      taxableIncome,
      inheritanceTax,
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
          홈 &gt; 세금 &gt; 상속세 계산기
        </nav>

        {/* Title */}
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">상속세 계산기</h1>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
            세금
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          사망에 따른 재산 상속 시 발생하는 상속세를 계산합니다. 기초공제, 인적공제, 배우자공제 등 다양한 공제를 적용합니다.
        </p>

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          {/* 상속재산가액 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              상속재산가액 (원) *
            </label>
            <input
              type="number"
              value={inheritanceAmount}
              onChange={(e) => setInheritanceAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              부동산, 예금, 주식 등 모든 상속 재산의 합
            </p>
          </div>

          {/* 채무 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              피상속인의 채무 (원)
            </label>
            <input
              type="number"
              value={debt}
              onChange={(e) => setDebt(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              상속 시 인수하는 채무, 신용카드 채무 등
            </p>
          </div>

          {/* 장례비용 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              장례비용 (원)
            </label>
            <input
              type="number"
              value={funeralExpenses}
              onChange={(e) => setFuneralExpenses(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              최소 500만원, 최대 1,500만원으로 조정
            </p>
          </div>

          {/* 배우자 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              배우자 상속 여부
            </label>
            <div className="space-y-2">
              {[
                { val: 'yes', label: '예' },
                { val: 'no', label: '아니오' },
              ].map(({ val, label }) => (
                <label key={val} className="flex items-center">
                  <input
                    type="radio"
                    name="spouse"
                    value={val}
                    checked={hasSpouse === val}
                    onChange={(e) => setHasSpouse(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="ml-2 text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 배우자 상속액 */}
          {hasSpouse === 'yes' && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                배우자 상속액 (원)
              </label>
              <input
                type="number"
                value={spouseAmount}
                onChange={(e) => setSpouseAmount(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="0"
              />
              <p className="text-xs text-gray-500 mt-1">
                배우자가 상속받을 예정인 금액
              </p>
            </div>
          )}

          {/* 자녀 수 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              자녀 수
            </label>
            <input
              type="number"
              value={childrenCount}
              onChange={(e) => setChildrenCount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              인적공제: 자녀 1인당 5천만원
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
                <span className="text-gray-700">상속재산가액</span>
                <span className="font-semibold text-gray-900">
                  {formatNumber(results.inheritanceAmount)}원
                </span>
              </div>

              {results.debtAmount > 0 && (
                <div className="flex justify-between items-center border-b pb-3">
                  <span className="text-gray-700">채무</span>
                  <span className="font-semibold text-gray-900">
                    -{formatNumber(results.debtAmount)}원
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-gray-700">장례비용</span>
                <span className="font-semibold text-gray-900">
                  -{formatNumber(results.funeralExpenses)}원
                </span>
              </div>

              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-gray-700">순상속재산</span>
                <span className="font-semibold text-gray-900">
                  {formatNumber(results.netInheritance)}원
                </span>
              </div>

              <div className="bg-gray-50 p-3 rounded mt-4 mb-4">
                <h4 className="font-semibold text-gray-900 mb-3">공제액</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">기초공제</span>
                    <span>{formatNumber(results.basicDeduction)}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">인적공제</span>
                    <span>{formatNumber(results.personalDeduction)}원</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-700">적용 공제액</span>
                    <span className="font-semibold">
                      {formatNumber(results.maxDeduction)}원
                    </span>
                  </div>
                </div>
              </div>

              {results.spouseDeduction > 0 && (
                <div className="flex justify-between items-center border-b pb-3">
                  <span className="text-gray-700">배우자공제</span>
                  <span className="font-semibold text-blue-600">
                    -{formatNumber(results.spouseDeduction)}원
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-gray-700">과세표준</span>
                <span className="font-semibold text-gray-900">
                  {formatNumber(results.taxableIncome)}원
                </span>
              </div>

              {results.inheritanceTax > 0 && (
                <>
                  <div className="flex justify-between items-center border-b pb-3">
                    <span className="text-gray-700">세율</span>
                    <span className="font-semibold text-gray-900">
                      {results.taxRate}%
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-b pb-3">
                    <span className="text-gray-700">상속세</span>
                    <span className="font-semibold text-gray-900">
                      {formatNumber(results.inheritanceTax)}원
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
            <li>• 기초공제 2억원과 인적공제(자녀당 5천만원) 중 큰 금액이 적용됩니다.</li>
            <li>• 배우자공제는 최소 5억원, 최대 30억원 범위에서 적용됩니다.</li>
            <li>• 장례비용은 실제 지출과 무관하게 500만원~1,500만원 범위로 공제됩니다.</li>
            <li>• 신고기한은 피상속인 사망일로부터 10개월입니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
