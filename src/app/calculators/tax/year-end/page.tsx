'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function YearEndTaxCalculator() {
  // 기본정보
  const [totalSalary, setTotalSalary] = useState('');
  const [dependents, setDependents] = useState('1');
  const [children, setChildren] = useState('0');
  const [prepaidTax, setPrepaidTax] = useState('');

  // 소득공제
  const [nationalPension, setNationalPension] = useState('');
  const [healthInsurance, setHealthInsurance] = useState('');

  // 세액공제
  const [medicalExpense, setMedicalExpense] = useState('');
  const [educationExpense, setEducationExpense] = useState('');
  const [donation, setDonation] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');

  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  // 근로소득공제
  const calcEarnedIncomeDeduction = (salary: number): number => {
    if (salary <= 5_000_000) return salary * 0.7;
    if (salary <= 15_000_000) return 3_500_000 + (salary - 5_000_000) * 0.4;
    if (salary <= 45_000_000) return 7_500_000 + (salary - 15_000_000) * 0.15;
    if (salary <= 100_000_000) return 12_000_000 + (salary - 45_000_000) * 0.05;
    return 14_750_000 + (salary - 100_000_000) * 0.02;
  };

  // 소득세율 적용
  const calcIncomeTax = (taxBase: number): number => {
    if (taxBase <= 0) return 0;
    if (taxBase <= 14_000_000) return taxBase * 0.06;
    if (taxBase <= 50_000_000) return 840_000 + (taxBase - 14_000_000) * 0.15;
    if (taxBase <= 88_000_000) return 6_240_000 + (taxBase - 50_000_000) * 0.24;
    if (taxBase <= 150_000_000) return 15_360_000 + (taxBase - 88_000_000) * 0.35;
    if (taxBase <= 300_000_000) return 37_060_000 + (taxBase - 150_000_000) * 0.38;
    if (taxBase <= 500_000_000) return 94_060_000 + (taxBase - 300_000_000) * 0.40;
    if (taxBase <= 1_000_000_000) return 174_060_000 + (taxBase - 500_000_000) * 0.42;
    return 384_060_000 + (taxBase - 1_000_000_000) * 0.45;
  };

  // 근로소득세액공제
  const calcEarnedIncomeTaxCredit = (tax: number, salary: number): number => {
    let credit: number;
    if (tax <= 1_300_000) {
      credit = tax * 0.55;
    } else {
      credit = 715_000 + (tax - 1_300_000) * 0.30;
    }

    // 한도 적용
    let limit: number;
    if (salary <= 33_000_000) limit = 740_000;
    else if (salary <= 70_000_000) limit = 660_000;
    else limit = 500_000;

    return Math.min(credit, limit);
  };

  // 자녀세액공제
  const calcChildTaxCredit = (childCount: number): number => {
    if (childCount <= 0) return 0;
    if (childCount === 1) return 150_000;
    if (childCount === 2) return 350_000;
    return 350_000 + (childCount - 2) * 300_000;
  };

  // 의료비 세액공제
  const calcMedicalCredit = (medical: number, salary: number): number => {
    const threshold = salary * 0.03;
    const deductible = medical - threshold;
    if (deductible <= 0) return 0;
    const credit = deductible * 0.15;
    return Math.min(credit, 7_000_000);
  };

  // 기부금 세액공제
  const calcDonationCredit = (donationAmt: number): number => {
    if (donationAmt <= 0) return 0;
    if (donationAmt <= 10_000_000) return donationAmt * 0.15;
    return 1_500_000 + (donationAmt - 10_000_000) * 0.30;
  };

  // 월세 세액공제
  const calcRentCredit = (rent: number, salary: number): number => {
    if (salary > 70_000_000 || rent <= 0) return 0;
    const cappedRent = Math.min(rent, 7_500_000);
    if (salary <= 55_000_000) return cappedRent * 0.17;
    return cappedRent * 0.15;
  };

  const handleCalculate = () => {
    const salary = parseFloat(totalSalary) || 0;

    if (salary <= 0) {
      alert('총급여를 입력해주세요.');
      return;
    }

    const dependentCount = parseInt(dependents) || 1;
    const childCount = parseInt(children) || 0;

    // 기납부세액: 입력값 또는 추정
    const prepaid = parseFloat(prepaidTax) || 0;

    // 소득공제 항목 (기본값 적용)
    const pension = nationalPension !== '' ? parseFloat(nationalPension) || 0 : salary * 0.045;
    const health = healthInsurance !== '' ? parseFloat(healthInsurance) || 0 : salary * 0.03545;

    // 세액공제 항목
    const medical = parseFloat(medicalExpense) || 0;
    const education = parseFloat(educationExpense) || 0;
    const donationAmt = parseFloat(donation) || 0;
    const rent = parseFloat(monthlyRent) || 0;

    // 1. 근로소득공제
    const earnedIncomeDeduction = calcEarnedIncomeDeduction(salary);

    // 2. 근로소득금액
    const earnedIncome = salary - earnedIncomeDeduction;

    // 3. 종합소득공제
    const personalDeduction = dependentCount * 1_500_000;
    const totalIncomeDeduction = personalDeduction + pension + health;

    // 4. 과세표준
    const taxBase = Math.max(earnedIncome - totalIncomeDeduction, 0);

    // 5. 산출세액
    const calculatedTax = calcIncomeTax(taxBase);

    // 6. 세액공제
    const earnedIncomeTaxCredit = calcEarnedIncomeTaxCredit(calculatedTax, salary);
    const childTaxCredit = calcChildTaxCredit(childCount);
    const medicalCredit = calcMedicalCredit(medical, salary);
    const educationCredit = education * 0.15;
    const donationCredit = calcDonationCredit(donationAmt);
    const rentCredit = calcRentCredit(rent, salary);

    const totalTaxCredit =
      earnedIncomeTaxCredit +
      childTaxCredit +
      medicalCredit +
      educationCredit +
      donationCredit +
      rentCredit;

    // 7. 결정세액
    const determinedTax = Math.max(calculatedTax - totalTaxCredit, 0);

    // 8. 환급/추납액
    const refundOrPayment = prepaid - determinedTax;

    setResults({
      salary,
      earnedIncomeDeduction,
      earnedIncome,
      personalDeduction,
      pension,
      health,
      totalIncomeDeduction,
      taxBase,
      calculatedTax,
      earnedIncomeTaxCredit,
      childTaxCredit,
      medicalCredit,
      educationCredit,
      donationCredit,
      rentCredit,
      totalTaxCredit,
      determinedTax,
      prepaid,
      refundOrPayment,
    });
  };

  return (
    <div className="mx-auto max-w-[1200px] px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-fg-muted mb-8">
        <Link href="/" className="hover:text-fg transition-colors">홈</Link>
        <ChevronRight size={12} />
        <span className="text-fg-secondary">세금</span>
        <ChevronRight size={12} />
        <span className="text-fg font-medium">연말정산 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">연말정산 환급금 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        연말정산 시 예상 환급금 또는 추가납부액을 계산합니다. 각종 소득공제와 세액공제를 반영합니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 기본정보 섹션 */}
          <h2 className="text-[15px] font-semibold text-fg mb-4">기본정보</h2>

          {/* 총급여 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              총급여 (연봉, 원) *
            </label>
            <input
              type="number"
              value={totalSalary}
              onChange={(e) => setTotalSalary(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              비과세 소득을 제외한 연간 총급여액
            </p>
          </div>

          {/* 부양가족 수 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              부양가족 수 (본인 포함)
            </label>
            <input
              type="number"
              value={dependents}
              onChange={(e) => setDependents(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="1"
              min="1"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              본인 포함, 1인당 150만원 기본공제
            </p>
          </div>

          {/* 20세 이하 자녀 수 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              20세 이하 자녀 수
            </label>
            <input
              type="number"
              value={children}
              onChange={(e) => setChildren(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
              min="0"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              자녀세액공제 대상 (1명 15만원, 2명 35만원)
            </p>
          </div>

          {/* 기납부 소득세 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              기납부 소득세 (원천징수 합계, 원) *
            </label>
            <input
              type="number"
              value={prepaidTax}
              onChange={(e) => setPrepaidTax(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              매월 급여에서 원천징수된 소득세 연간 합계
            </p>
          </div>

          {/* 소득공제 섹션 */}
          <h2 className="text-[15px] font-semibold text-fg mb-4 mt-8 pt-6 border-t border-border">소득공제 (선택 입력)</h2>

          {/* 국민연금 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              국민연금 납부액 (원)
            </label>
            <input
              type="number"
              value={nationalPension}
              onChange={(e) => setNationalPension(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="미입력 시 연봉의 4.5% 자동 적용"
            />
          </div>

          {/* 건강보험료 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              건강보험료 납부액 (원)
            </label>
            <input
              type="number"
              value={healthInsurance}
              onChange={(e) => setHealthInsurance(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="미입력 시 연봉의 3.545% 자동 적용"
            />
          </div>

          {/* 세액공제 섹션 */}
          <h2 className="text-[15px] font-semibold text-fg mb-4 mt-8 pt-6 border-t border-border">세액공제 (선택 입력)</h2>

          {/* 의료비 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              의료비 지출액 (원)
            </label>
            <input
              type="number"
              value={medicalExpense}
              onChange={(e) => setMedicalExpense(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              총급여의 3% 초과분에 대해 15% 공제 (한도 700만원)
            </p>
          </div>

          {/* 교육비 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              교육비 지출액 (원)
            </label>
            <input
              type="number"
              value={educationExpense}
              onChange={(e) => setEducationExpense(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              교육비의 15% 세액공제
            </p>
          </div>

          {/* 기부금 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              기부금 지출액 (원)
            </label>
            <input
              type="number"
              value={donation}
              onChange={(e) => setDonation(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              1,000만원 이하 15%, 초과분 30% 공제
            </p>
          </div>

          {/* 월세 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              월세 지출액 (연간 합계, 원)
            </label>
            <input
              type="number"
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              총급여 7,000만원 이하 시 적용 (한도 750만원/연)
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
            <span className="text-[13px] text-fg-secondary">총급여</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.salary)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">근로소득공제</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              -{formatNumber(results.earnedIncomeDeduction)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">근로소득금액</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.earnedIncome)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">종합소득공제 합계</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              -{formatNumber(results.totalIncomeDeduction)}원
            </span>
          </div>

          <div className="pl-4 flex justify-between items-center py-2 border-b border-border">
            <span className="text-[12px] text-fg-muted">인적공제 ({Math.round(results.personalDeduction / 1_500_000)}명)</span>
            <span className="text-[13px] text-fg-muted tabular-nums">
              {formatNumber(results.personalDeduction)}원
            </span>
          </div>

          <div className="pl-4 flex justify-between items-center py-2 border-b border-border">
            <span className="text-[12px] text-fg-muted">국민연금</span>
            <span className="text-[13px] text-fg-muted tabular-nums">
              {formatNumber(results.pension)}원
            </span>
          </div>

          <div className="pl-4 flex justify-between items-center py-2 border-b border-border">
            <span className="text-[12px] text-fg-muted">건강보험료</span>
            <span className="text-[13px] text-fg-muted tabular-nums">
              {formatNumber(results.health)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">과세표준</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.taxBase)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">산출세액</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.calculatedTax)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">세액공제 합계</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              -{formatNumber(results.totalTaxCredit)}원
            </span>
          </div>

          <div className="pl-4 flex justify-between items-center py-2 border-b border-border">
            <span className="text-[12px] text-fg-muted">근로소득세액공제</span>
            <span className="text-[13px] text-fg-muted tabular-nums">
              {formatNumber(results.earnedIncomeTaxCredit)}원
            </span>
          </div>

          {results.childTaxCredit > 0 && (
            <div className="pl-4 flex justify-between items-center py-2 border-b border-border">
              <span className="text-[12px] text-fg-muted">자녀세액공제</span>
              <span className="text-[13px] text-fg-muted tabular-nums">
                {formatNumber(results.childTaxCredit)}원
              </span>
            </div>
          )}

          {results.medicalCredit > 0 && (
            <div className="pl-4 flex justify-between items-center py-2 border-b border-border">
              <span className="text-[12px] text-fg-muted">의료비 세액공제</span>
              <span className="text-[13px] text-fg-muted tabular-nums">
                {formatNumber(results.medicalCredit)}원
              </span>
            </div>
          )}

          {results.educationCredit > 0 && (
            <div className="pl-4 flex justify-between items-center py-2 border-b border-border">
              <span className="text-[12px] text-fg-muted">교육비 세액공제</span>
              <span className="text-[13px] text-fg-muted tabular-nums">
                {formatNumber(results.educationCredit)}원
              </span>
            </div>
          )}

          {results.donationCredit > 0 && (
            <div className="pl-4 flex justify-between items-center py-2 border-b border-border">
              <span className="text-[12px] text-fg-muted">기부금 세액공제</span>
              <span className="text-[13px] text-fg-muted tabular-nums">
                {formatNumber(results.donationCredit)}원
              </span>
            </div>
          )}

          {results.rentCredit > 0 && (
            <div className="pl-4 flex justify-between items-center py-2 border-b border-border">
              <span className="text-[12px] text-fg-muted">월세 세액공제</span>
              <span className="text-[13px] text-fg-muted tabular-nums">
                {formatNumber(results.rentCredit)}원
              </span>
            </div>
          )}

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">결정세액</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.determinedTax)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">기납부세액</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.prepaid)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">
              {results.refundOrPayment >= 0 ? '예상 환급액' : '추가납부액'}
            </span>
            <span className={`text-[24px] font-bold tabular-nums ${results.refundOrPayment >= 0 ? 'text-blue-600' : 'text-red-500'}`}>
              {results.refundOrPayment >= 0 ? '+' : ''}{formatNumber(results.refundOrPayment)}원
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 총급여는 비과세 소득(식대, 차량유지비 등)을 제외한 금액입니다.</li>
          <li>· 국민연금/건강보험료 미입력 시 기본 요율로 자동 계산됩니다.</li>
          <li>· 의료비는 총급여의 3%를 초과한 금액만 공제 대상입니다.</li>
          <li>· 월세 세액공제는 총급여 7,000만원 이하인 무주택 세대주에게 적용됩니다.</li>
          <li>· 실제 연말정산 결과와 다를 수 있으며, 참고용으로만 활용하세요.</li>
        </ul>
      </div>
    </div>
  );
}
