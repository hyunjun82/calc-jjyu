import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface CalculatorLayoutProps {
  title: string;
  description: string;
  category: 'estate' | 'tax' | 'finance' | 'labor';
  children: React.ReactNode;
}

const categoryNames = {
  estate: '부동산',
  tax: '세금',
  finance: '금융',
  labor: '근로',
};

export default function CalculatorLayout({
  title,
  description,
  category,
  children,
}: CalculatorLayoutProps) {
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-fg-muted mb-8">
        <Link href="/" className="hover:text-fg transition-colors">
          홈
        </Link>
        <ChevronRight size={12} />
        <span className="text-fg-secondary">{categoryNames[category]}</span>
        <ChevronRight size={12} />
        <span className="text-fg font-medium">{title}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[28px] md:text-[36px] font-bold text-fg tracking-tight mb-2">
          {title}
        </h1>
        <p className="text-[15px] text-fg-secondary">{description}</p>
      </div>

      {/* Content */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden">
        <div className="p-6 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
