'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function ChildcareCalculator() {
  const [householdSize, setHouseholdSize] = useState('');
  const [childAge, setChildAge] = useState('3개월~36개월');
  const [serviceType, setServiceType] = useState('영아종일제');
  const [monthlyHours, setMonthlyHours] = useState('');
  const [dualIncome, setDualIncome] = useState('맞벌이');
  const [income, setIncome] = useState('');
  const [assets, setAssets] = useState('');
  const [debt, setDebt] = useState('');
  const [region, setRegion] = useState('서울');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('ko-KR');
  };

  // 2024 기준 중위소득
  const medianIncome: Record<number, number> = {
    1: 2228445,
    2: 3682609,
    3: 4714657,
    4: 5729913,
    5: 6695735,
    6: 7618369,
  };

  // 기본재산공제액
  const basicAssetDeduction: Record<string, number> = {
    '서울': 99000000,
    '경기': 80000000,
    '광역시': 77000000,
    '그 외': 53000000,
  };

  const getMedianIncome = (size: number): number => {
    if (size <= 0) return 0;
    if (size <= 6) return medianIncome[size];
    const perPersonAdd = medianIncome[6] - medianIncome[5];
    return medianIncome[6] + perPersonAdd * (size - 6);
  };

  const handleCalculate = () => {
    const size = parseInt(householdSize) || 0;
    if (size < 1 || size > 10) {
      alert('가구원 수를 1~10 사이로 입력해주세요.');
      return;
    }

    const monthlyIncome = parseFloat(income) || 0;
    const totalAssets = parseFloat(assets) || 0;
    const totalDebt = parseFloat(debt) || 0;
    const hours = parseFloat(monthlyHours) || 0;

    // 소득인정액 계산
    const incomeComponent = monthlyIncome * 0.7;
    const deduction = basicAssetDeduction[region];
    const netAssets = totalAssets - totalDebt - deduction;
    const assetConversion = netAssets > 0 ? netAssets * (0.0417 / 12) : 0;
    const recognizedIncome = Math.max(incomeComponent, 0) + assetConversion;

    // 중위소득 기준
    const median = getMedianIncome(size);
    const ratio = (recognizedIncome / median) * 100;

    // 소득유형 판정
    let incomeType: string;
    let govRatio: number;
    let hourlyBurden: number;

    if (ratio <= 75) {
      incomeType = '가형 (중위소득 75% 이하)';
      govRatio = 85.7;
      hourlyBurden = 1580;
    } else if (ratio <= 120) {
      incomeType = '나형 (중위소득 120% 이하)';
      govRatio = 57.1;
      hourlyBurden = 4750;
    } else if (ratio <= 150) {
      incomeType = '다형 (중위소득 150% 이하)';
      govRatio = 14.3;
      hourlyBurden = 9490;
    } else {
      incomeType = '라형 (중위소득 150% 초과)';
      govRatio = 0;
      hourlyBurden = 11080;
    }

    let monthlyBurden: number;
    let monthlyGovSupport: number;

    if (serviceType === '영아종일제') {
      // 영아종일제: 월 200시간, 월 233만원 기준
      const monthlyTotal = 2330000;
      if (ratio <= 75) {
        monthlyBurden = 333100;
      } else if (ratio <= 120) {
        monthlyBurden = 999300;
      } else if (ratio <= 150) {
        monthlyBurden = 1998300;
      } else {
        monthlyBurden = monthlyTotal;
      }
      monthlyGovSupport = monthlyTotal - monthlyBurden;
    } else {
      // 시간제: 시급 11,080원 기준
      const hourlyRate = 11080;
      monthlyBurden = hourlyBurden * hours;
      monthlyGovSupport = (hourlyRate - hourlyBurden) * hours;
    }

    setResults({
      recognizedIncome,
      incomeType,
      govRatio,
      hourlyBurden,
      monthlyBurden,
      monthlyGovSupport,
      median,
      ratio,
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
        <span className="text-fg font-medium">아이돌봄서비스 모의계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">아이돌봄서비스 모의계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        맞벌이 등 양육공백 가정의 아이돌봄서비스 지원 대상 여부와 예상 본인부담금을 모의계산합니다.
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

          {/* 아동 나이 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              아동 나이
            </label>
            <div className="flex flex-wrap gap-2">
              {['3개월~36개월', '만 3세~12세'].map((age) => (
                <button
                  key={age}
                  type="button"
                  onClick={() => setChildAge(age)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    childAge === age
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {age}
                </button>
              ))}
            </div>
          </div>

          {/* 서비스 유형 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              서비스 유형
            </label>
            <div className="flex flex-wrap gap-2">
              {['영아종일제', '시간제'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setServiceType(type)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    serviceType === type
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* 월 이용시간 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              월 이용시간 (시간)
            </label>
            <input
              type="number"
              value={monthlyHours}
              onChange={(e) => setMonthlyHours(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder={serviceType === '영아종일제' ? '200' : '80'}
            />
            <p className="text-[12px] text-fg-muted mt-1.5">
              {serviceType === '영아종일제' ? '영아종일제는 월 200시간 기준' : '월 예상 이용시간을 입력하세요'}
            </p>
          </div>

          {/* 맞벌이 여부 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              맞벌이 여부
            </label>
            <div className="flex flex-wrap gap-2">
              {['맞벌이', '한부모', '기타양육공백'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setDualIncome(type)}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    dualIncome === type
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* 월 소득 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              월 소득 (원)
            </label>
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              placeholder="0"
            />
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
            <span className="text-[13px] text-fg-secondary">기준 중위소득 ({householdSize}인)</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.median)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">소득유형</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.incomeType}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">정부지원비율</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.govRatio}%
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">시간당 본인부담금</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {formatNumber(results.hourlyBurden)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2 mb-2">
            <span className="text-[15px] font-semibold text-fg">월 예상 본인부담금</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {formatNumber(results.monthlyBurden)}원
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">월 정부지원금</span>
            <span className="text-[24px] font-bold text-accent tabular-nums">
              {formatNumber(results.monthlyGovSupport)}원
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 아이돌봄서비스는 만 12세 이하 아동을 대상으로 맞벌이 등 양육공백 가정에 제공됩니다.</li>
          <li>· 영아종일제는 3개월~36개월 영아를 대상으로 월 200시간(월 233만원) 기준으로 운영됩니다.</li>
          <li>· 시간제 서비스는 시급 11,080원이며, 소득유형에 따라 정부지원 비율이 달라집니다.</li>
          <li>· 소득인정액 = (소득 x 0.7) + (재산-부채-기본재산공제) x 0.0417/12 로 산정됩니다.</li>
          <li>· 기본재산공제는 지역별로 다릅니다 (서울 9,900만원, 경기 8,000만원, 광역시 7,700만원, 그 외 5,300만원).</li>
          <li>· 본 계산기는 간이 모의계산이며, 실제 지원 여부는 주민센터 또는 아이돌봄서비스 홈페이지를 통해 확인하시기 바랍니다.</li>
        </ul>
      </div>
    </div>
  );
}
