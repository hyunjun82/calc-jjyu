'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function Rule72Calculator() {
  const [mode, setMode] = useState('period');
  const [returnRate, setReturnRate] = useState('');
  const [targetPeriod, setTargetPeriod] = useState('');
  const [results, setResults] = useState<any>(null);

  const handleCalculate = () => {
    if (mode === 'period') {
      const rate = parseFloat(returnRate) || 0;
      if (rate <= 0) {
        alert('수익률을 입력해주세요.');
        return;
      }

      const rule72Years = 72 / rate;
      const exactYears = Math.log(2) / Math.log(1 + rate / 100);
      const difference = Math.abs(rule72Years - exactYears);

      setResults({
        mode: 'period',
        rule72Years,
        exactYears,
        difference,
        rate,
      });
    } else {
      const period = parseFloat(targetPeriod) || 0;
      if (period <= 0) {
        alert('목표 기간을 입력해주세요.');
        return;
      }

      const rule72Rate = 72 / period;
      const exactRate = (Math.pow(2, 1 / period) - 1) * 100;
      const difference = Math.abs(rule72Rate - exactRate);

      setResults({
        mode: 'rate',
        rule72Rate,
        exactRate,
        difference,
        period,
      });
    }
  };

  return (
    <div className="mx-auto max-w-[1200px] px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-fg-muted mb-8">
        <Link href="/" className="hover:text-fg transition-colors">홈</Link>
        <ChevronRight size={12} />
        <span className="text-fg-secondary">투자</span>
        <ChevronRight size={12} />
        <span className="text-fg font-medium">72법칙 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">72법칙 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        72법칙을 활용하여 원금이 2배가 되는 데 걸리는 기간 또는 필요한 수익률을 계산합니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 모드 선택 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              계산 모드
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'period', label: '기간 계산 (수익률 입력)' },
                { val: 'rate', label: '수익률 계산 (기간 입력)' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    setMode(val);
                    setResults(null);
                  }}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    mode === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 수익률 입력 (기간 계산 모드) */}
          {mode === 'period' && (
            <div className="mb-6">
              <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                연 수익률 (%) *
              </label>
              <input
                type="number"
                value={returnRate}
                onChange={(e) => setReturnRate(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                placeholder="7"
                step="0.1"
              />
            </div>
          )}

          {/* 목표 기간 입력 (수익률 계산 모드) */}
          {mode === 'rate' && (
            <div className="mb-6">
              <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                목표 기간 (년) *
              </label>
              <input
                type="number"
                value={targetPeriod}
                onChange={(e) => setTargetPeriod(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                placeholder="10"
                step="1"
              />
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
      {results && results.mode === 'period' && (
        <div className="border border-border rounded-2xl bg-surface p-6 md:p-8 mb-8">
          <h2 className="text-[18px] font-bold text-fg mb-6">계산 결과</h2>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">입력 수익률</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              연 {results.rate}%
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">72법칙 근사값</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              약 {results.rule72Years.toFixed(1)}년
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">정확한 계산값</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              약 {results.exactYears.toFixed(2)}년
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">오차</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.difference.toFixed(2)}년
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">원금 2배 소요 기간</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              약 {results.exactYears.toFixed(1)}년
            </span>
          </div>
        </div>
      )}

      {results && results.mode === 'rate' && (
        <div className="border border-border rounded-2xl bg-surface p-6 md:p-8 mb-8">
          <h2 className="text-[18px] font-bold text-fg mb-6">계산 결과</h2>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">목표 기간</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.period}년
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">72법칙 근사값</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              연 {results.rule72Rate.toFixed(2)}%
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">정확한 계산값</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              연 {results.exactRate.toFixed(2)}%
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">오차</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.difference.toFixed(2)}%p
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">필요 수익률</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              연 {results.exactRate.toFixed(2)}%
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 72법칙: 72를 수익률로 나누면 원금이 2배가 되는 기간을 대략 알 수 있습니다.</li>
          <li>· 예: 연 7% 수익률이면 약 72/7 = 10.3년 후 원금 2배</li>
          <li>· 72법칙은 수익률이 5~15% 범위에서 가장 정확합니다.</li>
          <li>· 복리의 효과로 장기 투자 시 자산이 기하급수적으로 증가합니다.</li>
        </ul>
      </div>
    </div>
  );
}
