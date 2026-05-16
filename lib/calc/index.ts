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

// ============================================================
// 노동 (연차수당, 주휴수당, 야간·연장수당, 통상임금)
// 근로기준법 + 대법원 판례 (전합 2013다89399) 기반
// ============================================================

// 17) 연차수당 (근로기준법 60조, 미사용 연차에 대한 수당)
// 발생: 1년 만근 15일, 3년차부터 매 2년마다 +1일, 최대 25일
export function computeAnnualLeave({
  monthlyWageMan = 300,
  weeklyHours = 40,
  unusedDays = 5,
  yearsServed = 3,
}) {
  let earnedDays: number;
  if (yearsServed < 1) {
    // 1년 미만은 월 1일씩 (최대 11일)
    earnedDays = Math.min(11, Math.floor(yearsServed * 12));
  } else {
    earnedDays = Math.min(25, 15 + Math.floor((yearsServed - 1) / 2));
  }
  // 월 소정근로시간 = (주 + 주휴) × 4.345주
  // 주 40시간 → 209시간 표준
  const weeklyTotal = weeklyHours + Math.min(8, (weeklyHours / 40) * 8);
  const monthlyHours = weeklyTotal * 4.345;
  const hourly = (monthlyWageMan * 10000) / monthlyHours;
  const dailyWage = hourly * 8;
  const annualLeavePay = dailyWage * unusedDays;
  return {
    earnedDays, unusedDays,
    hourly: Math.round(hourly),
    dailyWage: Math.round(dailyWage),
    annualLeavePay: Math.round(annualLeavePay),
    monthlyHours: Math.round(monthlyHours),
  };
}

// 18) 주휴수당 (근로기준법 55조 + 시행령 30조)
// 주 15시간 이상 + 1주 소정근로일 만근 시 1주일에 1일분 유급휴일
export function computeWeeklyHoliday({
  hourlyWage = 10030,  // 2026 최저시급 10,030원
  weeklyHours = 40,
}) {
  if (weeklyHours < 15) {
    return {
      eligible: false,
      hourlyWage, weeklyHours,
      holidayHours: 0, weeklyHoliday: 0, monthlyHoliday: 0,
      message: '주 15시간 미만 — 주휴수당 대상 아님',
    };
  }
  // 주휴시간 = 주 소정근로시간 / 40 × 8 (단, 최대 8시간)
  const holidayHours = Math.min(8, (weeklyHours / 40) * 8);
  const weekly = holidayHours * hourlyWage;
  const monthly = weekly * 4.345;
  return {
    eligible: true,
    hourlyWage, weeklyHours,
    holidayHours: Math.round(holidayHours * 10) / 10,
    weeklyHoliday: Math.round(weekly),
    monthlyHoliday: Math.round(monthly),
    message: `주 ${weeklyHours}시간 → 주 ${holidayHours.toFixed(1)}시간분 주휴수당`,
  };
}

// 19) 야간·연장·휴일수당 (근로기준법 56조)
// 연장: 1.5배 / 야간(22-06): +0.5배 가산 / 휴일 8시간 이내: 1.5배 / 휴일 8시간 초과: 2배
export function computeOvertime({
  hourlyWage = 12000,
  overtimeHours = 0,
  nightHours = 0,
  holidayHours = 0,
  holidayExtraHours = 0,
}) {
  const overtimePay = overtimeHours * hourlyWage * 1.5;
  const nightPay = nightHours * hourlyWage * 0.5;
  const holidayPay = holidayHours * hourlyWage * 1.5;
  const holidayExtraPay = holidayExtraHours * hourlyWage * 2.0;
  const total = overtimePay + nightPay + holidayPay + holidayExtraPay;
  return {
    overtimePay: Math.round(overtimePay),
    nightPay: Math.round(nightPay),
    holidayPay: Math.round(holidayPay),
    holidayExtraPay: Math.round(holidayExtraPay),
    total: Math.round(total),
  };
}

// ============================================================
// 세금·복지 (부가세, 4대보험, 연말정산, 기초연금, 국민연금, 건강보험, 기초생활)
// ============================================================

// 21) 부가가치세 (일반 10% / 간이과세 업종별)
export function computeVAT({
  salesMan = 5000, purchasesMan = 3000,
  type = 'general' as 'general' | 'simple',
  simpleRate = 15,  // 업종 부가율 (음식·숙박 15%, 도소매 10%, 제조 20%, 서비스 30%)
}) {
  const sales = salesMan * 10000;
  const purchases = purchasesMan * 10000;
  if (type === 'general') {
    const salesVAT = sales * 0.1;
    const purchaseVAT = purchases * 0.1;
    const vat = salesVAT - purchaseVAT;
    return {
      type: 'general' as const,
      salesVAT: Math.round(salesVAT),
      purchaseVAT: Math.round(purchaseVAT),
      vat: Math.round(vat),
      refund: vat < 0,
      effectiveRate: sales > 0 ? Math.abs(vat / sales) * 100 : 0,
    };
  } else {
    const salesVAT = sales * (simpleRate / 100) * 0.1;
    const purchaseVAT = purchases * 0.005;
    const vat = Math.max(0, salesVAT - purchaseVAT);
    return {
      type: 'simple' as const,
      salesVAT: Math.round(salesVAT),
      purchaseVAT: Math.round(purchaseVAT),
      vat: Math.round(vat),
      refund: false,
      effectiveRate: sales > 0 ? (vat / sales) * 100 : 0,
    };
  }
}

// 22) 4대보험료 (근로자/사업주 부담, 2026 요율)
// 국민 4.5%/4.5%, 건보 3.545%/3.545%, 장기요양 건보×12.95%, 고용 0.9%/1.15%, 산재 평균 1.5%(사업주만)
export function compute4Insurance({ monthlyWageMan = 300 }) {
  const wage = monthlyWageMan * 10000;
  const npBase = Math.min(6_170_000, Math.max(390_000, wage));
  const npWorker = npBase * 0.045;
  const npEmployer = npBase * 0.045;
  const hiWorker = wage * 0.03545;
  const hiEmployer = wage * 0.03545;
  const ltcWorker = hiWorker * 0.1295;
  const ltcEmployer = hiEmployer * 0.1295;
  const eiWorker = wage * 0.009;
  const eiEmployer = wage * 0.0115;  // 0.9% + 고용안정 0.25%
  const wcEmployer = wage * 0.015;
  const workerTotal = npWorker + hiWorker + ltcWorker + eiWorker;
  const employerTotal = npEmployer + hiEmployer + ltcEmployer + eiEmployer + wcEmployer;
  return {
    npWorker: Math.round(npWorker), npEmployer: Math.round(npEmployer),
    hiWorker: Math.round(hiWorker), hiEmployer: Math.round(hiEmployer),
    ltcWorker: Math.round(ltcWorker), ltcEmployer: Math.round(ltcEmployer),
    eiWorker: Math.round(eiWorker), eiEmployer: Math.round(eiEmployer),
    wcEmployer: Math.round(wcEmployer),
    workerTotal: Math.round(workerTotal),
    employerTotal: Math.round(employerTotal),
    grandTotal: Math.round(workerTotal + employerTotal),
  };
}

// 23) 연말정산 (환급 / 추가납부 추정)
export function computeYearEndTax({
  annualSalaryMan = 5000,
  withholdingMan = 250,
  dependents = 1, children = 0,
  creditCardMan = 1500, medicalMan = 100,
  educationMan = 0, insuranceMan = 100, pensionMan = 0,
}) {
  const annual = annualSalaryMan * 10000;
  const withheld = withholdingMan * 10000;

  let earnDed = 0;
  if (annual <= 5_000_000) earnDed = annual * 0.7;
  else if (annual <= 15_000_000) earnDed = 3_500_000 + (annual - 5_000_000) * 0.4;
  else if (annual <= 45_000_000) earnDed = 7_500_000 + (annual - 15_000_000) * 0.15;
  else if (annual <= 100_000_000) earnDed = 12_000_000 + (annual - 45_000_000) * 0.05;
  else earnDed = 14_750_000 + (annual - 100_000_000) * 0.02;
  earnDed = Math.min(earnDed, 20_000_000);

  const personalDed = 1_500_000 * (1 + dependents);
  const cardThreshold = annual * 0.25;
  const cardOver = Math.max(0, creditCardMan * 10000 - cardThreshold);
  const cardDeduction = Math.min(3_000_000, cardOver * 0.15);
  const insDeduction = Math.min(1_000_000, insuranceMan * 10000);
  const insurance = annual * 0.08;  // 4대보험 추정

  const taxBase = Math.max(0, annual - earnDed - personalDed - cardDeduction - insDeduction - insurance);

  const brackets: Array<[number, number, number]> = [
    [14_000_000, 0.06, 0], [50_000_000, 0.15, 1_260_000],
    [88_000_000, 0.24, 5_760_000], [150_000_000, 0.35, 15_440_000],
    [300_000_000, 0.38, 19_940_000], [500_000_000, 0.40, 25_940_000],
    [1_000_000_000, 0.42, 35_940_000], [Infinity, 0.45, 65_940_000],
  ];
  let calculatedTax = 0;
  for (const [limit, rate, deduct] of brackets) {
    if (taxBase <= limit) { calculatedTax = taxBase * rate - deduct; break; }
  }
  calculatedTax = Math.max(0, calculatedTax);

  const earnedCredit = Math.min(740_000, calculatedTax * 0.55);
  let childCredit = 0;
  if (children >= 1) childCredit += 250_000;
  if (children >= 2) childCredit += 300_000;
  if (children >= 3) childCredit += 400_000 * (children - 2);

  const medThreshold = annual * 0.03;
  const medOver = Math.max(0, medicalMan * 10000 - medThreshold);
  const medCredit = medOver * 0.15;
  const eduCredit = educationMan * 10000 * 0.15;
  const pensionCredit = Math.min(900_000, pensionMan * 10000 * 0.12);

  const totalCredits = earnedCredit + childCredit + medCredit + eduCredit + pensionCredit;
  const finalTax = Math.max(0, calculatedTax - totalCredits);
  const localTax = finalTax * 0.1;
  const totalDue = finalTax + localTax;
  const refund = withheld - totalDue;

  return {
    calculatedTax: Math.round(calculatedTax),
    earnedCredit: Math.round(earnedCredit),
    childCredit: Math.round(childCredit),
    medCredit: Math.round(medCredit),
    eduCredit: Math.round(eduCredit),
    pensionCredit: Math.round(pensionCredit),
    cardDeduction: Math.round(cardDeduction),
    totalCredits: Math.round(totalCredits),
    finalTax: Math.round(finalTax),
    localTax: Math.round(localTax),
    totalDue: Math.round(totalDue),
    withheld: Math.round(withheld),
    refund: Math.round(refund),
    isRefund: refund > 0,
  };
}

// 24) 기초연금 (2026: 단독 ~33.5만, 부부 ~53.6만)
export function computeBasicPension({
  age = 70, isCouple = false, monthlyIncomeMan = 100,
}) {
  const SINGLE_MAX = 334_810;
  const COUPLE_MAX = 535_700;
  const SINGLE_THRESHOLD = 2_280_000;
  const COUPLE_THRESHOLD = 3_648_000;
  if (age < 65) {
    return { eligible: false, reason: '만 65세 이상만 신청 가능',
      monthly: 0, annual: 0, threshold: SINGLE_THRESHOLD, maxPension: SINGLE_MAX };
  }
  const income = monthlyIncomeMan * 10000;
  const threshold = isCouple ? COUPLE_THRESHOLD : SINGLE_THRESHOLD;
  const maxPension = isCouple ? COUPLE_MAX : SINGLE_MAX;
  if (income > threshold) {
    return { eligible: false,
      reason: `소득인정액 ${(income / 10000).toFixed(0)}만 > 선정기준 ${(threshold / 10000).toFixed(0)}만`,
      monthly: 0, annual: 0, threshold, maxPension };
  }
  const ratio = income / threshold;
  let monthly = maxPension;
  if (ratio > 0.7) {
    monthly = maxPension * (1 - (ratio - 0.7) * 0.5);
  }
  return {
    eligible: true, reason: '수급 대상',
    monthly: Math.round(monthly),
    annual: Math.round(monthly * 12),
    threshold, maxPension,
  };
}

// 25) 국민연금 예상 노령연금 (10년 이상 가입 시)
// 공식: (A + B) × 0.5 × (1 + 5% × (가입년-20))
export function computeNationalPension({
  avgMonthlyIncomeMan = 300, insuredMonths = 240,
}) {
  const insuredYears = insuredMonths / 12;
  const A = 2_900_000;
  const B = avgMonthlyIncomeMan * 10000;
  if (insuredYears < 10) {
    return { eligible: false, reason: '가입기간 10년 미만',
      monthly: 0, annual: 0, insuredYears, A, B };
  }
  let formula = (A + B) * 0.5;
  if (insuredYears >= 20) formula *= (1 + 0.05 * (insuredYears - 20));
  else formula *= insuredYears / 20;
  return {
    eligible: true,
    reason: `${insuredYears.toFixed(1)}년 가입`,
    monthly: Math.round(formula),
    annual: Math.round(formula * 12),
    insuredYears: Math.round(insuredYears * 10) / 10,
    A, B,
  };
}

// 26) 건강보험료 (직장: 보수월액 × 3.545% / 지역: 점수제)
export function computeHealthInsurance({
  type = 'employee' as 'employee' | 'local',
  monthlyWageMan = 300,
  incomeMan = 0, propertyMan = 0,
  vehicleYears = 0, carValueMan = 0,
}) {
  if (type === 'employee') {
    const wage = monthlyWageMan * 10000;
    const workerHI = wage * 0.03545;
    const employerHI = wage * 0.03545;
    const workerLTC = workerHI * 0.1295;
    const employerLTC = employerHI * 0.1295;
    return {
      type: 'employee' as const,
      workerHI: Math.round(workerHI), employerHI: Math.round(employerHI),
      workerLTC: Math.round(workerLTC), employerLTC: Math.round(employerLTC),
      workerTotal: Math.round(workerHI + workerLTC),
      employerTotal: Math.round(employerHI + employerLTC),
      grandTotal: Math.round(workerHI + employerHI + workerLTC + employerLTC),
      totalPoint: 0, incomePoint: 0, propertyPoint: 0, carPoint: 0,
    };
  } else {
    const POINT_RATE = 208;
    const incomePoint = Math.max(0, Math.floor((incomeMan / 100) * 6.7));
    const propertyPoint = Math.max(0, Math.floor(propertyMan * 0.05));
    const carPoint = (vehicleYears >= 4 || carValueMan < 4000) ? 0
      : Math.max(0, Math.floor(carValueMan / 100));
    const totalPoint = incomePoint + propertyPoint + carPoint;
    const monthlyHI = totalPoint * POINT_RATE;
    const monthlyLTC = monthlyHI * 0.1295;
    return {
      type: 'local' as const,
      workerHI: Math.round(monthlyHI), employerHI: 0,
      workerLTC: Math.round(monthlyLTC), employerLTC: 0,
      workerTotal: Math.round(monthlyHI + monthlyLTC),
      employerTotal: 0,
      grandTotal: Math.round(monthlyHI + monthlyLTC),
      totalPoint, incomePoint, propertyPoint, carPoint,
    };
  }
}

// 27) 기초생활수급 (2026 중위소득 기준 4% 인상 가정)
export function computeBasicLife({
  householdSize = 1, monthlyIncomeMan = 50,
}) {
  const MEDIAN_INCOME: Record<number, number> = {
    1: 2_415_000, 2: 3_989_000, 3: 5_104_000,
    4: 6_205_000, 5: 7_277_000, 6: 8_321_000, 7: 9_346_000,
  };
  const median = MEDIAN_INCOME[Math.min(7, Math.max(1, householdSize))] || MEDIAN_INCOME[7];
  const livingThreshold = median * 0.32;     // 생계 32%
  const medicalThreshold = median * 0.40;
  const housingThreshold = median * 0.48;
  const educationThreshold = median * 0.50;
  const income = monthlyIncomeMan * 10000;
  const livingPay = income <= livingThreshold ? Math.max(0, livingThreshold - income) : 0;
  return {
    median: Math.round(median),
    livingThreshold: Math.round(livingThreshold),
    medicalThreshold: Math.round(medicalThreshold),
    housingThreshold: Math.round(housingThreshold),
    educationThreshold: Math.round(educationThreshold),
    livingPay: Math.round(livingPay),
    eligibleLiving: income <= livingThreshold,
    eligibleMedical: income <= medicalThreshold,
    eligibleHousing: income <= housingThreshold,
    eligibleEducation: income <= educationThreshold,
  };
}

// ============================================================
// 부동산 (취득세, 종부세, 중개수수료, 전월세 환산, LTV/DTI)
// ============================================================

// 28) 취득세 (지방세법 11조 — 주택)
// 6억↓ 1%, 6~9억 선형 1~3%, 9억↑ 3%
// 2주택 8%, 3주택↑ 12% (조정대상지역에서 2주택도 12%)
export function computeAcquisitionTax({
  housePriceMan = 50000,
  housesOwned = 1,
  isAdjusted = false,
  type = 'house' as 'house' | 'land',
}) {
  const price = housePriceMan * 10000;
  let rate = 0;
  let breakdown = '';

  if (type === 'land') {
    rate = 0.04; breakdown = '토지 4%';
  } else if (housesOwned >= 3 || (housesOwned === 2 && isAdjusted)) {
    rate = 0.12; breakdown = '다주택 중과 12%';
  } else if (housesOwned === 2) {
    rate = 0.08; breakdown = '2주택 8%';
  } else {
    if (price <= 600_000_000) { rate = 0.01; breakdown = '6억↓ 1%'; }
    else if (price <= 900_000_000) {
      // 6~9억 선형: rate = (price/9억 × 2 - 3)/100 보정
      rate = ((price * 2) / 300_000_000 - 3) / 100;
      breakdown = '6~9억 선형';
    }
    else { rate = 0.03; breakdown = '9억↑ 3%'; }
  }

  const acquisitionTax = price * rate;
  const farmTax = type === 'house' && rate >= 0.02 ? acquisitionTax * 0.1 : 0;
  const eduTax = acquisitionTax * (rate <= 0.01 ? 0.1 : 0.2);
  const total = acquisitionTax + farmTax + eduTax;

  return {
    rate: Math.round(rate * 10000) / 100,
    acquisitionTax: Math.round(acquisitionTax),
    farmTax: Math.round(farmTax),
    eduTax: Math.round(eduTax),
    total: Math.round(total),
    breakdown,
  };
}

// 29) 종합부동산세 (1주택 12억 / 다주택 9억 기본공제)
// 공정시장가액비율 60% × 누진세율
export function computeRealEstateTax({
  publicPriceMan = 50000, isMulti = false,
}) {
  const publicPrice = publicPriceMan * 10000;
  const deduction = isMulti ? 900_000_000 : 1_200_000_000;
  const fairRate = 0.60;
  const taxableBase = Math.max(0, (publicPrice - deduction) * fairRate);

  const brackets1: Array<[number, number, number]> = [
    [300_000_000, 0.005, 0],
    [600_000_000, 0.007, 600_000],
    [1_200_000_000, 0.010, 2_400_000],
    [5_000_000_000, 0.013, 6_000_000],
    [9_400_000_000, 0.015, 16_000_000],
    [Infinity, 0.027, 30_000_000],
  ];
  const brackets2: Array<[number, number, number]> = [
    [300_000_000, 0.005, 0],
    [600_000_000, 0.007, 600_000],
    [1_200_000_000, 0.010, 2_400_000],
    [5_000_000_000, 0.020, 14_400_000],
    [9_400_000_000, 0.030, 64_400_000],
    [Infinity, 0.050, 252_400_000],
  ];

  const brackets = isMulti ? brackets2 : brackets1;
  let tax = 0, appliedRate = 0;
  for (const [limit, rate, deduct] of brackets) {
    if (taxableBase <= limit) {
      tax = Math.max(0, taxableBase * rate - deduct);
      appliedRate = rate;
      break;
    }
  }
  const farmTax = tax * 0.2;
  return {
    publicPrice, deduction,
    taxableBase: Math.round(taxableBase),
    tax: Math.round(tax),
    farmTax: Math.round(farmTax),
    total: Math.round(tax + farmTax),
    appliedRate: appliedRate * 100,
    eligible: publicPrice > deduction,
  };
}

// 30) 중개수수료 (공인중개사법 시행규칙 — 법정 상한)
export function computeBrokerFee({
  priceMan = 50000,
  type = 'sale' as 'sale' | 'jeonse' | 'wolse',
  monthlyMan = 0, depositMan = 0,
}) {
  let price = priceMan * 10000;
  if (type === 'wolse') price = depositMan * 10000 + monthlyMan * 10000 * 100;

  let rate = 0, cap = Infinity;
  if (type === 'sale') {
    if (price < 50_000_000) { rate = 0.006; cap = 250_000; }
    else if (price < 200_000_000) { rate = 0.005; cap = 800_000; }
    else if (price < 900_000_000) rate = 0.004;
    else if (price < 1_200_000_000) rate = 0.005;
    else if (price < 1_500_000_000) rate = 0.006;
    else rate = 0.007;
  } else {
    if (price < 50_000_000) { rate = 0.005; cap = 200_000; }
    else if (price < 100_000_000) { rate = 0.004; cap = 300_000; }
    else if (price < 600_000_000) rate = 0.003;
    else if (price < 1_200_000_000) rate = 0.004;
    else if (price < 1_500_000_000) rate = 0.005;
    else rate = 0.006;
  }

  const calculatedFee = price * rate;
  const fee = Math.min(cap, calculatedFee);
  const vat = fee * 0.1;
  return {
    price,
    rate: rate * 100,
    calculatedFee: Math.round(calculatedFee),
    cap: cap === Infinity ? 0 : cap,
    fee: Math.round(fee),
    vat: Math.round(vat),
    total: Math.round(fee + vat),
    note: cap !== Infinity && calculatedFee > cap ? `상한 ${(cap / 10000).toFixed(0)}만원 적용` : '비율 적용',
  };
}

// 31) 전월세 환산 (전월세전환율 = 기준금리 + 2%, 2026 ~5%)
export function computeJeonseConvert({
  mode = 'jeonseToWolse' as 'jeonseToWolse' | 'wolseToJeonse',
  jeonseMan = 30000, depositMan = 5000, monthlyMan = 100,
  conversionRate = 5,
}) {
  if (mode === 'jeonseToWolse') {
    const jeonse = jeonseMan * 10000;
    const deposit = depositMan * 10000;
    const monthlyRent = Math.max(0, ((jeonse - deposit) * (conversionRate / 100)) / 12);
    return {
      mode, jeonse, deposit,
      monthlyRent: Math.round(monthlyRent),
      conversionRate,
      formula: `(${(jeonse / 10000).toFixed(0)}만 − ${(deposit / 10000).toFixed(0)}만) × ${conversionRate}% ÷ 12`,
    };
  } else {
    const deposit = depositMan * 10000;
    const monthly = monthlyMan * 10000;
    const jeonse = deposit + (monthly * 12 / (conversionRate / 100));
    return {
      mode, deposit,
      monthlyRent: monthly,
      jeonse: Math.round(jeonse),
      conversionRate,
      formula: `${(deposit / 10000).toFixed(0)}만 + (${(monthly / 10000).toFixed(0)}만 × 12 ÷ ${conversionRate}%)`,
    };
  }
}

// 32) LTV / DTI 주택대출 한도
export function computeLTVDTI({
  housePriceMan = 50000, annualIncomeMan = 6000,
  ltv = 70, dti = 60, rate = 4.5, years = 30,
}) {
  const housePrice = housePriceMan * 10000;
  const annualIncome = annualIncomeMan * 10000;
  const limitLtv = housePrice * (ltv / 100);
  const monthlyMax = annualIncome * (dti / 100) / 12;
  const r = rate / 100 / 12;
  const n = years * 12;
  const limitDti = monthlyMax * (1 - Math.pow(1 + r, -n)) / r;
  const finalLimit = Math.min(limitLtv, limitDti);
  const monthlyPayment = finalLimit * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return {
    limitLtv: Math.round(limitLtv),
    limitDti: Math.round(limitDti),
    finalLimit: Math.round(finalLimit),
    monthlyPayment: Math.round(monthlyPayment),
    bottleneck: limitLtv < limitDti ? 'LTV' : 'DTI',
    actualLTV: housePrice > 0 ? Math.round((finalLimit / housePrice) * 1000) / 10 : 0,
    actualDTI: annualIncome > 0 ? Math.round((monthlyPayment * 12 / annualIncome) * 1000) / 10 : 0,
  };
}

// 20) 통상임금 (대법원 2013다89399 — 정기성·일률성·고정성)
export function computeOrdinaryWage({
  basicSalaryMan = 250,
  fixedBonusMan = 30,
  fixedAllowanceMan = 20,
  variableAllowanceMan = 0,
  weeklyHours = 40,
}) {
  const ordinaryMonthly = (basicSalaryMan + fixedBonusMan + fixedAllowanceMan) * 10000;
  const weeklyTotal = weeklyHours + Math.min(8, (weeklyHours / 40) * 8);
  const monthlyHours = weeklyTotal * 4.345;
  const hourly = ordinaryMonthly / monthlyHours;
  const daily = hourly * 8;
  // 연장수당 단가 (1시간당)
  const overtimeUnitWage = hourly * 1.5;
  return {
    ordinaryMonthly: Math.round(ordinaryMonthly),
    hourly: Math.round(hourly),
    daily: Math.round(daily),
    monthlyHours: Math.round(monthlyHours),
    excludedVariable: Math.round(variableAllowanceMan * 10000),
    overtimeUnitWage: Math.round(overtimeUnitWage),
  };
}

