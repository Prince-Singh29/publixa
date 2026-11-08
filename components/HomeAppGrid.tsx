'use client';

import React, { useState, useMemo } from 'react';
import { PublixaApp } from '@/lib/types';
import AppCard from './AppCard';
import { Search, Sparkles, Filter } from 'lucide-react';

interface HomeAppGridProps {
  apps: PublixaApp[];
}

export default function HomeAppGrid({ apps }: HomeAppGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = useMemo(() => {
    const cats = new Set<string>();
    apps.forEach((a) => cats.add(a.category));
    return ['All', ...Array.from(cats).sort()];
  }, [apps]);

  const filteredApps = useMemo(() => {
    return apps
      .filter((app) => {
        const matchesCat = selectedCategory === 'All' || app.category === selectedCategory;
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          app.name.toLowerCase().includes(q) ||
          app.packageName.toLowerCase().includes(q) ||
          app.shortDescription.toLowerCase().includes(q);
        return matchesCat && matchesSearch;
      })
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
  }, [apps, selectedCategory, searchQuery]);

  return (
    <div id="android-grid" className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF0E6] border border-[#FFDFC8] text-[#D94F1D] text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Full Application Portfolio</span>
        </div>
        <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#1A0F0A] tracking-tight">
          Android Apps
        </h2>
        <p className="mt-3 text-sm sm:text-base text-[#665349] leading-relaxed">
          Explore all {apps.length} verified mobile applications crafted by Publixa. Every app features individual permissions, real screenshots, and dedicated privacy policies.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = cat === 'All' ? apps.length : apps.filter((a) => a.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#D94F1D] text-white shadow-md shadow-[#D94F1D]/25 scale-102'
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
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7A70]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or package..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-white border border-[#F0DFD5] text-[#1A0F0A] text-xs sm:text-sm placeholder-[#8C7A70] focus:outline-hidden focus:border-[#D94F1D] focus:ring-2 focus:ring-[#D94F1D]/20 transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Apps Grid - 6 columns across full screen width */}
      {filteredApps.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {filteredApps.map((app) => (
            <AppCard key={app.id || app.slug} app={app} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#F0DFD5] p-8 shadow-xs">
          <p className="text-base text-[#665349]">No applications found matching your criteria.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="mt-4 px-5 py-2 rounded-full bg-[#D94F1D] text-white text-xs font-bold hover:bg-[#C4461A] transition shadow-xs"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
