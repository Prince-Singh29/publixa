'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PublixaApp } from '@/lib/types';
import { assetPath } from '@/lib/paths';
import {
  ShieldCheck,
  Lock,
  Smartphone,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Info,
  Calendar,
  Search,
  Trash2
} from 'lucide-react';

import storeData from '@/data/store.json';

export default function MasterPrivacyPolicyPage() {
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
        const q = searchTerm.toLowerCase().trim();
        const matchesSearch =
          !q ||
          app.name.toLowerCase().includes(q) ||
          app.packageName.toLowerCase().includes(q);
        const matchesCat = selectedCategory === 'All' || app.category === selectedCategory;
        return matchesSearch && matchesCat;
      })
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
  }, [apps, searchTerm, selectedCategory]);

  return (
    <div className="w-full bg-[#FFFAF6] min-h-screen text-[#1A0F0A] py-12 lg:py-16">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Policy Header Banner */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#F0DFD5] shadow-xs space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF0E6] text-[#D94F1D] text-xs font-bold border border-[#FFDFC8]">
            <ShieldCheck className="w-4 h-4" />
            <span>Publixa Regulatory Compliance &amp; Transparency</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#1A0F0A] tracking-tight font-heading">
            Master Privacy Policy
          </h1>

          <p className="text-base sm:text-lg text-[#665349] max-w-4xl leading-relaxed">
            Transparent data handling standards, local offline processing guarantees, and Android manifest disclosures across all 33+ applications operated under Publixa.
          </p>

          <div className="pt-4 border-t border-[#F0DFD5] flex flex-wrap items-center gap-6 text-xs sm:text-sm text-[#8C7A70] font-bold">
            <span className="flex items-center gap-1.5 text-[#1A0F0A]">
              <Calendar className="w-4 h-4 text-[#D94F1D]" />
              Effective Date: July 15, 2026
            </span>
            <span>•</span>
            <span>Last Updated: September 2026</span>
            <span>•</span>
            <span className="text-[#1A0F0A]">Legal Entity: Prince Developer (Prince Kumar Singh)</span>
          </div>
        </div>

        {/* Legal Binding Statement */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#F0DFD5] space-y-6 shadow-xs">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#FFF0E6] border border-[#FFDFC8] text-[#3D2315] text-sm sm:text-base leading-relaxed font-medium">
            This Privacy Policy governs the mobile application(s) and digital services operated by{' '}
            <strong className="text-[#D94F1D]">Prince Developer</strong> (Prince Kumar Singh) under the trade brand <strong>Publixa</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;). We maintain a strict privacy-by-design architecture to ensure your personal documents, files, presentations, and device sensors are never monitored, sold, or shared with unauthorized third parties.
          </div>

          <p className="text-sm sm:text-base text-[#665349] leading-relaxed">
            This master document outlines our overarching operational rules regarding data collection, device telemetry, local file processing, and user deletion rights. Each application also maintains its own specific disclosure page with exact Android manifest permissions listed below.
          </p>
        </div>

        {/* COVERED APPLICATIONS DIRECTORY - Full Width Grid with Search & Filters */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#F0DFD5] space-y-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A0F0A] flex items-center gap-3 tracking-tight font-heading">
                <Smartphone className="w-7 h-7 text-[#D94F1D]" />
                <span>Applications Covered Under This Policy</span>
              </h2>
              <p className="text-sm sm:text-base text-[#665349] mt-1">
                Each of the {apps.length} applications listed below adheres to this policy and features its own dedicated disclosure URL:
              </p>
            </div>
            <span className="text-xs font-bold text-[#D94F1D] bg-[#FFF0E6] px-4 py-2 rounded-full border border-[#FFDFC8] w-fit shrink-0">
              {apps.length} Live Apps Covered
            </span>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                const count = cat === 'All' ? apps.length : apps.filter((a) => a.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#D94F1D] text-white shadow-xs'
                        : 'bg-white hover:bg-[#FFF9F5] text-[#3D2315] border border-[#F0DFD5]'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search privacy policies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-[#F0DFD5] bg-white text-[#1A0F0A] text-xs sm:text-sm placeholder-[#8C7A70] focus:outline-hidden focus:border-[#D94F1D] shadow-xs"
              />
            </div>
          </div>

          {/* Apps Cards Grid */}
          {loading ? (
            <div className="py-16 text-center text-[#8C7A70] text-sm">
              Loading covered application policies...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {filteredApps.map((app) => {
                const isCustom = app.icon && app.icon.startsWith('/');
                return (
                  <div
                    key={app.id || app.slug}
                    className="bg-[#FFF9F5] hover:bg-[#FFF0E6] p-5 rounded-2xl border border-[#F0DFD5] hover:border-[#D94F1D] transition flex flex-col justify-between gap-4 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-[#F0DFD5] bg-white flex items-center justify-center relative shadow-xs">
                        {isCustom ? (
                          <Image
                            src={assetPath(app.icon)}
                            alt={app.name}
                            width={56}
                            height={56}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <span className="text-2xl">{app.icon || '📱'}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            Verified
                          </span>
                          <span className="text-[10px] font-semibold text-[#8C7A70] bg-white px-2 py-0.5 rounded-full border border-[#F0DFD5]">
                            {app.category}
                          </span>
                        </div>
                        <h3 className="font-bold text-[#1A0F0A] text-base leading-snug group-hover:text-[#D94F1D] transition-colors line-clamp-1">
                          {app.name}
                        </h3>
                        <p className="font-mono text-xs text-[#D94F1D] font-semibold truncate mt-0.5">
                          {app.packageName}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#F0DFD5] flex items-center justify-between gap-2">
                      <span className="text-xs text-[#8C7A70]">
                        {app.permissions?.length || 3} Permissions Declared
                      </span>
                      <Link
                        href={`/privacy/${app.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#D94F1D] hover:bg-[#C4461A] px-3.5 py-1.5 rounded-full transition shadow-xs"
                      >
                        <span>View Policy</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* DATA PRACTICES & LOCAL PROCESSING */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#F0DFD5] space-y-8 shadow-xs">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A0F0A] tracking-tight font-heading">
            Information Collection &amp; Processing Standards
          </h2>

          <div className="p-6 sm:p-8 rounded-2xl bg-[#FFF9F5] border border-[#F0DFD5] space-y-3">
            <h3 className="text-lg sm:text-xl font-bold text-[#D94F1D] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#D94F1D]" />
              <span>100% On-Device Document &amp; File Confidentiality</span>
            </h3>
            <p className="text-sm sm:text-base text-[#3D2315] leading-relaxed font-normal">
              When converting DOC to PDF, calculating formulas in Excel, viewing PowerPoint decks, or browsing plain text, <strong>none of your personal document contents are ever transmitted over the network</strong>. All file parsing, table computations, and PDF transformations are executed strictly within the local offline memory of your Android device.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-[#1A0F0A]">1. Device &amp; Diagnostics Telemetry</h3>
            <p className="text-sm sm:text-base text-[#3D2315] leading-relaxed font-normal">
              To detect software crashes and ensure compatibility with different versions of Android, our applications may collect minimal anonymous diagnostics:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base text-[#3D2315]">
              <li>Hardware manufacturer, device model, and Android OS version</li>
              <li>Native crash traces and memory allocation warnings via Firebase Crashlytics</li>
              <li>Anonymously truncated IP information used solely to route localized software updates</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-[#1A0F0A]">2. Declared Android Manifest Permissions</h3>
            <p className="text-sm sm:text-base text-[#3D2315] leading-relaxed font-normal">
              Every Publixa application requests only the precise runtime permissions strictly required to perform its core function:
            </p>
            <ul className="list-disc pl-6 space-y-2.5 text-sm sm:text-base text-[#3D2315]">
              <li><strong>READ &amp; WRITE EXTERNAL STORAGE:</strong> Required to open files selected by the user and save converted or edited results.</li>
              <li><strong>MANAGE EXTERNAL STORAGE (Android 11+):</strong> Required by document manager apps to browse, organize, and rename office documents across phone directories.</li>
              <li><strong>CAMERA / FLASHLIGHT:</strong> Used exclusively when the user manually initiates document scanning or triggers the torch utility.</li>
              <li><strong>RECORD AUDIO:</strong> Used exclusively within music and audio apps when the user explicitly decides to record their own audio memo.</li>
              <li><strong>INTERNET:</strong> Verifies Google Play licensing status and receives security update feeds.</li>
            </ul>
          </div>
        </div>

        {/* THIRD-PARTY SDKS */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#F0DFD5] space-y-6 shadow-xs">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A0F0A] tracking-tight font-heading">
            Integrated Third-Party SDKs &amp; Frameworks
          </h2>
          <p className="text-sm sm:text-base text-[#665349]">
            Our applications only integrate vetted platform SDKs compliant with Google Play safety requirements:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#FFF9F5] border border-[#F0DFD5] space-y-2">
              <h4 className="font-bold text-[#1A0F0A] text-base">Google Play Services</h4>
              <p className="text-xs sm:text-sm text-[#665349] leading-relaxed">
                Manages in-app billing, licensing checks, and platform stability APIs.
              </p>
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#D94F1D] hover:underline"
              >
                <span>Google Privacy Policy</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="p-6 rounded-2xl bg-[#FFF9F5] border border-[#F0DFD5] space-y-2">
              <h4 className="font-bold text-[#1A0F0A] text-base">Google AdMob</h4>
              <p className="text-xs sm:text-sm text-[#665349] leading-relaxed">
                Serves contextual ads to keep our document and conversion utilities completely free.
              </p>
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#D94F1D] hover:underline"
              >
                <span>AdMob Privacy Standards</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="p-6 rounded-2xl bg-[#FFF9F5] border border-[#F0DFD5] space-y-2">
              <h4 className="font-bold text-[#1A0F0A] text-base">Firebase Crashlytics</h4>
              <p className="text-xs sm:text-sm text-[#665349] leading-relaxed">
                Records unhandled native crashes and rendering memory exceptions.
              </p>
              <a
                href="https://firebase.google.com/support/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#D94F1D] hover:underline"
              >
                <span>Firebase Privacy Notice</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* CHILDREN'S PRIVACY */}
        <div className="bg-amber-50 p-8 sm:p-10 rounded-3xl border border-amber-200 space-y-3 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-amber-900 flex items-center gap-2.5">
            <Info className="w-5 h-5 text-amber-600" />
            <span>Children&apos;s Privacy (COPPA Compliance)</span>
          </h2>
          <p className="text-xs sm:text-sm text-amber-800 leading-relaxed font-medium">
            Our applications are not directed toward children under 13 years of age, and we do not knowingly collect personal information from children. If we discover that personal data has been inadvertently provided by an underage user, we take immediate steps to delete the record. Inquiries can be submitted to{' '}
            <a href="mailto:publixaorignal@gmail.com" className="font-bold underline text-amber-900">
              publixaorignal@gmail.com
            </a>.
          </p>
        </div>

        {/* DATA RETENTION & DELETION */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#F0DFD5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1A0F0A] flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-rose-500" />
              <span>User Data Deletion Rights</span>
            </h2>
            <p className="text-sm text-[#665349] max-w-xl font-normal">
              You retain full rights to request the deletion of all diagnostic or contact data associated with your usage.
            </p>
          </div>
          <Link
            href="/data-deletion"
            className="px-6 py-3.5 rounded-full bg-[#D94F1D] hover:bg-[#C4461A] text-white font-bold text-xs sm:text-sm transition shadow-sm shrink-0 inline-flex items-center gap-2"
          >
            <span>Open Data Deletion Portal</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* CONTACT US */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#F0DFD5] space-y-4 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1A0F0A]">
            Contact Us
          </h2>
          <p className="text-sm text-[#665349] leading-relaxed">
            If you have any questions about this Privacy Policy or any Publixa application, please contact our compliance desk:
          </p>
          <div className="p-5 rounded-2xl bg-[#FFF9F5] border border-[#F0DFD5] text-sm font-mono space-y-1.5">
            <div><span className="text-[#8C7A70]">Developer:</span> <strong className="text-[#1A0F0A]">Prince Developer</strong></div>
            <div><span className="text-[#8C7A70]">Email:</span> <a href="mailto:publixaorignal@gmail.com" className="text-[#D94F1D] font-bold hover:underline">publixaorignal@gmail.com</a></div>
            <div><span className="text-[#8C7A70]">Website:</span> <span className="text-[#3D2315]">https://publixa.store</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
