'use client';

import React, { useState, useEffect } from 'react';
import {
  Mail,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Send,
} from 'lucide-react';
import { PUBLIXA_APPS } from '@/lib/appList';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    appName: '',
    message: '',
  });

  const [copied, setCopied] = useState(false);
  const [links, setLinks] = useState({ gmail: '', mailto: '', subject: '', body: '' });
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [responseMsg, setResponseMsg] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const appParam = params.get('app');
      if (appParam) {
        setFormData((prev) => ({ ...prev, appName: appParam }));
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = `[Publixa Support] ${formData.subject}${formData.appName ? ` - ${formData.appName}` : ''}`;
    const body = `Hi Publixa Support Team,\n\nName: ${formData.name}\nEmail: ${formData.email}\nApp: ${formData.appName || 'General'}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}\n\n---\nSubmitted via Publixa Support Center (https://publixa.store)`;

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=publixaorignal@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const mailtoUrl = `mailto:publixaorignal@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setLinks({
      gmail: gmailUrl,
      mailto: mailtoUrl,
      subject,
      body,
    });

    // Directly open Gmail in a new tab (synchronous to avoid browser popup blockers)
    const newTab = window.open(gmailUrl, '_blank');
    if (!newTab) {
      window.location.href = mailtoUrl;
    }

    // Silently log to PHP endpoint if available without blocking
    try {
      fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      }).catch(() => {});
    } catch (_) {}

    setStatus('success');
  };

  const copyDetails = () => {
    const text = `To: publixaorignal@gmail.com\nSubject: ${links.subject}\n\n${links.body}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full bg-[#FFFAF6] min-h-screen text-[#1A0F0A] py-12 lg:py-16">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#F0DFD5] shadow-xs space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF0E6] text-[#D94F1D] text-xs font-bold border border-[#FFDFC8]">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Developer Support &amp; Compliance Center</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#1A0F0A] tracking-tight font-heading">
            Contact &amp; Support Center
          </h1>
          <p className="text-[#665349] text-sm sm:text-base max-w-3xl leading-relaxed">
            Need technical assistance, policy clarifications, or have feedback about Publixa applications? Reach out directly to developer Prince Developer (Prince Kumar Singh).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Support Form (2 cols) */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F0DFD5] shadow-xs space-y-6">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#1A0F0A] mb-1 font-heading">Send a Message</h2>
                <p className="text-xs sm:text-sm text-[#665349]">
                  Our team reviews inquiries continuously and replies via email within 24–48 hours.
                </p>
              </div>

              {status === 'success' ? (
                <div className="p-6 sm:p-8 rounded-2xl bg-white border-2 border-emerald-300 shadow-sm space-y-6">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#1A0F0A]">Opening in Gmail!</h3>
                      <p className="text-xs sm:text-sm text-[#665349] mt-0.5 leading-relaxed">
                        A new window with Gmail Compose has been launched with all your inquiry details pre-filled. If your browser blocked popups or it didn't open automatically, use the buttons below:
                      </p>
                    </div>
                  </div>

                  {/* Direct Launch Buttons */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <a
                      href={links.gmail}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#D94F1D] hover:bg-[#C4461A] text-white text-xs sm:text-sm font-bold transition shadow-md"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Open in Gmail Web</span>
                    </a>

                    <a
                      href={links.mailto}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-[#FFF9F5] text-[#3D2315] text-xs sm:text-sm font-semibold border border-[#F0DFD5] transition shadow-xs"
                    >
                      <Mail className="w-4 h-4 text-[#D94F1D]" />
                      <span>Open in Mail App</span>
                    </a>

                    <button
                      type="button"
                      onClick={copyDetails}
                      className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-[#FFF0E6] hover:bg-[#FFE6D5] text-[#D94F1D] text-xs sm:text-sm font-bold border border-[#FFDFC8] transition"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? 'Copied to Clipboard!' : 'Copy Details'}</span>
                    </button>
                  </div>

                  {/* Details Preview */}
                  <div className="p-4 rounded-xl bg-[#FFF9F5] border border-[#F0DFD5] space-y-2 text-xs">
                    <div className="flex justify-between items-center text-[#665349] font-mono text-[11px] pb-1 border-b border-[#F0DFD5]">
                      <span>RECIPIENT: <strong className="text-[#D94F1D]">publixaorignal@gmail.com</strong></span>
                      <span>STATUS: PREPARED</span>
                    </div>
                    <p className="text-[#3D2315] font-semibold"><strong className="text-[#1A0F0A]">Subject:</strong> {links.subject}</p>
                    <div className="text-[#665349] whitespace-pre-line bg-white p-3 rounded-lg border border-[#F0DFD5] max-h-40 overflow-y-auto font-mono text-[11px] leading-relaxed">
                      {links.body}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#F0DFD5] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setStatus('idle');
                        setFormData({
                          name: '',
                          email: '',
                          subject: '',
                          appName: '',
                          message: '',
                        });
                      }}
                      className="text-xs font-bold text-[#665349] hover:text-[#D94F1D] transition cursor-pointer"
                    >
                      ← Send Another Message
                    </button>
                    <span className="text-[11px] text-[#8C7467]">Publixa Support Team</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {status === 'error' && (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{responseMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#3D2315] mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alex Miller"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#F0DFD5] bg-[#FFF9F5] text-[#1A0F0A] text-xs sm:text-sm focus:ring-2 focus:ring-[#D94F1D]/20 focus:border-[#D94F1D] focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#3D2315] mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. alex@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#F0DFD5] bg-[#FFF9F5] text-[#1A0F0A] text-xs sm:text-sm focus:ring-2 focus:ring-[#D94F1D]/20 focus:border-[#D94F1D] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#3D2315] mb-1.5">
                        Subject *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Question regarding PDF conversion"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#F0DFD5] bg-[#FFF9F5] text-[#1A0F0A] text-xs sm:text-sm focus:ring-2 focus:ring-[#D94F1D]/20 focus:border-[#D94F1D] focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#3D2315] mb-1.5">
                        Related App (Optional)
                      </label>
                      <select
                        value={formData.appName}
                        onChange={(e) => setFormData({ ...formData, appName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#F0DFD5] bg-[#FFF9F5] text-[#1A0F0A] text-xs sm:text-sm focus:ring-2 focus:ring-[#D94F1D]/20 focus:border-[#D94F1D] focus:outline-hidden"
                      >
                        <option value="">-- Select an Application (Optional) --</option>
                        <option value="General / Not App Specific">None / General Inquiry</option>
                        {formData.appName &&
                          formData.appName !== 'General / Not App Specific' &&
                          !PUBLIXA_APPS.some((a) => a.name.toLowerCase() === formData.appName.toLowerCase()) && (
                            <option value={formData.appName}>{formData.appName}</option>
                          )}
                        {PUBLIXA_APPS.map((app) => (
                          <option key={app.packageName} value={app.name}>
                            {app.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3D2315] mb-1.5">
                      Your Message / Question *
                    </label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Describe your inquiry, issue, or feature request in detail..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#F0DFD5] bg-[#FFF9F5] text-[#1A0F0A] text-xs sm:text-sm focus:ring-2 focus:ring-[#D94F1D]/20 focus:border-[#D94F1D] focus:outline-hidden"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#D94F1D] hover:bg-[#C4461A] text-white text-xs sm:text-sm font-bold transition shadow-md cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send via Gmail / Email</span>
                    </button>
                    <p className="text-[11px] sm:text-xs text-[#665349]">
                      Opens Gmail with all details pre-filled directly to <strong>publixaorignal@gmail.com</strong>
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Support Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F0DFD5] shadow-xs space-y-4">
              <h3 className="text-base font-bold text-[#1A0F0A] flex items-center gap-2 font-heading">
                <Mail className="w-4 h-4 text-[#D94F1D]" />
                <span>Direct Support Inbox</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#665349] leading-relaxed">
                For direct correspondence, you can email our support team directly:
              </p>
              <div className="p-3 bg-[#FFF9F5] rounded-xl border border-[#F0DFD5] font-mono text-xs text-[#D94F1D] font-bold break-all">
                publixaorignal@gmail.com
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F0DFD5] shadow-xs space-y-3 text-xs sm:text-sm text-[#3D2315]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A0F0A] flex items-center gap-1.5 font-heading">
                <ShieldCheck className="w-4 h-4 text-[#D94F1D]" />
                <span>Publixa Entity Information</span>
              </h3>
              <p><strong className="text-[#1A0F0A]">Developer:</strong> Prince Developer</p>
              <p><strong className="text-[#1A0F0A]">Legal Owner:</strong> Prince Kumar Singh</p>
              <p><strong className="text-[#1A0F0A]">Trading Brand:</strong> Publixa</p>
              <p><strong className="text-[#1A0F0A]">Domain:</strong> https://publixa.store</p>
              <p><strong className="text-[#1A0F0A]">Platform:</strong> Google Play Store</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
