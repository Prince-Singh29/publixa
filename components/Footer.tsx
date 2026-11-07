import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Mail, Globe, CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';
import { assetPath } from '@/lib/paths';

export default function Footer() {
  return (
    <footer className="bg-[#FFF4ED] text-[#665349] border-t border-[#F0DFD5]">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white border border-[#F0DFD5] p-1 flex items-center justify-center shadow-xs">
                <Image
                  src={assetPath('/images/publixa-logo.png')}
                  alt="Publixa Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-[#1A0F0A] font-heading">
                Publixa<span className="text-[#D94F1D]">.</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#665349] leading-relaxed font-normal">
              Publixa develops and operates high-performance document editors, PDF tools, utilities, and casual games with transparent privacy and zero hidden telemetry.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#059669] font-bold bg-[#ECFDF5] w-fit px-3 py-1.5 rounded-xl border border-[#A7F3D0]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verified Android Developer</span>
            </div>
          </div>

          {/* Featured Apps Directory */}
          <div>
            <h3 className="text-xs font-bold text-[#1A0F0A] tracking-wider uppercase mb-4 font-heading">
              Featured Applications
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
              <li>
                <Link href="/apps/doc-to-pdf-converter" className="text-[#3D2315] hover:text-[#D94F1D] transition-colors">
                  DOC and DOCX to PDF
                </Link>
              </li>
              <li>
                <Link href="/apps/excel-to-pdf-converter" className="text-[#3D2315] hover:text-[#D94F1D] transition-colors">
                  EXCEL TO PDF Converter
                </Link>
              </li>
              <li>
                <Link href="/apps/ppt-reader" className="text-[#3D2315] hover:text-[#D94F1D] transition-colors">
                  PPT &amp; PPTX: Read and Edit
                </Link>
              </li>
              <li>
                <Link href="/apps/nebula-vpn" className="text-[#3D2315] hover:text-[#D94F1D] transition-colors">
                  Nebula VPN - Secure Proxy
                </Link>
              </li>
              <li>
                <Link href="/apps/zolex-vpn" className="text-[#3D2315] hover:text-[#D94F1D] transition-colors">
                  Zolex VPN: Fast &amp; Secure
                </Link>
              </li>
              <li>
                <Link href="/apps/bubble-shooter-pop-puzzle" className="text-[#3D2315] hover:text-[#D94F1D] transition-colors">
                  Bubble Shooter: Pop &amp; Puzzle
                </Link>
              </li>
              <li>
                <Link href="/apps" className="text-[#D94F1D] hover:text-[#C4461A] font-bold inline-flex items-center gap-1 pt-1">
                  <span>View All 33+ Apps</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h3 className="text-xs font-bold text-[#1A0F0A] tracking-wider uppercase mb-4 font-heading">
              Governance &amp; Policies
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
              <li>
                <Link href="/privacy" className="text-[#3D2315] hover:text-[#D94F1D] transition-colors">
                  Master Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[#3D2315] hover:text-[#D94F1D] transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/data-deletion" className="text-[#3D2315] hover:text-[#D94F1D] transition-colors">
                  User Data Deletion Request
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#3D2315] hover:text-[#D94F1D] transition-colors">
                  Contact &amp; Support Center
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[#3D2315] hover:text-[#D94F1D] transition-colors">
                  About Developer &amp; Verification
                </Link>
              </li>
              <li>
                <a
                  href="https://play.google.com/store/apps/dev?id=8039529252659159135"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#3D2315] hover:text-[#D94F1D] transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Google Play Developer Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Official Verification Card */}
          <div className="bg-white rounded-2xl p-6 border border-[#F0DFD5] space-y-3 shadow-xs">
            <h3 className="text-xs font-bold text-[#D94F1D] tracking-wider uppercase flex items-center gap-1.5 font-heading">
              <ShieldCheck className="w-4 h-4 text-[#D94F1D]" />
              <span>Publixa Legal Verification</span>
            </h3>
            <div className="space-y-1.5 text-xs text-[#3D2315]">
              <p>
                <strong className="text-[#1A0F0A]">Legal Owner:</strong> Prince Kumar Singh
              </p>
              <p>
                <strong className="text-[#1A0F0A]">Brand:</strong> Publixa
              </p>
              <p className="flex items-center gap-1">
                <strong className="text-[#1A0F0A]">Official Domain:</strong>{' '}
                <a
                  href="https://publixa.store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D94F1D] hover:underline font-semibold"
                >
                  publixa.store
                </a>
              </p>
              <p className="flex items-center gap-1">
                <strong className="text-[#1A0F0A]">Support Email:</strong>{' '}
                <a href="mailto:publixaorignal@gmail.com" className="text-[#D94F1D] hover:underline font-mono">
                  publixaorignal@gmail.com
                </a>
              </p>
              <p>
                <strong className="text-[#1A0F0A]">Ecosystem:</strong> Google Play Store
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-[#F0DFD5] flex flex-col sm:flex-row items-center justify-between text-xs text-[#8C7A70] font-medium gap-4">
          <p>© {new Date().getFullYear()} Publixa. All rights reserved. Sole Proprietorship: Prince Kumar Singh.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-[#1A0F0A] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#1A0F0A] transition-colors">
              Terms of Service
            </Link>
            <Link href="/data-deletion" className="hover:text-[#1A0F0A] transition-colors">
              Data Deletion
            </Link>
            <Link href="/contact" className="hover:text-[#1A0F0A] transition-colors">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
