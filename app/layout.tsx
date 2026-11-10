import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ExtensionDomSanitizer from '@/components/ExtensionDomSanitizer';
import { assetPath } from '@/lib/paths';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Publixa | Official Website & Application Directory',
  description:
    'Publixa develops and operates mobile applications and digital services. Legal Entity: Prince Kumar Singh. Access verified developer information, app directory, privacy policies, and data deletion requests.',
  keywords: [
    'Publixa',
    'Prince Kumar Singh',
    'Android Developer',
    'Mobile Applications',
    'Privacy Policy',
    'Excel Reader',
    'PDF Converter',
    'publixa.store'
  ],
  authors: [{ name: 'Prince Kumar Singh (Publixa)' }],
  openGraph: {
    title: 'Publixa - Apps. Privacy. Trust.',
    description: 'Official verified developer site for Publixa applications, privacy compliance, and user trust.',
    url: 'https://publixa.store',
    siteName: 'Publixa',
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: [
      { url: assetPath('/favicon.ico'), sizes: 'any' },
      { url: assetPath('/logo.png'), type: 'image/png' },
    ],
    shortcut: assetPath('/logo.png'),
    apple: assetPath('/logo.png'),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${jetbrainsMono.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window === 'undefined' || typeof document === 'undefined') return;
                function isExtAttr(n) {
                  return n && (n.indexOf('bis_') === 0 || n.indexOf('__processed_') === 0);
                }
                function cleanEl(el) {
                  if (!el || !el.attributes) return;
                  for (var i = el.attributes.length - 1; i >= 0; i--) {
                    var n = el.attributes[i].name;
                    if (isExtAttr(n)) el.removeAttribute(n);
                  }
                }
                function sweep() {
                  try {
                    var all = document.getElementsByTagName('*');
                    for (var i = 0; i < all.length; i++) cleanEl(all[i]);
                  } catch (err) {}
                }
                window.__publixaSweep = sweep;
                var origSetAttr = Element.prototype.setAttribute;
                Element.prototype.setAttribute = function(name) {
                  if (isExtAttr(String(name))) return;
                  return origSetAttr.apply(this, arguments);
                };
                if (typeof MutationObserver !== 'undefined') {
                  var mo = new MutationObserver(function(mutations) {
                    for (var i = 0; i < mutations.length; i++) {
                      var m = mutations[i];
                      if (m.type === 'attributes' && m.target && isExtAttr(m.attributeName)) {
                        try { m.target.removeAttribute(m.attributeName); } catch (e) {}
                      } else if (m.type === 'childList' && m.addedNodes) {
                        for (var j = 0; j < m.addedNodes.length; j++) {
                          var node = m.addedNodes[j];
                          if (node && node.nodeType === 1) {
                            cleanEl(node);
                            var sub = node.getElementsByTagName ? node.getElementsByTagName('*') : [];
                            for (var k = 0; k < sub.length; k++) cleanEl(sub[k]);
                          }
                        }
                      }
                    }
                  });
                  mo.observe(document.documentElement, { attributes: true, childList: true, subtree: true });
                }
                document.addEventListener('readystatechange', sweep, true);
                document.addEventListener('DOMContentLoaded', sweep, true);
                window.addEventListener('error', function(e) {
                  if (e.filename && (e.filename.indexOf('chrome-extension://') !== -1 || e.filename.indexOf('moz-extension://') !== -1)) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    return true;
                  }
                }, true);
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FFFAF6] text-[#1A0F0A] font-sans antialiased selection:bg-[#D94F1D] selection:text-white" suppressHydrationWarning>
        <ExtensionDomSanitizer />
        <Navbar />
        <main className="flex-grow w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
