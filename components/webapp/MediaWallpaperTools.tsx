'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Download,
  Image as ImageIcon,
  Sparkles,
  Upload,
  Video,
  Copy,
  Check,
  Printer,
} from 'lucide-react';
import { downloadText } from './downloadBlob';

export function PassportPhotoTool() {
  const [srcUrl, setSrcUrl] = useState<string | null>(null);
  const [preset, setPreset] = useState<'in35x45' | 'us2x2' | 'stamp'>('in35x45');
  const [brightness, setBrightness] = useState(105);
  const [contrast, setContrast] = useState(105);
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [zoom, setZoom] = useState(1);
  const [copies, setCopies] = useState<1 | 6 | 8>(6);
  const singleCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const dims =
    preset === 'us2x2'
      ? { w: 600, h: 600, label: 'US Visa (2x2 in / 600x600px)' }
      : preset === 'stamp'
      ? { w: 300, h: 360, label: 'Stamp Size (25x30 mm)' }
      : { w: 413, h: 531, label: 'India / UK / EU Passport (35x45 mm)' };

  useEffect(() => {
    if (!srcUrl || !singleCanvasRef.current) return;
    const canvas = singleCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new window.Image();
    img.onload = () => {
      canvas.width = dims.w;
      canvas.height = dims.h;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, dims.w, dims.h);

      const scale = Math.max(dims.w / img.width, dims.h / img.height) * zoom;
      const drawW = img.width * scale;
      const drawH = img.height * scale;
      const dx = (dims.w - drawW) / 2;
      const dy = (dims.h - drawH) / 2;

      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
      ctx.drawImage(img, dx, dy, drawW, drawH);
      ctx.filter = 'none';
    };
    img.src = srcUrl;
  }, [srcUrl, dims.w, dims.h, brightness, contrast, bgColor, zoom]);

  const handleDownloadSingle = () => {
    if (!singleCanvasRef.current) return;
    const link = document.createElement('a');
    link.download = `publixa-passport-${preset}.png`;
    link.href = singleCanvasRef.current.toDataURL('image/png');
    link.click();
  };

  const handleDownloadSheet = () => {
    if (!singleCanvasRef.current) return;
    // Standard 4x6 inch printable sheet (1800 x 1200 px at 300 DPI)
    const sheet = document.createElement('canvas');
    sheet.width = 1800;
    sheet.height = 1200;
    const ctx = sheet.getContext('2d')!;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, sheet.width, sheet.height);

    const cols = copies === 8 ? 4 : 3;
    const rows = 2;
    const cellW = Math.min(dims.w, 400);
    const cellH = Math.round(cellW * (dims.h / dims.w));
    const gapX = Math.round((sheet.width - cols * cellW) / (cols + 1));
    const gapY = Math.round((sheet.height - rows * cellH) / (rows + 1));

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = gapX + c * (cellW + gapX);
        const y = gapY + r * (cellH + gapY);
        ctx.drawImage(singleCanvasRef.current, x, y, cellW, cellH);
        ctx.strokeStyle = '#CCCCCC';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, cellW, cellH);
      }
    }

    const link = document.createElement('a');
    link.download = `publixa-4x6-print-sheet-${copies}photos.png`;
    link.href = sheet.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-6 bg-[#FFF9F5] border border-[#F0DFD5] rounded-2xl p-5 space-y-4">
        <label className="flex items-center justify-center gap-3 p-5 rounded-xl border-2 border-dashed border-[#E5CEC0] bg-white hover:border-[#D94F1D] cursor-pointer transition">
          <Upload className="w-5 h-5 text-[#D94F1D]" />
          <span className="font-bold text-sm text-[#1A0F0A]">Upload Portrait / Selfie Photo</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              const r = new FileReader();
              r.onload = () => setSrcUrl(String(r.result));
              r.readAsDataURL(f);
            }}
          />
        </label>

        <div>
          <label className="text-xs font-bold text-[#8C7A70] block mb-1.5">Official Size Preset</label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'in35x45', label: '35x45 mm (India/UK/EU)' },
              { id: 'us2x2', label: '2x2 in (US Visa)' },
              { id: 'stamp', label: 'Stamp Size' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPreset(p.id as 'in35x45' | 'us2x2' | 'stamp')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                  preset === p.id ? 'bg-[#D94F1D] text-white' : 'bg-white border border-[#E5CEC0] text-[#3D2315]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-bold text-[#8C7A70] block">Zoom ({zoom.toFixed(2)}x)</label>
            <input type="range" min={0.8} max={2} step={0.05} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-full accent-[#D94F1D]" />
          </div>
          <div>
            <label className="text-[11px] font-bold text-[#8C7A70] block">Brightness ({brightness}%)</label>
            <input type="range" min={70} max={140} value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} className="w-full accent-[#D94F1D]" />
          </div>
          <div>
            <label className="text-[11px] font-bold text-[#8C7A70] block">Contrast ({contrast}%)</label>
            <input type="range" min={70} max={140} value={contrast} onChange={(e) => setContrast(Number(e.target.value))} className="w-full accent-[#D94F1D]" />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#665349]">Print Sheet:</span>
            {([6, 8] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCopies(c)}
                className={`px-3 py-1 rounded-full text-xs font-bold ${copies === c ? 'bg-[#1A0F0A] text-white' : 'bg-white border border-[#E5CEC0]'}`}
              >
                {c} Photos (4×6&quot;)
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#665349]">Backdrop:</span>
            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
          </div>
        </div>
      </div>

      <div className="lg:col-span-6 bg-white border border-[#F0DFD5] rounded-2xl p-6 flex flex-col items-center justify-between space-y-4">
        <span className="text-xs font-bold text-[#8C7A70]">{dims.label}</span>
        {srcUrl ? (
          <canvas ref={singleCanvasRef} className="max-h-[260px] w-auto rounded-xl border border-[#E5CEC0] shadow-md" />
        ) : (
          <div className="w-48 h-60 rounded-xl border-2 border-dashed border-[#E5CEC0] bg-[#FFF9F5] flex flex-col items-center justify-center text-center p-4 text-[#8C7A70]">
            <Camera className="w-8 h-8 mb-2 opacity-50" />
            <span className="text-xs font-semibold">Upload a photo to auto-crop &amp; generate printable sheet</span>
          </div>
        )}

        <div className="flex flex-wrap gap-3 w-full justify-center">
          <button
            type="button"
            disabled={!srcUrl}
            onClick={handleDownloadSingle}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D94F1D] hover:bg-[#C4461A] text-white text-xs font-bold disabled:opacity-40 transition"
          >
            <Download className="w-4 h-4" />
            <span>Download Single Photo</span>
          </button>
          <button
            type="button"
            disabled={!srcUrl}
            onClick={handleDownloadSheet}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1A0F0A] hover:bg-[#3D2315] text-white text-xs font-bold disabled:opacity-40 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Download {copies}-Photo 4×6 Sheet</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const WALLPAPER_PALETTES = [
  { id: 'sunset', name: 'Peach Sunset', colors: ['#FFFAF6', '#F97316', '#7C2D12'] },
  { id: 'aurora', name: 'Cosmic Aurora', colors: ['#0F172A', '#6366F1', '#06B6D4'] },
  { id: 'cyber', name: 'Neon Cyber', colors: ['#18181B', '#EC4899', '#8B5CF6'] },
  { id: 'forest', name: 'Emerald Mist', colors: ['#022C22', '#10B981', '#A7F3D0'] },
  { id: 'gold', name: 'Obsidian Gold', colors: ['#111827', '#D97706', '#FEF3C7'] },
];

export function WallpaperStudioTool() {
  const [paletteId, setPaletteId] = useState('sunset');
  const [styleMode, setStyleMode] = useState<'mesh' | 'waves' | 'stars'>('mesh');
  const [resolution, setResolution] = useState<'mobile' | 'desktop'>('desktop');
  const [quoteText, setQuoteText] = useState('STAY FOCUSED');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const palette = WALLPAPER_PALETTES.find((p) => p.id === paletteId) || WALLPAPER_PALETTES[0];

  const drawWallpaper = (canvas: HTMLCanvasElement, targetW: number, targetH: number) => {
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d')!;

    // Base Gradient
    const grad = ctx.createLinearGradient(0, 0, targetW, targetH);
    grad.addColorStop(0, palette.colors[0]);
    grad.addColorStop(0.55, palette.colors[1]);
    grad.addColorStop(1, palette.colors[2]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, targetW, targetH);

    if (styleMode === 'mesh') {
      const orbs = [
        { x: targetW * 0.2, y: targetH * 0.25, r: targetW * 0.45, c: palette.colors[1] },
        { x: targetW * 0.8, y: targetH * 0.75, r: targetW * 0.5, c: palette.colors[2] },
        { x: targetW * 0.6, y: targetH * 0.2, r: targetW * 0.35, c: palette.colors[0] },
      ];
      orbs.forEach((o) => {
        const rg = ctx.createRadialGradient(o.x, o.y, 10, o.x, o.y, o.r);
        rg.addColorStop(0, `${o.c}CC`);
        rg.addColorStop(1, `${o.c}00`);
        ctx.fillStyle = rg;
        ctx.fillRect(0, 0, targetW, targetH);
      });
    } else if (styleMode === 'waves') {
      for (let w = 0; w < 5; w++) {
        ctx.beginPath();
        const baseY = targetH * (0.35 + w * 0.13);
        ctx.moveTo(0, targetH);
        for (let x = 0; x <= targetW; x += targetW / 20) {
          const y = baseY + Math.sin(x * 0.004 + w * 1.4) * (targetH * 0.06);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(targetW, targetH);
        ctx.closePath();
        ctx.fillStyle = w % 2 === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)';
        ctx.fill();
      }
    } else {
      // Stars / particles
      for (let i = 0; i < 180; i++) {
        const x = ((i * 7919) % 1000) / 1000 * targetW;
        const y = ((i * 6271) % 1000) / 1000 * targetH;
        const r = ((i % 4) + 1) * (targetW / 900);
        ctx.beginPath();
        ctx.arc(x, y, Math.max(1, r), 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.65)';
        ctx.fill();
      }
    }

    if (quoteText.trim()) {
      ctx.font = `800 ${Math.round(targetW * 0.045)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(255,255,255,0.92)';
      ctx.shadowColor = 'rgba(0,0,0,0.28)';
      ctx.shadowBlur = targetW * 0.015;
      ctx.fillText(quoteText.trim(), targetW / 2, targetH / 2);
      ctx.shadowBlur = 0;
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    const w = resolution === 'desktop' ? 960 : 450;
    const h = resolution === 'desktop' ? 540 : 800;
    drawWallpaper(canvasRef.current, w, h);
  });

  const handleDownload4K = () => {
    const offscreen = document.createElement('canvas');
    const w = resolution === 'desktop' ? 3840 : 1440;
    const h = resolution === 'desktop' ? 2160 : 3200;
    drawWallpaper(offscreen, w, h);
    const link = document.createElement('a');
    link.download = `publixa-4k-${paletteId}-${resolution}.png`;
    link.href = offscreen.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-5 bg-[#FFF9F5] border border-[#F0DFD5] rounded-2xl p-5 space-y-4">
        <div>
          <label className="text-xs font-bold text-[#8C7A70] block mb-2">Color Palette</label>
          <div className="flex flex-wrap gap-2">
            {WALLPAPER_PALETTES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPaletteId(p.id)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${
                  paletteId === p.id ? 'bg-[#1A0F0A] text-white border-[#1A0F0A]' : 'bg-white border-[#E5CEC0]'
                }`}
              >
                <span className="w-3 h-3 rounded-full" style={{ background: `linear-gradient(135deg, ${p.colors[1]}, ${p.colors[2]})` }} />
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-[#8C7A70] block mb-2">Artwork Pattern</label>
          <div className="flex gap-2">
            {(['mesh', 'waves', 'stars'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setStyleMode(m)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize ${
                  styleMode === m ? 'bg-[#D94F1D] text-white' : 'bg-white border border-[#E5CEC0]'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-[#8C7A70] block mb-2">Target Resolution</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setResolution('desktop')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold ${
                resolution === 'desktop' ? 'bg-[#1A0F0A] text-white' : 'bg-white border border-[#E5CEC0]'
              }`}
            >
              4K Desktop (3840×2160)
            </button>
            <button
              type="button"
              onClick={() => setResolution('mobile')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold ${
                resolution === 'mobile' ? 'bg-[#1A0F0A] text-white' : 'bg-white border border-[#E5CEC0]'
              }`}
            >
              Mobile QHD (1440×3200)
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-[#8C7A70] block mb-1">Optional Center Text</label>
          <input
            type="text"
            value={quoteText}
            onChange={(e) => setQuoteText(e.target.value)}
            placeholder="Leave empty for clean art"
            className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E5CEC0] text-sm font-bold"
          />
        </div>

        <button
          type="button"
          onClick={handleDownload4K}
          className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#D94F1D] hover:bg-[#C4461A] text-white font-bold text-sm shadow-md transition"
        >
          <Download className="w-4 h-4" />
          <span>Download True {resolution === 'desktop' ? '4K UHD' : 'Mobile 4K'} PNG</span>
        </button>
      </div>

      <div className="lg:col-span-7 flex justify-center bg-[#FFF9F5] border border-[#F0DFD5] rounded-2xl p-4">
        <canvas ref={canvasRef} className="max-h-[380px] w-auto rounded-xl shadow-lg border border-white/50" />
      </div>
    </div>
  );
}

export function StatusMediaStudioTool() {
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'video' | 'image'>('video');
  const [meta, setMeta] = useState<{ name: string; sizeMb: string; info: string } | null>(null);
  const [captionTopic, setCaptionTopic] = useState('Morning Vibes');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const captions = [
    `✨ ${captionTopic} — Starting fresh and staying focused! #GoodVibes #DailyMood #Status`,
    `🔥 Level up every single day. ${captionTopic} edition! #Motivation #Trending #Reels`,
    `🌿 Simple moments make the best memories. ${captionTopic} 💫 #Lifestyle #Aesthetic`,
    `⚡ Energy unmatched. ${captionTopic} mode ON! 💯 #StatusQuote #Explore`,
  ];

  const handleLoadMedia = (file: File | undefined) => {
    if (!file) return;
    if (mediaUrl) URL.revokeObjectURL(mediaUrl);
    const url = URL.createObjectURL(file);
    setMediaUrl(url);
    const isVid = file.type.startsWith('video');
    setMediaType(isVid ? 'video' : 'image');
    setMeta({
      name: file.name,
      sizeMb: (file.size / 1024 / 1024).toFixed(2),
      info: file.type || 'Media File',
    });
  };

  const handleCaptureFrame = () => {
    const v = videoRef.current;
    if (!v) return;
    const canvas = document.createElement('canvas');
    canvas.width = v.videoWidth || 1280;
    canvas.height = v.videoHeight || 720;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
    const link = document.createElement('a');
    link.download = `publixa-frame-${Math.round(v.currentTime)}s.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-6 space-y-4">
        <label className="flex items-center justify-center gap-3 p-5 rounded-2xl border-2 border-dashed border-[#E5CEC0] bg-[#FFF9F5] hover:border-[#D94F1D] cursor-pointer transition">
          <Video className="w-6 h-6 text-[#D94F1D]" />
          <span className="font-bold text-sm text-[#1A0F0A]">Open Local Status Video / Image to Inspect &amp; Snapshot</span>
          <input type="file" accept="video/*,image/*" className="hidden" onChange={(e) => handleLoadMedia(e.target.files?.[0])} />
        </label>

        {mediaUrl ? (
          <div className="bg-white border border-[#F0DFD5] rounded-2xl p-4 space-y-3">
            {mediaType === 'video' ? (
              <video ref={videoRef} src={mediaUrl} controls className="w-full max-h-[280px] rounded-xl bg-black" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={mediaUrl} alt="Preview" className="w-full max-h-[280px] object-contain rounded-xl bg-slate-100" />
            )}
            {meta && (
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#665349]">
                <span className="font-bold text-[#1A0F0A] truncate max-w-[200px]">{meta.name}</span>
                <span>{meta.sizeMb} MB • {meta.info}</span>
              </div>
            )}
            {mediaType === 'video' && (
              <button
                type="button"
                onClick={handleCaptureFrame}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#D94F1D] hover:bg-[#C4461A] text-white font-bold text-xs transition"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Capture HD PNG Frame Snapshot</span>
              </button>
            )}
          </div>
        ) : (
          <div className="h-[240px] rounded-2xl border border-[#F0DFD5] bg-[#FFF9F5] flex flex-col items-center justify-center text-center p-6 text-[#8C7A70]">
            <Sparkles className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-xs font-semibold">Load any MP4/WebM status clip to extract crystal-clear frame thumbnails</p>
          </div>
        )}
      </div>

      <div className="lg:col-span-6 bg-[#FFF9F5] border border-[#F0DFD5] rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-[#1A0F0A]">Status Caption &amp; Hashtag Generator</h4>
          <button
            type="button"
            onClick={() => downloadText(captions.join('\n\n'), 'status-captions.txt')}
            className="text-xs font-bold text-[#D94F1D] hover:underline"
          >
            Save .TXT
          </button>
        </div>

        <input
          type="text"
          value={captionTopic}
          onChange={(e) => setCaptionTopic(e.target.value)}
          placeholder="Enter status mood or topic..."
          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5CEC0] text-sm font-bold"
        />

        <div className="space-y-2.5">
          {captions.map((cap, i) => (
            <div key={i} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white border border-[#F0DFD5]">
              <p className="text-xs sm:text-sm text-[#3D2315]">{cap}</p>
              <button
                type="button"
                onClick={async () => {
                  await navigator.clipboard.writeText(cap);
                  setCopiedIdx(i);
                  setTimeout(() => setCopiedIdx(null), 1500);
                }}
                className="p-2 rounded-lg bg-[#FFF0E6] text-[#D94F1D] shrink-0"
              >
                {copiedIdx === i ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
