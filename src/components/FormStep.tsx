'use client';

import { Check } from 'lucide-react';

interface FormStepProps {
  step: number;
  label: string;
  required?: boolean;
  completed?: boolean;
  children: React.ReactNode;
}

export function FormStep({ step, label, required, completed, children }: FormStepProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2.5 mb-2">
        <span
          className={`flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-bold shrink-0 transition-colors ${
            completed
              ? 'bg-positive text-white'
              : 'bg-bg-tertiary text-fg-muted'
          }`}
        >
          {completed ? <Check size={12} strokeWidth={3} /> : step}
        </span>
        <label className="text-[13px] font-medium text-fg-secondary">
          {label}
          {required && <span className="text-negative ml-0.5">*</span>}
        </label>
      </div>
      <div className="pl-[30px]">
        {children}
      </div>
    </div>
  );
}

interface FormProgressProps {
  current: number;
  total: number;
}

export function FormProgress({ current, total }: FormProgressProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[12px] font-medium text-fg-muted">입력 진행</span>
        <span className="text-[12px] font-medium text-fg-secondary tabular-nums">
          {current}/{total}
        </span>
      </div>
      <div className="h-1 bg-bg-tertiary rounded-full overflow-hidden">
        <div
          className="h-full bg-positive rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
