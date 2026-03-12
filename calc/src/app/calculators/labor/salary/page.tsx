'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4 text-sm text-slate-600">
          <Link href="/" className="hover:text-blue-600">
            홈
          </Link>
          <span className="mx-2">/</span>
          <Link href="/calculators" className="hover:text-blue-600">
            근로 계산기
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900 font-medium">연봉 실수령액 계산기</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-3xl font-bold text-slate-900">연봉 실수령액 계산기</h1>
            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
              근로
            </span>
          </div>
          <p className="text-slate-600">
            연봉에서 4대 보험료와 소득세를 차감한 실제 수령액을 계산해보세요. (2024 기준)
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">계산 설정</h2>

              <div className="space-y-4">
                {/* 연봉 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    연봉 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={annualSalary}
                      onChange={(e) => setAnnualSalary(Number(e.target.value))}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-slate-600">원</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {annualSalary.toLocaleString('ko-KR')} 원
                  </p>
                </div>

                {/* 부양가족 수 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    부양가족 수 (본인 포함) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={dependents}
                    onChange={(e) => setDependents(Number(e.target.value))}
                    min="1"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    인적공제: {(dependents * 1500000).toLocaleString('ko-KR')} 원
                  </p>
                </div>

                {/* 20세 이하 자녀 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    20세 이하 자녀 수
                  </label>
                  <input
                    type="number"
                    value={youngChildren}
                    onChange={(e) => setYoungChildren(Number(e.target.value))}
                    min="0"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">추가 공제 대상</p>
                </div>

                {/* 비과세액 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    월 비과세액
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={nonTaxableAmount}
                      onChange={(e) => setNonTaxableAmount(Number(e.target.value))}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-slate-600">원</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    기본값: 200,000원 (식대)
                  </p>
                </div>

                <button
                  onClick={handleCalculate}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
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
                    <div className="bg-white rounded-lg shadow-md p-4">
                      <p className="text-sm text-slate-600 mb-1">월급</p>
                      <p className="text-2xl font-bold text-slate-900">
                        {result.monthlySalary.toLocaleString('ko-KR', {
                          maximumFractionDigits: 0,
                        })}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">원</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-4">
                      <p className="text-sm text-slate-600 mb-1">4대보험료 합계</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {result.totalInsurance.toLocaleString('ko-KR', {
                          maximumFractionDigits: 0,
                        })}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">월</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-4">
                      <p className="text-sm text-slate-600 mb-1">소득세</p>
                      <p className="text-2xl font-bold text-red-600">
                        {result.incomeTax.toLocaleString('ko-KR', {
                          maximumFractionDigits: 0,
                        })}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">월</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-4">
                      <p className="text-sm text-slate-600 mb-1">지방소득세</p>
                      <p className="text-2xl font-bold text-red-600">
                        {result.localTax.toLocaleString('ko-KR', {
                          maximumFractionDigits: 0,
                        })}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">월</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200 p-4">
                    <p className="text-sm text-slate-600 mb-1">월 실수령액</p>
                    <p className="text-3xl font-bold text-green-600">
                      {result.monthlyTakeHome.toLocaleString('ko-KR', {
                        maximumFractionDigits: 0,
                      })}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">원</p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-4">
                    <p className="text-sm text-slate-600 mb-1">연간 실수령액</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {result.annualTakeHome.toLocaleString('ko-KR', {
                        maximumFractionDigits: 0,
                      })}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">원</p>
                  </div>
                </div>

                {/* Deduction Details */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">공제 내역</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b border-slate-300 bg-slate-50">
                        <tr>
                          <th className="text-left px-3 py-2 font-semibold text-slate-700">
                            항목
                          </th>
                          <th className="text-right px-3 py-2 font-semibold text-slate-700">
                            월
                          </th>
                          <th className="text-right px-3 py-2 font-semibold text-slate-700">
                            연간
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.deductionDetails.map((item, idx) => (
                          <tr
                            key={idx}
                            className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
                          >
                            <td className="px-3 py-2 text-slate-900 font-medium">
                              {item.name}
                            </td>
                            <td className="text-right px-3 py-2 text-slate-900">
                              {item.monthly.toLocaleString('ko-KR', {
                                maximumFractionDigits: 0,
                              })}
                            </td>
                            <td className="text-right px-3 py-2 text-slate-900">
                              {item.annual.toLocaleString('ko-KR', {
                                maximumFractionDigits: 0,
                              })}
                            </td>
                          </tr>
                        ))}
                        <tr className="border-t border-slate-300 bg-slate-50 font-semibold">
                          <td className="px-3 py-2 text-slate-900">합계</td>
                          <td className="text-right px-3 py-2 text-slate-900">
                            {result.monthlyDeduction.toLocaleString('ko-KR', {
                              maximumFractionDigits: 0,
                            })}
                          </td>
                          <td className="text-right px-3 py-2 text-slate-900">
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
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-900 mb-2">💡 팁</h3>
                  <ul className="text-sm text-slate-700 space-y-1">
                    <li>• 4대 보험료: 국민연금(4.5%), 건강보험(3.545%), 장기요양보험, 고용보험(0.9%)</li>
                    <li>• 식사비(200,000원)는 비과세이므로 세금 계산에서 제외됨</li>
                    <li>• 소득세는 누진세로 소득이 많을수록 세율이 높아짐</li>
                    <li>• 부양가족이 많을수록 인적공제가 증가하여 세금이 감소</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
