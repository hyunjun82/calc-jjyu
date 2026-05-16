'use client';
import dynamic from 'next/dynamic';
import { getCalcBySlug } from '@/lib/data/calculators';

const SalaryForm = dynamic(() => import('./forms/SalaryForm').then(m => m.SalaryForm), { ssr: false });
const SeveranceForm = dynamic(() => import('./forms/SeveranceForm').then(m => m.SeveranceForm), { ssr: false });
const MortgageForm = dynamic(() => import('./forms/MortgageForm').then(m => m.MortgageForm), { ssr: false });
const IncomeTaxForm = dynamic(() => import('./forms/IncomeTaxForm').then(m => m.IncomeTaxForm), { ssr: false });
const UnemploymentForm = dynamic(() => import('./forms/UnemploymentForm').then(m => m.UnemploymentForm), { ssr: false });
const CapitalGainsForm = dynamic(() => import('./forms/CapitalGainsForm').then(m => m.CapitalGainsForm), { ssr: false });
const BMIForm = dynamic(() => import('./forms/BMIForm').then(m => m.BMIForm), { ssr: false });
const DDayForm = dynamic(() => import('./forms/DDayForm').then(m => m.DDayForm), { ssr: false });
const PregnancyForm = dynamic(() => import('./forms/PregnancyForm').then(m => m.PregnancyForm), { ssr: false });
const CaloriesForm = dynamic(() => import('./forms/CaloriesForm').then(m => m.CaloriesForm), { ssr: false });
const UnitForm = dynamic(() => import('./forms/UnitForm').then(m => m.UnitForm), { ssr: false });

export function CalculatorWidget({ slug }: { slug: string }) {
  const calc = getCalcBySlug(slug);
  if (!calc) return null;

  if (!calc.works) {
    return (
      <div className="seo-calc-card" style={{ textAlign: 'center', padding: 60 }}>
        <h3>준비 중</h3>
        <p>이 계산기는 곧 추가됩니다.</p>
      </div>
    );
  }

  return (
    <div className="seo-calc-card">
      {slug === '연봉-실수령액' && <SalaryForm />}
      {slug === '퇴직금' && <SeveranceForm />}
      {slug === '주택담보대출' && <MortgageForm />}
      {slug === '종합소득세' && <IncomeTaxForm />}
      {slug === '실업급여' && <UnemploymentForm />}
      {slug === '양도소득세' && <CapitalGainsForm />}
      {slug === 'bmi' && <BMIForm />}
      {slug === '디데이' && <DDayForm />}
      {slug === '임신주수' && <PregnancyForm />}
      {slug === '칼로리' && <CaloriesForm />}
      {slug === '단위변환' && <UnitForm />}
    </div>
  );
}
