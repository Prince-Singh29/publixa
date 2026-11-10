import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { assetPath } from '@/lib/paths';
import { getAppBySlug, getAllApps } from '@/lib/db';
import ScreenshotGallery from '@/components/ScreenshotGallery';
import WebAppWorkbench from '@/components/webapp/WebAppWorkbench';
import {
  ShieldCheck,
  ExternalLink,
  Lock,
  Mail,
  CheckCircle2,
  Users,
  ArrowLeft,
  Smartphone,
  Trash2,
  Info,
  Sparkles,
  Award,
  ChevronRight,
  Globe
} from 'lucide-react';

interface AppPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const apps = getAllApps();
  return apps.map((app) => ({
    slug: app.slug,
  }));
}

export async function generateMetadata({ params }: AppPageProps): Promise<Metadata> {
  const { slug } = await params;
  const app = getAppBySlug(slug);
  if (!app) {
    return {
      title: 'Application Not Found | Publixa',
    };
  }
  const description = app.shortDescription || app.longDescription?.slice(0, 160) || `${app.name} web tool and Android app by Publixa. Runs 100% locally in your browser with zero server uploads.`;
  return {
    title: `${app.name} — Free Online Web App & Android Guide | Publixa`,
    description,
    keywords: [
      app.name,
      `${app.name} online`,
      `${app.name} web app`,
      app.category,
      'Publixa',
      'client-side office tools',
      'no account',
      'privacy-first',
    ],
    openGraph: {
      title: `${app.name} | Publixa`,
      description,
      type: 'website',
    },
  };
}

// Helper to provide natural, contextual headlines matching the bizcraftapps style
function getAppHeadlines(app: { name: string; category: string; tagline?: string; shortDescription?: string }) {
  const name = app.name;
  if (name.includes('PPT') || name.includes('PowerPoint')) {
    return {
      heroHeadline: 'View PowerPoint Files Perfectly on Mobile',
      heroSub: app.tagline || 'Open and view your presentations anywhere with lightning-fast speed. Handle even the largest files smoothly while enjoying a clean, simple interface designed for mobile viewing.',
      featuresTitle: 'Everything you need for mobile presentations',
      screenshotsTitle: 'See how easy presentation viewing can be',
    };
  }
  if (name.includes('Excel') || name.includes('XLS')) {
    return {
      heroHeadline: 'View & Manage Spreadsheets on the Go',
      heroSub: app.tagline || 'Access sheets, formulas, and workbooks with zero network lag. Process high-density tables entirely offline on your mobile device.',
      featuresTitle: 'Complete spreadsheet power in your pocket',
      screenshotsTitle: 'Experience seamless workbook navigation',
    };
  }
  if (name.includes('PDF') || name.includes('Doc') || name.includes('Document')) {
    return {
      heroHeadline: 'Convert & Manage Documents with Speed',
      heroSub: app.tagline || 'Transform, view, and organize files directly on your device. Zero cloud uploads required, keeping 100% of your confidential documents private.',
      featuresTitle: 'All-in-one mobile document workstation',
      screenshotsTitle: 'Experience lightning-fast document processing',
    };
  }
  if (name.includes('VPN')) {
    return {
      heroHeadline: 'Unlimited High-Speed & Private Proxy',
      heroSub: app.tagline || 'Protect your online browsing with encrypted tunnels, fast global servers, and a strict no-logs policy designed for mobile autonomy.',
      featuresTitle: 'Bulletproof security and unrestricted speed',
      screenshotsTitle: 'Explore fast, one-tap connection screens',
    };
  }
  if (name.includes('SoundBox') || name.includes('Voice Alert')) {
    return {
      heroHeadline: 'Instant UPI Voice Alerts for Business',
      heroSub: app.tagline || 'Never miss a payment notification again. Receive crystal clear voice announcements in multiple languages the moment an alert arrives.',
      featuresTitle: 'Reliable audio alerts built for merchants',
      screenshotsTitle: 'See how simple payment monitoring is',
    };
  }
  if (name.includes('Puzzle') || name.includes('Game') || name.includes('Shooter') || name.includes('Piano')) {
    return {
      heroHeadline: `Enjoy Classic, Relaxing Entertainment Anywhere`,
      heroSub: app.tagline || app.shortDescription || 'Immerse yourself in clean, smooth mobile gameplay designed for casual fun without intrusive interruptions.',
      featuresTitle: 'Engineered for smooth, responsive gameplay',
      screenshotsTitle: 'Take a look inside the game interfaces',
    };
  }

  return {
    heroHeadline: app.tagline || `${name} for Android`,
    heroSub: app.shortDescription || 'Built with high performance, lightweight code, and total on-device privacy compliance.',
    featuresTitle: `Engineered for everyday excellence`,
    screenshotsTitle: `Experience ${name} in action`,
  };
}

export default async function AppPage({ params }: AppPageProps) {
  const { slug } = await params;
  const app = getAppBySlug(slug);

  if (!app) {
    notFound();
  }

  const isCustomIcon = app.icon && app.icon.startsWith('/');
  const headlines = getAppHeadlines(app);

  // Features list
  const featureList = app.features && app.features.length >= 4 ? app.features.slice(0, 4) : [
    { title: 'Lightning Fast Engine', desc: 'Optimized for modern Android architectures with near-zero latency and instant loading.' },
    { title: '100% On-Device Privacy', desc: 'Your personal data never leaves your device. All computations run inside your local sandbox.' },
    { title: 'Battery & RAM Efficient', desc: 'Designed with lightweight memory footprints and minimal background battery drain.' },
    { title: 'Ad-Friendly Experience', desc: 'Carefully tuned layout with non-intrusive banners, adhering strictly to Google Play safety standards.' },
  ];

  return (
    <div className="w-full bg-[#FFFAF6] min-h-screen text-[#1A0F0A] overflow-x-hidden font-body" suppressHydrationWarning>
      {/* 1. TOP APP-SPECIFIC NAVBAR - White with warm accents like bizcraftapps */}
      <header className="sticky top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[rgba(61,35,21,0.10)] transition-all">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Left: App Icon & Title */}
            <div className="flex items-center gap-3">
              <Link
                href="/apps"
                className="p-1.5 rounded-xl text-slate-500 hover:text-[#D94F1D] hover:bg-orange-50 transition"
                title="Back to all apps"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden shadow-sm border border-[rgba(61,35,21,0.12)] bg-slate-50 flex items-center justify-center shrink-0">
                  {isCustomIcon ? (
                    <Image
                      src={assetPath(app.icon)}
                      alt={`${app.name} icon`}
                      width={44}
                      height={44}
                      className="object-cover rounded-xl w-full h-full"
                    />
                  ) : (
                    <span className="text-2xl">{app.icon || '📱'}</span>
                  )}
                </div>
                <span className="font-heading font-bold text-base sm:text-lg text-[#1A0F0A] truncate max-w-[180px] sm:max-w-md">
                  {app.name}
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-[#1A0F0A]">
              <a href="#web-app" className="text-[#D94F1D] hover:text-[#C4461A] transition-colors flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>Web App</span>
              </a>
              <a href="#features" className="hover:text-[#D94F1D] transition-colors">Features</a>
              <a href="#screenshots" className="hover:text-[#D94F1D] transition-colors">Screenshots</a>
              <a href="#about" className="hover:text-[#D94F1D] transition-colors">About</a>
              <Link href={`/privacy/${app.slug}`} className="hover:text-[#D94F1D] transition-colors">Privacy</Link>
            </nav>

            {/* Right: Google Play Button */}
            <div className="flex items-center gap-3">
              {app.playStoreUrl && (
                <a
                  href={app.playStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-heading font-semibold text-xs sm:text-sm bg-[#D94F1D] hover:bg-[#C4461A] text-white shadow-md transition transform-gpu hover:scale-105"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a2.41 2.41 0 0 1-.61-.399 2.37 2.37 0 0 1-.7-1.787V4a2.37 2.37 0 0 1 .7-1.787 2.41 2.41 0 0 1 .609-.399zm11.233 11.233l2.257-2.257-2.257-2.257-7.904-4.563 7.904 9.077zm1.189-1.189l3.328 1.921c.96.554.96 1.458 0 2.012l-3.328 1.921-2.257-2.257 2.257-2.257zm-1.189-1.189L6.938 1.591l7.904 9.078z"/>
                  </svg>
                  <span>Install</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION - Warm Peach Gradient, Halo Glow Icon, Big Dark Typography */}
      <section
        id="hero"
        className="relative pt-12 pb-8 sm:pt-20 sm:pb-12"
        style={{
          background: 'linear-gradient(135deg, #FFFAF6 0%, #FFE8DC 100%)',
        }}
      >
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
            {/* App Icon with Halo Glow matching Bizcraft */}
            <div className="relative">
              <div
                className="absolute inset-0 rounded-full blur-3xl transform scale-150 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(242, 101, 34, 0.35), transparent 70%)',
                }}
              />
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl shadow-2xl bg-white p-1 border border-[rgba(61,35,21,0.15)] flex items-center justify-center overflow-hidden transform-gpu hover:scale-105 transition-transform duration-300">
                {isCustomIcon ? (
                  <Image
                    src={assetPath(app.icon)}
                    alt={`${app.name} icon`}
                    width={144}
                    height={144}
                    className="object-cover rounded-2xl w-full h-full"
                    priority
                  />
                ) : (
                  <span className="text-6xl">{app.icon || '📱'}</span>
                )}
              </div>
            </div>

            {/* Headline and Sub-headline */}
            <div className="space-y-4 max-w-3xl">
              <h1 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl leading-[1.15] text-[#1A0F0A] tracking-tight">
                {headlines.heroHeadline}
              </h1>
              <p className="font-body text-base sm:text-xl md:text-2xl text-[#3D2315] leading-relaxed font-normal">
                {headlines.heroSub}
              </p>
            </div>

            {/* Platform & Verified Developer Meta Pill */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-1">
              <div className="flex items-center gap-2 text-[#4A2E1F] font-semibold text-sm sm:text-base">
                <Smartphone className="w-5 h-5 text-[#D94F1D]" />
                <span>Official Android Application</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5 text-emerald-800 font-semibold text-sm sm:text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Verified Google Play Developer</span>
              </div>
            </div>

            {/* Google Play Button - Bold Orange Pill */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              {app.playStoreUrl ? (
                <a
                  href={app.playStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-10 py-4 sm:py-5 rounded-full font-heading font-bold text-lg sm:text-xl transition-all duration-300 transform-gpu hover:scale-105 shadow-xl bg-[#D94F1D] hover:bg-[#C4461A] text-white"
                >
                  <svg className="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M20.331 14.644l-13.794-13.831 17.55 10.075zM2.938 0c-0.813 0.425-1.356 1.2-1.356 2.206v27.581c0 1.006 0.544 1.781 1.356 2.206l16.038-16zM29.512 14.1l-3.681-2.131-4.106 4.031 4.106 4.031 3.756-2.131c1.125-0.893 1.125-2.906-0.075-3.8zM6.538 31.188l17.55-10.075-3.756-3.756z"/>
                  </svg>
                  <span>Get it on Google Play</span>
                </a>
              ) : (
                <div className="px-8 py-4 rounded-full font-heading font-bold text-base bg-slate-200 text-slate-700">
                  Published on Google Play
                </div>
              )}

              <a
                href="#web-app"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-heading font-bold text-base text-white bg-[#1A0F0A] hover:bg-[#3D2315] shadow-lg transition-all duration-300 transform-gpu hover:scale-105"
              >
                <Globe className="w-4 h-4 text-[#FF9F6E]" />
                <span>Use Web Version</span>
              </a>

              <Link
                href={`/privacy/${app.slug}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-heading font-semibold text-base text-[#1A0F0A] bg-white hover:bg-orange-50/60 border border-[rgba(61,35,21,0.15)] shadow-sm transition"
              >
                <Lock className="w-4 h-4 text-[#D94F1D]" />
                <span>Dedicated Privacy Policy</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Wave Divider at Bottom of Hero */}
        <div className="w-full overflow-hidden leading-none pt-12">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
            <path d="M0,64 C240,100 480,80 720,64 C960,48 1200,68 1440,84 L1440,120 L0,120 Z" fill="#FFF4ED" />
          </svg>
        </div>
      </section>

      {/* 2B. INTERACTIVE WEB APP VERSION SECTION */}
      <section
        id="web-app"
        className="relative py-12 md:py-20 scroll-mt-20"
        style={{
          background: 'linear-gradient(135deg, #FFF4ED 0%, #FFDFC8 100%)',
        }}
      >
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <WebAppWorkbench slug={app.slug} appName={app.name} />
        </div>

        {/* Wave Divider to Features Section */}
        <div className="w-full overflow-hidden leading-none pt-16">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
            <path d="M0,40 C320,110 640,30 960,70 C1280,110 1360,50 1440,60 L1440,120 L0,120 Z" fill="#FFFAF6" />
          </svg>
        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section
        id="features"
        className="relative py-16 md:py-24 scroll-mt-20"
        style={{
          background: 'linear-gradient(135deg, #FFFAF6 0%, #FFE8DC 100%)',
        }}
      >
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-center mb-12 md:mb-16 text-[#1A0F0A] tracking-tight">
            {headlines.featuresTitle}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {featureList.map((item, idx) => {
              const title = typeof item === 'string' ? item : item.title;
              const desc = typeof item === 'string' ? 'Engineered for smooth, high-fidelity operations without unnecessary complexity.' : item.desc;
              return (
                <div
                  key={idx}
                  className="relative group transform-gpu transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl rounded-2xl p-6 md:p-8 backdrop-blur-md"
                  style={{
                    backgroundColor: '#FFF0E6',
                    border: '1px solid rgba(242, 101, 34, 0.20)',
                  }}
                >
                  {/* Watermark Number */}
                  <div
                    className="font-heading font-bold text-6xl md:text-7xl mb-4 opacity-25 leading-none select-none"
                    style={{ color: '#D94F1D' }}
                  >
                    {String(idx + 1)}
                  </div>

                  <h3 className="font-heading font-bold text-xl text-[#1A0F0A] mb-2 leading-snug">
                    {title}
                  </h3>
                  <p className="font-body text-sm md:text-base text-[#3D2315] leading-relaxed">
                    {desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wave Divider to Screenshots Section */}
        <div className="w-full overflow-hidden leading-none pt-16">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
            <path d="M0,40 C320,110 640,30 960,70 C1280,110 1360,50 1440,60 L1440,120 L0,120 Z" fill="#FFF4ED" />
          </svg>
        </div>
      </section>

      {/* 4. SCREENSHOTS SECTION - Horizontal Snap Gallery with Clean Framing */}
      {app.screenshots && app.screenshots.length > 0 && (
        <section
          id="screenshots"
          className="relative py-16 md:py-24 scroll-mt-20"
          style={{
            background: 'linear-gradient(135deg, #FFF4ED 0%, #FFDFC8 100%)',
          }}
        >
          <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-center mb-4 text-[#1A0F0A] tracking-tight">
              {headlines.screenshotsTitle}
            </h2>
            <p className="text-center font-body text-base sm:text-lg text-[#3D2315] mb-12 max-w-xl mx-auto">
              Explore authentic high-resolution screenshots of {app.name}
            </p>

            {/* Interactive Screenshot Gallery with Navigation Arrows */}
            <ScreenshotGallery appName={app.name} screenshots={app.screenshots} />
          </div>

          {/* Wave Divider to About Section */}
          <div className="w-full overflow-hidden leading-none pt-16">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
              <path d="M0,64 C240,100 480,80 720,64 C960,48 1200,68 1440,84 L1440,120 L0,120 Z" fill="#FFF4ED" />
            </svg>
          </div>
        </section>
      )}

      {/* 5. ABOUT & TECHNICAL SPECIFICATIONS */}
      <section
        id="about"
        className="relative py-16 md:py-24 scroll-mt-20"
        style={{
          background: 'linear-gradient(135deg, #FFF4ED 0%, #FFDFC8 100%)',
        }}
      >
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-[#1A0F0A] tracking-tight">
              About {app.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Story Description */}
            <div className="lg:col-span-2 space-y-6">
              <div
                className="p-8 sm:p-10 rounded-3xl backdrop-blur-md space-y-5"
                style={{
                  backgroundColor: '#FFF0E6',
                  border: '1px solid rgba(242, 101, 34, 0.20)',
                }}
              >
                <h3 className="font-heading font-bold text-2xl text-[#1A0F0A]">
                  Overview &amp; Design Philosophy
                </h3>
                <p className="font-body text-base sm:text-lg text-[#3D2315] leading-relaxed">
                  {app.longDescription || app.shortDescription}
                </p>
                <p className="font-body text-base sm:text-lg text-[#3D2315] leading-relaxed">
                  Developed by Prince Kumar Singh under the <strong>Publixa</strong> brand, this application adheres to our privacy-first engineering philosophy. We ensure that personal files, user-generated content, and device sensors remain strictly localized to your hardware.
                </p>

                <div className="pt-4 border-t border-[rgba(61,35,21,0.12)] grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#1A0F0A]">
                    <ShieldCheck className="w-5 h-5 text-[#D94F1D]" />
                    <span>No Cloud File Uploads</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#1A0F0A]">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                    <span>Minimal Permissions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#1A0F0A]">
                    <Award className="w-5 h-5 text-[#D94F1D]" />
                    <span>Google Play Verified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Technical Specs Box */}
            <div
              className="p-6 sm:p-8 rounded-3xl space-y-4 shadow-sm"
              style={{
                backgroundColor: '#FFF0E6',
                border: '1px solid rgba(242, 101, 34, 0.20)',
              }}
            >
              <h4 className="font-heading font-bold text-lg text-[#1A0F0A] border-b border-[rgba(61,35,21,0.15)] pb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-[#D94F1D]" />
                <span>Technical Specifications</span>
              </h4>

              <div className="space-y-3.5 text-xs sm:text-sm">
                <div>
                  <span className="text-[#3D2315]/80 block font-medium">Package Identifier:</span>
                  <span className="font-mono text-[#D94F1D] font-bold text-xs break-all">{app.packageName}</span>
                </div>
                <div>
                  <span className="text-[#3D2315]/80 block font-medium">Legal Developer:</span>
                  <span className="text-[#1A0F0A] font-bold">Prince Kumar Singh (Publixa)</span>
                </div>
                <div>
                  <span className="text-[#3D2315]/80 block font-medium">Category:</span>
                  <span className="text-[#1A0F0A] font-semibold">{app.category}</span>
                </div>
                <div>
                  <span className="text-[#3D2315]/80 block font-medium">Last Release Verification:</span>
                  <span className="text-[#1A0F0A] font-semibold">{app.lastUpdated || 'September 2026'}</span>
                </div>
                <div>
                  <span className="text-[#3D2315]/80 block font-medium">Support Contact:</span>
                  <a href="mailto:publixaorignal@gmail.com" className="text-[#D94F1D] font-bold hover:underline">
                    publixaorignal@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. REGULATORY & DATA DELETION ACTIONS */}
      <section
        id="privacy"
        className="relative py-12 md:py-16"
        style={{
          background: 'linear-gradient(135deg, #FFFAF6 0%, #FFE8DC 100%)',
        }}
      >
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="p-8 sm:p-10 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-md"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(61, 35, 21, 0.15)',
            }}
          >
            <div className="space-y-1.5 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#D94F1D] text-xs font-bold mb-1">
                <Lock className="w-3.5 h-3.5" />
                <span>Privacy &amp; Data Rights Compliance</span>
              </div>
              <h3 className="font-heading font-bold text-2xl text-[#1A0F0A]">
                Dedicated Privacy Policy &amp; Data Deletion
              </h3>
              <p className="font-body text-sm sm:text-base text-[#3D2315] max-w-2xl">
                Inspect specific Android manifest permissions for {app.name} or submit a permanent data purge request directly through our compliance desk.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
              <Link
                href={`/privacy/${app.slug}`}
                className="w-full sm:w-auto text-center px-6 py-3.5 rounded-full bg-[#1A0F0A] hover:bg-[#3D2315] text-white text-xs sm:text-sm font-bold transition shadow-sm"
              >
                View Privacy Policy
              </Link>
              <Link
                href={`/data-deletion?app=${encodeURIComponent(app.name)}&pkg=${encodeURIComponent(app.packageName)}`}
                className="w-full sm:w-auto text-center px-6 py-3.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-bold transition shadow-sm flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Data Deletion</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
