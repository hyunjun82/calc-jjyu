'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function MaintenanceFeeCalculator() {
  const [area, setArea] = useState('');
  const [priceLevel, setPriceLevel] = useState('mid');
  const [electricBill, setElectricBill] = useState('');
  const [waterBill, setWaterBill] = useState('');
  const [gasBill, setGasBill] = useState('');
  const [heatingBill, setHeatingBill] = useState('');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const handleCalculate = () => {
    const sqm = parseFloat(area) || 0;

    if (sqm <= 0) {
      alert('전용면적을 입력해주세요.');
      return;
    }

    const electric = parseFloat(electricBill) || 0;
    const water = parseFloat(waterBill) || 0;
    const gas = parseFloat(gasBill) || 0;
    const heating = parseFloat(heatingBill) || 0;

    // 단가 설정 (원/㎡)
    let generalRate: number, repairRate: number, cleanRate: number, securityRate: number, elevatorRate: number, etcRate: number;

    if (priceLevel === 'low') {
      generalRate = 1500;
      repairRate = 200;
      cleanRate = 300;
      securityRate = 500;
      elevatorRate = 200;
      etcRate = 100;
    } else if (priceLevel === 'mid') {
      generalRate = 2200;
      repairRate = 350;
      cleanRate = 450;
      securityRate = 750;
      elevatorRate = 300;
      etcRate = 200;
    } else {
      generalRate = 3000;
      repairRate = 500;
      cleanRate = 600;
      securityRate = 1000;
      elevatorRate = 400;
      etcRate = 300;
    }

    const generalFee = sqm * generalRate;
    const repairFee = sqm * repairRate;
    const cleanFee = sqm * cleanRate;
    const securityFee = sqm * securityRate;
    const elevatorFee = sqm * elevatorRate;
    const etcFee = sqm * etcRate;
    const commonTotal = generalFee + repairFee + cleanFee + securityFee + elevatorFee + etcFee;

    const individualTotal = electric + water + gas + heating;
    const totalFee = commonTotal + individualTotal;

    setResults({
      generalFee,
      repairFee,
      cleanFee,
      securityFee,
      elevatorFee,
      etcFee,
      commonTotal,
      electric,
      water,
      gas,
      heating,
      individualTotal,
      totalFee,
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
        <span className="text-fg font-medium">관리비 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">관리비 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        아파트 전용면적과 단가 수준에 따른 공용관리비와 개별사용료를 포함한 총 관리비를 계산합니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 전용면적 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              전용면적 (m²) *
            </label>
            <input
              type="number"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="84"
            />
          </div>

          {/* 관리비 단가 유형 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              관리비 단가 유형
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'low', label: '저가 (소규모 단지)' },
                { val: 'mid', label: '중간 (일반 단지)' },
                { val: 'high', label: '고가 (대규모/고급 단지)' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setPriceLevel(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    priceLevel === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 전기요금 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              전기요금 (원)
            </label>
            <input
              type="number"
              value={electricBill}
              onChange={(e) => setElectricBill(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
          </div>

          {/* 수도요금 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              수도요금 (원)
            </label>
            <input
              type="number"
              value={waterBill}
              onChange={(e) => setWaterBill(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
          </div>

          {/* 가스요금 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              가스요금 (원)
            </label>
            <input
              type="number"
              value={gasBill}
              onChange={(e) => setGasBill(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
          </div>

          {/* 난방비 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              난방비 (원)
            </label>
            <input
              type="number"
              value={heatingBill}
              onChange={(e) => setHeatingBill(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
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
            <span className="text-[13px] text-fg-secondary">일반관리비</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.generalFee)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">수선유지비</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.repairFee)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">청소비</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.cleanFee)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">경비비</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.securityFee)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">승강기유지비</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.elevatorFee)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">기타 (소독, 위탁관리 등)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.etcFee)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] font-medium text-fg-secondary">공용관리비 소계</span>
            <span className="text-[14px] font-semibold text-fg tabular-nums">
              {formatNumber(results.commonTotal)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">개별사용료 (전기+수도+가스+난방)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.individualTotal)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">총 관리비</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {formatNumber(results.totalFee)}원
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 공용관리비는 단지 규모, 세대수, 관리 방식에 따라 크게 달라집니다.</li>
          <li>· 일반적으로 대규모 단지일수록 세대당 관리비가 낮아집니다.</li>
          <li>· 개별사용료는 계절별로 변동이 크며, 특히 난방비는 겨울에 크게 증가합니다.</li>
          <li>· 실제 관리비는 관리사무소 고지서를 통해 확인하시기 바랍니다.</li>
        </ul>
      </div>
    </div>
  );
}
