'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { hasReactedTo, markReacted } from '@/lib/utils/anonymous';
import type { Locale } from '@/lib/supabase/types';

interface FeatherReactionProps {
  fragmentId: string;
  locale: Locale;
  label: string;
  reactedLabel: string;
  initialCount?: number;
}

const RealisticFeather = ({ glowing }: { glowing: boolean }) => (
  <svg viewBox="0 0 48 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="quill" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={glowing ? '#FDF6E3' : '#F0E6C8'} stopOpacity={glowing ? '0.95' : '0.7'}/>
        <stop offset="50%" stopColor={glowing ? '#EDD98A' : '#D4B86A'} stopOpacity={glowing ? '0.85' : '0.55'}/>
        <stop offset="100%" stopColor={glowing ? '#C9A84C' : '#A8803A'} stopOpacity={glowing ? '0.75' : '0.45'}/>
      </linearGradient>
      <linearGradient id="rachis" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={glowing ? '#EDD98A' : '#C8A85A'} stopOpacity={glowing ? '0.9' : '0.6'}/>
        <stop offset="100%" stopColor={glowing ? '#C9A84C' : '#A8803A'} stopOpacity={glowing ? '0.5' : '0.3'}/>
      </linearGradient>
      {glowing && (
        <filter id="softglow" x="-50%" y="-30%" width="200%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      )}
    </defs>

    {/* Contour extérieur de la plume — très doux */}
    <path
      d="M24 6
         C32 14, 38 24, 37 38
         C36 50, 30 60, 22 74
         C20 68, 19 60, 20 50
         C18 38, 12 28, 10 18
         C14 12, 20 6, 24 6Z"
      fill={glowing ? 'rgba(237,217,138,0.12)' : 'rgba(200,168,90,0.06)'}
      stroke={glowing ? 'rgba(237,217,138,0.35)' : 'rgba(184,148,74,0.2)'}
      strokeWidth="0.6"
      filter={glowing ? 'url(#softglow)' : undefined}
    />

    {/* Rachis — tige centrale */}
    <path
      d="M24 6 Q22 28 21 50 Q20.5 60 20 74"
      stroke="url(#rachis)"
      strokeWidth={glowing ? '1.4' : '1.0'}
      fill="none"
      strokeLinecap="round"
      filter={glowing ? 'url(#softglow)' : undefined}
    />

    {/* Barbes gauches — fines, longues, courbes naturelles */}
    <path d="M23.5 10 Q17 13 11 17" stroke="url(#quill)" strokeWidth="0.55" strokeLinecap="round" opacity={glowing ? '0.85' : '0.75'}/>
    <path d="M23 13 Q15 17 9 22" stroke="url(#quill)" strokeWidth="0.55" strokeLinecap="round" opacity={glowing ? '0.82' : '0.73'}/>
    <path d="M22.5 17 Q14 22 8 28" stroke="url(#quill)" strokeWidth="0.52" strokeLinecap="round" opacity={glowing ? '0.78' : '0.69'}/>
    <path d="M22 21 Q13 27 7 33" stroke="url(#quill)" strokeWidth="0.5" strokeLinecap="round" opacity={glowing ? '0.74' : '0.67'}/>
    <path d="M22 25 Q13 31 7 38" stroke="url(#quill)" strokeWidth="0.48" strokeLinecap="round" opacity={glowing ? '0.7' : '0.63'}/>
    <path d="M21.5 29 Q13 36 8 43" stroke="url(#quill)" strokeWidth="0.45" strokeLinecap="round" opacity={glowing ? '0.65' : '0.60'}/>
    <path d="M21 33 Q14 39 9 46" stroke="url(#quill)" strokeWidth="0.42" strokeLinecap="round" opacity={glowing ? '0.58' : '0.55'}/>
    <path d="M21 37 Q14 43 10 49" stroke="url(#quill)" strokeWidth="0.4" strokeLinecap="round" opacity={glowing ? '0.5' : '0.50'}/>
    <path d="M20.5 41 Q15 46 12 52" stroke="url(#quill)" strokeWidth="0.36" strokeLinecap="round" opacity={glowing ? '0.42' : '0.45'}/>
    <path d="M20.5 45 Q16 49 13 55" stroke="url(#quill)" strokeWidth="0.32" strokeLinecap="round" opacity={glowing ? '0.33' : '0.41'}/>
    <path d="M20 49 Q16.5 52 14 57" stroke="url(#quill)" strokeWidth="0.28" strokeLinecap="round" opacity={glowing ? '0.24' : '0.37'}/>

    {/* Barbes droites */}
    <path d="M23.5 10 Q30 13 36 18" stroke="url(#quill)" strokeWidth="0.55" strokeLinecap="round" opacity={glowing ? '0.85' : '0.75'}/>
    <path d="M23 13 Q31 17 37 23" stroke="url(#quill)" strokeWidth="0.55" strokeLinecap="round" opacity={glowing ? '0.82' : '0.73'}/>
    <path d="M22.5 17 Q31 22 36 28" stroke="url(#quill)" strokeWidth="0.52" strokeLinecap="round" opacity={glowing ? '0.78' : '0.69'}/>
    <path d="M22 21 Q31 27 35 33" stroke="url(#quill)" strokeWidth="0.5" strokeLinecap="round" opacity={glowing ? '0.74' : '0.67'}/>
    <path d="M22 25 Q31 31 35 38" stroke="url(#quill)" strokeWidth="0.48" strokeLinecap="round" opacity={glowing ? '0.7' : '0.63'}/>
    <path d="M21.5 29 Q30 35 34 42" stroke="url(#quill)" strokeWidth="0.45" strokeLinecap="round" opacity={glowing ? '0.65' : '0.60'}/>
    <path d="M21 33 Q29 39 33 46" stroke="url(#quill)" strokeWidth="0.42" strokeLinecap="round" opacity={glowing ? '0.58' : '0.55'}/>
    <path d="M21 37 Q28 42 31 49" stroke="url(#quill)" strokeWidth="0.4" strokeLinecap="round" opacity={glowing ? '0.5' : '0.50'}/>
    <path d="M20.5 41 Q27 46 29 52" stroke="url(#quill)" strokeWidth="0.36" strokeLinecap="round" opacity={glowing ? '0.42' : '0.45'}/>
    <path d="M20.5 45 Q26 49 28 55" stroke="url(#quill)" strokeWidth="0.32" strokeLinecap="round" opacity={glowing ? '0.33' : '0.41'}/>
    <path d="M20 49 Q25 52 26 57" stroke="url(#quill)" strokeWidth="0.28" strokeLinecap="round" opacity={glowing ? '0.24' : '0.37'}/>
  </svg>
);

export function FeatherReaction({ fragmentId, locale, label, reactedLabel, initialCount = 0 }: FeatherReactionProps) {
  const [reacted, setReacted] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [particles, setParticles] = useState(false);

  useEffect(() => {
    setReacted(hasReactedTo(fragmentId));
  }, [fragmentId]);

  const handleReact = async () => {
    if (reacted) return;
    setParticles(true);
    setReacted(true);
    setCount(c => c + 1);
    markReacted(fragmentId);
    try {
      await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fragment_id: fragmentId, language: locale }),
      });
    } catch {}
    setTimeout(() => setParticles(false), 2000);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative flex items-center justify-center">

        {/* Particules très douces */}
        <AnimatePresence>
          {particles && [...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0.8, x: 0, y: 0, scale: 1 }}
              animate={{
                opacity: 0,
                x: Math.cos((i * 72 + 18) * Math.PI / 180) * 22,
                y: Math.sin((i * 72 + 18) * Math.PI / 180) * 22 - 8,
                scale: 0.2,
              }}
              transition={{ duration: 1.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: '4px', height: '4px',
                background: 'rgba(212,184,106,0.7)',
                top: '50%', left: '50%',
                marginLeft: '-2px', marginTop: '-2px',
              }}
            />
          ))}
        </AnimatePresence>

        {/* Halo lumineux quand réagi */}
        {reacted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0, 0.25, 0], scale: [0.6, 1.8, 2.2] }}
            transition={{ duration: 2.5, ease: 'easeOut' }}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: '60px', height: '80px',
              background: 'radial-gradient(ellipse, rgba(237,217,138,0.4) 0%, transparent 70%)',
            }}
          />
        )}

        <motion.button
          onClick={handleReact}
          disabled={reacted}
          // Animation flottante très lente quand réagi
          animate={reacted ? {
            y: [0, -6, 0, -4, 0, -5, 0],
            rotate: [0, -1.5, 1, -1, 0.5, -0.5, 0],
          } : {}}
          transition={reacted ? {
            duration: 8,
            repeat: Infinity,
            repeatDelay: 1,
            ease: 'easeInOut',
          } : {}}
          whileTap={!reacted ? { scale: 0.92, transition: { duration: 0.3 } } : {}}
          className={`transition-all ${reacted ? 'cursor-default' : 'cursor-pointer'}`}
          style={{
            width: '44px',
            height: '72px',
            filter: reacted
              ? 'drop-shadow(0 0 8px rgba(237,217,138,0.6)) drop-shadow(0 0 18px rgba(212,184,106,0.25))'
              : 'drop-shadow(0 2px 8px rgba(140,106,44,0.35)) drop-shadow(0 1px 3px rgba(140,106,44,0.2))',
            transition: 'filter 1.5s ease',
          }}
          aria-label={label}
        >
          <RealisticFeather glowing={reacted} />
        </motion.button>
      </div>

      {/* Label */}
      <AnimatePresence mode="wait">
        {!reacted ? (
          <motion.button
            key="label"
            onClick={handleReact}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[10.5px] uppercase tracking-[0.16em] cursor-pointer transition-opacity duration-500 hover:opacity-80"
            style={{ color: 'rgba(42,40,32,0.4)', fontWeight: 300 }}
          >
            {label}
          </motion.button>
        ) : (
          <motion.span
            key="reacted"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 0.65 }}
            transition={{ duration: 1.4, delay: 0.2 }}
            className="font-display italic text-[13px]"
            style={{ color: 'rgba(184,148,74,0.75)' }}
          >
            {reactedLabel}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Compteur discret */}
      <AnimatePresence>
        {count > 0 && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 0.42 }}
            transition={{ delay: reacted ? 0.8 : 0, duration: 1.5 }}
            className="text-[10.5px] tracking-wide text-center"
            style={{ color: 'rgba(42,40,32,0.42)' }}
          >
            {count} {locale === 'fr' ? 'personnes le ressentent' : 'people feel this'}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
