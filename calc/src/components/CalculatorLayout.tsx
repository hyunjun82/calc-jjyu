import Link from 'next/link';

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

const categoryColors = {
  estate: 'category-color-estate',
  tax: 'category-color-tax',
  finance: 'category-color-finance',
  labor: 'category-color-labor',
};

export default function CalculatorLayout({
  title,
  description,
  category,
  children,
}: CalculatorLayoutProps) {
  return (
    <div className="container-narrow py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-600 mb-8">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          홈
        </Link>
        <span className="text-slate-400">/</span>
        <span>{categoryNames[category]}</span>
        <span className="text-slate-400">/</span>
        <span className="text-slate-900 font-medium">{title}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            {title}
          </h1>
          <span className={`badge-base ${categoryColors[category]} bg-opacity-10 border border-current border-opacity-30`}>
            {categoryNames[category]}
          </span>
        </div>
        <p className="text-lg text-slate-600">{description}</p>
      </div>

      {/* Separator */}
      <div className="separator mb-8" />

      {/* Calculator Card */}
      <div className="card-elevated p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}
