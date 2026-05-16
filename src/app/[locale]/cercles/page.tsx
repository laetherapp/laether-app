'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

const ease = [0.16, 1, 0.3, 1] as const;

const QUESTIONS_FR = [
  "Qu'est-ce qui ne suivait plus en toi avant de lire ce livre ?",
  "Quel passage t'a arrêté le plus longtemps ? Pourquoi ?",
  "Qu'est-ce que « ralentir » signifie concrètement pour toi ?",
  "Y a-t-il quelque chose que le livre a nommé que tu n'arrivais pas à formuler ?",
  "Comment te sens-tu dans ton corps depuis que tu as terminé le livre ?",
  "Qu'est-ce qui a changé dans ta façon d'être présent, même légèrement ?",
  "Si tu devais garder une seule phrase du livre, laquelle ce serait ?",
  "Qu'est-ce que ce livre a ouvert que tu n'attendais pas ?",
];

const QUESTIONS_EN = [
  "What was no longer following inside you before you read this book?",
  "Which passage made you stop the longest? Why?",
  "What does 'slowing down' actually mean for you?",
  "Did the book name something you couldn't quite put into words?",
  "How do you feel in your body since finishing the book?",
  "What has shifted in how you're present, even slightly?",
  "If you could keep just one sentence from the book, which would it be?",
  "What did this book open that you weren't expecting?",
];

function getWeekQuestion(locale: string) {
  const week = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  const questions = locale === 'fr' ? QUESTIONS_FR : QUESTIONS_EN;
  return { text: questions[week % questions.length], week: week % questions.length + 1 };
}

export default function CerclesPage() {
  const t = useTranslations('cercles');
  const { locale } = useParams<{ locale: string }>();
  const { text: weekQuestion, week } = getWeekQuestion(locale as string);

  return (
    <section className="min-h-screen flex flex-col pt-24 pb-32 px-5">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease }}
        className="text-center mb-12 space-y-3"
      >
        <p className="text-[10px] uppercase tracking-[0.22em]" style={{ color: 'var(--gold)', opacity: 0.8 }}>
          {t('eyebrow')}
        </p>
        <div className="divider" />
        <div className="space-y-1">
          {t('title').split('\n').map((line, i) => (
            <h1 key={i} className="font-display text-[32px] sm:text-[38px] leading-[1.2] text-ink-800" style={{ fontWeight: 500 }}>
              {line}
            </h1>
          ))}
        </div>
        <div className="space-y-0.5 pt-2">
          {t('subtitle').split('\n').map((line, i) => (
            <p key={i} className="text-[13px]" style={{ color: 'rgba(42,40,32,0.6)' }}>{line}</p>
          ))}
        </div>
      </motion.div>

      <div className="max-w-sm mx-auto w-full space-y-5">

        {/* Weekly question */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease }}
          className="glass-strong rounded-3xl p-7"
        >
          <div className="flex items-center justify-between mb-5">
            <p className="text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--gold)', opacity: 0.8 }}>
              {t('question_label')}
            </p>
            <span className="text-[10px] tracking-wide" style={{ color: 'rgba(42,40,32,0.35)' }}>
              {t('week')} {week}
            </span>
          </div>
          <p className="font-display italic text-[18px] leading-[1.75] text-ink-800" style={{ fontWeight: 400 }}>
            "{weekQuestion}"
          </p>
        </motion.div>

        {/* Join circle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease }}
          className="glass-strong rounded-3xl p-7 text-center"
        >
          <div className="mb-5">
            {/* Three people icon */}
            <div className="flex justify-center gap-2 mb-4">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.1, duration: 0.6 }}
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(184,148,74,0.12)', border: '1px solid rgba(184,148,74,0.25)' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(184,148,74,0.7)" strokeWidth="1.5" strokeLinecap="round">
                    <circle cx="12" cy="7" r="4"/>
                    <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>
                  </svg>
                </motion.div>
              ))}
            </div>
            <p className="font-display italic text-[17px] text-ink-800 mb-1" style={{ fontWeight: 400 }}>
              {t('no_circle')}
            </p>
            <p className="text-[13px]" style={{ color: 'rgba(42,40,32,0.55)' }}>
              {t('no_circle_body')}
            </p>
          </div>

          <button
            className="glass-gold rounded-full px-8 py-3.5 text-[11px] uppercase tracking-[0.16em] transition-all duration-700 hover:scale-105 w-full"
            style={{ color: 'var(--gold)', fontWeight: 400 }}
            onClick={() => {
              // Auth modal would open here
              alert(locale === 'fr'
                ? 'Crée ton compte pour rejoindre un cercle.'
                : 'Create your account to join a circle.');
            }}
          >
            {t('join_cta')}
          </button>

          <p className="mt-4 text-[11px]" style={{ color: 'rgba(42,40,32,0.35)' }}>
            {locale === 'fr' ? 'Gratuit · Anonyme · Intime' : 'Free · Anonymous · Intimate'}
          </p>
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="glass rounded-3xl p-6 space-y-4"
        >
          {[
            locale === 'fr'
              ? ['1.', 'Tu rejoins un cercle de 3 personnes, formé automatiquement.']
              : ['1.', 'You join a circle of 3, formed gently and automatically.'],
            locale === 'fr'
              ? ['2.', 'Chaque semaine, une question guide votre échange.']
              : ['2.', 'Each week, a question guides your exchange.'],
            locale === 'fr'
              ? ['3.', 'Vous partagez à votre rythme, par écrit, librement.']
              : ['3.', 'You share at your own pace, in writing, freely.'],
          ].map(([num, text], i) => (
            <div key={i} className="flex gap-4">
              <span className="font-display italic text-[15px] mt-0.5 shrink-0" style={{ color: 'var(--gold)', fontWeight: 400 }}>{num}</span>
              <p className="text-[13px]" style={{ color: 'rgba(42,40,32,0.7)' }}>{text}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
