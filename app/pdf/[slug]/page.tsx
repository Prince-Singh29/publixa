import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FileText, ShieldCheck, ChevronRight, CheckCircle2, ArrowLeft, Sparkles } from 'lucide-react';
import PdfToolsSuite from '@/components/webapp/PdfToolsSuite';
import { ALL_PDF_TOOLS, getPdfToolBySlug } from '@/lib/seoToolsData';

interface PdfToolPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ALL_PDF_TOOLS.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }: PdfToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getPdfToolBySlug(slug);
  if (!tool) {
    return { title: 'PDF Tool Not Found | Publixa' };
  }

  return {
    title: `${tool.title} — Free Offline Browser PDF Tool | Publixa`,
    description: `${tool.seoDescription} Runs 100% locally in your browser with zero uploads and no sign-up required.`,
    keywords: [...tool.keywords, tool.title, 'Publixa PDF Studio', 'offline pdf tool free', 'client-side pdf'],
    openGraph: {
      title: `${tool.title} | Publixa PDF Studio`,
      description: tool.seoDescription,
      type: 'website',
    },
  };
}

export default async function DedicatedPdfToolPage({ params }: PdfToolPageProps) {
  const { slug } = await params;
  const tool = getPdfToolBySlug(slug);
  if (!tool) {
    notFound();
  }

  const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${tool.title} — Publixa PDF Studio`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any (Web Browser)',
    url: `https://publixa.store/pdf/${tool.slug}`,
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
      { '@type': 'ListItem', position: 2, name: 'PDF Studio', item: 'https://publixa.store/pdf' },
      { '@type': 'ListItem', position: 3, name: tool.title, item: `https://publixa.store/pdf/${tool.slug}` },
    ],
  };

  return (
    <div className="w-full bg-[#FFFAF6] min-h-[calc(100vh-80px)] p-2 sm:p-4 lg:p-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="w-full max-w-[1280px] mx-auto space-y-6">
        <div className="rounded-3xl bg-white border border-[#F0DFD5] shadow-xl overflow-hidden">
          {/* Top Crimson Studio Header */}
          <div className="bg-gradient-to-r from-[#FFF4ED] via-[#FFF9F5] to-[#FFE8DC] border-b border-[#F0DFD5] px-4 sm:px-6 py-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[#665349] font-semibold">
                <Link href="/" className="hover:text-[#D94F1D] transition">Home</Link>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                <Link href="/pdf" className="hover:text-[#D94F1D] transition">PDF Studio</Link>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                <span className="text-[#D94F1D] font-bold">{tool.title}</span>
              </nav>

              <Link
                href="/pdf"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3D2315] hover:text-[#D94F1D] bg-white px-3 py-1 rounded-full border border-[#F0DFD5] transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All PDF Tools</span>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#E5322D] text-white flex items-center justify-center shadow-xs shrink-0">
                  <FileText className="w-5 h-5" />
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
                100% Client-Side RAM • Zero Uploads
              </span>
            </div>
          </div>

          {/* In-Between Dedicated Tool Description & Quick Steps */}
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
                    Key Capabilities
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
            <PdfToolsSuite defaultTab={tool.id} appName={tool.title} standalone={true} />
          </div>
        </div>

        {/* Clean Single-Tool Footer Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-2 text-xs text-[#665349]">
          <span>Processed 100% offline inside your browser — files never leave your device.</span>
          <Link href="/pdf" className="font-bold text-[#D94F1D] hover:underline">
            ← Browse All 24 PDF Tools
          </Link>
        </div>
      </div>
    </div>
  );
}
