export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-20">
      <div className="mx-auto max-w-[1200px] px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-[13px] text-fg-muted">
          © {currentYear} calc.jjyu.co.kr
        </p>
        <p className="text-[12px] text-fg-muted">
          계산 결과는 참고용이며, 정확한 내용은 전문가 상담을 권장합니다.
        </p>
      </div>
    </footer>
  );
}
