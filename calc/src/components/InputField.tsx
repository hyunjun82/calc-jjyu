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
    <div className="mb-6">
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          className={`input-base ${error ? 'input-error' : ''} ${className}`}
          {...props}
        />
        {unit && (
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-slate-500 pointer-events-none">
            {unit}
          </span>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
      {hint && (
        <p className="mt-1 text-xs text-slate-500">{hint}</p>
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
    <div className="mb-6">
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`input-base ${error ? 'input-error' : ''}`}
      >
        <option value="">선택해주세요</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
      {hint && (
        <p className="mt-1 text-xs text-slate-500">{hint}</p>
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
    <div className="mb-6">
      <label className="block text-sm font-medium text-slate-700 mb-3">
        {label}
      </label>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name={label}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="w-4 h-4 text-blue-600 cursor-pointer"
            />
            <span className="text-sm text-slate-700">{option.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <p className="mt-2 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
