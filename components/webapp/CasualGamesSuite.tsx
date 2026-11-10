'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  RotateCcw,
  Shuffle,
  Lightbulb,
  Undo2,
  Trophy,
  Music,
  Volume2,
  Play,
} from 'lucide-react';

// ============================================================================
// 1. WORD CONNECT GAME (word-search-and-connect-game)
// ============================================================================
const WORD_LEVELS = [
  { letters: ['S', 'T', 'A', 'R'], words: ['STAR', 'ARTS', 'RATS', 'RAT', 'ART', 'TAR', 'SAT'] },
  { letters: ['P', 'L', 'A', 'N', 'E'], words: ['PLANE', 'PANEL', 'PLAN', 'LANE', 'LEAN', 'PALE', 'PAN'] },
  { letters: ['F', 'L', 'A', 'M', 'E'], words: ['FLAME', 'FAME', 'LAME', 'LEAF', 'MEAL', 'MALE', 'ALE'] },
];

export function WordConnectGame() {
  const [lvl, setLvl] = useState(0);
  const current = WORD_LEVELS[lvl];
  const [wheelLetters, setWheelLetters] = useState<string[]>(current.letters);
  const [pickedIndices, setPickedIndices] = useState<number[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('Tap letters to form words!');

  const loadLevel = (idx: number) => {
    setLvl(idx);
    setWheelLetters([...WORD_LEVELS[idx].letters]);
    setPickedIndices([]);
    setFoundWords([]);
    setFeedback('Tap letters to form words!');
  };

  const formedWord = pickedIndices.map((i) => wheelLetters[i]).join('');

  const handleSubmit = () => {
    if (!formedWord) return;
    if (foundWords.includes(formedWord)) {
      setFeedback(`Already found "${formedWord}"!`);
    } else if (current.words.includes(formedWord)) {
      const next = [...foundWords, formedWord];
      setFoundWords(next);
      setFeedback(next.length === current.words.length ? 'Level Complete! Awesome!' : `Nice! +10 pts for "${formedWord}"`);
    } else {
      setFeedback(`"${formedWord}" is not on this board.`);
    }
    setPickedIndices([]);
  };

  const handleHint = () => {
    const remaining = current.words.find((w) => !foundWords.includes(w));
    if (remaining) {
      setFeedback(`Hint: Look for a ${remaining.length}-letter word starting with "${remaining[0]}"`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-6 bg-[#FFF9F5] border border-[#F0DFD5] rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#D94F1D]">
            Level {lvl + 1} / {WORD_LEVELS.length}
          </span>
          <span className="text-xs font-bold text-[#1A0F0A]">
            Found: {foundWords.length} / {current.words.length}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {current.words.map((word) => {
            const solved = foundWords.includes(word);
            return (
              <div
                key={word}
                className={`px-3 py-2 rounded-xl border text-center font-mono font-bold text-sm tracking-widest ${
                  solved ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-[#8C7A70] border-[#E5CEC0]'
                }`}
              >
                {solved ? word : word.replace(/./g, '• ')}
              </div>
            );
          })}
        </div>

        <p className="text-xs font-semibold text-[#D94F1D]">{feedback}</p>
      </div>

      <div className="lg:col-span-6 bg-[#1A0F0A] text-white rounded-2xl p-6 flex flex-col items-center space-y-5">
        <div className="w-full py-3 px-4 rounded-xl bg-white/10 text-center font-mono text-2xl font-extrabold tracking-[0.25em] min-h-[52px]">
          {formedWord || '____'}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {wheelLetters.map((ch, idx) => {
            const used = pickedIndices.includes(idx);
            return (
              <button
                key={`${ch}-${idx}`}
                type="button"
                disabled={used}
                onClick={() => setPickedIndices((p) => [...p, idx])}
                className={`w-14 h-14 rounded-full font-extrabold text-xl transition transform-gpu ${
                  used
                    ? 'bg-[#D94F1D] text-white scale-95 opacity-60'
                    : 'bg-white text-[#1A0F0A] hover:scale-105 shadow-md'
                }`}
              >
                {ch}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap justify-center gap-2.5 w-full">
          <button type="button" onClick={handleSubmit} className="px-6 py-2.5 rounded-full bg-[#D94F1D] hover:bg-[#C4461A] font-bold text-xs">
            Submit Word
          </button>
          <button type="button" onClick={() => setPickedIndices([])} className="px-4 py-2.5 rounded-full bg-white/15 text-xs font-bold">
            Clear
          </button>
          <button
            type="button"
            onClick={() => {
              setPickedIndices([]);
              setWheelLetters((prev) => [...prev].sort(() => Math.random() - 0.5));
            }}
            className="p-2.5 rounded-full bg-white/15"
            title="Shuffle"
          >
            <Shuffle className="w-4 h-4" />
          </button>
          <button type="button" onClick={handleHint} className="p-2.5 rounded-full bg-white/15" title="Hint">
            <Lightbulb className="w-4 h-4 text-amber-300" />
          </button>
        </div>

        {foundWords.length === current.words.length && (
          <button
            type="button"
            onClick={() => loadLevel((lvl + 1) % WORD_LEVELS.length)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-600 font-bold text-xs"
          >
            <Trophy className="w-4 h-4" />
            <span>Next Level</span>
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 2. LIQUID COLOR SORT GAME (liquid-color-sort)
// ============================================================================
const COLOR_HEX: Record<string, string> = {
  R: '#EF4444',
  B: '#3B82F6',
  G: '#10B981',
  Y: '#F59E0B',
  P: '#8B5CF6',
};

const LIQUID_LEVELS: string[][][] = [
  [['R', 'B', 'R', 'B'], ['B', 'R', 'B', 'R'], []],
  [['R', 'G', 'B', 'G'], ['B', 'R', 'G', 'R'], ['G', 'B', 'R', 'B'], [], []],
  [['Y', 'P', 'R', 'B'], ['B', 'Y', 'P', 'R'], ['R', 'B', 'Y', 'P'], ['P', 'R', 'B', 'Y'], [], []],
];

export function LiquidColorSortGame() {
  const [lvl, setLvl] = useState(0);
  const [tubes, setTubes] = useState<string[][]>(() => LIQUID_LEVELS[0].map((t) => [...t]));
  const [history, setHistory] = useState<string[][][]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  const loadLevel = (idx: number) => {
    setLvl(idx);
    setTubes(LIQUID_LEVELS[idx].map((t) => [...t]));
    setHistory([]);
    setSelected(null);
  };

  const isSolved = tubes.every((t) => t.length === 0 || (t.length === 4 && t.every((c) => c === t[0])));

  const handleTubeClick = (idx: number) => {
    if (isSolved) return;
    if (selected === null) {
      if (tubes[idx].length > 0) setSelected(idx);
      return;
    }
    if (selected === idx) {
      setSelected(null);
      return;
    }

    const src = tubes[selected];
    const dst = tubes[idx];
    const topSrc = src[src.length - 1];
    const topDst = dst[dst.length - 1];

    if (dst.length < 4 && (dst.length === 0 || topDst === topSrc)) {
      setHistory((h) => [...h, tubes.map((t) => [...t])]);
      const next = tubes.map((t) => [...t]);
      while (
        next[selected].length > 0 &&
        next[idx].length < 4 &&
        next[selected][next[selected].length - 1] === topSrc
      ) {
        next[idx].push(next[selected].pop()!);
      }
      setTubes(next);
    }
    setSelected(null);
  };

  return (
    <div className="bg-[#FFF9F5] border border-[#F0DFD5] rounded-2xl p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="font-bold text-sm text-[#1A0F0A]">
          Level {lvl + 1} / {LIQUID_LEVELS.length} — Click a tube to pour matching top liquid!
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={history.length === 0}
            onClick={() => {
              const prev = history[history.length - 1];
              setTubes(prev);
              setHistory((h) => h.slice(0, -1));
              setSelected(null);
            }}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-white border border-[#E5CEC0] text-xs font-bold disabled:opacity-40"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Undo</span>
          </button>
          <button
            type="button"
            onClick={() => loadLevel(lvl)}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-white border border-[#E5CEC0] text-xs font-bold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-end justify-center gap-5 py-6">
        {tubes.map((tube, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleTubeClick(idx)}
            className={`w-14 h-44 rounded-b-3xl rounded-t-lg border-2 bg-white p-1.5 flex flex-col-reverse gap-1 transition transform-gpu ${
              selected === idx ? 'border-[#D94F1D] -translate-y-3 shadow-lg' : 'border-[#C9B3A6] hover:border-[#D94F1D]'
            }`}
          >
            {tube.map((colorCode, cIdx) => (
              <div
                key={cIdx}
                className="w-full h-9 rounded-md transition-all"
                style={{ backgroundColor: COLOR_HEX[colorCode] || '#999' }}
              />
            ))}
          </button>
        ))}
      </div>

      {isSolved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
          <span className="font-bold text-sm text-emerald-900">Puzzle Solved! All colors sorted cleanly!</span>
          <button
            type="button"
            onClick={() => loadLevel((lvl + 1) % LIQUID_LEVELS.length)}
            className="px-5 py-2 rounded-full bg-emerald-600 text-white text-xs font-bold"
          >
            Next Level
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 3. ARROW ESCAPE PUZZLE (arrows-escape-puzzle / arrow-puzzle-challenge)
// ============================================================================
type Dir = 'U' | 'D' | 'L' | 'R';
interface ArrowCell {
  id: number;
  r: number;
  c: number;
  dir: Dir;
}

const ARROW_LEVELS: { size: number; arrows: ArrowCell[] }[] = [
  {
    size: 4,
    arrows: [
      { id: 1, r: 0, c: 1, dir: 'U' },
      { id: 2, r: 1, c: 1, dir: 'L' },
      { id: 3, r: 1, c: 2, dir: 'R' },
      { id: 4, r: 2, c: 1, dir: 'D' },
      { id: 5, r: 2, c: 2, dir: 'U' },
      { id: 6, r: 3, c: 2, dir: 'R' },
    ],
  },
  {
    size: 4,
    arrows: [
      { id: 1, r: 0, c: 0, dir: 'R' },
      { id: 2, r: 0, c: 2, dir: 'U' },
      { id: 3, r: 1, c: 2, dir: 'R' },
      { id: 4, r: 1, c: 3, dir: 'D' },
      { id: 5, r: 2, c: 0, dir: 'L' },
      { id: 6, r: 2, c: 2, dir: 'U' },
      { id: 7, r: 3, c: 1, dir: 'D' },
      { id: 8, r: 3, c: 3, dir: 'R' },
    ],
  },
];

const DIR_SYMBOL: Record<Dir, string> = { U: '↑', D: '↓', L: '←', R: '→' };

export function ArrowEscapeGame() {
  const [lvl, setLvl] = useState(0);
  const [arrows, setArrows] = useState<ArrowCell[]>(() => [...ARROW_LEVELS[0].arrows]);
  const [blockedId, setBlockedId] = useState<number | null>(null);
  const size = ARROW_LEVELS[lvl].size;

  const canEscape = (a: ArrowCell): boolean => {
    const dr = a.dir === 'U' ? -1 : a.dir === 'D' ? 1 : 0;
    const dc = a.dir === 'L' ? -1 : a.dir === 'R' ? 1 : 0;
    let r = a.r + dr;
    let c = a.c + dc;
    while (r >= 0 && r < size && c >= 0 && c < size) {
      if (arrows.some((other) => other.r === r && other.c === c)) return false;
      r += dr;
      c += dc;
    }
    return true;
  };

  const handleClick = (a: ArrowCell) => {
    if (canEscape(a)) {
      setArrows((prev) => prev.filter((x) => x.id !== a.id));
    } else {
      setBlockedId(a.id);
      setTimeout(() => setBlockedId(null), 400);
    }
  };

  return (
    <div className="bg-[#FFF9F5] border border-[#F0DFD5] rounded-2xl p-6 flex flex-col items-center space-y-5">
      <div className="w-full flex items-center justify-between">
        <span className="font-bold text-sm text-[#1A0F0A]">
          Level {lvl + 1}: Click arrows with a clear path to slide them off the grid!
        </span>
        <button
          type="button"
          onClick={() => setArrows([...ARROW_LEVELS[lvl].arrows])}
          className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-white border border-[#E5CEC0] text-xs font-bold"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      <div className="grid gap-2.5 bg-white p-4 rounded-2xl border border-[#E5CEC0] shadow-sm" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>
        {Array.from({ length: size * size }).map((_, idx) => {
          const r = Math.floor(idx / size);
          const c = idx % size;
          const arrow = arrows.find((a) => a.r === r && a.c === c);
          if (!arrow) {
            return <div key={idx} className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#FFF9F5] border border-dashed border-[#F0DFD5]" />;
          }
          const isBlocked = blockedId === arrow.id;
          return (
            <button
              key={arrow.id}
              type="button"
              onClick={() => handleClick(arrow)}
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl font-extrabold text-2xl transition transform-gpu shadow-sm ${
                isBlocked ? 'bg-rose-600 text-white scale-95' : 'bg-[#D94F1D] hover:bg-[#C4461A] text-white hover:scale-105'
              }`}
            >
              {DIR_SYMBOL[arrow.dir]}
            </button>
          );
        })}
      </div>

      {arrows.length === 0 && (
        <button
          type="button"
          onClick={() => {
            const next = (lvl + 1) % ARROW_LEVELS.length;
            setLvl(next);
            setArrows([...ARROW_LEVELS[next].arrows]);
          }}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-600 text-white font-bold text-xs"
        >
          <Trophy className="w-4 h-4" />
          <span>Board Cleared! Next Level</span>
        </button>
      )}
    </div>
  );
}

// ============================================================================
// 4. BUBBLE SHOOTER CANVAS GAME (bubble-shooter-pop-puzzle)
// ============================================================================
const BUBBLE_COLORS = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#A855F7'];

export function BubbleShooterGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);

  const stateRef = useRef<{
    grid: (string | null)[][];
    shooterColor: string;
    nextColor: string;
    aimAngle: number;
    bullet: { x: number; y: number; vx: number; vy: number; color: string } | null;
  }>({
    grid: [],
    shooterColor: BUBBLE_COLORS[0],
    nextColor: BUBBLE_COLORS[1],
    aimAngle: -Math.PI / 2,
    bullet: null,
  });

  const initGrid = useCallback(() => {
    const rows = 5;
    const cols = 10;
    const g: (string | null)[][] = [];
    for (let r = 0; r < 10; r++) {
      const row: (string | null)[] = [];
      for (let c = 0; c < cols; c++) {
        row.push(r < rows ? BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)] : null);
      }
      g.push(row);
    }
    stateRef.current.grid = g;
    stateRef.current.shooterColor = BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];
    stateRef.current.nextColor = BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];
    stateRef.current.bullet = null;
    setScore(0);
    setStarted(true);
  }, []);

  useEffect(() => {
    initGrid();
  }, [initGrid]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let rafId = 0;
    const R = 17;
    const cols = 10;

    const popCluster = (startR: number, startC: number, color: string) => {
      const g = stateRef.current.grid;
      const visited = new Set<string>();
      const queue: [number, number][] = [[startR, startC]];
      const cluster: [number, number][] = [];

      while (queue.length > 0) {
        const [r, c] = queue.shift()!;
        const key = `${r},${c}`;
        if (visited.has(key)) continue;
        visited.add(key);
        if (r < 0 || r >= g.length || c < 0 || c >= cols || g[r][c] !== color) continue;
        cluster.push([r, c]);
        queue.push([r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]);
      }

      if (cluster.length >= 3) {
        cluster.forEach(([r, c]) => {
          g[r][c] = null;
        });
        setScore((s) => s + cluster.length * 15);
      }
    };

    const tick = () => {
      const s = stateRef.current;
      ctx.fillStyle = '#1A0F0A';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid bubbles
      for (let r = 0; r < s.grid.length; r++) {
        for (let c = 0; c < cols; c++) {
          const color = s.grid[r][c];
          if (!color) continue;
          const x = 26 + c * (R * 2 + 2);
          const y = 24 + r * (R * 2);
          ctx.beginPath();
          ctx.arc(x, y, R, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,0.35)';
          ctx.stroke();
        }
      }

      // Update bullet
      if (s.bullet) {
        s.bullet.x += s.bullet.vx;
        s.bullet.y += s.bullet.vy;
        if (s.bullet.x < R || s.bullet.x > canvas.width - R) s.bullet.vx *= -1;

        let snapped = false;
        if (s.bullet.y <= R + 10) snapped = true;
        if (!snapped) {
          outer: for (let r = 0; r < s.grid.length; r++) {
            for (let c = 0; c < cols; c++) {
              if (!s.grid[r][c]) continue;
              const bx = 26 + c * (R * 2 + 2);
              const by = 24 + r * (R * 2);
              if (Math.hypot(s.bullet.x - bx, s.bullet.y - by) < R * 1.9) {
                snapped = true;
                break outer;
              }
            }
          }
        }

        if (snapped) {
          const cr = Math.max(0, Math.min(9, Math.round((s.bullet.y - 24) / (R * 2))));
          const cc = Math.max(0, Math.min(cols - 1, Math.round((s.bullet.x - 26) / (R * 2 + 2))));
          s.grid[cr][cc] = s.bullet.color;
          popCluster(cr, cc, s.bullet.color);
          s.bullet = null;
          s.shooterColor = s.nextColor;
          s.nextColor = BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];
        } else {
          ctx.beginPath();
          ctx.arc(s.bullet.x, s.bullet.y, R, 0, Math.PI * 2);
          ctx.fillStyle = s.bullet.color;
          ctx.fill();
        }
      }

      // Draw shooter aim line
      const sx = canvas.width / 2;
      const sy = canvas.height - 28;
      ctx.beginPath();
      ctx.setLineDash([5, 5]);
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + Math.cos(s.aimAngle) * 110, sy + Math.sin(s.aimAngle) * 110);
      ctx.strokeStyle = 'rgba(255,255,255,0.45)';
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw shooter bubble
      ctx.beginPath();
      ctx.arc(sx, sy, R, 0, Math.PI * 2);
      ctx.fillStyle = s.shooterColor;
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();
      ctx.lineWidth = 1;

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [started]);

  const handleAimMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
    const angle = Math.atan2(y - (canvas.height - 28), x - canvas.width / 2);
    stateRef.current.aimAngle = Math.max(-Math.PI + 0.2, Math.min(-0.2, angle));
  };

  const handleShoot = () => {
    const s = stateRef.current;
    const canvas = canvasRef.current;
    if (!canvas || s.bullet) return;
    const speed = 9;
    s.bullet = {
      x: canvas.width / 2,
      y: canvas.height - 28,
      vx: Math.cos(s.aimAngle) * speed,
      vy: Math.sin(s.aimAngle) * speed,
      color: s.shooterColor,
    };
  };

  return (
    <div className="bg-[#FFF9F5] border border-[#F0DFD5] rounded-2xl p-5 flex flex-col items-center space-y-4">
      <div className="w-full flex items-center justify-between">
        <span className="font-bold text-sm text-[#1A0F0A]">
          Score: <strong className="text-[#D94F1D]">{score}</strong> — Move cursor to aim, click to pop 3+!
        </span>
        <button type="button" onClick={initGrid} className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-[#D94F1D] text-white text-xs font-bold">
          <Play className="w-3.5 h-3.5" />
          <span>New Board</span>
        </button>
      </div>

      <canvas
        ref={canvasRef}
        width={380}
        height={400}
        onMouseMove={handleAimMove}
        onClick={handleShoot}
        className="rounded-2xl border-2 border-[#3D2315] cursor-crosshair max-w-full shadow-lg"
      />
    </div>
  );
}

// ============================================================================
// 5. MUSICAL STUDIO: PIANO, GUITAR & DRUMS (kids-piano-guitar-drums)
// ============================================================================
const PIANO_NOTES = [
  { name: 'C4', freq: 261.63, key: 'A' },
  { name: 'D4', freq: 293.66, key: 'S' },
  { name: 'E4', freq: 329.63, key: 'D' },
  { name: 'F4', freq: 349.23, key: 'F' },
  { name: 'G4', freq: 392.0, key: 'G' },
  { name: 'A4', freq: 440.0, key: 'H' },
  { name: 'B4', freq: 493.88, key: 'J' },
  { name: 'C5', freq: 523.25, key: 'K' },
  { name: 'D5', freq: 587.33, key: 'L' },
];

const GUITAR_CHORDS = [
  { name: 'C Major', freqs: [261.63, 329.63, 392.0, 523.25] },
  { name: 'G Major', freqs: [196.0, 246.94, 293.66, 392.0] },
  { name: 'A Minor', freqs: [220.0, 261.63, 329.63, 440.0] },
  { name: 'F Major', freqs: [174.61, 220.0, 261.63, 349.23] },
];

export function MusicStudioGame() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [lastNote, setLastNote] = useState('Tap any instrument key!');

  const getCtx = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new window.AudioContext();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playTone = useCallback((freq: number, label: string, type: OscillatorType = 'triangle', dur = 0.45) => {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.32, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + dur);
    setLastNote(`Playing: ${label}`);
  }, []);

  const playDrum = (kind: 'kick' | 'snare' | 'hihat' | 'tom') => {
    const ctx = getCtx();
    const t = ctx.currentTime;
    if (kind === 'kick') {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.frequency.setValueAtTime(150, t);
      osc.frequency.exponentialRampToValueAtTime(40, t + 0.25);
      g.gain.setValueAtTime(0.8, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.25);
    } else if (kind === 'tom') {
      playTone(130, 'Floor Tom', 'sine', 0.3);
    } else {
      // Noise burst for snare/hihat
      const bufferSize = ctx.sampleRate * (kind === 'snare' ? 0.18 : 0.06);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.35, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + (kind === 'snare' ? 0.18 : 0.06));
      noise.connect(g);
      g.connect(ctx.destination);
      noise.start(t);
    }
    setLastNote(`Drum: ${kind.toUpperCase()}`);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const match = PIANO_NOTES.find((n) => n.key === e.key.toUpperCase());
      if (match) playTone(match.freq, `Piano ${match.name}`);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [playTone]);

  return (
    <div className="bg-[#FFF9F5] border border-[#F0DFD5] rounded-2xl p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-2 font-bold text-sm text-[#1A0F0A]">
          <Music className="w-4 h-4 text-[#D94F1D]" />
          <span>Interactive Web Piano, Guitar &amp; Drum Kit (Keyboard A–L supported!)</span>
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D94F1D] bg-[#FFF0E6] px-3 py-1 rounded-full">
          <Volume2 className="w-3.5 h-3.5" />
          {lastNote}
        </span>
      </div>

      {/* Piano Keys */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#8C7A70] block mb-2">Piano Keyboard</span>
        <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
          {PIANO_NOTES.map((n) => (
            <button
              key={n.name}
              type="button"
              onClick={() => playTone(n.freq, `Piano ${n.name}`, 'triangle')}
              className="h-28 rounded-b-xl rounded-t-md bg-white hover:bg-[#FFF0E6] active:bg-[#D94F1D] active:text-white border-2 border-[#E5CEC0] shadow-sm flex flex-col items-center justify-end pb-3 font-bold transition"
            >
              <span className="text-sm">{n.name}</span>
              <span className="text-[10px] opacity-60">Key {n.key}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Drum Pads */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#8C7A70] block mb-2">Drum Kit Pads</span>
          <div className="grid grid-cols-2 gap-2.5">
            {([
              { id: 'kick', label: 'Bass Kick', bg: 'bg-[#D94F1D]' },
              { id: 'snare', label: 'Snare Hit', bg: 'bg-[#1A0F0A]' },
              { id: 'hihat', label: 'Hi-Hat', bg: 'bg-amber-600' },
              { id: 'tom', label: 'Floor Tom', bg: 'bg-emerald-700' },
            ] as const).map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => playDrum(d.id)}
                className={`py-4 rounded-xl text-white font-bold text-sm shadow-sm active:scale-95 transition ${d.bg}`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Acoustic Guitar Chords */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#8C7A70] block mb-2">Acoustic Guitar Chords</span>
          <div className="grid grid-cols-2 gap-2.5">
            {GUITAR_CHORDS.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => {
                  c.freqs.forEach((f, idx) => {
                    setTimeout(() => playTone(f, `Guitar ${c.name}`, 'sawtooth', 0.65), idx * 45);
                  });
                }}
                className="py-4 rounded-xl bg-white border border-[#E5CEC0] hover:border-[#D94F1D] font-bold text-sm text-[#1A0F0A] active:scale-95 transition"
              >
                🎸 {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
