"use client";

import { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Phone,
  ChevronDown,
  Building2,
  Trees,
  Gem,
  Star,
  ArrowRight,
  Menu,
  X,
  Check,
} from "lucide-react";

/* ───────────────────────── Helpers ───────────────────────── */

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Section({
  children,
  id,
  className = "",
  dark = false,
}: {
  children: React.ReactNode;
  id?: string;
  className?: string;
  dark?: boolean;
}) {
  const { ref, visible } = useInView();
  return (
    <section
      id={id}
      ref={ref}
      className={`transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${dark ? "bg-[#1a1a1a] text-white" : "bg-white text-[#1a1a1a]"} ${className}`}
    >
      {children}
    </section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-xs tracking-[0.25em] uppercase text-[#b08d57] font-medium mb-3">
      {children}
    </span>
  );
}

/* ───────────────────────── Data ───────────────────────── */

const NAV_ITEMS = [
  { label: "단지소개", href: "#intro" },
  { label: "입지환경", href: "#location" },
  { label: "프리미엄", href: "#premium" },
  { label: "평면안내", href: "#floorplan" },
  { label: "커뮤니티", href: "#community" },
  { label: "관심고객등록", href: "#register" },
];

const UNIT_TYPES = [
  { type: "59A", area: "59.97㎡", rooms: "2Room", households: 120, price: "9.8억~" },
  { type: "74B", area: "74.85㎡", rooms: "3Room", households: 180, price: "12.3억~" },
  { type: "84A", area: "84.98㎡", rooms: "3Room", households: 250, price: "14.7억~" },
  { type: "84B", area: "84.76㎡", rooms: "3Room", households: 200, price: "14.5억~" },
  { type: "105", area: "105.42㎡", rooms: "4Room", households: 100, price: "18.2억~" },
];

const PREMIUM_ITEMS = [
  {
    icon: Gem,
    title: "Euromobil SEI",
    sub: "이탈리아 명품 키친",
    desc: "세계적 산업디자이너 Marc Sadler와 이탈리아 Euromobil의 콜라보레이션. 베네치아의 예술성과 장인기술을 담은 혁신적 컨템포러리 주방.",
  },
  {
    icon: Building2,
    title: "혁신 설계",
    sub: "공간의 재해석",
    desc: "판상형 4-Bay 위주 설계, 넓은 거실과 개방감 극대화. 층고 2.5m로 쾌적한 주거공간을 실현합니다.",
  },
  {
    icon: Trees,
    title: "조경 특화",
    sub: "도심 속 자연",
    desc: "중앙광장과 테라스 가든, 다층 조경 설계로 사계절 푸르른 단지. 약 35%의 높은 녹지율을 자랑합니다.",
  },
  {
    icon: Star,
    title: "스마트 홈",
    sub: "미래형 주거",
    desc: "IoT 기반 홈 오토메이션, 비대면 택배 시스템, AI 에너지 관리 등 최첨단 스마트 주거 시스템 도입.",
  },
];

const COMMUNITY_FACILITIES = [
  "피트니스 센터",
  "실내 골프연습장",
  "사우나 & 스파",
  "독서실 & 스터디룸",
  "키즈 플레이존",
  "게스트하우스",
  "커뮤니티 라운지",
  "옥상 정원 & 스카이라운지",
];

/* ───────────────────────── Page ───────────────────────── */

export default function ApartmentPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", type: "", agree: false });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="font-sans text-[#1a1a1a] overflow-x-hidden">
      {/* ── Navigation ── */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16 lg:h-20">
          <a
            href="#hero"
            className={`text-lg font-bold tracking-tight transition-colors ${
              scrolled ? "text-[#1a1a1a]" : "text-white"
            }`}
          >
            르엘 시그니처
          </a>

          {/* desktop */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_ITEMS.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className={`text-sm tracking-wide transition-colors hover:text-[#b08d57] ${
                  scrolled ? "text-[#555]" : "text-white/80"
                }`}
              >
                {n.label}
              </a>
            ))}
            <a
              href="tel:1800-0000"
              className="flex items-center gap-1.5 text-sm font-semibold text-[#b08d57]"
            >
              <Phone size={14} /> 1800-0000
            </a>
          </div>

          {/* mobile toggle */}
          <button
            className={`lg:hidden ${scrolled ? "text-[#1a1a1a]" : "text-white"}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* mobile menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
            {NAV_ITEMS.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setMenuOpen(false)}
                className="block px-6 py-3 text-sm text-[#333] hover:bg-gray-50"
              >
                {n.label}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section
        id="hero"
        className="relative h-screen flex items-center justify-center bg-[#1a1a1a] overflow-hidden"
      >
        {/* gradient overlay simulating hero image */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%3E%3Crect%20fill%3D%22%23222%22%20width%3D%22100%22%20height%3D%22100%22%2F%3E%3C%2Fsvg%3E')] bg-cover bg-center" />

        <div className="relative z-10 text-center text-white px-6 max-w-3xl">
          <p className="text-xs tracking-[0.3em] uppercase text-[#b08d57] mb-4">
            Premium Residence
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 tracking-tight">
            르엘 시그니처
          </h1>
          <p className="text-base md:text-lg text-white/70 leading-relaxed mb-3">
            이탈리아 디자인 철학과 기술력이 선보이는 명품 공간의 미학
          </p>
          <p className="text-sm text-white/50 mb-10">
            Made in Italy Furniture Brand &middot; Euromobil SEI
          </p>
          <a
            href="#register"
            className="inline-flex items-center gap-2 bg-[#b08d57] hover:bg-[#9a7a4a] text-white text-sm font-semibold px-8 py-4 rounded transition-colors"
          >
            관심고객 사전등록 <ArrowRight size={16} />
          </a>
        </div>

        {/* scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 animate-bounce">
          <ChevronDown size={28} />
        </div>
      </section>

      {/* ── Intro ── */}
      <Section id="intro" className="py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <SectionLabel>Project Overview</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-snug">
              도심의 중심,<br />새로운 랜드마크가 됩니다
            </h2>
            <p className="text-[#666] leading-relaxed">
              총 850세대 대단지 프리미엄 주거 공간. 판상형 위주 설계와
              이탈리아 명품 인테리어, 특화 조경으로 완성되는 프리미엄 라이프.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: "총 세대수", value: "850세대" },
              { label: "최고 층수", value: "지상 35층" },
              { label: "주차 대수", value: "세대당 1.5대" },
              { label: "입주 예정", value: "2028년 3월" },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-[#fafafa] rounded-2xl p-6 lg:p-8"
              >
                <p className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-1">
                  {item.value}
                </p>
                <p className="text-xs text-[#999] tracking-wide">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Location ── */}
      <Section id="location" dark className="py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <SectionLabel>Location</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              사통팔달 교통의 중심
            </h2>
            <p className="text-white/60 leading-relaxed">
              지하철 역세권 도보 5분, 주요 도심 업무지구 20분 내 접근.
              학군, 쇼핑, 의료 등 생활 인프라가 완벽한 입지.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "🚇",
                title: "교통",
                items: ["지하철 OO역 도보 5분", "BRT 정류장 도보 3분", "OO고속도로 IC 10분"],
              },
              {
                icon: "🎓",
                title: "교육",
                items: ["OO초등학교 도보 7분", "OO중학교 도보 10분", "학원가 밀집지역 인접"],
              },
              {
                icon: "🏥",
                title: "생활편의",
                items: ["대형마트 차량 5분", "종합병원 차량 10분", "공원 및 하천 도보권"],
              },
            ].map((cat) => (
              <div
                key={cat.title}
                className="bg-white/5 border border-white/10 rounded-2xl p-8"
              >
                <span className="text-3xl mb-4 block">{cat.icon}</span>
                <h3 className="text-lg font-bold mb-4">{cat.title}</h3>
                <ul className="space-y-2">
                  {cat.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-white/60"
                    >
                      <MapPin size={14} className="mt-0.5 shrink-0 text-[#b08d57]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Premium / Euromobil ── */}
      <Section id="premium" className="py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <SectionLabel>Premium</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-snug">
              이탈리아 명품이 완성하는<br />프리미엄 공간
            </h2>
            <p className="text-[#666] leading-relaxed">
              Euromobil SEI — 세계적 산업디자이너 Marc Sadler와
              이탈리아 토탈 피니처 브랜드 Euromobil의 콜라보 브랜드.
              베네치아의 예술성과 장인기술이 담긴 혁신적 컨템포러리 키친을 제공합니다.
            </p>
          </div>

          {/* Euromobil Feature Banner */}
          <div className="bg-[#1a1a1a] rounded-3xl overflow-hidden mb-16">
            <div className="grid md:grid-cols-2">
              <div className="flex flex-col justify-center p-10 lg:p-16">
                <p className="text-xs tracking-[0.2em] text-[#b08d57] uppercase mb-2">
                  Kitchen Furniture
                </p>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Euromobil <span className="text-[#b08d57]">SEI</span>
                </h3>
                <p className="text-white/40 text-sm mb-6">
                  Made in Italy Furniture Brand
                </p>
                <p className="text-white/60 text-sm leading-relaxed mb-8">
                  가구의 미학을 넘어 사용자의 동선과 환경 등을 고려한 명품 브랜드.
                  디자인 전 과정을 Directing하는 것으로 유명한 Marc Sadler의 철학이
                  담긴 주방이 당신의 일상을 바꿉니다.
                </p>
                <div className="flex items-center gap-4">
                  <div className="border border-white/20 rounded-lg px-4 py-2">
                    <p className="text-[10px] text-white/40 uppercase">Designer</p>
                    <p className="text-sm text-white font-medium">Marc Sadler</p>
                  </div>
                  <div className="border border-white/20 rounded-lg px-4 py-2">
                    <p className="text-[10px] text-white/40 uppercase">Origin</p>
                    <p className="text-sm text-white font-medium">Italy</p>
                  </div>
                  <div className="border border-white/20 rounded-lg px-4 py-2">
                    <p className="text-[10px] text-white/40 uppercase">Brand</p>
                    <p className="text-sm text-white font-medium">Euromobil</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-[#2a2a2a] to-[#111] flex items-center justify-center p-10 min-h-[300px]">
                <div className="text-center">
                  <p className="text-6xl font-light text-white/10 mb-2 tracking-widest">SEI</p>
                  <p className="text-xs text-white/20 italic">M. Sadler</p>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PREMIUM_ITEMS.map((item) => (
              <div
                key={item.title}
                className="group bg-[#fafafa] hover:bg-[#1a1a1a] rounded-2xl p-8 transition-colors duration-300"
              >
                <item.icon
                  size={28}
                  className="text-[#b08d57] mb-5"
                />
                <h3 className="text-base font-bold mb-1 group-hover:text-white transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-[#b08d57] mb-3">{item.sub}</p>
                <p className="text-sm text-[#888] group-hover:text-white/60 leading-relaxed transition-colors">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Floor Plan ── */}
      <Section id="floorplan" dark className="py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <SectionLabel>Floor Plan</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              세대별 평면 안내
            </h2>
            <p className="text-white/60 leading-relaxed">
              전 타입 판상형 4-Bay 설계 &middot; 넓은 거실과 수납 극대화
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-xs text-white/40 uppercase tracking-wider py-4 px-4">
                    타입
                  </th>
                  <th className="text-left text-xs text-white/40 uppercase tracking-wider py-4 px-4">
                    전용면적
                  </th>
                  <th className="text-left text-xs text-white/40 uppercase tracking-wider py-4 px-4">
                    구성
                  </th>
                  <th className="text-right text-xs text-white/40 uppercase tracking-wider py-4 px-4">
                    세대수
                  </th>
                  <th className="text-right text-xs text-white/40 uppercase tracking-wider py-4 px-4">
                    분양가
                  </th>
                </tr>
              </thead>
              <tbody>
                {UNIT_TYPES.map((u, i) => (
                  <tr
                    key={u.type}
                    className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                      i === 2 ? "bg-white/[0.03]" : ""
                    }`}
                  >
                    <td className="py-5 px-4 font-semibold">{u.type}</td>
                    <td className="py-5 px-4 text-white/70">{u.area}</td>
                    <td className="py-5 px-4 text-white/70">{u.rooms}</td>
                    <td className="py-5 px-4 text-right text-white/70">
                      {u.households}세대
                    </td>
                    <td className="py-5 px-4 text-right font-semibold text-[#b08d57]">
                      {u.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-white/30 mt-4 text-right">
            * 분양가는 예정가이며, 변동될 수 있습니다.
          </p>
        </div>
      </Section>

      {/* ── Community ── */}
      <Section id="community" className="py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <SectionLabel>Community</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-snug">
              일상을 특별하게 만드는<br />커뮤니티 시설
            </h2>
            <p className="text-[#666] leading-relaxed">
              도심 속 자연과 함께하는 다층 조경 설계,
              입주민의 건강과 여가를 위한 프리미엄 커뮤니티 공간.
            </p>
          </div>

          {/* Landscape Feature */}
          <div className="bg-gradient-to-br from-[#f0ebe3] to-[#e8e0d4] rounded-3xl p-10 lg:p-16 mb-12">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <SectionLabel>Landscape Design</SectionLabel>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  중앙 광장 & 테라스 가든
                </h3>
                <p className="text-[#666] text-sm leading-relaxed mb-6">
                  다층 구조의 조경 설계로 각 층마다 다른 테마의 정원을 경험할 수 있습니다.
                  중앙광장에서 이어지는 계단식 정원, 하늘정원,
                  아이들의 놀이공간까지 자연과 사람이 어우러지는 공간을 만들었습니다.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["녹지율 35%", "중앙광장", "테라스 가든", "하늘정원"].map((tag) => (
                    <span
                      key={tag}
                      className="bg-white/60 text-[#555] text-xs px-3 py-1.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-[#1a1a1a] rounded-2xl h-64 md:h-80 flex items-center justify-center">
                <div className="text-center">
                  <Trees size={48} className="mx-auto text-[#b08d57]/30 mb-3" />
                  <p className="text-white/20 text-sm">조감도 이미지</p>
                </div>
              </div>
            </div>
          </div>

          {/* Facility Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {COMMUNITY_FACILITIES.map((f) => (
              <div
                key={f}
                className="bg-[#fafafa] hover:bg-[#1a1a1a] hover:text-white rounded-xl p-5 text-center transition-colors duration-300 cursor-default"
              >
                <p className="text-sm font-medium">{f}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Register ── */}
      <Section id="register" dark className="py-24 lg:py-32">
        <div className="max-w-xl mx-auto px-6">
          <div className="text-center mb-12">
            <SectionLabel>Registration</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              관심고객 사전등록
            </h2>
            <p className="text-white/50 text-sm">
              사전등록 고객님께 특별 혜택과 우선 안내를 드립니다.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
              <div className="w-16 h-16 bg-[#b08d57] rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">등록이 완료되었습니다</h3>
              <p className="text-white/50 text-sm">
                빠른 시일 내에 연락드리겠습니다.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">
                  이름
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="홍길동"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#b08d57] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">
                  연락처
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="010-0000-0000"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#b08d57] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">
                  관심 평형
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-[#b08d57] transition-colors appearance-none"
                >
                  <option value="" className="bg-[#1a1a1a]">
                    선택해주세요
                  </option>
                  {UNIT_TYPES.map((u) => (
                    <option
                      key={u.type}
                      value={u.type}
                      className="bg-[#1a1a1a]"
                    >
                      {u.type} ({u.area} / {u.rooms})
                    </option>
                  ))}
                </select>
              </div>
              <label className="flex items-start gap-3 pt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agree}
                  onChange={(e) =>
                    setFormData({ ...formData, agree: e.target.checked })
                  }
                  className="mt-0.5 accent-[#b08d57]"
                />
                <span className="text-xs text-white/40 leading-relaxed">
                  개인정보 수집 및 이용에 동의합니다. 수집된 정보는 분양 안내
                  목적으로만 사용되며, 목적 달성 후 즉시 파기됩니다.
                </span>
              </label>
              <button
                onClick={() => {
                  if (formData.name && formData.phone && formData.agree) {
                    setSubmitted(true);
                  }
                }}
                disabled={!formData.name || !formData.phone || !formData.agree}
                className="w-full mt-4 bg-[#b08d57] hover:bg-[#9a7a4a] disabled:bg-white/10 disabled:text-white/20 text-white font-semibold py-4 rounded-xl transition-colors"
              >
                사전등록 신청하기
              </button>
            </div>
          )}
        </div>
      </Section>

      {/* ── Footer ── */}
      <footer className="bg-[#111] text-white/40 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div>
              <p className="text-white font-bold text-lg mb-2">르엘 시그니처</p>
              <p className="text-xs leading-relaxed">
                본 홈페이지의 내용은 편집과정에서 실제와 다를 수 있으며,<br />
                관련 법규 및 사업 여건 변경에 따라 변경될 수 있습니다.
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm mb-1">
                <Phone size={12} className="inline mr-1" />
                대표번호{" "}
                <a href="tel:1800-0000" className="text-[#b08d57] font-semibold">
                  1800-0000
                </a>
              </p>
              <p className="text-xs">
                견본주택: 서울특별시 OO구 OO동 일대
              </p>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-xs text-center">
            &copy; 2026 르엘 시그니처. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
