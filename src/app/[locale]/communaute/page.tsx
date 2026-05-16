'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const ease = [0.16, 1, 0.3, 1] as const;
const MIN = 15;
const MAX = 300;

interface Post {
  id: string;
  content: string;
  created_at: string;
  reaction_count: number;
}

export default function CommunautePage() {
  const t = useTranslations('communaute');
  const { locale } = useParams<{ locale: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [text, setText] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('community_posts')
          .select('*')
          .eq('language', locale)
          .eq('status', 'approved')
          .order('created_at', { ascending: false })
          .limit(20);
        setPosts(data ?? []);
      } catch {}
      setLoading(false);
    };
    fetchPosts();
  }, [locale]);

  const handleSubmit = async () => {
    if (text.trim().length < MIN || text.trim().length > MAX) return;
    setStatus('loading');
    try {
      await fetch('/api/communaute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text.trim(), language: locale }),
      });
      setStatus('success');
      setText('');
    } catch {
      setStatus('idle');
    }
  };

  const canSubmit = text.trim().length >= MIN && text.trim().length <= MAX && status !== 'loading';

  return (
    <section className="min-h-screen flex flex-col pt-24 pb-32 px-5">

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease }}
        className="text-center mb-10 space-y-3"
      >
        <p className="text-[10px] uppercase tracking-[0.22em]" style={{ color: 'var(--gold)', opacity: 0.8 }}>
          {t('eyebrow')}
        </p>
        <div className="divider" />
        <div className="space-y-0.5">
          {t('title').split('\n').map((line, i) => (
            <h1 key={i} className="font-display text-[28px] sm:text-[34px] leading-[1.25] text-ink-800" style={{ fontWeight: 500 }}>
              {line}
            </h1>
          ))}
        </div>
        <div className="space-y-0.5 pt-1">
          {t('subtitle').split('\n').map((line, i) => (
            <p key={i} className="text-[13px]" style={{ color: 'rgba(42,40,32,0.6)' }}>{line}</p>
          ))}
        </div>
      </motion.div>

      <div className="max-w-sm mx-auto w-full space-y-4">

        {/* Share form */}
        <AnimatePresence mode="wait">
          {status !== 'success' ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease }}
              className="glass-strong rounded-3xl p-6"
            >
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder={t('placeholder')}
                rows={4}
                maxLength={MAX + 20}
                className="w-full bg-transparent resize-none font-display italic text-[17px] leading-relaxed focus:outline-none placeholder:opacity-40"
                style={{ color: 'rgba(42,40,32,0.85)', fontWeight: 400 }}
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-[11px]" style={{ color: 'rgba(42,40,32,0.3)' }}>
                  {text.trim().length}/{MAX}
                </span>
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className={`rounded-full px-6 py-2.5 text-[11px] uppercase tracking-[0.14em] transition-all duration-500 ${
                    canSubmit ? 'glass-gold hover:scale-105 cursor-pointer' : 'opacity-30 cursor-not-allowed'
                  }`}
                  style={{ color: canSubmit ? 'var(--gold)' : 'rgba(42,40,32,0.4)', fontWeight: 400 }}
                >
                  {status === 'loading' ? t('submitting') : t('submit')}
                </button>
              </div>
              <p className="mt-3 text-[11px]" style={{ color: 'rgba(42,40,32,0.3)' }}>{t('note')}</p>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-strong rounded-3xl p-8 text-center"
            >
              {t('success').split('\n').map((line, i) => (
                <p key={i} className="font-display italic text-[18px] text-ink-800" style={{ fontWeight: 400 }}>{line}</p>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Posts */}
        {loading && (
          <p className="text-center text-[13px] py-8" style={{ color: 'rgba(42,40,32,0.4)' }}>
            {t('empty')}
          </p>
        )}

        {!loading && posts.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: i * 0.06, ease }}
            className="glass rounded-2xl p-5"
          >
            <p className="font-display italic text-[16px] leading-[1.8] text-ink-800" style={{ fontWeight: 400 }}>
              "{post.content}"
            </p>
          </motion.div>
        ))}

        {!loading && posts.length === 0 && status !== 'success' && (
          <p className="text-center text-[13px] py-4" style={{ color: 'rgba(42,40,32,0.45)' }}>
            {t('empty')}
          </p>
        )}
      </div>
    </section>
  );
}
