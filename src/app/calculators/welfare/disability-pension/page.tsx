'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function DisabilityPensionCalculator() {
  const [age, setAge] = useState('');
  const [householdSize, setHouseholdSize] = useState('');
  const [hasSpouse, setHasSpouse] = useState('no');
  const [spouseReceiving, setSpouseReceiving] = useState('no');
  const [laborIncome, setLaborIncome] = useState('');
  const [otherIncome, setOtherIncome] = useState('');
  const [property, setProperty] = useState('');
  const [debt, setDebt] = useState('');
  const [region, setRegion] = useState('seoul');
  const [welfareStatus, setWelfareStatus] = useState('none');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const handleCalculate = () => {
    const ageNum = parseInt(age) || 0;
    if (ageNum < 18) {
      alert('장애인연금은 만 18세 이상 중증장애인이 대상입니다.');
      return;
    }

    const labor = parseFloat(laborIncome) || 0;
    const other = parseFloat(otherIncome) || 0;
    const prop = parseFloat(property) || 0;
    const debtAmt = parseFloat(debt) || 0;

    // 소득평가액 = (근로소득 - 108만원) × 0.5 + 기타소득
    const laborEval = Math.max(labor - 1080000, 0) * 0.5;
    const incomeEval = laborEval + other;

    // 기본재산공제
    let propertyDeduction = 0;
    if (region === 'seoul') propertyDeduction = 99000000;
    else if (region === 'gyeonggi') propertyDeduction = 80000000;
    else if (region === 'metro') propertyDeduction = 77000000;
    else propertyDeduction = 53000000;

    // 재산의 소득환산액 = (재산 - 부채 - 기본재산공제) × 0.04/12
    const propertyIncome = Math.max(prop - debtAmt - propertyDeduction, 0) * 0.04 / 12;

    // 소득인정액
    const recognizedIncome = incomeEval + propertyIncome;

    // 선정기준액 (2024 기준): 단독 130만원, 부부 208만원
    const isCouple = hasSpouse === 'yes';
    const threshold = isCouple ? 2080000 : 1300000;
    const eligible = recognizedIncome <= threshold;

    // 급여액 계산
    const isOver65 = ageNum >= 65;
    const maxBasicBenefit = 334810;

    // 기초급여 계산
    let basicBenefit = 0;
    if (eligible && !isOver65) {
      basicBenefit = maxBasicBenefit;
      // 부부 동시 수급 시 각 20% 감액
      if (isCouple && spouseReceiving === 'yes') {
        basicBenefit = Math.round(maxBasicBenefit * 0.8);
      }
    }
    // 65세 이상은 기초연금 수급, 기초급여 없음

    // 부가급여 계산
    let supplementBenefit = 0;
    if (eligible) {
      if (welfareStatus === 'livelihood') {
        // 생계/의료급여
        supplementBenefit = 90000;
      } else if (welfareStatus === 'housing') {
        // 주거/교육급여
        supplementBenefit = 70000;
      } else if (welfareStatus === 'nearPoverty') {
        // 차상위
        if (isOver65) {
          supplementBenefit = 40000;
        } else {
          supplementBenefit = 70000;
        }
      } else {
        // 차상위 초과 (비수급)
        supplementBenefit = 20000;
      }
    }

    const totalBenefit = basicBenefit + supplementBenefit;

    setResults({
      incomeEval,
      propertyIncome,
      recognizedIncome,
      threshold,
      eligible,
      isCouple,
      isOver65,
      basicBenefit,
      supplementBenefit,
      totalBenefit,
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
        <span className="text-fg font-medium">장애인연금 모의계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">장애인연금 모의계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        만 18세 이상 중증장애인의 장애인연금 수급 자격과 예상 수령액을 모의계산합니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 나이 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              나이 (만 나이) *
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="30"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              만 18세 이상 중증장애인 대상
            </p>
          </div>

          {/* 가구원 수 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              가구원 수
            </label>
            <input
              type="number"
              value={householdSize}
              onChange={(e) => setHouseholdSize(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="1"
            />
          </div>

          {/* 배우자 유무 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              배우자 유무
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'no', label: '없음' },
                { val: 'yes', label: '있음' },
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

          {/* 배우자 장애인연금 수급 여부 - 배우자 있을 때만 */}
          {hasSpouse === 'yes' && (
            <div className="mb-6">
              <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                배우자 장애인연금 수급 여부
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { val: 'no', label: '미수급' },
                  { val: 'yes', label: '수급 중' },
                ].map(({ val, label }) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setSpouseReceiving(val)}
                    className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                      spouseReceiving === val
                        ? 'bg-accent text-accent-fg'
                        : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

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
              108만원 공제 후 50% 적용
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

          {/* 기초생활수급자 여부 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              기초생활수급자 여부
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'none', label: '비수급' },
                { val: 'livelihood', label: '생계/의료급여' },
                { val: 'housing', label: '주거/교육급여' },
                { val: 'nearPoverty', label: '차상위' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setWelfareStatus(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    welfareStatus === val
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
            <span className="text-[13px] text-fg-secondary">선정기준액 ({results.isCouple ? '부부' : '단독'})</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.threshold)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">수급 여부</span>
            <span className={`text-[14px] font-medium tabular-nums ${results.eligible ? 'text-green-600' : 'text-red-500'}`}>
              {results.eligible ? '수급 가능' : '수급 불가'}
            </span>
          </div>

          {results.eligible && (
            <>
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-[13px] text-fg-secondary">기초급여 (월)</span>
                <span className="text-[14px] font-medium text-fg tabular-nums">
                  {results.isOver65 ? '해당없음 (기초연금 수급)' : `${formatNumber(results.basicBenefit)}원`}
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-[13px] text-fg-secondary">부가급여 (월)</span>
                <span className="text-[14px] font-medium text-fg tabular-nums">
                  {formatNumber(results.supplementBenefit)}원
                </span>
              </div>

              <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
                <span className="text-[15px] font-semibold text-fg">합계 (월)</span>
                <span className="text-[24px] font-bold text-fg tabular-nums">
                  {formatNumber(results.totalBenefit)}원
                </span>
              </div>
            </>
          )}

          {!results.eligible && (
            <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
              <span className="text-[15px] font-semibold text-fg">예상 수령액 (월)</span>
              <span className="text-[24px] font-bold text-fg tabular-nums">
                해당 없음
              </span>
            </div>
          )}
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 장애인연금은 만 18세 이상 중증장애인(종전 1급, 2급, 3급 중복)에게 지급됩니다.</li>
          <li>· 2024년 기준 선정기준액은 단독 130만원, 부부 208만원입니다.</li>
          <li>· 만 65세 이상은 기초급여 대신 기초연금을 수급하며, 부가급여만 지급됩니다.</li>
          <li>· 부부가 동시에 장애인연금을 수급할 경우 기초급여가 각각 20% 감액됩니다.</li>
          <li>· 기초생활수급 여부에 따라 부가급여 금액이 달라집니다.</li>
        </ul>
      </div>
    </div>
  );
}
