'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function RegistrationCostCalculator() {
  const [salePrice, setSalePrice] = useState('');
  const [assessedValue, setAssessedValue] = useState('');
  const [houseCount, setHouseCount] = useState('1');
  const [areaType, setAreaType] = useState('small');
  const [lawyerFee, setLawyerFee] = useState('500000');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const handleCalculate = () => {
    const price = parseFloat(salePrice) || 0;
    const assessed = parseFloat(assessedValue) || 0;
    const lawyer = parseFloat(lawyerFee) || 500000;

    if (price <= 0) {
      alert('매매가격을 입력해주세요.');
      return;
    }

    if (assessed <= 0) {
      alert('시가표준액(공시가격)을 입력해주세요.');
      return;
    }

    // 취득세율 결정
    let taxRate: number;
    if (houseCount === '1') {
      if (price <= 600000000) taxRate = 0.01;
      else if (price <= 900000000) taxRate = 0.01 + ((price - 600000000) / 300000000) * 0.02;
      else taxRate = 0.03;
    } else if (houseCount === '2') {
      taxRate = 0.08;
    } else {
      taxRate = 0.12;
    }

    const acquisitionTax = price * taxRate;
    const localEducationTax = acquisitionTax * 0.1;
    const ruralSpecialTax = areaType === 'large' ? acquisitionTax * 0.1 : 0;

    // 인지세
    let stampTax = 0;
    if (price > 1000000000) stampTax = 350000;
    else if (price > 100000000) stampTax = 150000;

    // 국민주택채권 매입비율 (서울 기준)
    let bondRate: number;
    if (assessed <= 20000000) bondRate = 0.01;
    else if (assessed <= 50000000) bondRate = 0.013;
    else if (assessed <= 100000000) bondRate = 0.015;
    else if (assessed <= 160000000) bondRate = 0.016;
    else bondRate = 0.019;

    const bondPurchaseAmount = assessed * bondRate;
    const bondDiscountRate = 0.04;
    const bondDiscountCost = bondPurchaseAmount * bondDiscountRate;

    // 등기신청수수료
    const registrationFee = 15000;

    const totalCost = acquisitionTax + localEducationTax + ruralSpecialTax + stampTax + bondDiscountCost + lawyer + registrationFee;

    setResults({
      acquisitionTax,
      taxRate: (taxRate * 100).toFixed(1),
      localEducationTax,
      ruralSpecialTax,
      stampTax,
      bondPurchaseAmount,
      bondDiscountCost,
      lawyerFee: lawyer,
      registrationFee,
      totalCost,
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
        <span className="text-fg font-medium">등기비용 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">등기비용 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        부동산 매매 시 발생하는 취득세, 교육세, 채권매입비, 법무사비 등 총 등기비용을 계산합니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 매매가격 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              매매가격 (원) *
            </label>
            <input
              type="number"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
          </div>

          {/* 시가표준액 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              시가표준액 (공시가격, 원) *
            </label>
            <input
              type="number"
              value={assessedValue}
              onChange={(e) => setAssessedValue(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              국민주택채권 매입금액 산정 기준
            </p>
          </div>

          {/* 주택수 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              주택 수
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: '1', label: '1주택' },
                { val: '2', label: '2주택' },
                { val: '3', label: '3주택 이상' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setHouseCount(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    houseCount === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 면적 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              주택 면적
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'small', label: '85m² 이하' },
                { val: 'large', label: '85m² 초과' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAreaType(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    areaType === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 법무사비 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              법무사비 (원)
            </label>
            <input
              type="number"
              value={lawyerFee}
              onChange={(e) => setLawyerFee(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="500000"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              일반적으로 40~60만원 수준
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
            <span className="text-[13px] text-fg-secondary">취득세 ({results.taxRate}%)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.acquisitionTax)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">지방교육세 (취득세의 10%)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.localEducationTax)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">농어촌특별세 {results.ruralSpecialTax === 0 ? '(비과세)' : '(취득세의 10%)'}</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.ruralSpecialTax)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">인지세</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.stampTax)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">채권할인비용</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.bondDiscountCost)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">법무사비</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.lawyerFee)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">등기신청수수료</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.registrationFee)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">총 등기비용</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {formatNumber(results.totalCost)}원
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 취득세율은 주택 수에 따라 1~12%까지 차등 적용됩니다.</li>
          <li>· 국민주택채권은 즉시 할인매도하여 할인비용만 부담합니다.</li>
          <li>· 인지세는 매매가 1억 이하 면제, 1~10억 15만원, 10억 초과 35만원입니다.</li>
          <li>· 실제 비용은 법무사 수수료, 채권 할인율 등에 따라 달라질 수 있습니다.</li>
        </ul>
      </div>
    </div>
  );
}
