'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const ease = [0.16, 1, 0.3, 1] as const;

export default function AudioPage() {
  const t = useTranslations('audio');
  const { locale } = useParams<{ locale: string }>();

  return (
    <section className="min-h-screen flex flex-col items-center justify-center pt-24 pb-32 px-5 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, ease }}
        className="max-w-xs mx-auto space-y-8"
      >
        {/* Headphone icon */}
        <div className="w-16 h-16 mx-auto animate-breathe">
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M12 32C12 19.85 20.95 10 32 10C43.05 10 52 19.85 52 32" stroke="rgba(184,148,74,0.5)" strokeWidth="1.2" fill="none"/>
            <rect x="8" y="30" width="10" height="16" rx="4" stroke="#B8944A" strokeWidth="1" fill="rgba(184,148,74,0.1)"/>
            <rect x="46" y="30" width="10" height="16" rx="4" stroke="#B8944A" strokeWidth="1" fill="rgba(184,148,74,0.1)"/>
          </svg>
        </div>

        <p className="text-[10px] uppercase tracking-[0.22em]" style={{ color: 'var(--gold)', opacity: 0.8 }}>
          {t('eyebrow')}
        </p>

        <div className="divider" />

        <h1 className="font-display text-[32px] text-ink-800" style={{ fontWeight: 500 }}>
          {t('title')}
        </h1>

        <p className="font-display italic text-[20px] text-ink-700" style={{ fontWeight: 400 }}>
          {t('coming_soon')}
        </p>

        <div className="space-y-0.5">
          {t('coming_body').split('\n').map((line, i) => (
            <p key={i} className="text-[13px]" style={{ color: 'rgba(42,40,32,0.55)' }}>{line}</p>
          ))}
        </div>

        <div className="divider" />

        <div className="glass-strong rounded-3xl p-6">
          <p className="text-[13px] mb-5" style={{ color: 'rgba(42,40,32,0.65)' }}>
            {t('lock_body')}
          </p>
          <Link
            href={`/${locale}/premium`}
            className="glass-gold rounded-full px-8 py-3 text-[11px] uppercase tracking-[0.14em] transition-all duration-700 hover:scale-105 inline-block"
            style={{ color: 'var(--gold)', fontWeight: 400 }}
          >
            {t('lock_cta')}
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
