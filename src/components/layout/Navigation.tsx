'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

const MusicIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
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
    { path: `/${locale}`, label: locale === 'fr' ? 'Accueil' : 'Home', gold: true },
    { path: `/${locale}/fragments`, label: t('fragments') },
    { path: `/${locale}/cercles`, label: t('cercles') },
    { path: `/${locale}/communaute`, label: t('communaute') },
    { path: `/${locale}/audio`, label: null, icon: <MusicIcon /> },
    { path: `/${locale}/premium`, label: locale === 'fr' ? 'Accès complet' : 'Full access', badge: true },
    { path: otherPath, label: other.toUpperCase(), gold: true, external: true },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav
        className="hidden sm:flex items-center justify-between px-6 py-2.5 rounded-full w-full max-w-2xl"
        style={{
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          border: '1px solid rgba(255,255,255,0.18)',
          boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
        }}
      >
        {links.map(({ path, label, icon, gold, badge, external }) => {
          const active = pathname === path;
          if (badge) {
            return (
              <Link key={path} href={path} className="badge-premium">
                {label}
              </Link>
            );
          }
          return (
            <Link
              key={path}
              href={path}
              className={`flex items-center gap-1 text-[10.5px] uppercase tracking-[0.14em] transition-all duration-500 whitespace-nowrap ${
                active ? 'opacity-100' : 'opacity-60 hover:opacity-90'
              }`}
              style={{
                color: gold ? 'var(--gold)' : 'rgba(42,40,32,0.85)',
                fontWeight: active ? 400 : 300,
              }}
            >
              {icon}
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Mobile — logo seul */}
      <div
        className="sm:hidden flex items-center justify-between px-5 py-2.5 rounded-full w-full"
        style={{
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          border: '1px solid rgba(255,255,255,0.18)',
        }}
      >
        <Link href={`/${locale}`} className="font-display italic text-[14px]" style={{ color: 'var(--gold)', fontWeight: 400 }}>
          L. Aether
        </Link>
        <Link href={otherPath} className="text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--gold)' }}>
          {other}
        </Link>
      </div>
    </motion.header>
  );
}
