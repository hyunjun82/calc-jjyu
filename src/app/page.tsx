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
} from 'lucide-react';

type CategoryType = 'all' | 'estate' | 'tax' | 'finance' | 'labor';

interface Calculator {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  category: Exclude<CategoryType, 'all'>;
}

const calculators: Calculator[] = [
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
];

const categoryGroups = [
  { id: 'estate' as const, name: '부동산', description: '면적, 수수료, 청약' },
  { id: 'tax' as const, name: '세금', description: '양도세, 취득세, 재산세, 종부세, 증여세, 상속세' },
  { id: 'finance' as const, name: '금융', description: '대출, 예금, 적금, 인플레이션' },
  { id: 'labor' as const, name: '근로', description: '연봉, 퇴직금' },
];

const categories: Array<{ id: CategoryType; name: string }> = [
  { id: 'all', name: '전체' },
  { id: 'estate', name: '부동산' },
  { id: 'tax', name: '세금' },
  { id: 'finance', name: '금융' },
  { id: 'labor', name: '근로' },
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
              부동산, 세금, 금융, 근로까지 — 정확한 결과로 합리적인 의사결정을 돕습니다.
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
