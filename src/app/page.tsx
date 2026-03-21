'use client';

import { useState, useMemo } from 'react';
import CalculatorCard from '@/components/CalculatorCard';
import {
  Ruler,
  Home as HomeIcon,
  Target,
  TrendingUp,
  FileText,
  Building,
  Building2,
  Gift,
  Users,
  Landmark,
  PiggyBank,
  Wallet,
  BarChart3,
  Briefcase,
  ClipboardList,
  Search,
  Receipt,
  LogOut,
  Car,
  KeyRound,
  CandlestickChart,
  Coins,
  Calculator,
  ArrowLeftRight,
  FileCheck,
  Percent,
  Globe,
  CreditCard,
  HandCoins,
  Clock,
  Baby,
  Heart,
  AlertTriangle,
  Scale,
  CalendarDays,
  Timer,
  DollarSign,
  CircleDollarSign,
  Shield,
  Activity,
  Stethoscope,
  Banknote,
  GraduationCap,
  HomeIcon as Home2,
  Flame,
  LineChart,
  TrendingDown,
  Crosshair,
  Zap,
  Droplets,
  Thermometer,
  Fuel,
  Weight,
  Calendar,
  CalendarRange,
  HeartHandshake,
  BookOpen,
  Accessibility,
  UserCheck,
  Ribbon,
  HandHeart,
} from 'lucide-react';

type CategoryType = 'all' | 'estate' | 'tax' | 'finance' | 'labor' | 'pension' | 'investment' | 'life' | 'welfare';

interface CalculatorItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  category: Exclude<CategoryType, 'all'>;
}

const calculators: CalculatorItem[] = [
  // 부동산
  {
    id: 'area',
    title: '평수 환산',
    description: '평, 제곱미터, 평방피트 단위를 변환합니다.',
    icon: <Ruler size={20} strokeWidth={1.6} />,
    href: '/calculators/real-estate/area',
    category: 'estate',
  },
  {
    id: 'brokerage',
    title: '중개수수료',
    description: '부동산 거래 시 중개수수료를 계산합니다.',
    icon: <HomeIcon size={20} strokeWidth={1.6} />,
    href: '/calculators/real-estate/brokerage',
    category: 'estate',
  },
  {
    id: 'subscription',
    title: '청약가점',
    description: '청약가점 방식으로 순위를 산정합니다.',
    icon: <Target size={20} strokeWidth={1.6} />,
    href: '/calculators/real-estate/subscription',
    category: 'estate',
  },
  {
    id: 'rent-conversion',
    title: '전월세 전환',
    description: '전세와 월세 간 보증금을 전환합니다.',
    icon: <ArrowLeftRight size={20} strokeWidth={1.6} />,
    href: '/calculators/real-estate/rent-conversion',
    category: 'estate',
  },
  {
    id: 'registration',
    title: '등기비용',
    description: '부동산 소유권이전 등기 비용을 계산합니다.',
    icon: <FileCheck size={20} strokeWidth={1.6} />,
    href: '/calculators/real-estate/registration',
    category: 'estate',
  },
  {
    id: 'rental-yield',
    title: '임대수익률',
    description: '부동산 임대 투자 수익률을 계산합니다.',
    icon: <Percent size={20} strokeWidth={1.6} />,
    href: '/calculators/real-estate/rental-yield',
    category: 'estate',
  },
  // 세금
  {
    id: 'capital-gains',
    title: '양도소득세',
    description: '부동산 양도 시 발생하는 세금을 계산합니다.',
    icon: <TrendingUp size={20} strokeWidth={1.6} />,
    href: '/calculators/tax/capital-gains',
    category: 'tax',
  },
  {
    id: 'acquisition',
    title: '취득세',
    description: '부동산 취득 시 부과되는 세금을 계산합니다.',
    icon: <FileText size={20} strokeWidth={1.6} />,
    href: '/calculators/tax/acquisition',
    category: 'tax',
  },
  {
    id: 'property',
    title: '재산세',
    description: '보유 재산에 대한 재산세를 계산합니다.',
    icon: <Building size={20} strokeWidth={1.6} />,
    href: '/calculators/tax/property',
    category: 'tax',
  },
  {
    id: 'comprehensive',
    title: '종합부동산세',
    description: '종부세 과세대상 판정 및 세액을 계산합니다.',
    icon: <Building2 size={20} strokeWidth={1.6} />,
    href: '/calculators/tax/comprehensive',
    category: 'tax',
  },
  {
    id: 'gift',
    title: '증여세',
    description: '증여 받은 재산에 대한 세금을 계산합니다.',
    icon: <Gift size={20} strokeWidth={1.6} />,
    href: '/calculators/tax/gift',
    category: 'tax',
  },
  {
    id: 'inheritance',
    title: '상속세',
    description: '상속 받은 재산에 대한 세금을 계산합니다.',
    icon: <Users size={20} strokeWidth={1.6} />,
    href: '/calculators/tax/inheritance',
    category: 'tax',
  },
  {
    id: 'vat',
    title: '부가가치세',
    description: '일반/간이과세자의 부가가치세를 계산합니다.',
    icon: <Receipt size={20} strokeWidth={1.6} />,
    href: '/calculators/tax/vat',
    category: 'tax',
  },
  {
    id: 'retirement-income',
    title: '퇴직소득세',
    description: '퇴직금 수령 시 퇴직소득세를 계산합니다.',
    icon: <LogOut size={20} strokeWidth={1.6} />,
    href: '/calculators/tax/retirement-income',
    category: 'tax',
  },
  {
    id: 'car-tax',
    title: '자동차세',
    description: '배기량과 차령에 따른 자동차세를 계산합니다.',
    icon: <Car size={20} strokeWidth={1.6} />,
    href: '/calculators/tax/car-tax',
    category: 'tax',
  },
  {
    id: 'car-acquisition',
    title: '자동차 취등록세',
    description: '차량 구매 시 취득세와 등록비용을 계산합니다.',
    icon: <KeyRound size={20} strokeWidth={1.6} />,
    href: '/calculators/tax/car-acquisition',
    category: 'tax',
  },
  {
    id: 'stock-tax',
    title: '주식 양도소득세',
    description: '국내 대주주 및 해외주식 양도소득세를 계산합니다.',
    icon: <CandlestickChart size={20} strokeWidth={1.6} />,
    href: '/calculators/tax/stock-tax',
    category: 'tax',
  },
  {
    id: 'financial-income',
    title: '금융소득종합과세',
    description: '이자/배당 소득의 종합과세 세액을 계산합니다.',
    icon: <Coins size={20} strokeWidth={1.6} />,
    href: '/calculators/tax/financial-income',
    category: 'tax',
  },
  {
    id: 'year-end',
    title: '연말정산',
    description: '연말정산 예상 환급금을 계산합니다.',
    icon: <Calculator size={20} strokeWidth={1.6} />,
    href: '/calculators/tax/year-end',
    category: 'tax',
  },
  // 금융
  {
    id: 'loan',
    title: '대출이자',
    description: '대출 상환액과 이자를 계산합니다.',
    icon: <Landmark size={20} strokeWidth={1.6} />,
    href: '/calculators/finance/loan',
    category: 'finance',
  },
  {
    id: 'deposit',
    title: '예금',
    description: '만기 시 받을 이자와 총액을 계산합니다.',
    icon: <PiggyBank size={20} strokeWidth={1.6} />,
    href: '/calculators/finance/deposit',
    category: 'finance',
  },
  {
    id: 'savings',
    title: '적금',
    description: '정기 납입 시 받을 이자를 계산합니다.',
    icon: <Wallet size={20} strokeWidth={1.6} />,
    href: '/calculators/finance/savings',
    category: 'finance',
  },
  {
    id: 'inflation',
    title: '인플레이션',
    description: '인플레이션을 고려한 실질 가치를 계산합니다.',
    icon: <BarChart3 size={20} strokeWidth={1.6} />,
    href: '/calculators/finance/inflation',
    category: 'finance',
  },
  {
    id: 'compound',
    title: '복리',
    description: '복리 수익률과 최종 금액을 계산합니다.',
    icon: <TrendingUp size={20} strokeWidth={1.6} />,
    href: '/calculators/finance/compound',
    category: 'finance',
  },
  {
    id: 'exchange',
    title: '환율',
    description: '외화 환전 금액을 계산합니다.',
    icon: <Globe size={20} strokeWidth={1.6} />,
    href: '/calculators/finance/exchange',
    category: 'finance',
  },
  {
    id: 'installment',
    title: '할부 이자',
    description: '신용카드 할부 이자 비용을 계산합니다.',
    icon: <CreditCard size={20} strokeWidth={1.6} />,
    href: '/calculators/finance/installment',
    category: 'finance',
  },
  {
    id: 'car-loan',
    title: '자동차 할부',
    description: '자동차 할부 월 납부액을 계산합니다.',
    icon: <Car size={20} strokeWidth={1.6} />,
    href: '/calculators/finance/car-loan',
    category: 'finance',
  },
  {
    id: 'prepayment',
    title: '중도상환 수수료',
    description: '대출 조기상환 시 수수료를 계산합니다.',
    icon: <HandCoins size={20} strokeWidth={1.6} />,
    href: '/calculators/finance/prepayment',
    category: 'finance',
  },
  {
    id: 'dsr',
    title: 'DSR',
    description: '총부채원리금상환비율을 계산합니다.',
    icon: <Scale size={20} strokeWidth={1.6} />,
    href: '/calculators/finance/dsr',
    category: 'finance',
  },
  // 근로
  {
    id: 'salary',
    title: '연봉 실수령액',
    description: '세금과 보험료를 제외한 실수령액을 계산합니다.',
    icon: <Briefcase size={20} strokeWidth={1.6} />,
    href: '/calculators/labor/salary',
    category: 'labor',
  },
  {
    id: 'severance',
    title: '퇴직금',
    description: '근무 기간과 임금을 바탕으로 퇴직금을 계산합니다.',
    icon: <ClipboardList size={20} strokeWidth={1.6} />,
    href: '/calculators/labor/severance',
    category: 'labor',
  },
  {
    id: 'minimum-wage',
    title: '최저임금',
    description: '최저임금 기준 급여를 계산합니다.',
    icon: <DollarSign size={20} strokeWidth={1.6} />,
    href: '/calculators/labor/minimum-wage',
    category: 'labor',
  },
  {
    id: 'wage-converter',
    title: '시급/월급 변환',
    description: '시급, 월급, 연봉을 상호 변환합니다.',
    icon: <ArrowLeftRight size={20} strokeWidth={1.6} />,
    href: '/calculators/labor/wage-converter',
    category: 'labor',
  },
  {
    id: 'overtime',
    title: '야근수당',
    description: '연장/야간/휴일 근로수당을 계산합니다.',
    icon: <Clock size={20} strokeWidth={1.6} />,
    href: '/calculators/labor/overtime',
    category: 'labor',
  },
  {
    id: 'weekly-holiday',
    title: '주휴수당',
    description: '주 15시간 이상 근로자 주휴수당을 계산합니다.',
    icon: <CalendarDays size={20} strokeWidth={1.6} />,
    href: '/calculators/labor/weekly-holiday',
    category: 'labor',
  },
  {
    id: 'unemployment',
    title: '실업급여',
    description: '예상 구직급여 수급액을 계산합니다.',
    icon: <Shield size={20} strokeWidth={1.6} />,
    href: '/calculators/labor/unemployment',
    category: 'labor',
  },
  {
    id: 'parental-leave',
    title: '육아휴직 급여',
    description: '육아휴직 시 급여를 계산합니다.',
    icon: <Baby size={20} strokeWidth={1.6} />,
    href: '/calculators/labor/parental-leave',
    category: 'labor',
  },
  {
    id: 'maternity-leave',
    title: '출산휴가 급여',
    description: '출산전후휴가 급여를 계산합니다.',
    icon: <Heart size={20} strokeWidth={1.6} />,
    href: '/calculators/labor/maternity-leave',
    category: 'labor',
  },
  {
    id: 'dismissal',
    title: '해고예고수당',
    description: '해고예고 미이행 시 수당을 계산합니다.',
    icon: <AlertTriangle size={20} strokeWidth={1.6} />,
    href: '/calculators/labor/dismissal',
    category: 'labor',
  },
  {
    id: 'ordinary-wage',
    title: '통상임금',
    description: '통상임금을 산정합니다.',
    icon: <CircleDollarSign size={20} strokeWidth={1.6} />,
    href: '/calculators/labor/ordinary-wage',
    category: 'labor',
  },
  {
    id: 'annual-leave',
    title: '연차수당',
    description: '미사용 연차에 대한 수당을 계산합니다.',
    icon: <CalendarRange size={20} strokeWidth={1.6} />,
    href: '/calculators/labor/annual-leave',
    category: 'labor',
  },
  // 연금/보험
  {
    id: 'national-pension',
    title: '국민연금',
    description: '국민연금 예상 수령액을 계산합니다.',
    icon: <Banknote size={20} strokeWidth={1.6} />,
    href: '/calculators/pension/national-pension',
    category: 'pension',
  },
  {
    id: 'health-insurance',
    title: '건강보험료',
    description: '직장/지역 건강보험료를 계산합니다.',
    icon: <Stethoscope size={20} strokeWidth={1.6} />,
    href: '/calculators/pension/health-insurance',
    category: 'pension',
  },
  {
    id: 'four-insurance',
    title: '4대보험료',
    description: '4대 사회보험료를 종합 계산합니다.',
    icon: <Shield size={20} strokeWidth={1.6} />,
    href: '/calculators/pension/four-insurance',
    category: 'pension',
  },
  {
    id: 'retirement-pension',
    title: '퇴직연금',
    description: 'DC/DB형 퇴직연금 수령액을 계산합니다.',
    icon: <PiggyBank size={20} strokeWidth={1.6} />,
    href: '/calculators/pension/retirement-pension',
    category: 'pension',
  },
  {
    id: 'pension-saving',
    title: '연금저축 세액공제',
    description: '연금저축/IRP 세액공제를 계산합니다.',
    icon: <GraduationCap size={20} strokeWidth={1.6} />,
    href: '/calculators/pension/pension-saving',
    category: 'pension',
  },
  {
    id: 'housing-pension',
    title: '주택연금',
    description: '주택연금 예상 월수령액을 계산합니다.',
    icon: <HomeIcon size={20} strokeWidth={1.6} />,
    href: '/calculators/pension/housing-pension',
    category: 'pension',
  },
  {
    id: 'basic-pension',
    title: '기초연금',
    description: '기초연금 수급자격과 예상액을 계산합니다.',
    icon: <Users size={20} strokeWidth={1.6} />,
    href: '/calculators/pension/basic-pension',
    category: 'pension',
  },
  // 투자
  {
    id: 'stock-return',
    title: '주식 수익률',
    description: '주식 매매 수익률을 계산합니다.',
    icon: <LineChart size={20} strokeWidth={1.6} />,
    href: '/calculators/investment/stock-return',
    category: 'investment',
  },
  {
    id: 'dividend',
    title: '배당수익률',
    description: '배당금 기반 수익률을 계산합니다.',
    icon: <Coins size={20} strokeWidth={1.6} />,
    href: '/calculators/investment/dividend',
    category: 'investment',
  },
  {
    id: 'isa',
    title: 'ISA 절세',
    description: 'ISA 계좌의 절세 효과를 계산합니다.',
    icon: <Receipt size={20} strokeWidth={1.6} />,
    href: '/calculators/investment/isa',
    category: 'investment',
  },
  {
    id: 'fire',
    title: 'FIRE',
    description: '조기은퇴 목표 금액과 기간을 계산합니다.',
    icon: <Flame size={20} strokeWidth={1.6} />,
    href: '/calculators/investment/fire',
    category: 'investment',
  },
  {
    id: 'rule72',
    title: '72법칙',
    description: '원금 2배 소요 기간을 계산합니다.',
    icon: <Timer size={20} strokeWidth={1.6} />,
    href: '/calculators/investment/rule72',
    category: 'investment',
  },
  {
    id: 'goal',
    title: '목돈 마련',
    description: '목표금액 달성 계획을 계산합니다.',
    icon: <Crosshair size={20} strokeWidth={1.6} />,
    href: '/calculators/investment/goal',
    category: 'investment',
  },
  // 생활
  {
    id: 'bmi',
    title: 'BMI',
    description: '체질량지수를 계산합니다.',
    icon: <Weight size={20} strokeWidth={1.6} />,
    href: '/calculators/life/bmi',
    category: 'life',
  },
  {
    id: 'age',
    title: '만나이',
    description: '만나이와 생일 정보를 계산합니다.',
    icon: <Calendar size={20} strokeWidth={1.6} />,
    href: '/calculators/life/age',
    category: 'life',
  },
  {
    id: 'date',
    title: '날짜 계산',
    description: '두 날짜 사이 일수를 계산합니다.',
    icon: <CalendarRange size={20} strokeWidth={1.6} />,
    href: '/calculators/life/date',
    category: 'life',
  },
  {
    id: 'electricity',
    title: '전기요금',
    description: '가정용 전기요금을 계산합니다.',
    icon: <Zap size={20} strokeWidth={1.6} />,
    href: '/calculators/life/electricity',
    category: 'life',
  },
  {
    id: 'gas',
    title: '가스요금',
    description: '도시가스 요금을 계산합니다.',
    icon: <Flame size={20} strokeWidth={1.6} />,
    href: '/calculators/life/gas',
    category: 'life',
  },
  {
    id: 'water',
    title: '수도요금',
    description: '상하수도 요금을 계산합니다.',
    icon: <Droplets size={20} strokeWidth={1.6} />,
    href: '/calculators/life/water',
    category: 'life',
  },
  {
    id: 'car-cost',
    title: '자동차 유지비',
    description: '연간 차량 유지 비용을 계산합니다.',
    icon: <Fuel size={20} strokeWidth={1.6} />,
    href: '/calculators/life/car-cost',
    category: 'life',
  },
  // 복지
  {
    id: 'basic-livelihood',
    title: '기초생활보장',
    description: '생계·의료·주거·교육급여 수급자격을 모의계산합니다.',
    icon: <HeartHandshake size={20} strokeWidth={1.6} />,
    href: '/calculators/welfare/basic-livelihood',
    category: 'welfare',
  },
  {
    id: 'education-support',
    title: '교육비지원',
    description: '초·중·고 교육비 지원 대상 여부를 모의계산합니다.',
    icon: <BookOpen size={20} strokeWidth={1.6} />,
    href: '/calculators/welfare/education',
    category: 'welfare',
  },
  {
    id: 'disability-allowance',
    title: '장애(아동)수당',
    description: '장애수당·장애아동수당 수급자격을 모의계산합니다.',
    icon: <Accessibility size={20} strokeWidth={1.6} />,
    href: '/calculators/welfare/disability-allowance',
    category: 'welfare',
  },
  {
    id: 'disability-pension',
    title: '장애인연금',
    description: '중증장애인 장애인연금 수급자격을 모의계산합니다.',
    icon: <UserCheck size={20} strokeWidth={1.6} />,
    href: '/calculators/welfare/disability-pension',
    category: 'welfare',
  },
  {
    id: 'single-parent',
    title: '한부모가족지원',
    description: '한부모가족 지원 대상 여부를 모의계산합니다.',
    icon: <Users size={20} strokeWidth={1.6} />,
    href: '/calculators/welfare/single-parent',
    category: 'welfare',
  },
  {
    id: 'maternity-care',
    title: '산모·신생아 건강관리',
    description: '산모·신생아 건강관리 서비스 지원 여부를 모의계산합니다.',
    icon: <Ribbon size={20} strokeWidth={1.6} />,
    href: '/calculators/welfare/maternity-care',
    category: 'welfare',
  },
  {
    id: 'childcare',
    title: '아이돌봄서비스',
    description: '아이돌봄서비스 지원 대상과 본인부담금을 모의계산합니다.',
    icon: <HandHeart size={20} strokeWidth={1.6} />,
    href: '/calculators/welfare/childcare',
    category: 'welfare',
  },
];

const categoryGroups = [
  { id: 'estate' as const, name: '부동산', description: '면적, 수수료, 청약, 전월세, 등기, 임대수익률' },
  { id: 'tax' as const, name: '세금', description: '양도세, 취득세, 재산세, 종부세, 증여세, 상속세, 부가세, 퇴직소득세, 자동차세, 주식양도세, 금융소득, 연말정산' },
  { id: 'finance' as const, name: '금융', description: '대출, 예적금, 복리, 환율, 할부, DSR, 중도상환' },
  { id: 'labor' as const, name: '근로', description: '연봉, 퇴직금, 최저임금, 수당, 실업급여, 휴직급여' },
  { id: 'pension' as const, name: '연금/보험', description: '국민연금, 건강보험, 4대보험, 퇴직연금, 주택연금, 기초연금' },
  { id: 'investment' as const, name: '투자', description: '주식수익률, 배당, ISA, FIRE, 72법칙, 목돈마련' },
  { id: 'life' as const, name: '생활', description: 'BMI, 만나이, 날짜, 전기, 가스, 수도, 자동차유지비' },
  { id: 'welfare' as const, name: '복지', description: '기초생활보장, 교육비지원, 장애수당, 장애인연금, 한부모가족, 산모신생아, 아이돌봄' },
];

const categories: Array<{ id: CategoryType; name: string }> = [
  { id: 'all', name: '전체' },
  { id: 'estate', name: '부동산' },
  { id: 'tax', name: '세금' },
  { id: 'finance', name: '금융' },
  { id: 'labor', name: '근로' },
  { id: 'pension', name: '연금/보험' },
  { id: 'investment', name: '투자' },
  { id: 'life', name: '생활' },
  { id: 'welfare', name: '복지' },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const isSearching = searchQuery.trim().length > 0;

  const searchResults = useMemo(() => {
    if (!isSearching) return [];
    return calculators.filter(
      (calc) =>
        calc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        calc.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, isSearching]);

  return (
    <div>
      {/* Hero Section */}
      <section className="pt-16 pb-12 md:pt-24 md:pb-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="max-w-2xl">
            <h1 className="text-[40px] md:text-[56px] font-bold tracking-tight leading-[1.1] text-fg mb-4">
              복잡한 계산을
              <br />
              단순하게.
            </h1>
            <p className="text-[17px] text-fg-secondary leading-relaxed mb-8">
              부동산, 세금, 금융, 근로, 연금, 투자, 생활, 복지까지 — 정확한 결과로 합리적인 의사결정을 돕습니다.
            </p>

            {/* Search */}
            <div className="relative max-w-md">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-fg-muted"
              />
              <input
                type="text"
                placeholder="계산기 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-muted hover:text-fg transition-colors"
                >
                  <span className="text-xs">ESC</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Search Results or Category Groups */}
      <section className="pb-20">
        <div className="mx-auto max-w-[1200px] px-6">
          {isSearching ? (
            <div>
              <p className="text-[13px] text-fg-muted mb-6">
                {searchResults.length}개의 결과
              </p>
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {searchResults.map((calc) => (
                    <CalculatorCard
                      key={calc.id}
                      title={calc.title}
                      description={calc.description}
                      icon={calc.icon}
                      href={calc.href}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center">
                  <p className="text-fg-secondary">검색 결과가 없습니다.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-12">
              {categoryGroups.map((group) => {
                const items = calculators.filter((c) => c.category === group.id);
                return (
                  <div key={group.id} id={group.id}>
                    <div className="flex items-baseline gap-3 mb-4">
                      <h2 className="text-[20px] font-semibold text-fg">{group.name}</h2>
                      <span className="text-[13px] text-fg-muted">{group.description}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {items.map((calc) => (
                        <CalculatorCard
                          key={calc.id}
                          title={calc.title}
                          description={calc.description}
                          icon={calc.icon}
                          href={calc.href}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
