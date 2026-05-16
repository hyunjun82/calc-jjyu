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
const CreditLoanForm = dynamic(() => import('./forms/CreditLoanForm').then(m => m.CreditLoanForm), { ssr: false });
const JeonseLoanForm = dynamic(() => import('./forms/JeonseLoanForm').then(m => m.JeonseLoanForm), { ssr: false });
const DSRForm = dynamic(() => import('./forms/DSRForm').then(m => m.DSRForm), { ssr: false });
const DepositForm = dynamic(() => import('./forms/DepositForm').then(m => m.DepositForm), { ssr: false });
const CompoundForm = dynamic(() => import('./forms/CompoundForm').then(m => m.CompoundForm), { ssr: false });
const AnnualLeaveForm = dynamic(() => import('./forms/AnnualLeaveForm').then(m => m.AnnualLeaveForm), { ssr: false });
const WeeklyHolidayForm = dynamic(() => import('./forms/WeeklyHolidayForm').then(m => m.WeeklyHolidayForm), { ssr: false });
const OvertimeForm = dynamic(() => import('./forms/OvertimeForm').then(m => m.OvertimeForm), { ssr: false });
const OrdinaryWageForm = dynamic(() => import('./forms/OrdinaryWageForm').then(m => m.OrdinaryWageForm), { ssr: false });
const VATForm = dynamic(() => import('./forms/VATForm').then(m => m.VATForm), { ssr: false });
const FourInsuranceForm = dynamic(() => import('./forms/FourInsuranceForm').then(m => m.FourInsuranceForm), { ssr: false });
const YearEndTaxForm = dynamic(() => import('./forms/YearEndTaxForm').then(m => m.YearEndTaxForm), { ssr: false });
const BasicPensionForm = dynamic(() => import('./forms/BasicPensionForm').then(m => m.BasicPensionForm), { ssr: false });
const NationalPensionForm = dynamic(() => import('./forms/NationalPensionForm').then(m => m.NationalPensionForm), { ssr: false });
const HealthInsuranceForm = dynamic(() => import('./forms/HealthInsuranceForm').then(m => m.HealthInsuranceForm), { ssr: false });
const BasicLifeForm = dynamic(() => import('./forms/BasicLifeForm').then(m => m.BasicLifeForm), { ssr: false });
const AcquisitionTaxForm = dynamic(() => import('./forms/AcquisitionTaxForm').then(m => m.AcquisitionTaxForm), { ssr: false });
const RealEstateTaxForm = dynamic(() => import('./forms/RealEstateTaxForm').then(m => m.RealEstateTaxForm), { ssr: false });
const BrokerFeeForm = dynamic(() => import('./forms/BrokerFeeForm').then(m => m.BrokerFeeForm), { ssr: false });
const JeonseConvertForm = dynamic(() => import('./forms/JeonseConvertForm').then(m => m.JeonseConvertForm), { ssr: false });
const LTVDTIForm = dynamic(() => import('./forms/LTVDTIForm').then(m => m.LTVDTIForm), { ssr: false });

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
      {slug === '신용대출' && <CreditLoanForm />}
      {slug === '전세자금대출' && <JeonseLoanForm />}
      {slug === 'dsr' && <DSRForm />}
      {slug === '예적금-이자' && <DepositForm />}
      {slug === '복리' && <CompoundForm />}
      {slug === '연차수당' && <AnnualLeaveForm />}
      {slug === '주휴수당' && <WeeklyHolidayForm />}
      {slug === '야간수당' && <OvertimeForm />}
      {slug === '통상임금' && <OrdinaryWageForm />}
      {slug === '부가가치세' && <VATForm />}
      {slug === '4대보험' && <FourInsuranceForm />}
      {slug === '연말정산' && <YearEndTaxForm />}
      {slug === '기초연금' && <BasicPensionForm />}
      {slug === '국민연금' && <NationalPensionForm />}
      {slug === '건강보험료' && <HealthInsuranceForm />}
      {slug === '기초생활수급' && <BasicLifeForm />}
      {slug === '취득세' && <AcquisitionTaxForm />}
      {slug === '종합부동산세' && <RealEstateTaxForm />}
      {slug === '중개수수료' && <BrokerFeeForm />}
      {slug === '전월세-환산' && <JeonseConvertForm />}
      {slug === 'ltv-dti' && <LTVDTIForm />}
    </div>
  );
}
