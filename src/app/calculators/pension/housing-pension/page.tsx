'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function HousingPensionCalculator() {
  const [housePrice, setHousePrice] = useState('');
  const [age, setAge] = useState('');
  const [spouseAge, setSpouseAge] = useState('');
  const [paymentType, setPaymentType] = useState('lifetime');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  const getMonthlyRate = (applicantAge: number): number => {
    if (applicantAge >= 80) return 0.0055;
    if (applicantAge >= 75) return 0.004;
    if (applicantAge >= 70) return 0.003;
    if (applicantAge >= 65) return 0.00225;
    if (applicantAge >= 60) return 0.0018;
    return 0.0016;
  };

  const handleCalculate = () => {
    const price = parseFloat(housePrice) || 0;
    const applicantAge = parseInt(age) || 0;

    if (price <= 0) {
      alert('주택가격을 입력해주세요.');
      return;
    }
    if (applicantAge < 55) {
      alert('주택연금은 만 55세 이상부터 가입 가능합니다.');
      return;
    }
    if (price > 900000000) {
      alert('공시가격 9억원 이하 주택만 가입 가능합니다 (시세 기준으로 입력 시 공시가 초과 가능).');
    }

    // 배우자가 있으면 더 어린 나이 기준
    const spAge = parseInt(spouseAge) || 0;
    const effectiveAge = spAge > 0 ? Math.min(applicantAge, spAge) : applicantAge;

    const monthlyRate = getMonthlyRate(effectiveAge);

    let monthlyPension = 0;

    if (paymentType === 'lifetime') {
      monthlyPension = price * monthlyRate;
    } else {
      // 확정기간형 (10년 기준, 종신보다 높은 지급률)
      monthlyPension = price * monthlyRate * 1.5;
    }

    const annualPension = monthlyPension * 12;

    setResults({
      monthlyPension,
      annualPension,
      total10Years: annualPension * 10,
      total20Years: annualPension * 20,
      total30Years: annualPension * 30,
      effectiveAge,
      monthlyRate: (monthlyRate * 100).toFixed(3),
    });
  };

  return (
    <div className="mx-auto max-w-[1200px] px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-fg-muted mb-8">
        <Link href="/" className="hover:text-fg transition-colors">홈</Link>
        <ChevronRight size={12} />
        <span className="text-fg-secondary">연금/보험</span>
        <ChevronRight size={12} />
        <span className="text-fg font-medium">주택연금 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">주택연금 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        주택연금(역모기지) 가입 시 예상 월 수령액을 계산합니다. 만 55세 이상, 공시가격 9억원 이하 주택 소유자가 가입할 수 있습니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 주택가격 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              주택가격 (원) *
            </label>
            <input
              type="number"
              value={housePrice}
              onChange={(e) => setHousePrice(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              시세 또는 공시가격 기준 (공시가격 9억원 이하)
            </p>
          </div>

          {/* 가입자 나이 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              가입자 나이 (만) *
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="65"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              만 55세 이상 가입 가능
            </p>
          </div>

          {/* 배우자 나이 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              배우자 나이 (만, 선택)
            </label>
            <input
              type="number"
              value={spouseAge}
              onChange={(e) => setSpouseAge(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="미입력 시 단독 기준"
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              배우자가 있는 경우 더 젊은 나이 기준으로 산정
            </p>
          </div>

          {/* 지급방식 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              지급 방식
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'lifetime', label: '종신형' },
                { val: 'fixed', label: '확정기간형' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setPaymentType(val)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    paymentType === val
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
            <span className="text-[13px] text-fg-secondary">적용 나이</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              만 {results.effectiveAge}세
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">월 지급률</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.monthlyRate}%
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">연간 수령액</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.annualPension)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">10년 총 수령액</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.total10Years)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">20년 총 수령액</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.total20Years)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">30년 총 수령액</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.total30Years)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">월 예상수령액</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {formatNumber(results.monthlyPension)}원
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 주택연금은 만 55세 이상, 공시가격 9억원 이하 주택 소유자가 가입할 수 있습니다.</li>
          <li>· 나이가 많을수록, 주택가격이 높을수록 월 수령액이 증가합니다.</li>
          <li>· 종신형은 평생 수령하며, 확정기간형은 정해진 기간만 수령합니다.</li>
          <li>· 부부 공동 소유 시 더 어린 배우자의 나이가 기준이 됩니다.</li>
        </ul>
      </div>
    </div>
  );
}
