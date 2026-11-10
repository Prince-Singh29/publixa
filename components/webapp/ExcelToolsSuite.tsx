'use client';

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  FileSpreadsheet,
  Undo2,
  Redo2,
  Printer,
  Bold,
  Italic,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Plus,
  Search,
  BarChart3,
  Download,
  Upload,
  FileText,
  Maximize2,
  Minimize2,
  Trash2,
  Copy,
  Check,
  Sigma,
  ArrowUpDown,
  Grid,
  ChevronDown,
  Sparkles,
  WrapText,
  ExternalLink,
  X,
} from 'lucide-react';
import {
  CellData,
  CellStyle,
  SheetState,
  colLabel,
  cellKey,
  cellAddr,
  evaluateFormula,
  formatCellDisplay,
} from './excel/excelEngine';
import { SPREADSHEET_TEMPLATES } from './excel/excelTemplates';
import { downloadBytes, downloadText, toWinAnsiSafe, hexToRgbTuple } from './downloadBlob';

interface ExcelToolsSuiteProps {
  defaultMode?: 'reader' | 'pdf';
  appName?: string;
  fullViewport?: boolean;
}

const STORAGE_KEY = 'publixa_sheets_workspace_v2';

export default function ExcelToolsSuite({
  defaultMode = 'reader',
  appName = 'Publixa Sheets',
  fullViewport = false,
}: ExcelToolsSuiteProps) {
  const initialTemplate = SPREADSHEET_TEMPLATES[1].build(); // Start with Budget sample or blank
  const [title, setTitle] = useState(initialTemplate.title);
  const [sheets, setSheets] = useState<SheetState[]>(initialTemplate.sheets);
  const [activeSheetIdx, setActiveSheetIdx] = useState(0);
  const [hydratedStorage, setHydratedStorage] = useState(false);

  // Selection & Editing
  const [selStart, setSelStart] = useState<{ r: number; c: number }>({ r: 0, c: 0 });
  const [selEnd, setSelEnd] = useState<{ r: number; c: number }>({ r: 0, c: 0 });
  const [isSelecting, setIsSelecting] = useState(false);
  const [editingCell, setEditingCell] = useState<{ r: number; c: number } | null>(null);
  const [editDraft, setEditDraft] = useState('');

  // History stack
  const [history, setHistory] = useState<SheetState[][]>([]);
  const [redoStack, setRedoStack] = useState<SheetState[][]>([]);

  // UI Popovers & Modals
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [showFnMenu, setShowFnMenu] = useState(false);
  const [showFindModal, setShowFindModal] = useState(false);
  const [findVal, setFindVal] = useState('');
  const [replaceVal, setReplaceVal] = useState('');
  const [showChartPanel, setShowChartPanel] = useState(false);
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [zoomPct, setZoomPct] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(fullViewport);
  const [showFormulaBar, setShowFormulaBar] = useState(true);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [renamingIdx, setRenamingIdx] = useState<number | null>(null);
  const [renameDraft, setRenameDraft] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const editInputRef = useRef<HTMLInputElement | null>(null);
  const gridContainerRef = useRef<HTMLDivElement | null>(null);

  const sheet = sheets[Math.min(activeSheetIdx, sheets.length - 1)] || sheets[0];

  // Load saved local workspace once on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.sheets) && parsed.sheets.length > 0) {
          setTitle(parsed.title || 'Untitled spreadsheet');
          setSheets(parsed.sheets);
        }
      }
    } catch {
      // ignore storage errors
    } finally {
      setHydratedStorage(true);
    }
  }, []);

  // Auto-save locally whenever sheets or title change
  useEffect(() => {
    if (!hydratedStorage) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ title, sheets }));
    } catch {
      // ignore quota limits
    }
  }, [title, sheets, hydratedStorage]);

  useEffect(() => {
    const onMouseUp = () => setIsSelecting(false);
    window.addEventListener('mouseup', onMouseUp);
    return () => window.removeEventListener('mouseup', onMouseUp);
  }, []);

  useEffect(() => {
    if (editingCell && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingCell]);

  const notify = (msg: string) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg((prev) => (prev === msg ? null : prev)), 3000);
  };

  const pushHistory = useCallback((snapshot: SheetState[]) => {
    setHistory((h) => [...h.slice(-24), snapshot]);
    setRedoStack([]);
  }, []);

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setRedoStack((r) => [...r, sheets]);
    setSheets(prev);
    setHistory((h) => h.slice(0, -1));
  }, [history, sheets]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setHistory((h) => [...h, sheets]);
    setSheets(next);
    setRedoStack((r) => r.slice(0, -1));
  }, [redoStack, sheets]);

  const bounds = useMemo(() => {
    return {
      r1: Math.min(selStart.r, selEnd.r),
      r2: Math.max(selStart.r, selEnd.r),
      c1: Math.min(selStart.c, selEnd.c),
      c2: Math.max(selStart.c, selEnd.c),
    };
  }, [selStart, selEnd]);

  const activeKey = cellKey(selStart.r, selStart.c);
  const activeCell = sheet.cells[activeKey];
  const activeStyle = activeCell?.s || {};

  // Compute evaluated values for current sheet
  const evaluatedMap = useMemo(() => {
    const out: Record<string, string> = {};
    for (let r = 0; r < sheet.rows; r++) {
      for (let c = 0; c < sheet.cols; c++) {
        const k = cellKey(r, c);
        const cell = sheet.cells[k];
        if (cell && cell.v !== '') {
          out[k] = evaluateFormula(cell.v, sheet.cells);
        }
      }
    }
    return out;
  }, [sheet]);

  // Live selection stats
  const selectionStats = useMemo(() => {
    const nums: number[] = [];
    let nonEmpty = 0;
    for (let r = bounds.r1; r <= bounds.r2; r++) {
      for (let c = bounds.c1; c <= bounds.c2; c++) {
        const k = cellKey(r, c);
        const raw = evaluatedMap[k] ?? '';
        if (raw !== '') {
          nonEmpty++;
          const num = Number(String(raw).replace(/[,₹$%\s]/g, ''));
          if (!isNaN(num)) nums.push(num);
        }
      }
    }
    if (nums.length === 0) return { nonEmpty, sum: null, avg: null, min: null, max: null };
    const sum = nums.reduce((a, b) => a + b, 0);
    return {
      nonEmpty,
      sum,
      avg: sum / nums.length,
      min: Math.min(...nums),
      max: Math.max(...nums),
    };
  }, [bounds, evaluatedMap]);

  const commitCellValue = useCallback(
    (r: number, c: number, val: string) => {
      pushHistory(sheets);
      setSheets((prev) =>
        prev.map((s, idx) => {
          if (idx !== activeSheetIdx) return s;
          const k = cellKey(r, c);
          const nextCells = { ...s.cells };
          if (val === '' && !nextCells[k]?.s) {
            delete nextCells[k];
          } else {
            nextCells[k] = { ...nextCells[k], v: val };
          }
          return { ...s, cells: nextCells };
        })
      );
    },
    [activeSheetIdx, pushHistory, sheets]
  );

  const applyStyleToSelection = (updater: (cur: CellStyle) => CellStyle) => {
    pushHistory(sheets);
    setSheets((prev) =>
      prev.map((s, idx) => {
        if (idx !== activeSheetIdx) return s;
        const nextCells = { ...s.cells };
        for (let r = bounds.r1; r <= bounds.r2; r++) {
          for (let c = bounds.c1; c <= bounds.c2; c++) {
            const k = cellKey(r, c);
            const cur = nextCells[k] || { v: '' };
            nextCells[k] = { ...cur, s: updater(cur.s || {}) };
          }
        }
        return { ...s, cells: nextCells };
      })
    );
  };

  const clearSelectionValues = useCallback(() => {
    pushHistory(sheets);
    setSheets((prev) =>
      prev.map((s, idx) => {
        if (idx !== activeSheetIdx) return s;
        const nextCells = { ...s.cells };
        for (let r = bounds.r1; r <= bounds.r2; r++) {
          for (let c = bounds.c1; c <= bounds.c2; c++) {
            const k = cellKey(r, c);
            if (nextCells[k]?.s) nextCells[k] = { v: '', s: nextCells[k].s };
            else delete nextCells[k];
          }
        }
        return { ...s, cells: nextCells };
      })
    );
  }, [activeSheetIdx, bounds, pushHistory, sheets]);

  const insertFunctionInActive = (fnName: string) => {
    const r1 = bounds.r1;
    const r2 = bounds.r2;
    const c1 = bounds.c1;
    const c2 = bounds.c2;
    const hasMulti = r1 !== r2 || c1 !== c2;
    const rangeArg = hasMulti ? `${cellAddr(r1, c1)}:${cellAddr(r2, c2)}` : `E2:E5`;

    const targetR = hasMulti ? Math.min(sheet.rows - 1, r2 + 1) : selStart.r;
    const targetC = hasMulti ? c1 : selStart.c;
    const formula =
      fnName === 'IF'
        ? `=IF(${cellAddr(targetR, Math.max(0, targetC - 1))}>100,"High","Low")`
        : `=${fnName}(${rangeArg})`;
    commitCellValue(targetR, targetC, formula);
    setSelStart({ r: targetR, c: targetC });
    setSelEnd({ r: targetR, c: targetC });
    setShowFnMenu(false);
    notify(`Inserted ${formula}`);
  };

  const handleCopySelection = useCallback(async () => {
    const lines: string[] = [];
    for (let r = bounds.r1; r <= bounds.r2; r++) {
      const rowVals: string[] = [];
      for (let c = bounds.c1; c <= bounds.c2; c++) {
        rowVals.push(evaluatedMap[cellKey(r, c)] ?? '');
      }
      lines.push(rowVals.join('\t'));
    }
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      notify(`Copied ${bounds.r2 - bounds.r1 + 1}×${bounds.c2 - bounds.c1 + 1} cell(s)`);
    } catch {
      // ignore
    }
  }, [bounds, evaluatedMap]);

  const handlePaste = useCallback(async () => {
    try {
      const clip = await navigator.clipboard.readText();
      if (!clip) return;
      const rowsData = clip.replace(/\r\n/g, '\n').split('\n').map((line) => line.split('\t'));
      pushHistory(sheets);
      setSheets((prev) =>
        prev.map((s, idx) => {
          if (idx !== activeSheetIdx) return s;
          const nextCells = { ...s.cells };
          let maxR = s.rows;
          let maxC = s.cols;
          rowsData.forEach((rowVals, dr) => {
            rowVals.forEach((val, dc) => {
              const rr = selStart.r + dr;
              const cc = selStart.c + dc;
              if (rr >= maxR) maxR = rr + 5;
              if (cc >= maxC) maxC = cc + 3;
              const k = cellKey(rr, cc);
              nextCells[k] = { ...nextCells[k], v: val };
            });
          });
          return { ...s, cells: nextCells, rows: maxR, cols: maxC };
        })
      );
      notify('Pasted clipboard data into grid');
    } catch {
      notify('Press Ctrl+V inside an editing cell to paste');
    }
  }, [activeSheetIdx, pushHistory, selStart, sheets]);

  // Grid keyboard navigation
  const handleGridKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (editingCell) return;
    const mod = e.ctrlKey || e.metaKey;

    if (mod && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      handleUndo();
      return;
    }
    if (mod && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) {
      e.preventDefault();
      handleRedo();
      return;
    }
    if (mod && e.key.toLowerCase() === 'c') {
      e.preventDefault();
      handleCopySelection();
      return;
    }
    if (mod && e.key.toLowerCase() === 'v') {
      e.preventDefault();
      handlePaste();
      return;
    }
    if (mod && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      applyStyleToSelection((s) => ({ ...s, bold: !s.bold }));
      return;
    }
    if (mod && e.key.toLowerCase() === 'i') {
      e.preventDefault();
      applyStyleToSelection((s) => ({ ...s, italic: !s.italic }));
      return;
    }
    if (mod && e.key.toLowerCase() === 'f') {
      e.preventDefault();
      setShowFindModal(true);
      return;
    }

    const move = (dr: number, dc: number) => {
      const nr = Math.max(0, Math.min(sheet.rows - 1, selStart.r + dr));
      const nc = Math.max(0, Math.min(sheet.cols - 1, selStart.c + dc));
      setSelStart({ r: nr, c: nc });
      if (!e.shiftKey) setSelEnd({ r: nr, c: nc });
    };

    if (e.key === 'ArrowUp') { e.preventDefault(); move(-1, 0); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); move(1, 0); return; }
    if (e.key === 'ArrowLeft') { e.preventDefault(); move(0, -1); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); move(0, 1); return; }
    if (e.key === 'Tab') { e.preventDefault(); move(0, e.shiftKey ? -1 : 1); return; }
    if (e.key === 'Enter') {
      e.preventDefault();
      setEditDraft(activeCell?.v ?? '');
      setEditingCell({ r: selStart.r, c: selStart.c });
      return;
    }
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      clearSelectionValues();
      return;
    }

    if (e.key.length === 1 && !mod && !e.altKey) {
      setEditDraft(e.key);
      setEditingCell({ r: selStart.r, c: selStart.c });
    }
  };

  // Row/Col Operations
  const insertRowAt = (at: number) => {
    pushHistory(sheets);
    setSheets((prev) =>
      prev.map((s, idx) => {
        if (idx !== activeSheetIdx) return s;
        const nextCells: Record<string, CellData> = {};
        Object.entries(s.cells).forEach(([k, cell]) => {
          const [r, c] = k.split(',').map(Number);
          nextCells[cellKey(r >= at ? r + 1 : r, c)] = cell;
        });
        return { ...s, rows: s.rows + 1, cells: nextCells };
      })
    );
  };

  const insertColAt = (at: number) => {
    pushHistory(sheets);
    setSheets((prev) =>
      prev.map((s, idx) => {
        if (idx !== activeSheetIdx) return s;
        const nextCells: Record<string, CellData> = {};
        Object.entries(s.cells).forEach(([k, cell]) => {
          const [r, c] = k.split(',').map(Number);
          nextCells[cellKey(r, c >= at ? c + 1 : c)] = cell;
        });
        return { ...s, cols: s.cols + 1, cells: nextCells };
      })
    );
  };

  const sortActiveColumn = (asc: boolean) => {
    pushHistory(sheets);
    const sortCol = selStart.c;
    const startRow = sheet.freezeHeader ? 1 : 0;
    const rowData: { origR: number; sortKey: string; rowMap: Record<number, CellData> }[] = [];

    let maxUsedR = startRow;
    Object.keys(sheet.cells).forEach((k) => {
      const [r] = k.split(',').map(Number);
      if (r > maxUsedR) maxUsedR = r;
    });

    for (let r = startRow; r <= maxUsedR; r++) {
      const rowMap: Record<number, CellData> = {};
      for (let c = 0; c < sheet.cols; c++) {
        const cell = sheet.cells[cellKey(r, c)];
        if (cell) rowMap[c] = cell;
      }
      const keyVal = evaluatedMap[cellKey(r, sortCol)] ?? '';
      rowData.push({ origR: r, sortKey: keyVal, rowMap });
    }

    rowData.sort((a, b) => {
      if (a.sortKey === '' && b.sortKey !== '') return 1;
      if (a.sortKey !== '' && b.sortKey === '') return -1;
      const na = Number(a.sortKey);
      const nb = Number(b.sortKey);
      if (!isNaN(na) && !isNaN(nb) && a.sortKey !== '' && b.sortKey !== '') {
        return asc ? na - nb : nb - na;
      }
      return asc ? a.sortKey.localeCompare(b.sortKey) : b.sortKey.localeCompare(a.sortKey);
    });

    setSheets((prev) =>
      prev.map((s, idx) => {
        if (idx !== activeSheetIdx) return s;
        const nextCells: Record<string, CellData> = {};
        // Keep frozen header rows intact
        Object.entries(s.cells).forEach(([k, cell]) => {
          const [r] = k.split(',').map(Number);
          if (r < startRow) nextCells[k] = cell;
        });
        rowData.forEach((item, i) => {
          const newR = startRow + i;
          Object.entries(item.rowMap).forEach(([cStr, cell]) => {
            nextCells[cellKey(newR, Number(cStr))] = cell;
          });
        });
        return { ...s, cells: nextCells };
      })
    );
    notify(`Sorted column ${colLabel(sortCol)} ${asc ? 'A → Z' : 'Z → A'}`);
  };

  // File Import & Export
  const handleImportFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      const XLSX = await import('xlsx');
      const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' });
      const loaded: SheetState[] = wb.SheetNames.map((name) => {
        const aoa = XLSX.utils.sheet_to_json<(string | number | boolean | null)[]>(wb.Sheets[name], { header: 1 });
        const cells: Record<string, CellData> = {};
        let maxC = 16;
        aoa.forEach((row, r) => {
          if (row.length > maxC) maxC = row.length + 4;
          row.forEach((val, c) => {
            if (val !== null && val !== undefined && String(val) !== '') {
              cells[cellKey(r, c)] = { v: String(val), s: r === 0 ? { bold: true, bg: '#FFF0E6' } : undefined };
            }
          });
        });
        return {
          name,
          cells,
          rows: Math.max(40, aoa.length + 12),
          cols: maxC,
          colWidths: {},
          freezeHeader: true,
          showGridlines: true,
        };
      });
      pushHistory(sheets);
      setSheets(loaded);
      setActiveSheetIdx(0);
      setTitle(file.name.replace(/\.(xlsx|xls|csv)$/i, ''));
      notify(`Opened "${file.name}" (${loaded.length} sheet(s))`);
    } catch {
      notify('Could not open file. Make sure it is .xlsx, .xls, or .csv.');
    }
  };

  const getFlushedSheets = useCallback((): SheetState[] => {
    if (!editingCell) return sheets;
    const updated = sheets.map((s, idx) => {
      if (idx !== activeSheetIdx) return s;
      const k = cellKey(editingCell.r, editingCell.c);
      const nextCells = { ...s.cells };
      if (editDraft === '' && !nextCells[k]?.s) {
        delete nextCells[k];
      } else {
        nextCells[k] = { ...nextCells[k], v: editDraft };
      }
      return { ...s, cells: nextCells };
    });
    setSheets(updated);
    setEditingCell(null);
    return updated;
  }, [activeSheetIdx, editDraft, editingCell, sheets]);

  const getAoAForSheet = (s: SheetState, formatted = true) => {
    let maxR = 0;
    let maxC = 0;
    Object.keys(s.cells).forEach((k) => {
      const [r, c] = k.split(',').map(Number);
      if (s.cells[k]?.v !== '') {
        if (r > maxR) maxR = r;
        if (c > maxC) maxC = c;
      }
    });
    const out: string[][] = [];
    for (let r = 0; r <= maxR; r++) {
      const row: string[] = [];
      for (let c = 0; c <= maxC; c++) {
        const k = cellKey(r, c);
        const cell = s.cells[k];
        const evaluated = cell?.v ? evaluateFormula(cell.v, s.cells) : '';
        row.push(formatted ? formatCellDisplay(evaluated, cell?.s) : evaluated);
      }
      out.push(row);
    }
    return out;
  };

  const handleExportXlsx = async () => {
    const XLSX = await import('xlsx');
    const latestSheets = getFlushedSheets();
    const wb = XLSX.utils.book_new();
    latestSheets.forEach((s) => {
      const aoa = getAoAForSheet(s, false);
      const ws = XLSX.utils.aoa_to_sheet(aoa);
      // Apply number formatting & column widths from user edits
      let maxC = 0;
      Object.entries(s.cells).forEach(([k, cell]) => {
        const [r, c] = k.split(',').map(Number);
        if (c > maxC) maxC = c;
        const addr = cellAddr(r, c);
        const evaluated = cell.v ? evaluateFormula(cell.v, s.cells) : '';
        const num = Number(String(evaluated).replace(/[,₹$%\s]/g, ''));
        if (evaluated !== '' && !isNaN(num)) {
          ws[addr] = { t: 'n', v: num };
          if (cell.v.startsWith('=')) ws[addr].f = cell.v.slice(1);
          if (cell.s?.format === 'currency-usd') ws[addr].z = '"$"#,##0.00';
          else if (cell.s?.format === 'currency-inr') ws[addr].z = '"₹"#,##0.00';
          else if (cell.s?.format === 'percent') ws[addr].z = '0.0%';
        } else if (cell.v) {
          ws[addr] = { t: 's', v: evaluated };
        }
      });
      ws['!cols'] = Array.from({ length: maxC + 1 }, (_, c) => ({
        wch: Math.round((s.colWidths[c] || 110) / 7),
      }));
      XLSX.utils.book_append_sheet(wb, ws, s.name.slice(0, 31));
    });
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    downloadBytes(buf, `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'sheet'}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    notify('Downloaded .XLSX Excel workbook with your latest edits!');
  };

  const handleExportPdf = async () => {
    try {
      const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
      const latestSheets = getFlushedSheets();
      const targetSheet = latestSheets[Math.min(activeSheetIdx, latestSheets.length - 1)] || latestSheets[0];

      const doc = await PDFDocument.create();
      const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
      const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
      const fontItalic = await doc.embedFont(StandardFonts.HelveticaOblique);
      const fontBoldItalic = await doc.embedFont(StandardFonts.HelveticaBoldOblique);

      const aoa = getAoAForSheet(targetSheet, true);
      const maxCols = Math.max(1, ...aoa.map((r) => r.length));

      const pageW = 842;
      const pageH = 595;
      const margin = 32;
      const colW = (pageW - margin * 2) / maxCols;

      let page = doc.addPage([pageW, pageH]);
      let y = pageH - margin;
      page.drawText(toWinAnsiSafe(`${title} - ${targetSheet.name}`), {
        x: margin,
        y,
        size: 15,
        font: fontBold,
        color: rgb(0.1, 0.06, 0.04),
      });
      y -= 24;

      for (let r = 0; r < aoa.length; r++) {
        // Compute dynamic row height from max font size in the row
        let maxRowFontPt = 9.5;
        for (let c = 0; c < maxCols; c++) {
          const st = targetSheet.cells[cellKey(r, c)]?.s;
          if (st?.fontSize) {
            const pt = Math.max(8, Math.min(20, st.fontSize * 0.72));
            if (pt > maxRowFontPt) maxRowFontPt = pt;
          }
        }
        const rowH = Math.max(22, Math.round(maxRowFontPt + 12));

        if (y - rowH < margin) {
          page = doc.addPage([pageW, pageH]);
          y = pageH - margin;
        }

        for (let c = 0; c < maxCols; c++) {
          const x = margin + c * colW;
          const cell = targetSheet.cells[cellKey(r, c)];
          const st = cell?.s || {};
          const rawDisp = toWinAnsiSafe(String(aoa[r]?.[c] ?? ''));
          const ptSize = st.fontSize ? Math.max(8, Math.min(20, st.fontSize * 0.72)) : 9.5;

          const chosenFont =
            st.bold && st.italic
              ? fontBoldItalic
              : st.bold
              ? fontBold
              : st.italic
              ? fontItalic
              : fontRegular;

          const defaultBg: [number, number, number] = r % 2 === 1 ? [0.99, 0.99, 0.99] : [1, 1, 1];
          const [bgR, bgG, bgB] = hexToRgbTuple(st.bg, defaultBg);
          const [fgR, fgG, fgB] = hexToRgbTuple(st.color, [0.12, 0.14, 0.16]);

          page.drawRectangle({
            x,
            y: y - rowH,
            width: colW,
            height: rowH,
            color: rgb(bgR, bgG, bgB),
            borderColor: st.border ? rgb(0.2, 0.2, 0.2) : rgb(0.82, 0.85, 0.88),
            borderWidth: st.border ? 1.0 : 0.6,
          });

          if (rawDisp) {
            let trimmed = rawDisp;
            while (trimmed.length > 1 && chosenFont.widthOfTextAtSize(trimmed, ptSize) > colW - 8) {
              trimmed = trimmed.slice(0, -1);
            }
            const textW = chosenFont.widthOfTextAtSize(trimmed, ptSize);
            const rawEval = cell?.v ? evaluateFormula(cell.v, targetSheet.cells) : '';
            const isNum = !isNaN(Number(String(rawEval).replace(/[,₹$%\s]/g, ''))) && rawEval !== '';
            const align = st.align || (isNum ? 'right' : 'left');
            const tx =
              align === 'center'
                ? x + (colW - textW) / 2
                : align === 'right'
                ? x + colW - textW - 5
                : x + 5;
            const ty = y - rowH / 2 - ptSize * 0.35;

            page.drawText(trimmed, {
              x: Math.max(x + 3, tx),
              y: ty,
              size: ptSize,
              font: chosenFont,
              color: rgb(fgR, fgG, fgB),
            });

            if (st.strike) {
              page.drawLine({
                start: { x: Math.max(x + 3, tx), y: ty + ptSize * 0.32 },
                end: { x: Math.max(x + 3, tx) + textW, y: ty + ptSize * 0.32 },
                thickness: 0.8,
                color: rgb(fgR, fgG, fgB),
              });
            }
          }
        }
        y -= rowH;
      }
      const out = await doc.save();
      downloadBytes(out, `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'sheet'}.pdf`, 'application/pdf');
      notify('Exported styled PDF with all your edits & formatting!');
    } catch {
      notify('Could not export PDF. Check cell text for unsupported glyphs.');
    }
  };

  // Chart data derived from current sheet numeric columns
  const chartData = useMemo(() => {
    const aoa = getAoAForSheet(sheet);
    return aoa
      .slice(1)
      .map((r) => {
        const label = r[0] || 'Row';
        let num = 0;
        for (let i = r.length - 1; i >= 1; i--) {
          const n = Number(String(r[i]).replace(/[,₹$%\s]/g, ''));
          if (!isNaN(n) && r[i] !== '') {
            num = n;
            break;
          }
        }
        return { label, value: num };
      })
      .filter((d) => d.value !== 0)
      .slice(0, 12);
  }, [sheet]);

  // Column resize drag
  const startResizeCol = (colIdx: number, startX: number) => {
    const startWidth = sheet.colWidths[colIdx] || 110;
    const onMove = (ev: MouseEvent) => {
      const nextW = Math.max(54, Math.min(420, startWidth + (ev.clientX - startX)));
      setSheets((prev) =>
        prev.map((s, idx) => (idx === activeSheetIdx ? { ...s, colWidths: { ...s.colWidths, [colIdx]: nextW } } : s))
      );
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const rangeLabel =
    selStart.r === selEnd.r && selStart.c === selEnd.c
      ? cellAddr(selStart.r, selStart.c)
      : `${cellAddr(bounds.r1, bounds.c1)}:${cellAddr(bounds.r2, bounds.c2)}`;

  return (
    <div
      className={`flex flex-col bg-[#F8FAFD] text-[#1F1F1F] border border-[#DADCE0] overflow-hidden select-none ${
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none'
          : 'rounded-2xl shadow-lg'
      }`}
      onClick={() => {
        if (openMenu) setOpenMenu(null);
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={(e) => handleImportFile(e.target.files?.[0])}
      />

      {/* 1. GOOGLE SHEETS TOP HEADER: Icon + Editable Title + Menu Bar + Actions */}
      <div className="bg-white border-b border-[#E0E3E7] px-3 sm:px-4 pt-2.5 pb-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-[#0F9D58] text-white flex items-center justify-center shrink-0 shadow-2xs">
            <FileSpreadsheet className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="font-semibold text-base sm:text-[17px] text-[#1F1F1F] bg-transparent border border-transparent hover:border-[#DADCE0] focus:border-[#1A73E8] focus:bg-white rounded px-1.5 py-0.5 focus:outline-none max-w-[220px] sm:max-w-[320px]"
              />
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
                Saved Locally • No Account Needed
              </span>
              {statusMsg && (
                <span className="text-[11px] font-semibold text-[#1A73E8] bg-blue-50 px-2.5 py-0.5 rounded-full">
                  {statusMsg}
                </span>
              )}
            </div>

            {/* Menu Bar (File, Edit, View, Insert, Format, Data, Tools) */}
            <div className="flex flex-wrap items-center gap-0.5 text-[13px] text-[#3C4043] relative mt-0.5">
              {[
                { id: 'file', label: 'File' },
                { id: 'edit', label: 'Edit' },
                { id: 'view', label: 'View' },
                { id: 'insert', label: 'Insert' },
                { id: 'format', label: 'Format' },
                { id: 'data', label: 'Data' },
              ].map((m) => (
                <div key={m.id} className="relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => setOpenMenu((cur) => (cur === m.id ? null : m.id))}
                    className={`px-2 py-0.5 rounded hover:bg-[#E8EAED] transition ${
                      openMenu === m.id ? 'bg-[#E8EAED] font-semibold' : ''
                    }`}
                  >
                    {m.label}
                  </button>

                  {openMenu === m.id && (
                    <div className="absolute left-0 top-full mt-1 w-56 bg-white rounded-xl shadow-xl border border-[#DADCE0] py-1.5 z-50 text-xs text-[#1F1F1F]">
                      {m.id === 'file' && (
                        <>
                          <button type="button" onClick={() => { const t = SPREADSHEET_TEMPLATES[0].build(); setTitle(t.title); setSheets(t.sheets); setActiveSheetIdx(0); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">New Blank Sheet</button>
                          <button type="button" onClick={() => { fileInputRef.current?.click(); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">Open .XLSX / .CSV File...</button>
                          <div className="border-t my-1" />
                          <div className="px-3.5 py-1 text-[10px] font-bold uppercase text-slate-400">Templates</div>
                          {SPREADSHEET_TEMPLATES.slice(1).map((tpl) => (
                            <button
                              key={tpl.id}
                              type="button"
                              onClick={() => {
                                const built = tpl.build();
                                pushHistory(sheets);
                                setTitle(built.title);
                                setSheets(built.sheets);
                                setActiveSheetIdx(0);
                                setOpenMenu(null);
                              }}
                              className="w-full text-left px-3.5 py-1.5 hover:bg-[#F1F3F4]"
                            >
                              {tpl.label}
                            </button>
                          ))}
                          <div className="border-t my-1" />
                          <button type="button" onClick={() => { handleExportXlsx(); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4] font-semibold text-emerald-700">Download Microsoft Excel (.xlsx)</button>
                          <button type="button" onClick={() => { handleExportPdf(); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4] font-semibold text-[#D94F1D]">Download Styled PDF (.pdf)</button>
                          <button type="button" onClick={() => { const cur = getFlushedSheets()[activeSheetIdx] || sheet; const csv = getAoAForSheet(cur, true).map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n'); downloadText(csv, `${title}.csv`, 'text/csv'); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">Download CSV (.csv)</button>
                          <button type="button" onClick={() => { const cur = getFlushedSheets()[activeSheetIdx] || sheet; downloadText(JSON.stringify(getAoAForSheet(cur, true), null, 2), `${title}.json`, 'application/json'); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">Download JSON (.json)</button>
                          <button type="button" onClick={() => { window.print(); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">Print Sheet</button>
                        </>
                      )}
                      {m.id === 'edit' && (
                        <>
                          <button type="button" onClick={() => { handleUndo(); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">Undo (Ctrl+Z)</button>
                          <button type="button" onClick={() => { handleRedo(); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">Redo (Ctrl+Y)</button>
                          <div className="border-t my-1" />
                          <button type="button" onClick={() => { handleCopySelection(); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">Copy Selection (Ctrl+C)</button>
                          <button type="button" onClick={() => { handlePaste(); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">Paste (Ctrl+V)</button>
                          <button type="button" onClick={() => { setShowFindModal(true); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">Find &amp; Replace (Ctrl+F)</button>
                          <button type="button" onClick={() => { clearSelectionValues(); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4] text-rose-600">Clear Cell Values (Del)</button>
                        </>
                      )}
                      {m.id === 'view' && (
                        <>
                          <button type="button" onClick={() => { setShowFormulaBar((f) => !f); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">{showFormulaBar ? '✓ ' : ''}Formula Bar</button>
                          <button type="button" onClick={() => { setSheets((prev) => prev.map((s, i) => (i === activeSheetIdx ? { ...s, showGridlines: s.showGridlines === false } : s))); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">{sheet.showGridlines !== false ? '✓ ' : ''}Gridlines</button>
                          <button type="button" onClick={() => { setSheets((prev) => prev.map((s, i) => (i === activeSheetIdx ? { ...s, freezeHeader: !s.freezeHeader } : s))); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">{sheet.freezeHeader ? '✓ ' : ''}Freeze Row 1</button>
                          <button type="button" onClick={() => { setIsFullscreen((f) => !f); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Mode'}</button>
                        </>
                      )}
                      {m.id === 'insert' && (
                        <>
                          <button type="button" onClick={() => { insertRowAt(selStart.r); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">Insert Row Above</button>
                          <button type="button" onClick={() => { insertRowAt(selStart.r + 1); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">Insert Row Below</button>
                          <button type="button" onClick={() => { insertColAt(selStart.c); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">Insert Column Left</button>
                          <button type="button" onClick={() => { insertColAt(selStart.c + 1); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">Insert Column Right</button>
                          <div className="border-t my-1" />
                          <button type="button" onClick={() => { setShowChartPanel(true); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4] font-semibold text-[#0F9D58]">Insert Live Chart</button>
                        </>
                      )}
                      {m.id === 'format' && (
                        <>
                          <button type="button" onClick={() => { applyStyleToSelection((s) => ({ ...s, bold: !s.bold })); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">Bold (Ctrl+B)</button>
                          <button type="button" onClick={() => { applyStyleToSelection((s) => ({ ...s, italic: !s.italic })); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">Italic (Ctrl+I)</button>
                          <button type="button" onClick={() => { applyStyleToSelection((s) => ({ ...s, strike: !s.strike })); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">Strikethrough</button>
                          <div className="border-t my-1" />
                          <button type="button" onClick={() => { applyStyleToSelection((s) => ({ ...s, format: 'currency-inr', decimals: 2 })); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">Currency (₹ INR)</button>
                          <button type="button" onClick={() => { applyStyleToSelection((s) => ({ ...s, format: 'currency-usd', decimals: 2 })); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">Currency ($ USD)</button>
                          <button type="button" onClick={() => { applyStyleToSelection((s) => ({ ...s, format: 'percent', decimals: 1 })); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">Percent (%)</button>
                          <button type="button" onClick={() => { applyStyleToSelection(() => ({})); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4] text-rose-600">Clear Formatting</button>
                        </>
                      )}
                      {m.id === 'data' && (
                        <>
                          <button type="button" onClick={() => { sortActiveColumn(true); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">Sort Column {colLabel(selStart.c)} (A → Z)</button>
                          <button type="button" onClick={() => { sortActiveColumn(false); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">Sort Column {colLabel(selStart.c)} (Z → A)</button>
                          <button type="button" onClick={() => { setSheets((prev) => prev.map((s, i) => (i === activeSheetIdx ? { ...s, rows: s.rows + 15 } : s))); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">Add 15 More Rows</button>
                          <button type="button" onClick={() => { setSheets((prev) => prev.map((s, i) => (i === activeSheetIdx ? { ...s, cols: s.cols + 5 } : s))); setOpenMenu(null); }} className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F4]">Add 5 More Columns</button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F1F3F4] hover:bg-[#E8EAED] text-xs font-semibold text-[#1F1F1F] transition"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Open</span>
          </button>
          <button
            type="button"
            onClick={handleExportXlsx}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0F9D58] hover:bg-[#0B8043] text-white text-xs font-bold shadow-2xs transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>.XLSX</span>
          </button>
          <button
            type="button"
            onClick={handleExportPdf}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-2xs transition ${
              defaultMode === 'pdf' ? 'bg-[#D94F1D] hover:bg-[#C4461A] text-white' : 'bg-[#1A73E8] hover:bg-[#1557B0] text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>

          {!fullViewport && (
            <Link
              href="/excel"
              title="Open Dedicated Full-Page Sheets App (/excel)"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#C2E7FF] hover:bg-[#A8D8F8] text-[#001D35] text-xs font-bold transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Full App</span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => setIsFullscreen((f) => !f)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Workspace'}
            className="p-2 rounded-full hover:bg-[#E8EAED] text-[#3C4043]"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. GOOGLE SHEETS PILL FORMATTING TOOLBAR */}
      <div className="bg-[#EDF2FA] mx-2 sm:mx-3 my-1.5 px-2.5 py-1 rounded-full flex flex-wrap items-center gap-1 text-xs border border-[#DCE3EE]">
        <button type="button" onClick={handleUndo} disabled={history.length === 0} title="Undo" className="p-1.5 rounded-full hover:bg-black/5 disabled:opacity-30">
          <Undo2 className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={handleRedo} disabled={redoStack.length === 0} title="Redo" className="p-1.5 rounded-full hover:bg-black/5 disabled:opacity-30">
          <Redo2 className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={() => window.print()} title="Print" className="p-1.5 rounded-full hover:bg-black/5">
          <Printer className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-[#C7CDD6] mx-1" />

        <select
          value={zoomPct}
          onChange={(e) => setZoomPct(Number(e.target.value))}
          className="bg-transparent font-semibold text-xs px-1 py-0.5 rounded hover:bg-black/5 focus:outline-none"
        >
          <option value={85}>85%</option>
          <option value={100}>100%</option>
          <option value={115}>115%</option>
          <option value={125}>125%</option>
        </select>

        <div className="h-4 w-px bg-[#C7CDD6] mx-1" />

        {/* Currency / Percent / Decimals */}
        <button type="button" onClick={() => applyStyleToSelection((s) => ({ ...s, format: 'currency-inr', decimals: 2 }))} title="Format ₹ Currency" className="px-1.5 py-1 rounded hover:bg-black/5 font-bold">
          ₹
        </button>
        <button type="button" onClick={() => applyStyleToSelection((s) => ({ ...s, format: 'currency-usd', decimals: 2 }))} title="Format $ Currency" className="px-1.5 py-1 rounded hover:bg-black/5 font-bold">
          $
        </button>
        <button type="button" onClick={() => applyStyleToSelection((s) => ({ ...s, format: 'percent', decimals: 1 }))} title="Format Percent" className="px-1.5 py-1 rounded hover:bg-black/5 font-bold">
          %
        </button>
        <button type="button" onClick={() => applyStyleToSelection((s) => ({ ...s, decimals: Math.max(0, (s.decimals ?? 2) - 1) }))} title="Decrease Decimals" className="px-1.5 py-1 rounded hover:bg-black/5 font-mono text-[11px]">
          .0←
        </button>
        <button type="button" onClick={() => applyStyleToSelection((s) => ({ ...s, decimals: Math.min(6, (s.decimals ?? 1) + 1) }))} title="Increase Decimals" className="px-1.5 py-1 rounded hover:bg-black/5 font-mono text-[11px]">
          .00→
        </button>

        <div className="h-4 w-px bg-[#C7CDD6] mx-1" />

        {/* Font Size */}
        <button type="button" onClick={() => applyStyleToSelection((s) => ({ ...s, fontSize: Math.max(9, (s.fontSize ?? 13) - 1) }))} className="px-1.5 py-0.5 rounded hover:bg-black/5 font-bold">
          −
        </button>
        <span className="px-1.5 py-0.5 bg-white border border-[#C7CDD6] rounded text-[11px] font-semibold">
          {activeStyle.fontSize ?? 13}
        </span>
        <button type="button" onClick={() => applyStyleToSelection((s) => ({ ...s, fontSize: Math.min(24, (s.fontSize ?? 13) + 1) }))} className="px-1.5 py-0.5 rounded hover:bg-black/5 font-bold">
          +
        </button>

        <div className="h-4 w-px bg-[#C7CDD6] mx-1" />

        {/* Bold / Italic / Strike / Colors */}
        <button
          type="button"
          onClick={() => applyStyleToSelection((s) => ({ ...s, bold: !s.bold }))}
          className={`p-1.5 rounded hover:bg-black/5 ${activeStyle.bold ? 'bg-[#D3E3FD] text-[#041E49]' : ''}`}
          title="Bold"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => applyStyleToSelection((s) => ({ ...s, italic: !s.italic }))}
          className={`p-1.5 rounded hover:bg-black/5 ${activeStyle.italic ? 'bg-[#D3E3FD] text-[#041E49]' : ''}`}
          title="Italic"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => applyStyleToSelection((s) => ({ ...s, strike: !s.strike }))}
          className={`p-1.5 rounded hover:bg-black/5 ${activeStyle.strike ? 'bg-[#D3E3FD] text-[#041E49]' : ''}`}
          title="Strikethrough"
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </button>

        <label title="Text Color" className="inline-flex items-center px-1.5 py-1 rounded hover:bg-black/5 cursor-pointer">
          <span className="font-bold underline decoration-2" style={{ textDecorationColor: activeStyle.color || '#1F1F1F' }}>A</span>
          <input type="color" value={activeStyle.color || '#1F1F1F'} onChange={(e) => applyStyleToSelection((s) => ({ ...s, color: e.target.value }))} className="w-0 h-0 opacity-0" />
        </label>

        <label title="Fill Color" className="inline-flex items-center gap-1 px-1.5 py-1 rounded hover:bg-black/5 cursor-pointer">
          <span className="w-3.5 h-3.5 rounded-sm border border-slate-400" style={{ backgroundColor: activeStyle.bg || '#FFFFFF' }} />
          <input type="color" value={activeStyle.bg || '#FFF0E6'} onChange={(e) => applyStyleToSelection((s) => ({ ...s, bg: e.target.value }))} className="w-0 h-0 opacity-0" />
        </label>

        <button
          type="button"
          onClick={() => applyStyleToSelection((s) => ({ ...s, border: !s.border }))}
          className={`p-1.5 rounded hover:bg-black/5 ${activeStyle.border ? 'bg-[#D3E3FD]' : ''}`}
          title="Cell Borders"
        >
          <Grid className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-[#C7CDD6] mx-1" />

        {/* Alignment & Wrap */}
        <button type="button" onClick={() => applyStyleToSelection((s) => ({ ...s, align: 'left' }))} className={`p-1.5 rounded hover:bg-black/5 ${activeStyle.align === 'left' ? 'bg-[#D3E3FD]' : ''}`} title="Align Left">
          <AlignLeft className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={() => applyStyleToSelection((s) => ({ ...s, align: 'center' }))} className={`p-1.5 rounded hover:bg-black/5 ${activeStyle.align === 'center' ? 'bg-[#D3E3FD]' : ''}`} title="Align Center">
          <AlignCenter className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={() => applyStyleToSelection((s) => ({ ...s, align: 'right' }))} className={`p-1.5 rounded hover:bg-black/5 ${activeStyle.align === 'right' ? 'bg-[#D3E3FD]' : ''}`} title="Align Right">
          <AlignRight className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={() => applyStyleToSelection((s) => ({ ...s, wrap: !s.wrap }))} className={`p-1.5 rounded hover:bg-black/5 ${activeStyle.wrap ? 'bg-[#D3E3FD]' : ''}`} title="Wrap Text">
          <WrapText className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-[#C7CDD6] mx-1" />

        <button type="button" onClick={() => sortActiveColumn(true)} title="Sort Column A–Z" className="p-1.5 rounded hover:bg-black/5">
          <ArrowUpDown className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={() => setShowFindModal(true)} title="Find & Replace" className="p-1.5 rounded hover:bg-black/5">
          <Search className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => setShowChartPanel((c) => !c)}
          title="Insert / Toggle Chart"
          className={`p-1.5 rounded hover:bg-black/5 ${showChartPanel ? 'bg-[#D3E3FD] text-[#041E49]' : ''}`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
        </button>

        {/* Sigma Functions Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowFnMenu((f) => !f)}
            className="inline-flex items-center gap-0.5 px-2 py-1 rounded hover:bg-black/5 font-bold"
            title="Insert Function"
          >
            <Sigma className="w-3.5 h-3.5" />
            <ChevronDown className="w-3 h-3" />
          </button>
          {showFnMenu && (
            <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-xl border border-[#DADCE0] py-1 z-50">
              {['SUM', 'AVERAGE', 'COUNT', 'MIN', 'MAX', 'PRODUCT', 'MEDIAN', 'IF'].map((fn) => (
                <button
                  key={fn}
                  type="button"
                  onClick={() => insertFunctionInActive(fn)}
                  className="w-full text-left px-3 py-1.5 text-xs font-mono font-bold hover:bg-[#F1F3F4]"
                >
                  ={fn}()
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. FORMULA BAR */}
      {showFormulaBar && (
        <div className="bg-white border-y border-[#E0E3E7] px-3 py-1 flex items-center gap-2 text-xs">
          <div className="min-w-[68px] px-2 py-0.5 rounded bg-[#F1F3F4] font-mono font-bold text-[#1F1F1F] text-center">
            {rangeLabel}
          </div>
          <span className="font-serif italic font-bold text-slate-400 text-sm px-1">fx</span>
          <input
            type="text"
            value={editingCell && editingCell.r === selStart.r && editingCell.c === selStart.c ? editDraft : activeCell?.v ?? ''}
            onChange={(e) => {
              const v = e.target.value;
              if (editingCell) setEditDraft(v);
              else commitCellValue(selStart.r, selStart.c, v);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && editingCell) {
                commitCellValue(editingCell.r, editingCell.c, editDraft);
                setEditingCell(null);
              }
            }}
            placeholder="Enter value or formula e.g. =SUM(E2:E6), =IF(C2>100,&quot;Yes&quot;,&quot;No&quot;)"
            className="flex-1 bg-transparent font-mono text-xs sm:text-[13px] py-0.5 focus:outline-none text-[#1F1F1F]"
          />
        </div>
      )}

      {/* OPTIONAL LIVE CHART PANEL */}
      {showChartPanel && (
        <div className="bg-white border-b border-[#E0E3E7] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F9D58] flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4" />
                Live Data Chart — {sheet.name}
              </span>
              <div className="flex gap-1">
                {(['bar', 'line'] as const).map((ct) => (
                  <button
                    key={ct}
                    type="button"
                    onClick={() => setChartType(ct)}
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                      chartType === ct ? 'bg-[#1A73E8] text-white' : 'bg-[#F1F3F4] text-[#3C4043]'
                    }`}
                  >
                    {ct}
                  </button>
                ))}
              </div>
            </div>
            <button type="button" onClick={() => setShowChartPanel(false)} className="p-1 rounded-full hover:bg-[#F1F3F4]">
              <X className="w-4 h-4" />
            </button>
          </div>

          {chartData.length === 0 ? (
            <p className="text-xs text-slate-500">Add numeric data in columns (e.g. Budget template) to plot charts live.</p>
          ) : chartType === 'bar' ? (
            <div className="flex items-end gap-3 h-40 pt-3 overflow-x-auto">
              {(() => {
                const maxV = Math.max(1, ...chartData.map((d) => Math.abs(d.value)));
                return chartData.map((d, i) => (
                  <div key={i} className="flex flex-col items-center flex-1 min-w-[56px] h-full justify-end">
                    <span className="text-[11px] font-bold text-[#1F1F1F] mb-1">{d.value.toLocaleString()}</span>
                    <div
                      className="w-full max-w-[44px] rounded-t-md bg-[#1A73E8]"
                      style={{ height: `${Math.max(10, (Math.abs(d.value) / maxV) * 100)}%` }}
                    />
                    <span className="text-[10px] font-medium text-slate-600 mt-1 truncate max-w-[74px]">{d.label}</span>
                  </div>
                ));
              })()}
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <svg viewBox="0 0 600 140" className="w-full max-w-3xl h-36">
                {(() => {
                  const maxV = Math.max(1, ...chartData.map((d) => Math.abs(d.value)));
                  const pts = chartData.map((d, i) => {
                    const x = 35 + (i * 530) / Math.max(1, chartData.length - 1);
                    const y = 115 - (Math.abs(d.value) / maxV) * 90;
                    return { x, y, ...d };
                  });
                  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                  return (
                    <>
                      <path d={pathD} fill="none" stroke="#0F9D58" strokeWidth="3" />
                      {pts.map((p, i) => (
                        <g key={i}>
                          <circle cx={p.x} cy={p.y} r="4.5" fill="#1A73E8" />
                          <text x={p.x} y={134} textAnchor="middle" fontSize="9" fill="#5F6368">
                            {p.label.slice(0, 8)}
                          </text>
                        </g>
                      ))}
                    </>
                  );
                })()}
              </svg>
            </div>
          )}
        </div>
      )}

      {/* 4. FULL SPREADSHEET GRID */}
      <div
        ref={gridContainerRef}
        tabIndex={0}
        onKeyDown={handleGridKeyDown}
        className={`overflow-auto bg-white focus:outline-none ${
          isFullscreen ? 'flex-1' : 'h-[480px] sm:h-[560px]'
        }`}
      >
        <div
          style={{
            transform: zoomPct !== 100 ? `scale(${zoomPct / 100})` : undefined,
            transformOrigin: 'top left',
            width: zoomPct !== 100 ? `${(100 / zoomPct) * 100}%` : undefined,
          }}
        >
          <table className="border-collapse table-fixed text-xs">
            <thead className="sticky top-0 z-20 bg-[#F8F9FA]">
              <tr>
                <th className="w-11 min-w-[44px] h-7 border-b border-r border-[#C0C4C9] bg-[#F8F9FA] sticky left-0 z-30" />
                {Array.from({ length: sheet.cols }).map((_, cIdx) => {
                  const colSelected = cIdx >= bounds.c1 && cIdx <= bounds.c2;
                  const w = sheet.colWidths[cIdx] || 110;
                  return (
                    <th
                      key={cIdx}
                      style={{ width: w, minWidth: w }}
                      onClick={() => {
                        setSelStart({ r: 0, c: cIdx });
                        setSelEnd({ r: sheet.rows - 1, c: cIdx });
                      }}
                      className={`relative h-7 border-b border-r border-[#C0C4C9] font-medium text-[11px] cursor-pointer ${
                        colSelected ? 'bg-[#D3E3FD] text-[#041E49] font-bold' : 'text-[#444746] hover:bg-[#EDF2FA]'
                      }`}
                    >
                      {colLabel(cIdx)}
                      <div
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          startResizeCol(cIdx, e.clientX);
                        }}
                        className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-[#1A73E8]"
                      />
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: sheet.rows }).map((_, rIdx) => {
                const rowSelected = rIdx >= bounds.r1 && rIdx <= bounds.r2;
                const isFrozenRow = sheet.freezeHeader && rIdx === 0;
                return (
                  <tr
                    key={rIdx}
                    className={isFrozenRow ? 'sticky top-7 z-10 shadow-2xs' : ''}
                  >
                    <td
                      onClick={() => {
                        setSelStart({ r: rIdx, c: 0 });
                        setSelEnd({ r: rIdx, c: sheet.cols - 1 });
                      }}
                      className={`w-11 min-w-[44px] h-7 border-b border-r border-[#C0C4C9] text-center text-[11px] sticky left-0 z-10 cursor-pointer ${
                        rowSelected ? 'bg-[#D3E3FD] text-[#041E49] font-bold' : 'bg-[#F8F9FA] text-[#444746] hover:bg-[#EDF2FA]'
                      }`}
                    >
                      {rIdx + 1}
                    </td>

                    {Array.from({ length: sheet.cols }).map((_, cIdx) => {
                      const k = cellKey(rIdx, cIdx);
                      const cell = sheet.cells[k];
                      const style = cell?.s || {};
                      const isPrimary = selStart.r === rIdx && selStart.c === cIdx;
                      const inRange =
                        rIdx >= bounds.r1 && rIdx <= bounds.r2 && cIdx >= bounds.c1 && cIdx <= bounds.c2;
                      const isEditing = editingCell?.r === rIdx && editingCell?.c === cIdx;
                      const rawEval = evaluatedMap[k] ?? '';
                      const display = formatCellDisplay(rawEval, style);
                      const isNum = !isNaN(Number(String(rawEval).replace(/[,₹$%\s]/g, ''))) && rawEval !== '';
                      const align = style.align || (isNum ? 'right' : 'left');

                      return (
                        <td
                          key={cIdx}
                          onMouseDown={(e) => {
                            if (editingCell && (editingCell.r !== rIdx || editingCell.c !== cIdx)) {
                              commitCellValue(editingCell.r, editingCell.c, editDraft);
                              setEditingCell(null);
                            }
                            if (e.shiftKey) {
                              setSelEnd({ r: rIdx, c: cIdx });
                            } else {
                              setSelStart({ r: rIdx, c: cIdx });
                              setSelEnd({ r: rIdx, c: cIdx });
                              setIsSelecting(true);
                            }
                          }}
                          onMouseEnter={() => {
                            if (isSelecting) setSelEnd({ r: rIdx, c: cIdx });
                          }}
                          onDoubleClick={() => {
                            setEditDraft(cell?.v ?? '');
                            setEditingCell({ r: rIdx, c: cIdx });
                          }}
                          style={{
                            backgroundColor: inRange && !isPrimary ? '#E8F0FE' : style.bg || '#FFFFFF',
                            color: style.color || '#1F1F1F',
                            fontSize: style.fontSize ? `${style.fontSize}px` : '13px',
                            borderColor: style.border ? '#1F1F1F' : sheet.showGridlines === false ? 'transparent' : '#E2E3E3',
                          }}
                          className={`relative h-7 px-1.5 border-b border-r transition-none ${
                            isPrimary ? 'outline-2 outline-[#1A73E8] -outline-offset-2 z-10' : ''
                          } ${style.bold ? 'font-bold' : ''} ${style.italic ? 'italic' : ''} ${
                            style.strike ? 'line-through' : ''
                          } ${style.wrap ? 'whitespace-normal' : 'whitespace-nowrap overflow-hidden text-ellipsis'}`}
                        >
                          {isEditing ? (
                            <input
                              ref={editInputRef}
                              type="text"
                              value={editDraft}
                              onChange={(e) => setEditDraft(e.target.value)}
                              onBlur={() => {
                                commitCellValue(rIdx, cIdx, editDraft);
                                setEditingCell(null);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  commitCellValue(rIdx, cIdx, editDraft);
                                  setEditingCell(null);
                                  const nr = Math.min(sheet.rows - 1, rIdx + 1);
                                  setSelStart({ r: nr, c: cIdx });
                                  setSelEnd({ r: nr, c: cIdx });
                                  gridContainerRef.current?.focus();
                                } else if (e.key === 'Tab') {
                                  e.preventDefault();
                                  commitCellValue(rIdx, cIdx, editDraft);
                                  setEditingCell(null);
                                  const nc = Math.min(sheet.cols - 1, cIdx + 1);
                                  setSelStart({ r: rIdx, c: nc });
                                  setSelEnd({ r: rIdx, c: nc });
                                  gridContainerRef.current?.focus();
                                } else if (e.key === 'Escape') {
                                  setEditingCell(null);
                                  gridContainerRef.current?.focus();
                                }
                              }}
                              className="w-full h-full bg-white text-[#1F1F1F] focus:outline-none font-mono text-xs"
                            />
                          ) : (
                            <div style={{ textAlign: align }}>{display}</div>
                          )}

                          {/* Google Sheets bottom-right handle dot */}
                          {isPrimary && !isEditing && (
                            <span className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-[#1A73E8] border border-white pointer-events-none" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. GOOGLE SHEETS BOTTOM TABS & LIVE SELECTION STATS BAR */}
      <div className="bg-[#F0F4F9] border-t border-[#DADCE0] px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => {
              const name = `Sheet${sheets.length + 1}`;
              pushHistory(sheets);
              setSheets((prev) => [
                ...prev,
                { name, cells: {}, rows: 40, cols: 18, colWidths: {}, freezeHeader: false, showGridlines: true },
              ]);
              setActiveSheetIdx(sheets.length);
            }}
            title="Add Sheet"
            className="p-1.5 rounded-full hover:bg-black/5 text-[#444746]"
          >
            <Plus className="w-4 h-4" />
          </button>

          {sheets.map((s, idx) => (
            <div
              key={`${s.name}-${idx}`}
              className={`group inline-flex items-center gap-1.5 px-3 py-1 rounded-t-lg border-b-2 transition cursor-pointer ${
                idx === activeSheetIdx
                  ? 'bg-[#E1E9F7] border-[#0F9D58] text-[#041E49] font-bold'
                  : 'hover:bg-black/5 border-transparent text-[#444746] font-medium'
              }`}
              onClick={() => setActiveSheetIdx(idx)}
              onDoubleClick={() => {
                setRenamingIdx(idx);
                setRenameDraft(s.name);
              }}
            >
              {renamingIdx === idx ? (
                <input
                  type="text"
                  autoFocus
                  value={renameDraft}
                  onChange={(e) => setRenameDraft(e.target.value)}
                  onBlur={() => {
                    if (renameDraft.trim()) {
                      setSheets((prev) => prev.map((sh, i) => (i === idx ? { ...sh, name: renameDraft.trim() } : sh)));
                    }
                    setRenamingIdx(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (renameDraft.trim()) {
                        setSheets((prev) => prev.map((sh, i) => (i === idx ? { ...sh, name: renameDraft.trim() } : sh)));
                      }
                      setRenamingIdx(null);
                    }
                  }}
                  className="w-20 bg-white px-1 rounded text-xs"
                />
              ) : (
                <span>{s.name}</span>
              )}

              {sheets.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    pushHistory(sheets);
                    setSheets((prev) => prev.filter((_, i) => i !== idx));
                    setActiveSheetIdx((cur) => Math.max(0, Math.min(cur, sheets.length - 2)));
                  }}
                  className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-600"
                  title="Delete sheet"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Live Selection Calculations */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-[#444746]">
          <span>Count: {selectionStats.nonEmpty}</span>
          {selectionStats.sum !== null && (
            <div className="flex items-center gap-3 bg-[#D3E3FD] text-[#041E49] px-3 py-0.5 rounded-full font-bold">
              <span>Sum: {selectionStats.sum.toLocaleString()}</span>
              <span>Avg: {selectionStats.avg!.toFixed(2)}</span>
              <span>Min: {selectionStats.min}</span>
              <span>Max: {selectionStats.max}</span>
            </div>
          )}
        </div>
      </div>

      {/* FIND & REPLACE DIALOG */}
      {showFindModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#DADCE0] shadow-2xl p-5 w-full max-w-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-[#1F1F1F]">Find &amp; Replace in Sheet</h4>
              <button type="button" onClick={() => setShowFindModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <input type="text" value={findVal} onChange={(e) => setFindVal(e.target.value)} placeholder="Find..." className="w-full px-3 py-2 rounded-lg border border-[#DADCE0] text-sm" />
            <input type="text" value={replaceVal} onChange={(e) => setReplaceVal(e.target.value)} placeholder="Replace with..." className="w-full px-3 py-2 rounded-lg border border-[#DADCE0] text-sm" />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowFindModal(false)} className="px-4 py-1.5 rounded-full text-xs font-semibold hover:bg-slate-100">Cancel</button>
              <button
                type="button"
                onClick={() => {
                  if (!findVal) return;
                  let count = 0;
                  pushHistory(sheets);
                  setSheets((prev) =>
                    prev.map((s, idx) => {
                      if (idx !== activeSheetIdx) return s;
                      const nextCells: Record<string, CellData> = {};
                      Object.entries(s.cells).forEach(([k, cell]) => {
                        if (cell.v.includes(findVal)) {
                          count++;
                          nextCells[k] = { ...cell, v: cell.v.split(findVal).join(replaceVal) };
                        } else {
                          nextCells[k] = cell;
                        }
                      });
                      return { ...s, cells: nextCells };
                    })
                  );
                  setShowFindModal(false);
                  notify(`Replaced ${count} occurrence(s)`);
                }}
                className="px-5 py-1.5 rounded-full bg-[#1A73E8] text-white text-xs font-bold"
              >
                Replace All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
