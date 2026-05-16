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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="font-display italic text-sm mb-8"
        style={{ color: 'rgba(80,60,30,0.7)', letterSpacing: '0.12em' }}
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
            className="font-display leading-[1.1]"
            style={{
              fontSize: 'clamp(40px, 8vw, 68px)',
              fontWeight: 500,
              color: 'rgba(40,30,15,0.88)',
              textShadow: '0 1px 12px rgba(255,255,255,0.6)',
            }}
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
          <p key={i} className="text-[15px]"
            style={{ color: 'rgba(50,38,18,0.75)', textShadow: '0 1px 6px rgba(255,255,255,0.5)' }}>
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
          className="rounded-full px-10 py-4 text-[12px] uppercase tracking-[0.2em] inline-block transition-all duration-700 hover:scale-105"
          style={{
            background: 'rgba(255,255,255,0.22)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: 'rgba(40,30,15,0.85)',
            fontWeight: 400,
          }}
        >
          {t('cta')}
        </Link>
      </motion.div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 2 }}
        className="mt-16 text-[11px] uppercase tracking-[0.25em]"
        style={{ color: 'rgba(50,38,18,0.55)' }}
      >
        {t('tagline')}
      </motion.p>

      {/* Presence */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: showPresence ? 1 : 0 }}
        transition={{ duration: 2 }}
        className="mt-4 text-[12px] tracking-wide"
        style={{ color: 'rgba(50,38,18,0.5)' }}
      >
        {t('presence')}
      </motion.p>
    </section>
  );
}
