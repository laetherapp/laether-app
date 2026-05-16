'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

const ease = [0.16, 1, 0.3, 1] as const;

export default function PremiumPage() {
  const t = useTranslations('premium');
  const { locale } = useParams<{ locale: string }>();
  const [currency, setCurrency] = useState<'eur' | 'usd'>(locale === 'fr' ? 'eur' : 'usd');
  const [selected, setSelected] = useState<'annual' | 'monthly'>('annual');
  const [loading, setLoading] = useState(false);

  const prices = {
    eur: { monthly: '5,99€', annual: '44,99€', monthlyId: 'price_eur_monthly', annualId: 'price_eur_annual' },
    usd: { monthly: '$6.99', annual: '$49.99', monthlyId: 'price_usd_monthly', annualId: 'price_usd_annual' },
  };

  const current = prices[currency];
  const features = t.raw('features') as string[];

  const handleCheckout = async () => {
    setLoading(true);
    const priceId = selected === 'annual' ? current.annualId : current.monthlyId;
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, locale }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {}
    setLoading(false);
  };

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
            <h1 key={i} className="font-display text-[30px] sm:text-[38px] leading-[1.2] text-ink-800" style={{ fontWeight: 500 }}>
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

        {/* Currency toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex justify-center"
        >
          <button
            onClick={() => setCurrency(c => c === 'eur' ? 'usd' : 'eur')}
            className="glass rounded-full px-5 py-2 text-[11px] uppercase tracking-[0.12em] transition-all duration-500 hover:scale-105"
            style={{ color: 'var(--gold)', fontWeight: 400 }}
          >
            {t('currency_switch')} →
          </button>
        </motion.div>

        {/* Plans */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1, ease }}
          className="space-y-3"
        >
          {/* Annual */}
          <button
            onClick={() => setSelected('annual')}
            className={`w-full rounded-3xl p-6 text-left transition-all duration-500 ${
              selected === 'annual' ? 'glass-gold scale-[1.02]' : 'glass'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[13px] font-medium text-ink-800">{t('annual_label')}</span>
                  <span className="badge-premium">{t('annual_highlight')}</span>
                </div>
                <span className="text-[11px]" style={{ color: 'rgba(42,40,32,0.5)' }}>{t('annual_save')}</span>
              </div>
              <div className="text-right">
                <p className="font-display text-[28px] text-ink-800" style={{ fontWeight: 500 }}>{current.annual}</p>
                <p className="text-[11px]" style={{ color: 'rgba(42,40,32,0.5)' }}>{t('annual_period')}</p>
              </div>
            </div>
            <div className={`w-4 h-4 rounded-full border-2 ml-auto mt-1 transition-all duration-300 ${
              selected === 'annual' ? 'border-gold-400' : 'border-ink-300'
            }`} style={selected === 'annual' ? { background: 'var(--gold)' } : {}} />
          </button>

          {/* Monthly */}
          <button
            onClick={() => setSelected('monthly')}
            className={`w-full rounded-3xl p-6 text-left transition-all duration-500 ${
              selected === 'monthly' ? 'glass-gold scale-[1.02]' : 'glass'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[13px] font-medium text-ink-800">{t('monthly_label')}</span>
              </div>
              <div className="text-right">
                <p className="font-display text-[28px] text-ink-800" style={{ fontWeight: 500 }}>{current.monthly}</p>
                <p className="text-[11px]" style={{ color: 'rgba(42,40,32,0.5)' }}>{t('monthly_period')}</p>
              </div>
            </div>
            <div className={`w-4 h-4 rounded-full border-2 ml-auto mt-1 transition-all duration-300 ${
              selected === 'monthly' ? 'border-gold-400' : 'border-ink-300'
            }`} style={selected === 'monthly' ? { background: 'var(--gold)' } : {}} />
          </button>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="glass rounded-3xl p-6 space-y-3"
        >
          {features.map((feature, i) => (
            <div key={i} className="flex items-center gap-3">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="none">
                <path d="M8 3C5 3 3 8 8 13C13 8 11 3 8 3Z" stroke="rgba(184,148,74,0.8)" strokeWidth="0.8" fill="rgba(184,148,74,0.1)"/>
                <line x1="8" y1="3" x2="8" y2="13" stroke="rgba(184,148,74,0.6)" strokeWidth="0.5"/>
              </svg>
              <p className="text-[13px]" style={{ color: 'rgba(42,40,32,0.75)' }}>{feature}</p>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          onClick={handleCheckout}
          disabled={loading}
          whileTap={{ scale: 0.98 }}
          className="w-full rounded-full py-4 text-[12px] uppercase tracking-[0.16em] transition-all duration-700 hover:scale-[1.02]"
          style={{
            background: 'linear-gradient(135deg, #D4B86A, #B8944A)',
            color: 'white',
            fontWeight: 500,
            boxShadow: '0 4px 20px rgba(184,148,74,0.35)',
          }}
        >
          {loading ? '…' : selected === 'annual' ? t('cta_annual') : t('cta_monthly')}
        </motion.button>

        <p className="text-center text-[11px]" style={{ color: 'rgba(42,40,32,0.35)' }}>
          {t('secure')}
        </p>
      </div>
    </section>
  );
}
