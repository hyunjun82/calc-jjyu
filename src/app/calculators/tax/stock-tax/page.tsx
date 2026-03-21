'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function StockTaxCalculator() {
  const [stockType, setStockType] = useState('overseas');
  const [companySize, setCompanySize] = useState('general');
  const [saleAmount, setSaleAmount] = useState('');
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [expenses, setExpenses] = useState('');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const handleCalculate = () => {
    const sale = parseFloat(saleAmount) || 0;
    const purchase = parseFloat(purchaseAmount) || 0;
    const expense = parseFloat(expenses) || 0;

    if (sale <= 0 || purchase <= 0) {
      alert('양도가액과 취득가액을 입력해주세요.');
      return;
    }

    const capitalGain = sale - purchase - expense;

    if (capitalGain <= 0) {
      setResults({
        capitalGain,
        basicDeduction: 0,
        taxBase: 0,
        appliedRate: '0',
        incomeTax: 0,
        localTax: 0,
        totalTax: 0,
        netProceeds: sale - purchase - expense,
      });
      return;
    }

    const basicDeduction = 2500000; // 250만원
    const taxBase = Math.max(capitalGain - basicDeduction, 0);

    let incomeTax = 0;
    let appliedRate = '';

    if (stockType === 'overseas') {
      // 해외주식: 22% (양도소득세 20% + 지방소득세 2%)
      incomeTax = taxBase * 0.2;
      appliedRate = '20%';
    } else if (stockType === 'domestic-major') {
      // 국내 대주주 상장주식
      if (companySize === 'sme') {
        // 중소기업
        if (taxBase <= 300000000) {
          incomeTax = taxBase * 0.1;
          appliedRate = '10%';
        } else {
          incomeTax = 300000000 * 0.1 + (taxBase - 300000000) * 0.2;
          appliedRate = '10%/20%';
        }
      } else {
        // 일반기업
        if (taxBase <= 300000000) {
          incomeTax = taxBase * 0.2;
          appliedRate = '20%';
        } else {
          incomeTax = 300000000 * 0.2 + (taxBase - 300000000) * 0.25;
          appliedRate = '20%/25%';
        }
      }
    } else {
      // 국내 비상장주식
      if (companySize === 'sme') {
        // 중소기업
        if (taxBase <= 300000000) {
          incomeTax = taxBase * 0.1;
          appliedRate = '10%';
        } else {
          incomeTax = 300000000 * 0.1 + (taxBase - 300000000) * 0.2;
          appliedRate = '10%/20%';
        }
      } else {
        // 중소기업 외
        if (taxBase <= 300000000) {
          incomeTax = taxBase * 0.2;
          appliedRate = '20%';
        } else {
          incomeTax = 300000000 * 0.2 + (taxBase - 300000000) * 0.25;
          appliedRate = '20%/25%';
        }
      }
    }

    const localTax = incomeTax * 0.1;
    const totalTax = incomeTax + localTax;
    const netProceeds = sale - purchase - expense - totalTax;

    setResults({
      capitalGain,
      basicDeduction: Math.min(basicDeduction, capitalGain),
      taxBase,
      appliedRate,
      incomeTax,
      localTax,
      totalTax,
      netProceeds,
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
        <span className="text-fg font-medium">주식 양도소득세 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">주식 양도소득세 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        국내 대주주 및 해외주식 양도 시 발생하는 양도소득세를 계산합니다. 기본공제 250만원이 적용됩니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 주식 유형 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              주식 유형
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'overseas', label: '해외주식' },
                { val: 'domestic-major', label: '국내 대주주 상장' },
                { val: 'domestic-unlisted', label: '국내 비상장' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setStockType(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    stockType === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 기업 규모 - 국내만 */}
          {stockType !== 'overseas' && (
            <div className="mb-6">
              <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                기업 규모
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { val: 'general', label: '일반기업' },
                  { val: 'sme', label: '중소기업' },
                ].map(({ val, label }) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setCompanySize(val)}
                    className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                      companySize === val
                        ? 'bg-accent text-accent-fg'
                        : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 양도가액 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              양도가액 (매도금액, 원) *
            </label>
            <input
              type="number"
              value={saleAmount}
              onChange={(e) => setSaleAmount(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
          </div>

          {/* 취득가액 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              취득가액 (매수금액, 원) *
            </label>
            <input
              type="number"
              value={purchaseAmount}
              onChange={(e) => setPurchaseAmount(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
          </div>

          {/* 필요경비 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              필요경비 (수수료 등, 원)
            </label>
            <input
              type="number"
              value={expenses}
              onChange={(e) => setExpenses(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              거래수수료, 증권거래세 등 양도 관련 비용
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
            <span className="text-[13px] text-fg-secondary">양도차익</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.capitalGain)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">기본공제</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.basicDeduction)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">과세표준</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.taxBase)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">적용세율</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.appliedRate}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">양도소득세</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.incomeTax)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">지방소득세 (10%)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.localTax)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2 mb-2">
            <span className="text-[15px] font-semibold text-fg">총 납부세액</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {formatNumber(results.totalTax)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-t border-border mt-2">
            <span className="text-[13px] text-fg-secondary">실수령액 (양도가액 - 취득가액 - 경비 - 세금)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.netProceeds)}원
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 해외주식은 양도차익 250만원까지 기본공제되며, 세율 22%(소득세 20% + 지방소득세 2%)가 적용됩니다.</li>
          <li>· 국내 상장주식은 종목별 보유액 10억원 이상 대주주만 과세 대상입니다.</li>
          <li>· 중소기업 주식은 3억원 이하 10%, 3억원 초과 20%의 낮은 세율이 적용됩니다.</li>
          <li>· 양도소득세는 양도일이 속하는 반기의 말일부터 2개월 이내 예정신고해야 합니다.</li>
        </ul>
      </div>
    </div>
  );
}
