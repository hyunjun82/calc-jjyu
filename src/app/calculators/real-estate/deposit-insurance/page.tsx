'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function DepositInsuranceCalculator() {
  const [jeonseDeposit, setJeonseDeposit] = useState('');
  const [housePrice, setHousePrice] = useState('');
  const [insurer, setInsurer] = useState('HUG');
  const [guaranteePeriod, setGuaranteePeriod] = useState('24');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const handleCalculate = () => {
    const deposit = parseFloat(jeonseDeposit) || 0;
    const price = parseFloat(housePrice) || 0;
    const period = parseFloat(guaranteePeriod) || 24;

    if (deposit <= 0) {
      alert('전세보증금을 입력해주세요.');
      return;
    }

    if (price <= 0) {
      alert('주택가격을 입력해주세요.');
      return;
    }

    let premiumRate: number;
    let guaranteeAmount: number;

    if (insurer === 'HUG') {
      // HUG: 자기부담금 5%
      guaranteeAmount = deposit - (deposit * 0.05);

      // 보증료율 (주택가격 기준)
      if (price <= 300000000) premiumRate = 0.00115;
      else if (price <= 600000000) premiumRate = 0.00128;
      else if (price <= 1000000000) premiumRate = 0.00143;
      else premiumRate = 0.00154;
    } else {
      // HF: 일반 보증료율
      guaranteeAmount = deposit - (deposit * 0.05);
      premiumRate = 0.00047;
    }

    const premium = guaranteeAmount * premiumRate * (period / 12);
    const monthlyPremium = premium / period;

    setResults({
      guaranteeAmount,
      premiumRate: (premiumRate * 100).toFixed(3),
      premium,
      monthlyPremium,
      period,
      insurer,
    });
  };

  return (
    <div className="mx-auto max-w-[1200px] px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-fg-muted mb-8">
        <Link href="/" className="hover:text-fg transition-colors">홈</Link>
        <ChevronRight size={12} />
        <span className="text-fg-secondary">부동산</span>
        <ChevronRight size={12} />
        <span className="text-fg font-medium">전세보증보험료 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">전세보증보험료 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        전세보증보험 가입 시 예상 보증료를 HUG(주택도시보증공사) 및 HF(한국주택금융공사) 기준으로 계산합니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 전세보증금 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              전세보증금 (원) *
            </label>
            <input
              type="number"
              value={jeonseDeposit}
              onChange={(e) => setJeonseDeposit(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
          </div>

          {/* 주택가격 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              주택가격 (시세, 원) *
            </label>
            <input
              type="number"
              value={housePrice}
              onChange={(e) => setHousePrice(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              HUG 보증료율 산정 기준
            </p>
          </div>

          {/* 보증기관 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              보증기관
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'HUG', label: 'HUG (주택도시보증공사)' },
                { val: 'HF', label: 'HF (한국주택금융공사)' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setInsurer(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    insurer === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 보증기간 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              보증기간 (개월)
            </label>
            <input
              type="number"
              value={guaranteePeriod}
              onChange={(e) => setGuaranteePeriod(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="24"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              일반적으로 임대차 계약기간과 동일 (24개월)
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
            <span className="text-[13px] text-fg-secondary">보증기관</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.insurer === 'HUG' ? 'HUG (주택도시보증공사)' : 'HF (한국주택금융공사)'}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">보증금액 (자기부담금 5% 제외)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.guaranteeAmount)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">보증료율 (연)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.premiumRate}%
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">보증기간</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.period}개월
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">월 환산 보증료</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.monthlyPremium)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">총 보증료</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {formatNumber(results.premium)}원
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· HUG 보증료율은 주택가격에 따라 0.115~0.154%입니다.</li>
          <li>· HF 보증료율은 일반 기준 0.047%로 HUG보다 저렴합니다.</li>
          <li>· 보증금액은 전세보증금에서 자기부담금(5%)을 제외한 금액입니다.</li>
          <li>· 전세보증보험은 임차인의 보증금 반환을 보장합니다.</li>
        </ul>
      </div>
    </div>
  );
}
