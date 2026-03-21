'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function InstallmentCalculator() {
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [months, setMonths] = useState('3');
  const [isInterestFree, setIsInterestFree] = useState('no');
  const [annualRate, setAnnualRate] = useState('');
  const [results, setResults] = useState<any>(null);

  const defaultRates: Record<string, string> = {
    '2': '11',
    '3': '12',
    '6': '13',
    '10': '14',
    '12': '15',
  };

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const handleMonthChange = (m: string) => {
    setMonths(m);
    if (defaultRates[m] && isInterestFree === 'no') {
      setAnnualRate(defaultRates[m]);
    }
  };

  const handleCalculate = () => {
    const amount = parseFloat(purchaseAmount) || 0;
    const monthCount = parseInt(months) || 0;

    if (amount <= 0 || monthCount <= 0) {
      alert('결제금액과 할부개월수를 입력해주세요.');
      return;
    }

    if (isInterestFree === 'yes') {
      const monthlyPayment = amount / monthCount;
      setResults({
        monthlyPayment,
        totalInterest: 0,
        totalPayment: amount,
        isInterestFree: true,
      });
      return;
    }

    const rate = (parseFloat(annualRate) || 0) / 100;
    // 실질이자 = 결제금액 × 할부수수료율 / 12 × 할부개월수
    const totalInterest = amount * (rate / 12) * monthCount;
    const totalPayment = amount + totalInterest;
    const monthlyPayment = totalPayment / monthCount;

    setResults({
      monthlyPayment,
      totalInterest,
      totalPayment,
      isInterestFree: false,
      annualRate: rate * 100,
    });
  };

  return (
    <div className="mx-auto max-w-[1200px] px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-fg-muted mb-8">
        <Link href="/" className="hover:text-fg transition-colors">홈</Link>
        <ChevronRight size={12} />
        <span className="text-fg-secondary">금융</span>
        <ChevronRight size={12} />
        <span className="text-fg font-medium">할부 이자 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">할부 이자 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        신용카드 할부 결제 시 발생하는 이자와 월 납부액을 계산합니다. 무이자할부와 유이자할부를 모두 지원합니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 결제금액 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              결제금액 (원) *
            </label>
            <input
              type="number"
              value={purchaseAmount}
              onChange={(e) => setPurchaseAmount(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
          </div>

          {/* 무이자 여부 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              무이자 할부 여부
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'no', label: '유이자 할부' },
                { val: 'yes', label: '무이자 할부' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setIsInterestFree(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    isInterestFree === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 할부 개월수 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              할부 개월수
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: '2', label: '2개월' },
                { val: '3', label: '3개월' },
                { val: '6', label: '6개월' },
                { val: '10', label: '10개월' },
                { val: '12', label: '12개월' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleMonthChange(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    months === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 연이율 (유이자만) */}
          {isInterestFree === 'no' && (
            <div className="mb-6">
              <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                연이율 (%) *
              </label>
              <input
                type="number"
                value={annualRate}
                onChange={(e) => setAnnualRate(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                placeholder="0"
                step="0.1"
              />
              <p className="text-[12px] text-fg-muted mt-1.5">
                카드사 평균 할부수수료율: 2개월 10~12%, 3개월 11~13%, 6개월 12~14%, 10개월 13~15%, 12개월 14~16%
              </p>
            </div>
          )}

          {/* Calculate Button */}
          <button
            onClick={handleCalculate}
            className="w-full h-11 bg-accent hover:bg-accent-hover text-accent-fg font-medium rounded-xl transition-colors"
          >
            계산하기
          </button>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="border border-border rounded-2xl bg-surface p-6 md:p-8 mb-8">
          <h2 className="text-[18px] font-bold text-fg mb-6">계산 결과</h2>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">할부 유형</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.isInterestFree ? '무이자 할부' : `유이자 할부 (연 ${results.annualRate}%)`}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">월 납부액</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.monthlyPayment)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">총 이자비용</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.totalInterest)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">총 납부액</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {formatNumber(results.totalPayment)}원
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 무이자할부는 이자가 없지만, 카드사별로 적용 조건이 다릅니다.</li>
          <li>· 할부수수료율은 카드사마다 다르며, 할부 기간이 길수록 수수료율이 높습니다.</li>
          <li>· 부분 무이자할부의 경우 일부 회차만 이자가 면제될 수 있습니다.</li>
          <li>· 할부 결제 시 신용등급에 영향을 줄 수 있으니 신중하게 결정하세요.</li>
        </ul>
      </div>
    </div>
  );
}
