'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

const MusicIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M9 18V5l12-2v13"/>
    <circle cx="6" cy="18" r="3"/>
    <circle cx="18" cy="16" r="3"/>
  </svg>
);

export function Navigation({ locale }: { locale: string }) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const other = locale === 'fr' ? 'en' : 'fr';
  const otherPath = pathname.replace(`/${locale}`, `/${other}`);

  const links = [
    { path: `/${locale}/fragments`, label: t('fragments') },
    { path: `/${locale}/cercles`, label: t('cercles') },
    { path: `/${locale}/communaute`, label: t('communaute') },
    { path: `/${locale}/audio`, icon: <MusicIcon />, label: null },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav className="glass rounded-full px-7 py-3.5 flex items-center justify-between w-full max-w-lg">

        {/* Accueil */}
        <Link
          href={`/${locale}`}
          className="text-[11px] uppercase tracking-[0.18em] transition-all duration-500 hover:opacity-70 shrink-0"
          style={{ color: 'var(--gold)', fontWeight: 400 }}
        >
          {locale === 'fr' ? 'Accueil' : 'Home'}
        </Link>

        {/* Séparateur */}
        <div className="hidden sm:flex items-center gap-7 mx-6">
          {links.map(({ path, label, icon }) => (
            <Link
              key={path}
              href={path}
              className={`flex items-center gap-1.5 text-[11px] uppercase tracking-[0.13em] transition-colors duration-500 ${
                pathname === path ? 'text-ink-800' : 'text-ink-500 hover:text-ink-700'
              }`}
              style={{ fontWeight: 400 }}
              title={path.includes('audio') ? (locale === 'fr' ? 'Pistes audio' : 'Audio tracks') : undefined}
            >
              {icon && <span className="opacity-80">{icon}</span>}
              {label && <span>{label}</span>}
            </Link>
          ))}
        </div>

        {/* Droite */}
        <div className="flex items-center gap-4 shrink-0">
          <Link
            href={`/${locale}/premium`}
            className="badge-premium hidden sm:block whitespace-nowrap"
          >
            {locale === 'fr' ? 'Accès complet' : 'Full access'}
          </Link>
          <Link
            href={otherPath}
            className="text-[11px] uppercase tracking-[0.13em] transition-colors duration-500 hover:opacity-70"
            style={{ color: 'var(--gold)', fontWeight: 400 }}
          >
            {other}
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
