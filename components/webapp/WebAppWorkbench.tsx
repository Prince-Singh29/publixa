'use client';

import React from 'react';
import Link from 'next/link';
import { Globe, Sparkles, ShieldCheck } from 'lucide-react';
import StylishNameStudio from './StylishNameStudio';
import PdfToolsSuite from './PdfToolsSuite';
import PptToolsSuite from './PptToolsSuite';
import ExcelToolsSuite from './ExcelToolsSuite';
import DocToolsSuite from './DocToolsSuite';
import VpnPrivacySuite from './VpnPrivacySuite';
import {
  PassportPhotoTool,
  WallpaperStudioTool,
  StatusMediaStudioTool,
} from './MediaWallpaperTools';
import {
  QrStudioTool,
  VoiceCalculatorTool,
  BirthdayReminderTool,
  ExpenseChecklistTool,
  GroceryChecklistTool,
  AllInOneToolbox,
} from './UtilityPlannerTools';
import {
  WordConnectGame,
  LiquidColorSortGame,
  ArrowEscapeGame,
  BubbleShooterGame,
  MusicStudioGame,
} from './CasualGamesSuite';

interface WebAppWorkbenchProps {
  slug: string;
  appName: string;
}

function getWebAppSubtitle(slug: string, appName: string): { title: string; subtitle: string } {
  if (slug === 'aim-headshot-sensitivity') {
    return {
      title: 'Stylish Name & Sensitivity Web Studio',
      subtitle: 'Create pro stylish gaming nicknames with 24+ fonts, symbols & clan tags, or calibrate sensitivity profiles directly in your browser.',
    };
  }
  if (slug === 'fff-diamond-guide') {
    return {
      title: 'Stylish Nickname & Diamond Planner Web Studio',
      subtitle: 'Design stylish gaming names with symbols & badges and plan diamond bundles directly from your browser.',
    };
  }
  if (
    slug === 'paperflow-pdf-tools' ||
    slug === 'sharp-pdf-tools' ||
    slug === 'pdf-reader-editor' ||
    slug === 'quick-ai-pdf-scan-read' ||
    slug === 'paper-ai-pdf-tts'
  ) {
    return {
      title: `${appName} — Interactive Web PDF Suite`,
      subtitle: 'Merge, split, convert images/text to PDF, watermark, rotate, scan, and listen with AI Voice (TTS) — 100% locally in your browser.',
    };
  }
  if (slug === 'ppt-reader' || slug === 'ppt-to-pdf-converter') {
    return {
      title: `${appName} — Web PowerPoint & Slide Studio`,
      subtitle: 'Create presentations (.pptx), inspect uploaded .pptx slide decks, generate decks from outlines, and convert slides to widescreen PDF.',
    };
  }
  if (slug === 'excel-reader-xls-file' || slug === 'excel-to-pdf-converter') {
    return {
      title: `${appName} — Web Spreadsheet & Converter Suite`,
      subtitle: 'Open .xlsx/.xls/.csv workbooks, edit cells inline, view live numeric totals, and export to .xlsx, .csv, .json, or styled PDF.',
    };
  }
  if (
    slug === 'doc-and-docx-reader' ||
    slug === 'doc-to-pdf-converter' ||
    slug === 'all-in-one-document-reader' ||
    slug === 'txt-reader'
  ) {
    return {
      title: `${appName} — Web Document Reader, Editor & Converter`,
      subtitle: 'Read .docx & text files with rich themes, edit or clean text, check live word counts, and export directly to PDF or Microsoft Word (.docx).',
    };
  }
  return {
    title: `${appName} — Interactive Web Edition`,
    subtitle: 'Try the browser-native web version of this Publixa application instantly — private, offline-capable, and zero uploads required.',
  };
}

export default function WebAppWorkbench({ slug, appName }: WebAppWorkbenchProps) {
  const headerInfo = getWebAppSubtitle(slug, appName);

  const renderApp = () => {
    switch (slug) {
      case 'aim-headshot-sensitivity':
        return <StylishNameStudio mode="gaming" appName={appName} />;
      case 'fff-diamond-guide':
        return <StylishNameStudio mode="diamond" appName={appName} />;

      // PDF Suite
      case 'paperflow-pdf-tools':
        return <PdfToolsSuite defaultTab="merge" appName={appName} />;
      case 'sharp-pdf-tools':
        return <PdfToolsSuite defaultTab="split" appName={appName} />;
      case 'pdf-reader-editor':
        return <PdfToolsSuite defaultTab="reader" appName={appName} />;
      case 'paper-ai-pdf-tts':
        return <PdfToolsSuite defaultTab="reader" appName={appName} />;
      case 'quick-ai-pdf-scan-read':
        return <PdfToolsSuite defaultTab="scan" appName={appName} />;

      // PPT Suite
      case 'ppt-reader':
        return <PptToolsSuite defaultTab="create" appName={appName} />;
      case 'ppt-to-pdf-converter':
        return <PptToolsSuite defaultTab="reader" appName={appName} />;

      // Excel Suite
      case 'excel-reader-xls-file':
        return <ExcelToolsSuite defaultMode="reader" appName={appName} />;
      case 'excel-to-pdf-converter':
        return <ExcelToolsSuite defaultMode="pdf" appName={appName} />;

      // DOC / TXT Suite
      case 'doc-and-docx-reader':
        return <DocToolsSuite mode="docx" appName={appName} />;
      case 'doc-to-pdf-converter':
        return <DocToolsSuite mode="doc2pdf" appName={appName} />;
      case 'all-in-one-document-reader':
        return <DocToolsSuite mode="all" appName={appName} />;
      case 'txt-reader':
        return <DocToolsSuite mode="txt" appName={appName} />;

      // Utility & Productivity Tools
      case 'all-in-one-tools':
        return <AllInOneToolbox />;
      case 'id-and-passport-photo-maker':
        return <PassportPhotoTool />;
      case 'qr-scanner-generator':
        return <QrStudioTool />;
      case 'smart-voice-calculator':
        return <VoiceCalculatorTool />;
      case 'birthday-reminder':
        return <BirthdayReminderTool />;
      case 'expense-checklist':
        return <ExpenseChecklistTool />;
      case 'grocery-checklist':
        return <GroceryChecklistTool />;
      case 'status-saver-video-downloader':
        return <StatusMediaStudioTool />;
      case 'wallpaper-pro-4k':
        return <WallpaperStudioTool />;

      // VPN & Privacy Security Lab
      case 'ghostx-vpn':
      case 'nebula-vpn':
      case 'net-go-vpn':
      case 'zolex-vpn':
      case 'zolex-vpn-pro-max':
        return <VpnPrivacySuite appName={appName} />;

      // Playable Casual Games
      case 'word-search-and-connect-game':
        return <WordConnectGame />;
      case 'liquid-color-sort':
        return <LiquidColorSortGame />;
      case 'arrows-escape-puzzle':
      case 'arrow-puzzle-challenge':
        return <ArrowEscapeGame />;
      case 'bubble-shooter-pop-puzzle':
        return <BubbleShooterGame />;
      case 'kids-piano-guitar-drums':
        return <MusicStudioGame />;

      default:
        return <AllInOneToolbox />;
    }
  };

  return (
    <div className="rounded-3xl bg-white border border-[#EED9CD] shadow-2xl shadow-[#D94F1D]/10 overflow-hidden ring-1 ring-black/5">
      {/* Studio Top Chrome Bar */}
      <div className="bg-[#1A0F0A] text-white px-5 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="ml-2 font-mono text-[11px] text-orange-200/80 hidden sm:inline">
            publixa.web/{slug}
          </span>
        </div>
        <Link
          href="/tools"
          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-orange-300 hover:text-white transition"
        >
          <Sparkles className="w-3 h-3" />
          <span>Open Full Web Tools Hub →</span>
        </Link>
      </div>

      {/* Studio Header */}
      <div className="bg-gradient-to-r from-[#FFF4ED] via-[#FFF9F5] to-[#FFE8DC] border-b border-[#F0DFD5] px-6 sm:px-8 py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#FFDFC8] text-[11px] font-bold uppercase tracking-wider text-[#D94F1D]">
            <Globe className="w-3.5 h-3.5" />
            <span>Interactive Web App Version</span>
            <span>•</span>
            <span className="text-emerald-700 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Zero Server Uploads
            </span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1A0F0A] tracking-tight">
            {headerInfo.title}
          </h2>
          <p className="font-body text-sm text-[#665349] max-w-3xl">
            {headerInfo.subtitle}
          </p>
        </div>

        {/* Quick Web Suite Cross-Links */}
        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-bold text-[#8C7A70] mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#D94F1D]" /> Suites:
          </span>
          {[
            { label: 'Stylish Name', href: '/apps/aim-headshot-sensitivity#web-app' },
            { label: 'PDF Tools', href: '/apps/paperflow-pdf-tools#web-app' },
            { label: 'PPT Tools', href: '/apps/ppt-reader#web-app' },
            { label: 'Excel Tools', href: '/apps/excel-reader-xls-file#web-app' },
            { label: 'DOC Tools', href: '/apps/doc-and-docx-reader#web-app' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1 rounded-full bg-white hover:bg-[#D94F1D] hover:text-white border border-[#E5CEC0] text-[11px] font-bold text-[#3D2315] transition"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Workbench Content */}
      <div className="p-5 sm:p-8">{renderApp()}</div>
    </div>
  );
}
