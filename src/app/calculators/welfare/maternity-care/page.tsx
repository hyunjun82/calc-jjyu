'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function MaternityCareCalculator() {
  const [householdSize, setHouseholdSize] = useState('');
  const [birthType, setBirthType] = useState('단태아');
  const [birthOrder, setBirthOrder] = useState('첫째');
  const [earnedIncome, setEarnedIncome] = useState('');
  const [otherIncome, setOtherIncome] = useState('');
  const [assets, setAssets] = useState('');
  const [debt, setDebt] = useState('');
  const [region, setRegion] = useState('서울');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  // 2024 기준 중위소득 150%
  const medianIncome150: Record<number, number> = {
    2: 5523914,
    3: 7071986,
    4: 8594870,
  };

  // 2024 기준 중위소득 100% (역산)
  const medianIncome100: Record<number, number> = {
    2: 3682609,
    3: 4714657,
    4: 5729913,
  };

  // 기본재산공제액
  const basicAssetDeduction: Record<string, number> = {
    '서울': 99000000,
    '경기': 80000000,
    '광역시': 77000000,
    '그 외': 53000000,
  };

  const getMedianIncome150 = (size: number): number => {
    if (size <= 1) return 0;
    if (size <= 4) return medianIncome150[size];
    // 5인 이상: 4인 기준 + 1인당 추가금액 (4인 - 3인 차이 적용)
    const perPersonAdd = medianIncome150[4] - medianIncome150[3];
    return medianIncome150[4] + perPersonAdd * (size - 4);
  };

  const getMedianIncome100 = (size: number): number => {
    if (size <= 1) return 0;
    if (size <= 4) return medianIncome100[size];
    const perPersonAdd = medianIncome100[4] - medianIncome100[3];
    return medianIncome100[4] + perPersonAdd * (size - 4);
  };

  const getMedianIncome75 = (size: number): number => {
    return getMedianIncome100(size) * 0.75;
  };

  // 서비스 기간 (표준형 기준)
  const getServiceDays = (): number => {
    if (birthType === '사산·유산') return 5;
    if (birthType === '삼태아 이상') return 20;
    if (birthType === '쌍태아') return 15;
    // 단태아
    if (birthOrder === '셋째 이상') return 20;
    if (birthOrder === '둘째') return 15;
    return 10; // 첫째
  };

  const handleCalculate = () => {
    const size = parseInt(householdSize) || 0;
    if (size < 2 || size > 10) {
      alert('가구원 수를 2~10 사이로 입력해주세요. (산모+신생아 포함 최소 2인)');
      return;
    }

    const earned = parseFloat(earnedIncome) || 0;
    const other = parseFloat(otherIncome) || 0;
    const totalAssets = parseFloat(assets) || 0;
    const totalDebt = parseFloat(debt) || 0;

    // 소득인정액 = (근로소득×0.7 + 기타소득) + (재산-부채-기본재산공제)×0.0417/12
    const incomeAmount = earned * 0.7 + other;

    const deduction = basicAssetDeduction[region];
    const netAssets = totalAssets - totalDebt - deduction;
    const assetConversion = netAssets > 0 ? netAssets * (0.0417 / 12) : 0;

    const recognizedIncome = Math.max(incomeAmount, 0) + assetConversion;

    // 선정기준: 기준 중위소득 150%
    const threshold150 = getMedianIncome150(size);
    const threshold100 = getMedianIncome100(size);
    const threshold75 = getMedianIncome75(size);

    const eligible = recognizedIncome <= threshold150;

    // 소득유형 판정
    let incomeType = '';
    let copayRate = '';
    if (recognizedIncome <= threshold75) {
      incomeType = 'A형 (기초~75%)';
      copayRate = '면제 (0%)';
    } else if (recognizedIncome <= threshold100) {
      incomeType = 'B형 (75%~100%)';
      copayRate = '5~10%';
    } else if (recognizedIncome <= threshold150) {
      incomeType = 'C형 (100%~150%)';
      copayRate = '10~15%';
    } else {
      incomeType = '해당없음';
      copayRate = '해당없음';
    }

    const serviceDays = getServiceDays();

    setResults({
      incomeAmount,
      assetConversion,
      recognizedIncome,
      threshold150,
      eligible,
      incomeType,
      serviceDays,
      copayRate,
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
        <span className="text-fg font-medium">산모·신생아 건강관리 모의계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">산모·신생아 건강관리 모의계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        출산(예정) 가정의 산모·신생아 건강관리 서비스 지원 대상 여부와 예상 서비스 기간을 모의계산합니다.
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
              placeholder="3"
              min={2}
              max={10}
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              산모, 신생아 포함 가구원 수 (2~10명)
            </p>
          </div>

          {/* 출산 유형 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              출산 유형
            </label>
            <div className="flex flex-wrap gap-2">
              {['단태아', '쌍태아', '삼태아 이상', '사산·유산'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setBirthType(type)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    birthType === type
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* 출산 순위 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              출산 순위
            </label>
            <div className="flex flex-wrap gap-2">
              {['첫째', '둘째', '셋째 이상'].map((order) => (
                <button
                  key={order}
                  type="button"
                  onClick={() => setBirthOrder(order)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    birthOrder === order
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {order}
                </button>
              ))}
            </div>
            {birthType !== '단태아' && (
              <p className="text-[12px] text-fg-muted mt-1.5">
                쌍태아/삼태아 이상/사산·유산의 경우 출산 순위와 무관하게 서비스 기간이 결정됩니다.
              </p>
            )}
          </div>

          {/* 월 근로소득 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              월 근로소득 (원)
            </label>
            <input
              type="number"
              value={earnedIncome}
              onChange={(e) => setEarnedIncome(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
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
              사업소득, 재산소득, 이전소득 등 근로소득 외 소득 합계
            </p>
          </div>

          {/* 재산 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              재산 (원)
            </label>
            <input
              type="number"
              value={assets}
              onChange={(e) => setAssets(e.target.value)}
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
              {['서울', '경기', '광역시', '그 외'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRegion(r)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    region === r
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {r}
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
            <span className="text-[13px] text-fg-secondary">선정기준액 (중위소득 150%)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.threshold150)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">수급 여부</span>
            <span className={`text-[14px] font-medium tabular-nums ${results.eligible ? 'text-green-600' : 'text-red-500'}`}>
              {results.eligible ? '지원 대상' : '지원 불가'}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">소득유형</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.incomeType}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">서비스 기간 (표준형)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.serviceDays}일
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">예상 본인부담률</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.copayRate}
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-4">
            <span className="text-[15px] font-semibold text-fg">소득인정액</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {formatNumber(results.recognizedIncome)}원
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 선정기준은 기준 중위소득 150% 이하입니다.</li>
          <li>· 소득인정액 = (근로소득 x 0.7 + 기타소득) + (재산 - 부채 - 기본재산공제) x 0.0417 / 12 로 산정됩니다.</li>
          <li>· 기본재산공제는 지역별로 다릅니다 (서울 9,900만원, 경기 8,000만원, 광역시 7,700만원, 그 외 5,300만원).</li>
          <li>· A형(기초~75%): 본인부담 면제, B형(75%~100%): 5~10%, C형(100%~150%): 10~15%.</li>
          <li>· 서비스 기간은 표준형 기준이며, 단축형·연장형 선택 시 기간이 달라질 수 있습니다.</li>
          <li>· 정부 지원금은 1일 기준 약 16~20만원이며 유형별로 상이합니다.</li>
          <li>· 본 계산기는 간이 모의계산이며, 실제 지원 여부는 관할 보건소를 통해 확인하시기 바랍니다.</li>
        </ul>
      </div>
    </div>
  );
}
