export const dynamic = 'force-dynamic';

import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/i18n';
import { Navigation } from '@/components/layout/Navigation';
import { BottomNav } from '@/components/layout/BottomNav';
import { NotificationPrompt } from '@/components/layout/NotificationPrompt';
import '../globals.css';

type Props = { children: React.ReactNode; params: { locale: string } };

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  if (!locales.includes(locale as Locale)) notFound();
  const t = await getTranslations({ locale, namespace: 'meta' });
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.justecontinuer.com';
  return {
    title: { default: t('title'), template: `%s — ${t('siteName')}` },
    description: t('description'),
    metadataBase: new URL(url),
    manifest: '/manifest.json',
    openGraph: { title: t('title'), description: t('description'), locale: locale === 'fr' ? 'fr_FR' : 'en_US', type: 'website' },
    appleWebApp: { capable: true, statusBarStyle: 'default', title: t('siteName') },
    icons: {
      icon: [{ url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }, { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }],
      apple: '/icons/apple-touch-icon.png',
    },
  };
}

export const viewport: Viewport = {
  themeColor: '#FAF8F2',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export default async function LocaleLayout({ children, params: { locale } }: Props) {
  if (!locales.includes(locale as Locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <script dangerouslySetInnerHTML={{
          __html: `if('serviceWorker'in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js').catch(()=>{})})}`
        }} />
      </head>
      <body className="bg-immersive">
        <NextIntlClientProvider messages={messages}>
          <Navigation locale={locale} />
          <main className="min-h-screen">{children}</main>
          <BottomNav locale={locale} />
          <NotificationPrompt locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
