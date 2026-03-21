'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function SingleParentCalculator() {
  const [householdSize, setHouseholdSize] = useState('');
  const [childCount, setChildCount] = useState('');
  const [childAge, setChildAge] = useState('under5');
  const [parentType, setParentType] = useState('mother');
  const [laborIncome, setLaborIncome] = useState('');
  const [otherIncome, setOtherIncome] = useState('');
  const [property, setProperty] = useState('');
  const [debt, setDebt] = useState('');
  const [region, setRegion] = useState('seoul');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const handleCalculate = () => {
    const size = parseInt(householdSize) || 0;
    const children = parseInt(childCount) || 0;
    const labor = parseFloat(laborIncome) || 0;
    const other = parseFloat(otherIncome) || 0;
    const prop = parseFloat(property) || 0;
    const debtVal = parseFloat(debt) || 0;

    if (size < 2 || size > 4) {
      alert('가구원 수는 2~4인 범위에서 계산 가능합니다.');
      return;
    }
    if (children < 1) {
      alert('자녀 수를 입력해주세요.');
      return;
    }

    // 2024 기준 중위소득 63%
    const medianIncome63: Record<number, number> = {
      2: 2320044,
      3: 2970234,
      4: 3609844,
    };

    // 청소년한부모: 기준 중위소득 72%
    const medianIncome72: Record<number, number> = {
      2: 2651479,
      3: 3394553,
      4: 4125536,
    };

    const isYouthParent = parentType === 'youth';
    const threshold = isYouthParent
      ? (medianIncome72[size] || medianIncome72[4])
      : (medianIncome63[size] || medianIncome63[4]);

    // 기본재산공제
    let propertyDeduction = 0;
    if (region === 'seoul') propertyDeduction = 99000000;
    else if (region === 'gyeonggi') propertyDeduction = 80000000;
    else if (region === 'metro') propertyDeduction = 77000000;
    else propertyDeduction = 53000000;

    // 소득인정액 = (근로소득×0.7 + 기타소득) + (재산-부채-기본재산공제)×0.0417/12
    const incomeEval = labor * 0.7 + other;
    const propertyIncome = Math.max(prop - debtVal - propertyDeduction, 0) * 0.0417 / 12;
    const recognizedIncome = incomeEval + propertyIncome;

    const eligible = recognizedIncome <= threshold;

    // 지원내용 계산
    const benefits: { name: string; amount: number; unit: string }[] = [];

    if (eligible) {
      if (isYouthParent) {
        // 청소년한부모 아동양육비: 월 35만원 × 자녀수
        benefits.push({
          name: '청소년한부모 아동양육비',
          amount: 350000 * children,
          unit: '월',
        });
        // 청소년한부모 자립촉진수당: 월 10만원
        benefits.push({
          name: '청소년한부모 자립촉진수당',
          amount: 100000,
          unit: '월',
        });
      } else {
        // 아동양육비: 자녀 1인당 월 21만원
        benefits.push({
          name: '아동양육비',
          amount: 210000 * children,
          unit: '월',
        });
      }

      // 추가 아동양육비(만5세이하): 자녀 1인당 월 5만원
      if (childAge === 'under5') {
        benefits.push({
          name: '추가 아동양육비 (만 5세 이하)',
          amount: 50000 * children,
          unit: '월',
        });
      }

      // 아동교육지원비(중·고생): 연 9.3만원
      if (childAge === '6to17') {
        benefits.push({
          name: '아동교육지원비 (중·고생)',
          amount: 93000 * children,
          unit: '연',
        });
      }

      // 생계비(생활보조금): 월 5만원
      benefits.push({
        name: '생계비 (생활보조금)',
        amount: 50000,
        unit: '월',
      });
    }

    // 월 총 예상 지원금액
    const monthlyTotal = benefits.reduce((sum, b) => {
      if (b.unit === '월') return sum + b.amount;
      return sum + Math.round(b.amount / 12);
    }, 0);

    setResults({
      recognizedIncome,
      threshold,
      eligible,
      benefits,
      monthlyTotal,
      isYouthParent,
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
        <span className="text-fg font-medium">한부모가족지원 모의계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">한부모가족지원 모의계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        만 18세 미만 자녀를 양육하는 한부모가족의 지원 대상 여부와 예상 지원금액을 모의계산합니다.
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
              placeholder="2"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              본인 포함 가구원 수 (2~4인)
            </p>
          </div>

          {/* 자녀 수 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              자녀 수 *
            </label>
            <input
              type="number"
              value={childCount}
              onChange={(e) => setChildCount(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="1"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              만 18세 미만 자녀 수
            </p>
          </div>

          {/* 자녀 나이 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              자녀 나이
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'under5', label: '만 5세 이하' },
                { val: '6to17', label: '만 6~17세' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setChildAge(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    childAge === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 한부모 유형 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              한부모 유형
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'mother', label: '모자가족' },
                { val: 'father', label: '부자가족' },
                { val: 'grandparent', label: '조손가족' },
                { val: 'youth', label: '청소년한부모' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setParentType(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    parentType === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="text-[12px] text-fg-muted mt-1.5">
              청소년한부모: 부 또는 모가 만 24세 이하
            </p>
          </div>

          {/* 월 근로소득 */}
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
              근로소득의 70% 반영
            </p>
          </div>

          {/* 월 기타소득 */}
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
              {[
                { val: 'seoul', label: '서울' },
                { val: 'gyeonggi', label: '경기' },
                { val: 'metro', label: '광역시' },
                { val: 'other', label: '그 외' },
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
              기본재산공제: 서울 9,900만, 경기 8,000만, 광역시 7,700만, 그 외 5,300만
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
            <span className="text-[13px] text-fg-secondary">소득인정액</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.recognizedIncome)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">
              선정기준액 ({results.isYouthParent ? '청소년한부모 중위소득 72%' : '중위소득 63%'})
            </span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.threshold)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">수급 여부</span>
            <span className={`text-[14px] font-medium tabular-nums ${results.eligible ? 'text-green-600' : 'text-red-500'}`}>
              {results.eligible ? '지원 대상' : '지원 비대상'}
            </span>
          </div>

          {results.eligible && results.benefits.length > 0 && (
            <>
              <h3 className="text-[15px] font-semibold text-fg mt-6 mb-3">예상 지원항목 및 금액</h3>
              {results.benefits.map((benefit: any, index: number) => (
                <div key={index} className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-[13px] text-fg-secondary">{benefit.name}</span>
                  <span className="text-[14px] font-medium text-fg tabular-nums">
                    {benefit.unit === '월' ? '월' : '연'} {formatNumber(benefit.amount)}원
                  </span>
                </div>
              ))}

              <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
                <span className="text-[15px] font-semibold text-fg">월 총 예상 지원금액</span>
                <span className="text-[24px] font-bold text-fg tabular-nums">
                  {formatNumber(results.monthlyTotal)}원
                </span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 한부모가족지원은 만 18세 미만 자녀를 양육하는 한부모가족이 대상입니다.</li>
          <li>· 선정기준은 기준 중위소득 63% 이하이며, 청소년한부모는 72% 이하입니다.</li>
          <li>· 소득인정액 = (근로소득 x 0.7 + 기타소득) + (재산 - 부채 - 기본재산공제) x 0.0417 / 12</li>
          <li>· 청소년한부모(만 24세 이하)는 아동양육비 월 35만원, 자립촉진수당 월 10만원을 지원받습니다.</li>
          <li>· 실제 지원금액은 개별 심사에 따라 달라질 수 있으며, 본 계산기는 참고용입니다.</li>
        </ul>
      </div>
    </div>
  );
}
