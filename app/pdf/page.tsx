import React from 'react';
import type { Metadata } from 'next';
import { FileText, ShieldCheck } from 'lucide-react';
import PdfDirectoryClient from '@/components/webapp/PdfDirectoryClient';
import SuiteSeoSection from '@/components/webapp/SuiteSeoSection';

export const metadata: Metadata = {
  title: 'Publixa PDF Studio — 34 Free Offline Browser PDF Tools',
  description:
    'Merge, split, crop margins, reverse, ZIP burst, delete pages, rearrange, N-up grid, electronic signature, highlighter, Bates numbering, redact, flatten forms, sanitize metadata, extract links/images, dictation, CSV/JSON to PDF & scanner — 100% locally with zero uploads.',
  keywords: [
    'merge pdf online free',
    'split pdf',
    'compress pdf without quality loss',
    'sign pdf online free',
    'bates numbering pdf',
    'redact pdf online',
    'sanitize pdf metadata',
    'flatten pdf forms',
    'n-up pdf',
    '24 free pdf tools offline',
  ],
};

export default function PdfStudioPage() {
  return (
    <div className="w-full bg-[#FFFAF6] min-h-[calc(100vh-80px)] p-2 sm:p-4">
      <div className="w-full max-w-[1600px] mx-auto rounded-3xl bg-white border border-[#F0DFD5] shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#FFF4ED] via-[#FFF9F5] to-[#FFE8DC] border-b border-[#F0DFD5] px-4 sm:px-6 py-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#E5322D] text-white flex items-center justify-center shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-lg sm:text-2xl text-[#1A0F0A]">
                Publixa PDF Studio — All 34 Offline PDF Tools
              </h1>
              <p className="text-xs sm:text-sm text-[#665349]">
                Click any PDF tool below to open its clean, standalone page — Merge, Split, Sign, Bates, Redact, Compress &amp; more.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% Client-Side RAM • Zero Account Needed
          </span>
        </div>

        <div className="p-4 sm:p-6">
          <PdfDirectoryClient />
        </div>
      </div>

      <SuiteSeoSection focus="pdf" />
    </div>
  );
}
