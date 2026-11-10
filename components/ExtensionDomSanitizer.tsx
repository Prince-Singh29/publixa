'use client';

function cleanNodeAttrs(el: Element) {
  if (!el || !el.attributes) return;
  const toRemove: string[] = [];
  for (let i = 0; i < el.attributes.length; i++) {
    const name = el.attributes[i].name;
    if (
      name === 'bis_skin_checked' ||
      name === 'bis_register' ||
      name === 'bis_id' ||
      name === 'bis_size' ||
      name.startsWith('bis_') ||
      name.startsWith('__processed_')
    ) {
      toRemove.push(name);
    }
  }
  for (const attr of toRemove) {
    el.removeAttribute(attr);
  }
}

export function scrubExtensionAttributes() {
  if (typeof document === 'undefined') return;
  const targets = document.querySelectorAll('[bis_skin_checked],[bis_register],[bis_id],[bis_size]');
  targets.forEach(cleanNodeAttrs);
  cleanNodeAttrs(document.documentElement);
  if (document.body) {
    cleanNodeAttrs(document.body);
    const bodyEls = document.body.getElementsByTagName('*');
    for (let i = 0; i < bodyEls.length; i++) {
      if (bodyEls[i].attributes.length > 0) {
        for (let j = bodyEls[i].attributes.length - 1; j >= 0; j--) {
          const n = bodyEls[i].attributes[j].name;
          if (n.startsWith('bis_') || n.startsWith('__processed_')) {
            bodyEls[i].removeAttribute(n);
          }
        }
      }
    }
  }
}

// Run synchronously at module evaluation time (right before React hydrateRoot)
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  scrubExtensionAttributes();
}

export default function ExtensionDomSanitizer() {
  return null;
}

