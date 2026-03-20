'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface ScoreBreakdown {
  housingPeriod: number;
  dependents: number;
  accountPeriod: number;
  total: number;
}

export default function SubscriptionPointsPage() {
  const [isMarried, setIsMarried] = useState<boolean>(false);
  const [age, setAge] = useState<string>('30');
  const [housingYears, setHousingYears] = useState<string>('5');
  const [dependents, setDependents] = useState<string>('0');
  const [accountMonths, setAccountMonths] = useState<string>('12');

  const calculateHousingPeriodPoints = (): number => {
    const years = parseFloat(housingYears) || 0;
    const ageNum = parseFloat(age) || 0;

    // 만 30세 미만 미혼
    if (ageNum < 30 && !isMarried) {
      return 0;
    }

    // 1년 미만: 2점
    if (years < 1) return 2;
    // 1~2년: 4점
    if (years < 2) return 4;
    // 2~3년: 6점
    if (years < 3) return 6;
    // 3~4년: 8점
    if (years < 4) return 8;
    // 4~5년: 10점
    if (years < 5) return 10;
    // 5~6년: 12점
    if (years < 6) return 12;
    // 6~7년: 14점
    if (years < 7) return 14;
    // 7~8년: 16점
    if (years < 8) return 16;
    // 8~9년: 18점
    if (years < 9) return 18;
    // 9~10년: 20점
    if (years < 10) return 20;
    // 10~11년: 22점
    if (years < 11) return 22;
    // 11~12년: 24점
    if (years < 12) return 24;
    // 12~13년: 26점
    if (years < 13) return 26;
    // 13~14년: 28점
    if (years < 14) return 28;
    // 14~15년: 30점
    if (years < 15) return 30;
    // 15년 이상: 32점
    return 32;
  };

  const calculateDependentPoints = (): number => {
    const num = parseInt(dependents) || 0;

    if (num === 0) return 5;
    if (num === 1) return 10;
    if (num === 2) return 15;
    if (num === 3) return 20;
    if (num === 4) return 25;
    if (num === 5) return 30;
    if (num >= 6) return 35;

    return 0;
  };

  const calculateAccountPeriodPoints = (): number => {
    const months = parseFloat(accountMonths) || 0;
    const years = months / 12;

    // 6개월 미만: 1점
    if (months < 6) return 1;
    // 6개월~1년: 2점
    if (years < 1) return 2;
    // 1~2년: 3점
    if (years < 2) return 3;
    // 2~3년: 4점
    if (years < 3) return 4;
    // 3~4년: 5점
    if (years < 4) return 5;
    // 4~5년: 6점
    if (years < 5) return 6;
    // 5~6년: 7점
    if (years < 6) return 7;
    // 6~7년: 8점
    if (years < 7) return 8;
    // 7~8년: 9점
    if (years < 8) return 9;
    // 8~9년: 10점
    if (years < 9) return 10;
    // 9~10년: 11점
    if (years < 10) return 11;
    // 10~11년: 12점
    if (years < 11) return 12;
    // 11~12년: 13점
    if (years < 12) return 13;
    // 12~13년: 14점
    if (years < 13) return 14;
    // 13~14년: 15점
    if (years < 14) return 15;
    // 14~15년: 16점
    if (years < 15) return 16;
    // 15년 이상: 17점
    return 17;
  };

  const housingScore = calculateHousingPeriodPoints();
  const dependentScore = calculateDependentPoints();
  const accountScore = calculateAccountPeriodPoints();
  const totalScore = housingScore + dependentScore + accountScore;

  const getCompetitivenessLevel = (): { level: string; description: string } => {
    if (totalScore >= 70) {
      return {
        level: '매우 높음',
        description: '당첨 가능성이 높습니다',
      };
    }
    if (totalScore >= 60) {
      return {
        level: '높음',
        description: '당첨 가능성이 있습니다',
      };
    }
    if (totalScore >= 45) {
      return {
        level: '중간',
        description: '당첨 가능성이 있으나 경쟁이 있습니다',
      };
    }
    if (totalScore >= 30) {
      return {
        level: '낮음',
        description: '경쟁이 치열합니다',
      };
    }
    return {
      level: '매우 낮음',
      description: '가점 획득이 필요합니다',
    };
  };

  const competitiveness = getCompetitivenessLevel();

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-[1200px] px-6 py-4">
          <nav className="flex items-center gap-1.5 text-[13px] text-fg-muted mb-8">
            <Link href="/" className="hover:text-fg">홈</Link>
            <ChevronRight size={12} />
            <span>부동산</span>
            <ChevronRight size={12} />
            <span className="text-fg font-medium">청약가점</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-[1200px] px-6 py-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl font-bold text-fg">청약가점 계산기</h1>
            <span className="inline-block bg-bg-tertiary text-fg-secondary text-xs font-semibold px-3 py-1 rounded-full">
              부동산
            </span>
          </div>
          <p className="text-fg-secondary text-lg">
            주택청약 시 필요한 가점을 정확하게 계산합니다. 무주택기간, 부양가족수, 청약통장 가입기간을 고려합니다.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-[1200px] px-6 py-8">
        {/* Calculator Card */}
        <div className="bg-surface rounded-xl shadow-[var(--shadow-md)] overflow-hidden mb-8">
          <div className="bg-bg-secondary px-8 py-6 border-b border-border">
            <h2 className="text-[12px] font-medium text-fg-muted uppercase tracking-wider">청약가점 입력</h2>
          </div>

          <div className="p-8">
            {/* Category 1: Housing Period (32점 만점) */}
            <div className="mb-8 pb-8 border-b border-border">
              <h3 className="text-lg font-bold text-fg mb-6 flex items-center gap-2">
                <span className="inline-block w-8 h-8 bg-accent text-accent-fg rounded-full text-center leading-8 text-sm font-bold">
                  1
                </span>
                무주택기간 (32점 만점)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-fg-secondary mb-2">
                    나이 (만 나이)
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min="20"
                    max="100"
                    className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                    placeholder="30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-fg-secondary mb-2">
                    결혼 여부
                  </label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setIsMarried(false)}
                      className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                        !isMarried
                          ? 'bg-accent text-accent-fg'
                          : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                      }`}
                    >
                      미혼
                    </button>
                    <button
                      onClick={() => setIsMarried(true)}
                      className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                        isMarried
                          ? 'bg-accent text-accent-fg'
                          : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                      }`}
                    >
                      기혼
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-fg-secondary mb-2">
                  무주택기간 (년)
                </label>
                <input
                  type="number"
                  value={housingYears}
                  onChange={(e) => setHousingYears(e.target.value)}
                  min="0"
                  step="0.1"
                  className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                  placeholder="5"
                />
                <p className="text-xs text-fg-muted mt-2">
                  주택을 소유하지 않은 기간을 입력하세요. (소수점 입력 가능)
                </p>
              </div>
            </div>

            {/* Category 2: Dependents (35점 만점) */}
            <div className="mb-8 pb-8 border-b border-border">
              <h3 className="text-lg font-bold text-fg mb-6 flex items-center gap-2">
                <span className="inline-block w-8 h-8 bg-accent text-accent-fg rounded-full text-center leading-8 text-sm font-bold">
                  2
                </span>
                부양가족수 (35점 만점)
              </h3>

              <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    onClick={() => setDependents(num.toString())}
                    className={`py-3 px-2 rounded-lg font-semibold transition-all duration-200 text-sm ${
                      dependents === num.toString()
                        ? 'bg-accent text-accent-fg'
                        : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                    }`}
                  >
                    {num === 6 ? '6명+' : num + '명'}
                  </button>
                ))}
              </div>
              <p className="text-xs text-fg-muted mt-4">
                배우자, 미혼 자녀, 부모님 등 생계를 같이 하는 가족을 포함합니다.
              </p>
            </div>

            {/* Category 3: Account Period (17점 만점) */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-fg mb-6 flex items-center gap-2">
                <span className="inline-block w-8 h-8 bg-accent text-accent-fg rounded-full text-center leading-8 text-sm font-bold">
                  3
                </span>
                청약통장 가입기간 (17점 만점)
              </h3>

              <div>
                <label className="block text-sm font-semibold text-fg-secondary mb-2">
                  가입기간 (개월)
                </label>
                <input
                  type="number"
                  value={accountMonths}
                  onChange={(e) => setAccountMonths(e.target.value)}
                  min="0"
                  step="1"
                  className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                  placeholder="12"
                />
                <p className="text-xs text-fg-muted mt-2">
                  청약통장을 개설한 이후 현재까지의 개월 수를 입력하세요.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-surface rounded-xl shadow-[var(--shadow-md)] overflow-hidden mb-8">
          <div className="bg-bg-secondary px-8 py-6 border-b border-border">
            <h2 className="text-[12px] font-medium text-fg-muted uppercase tracking-wider">계산 결과</h2>
          </div>

          <div className="p-8">
            {/* Score Breakdown */}
            <div className="space-y-4 mb-8">
              {/* Housing Period Score */}
              <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-xl border border-border">
                <div>
                  <p className="font-semibold text-fg-secondary">무주택기간</p>
                  <p className="text-xs text-fg-muted">최대 32점</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-fg">{housingScore}</p>
                  <p className="text-xs text-fg-muted">점</p>
                </div>
              </div>

              {/* Dependent Score */}
              <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-xl border border-border">
                <div>
                  <p className="font-semibold text-fg-secondary">부양가족수</p>
                  <p className="text-xs text-fg-muted">최대 35점</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-fg">{dependentScore}</p>
                  <p className="text-xs text-fg-muted">점</p>
                </div>
              </div>

              {/* Account Period Score */}
              <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-xl border border-border">
                <div>
                  <p className="font-semibold text-fg-secondary">청약통장 가입기간</p>
                  <p className="text-xs text-fg-muted">최대 17점</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-fg">{accountScore}</p>
                  <p className="text-xs text-fg-muted">점</p>
                </div>
              </div>
            </div>

            {/* Total Score */}
            <div className="bg-bg-secondary rounded-xl p-6 mb-8">
              <p className="text-[12px] font-medium text-fg-muted uppercase tracking-wider mb-2">총 청약가점</p>
              <div className="flex items-baseline gap-2">
                <span className="text-[36px] font-bold text-fg tabular-nums">{totalScore}</span>
                <span className="text-lg font-semibold text-fg-secondary">/ 84점</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="w-full bg-bg-tertiary rounded-full h-3 overflow-hidden">
                <div
                  className="bg-accent h-full transition-all duration-300"
                  style={{ width: `${(totalScore / 84) * 100}%` }}
                />
              </div>
              <p className="text-xs text-fg-muted mt-2 text-right">
                {((totalScore / 84) * 100).toFixed(1)}%
              </p>
            </div>

            {/* Competitiveness Level */}
            <div className="p-6 rounded-xl border border-border bg-bg-secondary">
              <p className="text-[12px] font-medium text-fg-muted uppercase tracking-wider mb-2">경쟁력 평가</p>
              <p className="text-2xl font-bold text-fg mb-2">{competitiveness.level}</p>
              <p className="text-[13px] text-fg-secondary">{competitiveness.description}</p>
            </div>
          </div>
        </div>

        {/* Score Guidelines */}
        <div className="bg-surface rounded-xl shadow-[var(--shadow-md)] overflow-hidden mb-8">
          <div className="bg-bg-secondary px-8 py-6 border-b border-border">
            <h2 className="text-[12px] font-medium text-fg-muted uppercase tracking-wider">가점 기준표</h2>
          </div>

          {/* Housing Period Table */}
          <div className="p-8">
            <h3 className="text-lg font-bold text-fg mb-4">1. 무주택기간 (32점 만점)</h3>
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-bg-secondary border-b border-border">
                    <th className="px-4 py-3 text-left text-[13px] font-medium text-fg-secondary">기간</th>
                    <th className="px-4 py-3 text-left text-[13px] font-medium text-fg-secondary">가점</th>
                    <th className="px-4 py-3 text-left text-[13px] font-medium text-fg-secondary">기간</th>
                    <th className="px-4 py-3 text-left text-[13px] font-medium text-fg-secondary">가점</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border hover:bg-surface-hover">
                    <td className="px-4 py-3 text-[13px] text-fg-secondary">만 30세 미만 미혼</td>
                    <td className="px-4 py-3 text-[13px] text-fg font-medium">0점</td>
                    <td className="px-4 py-3 text-[13px] text-fg-secondary">10~11년</td>
                    <td className="px-4 py-3 text-[13px] text-fg font-medium">22점</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-surface-hover">
                    <td className="px-4 py-3 text-[13px] text-fg-secondary">1년 미만</td>
                    <td className="px-4 py-3 text-[13px] text-fg font-medium">2점</td>
                    <td className="px-4 py-3 text-[13px] text-fg-secondary">11~12년</td>
                    <td className="px-4 py-3 text-[13px] text-fg font-medium">24점</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-surface-hover">
                    <td className="px-4 py-3 text-[13px] text-fg-secondary">1~2년</td>
                    <td className="px-4 py-3 text-[13px] text-fg font-medium">4점</td>
                    <td className="px-4 py-3 text-[13px] text-fg-secondary">12~13년</td>
                    <td className="px-4 py-3 text-[13px] text-fg font-medium">26점</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-surface-hover">
                    <td className="px-4 py-3 text-[13px] text-fg-secondary">2~3년</td>
                    <td className="px-4 py-3 text-[13px] text-fg font-medium">6점</td>
                    <td className="px-4 py-3 text-[13px] text-fg-secondary">13~14년</td>
                    <td className="px-4 py-3 text-[13px] text-fg font-medium">28점</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-surface-hover">
                    <td className="px-4 py-3 text-[13px] text-fg-secondary">3~4년</td>
                    <td className="px-4 py-3 text-[13px] text-fg font-medium">8점</td>
                    <td className="px-4 py-3 text-[13px] text-fg-secondary">14~15년</td>
                    <td className="px-4 py-3 text-[13px] text-fg font-medium">30점</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-surface-hover">
                    <td className="px-4 py-3 text-[13px] text-fg-secondary">4~5년</td>
                    <td className="px-4 py-3 text-[13px] text-fg font-medium">10점</td>
                    <td className="px-4 py-3 text-[13px] text-fg-secondary">15년 이상</td>
                    <td className="px-4 py-3 text-[13px] text-fg font-medium">32점</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-surface-hover">
                    <td className="px-4 py-3 text-[13px] text-fg-secondary">5~6년</td>
                    <td className="px-4 py-3 text-[13px] text-fg font-medium">12점</td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr className="border-b border-border hover:bg-surface-hover">
                    <td className="px-4 py-3 text-[13px] text-fg-secondary">6~7년</td>
                    <td className="px-4 py-3 text-[13px] text-fg font-medium">14점</td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr className="border-b border-border hover:bg-surface-hover">
                    <td className="px-4 py-3 text-[13px] text-fg-secondary">7~8년</td>
                    <td className="px-4 py-3 text-[13px] text-fg font-medium">16점</td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr className="border-b border-border hover:bg-surface-hover">
                    <td className="px-4 py-3 text-[13px] text-fg-secondary">8~9년</td>
                    <td className="px-4 py-3 text-[13px] text-fg font-medium">18점</td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr className="hover:bg-surface-hover">
                    <td className="px-4 py-3 text-[13px] text-fg-secondary">9~10년</td>
                    <td className="px-4 py-3 text-[13px] text-fg font-medium">20점</td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Dependent Table */}
            <h3 className="text-lg font-bold text-fg mb-4">2. 부양가족수 (35점 만점)</h3>
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-bg-secondary border-b border-border">
                    <th className="px-4 py-3 text-left text-[13px] font-medium text-fg-secondary">가족수</th>
                    <th className="px-4 py-3 text-left text-[13px] font-medium text-fg-secondary">0명</th>
                    <th className="px-4 py-3 text-left text-[13px] font-medium text-fg-secondary">1명</th>
                    <th className="px-4 py-3 text-left text-[13px] font-medium text-fg-secondary">2명</th>
                    <th className="px-4 py-3 text-left text-[13px] font-medium text-fg-secondary">3명</th>
                    <th className="px-4 py-3 text-left text-[13px] font-medium text-fg-secondary">4명</th>
                    <th className="px-4 py-3 text-left text-[13px] font-medium text-fg-secondary">5명</th>
                    <th className="px-4 py-3 text-left text-[13px] font-medium text-fg-secondary">6명+</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-bg-secondary border-b border-border hover:bg-surface-hover">
                    <td className="px-4 py-3 text-[13px] font-semibold text-fg-secondary">가점</td>
                    <td className="px-4 py-3 text-[13px] text-fg font-medium">5점</td>
                    <td className="px-4 py-3 text-[13px] text-fg font-medium">10점</td>
                    <td className="px-4 py-3 text-[13px] text-fg font-medium">15점</td>
                    <td className="px-4 py-3 text-[13px] text-fg font-medium">20점</td>
                    <td className="px-4 py-3 text-[13px] text-fg font-medium">25점</td>
                    <td className="px-4 py-3 text-[13px] text-fg font-medium">30점</td>
                    <td className="px-4 py-3 text-[13px] text-fg font-medium">35점</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Account Period Table */}
            <h3 className="text-lg font-bold text-fg mb-4">3. 청약통장 가입기간 (17점 만점)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-bg-secondary border-b border-border">
                    <th className="px-4 py-3 text-left text-[13px] font-medium text-fg-secondary">기간</th>
                    <th className="px-4 py-3 text-left text-[13px] font-medium text-fg-secondary">가점</th>
                    <th className="px-4 py-3 text-left text-[13px] font-medium text-fg-secondary">기간</th>
                    <th className="px-4 py-3 text-left text-[13px] font-medium text-fg-secondary">가점</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border hover:bg-surface-hover">
                    <td className="px-4 py-3 text-[13px] text-fg-secondary">6개월 미만</td>
                    <td className="px-4 py-3 text-[13px] text-fg font-medium">1점</td>
                    <td className="px-4 py-3 text-[13px] text-fg-secondary">9~10년</td>
                    <td className="px-4 py-3 text-[13px] text-fg font-medium">11점</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-surface-hover">
                    <td className="px-4 py-3 text-[13px] text-fg-secondary">6개월~1년</td>
                    <td className="px-4 py-3 text-[13px] text-fg font-medium">2점</td>
                    <td className="px-4 py-3 text-[13px] text-fg-secondary">10~11년</td>
                    <td className="px-4 py-3 text-[13px] text-fg font-medium">12점</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-surface-hover">
                    <td className="px-4 py-3 text-[13px] text-fg-secondary">1~2년</td>
                    <td className="px-4 py-3 text-[13px] text-fg font-medium">3점</td>
                    <td className="px-4 py-3 text-[13px] text-fg-secondary">11~12년</td>
                    <td className="px-4 py-3 text-[13px] text-fg font-medium">13점</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-surface-hover">
                    <td className="px-4 py-3 text-[13px] text-fg-secondary">2~3년</td>
                    <td className="px-4 py-3 text-[13px] text-fg font-medium">4점</td>
                    <td className="px-4 py-3 text-[13px] text-fg-secondary">12~13년</td>
                    <td className="px-4 py-3 text-[13px] text-fg font-medium">14점</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-surface-hover">
                    <td className="px-4 py-3 text-[13px] text-fg-secondary">3~4년</td>
                    <td className="px-4 py-3 text-[13px] text-fg font-medium">5점</td>
                    <td className="px-4 py-3 text-[13px] text-fg-secondary">13~14년</td>
                    <td className="px-4 py-3 text-[13px] text-fg font-medium">15점</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-surface-hover">
                    <td className="px-4 py-3 text-[13px] text-fg-secondary">4~5년</td>
                    <td className="px-4 py-3 text-[13px] text-fg font-medium">6점</td>
                    <td className="px-4 py-3 text-[13px] text-fg-secondary">14~15년</td>
                    <td className="px-4 py-3 text-[13px] text-fg font-medium">16점</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-surface-hover">
                    <td className="px-4 py-3 text-[13px] text-fg-secondary">5~6년</td>
                    <td className="px-4 py-3 text-[13px] text-fg font-medium">7점</td>
                    <td className="px-4 py-3 text-[13px] text-fg-secondary">15년 이상</td>
                    <td className="px-4 py-3 text-[13px] text-fg font-medium">17점</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-surface-hover">
                    <td className="px-4 py-3 text-[13px] text-fg-secondary">6~7년</td>
                    <td className="px-4 py-3 text-[13px] text-fg font-medium">8점</td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr className="border-b border-border hover:bg-surface-hover">
                    <td className="px-4 py-3 text-[13px] text-fg-secondary">7~8년</td>
                    <td className="px-4 py-3 text-[13px] text-fg font-medium">9점</td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr className="hover:bg-surface-hover">
                    <td className="px-4 py-3 text-[13px] text-fg-secondary">8~9년</td>
                    <td className="px-4 py-3 text-[13px] text-fg font-medium">10점</td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="border border-border rounded-xl bg-bg-secondary p-5 mb-8">
          <h3 className="text-[14px] font-semibold text-fg mb-3">알아두기</h3>
          <ul className="space-y-3 text-[13px] text-fg-secondary">
            <li className="flex gap-3">
              <span>·</span>
              <span>
                청약가점은 주택청약 시 당첨 순위를 결정하는 중요한 요소입니다. 최대 84점입니다.
              </span>
            </li>
            <li className="flex gap-3">
              <span>·</span>
              <span>
                무주택기간은 주택을 소유하지 않은 기간으로, 혼인, 신청인의 나이 등에 따라 달라집니다.
              </span>
            </li>
            <li className="flex gap-3">
              <span>·</span>
              <span>
                부양가족수는 배우자, 미혼 자녀, 부모님 등 생계를 같이 하는 가족을 포함합니다.
              </span>
            </li>
            <li className="flex gap-3">
              <span>·</span>
              <span>
                청약통장은 6개월 이상 가입해야 일반 청약에 참가할 수 있습니다.
              </span>
            </li>
            <li className="flex gap-3">
              <span>·</span>
              <span>
                정확한 가점 계산은 LH 주택청약 시스템에서 확인하시기 바랍니다.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
