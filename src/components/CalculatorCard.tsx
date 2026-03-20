import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface CalculatorCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

export default function CalculatorCard({
  title,
  description,
  icon,
  href,
}: CalculatorCardProps) {
  return (
    <Link href={href} className="group block">
      <div className="relative h-full rounded-xl border border-border bg-surface p-5 transition-all duration-200 hover:border-border-strong hover:shadow-[var(--shadow-md)]">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-lg bg-bg-tertiary flex items-center justify-center text-fg-secondary group-hover:text-fg transition-colors">
            {icon}
          </div>
          <ArrowUpRight
            size={16}
            className="text-fg-muted opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200"
          />
        </div>
        <h3 className="text-[15px] font-semibold text-fg mb-1.5">{title}</h3>
        <p className="text-[13px] text-fg-secondary leading-relaxed">{description}</p>
      </div>
    </Link>
  );
}
