'use client';
import { useState, useMemo } from 'react';
import { fmtKRW } from '@/lib/format';
import { computeFine } from '@/lib/calc';

const VIOLATIONS = [
  { key: 'signal', label: '신호위반' },
  { key: 'speed20', label: '속도 20km↓' },
  { key: 'speed40', label: '속도 20~40km' },
  { key: 'speed60', label: '속도 40~60km' },
  { key: 'speed60plus', label: '속도 60km↑' },
  { key: 'parking', label: '주차위반' },
  { key: 'seatbelt', label: '안전벨트 미착용' },
  { key: 'phone', label: '운전 중 휴대전화' },
  { key: 'dui', label: '음주운전' },
] as const;

export function FineForm() {
  const [violation, setViolation] = useState<typeof VIOLATIONS[number]['key']>('signal');
  const [vehicle, setVehicle] = useState<'car' | 'bike' | 'truck'>('car');
  const [zone, setZone] = useState(false);

  const r = useMemo(() => computeFine({
    violation, vehicleType: vehicle, childZone: zone,
  }), [violation, vehicle, zone]);

  return (
    <>
      <div className="stepper">
        <div className="step done"><span className="dot">1</span>위반 항목</div>
        <div className="step done"><span className="dot">2</span>차량·구역</div>
        <div className="step active"><span className="dot">3</span>과태료</div>
      </div>

      <div className="field">
        <label>위반 항목</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {VIOLATIONS.map(v => (
            <button key={v.key}
              className={`preset-chip ${violation === v.key ? 'on' : ''}`}
              onClick={() => setViolation(v.key)}
              style={{ textAlign: 'center', padding: '10px 6px' }}>
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="field">
          <label>차량 종류</label>
          <div className="seg" role="group">
            <button className={vehicle === 'car' ? 'on' : ''} onClick={() => setVehicle('car')}>승용차</button>
            <button className={vehicle === 'truck' ? 'on' : ''} onClick={() => setVehicle('truck')}>승합·화물</button>
            <button className={vehicle === 'bike' ? 'on' : ''} onClick={() => setVehicle('bike')}>이륜차</button>
          </div>
        </div>
        <div className="field">
          <label>장소</label>
          <div className="seg" role="group">
            <button className={!zone ? 'on' : ''} onClick={() => setZone(false)}>일반도로</button>
            <button className={zone ? 'on' : ''} onClick={() => setZone(true)}>보호구역 (2배)</button>
          </div>
        </div>
      </div>

      <div className="result-card">
        <div className="lbl">과태료 (벌점 {r.points}점)</div>
        <div className="big t-num" style={{ color: r.fine >= 100_000 ? '#C2553C' : 'var(--ink)' }}>
          {fmtKRW(r.fine)}<small>원</small>
        </div>
        <div className="sub">
          <div>벌점 <b className="t-num">{r.points}점</b></div>
          {zone && <div>가산 <b className="t-num">×2배</b></div>}
        </div>
        <div className="compare-line">
          <span className="compare-pill down">{VIOLATIONS.find(v => v.key === violation)?.label}</span>
          <span className="compare-note">{r.note}</span>
        </div>
      </div>
    </>
  );
}
