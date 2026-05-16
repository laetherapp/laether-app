'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
    <path d="M9 21V12h6v9"/>
  </svg>
);

const FragIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M4 6h16M4 11h10M4 16h7"/>
  </svg>
);

const CircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="9" cy="8" r="3"/>
    <circle cx="17" cy="8" r="2.5"/>
    <path d="M3 20c0-3.3 2.7-6 6-6h4c.5 0 1 .1 1.5.2"/>
    <path d="M14 18c0-2.2 1.8-4 4-4s4 1.8 4 4"/>
  </svg>
);

const TogetherIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M12 21a9 9 0 100-18 9 9 0 000 18z"/>
    <path d="M3.6 9h16.8M3.6 15h16.8"/>
    <path d="M12 3c-2.5 3-4 5.5-4 9s1.5 6 4 9"/>
    <path d="M12 3c2.5 3 4 5.5 4 9s-1.5 6-4 9"/>
  </svg>
);

const MusicIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M9 18V5l12-2v13"/>
    <circle cx="6" cy="18" r="3"/>
    <circle cx="18" cy="16" r="3"/>
  </svg>
);

export function BottomNav({ locale }: { locale: string }) {
  const pathname = usePathname();
  const t = useTranslations('nav');

  const links = [
    { path: `/${locale}`, icon: <HomeIcon />, label: locale === 'fr' ? 'Accueil' : 'Home' },
    { path: `/${locale}/fragments`, icon: <FragIcon />, label: t('fragments') },
    { path: `/${locale}/cercles`, icon: <CircleIcon />, label: t('cercles') },
    { path: `/${locale}/communaute`, icon: <TogetherIcon />, label: t('communaute') },
    { path: `/${locale}/audio`, icon: <MusicIcon />, label: t('audio') },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="sm:hidden fixed bottom-4 inset-x-0 z-50 flex justify-center px-4"
    >
      <nav className="glass-strong rounded-full px-2 py-2 flex items-center gap-1">
        {links.map(({ path, icon, label }) => {
          const active = pathname === path;
          return (
            <Link
              key={path}
              href={path}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-full transition-all duration-500 min-w-[48px] ${
                active ? 'text-ink-800' : 'text-ink-500'
              }`}
              style={active ? { background: 'rgba(184,148,74,0.15)' } : {}}
            >
              {icon}
              <span className="text-[8px] uppercase tracking-[0.06em]">{label.slice(0, 4)}</span>
            </Link>
          );
        })}
      </nav>
    </motion.div>
  );
}
