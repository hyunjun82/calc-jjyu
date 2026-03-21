'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function VatCalculator() {
  const [taxPayerType, setTaxPayerType] = useState('general');
  const [salesAmount, setSalesAmount] = useState('');
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [businessType, setBusinessType] = useState('retail');
  const [taxPeriod, setTaxPeriod] = useState('1');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const businessTypes = [
    { val: 'retail', label: '소매업, 재생용 재료수집·판매업, 음식점업', rate: 0.15 },
    { val: 'manufacturing', label: '제조업, 농·임·어업, 소화물전문운송업', rate: 0.20 },
    { val: 'accommodation', label: '숙박업, 운수·통신업', rate: 0.30 },
    { val: 'construction', label: '건설업, 부동산임대업, 기타 서비스업', rate: 0.40 },
  ];

  const getValueAddedRate = (type: string): number => {
    const found = businessTypes.find((b) => b.val === type);
    return found ? found.rate : 0.15;
  };

  const handleCalculate = () => {
    const sales = parseFloat(salesAmount) || 0;

    if (sales <= 0) {
      alert('매출액을 입력해주세요.');
      return;
    }

    if (taxPayerType === 'general') {
      const purchase = parseFloat(purchaseAmount) || 0;
      const outputTax = sales * 0.1;
      const inputTax = purchase * 0.1;
      const payableTax = outputTax - inputTax;

      setResults({
        type: 'general',
        outputTax,
        inputTax,
        payableTax,
        isRefund: payableTax < 0,
      });
    } else {
      const valueAddedRate = getValueAddedRate(businessType);
      const payableTax = sales * valueAddedRate * 0.1;
      const isExempt = sales < 48000000;

      setResults({
        type: 'simplified',
        salesAmount: sales,
        valueAddedRate,
        payableTax,
        isExempt,
      });
    }
  };

  return (
    <div className="mx-auto max-w-[1200px] px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-fg-muted mb-8">
        <Link href="/" className="hover:text-fg transition-colors">홈</Link>
        <ChevronRight size={12} />
        <span className="text-fg-secondary">세금</span>
        <ChevronRight size={12} />
        <span className="text-fg font-medium">부가가치세 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">부가가치세 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        일반과세자와 간이과세자의 부가가치세를 계산합니다. 국세청 기준 업종별 부가가치율을 적용합니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 과세자 유형 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              과세자 유형
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'general', label: '일반과세자' },
                { val: 'simplified', label: '간이과세자' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => { setTaxPayerType(val); setResults(null); }}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    taxPayerType === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {taxPayerType === 'general' ? (
            <>
              {/* 매출액 (일반) */}
              <div className="mb-6">
                <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                  매출액 (공급가액, 원) *
                </label>
                <input
                  type="number"
                  value={salesAmount}
                  onChange={(e) => setSalesAmount(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                  placeholder="0"
                />
                <p className="text-[12px] text-fg-muted mt-1.5">
                  세금계산서 상의 공급가액 합계
                </p>
              </div>

              {/* 매입액 (일반) */}
              <div className="mb-6">
                <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                  매입액 (공급가액, 원) *
                </label>
                <input
                  type="number"
                  value={purchaseAmount}
                  onChange={(e) => setPurchaseAmount(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                  placeholder="0"
                />
                <p className="text-[12px] text-fg-muted mt-1.5">
                  세금계산서 상의 매입 공급가액 합계
                </p>
              </div>
            </>
          ) : (
            <>
              {/* 매출액 (간이) */}
              <div className="mb-6">
                <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                  매출액 (원) *
                </label>
                <input
                  type="number"
                  value={salesAmount}
                  onChange={(e) => setSalesAmount(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                  placeholder="0"
                />
                <p className="text-[12px] text-fg-muted mt-1.5">
                  연간 매출액 기준 (연매출 8,000만원 미만 시 간이과세 적용)
                </p>
              </div>

              {/* 업종 선택 */}
              <div className="mb-6">
                <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                  업종 선택
                </label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                >
                  {businessTypes.map(({ val, label, rate }) => (
                    <option key={val} value={val}>
                      {label} (부가가치율 {(rate * 100).toFixed(0)}%)
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* 과세기간 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              과세기간
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: '1', label: '1기 (1~6월)' },
                { val: '2', label: '2기 (7~12월)' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setTaxPeriod(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    taxPeriod === val
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
      {results && results.type === 'general' && (
        <div className="border border-border rounded-2xl bg-surface p-6 md:p-8 mb-8">
          <h2 className="text-[18px] font-bold text-fg mb-6">계산 결과</h2>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">매출세액 (매출액 × 10%)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.outputTax)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">매입세액 (매입액 × 10%)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.inputTax)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">
              {results.isRefund ? '환급세액' : '납부세액'}
            </span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {formatNumber(Math.abs(results.payableTax))}원
            </span>
          </div>

          {results.isRefund && (
            <p className="text-[12px] text-fg-muted mt-3">
              매입세액이 매출세액보다 커서 환급 대상입니다.
            </p>
          )}
        </div>
      )}

      {results && results.type === 'simplified' && (
        <div className="border border-border rounded-2xl bg-surface p-6 md:p-8 mb-8">
          <h2 className="text-[18px] font-bold text-fg mb-6">계산 결과</h2>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">매출액</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.salesAmount)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">업종별 부가가치율</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {(results.valueAddedRate * 100).toFixed(0)}%
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">세부담 금액 (매출액 × 부가가치율 × 10%)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.payableTax)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">
              {results.isExempt ? '납부세액 (면제)' : '납부세액'}
            </span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {results.isExempt ? '0' : formatNumber(results.payableTax)}원
            </span>
          </div>

          {results.isExempt && (
            <p className="text-[12px] text-fg-muted mt-3">
              연매출 4,800만원 미만으로 납부의무가 면제됩니다.
            </p>
          )}
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 일반과세자의 부가가치세는 매출세액에서 매입세액을 차감하여 계산합니다.</li>
          <li>· 간이과세자는 연매출 8,000만원 미만인 사업자에게 적용됩니다.</li>
          <li>· 간이과세자 중 연매출 4,800만원 미만은 납부의무가 면제됩니다.</li>
          <li>· 과세기간은 1기(1~6월), 2기(7~12월)로 나뉘며 각 기간별로 신고합니다.</li>
          <li>· 매입세액이 매출세액보다 큰 경우 환급을 받을 수 있습니다.</li>
        </ul>
      </div>
    </div>
  );
}
