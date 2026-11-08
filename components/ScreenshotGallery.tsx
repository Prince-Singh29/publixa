'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { assetPath } from '@/lib/paths';

interface ScreenshotGalleryProps {
  appName: string;
  screenshots: string[];
}

export default function ScreenshotGallery({ appName, screenshots }: ScreenshotGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeModalImg, setActiveModalImg] = useState<string | null>(null);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 20);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 20);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -360 : 360;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
      setTimeout(checkScroll, 350);
    }
  };

  if (!screenshots || screenshots.length === 0) {
    return null;
  }

  return (
    <div className="relative group" suppressHydrationWarning>
      {/* Navigation Arrow Left */}
      <button
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
        aria-label="Previous screenshot"
        className="absolute -left-3 sm:-left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white shadow-xl border border-[rgba(61,35,21,0.15)] flex items-center justify-center text-[#1A0F0A] hover:bg-[#FFFAF6] hover:text-[#D94F1D] transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none cursor-pointer"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Navigation Arrow Right */}
      <button
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
        aria-label="Next screenshot"
        className="absolute -right-3 sm:-right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white shadow-xl border border-[rgba(61,35,21,0.15)] flex items-center justify-center text-[#1A0F0A] hover:bg-[#FFFAF6] hover:text-[#D94F1D] transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none cursor-pointer"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-5 sm:gap-6 overflow-x-auto pb-6 pt-2 px-2 sm:px-4 snap-x snap-mandatory hide-scrollbar scroll-smooth"
        style={{ scrollPadding: '0 1rem' }}
      >
        {screenshots.map((ss, idx) => (
          <div
            key={idx}
            className="flex-none w-[260px] sm:w-[290px] md:w-[320px] snap-start"
          >
            <div className="relative group/card rounded-3xl overflow-hidden bg-white p-1.5 border border-[rgba(61,35,21,0.12)] shadow-md hover:shadow-2xl transition-all duration-300 transform-gpu hover:-translate-y-1.5">
              <div className="relative rounded-2xl overflow-hidden bg-slate-100 aspect-[9/18.5] flex items-center justify-center">
                <Image
                  src={assetPath(ss)}
                  alt={`${appName} interface preview ${idx + 1}`}
                  fill
                  sizes="(max-width: 640px) 260px, (max-width: 768px) 290px, 320px"
                  className="object-cover rounded-2xl group-hover/card:scale-102 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Hover overlay with zoom button */}
                <div
                  onClick={() => setActiveModalImg(ss)}
                  className="absolute inset-0 bg-black/30 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                >
                  <span className="p-2.5 rounded-full bg-white/90 text-[#1A0F0A] shadow-lg transform scale-90 group-hover/card:scale-100 transition-transform">
                    <Maximize2 className="w-4 h-4 text-[#D94F1D]" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeModalImg && (
        <div
          onClick={() => setActiveModalImg(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-sm sm:max-w-md w-full bg-transparent p-2 rounded-3xl"
          >
            <button
              onClick={() => setActiveModalImg(null)}
              className="absolute -top-10 right-0 text-white hover:text-orange-400 font-bold text-sm bg-black/40 px-3 py-1 rounded-full cursor-pointer"
            >
              ✕ Close
            </button>
            <div className="relative rounded-3xl overflow-hidden bg-white p-2 shadow-2xl border border-white/20">
              <Image
                src={assetPath(activeModalImg)}
                alt="Enlarged screenshot"
                width={800}
                height={1600}
                className="w-full h-auto max-h-[85vh] object-contain rounded-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
