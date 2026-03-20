'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

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
    <>
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-[1200px] px-6 py-4">
          <nav className="flex items-center gap-1.5 text-[13px] text-fg-muted mb-8">
            <Link href="/" className="hover:text-fg">홈</Link>
            <ChevronRight size={12} />
            <span>부동산</span>
            <ChevronRight size={12} />
            <span className="text-fg font-medium">중개수수료</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-[1200px] px-6 py-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl font-bold text-fg">중개수수료 계산기</h1>
            <span className="inline-block bg-bg-tertiary text-fg-secondary text-xs font-semibold px-3 py-1 rounded-full">
              부동산
            </span>
          </div>
          <p className="text-fg-secondary text-lg">
            2024년 기준 한국 부동산 중개수수료를 정확하게 계산합니다. 매매, 전세, 월세 거래를 지원합니다.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-[1200px] px-6 py-8">
        {/* Calculator Card */}
        <div className="bg-surface rounded-xl shadow-[var(--shadow-md)] overflow-hidden mb-8">
          <div className="bg-bg-secondary px-8 py-6 border-b border-border">
            <h2 className="text-[12px] font-medium text-fg-muted uppercase tracking-wider">계산 정보 입력</h2>
          </div>

          <div className="p-8">
            {/* Transaction Type */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-fg-secondary mb-4">
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
                        ? 'bg-accent text-accent-fg'
                        : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
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
                  <label className="block text-sm font-semibold text-fg-secondary mb-3">
                    자주 사용하는 거래금액
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {commonAmounts.map((value) => (
                      <button
                        key={value}
                        onClick={() => handlePreset(value)}
                        className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                          amount === value.toString()
                            ? 'bg-accent text-accent-fg'
                            : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                        }`}
                      >
                        {formatNumber(value)}원
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount Input */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-fg-secondary mb-2">
                    거래금액 (원)
                  </label>
                  <input
                    type="text"
                    value={formatNumber(parseFloat(amount) || 0)}
                    onChange={handleAmountChange}
                    placeholder="금액을 입력하세요"
                    className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                  />
                </div>
              </>
            )}

            {/* Monthly Rent Inputs */}
            {transactionType === 'monthly' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-fg-secondary mb-2">
                    보증금 (원)
                  </label>
                  <input
                    type="text"
                    value={formatNumber(parseFloat(deposit) || 0)}
                    onChange={handleDepositChange}
                    placeholder="보증금을 입력하세요"
                    className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-fg-secondary mb-2">
                    월세 (원)
                  </label>
                  <input
                    type="text"
                    value={formatNumber(parseFloat(monthlyRent) || 0)}
                    onChange={handleMonthlyChange}
                    placeholder="월세를 입력하세요"
                    className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                  />
                </div>
              </div>
            )}

            {/* Calculate Button */}
            <button className="w-full bg-accent hover:bg-accent-hover text-accent-fg font-bold py-3 px-6 rounded-lg transition-all duration-200">
              계산하기
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="bg-surface rounded-xl shadow-[var(--shadow-md)] overflow-hidden mb-8">
          <div className="bg-bg-secondary px-8 py-6 border-b border-border">
            <h2 className="text-[12px] font-medium text-fg-muted uppercase tracking-wider">계산 결과</h2>
          </div>

          <div className="p-8">
            {result.baseAmount > 0 ? (
              <>
                {/* Base Amount */}
                {transactionType !== 'monthly' && (
                  <div className="flex justify-between items-center py-4 border-b border-border">
                    <span className="text-[13px] text-fg-secondary font-medium">거래금액</span>
                    <span className="text-xl font-bold text-fg">
                      {formatCurrency(result.baseAmount)}
                    </span>
                  </div>
                )}

                {/* Fee */}
                <div className="flex justify-between items-center py-4 border-b border-border">
                  <span className="text-[13px] text-fg-secondary font-medium">중개수수료</span>
                  <span className="text-xl font-bold text-fg">
                    {formatCurrency(result.fee)}
                  </span>
                </div>

                {/* Tax */}
                <div className="flex justify-between items-center py-4 border-b border-border">
                  <span className="text-[13px] text-fg-secondary font-medium">부가세 (10%)</span>
                  <span className="text-lg font-semibold text-fg">
                    {formatCurrency(result.tax)}
                  </span>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center bg-bg-secondary p-4 rounded-xl -mx-4 mt-4">
                  <span className="text-fg font-bold text-lg">합계</span>
                  <span className="text-[36px] font-bold text-fg tabular-nums">
                    {formatCurrency(result.total)}
                  </span>
                </div>

                {/* Note */}
                {result.note && (
                  <div className="mt-6 border border-border rounded-xl bg-bg-secondary p-5">
                    <p className="text-[13px] text-fg-secondary">
                      <strong>참고:</strong> {result.note}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-fg-muted">
                거래금액을 입력하고 계산하기를 클릭하세요.
              </div>
            )}
          </div>
        </div>

        {/* Fee Rate Table */}
        <div className="bg-surface rounded-xl shadow-[var(--shadow-md)] overflow-hidden mb-8">
          <div className="bg-bg-secondary px-8 py-6 border-b border-border">
            <h2 className="text-[12px] font-medium text-fg-muted uppercase tracking-wider">2024년 중개수수료 기준</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-bg-secondary border-b border-border">
                  <th className="px-8 py-4 text-left text-[13px] font-medium text-fg-secondary">거래금액</th>
                  <th className="px-8 py-4 text-left text-[13px] font-medium text-fg-secondary">수수료율</th>
                  <th className="px-8 py-4 text-left text-[13px] font-medium text-fg-secondary">상한</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border hover:bg-surface-hover">
                  <td className="px-8 py-4 text-[13px] text-fg-secondary">5천만원 미만</td>
                  <td className="px-8 py-4 text-[13px] text-fg font-medium">0.6%</td>
                  <td className="px-8 py-4 text-[13px] text-fg font-medium">25만원</td>
                </tr>
                <tr className="border-b border-border hover:bg-surface-hover">
                  <td className="px-8 py-4 text-[13px] text-fg-secondary">5천만원 ~ 2억원 미만</td>
                  <td className="px-8 py-4 text-[13px] text-fg font-medium">0.5%</td>
                  <td className="px-8 py-4 text-[13px] text-fg font-medium">80만원</td>
                </tr>
                <tr className="border-b border-border hover:bg-surface-hover">
                  <td className="px-8 py-4 text-[13px] text-fg-secondary">2억원 ~ 9억원 미만</td>
                  <td className="px-8 py-4 text-[13px] text-fg font-medium">0.4%</td>
                  <td className="px-8 py-4 text-[13px] text-fg font-medium">상한 없음</td>
                </tr>
                <tr className="border-b border-border hover:bg-surface-hover">
                  <td className="px-8 py-4 text-[13px] text-fg-secondary">9억원 ~ 12억원 미만</td>
                  <td className="px-8 py-4 text-[13px] text-fg font-medium">0.5%</td>
                  <td className="px-8 py-4 text-[13px] text-fg font-medium">상한 없음</td>
                </tr>
                <tr className="border-b border-border hover:bg-surface-hover">
                  <td className="px-8 py-4 text-[13px] text-fg-secondary">12억원 ~ 15억원 미만</td>
                  <td className="px-8 py-4 text-[13px] text-fg font-medium">0.6%</td>
                  <td className="px-8 py-4 text-[13px] text-fg font-medium">상한 없음</td>
                </tr>
                <tr className="hover:bg-surface-hover">
                  <td className="px-8 py-4 text-[13px] text-fg-secondary">15억원 이상</td>
                  <td className="px-8 py-4 text-[13px] text-fg font-medium">0.7%</td>
                  <td className="px-8 py-4 text-[13px] text-fg font-medium">상한 없음</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Tips Section */}
        <div className="border border-border rounded-xl bg-bg-secondary p-5 mb-8">
          <h3 className="text-[14px] font-semibold text-fg mb-3">알아두기</h3>
          <ul className="space-y-3 text-[13px] text-fg-secondary">
            <li className="flex gap-3">
              <span>·</span>
              <span>
                중개수수료는 거래금액의 일정 비율로 계산되며, 부가가치세(VAT 10%)가 추가됩니다.
              </span>
            </li>
            <li className="flex gap-3">
              <span>·</span>
              <span>
                <strong>월세의 경우</strong>, 거래금액은 보증금 + (월세 x 100) 또는 보증금 + (월세 x 70)으로 계산됩니다.
              </span>
            </li>
            <li className="flex gap-3">
              <span>·</span>
              <span>
                상한요율을 초과하는 경우 상한가가 적용되어 더 저렴할 수 있습니다.
              </span>
            </li>
            <li className="flex gap-3">
              <span>·</span>
              <span>
                실제 거래 시 중개업소와 협의하여 수수료율이 결정될 수 있으므로 참고만 하세요.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
