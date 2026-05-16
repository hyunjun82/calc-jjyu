import type { MetadataRoute } from 'next';
import { CALCULATORS, CATEGORIES } from '@/lib/data/calculators';
import { SITE } from '@/lib/format';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE.url, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    ...CATEGORIES.map(c => ({
      url: `${SITE.url}/category/${c.slug}`,
      lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8,
    })),
    ...CALCULATORS.map(c => ({
      url: `${SITE.url}/calc/${c.slug}`,
      lastModified: now, changeFrequency: 'monthly' as const, priority: 0.9,
    })),
    { url: `${SITE.url}/about`, priority: 0.3 },
    { url: `${SITE.url}/privacy`, priority: 0.3 },
    { url: `${SITE.url}/terms`, priority: 0.3 },
  ];
}
