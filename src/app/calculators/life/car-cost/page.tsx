'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function CarCostCalculator() {
  const [annualDistance, setAnnualDistance] = useState('');
  const [fuelEfficiency, setFuelEfficiency] = useState('');
  const [fuelPrice, setFuelPrice] = useState('1700');
  const [carTax, setCarTax] = useState('');
  const [insurance, setInsurance] = useState('');
  const [maintenance, setMaintenance] = useState('500000');
  const [monthlyParking, setMonthlyParking] = useState('');
  const [monthlyToll, setMonthlyToll] = useState('');
  const [monthlyCarWash, setMonthlyCarWash] = useState('');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const handleCalculate = () => {
    const distance = parseFloat(annualDistance) || 0;
    const efficiency = parseFloat(fuelEfficiency) || 0;
    const price = parseFloat(fuelPrice) || 1700;

    if (distance <= 0 || efficiency <= 0) {
      alert('연간 주행거리와 연비를 입력해주세요.');
      return;
    }

    // 유류비
    const fuelCost = (distance / efficiency) * price;

    // 자동차세
    const tax = parseFloat(carTax) || 0;

    // 보험료
    const insuranceCost = parseFloat(insurance) || 0;

    // 정비비
    const maintenanceCost = parseFloat(maintenance) || 500000;

    // 주차비 (월 × 12)
    const parkingCost = (parseFloat(monthlyParking) || 0) * 12;

    // 통행료 (월 × 12)
    const tollCost = (parseFloat(monthlyToll) || 0) * 12;

    // 세차비 (월 × 12)
    const carWashCost = (parseFloat(monthlyCarWash) || 0) * 12;

    const totalAnnual = fuelCost + tax + insuranceCost + maintenanceCost + parkingCost + tollCost + carWashCost;
    const monthlyAverage = totalAnnual / 12;
    const costPerKm = totalAnnual / distance;

    setResults({
      fuelCost,
      tax,
      insuranceCost,
      maintenanceCost,
      parkingCost,
      tollCost,
      carWashCost,
      totalAnnual,
      monthlyAverage,
      costPerKm,
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
        <span className="text-fg font-medium">자동차 유지비 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">자동차 유지비 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        연간 자동차 유지비를 항목별로 계산합니다. 유류비, 세금, 보험, 정비 등 모든 비용을 한눈에 확인하세요.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 연간 주행거리 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              연간 주행거리 (km) *
            </label>
            <input
              type="number"
              value={annualDistance}
              onChange={(e) => setAnnualDistance(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="15000"
            />
          </div>

          {/* 연비 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              연비 (km/L) *
            </label>
            <input
              type="number"
              value={fuelEfficiency}
              onChange={(e) => setFuelEfficiency(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="12"
            />
          </div>

          {/* 유가 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              유가 (원/L)
            </label>
            <input
              type="number"
              value={fuelPrice}
              onChange={(e) => setFuelPrice(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="1700"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              기본값: 1,700원/L
            </p>
          </div>

          {/* 자동차세 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              연간 자동차세 (원)
            </label>
            <input
              type="number"
              value={carTax}
              onChange={(e) => setCarTax(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="300000"
            />
          </div>

          {/* 보험료 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              연간 보험료 (원)
            </label>
            <input
              type="number"
              value={insurance}
              onChange={(e) => setInsurance(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="800000"
            />
          </div>

          {/* 정비비 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              연간 정비/소모품비 (원)
            </label>
            <input
              type="number"
              value={maintenance}
              onChange={(e) => setMaintenance(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="500000"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              기본값: 500,000원
            </p>
          </div>

          {/* 월 주차비 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              월 주차비 (원)
            </label>
            <input
              type="number"
              value={monthlyParking}
              onChange={(e) => setMonthlyParking(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="100000"
            />
          </div>

          {/* 월 통행료 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              월 통행료/하이패스 (원)
            </label>
            <input
              type="number"
              value={monthlyToll}
              onChange={(e) => setMonthlyToll(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="50000"
            />
          </div>

          {/* 월 세차비 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              월 세차비 (원)
            </label>
            <input
              type="number"
              value={monthlyCarWash}
              onChange={(e) => setMonthlyCarWash(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="20000"
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
            <span className="text-[13px] text-fg-secondary">유류비</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.fuelCost)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">자동차세</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.tax)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">보험료</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.insuranceCost)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">정비/소모품비</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.maintenanceCost)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">주차비 (연간)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.parkingCost)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">통행료/하이패스 (연간)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.tollCost)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">세차비 (연간)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.carWashCost)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">월 평균 유지비</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.monthlyAverage)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">km당 비용</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {Math.round(results.costPerKm * 10) / 10}원
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">총 연간 유지비</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {formatNumber(results.totalAnnual)}원
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 연간 평균 주행거리는 약 15,000km 정도입니다.</li>
          <li>· 유류비가 전체 유지비에서 가장 큰 비중을 차지하는 경우가 많습니다.</li>
          <li>· 자동차세는 배기량에 따라 달라지며, 연납 시 할인 혜택이 있습니다.</li>
          <li>· 감가상각비는 포함되지 않았으므로 실제 소유 비용은 더 높을 수 있습니다.</li>
        </ul>
      </div>
    </div>
  );
}
