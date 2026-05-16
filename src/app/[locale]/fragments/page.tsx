'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useFragments } from '@/lib/hooks/useFragments';
import { FeatherReaction } from '@/components/fragments/FeatherReaction';
import type { Locale } from '@/lib/supabase/types';

const FREE_LIMIT = 3;
const ease = [0.16, 1, 0.3, 1] as const;

export default function FragmentsPage() {
  const t = useTranslations('fragments');
  const { locale } = useParams<{ locale: string }>();
  const { fragments, loading } = useFragments(locale as Locale);
  const [index, setIndex] = useState(0);
  const [showPresence, setShowPresence] = useState(false);
  const [key, setKey] = useState(0);

  const current = fragments[index] ?? null;
  const isLocked = index >= FREE_LIMIT;

  useEffect(() => {
    if (!current || isLocked) return;
    setShowPresence(false);
    const id = setTimeout(() => setShowPresence(true), 3500);
    return () => clearTimeout(id);
  }, [current?.id, isLocked]);

  const next = useCallback(() => {
    setShowPresence(false);
    setIndex(i => i + 1);
    setKey(k => k + 1);
  }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.key === ' ' || e.key === 'ArrowRight') && !isLocked) { e.preventDefault(); next(); }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [next, isLocked]);

  return (
    <section className="min-h-screen flex flex-col pt-24 pb-32 px-5">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease }}
        className="text-center mb-14 space-y-3"
      >
        <p className="text-[10px] uppercase tracking-[0.22em]" style={{ color: 'var(--gold)', opacity: 0.8 }}>
          {t('eyebrow')}
        </p>
        <div className="divider" />
        <div className="space-y-0.5">
          {t('subtitle').split('\n').map((line, i) => (
            <p key={i} className="text-[13px]" style={{ color: 'rgba(42,40,32,0.6)' }}>{line}</p>
          ))}
        </div>
      </motion.div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-sm mx-auto">

          {loading && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
              className="text-center font-display italic text-ink-500">{t('loading')}</motion.p>
          )}

          <AnimatePresence mode="wait">
            {!loading && current && !isLocked && (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.9, ease }}
              >
                {/* Fragment card */}
                <div className="glass-strong rounded-3xl p-8 sm:p-10 mb-8">
                  <p
                    className="font-display italic text-center leading-[1.9] whitespace-pre-line"
                    style={{ fontSize: '20px', color: 'rgba(42,40,32,0.88)', fontWeight: 400, letterSpacing: '0.015em' }}
                  >
                    {current.content}
                  </p>

                  {/* Presence */}
                  <AnimatePresence>
                    {showPresence && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5 }}
                        className="mt-6 text-center text-[11px] tracking-wide"
                        style={{ color: 'var(--gold)' }}
                      >
                        {t('presence')}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Feather reaction */}
                <div className="flex justify-center mb-8">
                  <FeatherReaction
                    fragmentId={current.id}
                    locale={locale as Locale}
                    label={t('reaction')}
                    reactedLabel={t('reacted')}
                  />
                </div>

                {/* Next button */}
                <div className="text-center">
                  <button
                    onClick={next}
                    className="text-[11px] uppercase tracking-[0.14em] transition-all duration-500 py-3 px-4"
                    style={{ color: 'rgba(42,40,32,0.4)', fontWeight: 300 }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'rgba(42,40,32,0.7)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(42,40,32,0.4)')}
                  >
                    {t('next')} →
                  </button>
                </div>

                {/* Counter */}
                <p className="text-center text-[11px] mt-3" style={{ color: 'rgba(42,40,32,0.25)' }}>
                  {index + 1} / {FREE_LIMIT}
                </p>
              </motion.div>
            )}

            {/* Paywall */}
            {!loading && isLocked && (
              <motion.div
                key="lock"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease }}
                className="text-center"
              >
                <div className="glass-strong rounded-3xl p-10 mb-8">
                  {/* Feather lock icon */}
                  <div className="mb-6 mx-auto w-16 h-16" style={{ filter: 'drop-shadow(0 0 12px rgba(184,148,74,0.4))' }}>
                    <svg viewBox="0 0 64 76" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full animate-breathe">
                      <path d="M32 4C46 20 56 37 32 72C8 37 18 20 32 4Z" stroke="#B8944A" strokeWidth="1" fill="rgba(184,148,74,0.08)"/>
                      <line x1="32" y1="4" x2="32" y2="72" stroke="#B8944A" strokeWidth="0.7" opacity="0.5"/>
                      <line x1="22" y1="20" x2="42" y2="26" stroke="#B8944A" strokeWidth="0.5" opacity="0.35"/>
                      <line x1="19" y1="32" x2="45" y2="37" stroke="#B8944A" strokeWidth="0.5" opacity="0.35"/>
                      <line x1="20" y1="44" x2="44" y2="48" stroke="#B8944A" strokeWidth="0.5" opacity="0.3"/>
                    </svg>
                  </div>
                  <div className="divider mb-6" />
                  <p className="font-display italic text-[22px] text-ink-800 mb-2" style={{ fontWeight: 400 }}>
                    {t('lock_title')}
                  </p>
                  <p className="text-[13px] mb-8 whitespace-pre-line" style={{ color: 'rgba(42,40,32,0.6)' }}>
                    {t('lock_body')}
                  </p>
                  <Link
                    href={`/${locale}/premium`}
                    className="glass-gold rounded-full px-8 py-3.5 text-[11px] uppercase tracking-[0.16em] transition-all duration-700 hover:scale-105 inline-block"
                    style={{ color: 'var(--gold)', fontWeight: 400 }}
                  >
                    {t('lock_cta')}
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
