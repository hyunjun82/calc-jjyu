'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTheme } from './ThemeProvider';
import {
  Building2,
  Receipt,
  Landmark,
  Briefcase,
  Moon,
  Sun,
  Menu,
  X,
  Search,
} from 'lucide-react';

const categories = [
  { name: '부동산', href: '/#estate', id: 'estate', icon: Building2 },
  { name: '세금', href: '/#tax', id: 'tax', icon: Receipt },
  { name: '금융', href: '/#finance', id: 'finance', icon: Landmark },
  { name: '근로', href: '/#labor', id: 'labor', icon: Briefcase },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        scrolled
          ? 'border-b border-border'
          : 'border-b border-transparent'
      }`}
      style={{
        backgroundColor: 'var(--header-blur)',
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
      }}
    >
      <div className="mx-auto max-w-[1200px] px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-fg flex items-center justify-center">
            <span className="text-xs font-bold" style={{ color: 'var(--bg)' }}>C</span>
          </div>
          <span className="text-[15px] font-semibold text-fg tracking-tight">
            calc.jjyu
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-fg-secondary hover:text-fg rounded-lg hover:bg-surface-hover transition-colors"
            >
              <cat.icon size={14} strokeWidth={1.8} />
              {cat.name}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-1">
          {/* Theme Toggle */}
          <button
            onClick={toggle}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-fg-secondary hover:text-fg hover:bg-surface-hover transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-fg-secondary hover:text-fg hover:bg-surface-hover transition-colors"
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border" style={{ backgroundColor: 'var(--header-blur)' }}>
          <nav className="mx-auto max-w-[1200px] px-6 py-3 flex flex-col gap-0.5">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={cat.href}
                className="flex items-center gap-2.5 px-3 py-2.5 text-[14px] font-medium text-fg-secondary hover:text-fg rounded-lg hover:bg-surface-hover transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <cat.icon size={16} strokeWidth={1.8} />
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
