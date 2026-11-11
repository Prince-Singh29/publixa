'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  FileText,
  Presentation,
  FileSpreadsheet,
  FileEdit,
  Wrench,
  Sparkles,
  Shield,
  Gamepad2,
  Search,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { ALL_PDF_TOOLS, ALL_WEB_TOOLS } from '@/lib/seoToolsData';

type ToolCategoryFilter =
  | 'All'
  | 'PDF Tools'
  | 'Document & Office'
  | 'Creator & Media'
  | 'Everyday Utilities'
  | 'Privacy & Games';

interface DirectoryEntry {
  key: string;
  title: string;
  subCategory: string;
  filterGroup: Exclude<ToolCategoryFilter, 'All'>;
  shortDesc: string;
  seoDescription: string;
  href: string;
  badge?: string;
  accentBg: string;
  accentText: string;
}

export default function WebToolsHubClient() {
  const [catFilter, setCatFilter] = useState<ToolCategoryFilter>('All');
  const [query, setQuery] = useState('');

  const allEntries = useMemo<DirectoryEntry[]>(() => {
    const pdfEntries: DirectoryEntry[] = ALL_PDF_TOOLS.map((t) => ({
      key: `pdf-${t.slug}`,
      title: t.title,
      subCategory: `PDF • ${t.category}`,
      filterGroup: 'PDF Tools',
      shortDesc: t.shortDesc,
      seoDescription: t.seoDescription,
      href: `/pdf/${t.slug}`,
      badge: t.badge,
      accentBg: 'bg-rose-50 group-hover:bg-[#E5322D]',
      accentText: 'text-[#E5322D] group-hover:text-white',
    }));

    const webEntries: DirectoryEntry[] = ALL_WEB_TOOLS.map((t) => {
      let filterGroup: Exclude<ToolCategoryFilter, 'All'> = 'Everyday Utilities';
      let accentBg = 'bg-[#FFF0E6] group-hover:bg-[#D94F1D]';
      let accentText = 'text-[#D94F1D] group-hover:text-white';

      if (t.category === 'Document Suite' || t.category === 'Spreadsheet Suite' || t.category === 'Presentation Suite') {
        filterGroup = 'Document & Office';
        accentBg = 'bg-blue-50 group-hover:bg-blue-600';
        accentText = 'text-blue-600 group-hover:text-white';
      } else if (t.category === 'Creator & Media') {
        filterGroup = 'Creator & Media';
        accentBg = 'bg-amber-50 group-hover:bg-amber-600';
        accentText = 'text-amber-700 group-hover:text-white';
      } else if (t.category === 'Privacy & Security' || t.category === 'Web Games') {
        filterGroup = 'Privacy & Games';
        accentBg = 'bg-emerald-50 group-hover:bg-emerald-600';
        accentText = 'text-emerald-700 group-hover:text-white';
      }

      return {
        key: `web-${t.slug}`,
        title: t.title,
        subCategory: t.category,
        filterGroup,
        shortDesc: t.shortDesc,
        seoDescription: t.seoDescription,
        href: `/tools/${t.slug}`,
        accentBg,
        accentText,
      };
    });

    return [...pdfEntries, ...webEntries];
  }, []);

  const visible = useMemo(() => {
    const q = query.toLowerCase().trim();
    return allEntries.filter((item) => {
      const catOk = catFilter === 'All' || item.filterGroup === catFilter;
      const qOk =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.subCategory.toLowerCase().includes(q) ||
        item.shortDesc.toLowerCase().includes(q) ||
        item.seoDescription.toLowerCase().includes(q);
      return catOk && qOk;
    });
  }, [allEntries, catFilter, query]);

  const getIcon = (item: DirectoryEntry) => {
    if (item.filterGroup === 'PDF Tools') return FileText;
    if (item.subCategory === 'Document Suite') return FileEdit;
    if (item.subCategory === 'Spreadsheet Suite') return FileSpreadsheet;
    if (item.subCategory === 'Presentation Suite') return Presentation;
    if (item.subCategory === 'Creator & Media') return Sparkles;
    if (item.subCategory === 'Privacy & Security') return Shield;
    if (item.subCategory === 'Web Games') return Gamepad2;
    return Wrench;
  };

  return (
    <div className="space-y-6">
      {/* Category Pills & Live Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {(
            ['All', 'PDF Tools', 'Document & Office', 'Creator & Media', 'Everyday Utilities', 'Privacy & Games'] as const
          ).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCatFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                catFilter === cat
                  ? 'bg-[#D94F1D] text-white shadow-sm'
                  : 'bg-white border border-[#F0DFD5] text-[#3D2315] hover:border-[#D94F1D]'
              }`}
            >
              {cat === 'All' ? `All Tools (${allEntries.length})` : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 76+ tools (merge pdf, crop, compress image, excel, qr...)"
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-[#E5CEC0] focus:border-[#D94F1D] focus:outline-none text-xs font-semibold"
          />
        </div>
      </div>

      {/* In-Between Info Strip */}
      <div className="rounded-2xl bg-gradient-to-r from-[#FFF9F5] to-[#FFF0E6] border border-[#FFDFC8] px-4 sm:px-5 py-3.5 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-[#3D2315] font-medium">
          Click any tool card below to open its clean, full standalone page with zero distractions.
        </span>
        <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700">
          <ShieldCheck className="w-4 h-4" />
          100% Client-Side RAM • No Account Needed
        </span>
      </div>

      {/* Every Single Tool Linked to Its Own Standalone Page */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {visible.map((item) => {
          const Icon = getIcon(item);
          return (
            <Link
              key={item.key}
              href={item.href}
              className="group relative flex flex-col justify-between p-5 rounded-2xl bg-white border border-[#F0DFD5] hover:border-[#D94F1D] transition-all shadow-xs hover:shadow-lg"
            >
              {item.badge && (
                <span className="absolute top-3.5 right-3.5 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold uppercase">
                  {item.badge}
                </span>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition shrink-0 ${item.accentBg} ${item.accentText}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-[#8C7A70] truncate">
                      {item.subCategory}
                    </span>
                    <h3 className="font-heading font-extrabold text-sm sm:text-base text-[#1A0F0A] group-hover:text-[#D94F1D] transition truncate">
                      {item.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-[#665349] leading-relaxed line-clamp-3">
                  {item.seoDescription}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F0DFD5] flex items-center justify-between text-xs font-bold text-[#D94F1D]">
                <span>Open Standalone Tool</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
