'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function DateCalculator() {
  const [mode, setMode] = useState<'between' | 'add'>('between');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [days, setDays] = useState('');
  const [direction, setDirection] = useState<'after' | 'before'>('after');
  const [businessDaysOnly, setBusinessDaysOnly] = useState(false);
  const [results, setResults] = useState<any>(null);

  const isWeekend = (date: Date): boolean => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const countBusinessDays = (start: Date, end: Date): number => {
    let count = 0;
    const current = new Date(start);
    const target = new Date(end);
    if (current > target) return 0;
    while (current <= target) {
      if (!isWeekend(current)) count++;
      current.setDate(current.getDate() + 1);
    }
    return count;
  };

  const addDaysToDate = (start: Date, numDays: number, onlyBusiness: boolean, dir: string): Date => {
    const result = new Date(start);
    let remaining = numDays;
    const step = dir === 'after' ? 1 : -1;
    while (remaining > 0) {
      result.setDate(result.getDate() + step);
      if (onlyBusiness && isWeekend(result)) continue;
      remaining--;
    }
    return result;
  };

  const formatDate = (date: Date): string => {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const getDayOfWeek = (date: Date): string => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[date.getDay()] + '요일';
  };

  const handleCalculate = () => {
    if (mode === 'between') {
      if (!startDate || !endDate) {
        alert('시작일과 종료일을 입력해주세요.');
        return;
      }
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const bDays = countBusinessDays(
        start < end ? start : end,
        start < end ? end : start
      );
      const weeks = Math.floor(totalDays / 7);
      const remainingDays = totalDays % 7;
      const months = Math.round((totalDays / 30.44) * 10) / 10;

      setResults({
        mode: 'between',
        totalDays,
        businessDays: bDays,
        weeks,
        remainingDays,
        months,
      });
    } else {
      if (!startDate || !days) {
        alert('시작일과 일수를 입력해주세요.');
        return;
      }
      const start = new Date(startDate);
      const numDays = parseInt(days) || 0;
      if (numDays <= 0) {
        alert('일수를 입력해주세요.');
        return;
      }
      const resultDate = addDaysToDate(start, numDays, businessDaysOnly, direction);
      const diffTime = Math.abs(resultDate.getTime() - start.getTime());
      const actualDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const weeks = Math.floor(actualDays / 7);
      const remainingDays = actualDays % 7;

      setResults({
        mode: 'add',
        resultDate,
        formattedDate: formatDate(resultDate),
        dayOfWeek: getDayOfWeek(resultDate),
        actualDays,
        weeks,
        remainingDays,
      });
    }
  };

  return (
    <div className="mx-auto max-w-[1200px] px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-fg-muted mb-8">
        <Link href="/" className="hover:text-fg transition-colors">홈</Link>
        <ChevronRight size={12} />
        <span className="text-fg-secondary">생활</span>
        <ChevronRight size={12} />
        <span className="text-fg font-medium">날짜 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">날짜 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        두 날짜 사이의 일수를 계산하거나, 특정 날짜로부터 N일 후/전의 날짜를 구합니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 모드 선택 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              계산 모드
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'between' as const, label: '두 날짜 사이 일수' },
                { val: 'add' as const, label: 'N일 후/전 날짜' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => { setMode(val); setResults(null); }}
                  className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                    mode === val
                      ? 'bg-accent text-accent-fg'
                      : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 시작일 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              시작일 *
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
            />
          </div>

          {mode === 'between' ? (
            /* 종료일 */
            <div className="mb-6">
              <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                종료일 *
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              />
            </div>
          ) : (
            <>
              {/* 일수 */}
              <div className="mb-6">
                <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                  일수 *
                </label>
                <input
                  type="number"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
                  placeholder="100"
                />
              </div>

              {/* 방향 */}
              <div className="mb-6">
                <label className="block text-[13px] font-medium text-fg-secondary mb-2">
                  방향
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { val: 'after' as const, label: '이후 (N일 후)' },
                    { val: 'before' as const, label: '이전 (N일 전)' },
                  ].map(({ val, label }) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setDirection(val)}
                      className={`px-4 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                        direction === val
                          ? 'bg-accent text-accent-fg'
                          : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 영업일만 */}
              <div className="mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={businessDaysOnly}
                    onChange={(e) => setBusinessDaysOnly(e.target.checked)}
                    className="w-4 h-4 rounded border-border"
                  />
                  <span className="text-[13px] font-medium text-fg-secondary">영업일(평일)만 계산</span>
                </label>
              </div>
            </>
          )}

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

          {results.mode === 'between' ? (
            <>
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-[13px] text-fg-secondary">총 일수</span>
                <span className="text-[14px] font-medium text-fg tabular-nums">
                  {results.totalDays.toLocaleString('ko-KR')}일
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-[13px] text-fg-secondary">영업일(평일)</span>
                <span className="text-[14px] font-medium text-fg tabular-nums">
                  {results.businessDays.toLocaleString('ko-KR')}일
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-[13px] text-fg-secondary">주수 환산</span>
                <span className="text-[14px] font-medium text-fg tabular-nums">
                  {results.weeks}주 {results.remainingDays}일
                </span>
              </div>

              <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
                <span className="text-[15px] font-semibold text-fg">개월수 환산</span>
                <span className="text-[24px] font-bold text-fg tabular-nums">
                  약 {results.months}개월
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-[13px] text-fg-secondary">실제 경과 일수</span>
                <span className="text-[14px] font-medium text-fg tabular-nums">
                  {results.actualDays.toLocaleString('ko-KR')}일
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-[13px] text-fg-secondary">주수 환산</span>
                <span className="text-[14px] font-medium text-fg tabular-nums">
                  {results.weeks}주 {results.remainingDays}일
                </span>
              </div>

              <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
                <span className="text-[15px] font-semibold text-fg">결과 날짜</span>
                <span className="text-[24px] font-bold text-fg tabular-nums">
                  {results.formattedDate} ({results.dayOfWeek})
                </span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 영업일 계산은 토요일, 일요일을 제외한 평일만 카운트합니다.</li>
          <li>· 공휴일은 반영되지 않으므로 참고용으로 사용해주세요.</li>
          <li>· D-day 계산, 전역일 계산, 출산 예정일 등에 활용할 수 있습니다.</li>
        </ul>
      </div>
    </div>
  );
}
