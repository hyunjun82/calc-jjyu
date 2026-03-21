'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function PensionSavingCalculator() {
  const [totalSalary, setTotalSalary] = useState('');
  const [pensionSaving, setPensionSaving] = useState('');
  const [irpAmount, setIrpAmount] = useState('');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const handleCalculate = () => {
    const salary = parseFloat(totalSalary) || 0;
    const saving = parseFloat(pensionSaving) || 0;
    const irp = parseFloat(irpAmount) || 0;

    if (salary <= 0) {
      alert('총급여를 입력해주세요.');
      return;
    }

    // 납입한도: 연금저축 최대 600만원, IRP 합산 최대 900만원
    const pensionSavingLimit = 6000000;
    const totalLimit = 9000000;

    const effectivePensionSaving = Math.min(saving, pensionSavingLimit);
    const effectiveTotal = Math.min(effectivePensionSaving + irp, totalLimit);
    const effectiveIrp = effectiveTotal - effectivePensionSaving;

    // 공제율: 총급여 5,500만원 이하 16.5%, 초과 13.2%
    const deductionRate = salary <= 55000000 ? 0.165 : 0.132;
    const taxCredit = effectiveTotal * deductionRate;

    // 실질 수익률 (세액공제액 / 납입액)
    const actualContribution = saving + irp;
    const effectiveReturnRate = actualContribution > 0 ? (taxCredit / actualContribution) * 100 : 0;

    // 최대 세액공제 참고
    const maxTaxCredit = totalLimit * deductionRate;

    setResults({
      effectivePensionSaving,
      effectiveIrp,
      effectiveTotal,
      deductionRate: (deductionRate * 100).toFixed(1),
      taxCredit,
      maxTaxCredit,
      effectiveReturnRate,
      overLimit: (saving + irp) > totalLimit,
    });
  };

  return (
    <div className="mx-auto max-w-[1200px] px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-fg-muted mb-8">
        <Link href="/" className="hover:text-fg transition-colors">홈</Link>
        <ChevronRight size={12} />
        <span className="text-fg-secondary">연금/보험</span>
        <ChevronRight size={12} />
        <span className="text-fg font-medium">연금저축 세액공제 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">연금저축 세액공제 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        연금저축과 IRP 납입액에 대한 세액공제를 계산합니다. 총급여에 따라 13.2% 또는 16.5%의 공제율이 적용됩니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 총급여 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              총급여 (원) *
            </label>
            <input
              type="number"
              value={totalSalary}
              onChange={(e) => setTotalSalary(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              연간 총급여액 (5,500만원 기준으로 공제율 구분)
            </p>
          </div>

          {/* 연금저축 납입액 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              연금저축 납입액 (원)
            </label>
            <input
              type="number"
              value={pensionSaving}
              onChange={(e) => setPensionSaving(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              연간 납입액 (한도: 600만원)
            </p>
          </div>

          {/* IRP 납입액 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              IRP 납입액 (원)
            </label>
            <input
              type="number"
              value={irpAmount}
              onChange={(e) => setIrpAmount(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              연간 납입액 (연금저축 + IRP 합산 한도: 900만원)
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
            <span className="text-[13px] text-fg-secondary">공제대상 연금저축</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.effectivePensionSaving)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">공제대상 IRP</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.effectiveIrp)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">공제대상 합계</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.effectiveTotal)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">공제율</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.deductionRate}%
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">실질 수익률 (세액공제/납입액)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.effectiveReturnRate.toFixed(1)}%
            </span>
          </div>

          {results.overLimit && (
            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-[13px] text-fg-secondary text-amber-600">납입한도 초과분은 공제 대상에서 제외됩니다</span>
            </div>
          )}

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">세액공제액</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {formatNumber(results.taxCredit)}원
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 연금저축 한도는 연 600만원, IRP 합산 시 최대 900만원까지 세액공제됩니다.</li>
          <li>· 총급여 5,500만원 이하: 16.5% 공제 (최대 148.5만원 절세).</li>
          <li>· 총급여 5,500만원 초과: 13.2% 공제 (최대 118.8만원 절세).</li>
          <li>· 연금 수령 시 연금소득세(3.3~5.5%)가 과세되므로 장기 유지가 유리합니다.</li>
        </ul>
      </div>
    </div>
  );
}
