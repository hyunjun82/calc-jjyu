export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 mt-16">
      <div className="container-wide py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-slate-600">
              © {currentYear} calc.jjyu.co.kr. All rights reserved.
            </p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-xs text-slate-500">
              본 계산기의 결과는 참고용이며, 정확한 계산은 전문가 상담을 통해 확인하시기 바랍니다.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
