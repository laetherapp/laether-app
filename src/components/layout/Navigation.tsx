'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export function Navigation({ locale }: { locale: string }) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const other = locale === 'fr' ? 'en' : 'fr';
  const otherPath = pathname.replace(`/${locale}`, `/${other}`);

  const links = [
    { path: `/${locale}/fragments`, label: t('fragments') },
    { path: `/${locale}/cercles`, label: t('cercles') },
    { path: `/${locale}/communaute`, label: t('communaute') },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav className="glass rounded-full px-5 py-3 flex items-center justify-between w-full max-w-md">
        {/* Accueil en doré */}
        <Link
          href={`/${locale}`}
          className="text-[12px] uppercase tracking-[0.16em] transition-all duration-500 hover:opacity-70"
          style={{ color: 'var(--gold)', fontWeight: 400 }}
        >
          {locale === 'fr' ? 'Accueil' : 'Home'}
        </Link>

        <div className="hidden sm:flex items-center gap-5">
          {links.map(({ path, label }) => (
            <Link
              key={path}
              href={path}
              className={`text-[11px] uppercase tracking-[0.12em] transition-colors duration-500 ${
                pathname === path ? 'text-ink-800' : 'text-ink-500 hover:text-ink-700'
              }`}
              style={{ fontWeight: 400 }}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href={`/${locale}/premium`} className="badge-premium hidden sm:block">
            {locale === 'fr' ? 'Accès complet' : 'Full access'}
          </Link>
          <Link
            href={otherPath}
            className="text-[11px] uppercase tracking-[0.12em] transition-colors duration-500 hover:opacity-70"
            style={{ color: 'var(--gold)', fontWeight: 400 }}
          >
            {other}
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
