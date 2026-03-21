'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function ExchangeRateCalculator() {
  const [amount, setAmount] = useState('');
  const [direction, setDirection] = useState('krwToForeign');
  const [currency, setCurrency] = useState('USD');
  const [customRate, setCustomRate] = useState('');
  const [preferentialRate, setPreferentialRate] = useState('0');
  const [results, setResults] = useState<any>(null);

  const defaultRates: Record<string, { rate: number; label: string; unit: string }> = {
    USD: { rate: 1350, label: '미국 달러 (USD)', unit: 'USD' },
    EUR: { rate: 1470, label: '유로 (EUR)', unit: 'EUR' },
    JPY: { rate: 900, label: '일본 엔 (100엔)', unit: 'JPY' },
    CNY: { rate: 186, label: '중국 위안 (CNY)', unit: 'CNY' },
    GBP: { rate: 1710, label: '영국 파운드 (GBP)', unit: 'GBP' },
  };

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const formatDecimal = (num: number, decimals: number = 2): string => {
    return num.toLocaleString('ko-KR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  };

  const handleCurrencyChange = (cur: string) => {
    setCurrency(cur);
    setCustomRate(defaultRates[cur].rate.toString());
  };

  const handleCalculate = () => {
    const amt = parseFloat(amount) || 0;
    if (amt <= 0) {
      alert('금액을 입력해주세요.');
      return;
    }

    const baseRate = parseFloat(customRate) || defaultRates[currency].rate;
    const spreadRate = 0.0175; // 1.75%
    const prefRate = (parseFloat(preferentialRate) || 0) / 100;
    const adjustedSpread = spreadRate * (1 - prefRate);

    const isJpy = currency === 'JPY';
    const divisor = isJpy ? 100 : 1;

    let exchangedAmount = 0;
    let appliedRate = 0;
    let spreadCost = 0;

    if (direction === 'krwToForeign') {
      // 원화 → 외화 (살 때: 매매기준율 + 스프레드)
      appliedRate = baseRate * (1 + adjustedSpread);
      exchangedAmount = (amt / appliedRate) * divisor;
      spreadCost = amt - (amt / (baseRate * (1 + adjustedSpread))) * divisor * (baseRate / divisor);
    } else {
      // 외화 → 원화 (팔 때: 매매기준율 - 스프레드)
      appliedRate = baseRate * (1 - adjustedSpread);
      exchangedAmount = (amt / divisor) * appliedRate;
      spreadCost = (amt / divisor) * baseRate - exchangedAmount;
    }

    setResults({
      exchangedAmount,
      appliedRate,
      baseRate,
      spreadCost: Math.abs(spreadCost),
      direction,
      currency,
      isJpy,
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
        <span className="text-fg font-medium">환율 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">환율 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        주요 통화의 환전 금액을 계산합니다. 매매기준율과 스프레드, 우대율을 적용하여 실제 환전 비용을 확인할 수 있습니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 환전 방향 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              환전 방향
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'krwToForeign', label: '원화 → 외화' },
                { val: 'foreignToKrw', label: '외화 → 원화' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setDirection(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    direction === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 통화 선택 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              통화 선택
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(defaultRates).map(([key, { label }]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleCurrencyChange(key)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    currency === key
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>

          {/* 금액 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              {direction === 'krwToForeign' ? '원화 금액 (원) *' : `외화 금액 (${currency}) *`}
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
          </div>

          {/* 환율 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              매매기준율 (원/{currency === 'JPY' ? '100엔' : currency})
            </label>
            <input
              type="number"
              value={customRate || defaultRates[currency].rate.toString()}
              onChange={(e) => setCustomRate(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              step="0.01"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              참고용 고정 환율입니다. 실시간 환율과 다를 수 있습니다.
            </p>
          </div>

          {/* 우대율 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              환율 우대율 (%)
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: '0', label: '0% (기본)' },
                { val: '50', label: '50%' },
                { val: '90', label: '90%' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setPreferentialRate(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    preferentialRate === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
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
            <span className="text-[13px] text-fg-secondary">매매기준율</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatDecimal(results.baseRate)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">적용환율 ({results.direction === 'krwToForeign' ? '살 때' : '팔 때'})</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatDecimal(results.appliedRate)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">스프레드 비용</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.spreadCost)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">환전 금액</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {results.direction === 'krwToForeign'
                ? `${formatDecimal(results.exchangedAmount)} ${results.currency}`
                : `${formatNumber(results.exchangedAmount)}원`}
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 은행마다 스프레드(환전 수수료)가 다르며, 기본 1.75%가 적용됩니다.</li>
          <li>· 환율 우대를 받으면 스프레드가 줄어들어 유리한 환율로 환전할 수 있습니다.</li>
          <li>· 인터넷/모바일뱅킹을 이용하면 높은 우대율을 받을 수 있습니다.</li>
          <li>· 표시된 환율은 참고용이며, 실제 환전 시에는 실시간 환율이 적용됩니다.</li>
        </ul>
      </div>
    </div>
  );
}
