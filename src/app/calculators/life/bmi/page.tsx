'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function BMICalculator() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num * 10) / 10 + '';
  };

  const getBMICategory = (bmi: number): string => {
    if (bmi < 18.5) return '저체중';
    if (bmi < 23) return '정상';
    if (bmi < 25) return '과체중(비만전단계)';
    if (bmi < 30) return '1단계 비만';
    if (bmi < 35) return '2단계 비만';
    return '3단계 비만(고도비만)';
  };

  const getObesityRate = (bmi: number): number => {
    // 비만도 = (현재 BMI / 표준 BMI 22) × 100
    return (bmi / 22) * 100;
  };

  const handleCalculate = () => {
    const h = parseFloat(height) || 0;
    const w = parseFloat(weight) || 0;

    if (h <= 0 || w <= 0) {
      alert('키와 체중을 입력해주세요.');
      return;
    }

    const heightM = h / 100;
    const bmi = w / (heightM * heightM);
    const category = getBMICategory(bmi);
    const obesityRate = getObesityRate(bmi);
    const normalWeightMin = 18.5 * heightM * heightM;
    const normalWeightMax = 22.9 * heightM * heightM;

    setResults({
      bmi,
      category,
      obesityRate,
      normalWeightMin,
      normalWeightMax,
    });
  };

  return (
    <div className="mx-auto max-w-[1200px] px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-fg-muted mb-8">
        <Link href="/" className="hover:text-fg transition-colors">홈</Link>
        <ChevronRight size={12} />
        <span className="text-fg-secondary">생활</span>
        <ChevronRight size={12} />
        <span className="text-fg font-medium">BMI 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">BMI 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        체질량지수(BMI)를 계산하여 비만도를 확인합니다. WHO 아시아-태평양 기준으로 판정합니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 키 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              키 (cm) *
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="170"
            />
          </div>

          {/* 체중 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              체중 (kg) *
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="70"
            />
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
            <span className="text-[13px] text-fg-secondary">BMI 수치</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.bmi)}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">판정</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.category}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">비만도</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.obesityRate)}%
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">정상체중 범위</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {formatNumber(results.normalWeightMin)}kg ~ {formatNumber(results.normalWeightMax)}kg
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· BMI = 체중(kg) / (키(m))² 로 계산합니다.</li>
          <li>· WHO 아시아-태평양 기준으로 BMI 23 이상부터 과체중으로 분류됩니다.</li>
          <li>· BMI는 근육량을 반영하지 못하므로 운동을 많이 하는 분은 체지방률과 함께 판단하세요.</li>
          <li>· 비만도 100%가 표준이며, 120% 이상이면 비만으로 판정됩니다.</li>
        </ul>
      </div>
    </div>
  );
}
