'use client';
import { useState, useMemo } from 'react';
import { computeDDay } from '@/lib/calc';

export function DDayForm() {
  const today = new Date().toISOString().slice(0, 10);
  const [target, setTarget] = useState(today);
  const [base, setBase] = useState(today);
  const [mode, setMode] = useState<'until' | 'between'>('until');

  const r = useMemo(() => computeDDay({
    targetDate: target,
    baseDate: mode === 'between' ? base : today,
  }), [target, base, mode, today]);

  return (
    <>
      <div className="stepper">
        <div className="step done"><span className="dot">1</span>모드</div>
        <div className="step done"><span className="dot">2</span>날짜</div>
        <div className="step active"><span className="dot">3</span>결과</div>
      </div>

      <div className="field">
        <label>계산 방식</label>
        <div className="seg" role="group">
          <button className={mode === 'until' ? 'on' : ''} onClick={() => setMode('until')}>오늘 기준</button>
          <button className={mode === 'between' ? 'on' : ''} onClick={() => setMode('between')}>두 날짜 간</button>
        </div>
      </div>

      {mode === 'between' && (
        <div className="field">
          <label>기준 날짜</label>
          <div className="input-wrap">
            <input type="date" value={base} onChange={(e) => setBase(e.target.value)} />
          </div>
        </div>
      )}

      <div className="field">
        <label>{mode === 'until' ? '목표 날짜' : '비교 날짜'}</label>
        <div className="input-wrap">
          <input type="date" value={target} onChange={(e) => setTarget(e.target.value)} />
        </div>
      </div>

      <div className="result-card">
        <div className="lbl">{r.direction === 'future' ? '남은 일수' : r.direction === 'past' ? '지난 일수' : '오늘입니다'}</div>
        <div className="big t-num">{r.label}</div>
        <div className="sub">
          <div>총 <b className="t-num">{r.days.toLocaleString()}일</b></div>
          <div>약 <b className="t-num">{r.weeks}주 {r.weeksRest}일</b></div>
          <div>약 <b className="t-num">{r.months}개월</b> · <b className="t-num">{r.years}년</b></div>
        </div>
        <div className="compare-line">
          <span className="compare-pill">{r.targetWeekday}요일</span>
          <span className="compare-note">윤년·월별 일수 모두 정확 반영</span>
        </div>
      </div>
    </>
  );
}
