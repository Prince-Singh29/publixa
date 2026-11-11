'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Upload,
  Download,
  Copy,
  Check,
  Image as ImageIcon,
  Palette,
  FileText,
  GitCompare,
  KeyRound,
  Calculator,
  Calendar,
  ShieldCheck,
} from 'lucide-react';
import { downloadText } from './downloadBlob';

// ============================================================================
// 1. IMAGE COMPRESSOR (JPG / WEBP)
// ============================================================================
export function ImageCompressorTool() {
  const [srcUrl, setSrcUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('photo.jpg');
  const [origBytes, setOrigBytes] = useState(0);
  const [quality, setQuality] = useState(0.75);
  const [format, setFormat] = useState<'image/jpeg' | 'image/webp'>('image/jpeg');
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [outBytes, setOutBytes] = useState(0);

  useEffect(() => {
    if (!srcUrl) return;
    let active = true;
    const img = new window.Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0);
      c.toBlob(
        (blob) => {
          if (!blob || !active) return;
          setOutBytes(blob.size);
          setOutUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return URL.createObjectURL(blob);
          });
        },
        format,
        quality
      );
    };
    img.src = srcUrl;
    return () => {
      active = false;
    };
  }, [srcUrl, quality, format]);

  const savedPct = origBytes > 0 && outBytes > 0 ? Math.max(0, Math.round(((origBytes - outBytes) / origBytes) * 100)) : 0;

  return (
    <div className="space-y-5">
      <label className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-[#E5CEC0] hover:border-[#D94F1D] bg-[#FFF9F5] cursor-pointer text-center">
        <Upload className="w-7 h-7 text-[#D94F1D] mb-2" />
        <span className="font-bold text-sm text-[#1A0F0A]">Upload Image to Compress (JPG, PNG, WebP)</span>
        <span className="text-xs text-[#665349] mt-1">{srcUrl ? `${fileName} (${(origBytes / 1024).toFixed(1)} KB)` : 'Runs 100% locally in browser Canvas RAM'}</span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            setFileName(f.name);
            setOrigBytes(f.size);
            const r = new FileReader();
            r.onload = () => setSrcUrl(String(r.result));
            r.readAsDataURL(f);
          }}
        />
      </label>

      {srcUrl && (
        <div className="bg-[#FFF9F5] border border-[#F0DFD5] rounded-2xl p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <label className="space-y-1 text-xs font-bold text-[#3D2315]">
              <span>Quality: {Math.round(quality * 100)}%</span>
              <input type="range" min={0.1} max={0.95} step={0.05} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-[#D94F1D]" />
            </label>
            <div className="flex gap-2">
              {(['image/jpeg', 'image/webp'] as const).map((fmt) => (
                <button key={fmt} type="button" onClick={() => setFormat(fmt)} className={`px-4 py-2 rounded-full text-xs font-bold ${format === fmt ? 'bg-[#1A0F0A] text-white' : 'bg-white border border-[#E5CEC0]'}`}>
                  {fmt === 'image/jpeg' ? 'JPG' : 'WebP'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-[#F0DFD5] rounded-xl p-4 text-xs">
            <div>
              <span className="font-bold text-[#1A0F0A]">Original:</span> {(origBytes / 1024).toFixed(1)} KB → <span className="font-bold text-emerald-700">Compressed: {(outBytes / 1024).toFixed(1)} KB ({savedPct}% smaller)</span>
            </div>
            {outUrl && (
              <a
                href={outUrl}
                download={`compressed-${fileName.replace(/\.[^.]+$/, '')}.${format === 'image/webp' ? 'webp' : 'jpg'}`}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#D94F1D] text-white font-bold"
              >
                <Download className="w-4 h-4" />
                <span>Download Compressed</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 2. IMAGE & SVG CONVERTER
// ============================================================================
export function ImageConverterTool() {
  const [srcUrl, setSrcUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('image');
  const [targetFmt, setTargetFmt] = useState<'image/png' | 'image/jpeg' | 'image/webp'>('image/png');
  const [scaleMult, setScaleMult] = useState<1 | 2 | 3>(1);

  const handleConvert = () => {
    if (!srcUrl) return;
    const img = new window.Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = Math.max(1, img.width * scaleMult);
      c.height = Math.max(1, img.height * scaleMult);
      const ctx = c.getContext('2d')!;
      if (targetFmt === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, c.width, c.height);
      }
      ctx.drawImage(img, 0, 0, c.width, c.height);
      const ext = targetFmt === 'image/png' ? 'png' : targetFmt === 'image/webp' ? 'webp' : 'jpg';
      const a = document.createElement('a');
      a.href = c.toDataURL(targetFmt, 0.94);
      a.download = `${fileName.replace(/\.[^.]+$/, '')}-${scaleMult}x.${ext}`;
      a.click();
    };
    img.src = srcUrl;
  };

  return (
    <div className="space-y-5">
      <label className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-[#E5CEC0] hover:border-[#D94F1D] bg-[#FFF9F5] cursor-pointer text-center">
        <ImageIcon className="w-7 h-7 text-[#D94F1D] mb-2" />
        <span className="font-bold text-sm text-[#1A0F0A]">Upload PNG, JPG, WebP, BMP, or Vector .SVG</span>
        <input
          type="file"
          accept="image/*,.svg"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            setFileName(f.name);
            const r = new FileReader();
            r.onload = () => setSrcUrl(String(r.result));
            r.readAsDataURL(f);
          }}
        />
      </label>

      {srcUrl && (
        <div className="bg-[#FFF9F5] border border-[#F0DFD5] rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {([
              { id: 'image/png', label: 'Convert to PNG' },
              { id: 'image/jpeg', label: 'Convert to JPG' },
              { id: 'image/webp', label: 'Convert to WebP' },
            ] as const).map((f) => (
              <button key={f.id} type="button" onClick={() => setTargetFmt(f.id)} className={`px-4 py-2 rounded-full text-xs font-bold ${targetFmt === f.id ? 'bg-[#1A0F0A] text-white' : 'bg-white border border-[#E5CEC0]'}`}>
                {f.label}
              </button>
            ))}
            {([1, 2, 3] as const).map((s) => (
              <button key={s} type="button" onClick={() => setScaleMult(s)} className={`px-3 py-2 rounded-full text-xs font-bold ${scaleMult === s ? 'bg-[#D94F1D] text-white' : 'bg-white border border-[#E5CEC0]'}`}>
                {s}x DPI
              </button>
            ))}
          </div>
          <button type="button" onClick={handleConvert} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D94F1D] text-white font-bold text-sm">
            <Download className="w-4 h-4" />
            <span>Convert &amp; Download</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 3. IMAGE RESIZER
// ============================================================================
export function ImageResizerTool() {
  const [srcUrl, setSrcUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('resized.png');
  const [origW, setOrigW] = useState(1080);
  const [origH, setOrigH] = useState(1080);
  const [w, setW] = useState(1080);
  const [h, setH] = useState(1080);
  const [lockRatio, setLockRatio] = useState(true);

  const handleUpload = (file: File | undefined) => {
    if (!file) return;
    setFileName(file.name);
    const r = new FileReader();
    r.onload = () => {
      const url = String(r.result);
      const img = new window.Image();
      img.onload = () => {
        setOrigW(img.width);
        setOrigH(img.height);
        setW(img.width);
        setH(img.height);
        setSrcUrl(url);
      };
      img.src = url;
    };
    r.readAsDataURL(file);
  };

  const handleResizeDownload = () => {
    if (!srcUrl) return;
    const img = new window.Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = Math.max(1, w);
      c.height = Math.max(1, h);
      c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
      const a = document.createElement('a');
      a.href = c.toDataURL('image/png');
      a.download = `resized-${c.width}x${c.height}-${fileName.replace(/\.[^.]+$/, '')}.png`;
      a.click();
    };
    img.src = srcUrl;
  };

  return (
    <div className="space-y-5">
      <label className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-[#E5CEC0] hover:border-[#D94F1D] bg-[#FFF9F5] cursor-pointer text-center">
        <Upload className="w-7 h-7 text-[#D94F1D] mb-2" />
        <span className="font-bold text-sm text-[#1A0F0A]">Select Image to Resize ({origW}×{origH}px)</span>
        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e.target.files?.[0])} />
      </label>

      {srcUrl && (
        <div className="bg-[#FFF9F5] border border-[#F0DFD5] rounded-2xl p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <label className="block space-y-1 text-xs font-bold">
              <span>Width (px)</span>
              <input
                type="number"
                value={w}
                onChange={(e) => {
                  const nw = Math.max(1, Number(e.target.value));
                  setW(nw);
                  if (lockRatio && origW > 0) setH(Math.max(1, Math.round((nw * origH) / origW)));
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5CEC0] text-sm font-bold"
              />
            </label>
            <label className="block space-y-1 text-xs font-bold">
              <span>Height (px)</span>
              <input
                type="number"
                value={h}
                onChange={(e) => {
                  const nh = Math.max(1, Number(e.target.value));
                  setH(nh);
                  if (lockRatio && origH > 0) setW(Math.max(1, Math.round((nh * origW) / origH)));
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5CEC0] text-sm font-bold"
              />
            </label>
            <label className="flex items-center gap-2 text-xs font-bold cursor-pointer pb-2">
              <input type="checkbox" checked={lockRatio} onChange={(e) => setLockRatio(e.target.checked)} className="accent-[#D94F1D]" />
              <span>Lock Aspect Ratio</span>
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: '512×512 Icon', w: 512, h: 512 },
              { label: '1080×1080 Social', w: 1080, h: 1080 },
              { label: '1920×1080 Full HD', w: 1920, h: 1080 },
            ].map((p) => (
              <button key={p.label} type="button" onClick={() => { setW(p.w); setH(p.h); }} className="px-3.5 py-1.5 rounded-full bg-white border border-[#E5CEC0] text-xs font-bold hover:border-[#D94F1D]">
                {p.label}
              </button>
            ))}
          </div>
          <button type="button" onClick={handleResizeDownload} className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#D94F1D] text-white font-bold text-sm">
            <Download className="w-4 h-4" />
            <span>Resize &amp; Download PNG</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 4. STRIP PHOTO EXIF METADATA
// ============================================================================
export function ImageStripExifTool() {
  const [doneName, setDoneName] = useState<string | null>(null);

  const handleStrip = (file: File | undefined) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = img.width;
        c.height = img.height;
        c.getContext('2d')!.drawImage(img, 0, 0);
        c.toBlob((blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `clean-no-exif-${file.name.replace(/\.[^.]+$/, '')}.jpg`;
          a.click();
          URL.revokeObjectURL(url);
          setDoneName(file.name);
        }, 'image/jpeg', 0.94);
      };
      img.src = String(r.result);
    };
    r.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <label className="flex flex-col items-center justify-center p-10 rounded-2xl border-2 border-dashed border-[#E5CEC0] hover:border-[#D94F1D] bg-[#FFF9F5] cursor-pointer text-center">
        <ShieldCheck className="w-9 h-9 text-emerald-600 mb-2" />
        <span className="font-bold text-sm text-[#1A0F0A]">Select Photo to Wipe GPS, Camera Model &amp; EXIF Tags</span>
        <span className="text-xs text-[#665349] mt-1">Re-encodes raw pixel matrix cleanly in browser RAM</span>
        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleStrip(e.target.files?.[0])} />
      </label>
      {doneName && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold">
          Stripped all EXIF &amp; GPS metadata from {doneName} and downloaded your privacy-clean JPEG!
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 5. IMAGE COLOR & PALETTE EXTRACTOR
// ============================================================================
export function ImagePalettePickerTool() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [srcUrl, setSrcUrl] = useState<string | null>(null);
  const [pickedHex, setPickedHex] = useState('#D94F1D');
  const [swatches, setSwatches] = useState<string[]>([]);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  useEffect(() => {
    if (!srcUrl || !canvasRef.current) return;
    const c = canvasRef.current;
    const ctx = c.getContext('2d')!;
    const img = new window.Image();
    img.onload = () => {
      const scale = img.width > 720 ? 720 / img.width : 1;
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      ctx.drawImage(img, 0, 0, c.width, c.height);

      const data = ctx.getImageData(0, 0, c.width, c.height).data;
      const counts = new Map<string, number>();
      const step = Math.max(16, Math.floor(data.length / 4000) * 4);
      for (let i = 0; i < data.length - 4; i += step) {
        const r = Math.round(data[i] / 24) * 24;
        const g = Math.round(data[i + 1] / 24) * 24;
        const b = Math.round(data[i + 2] / 24) * 24;
        const hex = `#${[r, g, b].map((v) => Math.min(255, v).toString(16).padStart(2, '0')).join('')}`.toUpperCase();
        counts.set(hex, (counts.get(hex) || 0) + 1);
      }
      setSwatches(Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8).map((x) => x[0]));
    };
    img.src = srcUrl;
  }, [srcUrl]);

  const handleSample = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current;
    if (!c) return;
    const rect = c.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * c.width);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * c.height);
    const px = c.getContext('2d')!.getImageData(x, y, 1, 1).data;
    const hex = `#${[px[0], px[1], px[2]].map((v) => v.toString(16).padStart(2, '0')).join('')}`.toUpperCase();
    setPickedHex(hex);
  };

  return (
    <div className="space-y-5">
      <label className="flex items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed border-[#E5CEC0] bg-[#FFF9F5] cursor-pointer">
        <Palette className="w-6 h-6 text-[#D94F1D]" />
        <span className="font-bold text-sm">Upload Photo or Screenshot to Pick Colors &amp; Extract Palette</span>
        <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = () => setSrcUrl(String(r.result)); r.readAsDataURL(f); }} />
      </label>

      {srcUrl && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-8 rounded-2xl border border-[#F0DFD5] bg-[#FFF9F5] p-3 flex justify-center">
            <canvas ref={canvasRef} onClick={handleSample} className="max-w-full rounded-xl cursor-crosshair" />
          </div>
          <div className="lg:col-span-4 bg-[#FFF9F5] border border-[#F0DFD5] rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl border border-black/10 shrink-0" style={{ backgroundColor: pickedHex }} />
              <div>
                <div className="text-[11px] font-bold text-[#8C7A70] uppercase">Picked Pixel Color</div>
                <button type="button" onClick={() => { navigator.clipboard.writeText(pickedHex); setCopiedHex(pickedHex); }} className="font-mono font-extrabold text-base text-[#1A0F0A] hover:text-[#D94F1D]">
                  {pickedHex} {copiedHex === pickedHex ? '✓' : 'Copy'}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-bold text-[#3D2315]">Extracted Swatches</div>
              <div className="grid grid-cols-2 gap-2">
                {swatches.map((hex) => (
                  <button key={hex} type="button" onClick={() => { navigator.clipboard.writeText(hex); setCopiedHex(hex); }} className="flex items-center gap-2 p-2 rounded-xl bg-white border border-[#F0DFD5] hover:border-[#D94F1D] text-xs font-mono font-bold">
                    <span className="w-5 h-5 rounded-md border shrink-0" style={{ backgroundColor: hex }} />
                    <span>{copiedHex === hex ? 'Copied' : hex}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 6. WORD COUNTER & CASE CONVERTER
// ============================================================================
export function WordCounterCaseTool() {
  const [text, setText] = useState('Publixa Offline Web Tools help writers count words, transform headings to Title Case, and build clean URL slugs instantaneously.');
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const sentences = trimmed ? trimmed.split(/[.!?]+/).filter(Boolean).length : 0;
    const readMin = Math.max(1, Math.ceil(words / 200));
    return { words, chars, charsNoSpaces, sentences, readMin };
  }, [text]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
        {[
          { label: 'Words', val: stats.words },
          { label: 'Characters', val: stats.chars },
          { label: 'No Spaces', val: stats.charsNoSpaces },
          { label: 'Sentences', val: stats.sentences },
          { label: 'Read Time', val: `~${stats.readMin} min` },
        ].map((s) => (
          <div key={s.label} className="bg-[#FFF9F5] border border-[#F0DFD5] rounded-2xl p-3">
            <div className="text-xl font-black text-[#1A0F0A]">{s.val}</div>
            <div className="text-[11px] font-bold text-[#8C7A70] uppercase">{s.label}</div>
          </div>
        ))}
      </div>

      <textarea rows={7} value={text} onChange={(e) => setText(e.target.value)} className="w-full p-4 rounded-2xl bg-[#FFF9F5] border border-[#E5CEC0] text-sm" />

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setText(text.toUpperCase())} className="px-4 py-2 rounded-full bg-white border border-[#E5CEC0] text-xs font-bold hover:border-[#D94F1D]">UPPERCASE</button>
        <button type="button" onClick={() => setText(text.toLowerCase())} className="px-4 py-2 rounded-full bg-white border border-[#E5CEC0] text-xs font-bold hover:border-[#D94F1D]">lowercase</button>
        <button type="button" onClick={() => setText(text.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase()))} className="px-4 py-2 rounded-full bg-white border border-[#E5CEC0] text-xs font-bold hover:border-[#D94F1D]">Title Case</button>
        <button type="button" onClick={() => setText(text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))} className="px-4 py-2 rounded-full bg-white border border-[#E5CEC0] text-xs font-bold hover:border-[#D94F1D]">url-slug-case</button>
        <button type="button" onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1400); }} className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#D94F1D] text-white text-xs font-bold">
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied!' : 'Copy Result'}</span>
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// 7. TEXT DIFF COMPARE TOOL
// ============================================================================
export function TextDiffCompareTool() {
  const [leftText, setLeftText] = useState('Publixa v1.0\n24 PDF Tools\nManual Workflow');
  const [rightText, setRightText] = useState('Publixa v2.0\n34 PDF Tools\nInstant Standalone Pages\nZero Server Uploads');

  const diffRows = useMemo(() => {
    const a = leftText.split('\n');
    const b = rightText.split('\n');
    const maxLen = Math.max(a.length, b.length);
    const out: { line: number; type: 'same' | 'removed' | 'added' | 'changed'; left?: string; right?: string }[] = [];
    for (let i = 0; i < maxLen; i++) {
      if (a[i] === b[i]) out.push({ line: i + 1, type: 'same', left: a[i] });
      else if (a[i] !== undefined && b[i] === undefined) out.push({ line: i + 1, type: 'removed', left: a[i] });
      else if (a[i] === undefined && b[i] !== undefined) out.push({ line: i + 1, type: 'added', right: b[i] });
      else out.push({ line: i + 1, type: 'changed', left: a[i], right: b[i] });
    }
    return out;
  }, [leftText, rightText]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#3D2315] flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-[#D94F1D]" /> Original Text</label>
          <textarea rows={6} value={leftText} onChange={(e) => setLeftText(e.target.value)} className="w-full p-3.5 rounded-xl bg-[#FFF9F5] border border-[#E5CEC0] font-mono text-xs" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#3D2315] flex items-center gap-1.5"><GitCompare className="w-3.5 h-3.5 text-emerald-700" /> Revised Text</label>
          <textarea rows={6} value={rightText} onChange={(e) => setRightText(e.target.value)} className="w-full p-3.5 rounded-xl bg-[#FFF9F5] border border-[#E5CEC0] font-mono text-xs" />
        </div>
      </div>

      <div className="rounded-2xl border border-[#F0DFD5] bg-white overflow-hidden font-mono text-xs">
        {diffRows.map((row) => (
          <div key={row.line} className="border-b border-[#FFF0E6] last:border-b-0">
            {row.type === 'same' && <div className="px-4 py-1.5 text-[#665349]">{row.line}: {row.left}</div>}
            {row.type === 'removed' && <div className="px-4 py-1.5 bg-rose-50 text-rose-800">- {row.line}: {row.left}</div>}
            {row.type === 'added' && <div className="px-4 py-1.5 bg-emerald-50 text-emerald-800">+ {row.line}: {row.right}</div>}
            {row.type === 'changed' && (
              <>
                <div className="px-4 py-1 bg-rose-50 text-rose-800">- {row.line}: {row.left}</div>
                <div className="px-4 py-1 bg-emerald-50 text-emerald-800">+ {row.line}: {row.right}</div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 8. UUID V4 & CRYPTOGRAPHIC HASH GENERATOR
// ============================================================================
export function HashUuidGeneratorTool() {
  const [inputStr, setInputStr] = useState('Publixa Privacy First');
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [uuids, setUuids] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      const enc = new TextEncoder().encode(inputStr);
      const algos = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as const;
      const res: Record<string, string> = {};
      for (const alg of algos) {
        const buf = await crypto.subtle.digest(alg, enc);
        res[alg] = Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');
      }
      if (active) setHashes(res);
    })();
    return () => {
      active = false;
    };
  }, [inputStr]);

  const genUuids = (n: number) => {
    setUuids(Array.from({ length: n }, () => crypto.randomUUID()));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-[#FFF9F5] border border-[#F0DFD5] rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 font-bold text-sm text-[#1A0F0A]">
          <KeyRound className="w-4 h-4 text-[#D94F1D]" />
          <span>Web Crypto SHA Digests</span>
        </div>
        <textarea rows={3} value={inputStr} onChange={(e) => setInputStr(e.target.value)} className="w-full p-3 rounded-xl bg-white border border-[#E5CEC0] text-xs font-mono" />
        <div className="space-y-2.5 text-xs">
          {Object.entries(hashes).map(([alg, val]) => (
            <div key={alg} className="bg-white border border-[#F0DFD5] rounded-xl p-3 space-y-1">
              <div className="flex justify-between font-bold text-[#D94F1D]">
                <span>{alg}</span>
                <button type="button" onClick={() => navigator.clipboard.writeText(val)} className="hover:underline">Copy</button>
              </div>
              <div className="font-mono text-[11px] break-all text-[#3D2315]">{val}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#FFF9F5] border border-[#F0DFD5] rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-bold text-sm text-[#1A0F0A]">Bulk UUID v4 Generator</span>
          <div className="flex gap-1.5">
            {[1, 5, 10].map((n) => (
              <button key={n} type="button" onClick={() => genUuids(n)} className="px-3.5 py-1.5 rounded-full bg-[#D94F1D] text-white text-xs font-bold">
                +{n} UUID{n > 1 ? 's' : ''}
              </button>
            ))}
          </div>
        </div>
        <textarea
          readOnly
          rows={8}
          value={uuids.length ? uuids.join('\n') : 'Click +1, +5, or +10 UUIDs to generate cryptographically random RFC 4122 IDs.'}
          className="w-full p-3.5 rounded-xl bg-white border border-[#E5CEC0] font-mono text-xs"
        />
        {uuids.length > 0 && (
          <button type="button" onClick={() => downloadText(uuids.join('\n'), 'publixa-uuids.txt')} className="px-5 py-2 rounded-full bg-[#1A0F0A] text-white text-xs font-bold">
            Download .TXT
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 9. EMI, SIP & DISCOUNT CALCULATOR
// ============================================================================
export function FinanceEmiSipTool() {
  const [mode, setMode] = useState<'emi' | 'sip' | 'discount'>('emi');
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(9.5);
  const [months, setMonths] = useState(60);

  const emiResult = useMemo(() => {
    const r = rate / 12 / 100;
    const emi = r === 0 ? amount / months : (amount * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
    const total = emi * months;
    return { emi: Math.round(emi), total: Math.round(total), interest: Math.round(total - amount) };
  }, [amount, rate, months]);

  const sipResult = useMemo(() => {
    const r = rate / 12 / 100;
    const invested = amount * months;
    const fv = r === 0 ? invested : amount * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
    return { invested: Math.round(invested), fv: Math.round(fv), wealthGain: Math.round(fv - invested) };
  }, [amount, rate, months]);

  const discountFinal = Math.round(amount * (1 - Math.min(100, Math.max(0, rate)) / 100));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'emi', label: 'Loan EMI Calculator' },
          { id: 'sip', label: 'Mutual Fund SIP Calculator' },
          { id: 'discount', label: 'Discount % Calculator' },
        ].map((m) => (
          <button key={m.id} type="button" onClick={() => { setMode(m.id as 'emi' | 'sip' | 'discount'); if (m.id === 'sip') setAmount(10000); else if (m.id === 'emi') setAmount(500000); else setAmount(2499); }} className={`px-4 py-2 rounded-full text-xs font-bold ${mode === m.id ? 'bg-[#D94F1D] text-white' : 'bg-[#FFF0E6] text-[#3D2315]'}`}>
            {m.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#FFF9F5] border border-[#F0DFD5] rounded-2xl p-5">
        <label className="block space-y-1 text-xs font-bold">
          <span>{mode === 'sip' ? 'Monthly SIP Amount' : mode === 'discount' ? 'Original Price' : 'Loan Principal'}</span>
          <input type="number" value={amount} onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))} className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5CEC0] text-sm font-bold" />
        </label>
        <label className="block space-y-1 text-xs font-bold">
          <span>{mode === 'discount' ? 'Discount (%)' : 'Annual Rate (%)'}</span>
          <input type="number" step={0.1} value={rate} onChange={(e) => setRate(Math.max(0, Number(e.target.value)))} className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5CEC0] text-sm font-bold" />
        </label>
        {mode !== 'discount' && (
          <label className="block space-y-1 text-xs font-bold">
            <span>Tenure (Months)</span>
            <input type="number" value={months} onChange={(e) => setMonths(Math.max(1, Number(e.target.value)))} className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5CEC0] text-sm font-bold" />
          </label>
        )}
      </div>

      {mode === 'emi' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-[#F0DFD5] rounded-2xl p-4"><Calculator className="w-4 h-4 text-[#D94F1D] mb-1" /><div className="text-xs text-[#8C7A70] font-bold">Monthly EMI</div><div className="text-2xl font-black">{emiResult.emi.toLocaleString()}</div></div>
          <div className="bg-white border border-[#F0DFD5] rounded-2xl p-4"><div className="text-xs text-[#8C7A70] font-bold">Total Interest</div><div className="text-2xl font-black text-rose-700">{emiResult.interest.toLocaleString()}</div></div>
          <div className="bg-white border border-[#F0DFD5] rounded-2xl p-4"><div className="text-xs text-[#8C7A70] font-bold">Total Payable</div><div className="text-2xl font-black">{emiResult.total.toLocaleString()}</div></div>
        </div>
      )}

      {mode === 'sip' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-[#F0DFD5] rounded-2xl p-4"><div className="text-xs text-[#8C7A70] font-bold">Total Invested</div><div className="text-2xl font-black">{sipResult.invested.toLocaleString()}</div></div>
          <div className="bg-white border border-[#F0DFD5] rounded-2xl p-4"><div className="text-xs text-[#8C7A70] font-bold">Est. Returns</div><div className="text-2xl font-black text-emerald-700">{sipResult.wealthGain.toLocaleString()}</div></div>
          <div className="bg-white border border-[#F0DFD5] rounded-2xl p-4"><div className="text-xs text-[#8C7A70] font-bold">Total Maturity Value</div><div className="text-2xl font-black text-[#D94F1D]">{sipResult.fv.toLocaleString()}</div></div>
        </div>
      )}

      {mode === 'discount' && (
        <div className="bg-white border border-[#F0DFD5] rounded-2xl p-5 flex items-center justify-between">
          <div><div className="text-xs font-bold text-[#8C7A70]">Final Sale Price</div><div className="text-3xl font-black text-emerald-700">{discountFinal.toLocaleString()}</div></div>
          <div className="text-right"><div className="text-xs font-bold text-[#8C7A70]">You Save</div><div className="text-xl font-bold text-[#D94F1D]">{(amount - discountFinal).toLocaleString()}</div></div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 10. AGE & DATE DIFFERENCE CALCULATOR
// ============================================================================
export function AgeDateCalculatorTool() {
  const [dob, setDob] = useState('2000-05-15');
  const [targetDate, setTargetDate] = useState('2026-11-11');

  const diff = useMemo(() => {
    const start = new Date(dob);
    const end = new Date(targetDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
    const ms = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.floor(ms / 86400000);
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();
    if (days < 0) {
      months -= 1;
      days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    const weekday = start.toLocaleDateString('en-US', { weekday: 'long' });
    return { years, months, days, totalDays, weeks: Math.floor(totalDays / 7), weekday };
  }, [dob, targetDate]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FFF9F5] border border-[#F0DFD5] rounded-2xl p-5">
        <label className="block space-y-1 text-xs font-bold">
          <span>Start Date / Date of Birth</span>
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5CEC0] text-sm font-bold" />
        </label>
        <label className="block space-y-1 text-xs font-bold">
          <span>End / Reference Date</span>
          <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5CEC0] text-sm font-bold" />
        </label>
      </div>
      {diff && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-white border border-[#F0DFD5] rounded-2xl p-4"><Calendar className="w-4 h-4 text-[#D94F1D] mx-auto mb-1" /><div className="text-xl font-black">{diff.years}y {diff.months}m {diff.days}d</div><div className="text-[11px] font-bold text-[#8C7A70] uppercase">Exact Span</div></div>
          <div className="bg-white border border-[#F0DFD5] rounded-2xl p-4"><div className="text-xl font-black">{diff.totalDays.toLocaleString()}</div><div className="text-[11px] font-bold text-[#8C7A70] uppercase">Total Days</div></div>
          <div className="bg-white border border-[#F0DFD5] rounded-2xl p-4"><div className="text-xl font-black">{diff.weeks.toLocaleString()}</div><div className="text-[11px] font-bold text-[#8C7A70] uppercase">Total Weeks</div></div>
          <div className="bg-white border border-[#F0DFD5] rounded-2xl p-4"><div className="text-xl font-black text-[#D94F1D]">{diff.weekday}</div><div className="text-[11px] font-bold text-[#8C7A70] uppercase">Start Weekday</div></div>
        </div>
      )}
    </div>
  );
}

