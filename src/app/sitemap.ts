import { MetadataRoute } from 'next';

const BASE_URL = 'https://calc.jjyu.co.kr';

export default function sitemap(): MetadataRoute.Sitemap {
  const calculators = [
    '/calculators/real-estate/area',
    '/calculators/real-estate/brokerage',
    '/calculators/real-estate/subscription',
    '/calculators/tax/capital-gains',
    '/calculators/tax/acquisition',
    '/calculators/tax/property',
    '/calculators/tax/comprehensive',
    '/calculators/tax/gift',
    '/calculators/tax/inheritance',
    '/calculators/finance/loan',
    '/calculators/finance/deposit',
    '/calculators/finance/savings',
    '/calculators/finance/inflation',
    '/calculators/labor/salary',
    '/calculators/labor/severance',
  ];

  const now = new Date().toISOString();

  return [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...calculators.map((path) => ({
      url: `${BASE_URL}${path}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
