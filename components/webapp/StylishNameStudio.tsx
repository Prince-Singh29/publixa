'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Copy,
  Check,
  Sparkles,
  Crosshair,
  Crown,
  Heart,
  Shuffle,
  Trash2,
  Sliders,
  Gem,
  Star,
} from 'lucide-react';

interface StylishNameStudioProps {
  mode?: 'gaming' | 'diamond' | 'general';
  appName?: string;
}

// Unicode character mapping helper
function mapChars(text: string, upperStart: number, lowerStart: number, digitStart?: number, exceptions?: Record<string, string>): string {
  return Array.from(text)
    .map((ch) => {
      if (exceptions && exceptions[ch]) return exceptions[ch];
      const code = ch.charCodeAt(0);
      if (code >= 65 && code <= 90) return String.fromCodePoint(upperStart + (code - 65));
      if (code >= 97 && code <= 122) return String.fromCodePoint(lowerStart + (code - 97));
      if (digitStart !== undefined && code >= 48 && code <= 57) return String.fromCodePoint(digitStart + (code - 48));
      return ch;
    })
    .join('');
}

const SMALL_CAPS_MAP: Record<string, string> = {
  a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ғ', g: 'ɢ', h: 'ʜ', i: 'ɪ',
  j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ',
  s: 's', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ',
};

const UPSIDE_DOWN_MAP: Record<string, string> = {
  a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ƃ', h: 'ɥ', i: 'ᴉ',
  j: 'ɾ', k: 'ʞ', l: 'l', m: 'ɯ', n: 'u', o: 'o', p: 'd', q: 'b', r: 'ɹ',
  s: 's', t: 'ʇ', u: 'n', v: 'ʌ', w: 'ʍ', x: 'x', y: 'ʎ', z: 'z',
  A: '∀', B: 'q', C: 'Ɔ', D: 'p', E: 'Ǝ', F: 'Ⅎ', G: 'פ', H: 'H', I: 'I',
  J: 'ſ', K: 'ʞ', L: '˥', M: 'W', N: 'N', O: 'O', P: 'Ԁ', Q: 'Q', R: 'ɹ',
  S: 'S', T: '┴', U: '∩', V: 'Λ', W: 'M', X: 'X', Y: '⅄', Z: 'Z',
  '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6', '0': '0',
};

const FRAKTUR_EXC: Record<string, string> = {
  C: 'ℭ', H: 'ℌ', I: 'ℑ', R: 'ℜ', Z: 'ℨ',
};

const SCRIPT_EXC: Record<string, string> = {
  B: 'ℬ', E: 'ℰ', F: 'ℱ', H: 'ℋ', I: 'ℐ', L: 'ℒ', M: 'ℳ', R: 'ℛ',
  e: 'ℯ', g: 'ℊ', o: 'ℴ',
};

const DOUBLE_STRUCK_EXC: Record<string, string> = {
  C: 'ℂ', H: 'ℍ', N: 'ℕ', P: 'ℙ', Q: 'ℚ', R: 'ℝ', Z: 'ℤ',
};

function toSmallCaps(text: string): string {
  return Array.from(text)
    .map((c) => SMALL_CAPS_MAP[c.toLowerCase()] || c)
    .join('');
}

function toUpsideDown(text: string): string {
  return Array.from(text)
    .reverse()
    .map((c) => UPSIDE_DOWN_MAP[c] || c)
    .join('');
}

function toFullwidth(text: string): string {
  return Array.from(text)
    .map((ch) => {
      const code = ch.charCodeAt(0);
      if (code === 32) return '　';
      if (code >= 33 && code <= 126) return String.fromCodePoint(code + 0xfee0);
      return ch;
    })
    .join('');
}

function toCombining(text: string, mark: string): string {
  return Array.from(text)
    .map((c) => (c === ' ' ? ' ' : c + mark))
    .join('');
}

function toCircled(text: string, dark = false): string {
  const upperBase = dark ? 0x1f150 : 0x24b6;
  const lowerBase = dark ? 0x1f150 : 0x24d0;
  return Array.from(text)
    .map((ch) => {
      const code = ch.charCodeAt(0);
      if (code >= 65 && code <= 90) return String.fromCodePoint(upperBase + (code - 65));
      if (code >= 97 && code <= 122) return String.fromCodePoint(lowerBase + (code - 97));
      return ch;
    })
    .join('');
}

function toSquared(text: string, dark = false): string {
  const base = dark ? 0x1f170 : 0x1f130;
  return Array.from(text)
    .map((ch) => {
      const upper = ch.toUpperCase().charCodeAt(0);
      if (upper >= 65 && upper <= 90) return String.fromCodePoint(base + (upper - 65));
      return ch;
    })
    .join('');
}

interface FontStyle {
  id: string;
  label: string;
  transform: (s: string) => string;
}

const FONT_STYLES: FontStyle[] = [
  { id: 'bold-serif', label: 'Bold Serif', transform: (s) => mapChars(s, 0x1d400, 0x1d41a, 0x1d7ce) },
  { id: 'fraktur-bold', label: 'Gothic Royal', transform: (s) => mapChars(s, 0x1d56c, 0x1d586) },
  { id: 'fraktur', label: 'Classic Gothic', transform: (s) => mapChars(s, 0x1d504, 0x1d51e, undefined, FRAKTUR_EXC) },
  { id: 'script-bold', label: 'Signature Script', transform: (s) => mapChars(s, 0x1d4d0, 0x1d4ea) },
  { id: 'script', label: 'Elegant Cursive', transform: (s) => mapChars(s, 0x1d49c, 0x1d4b6, undefined, SCRIPT_EXC) },
  { id: 'double-struck', label: 'Double Struck', transform: (s) => mapChars(s, 0x1d538, 0x1d552, 0x1d7d8, DOUBLE_STRUCK_EXC) },
  { id: 'sans-bold', label: 'Clean Bold', transform: (s) => mapChars(s, 0x1d5d4, 0x1d5ee, 0x1d7ec) },
  { id: 'sans-bold-italic', label: 'Pro Slanted', transform: (s) => mapChars(s, 0x1d63c, 0x1d656) },
  { id: 'italic-serif', label: 'Classic Italic', transform: (s) => mapChars(s, 0x1d468, 0x1d482) },
  { id: 'monospace', label: 'Cyber Mono', transform: (s) => mapChars(s, 0x1d670, 0x1d68a, 0x1d7f6) },
  { id: 'small-caps', label: 'Esports Small Caps', transform: toSmallCaps },
  { id: 'circled', label: 'Bubble Outline', transform: (s) => toCircled(s, false) },
  { id: 'circled-dark', label: 'Dark Bubble', transform: (s) => toCircled(s, true) },
  { id: 'squared', label: 'Boxed Tiles', transform: (s) => toSquared(s, false) },
  { id: 'squared-dark', label: 'Dark Blocks', transform: (s) => toSquared(s, true) },
  { id: 'fullwidth', label: 'Vaporwave Wide', transform: toFullwidth },
  { id: 'strikethrough', label: 'Slash Through', transform: (s) => toCombining(s, '\u0336') },
  { id: 'underline', label: 'Underlined Pro', transform: (s) => toCombining(s, '\u0332') },
  { id: 'double-underline', label: 'Royal Double Line', transform: (s) => toCombining(s, '\u0333') },
  { id: 'upside-down', label: 'Inverted Flip', transform: toUpsideDown },
  { id: 'winged-king', label: 'Winged Boss', transform: (s) => `꧁༒☬ ${mapChars(s, 0x1d5d4, 0x1d5ee)} ☬༒꧂` },
  { id: 'clan-brackets', label: 'Esports Clan', transform: (s) => `『${mapChars(s, 0x1d56c, 0x1d586)}』` },
  { id: 'sniper-tag', label: 'Headshot Sniper', transform: (s) => `▄︻デ${toSmallCaps(s)}══━一` },
  { id: 'crown-vip', label: 'VIP Crown', transform: (s) => `♛ ${mapChars(s, 0x1d4d0, 0x1d4ea)} ♛` },
];

const SYMBOL_GROUPS: Record<string, string[]> = {
  'Wings & Frames': ['꧁༺', '༻꧂', '꧁༒', '༒꧂', '『', '』', '【', '】', '「', '」', '乡', '么', 'メ', '々', 'ツ', '父'],
  'Weapons & Gaming': ['▄︻デ', '══━一', '⚔️', '☠️', '⚡', '🔥', '🎯', '🛡️', '💣', '🔫', '🏆', '🎮'],
  'Crowns & Stars': ['👑', '♛', '♚', '★', '☆', '✧', '✦', '✪', '❖', '❂', '✨', '💎'],
  'Clan Badges': ['『PRO』', '【VIP】', '❖MVP❖', '⚡ACE⚡', '★FF★', '亗GOD亗', 'ᴮᵒˢˢ', 'ᴷⁱⁿᵍ', 'ᴳᵒᵈ', '⁹⁹⁹'],
};

const RANDOM_GAMER_NAMES = [
  'SHADOW HUNTER',
  'VIPER STRIKE',
  'PHANTOM ACE',
  'APEX SNIPER',
  'BLAZE KING',
  'CYBER WOLF',
  'TOXIC REAPER',
  'NOVA LEGEND',
];

export default function StylishNameStudio({ mode = 'gaming', appName = 'Publixa' }: StylishNameStudioProps) {
  const [activeTab, setActiveTab] = useState<'names' | 'sensitivity' | 'diamond'>(
    'names'
  );
  const [rawName, setRawName] = useState('Publixa Pro');
  const [prefix, setPrefix] = useState('꧁༺ ');
  const [suffix, setSuffix] = useState(' ༻꧂');
  const [selectedFontId, setSelectedFontId] = useState('bold-serif');
  const [symbolTab, setSymbolTab] = useState<string>('Wings & Frames');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Sensitivity state (for Aim Headshot Sensitivity)
  const [ramGb, setRamGb] = useState<'2GB-3GB' | '4GB-6GB' | '8GB-12GB' | '16GB+'>('8GB-12GB');
  const [sens, setSens] = useState({
    general: 96,
    redDot: 92,
    scope2x: 86,
    scope4x: 80,
    sniper: 55,
    freeLook: 72,
    dpi: 480,
  });

  // Diamond estimator state (for FFF Diamond Guide)
  const [diamondsOwned, setDiamondsOwned] = useState(120);
  const [targetBundle, setTargetBundle] = useState(1200);
  const [packPriceInr, setPackPriceInr] = useState(80); // 100 diamonds approx INR 80

  useEffect(() => {
    try {
      const saved = localStorage.getItem('publixa_saved_stylish_names');
      if (saved) setFavorites(JSON.parse(saved));
    } catch {
      // ignore storage access issues
    }
  }, []);

  const saveFavorite = (text: string) => {
    setFavorites((prev) => {
      if (prev.includes(text)) return prev;
      const next = [text, ...prev].slice(0, 15);
      try {
        localStorage.setItem('publixa_saved_stylish_names', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const removeFavorite = (text: string) => {
    setFavorites((prev) => {
      const next = prev.filter((x) => x !== text);
      try {
        localStorage.setItem('publixa_saved_stylish_names', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const copyText = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId((prev) => (prev === id ? null : prev)), 1800);
    } catch {
      // fallback
    }
  };

  const customMasterpiece = useMemo(() => {
    const font = FONT_STYLES.find((f) => f.id === selectedFontId) || FONT_STYLES[0];
    const cleanText = rawName.trim() || 'Player';
    const transformed = font.transform(cleanText);
    return `${prefix}${transformed}${suffix}`;
  }, [rawName, prefix, suffix, selectedFontId]);

  const applyRamPreset = (ram: '2GB-3GB' | '4GB-6GB' | '8GB-12GB' | '16GB+') => {
    setRamGb(ram);
    if (ram === '2GB-3GB') {
      setSens({ general: 100, redDot: 98, scope2x: 92, scope4x: 88, sniper: 64, freeLook: 80, dpi: 411 });
    } else if (ram === '4GB-6GB') {
      setSens({ general: 98, redDot: 94, scope2x: 88, scope4x: 82, sniper: 58, freeLook: 75, dpi: 440 });
    } else if (ram === '8GB-12GB') {
      setSens({ general: 95, redDot: 90, scope2x: 84, scope4x: 78, sniper: 52, freeLook: 70, dpi: 480 });
    } else {
      setSens({ general: 92, redDot: 87, scope2x: 80, scope4x: 74, sniper: 48, freeLook: 65, dpi: 520 });
    }
  };

  const sensCopyString = `Publixa Pro Sensitivity (${ramGb}):\n• General: ${sens.general}\n• Red Dot: ${sens.redDot}\n• 2x Scope: ${sens.scope2x}\n• 4x Scope: ${sens.scope4x}\n• Sniper Scope: ${sens.sniper}\n• Free Look: ${sens.freeLook}\n• Recommended DPI: ${sens.dpi}`;

  return (
    <div className="space-y-6">
      {/* Top Mode Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F0DFD5] pb-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('names')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition ${
              activeTab === 'names'
                ? 'bg-[#D94F1D] text-white shadow-sm'
                : 'bg-[#FFF0E6] text-[#3D2315] hover:bg-[#FFE3D1]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Stylish Name Creator (24+ Styles)</span>
          </button>

          {mode === 'gaming' && (
            <button
              type="button"
              onClick={() => setActiveTab('sensitivity')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition ${
                activeTab === 'sensitivity'
                  ? 'bg-[#D94F1D] text-white shadow-sm'
                  : 'bg-[#FFF0E6] text-[#3D2315] hover:bg-[#FFE3D1]'
              }`}
            >
              <Crosshair className="w-4 h-4" />
              <span>Sensitivity &amp; DPI Lab</span>
            </button>
          )}

          {mode === 'diamond' && (
            <button
              type="button"
              onClick={() => setActiveTab('diamond')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition ${
                activeTab === 'diamond'
                  ? 'bg-[#D94F1D] text-white shadow-sm'
                  : 'bg-[#FFF0E6] text-[#3D2315] hover:bg-[#FFE3D1]'
              }`}
            >
              <Gem className="w-4 h-4" />
              <span>Diamond &amp; Loadout Planner</span>
            </button>
          )}
        </div>

        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
          100% Instant Client-Side Studio
        </span>
      </div>

      {/* TAB 1: STYLISH NAME GENERATOR */}
      {activeTab === 'names' && (
        <div className="space-y-6">
          {/* Custom Name Input & Live Masterpiece Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            <div className="lg:col-span-5 bg-[#FFF9F5] border border-[#F0DFD5] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#8C7A70]">
                  1. Enter Your Name or Clan Tag
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const pick = RANDOM_GAMER_NAMES[Math.floor(Math.random() * RANDOM_GAMER_NAMES.length)];
                    setRawName(pick);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#D94F1D] hover:underline"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Random Idea</span>
                </button>
              </div>
              <input
                type="text"
                value={rawName}
                onChange={(e) => setRawName(e.target.value)}
                placeholder="Type your name here..."
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#E5CEC0] focus:border-[#D94F1D] focus:outline-none text-base font-bold text-[#1A0F0A]"
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#8C7A70] block mb-1">Left Frame / Symbol</label>
                  <input
                    type="text"
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E5CEC0] text-sm font-medium text-[#1A0F0A]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#8C7A70] block mb-1">Right Frame / Symbol</label>
                  <input
                    type="text"
                    value={suffix}
                    onChange={(e) => setSuffix(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E5CEC0] text-sm font-medium text-[#1A0F0A]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setPrefix('');
                    setSuffix('');
                  }}
                  className="text-xs font-semibold text-[#665349] hover:text-[#D94F1D]"
                >
                  Clear Symbols
                </button>
                <span className="text-[11px] text-[#8C7A70]">Works in Free Fire, BGMI, COD, Instagram &amp; Discord</span>
              </div>
            </div>

            {/* Live Custom Masterpiece Output Box */}
            <div className="lg:col-span-7 bg-gradient-to-br from-[#1A0F0A] to-[#3D2315] text-white rounded-2xl p-6 flex flex-col justify-between shadow-lg">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-300 uppercase tracking-wider">
                  <Crown className="w-4 h-4" />
                  Custom Studio Preview
                </span>
                <select
                  value={selectedFontId}
                  onChange={(e) => setSelectedFontId(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-2.5 py-1 text-xs font-semibold text-white focus:outline-none"
                >
                  {FONT_STYLES.slice(0, 20).map((f) => (
                    <option key={f.id} value={f.id} className="text-[#1A0F0A]">
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="my-5 p-4 rounded-xl bg-black/30 border border-white/10 text-center break-all">
                <p className="text-2xl sm:text-3xl font-bold tracking-wide select-all">
                  {customMasterpiece}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => saveFavorite(customMasterpiece)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold transition"
                >
                  <Heart className="w-4 h-4 text-rose-400" />
                  <span>Save to Favorites</span>
                </button>

                <button
                  type="button"
                  onClick={() => copyText(customMasterpiece, 'master')}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#D94F1D] hover:bg-[#C4461A] text-white text-xs sm:text-sm font-bold shadow-md transition"
                >
                  {copiedId === 'master' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedId === 'master' ? 'Copied!' : 'Copy Custom Name'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Symbol Picker */}
          <div className="bg-[#FFF9F5] border border-[#F0DFD5] rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C7A70]">
                2. Tap Any Symbol or Badge to Decorate Left / Right
              </span>
              <div className="flex flex-wrap gap-1.5">
                {Object.keys(SYMBOL_GROUPS).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setSymbolTab(tab)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                      symbolTab === tab
                        ? 'bg-[#1A0F0A] text-white'
                        : 'bg-white border border-[#F0DFD5] text-[#3D2315] hover:border-[#D94F1D]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {SYMBOL_GROUPS[symbolTab].map((sym) => (
                <div key={sym} className="inline-flex items-center bg-white border border-[#F0DFD5] rounded-xl overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setPrefix((p) => p + sym)}
                    title="Add to Left"
                    className="px-2 py-1.5 text-[10px] font-bold text-[#8C7A70] hover:bg-[#FFF0E6] hover:text-[#D94F1D] border-r border-[#F0DFD5]"
                  >
                    +L
                  </button>
                  <button
                    type="button"
                    onClick={() => copyText(sym, `sym-${sym}`)}
                    title="Click to Copy Symbol"
                    className="px-3 py-1.5 text-sm font-bold text-[#1A0F0A] hover:text-[#D94F1D]"
                  >
                    {copiedId === `sym-${sym}` ? '✓' : sym}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSuffix((s) => sym + s)}
                    title="Add to Right"
                    className="px-2 py-1.5 text-[10px] font-bold text-[#8C7A70] hover:bg-[#FFF0E6] hover:text-[#D94F1D] border-l border-[#F0DFD5]"
                  >
                    +R
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* All 24 Instant Stylish Variants */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#1A0F0A] flex items-center gap-2">
              <Star className="w-4 h-4 text-[#D94F1D]" />
              <span>All {FONT_STYLES.length} Instant Stylish Fonts for &ldquo;{rawName || 'Player'}&rdquo;</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {FONT_STYLES.map((style) => {
                const value = style.transform(rawName.trim() || 'Publixa Pro');
                const isCopied = copiedId === style.id;
                return (
                  <div
                    key={style.id}
                    className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-white border border-[#F0DFD5] hover:border-[#D94F1D] transition group"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7A70] block">
                        {style.label}
                      </span>
                      <p className="text-base sm:text-lg font-semibold text-[#1A0F0A] truncate mt-0.5 select-all">
                        {value}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => saveFavorite(value)}
                        title="Save favorite"
                        className="p-2 rounded-lg text-[#8C7A70] hover:text-rose-500 hover:bg-rose-50 transition"
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => copyText(value, style.id)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                          isCopied
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#FFF0E6] text-[#D94F1D] hover:bg-[#D94F1D] hover:text-white'
                        }`}
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Saved Favorites */}
          {favorites.length > 0 && (
            <div className="bg-[#FFF9F5] border border-[#F0DFD5] rounded-2xl p-4 space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C7A70] block">
                Your Saved Names ({favorites.length})
              </span>
              <div className="flex flex-wrap gap-2">
                {favorites.map((fav) => (
                  <div
                    key={fav}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#F0DFD5] text-sm font-semibold text-[#1A0F0A]"
                  >
                    <button
                      type="button"
                      onClick={() => copyText(fav, `fav-${fav}`)}
                      className="hover:text-[#D94F1D]"
                    >
                      {copiedId === `fav-${fav}` ? '✓ Copied!' : fav}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFavorite(fav)}
                      className="text-[#8C7A70] hover:text-rose-600"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SENSITIVITY CALIBRATOR (For Aim Headshot Sensitivity) */}
      {activeTab === 'sensitivity' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-[#FFF9F5] border border-[#F0DFD5] rounded-2xl p-5 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#D94F1D]" />
                <h4 className="font-bold text-base text-[#1A0F0A]">Device RAM Preset</h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(['2GB-3GB', '4GB-6GB', '8GB-12GB', '16GB+'] as const).map((ram) => (
                  <button
                    key={ram}
                    type="button"
                    onClick={() => applyRamPreset(ram)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                      ramGb === ram ? 'bg-[#D94F1D] text-white' : 'bg-white border border-[#F0DFD5] text-[#3D2315]'
                    }`}
                  >
                    {ram} RAM
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {[
                { key: 'general', label: 'General Sensitivity', max: 100 },
                { key: 'redDot', label: 'Red Dot / Holo', max: 100 },
                { key: 'scope2x', label: '2x Scope', max: 100 },
                { key: 'scope4x', label: '4x Scope', max: 100 },
                { key: 'sniper', label: 'AWM / Sniper Scope', max: 100 },
                { key: 'freeLook', label: 'Free Look Camera', max: 100 },
                { key: 'dpi', label: 'Display DPI Target', max: 800 },
              ].map((item) => {
                const k = item.key as keyof typeof sens;
                return (
                  <div key={item.key} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-[#3D2315]">{item.label}</span>
                      <span className="text-[#D94F1D] font-mono">{sens[k]}</span>
                    </div>
                    <input
                      type="range"
                      min={item.key === 'dpi' ? 320 : 1}
                      max={item.max}
                      value={sens[k]}
                      onChange={(e) => setSens((prev) => ({ ...prev, [k]: Number(e.target.value) }))}
                      className="w-full accent-[#D94F1D]"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#1A0F0A] text-white rounded-2xl p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-300">
                Generated Pro Config ({appName})
              </span>
              <h4 className="text-xl font-bold">Headshot Recoil Profile</h4>
              <pre className="mt-3 p-4 rounded-xl bg-white/10 text-xs sm:text-sm font-mono whitespace-pre-wrap leading-relaxed text-orange-100">
                {sensCopyString}
              </pre>
            </div>

            <button
              type="button"
              onClick={() => copyText(sensCopyString, 'sens')}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-[#D94F1D] hover:bg-[#C4461A] font-bold text-sm transition"
            >
              {copiedId === 'sens' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedId === 'sens' ? 'Config Copied!' : 'Copy Sensitivity Settings'}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: DIAMOND PLANNER (For FFF Diamond Guide) */}
      {activeTab === 'diamond' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#FFF9F5] border border-[#F0DFD5] rounded-2xl p-5 space-y-4">
            <h4 className="font-bold text-base text-[#1A0F0A] flex items-center gap-2">
              <Gem className="w-4 h-4 text-[#D94F1D]" />
              <span>Diamond &amp; Budget Planner</span>
            </h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#665349] block mb-1">Current Diamonds</label>
                <input
                  type="number"
                  min={0}
                  value={diamondsOwned}
                  onChange={(e) => setDiamondsOwned(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5CEC0] text-sm font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#665349] block mb-1">Target Bundle / Evo Upgrade Cost</label>
                <input
                  type="number"
                  min={0}
                  value={targetBundle}
                  onChange={(e) => setTargetBundle(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5CEC0] text-sm font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#665349] block mb-1">Avg Cost per 100 Diamonds (INR)</label>
                <input
                  type="number"
                  min={1}
                  value={packPriceInr}
                  onChange={(e) => setPackPriceInr(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5CEC0] text-sm font-bold"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#F0DFD5] rounded-2xl p-6 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#D94F1D]">Calculation Summary</span>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#FFF9F5] border border-[#F0DFD5]">
                  <span className="text-xs text-[#665349] block">Diamonds Needed</span>
                  <span className="text-2xl font-extrabold text-[#1A0F0A]">
                    {Math.max(0, targetBundle - diamondsOwned)}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-[#FFF9F5] border border-[#F0DFD5]">
                  <span className="text-xs text-[#665349] block">Estimated Budget</span>
                  <span className="text-2xl font-extrabold text-[#D94F1D]">
                    ₹{Math.ceil((Math.max(0, targetBundle - diamondsOwned) / 100) * packPriceInr)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <p className="font-bold">Official Guide Tip:</p>
              <p>Weekly/Monthly memberships provide up to 2.5x better value per diamond than direct top-ups.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
