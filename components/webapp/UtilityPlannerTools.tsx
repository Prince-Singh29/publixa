'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  QrCode,
  Download,
  Copy,
  Check,
  Mic,
  Volume2,
  Cake,
  CalendarPlus,
  Plus,
  Trash2,
  ShoppingCart,
  Wallet,
  KeyRound,
  ArrowLeftRight,
  Wrench,
  Sparkles,
  Upload,
  Palette,
  Braces,
  Timer,
  HeartPulse,
} from 'lucide-react';
import StylishNameStudio from './StylishNameStudio';
import { downloadText } from './downloadBlob';

// ============================================================================
// 1. QR CODE STUDIO (qr-scanner-generator)
// ============================================================================
export function QrStudioTool() {
  const [qrType, setQrType] = useState<'url' | 'wifi' | 'upi' | 'text'>('url');
  const [urlVal, setUrlVal] = useState('https://publixa.store');
  const [wifiSsid, setWifiSsid] = useState('Publixa_5G');
  const [wifiPass, setWifiPass] = useState('secure1234');
  const [upiId, setUpiId] = useState('merchant@upi');
  const [upiAmount, setUpiAmount] = useState('100');
  const [fgColor, setFgColor] = useState('#1A0F0A');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [scanResult, setScanResult] = useState<string | null>(null);

  const payload = useMemo(() => {
    if (qrType === 'wifi') return `WIFI:T:WPA;S:${wifiSsid};P:${wifiPass};;`;
    if (qrType === 'upi') return `upi://pay?pa=${upiId}&am=${upiAmount}&cu=INR`;
    return urlVal || 'https://publixa.store';
  }, [qrType, urlVal, wifiSsid, wifiPass, upiId, upiAmount]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const QRCode = (await import('qrcode')).default;
        const url = await QRCode.toDataURL(payload, {
          width: 480,
          margin: 2,
          color: { dark: fgColor, light: bgColor },
        });
        if (active) setQrDataUrl(url);
      } catch {
        // ignore
      }
    })();
    return () => {
      active = false;
    };
  }, [payload, fgColor, bgColor]);

  const handleDownloadSvg = async () => {
    const QRCode = (await import('qrcode')).default;
    const svg = await QRCode.toString(payload, {
      type: 'svg',
      color: { dark: fgColor, light: bgColor },
    });
    downloadText(svg, 'publixa-qrcode.svg', 'image/svg+xml');
  };

  const handleDecodeImage = async (file: File | undefined) => {
    if (!file) return;
    setScanResult('Scanning QR image...');
    try {
      const win = window as unknown as { BarcodeDetector?: new (opts: { formats: string[] }) => { detect: (img: ImageBitmap) => Promise<{ rawValue: string }[]> } };
      if (win.BarcodeDetector) {
        const detector = new win.BarcodeDetector({ formats: ['qr_code'] });
        const bmp = await createImageBitmap(file);
        const codes = await detector.detect(bmp);
        if (codes.length > 0) {
          setScanResult(`Decoded QR Content: ${codes[0].rawValue}`);
        } else {
          setScanResult('No QR code detected inside that image.');
        }
      } else {
        setScanResult('QR image loaded. Native BarcodeDetector requires Chrome/Edge/Android WebView; try the Android app for instant live camera scanning.');
      }
    } catch {
      setScanResult('Could not decode image.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7 bg-[#FFF9F5] border border-[#F0DFD5] rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'url', label: 'Website URL' },
            { id: 'wifi', label: 'Wi-Fi Login' },
            { id: 'upi', label: 'UPI Payment' },
            { id: 'text', label: 'Plain Text' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setQrType(t.id as 'url' | 'wifi' | 'upi' | 'text')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold ${
                qrType === t.id ? 'bg-[#D94F1D] text-white' : 'bg-white border border-[#E5CEC0] text-[#3D2315]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {(qrType === 'url' || qrType === 'text') && (
          <div>
            <label className="text-xs font-bold text-[#8C7A70] block mb-1">
              {qrType === 'url' ? 'Destination URL' : 'Text Content'}
            </label>
            <textarea
              rows={3}
              value={urlVal}
              onChange={(e) => setUrlVal(e.target.value)}
              className="w-full p-3 rounded-xl bg-white border border-[#E5CEC0] text-sm font-medium"
            />
          </div>
        )}

        {qrType === 'wifi' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#8C7A70] block mb-1">Wi-Fi Network (SSID)</label>
              <input type="text" value={wifiSsid} onChange={(e) => setWifiSsid(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-white border border-[#E5CEC0] text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-bold text-[#8C7A70] block mb-1">Password</label>
              <input type="text" value={wifiPass} onChange={(e) => setWifiPass(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-white border border-[#E5CEC0] text-sm font-bold" />
            </div>
          </div>
        )}

        {qrType === 'upi' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#8C7A70] block mb-1">UPI VPA ID</label>
              <input type="text" value={upiId} onChange={(e) => setUpiId(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-white border border-[#E5CEC0] text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-bold text-[#8C7A70] block mb-1">Amount (INR)</label>
              <input type="number" value={upiAmount} onChange={(e) => setUpiAmount(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-white border border-[#E5CEC0] text-sm font-bold" />
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-6 pt-1">
          <label className="flex items-center gap-2 text-xs font-bold text-[#3D2315]">
            <span>QR Color:</span>
            <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
          </label>
          <label className="flex items-center gap-2 text-xs font-bold text-[#3D2315]">
            <span>Background:</span>
            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
          </label>
        </div>

        {/* Upload to Scan */}
        <div className="pt-3 border-t border-[#F0DFD5]">
          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E5CEC0] hover:border-[#D94F1D] cursor-pointer text-xs font-bold text-[#3D2315]">
            <Upload className="w-3.5 h-3.5 text-[#D94F1D]" />
            <span>Upload QR Image to Scan / Decode</span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleDecodeImage(e.target.files?.[0])} />
          </label>
          {scanResult && <p className="mt-2 text-xs font-semibold text-[#D94F1D] break-all">{scanResult}</p>}
        </div>
      </div>

      <div className="lg:col-span-5 bg-white border border-[#F0DFD5] rounded-2xl p-6 flex flex-col items-center justify-between space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#8C7A70] flex items-center gap-1.5">
          <QrCode className="w-4 h-4 text-[#D94F1D]" />
          Live QR Preview
        </span>

        {qrDataUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={qrDataUrl} alt="Generated QR Code" className="w-52 h-52 rounded-2xl border border-[#F0DFD5] shadow-sm p-2 bg-white" />
        )}

        <div className="flex flex-wrap gap-2.5 w-full justify-center">
          <a
            href={qrDataUrl}
            download="publixa-qrcode.png"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#D94F1D] hover:bg-[#C4461A] text-white text-xs font-bold shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PNG</span>
          </a>
          <button
            type="button"
            onClick={handleDownloadSvg}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#1A0F0A] hover:bg-[#3D2315] text-white text-xs font-bold shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download SVG</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. SMART VOICE CALCULATOR (smart-voice-calculator)
// ============================================================================
export function VoiceCalculatorTool() {
  const [expr, setExpr] = useState('1250 + 18%');
  const [history, setHistory] = useState<{ exp: string; res: string }[]>([]);
  const [listening, setListening] = useState(false);

  const evalMath = (raw: string): string => {
    try {
      let normalized = raw
        .toLowerCase()
        .replace(/plus/g, '+')
        .replace(/minus/g, '-')
        .replace(/times|into|multiply by|x/g, '*')
        .replace(/divided by|divide/g, '/')
        .replace(/(\d+(?:\.\d+)?)\s*\+\s*(\d+(?:\.\d+)?)%/g, '($1 + ($1 * $2 / 100))')
        .replace(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)%/g, '($1 - ($1 * $2 / 100))')
        .replace(/%/g, '/100')
        .replace(/[^0-9+\-*/().\s]/g, '');
      if (!normalized.trim()) return '0';
      // Safe math-only evaluation via Function after strict whitelist
      const val = new Function(`return (${normalized})`)();
      if (typeof val === 'number' && isFinite(val)) {
        return Number(val.toFixed(6)).toString();
      }
      return 'Error';
    } catch {
      return 'Error';
    }
  };

  const result = useMemo(() => evalMath(expr), [expr]);

  const handleCalculate = () => {
    if (result !== 'Error') {
      setHistory((h) => [{ exp: expr, res: result }, ...h].slice(0, 10));
    }
  };

  const handleVoiceInput = () => {
    const win = window as unknown as {
      SpeechRecognition?: new () => { lang: string; onresult: (e: { results: { [i: number]: { [j: number]: { transcript: string } } } }) => void; onend: () => void; start: () => void };
      webkitSpeechRecognition?: new () => { lang: string; onresult: (e: { results: { [i: number]: { [j: number]: { transcript: string } } } }) => void; onend: () => void; start: () => void };
    };
    const Rec = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!Rec) {
      alert('Speech recognition is supported in Chrome / Edge / Android browsers.');
      return;
    }
    const r = new Rec();
    r.lang = 'en-US';
    setListening(true);
    r.onresult = (e) => {
      const spoken = e.results[0][0].transcript;
      setExpr(spoken);
    };
    r.onend = () => setListening(false);
    r.start();
  };

  const speakResult = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(`Equals ${result}`));
    }
  };

  const keys = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '%', '+'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7 bg-[#1A0F0A] text-white rounded-2xl p-5 sm:p-6 space-y-4 shadow-lg">
        <div className="bg-black/30 border border-white/10 rounded-xl p-4 space-y-2">
          <input
            type="text"
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            placeholder="Type math or e.g. 500 + 18%"
            className="w-full bg-transparent text-right text-lg sm:text-xl font-mono text-orange-200 focus:outline-none"
          />
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={speakResult}
              className="inline-flex items-center gap-1 text-xs font-bold text-orange-300 hover:text-white"
            >
              <Volume2 className="w-4 h-4" />
              <span>Speak</span>
            </button>
            <span className="text-3xl font-extrabold font-mono text-white">= {result}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleVoiceInput}
            className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition ${
              listening ? 'bg-rose-600 animate-pulse' : 'bg-[#D94F1D] hover:bg-[#C4461A]'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>{listening ? 'Listening...' : 'Voice Input'}</span>
          </button>
          <button type="button" onClick={() => setExpr((e) => `${e} + 18%`)} className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold">
            +18% GST
          </button>
          <button type="button" onClick={() => setExpr((e) => `${e} - 10%`)} className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold">
            -10% Off
          </button>
          <button type="button" onClick={() => setExpr('')} className="px-4 py-2.5 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-bold">
            AC
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2.5">
          {keys.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setExpr((p) => (p === '0' ? k : p + k))}
              className="py-3 rounded-xl bg-white/10 hover:bg-white/20 font-bold text-base font-mono transition"
            >
              {k}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleCalculate}
          className="w-full py-3 rounded-xl bg-[#D94F1D] hover:bg-[#C4461A] font-bold text-base shadow-md transition"
        >
          Save to History (=)
        </button>
      </div>

      <div className="lg:col-span-5 bg-[#FFF9F5] border border-[#F0DFD5] rounded-2xl p-5 space-y-3">
        <h4 className="font-bold text-sm text-[#1A0F0A]">Calculation History Tape</h4>
        {history.length === 0 ? (
          <p className="text-xs text-[#8C7A70] py-8 text-center">Press &ldquo;Save to History (=)&rdquo; to log calculations here.</p>
        ) : (
          <div className="space-y-2 max-h-[340px] overflow-y-auto">
            {history.map((h, i) => (
              <div
                key={i}
                onClick={() => setExpr(h.res)}
                className="p-3 rounded-xl bg-white border border-[#F0DFD5] hover:border-[#D94F1D] cursor-pointer flex justify-between items-center"
              >
                <span className="text-xs font-mono text-[#665349]">{h.exp}</span>
                <span className="text-sm font-extrabold font-mono text-[#D94F1D]">= {h.res}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 3. BIRTHDAY REMINDER & AGE CALCULATOR (birthday-reminder)
// ============================================================================
interface BirthdayEntry {
  id: string;
  name: string;
  date: string;
}

export function BirthdayReminderTool() {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('2000-06-15');
  const [list, setList] = useState<BirthdayEntry[]>([
    { id: '1', name: 'Aarav Sharma', date: '1999-11-25' },
    { id: '2', name: 'Priya Patel', date: '2001-03-14' },
  ]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('publixa_birthdays');
      if (saved) setList(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  const calcStats = (dateStr: string) => {
    const birth = new Date(dateStr + 'T00:00:00');
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let age = today.getFullYear() - birth.getFullYear();
    const mDiff = today.getMonth() - birth.getMonth();
    if (mDiff < 0 || (mDiff === 0 && today.getDate() < birth.getDate())) age--;

    const nextBday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < today) nextBday.setFullYear(today.getFullYear() + 1);
    const daysLeft = Math.round((nextBday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return { age: Math.max(0, age), daysLeft, nextYear: nextBday.getFullYear(), turning: Math.max(0, age) + (daysLeft === 0 ? 0 : 1) };
  };

  const liveInfo = useMemo(() => calcStats(dob), [dob]);

  const addEntry = () => {
    if (!name.trim() || !dob) return;
    const next = [{ id: String(Date.now()), name: name.trim(), date: dob }, ...list];
    setList(next);
    setName('');
    try {
      localStorage.setItem('publixa_birthdays', JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const exportIcs = (entry: BirthdayEntry) => {
    const mmdd = entry.date.slice(5).replace('-', '');
    const year = new Date().getFullYear();
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART;VALUE=DATE:${year}${mmdd}`,
      `RRULE:FREQ=YEARLY`,
      `SUMMARY:${entry.name}'s Birthday`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
    downloadText(ics, `${entry.name.toLowerCase().replace(/\s+/g, '-')}-birthday.ics`, 'text/calendar');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 bg-[#FFF9F5] border border-[#F0DFD5] rounded-2xl p-5 space-y-4">
        <h4 className="font-bold text-sm text-[#1A0F0A] flex items-center gap-2">
          <Cake className="w-4 h-4 text-[#D94F1D]" />
          <span>Exact Age &amp; Countdown</span>
        </h4>
        <div>
          <label className="text-xs font-bold text-[#8C7A70] block mb-1">Person&apos;s Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rohan Verma"
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5CEC0] text-sm font-bold"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-[#8C7A70] block mb-1">Date of Birth</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5CEC0] text-sm font-bold"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-white border border-[#F0DFD5]">
            <span className="text-[11px] text-[#8C7A70] block">Current Age</span>
            <span className="text-2xl font-extrabold text-[#1A0F0A]">{liveInfo.age} yrs</span>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-[#F0DFD5]">
            <span className="text-[11px] text-[#8C7A70] block">Next Birthday</span>
            <span className="text-2xl font-extrabold text-[#D94F1D]">
              {liveInfo.daysLeft === 0 ? 'Today!' : `${liveInfo.daysLeft}d`}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={addEntry}
          className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-[#D94F1D] hover:bg-[#C4461A] text-white font-bold text-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Save to Birthday Tracker</span>
        </button>
      </div>

      <div className="lg:col-span-7 bg-white border border-[#F0DFD5] rounded-2xl p-5 space-y-3">
        <h4 className="font-bold text-sm text-[#1A0F0A]">Upcoming Birthdays ({list.length})</h4>
        <div className="space-y-2.5 max-h-[340px] overflow-y-auto">
          {list.map((item) => {
            const info = calcStats(item.date);
            return (
              <div key={item.id} className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-[#FFF9F5] border border-[#F0DFD5]">
                <div>
                  <p className="font-bold text-sm text-[#1A0F0A]">{item.name}</p>
                  <p className="text-xs text-[#665349]">
                    {item.date} • Turning <strong>{info.turning}</strong> in{' '}
                    <span className="text-[#D94F1D] font-bold">{info.daysLeft === 0 ? 'Today!' : `${info.daysLeft} days`}</span>
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => exportIcs(item)}
                    title="Add to Calendar (.ics)"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-[#E5CEC0] hover:border-[#D94F1D] text-xs font-bold"
                  >
                    <CalendarPlus className="w-3.5 h-3.5 text-[#D94F1D]" />
                    <span>.ICS</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const next = list.filter((x) => x.id !== item.id);
                      setList(next);
                      try {
                        localStorage.setItem('publixa_birthdays', JSON.stringify(next));
                      } catch {
                        // ignore
                      }
                    }}
                    className="p-2 rounded-lg text-[#8C7A70] hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 4. EXPENSE CHECKLIST (expense-checklist)
// ============================================================================
interface ExpenseItem {
  id: string;
  title: string;
  category: string;
  amount: number;
  paid: boolean;
}

export function ExpenseChecklistTool() {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Bills');
  const [items, setItems] = useState<ExpenseItem[]>([
    { id: 'e1', title: 'Electricity Bill', category: 'Bills', amount: 1450, paid: true },
    { id: 'e2', title: 'Internet Fiber Plan', category: 'Utilities', amount: 799, paid: false },
    { id: 'e3', title: 'Weekly Groceries', category: 'Food', amount: 1200, paid: false },
  ]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('publixa_expenses');
      if (saved) setItems(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  const persist = (next: ExpenseItem[]) => {
    setItems(next);
    try {
      localStorage.setItem('publixa_expenses', JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const total = items.reduce((a, b) => a + b.amount, 0);
  const paidTotal = items.filter((i) => i.paid).reduce((a, b) => a + b.amount, 0);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#FFF9F5] border border-[#F0DFD5]">
          <span className="text-xs font-bold text-[#8C7A70] block">Total Budgeted</span>
          <span className="text-2xl font-extrabold text-[#1A0F0A]">₹{total.toLocaleString()}</span>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
          <span className="text-xs font-bold text-emerald-700 block">Paid / Cleared</span>
          <span className="text-2xl font-extrabold text-emerald-900">₹{paidTotal.toLocaleString()}</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#FFF0E6] border border-[#FFDFC8]">
          <span className="text-xs font-bold text-[#D94F1D] block">Remaining Due</span>
          <span className="text-2xl font-extrabold text-[#D94F1D]">₹{(total - paidTotal).toLocaleString()}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 bg-[#FFF9F5] border border-[#F0DFD5] rounded-2xl p-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Expense name..."
          className="flex-1 min-w-[160px] px-3.5 py-2.5 rounded-xl bg-white border border-[#E5CEC0] text-sm font-semibold"
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="w-32 px-3.5 py-2.5 rounded-xl bg-white border border-[#E5CEC0] text-sm font-bold"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-3 py-2.5 rounded-xl bg-white border border-[#E5CEC0] text-sm font-semibold">
          <option>Bills</option>
          <option>Utilities</option>
          <option>Food</option>
          <option>Travel</option>
          <option>Shopping</option>
        </select>
        <button
          type="button"
          onClick={() => {
            if (!title.trim() || !amount) return;
            persist([{ id: String(Date.now()), title: title.trim(), category, amount: Number(amount), paid: false }, ...items]);
            setTitle('');
            setAmount('');
          }}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#D94F1D] hover:bg-[#C4461A] text-white text-xs font-bold"
        >
          <Wallet className="w-4 h-4" />
          <span>Add</span>
        </button>
        <button
          type="button"
          onClick={() => {
            const csv = 'Title,Category,Amount,Status\n' + items.map((i) => `"${i.title}","${i.category}",${i.amount},${i.paid ? 'Paid' : 'Pending'}`).join('\n');
            downloadText(csv, 'publixa-expenses.csv', 'text/csv');
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#1A0F0A] text-white text-xs font-bold"
        >
          <Download className="w-3.5 h-3.5" />
          <span>CSV</span>
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-white border border-[#F0DFD5]">
            <label className="flex items-center gap-3 cursor-pointer flex-1">
              <input
                type="checkbox"
                checked={item.paid}
                onChange={() => persist(items.map((x) => (x.id === item.id ? { ...x, paid: !x.paid } : x)))}
                className="w-4 h-4 accent-[#D94F1D]"
              />
              <div className={item.paid ? 'line-through opacity-50' : ''}>
                <p className="font-bold text-sm text-[#1A0F0A]">{item.title}</p>
                <span className="text-[11px] font-semibold text-[#8C7A70]">{item.category}</span>
              </div>
            </label>
            <div className="flex items-center gap-3">
              <span className="font-extrabold text-sm text-[#1A0F0A]">₹{item.amount.toLocaleString()}</span>
              <button type="button" onClick={() => persist(items.filter((x) => x.id !== item.id))} className="text-[#8C7A70] hover:text-rose-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 5. GROCERY CHECKLIST (grocery-checklist)
// ============================================================================
interface GroceryItem {
  id: string;
  name: string;
  qty: string;
  aisle: string;
  done: boolean;
}

export function GroceryChecklistTool() {
  const [name, setName] = useState('');
  const [qty, setQty] = useState('1');
  const [aisle, setAisle] = useState('Produce');
  const [copied, setCopied] = useState(false);
  const [items, setItems] = useState<GroceryItem[]>([
    { id: 'g1', name: 'Fresh Apples & Bananas', qty: '1 kg', aisle: 'Produce', done: false },
    { id: 'g2', name: 'Whole Milk', qty: '2 L', aisle: 'Dairy', done: true },
    { id: 'g3', name: 'Whole Wheat Bread', qty: '1 pack', aisle: 'Bakery', done: false },
  ]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('publixa_grocery');
      if (saved) setItems(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  const persist = (next: GroceryItem[]) => {
    setItems(next);
    try {
      localStorage.setItem('publixa_grocery', JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const doneCount = items.filter((i) => i.done).length;
  const pct = items.length ? Math.round((doneCount / items.length) * 100) : 0;

  return (
    <div className="space-y-5">
      <div className="bg-[#FFF9F5] border border-[#F0DFD5] rounded-2xl p-4 space-y-2">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-[#3D2315]">Cart Progress ({doneCount} / {items.length} items)</span>
          <span className="text-[#D94F1D]">{pct}%</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-[#FFE3D1] overflow-hidden">
          <div className="h-full bg-[#D94F1D] transition-all duration-300" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 bg-[#FFF9F5] border border-[#F0DFD5] rounded-2xl p-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Grocery item..."
          className="flex-1 min-w-[160px] px-3.5 py-2.5 rounded-xl bg-white border border-[#E5CEC0] text-sm font-semibold"
        />
        <input
          type="text"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          placeholder="Qty"
          className="w-24 px-3 py-2.5 rounded-xl bg-white border border-[#E5CEC0] text-sm font-bold"
        />
        <select value={aisle} onChange={(e) => setAisle(e.target.value)} className="px-3 py-2.5 rounded-xl bg-white border border-[#E5CEC0] text-sm font-semibold">
          <option>Produce</option>
          <option>Dairy</option>
          <option>Bakery</option>
          <option>Pantry</option>
          <option>Snacks</option>
        </select>
        <button
          type="button"
          onClick={() => {
            if (!name.trim()) return;
            persist([{ id: String(Date.now()), name: name.trim(), qty: qty || '1', aisle, done: false }, ...items]);
            setName('');
          }}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#D94F1D] hover:bg-[#C4461A] text-white text-xs font-bold"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Add</span>
        </button>
        <button
          type="button"
          onClick={async () => {
            const text = items.map((i) => `${i.done ? '[x]' : '[ ]'} ${i.name} (${i.qty})`).join('\n');
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#1A0F0A] text-white text-xs font-bold"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy List'}</span>
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-white border border-[#F0DFD5]">
            <label className="flex items-center gap-3 cursor-pointer flex-1">
              <input
                type="checkbox"
                checked={item.done}
                onChange={() => persist(items.map((x) => (x.id === item.id ? { ...x, done: !x.done } : x)))}
                className="w-4 h-4 accent-[#D94F1D]"
              />
              <div className={item.done ? 'line-through opacity-50' : ''}>
                <p className="font-bold text-sm text-[#1A0F0A]">{item.name}</p>
                <span className="text-[11px] font-semibold text-[#8C7A70]">{item.aisle} • Qty: {item.qty}</span>
              </div>
            </label>
            <button type="button" onClick={() => persist(items.filter((x) => x.id !== item.id))} className="text-[#8C7A70] hover:text-rose-600">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 6. ALL-IN-ONE TOOLBOX (8 Tools - all-in-one-tools)
// ============================================================================
export type AllInOneTab = 'stylish' | 'unit' | 'password' | 'base64' | 'color' | 'json' | 'timer' | 'bmi';

export function AllInOneToolbox({ defaultTab = 'stylish', standalone = false }: { defaultTab?: AllInOneTab; standalone?: boolean }) {
  const [subTab, setSubTab] = useState<AllInOneTab>(defaultTab);

  useEffect(() => {
    setSubTab(defaultTab);
  }, [defaultTab]);

  // Unit converter
  const [unitCat, setUnitCat] = useState<'length' | 'weight' | 'temp' | 'storage' | 'speed'>('length');
  const [unitVal, setUnitVal] = useState(10);

  // Password generator
  const [pwLen, setPwLen] = useState(16);
  const [pwOut, setPwOut] = useState('Publixa!9xQ#2026');
  const [pwCopied, setPwCopied] = useState(false);

  // Base64
  const [b64In, setB64In] = useState('Hello Publixa!');
  const [b64Out, setB64Out] = useState('SGVsbG8gUHVibGl4YSE=');

  // Color & Gradient
  const [colorA, setColorA] = useState('#D94F1D');
  const [colorB, setColorB] = useState('#F59E0B');
  const [gradCopied, setGradCopied] = useState(false);

  // JSON formatter
  const [jsonText, setJsonText] = useState('{"brand":"Publixa","apps":35,"privacyFirst":true}');
  const [jsonErr, setJsonErr] = useState<string | null>(null);

  // Pomodoro Timer
  const [timerSec, setTimerSec] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  // BMI
  const [heightCm, setHeightCm] = useState(172);
  const [weightKg, setWeightKg] = useState(68);

  useEffect(() => {
    if (!timerRunning) return;
    const id = setInterval(() => {
      setTimerSec((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [timerRunning]);

  const genPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*()-_=+';
    const arr = new Uint32Array(pwLen);
    crypto.getRandomValues(arr);
    setPwOut(Array.from(arr, (x) => chars[x % chars.length]).join(''));
  };

  const hexToRgb = (hex: string) => {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.slice(0, 2), 16) || 0;
    const g = parseInt(clean.slice(2, 4), 16) || 0;
    const b = parseInt(clean.slice(4, 6), 16) || 0;
    return `rgb(${r}, ${g}, ${b})`;
  };

  const bmiVal = weightKg / Math.pow(Math.max(50, heightCm) / 100, 2);
  const bmiLabel =
    bmiVal < 18.5 ? 'Underweight' : bmiVal < 25 ? 'Healthy Normal' : bmiVal < 30 ? 'Overweight' : 'Obese';

  const minsStr = String(Math.floor(timerSec / 60)).padStart(2, '0');
  const secsStr = String(timerSec % 60).padStart(2, '0');

  return (
    <div className="space-y-6">
      {!standalone && (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 border-b border-[#F0DFD5] pb-5">
        {[
          { id: 'stylish', label: 'Stylish Name Creator', icon: Sparkles },
          { id: 'unit', label: 'Unit Converter', icon: ArrowLeftRight },
          { id: 'password', label: 'Password Studio', icon: KeyRound },
          { id: 'color', label: 'Color & Gradient', icon: Palette },
          { id: 'json', label: 'JSON Formatter', icon: Braces },
          { id: 'base64', label: 'Base64 / URL', icon: Wrench },
          { id: 'timer', label: 'Focus Pomodoro', icon: Timer },
          { id: 'bmi', label: 'BMI Health Calc', icon: HeartPulse },
        ].map((t) => {
          const Icon = t.icon;
          const active = subTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setSubTab(t.id as 'stylish' | 'unit' | 'password' | 'base64' | 'color' | 'json' | 'timer' | 'bmi')}
              className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all ${
                active
                  ? 'bg-[#D94F1D] text-white border-[#D94F1D] shadow-md shadow-[#D94F1D]/20'
                  : 'bg-[#FFF9F5] text-[#3D2315] border-[#F0DFD5] hover:border-[#D94F1D] hover:bg-white'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${active ? 'bg-white/20 text-white' : 'bg-[#FFF0E6] text-[#D94F1D]'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold truncate">{t.label}</span>
            </button>
          );
        })}
      </div>
      )}

      {subTab === 'stylish' && <StylishNameStudio mode="general" appName="All-in-One ToolBox" />}

      {subTab === 'unit' && (
        <div className="bg-[#FFF9F5] border border-[#F0DFD5] rounded-2xl p-5 space-y-4">
          <div className="flex flex-wrap gap-2">
            {(['length', 'weight', 'temp', 'storage', 'speed'] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setUnitCat(c)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize ${
                  unitCat === c ? 'bg-[#1A0F0A] text-white' : 'bg-white border border-[#E5CEC0]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <input
            type="number"
            value={unitVal}
            onChange={(e) => setUnitVal(Number(e.target.value))}
            className="w-full sm:w-64 px-4 py-2.5 rounded-xl bg-white border border-[#E5CEC0] text-base font-bold"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {unitCat === 'length' && (
              <>
                <div className="p-4 rounded-xl bg-white border border-[#F0DFD5]">
                  <span className="text-xs text-[#8C7A70] block">{unitVal} km in Miles</span>
                  <strong className="text-xl text-[#D94F1D]">{(unitVal * 0.621371).toFixed(3)} mi</strong>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#F0DFD5]">
                  <span className="text-xs text-[#8C7A70] block">{unitVal} m in Feet</span>
                  <strong className="text-xl text-[#D94F1D]">{(unitVal * 3.28084).toFixed(2)} ft</strong>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#F0DFD5]">
                  <span className="text-xs text-[#8C7A70] block">{unitVal} cm in Inches</span>
                  <strong className="text-xl text-[#D94F1D]">{(unitVal * 0.393701).toFixed(2)} in</strong>
                </div>
              </>
            )}
            {unitCat === 'weight' && (
              <>
                <div className="p-4 rounded-xl bg-white border border-[#F0DFD5]">
                  <span className="text-xs text-[#8C7A70] block">{unitVal} kg in Pounds</span>
                  <strong className="text-xl text-[#D94F1D]">{(unitVal * 2.20462).toFixed(2)} lb</strong>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#F0DFD5]">
                  <span className="text-xs text-[#8C7A70] block">{unitVal} kg in Grams</span>
                  <strong className="text-xl text-[#D94F1D]">{(unitVal * 1000).toLocaleString()} g</strong>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#F0DFD5]">
                  <span className="text-xs text-[#8C7A70] block">{unitVal} oz in Grams</span>
                  <strong className="text-xl text-[#D94F1D]">{(unitVal * 28.3495).toFixed(2)} g</strong>
                </div>
              </>
            )}
            {unitCat === 'temp' && (
              <>
                <div className="p-4 rounded-xl bg-white border border-[#F0DFD5]">
                  <span className="text-xs text-[#8C7A70] block">{unitVal} °C in Fahrenheit</span>
                  <strong className="text-xl text-[#D94F1D]">{((unitVal * 9) / 5 + 32).toFixed(1)} °F</strong>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#F0DFD5]">
                  <span className="text-xs text-[#8C7A70] block">{unitVal} °F in Celsius</span>
                  <strong className="text-xl text-[#D94F1D]">{(((unitVal - 32) * 5) / 9).toFixed(1)} °C</strong>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#F0DFD5]">
                  <span className="text-xs text-[#8C7A70] block">{unitVal} °C in Kelvin</span>
                  <strong className="text-xl text-[#D94F1D]">{(unitVal + 273.15).toFixed(2)} K</strong>
                </div>
              </>
            )}
            {unitCat === 'storage' && (
              <>
                <div className="p-4 rounded-xl bg-white border border-[#F0DFD5]">
                  <span className="text-xs text-[#8C7A70] block">{unitVal} GB in MB</span>
                  <strong className="text-xl text-[#D94F1D]">{(unitVal * 1024).toLocaleString()} MB</strong>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#F0DFD5]">
                  <span className="text-xs text-[#8C7A70] block">{unitVal} TB in GB</span>
                  <strong className="text-xl text-[#D94F1D]">{(unitVal * 1024).toLocaleString()} GB</strong>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#F0DFD5]">
                  <span className="text-xs text-[#8C7A70] block">{unitVal} MB in KB</span>
                  <strong className="text-xl text-[#D94F1D]">{(unitVal * 1024).toLocaleString()} KB</strong>
                </div>
              </>
            )}
            {unitCat === 'speed' && (
              <>
                <div className="p-4 rounded-xl bg-white border border-[#F0DFD5]">
                  <span className="text-xs text-[#8C7A70] block">{unitVal} km/h in mph</span>
                  <strong className="text-xl text-[#D94F1D]">{(unitVal * 0.621371).toFixed(2)} mph</strong>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#F0DFD5]">
                  <span className="text-xs text-[#8C7A70] block">{unitVal} km/h in m/s</span>
                  <strong className="text-xl text-[#D94F1D]">{(unitVal / 3.6).toFixed(2)} m/s</strong>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#F0DFD5]">
                  <span className="text-xs text-[#8C7A70] block">{unitVal} mph in km/h</span>
                  <strong className="text-xl text-[#D94F1D]">{(unitVal * 1.60934).toFixed(2)} km/h</strong>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {subTab === 'password' && (
        <div className="bg-[#FFF9F5] border border-[#F0DFD5] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8C7A70]">Length: {pwLen} chars ({pwLen >= 16 ? 'Ultra Strong' : 'Strong'})</span>
            <input type="range" min={8} max={32} value={pwLen} onChange={(e) => setPwLen(Number(e.target.value))} className="w-48 accent-[#D94F1D]" />
          </div>
          <div className="p-4 rounded-xl bg-[#1A0F0A] text-white font-mono text-lg break-all flex items-center justify-between gap-3">
            <span>{pwOut}</span>
            <button
              type="button"
              onClick={async () => {
                await navigator.clipboard.writeText(pwOut);
                setPwCopied(true);
                setTimeout(() => setPwCopied(false), 1500);
              }}
              className="px-3 py-1.5 rounded-lg bg-[#D94F1D] text-xs font-bold shrink-0"
            >
              {pwCopied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <button type="button" onClick={genPassword} className="px-6 py-2.5 rounded-full bg-[#D94F1D] text-white text-xs font-bold">
            Generate Cryptographic Password
          </button>
        </div>
      )}

      {subTab === 'color' && (
        <div className="bg-[#FFF9F5] border border-[#F0DFD5] rounded-2xl p-5 space-y-4">
          <div className="h-28 rounded-2xl shadow-inner border border-white" style={{ background: `linear-gradient(135deg, ${colorA}, ${colorB})` }} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-white border border-[#F0DFD5] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#8C7A70] block">Start Color</span>
                <span className="font-mono text-sm font-bold text-[#1A0F0A]">{colorA.toUpperCase()} • {hexToRgb(colorA)}</span>
              </div>
              <input type="color" value={colorA} onChange={(e) => setColorA(e.target.value)} className="w-10 h-10 rounded cursor-pointer border-0" />
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-[#F0DFD5] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#8C7A70] block">End Color</span>
                <span className="font-mono text-sm font-bold text-[#1A0F0A]">{colorB.toUpperCase()} • {hexToRgb(colorB)}</span>
              </div>
              <input type="color" value={colorB} onChange={(e) => setColorB(e.target.value)} className="w-10 h-10 rounded cursor-pointer border-0" />
            </div>
          </div>
          <button
            type="button"
            onClick={async () => {
              await navigator.clipboard.writeText(`background: linear-gradient(135deg, ${colorA}, ${colorB});`);
              setGradCopied(true);
              setTimeout(() => setGradCopied(false), 1500);
            }}
            className="px-5 py-2.5 rounded-full bg-[#D94F1D] text-white text-xs font-bold"
          >
            {gradCopied ? '✓ Copied CSS Gradient!' : 'Copy CSS Gradient Code'}
          </button>
        </div>
      )}

      {subTab === 'json' && (
        <div className="bg-[#FFF9F5] border border-[#F0DFD5] rounded-2xl p-5 space-y-3">
          <textarea
            rows={7}
            value={jsonText}
            onChange={(e) => {
              setJsonText(e.target.value);
              setJsonErr(null);
            }}
            className="w-full p-3.5 rounded-xl bg-white border border-[#E5CEC0] font-mono text-xs sm:text-sm"
          />
          {jsonErr && <p className="text-xs font-bold text-rose-600">{jsonErr}</p>}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                try {
                  setJsonText(JSON.stringify(JSON.parse(jsonText), null, 2));
                  setJsonErr(null);
                } catch (err) {
                  setJsonErr(String(err));
                }
              }}
              className="px-5 py-2 rounded-full bg-[#D94F1D] text-white text-xs font-bold"
            >
              Pretty Format JSON
            </button>
            <button
              type="button"
              onClick={() => {
                try {
                  setJsonText(JSON.stringify(JSON.parse(jsonText)));
                  setJsonErr(null);
                } catch (err) {
                  setJsonErr(String(err));
                }
              }}
              className="px-5 py-2 rounded-full bg-[#1A0F0A] text-white text-xs font-bold"
            >
              Minify JSON
            </button>
          </div>
        </div>
      )}

      {subTab === 'base64' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FFF9F5] border border-[#F0DFD5] rounded-2xl p-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#8C7A70] block">Plain Text</label>
            <textarea rows={4} value={b64In} onChange={(e) => setB64In(e.target.value)} className="w-full p-3 rounded-xl bg-white border border-[#E5CEC0] text-sm font-mono" />
            <button
              type="button"
              onClick={() => {
                try {
                  setB64Out(btoa(unescape(encodeURIComponent(b64In))));
                } catch {
                  setB64Out('Encoding error');
                }
              }}
              className="px-4 py-2 rounded-full bg-[#D94F1D] text-white text-xs font-bold"
            >
              Encode to Base64 →
            </button>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#8C7A70] block">Base64 Output</label>
            <textarea rows={4} value={b64Out} onChange={(e) => setB64Out(e.target.value)} className="w-full p-3 rounded-xl bg-white border border-[#E5CEC0] text-sm font-mono" />
            <button
              type="button"
              onClick={() => {
                try {
                  setB64In(decodeURIComponent(escape(atob(b64Out))));
                } catch {
                  setB64In('Invalid Base64');
                }
              }}
              className="px-4 py-2 rounded-full bg-[#1A0F0A] text-white text-xs font-bold"
            >
              ← Decode Base64
            </button>
          </div>
        </div>
      )}

      {subTab === 'timer' && (
        <div className="bg-[#1A0F0A] text-white rounded-2xl p-8 flex flex-col items-center space-y-5">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-300">Focus Pomodoro Timer</span>
          <div className="text-5xl sm:text-6xl font-mono font-black tracking-wider">
            {minsStr}:{secsStr}
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setTimerRunning((r) => !r)}
              className="px-6 py-2.5 rounded-full bg-[#D94F1D] hover:bg-[#C4461A] font-bold text-xs"
            >
              {timerRunning ? 'Pause' : 'Start Focus'}
            </button>
            <button
              type="button"
              onClick={() => {
                setTimerRunning(false);
                setTimerSec(25 * 60);
              }}
              className="px-5 py-2.5 rounded-full bg-white/15 font-bold text-xs"
            >
              25m Focus
            </button>
            <button
              type="button"
              onClick={() => {
                setTimerRunning(false);
                setTimerSec(5 * 60);
              }}
              className="px-5 py-2.5 rounded-full bg-white/15 font-bold text-xs"
            >
              5m Break
            </button>
          </div>
        </div>
      )}

      {subTab === 'bmi' && (
        <div className="bg-[#FFF9F5] border border-[#F0DFD5] rounded-2xl p-5 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#8C7A70] block mb-1">Height: {heightCm} cm</label>
              <input type="range" min={120} max={220} value={heightCm} onChange={(e) => setHeightCm(Number(e.target.value))} className="w-full accent-[#D94F1D]" />
            </div>
            <div>
              <label className="text-xs font-bold text-[#8C7A70] block mb-1">Weight: {weightKg} kg</label>
              <input type="range" min={30} max={160} value={weightKg} onChange={(e) => setWeightKg(Number(e.target.value))} className="w-full accent-[#D94F1D]" />
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-[#F0DFD5] text-center space-y-1">
            <span className="text-xs font-bold text-[#8C7A70]">Your BMI Index</span>
            <p className="text-4xl font-extrabold text-[#D94F1D]">{bmiVal.toFixed(1)}</p>
            <span className="inline-block px-3 py-1 rounded-full bg-[#FFF0E6] text-[#1A0F0A] text-xs font-bold">
              {bmiLabel}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
