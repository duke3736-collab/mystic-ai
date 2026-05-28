import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://mystic.weknews.com';

  const pages = ['daily', 'ohaasa', 'saju', 'tarot'];

  const pageUrls = pages.map((page) => ({
    url: `${baseUrl}/${page}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1.0,
    },
    ...pageUrls,
  ];
}
