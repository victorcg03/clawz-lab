import { MetadataRoute } from 'next';

// Simple multi-locale sitemap (es/en) for the main static routes so far.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const staticPaths = [''];
  const locales = ['es', 'en'];
  const entries: MetadataRoute.Sitemap = [];
  for (const path of staticPaths) {
    for (const locale of locales) {
      entries.push({
        url: `${base}/${locale}${path ? '/' + path : ''}`.replace(/\/$/, ''),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }
  return entries;
}
