'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Presentation,
  FileUp,
  FileDown,
  Plus,
  Trash2,
  Sparkles,
  FileText,
  CheckCircle2,
  AlertCircle,
  Maximize2,
  Minimize2,
  X,
  BarChart3,
  LayoutTemplate,
  Play,
  ExternalLink,
} from 'lucide-react';
import { downloadBytes, toWinAnsiSafe, hexToRgbTuple } from './downloadBlob';

export type PptToolTab = 'create' | 'reader' | 'charts' | 'outline' | 'templates';

interface SlideData {
  id: string;
  title: string;
  bullets: string;
  notes: string;
  chart?: { label: string; value: number }[];
}

interface PptToolsSuiteProps {
  defaultTab?: PptToolTab;
  appName?: string;
  fullViewport?: boolean;
}

const STORAGE_KEY = 'publixa_slides_workspace_v2';

const THEMES = [
  { id: 'peach', label: 'Publixa Peach', bg: '#FFFAF6', accent: '#D94F1D', text: '#1A0F0A', pptBg: 'FFFAF6', pptAccent: 'D94F1D', pptText: '1A0F0A' },
  { id: 'midnight', label: 'Midnight Pro', bg: '#0F172A', accent: '#F97316', text: '#F8FAFC', pptBg: '0F172A', pptAccent: 'F97316', pptText: 'F8FAFC' },
  { id: 'navy', label: 'Corporate Navy', bg: '#EFF6FF', accent: '#1D4ED8', text: '#0F172A', pptBg: 'EFF6FF', pptAccent: '1D4ED8', pptText: '0F172A' },
  { id: 'emerald', label: 'Modern Mint', bg: '#ECFDF5', accent: '#047857', text: '#064E3B', pptBg: 'ECFDF5', pptAccent: '047857', pptText: '064E3B' },
] as const;

const DECK_TEMPLATES: { name: string; desc: string; slides: Omit<SlideData, 'id'>[] }[] = [
  {
    name: 'Startup Pitch Deck',
    desc: 'Problem, Solution, Traction & Roadmap',
    slides: [
      { title: 'Our Vision & Problem Statement', bullets: 'Traditional mobile tools upload private files to unknown servers\nUsers want instant offline document & media tools\nMarket gap: 100% privacy-first mobile utilities', notes: 'Hook audience with privacy & speed.' },
      { title: 'The Publixa Solution', bullets: '35+ purpose-built Android apps with local processing\nZero account wall for everyday tools\nClean Material design & instant results', notes: 'Show app portfolio benefits.' },
      { title: 'Growth & Next Milestones', bullets: 'Expand browser-native Web Editions for desktop access\nDeliver weekly performance updates\nCommunity-requested feature roadmap', notes: 'Wrap up with Q&A callout.' },
    ],
  },
  {
    name: 'Project Status Report',
    desc: 'Sprint Progress, Blockers & Goals',
    slides: [
      { title: 'Executive Sprint Summary', bullets: 'Completed core web workbench launch\nZero critical build regressions\nAll automated asset audits passed', notes: 'Highlight completed milestones.' },
      { title: 'Upcoming Sprint Priorities', bullets: 'Performance profiling & mobile touch polish\nAdditional document template packs\nUser feedback review cycle', notes: 'Next 2 weeks focus.' },
    ],
  },
  {
    name: 'Classroom Lecture Slides',
    desc: 'Lesson Title, Key Concepts & Quiz',
    slides: [
      { title: 'Lesson Overview & Objectives', bullets: 'Understand core architecture principles\nCompare real-world examples\nComplete 3 practice takeaways at end of session', notes: 'Set learning expectations.' },
      { title: 'Summary & Quick Review', bullets: 'Concept 1: Local-first processing protects privacy\nConcept 2: Standardized formats improve portability\nHomework: Create your own 3-slide recap', notes: 'Assign quick recap exercise.' },
    ],
  },
];

export default function PptToolsSuite({
  defaultTab = 'create',
  fullViewport = false,
}: PptToolsSuiteProps) {
  const [deckTitle, setDeckTitle] = useState('Untitled presentation');
  const [themeId, setThemeId] = useState<string>('peach');
  const [slides, setSlides] = useState<SlideData[]>([
    {
      id: 's1',
      title: 'Publixa Quarterly Showcase',
      bullets: 'Built directly in the browser with zero uploads\nExport clean .pptx decks or widescreen PDFs\nPrivacy-first mobile & web productivity',
      notes: 'Opening slide introducing Publixa offline productivity architecture.',
    },
    {
      id: 's2',
      title: 'Core Highlights & Roadmap',
      bullets: '35+ verified mobile applications on Google Play\nInstant client-side PDF, PPT, Excel & DOC converters\nFast response times with zero server latency',
      notes: 'Walk through the core toolkit capabilities.',
    },
  ]);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [hydratedStorage, setHydratedStorage] = useState(false);

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<'none' | 'chart' | 'outline' | 'templates'>(
    defaultTab === 'charts' ? 'chart' : defaultTab === 'outline' ? 'outline' : defaultTab === 'templates' ? 'templates' : 'none'
  );
  const [presenterOpen, setPresenterOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(fullViewport);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);

  const [chartTitle, setChartTitle] = useState('Quarterly Performance Growth');
  const [chartRowsText, setChartRowsText] = useState('Q1 Growth, 42\nQ2 Growth, 68\nQ3 Growth, 85\nQ4 Growth, 110');
  const [outlineText, setOutlineText] = useState(
    `# Project Launch Plan\n- Define product goals and timeline\n- Coordinate design and QA milestones\n- Prepare Play Store release assets\n\n# Marketing Strategy\n- Publish official app landing page\n- Launch user feedback & privacy desk`
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const theme = THEMES.find((t) => t.id === themeId) || THEMES[0];
  const currentSlide = slides[Math.min(activeSlideIdx, Math.max(0, slides.length - 1))];

  // LocalStorage sync
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.slides) && parsed.slides.length > 0) {
          setDeckTitle(parsed.deckTitle || 'Untitled presentation');
          setThemeId(parsed.themeId || 'peach');
          setSlides(parsed.slides);
        }
      }
    } catch {
      // ignore
    } finally {
      setHydratedStorage(true);
    }
  }, []);

  useEffect(() => {
    if (!hydratedStorage) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ deckTitle, themeId, slides }));
    } catch {
      // ignore
    }
  }, [deckTitle, themeId, slides, hydratedStorage]);

  useEffect(() => {
    if (!presenterOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPresenterOpen(false);
      if (e.key === 'ArrowRight' || e.key === ' ') setActiveSlideIdx((i) => Math.min(slides.length - 1, i + 1));
      if (e.key === 'ArrowLeft') setActiveSlideIdx((i) => Math.max(0, i - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [presenterOpen, slides.length]);

  const notify = (type: 'ok' | 'err', msg: string) => {
    setStatus({ type, msg });
    setTimeout(() => setStatus((prev) => (prev?.msg === msg ? null : prev)), 3500);
  };

  const updateSlide = (patch: Partial<SlideData>) => {
    setSlides((prev) => prev.map((s, i) => (i === activeSlideIdx ? { ...s, ...patch } : s)));
  };

  const addSlide = () => {
    const newSlide: SlideData = {
      id: `s-${Date.now()}`,
      title: `Slide ${slides.length + 1}`,
      bullets: 'Click to edit key bullet point\nAdd supporting metric or takeaway',
      notes: '',
    };
    setSlides((prev) => [...prev, newSlide]);
    setActiveSlideIdx(slides.length);
  };

  const deleteSlide = (idx: number) => {
    if (slides.length <= 1) return;
    setSlides((prev) => prev.filter((_, i) => i !== idx));
    setActiveSlideIdx((prev) => Math.max(0, Math.min(prev, slides.length - 2)));
  };

  const exportSlidesToPptx = async () => {
    setBusy(true);
    try {
      const PptxGenJS = (await import('pptxgenjs')).default;
      const pptx = new PptxGenJS();
      pptx.layout = 'LAYOUT_WIDE';
      pptx.title = deckTitle;

      for (const s of slides) {
        const slide = pptx.addSlide();
        slide.background = { color: theme.pptBg };
        slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.18, fill: { color: theme.pptAccent } });
        slide.addText(s.title || 'Untitled Slide', {
          x: 0.7,
          y: 0.6,
          w: 11.8,
          h: 0.9,
          fontSize: 30,
          bold: true,
          color: theme.pptText,
        });

        if (s.chart && s.chart.length > 0) {
          slide.addChart(
            pptx.ChartType.bar,
            [{ name: s.title, labels: s.chart.map((c) => c.label), values: s.chart.map((c) => c.value) }],
            { x: 0.8, y: 1.7, w: 11.4, h: 4.8, barDir: 'col', chartColors: [theme.pptAccent] }
          );
        } else {
          const bulletItems = s.bullets
            .split('\n')
            .map((l) => l.trim())
            .filter(Boolean)
            .map((line) => ({
              text: line,
              options: { bullet: true, breakLine: true, fontSize: 18, color: theme.pptText },
            }));
          if (bulletItems.length > 0) {
            slide.addText(bulletItems, { x: 0.8, y: 1.8, w: 11.5, h: 4.5, valign: 'top', paraSpaceAfter: 12 });
          }
        }
        if (s.notes.trim()) slide.addNotes(s.notes.trim());
      }

      await pptx.writeFile({ fileName: `${deckTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'presentation'}.pptx` });
      notify('ok', `Downloaded "${deckTitle}.pptx" (${slides.length} slides) with your latest edits!`);
    } catch {
      notify('err', 'Could not generate .pptx file.');
    } finally {
      setBusy(false);
    }
  };

  const exportSlidesToPdf = async () => {
    setBusy(true);
    try {
      const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
      const doc = await PDFDocument.create();
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const bold = await doc.embedFont(StandardFonts.HelveticaBold);

      const pageW = 960;
      const pageH = 540;

      const [bgR, bgG, bgB] = hexToRgbTuple(theme.bg, [1, 0.98, 0.96]);
      const [acR, acG, acB] = hexToRgbTuple(theme.accent, [0.85, 0.31, 0.11]);
      const [txR, txG, txB] = hexToRgbTuple(theme.text, [0.1, 0.06, 0.04]);

      for (let i = 0; i < slides.length; i++) {
        const s = slides[i];
        const page = doc.addPage([pageW, pageH]);
        page.drawRectangle({ x: 0, y: 0, width: pageW, height: pageH, color: rgb(bgR, bgG, bgB) });
        page.drawRectangle({ x: 0, y: pageH - 12, width: pageW, height: 12, color: rgb(acR, acG, acB) });

        page.drawText(toWinAnsiSafe(s.title || `Slide ${i + 1}`), {
          x: 56,
          y: pageH - 78,
          size: 28,
          font: bold,
          color: rgb(txR, txG, txB),
        });
        page.drawLine({
          start: { x: 56, y: pageH - 96 },
          end: { x: pageW - 56, y: pageH - 96 },
          thickness: 1.5,
          color: rgb(acR, acG, acB),
          opacity: 0.35,
        });

        if (s.chart && s.chart.length > 0) {
          const maxVal = Math.max(1, ...s.chart.map((c) => c.value));
          const barW = Math.min(110, (pageW - 180) / s.chart.length - 24);
          s.chart.forEach((item, bi) => {
            const bx = 80 + bi * (barW + 30);
            const bh = (item.value / maxVal) * 240;
            page.drawRectangle({ x: bx, y: 120, width: barW, height: bh, color: rgb(acR, acG, acB) });
            page.drawText(String(item.value), { x: bx + 6, y: 128 + bh, size: 12, font: bold, color: rgb(txR, txG, txB) });
            page.drawText(toWinAnsiSafe(item.label.slice(0, 14)), { x: bx, y: 98, size: 11, font, color: rgb(txR, txG, txB) });
          });
        } else {
          let y = pageH - 140;
          const lines = s.bullets.split('\n').map((l) => l.trim()).filter(Boolean);
          for (const line of lines) {
            const words = toWinAnsiSafe(`*  ${line}`).split(/\s+/);
            let cur = '';
            for (const w of words) {
              const test = cur ? `${cur} ${w}` : w;
              if (font.widthOfTextAtSize(test, 16) < pageW - 120) {
                cur = test;
              } else {
                if (y > 60) page.drawText(cur, { x: 64, y, size: 16, font, color: rgb(txR, txG, txB) });
                y -= 26;
                cur = `   ${w}`;
              }
            }
            if (cur && y > 60) {
              page.drawText(cur, { x: 64, y, size: 16, font, color: rgb(txR, txG, txB) });
              y -= 34;
            }
          }
        }

        page.drawText(toWinAnsiSafe(`Slide ${i + 1} / ${slides.length} - ${deckTitle}`), {
          x: 56,
          y: 24,
          size: 10,
          font,
          color: rgb(txR, txG, txB),
          opacity: 0.65,
        });
      }

      const out = await doc.save();
      downloadBytes(out, `${deckTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'presentation'}.pdf`, 'application/pdf');
      notify('ok', `Exported "${deckTitle}.pdf" (${slides.length} slides) with your latest edits!`);
    } catch {
      notify('err', 'PDF export encountered unsupported characters.');
    } finally {
      setBusy(false);
    }
  };

  const handleOpenPptx = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      const JSZip = (await import('jszip')).default;
      const zip = await JSZip.loadAsync(await file.arrayBuffer());
      const slideKeys = Object.keys(zip.files)
        .filter((k) => /^ppt\/slides\/slide\d+\.xml$/i.test(k))
        .sort((a, b) => {
          const na = parseInt(a.match(/slide(\d+)\.xml/i)?.[1] || '0', 10);
          const nb = parseInt(b.match(/slide(\d+)\.xml/i)?.[1] || '0', 10);
          return na - nb;
        });

      if (slideKeys.length === 0) {
        notify('err', 'No slides found. Upload a valid .pptx presentation file.');
        setBusy(false);
        return;
      }

      const parser = new DOMParser();
      const parsedSlides: SlideData[] = [];
      for (let i = 0; i < slideKeys.length; i++) {
        const xmlStr = await zip.files[slideKeys[i]].async('string');
        const doc = parser.parseFromString(xmlStr, 'application/xml');
        const textNodes = Array.from(doc.getElementsByTagName('a:p'))
          .map((p) => Array.from(p.getElementsByTagName('a:t')).map((t) => t.textContent || '').join('').trim())
          .filter(Boolean);

        let notesText = '';
        const slideNum = slideKeys[i].match(/slide(\d+)\.xml/i)?.[1];
        const noteKey = `ppt/notesSlides/notesSlide${slideNum}.xml`;
        if (zip.files[noteKey]) {
          const noteXml = await zip.files[noteKey].async('string');
          const noteDoc = parser.parseFromString(noteXml, 'application/xml');
          notesText = Array.from(noteDoc.getElementsByTagName('a:t')).map((t) => t.textContent || '').join(' ').trim();
        }

        parsedSlides.push({
          id: `loaded-${Date.now()}-${i}`,
          title: textNodes[0] || `Slide ${i + 1}`,
          bullets: textNodes.slice(1).join('\n'),
          notes: notesText,
        });
      }

      setSlides(parsedSlides);
      setActiveSlideIdx(0);
      setDeckTitle(file.name.replace(/\.pptx$/i, ''));
      notify('ok', `Opened "${file.name}" (${parsedSlides.length} editable slides)!`);
    } catch {
      notify('err', 'Could not read file. Use modern .pptx presentations.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className={`flex flex-col bg-[#F8FAFD] text-[#1F1F1F] border border-[#DADCE0] overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'rounded-2xl shadow-lg'
      }`}
      onClick={() => openMenu && setOpenMenu(null)}
    >
      <input ref={fileInputRef} type="file" accept=".pptx" className="hidden" onChange={(e) => handleOpenPptx(e.target.files?.[0])} />

      {/* 1. GOOGLE SLIDES TOP HEADER */}
      <div className="bg-white border-b border-[#E0E3E7] px-3 sm:px-4 pt-2.5 pb-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-[#F4B400] text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Presentation className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={deckTitle}
                onChange={(e) => setDeckTitle(e.target.value)}
                className="font-semibold text-base sm:text-[17px] text-[#1F1F1F] bg-transparent border border-transparent hover:border-[#DADCE0] focus:border-[#F4B400] focus:bg-white rounded px-1.5 py-0.5 focus:outline-none max-w-[220px] sm:max-w-[320px]"
              />
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[11px] font-semibold border border-amber-200">
                Saved Locally • No Account Needed
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-0.5 text-[13px] text-[#3C4043] relative mt-0.5">
              {['File', 'Insert', 'Slide', 'Theme'].map((label) => (
                <div key={label} className="relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => setOpenMenu((m) => (m === label ? null : label))}
                    className={`px-2 py-0.5 rounded hover:bg-[#E8EAED] transition ${openMenu === label ? 'bg-[#E8EAED] font-semibold' : ''}`}
                  >
                    {label}
                  </button>
                  {openMenu === label && (
                    <div className="absolute left-0 top-full mt-1 w-52 bg-white rounded-xl shadow-xl border border-[#DADCE0] py-1.5 z-50 text-xs">
                      {label === 'File' && (
                        <>
                          <button type="button" onClick={() => { fileInputRef.current?.click(); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">Open .PPTX Presentation...</button>
                          <button type="button" onClick={() => { setModalMode('templates'); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">Pro Deck Templates...</button>
                          <div className="border-t my-1" />
                          <button type="button" onClick={() => { exportSlidesToPptx(); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4] font-bold text-amber-700">Download PowerPoint (.pptx)</button>
                          <button type="button" onClick={() => { exportSlidesToPdf(); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4] font-bold text-[#D94F1D]">Download Slideshow PDF (.pdf)</button>
                        </>
                      )}
                      {label === 'Insert' && (
                        <>
                          <button type="button" onClick={() => { addSlide(); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">New Slide</button>
                          <button type="button" onClick={() => { setModalMode('chart'); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">Insert Bar Chart Slide...</button>
                          <button type="button" onClick={() => { setModalMode('outline'); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">Generate from Outline...</button>
                        </>
                      )}
                      {label === 'Slide' && (
                        <>
                          <button type="button" onClick={() => { addSlide(); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">New Slide</button>
                          <button type="button" onClick={() => { deleteSlide(activeSlideIdx); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4] text-rose-600">Delete Current Slide</button>
                          <button type="button" onClick={() => { setPresenterOpen(true); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4] font-semibold">Start Slideshow (Fullscreen)</button>
                        </>
                      )}
                      {label === 'Theme' &&
                        THEMES.map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => {
                              setThemeId(t.id);
                              setOpenMenu(null);
                            }}
                            className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4] flex items-center gap-2"
                          >
                            <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: t.accent }} />
                            <span>{t.label}</span>
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F1F3F4] hover:bg-[#E8EAED] text-xs font-semibold text-[#1F1F1F]">
            <FileUp className="w-3.5 h-3.5" />
            <span>Open .PPTX</span>
          </button>
          <button type="button" onClick={() => setPresenterOpen(true)} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#DADCE0] hover:border-[#F4B400] text-xs font-bold text-[#1F1F1F]">
            <Play className="w-3.5 h-3.5 text-[#F4B400]" />
            <span>Slideshow</span>
          </button>
          <button type="button" disabled={busy} onClick={exportSlidesToPptx} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F4B400] hover:bg-[#E0A300] text-[#1F1F1F] text-xs font-bold shadow-2xs">
            <FileDown className="w-3.5 h-3.5" />
            <span>.PPTX</span>
          </button>
          <button type="button" disabled={busy} onClick={exportSlidesToPdf} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#D94F1D] hover:bg-[#C4461A] text-white text-xs font-bold shadow-2xs">
            <FileText className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>

          {!fullViewport && (
            <Link href="/slides" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#FEF7E0] hover:bg-[#FDEFC7] text-[#B06000] text-xs font-bold border border-amber-200">
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Full App</span>
            </Link>
          )}

          <button type="button" onClick={() => setIsFullscreen((f) => !f)} className="p-2 rounded-full hover:bg-[#E8EAED] text-[#3C4043]" title="Fullscreen">
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. PILL TOOLBAR */}
      <div className="bg-[#EDF2FA] mx-2 sm:mx-3 my-1.5 px-3 py-1 rounded-full flex flex-wrap items-center gap-2 text-xs border border-[#DCE3EE]">
        <button type="button" onClick={addSlide} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#DADCE0] hover:border-[#F4B400] font-bold">
          <Plus className="w-3.5 h-3.5 text-[#F4B400]" />
          <span>New Slide</span>
        </button>
        <button type="button" onClick={() => setModalMode('chart')} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full hover:bg-black/5 font-semibold">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Chart Slide</span>
        </button>
        <button type="button" onClick={() => setModalMode('outline')} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full hover:bg-black/5 font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Outline to Slides</span>
        </button>
        <button type="button" onClick={() => setModalMode('templates')} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full hover:bg-black/5 font-semibold">
          <LayoutTemplate className="w-3.5 h-3.5" />
          <span>Templates</span>
        </button>

        <div className="h-4 w-px bg-[#C7CDD6]" />

        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-600">Theme:</span>
          <select value={themeId} onChange={(e) => setThemeId(e.target.value)} className="bg-white border border-[#C7CDD6] rounded-full px-2.5 py-0.5 font-bold text-xs">
            {THEMES.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      {status && (
        <div
          className={`mx-3 mb-2 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border ${
            status.type === 'ok' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          {status.type === 'ok' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{status.msg}</span>
        </div>
      )}

      {/* 3. SLIDES FILMSTRIP + MAIN 16:9 STAGE + SPEAKER NOTES */}
      {currentSlide && (
        <div className={`flex flex-1 overflow-hidden ${isFullscreen ? 'min-h-0' : 'h-[560px]'}`}>
          {/* Left Filmstrip Thumbnails */}
          <aside className="w-40 sm:w-52 bg-[#F8FAFD] border-r border-[#E0E3E7] p-3 space-y-2.5 overflow-y-auto shrink-0">
            {slides.map((s, idx) => (
              <div key={s.id} onClick={() => setActiveSlideIdx(idx)} className="flex items-start gap-2 cursor-pointer group">
                <span className="text-[11px] font-bold text-slate-500 w-4 pt-1">{idx + 1}</span>
                <div
                  className={`flex-1 aspect-[16/9] rounded-lg border-2 p-2 flex flex-col justify-between overflow-hidden relative transition ${
                    idx === activeSlideIdx ? 'border-[#F4B400] shadow-md ring-2 ring-[#F4B400]/30' : 'border-[#DADCE0] hover:border-slate-400'
                  }`}
                  style={{ backgroundColor: theme.bg, color: theme.text }}
                >
                  <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: theme.accent }} />
                  <p className="text-[9px] font-bold truncate pt-0.5">{s.title}</p>
                  <p className="text-[7px] opacity-70 line-clamp-2">{s.bullets}</p>
                  {slides.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSlide(idx);
                      }}
                      className="opacity-0 group-hover:opacity-100 absolute bottom-1 right-1 p-0.5 rounded bg-black/50 text-white"
                      title="Delete Slide"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </aside>

          {/* Center 16:9 Editable Stage + Speaker Notes */}
          <div className="flex-1 flex flex-col bg-[#F0F4F9] overflow-y-auto">
            <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
              <div
                className="w-full max-w-4xl aspect-[16/9] rounded-xl border border-[#DADCE0] shadow-lg p-6 sm:p-10 flex flex-col justify-between relative"
                style={{ backgroundColor: theme.bg, color: theme.text }}
              >
                <div className="absolute top-0 left-0 right-0 h-2.5 rounded-t-xl" style={{ backgroundColor: theme.accent }} />
                <div className="flex-1 flex flex-col">
                  <input
                    type="text"
                    value={currentSlide.title}
                    onChange={(e) => updateSlide({ title: e.target.value })}
                    placeholder="Click to add slide title"
                    className="w-full bg-transparent font-heading font-extrabold text-xl sm:text-3xl border-b pb-2.5 focus:outline-none"
                    style={{ borderColor: `${theme.accent}44`, color: theme.text }}
                  />

                  {currentSlide.chart && currentSlide.chart.length > 0 ? (
                    <div className="mt-6 flex items-end justify-around flex-1 gap-3 px-4 pb-2">
                      {(() => {
                        const max = Math.max(1, ...currentSlide.chart.map((c) => c.value));
                        return currentSlide.chart.map((bar, bi) => (
                          <div key={bi} className="flex flex-col items-center flex-1 h-full justify-end">
                            <span className="text-xs font-bold mb-1">{bar.value}</span>
                            <div
                              className="w-full max-w-[60px] rounded-t-lg"
                              style={{ height: `${Math.max(12, (bar.value / max) * 100)}%`, backgroundColor: theme.accent }}
                            />
                            <span className="text-[11px] font-semibold mt-1.5 truncate w-full text-center">{bar.label}</span>
                          </div>
                        ));
                      })()}
                    </div>
                  ) : (
                    <textarea
                      value={currentSlide.bullets}
                      onChange={(e) => updateSlide({ bullets: e.target.value })}
                      placeholder="Click to add bullet points (one point per line)..."
                      className="mt-4 flex-1 w-full bg-transparent resize-none text-sm sm:text-lg leading-relaxed focus:outline-none"
                      style={{ color: theme.text }}
                    />
                  )}
                </div>

                <div className="text-[11px] opacity-60 flex justify-between pt-2">
                  <span>{deckTitle}</span>
                  <span>Slide {activeSlideIdx + 1} of {slides.length}</span>
                </div>
              </div>
            </div>

            {/* Speaker Notes Drawer */}
            <div className="bg-white border-t border-[#DADCE0] px-4 py-2.5">
              <input
                type="text"
                value={currentSlide.notes}
                onChange={(e) => updateSlide({ notes: e.target.value })}
                placeholder="Click to add speaker notes..."
                className="w-full text-xs sm:text-sm text-[#3C4043] bg-transparent focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* MODALS: CHART / OUTLINE / TEMPLATES */}
      {modalMode !== 'none' && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#DADCE0] shadow-2xl p-6 w-full max-w-lg space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-base text-[#1F1F1F]">
                {modalMode === 'chart' ? 'Insert Bar Chart Slide' : modalMode === 'outline' ? 'Generate Slides from Outline' : 'Choose Presentation Template'}
              </h4>
              <button type="button" onClick={() => setModalMode('none')}><X className="w-4 h-4" /></button>
            </div>

            {modalMode === 'chart' && (
              <>
                <input type="text" value={chartTitle} onChange={(e) => setChartTitle(e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-[#DADCE0] text-sm font-bold" />
                <textarea rows={5} value={chartRowsText} onChange={(e) => setChartRowsText(e.target.value)} className="w-full p-3 rounded-xl border border-[#DADCE0] font-mono text-xs" />
                <button
                  type="button"
                  onClick={() => {
                    const parsed = chartRowsText.split('\n').map((l) => { const [lb, v] = l.split(','); return { label: (lb || 'Item').trim(), value: Math.max(0, Number(v) || 0) }; }).filter((c) => c.label);
                    if (parsed.length) {
                      setSlides((prev) => [...prev, { id: `ch-${Date.now()}`, title: chartTitle, bullets: '', notes: '', chart: parsed }]);
                      setActiveSlideIdx(slides.length);
                      setModalMode('none');
                    }
                  }}
                  className="w-full py-2.5 rounded-full bg-[#F4B400] text-[#1F1F1F] font-bold text-xs"
                >
                  Insert Chart Slide
                </button>
              </>
            )}

            {modalMode === 'outline' && (
              <>
                <textarea rows={7} value={outlineText} onChange={(e) => setOutlineText(e.target.value)} className="w-full p-3 rounded-xl border border-[#DADCE0] font-mono text-xs" />
                <button
                  type="button"
                  onClick={() => {
                    const blocks = outlineText.split(/\n(?=#\s)/g).filter((b) => b.trim());
                    const gen: SlideData[] = blocks.map((blk, i) => {
                      const ls = blk.split('\n').map((l) => l.trim()).filter(Boolean);
                      const tl = ls[0].startsWith('#') ? ls[0].replace(/^#+\s*/, '') : `Slide ${i + 1}`;
                      const bd = ls.slice(ls[0].startsWith('#') ? 1 : 0).map((l) => l.replace(/^[-*•]\s*/, ''));
                      return { id: `ol-${Date.now()}-${i}`, title: tl, bullets: bd.join('\n'), notes: '' };
                    });
                    if (gen.length) { setSlides(gen); setActiveSlideIdx(0); setModalMode('none'); }
                  }}
                  className="w-full py-2.5 rounded-full bg-[#F4B400] text-[#1F1F1F] font-bold text-xs"
                >
                  Build {outlineText.split(/\n(?=#\s)/g).filter((b) => b.trim()).length} Slides Now
                </button>
              </>
            )}

            {modalMode === 'templates' && (
              <div className="space-y-3">
                {DECK_TEMPLATES.map((tpl) => (
                  <div key={tpl.name} className="p-4 rounded-xl bg-[#F8FAFD] border border-[#DADCE0] flex items-center justify-between gap-3">
                    <div>
                      <h5 className="font-bold text-sm">{tpl.name}</h5>
                      <p className="text-xs text-slate-500">{tpl.desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setDeckTitle(tpl.name);
                        setSlides(tpl.slides.map((s, i) => ({ ...s, id: `tpl-${Date.now()}-${i}` })));
                        setActiveSlideIdx(0);
                        setModalMode('none');
                      }}
                      className="px-4 py-2 rounded-full bg-[#F4B400] text-[#1F1F1F] text-xs font-bold shrink-0"
                    >
                      Use
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* FULLSCREEN PRESENTER OVERLAY */}
      {presenterOpen && currentSlide && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 sm:p-10">
          <div className="w-full max-w-5xl flex items-center justify-between text-white/80 text-xs mb-4">
            <span className="font-bold">{deckTitle} — Slide {activeSlideIdx + 1} of {slides.length}</span>
            <button type="button" onClick={() => setPresenterOpen(false)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold">
              <X className="w-4 h-4" />
              <span>Exit (Esc)</span>
            </button>
          </div>
          <div
            className="w-full max-w-5xl aspect-[16/9] rounded-2xl p-8 sm:p-14 flex flex-col justify-between relative shadow-2xl"
            style={{ backgroundColor: theme.bg, color: theme.text }}
          >
            <div className="absolute top-0 left-0 right-0 h-3 rounded-t-2xl" style={{ backgroundColor: theme.accent }} />
            <div>
              <h2 className="font-heading font-black text-2xl sm:text-5xl border-b pb-4" style={{ borderColor: `${theme.accent}33` }}>
                {currentSlide.title}
              </h2>
              <ul className="mt-8 space-y-4 text-base sm:text-2xl">
                {currentSlide.bullets.split('\n').filter((l) => l.trim()).map((line, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-2.5 w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: theme.accent }} />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
            {currentSlide.notes && <div className="text-xs opacity-60 border-t pt-3">Speaker Note: {currentSlide.notes}</div>}
          </div>
          <div className="flex items-center gap-4 mt-5">
            <button type="button" disabled={activeSlideIdx === 0} onClick={() => setActiveSlideIdx((i) => Math.max(0, i - 1))} className="px-5 py-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold disabled:opacity-30">← Prev Slide</button>
            <button type="button" disabled={activeSlideIdx === slides.length - 1} onClick={() => setActiveSlideIdx((i) => Math.min(slides.length - 1, i + 1))} className="px-5 py-2.5 rounded-full bg-[#F4B400] text-[#1F1F1F] text-xs font-bold disabled:opacity-30">Next Slide →</button>
          </div>
        </div>
      )}
    </div>
  );
}
