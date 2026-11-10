'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  FileText,
  Undo2,
  Redo2,
  Printer,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link2,
  ImagePlus,
  Table,
  Download,
  Upload,
  Plus,
  Search,
  Maximize2,
  Minimize2,
  ExternalLink,
  X,
  LayoutTemplate,
  GitCompare,
  RemoveFormatting,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { downloadBytes, downloadText, toWinAnsiSafe, hexToRgbTuple } from './downloadBlob';

export type DocToolMode = 'docx' | 'doc2pdf' | 'all' | 'txt';

interface DocTab {
  id: string;
  name: string;
  html: string;
}

interface DocToolsSuiteProps {
  mode?: DocToolMode;
  appName?: string;
  fullViewport?: boolean;
}

const STORAGE_KEY = 'publixa_docs_workspace_v2';

const DEFAULT_DOC_HTML = `<h1>Welcome to Publixa Docs</h1><p>Start typing right on the page — no account or sign-in required. Everything is automatically saved locally inside your browser.</p><h2>Key Features You Can Use Right Now</h2><ul><li><strong>Format text live</strong> using the toolbar above: Headings, Fonts, Colors, Highlights, Lists, Tables, and Alignment.</li><li><strong>Open real Word &amp; text files</strong> (.DOCX, .TXT, .MD, .HTML) and edit every paragraph freely.</li><li><strong>Export with formatting</strong> directly to clean <strong>PDF</strong>, Microsoft Word (<strong>.DOCX</strong>), <strong>.HTML</strong>, or <strong>.TXT</strong>.</li></ul><h3>Privacy Promise</h3><p>Zero files are ever sent to any cloud server. Your documents remain 100% private on your device.</p>`;

const DOC_TEMPLATES: { name: string; title: string; html: string }[] = [
  {
    name: 'Resume / CV',
    title: 'Prince Kumar Singh — Software Developer Resume',
    html: `<h1>Prince Kumar Singh</h1><p><em>Android &amp; Full-Stack Web Developer • publixaorignal@gmail.com</em></p><h2>Professional Summary</h2><p>Passionate mobile and web engineer building fast, offline-first utility, document, and security apps trusted on Google Play.</p><h2>Core Technical Skills</h2><ul><li><strong>Mobile:</strong> Kotlin, Jetpack Compose, Material Design 3</li><li><strong>Web:</strong> Next.js, TypeScript, Tailwind CSS, Client-Side PDF/Office</li></ul><h2>Featured Portfolio</h2><p><strong>Publixa Application Suite</strong> — 35+ Android utilities including PaperFlow PDF Tools, Excel Reader, DOC Editor, and Net Go VPN.</p>`,
  },
  {
    name: 'Formal Business Letter',
    title: 'Formal Application Letter',
    html: `<p>November 10, 2026</p><p><strong>To:</strong> The Hiring Manager<br/>Example Technologies Pvt. Ltd.</p><p><strong>Subject:</strong> Formal Project Proposal &amp; Partnership</p><p>Dear Team,</p><p>I am writing to share our updated roadmap for the browser-native document editing suite. Every feature runs offline in the browser with full formatting export to PDF and DOCX.</p><p>Sincerely,<br/><strong>Publixa Team</strong></p>`,
  },
  {
    name: 'Meeting Notes',
    title: 'Weekly Product Sync — Notes',
    html: `<h1>Weekly Product Sync</h1><p><strong>Date:</strong> November 10, 2026 &nbsp;|&nbsp; <strong>Status:</strong> On Track</p><h2>Agenda &amp; Decisions</h2><ul><li>Launched Google Docs &amp; Sheets full-featured web editions with zero login.</li><li>Verified PDF, DOCX, PPTX, and XLSX exports preserve every user edit.</li></ul><h2>Action Items</h2><ol><li>Complete responsive testing on tablet and desktop screens.</li><li>Publish updated help guide for offline export workflows.</li></ol>`,
  },
];

function stripHtmlToPlain(html: string): string {
  if (typeof document === 'undefined') return html.replace(/<[^>]+>/g, ' ');
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.innerText || div.textContent || '';
}

export default function DocToolsSuite({
  mode = 'docx',
  appName = 'Publixa Docs',
  fullViewport = false,
}: DocToolsSuiteProps) {
  const [title, setTitle] = useState('Untitled document');
  const [tabs, setTabs] = useState<DocTab[]>([
    { id: 'tab-1', name: 'Tab 1', html: DEFAULT_DOC_HTML },
  ]);
  const [activeTabId, setActiveTabId] = useState('tab-1');
  const [hydratedStorage, setHydratedStorage] = useState(false);

  // Toolbar / View states
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [zoomPct, setZoomPct] = useState(100);
  const [fontSize, setFontSize] = useState(14);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [textColor, setTextColor] = useState('#1F1F1F');
  const [highlightColor, setHighlightColor] = useState('#FEF08A');
  const [showRuler, setShowRuler] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(fullViewport);
  const [pageTheme, setPageTheme] = useState<'white' | 'sepia' | 'dark'>('white');

  // Modals / Status
  const [showFindModal, setShowFindModal] = useState(false);
  const [findVal, setFindVal] = useState('');
  const [replaceVal, setReplaceVal] = useState('');
  const [showDiffModal, setShowDiffModal] = useState(false);
  const [diffOtherText, setDiffOtherText] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);

  const editorRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imgInputRef = useRef<HTMLInputElement | null>(null);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  // Load saved local workspace once
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.tabs) && parsed.tabs.length > 0) {
          setTitle(parsed.title || 'Untitled document');
          setTabs(parsed.tabs);
          setActiveTabId(parsed.tabs[0].id);
        }
      }
    } catch {
      // ignore
    } finally {
      setHydratedStorage(true);
    }
  }, []);

  // Auto-save locally
  useEffect(() => {
    if (!hydratedStorage) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ title, tabs }));
    } catch {
      // ignore
    }
  }, [title, tabs, hydratedStorage]);

  // Sync contentEditable innerHTML when switching tabs or loading templates
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== activeTab.html) {
      editorRef.current.innerHTML = activeTab.html;
    }
  }, [activeTabId, hydratedStorage, activeTab.html]);

  const notify = (type: 'ok' | 'err', msg: string) => {
    setStatus({ type, msg });
    setTimeout(() => setStatus((prev) => (prev?.msg === msg ? null : prev)), 3500);
  };

  const syncFromDom = useCallback(() => {
    if (!editorRef.current) return activeTab.html;
    const html = editorRef.current.innerHTML;
    setTabs((prev) => prev.map((t) => (t.id === activeTabId ? { ...t, html } : t)));
    return html;
  }, [activeTab.html, activeTabId]);

  const execCmd = (cmd: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, value);
    syncFromDom();
  };

  // Extract Headings for live Document Outline sidebar
  const headings = useMemo(() => {
    const matches: { tag: string; text: string; idx: number }[] = [];
    const regex = /<(h[1-3])[^>]*>([\s\S]*?)<\/\1>/gi;
    let m: RegExpExecArray | null;
    let i = 0;
    while ((m = regex.exec(activeTab.html)) !== null) {
      const txt = m[2].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').trim();
      if (txt) matches.push({ tag: m[1].toUpperCase(), text: txt, idx: i++ });
    }
    return matches;
  }, [activeTab.html]);

  const stats = useMemo(() => {
    const plain = stripHtmlToPlain(activeTab.html).trim();
    const words = plain ? plain.split(/\s+/).length : 0;
    const chars = plain.length;
    const readMin = Math.max(1, Math.ceil(words / 200));
    return { words, chars, readMin, plain };
  }, [activeTab.html]);

  const handleOpenFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      const lower = file.name.toLowerCase();
      setTitle(file.name.replace(/\.[^.]+$/, ''));
      let html = '';

      if (lower.endsWith('.docx')) {
        const mammoth = await import('mammoth');
        const result = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() });
        html = result.value || '<p></p>';
      } else if (lower.endsWith('.html') || lower.endsWith('.htm')) {
        html = await file.text();
      } else {
        const raw = await file.text();
        html = raw
          .split('\n')
          .map((line) => `<p>${line.replace(/</g, '&lt;').replace(/>/g, '&gt;') || '<br/>'}</p>`)
          .join('');
      }

      setTabs((prev) => prev.map((t) => (t.id === activeTabId ? { ...t, html } : t)));
      if (editorRef.current) editorRef.current.innerHTML = html;
      notify('ok', `Opened "${file.name}" — edit directly on the page!`);
    } catch {
      notify('err', 'Could not open file. Use .docx, .txt, .md, or .html.');
    } finally {
      setBusy(false);
    }
  };

  // Parse DOM nodes cleanly so PDF & DOCX preserve user's Headings, Bold, Italic, Lists, Alignment & Colors!
  const extractBlocks = (html: string) => {
    if (typeof document === 'undefined') return [];
    const root = document.createElement('div');
    root.innerHTML = html;
    const blocks: {
      tag: string;
      text: string;
      bold: boolean;
      italic: boolean;
      underline: boolean;
      align: 'left' | 'center' | 'right' | 'justify';
      color?: string;
    }[] = [];

    const walk = (el: Element) => {
      const tag = el.tagName.toLowerCase();
      if (tag === 'ul' || tag === 'ol') {
        Array.from(el.children).forEach((li, liIdx) => {
          const txt = (li.textContent || '').trim();
          if (txt) {
            blocks.push({
              tag: 'li',
              text: `${tag === 'ol' ? `${liIdx + 1}.` : '*'} ${txt}`,
              bold: Boolean(li.querySelector('strong, b')),
              italic: Boolean(li.querySelector('em, i')),
              underline: Boolean(li.querySelector('u')),
              align: 'left',
            });
          }
        });
        return;
      }
      if (tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'p' || tag === 'div' || tag === 'blockquote') {
        // If container wraps block children, recurse instead
        const hasBlockChild = Array.from(el.children).some((c) =>
          ['h1', 'h2', 'h3', 'p', 'div', 'ul', 'ol', 'table'].includes(c.tagName.toLowerCase())
        );
        if (hasBlockChild) {
          Array.from(el.children).forEach(walk);
          return;
        }
        const txt = (el.textContent || '').trim();
        const styleAttr = (el as HTMLElement).style;
        const alignVal = (styleAttr?.textAlign || 'left') as 'left' | 'center' | 'right' | 'justify';
        const colorEl = el.querySelector('[color], [style*="color"]') as HTMLElement | null;
        blocks.push({
          tag,
          text: txt,
          bold: tag.startsWith('h') || Boolean(el.querySelector('strong, b')),
          italic: Boolean(el.querySelector('em, i')),
          underline: Boolean(el.querySelector('u')),
          align: alignVal,
          color: colorEl?.getAttribute('color') || colorEl?.style?.color || undefined,
        });
        return;
      }
      if (tag === 'table') {
        Array.from(el.querySelectorAll('tr')).forEach((tr) => {
          const cells = Array.from(tr.children).map((td) => (td.textContent || '').trim());
          blocks.push({
            tag: 'p',
            text: cells.join('   |   '),
            bold: false,
            italic: false,
            underline: false,
            align: 'left',
          });
        });
        return;
      }
      if (el.children.length > 0) {
        Array.from(el.children).forEach(walk);
      } else if ((el.textContent || '').trim()) {
        blocks.push({
          tag: 'p',
          text: (el.textContent || '').trim(),
          bold: false,
          italic: false,
          underline: false,
          align: 'left',
        });
      }
    };

    Array.from(root.children).forEach(walk);
    if (blocks.length === 0 && (root.textContent || '').trim()) {
      blocks.push({ tag: 'p', text: (root.textContent || '').trim(), bold: false, italic: false, underline: false, align: 'left' });
    }
    return blocks;
  };

  const handleExportPdf = async () => {
    setBusy(true);
    try {
      const latestHtml = syncFromDom();
      const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
      const doc = await PDFDocument.create();
      doc.setTitle(toWinAnsiSafe(title));

      const fReg = await doc.embedFont(StandardFonts.Helvetica);
      const fBold = await doc.embedFont(StandardFonts.HelveticaBold);
      const fItal = await doc.embedFont(StandardFonts.HelveticaOblique);
      const fBoldItal = await doc.embedFont(StandardFonts.HelveticaBoldOblique);

      const pageW = 595;
      const pageH = 842;
      const margin = 52;
      const maxWidth = pageW - margin * 2;

      const bgCol =
        pageTheme === 'dark' ? rgb(0.09, 0.11, 0.15) : pageTheme === 'sepia' ? rgb(0.99, 0.96, 0.89) : rgb(1, 1, 1);
      const defaultFg =
        pageTheme === 'dark' ? rgb(0.95, 0.96, 0.98) : pageTheme === 'sepia' ? rgb(0.23, 0.18, 0.12) : rgb(0.12, 0.13, 0.15);

      const newPage = () => {
        const p = doc.addPage([pageW, pageH]);
        if (pageTheme !== 'white') p.drawRectangle({ x: 0, y: 0, width: pageW, height: pageH, color: bgCol });
        return p;
      };

      let page = newPage();
      let y = pageH - margin;
      const basePt = Math.max(9, Math.min(22, fontSize * 0.82));

      const blocks = extractBlocks(latestHtml);
      for (const blk of blocks) {
        const safeText = toWinAnsiSafe(blk.text);
        if (!safeText) {
          y -= basePt * 0.8;
          if (y < margin + 20) {
            page = newPage();
            y = pageH - margin;
          }
          continue;
        }

        const sz =
          blk.tag === 'h1'
            ? basePt + 8
            : blk.tag === 'h2'
            ? basePt + 4
            : blk.tag === 'h3'
            ? basePt + 2
            : basePt;
        const lineH = sz * 1.42;
        const usedFont =
          blk.bold && blk.italic ? fBoldItal : blk.bold ? fBold : blk.italic ? fItal : fReg;

        const [cr, cg, cb] = blk.color?.startsWith('#')
          ? hexToRgbTuple(blk.color, [defaultFg.red, defaultFg.green, defaultFg.blue])
          : [defaultFg.red, defaultFg.green, defaultFg.blue];
        const col = rgb(cr, cg, cb);

        const words = safeText.split(/\s+/);
        let cur = '';
        const drawLine = (lineStr: string) => {
          if (y < margin + lineH) {
            page = newPage();
            y = pageH - margin;
          }
          const lw = usedFont.widthOfTextAtSize(lineStr, sz);
          const lx =
            blk.align === 'center'
              ? margin + (maxWidth - lw) / 2
              : blk.align === 'right'
              ? margin + maxWidth - lw
              : margin;
          page.drawText(lineStr, { x: Math.max(margin, lx), y, size: sz, font: usedFont, color: col });
          if (blk.underline) {
            page.drawLine({
              start: { x: Math.max(margin, lx), y: y - 2 },
              end: { x: Math.max(margin, lx) + lw, y: y - 2 },
              thickness: 0.7,
              color: col,
            });
          }
          y -= lineH;
        };

        for (const w of words) {
          const test = cur ? `${cur} ${w}` : w;
          if (usedFont.widthOfTextAtSize(test, sz) <= maxWidth) {
            cur = test;
          } else {
            if (cur) drawLine(cur);
            cur = w;
          }
        }
        if (cur) drawLine(cur);
        y -= blk.tag.startsWith('h') ? 6 : 3;
      }

      const out = await doc.save();
      downloadBytes(out, `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'document'}.pdf`, 'application/pdf');
      notify('ok', `Exported "${title}.pdf" with your latest formatting & edits!`);
    } catch {
      notify('err', 'PDF export failed. Simplify any unusual characters and try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleExportDocx = async () => {
    setBusy(true);
    try {
      const latestHtml = syncFromDom();
      const { Document, Packer, Paragraph, HeadingLevel, TextRun, AlignmentType } = await import('docx');
      const blocks = extractBlocks(latestHtml);
      const halfPt = Math.max(18, Math.min(48, Math.round(fontSize * 1.55)));

      const alignMap = {
        left: AlignmentType.LEFT,
        center: AlignmentType.CENTER,
        right: AlignmentType.RIGHT,
        justify: AlignmentType.JUSTIFIED,
      };

      const children = blocks.map((b) => {
        if (b.tag === 'h1') return new Paragraph({ text: b.text, heading: HeadingLevel.HEADING_1, alignment: alignMap[b.align] });
        if (b.tag === 'h2') return new Paragraph({ text: b.text, heading: HeadingLevel.HEADING_2, alignment: alignMap[b.align] });
        if (b.tag === 'h3') return new Paragraph({ text: b.text, heading: HeadingLevel.HEADING_3, alignment: alignMap[b.align] });
        return new Paragraph({
          alignment: alignMap[b.align],
          children: [
            new TextRun({
              text: b.text,
              bold: b.bold,
              italics: b.italic,
              underline: b.underline ? {} : undefined,
              size: halfPt,
            }),
          ],
        });
      });

      const doc = new Document({ sections: [{ children }] });
      const blob = await Packer.toBlob(doc);
      downloadBytes(await blob.arrayBuffer(), `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'document'}.docx`, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      notify('ok', `Downloaded Word file "${title}.docx" with all your edits!`);
    } catch {
      notify('err', 'Could not create .docx file.');
    } finally {
      setBusy(false);
    }
  };

  const paperClasses =
    pageTheme === 'dark'
      ? 'bg-slate-900 text-slate-100 border-slate-700'
      : pageTheme === 'sepia'
      ? 'bg-[#FDF6E3] text-[#3B2E1E] border-[#E8DBC0]'
      : 'bg-white text-[#1F1F1F] border-[#DADCE0]';

  return (
    <div
      className={`flex flex-col bg-[#F8FAFD] text-[#1F1F1F] border border-[#DADCE0] overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'rounded-2xl shadow-lg'
      }`}
      onClick={() => openMenu && setOpenMenu(null)}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={mode === 'txt' ? '.txt,.md,.log,.json,.csv' : '.docx,.txt,.md,.html,.htm,.csv'}
        className="hidden"
        onChange={(e) => handleOpenFile(e.target.files?.[0])}
      />
      <input
        ref={imgInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          const r = new FileReader();
          r.onload = () => execCmd('insertHTML', `<img src="${r.result}" alt="Inserted image" style="max-width:100%;border-radius:8px;margin:8px 0;" />`);
          r.readAsDataURL(f);
        }}
      />

      {/* 1. GOOGLE DOCS TOP HEADER */}
      <div className="bg-white border-b border-[#E0E3E7] px-3 sm:px-4 pt-2.5 pb-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-[#1A73E8] text-white flex items-center justify-center shrink-0 shadow-2xs">
            <FileText className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="font-semibold text-base sm:text-[17px] text-[#1F1F1F] bg-transparent border border-transparent hover:border-[#DADCE0] focus:border-[#1A73E8] focus:bg-white rounded px-1.5 py-0.5 focus:outline-none max-w-[220px] sm:max-w-[320px]"
              />
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full bg-blue-50 text-[#1A73E8] text-[11px] font-semibold border border-blue-200">
                Saved Locally • No Account Needed
              </span>
            </div>

            {/* Menu Bar */}
            <div className="flex flex-wrap items-center gap-0.5 text-[13px] text-[#3C4043] relative mt-0.5">
              {[
                { id: 'file', label: 'File' },
                { id: 'edit', label: 'Edit' },
                { id: 'view', label: 'View' },
                { id: 'insert', label: 'Insert' },
                { id: 'format', label: 'Format' },
                { id: 'tools', label: 'Tools' },
              ].map((m) => (
                <div key={m.id} className="relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => setOpenMenu((cur) => (cur === m.id ? null : m.id))}
                    className={`px-2 py-0.5 rounded hover:bg-[#E8EAED] transition ${openMenu === m.id ? 'bg-[#E8EAED] font-semibold' : ''}`}
                  >
                    {m.label}
                  </button>

                  {openMenu === m.id && (
                    <div className="absolute left-0 top-full mt-1 w-56 bg-white rounded-xl shadow-xl border border-[#DADCE0] py-1.5 z-50 text-xs text-[#1F1F1F]">
                      {m.id === 'file' && (
                        <>
                          <button type="button" onClick={() => { setTitle('Untitled document'); setTabs([{ id: 'tab-1', name: 'Tab 1', html: '<p><br/></p>' }]); setActiveTabId('tab-1'); if (editorRef.current) editorRef.current.innerHTML = '<p><br/></p>'; setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">New Blank Document</button>
                          <button type="button" onClick={() => { fileInputRef.current?.click(); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">Open .DOCX / .TXT / .HTML...</button>
                          <div className="border-t my-1" />
                          <div className="px-3.5 py-1 text-[10px] font-bold uppercase text-slate-400">Templates</div>
                          {DOC_TEMPLATES.map((tpl) => (
                            <button
                              key={tpl.name}
                              type="button"
                              onClick={() => {
                                setTitle(tpl.title);
                                setTabs((prev) => prev.map((t) => (t.id === activeTabId ? { ...t, html: tpl.html } : t)));
                                if (editorRef.current) editorRef.current.innerHTML = tpl.html;
                                setOpenMenu(null);
                                notify('ok', `Loaded "${tpl.name}" template!`);
                              }}
                              className="w-full text-left px-3.5 py-1.5 hover:bg-[#F1F3F4]"
                            >
                              {tpl.name}
                            </button>
                          ))}
                          <div className="border-t my-1" />
                          <button type="button" onClick={() => { handleExportPdf(); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4] font-semibold text-[#D94F1D]">Download PDF Document (.pdf)</button>
                          <button type="button" onClick={() => { handleExportDocx(); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4] font-semibold text-[#1A73E8]">Download Microsoft Word (.docx)</button>
                          <button type="button" onClick={() => { downloadText(syncFromDom(), `${title}.html`, 'text/html'); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">Download Web Page (.html)</button>
                          <button type="button" onClick={() => { downloadText(stats.plain, `${title}.txt`); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">Download Plain Text (.txt)</button>
                          <button type="button" onClick={() => { window.print(); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">Print Document</button>
                        </>
                      )}
                      {m.id === 'edit' && (
                        <>
                          <button type="button" onClick={() => { execCmd('undo'); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">Undo</button>
                          <button type="button" onClick={() => { execCmd('redo'); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">Redo</button>
                          <div className="border-t my-1" />
                          <button type="button" onClick={() => { execCmd('selectAll'); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">Select All</button>
                          <button type="button" onClick={() => { setShowFindModal(true); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">Find &amp; Replace</button>
                        </>
                      )}
                      {m.id === 'view' && (
                        <>
                          <button type="button" onClick={() => { setShowSidebar((s) => !s); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">{showSidebar ? '✓ ' : ''}Document Outline &amp; Tabs</button>
                          <button type="button" onClick={() => { setShowRuler((r) => !r); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">{showRuler ? '✓ ' : ''}Show Ruler</button>
                          <div className="border-t my-1" />
                          <button type="button" onClick={() => { setPageTheme('white'); setOpenMenu(null); }} className="w-full text-left px-3.5 py-1.5 hover:bg-[#F1F3F4]">{pageTheme === 'white' ? '✓ ' : ''}Paper: White</button>
                          <button type="button" onClick={() => { setPageTheme('sepia'); setOpenMenu(null); }} className="w-full text-left px-3.5 py-1.5 hover:bg-[#F1F3F4]">{pageTheme === 'sepia' ? '✓ ' : ''}Paper: Warm Sepia</button>
                          <button type="button" onClick={() => { setPageTheme('dark'); setOpenMenu(null); }} className="w-full text-left px-3.5 py-1.5 hover:bg-[#F1F3F4]">{pageTheme === 'dark' ? '✓ ' : ''}Paper: Dark Mode</button>
                        </>
                      )}
                      {m.id === 'insert' && (
                        <>
                          <button type="button" onClick={() => { imgInputRef.current?.click(); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">Image from Device...</button>
                          <button
                            type="button"
                            onClick={() => {
                              execCmd(
                                'insertHTML',
                                '<table style="width:100%;border-collapse:collapse;margin:12px 0;"><tr><th style="border:1px solid #DADCE0;padding:8px;background:#F1F3F4;">Header 1</th><th style="border:1px solid #DADCE0;padding:8px;background:#F1F3F4;">Header 2</th><th style="border:1px solid #DADCE0;padding:8px;background:#F1F3F4;">Header 3</th></tr><tr><td style="border:1px solid #DADCE0;padding:8px;">Item 1</td><td style="border:1px solid #DADCE0;padding:8px;">Details</td><td style="border:1px solid #DADCE0;padding:8px;">Value</td></tr></table>'
                              );
                              setOpenMenu(null);
                            }}
                            className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]"
                          >
                            Insert Table (3×2)
                          </button>
                          <button type="button" onClick={() => { execCmd('insertHorizontalRule'); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">Horizontal Divider Line</button>
                        </>
                      )}
                      {m.id === 'format' && (
                        <>
                          <button type="button" onClick={() => { execCmd('formatBlock', 'h1'); setOpenMenu(null); }} className="w-full text-left px-3.5 py-1.5 hover:bg-[#F1F3F4] font-bold">Heading 1</button>
                          <button type="button" onClick={() => { execCmd('formatBlock', 'h2'); setOpenMenu(null); }} className="w-full text-left px-3.5 py-1.5 hover:bg-[#F1F3F4] font-semibold">Heading 2</button>
                          <button type="button" onClick={() => { execCmd('formatBlock', 'p'); setOpenMenu(null); }} className="w-full text-left px-3.5 py-1.5 hover:bg-[#F1F3F4]">Normal Paragraph</button>
                          <div className="border-t my-1" />
                          <button type="button" onClick={() => { execCmd('removeFormat'); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4] text-rose-600">Clear Formatting</button>
                        </>
                      )}
                      {m.id === 'tools' && (
                        <>
                          <button type="button" onClick={() => { setShowDiffModal(true); setDiffOtherText(stats.plain); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">Compare Document Diff</button>
                          <button type="button" onClick={() => { notify('ok', `Word Count: ${stats.words} words • ${stats.chars} chars • ~${stats.readMin} min read`); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">Word Count ({stats.words} words)</button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side Export Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F1F3F4] hover:bg-[#E8EAED] text-xs font-semibold text-[#1F1F1F]">
            <Upload className="w-3.5 h-3.5" />
            <span>Open</span>
          </button>
          <button type="button" disabled={busy} onClick={handleExportDocx} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] text-white text-xs font-bold shadow-2xs">
            <Download className="w-3.5 h-3.5" />
            <span>.DOCX</span>
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={handleExportPdf}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-white text-xs font-bold shadow-2xs ${
              mode === 'doc2pdf' ? 'bg-[#D94F1D] hover:bg-[#C4461A]' : 'bg-[#0F9D58] hover:bg-[#0B8043]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>

          {!fullViewport && (
            <Link href="/docs" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#C2E7FF] hover:bg-[#A8D8F8] text-[#001D35] text-xs font-bold">
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Full App</span>
            </Link>
          )}

          <button type="button" onClick={() => setIsFullscreen((f) => !f)} className="p-2 rounded-full hover:bg-[#E8EAED] text-[#3C4043]" title="Toggle Fullscreen">
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. GOOGLE DOCS PILL FORMATTING TOOLBAR */}
      <div className="bg-[#EDF2FA] mx-2 sm:mx-3 my-1.5 px-2.5 py-1 rounded-full flex flex-wrap items-center gap-1 text-xs border border-[#DCE3EE]">
        <button type="button" onClick={() => execCmd('undo')} title="Undo" className="p-1.5 rounded-full hover:bg-black/5">
          <Undo2 className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={() => execCmd('redo')} title="Redo" className="p-1.5 rounded-full hover:bg-black/5">
          <Redo2 className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={() => window.print()} title="Print" className="p-1.5 rounded-full hover:bg-black/5">
          <Printer className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-[#C7CDD6] mx-1" />

        <select value={zoomPct} onChange={(e) => setZoomPct(Number(e.target.value))} className="bg-transparent font-semibold text-xs px-1 py-0.5 rounded hover:bg-black/5 focus:outline-none">
          <option value={85}>85%</option>
          <option value={100}>100%</option>
          <option value={115}>115%</option>
          <option value={125}>125%</option>
        </select>

        <div className="h-4 w-px bg-[#C7CDD6] mx-1" />

        {/* Block Style Selector */}
        <select
          onChange={(e) => {
            if (e.target.value) execCmd('formatBlock', e.target.value);
          }}
          defaultValue="p"
          className="bg-transparent font-semibold text-xs px-1.5 py-0.5 rounded hover:bg-black/5 focus:outline-none"
        >
          <option value="p">Normal text</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>

        {/* Font Family */}
        <select
          value={fontFamily}
          onChange={(e) => {
            setFontFamily(e.target.value);
            execCmd('fontName', e.target.value);
          }}
          className="bg-transparent font-semibold text-xs px-1.5 py-0.5 rounded hover:bg-black/5 focus:outline-none max-w-[100px]"
        >
          <option value="Arial">Arial</option>
          <option value="Georgia">Georgia</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Verdana">Verdana</option>
        </select>

        {/* Font Size */}
        <button type="button" onClick={() => setFontSize((s) => Math.max(10, s - 1))} className="px-1.5 py-0.5 rounded hover:bg-black/5 font-bold">
          −
        </button>
        <span className="px-1.5 py-0.5 bg-white border border-[#C7CDD6] rounded text-[11px] font-semibold">
          {fontSize}
        </span>
        <button type="button" onClick={() => setFontSize((s) => Math.min(28, s + 1))} className="px-1.5 py-0.5 rounded hover:bg-black/5 font-bold">
          +
        </button>

        <div className="h-4 w-px bg-[#C7CDD6] mx-1" />

        <button type="button" onClick={() => execCmd('bold')} title="Bold" className="p-1.5 rounded hover:bg-black/5"><Bold className="w-3.5 h-3.5" /></button>
        <button type="button" onClick={() => execCmd('italic')} title="Italic" className="p-1.5 rounded hover:bg-black/5"><Italic className="w-3.5 h-3.5" /></button>
        <button type="button" onClick={() => execCmd('underline')} title="Underline" className="p-1.5 rounded hover:bg-black/5"><Underline className="w-3.5 h-3.5" /></button>
        <button type="button" onClick={() => execCmd('strikeThrough')} title="Strikethrough" className="p-1.5 rounded hover:bg-black/5"><Strikethrough className="w-3.5 h-3.5" /></button>

        <label title="Text Color" className="inline-flex items-center px-1.5 py-1 rounded hover:bg-black/5 cursor-pointer">
          <span className="font-bold underline decoration-2" style={{ textDecorationColor: textColor }}>A</span>
          <input
            type="color"
            value={textColor}
            onChange={(e) => {
              setTextColor(e.target.value);
              execCmd('foreColor', e.target.value);
            }}
            className="w-0 h-0 opacity-0"
          />
        </label>

        <label title="Highlight Color" className="inline-flex items-center px-1.5 py-1 rounded hover:bg-black/5 cursor-pointer">
          <span className="w-3.5 h-3.5 rounded-sm border border-slate-400" style={{ backgroundColor: highlightColor }} />
          <input
            type="color"
            value={highlightColor}
            onChange={(e) => {
              setHighlightColor(e.target.value);
              execCmd('hiliteColor', e.target.value);
            }}
            className="w-0 h-0 opacity-0"
          />
        </label>

        <div className="h-4 w-px bg-[#C7CDD6] mx-1" />

        <button
          type="button"
          onClick={() => {
            const url = prompt('Enter URL (https://...)');
            if (url) execCmd('createLink', url);
          }}
          title="Insert Link"
          className="p-1.5 rounded hover:bg-black/5"
        >
          <Link2 className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={() => imgInputRef.current?.click()} title="Insert Image" className="p-1.5 rounded hover:bg-black/5">
          <ImagePlus className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() =>
            execCmd(
              'insertHTML',
              '<table style="width:100%;border-collapse:collapse;margin:10px 0;"><tr><th style="border:1px solid #DADCE0;padding:6px;background:#F1F3F4;">Column A</th><th style="border:1px solid #DADCE0;padding:6px;background:#F1F3F4;">Column B</th></tr><tr><td style="border:1px solid #DADCE0;padding:6px;">Text</td><td style="border:1px solid #DADCE0;padding:6px;">Details</td></tr></table>'
            )
          }
          title="Insert Table"
          className="p-1.5 rounded hover:bg-black/5"
        >
          <Table className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-[#C7CDD6] mx-1" />

        <button type="button" onClick={() => execCmd('justifyLeft')} title="Align Left" className="p-1.5 rounded hover:bg-black/5"><AlignLeft className="w-3.5 h-3.5" /></button>
        <button type="button" onClick={() => execCmd('justifyCenter')} title="Align Center" className="p-1.5 rounded hover:bg-black/5"><AlignCenter className="w-3.5 h-3.5" /></button>
        <button type="button" onClick={() => execCmd('justifyRight')} title="Align Right" className="p-1.5 rounded hover:bg-black/5"><AlignRight className="w-3.5 h-3.5" /></button>
        <button type="button" onClick={() => execCmd('justifyFull')} title="Justify" className="p-1.5 rounded hover:bg-black/5"><AlignJustify className="w-3.5 h-3.5" /></button>

        <div className="h-4 w-px bg-[#C7CDD6] mx-1" />

        <button type="button" onClick={() => execCmd('insertUnorderedList')} title="Bullet List" className="p-1.5 rounded hover:bg-black/5"><List className="w-3.5 h-3.5" /></button>
        <button type="button" onClick={() => execCmd('insertOrderedList')} title="Numbered List" className="p-1.5 rounded hover:bg-black/5"><ListOrdered className="w-3.5 h-3.5" /></button>
        <button type="button" onClick={() => execCmd('removeFormat')} title="Clear Formatting" className="p-1.5 rounded hover:bg-black/5"><RemoveFormatting className="w-3.5 h-3.5" /></button>
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

      {/* 3. WORKSPACE: LEFT DOCUMENT TABS & OUTLINE + CENTER A4 PAGE WITH RULER */}
      <div className={`flex flex-1 overflow-hidden ${isFullscreen ? 'min-h-0' : 'h-[560px]'}`}>
        {/* Left Document Tabs & Headings Sidebar */}
        {showSidebar && (
          <aside className="hidden md:flex w-60 bg-[#F8FAFD] border-r border-[#E0E3E7] flex-col p-3 space-y-4 overflow-y-auto shrink-0">
            <div className="space-y-2">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-bold text-[#444746]">Document tabs</span>
                <button
                  type="button"
                  onClick={() => {
                    const id = `tab-${Date.now()}`;
                    const name = `Tab ${tabs.length + 1}`;
                    setTabs((prev) => [...prev, { id, name, html: `<h2>${name}</h2><p>Start typing in ${name}...</p>` }]);
                    setActiveTabId(id);
                  }}
                  className="p-1 rounded-full hover:bg-[#E8EAED]"
                  title="Add Document Tab"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-1">
                {tabs.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setActiveTabId(t.id)}
                    className={`flex items-center justify-between gap-2 px-3 py-2 rounded-full text-xs cursor-pointer transition ${
                      t.id === activeTabId ? 'bg-[#C2E7FF] text-[#001D35] font-bold' : 'hover:bg-[#E8EAED] text-[#444746] font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{t.name}</span>
                    </div>
                    {tabs.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const next = tabs.filter((x) => x.id !== t.id);
                          setTabs(next);
                          if (activeTabId === t.id) setActiveTabId(next[0].id);
                        }}
                        className="opacity-60 hover:opacity-100 hover:text-rose-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-[#E0E3E7] pt-3 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-2 block">
                Outline Headings
              </span>
              {headings.length === 0 ? (
                <p className="text-[11px] text-slate-500 italic px-2 leading-relaxed">
                  Headings you add to the document will appear here.
                </p>
              ) : (
                <div className="space-y-1">
                  {headings.map((h) => (
                    <div
                      key={h.idx}
                      className={`text-xs px-2 py-1 rounded hover:bg-[#E8EAED] truncate cursor-default ${
                        h.tag === 'H1' ? 'font-bold text-[#1F1F1F]' : h.tag === 'H2' ? 'pl-4 font-medium text-[#3C4043]' : 'pl-6 text-slate-500'
                      }`}
                    >
                      {h.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Main Scrollable Document Canvas */}
        <div className="flex-1 overflow-y-auto bg-[#F0F4F9] flex flex-col items-center pb-12">
          {/* Google Docs Horizontal Inch Ruler */}
          {showRuler && (
            <div className="w-full max-w-[816px] bg-white border-b border-x border-[#DADCE0] px-10 py-1 flex justify-between text-[10px] font-mono text-slate-400 select-none sticky top-0 z-10">
              {['', '1', '2', '3', '4', '5', '6', '7', ''].map((mark, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span>{mark || '|'}</span>
                </div>
              ))}
            </div>
          )}

          {/* Paper Sheet */}
          <div
            style={{
              transform: zoomPct !== 100 ? `scale(${zoomPct / 100})` : undefined,
              transformOrigin: 'top center',
            }}
            className="w-full max-w-[816px] mt-4 sm:mt-6 px-2 sm:px-0"
          >
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={syncFromDom}
              style={{
                fontSize: `${fontSize}px`,
                fontFamily,
              }}
              className={`min-h-[680px] w-full border shadow-sm px-8 sm:px-16 py-12 focus:outline-none prose max-w-none leading-relaxed ${paperClasses}`}
            />
          </div>

          {/* Google-Docs Style Bottom Quick Action Chips */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 px-4">
            <button
              type="button"
              onClick={() => {
                const tpl = DOC_TEMPLATES[0];
                setTitle(tpl.title);
                setTabs((prev) => prev.map((t) => (t.id === activeTabId ? { ...t, html: tpl.html } : t)));
                if (editorRef.current) editorRef.current.innerHTML = tpl.html;
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#DADCE0] hover:border-[#1A73E8] text-xs font-semibold text-[#3C4043] shadow-2xs"
            >
              <LayoutTemplate className="w-3.5 h-3.5 text-[#1A73E8]" />
              <span>Load Template</span>
            </button>
            <button
              type="button"
              onClick={() => setShowFindModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#DADCE0] hover:border-[#1A73E8] text-xs font-semibold text-[#3C4043] shadow-2xs"
            >
              <Search className="w-3.5 h-3.5 text-[#1A73E8]" />
              <span>Find &amp; Replace</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setDiffOtherText(stats.plain);
                setShowDiffModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#DADCE0] hover:border-[#1A73E8] text-xs font-semibold text-[#3C4043] shadow-2xs"
            >
              <GitCompare className="w-3.5 h-3.5 text-[#1A73E8]" />
              <span>Compare Diff</span>
            </button>
            <span className="px-3.5 py-1.5 rounded-full bg-white border border-[#DADCE0] text-xs font-semibold text-slate-600">
              {stats.words} words • {stats.chars} chars • ~{stats.readMin}m read
            </span>
          </div>
        </div>
      </div>

      {/* FIND & REPLACE MODAL */}
      {showFindModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#DADCE0] shadow-2xl p-5 w-full max-w-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-[#1F1F1F]">Find &amp; Replace in Document</h4>
              <button type="button" onClick={() => setShowFindModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <input type="text" value={findVal} onChange={(e) => setFindVal(e.target.value)} placeholder="Find text..." className="w-full px-3 py-2 rounded-lg border border-[#DADCE0] text-sm" />
            <input type="text" value={replaceVal} onChange={(e) => setReplaceVal(e.target.value)} placeholder="Replace with..." className="w-full px-3 py-2 rounded-lg border border-[#DADCE0] text-sm" />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowFindModal(false)} className="px-4 py-1.5 rounded-full text-xs font-semibold hover:bg-slate-100">Cancel</button>
              <button
                type="button"
                onClick={() => {
                  if (!findVal || !editorRef.current) return;
                  const updated = editorRef.current.innerHTML.split(findVal).join(replaceVal);
                  editorRef.current.innerHTML = updated;
                  syncFromDom();
                  setShowFindModal(false);
                  notify('ok', `Replaced "${findVal}" with "${replaceVal}"`);
                }}
                className="px-5 py-1.5 rounded-full bg-[#1A73E8] text-white text-xs font-bold"
              >
                Replace All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DIFF MODAL */}
      {showDiffModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#DADCE0] shadow-2xl p-5 w-full max-w-3xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-[#1F1F1F]">Compare Document Changes</h4>
              <button type="button" onClick={() => setShowDiffModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <textarea
              rows={5}
              value={diffOtherText}
              onChange={(e) => setDiffOtherText(e.target.value)}
              placeholder="Paste another version here to compare line-by-line..."
              className="w-full p-3 rounded-xl border border-[#DADCE0] font-mono text-xs"
            />
            <div className="border border-[#DADCE0] rounded-xl overflow-hidden text-xs font-mono">
              {(() => {
                const aLines = stats.plain.split('\n');
                const bLines = diffOtherText.split('\n');
                const max = Math.max(aLines.length, bLines.length);
                return Array.from({ length: max }).map((_, i) => {
                  const same = (aLines[i] || '') === (bLines[i] || '');
                  return (
                    <div key={i} className={`grid grid-cols-12 border-b ${same ? 'bg-white' : 'bg-amber-50'}`}>
                      <span className="col-span-1 text-center py-1 text-slate-400 border-r">{i + 1}</span>
                      <span className="col-span-5 px-2 py-1 border-r break-all">{aLines[i] || ' '}</span>
                      <span className="col-span-6 px-2 py-1 break-all">{bLines[i] || ' '}</span>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
