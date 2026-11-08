'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import AppCard from '@/components/AppCard';
import { PublixaApp } from '@/lib/types';
import { Search, Filter, Smartphone, ShieldCheck, ExternalLink } from 'lucide-react';

import storeData from '@/data/store.json';

export default function AppsDirectoryPage() {
  const initialApps = (storeData.apps || []) as PublixaApp[];
  const [apps, setApps] = useState<PublixaApp[]>(initialApps);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(false);

  const categories = useMemo(() => {
    const set = new Set<string>();
    apps.forEach((a) => a.category && set.add(a.category));
    return ['All', ...Array.from(set).sort()];
  }, [apps]);

  const filteredApps = useMemo(() => {
    return apps
      .filter((app) => {
        const matchesSearch =
          !searchTerm ||
          app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
  }, [apps, searchTerm, selectedCategory]);

  return (
    <div className="w-full bg-[#FFFAF6] min-h-screen text-[#1A0F0A] py-12 lg:py-16">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#F0DFD5]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0E6] border border-[#FFDFC8] text-[#D94F1D] text-xs font-bold mb-3">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Full Application Directory</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-[#1A0F0A] tracking-tight font-heading">
              Publixa Applications
            </h1>
            <p className="mt-2 text-[#665349] text-sm sm:text-base max-w-3xl leading-relaxed">
              Explore and verify all {apps.length} official Android applications developed by Prince Developer under the Publixa brand.
            </p>
          </div>

          <a
            href="https://play.google.com/store/apps/dev?id=8039529252659159135"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D94F1D] hover:bg-[#C4461A] text-white text-xs sm:text-sm font-bold transition shadow-sm shrink-0"
          >
            <span>View Developer on Google Play</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              const count = cat === 'All' ? apps.length : apps.filter((a) => a.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition cursor-pointer ${
                    isSelected
                      ? 'bg-[#D94F1D] text-white shadow-md shadow-[#D94F1D]/25'
                      : 'bg-white hover:bg-[#FFF9F5] text-[#3D2315] border border-[#F0DFD5]'
                  }`}
                >
                  {cat} <span className="opacity-75 text-[11px]">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by app name or package..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-[#F0DFD5] bg-white text-[#1A0F0A] text-xs sm:text-sm placeholder-[#8C7A70] focus:outline-hidden focus:ring-2 focus:ring-[#D94F1D]/20 focus:border-[#D94F1D] transition shadow-xs"
            />
          </div>
        </div>

        {/* Apps Grid - 6 columns */}
        {loading ? (
          <div className="py-24 text-center text-[#8C7A70] text-sm">
            Loading Publixa application directory...
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-[#F0DFD5] p-8 shadow-xs">
            <Smartphone className="w-12 h-12 text-[#8C7A70] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#1A0F0A]">No applications found</h3>
            <p className="text-xs text-[#665349] mt-1">
              Try adjusting your search query or category filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {filteredApps.map((app) => (
              <AppCard key={app.id || app.slug} app={app} />
            ))}
          </div>
        )}

        {/* Verification notice box */}
        <div className="bg-white rounded-2xl p-6 border border-[#F0DFD5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FFF0E6] text-[#D94F1D] flex items-center justify-center shrink-0 border border-[#FFDFC8]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1A0F0A]">
                Official Google Play Developer Portfolio
              </h4>
              <p className="text-xs text-[#665349] mt-0.5">
                Every application operates with its own permanent verification landing page and individual dedicated privacy policy.
              </p>
            </div>
          </div>
          <Link
            href="/privacy"
            className="text-xs font-bold px-4 py-2.5 rounded-full bg-[#D94F1D] hover:bg-[#C4461A] text-white shrink-0 transition shadow-xs"
          >
            Explore Privacy Directory
          </Link>
        </div>
      </div>
    </div>
  );
}
