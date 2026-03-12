'use client';

import { useState, useMemo } from 'react';
import CalculatorCard from '@/components/CalculatorCard';

type CategoryType = 'all' | 'estate' | 'tax' | 'finance' | 'labor';

interface Calculator {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  category: Exclude<CategoryType, 'all'>;
}

const calculators: Calculator[] = [
  // 부동산 (3)
  {
    id: 'area',
    title: '평수 환산 계산기',
    description: '평, 제곱미터, 평방피트 등 다양한 면적 단위를 변환합니다.',
    icon: '📐',
    href: '/calculators/real-estate/area',
    category: 'estate',
  },
  {
    id: 'brokerage',
    title: '중개수수료 계산기',
    description: '부동산 거래 시 중개수수료를 빠르게 계산합니다.',
    icon: '🏪',
    href: '/calculators/real-estate/brokerage',
    category: 'estate',
  },
  {
    id: 'subscription',
    title: '청약가점 계산기',
    description: '청약가점 방식으로 순위를 산정합니다.',
    icon: '🎯',
    href: '/calculators/real-estate/subscription',
    category: 'estate',
  },
  // 세금 (6)
  {
    id: 'capital-gains',
    title: '양도소득세 계산기',
    description: '부동산 양도 시 발생하는 양도소득세를 계산합니다.',
    icon: '📊',
    href: '/calculators/tax/capital-gains',
    category: 'tax',
  },
  {
    id: 'acquisition',
    title: '취득세 계산기',
    description: '부동산 취득 시 부과되는 취득세를 계산합니다.',
    icon: '💰',
    href: '/calculators/tax/acquisition',
    category: 'tax',
  },
  {
    id: 'property',
    title: '재산세 계산기',
    description: '보유하고 있는 재산에 대한 재산세를 계산합니다.',
    icon: '🏠',
    href: '/calculators/tax/property',
    category: 'tax',
  },
  {
    id: 'comprehensive',
    title: '종합부동산세 계산기',
    description: '종합부동산세 과세대상 판정 및 세액을 계산합니다.',
    icon: '🏘️',
    href: '/calculators/tax/comprehensive',
    category: 'tax',
  },
  {
    id: 'gift',
    title: '증여세 계산기',
    description: '증여 받은 재산에 대한 증여세를 계산합니다.',
    icon: '🎁',
    href: '/calculators/tax/gift',
    category: 'tax',
  },
  {
    id: 'inheritance',
    title: '상속세 계산기',
    description: '상속 받은 재산에 대한 상속세를 계산합니다.',
    icon: '👨‍👩‍👧‍👦',
    href: '/calculators/tax/inheritance',
    category: 'tax',
  },
  // 금융 (4)
  {
    id: 'loan',
    title: '대출이자 계산기',
    description: '대출 상환액과 이자를 계산합니다.',
    icon: '🏦',
    href: '/calculators/finance/loan',
    category: 'finance',
  },
  {
    id: 'deposit',
    title: '예금 계산기',
    description: '만기 시 받을 이자와 총액을 계산합니다.',
    icon: '💳',
    href: '/calculators/finance/deposit',
    category: 'finance',
  },
  {
    id: 'savings',
    title: '적금 계산기',
    description: '정기적 납입 시 받을 이자를 계산합니다.',
    icon: '🎲',
    href: '/calculators/finance/savings',
    category: 'finance',
  },
  {
    id: 'inflation',
    title: '인플레이션 계산기',
    description: '인플레이션을 고려한 실질 가치를 계산합니다.',
    icon: '📈',
    href: '/calculators/finance/inflation',
    category: 'finance',
  },
  // 근로 (2)
  {
    id: 'salary',
    title: '연봉 실수령액 계산기',
    description: '연봉에서 세금과 보험료를 제외한 실수령액을 계산합니다.',
    icon: '💼',
    href: '/calculators/labor/salary',
    category: 'labor',
  },
  {
    id: 'severance',
    title: '퇴직금 계산기',
    description: '근무 기간과 임금을 바탕으로 퇴직금을 계산합니다.',
    icon: '📋',
    href: '/calculators/labor/severance',
    category: 'labor',
  },
];

const categories: Array<{ id: CategoryType; name: string }> = [
  { id: 'all', name: '전체' },
  { id: 'estate', name: '부동산' },
  { id: 'tax', name: '세금' },
  { id: 'finance', name: '금융' },
  { id: 'labor', name: '근로' },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCalculators = useMemo(() => {
    return calculators.filter((calc) => {
      const matchesCategory = selectedCategory === 'all' || calc.category === selectedCategory;
      const matchesSearch =
        calc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        calc.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="container-wide py-12 md:py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              복잡한 계산,
              <br />
              <span className="text-gradient">쉽고 정확하게</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              부동산, 세금, 금융, 근로까지 다양한 분야의 계산기를 제공합니다.
              정확한 결과로 합리적인 의사결정을 돕습니다.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="container-wide py-8">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="계산기 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-base pl-12 bg-white"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator Grid */}
      <section className="container-wide py-12 md:py-16">
        {filteredCalculators.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCalculators.map((calc) => (
              <CalculatorCard
                key={calc.id}
                title={calc.title}
                description={calc.description}
                icon={calc.icon}
                href={calc.href}
                category={calc.category}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-slate-600">
              검색 결과가 없습니다.
              <br />
              다른 검색어를 시도해주세요.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
