'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Key,
  Link2,
  Activity,
  Copy,
  Check,
  RefreshCw,
  Download,
  Lock,
} from 'lucide-react';
import { downloadText } from './downloadBlob';

export type VpnTab = 'inspector' | 'wireguard' | 'dns' | 'tracker';

interface VpnPrivacySuiteProps {
  appName?: string;
  defaultTab?: VpnTab;
  standalone?: boolean;
}

function randomBase64Key(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  // Clamp like X25519 key material
  bytes[0] &= 248;
  bytes[31] &= 127;
  bytes[31] |= 64;
  return btoa(String.fromCharCode(...bytes));
}

export default function VpnPrivacySuite({ appName = 'Publixa VPN', defaultTab = 'inspector', standalone = false }: VpnPrivacySuiteProps) {
  const [tab, setTab] = useState<VpnTab>(defaultTab);

  useEffect(() => {
    setTab(defaultTab);
  }, [defaultTab]);

  // Inspector
  const [browserInfo, setBrowserInfo] = useState({
    https: true,
    timezone: 'UTC',
    cores: 'N/A',
    platform: 'Browser',
    screen: 'N/A',
  });
  const [publicIp, setPublicIp] = useState<string | null>(null);
  const [ipLoading, setIpLoading] = useState(false);

  // WireGuard Config
  const [privKey, setPrivKey] = useState('');
  const [pubKey, setPubKey] = useState('');
  const [serverHost, setServerHost] = useState('edge-sg.publixa.store:51820');
  const [dnsIp, setDnsIp] = useState('1.1.1.1');
  const [copiedWg, setCopiedWg] = useState(false);

  // DNS Ping
  const [pings, setPings] = useState<{ name: string; ms: number | null; status: string }[]>([
    { name: 'Cloudflare (1.1.1.1 DoH)', ms: null, status: 'Ready' },
    { name: 'Google (8.8.8.8 DoH)', ms: null, status: 'Ready' },
    { name: 'Quad9 (9.9.9.9 DoH)', ms: null, status: 'Ready' },
  ]);

  // URL Tracker Stripper
  const [dirtyUrl, setDirtyUrl] = useState(
    'https://example.com/product?id=42&utm_source=social&utm_medium=cpc&fbclid=IwAR12345&gclid=Cj0KCQ'
  );
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    setBrowserInfo({
      https: window.location.protocol === 'https:' || window.location.hostname === 'localhost',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown',
      cores: navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} Threads` : 'Hidden',
      platform: navigator.platform || 'Web',
      screen: `${window.screen.width}×${window.screen.height}`,
    });
    setPrivKey(randomBase64Key());
    setPubKey(randomBase64Key());
  }, []);

  const checkPublicIp = async () => {
    setIpLoading(true);
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      setPublicIp(data.ip || 'Unavailable');
    } catch {
      setPublicIp('Blocked by offline/adblock policy');
    } finally {
      setIpLoading(false);
    }
  };

  const runDnsBenchmark = async () => {
    const endpoints = [
      { name: 'Cloudflare (1.1.1.1 DoH)', url: 'https://cloudflare-dns.com/dns-query?name=example.com' },
      { name: 'Google (8.8.8.8 DoH)', url: 'https://dns.google/resolve?name=example.com' },
      { name: 'Quad9 (9.9.9.9 DoH)', url: 'https://dns.quad9.net:5053/dns-query?name=example.com' },
    ];
    const results: { name: string; ms: number | null; status: string }[] = [];
    for (const ep of endpoints) {
      const t0 = performance.now();
      try {
        await fetch(ep.url, { headers: { Accept: 'application/dns-json' }, cache: 'no-store' });
        const ms = Math.round(performance.now() - t0);
        results.push({ name: ep.name, ms, status: ms < 100 ? 'Fast' : 'OK' });
      } catch {
        results.push({ name: ep.name, ms: null, status: 'Blocked / Offline' });
      }
    }
    setPings(results);
  };

  const cleanedUrl = (() => {
    try {
      const u = new URL(dirtyUrl.trim());
      const stripKeys = [
        'fbclid',
        'gclid',
        'dclid',
        'msclkid',
        'mc_eid',
        'igshid',
        'si',
        'ref_src',
      ];
      Array.from(u.searchParams.keys()).forEach((k) => {
        if (k.startsWith('utm_') || stripKeys.includes(k)) {
          u.searchParams.delete(k);
        }
      });
      return u.toString();
    } catch {
      return dirtyUrl;
    }
  })();

  const wgConfig = `[Interface]
# Generated locally by ${appName} Web Security Lab
PrivateKey = ${privKey}
Address = 10.8.0.2/32
DNS = ${dnsIp}

[Peer]
PublicKey = ${pubKey}
Endpoint = ${serverHost}
AllowedIPs = 0.0.0.0/0, ::/0
PersistentKeepalive = 25`;

  return (
    <div className="space-y-6">
      {!standalone && (
      <div className="flex flex-wrap gap-2 border-b border-[#F0DFD5] pb-4">
        {[
          { id: 'inspector', label: 'Connection & IP Inspector', icon: Shield },
          { id: 'wireguard', label: 'WireGuard Key & Config Gen', icon: Key },
          { id: 'dns', label: 'DNS Latency Benchmark', icon: Activity },
          { id: 'tracker', label: 'URL Tracker Stripper', icon: Link2 },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id as 'inspector' | 'wireguard' | 'dns' | 'tracker')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition ${
                tab === t.id ? 'bg-[#D94F1D] text-white shadow-sm' : 'bg-[#FFF0E6] text-[#3D2315] hover:bg-[#FFE3D1]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>
      )}

      {tab === 'inspector' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-[#FFF9F5] border border-[#F0DFD5] rounded-2xl p-5 space-y-4">
            <h4 className="font-bold text-sm text-[#1A0F0A] flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#D94F1D]" />
              <span>Browser Privacy Exposure Snapshot</span>
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between p-2.5 rounded-xl bg-white border border-[#F0DFD5]">
                <span className="text-[#665349]">Transport Security</span>
                <strong className="text-emerald-700">{browserInfo.https ? 'HTTPS / Local Secure' : 'Unencrypted HTTP'}</strong>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-white border border-[#F0DFD5]">
                <span className="text-[#665349]">Exposed Timezone</span>
                <strong className="text-[#1A0F0A]">{browserInfo.timezone}</strong>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-white border border-[#F0DFD5]">
                <span className="text-[#665349]">Screen Fingerprint</span>
                <strong className="text-[#1A0F0A]">{browserInfo.screen}</strong>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-white border border-[#F0DFD5]">
                <span className="text-[#665349]">CPU / Platform</span>
                <strong className="text-[#1A0F0A]">{browserInfo.cores} ({browserInfo.platform})</strong>
              </div>
            </div>
          </div>

          <div className="bg-[#1A0F0A] text-white rounded-2xl p-6 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-300">
                Real-Time IP Check ({appName})
              </span>
              <h4 className="text-xl font-bold mt-1">Verify Your Visible Public IP</h4>
              <p className="text-xs text-orange-100/75 mt-1 leading-relaxed">
                Web browsers cannot tunnel OS-level traffic directly. Use this diagnostic to inspect what IP websites currently see, and install {appName} on Android for system-wide encrypted WireGuard protection.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/10 font-mono text-lg font-bold text-center">
              {publicIp ? publicIp : 'Click below to check public IP'}
            </div>

            <button
              type="button"
              disabled={ipLoading}
              onClick={checkPublicIp}
              className="w-full py-3 rounded-full bg-[#D94F1D] hover:bg-[#C4461A] font-bold text-sm transition"
            >
              {ipLoading ? 'Checking IP...' : 'Check My Public IP Now'}
            </button>
          </div>
        </div>
      )}

      {tab === 'wireguard' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-5 bg-[#FFF9F5] border border-[#F0DFD5] rounded-2xl p-5 space-y-3">
            <div>
              <label className="text-xs font-bold text-[#8C7A70] block mb-1">Server Endpoint</label>
              <input type="text" value={serverHost} onChange={(e) => setServerHost(e.target.value)} className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E5CEC0] text-sm font-mono" />
            </div>
            <div>
              <label className="text-xs font-bold text-[#8C7A70] block mb-1">Custom DNS Resolver</label>
              <select value={dnsIp} onChange={(e) => setDnsIp(e.target.value)} className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E5CEC0] text-sm font-mono bg-white">
                <option value="1.1.1.1">1.1.1.1 (Cloudflare)</option>
                <option value="9.9.9.9">9.9.9.9 (Quad9 Malware Block)</option>
                <option value="8.8.8.8">8.8.8.8 (Google DNS)</option>
              </select>
            </div>
            <button
              type="button"
              onClick={() => {
                setPrivKey(randomBase64Key());
                setPubKey(randomBase64Key());
              }}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#1A0F0A] text-white text-xs font-bold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerate Local Keys</span>
            </button>
          </div>

          <div className="lg:col-span-7 bg-[#1A0F0A] text-white rounded-2xl p-5 space-y-3">
            <pre className="text-xs font-mono whitespace-pre-wrap text-orange-100 bg-black/30 p-4 rounded-xl border border-white/10">
              {wgConfig}
            </pre>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={async () => {
                  await navigator.clipboard.writeText(wgConfig);
                  setCopiedWg(true);
                  setTimeout(() => setCopiedWg(false), 1600);
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#D94F1D] text-xs font-bold"
              >
                {copiedWg ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedWg ? 'Copied Config' : 'Copy Config'}</span>
              </button>
              <button
                type="button"
                onClick={() => downloadText(wgConfig, 'publixa-wireguard.conf')}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white/15 hover:bg-white/25 text-xs font-bold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .CONF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === 'dns' && (
        <div className="bg-[#FFF9F5] border border-[#F0DFD5] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-[#1A0F0A]">Real-Time DNS-over-HTTPS Ping Test</h4>
            <button
              type="button"
              onClick={runDnsBenchmark}
              className="px-5 py-2 rounded-full bg-[#D94F1D] hover:bg-[#C4461A] text-white text-xs font-bold transition"
            >
              Run Speed Test
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {pings.map((p) => (
              <div key={p.name} className="p-4 rounded-xl bg-white border border-[#F0DFD5]">
                <span className="text-xs font-bold text-[#665349] block">{p.name}</span>
                <span className="text-2xl font-extrabold text-[#D94F1D] block mt-1">
                  {p.ms !== null ? `${p.ms} ms` : '—'}
                </span>
                <span className="text-[11px] font-semibold text-emerald-700">{p.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'tracker' && (
        <div className="bg-[#FFF9F5] border border-[#F0DFD5] rounded-2xl p-5 space-y-4">
          <div>
            <label className="text-xs font-bold text-[#8C7A70] block mb-1">Paste Tracking Link (UTM / fbclid / gclid / igsh)</label>
            <input
              type="text"
              value={dirtyUrl}
              onChange={(e) => setDirtyUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5CEC0] text-xs sm:text-sm font-mono"
            />
          </div>
          <div className="p-4 rounded-xl bg-white border border-emerald-200 space-y-2">
            <span className="text-xs font-bold text-emerald-700 block">Clean Privacy-Safe Link:</span>
            <p className="font-mono text-xs sm:text-sm text-[#1A0F0A] break-all">{cleanedUrl}</p>
          </div>
          <button
            type="button"
            onClick={async () => {
              await navigator.clipboard.writeText(cleanedUrl);
              setCopiedUrl(true);
              setTimeout(() => setCopiedUrl(false), 1600);
            }}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#D94F1D] text-white text-xs font-bold"
          >
            {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedUrl ? 'Copied Clean URL' : 'Copy Clean URL'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
