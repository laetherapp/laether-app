'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const ease = [0.16, 1, 0.3, 1] as const;

export default function HomePage() {
  const t = useTranslations('home');
  const { locale } = useParams<{ locale: string }>();
  const [showPresence, setShowPresence] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setShowPresence(true), 4000);
    return () => clearTimeout(id);
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-32">

      {/* Eyebrow */}
      <motion.p
        initial={{ opacity: 0, letterSpacing: '0.3em' }}
        animate={{ opacity: 0.6, letterSpacing: '0.2em' }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="font-display italic text-sm mb-8"
        style={{ color: 'rgba(42,40,32,0.55)' }}
      >
        {t('eyebrow')}
      </motion.p>

      {/* Title */}
      <div className="mb-6">
        {t('title').split('\n').map((line, i) => (
          <motion.h1
            key={i}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.8, ease, delay: 0.4 + i * 0.25 }}
            className="font-display text-[48px] sm:text-[64px] leading-[1.1] text-ink-800"
            style={{ fontWeight: 500, textShadow: '0 2px 20px rgba(255,255,255,0.8)' }}
          >
            {line}
          </motion.h1>
        ))}
      </div>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 1, ease }}
        className="divider my-6"
      />

      {/* Subtitle */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, delay: 1.1, ease }}
        className="mb-10 space-y-1"
      >
        {t('subtitle').split('\n').map((line, i) => (
          <p key={i} className="text-[15px]" style={{ color: 'rgba(42,40,32,0.65)', textShadow: '0 1px 8px rgba(255,255,255,0.6)' }}>
            {line}
          </p>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, delay: 1.6, ease }}
      >
        <Link
          href={`/${locale}/fragments`}
          className="glass rounded-full px-10 py-4 text-[12px] uppercase tracking-[0.2em] text-ink-700 hover:text-ink-900 transition-all duration-700 hover:scale-105 inline-block"
          style={{ fontWeight: 400 }}
        >
          {t('cta')}
        </Link>
      </motion.div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ delay: 2.5, duration: 2 }}
        className="mt-16 text-[11px] uppercase tracking-[0.25em]"
        style={{ color: 'rgba(42,40,32,0.4)', letterSpacing: '0.22em' }}
      >
        {t('tagline')}
      </motion.p>

      {/* Presence */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: showPresence ? 0.4 : 0 }}
        transition={{ duration: 2 }}
        className="mt-4 text-[12px] tracking-wide"
        style={{ color: 'rgba(42,40,32,0.4)' }}
      >
        {t('presence')}
      </motion.p>
    </section>
  );
}
