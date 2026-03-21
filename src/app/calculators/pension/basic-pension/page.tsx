'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function BasicPensionCalculator() {
  const [applicantAge, setApplicantAge] = useState('');
  const [hasSpouse, setHasSpouse] = useState('no');
  const [laborIncome, setLaborIncome] = useState('');
  const [otherIncome, setOtherIncome] = useState('');
  const [property, setProperty] = useState('');
  const [nationalPension, setNationalPension] = useState('');
  const [region, setRegion] = useState('metro');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const handleCalculate = () => {
    const age = parseInt(applicantAge) || 0;
    if (age < 65) {
      alert('기초연금은 만 65세 이상이 대상입니다.');
      return;
    }

    const labor = parseFloat(laborIncome) || 0;
    const other = parseFloat(otherIncome) || 0;
    const prop = parseFloat(property) || 0;
    const npPension = parseFloat(nationalPension) || 0;

    // 소득평가액 = (근로소득 - 110만원) × 0.7 + 기타소득
    const laborEval = Math.max(labor - 1100000, 0) * 0.7;
    const incomeEval = laborEval + other;

    // 기본재산공제
    let propertyDeduction = 0;
    if (region === 'metro') propertyDeduction = 135000000;
    else if (region === 'city') propertyDeduction = 85000000;
    else propertyDeduction = 72500000;

    // 재산의 소득환산액 = (재산 - 기본재산공제) × 4%/12
    const propertyIncome = Math.max(prop - propertyDeduction, 0) * 0.04 / 12;

    // 소득인정액
    const recognizedIncome = incomeEval + propertyIncome;

    // 2024년 선정기준액: 단독 213만원, 부부 340.8만원
    const isCouple = hasSpouse === 'yes';
    const threshold = isCouple ? 3408000 : 2130000;
    const eligible = recognizedIncome <= threshold;

    // 기초연금액 계산
    const maxPensionSingle = 334810;
    const maxPensionCouple = 267840; // 각각, 부부 20% 감액

    let basicPension = 0;
    if (eligible) {
      basicPension = isCouple ? maxPensionCouple : maxPensionSingle;

      // 국민연금 감액: 국민연금이 기초연금의 150% 초과 시
      const pensionThreshold = maxPensionSingle * 1.5;
      if (npPension > pensionThreshold) {
        const reduction = (npPension - pensionThreshold) * 0.5;
        basicPension = Math.max(basicPension - reduction, maxPensionSingle * 0.5);
      }

      // 소득역전방지 감액
      const gap = threshold - recognizedIncome;
      if (gap < basicPension) {
        basicPension = Math.max(gap, maxPensionSingle * 0.1);
      }
    }

    setResults({
      incomeEval,
      propertyIncome,
      recognizedIncome,
      threshold,
      eligible,
      basicPension,
      annualPension: basicPension * 12,
      isCouple,
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
        <span className="text-fg font-medium">기초연금 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">기초연금 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        만 65세 이상 소득하위 70% 어르신을 위한 기초연금 수급 자격과 예상 수령액을 계산합니다. 2024년 기준 최대 월 334,810원입니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 나이 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              나이 (만) *
            </label>
            <input
              type="number"
              value={applicantAge}
              onChange={(e) => setApplicantAge(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="65"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              만 65세 이상 대상
            </p>
          </div>

          {/* 배우자 유무 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              배우자 유무
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'no', label: '단독가구' },
                { val: 'yes', label: '부부가구' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setHasSpouse(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    hasSpouse === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 근로소득 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              월 근로소득 (원)
            </label>
            <input
              type="number"
              value={laborIncome}
              onChange={(e) => setLaborIncome(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              110만원 공제 후 70% 적용
            </p>
          </div>

          {/* 기타소득 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              월 기타소득 (원)
            </label>
            <input
              type="number"
              value={otherIncome}
              onChange={(e) => setOtherIncome(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              이자, 배당, 임대, 사업소득 등
            </p>
          </div>

          {/* 재산 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              재산 (원)
            </label>
            <input
              type="number"
              value={property}
              onChange={(e) => setProperty(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              부동산, 금융자산, 자동차 등 합계
            </p>
          </div>

          {/* 국민연금 수령액 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              월 국민연금 수령액 (원)
            </label>
            <input
              type="number"
              value={nationalPension}
              onChange={(e) => setNationalPension(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              국민연금 수령액이 기초연금의 150% 초과 시 감액
            </p>
          </div>

          {/* 거주지역 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              거주지역
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'metro', label: '대도시' },
                { val: 'city', label: '중소도시' },
                { val: 'rural', label: '농어촌' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setRegion(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    region === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="text-[12px] text-fg-muted mt-1.5">
              기본재산공제: 대도시 1.35억, 중소도시 0.85억, 농어촌 0.725억
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
            <span className="text-[13px] text-fg-secondary">소득평가액</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.incomeEval)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">재산의 소득환산액</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.propertyIncome)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">소득인정액</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.recognizedIncome)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">선정기준액 ({results.isCouple ? '부부' : '단독'})</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.threshold)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">수급 가능 여부</span>
            <span className={`text-[14px] font-medium tabular-nums ${results.eligible ? 'text-green-600' : 'text-red-500'}`}>
              {results.eligible ? '수급 가능' : '수급 불가'}
            </span>
          </div>

          {results.eligible && (
            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-[13px] text-fg-secondary">연간 예상 수령액</span>
              <span className="text-[14px] font-medium text-fg tabular-nums">
                {formatNumber(results.annualPension)}원
              </span>
            </div>
          )}

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">예상 기초연금액 (월)</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {results.eligible ? `${formatNumber(results.basicPension)}원` : '해당 없음'}
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 기초연금은 만 65세 이상 소득하위 70%에 해당하는 어르신에게 지급됩니다.</li>
          <li>· 2024년 기준 단독가구 최대 월 334,810원, 부부가구 각 267,840원입니다.</li>
          <li>· 국민연금 수령액이 기초연금의 150%를 초과하면 기초연금이 감액됩니다.</li>
          <li>· 부부가 모두 수급 시 각각의 기초연금에서 20%가 감액됩니다.</li>
        </ul>
      </div>
    </div>
  );
}
