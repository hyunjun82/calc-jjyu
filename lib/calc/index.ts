// ============================================================
// 계산 로직 모듈 — 각 계산기마다 순수 함수로 분리
// 모든 입력은 합리적 단위(만원/년/명/%)로 받고 결과는 정밀하게 반환
// ============================================================

// 0) 연봉 실수령액 (4대보험 + 간이세액표 기반 근사)
export function computeSalary({ annualMan = 5000, dependents = 1, children = 0 }) {
  const annualGross = annualMan * 10000;
  const monthlyGross = Math.round(annualGross / 12);

  // 4대보험
  const npBase = Math.min(6_170_000, Math.max(390_000, monthlyGross));
  const np = Math.round(npBase * 0.045);          // 국민연금 4.5%
  const hi = Math.round(monthlyGross * 0.03545);  // 건강보험 3.545%
  const ltc = Math.round(hi * 0.1295);            // 장기요양 (건보×12.95%)
  const ei = Math.round(monthlyGross * 0.009);    // 고용보험 0.9%
  const insurance = np + hi + ltc + ei;

  // 근로소득공제
  let earnDed = 0;
  if (annualGross <= 5_000_000) earnDed = annualGross * 0.7;
  else if (annualGross <= 15_000_000) earnDed = 3_500_000 + (annualGross - 5_000_000) * 0.4;
  else if (annualGross <= 45_000_000) earnDed = 7_500_000 + (annualGross - 15_000_000) * 0.15;
  else if (annualGross <= 100_000_000) earnDed = 12_000_000 + (annualGross - 45_000_000) * 0.05;
  else earnDed = 14_750_000 + (annualGross - 100_000_000) * 0.02;
  earnDed = Math.min(earnDed, 20_000_000);

  // 인적공제 + 보험료 소득공제
  const personalDed = 1_500_000 * (1 + dependents);
  const annualInsurance = insurance * 12;
  const taxBase = Math.max(0, annualGross - earnDed - personalDed - annualInsurance);

  // 누진세율 (소득세)
  const brackets: Array<[number, number, number]> = [
    [14_000_000, 0.06, 0],
    [50_000_000, 0.15, 1_260_000],
    [88_000_000, 0.24, 5_760_000],
    [150_000_000, 0.35, 15_440_000],
    [300_000_000, 0.38, 19_940_000],
    [500_000_000, 0.40, 25_940_000],
    [1_000_000_000, 0.42, 35_940_000],
    [Infinity, 0.45, 65_940_000],
  ];
  let annualTax = 0;
  for (const [limit, rate, deduct] of brackets) {
    if (taxBase <= limit) { annualTax = taxBase * rate - deduct; break; }
  }

  // 근로소득세액공제 (간이) + 자녀세액공제
  const earnedTaxCredit = Math.min(740_000, Math.max(0, annualTax) * 0.55);
  let childCredit = 0;
  if (children >= 1) childCredit += 250_000;
  if (children >= 2) childCredit += 300_000;
  if (children >= 3) childCredit += 400_000 * (children - 2);
  annualTax = Math.max(0, annualTax - earnedTaxCredit - childCredit);

  const income_tax = Math.round(annualTax / 12);
  const local_tax = Math.round(income_tax * 0.1);
  const total_tax = income_tax + local_tax;
  const total_deduct = insurance + total_tax;
  const netMonth = monthlyGross - total_deduct;
  const netYear = netMonth * 12;

  return {
    monthlyGross,
    netMonth,
    netYear,
    breakdown: { np, hi, ltc, ei, insurance, income_tax, local_tax, total_tax, total_deduct },
  };
}

// 1) 퇴직금
// 법정 퇴직금 = 1일 평균임금 × 30 × (재직일수 / 365)
// 1일 평균임금 = 최근 3개월 임금총액 / 3개월 일수 (단순화: 월급 기준)
export function computeSeverance({ avgMonthlyMan = 350, yearsServed = 5, monthsServed = 0 }) {
  const avgDaily = (avgMonthlyMan * 10000 * 3) / 90; // 단순: 월급 3개월 / 90일
  const days = Math.round(yearsServed * 365 + monthsServed * 30);
  const severance = avgDaily * 30 * (days / 365);
  // 퇴직소득세 (간이) — 퇴직금 × 0.5% (실제는 복잡, 표시용)
  const tax = severance * 0.05;
  const net = severance - tax;
  return {
    severance: Math.round(severance),
    days,
    avgDaily: Math.round(avgDaily),
    tax: Math.round(tax),
    net: Math.round(net),
  };
}

// 2) 주담대 한도 (LTV/DTI/DSR)
// 한도 = min(주택가 × LTV, 연소득 × (DSR/12) / 월상환액팩터)
// 월상환액팩터 = 원리금균등 환산 (현재가치 식)
export function computeMortgage({ housePriceMan = 50000, annualIncomeMan = 6000, ltv = 70, dsr = 40, rate = 4.5, years = 30 }) {
  const housePrice = housePriceMan * 10000;
  const annualIncome = annualIncomeMan * 10000;
  const monthlyIncome = annualIncome / 12;

  const limitLtv = housePrice * (ltv / 100);

  // DSR 기준 한도
  // 월 상환 가능액 = 월소득 × DSR%
  const monthlyMax = monthlyIncome * (dsr / 100);
  const r = rate / 100 / 12;
  const n = years * 12;
  // PV = PMT × [(1 - (1+r)^-n) / r]
  const limitDsr = monthlyMax * (1 - Math.pow(1 + r, -n)) / r;

  const finalLimit = Math.min(limitLtv, limitDsr);
  const monthlyPayment = finalLimit * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalInterest = monthlyPayment * n - finalLimit;

  return {
    finalLimit: Math.round(finalLimit),
    limitLtv: Math.round(limitLtv),
    limitDsr: Math.round(limitDsr),
    bottleneck: limitLtv < limitDsr ? 'LTV' : 'DSR',
    monthlyPayment: Math.round(monthlyPayment),
    totalInterest: Math.round(totalInterest),
    incomeRatio: ((monthlyPayment / monthlyIncome) * 100),
  };
}

// 3) 종합소득세 (사업소득 + 근로소득 합산, 간이)
export function computeIncomeTax({ businessIncomeMan = 3000, employmentIncomeMan = 0, deductionsMan = 300 }) {
  const business = businessIncomeMan * 10000;
  const employment = employmentIncomeMan * 10000;
  const deductions = deductionsMan * 10000;

  // 근로소득공제
  let ec = 0;
  if (employment > 0) {
    if (employment <= 5_000_000) ec = employment * 0.7;
    else if (employment <= 15_000_000) ec = 3_500_000 + (employment - 5_000_000) * 0.4;
    else if (employment <= 45_000_000) ec = 7_500_000 + (employment - 15_000_000) * 0.15;
    else if (employment <= 100_000_000) ec = 12_000_000 + (employment - 45_000_000) * 0.05;
    else ec = 14_750_000 + (employment - 100_000_000) * 0.02;
    ec = Math.min(ec, 20_000_000);
  }

  // 종합소득금액
  const totalIncome = business + (employment - ec);
  // 종합소득공제 (본인 + 사용자입력 추가공제)
  const personalDeduction = 1_500_000;
  const taxBase = Math.max(0, totalIncome - personalDeduction - deductions);

  // 누진세율 (2026 기준)
  const brackets = [
    [14_000_000, 0.06, 0],
    [50_000_000, 0.15, 1_260_000],
    [88_000_000, 0.24, 5_760_000],
    [150_000_000, 0.35, 15_440_000],
    [300_000_000, 0.38, 19_940_000],
    [500_000_000, 0.40, 25_940_000],
    [1_000_000_000, 0.42, 35_940_000],
    [Infinity, 0.45, 65_940_000],
  ];
  let tax = 0;
  let appliedRate = 0;
  for (const [limit, rate, deduct] of brackets) {
    if (taxBase <= limit) { tax = taxBase * rate - deduct; appliedRate = rate; break; }
  }
  tax = Math.max(0, tax);
  const localTax = tax * 0.1;
  const totalTax = tax + localTax;

  return {
    totalIncome: Math.round(totalIncome),
    taxBase: Math.round(taxBase),
    tax: Math.round(tax),
    localTax: Math.round(localTax),
    totalTax: Math.round(totalTax),
    appliedRate,
    effectiveRate: totalIncome > 0 ? (totalTax / totalIncome) * 100 : 0,
  };
}

// 4) 실업급여
export function computeUnemployment({ avgDailyWageMan = 12, ageGroup = '50미만', insuredYears = 3 }: {
  avgDailyWageMan?: number;
  ageGroup?: '50미만' | '50이상';
  insuredYears?: number;
}) {
  const avgDaily = avgDailyWageMan * 10000;
  const dailyBenefit = Math.min(66_000, Math.max(64_192, avgDaily * 0.6));
  const table: Record<'50미만' | '50이상', number[]> = {
    '50미만': [120, 150, 180, 210, 240],
    '50이상': [120, 180, 210, 240, 270],
  };
  let idx = 0;
  if (insuredYears >= 10) idx = 4;
  else if (insuredYears >= 5) idx = 3;
  else if (insuredYears >= 3) idx = 2;
  else if (insuredYears >= 1) idx = 1;
  const days = table[ageGroup][idx];
  const total = dailyBenefit * days;
  const monthly = dailyBenefit * 30;
  return {
    dailyBenefit: Math.round(dailyBenefit),
    days, monthly: Math.round(monthly),
    total: Math.round(total),
    isMax: dailyBenefit >= 66_000,
    isMin: dailyBenefit <= 64_192,
  };
}

// 5) 양도소득세 (1세대 1주택 / 다주택, 보유기간별 장기보유특별공제)
export function computeCapitalGains({
  acquirePriceMan = 50000,    // 취득가액 (만원)
  salePriceMan = 80000,        // 양도가액 (만원)
  expensesMan = 1500,          // 필요경비 (취득세, 중개수수료 등)
  yearsHeld = 5,               // 보유기간
  yearsLived = 5,              // 거주기간 (1주택 비과세 판정용)
  houseStatus = 'one_under12', // one_under12 / one_over12 / multi
}) {
  const acquire = acquirePriceMan * 10000;
  const sale = salePriceMan * 10000;
  const expenses = expensesMan * 10000;

  // 양도차익
  const gain = Math.max(0, sale - acquire - expenses);

  // 1주택 12억 이하 비과세 (2년 이상 보유 + 일부 거주요건)
  if (houseStatus === 'one_under12' && yearsHeld >= 2 && sale <= 1_200_000_000) {
    return {
      gain: Math.round(gain),
      taxableBase: 0,
      ltcd: 0,
      ltcdRate: 0,
      afterLtcd: 0,
      taxableGain: 0,
      tax: 0,
      localTax: 0,
      totalTax: 0,
      netGain: Math.round(gain),
      appliedRate: 0,
      status: 'nontax' as const,
      message: '1세대 1주택 비과세 (12억 이하 + 2년 이상 보유)',
    };
  }

  // 1주택 12억 초과 → 12억 초과분만 과세
  let taxableBase = gain;
  if (houseStatus === 'one_over12') {
    const ratio = (sale - 1_200_000_000) / sale;
    taxableBase = gain * Math.max(0, ratio);
  }

  // 장기보유특별공제 (LTCD)
  let ltcdRate = 0;
  if (houseStatus === 'one_over12') {
    // 1주택: 보유×4% + 거주×4%, 각 최대 40%
    const holdRate = Math.min(0.40, Math.max(0, yearsHeld - 2) * 0.04 + (yearsHeld >= 3 ? 0.12 : 0));
    const liveRate = Math.min(0.40, Math.max(0, yearsLived - 2) * 0.04 + (yearsLived >= 3 ? 0.12 : 0));
    // 단순화: 표 기반 근사
    const lookup = [0, 0, 0, 0.24, 0.32, 0.40, 0.48, 0.56, 0.64, 0.72, 0.80];
    const idx = Math.min(10, Math.max(0, Math.min(yearsHeld, yearsLived)));
    ltcdRate = lookup[idx] || 0.80;
  } else if (houseStatus === 'multi') {
    // 다주택: 일반 LTCD (2%/년, 최대 30%)
    if (yearsHeld >= 3) {
      ltcdRate = Math.min(0.30, (yearsHeld - 2) * 0.02 + 0.04);
    }
  }

  const ltcd = taxableBase * ltcdRate;
  const afterLtcd = Math.max(0, taxableBase - ltcd);
  const basicDeduction = 2_500_000; // 양도소득 기본공제
  const taxableGain = Math.max(0, afterLtcd - basicDeduction);

  // 양도세율 (보유기간·주택수별)
  let appliedRate = 0;
  let progressiveTax = 0;

  // 기본 누진세율 (일반)
  const brackets = [
    [14_000_000, 0.06, 0],
    [50_000_000, 0.15, 1_260_000],
    [88_000_000, 0.24, 5_760_000],
    [150_000_000, 0.35, 15_440_000],
    [300_000_000, 0.38, 19_940_000],
    [500_000_000, 0.40, 25_940_000],
    [1_000_000_000, 0.42, 35_940_000],
    [Infinity, 0.45, 65_940_000],
  ];

  if (houseStatus === 'multi' && yearsHeld < 2) {
    // 단기양도 중과: 1년 미만 70%, 1~2년 60%
    appliedRate = yearsHeld < 1 ? 0.70 : 0.60;
    progressiveTax = taxableGain * appliedRate;
  } else {
    // 누진세율
    for (const [limit, rate, deduct] of brackets) {
      if (taxableGain <= limit) {
        progressiveTax = taxableGain * rate - deduct;
        appliedRate = rate;
        break;
      }
    }
  }

  const tax = Math.max(0, progressiveTax);
  const localTax = tax * 0.1;
  const totalTax = tax + localTax;
  const netGain = gain - totalTax;

  return {
    gain: Math.round(gain),
    taxableBase: Math.round(taxableBase),
    ltcd: Math.round(ltcd),
    ltcdRate,
    afterLtcd: Math.round(afterLtcd),
    taxableGain: Math.round(taxableGain),
    tax: Math.round(tax),
    localTax: Math.round(localTax),
    totalTax: Math.round(totalTax),
    netGain: Math.round(netGain),
    appliedRate,
    status: 'tax' as const,
    message: houseStatus === 'one_under12'
      ? '1세대 1주택 (12억 이하 비과세 요건 미충족 — 보유 2년 미만)'
      : houseStatus === 'one_over12'
        ? '1세대 1주택 (12억 초과분만 과세 + 장기보유특별공제)'
        : '다주택 (장기보유특별공제 일반 2%/년)',
  };
}

// ============================================================
// 일상 (BMI, 디데이, 임신주수, 칼로리, 단위변환)
// ============================================================

// 7) BMI (대한비만학회/WHO 아시아-태평양 기준)
export function computeBMI({ heightCm = 170, weightKg = 65 }) {
  const m = heightCm / 100;
  const bmi = weightKg / (m * m);
  let category: string;
  let color: string;
  if (bmi < 18.5) { category = '저체중'; color = '#5B83C2'; }
  else if (bmi < 23) { category = '정상'; color = '#6B8E50'; }
  else if (bmi < 25) { category = '과체중'; color = '#B5803C'; }
  else if (bmi < 30) { category = '비만 1단계'; color = '#C2553C'; }
  else if (bmi < 35) { category = '비만 2단계'; color = '#A0331E'; }
  else { category = '비만 3단계 (고도)'; color = '#7A1810'; }
  const normalMin = 18.5 * m * m;
  const normalMax = 22.9 * m * m;
  const idealMid = (normalMin + normalMax) / 2;
  return {
    bmi: Math.round(bmi * 10) / 10,
    category, color,
    normalMin: Math.round(normalMin * 10) / 10,
    normalMax: Math.round(normalMax * 10) / 10,
    diff: Math.round((weightKg - idealMid) * 10) / 10,
  };
}

// 8) 디데이 / 디플러스 (밀리초 단위 정확 계산)
export function computeDDay({ targetDate, baseDate }: { targetDate: string; baseDate?: string }) {
  const base = baseDate ? new Date(baseDate + 'T00:00:00') : new Date(new Date().toISOString().slice(0, 10) + 'T00:00:00');
  const target = new Date(targetDate + 'T00:00:00');
  const diffMs = target.getTime() - base.getTime();
  const days = Math.round(diffMs / 86400000);
  const abs = Math.abs(days);
  return {
    days: abs,
    direction: days > 0 ? 'future' : days < 0 ? 'past' : 'today',
    label: days === 0 ? 'D-DAY' : days > 0 ? `D-${abs}` : `D+${abs}`,
    weeks: Math.floor(abs / 7),
    weeksRest: abs % 7,
    months: Math.floor(abs / 30),
    years: Math.floor(abs / 365),
    targetWeekday: ['일', '월', '화', '수', '목', '금', '토'][target.getDay()],
  };
}

// 9) 임신 주수 (Naegele's rule: LMP + 280일 = 출산예정일)
export function computePregnancy({ lmpDate }: { lmpDate: string }) {
  const lmp = new Date(lmpDate + 'T00:00:00');
  const today = new Date(new Date().toISOString().slice(0, 10) + 'T00:00:00');
  const totalDays = Math.floor((today.getTime() - lmp.getTime()) / 86400000);
  const weeks = Math.floor(totalDays / 7);
  const days = totalDays % 7;
  const due = new Date(lmp.getTime() + 280 * 86400000);
  const daysToDue = Math.floor((due.getTime() - today.getTime()) / 86400000);
  let trimester: string;
  if (weeks < 13) trimester = '1삼분기 (초기)';
  else if (weeks < 27) trimester = '2삼분기 (중기)';
  else trimester = '3삼분기 (후기)';
  return {
    weeks, days, totalDays,
    label: `${weeks}주 ${days}일`,
    trimester,
    dueDate: due.toISOString().slice(0, 10),
    dueDateKr: `${due.getFullYear()}년 ${due.getMonth() + 1}월 ${due.getDate()}일`,
    daysToDue,
    progress: Math.max(0, Math.min(100, (totalDays / 280) * 100)),
  };
}

// 10) 칼로리 (Mifflin-St Jeor BMR + TDEE — 대한비만학회 권장)
export function computeCalories({
  sex = 'male', age = 30, heightCm = 170, weightKg = 65,
  activity = 1.55, goal = 'maintain',
}: {
  sex?: 'male' | 'female';
  age?: number;
  heightCm?: number;
  weightKg?: number;
  activity?: number;
  goal?: 'lose' | 'maintain' | 'gain';
}) {
  const bmr = sex === 'male'
    ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
    : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  const tdee = bmr * activity;
  const targetCal = goal === 'lose' ? tdee - 500 : goal === 'gain' ? tdee + 500 : tdee;
  // 단백질 30% / 탄수화물 40% / 지방 30% (단백질·탄수 4kcal/g, 지방 9kcal/g)
  const protein = Math.round((targetCal * 0.3) / 4);
  const carbs = Math.round((targetCal * 0.4) / 4);
  const fat = Math.round((targetCal * 0.3) / 9);
  // 체중 변화 예측 (1kg = 7700kcal)
  const weeklyKg = goal === 'maintain' ? 0 : (goal === 'lose' ? -500 : 500) * 7 / 7700;
  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetCal: Math.round(targetCal),
    protein, carbs, fat,
    weeklyKg: Math.round(weeklyKg * 100) / 100,
  };
}

// 11) 단위 변환 (SI 표준 + 한국 전통 단위)
const UNIT_DEFS: Record<string, Record<string, number>> = {
  length: {
    'mm': 0.001, 'cm': 0.01, 'm': 1, 'km': 1000,
    'inch': 0.0254, 'ft': 0.3048, 'yd': 0.9144, 'mi': 1609.344,
    '척': 0.30303, '리': 392.727,
  },
  weight: {
    'mg': 0.000001, 'g': 0.001, 'kg': 1, 't': 1000,
    'oz': 0.028349523125, 'lb': 0.45359237,
    '근': 0.6, '돈': 0.00375, '냥': 0.0375, '관': 3.75,
  },
  area: {
    'cm²': 0.0001, 'm²': 1, 'km²': 1000000, 'ha': 10000,
    '평': 3.3057851239, '에이커': 4046.8564224,
  },
  volume: {
    'mL': 0.001, 'L': 1, 'm³': 1000,
    '되': 1.8039, '말': 18.039, '홉': 0.18039,
    'gal_us': 3.785411784, 'fl_oz': 0.0295735296,
  },
};

export function convertUnit({
  category, from, to, value = 1,
}: { category: string; from: string; to: string; value?: number }) {
  if (category === 'temperature') {
    let c = value;
    if (from === '°F') c = (value - 32) * 5 / 9;
    else if (from === 'K') c = value - 273.15;
    let out = c;
    if (to === '°F') out = c * 9 / 5 + 32;
    else if (to === 'K') out = c + 273.15;
    return { result: Math.round(out * 1000) / 1000 };
  }
  const defs = UNIT_DEFS[category];
  if (!defs || !(from in defs) || !(to in defs)) return { result: 0 };
  const baseValue = value * defs[from];
  const out = baseValue / defs[to];
  return { result: Math.round(out * 1000000) / 1000000 };
}

export const UNIT_CATEGORIES = {
  length: ['mm', 'cm', 'm', 'km', 'inch', 'ft', 'yd', 'mi', '척', '리'],
  weight: ['mg', 'g', 'kg', 't', 'oz', 'lb', '근', '돈', '냥', '관'],
  area: ['cm²', 'm²', 'km²', 'ha', '평', '에이커'],
  volume: ['mL', 'L', 'm³', '되', '말', '홉', 'gal_us', 'fl_oz'],
  temperature: ['°C', '°F', 'K'],
};

// ============================================================
// 금융 (신용대출, 전세자금대출, DSR, 예적금이자, 복리)
// ============================================================

// 12) 신용대출 (원리금균등 상환)
export function computeCreditLoan({
  principalMan = 3000, rate = 6.5, years = 5,
}) {
  const principal = principalMan * 10000;
  const r = rate / 100 / 12;
  const n = years * 12;
  const monthly = r === 0 ? principal / n
    : principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = monthly * n;
  const totalInterest = totalPayment - principal;
  return {
    monthly: Math.round(monthly),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
    principal,
    interestRatio: (totalInterest / principal) * 100,
  };
}

// 13) 전세자금대출 (정부 상품 한도 반영)
// 버팀목 (만 19~34세, 연소득 5천만↓): 최대 1.2억 / 1.2~2.7%
// 신혼부부 전용 (혼인 7년 이내): 최대 2.5억 / 1.2~2.7%
// 일반 시중: 전세금의 80%
export function computeJeonseLoan({
  jeonseMan = 20000, rate = 3.5,
  loanType = 'general' as 'general' | 'butimmok' | 'shinhon',
}) {
  const jeonse = jeonseMan * 10000;
  let maxLimit: number;
  if (loanType === 'butimmok') maxLimit = 120_000_000;
  else if (loanType === 'shinhon') maxLimit = 250_000_000;
  else maxLimit = jeonse * 0.8;
  const loan = Math.min(maxLimit, jeonse * 0.8);
  const monthlyInterest = loan * rate / 100 / 12;
  return {
    loan: Math.round(loan),
    maxLimit: Math.round(maxLimit),
    monthlyInterest: Math.round(monthlyInterest),
    annualInterest: Math.round(monthlyInterest * 12),
    ltv: jeonse > 0 ? Math.round((loan / jeonse) * 1000) / 10 : 0,
  };
}

// 14) DSR (Debt Service Ratio — 금융위 기준 40%)
export function computeDSR({
  annualIncomeMan = 5000,
  existingMonthlyMan = 50,
  newPrincipalMan = 10000, newRate = 4.5, newYears = 30,
}) {
  const annualIncome = annualIncomeMan * 10000;
  const monthlyIncome = annualIncome / 12;
  const existingMonthly = existingMonthlyMan * 10000;
  const newPrincipal = newPrincipalMan * 10000;
  const r = newRate / 100 / 12;
  const n = newYears * 12;
  const newMonthly = r === 0 ? newPrincipal / n
    : newPrincipal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalMonthly = existingMonthly + newMonthly;
  const dsr = (totalMonthly * 12) / annualIncome * 100;
  const limit = 40;
  const allowedAnnualDebt = annualIncome * limit / 100;
  const remainingAnnual = allowedAnnualDebt - existingMonthly * 12;
  return {
    monthlyIncome: Math.round(monthlyIncome),
    newMonthly: Math.round(newMonthly),
    totalMonthly: Math.round(totalMonthly),
    dsr: Math.round(dsr * 10) / 10,
    passed: dsr <= limit,
    overBy: dsr > limit ? Math.round((dsr - limit) * 10) / 10 : 0,
    remainingMonthly: Math.round(Math.max(0, remainingAnnual / 12)),
  };
}

// 15) 예·적금 이자 (세후, 이자소득세 15.4%)
export function computeDeposit({
  principalMan = 1000, rate = 3.5, months = 12,
  type = 'deposit' as 'deposit' | 'saving',
  compound = 'monthly' as 'monthly' | 'simple',
  tax = 'normal' as 'normal' | 'tax_free',
}) {
  const principal = principalMan * 10000;
  const taxRate = tax === 'normal' ? 0.154 : 0;
  let totalPrincipal: number;
  let interest: number;

  if (type === 'deposit') {
    totalPrincipal = principal;
    if (compound === 'monthly') {
      const mr = rate / 100 / 12;
      interest = principal * Math.pow(1 + mr, months) - principal;
    } else {
      interest = principal * (rate / 100) * (months / 12);
    }
  } else {
    // 적금: 월납입액 = principal
    totalPrincipal = principal * months;
    if (compound === 'monthly') {
      const mr = rate / 100 / 12;
      let total = 0;
      for (let i = 1; i <= months; i++) {
        total += principal * Math.pow(1 + mr, months - i + 1);
      }
      interest = total - totalPrincipal;
    } else {
      // 적금 단리 (한국 표준): 월별 예치기간 합 × 월이율
      interest = principal * (rate / 100 / 12) * (months * (months + 1) / 2);
    }
  }

  const taxAmount = interest * taxRate;
  const afterTax = interest - taxAmount;
  return {
    totalPrincipal: Math.round(totalPrincipal),
    interest: Math.round(interest),
    tax: Math.round(taxAmount),
    afterTax: Math.round(afterTax),
    totalReceived: Math.round(totalPrincipal + afterTax),
    effectiveRate: totalPrincipal > 0 ? (afterTax / totalPrincipal) * 100 : 0,
  };
}

// 16) 복리 시뮬레이션 (초기금 + 월적립)
export function computeCompound({
  principalMan = 1000, monthlyMan = 50, rate = 7, years = 10,
}) {
  const principal = principalMan * 10000;
  const monthly = monthlyMan * 10000;
  const mr = rate / 100 / 12;
  const n = years * 12;

  const principalGrowth = mr === 0 ? principal : principal * Math.pow(1 + mr, n);
  const monthlyGrowth = monthly === 0 ? 0
    : mr === 0 ? monthly * n
    : monthly * ((Math.pow(1 + mr, n) - 1) / mr);

  const total = principalGrowth + monthlyGrowth;
  const totalInvested = principal + monthly * n;
  const totalGain = total - totalInvested;

  const yearly: Array<{ year: number; total: number; invested: number }> = [];
  for (let y = 1; y <= years; y++) {
    const m = y * 12;
    const pg = mr === 0 ? principal : principal * Math.pow(1 + mr, m);
    const mg = monthly === 0 ? 0 : mr === 0 ? monthly * m
      : monthly * ((Math.pow(1 + mr, m) - 1) / mr);
    yearly.push({ year: y, total: Math.round(pg + mg), invested: principal + monthly * m });
  }

  return {
    total: Math.round(total),
    totalInvested: Math.round(totalInvested),
    totalGain: Math.round(totalGain),
    gainRatio: totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0,
    yearly,
  };
}

