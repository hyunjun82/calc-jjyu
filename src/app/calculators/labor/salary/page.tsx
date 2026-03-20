'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface SalaryResult {
  annualSalary: number;
  monthlySalary: number;
  nationalPension: number;
  healthInsurance: number;
  longTermInsurance: number;
  employmentInsurance: number;
  totalInsurance: number;
  grossIncome: number;
  incomeTax: number;
  localTax: number;
  totalTax: number;
  monthlyDeduction: number;
  monthlyTakeHome: number;
  annualTakeHome: number;
  deductionDetails: {
    name: string;
    monthly: number;
    annual: number;
  }[];
}

export default function SalaryCalculator() {
  const [annualSalary, setAnnualSalary] = useState(50000000);
  const [dependents, setDependents] = useState(1);
  const [youngChildren, setYoungChildren] = useState(0);
  const [nonTaxableAmount, setNonTaxableAmount] = useState(200000);

  const result = useMemo<SalaryResult | null>(() => {
    if (!annualSalary) return null;

    const monthlySalary = annualSalary / 12;

    // 4대 보험료 계산
    const pensionRate = 0.045;
    const pensionMax = 5900000;
    const nationalPension = Math.min(monthlySalary * pensionRate, pensionMax * pensionRate);

    const healthInsuranceRate = 0.03545;
    const healthInsurance = monthlySalary * healthInsuranceRate;

    const longTermInsuranceRate = 0.1281;
    const longTermInsurance = healthInsurance * longTermInsuranceRate;

    const employmentInsuranceRate = 0.009;
    const employmentInsurance = monthlySalary * employmentInsuranceRate;

    const totalInsurance =
      nationalPension + healthInsurance + longTermInsurance + employmentInsurance;

    // 근로소득공제 계산
    let deduction: number;
    if (annualSalary <= 5000000) {
      deduction = annualSalary * 0.7;
    } else if (annualSalary <= 15000000) {
      deduction = 3500000 + (annualSalary - 5000000) * 0.4;
    } else if (annualSalary <= 45000000) {
      deduction = 7500000 + (annualSalary - 15000000) * 0.15;
    } else if (annualSalary <= 100000000) {
      deduction = 12000000 + (annualSalary - 45000000) * 0.05;
    } else {
      deduction = 14750000 + (annualSalary - 100000000) * 0.02;
    }

    // 인적공제
    const personalDeduction = 1500000 * dependents;

    // 과세표준
    const monthlyNonTaxable = nonTaxableAmount;
    const taxableMonthlyIncome = monthlySalary - monthlyNonTaxable - totalInsurance;
    const annualTaxableIncome = taxableMonthlyIncome * 12;
    const taxableBase = annualTaxableIncome - deduction - personalDeduction;

    // 누진세 적용
    let incomeTax: number;
    if (taxableBase <= 14000000) {
      incomeTax = taxableBase * 0.06;
    } else if (taxableBase <= 50000000) {
      incomeTax = 840000 + (taxableBase - 14000000) * 0.15;
    } else if (taxableBase <= 88000000) {
      incomeTax = 6240000 + (taxableBase - 50000000) * 0.24;
    } else if (taxableBase <= 150000000) {
      incomeTax = 15360000 + (taxableBase - 88000000) * 0.35;
    } else if (taxableBase <= 300000000) {
      incomeTax = 37100000 + (taxableBase - 150000000) * 0.38;
    } else if (taxableBase <= 500000000) {
      incomeTax = 94200000 + (taxableBase - 300000000) * 0.4;
    } else {
      incomeTax = 174200000 + (taxableBase - 500000000) * 0.42;
    }

    // 월 소득세 (연간/12)
    const monthlyIncomeTax = incomeTax / 12;
    const localTax = monthlyIncomeTax * 0.1;
    const totalTax = monthlyIncomeTax + localTax;

    const monthlyDeduction = totalInsurance + totalTax;
    const monthlyTakeHome = monthlySalary - monthlyDeduction;
    const annualTakeHome = monthlyTakeHome * 12;

    const deductionDetails = [
      {
        name: '국민연금',
        monthly: nationalPension,
        annual: nationalPension * 12,
      },
      {
        name: '건강보험',
        monthly: healthInsurance,
        annual: healthInsurance * 12,
      },
      {
        name: '장기요양보험',
        monthly: longTermInsurance,
        annual: longTermInsurance * 12,
      },
      {
        name: '고용보험',
        monthly: employmentInsurance,
        annual: employmentInsurance * 12,
      },
      {
        name: '소득세',
        monthly: monthlyIncomeTax,
        annual: incomeTax,
      },
      {
        name: '지방소득세',
        monthly: localTax,
        annual: localTax * 12,
      },
    ];

    return {
      annualSalary,
      monthlySalary,
      nationalPension,
      healthInsurance,
      longTermInsurance,
      employmentInsurance,
      totalInsurance,
      grossIncome: monthlySalary,
      incomeTax: monthlyIncomeTax,
      localTax,
      totalTax,
      monthlyDeduction,
      monthlyTakeHome,
      annualTakeHome,
      deductionDetails,
    };
  }, [annualSalary, dependents, youngChildren, nonTaxableAmount]);

  const handleCalculate = () => {
    // 계산은 useMemo에 의해 자동으로 수행됨
  };

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-fg-muted mb-8">
        <Link href="/" className="hover:text-fg transition-colors">홈</Link>
        <ChevronRight size={12} />
        <span className="text-fg-secondary">근로 계산기</span>
        <ChevronRight size={12} />
        <span className="text-fg font-medium">연봉 실수령액 계산기</span>
      </nav>

      {/* Title */}
      <div className="mb-8">
        <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-3">연봉 실수령액 계산기</h1>
        <p className="text-[15px] text-fg-secondary">
          연봉에서 4대 보험료와 소득세를 차감한 실제 수령액을 계산해보세요. (2024 기준)
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="border border-border rounded-2xl bg-surface p-6 sticky top-20">
            <h2 className="text-[16px] font-semibold text-fg mb-5">계산 설정</h2>

            <div className="space-y-4">
              {/* 연봉 */}
              <div>
                <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                  연봉 <span className="text-negative">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={annualSalary}
                    onChange={(e) => setAnnualSalary(Number(e.target.value))}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                  />
                  <span className="text-[13px] text-fg-muted">원</span>
                </div>
                <p className="text-[12px] text-fg-muted mt-1.5">
                  {annualSalary.toLocaleString('ko-KR')} 원
                </p>
              </div>

              {/* 부양가족 수 */}
              <div>
                <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                  부양가족 수 (본인 포함) <span className="text-negative">*</span>
                </label>
                <input
                  type="number"
                  value={dependents}
                  onChange={(e) => setDependents(Number(e.target.value))}
                  min="1"
                  className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                />
                <p className="text-[12px] text-fg-muted mt-1.5">
                  인적공제: {(dependents * 1500000).toLocaleString('ko-KR')} 원
                </p>
              </div>

              {/* 20세 이하 자녀 */}
              <div>
                <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                  20세 이하 자녀 수
                </label>
                <input
                  type="number"
                  value={youngChildren}
                  onChange={(e) => setYoungChildren(Number(e.target.value))}
                  min="0"
                  className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                />
                <p className="text-[12px] text-fg-muted mt-1.5">추가 공제 대상</p>
              </div>

              {/* 비과세액 */}
              <div>
                <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                  월 비과세액
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={nonTaxableAmount}
                    onChange={(e) => setNonTaxableAmount(Number(e.target.value))}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                  />
                  <span className="text-[13px] text-fg-muted">원</span>
                </div>
                <p className="text-[12px] text-fg-muted mt-1.5">
                  기본값: 200,000원 (식대)
                </p>
              </div>

              <button
                onClick={handleCalculate}
                className="w-full h-11 bg-accent hover:bg-accent-hover text-accent-fg font-medium rounded-xl transition-colors"
              >
                계산하기
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          {result && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="border border-border rounded-xl bg-surface p-4">
                    <p className="text-[13px] text-fg-secondary mb-1">월급</p>
                    <p className="text-[22px] font-bold text-fg tabular-nums">
                      {result.monthlySalary.toLocaleString('ko-KR', {
                        maximumFractionDigits: 0,
                      })}
                    </p>
                    <p className="text-[12px] text-fg-muted mt-1">원</p>
                  </div>

                  <div className="border border-border rounded-xl bg-surface p-4">
                    <p className="text-[13px] text-fg-secondary mb-1">4대보험료 합계</p>
                    <p className="text-[22px] font-bold text-fg tabular-nums">
                      {result.totalInsurance.toLocaleString('ko-KR', {
                        maximumFractionDigits: 0,
                      })}
                    </p>
                    <p className="text-[12px] text-fg-muted mt-1">월</p>
                  </div>

                  <div className="border border-border rounded-xl bg-surface p-4">
                    <p className="text-[13px] text-fg-secondary mb-1">소득세</p>
                    <p className="text-[22px] font-bold text-fg tabular-nums">
                      {result.incomeTax.toLocaleString('ko-KR', {
                        maximumFractionDigits: 0,
                      })}
                    </p>
                    <p className="text-[12px] text-fg-muted mt-1">월</p>
                  </div>

                  <div className="border border-border rounded-xl bg-surface p-4">
                    <p className="text-[13px] text-fg-secondary mb-1">지방소득세</p>
                    <p className="text-[22px] font-bold text-fg tabular-nums">
                      {result.localTax.toLocaleString('ko-KR', {
                        maximumFractionDigits: 0,
                      })}
                    </p>
                    <p className="text-[12px] text-fg-muted mt-1">월</p>
                  </div>
                </div>

                <div className="border border-border rounded-xl bg-bg-secondary p-5">
                  <p className="text-[13px] text-fg-secondary mb-1">월 실수령액</p>
                  <p className="text-[32px] font-bold text-fg tabular-nums">
                    {result.monthlyTakeHome.toLocaleString('ko-KR', {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p className="text-[12px] text-fg-muted mt-1">원</p>
                </div>

                <div className="border border-border rounded-xl bg-bg-secondary p-5">
                  <p className="text-[13px] text-fg-secondary mb-1">연간 실수령액</p>
                  <p className="text-[32px] font-bold text-fg tabular-nums">
                    {result.annualTakeHome.toLocaleString('ko-KR', {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p className="text-[12px] text-fg-muted mt-1">원</p>
                </div>
              </div>

              {/* Deduction Details */}
              <div className="border border-border rounded-xl bg-surface overflow-hidden">
                <div className="p-4">
                  <h3 className="text-[16px] font-semibold text-fg">공제 내역</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-bg-secondary border-b border-border">
                      <tr>
                        <th className="text-left text-[13px] font-medium text-fg-secondary px-4 py-3">
                          항목
                        </th>
                        <th className="text-right text-[13px] font-medium text-fg-secondary px-4 py-3">
                          월
                        </th>
                        <th className="text-right text-[13px] font-medium text-fg-secondary px-4 py-3">
                          연간
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.deductionDetails.map((item, idx) => (
                        <tr
                          key={idx}
                          className={
                            idx % 2 === 0
                              ? 'bg-surface'
                              : 'bg-bg-secondary'
                          }
                        >
                          <td className="text-[13px] text-fg tabular-nums px-4 py-2.5 font-medium">
                            {item.name}
                          </td>
                          <td className="text-right text-[13px] text-fg tabular-nums px-4 py-2.5">
                            {item.monthly.toLocaleString('ko-KR', {
                              maximumFractionDigits: 0,
                            })}
                          </td>
                          <td className="text-right text-[13px] text-fg tabular-nums px-4 py-2.5">
                            {item.annual.toLocaleString('ko-KR', {
                              maximumFractionDigits: 0,
                            })}
                          </td>
                        </tr>
                      ))}
                      <tr className="border-t border-border bg-bg-secondary font-semibold">
                        <td className="text-[13px] text-fg px-4 py-2.5">합계</td>
                        <td className="text-right text-[13px] text-fg tabular-nums px-4 py-2.5">
                          {result.monthlyDeduction.toLocaleString('ko-KR', {
                            maximumFractionDigits: 0,
                          })}
                        </td>
                        <td className="text-right text-[13px] text-fg tabular-nums px-4 py-2.5">
                          {(result.monthlyDeduction * 12).toLocaleString('ko-KR', {
                            maximumFractionDigits: 0,
                          })}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tips */}
              <div className="border border-border rounded-xl bg-bg-secondary p-5">
                <h3 className="text-[14px] font-semibold text-fg mb-3">팁</h3>
                <ul className="text-[13px] text-fg-secondary leading-relaxed space-y-1">
                  <li>· 4대 보험료: 국민연금(4.5%), 건강보험(3.545%), 장기요양보험, 고용보험(0.9%)</li>
                  <li>· 식사비(200,000원)는 비과세이므로 세금 계산에서 제외됨</li>
                  <li>· 소득세는 누진세로 소득이 많을수록 세율이 높아짐</li>
                  <li>· 부양가족이 많을수록 인적공제가 증가하여 세금이 감소</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
