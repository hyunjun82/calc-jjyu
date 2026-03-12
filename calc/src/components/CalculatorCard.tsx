import Link from 'next/link';

interface CalculatorCardProps {
  title: string;
  description: string;
  icon: string;
  href: string;
  category: 'estate' | 'tax' | 'finance' | 'labor';
}

const categoryColors = {
  estate: 'badge-estate',
  tax: 'badge-tax',
  finance: 'badge-finance',
  labor: 'badge-labor',
};

const categoryNames = {
  estate: '부동산',
  tax: '세금',
  finance: '금융',
  labor: '근로',
};

export default function CalculatorCard({
  title,
  description,
  icon,
  href,
  category,
}: CalculatorCardProps) {
  return (
    <Link href={href}>
      <div className="card-hover h-full flex flex-col p-6">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-600 flex-1 mb-4">{description}</p>
        <div className={`${categoryColors[category]} w-fit`}>
          {categoryNames[category]}
        </div>
      </div>
    </Link>
  );
}
