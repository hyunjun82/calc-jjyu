// 40개 계산기 메타데이터 + 카테고리
export type CalcMeta = {
  slug: string;
  name: string;
  desc: string;
  time: string;
  catSlug: string;
  catName: string;
  works: boolean; // 실제 작동 여부 (false면 Coming soon)
};

export const CATEGORIES = [
  { slug: '부동산', id: '01', name: '부동산' },
  { slug: '세금', id: '02', name: '세금' },
  { slug: '금융', id: '03', name: '금융·대출' },
  { slug: '노동', id: '04', name: '노동' },
  { slug: '복지', id: '05', name: '복지' },
  { slug: '자동차', id: '06', name: '자동차' },
  { slug: '일상', id: '07', name: '일상' },
] as const;

export const CALCULATORS: CalcMeta[] = [
  // 세금
  { slug: '연봉-실수령액', name: '연봉 실수령액', desc: '세금·4대보험 차감 후 월 실수령', time: '30초', catSlug: '세금', catName: '세금', works: true },
  { slug: '종합소득세', name: '종합소득세', desc: '사업소득·근로소득 합산 누진', time: '60초', catSlug: '세금', catName: '세금', works: true },
  { slug: '부가가치세', name: '부가가치세', desc: '매출·매입 부가세 정산', time: '45초', catSlug: '세금', catName: '세금', works: false },
  { slug: '4대보험', name: '4대보험료', desc: '국민·건강·고용·산재', time: '20초', catSlug: '세금', catName: '세금', works: false },
  { slug: '연말정산', name: '연말정산 환급', desc: '공제 반영 환급/추가납부', time: '90초', catSlug: '세금', catName: '세금', works: false },
  // 부동산
  { slug: '양도소득세', name: '양도소득세', desc: '1주택/다주택 보유기간별', time: '60초', catSlug: '부동산', catName: '부동산', works: true },
  { slug: '취득세', name: '취득세', desc: '주택 취득 시 세액', time: '30초', catSlug: '부동산', catName: '부동산', works: false },
  { slug: '종합부동산세', name: '종합부동산세', desc: '공시가격 기준 종부세', time: '45초', catSlug: '부동산', catName: '부동산', works: false },
  { slug: '중개수수료', name: '중개수수료', desc: '거래금액별 법정 상한', time: '20초', catSlug: '부동산', catName: '부동산', works: false },
  { slug: '전월세-환산', name: '전월세 환산', desc: '전세↔월세 변환', time: '15초', catSlug: '부동산', catName: '부동산', works: false },
  { slug: 'ltv-dti', name: 'LTV / DTI', desc: '주택 대출 한도 비율', time: '30초', catSlug: '부동산', catName: '부동산', works: false },
  // 금융
  { slug: '주택담보대출', name: '주택담보대출', desc: 'LTV/DSR 반영 한도', time: '30초', catSlug: '금융', catName: '금융·대출', works: true },
  { slug: '신용대출', name: '신용대출', desc: '월 상환액·총이자', time: '20초', catSlug: '금융', catName: '금융·대출', works: true },
  { slug: '전세자금대출', name: '전세자금대출', desc: '버팀목·신혼 한도', time: '30초', catSlug: '금융', catName: '금융·대출', works: true },
  { slug: 'dsr', name: 'DSR 계산', desc: '총부채원리금상환비율', time: '45초', catSlug: '금융', catName: '금융·대출', works: true },
  { slug: '예적금-이자', name: '예·적금 이자', desc: '단리·복리 만기 수령액', time: '15초', catSlug: '금융', catName: '금융·대출', works: true },
  { slug: '복리', name: '복리 시뮬', desc: '장기 자산 성장', time: '20초', catSlug: '금융', catName: '금융·대출', works: true },
  // 노동
  { slug: '퇴직금', name: '퇴직금', desc: '법정 퇴직금 자동 계산', time: '30초', catSlug: '노동', catName: '노동', works: true },
  { slug: '실업급여', name: '실업급여', desc: '이직 사유·근속 기준', time: '45초', catSlug: '노동', catName: '노동', works: true },
  { slug: '연차수당', name: '연차수당', desc: '미사용 연차 수당', time: '20초', catSlug: '노동', catName: '노동', works: true },
  { slug: '주휴수당', name: '주휴수당', desc: '주 15시간 이상 근로', time: '15초', catSlug: '노동', catName: '노동', works: true },
  { slug: '야간수당', name: '야간·연장수당', desc: '1.5배 가산', time: '30초', catSlug: '노동', catName: '노동', works: true },
  { slug: '통상임금', name: '통상임금', desc: '정기·일률·고정 합산', time: '30초', catSlug: '노동', catName: '노동', works: true },
  // 복지
  { slug: '기초연금', name: '기초연금', desc: '만 65세 이상 수급액', time: '30초', catSlug: '복지', catName: '복지', works: false },
  { slug: '국민연금', name: '국민연금 예상', desc: '납부기간별 예상 수령', time: '60초', catSlug: '복지', catName: '복지', works: false },
  { slug: '건강보험료', name: '건강보험료', desc: '지역·직장 가입자별', time: '30초', catSlug: '복지', catName: '복지', works: false },
  { slug: '기초생활수급', name: '기초생활수급', desc: '중위소득 기준', time: '45초', catSlug: '복지', catName: '복지', works: false },
  // 자동차
  { slug: '자동차세', name: '자동차세', desc: '배기량별 연 세액', time: '15초', catSlug: '자동차', catName: '자동차', works: false },
  { slug: '자동차-취득세', name: '자동차 취득세', desc: '신차·중고차', time: '20초', catSlug: '자동차', catName: '자동차', works: false },
  { slug: '유류비', name: '유류비', desc: '주행거리·연비 환산', time: '15초', catSlug: '자동차', catName: '자동차', works: false },
  { slug: '과태료', name: '과태료', desc: '위반 항목별 금액', time: '10초', catSlug: '자동차', catName: '자동차', works: false },
  { slug: '중고차-시세', name: '중고차 시세', desc: '연식·주행거리', time: '30초', catSlug: '자동차', catName: '자동차', works: false },
  // 일상
  { slug: '단위변환', name: '단위 변환', desc: '길이·무게·온도·면적', time: '5초', catSlug: '일상', catName: '일상', works: true },
  { slug: '환율', name: '환율', desc: '실시간 주요국 통화', time: '5초', catSlug: '일상', catName: '일상', works: false },
  { slug: '칼로리', name: '칼로리', desc: '음식·운동 칼로리', time: '10초', catSlug: '일상', catName: '일상', works: true },
  { slug: 'bmi', name: 'BMI', desc: '체질량지수', time: '5초', catSlug: '일상', catName: '일상', works: true },
  { slug: '임신주수', name: '임신 주수', desc: '마지막 생리일 기준', time: '10초', catSlug: '일상', catName: '일상', works: true },
  { slug: '디데이', name: '디데이', desc: '생년월일·기념일', time: '5초', catSlug: '일상', catName: '일상', works: true },
];

export const TOP6 = [
  '연봉-실수령액', '양도소득세', '퇴직금', '주택담보대출', '종합소득세', '실업급여',
].map(slug => CALCULATORS.find(c => c.slug === slug)!);

export function getCalcBySlug(slug: string) {
  return CALCULATORS.find(c => c.slug === decodeURIComponent(slug));
}

export function getCalcsByCategory(catSlug: string) {
  return CALCULATORS.filter(c => c.catSlug === decodeURIComponent(catSlug));
}
