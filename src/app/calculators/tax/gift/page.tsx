'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

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
      case 'child_minor':
        return 20000000; // 직계비속 (미성년): 2천만원
      case 'child_marriage':
        return 150000000; // 직계비속 (혼인/출산): 1.5억원
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
    <div className="mx-auto max-w-[1200px] px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-fg-muted mb-8">
        <Link href="/" className="hover:text-fg transition-colors">홈</Link>
        <ChevronRight size={12} />
        <span className="text-fg-secondary">세금</span>
        <ChevronRight size={12} />
        <span className="text-fg font-medium">증여세 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">증여세 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        재산을 증여받을 때 발생하는 증여세를 계산합니다. 증여자와의 관계에 따른 공제액과 누진세율이 적용됩니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 증여자와의 관계 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              증여자와의 관계
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'spouse', label: '배우자 (공제 6억원)' },
                { val: 'parent', label: '직계존속 (공제 5천만원)' },
                { val: 'child', label: '직계비속 (공제 5천만원)' },
                { val: 'child_minor', label: '직계비속 미성년 (공제 2천만원)' },
                { val: 'child_marriage', label: '직계비속 혼인/출산 (공제 1.5억원)' },
                { val: 'relative', label: '기타친족 (공제 1천만원)' },
                { val: 'other', label: '그 외 (공제 없음)' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setRelationship(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    relationship === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 증여재산가액 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              증여재산가액 (원) *
            </label>
            <input
              type="number"
              value={giftAmount}
              onChange={(e) => setGiftAmount(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              증여받은 재산의 평가액 (현금, 부동산 등)
            </p>
          </div>

          {/* 채무부담액 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              채무부담액 (원)
            </label>
            <input
              type="number"
              value={debt}
              onChange={(e) => setDebt(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              증여받은 부동산의 담보 대출금
            </p>
          </div>

          {/* 10년 이내 동일인 증여액 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              10년 이내 동일인 증여액 (원)
            </label>
            <input
              type="number"
              value={previousGift10Years}
              onChange={(e) => setPreviousGift10Years(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              지난 10년 이내 동일인으로부터 받은 증여액
            </p>
          </div>

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
            <span className="text-[13px] text-fg-secondary">증여재산가액</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.giftAmount)}원
            </span>
          </div>

          {results.debtAmount > 0 && (
            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-[13px] text-fg-secondary">채무부담액</span>
              <span className="text-[14px] font-medium text-fg tabular-nums">
                -{formatNumber(results.debtAmount)}원
              </span>
            </div>
          )}

          {results.debtAmount > 0 && (
            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-[13px] text-fg-secondary">증여받은 순 가액</span>
              <span className="text-[14px] font-medium text-fg tabular-nums">
                {formatNumber(results.giftableAmount)}원
              </span>
            </div>
          )}

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">증여공제액</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              -{formatNumber(results.giftDeduction)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">과세표준</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.taxableIncome)}원
            </span>
          </div>

          {results.giftTax > 0 && (
            <>
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-[13px] text-fg-secondary">세율</span>
                <span className="text-[14px] font-medium text-fg tabular-nums">
                  {results.taxRate}%
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-[13px] text-fg-secondary">증여세</span>
                <span className="text-[14px] font-medium text-fg tabular-nums">
                  {formatNumber(results.giftTax)}원
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-[13px] text-fg-secondary">신고세액공제 (3%)</span>
                <span className="text-[14px] font-medium text-fg tabular-nums">
                  -{formatNumber(results.reportingCredit)}원
                </span>
              </div>
            </>
          )}

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">납부할 세액</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {formatNumber(results.payableAmount)}원
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 배우자의 경우 가장 높은 6억원의 공제를 받습니다.</li>
          <li>· 10년 이내에 받은 동일인의 증여는 누적되어 과세됩니다.</li>
          <li>· 신고세액공제는 성실 신고 시 자동으로 적용됩니다.</li>
          <li>· 금융자산의 경우 평가액이 증여세의 중요한 요소입니다.</li>
        </ul>
      </div>
    </div>
  );
}
