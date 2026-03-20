'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

type Unit = 'pyeong' | 'm2' | 'ft2';

export default function AreaConverterPage() {
  const [inputValue, setInputValue] = useState<string>('10');
  const [inputUnit, setInputUnit] = useState<Unit>('pyeong');

  const conversionFactors = {
    pyeong: 1,
    m2: 3.3058,
    ft2: 35.5832,
  };

  const convertValue = (value: number, fromUnit: Unit, toUnit: Unit): number => {
    const inPyeong = value / conversionFactors[fromUnit];
    return inPyeong * conversionFactors[toUnit];
  };

  const inputNum = parseFloat(inputValue) || 0;
  const pyeong = inputUnit === 'pyeong' ? inputNum : convertValue(inputNum, inputUnit, 'pyeong');
  const m2 = inputUnit === 'm2' ? inputNum : convertValue(inputNum, inputUnit, 'm2');
  const ft2 = inputUnit === 'ft2' ? inputNum : convertValue(inputNum, inputUnit, 'ft2');

  const presets = [10, 20, 25, 30, 33, 40, 50];

  const handlePreset = (value: number) => {
    setInputValue(value.toString());
    setInputUnit('pyeong');
  };

  const handleCalculate = () => {
    // Calculation happens automatically via state
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const formatNumber = (num: number, decimals: number = 2): string => {
    return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
            <span className="text-fg font-medium">평수 환산</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-[1200px] px-6 py-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl font-bold text-fg">평수 환산 계산기</h1>
            <span className="inline-block bg-bg-tertiary text-fg-secondary text-xs font-semibold px-3 py-1 rounded-full">
              부동산
            </span>
          </div>
          <p className="text-fg-secondary text-lg">
            평(坪), 제곱미터(m²), 제곱피트(ft²) 사이의 면적을 쉽게 환산합니다.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-[1200px] px-6 py-8">
        {/* Calculator Card */}
        <div className="bg-surface rounded-xl shadow-[var(--shadow-md)] overflow-hidden mb-8">
          <div className="bg-bg-secondary px-8 py-6 border-b border-border">
            <h2 className="text-[12px] font-medium text-fg-muted uppercase tracking-wider">단위 변환</h2>
          </div>

          <div className="p-8">
            {/* Quick Presets */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-fg-secondary mb-4">
                자주 사용하는 평수
              </label>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                {presets.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => handlePreset(preset)}
                    className={`py-2 px-3 rounded-lg font-semibold transition-all duration-200 ${
                      inputValue === preset.toString() && inputUnit === 'pyeong'
                        ? 'bg-accent text-accent-fg'
                        : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                    }`}
                  >
                    {preset}평
                  </button>
                ))}
              </div>
            </div>

            {/* Input Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-fg-secondary mb-2">
                  입력값
                </label>
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                  placeholder="값을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-fg-secondary mb-2">
                  단위
                </label>
                <select
                  value={inputUnit}
                  onChange={(e) => setInputUnit(e.target.value as Unit)}
                  className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                >
                  <option value="pyeong">평 (坪)</option>
                  <option value="m2">제곱미터 (m²)</option>
                  <option value="ft2">제곱피트 (ft²)</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleCalculate}
                  className="w-full bg-accent hover:bg-accent-hover text-accent-fg font-bold py-3 px-6 rounded-lg transition-all duration-200"
                >
                  계산하기
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Pyeong Result */}
          <div className="bg-bg-secondary rounded-xl p-6 border border-border">
            <div className="text-[12px] font-medium text-fg-muted uppercase tracking-wider mb-2">평(坪)</div>
            <div className="text-[36px] font-bold text-fg tabular-nums mb-1">
              {formatNumber(pyeong, 2)}
            </div>
            <div className="text-[13px] text-fg-muted">pyeong</div>
          </div>

          {/* Square Meters Result */}
          <div className="bg-bg-secondary rounded-xl p-6 border border-border">
            <div className="text-[12px] font-medium text-fg-muted uppercase tracking-wider mb-2">제곱미터(m²)</div>
            <div className="text-[36px] font-bold text-fg tabular-nums mb-1">
              {formatNumber(m2, 2)}
            </div>
            <div className="text-[13px] text-fg-muted">square meter</div>
          </div>

          {/* Square Feet Result */}
          <div className="bg-bg-secondary rounded-xl p-6 border border-border">
            <div className="text-[12px] font-medium text-fg-muted uppercase tracking-wider mb-2">제곱피트(ft²)</div>
            <div className="text-[36px] font-bold text-fg tabular-nums mb-1">
              {formatNumber(ft2, 2)}
            </div>
            <div className="text-[13px] text-fg-muted">square foot</div>
          </div>
        </div>

        {/* Conversion Table */}
        <div className="bg-surface rounded-xl shadow-[var(--shadow-md)] overflow-hidden mb-8">
          <div className="bg-bg-secondary px-8 py-6 border-b border-border">
            <h2 className="text-[12px] font-medium text-fg-muted uppercase tracking-wider">변환 공식</h2>
          </div>

          <div className="p-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-[13px] text-fg-secondary">1 평 (坪)</span>
                <span className="text-[13px] font-semibold text-fg">= 3.3058 m² = 35.5832 ft²</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-[13px] text-fg-secondary">1 m² (제곱미터)</span>
                <span className="text-[13px] font-semibold text-fg">= 0.3025 평 = 10.764 ft²</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-[13px] text-fg-secondary">1 ft² (제곱피트)</span>
                <span className="text-[13px] font-semibold text-fg">= 0.0281 평 = 0.0929 m²</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Reference Table */}
        <div className="bg-surface rounded-xl shadow-[var(--shadow-md)] overflow-hidden mb-8">
          <div className="bg-bg-secondary px-8 py-6 border-b border-border">
            <h2 className="text-[12px] font-medium text-fg-muted uppercase tracking-wider">빠른 참조표</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-bg-secondary border-b border-border">
                  <th className="px-8 py-4 text-left text-[13px] font-medium text-fg-secondary">평(坪)</th>
                  <th className="px-8 py-4 text-left text-[13px] font-medium text-fg-secondary">m²</th>
                  <th className="px-8 py-4 text-left text-[13px] font-medium text-fg-secondary">ft²</th>
                </tr>
              </thead>
              <tbody>
                {[10, 20, 25, 30, 33, 40, 50].map((p) => (
                  <tr key={p} className="border-b border-border hover:bg-surface-hover">
                    <td className="px-8 py-4 text-[13px] text-fg font-medium">{p}평</td>
                    <td className="px-8 py-4 text-[13px] text-fg font-medium">
                      {formatNumber(p * 3.3058, 2)}
                    </td>
                    <td className="px-8 py-4 text-[13px] text-fg font-medium">
                      {formatNumber(p * 35.5832, 2)}
                    </td>
                  </tr>
                ))}
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
                한국에서는 주로 <strong>평</strong>을 사용하며, 1평은 약 3.3058m²입니다.
              </span>
            </li>
            <li className="flex gap-3">
              <span>·</span>
              <span>
                부동산 거래나 임대차 계약에서는 정확한 면적 표기가 중요하므로 확인 후 사용하세요.
              </span>
            </li>
            <li className="flex gap-3">
              <span>·</span>
              <span>
                국제 거래나 해외 부동산에서는 주로 m² 또는 ft²을 사용합니다.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
