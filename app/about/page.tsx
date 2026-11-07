import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Award, Smartphone, CheckCircle2, Mail, Globe, Lock, ExternalLink } from 'lucide-react';
import { assetPath } from '@/lib/paths';

export default function AboutPage() {
  return (
    <div className="w-full bg-[#FFFAF6] min-h-screen text-[#1A0F0A] py-12 lg:py-16">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#F0DFD5] shadow-xs space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF0E6] text-[#D94F1D] text-xs font-bold border border-[#FFDFC8]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Google Play Developer</span>
          </div>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white border border-[#F0DFD5] p-1 flex items-center justify-center shadow-xs shrink-0">
              <Image
                src={assetPath('/images/publixa-logo.png')}
                alt="Publixa Logo"
                width={56}
                height={56}
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl sm:text-5xl font-black text-[#1A0F0A] tracking-tight font-heading">
                About Publixa &amp; Developer Verification
              </h1>
              <p className="text-xs sm:text-sm text-[#665349] mt-1">
                Developer: Prince Developer (Prince Kumar Singh) • Domain: publixa.store • Platform: Google Play
              </p>
            </div>
          </div>
        </div>

        {/* Verified Developer Matrix */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#F0DFD5] shadow-xs space-y-6">
          <div className="flex items-center gap-2 text-[#D94F1D] text-xs font-bold uppercase tracking-wider font-heading">
            <Award className="w-4 h-4 text-[#D94F1D]" />
            <span>Official Developer Credentials &amp; Verification Matrix</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-[#FFF9F5] border border-[#F0DFD5]">
              <span className="text-xs text-[#8C7A70] block font-medium uppercase">Developer &amp; Trade Name</span>
              <span className="text-lg font-bold text-[#1A0F0A] mt-1 block">Publixa</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFF9F5] border border-[#F0DFD5]">
              <span className="text-xs text-[#8C7A70] block font-medium uppercase">Sole Legal Owner &amp; Operator</span>
              <span className="text-lg font-bold text-[#1A0F0A] mt-1 block">Prince Kumar Singh</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFF9F5] border border-[#F0DFD5]">
              <span className="text-xs text-[#8C7A70] block font-medium uppercase">Official Corporate Domain</span>
              <span className="text-lg font-bold text-[#D94F1D] mt-1 block">
                <a href="https://publixa.store" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  https://publixa.store
                </a>
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFF9F5] border border-[#F0DFD5]">
              <span className="text-xs text-[#8C7A70] block font-medium uppercase">Support &amp; Compliance Email</span>
              <span className="text-base font-mono font-bold text-[#D94F1D] mt-1 block">
                <a href="mailto:publixaorignal@gmail.com" className="hover:underline">
                  publixaorignal@gmail.com
                </a>
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFF9F5] border border-[#F0DFD5]">
              <span className="text-xs text-[#8C7A70] block font-medium uppercase">Google Play Dev ID</span>
              <span className="text-base font-mono font-bold text-[#1A0F0A] mt-1 block">
                8039529252659159135
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFF9F5] border border-[#F0DFD5]">
              <span className="text-xs text-[#8C7A70] block font-medium uppercase">Developer Standing</span>
              <span className="text-base font-bold text-emerald-600 mt-1 block flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Active &amp; Verified in Good Standing
              </span>
            </div>
          </div>
        </div>

        {/* Engineering Philosophy */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#F0DFD5] shadow-xs space-y-6 text-[#3D2315] text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1A0F0A] font-heading">Engineering &amp; Privacy Philosophy</h2>
          <p>
            At <strong>Publixa</strong>, we build native mobile applications designed to perform everyday tasks quickly and reliably without requiring invasive data gathering or continuous cloud dependencies.
          </p>
          <p>
            Every software product published under the Publixa brand by <strong>Prince Developer</strong> (Prince Kumar Singh) adheres to three non-negotiable principles:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-[#3D2315]">
            <li><strong>100% On-Device Document Processing:</strong> PDF converters and office tools run calculations, layout formatting, and exports completely on your phone. Personal files are never uploaded to remote servers.</li>
            <li><strong>Minimal Permission Scope:</strong> Apps only request the specific runtime permissions required for reading and saving user-chosen files.</li>
            <li><strong>Direct Human Accountability:</strong> Questions, deletion requests, and troubleshooting are addressed directly by developer Prince Kumar Singh.</li>
          </ul>
        </div>

        {/* Action bar */}
        <div className="p-8 rounded-3xl bg-white border border-[#F0DFD5] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-[#1A0F0A] font-heading">Explore the Full Application Portfolio</h3>
            <p className="text-xs sm:text-sm text-[#665349]">Discover all 33+ verified document utilities and games.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/apps"
              className="px-5 py-2.5 rounded-full bg-[#D94F1D] hover:bg-[#C4461A] text-white text-xs sm:text-sm font-bold transition shadow-xs"
            >
              Browse Applications
            </Link>
            <Link
              href="/contact"
              className="px-5 py-2.5 rounded-full bg-white hover:bg-[#FFF9F5] text-[#3D2315] border border-[#F0DFD5] text-xs sm:text-sm font-bold transition shadow-xs"
            >
              Contact Developer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
