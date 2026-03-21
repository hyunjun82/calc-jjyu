'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { FormStep, FormProgress } from '@/components/FormStep';

interface InflationYear {
  year: number;
  amount: number;
  purchasingPower: number;
  decline: number;
}

interface InflationResult {
  currentAmount: number;
  inflationRate: number;
  years: number;
  futureAmount: number;
  purchasingPower: number;
  declineAmount: number;
  declineRate: number;
  yearlyData: InflationYear[];
}

export default function InflationCalculator() {
  const [currentAmount, setCurrentAmount] = useState(100000000);
  const [inflationRate, setInflationRate] = useState(3);
  const [years, setYears] = useState(10);

  const result = useMemo<InflationResult | null>(() => {
    if (!currentAmount || inflationRate === null || !years) return null;

    const inflationFactor = 1 + inflationRate / 100;
    const futureAmount = currentAmount * Math.pow(inflationFactor, years);
    const purchasingPower = currentAmount / Math.pow(inflationFactor, years);
    const declineAmount = futureAmount - currentAmount;
    const declineRate = (1 - purchasingPower / currentAmount) * 100;

    // 연도별 데이터
    const yearlyData: InflationYear[] = [];
    for (let year = 0; year <= years; year++) {
      const amount = currentAmount * Math.pow(inflationFactor, year);
      const power = currentAmount / Math.pow(inflationFactor, year);
      yearlyData.push({
        year,
        amount,
        purchasingPower: power,
        decline: ((1 - power / currentAmount) * 100),
      });
    }

    return {
      currentAmount,
      inflationRate,
      years,
      futureAmount,
      purchasingPower,
      declineAmount,
      declineRate,
      yearlyData,
    };
  }, [currentAmount, inflationRate, years]);

  const handleCalculate = () => {
    // 계산은 useMemo에 의해 자동으로 수행됨
  };

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-fg-muted mb-8">
        <Link href="/" className="hover:text-fg transition-colors">홈</Link>
        <ChevronRight size={12} />
        <span className="text-fg-secondary">금융 계산기</span>
        <ChevronRight size={12} />
        <span className="text-fg font-medium">인플레이션 계산기</span>
      </nav>

      {/* Title */}
      <div className="mb-8">
        <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-3">인플레이션 계산기</h1>
        <p className="text-[15px] text-fg-secondary">
          물가상승으로 인한 화폐 가치 하락을 계산하고, 미래의 실질 구매력을 알아보세요.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="border border-border rounded-2xl bg-surface p-6 sticky top-20">
            <h2 className="text-[16px] font-semibold text-fg mb-5">계산 설정</h2>

            <div className="space-y-4">
              <FormProgress current={[currentAmount > 0, inflationRate > 0, years > 0].filter(Boolean).length} total={3} />

              {/* 현재 금액 */}
              <FormStep step={1} label="현재금액" required completed={currentAmount > 0}>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(Number(e.target.value))}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                  />
                  <span className="text-[13px] text-fg-muted">원</span>
                </div>
                <p className="text-[12px] text-fg-muted mt-1.5">
                  {currentAmount.toLocaleString('ko-KR')} 원
                </p>
              </FormStep>

              {/* 연간 물가상승률 */}
              <FormStep step={2} label="물가상승률" required completed={inflationRate > 0}>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={inflationRate}
                    onChange={(e) => setInflationRate(Number(e.target.value))}
                    step="0.1"
                    className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                  />
                  <span className="text-[13px] text-fg-muted">%</span>
                </div>
                <p className="text-[12px] text-fg-muted mt-1.5">기본값: 3% (한국 평균)</p>
              </FormStep>

              {/* 기간 */}
              <FormStep step={3} label="기간" required completed={years > 0}>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                  />
                  <span className="text-[13px] text-fg-muted">년</span>
                </div>
              </FormStep>

              <div className="pl-[30px]">
                <button
                  onClick={handleCalculate}
                  className="w-full h-11 bg-accent hover:bg-accent-hover text-accent-fg font-medium rounded-xl transition-colors"
                >
                  계산하기
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          {result && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="border border-border rounded-xl bg-surface p-4">
                  <p className="text-[13px] text-fg-secondary mb-1">현재 금액</p>
                  <p className="text-[22px] font-bold text-fg tabular-nums">
                    {result.currentAmount.toLocaleString('ko-KR', {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p className="text-[12px] text-fg-muted mt-1">원</p>
                </div>

                <div className="border border-border rounded-xl bg-surface p-4">
                  <p className="text-[13px] text-fg-secondary mb-1">{result.years}년 후 명목가치</p>
                  <p className="text-[22px] font-bold text-fg tabular-nums">
                    {result.futureAmount.toLocaleString('ko-KR', {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p className="text-[12px] text-fg-muted mt-1">원</p>
                </div>

                <div className="border border-border rounded-xl bg-surface p-4">
                  <p className="text-[13px] text-fg-secondary mb-1">{result.years}년 후 실질 구매력</p>
                  <p className="text-[22px] font-bold text-fg tabular-nums">
                    {result.purchasingPower.toLocaleString('ko-KR', {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p className="text-[12px] text-fg-muted mt-1">원</p>
                </div>

                <div className="border border-border rounded-xl bg-surface p-4">
                  <p className="text-[13px] text-fg-secondary mb-1">구매력 감소율</p>
                  <p className="text-[22px] font-bold text-fg tabular-nums">
                    {result.declineRate.toFixed(2)}%
                  </p>
                  <p className="text-[12px] text-fg-muted mt-1">감소</p>
                </div>

                <div className="border border-border rounded-xl bg-bg-secondary p-5 sm:col-span-2">
                  <p className="text-[13px] text-fg-secondary mb-1">실질가치 감소액</p>
                  <p className="text-[32px] font-bold text-fg tabular-nums">
                    {(result.currentAmount - result.purchasingPower).toLocaleString('ko-KR', {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p className="text-[12px] text-fg-muted mt-1">원</p>
                </div>
              </div>

              {/* Year-by-Year Table */}
              <div className="border border-border rounded-xl bg-surface overflow-hidden">
                <div className="p-4">
                  <h3 className="text-[16px] font-semibold text-fg">연도별 물가상승 현황</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-bg-secondary border-b border-border">
                      <tr>
                        <th className="text-left text-[13px] font-medium text-fg-secondary px-4 py-3">
                          연도
                        </th>
                        <th className="text-right text-[13px] font-medium text-fg-secondary px-4 py-3">
                          명목가치
                        </th>
                        <th className="text-right text-[13px] font-medium text-fg-secondary px-4 py-3">
                          실질구매력
                        </th>
                        <th className="text-right text-[13px] font-medium text-fg-secondary px-4 py-3">
                          구매력감소
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.yearlyData.map((item, idx) => (
                        <tr
                          key={idx}
                          className={
                            idx % 2 === 0
                              ? 'bg-surface'
                              : 'bg-bg-secondary'
                          }
                        >
                          <td className="text-[13px] text-fg tabular-nums px-4 py-2.5 font-medium">
                            {item.year}년
                          </td>
                          <td className="text-right text-[13px] text-fg tabular-nums px-4 py-2.5">
                            {item.amount.toLocaleString('ko-KR', {
                              maximumFractionDigits: 0,
                            })}
                          </td>
                          <td className="text-right text-[13px] text-fg tabular-nums px-4 py-2.5">
                            {item.purchasingPower.toLocaleString('ko-KR', {
                              maximumFractionDigits: 0,
                            })}
                          </td>
                          <td className="text-right text-[13px] text-fg tabular-nums px-4 py-2.5 font-medium">
                            {item.decline.toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tips */}
              <div className="border border-border rounded-xl bg-bg-secondary p-5">
                <h3 className="text-[14px] font-semibold text-fg mb-3">팁</h3>
                <ul className="text-[13px] text-fg-secondary leading-relaxed space-y-1">
                  <li>· 인플레이션은 시간이 지나면서 화폐의 실질 가치를 낮춥니다</li>
                  <li>· 현재 1억원이 10년 후 실질가치로는 얼마나 될지 쉽게 계산할 수 있음</li>
                  <li>· 장기 자산 운용 시 인플레이션을 반드시 고려해야 함</li>
                  <li>· 금리 &gt; 인플레이션율이면 실질 수익이 발생</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
