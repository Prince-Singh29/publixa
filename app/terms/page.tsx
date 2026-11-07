import React from 'react';
import Link from 'next/link';
import { FileText, ShieldCheck, CheckCircle2, Calendar, AlertCircle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="w-full bg-[#FFFAF6] min-h-screen text-[#1A0F0A] py-12 lg:py-16">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#F0DFD5] shadow-xs space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF0E6] text-[#D94F1D] text-xs font-bold border border-[#FFDFC8]">
            <FileText className="w-3.5 h-3.5" />
            <span>Official Legal Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1A0F0A] tracking-tight font-heading">
            Terms &amp; Conditions
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#8C7A70] font-medium">
            <span className="flex items-center gap-1 text-[#1A0F0A]">
              <Calendar className="w-4 h-4 text-[#D94F1D]" />
              Effective: July 15, 2026
            </span>
            <span>•</span>
            <span>Last Updated: September 2026</span>
            <span>•</span>
            <span className="text-[#1A0F0A]">Entity: Prince Developer (Prince Kumar Singh)</span>
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#F0DFD5] shadow-xs space-y-8 text-[#3D2315] text-sm sm:text-base leading-relaxed">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#FFF0E6] border border-[#FFDFC8] text-[#3D2315] text-sm sm:text-base leading-relaxed font-medium">
            These Terms and Conditions (&ldquo;Terms&rdquo;) govern your use of the mobile applications, websites, and associated digital services operated by <strong className="text-[#1A0F0A]">Prince Developer</strong> (Prince Kumar Singh) under the business brand <strong className="text-[#D94F1D]">Publixa</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;).
          </div>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1A0F0A] font-heading">1. Acceptance of Terms</h2>
            <p>
              By downloading, installing, accessing, or using any Publixa mobile application or visiting <strong>publixa.store</strong>, you agree to be bound by these Terms and our Privacy Policy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1A0F0A] font-heading">2. License Grant &amp; Local On-Device Processing</h2>
            <p>
              Publixa grants you a personal, revocable, non-exclusive, non-transferable, limited license to run the software on compatible Android devices for non-commercial or personal utility. All document conversions, spreadsheet computations, and file rendering occur strictly within your local device memory.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1A0F0A] font-heading">3. Intellectual Property Rights</h2>
            <p>
              All intellectual property rights, trademarks, application icons, and software code are the sole property of <strong>Prince Kumar Singh</strong>. The brand name &ldquo;Publixa&rdquo; and rocket emblem are protected assets.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1A0F0A] font-heading">4. Contact &amp; Legal Entity Information</h2>
            <p>
              If you have questions regarding these Terms or licensing, contact:
            </p>
            <div className="p-6 rounded-2xl bg-[#FFF9F5] border border-[#F0DFD5] text-xs sm:text-sm space-y-1.5 font-mono text-[#3D2315]">
              <div><strong className="text-[#1A0F0A] font-sans">Developer:</strong> Prince Developer</div>
              <div><strong className="text-[#1A0F0A] font-sans">Legal Owner:</strong> Prince Kumar Singh</div>
              <div><strong className="text-[#1A0F0A] font-sans">Trading Brand:</strong> Publixa</div>
              <div><strong className="text-[#1A0F0A] font-sans">Official Support:</strong> <a href="mailto:publixaorignal@gmail.com" className="text-[#D94F1D] font-bold hover:underline">publixaorignal@gmail.com</a></div>
              <div><strong className="text-[#1A0F0A] font-sans">Website:</strong> https://publixa.store</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
