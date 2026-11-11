'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Files,
  Scissors,
  Trash2,
  ListOrdered,
  FilePlus,
  LayoutGrid,
  PenTool,
  Image as ImageIcon,
  Stamp,
  PanelTop,
  Hash,
  Sparkles,
  ShieldAlert,
  RotateCw,
  Maximize,
  Minimize2,
  Wrench,
  Lock,
  Eraser,
  Info,
  ImagePlus,
  FilePlus2,
  Volume2,
  ScanLine,
  Search,
  ArrowRight,
  ShieldCheck,
  Crop,
  ArrowLeftRight,
  Archive,
  Highlighter,
  Link2,
  FileImage,
  Mic,
  Table,
  Braces,
} from 'lucide-react';
import { ALL_PDF_TOOLS, PdfCategory, PdfToolId } from '@/lib/seoToolsData';

const ICON_MAP: Record<PdfToolId, React.ComponentType<{ className?: string }>> = {
  merge: Files,
  split: Scissors,
  delete: Trash2,
  rearrange: ListOrdered,
  addpage: FilePlus,
  nup: LayoutGrid,
  sign: PenTool,
  addimage: ImageIcon,
  watermark: Stamp,
  headerfooter: PanelTop,
  pagenum: Hash,
  bates: Sparkles,
  redact: ShieldAlert,
  rotate: RotateCw,
  margin: Maximize,
  compress: Minimize2,
  repair: Wrench,
  flatten: Lock,
  sanitize: Eraser,
  metadata: Info,
  img2pdf: ImagePlus,
  create: FilePlus2,
  reader: Volume2,
  scan: ScanLine,
  crop: Crop,
  reverse: ArrowLeftRight,
  splitzip: Archive,
  highlighter: Highlighter,
  extractlinks: Link2,
  extractimages: FileImage,
  securityaudit: ShieldCheck,
  dictation: Mic,
  csv2pdf: Table,
  json2pdf: Braces,
};

export default function PdfDirectoryClient() {
  const [catFilter, setCatFilter] = useState<'All' | PdfCategory>('All');
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const q = query.toLowerCase().trim();
    return ALL_PDF_TOOLS.filter((t) => {
      const catOk = catFilter === 'All' || t.category === catFilter;
      const qOk =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.shortDesc.toLowerCase().includes(q) ||
        t.seoDescription.toLowerCase().includes(q);
      return catOk && qOk;
    });
  }, [catFilter, query]);

  return (
    <div className="space-y-6">
      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {(['All', 'Organize', 'Edit & Markup', 'Security & Clean', 'Create & Read'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCatFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                catFilter === cat
                  ? 'bg-[#1A0F0A] text-white'
                  : 'bg-[#FFF0E6] text-[#3D2315] hover:bg-[#FFE3D1]'
              }`}
            >
              {cat === 'All' ? `All ${ALL_PDF_TOOLS.length} PDF Tools` : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search PDF tools (merge, split, bates...)"
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#FFF9F5] border border-[#E5CEC0] focus:border-[#D94F1D] focus:outline-none text-xs font-semibold"
          />
        </div>
      </div>

      {/* In-Between Overview Strip */}
      <div className="rounded-2xl bg-gradient-to-r from-[#FFF9F5] to-[#FFF0E6] border border-[#FFDFC8] px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-[#3D2315] font-medium">
          Select any PDF utility below to launch its dedicated single-purpose browser page.
        </span>
        <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700">
          <ShieldCheck className="w-3.5 h-3.5" />
          Zero Server Uploads • Browser RAM Only
        </span>
      </div>

      {/* 24 Dedicated Tool Links Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {visible.map((tool) => {
          const Icon = ICON_MAP[tool.id];
          return (
            <Link
              key={tool.id}
              href={`/pdf/${tool.slug}`}
              className="group relative flex flex-col justify-between p-5 rounded-2xl bg-[#FFF9F5] hover:bg-white border border-[#F0DFD5] hover:border-[#D94F1D] transition-all shadow-2xs hover:shadow-lg"
            >
              {tool.badge && (
                <span className="absolute top-3.5 right-3.5 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold uppercase">
                  {tool.badge}
                </span>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#FFF0E6] group-hover:bg-[#E5322D] text-[#D94F1D] group-hover:text-white flex items-center justify-center transition shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-[#8C7A70]">
                      {tool.category}
                    </span>
                    <h2 className="font-heading font-extrabold text-base text-[#1A0F0A] group-hover:text-[#D94F1D] transition truncate">
                      {tool.title}
                    </h2>
                  </div>
                </div>

                <p className="text-xs text-[#665349] leading-relaxed line-clamp-3">
                  {tool.seoDescription}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F0DFD5]/80 flex items-center justify-between text-xs font-bold text-[#D94F1D]">
                <span>Open {tool.title}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

