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
    <div className="card-elevated p-6 md:p-8 bg-gradient-to-br from-blue-50 to-slate-50">
      <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-6">
        {title}
      </h3>

      {mainValue !== undefined && mainLabel && (
        <div className="mb-8 pb-8 border-b border-slate-200">
          <p className="text-sm text-slate-600 mb-2">{mainLabel}</p>
          <p className="text-4xl md:text-5xl font-bold text-blue-600">
            {formatNumber(mainValue)}
          </p>
        </div>
      )}

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span
              className={`text-sm ${
                item.highlight
                  ? 'font-semibold text-slate-900'
                  : 'text-slate-600'
              }`}
            >
              {item.label}
            </span>
            <span
              className={`font-medium ${
                item.highlight ? 'text-lg text-blue-600' : 'text-slate-900'
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
