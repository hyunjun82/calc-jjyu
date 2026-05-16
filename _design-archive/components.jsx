// 와이어프레임 공통 컴포넌트
const { useState } = React;

// 카테고리 약어/뱃지
const CAT_LABELS = {
  "01": "부동산", "02": "세금", "03": "금융", "04": "노동",
  "05": "복지", "06": "자동차", "07": "일상",
};

// 손그림 스타일 카드 (계산기)
function CalcCard({ name, desc, time, cat, dense = false, top, num }) {
  return (
    <div className={`wf-box wf-card ${dense ? 'p-3' : 'p-5'}`} style={{ position: 'relative' }}>
      {top && (
        <div style={{ position: 'absolute', top: dense ? 8 : 14, right: dense ? 10 : 16,
          fontFamily: 'Caveat', fontSize: dense ? 32 : 56, fontWeight: 300, color: 'var(--accent)',
          lineHeight: 1, opacity: 0.85 }}>
          {num}
        </div>
      )}
      {cat && <div className="wf-mono" style={{ fontSize: 11, color: 'var(--ink-faint)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{cat}</div>}
      <div className="wf-h2" style={{ fontSize: dense ? 16 : 19, marginBottom: 4, paddingRight: top ? 60 : 0 }}>{name}</div>
      <div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.45, marginBottom: dense ? 6 : 12, paddingRight: top ? 40 : 0 }}>{desc}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {time && <span className="wf-chip">⌐ {time}</span>}
        <span className="wf-cta" style={{ marginLeft: 'auto' }}>→</span>
      </div>
    </div>
  );
}

function SectionHeader({ id, name, count, note }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 18, borderBottom: '1.5px solid var(--ink)', paddingBottom: 8 }}>
      <span className="wf-mono" style={{ fontSize: 13, color: 'var(--ink-faint)' }}>[{id}]</span>
      <span className="wf-h2" style={{ fontSize: 22 }}>{name}</span>
      <span style={{ fontSize: 13, color: 'var(--ink-faint)' }}>({count}개)</span>
      {note && <span className="wf-note" style={{ marginLeft: 'auto' }}>{note}</span>}
    </div>
  );
}

function Header({ variant, dark }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 28px', borderBottom: '1.5px solid var(--ink)', background: 'var(--paper)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <span className="wf-h1" style={{ fontSize: 26 }}>계산기</span>
        <span className="wf-mono" style={{ fontSize: 11, color: 'var(--ink-faint)' }}>v{variant}</span>
      </div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', fontSize: 13, color: 'var(--ink-soft)' }}>
        <span className="wf-box-soft" style={{ padding: '2px 10px', fontFamily: 'Patrick Hand' }}>
          ⌘ K  검색
        </span>
        <span style={{ fontFamily: 'Patrick Hand' }}>Dark / Light</span>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div style={{ marginTop: 80, padding: '24px 0 8px', borderTop: '1.5px solid var(--ink)',
      display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-faint)', fontFamily: 'Patrick Hand' }}>
      <span>made by · 2026</span>
      <span>data: 국세청 · 고용노동부 · 국민연금공단</span>
      <span>updated 2026.04.30</span>
    </div>
  );
}

// AdSense slot placeholder — 광고는 PRD상 "광고 없음"이지만 사용자가 애드센스 의도 밝힘
// → 절제된 본문 사이 1~2개 슬롯만 (와이어에 위치만 표시)
function AdSlot({ label = "AD SLOT", h = 90, note }) {
  return (
    <div className="wf-hatch-soft wf-box-soft" style={{
      height: h, display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 4, color: 'var(--ink-faint)',
      fontFamily: 'Patrick Hand',
    }}>
      <span style={{ fontSize: 14, letterSpacing: '0.1em' }}>{label}</span>
      {note && <span className="wf-note" style={{ fontSize: 13 }}>{note}</span>}
    </div>
  );
}

Object.assign(window, { CalcCard, SectionHeader, Header, Footer, AdSlot, CAT_LABELS });
