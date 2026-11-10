'use client';

export interface CellStyle {
  bold?: boolean;
  italic?: boolean;
  strike?: boolean;
  color?: string;
  bg?: string;
  align?: 'left' | 'center' | 'right';
  fontSize?: number;
  fontFamily?: string;
  format?: 'auto' | 'currency-inr' | 'currency-usd' | 'percent' | 'number';
  decimals?: number;
  border?: boolean;
  wrap?: boolean;
}

export interface CellData {
  v: string;
  s?: CellStyle;
}

export interface SheetState {
  name: string;
  cells: Record<string, CellData>; // key: "r,c"
  rows: number;
  cols: number;
  colWidths: Record<number, number>;
  freezeHeader?: boolean;
  showGridlines?: boolean;
}

export function colLabel(idx: number): string {
  let label = '';
  let n = idx;
  while (n >= 0) {
    label = String.fromCharCode((n % 26) + 65) + label;
    n = Math.floor(n / 26) - 1;
  }
  return label;
}

export function cellKey(r: number, c: number): string {
  return `${r},${c}`;
}

export function cellAddr(r: number, c: number): string {
  return `${colLabel(c)}${r + 1}`;
}

export function parseCellRef(ref: string): { r: number; c: number } | null {
  const m = ref.trim().toUpperCase().match(/^\$?([A-Z]+)\$?(\d+)$/);
  if (!m) return null;
  let c = 0;
  for (let i = 0; i < m[1].length; i++) {
    c = c * 26 + (m[1].charCodeAt(i) - 64);
  }
  return { r: parseInt(m[2], 10) - 1, c: c - 1 };
}

function splitTopLevelArgs(argStr: string): string[] {
  const args: string[] = [];
  let current = '';
  let depth = 0;
  let inQuotes = false;
  for (let i = 0; i < argStr.length; i++) {
    const ch = argStr[i];
    if (ch === '"') inQuotes = !inQuotes;
    if (!inQuotes) {
      if (ch === '(') depth++;
      else if (ch === ')') depth--;
      else if (ch === ',' && depth === 0) {
        args.push(current.trim());
        current = '';
        continue;
      }
    }
    current += ch;
  }
  if (current.trim() !== '') args.push(current.trim());
  return args;
}

export function evaluateFormula(
  raw: string,
  cells: Record<string, CellData>,
  visited = new Set<string>()
): string {
  const trimmed = String(raw ?? '').trim();
  if (!trimmed.startsWith('=')) return raw;

  const evalRefVal = (r: number, c: number): string => {
    const k = cellKey(r, c);
    if (visited.has(k)) return '0';
    const nextVisited = new Set(visited);
    nextVisited.add(k);
    const val = cells[k]?.v ?? '';
    return evaluateFormula(val, cells, nextVisited);
  };

  const toNumber = (s: string): number => {
    const cleaned = String(s).replace(/[,₹$%\s]/g, '').trim();
    if (cleaned === '') return 0;
    const n = Number(cleaned);
    return isNaN(n) ? 0 : n;
  };

  const collectRangeValues = (rangeArg: string): string[] => {
    const parts = rangeArg.split(':');
    if (parts.length === 2) {
      const a = parseCellRef(parts[0]);
      const b = parseCellRef(parts[1]);
      if (!a || !b) return [];
      const vals: string[] = [];
      for (let r = Math.min(a.r, b.r); r <= Math.max(a.r, b.r); r++) {
        for (let c = Math.min(a.c, b.c); c <= Math.max(a.c, b.c); c++) {
          vals.push(evalRefVal(r, c));
        }
      }
      return vals;
    }
    const single = parseCellRef(rangeArg);
    if (single) return [evalRefVal(single.r, single.c)];
    return [evaluateExpr(rangeArg)];
  };

  const evaluateExpr = (expr: string): string => {
    const e = expr.trim();
    if ((e.startsWith('"') && e.endsWith('"')) || (e.startsWith("'") && e.endsWith("'"))) {
      return e.slice(1, -1);
    }

    // Function call check: FUNC(args)
    const fnMatch = e.match(/^([A-Z0-9_]+)\(([\s\S]*)\)$/i);
    if (fnMatch) {
      const fn = fnMatch[1].toUpperCase();
      const args = splitTopLevelArgs(fnMatch[2]);

      const gatherNums = (): number[] => {
        const out: number[] = [];
        args.forEach((arg) => {
          collectRangeValues(arg).forEach((v) => {
            const clean = String(v).replace(/[,₹$\s]/g, '').trim();
            if (clean !== '' && !isNaN(Number(clean))) {
              out.push(Number(clean));
            }
          });
        });
        return out;
      };

      if (fn === 'SUM') return String(gatherNums().reduce((a, b) => a + b, 0));
      if (fn === 'AVG' || fn === 'AVERAGE') {
        const nums = gatherNums();
        return nums.length ? String(nums.reduce((a, b) => a + b, 0) / nums.length) : '0';
      }
      if (fn === 'COUNT') return String(gatherNums().length);
      if (fn === 'COUNTA') {
        let count = 0;
        args.forEach((arg) => collectRangeValues(arg).forEach((v) => { if (String(v).trim() !== '') count++; }));
        return String(count);
      }
      if (fn === 'MIN') {
        const nums = gatherNums();
        return nums.length ? String(Math.min(...nums)) : '0';
      }
      if (fn === 'MAX') {
        const nums = gatherNums();
        return nums.length ? String(Math.max(...nums)) : '0';
      }
      if (fn === 'PRODUCT') {
        const nums = gatherNums();
        return nums.length ? String(nums.reduce((a, b) => a * b, 1)) : '0';
      }
      if (fn === 'MEDIAN') {
        const nums = gatherNums().sort((a, b) => a - b);
        if (!nums.length) return '0';
        const mid = Math.floor(nums.length / 2);
        return nums.length % 2 !== 0 ? String(nums[mid]) : String((nums[mid - 1] + nums[mid]) / 2);
      }
      if (fn === 'ROUND' && args.length >= 1) {
        const val = toNumber(evaluateExpr(args[0]));
        const dec = args[1] ? Math.max(0, Math.min(8, Math.round(toNumber(evaluateExpr(args[1]))))) : 0;
        return val.toFixed(dec);
      }
      if (fn === 'ABS' && args[0]) return String(Math.abs(toNumber(evaluateExpr(args[0]))));
      if (fn === 'SQRT' && args[0]) return String(Math.sqrt(Math.max(0, toNumber(evaluateExpr(args[0])))));
      if (fn === 'UPPER' && args[0]) return String(evaluateExpr(args[0])).toUpperCase();
      if (fn === 'LOWER' && args[0]) return String(evaluateExpr(args[0])).toLowerCase();
      if (fn === 'LEN' && args[0]) return String(evaluateExpr(args[0]).length);
      if (fn === 'CONCAT') {
        return args.map((a) => evaluateExpr(a)).join('');
      }
      if (fn === 'IF' && args.length >= 2) {
        const condStr = args[0];
        const ops = ['>=', '<=', '<>', '!=', '=', '>', '<'];
        let passed = false;
        let matched = false;
        for (const op of ops) {
          if (condStr.includes(op)) {
            const [lhsRaw, rhsRaw] = condStr.split(op);
            const lhs = evaluateExpr(lhsRaw);
            const rhs = evaluateExpr(rhsRaw);
            const ln = Number(lhs);
            const rn = Number(rhs);
            const bothNum = !isNaN(ln) && !isNaN(rn) && lhs !== '' && rhs !== '';
            if (op === '=' || op === '==') passed = bothNum ? ln === rn : lhs === rhs;
            else if (op === '<>' || op === '!=') passed = bothNum ? ln !== rn : lhs !== rhs;
            else if (op === '>') passed = ln > rn;
            else if (op === '<') passed = ln < rn;
            else if (op === '>=') passed = ln >= rn;
            else if (op === '<=') passed = ln <= rn;
            matched = true;
            break;
          }
        }
        if (!matched) passed = Boolean(toNumber(evaluateExpr(condStr)));
        return evaluateExpr(passed ? args[1] : (args[2] ?? 'FALSE'));
      }
    }

    // Replace nested cell references and arithmetic
    const refOnly = parseCellRef(e);
    if (refOnly) return evalRefVal(refOnly.r, refOnly.c);

    // Replace any cell references inside arithmetic expression
    const replaced = e.replace(/\$?[A-Z]+\$?\d+/gi, (match) => {
      const ref = parseCellRef(match);
      if (!ref) return match;
      return String(toNumber(evalRefVal(ref.r, ref.c)));
    });

    if (/^[0-9+\-*/().\s]+$/.test(replaced)) {
      const res = new Function(`return (${replaced})`)();
      if (typeof res === 'number' && isFinite(res)) {
        return Number(res.toFixed(6)).toString();
      }
    }

    return e;
  };

  try {
    return evaluateExpr(trimmed.slice(1));
  } catch {
    return '#ERROR!';
  }
}

export function formatCellDisplay(value: string, style?: CellStyle): string {
  if (value === '' || value === undefined || value === null) return '';
  if (!style || !style.format || style.format === 'auto') {
    if (style?.decimals !== undefined && !isNaN(Number(value))) {
      return Number(value).toFixed(style.decimals);
    }
    return value;
  }
  const num = Number(String(value).replace(/[,₹$%\s]/g, ''));
  if (isNaN(num)) return value;
  const dec = style.decimals ?? 2;

  if (style.format === 'currency-inr') {
    return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: dec, maximumFractionDigits: dec })}`;
  }
  if (style.format === 'currency-usd') {
    return `$${num.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec })}`;
  }
  if (style.format === 'percent') {
    return `${(num * 100).toFixed(Math.max(0, style.decimals ?? 1))}%`;
  }
  if (style.format === 'number') {
    return num.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  }
  return value;
}

