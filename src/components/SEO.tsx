import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  canonical?: string;
  noindex?: boolean;
  jsonLd?: Record<string, any>;
}

const defaultSEO = {
  title: 'yma16 - 前端开发工具集 | 免费在线工具',
  description: 'yma16 前端开发工具集提供代码格式化、组件生成器、性能检测、SVG处理、URL编解码等免费在线工具，提升前端开发效率。',
  keywords: '前端工具,代码格式化,组件生成器,性能检测,SVG处理,URL编解码,在线工具,前端开发',
  author: 'yma16',
  ogImage: 'https://yma16.cloud/og-image.png',
};

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  author = defaultSEO.author,
  ogTitle,
  ogDescription,
  ogImage = defaultSEO.ogImage,
  ogUrl,
  canonical,
  noindex = false,
  jsonLd,
}) => {
  const finalTitle = title ? `${title} | yma16 前端工具集` : defaultSEO.title;
  const finalDescription = description || defaultSEO.description;
  const finalKeywords = keywords || defaultSEO.keywords;
  const finalOgTitle = ogTitle || title || defaultSEO.title;
  const finalOgDescription = ogDescription || finalDescription;

  return (
    <Helmet>
      {/* 基础 Meta */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={finalOgTitle} />
      <meta property="og:description" content={finalOgDescription} />
      <meta property="og:image" content={ogImage} />
      {ogUrl && <meta property="og:url" content={ogUrl} />}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalOgTitle} />
      <meta name="twitter:description" content={finalOgDescription} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* 百度验证（如果需要） */}
      <meta name="baidu-site-verification" content="" />
      
      {/* JSON-LD 结构化数据 */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

// 预定义的 JSON-LD 模板
export const createWebsiteJsonLd = (url: string = 'https://yma16.cloud') => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'yma16 前端开发工具集',
  url,
  description: '免费的前端开发在线工具集合',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${url}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
});

export const createToolJsonLd = (
  name: string,
  description: string,
  url: string,
  applicationCategory: string = 'DeveloperApplication'
) => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name,
  description,
  url,
  applicationCategory,
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'CNY',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '100',
  },
});

export default SEO;
