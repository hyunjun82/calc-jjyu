'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function InheritanceTaxCalculator() {
  const [inheritanceAmount, setInheritanceAmount] = useState('');
  const [debt, setDebt] = useState('');
  const [funeralExpenses, setFuneralExpenses] = useState('');
  const [hasSpouse, setHasSpouse] = useState('yes');
  const [spouseAmount, setSpouseAmount] = useState('');
  const [childrenCount, setChildrenCount] = useState('1');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const getTaxRateAndDeduction = (taxableIncome: number): { rate: number; deduction: number } => {
    if (taxableIncome <= 100000000) return { rate: 0.1, deduction: 0 };
    if (taxableIncome <= 500000000) return { rate: 0.2, deduction: 10000000 };
    if (taxableIncome <= 1000000000) return { rate: 0.3, deduction: 60000000 };
    if (taxableIncome <= 3000000000) return { rate: 0.4, deduction: 160000000 };
    return { rate: 0.5, deduction: 460000000 };
  };

  const handleCalculate = () => {
    const inheritance = parseFloat(inheritanceAmount) || 0;
    const debtAmount = parseFloat(debt) || 0;
    let funeralCost = parseFloat(funeralExpenses) || 0;

    if (inheritance <= 0) {
      alert('상속재산가액을 입력해주세요.');
      return;
    }

    // 장례비용 범위: 500만원 ~ 1,500만원
    if (funeralCost < 5000000) funeralCost = 5000000;
    if (funeralCost > 15000000) funeralCost = 15000000;

    // 순상속재산 = 상속재산 - 채무 - 장례비용
    const netInheritance = inheritance - debtAmount - funeralCost;

    // 공제액 계산
    const basicDeduction = 200000000; // 기초공제
    const children = parseInt(childrenCount) || 1;
    const personalDeduction = children * 50000000; // 인적공제

    // 일괄공제: 기초+인적공제 합계와 비교하여 큰 금액
    const totalSpecialDeduction = basicDeduction + personalDeduction;
    const lumpSumDeduction = 500000000;
    const maxDeduction = Math.max(totalSpecialDeduction, lumpSumDeduction);

    // 배우자공제
    let spouseDeduction = 0;
    if (hasSpouse === 'yes') {
      const legalShare = netInheritance * (1.5 / (1.5 + children));
      // 배우자 상속액 미입력 시 법정상속분으로 기본 적용
      const spouse = spouseAmount !== '' ? (parseFloat(spouseAmount) || 0) : legalShare;
      let spouseShare = Math.min(spouse, legalShare);
      // 실제로 상속받은 경우에만 최소 5억 보장, 미상속 시 공제 없음
      spouseDeduction = spouse > 0
        ? Math.max(Math.min(spouseShare, 3000000000), 500000000)
        : 0;
    }

    // 금융재산공제는 이 계산기에서는 단순화하여 0으로 처리
    const financialDeduction = 0;

    // 과세표준 = 순상속재산 - 각 공제
    const taxableIncome = Math.max(
      netInheritance - maxDeduction - spouseDeduction - financialDeduction,
      0
    );

    if (taxableIncome <= 0) {
      setResults({
        inheritanceAmount: inheritance,
        debtAmount,
        funeralExpenses: funeralCost,
        netInheritance,
        basicDeduction,
        personalDeduction,
        maxDeduction,
        spouseDeduction,
        financialDeduction,
        taxableIncome: 0,
        inheritanceTax: 0,
        reportingCredit: 0,
        payableAmount: 0,
      });
      return;
    }

    // 상속세 계산
    const { rate, deduction } = getTaxRateAndDeduction(taxableIncome);
    const inheritanceTax = taxableIncome * rate - deduction;

    // 신고세액공제 (3%)
    const reportingCredit = inheritanceTax * 0.03;
    const payableAmount = inheritanceTax - reportingCredit;

    setResults({
      inheritanceAmount: inheritance,
      debtAmount,
      funeralExpenses: funeralCost,
      netInheritance,
      basicDeduction,
      personalDeduction,
      maxDeduction,
      spouseDeduction,
      financialDeduction,
      taxableIncome,
      inheritanceTax,
      reportingCredit,
      payableAmount,
      taxRate: (rate * 100).toFixed(1),
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
        <span className="text-fg font-medium">상속세 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">상속세 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        사망에 따른 재산 상속 시 발생하는 상속세를 계산합니다. 기초공제, 인적공제, 배우자공제 등 다양한 공제를 적용합니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 상속재산가액 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              상속재산가액 (원) *
            </label>
            <input
              type="number"
              value={inheritanceAmount}
              onChange={(e) => setInheritanceAmount(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              부동산, 예금, 주식 등 모든 상속 재산의 합
            </p>
          </div>

          {/* 채무 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              피상속인의 채무 (원)
            </label>
            <input
              type="number"
              value={debt}
              onChange={(e) => setDebt(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              상속 시 인수하는 채무, 신용카드 채무 등
            </p>
          </div>

          {/* 장례비용 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              장례비용 (원)
            </label>
            <input
              type="number"
              value={funeralExpenses}
              onChange={(e) => setFuneralExpenses(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              최소 500만원, 최대 1,500만원으로 조정
            </p>
          </div>

          {/* 배우자 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              배우자 상속 여부
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'yes', label: '예' },
                { val: 'no', label: '아니오' },
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

          {/* 배우자 상속액 */}
          {hasSpouse === 'yes' && (
            <div className="mb-6">
              <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                배우자 상속액 (원)
              </label>
              <input
                type="number"
                value={spouseAmount}
                onChange={(e) => setSpouseAmount(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                placeholder="0"
              />
              <p className="text-[12px] text-fg-muted mt-1.5">
                배우자가 상속받을 예정인 금액
              </p>
            </div>
          )}

          {/* 자녀 수 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              자녀 수
            </label>
            <input
              type="number"
              value={childrenCount}
              onChange={(e) => setChildrenCount(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              min="0"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              인적공제: 자녀 1인당 5천만원
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
            <span className="text-[13px] text-fg-secondary">상속재산가액</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.inheritanceAmount)}원
            </span>
          </div>

          {results.debtAmount > 0 && (
            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-[13px] text-fg-secondary">채무</span>
              <span className="text-[14px] font-medium text-fg tabular-nums">
                -{formatNumber(results.debtAmount)}원
              </span>
            </div>
          )}

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">장례비용</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              -{formatNumber(results.funeralExpenses)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">순상속재산</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.netInheritance)}원
            </span>
          </div>

          <div className="border border-border rounded-xl bg-bg-secondary p-4 mt-3 mb-3">
            <h4 className="text-[13px] font-semibold text-fg mb-3">공제액</h4>
            <div className="space-y-2 text-[13px]">
              <div className="flex justify-between">
                <span className="text-fg-secondary">기초공제</span>
                <span className="text-fg tabular-nums">{formatNumber(results.basicDeduction)}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-fg-secondary">인적공제</span>
                <span className="text-fg tabular-nums">{formatNumber(results.personalDeduction)}원</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2">
                <span className="text-fg-secondary">적용 공제액</span>
                <span className="font-medium text-fg tabular-nums">
                  {formatNumber(results.maxDeduction)}원
                </span>
              </div>
            </div>
          </div>

          {results.spouseDeduction > 0 && (
            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-[13px] text-fg-secondary">배우자공제</span>
              <span className="text-[14px] font-medium text-fg tabular-nums">
                -{formatNumber(results.spouseDeduction)}원
              </span>
            </div>
          )}

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">과세표준</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.taxableIncome)}원
            </span>
          </div>

          {results.inheritanceTax > 0 && (
            <>
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-[13px] text-fg-secondary">세율</span>
                <span className="text-[14px] font-medium text-fg tabular-nums">
                  {results.taxRate}%
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-[13px] text-fg-secondary">상속세</span>
                <span className="text-[14px] font-medium text-fg tabular-nums">
                  {formatNumber(results.inheritanceTax)}원
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-[13px] text-fg-secondary">신고세액공제 (3%)</span>
                <span className="text-[14px] font-medium text-fg tabular-nums">
                  -{formatNumber(results.reportingCredit)}원
                </span>
              </div>
            </>
          )}

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">납부할 세액</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {formatNumber(results.payableAmount)}원
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 기초공제 2억원과 인적공제(자녀당 5천만원) 중 큰 금액이 적용됩니다.</li>
          <li>· 배우자공제는 최소 5억원, 최대 30억원 범위에서 적용됩니다.</li>
          <li>· 장례비용은 실제 지출과 무관하게 500만원~1,500만원 범위로 공제됩니다.</li>
          <li>· 신고기한은 피상속인 사망일로부터 10개월입니다.</li>
        </ul>
      </div>
    </div>
  );
}
