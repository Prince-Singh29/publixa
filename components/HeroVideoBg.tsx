'use client';

import React, { useEffect, useRef } from 'react';

export default function HeroVideoBg({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    el.defaultMuted = true;
    el.muted = true;
    el.playsInline = true;
    el.setAttribute('muted', '');
    el.setAttribute('playsinline', '');
    el.setAttribute('webkit-playsinline', '');

    const attemptPlay = () => {
      if (el.paused) {
        el.play().catch(() => {
          // Ignore autoplay promise rejections if browser power-saver pauses it
        });
      }
    };

    attemptPlay();
    el.addEventListener('canplay', attemptPlay);
    document.addEventListener('visibilitychange', attemptPlay);

    return () => {
      el.removeEventListener('canplay', attemptPlay);
      document.removeEventListener('visibilitychange', attemptPlay);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        className="w-full h-full object-cover object-center scale-[1.03] saturate-[1.12] contrast-[1.04]"
      >
        <source src={src} type="video/mp4" />
      </video>
      {/* Subtle warm edge fade into the next section without washing out the animated waves */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFFAF6]/15 via-transparent to-[#FFF4ED]/75" />
    </div>
  );
}

