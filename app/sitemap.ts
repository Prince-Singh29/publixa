import type { MetadataRoute } from 'next';
import { getAllApps } from '@/lib/db';
import { ALL_PDF_TOOLS, ALL_WEB_TOOLS } from '@/lib/seoToolsData';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://publixa.store';
  const apps = getAllApps();
  const now = new Date();

  const staticRoutes = [
    '',
    '/pdf',
    '/docs',
    '/excel',
    '/slides',
    '/tools',
    '/apps',
    '/privacy',
    '/about',
    '/contact',
    '/data-deletion',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: route === '' || route === '/pdf' || route === '/tools' ? 1.0 : 0.85,
  }));

  const pdfToolRoutes = ALL_PDF_TOOLS.map((tool) => ({
    url: `${baseUrl}/pdf/${tool.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const webToolRoutes = ALL_WEB_TOOLS.map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const appRoutes = apps.flatMap((app) => [
    {
      url: `${baseUrl}/apps/${app.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy/${app.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ]);

  return [...staticRoutes, ...pdfToolRoutes, ...webToolRoutes, ...appRoutes];
}
