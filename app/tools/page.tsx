import React from 'react';
import type { Metadata } from 'next';
import { Sparkles, Globe } from 'lucide-react';
import WebToolsHubClient from '@/components/webapp/WebToolsHubClient';
import SuiteSeoSection from '@/components/webapp/SuiteSeoSection';

export const metadata: Metadata = {
  title: 'Publixa Web Tools Suite | 76+ Free Browser PDF, Image, Office & Creator Tools',
  description:
    'Run Publixa 34 PDF tools, Docs, Sheets, Slides, Image Compressor, SVG/PNG Converter, EXIF Stripper, EMI/SIP Calculator, QR Studio, Passport Photo & 4K Wallpaper tools directly in browser RAM with zero server uploads.',
  keywords: [
    'free online pdf tools offline',
    'google docs alternative no login',
    'google sheets alternative without account',
    'online powerpoint creator free',
    'stylish name generator gaming fonts',
    'publixa tools',
  ],
};

export default function ToolsHubPage() {
  return (
    <div className="w-full bg-[#FFFAF6] min-h-screen text-[#1A0F0A]">
      <section
        className="pt-14 pb-12 border-b border-[#F0DFD5]"
        style={{ background: 'linear-gradient(135deg, #FFFAF6 0%, #FFE8DC 100%)' }}
      >
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#FFDFC8] text-xs font-bold text-[#D94F1D] shadow-xs">
            <Globe className="w-3.5 h-3.5" />
            <span>Publixa Web Edition</span>
            <span>•</span>
            <Sparkles className="w-3.5 h-3.5" />
            <span>76+ Standalone Browser Tools</span>
          </div>

          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-[#1A0F0A] tracking-tight">
            All Publixa Web Tools in One Studio
          </h1>
          <p className="font-body text-sm sm:text-lg text-[#665349] max-w-2xl mx-auto">
            Create stylish names, edit &amp; convert PDF, PPT, Excel, and Word documents, generate QR codes, design 4K wallpapers, and play casual games directly in your browser.
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <WebToolsHubClient />
        </div>
      </section>

      <SuiteSeoSection focus="all" />
    </div>
  );
}

