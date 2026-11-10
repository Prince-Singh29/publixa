'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Files,
  Scissors,
  ImagePlus,
  FilePlus2,
  Stamp,
  RotateCw,
  Volume2,
  ScanLine,
  Upload,
  Download,
  ArrowUp,
  ArrowDown,
  Trash2,
  Play,
  Square,
  FileText,
  CheckCircle2,
  AlertCircle,
  PenTool,
  Hash,
  Minimize2,
  Info,
  Eraser,
  ListOrdered,
  FilePlus,
  LayoutGrid,
  ShieldAlert,
  Wrench,
  Lock,
  Sparkles,
  Search,
  Maximize,
  Image as ImageIcon,
  PanelTop,
  ExternalLink,
} from 'lucide-react';
import { downloadBytes, parsePageRanges, toWinAnsiSafe } from './downloadBlob';
import { ALL_PDF_TOOLS, PdfCategory, PdfToolId } from '@/lib/seoToolsData';

export type PdfToolTab = PdfToolId;

interface PdfToolsSuiteProps {
  defaultTab?: PdfToolTab;
  appName?: string;
  linkNavigation?: boolean;
  standalone?: boolean;
}

interface PdfEntry {
  id: string;
  name: string;
  bytes: Uint8Array;
  pageCount: number;
  title?: string;
  author?: string;
  subject?: string;
  dimensions?: string[];
  hasForm?: boolean;
}

interface ImgEntry {
  id: string;
  name: string;
  dataUrl: string;
  fileType: string;
}

const ICON_MAP: Record<PdfToolId, React.ComponentType<{ className?: string }>> = {
  merge: Files,
  split: Scissors,
  delete: Trash2,
  rearrange: ListOrdered,
  addpage: FilePlus,
  nup: LayoutGrid,
  sign: PenTool,
  addimage: ImageIcon,
  watermark: Stamp,
  headerfooter: PanelTop,
  pagenum: Hash,
  bates: Sparkles,
  redact: ShieldAlert,
  rotate: RotateCw,
  margin: Maximize,
  compress: Minimize2,
  repair: Wrench,
  flatten: Lock,
  sanitize: Eraser,
  metadata: Info,
  img2pdf: ImagePlus,
  create: FilePlus2,
  reader: Volume2,
  scan: ScanLine,
};

export default function PdfToolsSuite({ defaultTab = 'merge', appName = 'Publixa PDF', linkNavigation = false, standalone = false }: PdfToolsSuiteProps) {
  const [tab, setTab] = useState<PdfToolTab>(defaultTab);

  useEffect(() => {
    setTab(defaultTab);
  }, [defaultTab]);
  const [catFilter, setCatFilter] = useState<'All' | PdfCategory>('All');
  const [toolSearch, setToolSearch] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);

  // Merge state
  const [mergeFiles, setMergeFiles] = useState<PdfEntry[]>([]);

  // Single PDF state
  const [singlePdf, setSinglePdf] = useState<PdfEntry | null>(null);
  const [splitRange, setSplitRange] = useState('1-2');
  const [deleteRange, setDeleteRange] = useState('2');
  const [rearrangeSeq, setRearrangeSeq] = useState('1, 2');
  const [addPagePos, setAddPagePos] = useState<'start' | 'end' | 'after'>('end');
  const [addPageAfter, setAddPageAfter] = useState(1);
  const [nupMode, setNupMode] = useState<2 | 4>(2);

  // Markups
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.25);
  const [watermarkColor, setWatermarkColor] = useState<'orange' | 'red' | 'gray' | 'blue'>('orange');
  const [headerText, setHeaderText] = useState('CONFIDENTIAL DOCUMENT');
  const [footerText, setFooterText] = useState('Generated with Publixa PDF');
  const [rotateDegrees, setRotateDegrees] = useState<90 | 180 | 270>(90);
  const [marginPt, setMarginPt] = useState(36);

  // Page numbers & Bates
  const [pageNumPos, setPageNumPos] = useState<'bottom-center' | 'bottom-right' | 'top-right'>('bottom-center');
  const [pageNumPrefix, setPageNumPrefix] = useState('Page ');
  const [pageNumStart, setPageNumStart] = useState(1);
  const [batesPrefix, setBatesPrefix] = useState('CASE-');
  const [batesStart, setBatesStart] = useState(1);
  const [batesDigits, setBatesDigits] = useState(5);

  // Redact
  const [redactZone, setRedactZone] = useState<'top' | 'middle' | 'bottom'>('top');
  const [redactPages, setRedactPages] = useState('1');

  // Stamp image on PDF
  const [stampImgUrl, setStampImgUrl] = useState<string | null>(null);
  const [stampWidth, setStampWidth] = useState(120);
  const [stampCorner, setStampCorner] = useState<'bottom-right' | 'top-right' | 'center'>('bottom-right');

  // Signature state
  const sigCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const [sigColor, setSigColor] = useState('#1A0F0A');
  const [sigPos, setSigPos] = useState<'bottom-right' | 'bottom-left' | 'bottom-center'>('bottom-right');
  const [sigPageMode, setSigPageMode] = useState<'last' | 'first' | 'all'>('last');
  const [hasSigStroke, setHasSigStroke] = useState(false);

  // Metadata edit state
  const [metaTitle, setMetaTitle] = useState('');
  const [metaAuthor, setMetaAuthor] = useState('');
  const [metaSubject, setMetaSubject] = useState('');

  // Images to PDF
  const [imgFiles, setImgFiles] = useState<ImgEntry[]>([]);
  const [imgPageMode, setImgPageMode] = useState<'a4' | 'fit'>('a4');

  // Create PDF
  const [docTitle, setDocTitle] = useState('Document Created on Publixa');
  const [docAuthor, setDocAuthor] = useState('Publixa Web Studio');
  const [docBody, setDocBody] = useState(
    'Welcome to the Publixa Web PDF Creator!\n\nType or paste your document content here. Every paragraph wraps cleanly across standard A4 pages with zero server uploads — 100% private in your browser.\n\n* Clean typography\n* Multi-page automatic pagination\n* Instant offline PDF download'
  );
  const [docFontSize, setDocFontSize] = useState(12);

  // Reader & TTS
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string>('');
  const [ttsText, setTtsText] = useState(
    'Publixa AI Voice Reader works directly inside your web browser. Paste any PDF text or document notes here and press Listen Aloud to hear crystal clear narration.'
  );
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState('');
  const [ttsRate, setTtsRate] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Scanner
  const [scanImgUrl, setScanImgUrl] = useState<string | null>(null);
  const [scanFilter, setScanFilter] = useState<'bw' | 'contrast' | 'grayscale' | 'original'>('bw');
  const scanCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        const list = window.speechSynthesis.getVoices();
        setVoices(list);
        if (list.length > 0 && !selectedVoiceURI) {
          setSelectedVoiceURI(list[0].voiceURI);
        }
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl, selectedVoiceURI]);

  useEffect(() => {
    if (!scanImgUrl || !scanCanvasRef.current) return;
    const canvas = scanCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new window.Image();
    img.onload = () => {
      const maxW = 900;
      const scale = img.width > maxW ? maxW / img.width : 1;
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);

      if (scanFilter === 'bw') ctx.filter = 'grayscale(100%) contrast(185%) brightness(112%)';
      else if (scanFilter === 'contrast') ctx.filter = 'contrast(145%) saturate(115%) brightness(105%)';
      else if (scanFilter === 'grayscale') ctx.filter = 'grayscale(100%) contrast(120%)';
      else ctx.filter = 'none';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = scanImgUrl;
  }, [scanImgUrl, scanFilter]);

  const activeMeta = useMemo(
    () => ALL_PDF_TOOLS.find((t) => t.id === tab) || ALL_PDF_TOOLS[0],
    [tab]
  );

  const visibleTools = useMemo(() => {
    const q = toolSearch.toLowerCase().trim();
    return ALL_PDF_TOOLS.filter((t) => {
      const catOk = catFilter === 'All' || t.category === catFilter;
      const qOk =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.shortDesc.toLowerCase().includes(q) ||
        t.seoDescription.toLowerCase().includes(q);
      return catOk && qOk;
    });
  }, [catFilter, toolSearch]);

  const singlePdfNeeded = !['merge', 'img2pdf', 'create', 'reader', 'scan'].includes(tab);
  const notify = (type: 'ok' | 'err', msg: string) => setStatus({ type, msg });

  // Signature pad helpers
  const getSigCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = sigCanvasRef.current!;
    const rect = c.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * c.width,
      y: ((e.clientY - rect.top) / rect.height) * c.height,
    };
  };

  const handleSigDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = sigCanvasRef.current;
    if (!c) return;
    c.setPointerCapture(e.pointerId);
    const ctx = c.getContext('2d')!;
    const { x, y } = getSigCoords(e);
    ctx.strokeStyle = sigColor;
    ctx.lineWidth = 3.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
    isDrawingRef.current = true;
    setHasSigStroke(true);
  };

  const handleSigMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !sigCanvasRef.current) return;
    const ctx = sigCanvasRef.current.getContext('2d')!;
    const { x, y } = getSigCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleSigUp = () => {
    isDrawingRef.current = false;
  };

  const clearSignature = () => {
    if (!sigCanvasRef.current) return;
    const ctx = sigCanvasRef.current.getContext('2d')!;
    ctx.clearRect(0, 0, sigCanvasRef.current.width, sigCanvasRef.current.height);
    setHasSigStroke(false);
  };

  // Loaders
  const handleAddMergePdfs = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const added: PdfEntry[] = [];
      for (const f of Array.from(files)) {
        const bytes = new Uint8Array(await f.arrayBuffer());
        const doc = await PDFDocument.load(bytes);
        added.push({ id: `${f.name}-${Date.now()}-${Math.random()}`, name: f.name, bytes, pageCount: doc.getPageCount() });
      }
      setMergeFiles((prev) => [...prev, ...added]);
      notify('ok', `Added ${added.length} PDF file(s). Ready to merge!`);
    } catch {
      notify('err', 'Could not read one of the selected PDF files.');
    } finally {
      setBusy(false);
    }
  };

  const handleMergeDownload = async () => {
    if (mergeFiles.length < 2) {
      notify('err', 'Please add at least 2 PDF files to merge.');
      return;
    }
    setBusy(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const merged = await PDFDocument.create();
      for (const entry of mergeFiles) {
        const src = await PDFDocument.load(entry.bytes);
        const copied = await merged.copyPages(src, src.getPageIndices());
        copied.forEach((p) => merged.addPage(p));
      }
      downloadBytes(await merged.save(), 'publixa-merged.pdf', 'application/pdf');
      notify('ok', `Merged ${mergeFiles.length} PDFs (${merged.getPageCount()} pages)!`);
    } catch {
      notify('err', 'Failed to merge PDFs.');
    } finally {
      setBusy(false);
    }
  };

  const handleLoadSinglePdf = async (files: FileList | null) => {
    if (!files || !files[0]) return;
    setBusy(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const f = files[0];
      const bytes = new Uint8Array(await f.arrayBuffer());
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const count = doc.getPageCount();
      const title = doc.getTitle() || '';
      const author = doc.getAuthor() || '';
      const subject = doc.getSubject() || '';
      let hasForm = false;
      try {
        hasForm = doc.getForm().getFields().length > 0;
      } catch {
        hasForm = false;
      }
      const dimensions = doc.getPages().slice(0, 6).map((p, idx) => {
        const { width, height } = p.getSize();
        return `Page ${idx + 1}: ${Math.round(width)}×${Math.round(height)} pt (${Math.round(width * 0.3527)}×${Math.round(height * 0.3527)} mm)`;
      });
      setSinglePdf({ id: f.name, name: f.name, bytes, pageCount: count, title, author, subject, dimensions, hasForm });
      setMetaTitle(title);
      setMetaAuthor(author);
      setMetaSubject(subject);
      setSplitRange(count >= 2 ? `1-${Math.min(2, count)}` : '1');
      setRearrangeSeq(Array.from({ length: count }, (_, i) => i + 1).join(', '));
      notify('ok', `Loaded "${f.name}" (${count} pages, ${(bytes.length / 1024).toFixed(1)} KB).`);
    } catch {
      notify('err', 'Could not open PDF.');
    } finally {
      setBusy(false);
    }
  };

  // All 24 tool action handlers
  const handleSplitDownload = async () => {
    if (!singlePdf) return;
    const indices = parsePageRanges(splitRange, singlePdf.pageCount);
    if (indices.length === 0) return notify('err', `Enter pages between 1 and ${singlePdf.pageCount}.`);
    setBusy(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const src = await PDFDocument.load(singlePdf.bytes);
      const outDoc = await PDFDocument.create();
      (await outDoc.copyPages(src, indices)).forEach((p) => outDoc.addPage(p));
      downloadBytes(await outDoc.save(), `split-${singlePdf.name}`, 'application/pdf');
      notify('ok', `Extracted ${indices.length} page(s)!`);
    } catch {
      notify('err', 'Could not split this PDF.');
    } finally {
      setBusy(false);
    }
  };

  const handleDeletePagesDownload = async () => {
    if (!singlePdf) return;
    const delSet = new Set(parsePageRanges(deleteRange, singlePdf.pageCount));
    const keepIndices = Array.from({ length: singlePdf.pageCount }, (_, i) => i).filter((i) => !delSet.has(i));
    if (delSet.size === 0) return notify('err', 'Specify at least 1 valid page number to remove.');
    if (keepIndices.length === 0) return notify('err', 'Cannot delete every page in the PDF.');
    setBusy(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const src = await PDFDocument.load(singlePdf.bytes);
      const outDoc = await PDFDocument.create();
      (await outDoc.copyPages(src, keepIndices)).forEach((p) => outDoc.addPage(p));
      downloadBytes(await outDoc.save(), `trimmed-${singlePdf.name}`, 'application/pdf');
      notify('ok', `Deleted ${delSet.size} page(s). Kept ${keepIndices.length} remaining page(s)!`);
    } catch {
      notify('err', 'Failed deleting pages.');
    } finally {
      setBusy(false);
    }
  };

  const handleRearrangeDownload = async (reverseAll = false) => {
    if (!singlePdf) return;
    const order = reverseAll
      ? Array.from({ length: singlePdf.pageCount }, (_, i) => singlePdf.pageCount - 1 - i)
      : rearrangeSeq
          .split(',')
          .map((n) => parseInt(n.trim(), 10) - 1)
          .filter((idx) => !isNaN(idx) && idx >= 0 && idx < singlePdf.pageCount);
    if (order.length === 0) return notify('err', 'Enter a valid comma-separated page sequence (e.g. 2, 1, 3).');
    setBusy(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const src = await PDFDocument.load(singlePdf.bytes);
      const outDoc = await PDFDocument.create();
      (await outDoc.copyPages(src, order)).forEach((p) => outDoc.addPage(p));
      downloadBytes(await outDoc.save(), `reordered-${singlePdf.name}`, 'application/pdf');
      notify('ok', reverseAll ? 'Reversed all pages back-to-front!' : `Reordered ${order.length} pages!`);
    } catch {
      notify('err', 'Failed reordering pages.');
    } finally {
      setBusy(false);
    }
  };

  const handleAddBlankPageDownload = async () => {
    if (!singlePdf) return;
    setBusy(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const doc = await PDFDocument.load(singlePdf.bytes);
      const refSize = doc.getPage(0).getSize();
      const insertIdx =
        addPagePos === 'start' ? 0 : addPagePos === 'end' ? doc.getPageCount() : Math.min(doc.getPageCount(), Math.max(0, addPageAfter));
      doc.insertPage(insertIdx, [refSize.width, refSize.height]);
      downloadBytes(await doc.save(), `with-blank-${singlePdf.name}`, 'application/pdf');
      notify('ok', `Inserted blank page at position ${insertIdx + 1}!`);
    } catch {
      notify('err', 'Failed inserting blank page.');
    } finally {
      setBusy(false);
    }
  };

  const handleNupDownload = async () => {
    if (!singlePdf) return;
    setBusy(true);
    try {
      const { PDFDocument, rgb } = await import('pdf-lib');
      const src = await PDFDocument.load(singlePdf.bytes);
      const outDoc = await PDFDocument.create();
      const embedded = await outDoc.embedPages(src.getPages());

      const sheetW = nupMode === 2 ? 842 : 595;
      const sheetH = nupMode === 2 ? 595 : 842;
      const cols = 2;
      const rows = nupMode === 2 ? 1 : 2;
      const margin = 20;
      const cellW = (sheetW - margin * (cols + 1)) / cols;
      const cellH = (sheetH - margin * (rows + 1)) / rows;

      for (let i = 0; i < embedded.length; i += nupMode) {
        const page = outDoc.addPage([sheetW, sheetH]);
        for (let slot = 0; slot < nupMode && i + slot < embedded.length; slot++) {
          const ep = embedded[i + slot];
          const r = Math.floor(slot / cols);
          const c = slot % cols;
          const x0 = margin + c * (cellW + margin);
          const y0 = sheetH - margin - (r + 1) * cellH - r * margin;
          const scale = Math.min(cellW / ep.width, cellH / ep.height);
          const dw = ep.width * scale;
          const dh = ep.height * scale;
          page.drawPage(ep, {
            x: x0 + (cellW - dw) / 2,
            y: y0 + (cellH - dh) / 2,
            width: dw,
            height: dh,
          });
          page.drawRectangle({ x: x0, y: y0, width: cellW, height: cellH, borderColor: rgb(0.85, 0.85, 0.85), borderWidth: 0.5 });
        }
      }

      downloadBytes(await outDoc.save(), `${nupMode}up-${singlePdf.name}`, 'application/pdf');
      notify('ok', `Created ${nupMode}-up imposed PDF sheet!`);
    } catch {
      notify('err', 'Failed imposing N-up layout.');
    } finally {
      setBusy(false);
    }
  };

  const handleSignDownload = async () => {
    if (!singlePdf || !sigCanvasRef.current || !hasSigStroke) {
      return notify('err', 'Load a PDF and draw your signature first.');
    }
    setBusy(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const pngBytes = await new Promise<ArrayBuffer>((res) => sigCanvasRef.current!.toBlob(async (b) => res(await b!.arrayBuffer()), 'image/png'));
      const doc = await PDFDocument.load(singlePdf.bytes);
      const embeddedSig = await doc.embedPng(pngBytes);
      const pages = doc.getPages();
      const targets = sigPageMode === 'all' ? pages : sigPageMode === 'first' ? [pages[0]] : [pages[pages.length - 1]];
      for (const page of targets) {
        const { width } = page.getSize();
        const sigW = Math.min(160, width * 0.28);
        const sigH = sigW * (sigCanvasRef.current.height / sigCanvasRef.current.width);
        const x = sigPos === 'bottom-left' ? 42 : sigPos === 'bottom-center' ? (width - sigW) / 2 : width - sigW - 42;
        page.drawImage(embeddedSig, { x, y: 36, width: sigW, height: sigH });
      }
      downloadBytes(await doc.save(), `signed-${singlePdf.name}`, 'application/pdf');
      notify('ok', `Signed ${targets.length} page(s)!`);
    } catch {
      notify('err', 'Failed to sign PDF.');
    } finally {
      setBusy(false);
    }
  };

  const handleAddImageStampDownload = async () => {
    if (!singlePdf || !stampImgUrl) return notify('err', 'Load a PDF and select an image stamp first.');
    setBusy(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const jpgBytes = await new Promise<{ buf: ArrayBuffer; w: number; h: number }>((res) => {
        const img = new window.Image();
        img.onload = () => {
          const c = document.createElement('canvas');
          c.width = img.width;
          c.height = img.height;
          c.getContext('2d')!.drawImage(img, 0, 0);
          c.toBlob(async (b) => res({ buf: await b!.arrayBuffer(), w: img.width, h: img.height }), 'image/png');
        };
        img.src = stampImgUrl;
      });
      const doc = await PDFDocument.load(singlePdf.bytes);
      const embedded = await doc.embedPng(jpgBytes.buf);
      const page = doc.getPage(0);
      const { width, height } = page.getSize();
      const drawW = Math.min(stampWidth, width * 0.8);
      const drawH = drawW * (jpgBytes.h / jpgBytes.w);
      const x = stampCorner === 'center' ? (width - drawW) / 2 : width - drawW - 36;
      const y = stampCorner === 'center' ? (height - drawH) / 2 : stampCorner === 'top-right' ? height - drawH - 36 : 36;
      page.drawImage(embedded, { x, y, width: drawW, height: drawH });
      downloadBytes(await doc.save(), `stamped-${singlePdf.name}`, 'application/pdf');
      notify('ok', 'Embedded image stamp onto Page 1!');
    } catch {
      notify('err', 'Failed embedding image.');
    } finally {
      setBusy(false);
    }
  };

  const handleWatermarkDownload = async () => {
    if (!singlePdf || !watermarkText.trim()) return;
    setBusy(true);
    try {
      const { PDFDocument, StandardFonts, rgb, degrees } = await import('pdf-lib');
      const doc = await PDFDocument.load(singlePdf.bytes);
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      const colorMap = { orange: rgb(0.85, 0.31, 0.11), red: rgb(0.82, 0.15, 0.15), gray: rgb(0.4, 0.4, 0.4), blue: rgb(0.12, 0.35, 0.78) };
      const wmSafe = toWinAnsiSafe(watermarkText);
      for (const page of doc.getPages()) {
        const { width, height } = page.getSize();
        const fontSize = Math.max(24, Math.min(54, width / Math.max(8, wmSafe.length * 0.85)));
        const textWidth = font.widthOfTextAtSize(wmSafe, fontSize);
        page.drawText(wmSafe, { x: width / 2 - textWidth / 2.6, y: height / 2 - fontSize / 2, size: fontSize, font, color: colorMap[watermarkColor], opacity: watermarkOpacity, rotate: degrees(38) });
      }
      downloadBytes(await doc.save(), `watermarked-${singlePdf.name}`, 'application/pdf');
      notify('ok', 'Stamped watermark across all pages!');
    } catch {
      notify('err', 'Failed watermarking PDF.');
    } finally {
      setBusy(false);
    }
  };

  const handleHeaderFooterDownload = async () => {
    if (!singlePdf) return;
    setBusy(true);
    try {
      const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
      const doc = await PDFDocument.load(singlePdf.bytes);
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const hSafe = toWinAnsiSafe(headerText);
      const fSafe = toWinAnsiSafe(footerText);
      for (const page of doc.getPages()) {
        const { width, height } = page.getSize();
        if (hSafe) page.drawText(hSafe, { x: 36, y: height - 28, size: 9.5, font, color: rgb(0.35, 0.35, 0.35) });
        if (fSafe) page.drawText(fSafe, { x: Math.max(36, width - font.widthOfTextAtSize(fSafe, 9.5) - 36), y: 20, size: 9.5, font, color: rgb(0.35, 0.35, 0.35) });
      }
      downloadBytes(await doc.save(), `header-footer-${singlePdf.name}`, 'application/pdf');
      notify('ok', 'Applied header & footer across all pages!');
    } catch {
      notify('err', 'Failed applying header/footer.');
    } finally {
      setBusy(false);
    }
  };

  const handlePageNumbersDownload = async (isBates = false) => {
    if (!singlePdf) return;
    setBusy(true);
    try {
      const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
      const doc = await PDFDocument.load(singlePdf.bytes);
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      const pages = doc.getPages();
      const total = pages.length + pageNumStart - 1;
      pages.forEach((page, i) => {
        const { width, height } = page.getSize();
        const label = isBates
          ? toWinAnsiSafe(`${batesPrefix}${String(batesStart + i).padStart(batesDigits, '0')}`)
          : toWinAnsiSafe(`${pageNumPrefix}${i + pageNumStart} of ${total}`);
        const txtW = font.widthOfTextAtSize(label, 10);
        const x = pageNumPos === 'bottom-center' && !isBates ? (width - txtW) / 2 : width - txtW - 36;
        const y = pageNumPos === 'top-right' ? height - 30 : 24;
        page.drawText(label, { x, y, size: 10, font, color: rgb(0.2, 0.2, 0.2) });
      });
      downloadBytes(await doc.save(), `${isBates ? 'bates' : 'numbered'}-${singlePdf.name}`, 'application/pdf');
      notify('ok', isBates ? `Stamped sequential Bates IDs (${batesPrefix}...) across ${pages.length} pages!` : `Stamped page numbers across ${pages.length} pages!`);
    } catch {
      notify('err', 'Failed numbering PDF.');
    } finally {
      setBusy(false);
    }
  };

  const handleRedactDownload = async () => {
    if (!singlePdf) return;
    const targets = parsePageRanges(redactPages, singlePdf.pageCount);
    if (targets.length === 0) return notify('err', `Specify valid pages between 1 and ${singlePdf.pageCount}.`);
    setBusy(true);
    try {
      const { PDFDocument, rgb } = await import('pdf-lib');
      const doc = await PDFDocument.load(singlePdf.bytes);
      targets.forEach((idx) => {
        const page = doc.getPage(idx);
        const { width, height } = page.getSize();
        const rectH = height * 0.14;
        const rectY = redactZone === 'top' ? height - rectH - 20 : redactZone === 'middle' ? (height - rectH) / 2 : 24;
        page.drawRectangle({ x: 32, y: rectY, width: width - 64, height: rectH, color: rgb(0, 0, 0) });
      });
      downloadBytes(await doc.save(), `redacted-${singlePdf.name}`, 'application/pdf');
      notify('ok', `Applied permanent black redaction mask to ${targets.length} page(s)!`);
    } catch {
      notify('err', 'Failed redacting PDF.');
    } finally {
      setBusy(false);
    }
  };

  const handleRotateDownload = async () => {
    if (!singlePdf) return;
    setBusy(true);
    try {
      const { PDFDocument, degrees } = await import('pdf-lib');
      const doc = await PDFDocument.load(singlePdf.bytes);
      for (const page of doc.getPages()) {
        page.setRotation(degrees((page.getRotation().angle + rotateDegrees) % 360));
      }
      downloadBytes(await doc.save(), `rotated-${singlePdf.name}`, 'application/pdf');
      notify('ok', `Rotated all pages by ${rotateDegrees}°!`);
    } catch {
      notify('err', 'Could not rotate PDF.');
    } finally {
      setBusy(false);
    }
  };

  const handleAddMarginDownload = async () => {
    if (!singlePdf) return;
    setBusy(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const src = await PDFDocument.load(singlePdf.bytes);
      const out = await PDFDocument.create();
      const embedded = await out.embedPages(src.getPages());
      embedded.forEach((ep) => {
        const page = out.addPage([ep.width + marginPt * 2, ep.height + marginPt * 2]);
        page.drawPage(ep, { x: marginPt, y: marginPt, width: ep.width, height: ep.height });
      });
      downloadBytes(await out.save(), `margins-${singlePdf.name}`, 'application/pdf');
      notify('ok', `Added ${marginPt}pt white margins around every page!`);
    } catch {
      notify('err', 'Failed adding margins.');
    } finally {
      setBusy(false);
    }
  };

  const handleCompressRepairSanitizeFlatten = async (modeType: 'compress' | 'repair' | 'flatten' | 'sanitize') => {
    if (!singlePdf) return;
    setBusy(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const doc = await PDFDocument.load(singlePdf.bytes, { ignoreEncryption: true });
      let outBytes: Uint8Array;

      if (modeType === 'flatten') {
        try {
          doc.getForm().flatten();
        } catch {
          // no form fields, still save cleanly
        }
        outBytes = await doc.save();
        notify('ok', 'Flattened form fields & saved locked PDF!');
      } else if (modeType === 'sanitize') {
        doc.setTitle('');
        doc.setAuthor('');
        doc.setSubject('');
        doc.setKeywords([]);
        doc.setCreator('');
        doc.setProducer('');
        outBytes = await doc.save();
        notify('ok', 'Scrubbed hidden Title, Author, Subject & Creator metadata!');
      } else {
        const clean = await PDFDocument.create();
        const copied = await clean.copyPages(doc, doc.getPageIndices());
        copied.forEach((p) => clean.addPage(p));
        outBytes = await clean.save({ useObjectStreams: true, addDefaultPage: false });
        if (modeType === 'compress') {
          const savedPct = Math.max(0, Math.round(((singlePdf.bytes.length - outBytes.length) / singlePdf.bytes.length) * 100));
          notify('ok', `Optimized PDF: ${(singlePdf.bytes.length / 1024).toFixed(1)} KB → ${(outBytes.length / 1024).toFixed(1)} KB (${savedPct}% saved)!`);
        } else {
          notify('ok', `Rebuilt clean cross-reference tables across ${copied.length} pages!`);
        }
      }
      downloadBytes(outBytes, `${modeType}-${singlePdf.name}`, 'application/pdf');
    } catch {
      notify('err', `Could not ${modeType} this PDF.`);
    } finally {
      setBusy(false);
    }
  };

  const handleSaveMetadata = async () => {
    if (!singlePdf) return;
    setBusy(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const doc = await PDFDocument.load(singlePdf.bytes);
      doc.setTitle(toWinAnsiSafe(metaTitle));
      doc.setAuthor(toWinAnsiSafe(metaAuthor));
      doc.setSubject(toWinAnsiSafe(metaSubject));
      doc.setCreator('Publixa Web PDF Studio');
      downloadBytes(await doc.save(), `meta-${singlePdf.name}`, 'application/pdf');
      notify('ok', 'Updated PDF metadata & downloaded!');
    } catch {
      notify('err', 'Failed updating metadata.');
    } finally {
      setBusy(false);
    }
  };

  const handleImagesToPdf = async () => {
    if (imgFiles.length === 0) return notify('err', 'Add at least 1 image first.');
    setBusy(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const doc = await PDFDocument.create();
      for (const item of imgFiles) {
        const imgBytes = await new Promise<{ bytes: ArrayBuffer; w: number; h: number }>((res) => {
          const img = new window.Image();
          img.onload = () => {
            const c = document.createElement('canvas');
            c.width = img.width;
            c.height = img.height;
            c.getContext('2d')!.drawImage(img, 0, 0);
            c.toBlob(async (b) => res({ bytes: await b!.arrayBuffer(), w: img.width, h: img.height }), 'image/jpeg', 0.92);
          };
          img.src = item.dataUrl;
        });
        const embedded = await doc.embedJpg(imgBytes.bytes);
        if (imgPageMode === 'fit') {
          doc.addPage([imgBytes.w, imgBytes.h]).drawImage(embedded, { x: 0, y: 0, width: imgBytes.w, height: imgBytes.h });
        } else {
          const page = doc.addPage([595, 842]);
          const scale = Math.min((595 - 64) / imgBytes.w, (842 - 64) / imgBytes.h);
          const dw = imgBytes.w * scale;
          const dh = imgBytes.h * scale;
          page.drawImage(embedded, { x: (595 - dw) / 2, y: (842 - dh) / 2, width: dw, height: dh });
        }
      }
      downloadBytes(await doc.save(), 'publixa-images.pdf', 'application/pdf');
      notify('ok', `Converted ${imgFiles.length} image(s) to PDF!`);
    } catch {
      notify('err', 'Failed converting images.');
    } finally {
      setBusy(false);
    }
  };

  const handleCreateTextPdf = async () => {
    if (!docBody.trim() && !docTitle.trim()) return;
    setBusy(true);
    try {
      const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
      const doc = await PDFDocument.create();
      doc.setTitle(toWinAnsiSafe(docTitle));
      doc.setAuthor(toWinAnsiSafe(docAuthor));
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);

      const pageW = 595;
      const pageH = 842;
      const margin = 48;
      const maxWidth = pageW - margin * 2;
      const lineHeight = docFontSize * 1.48;
      let page = doc.addPage([pageW, pageH]);
      let y = pageH - margin;

      if (docTitle.trim()) {
        page.drawText(toWinAnsiSafe(docTitle.trim()), { x: margin, y, size: 20, font: boldFont, color: rgb(0.1, 0.06, 0.04) });
        y -= 28;
        if (docAuthor.trim()) {
          page.drawText(toWinAnsiSafe(`By ${docAuthor.trim()}`), { x: margin, y, size: 10, font, color: rgb(0.55, 0.48, 0.44) });
          y -= 22;
        }
        page.drawLine({ start: { x: margin, y: y + 8 }, end: { x: pageW - margin, y: y + 8 }, thickness: 1, color: rgb(0.94, 0.87, 0.83) });
        y -= 16;
      }

      for (const rawPara of docBody.split('\n')) {
        const para = toWinAnsiSafe(rawPara);
        if (!para.trim()) {
          y -= lineHeight * 0.7;
          if (y < margin + lineHeight) { page = doc.addPage([pageW, pageH]); y = pageH - margin; }
          continue;
        }
        let currentLine = '';
        for (const word of para.split(/\s+/)) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          if (font.widthOfTextAtSize(testLine, docFontSize) <= maxWidth) {
            currentLine = testLine;
          } else {
            if (y < margin + lineHeight) { page = doc.addPage([pageW, pageH]); y = pageH - margin; }
            page.drawText(currentLine, { x: margin, y, size: docFontSize, font, color: rgb(0.15, 0.1, 0.08) });
            y -= lineHeight;
            currentLine = word;
          }
        }
        if (currentLine) {
          if (y < margin + lineHeight) { page = doc.addPage([pageW, pageH]); y = pageH - margin; }
          page.drawText(currentLine, { x: margin, y, size: docFontSize, font, color: rgb(0.15, 0.1, 0.08) });
          y -= lineHeight * 1.15;
        }
      }
      downloadBytes(await doc.save(), `${(docTitle || 'document').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`, 'application/pdf');
      notify('ok', 'Generated and downloaded your custom PDF!');
    } catch {
      notify('err', 'Failed generating PDF.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      {!standalone && (
        <>
          {/* Category Pills & Instant Tool Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {(['All', 'Organize', 'Edit & Markup', 'Security & Clean', 'Create & Read'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCatFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                catFilter === cat
                  ? 'bg-[#1A0F0A] text-white'
                  : 'bg-[#FFF0E6] text-[#3D2315] hover:bg-[#FFE3D1]'
              }`}
            >
              {cat === 'All' ? `All ${ALL_PDF_TOOLS.length} PDF Tools` : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-[#8C7A70] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={toolSearch}
            onChange={(e) => setToolSearch(e.target.value)}
            placeholder="Search 24 PDF tools..."
            className="w-full pl-9 pr-3.5 py-2 rounded-full bg-[#FFF9F5] border border-[#E5CEC0] focus:border-[#D94F1D] focus:outline-none text-xs font-semibold"
          />
        </div>
      </div>

      {/* Rich 24-Tool Selector Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 border-b border-[#F0DFD5] pb-5">
        {visibleTools.map((t) => {
          const Icon = ICON_MAP[t.id];
          const active = tab === t.id;
          const cardClass = `relative flex flex-col justify-between p-3 rounded-2xl text-left border transition-all ${
            active
              ? 'bg-[#D94F1D] text-white border-[#D94F1D] shadow-md shadow-[#D94F1D]/20'
              : 'bg-[#FFF9F5] text-[#3D2315] border-[#F0DFD5] hover:border-[#D94F1D] hover:bg-white'
          }`;
          const cardInner = (
            <>
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${active ? 'bg-white/20 text-white' : 'bg-[#FFF0E6] text-[#D94F1D]'}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold leading-tight truncate">{t.title}</span>
              </div>
              <p className={`text-[10px] line-clamp-2 leading-snug ${active ? 'text-orange-100' : 'text-[#665349]'}`}>
                {t.shortDesc}
              </p>
              {t.badge && (
                <span className={`absolute -top-1.5 right-2 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${active ? 'bg-white text-[#D94F1D]' : 'bg-emerald-600 text-white'}`}>
                  {t.badge}
                </span>
              )}
            </>
          );

          if (linkNavigation) {
            return (
              <Link key={t.id} href={`/pdf/${t.slug}`} className={cardClass}>
                {cardInner}
              </Link>
            );
          }

          return (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setTab(t.id);
                setStatus(null);
              }}
              className={cardClass}
            >
              {cardInner}
            </button>
          );
        })}
      </div>

      {/* In-Between Active Tool SEO Info & Description Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#FFF9F5] to-[#FFF0E6] border border-[#FFDFC8] p-4 sm:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#FFDFC8] text-[10px] font-bold uppercase text-[#D94F1D]">
                {activeMeta.category}
              </span>
              <h2 className="font-heading font-extrabold text-base sm:text-lg text-[#1A0F0A]">
                {activeMeta.title}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#3D2315] leading-relaxed">
              {activeMeta.seoDescription}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0 self-start sm:self-center">
            {!linkNavigation && (
              <Link
                href={`/pdf/${activeMeta.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1A0F0A] hover:bg-[#D94F1D] text-white text-[11px] font-bold transition"
              >
                <span>Open Tool Page</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            )}
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              100% Client-Side RAM • {appName}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#FFDFC8]/70">
          {activeMeta.features.map((feat) => (
            <span
              key={feat}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#5A4235] bg-white/90 border border-[#F0DFD5] px-2.5 py-1 rounded-lg"
            >
              <CheckCircle2 className="w-3 h-3 text-[#D94F1D] shrink-0" />
              <span>{feat}</span>
            </span>
          ))}
        </div>
      </div>
        </>
      )}

      {status && (
        <div
          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold border ${
            status.type === 'ok' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          {status.type === 'ok' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{status.msg}</span>
        </div>
      )}

      {/* MERGE PDF */}
      {tab === 'merge' && (
        <div className="space-y-4">
          <label className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-[#E5CEC0] bg-[#FFF9F5] hover:border-[#D94F1D] cursor-pointer transition text-center">
            <Upload className="w-8 h-8 text-[#D94F1D] mb-2" />
            <span className="font-bold text-sm sm:text-base text-[#1A0F0A]">Select Multiple PDF Files to Combine</span>
            <input type="file" accept="application/pdf" multiple className="hidden" onChange={(e) => handleAddMergePdfs(e.target.files)} />
          </label>
          {mergeFiles.length > 0 && (
            <div className="space-y-2.5">
              {mergeFiles.map((f, idx) => (
                <div key={f.id} className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-white border border-[#F0DFD5]">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-[#FFF0E6] text-[#D94F1D] font-bold text-xs flex items-center justify-center shrink-0">{idx + 1}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#1A0F0A] truncate">{f.name}</p>
                      <p className="text-xs text-[#8C7A70]">{f.pageCount} page(s)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button type="button" onClick={() => setMergeFiles((p) => { if (idx === 0) return p; const n = [...p]; [n[idx - 1], n[idx]] = [n[idx], n[idx - 1]]; return n; })} className="p-1.5 rounded-lg hover:bg-[#FFF0E6]"><ArrowUp className="w-4 h-4" /></button>
                    <button type="button" onClick={() => setMergeFiles((p) => { if (idx === p.length - 1) return p; const n = [...p]; [n[idx + 1], n[idx]] = [n[idx], n[idx + 1]]; return n; })} className="p-1.5 rounded-lg hover:bg-[#FFF0E6]"><ArrowDown className="w-4 h-4" /></button>
                    <button type="button" onClick={() => setMergeFiles((prev) => prev.filter((x) => x.id !== f.id))} className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
              <button type="button" disabled={busy} onClick={handleMergeDownload} className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#D94F1D] hover:bg-[#C4461A] text-white font-bold text-sm shadow-md transition">
                <Download className="w-4 h-4" />
                <span>Merge {mergeFiles.length} PDFs &amp; Download</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* SINGLE PDF WORKBENCH FOR 19 TOOLS */}
      {singlePdfNeeded && (
        <div className="space-y-5">
          <label className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-[#E5CEC0] bg-[#FFF9F5] hover:border-[#D94F1D] cursor-pointer transition text-center">
            <FileText className="w-7 h-7 text-[#D94F1D] mb-1.5" />
            <span className="font-bold text-sm text-[#1A0F0A]">
              {singlePdf ? `Loaded: ${singlePdf.name} (${singlePdf.pageCount} pages, ${(singlePdf.bytes.length / 1024).toFixed(1)} KB) — Click to change` : `Upload Any PDF to Use "${activeMeta.title}"`}
            </span>
            <input type="file" accept="application/pdf" className="hidden" onChange={(e) => handleLoadSinglePdf(e.target.files)} />
          </label>

          {singlePdf && tab === 'split' && (
            <div className="bg-white border border-[#F0DFD5] rounded-2xl p-5 space-y-4">
              <label className="text-xs font-bold text-[#8C7A70] block">Pages to Extract (1–{singlePdf.pageCount}, e.g. 1-3, 5)</label>
              <input type="text" value={splitRange} onChange={(e) => setSplitRange(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-[#E5CEC0] font-mono text-sm font-bold" />
              <button type="button" disabled={busy} onClick={handleSplitDownload} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D94F1D] text-white font-bold text-sm"><Scissors className="w-4 h-4" /><span>Extract Pages &amp; Download</span></button>
            </div>
          )}

          {singlePdf && tab === 'delete' && (
            <div className="bg-white border border-[#F0DFD5] rounded-2xl p-5 space-y-4">
              <label className="text-xs font-bold text-[#8C7A70] block">Pages to Delete Permanently (1–{singlePdf.pageCount}, e.g. 2, 4-5)</label>
              <input type="text" value={deleteRange} onChange={(e) => setDeleteRange(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-[#E5CEC0] font-mono text-sm font-bold" />
              <button type="button" disabled={busy} onClick={handleDeletePagesDownload} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-rose-600 text-white font-bold text-sm"><Trash2 className="w-4 h-4" /><span>Delete Selected Pages &amp; Download</span></button>
            </div>
          )}

          {singlePdf && tab === 'rearrange' && (
            <div className="bg-white border border-[#F0DFD5] rounded-2xl p-5 space-y-4">
              <label className="text-xs font-bold text-[#8C7A70] block">New Page Order (Comma-separated 1–{singlePdf.pageCount})</label>
              <input type="text" value={rearrangeSeq} onChange={(e) => setRearrangeSeq(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-[#E5CEC0] font-mono text-sm font-bold" />
              <div className="flex flex-wrap gap-3">
                <button type="button" disabled={busy} onClick={() => handleRearrangeDownload(false)} className="px-6 py-3 rounded-full bg-[#D94F1D] text-white font-bold text-sm">Save Custom Order</button>
                <button type="button" disabled={busy} onClick={() => handleRearrangeDownload(true)} className="px-6 py-3 rounded-full bg-[#1A0F0A] text-white font-bold text-sm">Reverse Entire Order ({singlePdf.pageCount} → 1)</button>
              </div>
            </div>
          )}

          {singlePdf && tab === 'addpage' && (
            <div className="bg-white border border-[#F0DFD5] rounded-2xl p-5 space-y-4">
              <div className="flex flex-wrap gap-3 items-center">
                <select value={addPagePos} onChange={(e) => setAddPagePos(e.target.value as 'start' | 'end' | 'after')} className="px-3.5 py-2.5 rounded-xl border border-[#E5CEC0] text-sm font-bold bg-white">
                  <option value="end">Insert at End</option>
                  <option value="start">Insert at Beginning</option>
                  <option value="after">Insert After Page #</option>
                </select>
                {addPagePos === 'after' && (
                  <input type="number" min={1} max={singlePdf.pageCount} value={addPageAfter} onChange={(e) => setAddPageAfter(Number(e.target.value))} className="w-24 px-3 py-2.5 rounded-xl border border-[#E5CEC0] text-sm font-bold" />
                )}
              </div>
              <button type="button" disabled={busy} onClick={handleAddBlankPageDownload} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D94F1D] text-white font-bold text-sm"><FilePlus className="w-4 h-4" /><span>Insert Blank Page &amp; Download</span></button>
            </div>
          )}

          {singlePdf && tab === 'nup' && (
            <div className="bg-white border border-[#F0DFD5] rounded-2xl p-5 space-y-4">
              <div className="flex gap-3">
                <button type="button" onClick={() => setNupMode(2)} className={`px-4 py-2 rounded-full text-xs font-bold ${nupMode === 2 ? 'bg-[#1A0F0A] text-white' : 'bg-[#FFF0E6]'}`}>2-Up (Side by Side Landscape)</button>
                <button type="button" onClick={() => setNupMode(4)} className={`px-4 py-2 rounded-full text-xs font-bold ${nupMode === 4 ? 'bg-[#1A0F0A] text-white' : 'bg-[#FFF0E6]'}`}>4-Up (2×2 Booklet Grid)</button>
              </div>
              <button type="button" disabled={busy} onClick={handleNupDownload} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D94F1D] text-white font-bold text-sm"><LayoutGrid className="w-4 h-4" /><span>Create {nupMode}-Up Sheet &amp; Download</span></button>
            </div>
          )}

          {tab === 'sign' && (
            <div className="bg-white border border-[#F0DFD5] rounded-2xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="font-bold text-sm text-[#1A0F0A]">Draw Your Signature</span>
                <div className="flex items-center gap-2">
                  {(['#1A0F0A', '#1D4ED8', '#D94F1D'] as const).map((col) => (
                    <button key={col} type="button" onClick={() => setSigColor(col)} className={`w-6 h-6 rounded-full border-2 ${sigColor === col ? 'border-amber-400 scale-110' : 'border-transparent'}`} style={{ backgroundColor: col }} />
                  ))}
                  <button type="button" onClick={clearSignature} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FFF0E6] text-xs font-bold"><Eraser className="w-3.5 h-3.5" /><span>Clear</span></button>
                </div>
              </div>
              <div className="rounded-xl border-2 border-dashed border-[#E5CEC0] bg-[#FFFAF6] flex justify-center">
                <canvas ref={sigCanvasRef} width={560} height={150} onPointerDown={handleSigDown} onPointerMove={handleSigMove} onPointerUp={handleSigUp} onPointerLeave={handleSigUp} className="touch-none cursor-crosshair w-full max-w-[560px] h-[150px]" />
              </div>
              <div className="flex flex-wrap gap-2 justify-between">
                <div className="flex gap-2">
                  <select value={sigPos} onChange={(e) => setSigPos(e.target.value as 'bottom-right' | 'bottom-left' | 'bottom-center')} className="px-3 py-2 rounded-xl border border-[#E5CEC0] text-xs font-bold bg-white">
                    <option value="bottom-right">Bottom Right</option><option value="bottom-center">Bottom Center</option><option value="bottom-left">Bottom Left</option>
                  </select>
                  <select value={sigPageMode} onChange={(e) => setSigPageMode(e.target.value as 'last' | 'first' | 'all')} className="px-3 py-2 rounded-xl border border-[#E5CEC0] text-xs font-bold bg-white">
                    <option value="last">Last Page</option><option value="first">First Page</option><option value="all">Every Page</option>
                  </select>
                </div>
                <button type="button" disabled={busy || !singlePdf} onClick={handleSignDownload} className="px-6 py-2.5 rounded-full bg-[#D94F1D] text-white font-bold text-xs disabled:opacity-40">{singlePdf ? 'Sign PDF & Download' : 'Upload PDF Above'}</button>
              </div>
            </div>
          )}

          {singlePdf && tab === 'addimage' && (
            <div className="bg-white border border-[#F0DFD5] rounded-2xl p-5 space-y-4">
              <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFF0E6] border border-[#FFDFC8] cursor-pointer text-xs font-bold text-[#D94F1D]">
                <ImageIcon className="w-4 h-4" />
                <span>{stampImgUrl ? 'Image Selected — Click to Replace' : 'Choose PNG / JPG Logo or Stamp'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = () => setStampImgUrl(String(r.result)); r.readAsDataURL(f); }} />
              </label>
              <div className="flex flex-wrap gap-4 items-center">
                <select value={stampCorner} onChange={(e) => setStampCorner(e.target.value as 'bottom-right' | 'top-right' | 'center')} className="px-3 py-2 rounded-xl border border-[#E5CEC0] text-xs font-bold bg-white">
                  <option value="bottom-right">Bottom Right</option><option value="top-right">Top Right</option><option value="center">Center</option>
                </select>
                <span className="text-xs font-bold">Width: {stampWidth}pt</span>
                <input type="range" min={60} max={300} value={stampWidth} onChange={(e) => setStampWidth(Number(e.target.value))} className="w-40 accent-[#D94F1D]" />
              </div>
              <button type="button" disabled={busy || !stampImgUrl} onClick={handleAddImageStampDownload} className="px-6 py-3 rounded-full bg-[#D94F1D] text-white font-bold text-sm disabled:opacity-40">Stamp Image onto PDF &amp; Download</button>
            </div>
          )}

          {singlePdf && tab === 'watermark' && (
            <div className="bg-white border border-[#F0DFD5] rounded-2xl p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input type="text" value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)} className="px-3.5 py-2.5 rounded-xl border border-[#E5CEC0] text-sm font-bold" />
                <select value={watermarkColor} onChange={(e) => setWatermarkColor(e.target.value as 'orange' | 'red' | 'gray' | 'blue')} className="px-3.5 py-2.5 rounded-xl border border-[#E5CEC0] text-sm font-semibold bg-white">
                  <option value="orange">Publixa Orange</option><option value="red">Alert Red</option><option value="gray">Slate Gray</option><option value="blue">Blue</option>
                </select>
                <div className="flex items-center gap-2"><span className="text-xs font-bold">{Math.round(watermarkOpacity * 100)}%</span><input type="range" min={0.1} max={0.8} step={0.05} value={watermarkOpacity} onChange={(e) => setWatermarkOpacity(Number(e.target.value))} className="flex-1 accent-[#D94F1D]" /></div>
              </div>
              <button type="button" disabled={busy} onClick={handleWatermarkDownload} className="px-6 py-3 rounded-full bg-[#D94F1D] text-white font-bold text-sm">Stamp All Pages &amp; Download</button>
            </div>
          )}

          {singlePdf && tab === 'headerfooter' && (
            <div className="bg-white border border-[#F0DFD5] rounded-2xl p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="text-xs font-bold text-[#8C7A70] block mb-1">Top Header Text</label><input type="text" value={headerText} onChange={(e) => setHeaderText(e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-[#E5CEC0] text-sm font-semibold" /></div>
                <div><label className="text-xs font-bold text-[#8C7A70] block mb-1">Bottom Footer Text</label><input type="text" value={footerText} onChange={(e) => setFooterText(e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-[#E5CEC0] text-sm font-semibold" /></div>
              </div>
              <button type="button" disabled={busy} onClick={handleHeaderFooterDownload} className="px-6 py-3 rounded-full bg-[#D94F1D] text-white font-bold text-sm">Apply Header &amp; Footer to All Pages</button>
            </div>
          )}

          {singlePdf && (tab === 'pagenum' || tab === 'bates') && (
            <div className="bg-white border border-[#F0DFD5] rounded-2xl p-5 space-y-4">
              {tab === 'bates' ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div><label className="text-xs font-bold text-[#8C7A70] block mb-1">Bates Prefix</label><input type="text" value={batesPrefix} onChange={(e) => setBatesPrefix(e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-[#E5CEC0] text-sm font-mono font-bold" /></div>
                  <div><label className="text-xs font-bold text-[#8C7A70] block mb-1">Start Number</label><input type="number" min={1} value={batesStart} onChange={(e) => setBatesStart(Number(e.target.value))} className="w-full px-3.5 py-2 rounded-xl border border-[#E5CEC0] text-sm font-bold" /></div>
                  <div><label className="text-xs font-bold text-[#8C7A70] block mb-1">Zero-Pad Digits</label><input type="number" min={3} max={8} value={batesDigits} onChange={(e) => setBatesDigits(Number(e.target.value))} className="w-full px-3.5 py-2 rounded-xl border border-[#E5CEC0] text-sm font-bold" /></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <select value={pageNumPos} onChange={(e) => setPageNumPos(e.target.value as 'bottom-center' | 'bottom-right' | 'top-right')} className="px-3.5 py-2.5 rounded-xl border border-[#E5CEC0] text-sm font-bold bg-white">
                    <option value="bottom-center">Bottom Center</option><option value="bottom-right">Bottom Right</option><option value="top-right">Top Right</option>
                  </select>
                  <input type="text" value={pageNumPrefix} onChange={(e) => setPageNumPrefix(e.target.value)} className="px-3.5 py-2.5 rounded-xl border border-[#E5CEC0] text-sm font-bold" />
                  <input type="number" min={1} value={pageNumStart} onChange={(e) => setPageNumStart(Math.max(1, Number(e.target.value)))} className="px-3.5 py-2.5 rounded-xl border border-[#E5CEC0] text-sm font-bold" />
                </div>
              )}
              <button type="button" disabled={busy} onClick={() => handlePageNumbersDownload(tab === 'bates')} className="px-6 py-3 rounded-full bg-[#D94F1D] text-white font-bold text-sm">
                {tab === 'bates' ? 'Apply Legal Bates Numbers & Download' : 'Stamp Page Numbers & Download'}
              </button>
            </div>
          )}

          {singlePdf && tab === 'redact' && (
            <div className="bg-white border border-[#F0DFD5] rounded-2xl p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="text-xs font-bold text-[#8C7A70] block mb-1">Redaction Band</label><select value={redactZone} onChange={(e) => setRedactZone(e.target.value as 'top' | 'middle' | 'bottom')} className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5CEC0] text-sm font-bold bg-white"><option value="top">Top Header Zone (Top 14%)</option><option value="middle">Middle Body Band</option><option value="bottom">Bottom Signature Zone</option></select></div>
                <div><label className="text-xs font-bold text-[#8C7A70] block mb-1">Target Pages (1–{singlePdf.pageCount})</label><input type="text" value={redactPages} onChange={(e) => setRedactPages(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5CEC0] font-mono text-sm font-bold" /></div>
              </div>
              <button type="button" disabled={busy} onClick={handleRedactDownload} className="px-6 py-3 rounded-full bg-[#1A0F0A] text-white font-bold text-sm">Apply Permanent Blackout Redaction</button>
            </div>
          )}

          {singlePdf && tab === 'rotate' && (
            <div className="bg-white border border-[#F0DFD5] rounded-2xl p-5 space-y-4">
              <div className="flex flex-wrap gap-2">
                {([90, 180, 270] as const).map((deg) => (
                  <button key={deg} type="button" onClick={() => setRotateDegrees(deg)} className={`px-4 py-2 rounded-full text-xs font-bold ${rotateDegrees === deg ? 'bg-[#1A0F0A] text-white' : 'bg-[#FFF0E6]'}`}>Rotate {deg}° Clockwise</button>
                ))}
              </div>
              <button type="button" disabled={busy} onClick={handleRotateDownload} className="px-6 py-3 rounded-full bg-[#D94F1D] text-white font-bold text-sm">Apply Rotation &amp; Download</button>
            </div>
          )}

          {singlePdf && tab === 'margin' && (
            <div className="bg-white border border-[#F0DFD5] rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold">Margin Padding: {marginPt}pt ({Math.round(marginPt * 0.3527)}mm)</span>
                <input type="range" min={12} max={96} value={marginPt} onChange={(e) => setMarginPt(Number(e.target.value))} className="w-48 accent-[#D94F1D]" />
              </div>
              <button type="button" disabled={busy} onClick={handleAddMarginDownload} className="px-6 py-3 rounded-full bg-[#D94F1D] text-white font-bold text-sm">Expand Page Margins &amp; Download</button>
            </div>
          )}

          {singlePdf && (tab === 'compress' || tab === 'repair' || tab === 'flatten' || tab === 'sanitize') && (
            <div className="bg-white border border-[#F0DFD5] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs sm:text-sm text-[#3D2315]">
                <strong>{activeMeta.title}:</strong> {activeMeta.shortDesc} (File size: <strong>{(singlePdf.bytes.length / 1024).toFixed(1)} KB</strong>{tab === 'flatten' ? ` • Interactive fields detected: ${singlePdf.hasForm ? 'Yes' : 'None/Static'}` : ''})
              </div>
              <button type="button" disabled={busy} onClick={() => handleCompressRepairSanitizeFlatten(tab)} className="px-6 py-3 rounded-full bg-[#D94F1D] text-white font-bold text-sm shrink-0">
                Run {activeMeta.title} &amp; Download
              </button>
            </div>
          )}

          {singlePdf && tab === 'metadata' && (
            <div className="bg-white border border-[#F0DFD5] rounded-2xl p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="Title" className="px-3.5 py-2 rounded-xl border border-[#E5CEC0] text-sm font-bold" />
                <input type="text" value={metaAuthor} onChange={(e) => setMetaAuthor(e.target.value)} placeholder="Author" className="px-3.5 py-2 rounded-xl border border-[#E5CEC0] text-sm font-bold" />
                <input type="text" value={metaSubject} onChange={(e) => setMetaSubject(e.target.value)} placeholder="Subject" className="px-3.5 py-2 rounded-xl border border-[#E5CEC0] text-sm font-bold" />
              </div>
              {singlePdf.dimensions && <div className="p-3.5 rounded-xl bg-[#FFF9F5] border border-[#F0DFD5] text-xs font-mono text-[#3D2315] space-y-1">{singlePdf.dimensions.map((d, i) => <div key={i}>{d}</div>)}</div>}
              <button type="button" disabled={busy} onClick={handleSaveMetadata} className="px-6 py-3 rounded-full bg-[#D94F1D] text-white font-bold text-sm">Save Metadata &amp; Download</button>
            </div>
          )}
        </div>
      )}

      {/* IMAGES TO PDF */}
      {tab === 'img2pdf' && (
        <div className="space-y-4">
          <label className="flex flex-col items-center justify-center p-7 rounded-2xl border-2 border-dashed border-[#E5CEC0] bg-[#FFF9F5] hover:border-[#D94F1D] cursor-pointer transition text-center">
            <ImagePlus className="w-8 h-8 text-[#D94F1D] mb-2" />
            <span className="font-bold text-sm sm:text-base text-[#1A0F0A]">Select JPG, PNG or WebP Photos</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={async (e) => {
              if (!e.target.files) return;
              const items: ImgEntry[] = [];
              for (const f of Array.from(e.target.files)) {
                const url = await new Promise<string>((res) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.readAsDataURL(f); });
                items.push({ id: `${f.name}-${Math.random()}`, name: f.name, dataUrl: url, fileType: f.type });
              }
              setImgFiles((p) => [...p, ...items]);
            }} />
          </label>
          {imgFiles.length > 0 && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <button type="button" onClick={() => setImgPageMode('a4')} className={`px-3.5 py-1.5 rounded-full text-xs font-bold ${imgPageMode === 'a4' ? 'bg-[#1A0F0A] text-white' : 'bg-[#FFF0E6]'}`}>Fit on A4 Pages</button>
                <button type="button" onClick={() => setImgPageMode('fit')} className={`px-3.5 py-1.5 rounded-full text-xs font-bold ${imgPageMode === 'fit' ? 'bg-[#1A0F0A] text-white' : 'bg-[#FFF0E6]'}`}>Exact Image Dimensions</button>
              </div>
              <button type="button" disabled={busy} onClick={handleImagesToPdf} className="px-7 py-3.5 rounded-full bg-[#D94F1D] text-white font-bold text-sm">Convert {imgFiles.length} Image(s) to PDF</button>
            </div>
          )}
        </div>
      )}

      {/* CREATE PDF */}
      {tab === 'create' && (
        <div className="bg-[#FFF9F5] border border-[#F0DFD5] rounded-2xl p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input type="text" value={docTitle} onChange={(e) => setDocTitle(e.target.value)} className="sm:col-span-2 px-3.5 py-2.5 rounded-xl bg-white border border-[#E5CEC0] text-sm font-bold" />
            <div className="flex items-center gap-2"><span className="text-xs font-bold">{docFontSize}pt</span><input type="range" min={9} max={20} value={docFontSize} onChange={(e) => setDocFontSize(Number(e.target.value))} className="flex-1 accent-[#D94F1D]" /></div>
          </div>
          <input type="text" value={docAuthor} onChange={(e) => setDocAuthor(e.target.value)} className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E5CEC0] text-sm" />
          <textarea rows={7} value={docBody} onChange={(e) => setDocBody(e.target.value)} className="w-full p-4 rounded-xl bg-white border border-[#E5CEC0] text-sm leading-relaxed" />
          <button type="button" disabled={busy} onClick={handleCreateTextPdf} className="px-7 py-3.5 rounded-full bg-[#D94F1D] text-white font-bold text-sm">Create &amp; Download PDF</button>
        </div>
      )}

      {/* READER & TTS */}
      {tab === 'reader' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-4">
            <label className="flex items-center justify-center gap-3 p-4 rounded-2xl border-2 border-dashed border-[#E5CEC0] bg-[#FFF9F5] cursor-pointer">
              <Upload className="w-5 h-5 text-[#D94F1D]" />
              <span className="font-bold text-sm">{previewName || 'Open Any PDF to Preview'}</span>
              <input type="file" accept="application/pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; if (previewUrl) URL.revokeObjectURL(previewUrl); setPreviewUrl(URL.createObjectURL(f)); setPreviewName(f.name); }} />
            </label>
            {previewUrl ? <iframe src={previewUrl} title="PDF Preview" className="w-full h-[360px] rounded-2xl border border-[#F0DFD5]" /> : <div className="h-[360px] rounded-2xl border border-[#F0DFD5] bg-[#FFF9F5] flex items-center justify-center text-xs text-[#8C7A70]">Upload a PDF above to read inline</div>}
          </div>
          <div className="lg:col-span-6 bg-[#FFF9F5] border border-[#F0DFD5] rounded-2xl p-5 space-y-4">
            <textarea rows={7} value={ttsText} onChange={(e) => setTtsText(e.target.value)} className="w-full p-3.5 rounded-xl bg-white border border-[#E5CEC0] text-sm" />
            <div className="grid grid-cols-2 gap-3">
              <select value={selectedVoiceURI} onChange={(e) => setSelectedVoiceURI(e.target.value)} className="px-3 py-2 rounded-xl bg-white border border-[#E5CEC0] text-xs font-semibold">
                {voices.length === 0 ? <option>Default Browser Voice</option> : voices.map((v) => <option key={v.voiceURI} value={v.voiceURI}>{v.name}</option>)}
              </select>
              <input type="range" min={0.6} max={2} step={0.1} value={ttsRate} onChange={(e) => setTtsRate(Number(e.target.value))} className="accent-[#D94F1D]" />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => { if ('speechSynthesis' in window) { window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(ttsText); const v = voices.find((x) => x.voiceURI === selectedVoiceURI); if (v) u.voice = v; u.rate = ttsRate; u.onend = () => setIsSpeaking(false); setIsSpeaking(true); window.speechSynthesis.speak(u); } }} className="flex-1 py-3 rounded-full bg-[#D94F1D] text-white font-bold text-sm flex items-center justify-center gap-2"><Play className="w-4 h-4" /><span>Listen Aloud</span></button>
              {isSpeaking && <button type="button" onClick={() => { window.speechSynthesis.cancel(); setIsSpeaking(false); }} className="px-5 py-3 rounded-full bg-[#1A0F0A] text-white font-bold text-sm flex items-center gap-1"><Square className="w-4 h-4" /><span>Stop</span></button>}
            </div>
          </div>
        </div>
      )}

      {/* SCANNER TO PDF */}
      {tab === 'scan' && (
        <div className="space-y-4">
          <label className="flex items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed border-[#E5CEC0] bg-[#FFF9F5] cursor-pointer">
            <ScanLine className="w-6 h-6 text-[#D94F1D]" />
            <span className="font-bold text-sm">Upload Photo of Receipt, ID, or Notes to Scan</span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = () => setScanImgUrl(String(r.result)); r.readAsDataURL(f); }} />
          </label>
          {scanImgUrl && (
            <div className="space-y-4">
              <div className="flex flex-wrap justify-between gap-3">
                <div className="flex gap-2">
                  {(['bw', 'contrast', 'grayscale', 'original'] as const).map((f) => (
                    <button key={f} type="button" onClick={() => setScanFilter(f)} className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase ${scanFilter === f ? 'bg-[#1A0F0A] text-white' : 'bg-[#FFF0E6]'}`}>{f}</button>
                  ))}
                </div>
                <button type="button" disabled={busy} onClick={async () => {
                  if (!scanCanvasRef.current) return;
                  const { PDFDocument } = await import('pdf-lib');
                  const c = scanCanvasRef.current;
                  const jpg = await new Promise<ArrayBuffer>((res) => c.toBlob(async (b) => res(await b!.arrayBuffer()), 'image/jpeg', 0.92));
                  const doc = await PDFDocument.create();
                  const img = await doc.embedJpg(jpg);
                  doc.addPage([c.width, c.height]).drawImage(img, { x: 0, y: 0, width: c.width, height: c.height });
                  downloadBytes(await doc.save(), 'publixa-scanned.pdf', 'application/pdf');
                }} className="px-6 py-2.5 rounded-full bg-[#D94F1D] text-white font-bold text-xs">Save Scanned PDF</button>
              </div>
              <div className="rounded-2xl border border-[#F0DFD5] bg-slate-900/5 p-4 flex justify-center"><canvas ref={scanCanvasRef} className="max-w-full max-h-[380px] rounded-xl" /></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
