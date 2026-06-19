import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined) ?? 'https://smartmobili.md';
const SITE_NAME = 'SmartMobili';
const LANGS = ['en', 'ro', 'ru'] as const;

const LOCALE_MAP: Record<string, string> = {
  en: 'en_US',
  ro: 'ro_MD',
  ru: 'ru_RU',
};

interface SeoHeadProps {
  title: string;
  description: string;
  lang: string;
  ogImage?: string;
  jsonLd?: object | object[];
  noIndex?: boolean;
}

export default function SeoHead({ title, description, lang, ogImage, jsonLd, noIndex }: SeoHeadProps) {
  const { pathname } = useLocation();
  const fullTitle = `${SITE_NAME} | ${title}`;
  const canonical = `${SITE_URL}${pathname}`;
  const image = ogImage ?? `${SITE_URL}/og-image.jpg`;

  const alternates = LANGS.map((l) => ({
    hrefLang: l,
    href: `${SITE_URL}${pathname.replace(/^\/(en|ro|ru)/, `/${l}`)}`,
  }));
  const xDefault = `${SITE_URL}${pathname.replace(/^\/(en|ro|ru)/, '/ro')}`;

  return (
    <Helmet>
      <html lang={lang} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      <link rel="canonical" href={canonical} />
      {alternates.map((alt) => (
        <link key={alt.hrefLang} rel="alternate" hrefLang={alt.hrefLang} href={alt.href} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={xDefault} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content={LOCALE_MAP[lang] ?? 'ro_MD'} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
