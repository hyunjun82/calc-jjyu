'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function EducationWelfareCalculator() {
  const [householdSize, setHouseholdSize] = useState('');
  const [studentCount, setStudentCount] = useState('');
  const [schoolLevel, setSchoolLevel] = useState('elementary');
  const [laborIncome, setLaborIncome] = useState('');
  const [otherIncome, setOtherIncome] = useState('');
  const [property, setProperty] = useState('');
  const [debt, setDebt] = useState('');
  const [region, setRegion] = useState('seoul');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  // 2024 기준 중위소득 (가구원 수별)
  const medianIncome: Record<number, number> = {
    1: 2228445,
    2: 3682609,
    3: 4714657,
    4: 5729913,
    5: 6695735,
    6: 7618369,
    7: 8514994,
    8: 9411619,
    9: 10308244,
    10: 11204869,
  };

  // 기본재산공제
  const propertyDeduction: Record<string, number> = {
    seoul: 99000000,
    gyeonggi: 80000000,
    metro: 77000000,
    other: 53000000,
  };

  const handleCalculate = () => {
    const size = parseInt(householdSize) || 0;
    const students = parseInt(studentCount) || 0;

    if (size < 1 || size > 10) {
      alert('가구원 수는 1~10 사이로 입력해주세요.');
      return;
    }
    if (students < 1) {
      alert('학생 수를 입력해주세요.');
      return;
    }

    const labor = parseFloat(laborIncome) || 0;
    const other = parseFloat(otherIncome) || 0;
    const prop = parseFloat(property) || 0;
    const debtVal = parseFloat(debt) || 0;

    // 소득인정액 = (근로소득 × 0.7 + 기타소득) + (재산 - 부채 - 기본재산공제) × 0.0417/12
    const incomeEval = labor * 0.7 + other;
    const deduction = propertyDeduction[region];
    const propertyIncome = Math.max(prop - debtVal - deduction, 0) * 0.0417 / 12;
    const recognizedIncome = incomeEval + propertyIncome;

    // 선정기준: 중위소득 50%
    const median = medianIncome[size] || medianIncome[4];
    const threshold = median * 0.5;

    const eligible = recognizedIncome <= threshold;

    // 지원내용 결정
    const supportItems: string[] = [];
    if (eligible) {
      if (schoolLevel === 'elementary') {
        supportItems.push('교육활동지원비 지원');
        supportItems.push('교육정보화지원(인터넷통신비): 월 23,000원');
      } else if (schoolLevel === 'middle') {
        supportItems.push('교육활동지원비 지원');
        supportItems.push('교육정보화지원(인터넷통신비): 월 23,000원');
      } else {
        supportItems.push('입학금/수업료: 학교장 고지 금액 전액');
        supportItems.push('교과서대: 약 160,000원');
        supportItems.push('교육정보화지원(인터넷통신비): 월 23,000원');
      }
    }

    setResults({
      incomeEval,
      propertyIncome,
      recognizedIncome,
      threshold,
      median,
      eligible,
      supportItems,
      students,
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
        <span className="text-fg font-medium">초·중·고 교육비지원 모의계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">초·중·고 교육비지원 모의계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        초·중·고등학교에 재학 중인 자녀의 교육비 지원 대상 여부와 예상 지원금액을 모의계산합니다.
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

          {/* 학생 수 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              학생 수 *
            </label>
            <input
              type="number"
              value={studentCount}
              onChange={(e) => setStudentCount(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="1"
              min={1}
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              교육비 지원 대상 자녀 수
            </p>
          </div>

          {/* 학교급 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              학교급
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'elementary', label: '초등학교' },
                { val: 'middle', label: '중학교' },
                { val: 'high', label: '고등학교' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setSchoolLevel(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    schoolLevel === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
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
              근로소득의 70% 적용
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
            <p className="text-[12px] text-fg-muted mt-1.5">
              재산에서 차감할 부채 총액
            </p>
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
            <span className="text-[13px] text-fg-secondary">선정기준액 (중위소득 50%)</span>
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
            <>
              <div className="mt-4 mb-2">
                <span className="text-[14px] font-semibold text-fg">예상 지원항목</span>
              </div>
              {results.supportItems.map((item: string, idx: number) => (
                <div key={idx} className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-[13px] text-fg-secondary">{item}</span>
                </div>
              ))}
            </>
          )}

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">교육비 지원 판정</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {results.eligible ? '지원 대상' : '지원 비대상'}
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 교육비지원은 중위소득 50% 이하(교육급여 기준)인 가구가 대상입니다.</li>
          <li>· 고등학교의 경우 입학금, 수업료, 교과서대, 인터넷통신비 등이 지원됩니다.</li>
          <li>· 초·중학교는 의무교육이므로 교육활동지원비와 인터넷통신비가 지원됩니다.</li>
          <li>· 소득인정액은 근로소득의 70%와 기타소득, 재산의 소득환산액을 합산하여 산정합니다.</li>
          <li>· 본 계산기는 참고용이며, 실제 수급 여부는 관할 주민센터에서 확인하시기 바랍니다.</li>
        </ul>
      </div>
    </div>
  );
}
