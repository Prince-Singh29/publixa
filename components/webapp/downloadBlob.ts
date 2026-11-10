'use client';

export function downloadBytes(bytes: Uint8Array | ArrayBuffer, filename: string, mimeType: string) {
  const blob = new Blob([bytes instanceof Uint8Array ? new Uint8Array(bytes) : bytes], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export function downloadText(text: string, filename: string, mimeType = 'text/plain;charset=utf-8') {
  const blob = new Blob([text], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

/**
 * Sanitizes strings so pdf-lib's StandardFonts (WinAnsi encoding) never throws
 * on Unicode currency signs, arrows, checkmarks, or emojis.
 */
export function toWinAnsiSafe(input: string): string {
  return String(input ?? '')
    .replace(/\u20B9/g, 'Rs.')
    .replace(/[\u2192\u2794]/g, '->')
    .replace(/\u2190/g, '<-')
    .replace(/[\u2713\u2714\u2705]/g, '[OK]')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u2014/g, '--')
    .replace(/\u2013/g, '-')
    .replace(/\u2026/g, '...')
    .replace(/\u2022/g, '*')
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, '');
}

export function hexToRgbTuple(hex: string | undefined, fallback: [number, number, number]): [number, number, number] {
  if (!hex || !hex.startsWith('#')) return fallback;
  const clean = hex.slice(1);
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16) / 255;
    const g = parseInt(clean[1] + clean[1], 16) / 255;
    const b = parseInt(clean[2] + clean[2], 16) / 255;
    return [isNaN(r) ? fallback[0] : r, isNaN(g) ? fallback[1] : g, isNaN(b) ? fallback[2] : b];
  }
  if (clean.length === 6) {
    const r = parseInt(clean.slice(0, 2), 16) / 255;
    const g = parseInt(clean.slice(2, 4), 16) / 255;
    const b = parseInt(clean.slice(4, 6), 16) / 255;
    return [isNaN(r) ? fallback[0] : r, isNaN(g) ? fallback[1] : g, isNaN(b) ? fallback[2] : b];
  }
  return fallback;
}

export function parsePageRanges(rangeStr: string, maxPages: number): number[] {
  const result = new Set<number>();
  const parts = rangeStr.split(',').map((s) => s.trim()).filter(Boolean);
  for (const part of parts) {
    if (part.includes('-')) {
      const [startRaw, endRaw] = part.split('-').map((n) => parseInt(n.trim(), 10));
      if (!isNaN(startRaw) && !isNaN(endRaw)) {
        const start = Math.max(1, Math.min(startRaw, endRaw));
        const end = Math.min(maxPages, Math.max(startRaw, endRaw));
        for (let i = start; i <= end; i++) result.add(i - 1);
      }
    } else {
      const p = parseInt(part, 10);
      if (!isNaN(p) && p >= 1 && p <= maxPages) result.add(p - 1);
    }
  }
  return Array.from(result).sort((a, b) => a - b);
}
