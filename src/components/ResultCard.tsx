interface ResultItem {
  label: string;
  value: string | number;
  highlight?: boolean;
}

interface ResultCardProps {
  title: string;
  items: ResultItem[];
  mainValue?: string | number;
  mainLabel?: string;
}

const formatNumber = (value: number | string): string => {
  if (typeof value === 'string') return value;
  return new Intl.NumberFormat('ko-KR').format(value);
};

export default function ResultCard({
  title,
  items,
  mainValue,
  mainLabel,
}: ResultCardProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <h3 className="text-[12px] font-medium text-fg-muted uppercase tracking-wider mb-5">
        {title}
      </h3>

      {mainValue !== undefined && mainLabel && (
        <div className="mb-6 pb-6 border-b border-border">
          <p className="text-[13px] text-fg-secondary mb-1.5">{mainLabel}</p>
          <p className="text-[36px] md:text-[42px] font-bold text-fg tracking-tight">
            {formatNumber(mainValue)}
          </p>
        </div>
      )}

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span
              className={`text-[13px] ${
                item.highlight ? 'font-semibold text-fg' : 'text-fg-secondary'
              }`}
            >
              {item.label}
            </span>
            <span
              className={`font-medium tabular-nums ${
                item.highlight ? 'text-[15px] text-fg' : 'text-[14px] text-fg'
              }`}
            >
              {formatNumber(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
