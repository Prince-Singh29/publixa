'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { assetPath } from '@/lib/paths';
import { Menu, X, Smartphone, ArrowRight, ExternalLink } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Our Apps', href: '/apps' },
    { name: 'Docs', href: '/docs' },
    { name: 'Sheets', href: '/excel' },
    { name: 'Slides', href: '/slides' },
    { name: 'PDF', href: '/pdf' },
    { name: 'Web Tools', href: '/tools' },
    { name: 'Privacy', href: '/privacy' },
    { name: 'Support', href: '/contact' },
  ];

  const isAppLandingPage = pathname.startsWith('/apps/') && pathname !== '/apps' && !pathname.endsWith('/privacy');
  if (isAppLandingPage) {
    return null;
  }

  const isActive = (href: string) => {
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FFFAF6]/92 backdrop-blur-md border-b border-[#F0DFD5] shadow-xs transition-all">
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          {/* Official Logo Brand */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 group">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-xl sm:rounded-2xl bg-white border border-[#F0DFD5] p-1 flex items-center justify-center shadow-xs group-hover:border-[#D94F1D] transition-colors overflow-hidden shrink-0">
              <Image
                src={assetPath('/images/publixa-logo.png')}
                alt="Publixa Official Logo"
                width={44}
                height={44}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl lg:text-2xl font-extrabold tracking-tight text-[#1A0F0A] leading-none font-heading">
                Publixa<span className="text-[#D94F1D]">.</span>
              </span>
              <span className="hidden sm:block text-[10px] font-bold text-[#8C7A70] uppercase tracking-widest mt-1">
                Apps • Privacy • Trust
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-xl text-[13px] font-bold tracking-tight transition-all ${
                    active
                      ? 'text-[#D94F1D] bg-[#FFF0E6] shadow-xs border border-[#FFDFC8]'
                      : 'text-[#3D2315] hover:text-[#D94F1D] hover:bg-[#FFF4ED]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Button - View on Google Play */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="https://play.google.com/store/apps/dev?id=8039529252659159135"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D94F1D] hover:bg-[#C4461A] text-white text-xs font-bold transition shadow-sm hover:shadow-md hover:scale-105 transform-gpu"
            >
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a2.41 2.41 0 0 1-.61-.399 2.37 2.37 0 0 1-.7-1.787V4a2.37 2.37 0 0 1 .7-1.787 2.41 2.41 0 0 1 .609-.399zm11.233 11.233l2.257-2.257-2.257-2.257-7.904-4.563 7.904 9.077zm1.189-1.189l3.328 1.921c.96.554.96 1.458 0 2.012l-3.328 1.921-2.257-2.257 2.257-2.257zm-1.189-1.189L6.938 1.591l7.904 9.078z"/>
              </svg>
              <span>Google Play</span>
              <svg className="w-3.5 h-3.5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#3D2315] hover:text-[#1A0F0A] hover:bg-[#FFF0E6] focus:outline-hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#F0DFD5] bg-[#FFFAF6]/98 backdrop-blur-md px-4 pt-3 pb-6 space-y-1.5 shadow-xl">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-bold transition ${
                  active
                    ? 'text-[#D94F1D] bg-[#FFF0E6] font-extrabold border border-[#FFDFC8]'
                    : 'text-[#3D2315] hover:bg-[#FFF4ED] hover:text-[#1A0F0A]'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-[#F0DFD5]">
            <a
              href="https://play.google.com/store/apps/dev?id=8039529252659159135"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#D94F1D] text-white text-sm font-bold shadow-md"
            >
              <span>View on Google Play Store</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
