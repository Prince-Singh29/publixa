'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Trash2,
  ShieldCheck,
  Mail,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  Send,
} from 'lucide-react';
import { PUBLIXA_APPS } from '@/lib/appList';

function DataDeletionContent() {
  const searchParams = useSearchParams();
  const initialApp = searchParams.get('app') || '';
  const initialPkg = searchParams.get('pkg') || '';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    appName: initialApp,
    packageName: initialPkg,
    requestType: 'Data Deletion',
    details: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [responseMsg, setResponseMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const [links, setLinks] = useState({ gmail: '', mailto: '', subject: '', body: '' });

  useEffect(() => {
    if (initialApp) setFormData((prev) => ({ ...prev, appName: initialApp }));
    if (initialPkg) setFormData((prev) => ({ ...prev, packageName: initialPkg }));
  }, [initialApp, initialPkg]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = `[Data Deletion Request] ${formData.requestType} - ${formData.appName}`;
    const body = `DATA DELETION & ACCOUNT PURGE REQUEST\n\nFull Name: ${formData.name}\nEmail Address: ${formData.email}\nApplication Name: ${formData.appName}\nPackage Name: ${formData.packageName || 'Not specified'}\nRequest Type: ${formData.requestType}\n\nAdditional Details / Device ID / Advertising ID:\n${formData.details || 'None provided'}\n\n---\nSubmitted via Publixa Data Deletion Portal (https://publixa.store)`;

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
      fetch('/api/deletion-requests', {
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold">
            <Trash2 className="w-3.5 h-3.5" />
            <span>User Data Deletion Center</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#1A0F0A] tracking-tight font-heading">
            Request User Data &amp; Account Deletion
          </h1>
          <p className="text-[#665349] text-sm sm:text-base max-w-3xl leading-relaxed">
            In compliance with Google Play Developer Policy and global privacy standards (GDPR / CCPA), users have the right to request permanent deletion of any device identifiers, telemetry, or contact records associated with Publixa applications.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Form (2 cols) */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F0DFD5] shadow-xs space-y-6">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#1A0F0A] mb-1 font-heading">
                  Submit Deletion Request
                </h2>
                <p className="text-xs sm:text-sm text-[#665349]">
                  Complete the form below. Once received, our compliance team processes the purge within 7-14 business days.
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
                        A new window with Gmail Compose has been launched with your data deletion request pre-filled. If your browser blocked popups or it didn't open automatically, use the buttons below:
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
                          appName: '',
                          packageName: '',
                          requestType: 'Data Deletion',
                          details: '',
                        });
                      }}
                      className="text-xs font-bold text-[#665349] hover:text-[#D94F1D] transition cursor-pointer"
                    >
                      ← Submit Another Request
                    </button>
                    <span className="text-[11px] text-[#8C7467]">Publixa Compliance Team</span>
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
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. John Doe"
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
                        placeholder="e.g. user@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#F0DFD5] bg-[#FFF9F5] text-[#1A0F0A] text-xs sm:text-sm focus:ring-2 focus:ring-[#D94F1D]/20 focus:border-[#D94F1D] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#3D2315] mb-1.5">
                        Application Name *
                      </label>
                      <select
                        required
                        value={formData.appName}
                        onChange={(e) => {
                          const val = e.target.value;
                          const matched = PUBLIXA_APPS.find((a) => a.name === val);
                          setFormData({
                            ...formData,
                            appName: val,
                            packageName: matched ? matched.packageName : formData.packageName,
                          });
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#F0DFD5] bg-[#FFF9F5] text-[#1A0F0A] text-xs sm:text-sm focus:ring-2 focus:ring-[#D94F1D]/20 focus:border-[#D94F1D] focus:outline-hidden"
                      >
                        <option value="">-- Select an Application --</option>
                        {formData.appName &&
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
                    <div>
                      <label className="block text-xs font-bold text-[#3D2315] mb-1.5">
                        Package Name (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. com.doc.docx.to.pdf.converter.app"
                        value={formData.packageName}
                        onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#F0DFD5] bg-[#FFF9F5] text-[#1A0F0A] text-xs font-mono focus:ring-2 focus:ring-[#D94F1D]/20 focus:border-[#D94F1D] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3D2315] mb-1.5">
                      Type of Request *
                    </label>
                    <select
                      value={formData.requestType}
                      onChange={(e) => setFormData({ ...formData, requestType: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#F0DFD5] bg-[#FFF9F5] text-[#1A0F0A] text-xs sm:text-sm focus:ring-2 focus:ring-[#D94F1D]/20 focus:border-[#D94F1D] focus:outline-hidden"
                    >
                      <option value="Data Deletion">Request Data Deletion (Telemetry, Diagnostic Identifiers)</option>
                      <option value="Account Deletion">Request Account Deletion (Full profile &amp; records)</option>
                      <option value="Complete Wipe">Complete Wipe (All historical logs &amp; support emails)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3D2315] mb-1.5">
                      Additional Details / Advertising ID (Optional)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Provide any specific device IDs, dates of use, or notes to help us locate records."
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#F0DFD5] bg-[#FFF9F5] text-[#1A0F0A] text-xs sm:text-sm focus:ring-2 focus:ring-[#D94F1D]/20 focus:border-[#D94F1D] focus:outline-hidden"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#D94F1D] hover:bg-[#C4461A] text-white text-xs sm:text-sm font-bold transition shadow-md cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit via Gmail / Email</span>
                    </button>
                    <p className="text-[11px] sm:text-xs text-[#665349]">
                      Opens Gmail with all request data pre-filled directly to <strong>publixaorignal@gmail.com</strong>
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right Info Box */}
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F0DFD5] shadow-xs space-y-4">
              <h3 className="text-sm sm:text-base font-bold text-[#1A0F0A] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#D94F1D]" />
                <span>Deletion Timeline &amp; Protocol</span>
              </h3>
              <div className="space-y-3 text-xs sm:text-sm text-[#3D2315] leading-relaxed">
                <p>
                  <strong>1. Ownership Check:</strong> We verify the email address or Advertising ID associated with your submission.
                </p>
                <p>
                  <strong>2. Scope of Purge:</strong> All diagnostic logs, crash reports, and support threads associated with the identifier are permanently removed.
                </p>
                <p>
                  <strong>3. Timeline:</strong> Completed within 7 to 14 business days with email confirmation.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F0DFD5] shadow-xs space-y-3">
              <h3 className="text-sm sm:text-base font-bold text-[#1A0F0A] flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D94F1D]" />
                <span>Direct Support Desk</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#665349]">
                You can also email our compliance officer directly:
              </p>
              <div className="p-3 bg-[#FFF9F5] rounded-xl border border-[#F0DFD5] font-mono text-xs text-[#D94F1D] font-semibold break-all">
                publixaorignal@gmail.com
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DataDeletionPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-[#8C7A70] text-sm">Loading Deletion Portal...</div>}>
      <DataDeletionContent />
    </Suspense>
  );
}
