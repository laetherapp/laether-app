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
  <svg viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="fg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={glowing ? '#F5E8C0' : '#E8D5A0'} stopOpacity="0.9"/>
        <stop offset="100%" stopColor={glowing ? '#D4B86A' : '#B8944A'} stopOpacity="0.7"/>
      </linearGradient>
      {glowing && (
        <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      )}
    </defs>
    <path d="M30 8 Q28 30 26 52 Q25 62 24 72" stroke={glowing ? '#D4B86A' : '#B8944A'} strokeWidth={glowing ? '1.4' : '1'} fill="none" filter={glowing ? 'url(#glow)' : undefined}/>
    <path d="M30 10 Q22 14 16 18" stroke="url(#fg)" strokeWidth="0.9" opacity={glowing ? '0.9' : '0.6'}/>
    <path d="M29 14 Q20 18 13 23" stroke="url(#fg)" strokeWidth="0.9" opacity={glowing ? '0.9' : '0.6'}/>
    <path d="M28 18 Q19 23 12 29" stroke="url(#fg)" strokeWidth="0.9" opacity={glowing ? '0.85' : '0.55'}/>
    <path d="M28 22 Q18 27 11 34" stroke="url(#fg)" strokeWidth="0.85" opacity={glowing ? '0.8' : '0.5'}/>
    <path d="M27 26 Q18 32 11 39" stroke="url(#fg)" strokeWidth="0.8" opacity={glowing ? '0.75' : '0.5'}/>
    <path d="M27 30 Q19 36 12 44" stroke="url(#fg)" strokeWidth="0.75" opacity={glowing ? '0.7' : '0.45'}/>
    <path d="M26 34 Q20 40 14 47" stroke="url(#fg)" strokeWidth="0.7" opacity={glowing ? '0.65' : '0.4'}/>
    <path d="M26 38 Q20 43 15 50" stroke="url(#fg)" strokeWidth="0.65" opacity={glowing ? '0.6' : '0.35'}/>
    <path d="M25 42 Q21 46 17 52" stroke="url(#fg)" strokeWidth="0.6" opacity={glowing ? '0.5' : '0.3'}/>
    <path d="M25 46 Q22 49 19 54" stroke="url(#fg)" strokeWidth="0.55" opacity={glowing ? '0.4' : '0.25'}/>
    <path d="M30 10 Q37 14 43 19" stroke="url(#fg)" strokeWidth="0.9" opacity={glowing ? '0.9' : '0.6'}/>
    <path d="M29 14 Q37 19 44 24" stroke="url(#fg)" strokeWidth="0.9" opacity={glowing ? '0.9' : '0.6'}/>
    <path d="M28 18 Q37 23 43 29" stroke="url(#fg)" strokeWidth="0.9" opacity={glowing ? '0.85' : '0.55'}/>
    <path d="M28 22 Q37 28 43 34" stroke="url(#fg)" strokeWidth="0.85" opacity={glowing ? '0.8' : '0.5'}/>
    <path d="M27 26 Q36 32 42 39" stroke="url(#fg)" strokeWidth="0.8" opacity={glowing ? '0.75' : '0.5'}/>
    <path d="M27 30 Q35 36 41 43" stroke="url(#fg)" strokeWidth="0.75" opacity={glowing ? '0.7' : '0.45'}/>
    <path d="M26 34 Q34 40 39 47" stroke="url(#fg)" strokeWidth="0.7" opacity={glowing ? '0.65' : '0.4'}/>
    <path d="M26 38 Q33 43 38 50" stroke="url(#fg)" strokeWidth="0.65" opacity={glowing ? '0.6' : '0.35'}/>
    <path d="M25 42 Q32 46 36 52" stroke="url(#fg)" strokeWidth="0.6" opacity={glowing ? '0.5' : '0.3'}/>
    <path d="M30 8 Q43 19 44 34 Q43 48 24 72 Q25 62 26 52 Q28 30 30 8Z" stroke={glowing ? '#D4B86A' : '#B8944A'} strokeWidth={glowing ? '0.8' : '0.5'} fill={glowing ? 'rgba(212,184,106,0.1)' : 'rgba(184,148,74,0.04)'} opacity={glowing ? '0.8' : '0.5'} filter={glowing ? 'url(#glow)' : undefined}/>
    <path d="M30 8 Q18 19 12 34 Q13 48 24 72 Q25 62 26 52 Q28 30 30 8Z" stroke={glowing ? '#D4B86A' : '#B8944A'} strokeWidth={glowing ? '0.8' : '0.5'} fill={glowing ? 'rgba(212,184,106,0.1)' : 'rgba(184,148,74,0.04)'} opacity={glowing ? '0.8' : '0.5'} filter={glowing ? 'url(#glow)' : undefined}/>
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
    setTimeout(() => setParticles(false), 1200);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <AnimatePresence>
          {particles && [...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 1, x: 0, y: 0 }}
              animate={{ opacity: 0, x: Math.cos(i * 60 * Math.PI / 180) * 28, y: Math.sin(i * 60 * Math.PI / 180) * 28 - 8 }}
              transition={{ duration: 0.9, delay: i * 0.04, ease: 'easeOut' }}
              className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full pointer-events-none"
              style={{ background: 'var(--gold)', marginLeft: '-3px', marginTop: '-3px' }}
            />
          ))}
        </AnimatePresence>

        <motion.button
          onClick={handleReact}
          disabled={reacted}
          animate={reacted ? { y: [0, -3, 0, -2, 0], rotate: [0, -2, 2, -1, 0] } : {}}
          transition={{ duration: 2.5, repeat: reacted ? Infinity : 0, repeatDelay: 4 }}
          whileTap={!reacted ? { scale: 0.9 } : {}}
          className={`transition-all duration-700 ${reacted ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
          style={{
            width: '52px', height: '68px',
            filter: reacted ? 'drop-shadow(0 0 10px rgba(212,184,106,0.75)) drop-shadow(0 0 22px rgba(212,184,106,0.4))' : 'none',
          }}
          aria-label={label}
        >
          <RealisticFeather glowing={reacted} />
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {!reacted ? (
          <motion.span key="label" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-[11px] uppercase tracking-[0.14em]" style={{ color: 'rgba(42,40,32,0.45)', fontWeight: 300 }}>
            {label}
          </motion.span>
        ) : (
          <motion.span key="reacted" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 0.7 }}
            className="font-display italic text-[13px]" style={{ color: 'var(--gold)' }}>
            {reactedLabel}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {count > 0 && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-[11px] tracking-wide text-center"
            style={{ color: 'rgba(42,40,32,0.45)' }}
          >
            {count} {locale === 'fr' ? 'personnes le ressentent' : 'people feel this'}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
