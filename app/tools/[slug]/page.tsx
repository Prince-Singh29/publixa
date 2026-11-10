import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Wrench, ShieldCheck, ChevronRight, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';
import DedicatedWebToolRunner from '@/components/webapp/DedicatedWebToolRunner';
import { ALL_WEB_TOOLS, getWebToolBySlug } from '@/lib/seoToolsData';

interface WebToolPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ALL_WEB_TOOLS.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }: WebToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getWebToolBySlug(slug);
  if (!tool) {
    return { title: 'Web Tool Not Found | Publixa' };
  }

  return {
    title: `${tool.title} — Free Browser Tool (No Account) | Publixa`,
    description: `${tool.seoDescription} Runs locally inside your browser with zero server uploads.`,
    keywords: [...tool.keywords, tool.title, 'Publixa Web Tools', 'free offline browser tool'],
    openGraph: {
      title: `${tool.title} | Publixa`,
      description: tool.seoDescription,
      type: 'website',
    },
  };
}

export default async function DedicatedWebToolPage({ params }: WebToolPageProps) {
  const { slug } = await params;
  const tool = getWebToolBySlug(slug);
  if (!tool) {
    notFound();
  }

  const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${tool.title} — Publixa`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any (Web Browser)',
    url: `https://publixa.store/tools/${tool.slug}`,
    description: tool.seoDescription,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: tool.features,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://publixa.store' },
      { '@type': 'ListItem', position: 2, name: 'Web Tools', item: 'https://publixa.store/tools' },
      { '@type': 'ListItem', position: 3, name: tool.title, item: `https://publixa.store/tools/${tool.slug}` },
    ],
  };

  return (
    <div className="w-full bg-[#FFFAF6] min-h-[calc(100vh-80px)] p-2 sm:p-4 lg:p-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="w-full max-w-[1440px] mx-auto space-y-6">
        <div className="rounded-3xl bg-white border border-[#F0DFD5] shadow-xl overflow-hidden">
          {/* Top Tool Header */}
          <div className="bg-gradient-to-r from-[#FFF4ED] via-[#FFF9F5] to-[#FFE8DC] border-b border-[#F0DFD5] px-4 sm:px-6 py-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[#665349] font-semibold">
                <Link href="/" className="hover:text-[#D94F1D] transition">Home</Link>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                <Link href="/tools" className="hover:text-[#D94F1D] transition">Web Tools</Link>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                <span className="text-[#D94F1D] font-bold">{tool.title}</span>
              </nav>

              <Link
                href="/tools"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3D2315] hover:text-[#D94F1D] bg-white px-3 py-1 rounded-full border border-[#F0DFD5] transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Web Tools</span>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#D94F1D] text-white flex items-center justify-center shadow-xs shrink-0">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-white border border-[#FFDFC8] text-[10px] font-bold uppercase text-[#D94F1D]">
                      {tool.category}
                    </span>
                    <h1 className="font-heading font-extrabold text-lg sm:text-2xl text-[#1A0F0A]">
                      {tool.title}
                    </h1>
                  </div>
                  <p className="text-xs sm:text-sm text-[#665349] mt-0.5">{tool.shortDesc}</p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                100% Client-Side RAM • No Account Needed
              </span>
            </div>
          </div>

          {/* In-Between Dedicated Tool Description & Step-by-Step Guide */}
          <div className="px-4 sm:px-6 pt-5">
            <div className="rounded-2xl bg-gradient-to-r from-[#FFF9F5] to-[#FFF0E6] border border-[#FFDFC8] p-4 sm:p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D94F1D]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>About {tool.title}</span>
              </div>
              <p className="text-xs sm:text-sm text-[#3D2315] leading-relaxed font-medium">
                {tool.seoDescription}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-[#FFDFC8]/70">
                <div className="bg-white/85 border border-[#F0DFD5] rounded-xl p-3 space-y-1.5">
                  <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-[#D94F1D]">
                    How to Use
                  </h2>
                  <ol className="space-y-1 text-xs text-[#3D2315]">
                    {tool.howToSteps.map((step, idx) => (
                      <li key={step} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-[#D94F1D] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="bg-white/85 border border-[#F0DFD5] rounded-xl p-3 space-y-1.5">
                  <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">
                    Key Features
                  </h2>
                  <ul className="space-y-1 text-xs text-[#3D2315]">
                    {tool.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Standalone Interactive Tool Workspace (ONLY this tool) */}
          <div className="p-4 sm:p-6">
            <DedicatedWebToolRunner componentKey={tool.componentKey} title={tool.title} />
          </div>
        </div>

        {/* Clean Single-Tool Footer Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-2 text-xs text-[#665349]">
          <span>Runs completely offline in your browser — zero sign-in or server upload required.</span>
          <Link href="/tools" className="font-bold text-[#D94F1D] hover:underline">
            ← Browse All Web Tools
          </Link>
        </div>
      </div>
    </div>
  );
}
