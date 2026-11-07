import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getAppBySlug, getAllApps } from '@/lib/db';
import { assetPath } from '@/lib/paths';
import {
  ShieldCheck,
  Lock,
  Smartphone,
  CheckCircle2,
  ExternalLink,
  ArrowLeft,
  Calendar,
  AlertTriangle,
  Info,
  Trash2,
  Mail,
  ChevronRight
} from 'lucide-react';

interface AppPrivacyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const apps = getAllApps();
  return apps.map((app) => ({
    slug: app.slug,
  }));
}

// Generates customized privacy parameters matching the user's exact policy structure
function getAppPrivacyDetails(app: { name: string; category: string }) {
  const name = app.name;
  if (name.includes('PPT') || name.includes('PowerPoint')) {
    return {
      coreDataType: 'Presentation Files',
      coreDescription: 'The app accesses presentation files stored on your device only to provide its core functionality.',
      actions: [
        'Opening PPT and PPTX files',
        'Viewing presentations',
        'Editing presentations (if supported)',
        'Searching text inside presentations',
        'Managing presentation files (renaming, moving, copying, deleting)',
        'Sharing presentations with other installed applications',
        'Printing presentations to connected or wireless printers',
        'Organizing recent and favorite presentations',
      ],
      retentionNote: 'Your presentation files remain on your device unless you explicitly choose to share them.',
    };
  }
  if (name.includes('Excel') || name.includes('XLS')) {
    return {
      coreDataType: 'Spreadsheet & Workbook Files',
      coreDescription: 'The app accesses spreadsheet files stored on your device only to provide its core functionality.',
      actions: [
        'Opening XLS and XLSX workbooks',
        'Viewing multi-sheet tables and cell calculations',
        'Searching cell values and rows',
        'Managing spreadsheet files (renaming, copying, moving, deleting)',
        'Exporting or sharing workbooks with other applications',
        'Printing spreadsheets to wireless printers',
        'Organizing recent workbooks',
      ],
      retentionNote: 'Your spreadsheet files remain strictly on your device unless you explicitly choose to share them.',
    };
  }
  if (name.includes('PDF') || name.includes('Doc') || name.includes('Document') || name.includes('TXT')) {
    return {
      coreDataType: 'Document & Conversion Files',
      coreDescription: 'The app accesses document files stored on your device only to deliver local viewing and conversion functionality.',
      actions: [
        'Opening DOC, DOCX, PDF, and text documents',
        'Converting document formats entirely offline on your device',
        'Searching text inside documents',
        'Managing files (renaming, moving, copying, deleting)',
        'Sharing converted or viewed documents',
        'Organizing favorite and recently opened documents',
      ],
      retentionNote: 'All document parsing and conversion executes 100% locally on your device without cloud uploads.',
    };
  }
  if (name.includes('VPN')) {
    return {
      coreDataType: 'Network Tunnel Configurations',
      coreDescription: 'The app accesses Android VPN service APIs only to establish secure, encrypted proxy tunnels.',
      actions: [
        'Creating local Android VpnService routing tunnels',
        'Selecting and connecting to encrypted global proxy nodes',
        'Checking real-time tunnel speed and connectivity status',
        'Enforcing strict zero-logging of websites or visited URLs',
      ],
      retentionNote: 'We maintain an absolute zero-logs policy. We do not inspect, log, store, or sell user browsing history.',
    };
  }
  if (name.includes('SoundBox') || name.includes('Voice Alert')) {
    return {
      coreDataType: 'Notification Text & Audio Alerts',
      coreDescription: 'The app processes payment notifications on your device only to speak voice payment alerts.',
      actions: [
        'Detecting verified UPI notification alerts on the local device',
        'Converting received payment amounts into multi-lingual speech audio',
        'Maintaining an offline transaction log for merchant reconciliation',
        'Customizing announcement voices and audio volume',
      ],
      retentionNote: 'Notification processing happens entirely on your local phone. No banking passwords or PINs are ever collected.',
    };
  }
  if (name.includes('ID') || name.includes('Photo') || name.includes('Passport')) {
    return {
      coreDataType: 'User Photos & ID Badge Designs',
      coreDescription: 'The app accesses user-selected photos and camera captures only to create, customize, and export ID cards, badges, and passport photo layouts on your device.',
      actions: [
        'Selecting and cropping photos for passport and pass-size formats',
        'Applying card templates (student, staff, badge, event passes)',
        'Customizing fonts, colors, badges, QR codes, barcodes, and signatures',
        'Generating print-ready photo sheets (1, 2, 4, 6, 8-photo layouts)',
        'Exporting and saving finished designs in high resolution to local device storage',
        'Printing or sharing finished designs directly to connected printers or apps',
      ],
      retentionNote: 'All card design editing and photo cropping happens 100% locally on your device. We do not upload or store your personal photos on any cloud server.',
    };
  }

  return {
    coreDataType: 'Local Application Files & Data',
    coreDescription: `The app accesses files and settings stored on your device only to deliver core ${name} functionality.`,
    actions: [
      `Running core ${name} features offline on your device`,
      'Managing user preferences and saved local settings',
      'Searching or organizing local application content',
      'Exporting or sharing user-selected files',
    ],
    retentionNote: 'All user data and settings remain on your local device unless you explicitly share them.',
  };
}

export default async function AppPrivacyPolicyPage({ params }: AppPrivacyPageProps) {
  const { slug } = await params;
  const app = getAppBySlug(slug);

  if (!app) {
    notFound();
  }

  const isCustomIcon = app.icon && app.icon.startsWith('/');
  const details = getAppPrivacyDetails(app);

  // Normalize permissions
  const normalizedPermissions = (app.permissions || []).map((p) => {
    if (typeof p === 'string') {
      const parts = p.split('(');
      return {
        name: parts[0].trim(),
        purpose: parts[1] ? parts[1].replace(')', '').trim() : 'Operational runtime requirement.'
      };
    }
    return p;
  });

  return (
    <div className="w-full bg-[#FFFAF6] min-h-screen text-[#1A0F0A] py-10 lg:py-16">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top Navigation Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-[#8C7A70]">
            <Link href="/privacy" className="hover:text-[#D94F1D] transition flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" />
              <span>Privacy Directory</span>
            </Link>
            <span>/</span>
            <Link href={`/apps/${app.slug}`} className="hover:text-[#D94F1D] transition">
              {app.name}
            </Link>
            <span>/</span>
            <span className="text-[#D94F1D]">Privacy Policy</span>
          </div>

          <Link
            href={`/apps/${app.slug}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-[#FFF9F5] text-xs font-bold text-[#1A0F0A] border border-[#F0DFD5] transition shadow-xs"
          >
            <span>View App Landing Page</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#D94F1D]" />
          </Link>
        </div>

        {/* Header Hero Banner */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#F0DFD5] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#F0DFD5]">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-[#FFF4ED] border border-[#F0DFD5] p-1 flex items-center justify-center text-4xl shrink-0 overflow-hidden relative shadow-xs">
                {isCustomIcon ? (
                  <Image
                    src={assetPath(app.icon)}
                    alt={app.name}
                    width={72}
                    height={72}
                    className="object-cover rounded-xl w-full h-full"
                  />
                ) : (
                  <span>{app.icon || '📱'}</span>
                )}
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D94F1D] bg-[#FFF0E6] px-3.5 py-1 rounded-full mb-2 border border-[#FFDFC8]">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Dedicated Application Privacy Policy</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A0F0A] tracking-tight leading-tight">
                  Privacy Policy for {app.name}
                </h1>
                <p className="text-sm font-mono text-[#D94F1D] font-bold mt-1">
                  Package ID: {app.packageName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {app.playStoreUrl && (
                <a
                  href={app.playStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-full bg-[#D94F1D] hover:bg-[#C4461A] text-white text-xs sm:text-sm font-bold transition shadow-md flex items-center gap-2"
                >
                  <span>Google Play Listing</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-[#8C7A70] font-bold">
            <span className="flex items-center gap-1.5 text-[#1A0F0A]">
              <Calendar className="w-4 h-4 text-[#D94F1D]" />
              Effective Date: July 15, 2026
            </span>
            <span>•</span>
            <span>Last Updated: September 2026</span>
            <span>•</span>
            <span className="text-[#1A0F0A]">Developer: Prince Developer</span>
          </div>
        </div>

        {/* Intro Statement */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#F0DFD5] space-y-4 shadow-xs">
          <p className="text-sm sm:text-base text-[#1A0F0A] leading-relaxed font-medium">
            Thank you for using <strong>{app.name}</strong> (&ldquo;the App&rdquo;). Your privacy is important to us. This Privacy Policy explains how we collect, use, store, and protect your information when you use our application.
          </p>
          <p className="text-sm sm:text-base text-[#665349] leading-relaxed">
            By using the App, you agree to the practices described in this Privacy Policy.
          </p>
        </div>

        {/* Information We Collect */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#F0DFD5] space-y-6 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1A0F0A] flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-[#D94F1D]" />
            <span>Information We Collect</span>
          </h2>

          <div className="space-y-6">
            {/* 1. Core App Files */}
            <div className="p-6 rounded-2xl bg-[#FFF9F5] border border-[#F0DFD5] space-y-3">
              <h3 className="text-lg font-bold text-[#D94F1D]">
                1. {details.coreDataType}
              </h3>
              <p className="text-sm text-[#3D2315] leading-relaxed">
                {details.coreDescription}
              </p>
              <p className="text-sm font-semibold text-[#1A0F0A]">This includes:</p>
              <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm text-[#3D2315]">
                {details.actions.map((act, i) => (
                  <li key={i}>{act}</li>
                ))}
              </ul>
              <p className="text-xs sm:text-sm text-emerald-700 font-semibold pt-2">
                {details.retentionNote}
              </p>
            </div>

            {/* 2. Device Information */}
            <div className="p-6 rounded-2xl bg-[#FFF9F5] border border-[#F0DFD5] space-y-3">
              <h3 className="text-lg font-bold text-[#D94F1D]">
                2. Device Information
              </h3>
              <p className="text-sm text-[#3D2315] leading-relaxed">
                The app may automatically collect limited technical information including:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm text-[#3D2315]">
                <li>Device model and manufacturer</li>
                <li>Android operating system version</li>
                <li>Application version installed</li>
                <li>Language and locale settings</li>
                <li>Crash reports and unhandled native exceptions</li>
                <li>Performance and memory diagnostics</li>
              </ul>
              <p className="text-xs sm:text-sm text-[#8C7A70]">
                This information is used solely to improve app performance and reliability.
              </p>
            </div>

            {/* 3. Advertising Data */}
            <div className="p-6 rounded-2xl bg-[#FFF9F5] border border-[#F0DFD5] space-y-3">
              <h3 className="text-lg font-bold text-[#D94F1D]">
                3. Advertising Data
              </h3>
              <p className="text-sm text-[#3D2315] leading-relaxed">
                If the app displays advertisements through Google AdMob, Google may collect certain information, including:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm text-[#3D2315]">
                <li>Advertising ID (GAID)</li>
                <li>Non-personally identifiable device identifiers</li>
                <li>IP address (used solely for geographic routing)</li>
                <li>Approximate location</li>
                <li>App interactions and impressions</li>
                <li>Ad performance and click attribution</li>
              </ul>
              <p className="text-xs sm:text-sm text-[#3D2315]">
                This information helps provide relevant, non-intrusive advertisements to keep our software free.
              </p>
              <div className="pt-1">
                <a
                  href="https://policies.google.com/technologies/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D94F1D] hover:underline"
                >
                  <span>Learn more: Google Ad Technologies</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Permissions Used */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#F0DFD5] space-y-6 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1A0F0A]">
            Permissions Used
          </h2>
          <p className="text-sm text-[#665349] leading-relaxed">
            Depending on your Android version, <strong>{app.name}</strong> may request runtime permissions such as:
          </p>

          <div className="grid grid-cols-1 gap-4">
            <div className="p-5 rounded-2xl bg-[#FFF9F5] border border-[#F0DFD5] space-y-2">
              <span className="font-mono font-bold text-[#D94F1D] text-sm">
                Storage Access (READ / WRITE EXTERNAL STORAGE)
              </span>
              <p className="text-xs sm:text-sm text-[#3D2315]">
                Used to open, read, save, import, export, and organize user-selected files on your phone.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFF9F5] border border-[#F0DFD5] space-y-2">
              <span className="font-mono font-bold text-[#D94F1D] text-sm">
                Notification Permission (POST_NOTIFICATIONS)
              </span>
              <p className="text-xs sm:text-sm text-[#3D2315]">
                Used only if the app provides download notifications, conversion alerts, or background task completion updates.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFF9F5] border border-[#F0DFD5] space-y-2">
              <span className="font-mono font-bold text-[#D94F1D] text-sm">
                All Files Access / Manage External Storage (Android 11+, if enabled)
              </span>
              <p className="text-xs sm:text-sm text-[#3D2315]">
                Used only by file managers and document organizers to scan, rename, copy, move, and organize files across local directories. The permission is never used to access personal data unrelated to application management.
              </p>
            </div>

            {normalizedPermissions.length > 0 && (
              <div className="pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8C7A70] block mb-2">
                  All Declared Android Manifest Permissions for {app.name}:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {normalizedPermissions.map((perm, idx) => (
                    <div key={idx} className="p-3 bg-[#FFF9F5] rounded-xl border border-[#F0DFD5] text-xs font-mono text-[#D94F1D]">
                      {perm.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* How We Use Information */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#F0DFD5] space-y-4 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1A0F0A]">
            How We Use Information
          </h2>
          <p className="text-sm text-[#665349]">
            Information is used exclusively to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-xs sm:text-sm text-[#3D2315]">
            <li>Execute core features requested by the user</li>
            <li>Read, render, edit, and organize selected files</li>
            <li>Search content within local files</li>
            <li>Print or export user-initiated outputs</li>
            <li>Improve app performance, responsiveness, and memory usage</li>
            <li>Diagnose and resolve crashes and bugs</li>
            <li>Provide timely customer and technical support</li>
            <li>Display contextual advertisements through certified partner networks</li>
          </ul>
        </div>

        {/* Data Sharing */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#F0DFD5] space-y-4 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1A0F0A]">
            Data Sharing
          </h2>
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold">
            We do not sell your personal information.
          </div>
          <p className="text-sm text-[#665349] leading-relaxed">
            We may share limited anonymous technical telemetry only with trusted service providers including:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm text-[#3D2315]">
            <li>Google Play Services (Platform APIs &amp; licensing verification)</li>
            <li>Google AdMob (Contextual advertisements)</li>
            <li>Firebase Analytics (Operational performance insights, if enabled)</li>
            <li>Firebase Crashlytics (Crash monitoring &amp; stack traces, if enabled)</li>
          </ul>
          <p className="text-xs sm:text-sm text-[#8C7A70]">
            Each provider processes information according to its own privacy policy.
          </p>
        </div>

        {/* Data Security, Retention & Children's Privacy */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-[#F0DFD5] space-y-2.5 shadow-xs">
            <h3 className="font-bold text-[#1A0F0A] text-base">Data Security</h3>
            <p className="text-xs sm:text-sm text-[#665349] leading-relaxed">
              We use reasonable technical and organizational measures to protect your information. Although we strive to protect your data, no method of electronic transmission or storage is completely secure.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#F0DFD5] space-y-2.5 shadow-xs">
            <h3 className="font-bold text-[#1A0F0A] text-base">Data Retention</h3>
            <p className="text-xs sm:text-sm text-[#665349] leading-relaxed">
              Files remain on your device. The app does not upload your files to our servers. Technical logs and analytics may be retained by third-party service providers according to their own policies.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#F0DFD5] space-y-2.5 shadow-xs">
            <h3 className="font-bold text-[#1A0F0A] text-base">Children&apos;s Privacy</h3>
            <p className="text-xs sm:text-sm text-[#665349] leading-relaxed">
              This application is not directed toward children under 13 years of age. We do not knowingly collect personal information from children. If we become aware of inadvertent collection, we delete it promptly.
            </p>
          </div>
        </div>

        {/* Your Rights & International Users */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#F0DFD5] space-y-4 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1A0F0A]">
            Your Rights
          </h2>
          <p className="text-sm text-[#665349]">You may at any time:</p>
          <ul className="list-disc pl-6 space-y-2 text-xs sm:text-sm text-[#3D2315]">
            <li>Delete your files directly from your device storage</li>
            <li>Remove recent history and search cache</li>
            <li>Clear favorite documents and bookmarks</li>
            <li>Reset your Android Advertising ID in Device Settings &gt; Google &gt; Ads</li>
            <li>Uninstall the application whenever you choose</li>
          </ul>

          <div className="pt-4 border-t border-[#F0DFD5]">
            <h3 className="text-base font-bold text-[#1A0F0A] mb-1">International Users</h3>
            <p className="text-xs sm:text-sm text-[#665349] leading-relaxed">
              Your information may be processed in countries where our service providers operate. By using the app, you consent to such processing where permitted by applicable law.
            </p>
          </div>

          <div className="pt-2">
            <h3 className="text-base font-bold text-[#1A0F0A] mb-1">Changes to This Privacy Policy</h3>
            <p className="text-xs sm:text-sm text-[#665349] leading-relaxed">
              We may update this Privacy Policy periodically. Changes become effective immediately after publication. Users are encouraged to review this page regularly.
            </p>
          </div>
        </div>

        {/* Contact Us - Developer & Email */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#F0DFD5] space-y-4 shadow-xs">
          <div className="flex items-center gap-3">
            <Mail className="w-6 h-6 text-[#D94F1D]" />
            <h2 className="text-xl sm:text-2xl font-bold text-[#1A0F0A]">
              Contact Us
            </h2>
          </div>
          <p className="text-sm text-[#665349] leading-relaxed">
            If you have any questions about this Privacy Policy or require assistance, please contact us:
          </p>
          <div className="p-6 rounded-2xl bg-[#FFF9F5] border border-[#F0DFD5] text-sm font-mono space-y-2">
            <div>
              <span className="text-[#8C7A70]">Developer: </span>
              <strong className="text-[#1A0F0A]">Prince Developer</strong>
            </div>
            <div>
              <span className="text-[#8C7A70]">Email: </span>
              <a
                href="mailto:publixaorignal@gmail.com"
                className="text-[#D94F1D] font-bold hover:underline"
              >
                publixaorignal@gmail.com
              </a>
            </div>
            <div>
              <span className="text-[#8C7A70]">Application: </span>
              <span className="text-[#3D2315]">{app.name} ({app.packageName})</span>
            </div>
          </div>
        </div>

        {/* Data Deletion Quick Action */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#F0DFD5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1A0F0A] flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-rose-500" />
              <span>Data Deletion Request Portal</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#665349] max-w-xl">
              Submit a formal request to purge any technical telemetry or correspondence linked to your device identifier.
            </p>
          </div>
          <Link
            href={`/data-deletion?app=${encodeURIComponent(app.name)}&pkg=${encodeURIComponent(app.packageName)}`}
            className="px-6 py-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm transition shadow-sm shrink-0 inline-flex items-center gap-2"
          >
            <span>Delete Data for {app.name}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
