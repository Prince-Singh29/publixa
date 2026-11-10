import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PublixaApp } from '@/lib/types';
import { Lock, ExternalLink, Globe } from 'lucide-react';
import { assetPath } from '@/lib/paths';

interface AppCardProps {
  app: PublixaApp;
}

export default function AppCard({ app }: AppCardProps) {
  const isCustomIcon = app.icon && app.icon.startsWith('/');

  return (
    <div className="group relative flex flex-col justify-between p-4 md:p-5 rounded-2xl transition-all duration-300 transform-gpu hover:scale-105 hover:-translate-y-1 bg-white hover:bg-[#FFF9F5] border border-[#F0DFD5] hover:border-[#D94F1D] shadow-xs hover:shadow-xl hover:shadow-[#D94F1D]/10">
      <Link href={`/apps/${app.slug}`} className="flex flex-col items-center flex-1">
        {/* App Icon */}
        <div className="relative w-20 h-20 md:w-24 md:h-24 mb-3.5 md:mb-4 rounded-2xl overflow-hidden shadow-xs group-hover:shadow-md transition-all duration-300 bg-[#FFF4ED] border border-[#F0DFD5] p-0.5 flex items-center justify-center">
          {isCustomIcon ? (
            <Image
              src={assetPath(app.icon)}
              alt={`${app.name} icon`}
              width={96}
              height={96}
              className="object-cover rounded-xl w-full h-full"
            />
          ) : (
            <span className="text-3xl">{app.icon || '📱'}</span>
          )}
        </div>

        {/* Category & Verified Pill */}
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FFF0E6] text-[#D94F1D] border border-[#FFDFC8]">
            {app.category}
          </span>
        </div>

        {/* App Title */}
        <h3 className="font-heading font-bold text-sm md:text-base text-center line-clamp-2 text-[#1A0F0A] group-hover:text-[#D94F1D] transition-colors">
          {app.name}
        </h3>

        {/* App Description */}
        <p className="font-body text-xs mt-2 text-center line-clamp-2 text-[#665349] leading-relaxed">
          {app.shortDescription}
        </p>
      </Link>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-[#F0DFD5] flex items-center justify-between gap-1.5 text-xs">
        <Link
          href={`/privacy/${app.slug}`}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8C7A70] hover:text-[#D94F1D] transition-colors"
          title="Privacy Policy"
        >
          <Lock className="w-3 h-3" />
          <span>Privacy</span>
        </Link>

        <div className="flex items-center gap-1.5">
          <Link
            href={`/apps/${app.slug}#web-app`}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-[#1A0F0A] bg-[#FFF0E6] hover:bg-[#1A0F0A] hover:text-white border border-[#FFDFC8] transition"
            title="Open Web App Version"
          >
            <Globe className="w-2.5 h-2.5" />
            <span>Web</span>
          </Link>

          {app.playStoreUrl && (
            <a
              href={app.playStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-white bg-[#D94F1D] hover:bg-[#C4461A] transition shadow-xs"
            >
              <span>Play</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

