'use client';
import { useState, useMemo } from 'react';
import { computeCalories } from '@/lib/calc';

export function CaloriesForm() {
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState(30);
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(65);
  const [activity, setActivity] = useState(1.55);
  const [goal, setGoal] = useState<'lose' | 'maintain' | 'gain'>('maintain');

  const r = useMemo(() => computeCalories({
    sex, age, heightCm: height, weightKg: weight, activity, goal,
  }), [sex, age, height, weight, activity, goal]);

  return (
    <>
      <div className="stepper">
        <div className="step done"><span className="dot">1</span>신체</div>
        <div className="step done"><span className="dot">2</span>활동</div>
        <div className="step active"><span className="dot">3</span>목표</div>
      </div>

      <div className="field">
        <label>성별</label>
        <div className="seg" role="group">
          <button className={sex === 'male' ? 'on' : ''} onClick={() => setSex('male')}>남성</button>
          <button className={sex === 'female' ? 'on' : ''} onClick={() => setSex('female')}>여성</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
        <div className="field">
          <label>나이</label>
          <div className="input-wrap">
            <input type="text" inputMode="numeric" value={age}
              onChange={(e) => setAge(Math.min(120, Math.max(10, +e.target.value.replace(/[^0-9]/g, '') || 0)))} />
            <span className="suffix">세</span>
          </div>
        </div>
        <div className="field">
          <label>키</label>
          <div className="input-wrap">
            <input type="text" inputMode="numeric" value={height}
              onChange={(e) => setHeight(Math.min(250, Math.max(100, +e.target.value.replace(/[^0-9.]/g, '') || 0)))} />
            <span className="suffix">cm</span>
          </div>
        </div>
        <div className="field">
          <label>체중</label>
          <div className="input-wrap">
            <input type="text" inputMode="numeric" value={weight}
              onChange={(e) => setWeight(Math.min(300, Math.max(20, +e.target.value.replace(/[^0-9.]/g, '') || 0)))} />
            <span className="suffix">kg</span>
          </div>
        </div>
      </div>

      <div className="field">
        <label>활동량</label>
        <div className="seg" role="group">
          <button className={activity === 1.2 ? 'on' : ''} onClick={() => setActivity(1.2)}>거의 없음</button>
          <button className={activity === 1.375 ? 'on' : ''} onClick={() => setActivity(1.375)}>가벼움</button>
          <button className={activity === 1.55 ? 'on' : ''} onClick={() => setActivity(1.55)}>보통</button>
          <button className={activity === 1.725 ? 'on' : ''} onClick={() => setActivity(1.725)}>활발</button>
          <button className={activity === 1.9 ? 'on' : ''} onClick={() => setActivity(1.9)}>매우 활발</button>
        </div>
      </div>

      <div className="field">
        <label>목표</label>
        <div className="seg" role="group">
          <button className={goal === 'lose' ? 'on' : ''} onClick={() => setGoal('lose')}>감량 (-500)</button>
          <button className={goal === 'maintain' ? 'on' : ''} onClick={() => setGoal('maintain')}>유지</button>
          <button className={goal === 'gain' ? 'on' : ''} onClick={() => setGoal('gain')}>증량 (+500)</button>
        </div>
      </div>

      <div className="result-card">
        <div className="lbl">목표 일일 섭취 칼로리</div>
        <div className="big t-num">{r.targetCal.toLocaleString()}<small> kcal</small></div>
        <div className="sub">
          <div>기초대사량 (BMR) <b className="t-num">{r.bmr.toLocaleString()} kcal</b></div>
          <div>활동대사량 (TDEE) <b className="t-num">{r.tdee.toLocaleString()} kcal</b></div>
          {goal !== 'maintain' && <div>주 체중 변화 예측 <b className="t-num">{r.weeklyKg > 0 ? '+' : ''}{r.weeklyKg} kg</b></div>}
        </div>
        <div className="compare-line">
          <span className="compare-pill">Mifflin-St Jeor 공식</span>
          <span className="compare-note">대한비만학회 권장 BMR 공식</span>
        </div>
      </div>

      <details className="breakdown-toggle">
        <summary>권장 영양소 (단백 30% / 탄수 40% / 지방 30%) <span className="chev">▼</span></summary>
        <div className="breakdown">
          <div className="row"><span>단백질</span><span className="v t-num">{r.protein} g</span></div>
          <div className="row"><span>탄수화물</span><span className="v t-num">{r.carbs} g</span></div>
          <div className="row"><span>지방</span><span className="v t-num">{r.fat} g</span></div>
        </div>
      </details>
    </>
  );
}
