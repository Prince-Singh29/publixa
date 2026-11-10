import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import { ALL_PDF_TOOLS, ALL_WEB_TOOLS, SUITE_SEO_DIRECTORY, SUITE_FAQS } from '@/lib/seoToolsData';

interface SuiteSeoSectionProps {
  focus?: 'pdf' | 'all' | 'docs' | 'excel' | 'slides';
}

export default function SuiteSeoSection({ focus = 'all' }: SuiteSeoSectionProps) {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: SUITE_FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };

  const appJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Publixa Free Browser PDF, Docs, Sheets & Slides Suite',
    url: 'https://publixa.store/tools',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any (Web Browser)',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      ...ALL_PDF_TOOLS.map((t) => `${t.title}: ${t.shortDesc}`),
      ...ALL_WEB_TOOLS.map((t) => `${t.title}: ${t.shortDesc}`),
    ],
  };

  return (
    <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Complete Suite Overview Cards */}
      <div className="space-y-6">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0E6] border border-[#FFDFC8] text-[11px] font-bold uppercase tracking-wider text-[#D94F1D]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Zero-Upload Web Workstation</span>
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1A0F0A] mt-3">
            Complete Description of Publixa Web Applications &amp; Tools
          </h2>
          <p className="text-sm sm:text-base text-[#665349] mt-2">
            Every PDF utility, document processor, spreadsheet engine, slide builder, and creator tool has its own dedicated page and runs natively inside browser memory (RAM) with zero server uploads or account requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SUITE_SEO_DIRECTORY.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group bg-white border border-[#F0DFD5] hover:border-[#D94F1D] rounded-2xl p-6 transition shadow-xs hover:shadow-md flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#D94F1D]">
                  {item.category}
                </span>
                <h3 className="font-heading font-bold text-lg text-[#1A0F0A] group-hover:text-[#D94F1D] transition">
                  {item.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#665349] leading-relaxed">
                  {item.description}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D94F1D]">
                <span>Open Tool</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Detailed Directory of Every Separated PDF Tool (24 Tools) */}
      {(focus === 'pdf' || focus === 'all') && (
        <div className="rounded-3xl bg-[#FFF9F5] border border-[#F0DFD5] p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0DFD5] pb-4">
            <div>
              <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#1A0F0A]">
                All 24 Dedicated PDF Tool Pages — Features &amp; Descriptions
              </h2>
              <p className="text-xs sm:text-sm text-[#665349] mt-1">
                Click any tool card to open its dedicated standalone workbench and full step-by-step guide.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full self-start">
              <ShieldCheck className="w-4 h-4" />
              GDPR &amp; HIPAA Friendly
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ALL_PDF_TOOLS.map((tool) => (
              <Link
                key={tool.id}
                href={`/pdf/${tool.slug}`}
                className="group bg-white border border-[#F0DFD5] hover:border-[#D94F1D] rounded-2xl p-4 space-y-2.5 flex flex-col justify-between transition shadow-2xs hover:shadow-md"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-sm text-[#1A0F0A] group-hover:text-[#D94F1D] transition">
                      {tool.title}
                    </h3>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#FFF0E6] text-[#D94F1D] shrink-0">
                      {tool.category}
                    </span>
                  </div>
                  <p className="text-xs text-[#665349] leading-relaxed">{tool.seoDescription}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#D94F1D] pt-1">
                  <span>Open {tool.title}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Directory of All Separated Web, Office, Utility & Privacy Tool Pages (32 Tools) */}
      {focus !== 'pdf' && (
        <div className="rounded-3xl bg-[#FFF9F5] border border-[#F0DFD5] p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0DFD5] pb-4">
            <div>
              <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#1A0F0A]">
                All {ALL_WEB_TOOLS.length} Dedicated Office, Creator, Utility &amp; Privacy Tool Pages
              </h2>
              <p className="text-xs sm:text-sm text-[#665349] mt-1">
                Every Docs, Sheets, Slides, Stylish Font, QR, Passport Photo, Wallpaper, Developer, Privacy, and Game utility on its own dedicated page.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full self-start">
              <ShieldCheck className="w-4 h-4" />
              No Account • Runs Locally
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ALL_WEB_TOOLS.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group bg-white border border-[#F0DFD5] hover:border-[#D94F1D] rounded-2xl p-4 space-y-2.5 flex flex-col justify-between transition shadow-2xs hover:shadow-md"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-sm text-[#1A0F0A] group-hover:text-[#D94F1D] transition">
                      {tool.title}
                    </h3>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#FFF0E6] text-[#D94F1D] shrink-0">
                      {tool.category}
                    </span>
                  </div>
                  <p className="text-xs text-[#665349] leading-relaxed">{tool.seoDescription}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#D94F1D] pt-1">
                  <span>Open Dedicated Tool</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <div className="rounded-3xl bg-white border border-[#F0DFD5] p-6 sm:p-8 space-y-5">
        <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#1A0F0A] flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#D94F1D]" />
          <span>Frequently Asked Questions</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {SUITE_FAQS.map((faq) => (
            <div key={faq.q} className="p-4 rounded-2xl bg-[#FFF9F5] border border-[#F0DFD5] space-y-1.5">
              <h3 className="font-bold text-sm text-[#1A0F0A]">{faq.q}</h3>
              <p className="text-xs sm:text-sm text-[#665349] leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
