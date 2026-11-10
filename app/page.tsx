import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { assetPath } from '@/lib/paths';
import { getAllApps } from '@/lib/db';
import HomeAppGrid from '@/components/HomeAppGrid';
import SuiteSeoSection from '@/components/webapp/SuiteSeoSection';
import {
  ShieldCheck,
  Smartphone,
  Lock,
  Trash2,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  FolderOpen,
  Globe,
  Sparkles,
  FileText,
  Presentation,
  FileSpreadsheet,
  FileEdit
} from 'lucide-react';

export default function HomePage() {
  const apps = getAllApps();

  return (
    <div className="w-full bg-[#FFFAF6] min-h-screen text-[#1A0F0A] overflow-x-hidden" suppressHydrationWarning>
      {/* 1. HERO SECTION - Ambient Peach Ribbon Video Background */}
      <section
        id="home-hero"
        className="relative pt-20 pb-28 md:pt-28 md:pb-36 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #FFFAF6 0%, #FFE8DC 100%)',
        }}
      >
        {/* Flowing peach wave video background + readability veil */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            className="w-full h-full object-cover opacity-85"
          >
            <source src={assetPath('/videos/hero-bg.mp4')} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#FFFAF6]/55 via-[#FFFAF6]/35 to-[#FFFAF6]/85" />
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-tr from-[#D94F1D]/10 via-[#F59E0B]/10 to-transparent blur-3xl rounded-full" />
        </div>

        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
            {/* Developer pill badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/80 border border-[#FFDFC8] text-xs font-bold text-[#D94F1D] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#D94F1D] animate-pulse" />
              <span>Official Google Play Developer</span>
              <span className="text-[#8C7A70]">•</span>
              <span className="font-mono text-[#D94F1D]">Prince Developer</span>
            </div>

            {/* Huge bold title */}
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight text-[#1A0F0A] tracking-tight">
              Publixa Apps
            </h1>

            {/* Tagline matching reference style */}
            <p className="font-body text-base sm:text-xl md:text-2xl max-w-3xl text-[#3D2315] font-normal leading-relaxed">
              Reliable apps designed to make everyday tasks easier. Simple tools, polished experience, real value.
            </p>

            {/* Hero Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <a
                href="#android-grid"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#D94F1D] hover:bg-[#C4461A] text-white font-bold transition shadow-lg shadow-[#D94F1D]/25 hover:shadow-[#D94F1D]/35 text-sm transform-gpu hover:scale-105"
              >
                <Smartphone className="w-4 h-4" />
                <span>Explore Android Apps ({apps.length})</span>
              </a>

              <Link
                href="/tools"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#1A0F0A] hover:bg-[#3D2315] text-white font-bold transition text-sm transform-gpu hover:scale-105 shadow-lg"
              >
                <Globe className="w-4 h-4 text-[#FF9F6E]" />
                <span>Open Free Web Tools (65+)</span>
              </Link>

              <a
                href="https://play.google.com/store/apps/dev?id=8039529252659159135"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white hover:bg-[#FFF0E6] text-[#1A0F0A] font-bold border border-[#F0DFD5] transition text-sm transform-gpu hover:scale-105 shadow-xs"
              >
                <span>View on Google Play</span>
                <ExternalLink className="w-4 h-4 text-[#D94F1D]" />
              </a>

              <Link
                href="/privacy"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white/80 hover:bg-white text-[#3D2315] font-bold border border-[#F0DFD5] transition text-sm shadow-xs"
              >
                <Lock className="w-4 h-4 text-[#D94F1D]" />
                <span>Privacy Directory</span>
              </Link>
            </div>

            {/* Metrics Bar */}
            <div className="pt-10 border-t border-[#F0DFD5] w-full grid grid-cols-2 sm:grid-cols-4 gap-6 text-center" suppressHydrationWarning>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-[#1A0F0A]">{`${apps.length} Verified`}</div>
                <div className="text-xs font-semibold text-[#8C7A70] uppercase mt-1">Published Apps</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-[#1A0F0A]">100% Offline</div>
                <div className="text-xs font-semibold text-[#8C7A70] uppercase mt-1">Private Processing</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-[#1A0F0A]">Play Protect</div>
                <div className="text-xs font-semibold text-[#8C7A70] uppercase mt-1">Verified &amp; Safe</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-[#1A0F0A]">Prince Developer</div>
                <div className="text-xs font-semibold text-[#8C7A70] uppercase mt-1">Verified Developer</div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider like bizcraftapps.com */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path
              d="M0,64 C240,100 480,80 720,64 C960,48 1200,68 1440,84 L1440,120 L0,120 Z"
              fill="#FFF4ED"
            />
          </svg>
        </div>
      </section>

      {/* 2. WEB TOOLS QUICK-LAUNCH + ANDROID APPS GRID */}
      <section className="bg-[#FFF4ED] border-b border-[#F0DFD5]">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-2">
          <div className="rounded-3xl bg-white border border-[#EED9CD] p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0E6] text-[#D94F1D] text-[11px] font-bold uppercase tracking-wider mb-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Try Instant Web Versions</span>
                </div>
                <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#1A0F0A]">
                  Use Publixa Tools Directly on the Website
                </h2>
              </div>
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D94F1D] hover:bg-[#C4461A] text-white text-xs font-bold transition shadow-xs self-start md:self-auto"
              >
                <span>Open All 65+ Web Tools</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                { title: 'Stylish Name Creator', desc: '24+ Fonts, Wings & Clan Badges', href: '/tools/stylish-name-generator', icon: Sparkles, color: '#D94F1D' },
                { title: '24-in-1 PDF Studio', desc: 'Merge, Sign, Redact, Bates & Compress', href: '/pdf', icon: FileText, color: '#E5322D' },
                { title: 'Publixa Slides (PPT)', desc: 'Create .PPTX, Charts & Slideshows', href: '/slides', icon: Presentation, color: '#F4B400' },
                { title: 'Publixa Sheets (Excel)', desc: 'Formulas, Charts & .XLSX / PDF', href: '/excel', icon: FileSpreadsheet, color: '#0F9D58' },
                { title: 'Publixa Docs (Word)', desc: 'WYSIWYG Editor, Outline, .DOCX/PDF', href: '/docs', icon: FileEdit, color: '#1A73E8' },
              ].map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="group p-4 rounded-2xl bg-[#FFF9F5] hover:bg-white border border-[#F0DFD5] hover:border-[#D94F1D] hover:shadow-md transition flex items-start gap-3"
                  >
                    <div
                      className="w-9 h-9 rounded-xl text-white flex items-center justify-center shrink-0 shadow-2xs"
                      style={{ backgroundColor: tool.color }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-xs sm:text-sm text-[#1A0F0A] group-hover:text-[#D94F1D] transition truncate">
                        {tool.title}
                      </h3>
                      <p className="text-[11px] text-[#665349] mt-0.5 line-clamp-2">{tool.desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <HomeAppGrid apps={apps} />
      </section>

      {/* 3. VERIFICATION & TRUST SECTION */}
      <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-[#FFFAF6]">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#D94F1D] mb-2">
            Transparency &amp; Legal Compliance
          </h2>
          <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-[#1A0F0A]">
            Developer Verification &amp; Trust
          </h3>
          <p className="mt-3 text-[#665349] text-sm sm:text-base leading-relaxed">
            Every application published under Publixa adheres to Google Play developer program policies, user data minimization, and transparent privacy practices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white border border-[#F0DFD5] rounded-2xl p-7 hover:border-[#D94F1D] transition-all shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-[#FFF0E6] text-[#D94F1D] flex items-center justify-center mb-5 border border-[#FFDFC8]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-[#1A0F0A] mb-2">Verified Developer Information</h4>
            <p className="text-sm text-[#665349] leading-relaxed mb-4">
              Clear information about the legal owner and brand behind every published document and utility app.
            </p>
            <div className="bg-[#FFF9F5] rounded-xl p-3.5 text-xs text-[#3D2315] space-y-1.5 font-mono border border-[#F0DFD5]">
              <div><strong className="text-[#1A0F0A] font-sans">Legal Owner:</strong> Prince Kumar Singh</div>
              <div><strong className="text-[#1A0F0A] font-sans">Trade Name:</strong> Publixa</div>
              <div><strong className="text-[#1A0F0A] font-sans">Profile:</strong> Google Play Verified</div>
            </div>
            <Link
              href="/about"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#D94F1D] hover:text-[#C4461A]"
            >
              <span>Learn more about Publixa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-[#F0DFD5] rounded-2xl p-7 hover:border-[#D94F1D] transition-all shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5 border border-amber-200">
              <FolderOpen className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-[#1A0F0A] mb-2">Individual App Documentation</h4>
            <p className="text-sm text-[#665349] leading-relaxed mb-4">
              View all {apps.length} applications with verified package IDs, real screenshots, and declared permissions.
            </p>
            <div className="bg-[#FFF9F5] rounded-xl p-3.5 text-xs text-[#3D2315] space-y-1.5 font-mono border border-[#F0DFD5]">
              <div><strong className="text-[#1A0F0A] font-sans">Directory:</strong> {apps.length} Active Apps</div>
              <div><strong className="text-[#1A0F0A] font-sans">Screenshots:</strong> Real App Previews</div>
              <div><strong className="text-[#1A0F0A] font-sans">Audit Status:</strong> Verified Policy Ready</div>
            </div>
            <Link
              href="/apps"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700"
            >
              <span>Browse application directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-[#F0DFD5] rounded-2xl p-7 hover:border-[#D94F1D] transition-all shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 border border-emerald-200">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-[#1A0F0A] mb-2">Privacy &amp; Data Protection</h4>
            <p className="text-sm text-[#665349] leading-relaxed mb-4">
              Dedicated privacy policy URLs for every single app, explaining local storage handling and zero sale of personal data.
            </p>
            <div className="bg-[#FFF9F5] rounded-xl p-3.5 text-xs text-[#3D2315] space-y-1.5 font-mono border border-[#F0DFD5]">
              <div><strong className="text-[#1A0F0A] font-sans">Coverage:</strong> Dedicated URL per app</div>
              <div><strong className="text-[#1A0F0A] font-sans">Data Selling:</strong> Zero selling policy</div>
              <div><strong className="text-[#1A0F0A] font-sans">Children:</strong> COPPA / Under 13 safe</div>
            </div>
            <Link
              href="/privacy"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700"
            >
              <span>View privacy directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-[#F0DFD5] rounded-2xl p-7 hover:border-[#D94F1D] transition-all shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-5 border border-rose-200">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-[#1A0F0A] mb-2">Data Deletion Request Portal</h4>
            <p className="text-sm text-[#665349] leading-relaxed mb-4">
              Request permanent deletion of any contact messages or advertising identifier telemetry with full confirmation.
            </p>
            <div className="bg-[#FFF9F5] rounded-xl p-3.5 text-xs text-[#3D2315] space-y-1.5 font-mono border border-[#F0DFD5]">
              <div><strong className="text-[#1A0F0A] font-sans">Support:</strong> publixaorignal@gmail.com</div>
              <div><strong className="text-[#1A0F0A] font-sans">Turnaround:</strong> 7 to 14 business days</div>
              <div><strong className="text-[#1A0F0A] font-sans">Workflow:</strong> Direct web submission</div>
            </div>
            <Link
              href="/data-deletion"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700"
            >
              <span>Submit deletion request</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 5 */}
          <div className="bg-white border border-[#F0DFD5] rounded-2xl p-7 hover:border-[#D94F1D] transition-all shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-5 border border-sky-200">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-[#1A0F0A] mb-2">Direct Developer Support</h4>
            <p className="text-sm text-[#665349] leading-relaxed mb-4">
              Direct communication line to developer Prince Kumar Singh for troubleshooting, inquiries, and policy questions.
            </p>
            <div className="bg-[#FFF9F5] rounded-xl p-3.5 text-xs text-[#3D2315] space-y-1.5 font-mono border border-[#F0DFD5]">
              <div><strong className="text-[#1A0F0A] font-sans">Lead:</strong> Prince Kumar Singh</div>
              <div><strong className="text-[#1A0F0A] font-sans">Response:</strong> Within 24-48 hours</div>
              <div><strong className="text-[#1A0F0A] font-sans">Email:</strong> publixaorignal@gmail.com</div>
            </div>
            <Link
              href="/contact"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700"
            >
              <span>Contact developer support</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 6 */}
          <div className="bg-gradient-to-br from-[#FFF0E6] via-white to-white border border-[#FFDFC8] rounded-2xl p-7 flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#D94F1D] text-white flex items-center justify-center mb-5 shadow-md shadow-[#D94F1D]/25">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#1A0F0A] mb-2">Google Play Verified Profile</h4>
              <p className="text-sm text-[#665349] leading-relaxed">
                All Publixa apps are distributed officially through the Google Play Store with verified developer identity, Play Protect scanning, and automatic security updates.
              </p>
            </div>
            <a
              href="https://play.google.com/store/apps/dev?id=8039529252659159135"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#D94F1D] hover:bg-[#C4461A] text-white text-xs font-bold transition shadow-xs"
            >
              <span>Open Developer Profile</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* 3B. COMPLETE WEB TOOLS SEO DIRECTORY & FAQ */}
      <div className="bg-[#FFFAF6] border-t border-[#F0DFD5]">
        <SuiteSeoSection focus="all" />
      </div>

      {/* 4. BOTTOM CTA */}
      <section className="border-t border-[#F0DFD5] py-16" style={{ background: 'linear-gradient(135deg, #FFF4ED 0%, #FFDFC8 100%)' }}>
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A0F0A] tracking-tight">
            Discover the Publixa Mobile Suite
          </h2>
          <p className="text-[#665349] max-w-2xl mx-auto text-sm sm:text-base">
            Simple, high-performance utilities and entertainment tools designed to put user privacy first.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="https://play.google.com/store/apps/dev?id=8039529252659159135"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#D94F1D] hover:bg-[#C4461A] text-white font-bold transition shadow-lg shadow-[#D94F1D]/25 text-sm"
            >
              <span>Explore on Google Play</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <Link
              href="/privacy"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white hover:bg-[#FFF9F5] text-[#1A0F0A] font-bold border border-[#F0DFD5] transition text-sm shadow-xs"
            >
              <Lock className="w-4 h-4 text-[#D94F1D]" />
              <span>Browse Privacy Policies</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
