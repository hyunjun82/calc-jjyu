'use client';

import { InputHTMLAttributes } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  type?: 'number' | 'date' | 'text';
  unit?: string;
  error?: string;
  hint?: string;
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  error?: string;
  hint?: string;
}

interface RadioFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  error?: string;
}

export function InputField({
  label,
  type = 'text',
  unit,
  error,
  hint,
  className = '',
  ...props
}: InputFieldProps) {
  return (
    <div className="mb-5">
      <label className="block text-[13px] font-medium text-fg-secondary mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          className={`w-full h-11 px-4 rounded-xl border ${
            error ? 'border-negative' : 'border-border'
          } bg-surface text-[14px] text-fg placeholder:text-fg-muted outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all ${
            unit ? 'pr-14' : ''
          } ${className}`}
          {...props}
        />
        {unit && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-fg-muted pointer-events-none">
            {unit}
          </span>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-[12px] text-negative">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1.5 text-[12px] text-fg-muted">{hint}</p>
      )}
    </div>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  error,
  hint,
}: SelectFieldProps) {
  return (
    <div className="mb-5">
      <label className="block text-[13px] font-medium text-fg-secondary mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full h-11 px-4 rounded-xl border ${
          error ? 'border-negative' : 'border-border'
        } bg-surface text-[14px] text-fg outline-none focus:border-border-strong focus:shadow-[var(--shadow-sm)] transition-all appearance-none cursor-pointer`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3 4.5L6 7.5L9 4.5' stroke='%23a3a3a3' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 14px center',
        }}
      >
        <option value="">선택해주세요</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1.5 text-[12px] text-negative">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1.5 text-[12px] text-fg-muted">{hint}</p>
      )}
    </div>
  );
}

export function RadioField({
  label,
  value,
  onChange,
  options,
  error,
}: RadioFieldProps) {
  return (
    <div className="mb-5">
      <label className="block text-[13px] font-medium text-fg-secondary mb-2.5">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all ${
              value === option.value
                ? 'bg-accent text-accent-fg'
                : 'bg-bg-tertiary text-fg-secondary hover:text-fg hover:bg-surface-active'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      {error && (
        <p className="mt-1.5 text-[12px] text-negative">{error}</p>
      )}
    </div>
  );
}
