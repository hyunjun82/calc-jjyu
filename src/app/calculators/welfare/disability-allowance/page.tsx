'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function DisabilityAllowanceCalculator() {
  const [age, setAge] = useState('');
  const [disabilityType, setDisabilityType] = useState('adult');
  const [disabilitySeverity, setDisabilitySeverity] = useState('mild');
  const [householdSize, setHouseholdSize] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [property, setProperty] = useState('');
  const [debt, setDebt] = useState('');
  const [region, setRegion] = useState('seoul');
  const [livingFacility, setLivingFacility] = useState('home');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const handleCalculate = () => {
    const ageVal = parseInt(age) || 0;
    const household = parseInt(householdSize) || 1;
    const income = parseFloat(monthlyIncome) || 0;
    const prop = parseFloat(property) || 0;
    const debtVal = parseFloat(debt) || 0;

    // 장애유형 검증
    const isChild = disabilityType === 'child';
    if (isChild && ageVal >= 18) {
      alert('장애아동은 18세 미만이어야 합니다.');
      return;
    }
    if (!isChild && ageVal < 18) {
      alert('장애인(18세 이상)은 만 18세 이상이어야 합니다.');
      return;
    }

    // 심한 장애는 아동만 해당
    const isSevere = disabilitySeverity === 'severe';
    if (isSevere && !isChild) {
      alert('심한 장애 수당은 장애아동(18세 미만)만 해당됩니다.');
      return;
    }

    // 기본재산공제
    let propertyDeduction = 0;
    if (region === 'seoul') propertyDeduction = 99000000;
    else if (region === 'gyeonggi') propertyDeduction = 80000000;
    else if (region === 'metro') propertyDeduction = 77000000;
    else propertyDeduction = 53000000;

    // 소득평가액 = 실제소득 - 가구특성별 지출비용
    const incomeEval = income;

    // 재산의 소득환산액 = (재산 - 기본재산공제 - 부채) × 월 소득환산율(4%/12)
    const netProperty = Math.max(prop - propertyDeduction - debtVal, 0);
    const propertyIncome = netProperty * 0.04 / 12;

    // 소득인정액
    const recognizedIncome = incomeEval + propertyIncome;

    // 2024년 기준 중위소득 50% (기초생활수급 + 차상위 판정 기준)
    const medianIncome50: Record<number, number> = {
      1: 1114222,
      2: 1841305,
      3: 2357328,
      4: 2864956,
      5: 3347867,
      6: 3809184,
      7: 4258276,
    };
    // 기초생활수급 기준 (중위소득 30%)
    const medianIncome30: Record<number, number> = {
      1: 668533,
      2: 1104783,
      3: 1414397,
      4: 1718974,
      5: 2008720,
      6: 2285510,
      7: 2554966,
    };

    const hhSize = Math.min(household, 7);
    const threshold50 = medianIncome50[hhSize] || medianIncome50[7];
    const threshold30 = medianIncome30[hhSize] || medianIncome30[7];

    // 수급 구분 판정
    let benefitCategory = '';
    if (recognizedIncome <= threshold30) {
      benefitCategory = '기초생활수급자';
    } else if (recognizedIncome <= threshold50) {
      benefitCategory = '차상위';
    } else {
      benefitCategory = '비해당';
    }

    const eligible = benefitCategory !== '비해당';
    const isBasic = benefitCategory === '기초생활수급자';
    const isSecondary = benefitCategory === '차상위';
    const isFacility = livingFacility === 'facility';

    let allowance = 0;

    if (eligible) {
      if (isChild) {
        // 장애아동수당
        if (isFacility) {
          allowance = 90000;
        } else if (isBasic && isSevere) {
          allowance = 220000;
        } else if (isBasic && !isSevere) {
          allowance = 110000;
        } else if (isSecondary && isSevere) {
          allowance = 170000;
        } else if (isSecondary && !isSevere) {
          allowance = 110000;
        }
      } else {
        // 장애수당 (경증장애인)
        if (isBasic && !isFacility) {
          allowance = 60000;
        } else if (isBasic && isFacility) {
          allowance = 30000;
        } else if (isSecondary) {
          allowance = 60000;
        }
      }
    }

    setResults({
      recognizedIncome,
      threshold: threshold50,
      benefitCategory,
      eligible,
      allowance,
      annualAllowance: allowance * 12,
      isChild,
      isSevere,
      isFacility,
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
        <span className="text-fg font-medium">장애(아동)수당 모의계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">장애(아동)수당 모의계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        장애정도가 심하지 않은 장애인 또는 장애아동의 수당 수급 자격과 예상 수급액을 모의계산합니다.
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
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="만 나이를 입력하세요"
            />
          </div>

          {/* 장애유형 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              장애유형
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'adult', label: '장애인(18세 이상)' },
                { val: 'child', label: '장애아동(18세 미만)' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setDisabilityType(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    disabilityType === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 장애정도 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              장애정도
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'mild', label: '심하지 않은 장애' },
                { val: 'severe', label: '심한 장애(아동만)' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setDisabilitySeverity(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    disabilitySeverity === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

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
              placeholder="1"
            />
          </div>

          {/* 월 소득 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              월 소득 (원)
            </label>
            <input
              type="number"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
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

          {/* 생활시설 입소 여부 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              생활시설 입소 여부
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'home', label: '재가' },
                { val: 'facility', label: '시설' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setLivingFacility(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    livingFacility === val
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
            <span className="text-[13px] text-fg-secondary">선정기준 (중위소득 50%)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.threshold)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">수급여부</span>
            <span className={`text-[14px] font-medium tabular-nums ${results.eligible ? 'text-green-600' : 'text-red-500'}`}>
              {results.eligible ? `수급 가능 (${results.benefitCategory})` : '수급 불가'}
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">예상 수당액 (월)</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {results.eligible ? `${formatNumber(results.allowance)}원` : '해당 없음'}
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 장애수당은 장애정도가 심하지 않은 만 18세 이상 등록장애인 중 기초생활수급자 또는 차상위 계층에게 지급됩니다.</li>
          <li>· 장애아동수당은 만 18세 미만 등록장애아동 중 기초생활수급자 또는 차상위 계층에게 지급됩니다.</li>
          <li>· 장애수당(경증): 기초수급(재가) 월 6만원, 기초수급(시설) 월 3만원, 차상위 월 6만원</li>
          <li>· 장애아동수당(중증): 기초수급(재가) 월 22만원, 차상위 월 17만원, 시설 월 9만원</li>
          <li>· 장애아동수당(경증): 기초수급(재가) 월 11만원, 차상위 월 11만원, 시설 월 9만원</li>
          <li>· 소득인정액은 소득평가액과 재산의 소득환산액을 합산하여 산정합니다.</li>
        </ul>
      </div>
    </div>
  );
}
