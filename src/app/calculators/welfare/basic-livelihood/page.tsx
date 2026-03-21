'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function BasicLivelihoodCalculator() {
  const [householdSize, setHouseholdSize] = useState('');
  const [earnedIncome, setEarnedIncome] = useState('');
  const [businessIncome, setBusinessIncome] = useState('');
  const [propertyIncome, setPropertyIncome] = useState('');
  const [transferIncome, setTransferIncome] = useState('');
  const [assets, setAssets] = useState('');
  const [debt, setDebt] = useState('');
  const [region, setRegion] = useState('서울');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  // 2024 기준 중위소득
  const medianIncome: Record<number, number> = {
    1: 2228445,
    2: 3682609,
    3: 4714657,
    4: 5729913,
    5: 6695735,
    6: 7618369,
  };

  // 기본재산공제액
  const basicAssetDeduction: Record<string, number> = {
    '서울': 99000000,
    '경기': 80000000,
    '광역시': 77000000,
    '그 외': 53000000,
  };

  const getMedianIncome = (size: number): number => {
    if (size <= 0) return 0;
    if (size <= 6) return medianIncome[size];
    // 7인 이상: 6인 기준 + 1인당 추가금액 (6인 - 5인 차이 적용)
    const perPersonAdd = medianIncome[6] - medianIncome[5];
    return medianIncome[6] + perPersonAdd * (size - 6);
  };

  const handleCalculate = () => {
    const size = parseInt(householdSize) || 0;
    if (size < 1 || size > 10) {
      alert('가구원 수를 1~10 사이로 입력해주세요.');
      return;
    }

    const earned = parseFloat(earnedIncome) || 0;
    const business = parseFloat(businessIncome) || 0;
    const property = parseFloat(propertyIncome) || 0;
    const transfer = parseFloat(transferIncome) || 0;
    const totalAssets = parseFloat(assets) || 0;
    const totalDebt = parseFloat(debt) || 0;

    // 소득평가액 = 실제소득 - 근로소득 30% 공제
    const totalIncome = earned + business + property + transfer;
    const earnedDeduction = earned * 0.3;
    const incomeAssessment = totalIncome - earnedDeduction;

    // 재산의 소득환산액
    const deduction = basicAssetDeduction[region];
    const netAssets = totalAssets - totalDebt - deduction;
    const assetConversion = netAssets > 0 ? netAssets * (0.0417 / 12) : 0;

    // 소득인정액
    const recognizedIncome = Math.max(incomeAssessment, 0) + assetConversion;

    // 중위소득 기준
    const median = getMedianIncome(size);
    const livelihoodThreshold = median * 0.32;
    const medicalThreshold = median * 0.40;
    const housingThreshold = median * 0.48;
    const educationThreshold = median * 0.50;

    setResults({
      incomeAssessment: Math.max(incomeAssessment, 0),
      assetConversion,
      recognizedIncome,
      median,
      livelihoodThreshold,
      medicalThreshold,
      housingThreshold,
      educationThreshold,
      livelihoodEligible: recognizedIncome <= livelihoodThreshold,
      medicalEligible: recognizedIncome <= medicalThreshold,
      housingEligible: recognizedIncome <= housingThreshold,
      educationEligible: recognizedIncome <= educationThreshold,
    });
  };

  return (
    <div className="mx-auto max-w-[1200px] px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-fg-muted mb-8">
        <Link href="/" className="hover:text-fg transition-colors">홈</Link>
        <ChevronRight size={12} />
        <span className="text-fg-secondary">복지</span>
        <ChevronRight size={12} />
        <span className="text-fg font-medium">국민기초생활보장 모의계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">국민기초생활보장 모의계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        가구의 소득인정액을 기준으로 생계급여, 의료급여, 주거급여, 교육급여 수급 자격 여부를 모의계산합니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 가구원 수 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              가구원 수 *
            </label>
            <input
              type="number"
              value={householdSize}
              onChange={(e) => setHouseholdSize(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="4"
              min={1}
              max={10}
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              본인 포함 가구원 수 (1~10명)
            </p>
          </div>

          {/* 월 근로소득 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              월 근로소득 (원)
            </label>
            <input
              type="number"
              value={earnedIncome}
              onChange={(e) => setEarnedIncome(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
          </div>

          {/* 월 사업소득 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              월 사업소득 (원)
            </label>
            <input
              type="number"
              value={businessIncome}
              onChange={(e) => setBusinessIncome(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
          </div>

          {/* 월 재산소득 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              월 재산소득 (원)
            </label>
            <input
              type="number"
              value={propertyIncome}
              onChange={(e) => setPropertyIncome(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
          </div>

          {/* 월 이전소득 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              월 이전소득 (원)
            </label>
            <input
              type="number"
              value={transferIncome}
              onChange={(e) => setTransferIncome(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              사적이전소득, 부양비 등
            </p>
          </div>

          {/* 재산 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              재산 (원)
            </label>
            <input
              type="number"
              value={assets}
              onChange={(e) => setAssets(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              부동산, 금융자산, 자동차 등 합계
            </p>
          </div>

          {/* 부채 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              부채 (원)
            </label>
            <input
              type="number"
              value={debt}
              onChange={(e) => setDebt(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
          </div>

          {/* 거주지역 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              거주지역
            </label>
            <div className="flex flex-wrap gap-2">
              {['서울', '경기', '광역시', '그 외'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRegion(r)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    region === r
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {r}
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
            <span className="text-[13px] text-fg-secondary">소득평가액</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.incomeAssessment)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">재산의 소득환산액</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.assetConversion)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2 mb-6">
            <span className="text-[15px] font-semibold text-fg">소득인정액</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {formatNumber(results.recognizedIncome)}원
            </span>
          </div>

          <h3 className="text-[15px] font-semibold text-fg mb-4">급여별 수급 자격 판정</h3>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">생계급여 선정기준 (중위소득 32%)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.livelihoodThreshold)}원
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">생계급여 수급 가능 여부</span>
            <span className={`text-[14px] font-medium tabular-nums ${results.livelihoodEligible ? 'text-green-600' : 'text-red-500'}`}>
              {results.livelihoodEligible ? '가능' : '불가'}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">의료급여 선정기준 (중위소득 40%)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.medicalThreshold)}원
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">의료급여 수급 가능 여부</span>
            <span className={`text-[14px] font-medium tabular-nums ${results.medicalEligible ? 'text-green-600' : 'text-red-500'}`}>
              {results.medicalEligible ? '가능' : '불가'}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">주거급여 선정기준 (중위소득 48%)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.housingThreshold)}원
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">주거급여 수급 가능 여부</span>
            <span className={`text-[14px] font-medium tabular-nums ${results.housingEligible ? 'text-green-600' : 'text-red-500'}`}>
              {results.housingEligible ? '가능' : '불가'}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">교육급여 선정기준 (중위소득 50%)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.educationThreshold)}원
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">교육급여 수급 가능 여부</span>
            <span className={`text-[14px] font-medium tabular-nums ${results.educationEligible ? 'text-green-600' : 'text-red-500'}`}>
              {results.educationEligible ? '가능' : '불가'}
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 소득인정액 = 소득평가액 + 재산의 소득환산액으로 산정됩니다.</li>
          <li>· 근로소득의 30%는 가구특성별 공제로 차감됩니다. 실제로는 장애인, 노인 등 추가 공제가 적용될 수 있습니다.</li>
          <li>· 기본재산공제는 지역별로 다릅니다 (서울 9,900만원, 경기 8,000만원, 광역시 7,700만원, 그 외 5,300만원).</li>
          <li>· 생계급여 수급자는 선정기준액에서 소득인정액을 뺀 금액을 매월 지급받습니다.</li>
          <li>· 본 계산기는 간이 모의계산이며, 실제 수급 여부는 주민센터를 통해 정확히 확인하시기 바랍니다.</li>
        </ul>
      </div>
    </div>
  );
}
