'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('');
  const [results, setResults] = useState<any>(null);

  const getZodiacAnimal = (year: number): string => {
    const animals = ['원숭이', '닭', '개', '돼지', '쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양'];
    return animals[year % 12] + '띠';
  };

  const getZodiacSign = (month: number, day: number): string => {
    const signs = [
      { name: '물병자리', end: [2, 18] },
      { name: '물고기자리', end: [3, 20] },
      { name: '양자리', end: [4, 19] },
      { name: '황소자리', end: [5, 20] },
      { name: '쌍둥이자리', end: [6, 21] },
      { name: '게자리', end: [7, 22] },
      { name: '사자자리', end: [8, 22] },
      { name: '처녀자리', end: [9, 22] },
      { name: '천칭자리', end: [10, 23] },
      { name: '전갈자리', end: [11, 22] },
      { name: '사수자리', end: [12, 21] },
      { name: '염소자리', end: [1, 19] },
    ];

    for (let i = 0; i < signs.length; i++) {
      const [endMonth, endDay] = signs[i].end;
      if (month === endMonth && day <= endDay) return signs[i].name;
      if (i > 0) {
        const [prevEndMonth] = signs[i - 1].end;
        if (month === prevEndMonth + 1 && i < signs.length) continue;
      }
    }

    // Simplified zodiac logic
    if ((month === 1 && day <= 19) || (month === 12 && day >= 22)) return '염소자리';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return '물병자리';
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return '물고기자리';
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return '양자리';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return '황소자리';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return '쌍둥이자리';
    if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return '게자리';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return '사자자리';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return '처녀자리';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) return '천칭자리';
    if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) return '전갈자리';
    if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) return '사수자리';
    return '';
  };

  const handleCalculate = () => {
    if (!birthDate) {
      alert('생년월일을 입력해주세요.');
      return;
    }

    const birth = new Date(birthDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 만나이 계산
    let manAge = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      manAge--;
    }

    // 연나이
    const yearAge = today.getFullYear() - birth.getFullYear();

    // 태어난 지 몇일
    const diffTime = today.getTime() - birth.getTime();
    const daysSinceBirth = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // 다음 생일까지 남은 일수
    const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday.getTime() <= today.getTime()) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    // 띠/별자리
    const zodiacAnimal = getZodiacAnimal(birth.getFullYear());
    const zodiacSign = getZodiacSign(birth.getMonth() + 1, birth.getDate());

    setResults({
      manAge,
      yearAge,
      daysSinceBirth,
      daysUntilBirthday,
      zodiacAnimal,
      zodiacSign,
    });
  };

  return (
    <div className="mx-auto max-w-[1200px] px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-fg-muted mb-8">
        <Link href="/" className="hover:text-fg transition-colors">홈</Link>
        <ChevronRight size={12} />
        <span className="text-fg-secondary">생활</span>
        <ChevronRight size={12} />
        <span className="text-fg font-medium">만나이 계산기</span>
      </nav>

      {/* Title */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-4">만나이 계산기</h1>

      {/* Description */}
      <p className="text-[15px] text-fg-secondary mb-8">
        생년월일을 입력하면 만나이, 연나이, 태어난 일수, 띠와 별자리를 알려드립니다.
      </p>

      {/* Form */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* 생년월일 */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-fg-secondary mb-2">
              생년월일 *
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
            />
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
            <span className="text-[13px] text-fg-secondary">만나이</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.manAge}세
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">연나이</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.yearAge}세
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">태어난 지</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.daysSinceBirth.toLocaleString('ko-KR')}일
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">다음 생일까지</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.daysUntilBirthday}일
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-[13px] text-fg-secondary">띠</span>
            <span className="text-[14px] font-medium text-fg tabular-nums">
              {results.zodiacAnimal}
            </span>
          </div>

          <div className="flex justify-between items-center py-4 bg-bg-secondary rounded-xl px-4 mt-2">
            <span className="text-[15px] font-semibold text-fg">별자리</span>
            <span className="text-[24px] font-bold text-fg tabular-nums">
              {results.zodiacSign}
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="border border-border rounded-xl bg-bg-secondary p-5 mt-8">
        <h3 className="text-[14px] font-semibold text-fg mb-3">계산 팁</h3>
        <ul className="space-y-1.5 text-[13px] text-fg-secondary leading-relaxed">
          <li>· 만나이는 생일이 지나야 한 살이 추가됩니다.</li>
          <li>· 2023년 6월부터 한국나이(세는나이)가 공식적으로 폐지되어 만나이가 법적 기준입니다.</li>
          <li>· 연나이는 현재연도에서 출생연도를 뺀 값입니다.</li>
          <li>· 띠는 출생연도 기준, 별자리는 생일 기준으로 결정됩니다.</li>
        </ul>
      </div>
    </div>
  );
}
