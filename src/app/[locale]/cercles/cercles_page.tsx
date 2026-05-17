'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  "What does slowing down actually mean for you?",
  "Did the book name something you could not quite put into words?",
  "How do you feel in your body since finishing the book?",
  "What has shifted in how you are present, even slightly?",
  "If you could keep just one sentence from the book, which would it be?",
  "What did this book open that you were not expecting?",
];

function getWeekQuestion(locale) {
  const week = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  const questions = locale === 'fr' ? QUESTIONS_FR : QUESTIONS_EN;
  return { text: questions[week % questions.length], num: week % questions.length + 1 };
}

export default function CerclesPage() {
  const t = useTranslations('cercles');
  const { locale } = useParams();
  const { text: weekQuestion, num: weekNum } = getWeekQuestion(locale);

  const [status, setStatus] = useState('loading');
  const [email, setEmail] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [joining, setJoining] = useState(false);
  const [circleData, setCircleData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [sending, setSending] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('circle_email');
    if (saved) { checkStatus(saved); } else { setStatus('none'); }
  }, []);

  const checkStatus = async (em) => {
    setStatus('loading');
    try {
      const res = await fetch('/api/cercles/status?email=' + encodeURIComponent(em));
      const data = await res.json();
      if (data.status === 'active') {
        setCircleData(data);
        setStatus('active');
        loadMessages(data.circle_id);
      } else if (data.status === 'waiting') {
        setStatus('waiting');
      } else {
        setStatus('none');
      }
    } catch { setStatus('none'); }
  };

  const loadMessages = async (circleId) => {
    try {
      const res = await fetch('/api/cercles/messages?circle_id=' + circleId);
      const data = await res.json();
      setMessages(data);
      setTimeout(() => chatRef.current?.scrollTo({ top: 9999, behavior: 'smooth' }), 100);
    } catch {}
  };

  useEffect(() => {
    if (status !== 'active' || !circleData?.circle_id) return;
    const id = setInterval(() => loadMessages(circleData.circle_id), 8000);
    return () => clearInterval(id);
  }, [status, circleData]);

  const handleJoin = async () => {
    if (!email.includes('@') || pseudo.trim().length < 2) return;
    setJoining(true);
    try {
      const res = await fetch('/api/cercles/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), pseudo: pseudo.trim(), language: locale }),
      });
      const data = await res.json();
      if (data.ok) {
        localStorage.setItem('circle_email', email.trim());
        localStorage.setItem('circle_pseudo', pseudo.trim());
        await checkStatus(email.trim());
      }
    } catch {}
    setJoining(false);
  };

  const handleSend = async () => {
    if (!newMsg.trim() || sending || !circleData?.circle_id) return;
    setSending(true);
    const content = newMsg.trim();
    setNewMsg('');
    try {
      const res = await fetch('/api/cercles/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          circle_id: circleData.circle_id,
          pseudo: circleData.pseudo || localStorage.getItem('circle_pseudo') || 'Anonyme',
          content,
          language: locale,
        }),
      });
      const msg = await res.json();
      setMessages(m => [...m, msg]);
      setTimeout(() => chatRef.current?.scrollTo({ top: 9999, behavior: 'smooth' }), 100);
    } catch {}
    setSending(false);
  };

  const handleTranslate = async (msgId, text, from) => {
    const to = from === 'fr' ? 'en' : 'fr';
    setMessages(m => m.map(msg => msg.id === msgId ? { ...msg, translating: true } : msg));
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, from, to }),
      });
      const data = await res.json();
      setMessages(m => m.map(msg => msg.id === msgId ? { ...msg, translation: data.translation, translating: false } : msg));
    } catch {
      setMessages(m => m.map(msg => msg.id === msgId ? { ...msg, translating: false } : msg));
    }
  };

  return (
    <section className="min-h-screen flex flex-col pt-24 pb-32 px-5">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease }} className="text-center mb-10 space-y-3">
        <p className="text-[10px] uppercase tracking-[0.22em]" style={{ color: 'var(--gold)', opacity: 0.9 }}>{t('eyebrow')}</p>
        <div className="divider" />
        <div className="space-y-1">
          {t('title').split('\n').map((line, i) => (
            <h1 key={i} className="font-display text-[30px] sm:text-[36px] leading-[1.2]"
              style={{ fontWeight: 500, color: 'rgba(40,30,15,0.88)' }}>{line}</h1>
          ))}
        </div>
      </motion.div>

      <div className="max-w-sm mx-auto w-full">
        <AnimatePresence mode="wait">

          {status === 'loading' && (
            <motion.p key="loading" initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
              className="text-center text-[13px]" style={{ color: 'rgba(40,30,15,0.55)' }}>
              Un instant…
            </motion.p>
          )}

          {status === 'none' && (
            <motion.div key="none" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.8, ease }} className="space-y-4">
              <div className="glass-strong rounded-3xl p-7">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--gold)', opacity: 0.9 }}>{t('question_label')}</p>
                  <span className="text-[10px]" style={{ color: 'rgba(40,30,15,0.35)' }}>{t('week')} {weekNum}</span>
                </div>
                <p className="font-display italic text-[17px] leading-[1.75]" style={{ color: 'rgba(40,30,15,0.85)', fontWeight: 400 }}>
                  "{weekQuestion}"
                </p>
              </div>

              <div className="glass-strong rounded-3xl p-7 text-center">
                <div className="flex justify-center gap-2 mb-5">
                  {[0,1,2].map(i => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(184,148,74,0.1)', border: '1px solid rgba(184,148,74,0.22)' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(184,148,74,0.65)" strokeWidth="1.5" strokeLinecap="round">
                        <circle cx="12" cy="7" r="4"/>
                        <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>
                      </svg>
                    </motion.div>
                  ))}
                </div>
                <p className="font-display italic text-[17px] mb-1" style={{ color: 'rgba(40,30,15,0.85)', fontWeight: 400 }}>{t('no_circle')}</p>
                <p className="text-[13px] mb-5" style={{ color: 'rgba(40,30,15,0.55)' }}>{t('no_circle_body')}</p>
                <button onClick={() => setStatus('join_form')}
                  className="w-full glass-gold rounded-full py-3.5 text-[11px] uppercase tracking-[0.16em] transition-all duration-500 hover:scale-[1.02]"
                  style={{ color: 'var(--gold)', fontWeight: 400 }}>
                  {t('join_cta')}
                </button>
                <p className="mt-3 text-[11px]" style={{ color: 'rgba(40,30,15,0.35)' }}>
                  {locale === 'fr' ? 'Gratuit · Anonyme · Intime' : 'Free · Anonymous · Intimate'}
                </p>
              </div>

              <div className="glass rounded-3xl p-6 space-y-4">
                {(locale === 'fr' ? [
                  ['1.', 'Tu rejoins un cercle de 3 personnes, formé automatiquement.'],
                  ['2.', 'Chaque semaine, une question guide votre échange.'],
                  ['3.', 'Vous partagez à votre rythme, par écrit, librement.'],
                  ['4.', 'Les messages peuvent être traduits FR/EN automatiquement.'],
                ] : [
                  ['1.', 'You join a circle of 3, formed gently and automatically.'],
                  ['2.', 'Each week, a question guides your exchange.'],
                  ['3.', 'You share at your own pace, in writing, freely.'],
                  ['4.', 'Messages can be translated FR/EN automatically.'],
                ]).map(([num, text], i) => (
                  <div key={i} className="flex gap-4">
                    <span className="font-display italic text-[15px] mt-0.5 shrink-0" style={{ color: 'var(--gold)', fontWeight: 400 }}>{num}</span>
                    <p className="text-[13px]" style={{ color: 'rgba(40,30,15,0.7)' }}>{text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {status === 'join_form' && (
            <motion.div key="form" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.8, ease }}
              className="glass-strong rounded-3xl p-8 space-y-5">
              <p className="font-display italic text-[20px] text-center" style={{ color: 'rgba(40,30,15,0.85)', fontWeight: 400 }}>
                {locale === 'fr' ? 'Rejoindre un cercle' : 'Join a circle'}
              </p>
              <div className="divider" />
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-[0.12em]" style={{ color: 'rgba(40,30,15,0.5)' }}>
                  {locale === 'fr' ? 'Ton email' : 'Your email'}
                </label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder={locale === 'fr' ? 'ton@email.com' : 'your@email.com'}
                  className="w-full bg-transparent rounded-2xl px-4 py-3 text-[14px] focus:outline-none"
                  style={{ border: '1px solid rgba(184,148,74,0.25)', color: 'rgba(40,30,15,0.85)', background: 'rgba(255,255,255,0.3)' }} />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-[0.12em]" style={{ color: 'rgba(40,30,15,0.5)' }}>
                  {locale === 'fr' ? 'Ton pseudo' : 'Your name'}
                </label>
                <input type="text" value={pseudo} onChange={e => setPseudo(e.target.value.slice(0, 30))}
                  placeholder={locale === 'fr' ? 'Comment veux-tu être appelé ?' : 'What should we call you?'}
                  className="w-full bg-transparent rounded-2xl px-4 py-3 text-[14px] focus:outline-none"
                  style={{ border: '1px solid rgba(184,148,74,0.25)', color: 'rgba(40,30,15,0.85)', background: 'rgba(255,255,255,0.3)' }} />
                <p className="text-[11px]" style={{ color: 'rgba(40,30,15,0.35)' }}>
                  {locale === 'fr' ? 'Visible uniquement par les membres de ton cercle.' : 'Visible only to your circle members.'}
                </p>
              </div>
              <button onClick={handleJoin} disabled={joining || !email.includes('@') || pseudo.trim().length < 2}
                className="w-full rounded-full py-4 text-[11px] uppercase tracking-[0.16em] transition-all duration-500 hover:scale-[1.02] disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg, #D4B86A, #B8944A)', color: 'white', fontWeight: 400, boxShadow: '0 4px 16px rgba(184,148,74,0.3)' }}>
                {joining ? '…' : (locale === 'fr' ? 'Rejoindre' : 'Join')}
              </button>
              <button onClick={() => setStatus('none')} className="w-full text-center text-[11px] py-2 transition-opacity hover:opacity-70"
                style={{ color: 'rgba(40,30,15,0.4)' }}>
                {locale === 'fr' ? 'Retour' : 'Back'}
              </button>
            </motion.div>
          )}

          {status === 'waiting' && (
            <motion.div key="waiting" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.8, ease }}
              className="glass-strong rounded-3xl p-8 text-center space-y-6">
              <div className="flex justify-center gap-3">
                {[0,1,2].map(i => (
                  <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
                    className="w-3 h-3 rounded-full" style={{ background: 'var(--gold)' }} />
                ))}
              </div>
              <div className="divider" />
              <p className="font-display italic text-[20px]" style={{ color: 'rgba(40,30,15,0.85)', fontWeight: 400 }}>{t('waiting')}</p>
              <p className="text-[13px] whitespace-pre-line" style={{ color: 'rgba(40,30,15,0.55)' }}>{t('waiting_body')}</p>
              <p className="text-[11px]" style={{ color: 'rgba(40,30,15,0.35)' }}>
                {locale === 'fr' ? 'Tu recevras une notification quand ton cercle sera prêt.' : 'You will receive a notification when your circle is ready.'}
              </p>
            </motion.div>
          )}

          {status === 'active' && circleData && (
            <motion.div key="active" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.8, ease }} className="space-y-4">

              <div className="glass-strong rounded-3xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--gold)', opacity: 0.9 }}>{t('question_label')}</p>
                  <span className="text-[10px]" style={{ color: 'rgba(40,30,15,0.35)' }}>{t('week')} {weekNum}</span>
                </div>
                <p className="font-display italic text-[16px] leading-[1.7]" style={{ color: 'rgba(40,30,15,0.85)', fontWeight: 400 }}>
                  "{weekQuestion}"
                </p>
              </div>

              <div className="glass rounded-2xl px-5 py-3 flex items-center gap-3">
                <div className="flex gap-1.5">
                  {circleData.members?.map((m, i) => (
                    <div key={i} className="w-7 h-7 rounded-full flex items-center justify-center text-[10px]"
                      style={{ background: 'rgba(184,148,74,0.15)', color: 'var(--gold)' }}>
                      {m.pseudo?.[0]?.toUpperCase()}
                    </div>
                  ))}
                </div>
                <p className="text-[11px]" style={{ color: 'rgba(40,30,15,0.5)' }}>
                  {circleData.members?.map(m => m.pseudo).join(' · ')}
                </p>
              </div>

              <div ref={chatRef} className="glass-strong rounded-3xl p-5 space-y-4 overflow-y-auto"
                style={{ maxHeight: '340px', minHeight: '200px' }}>
                {messages.length === 0 && (
                  <p className="text-center text-[13px] py-4 font-display italic" style={{ color: 'rgba(40,30,15,0.4)', fontWeight: 400 }}>
                    {locale === 'fr' ? 'Soyez les premiers à partager.' : 'Be the first to share.'}
                  </p>
                )}
                {messages.map(msg => {
                  const isMe = msg.pseudo === (circleData.pseudo || localStorage.getItem('circle_pseudo'));
                  const canTranslate = msg.language && msg.language !== locale;
                  return (
                    <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className={'flex flex-col gap-1 ' + (isMe ? 'items-end' : 'items-start')}>
                      <p className="text-[10px] uppercase tracking-[0.1em]" style={{ color: 'rgba(40,30,15,0.4)' }}>{msg.pseudo}</p>
                      <div className={'rounded-2xl px-4 py-3 max-w-[85%] ' + (isMe ? 'rounded-tr-sm' : 'rounded-tl-sm')}
                        style={{ background: isMe ? 'rgba(184,148,74,0.15)' : 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.3)' }}>
                        <p className="text-[14px] leading-[1.65]" style={{ color: 'rgba(40,30,15,0.82)' }}>{msg.content}</p>
                        {msg.translation && (
                          <p className="text-[12px] mt-2 pt-2 font-display italic leading-[1.6]"
                            style={{ color: 'rgba(40,30,15,0.55)', borderTop: '1px solid rgba(184,148,74,0.15)' }}>
                            {msg.translation}
                          </p>
                        )}
                      </div>
                      {canTranslate && !msg.translation && (
                        <div className="relative group">
                          <button
                            onClick={() => {
                              const isPremium = localStorage.getItem('is_premium') === 'true';
                              if (isPremium) {
                                handleTranslate(msg.id, msg.content, msg.language);
                              } else {
                                document.getElementById('premium-bubble-' + msg.id)?.classList.toggle('hidden');
                              }
                            }}
                            disabled={msg.translating}
                            className="flex items-center gap-1 text-[10px] tracking-wide transition-opacity hover:opacity-80"
                            style={{ color: 'rgba(184,148,74,0.7)' }}
                          >
                            {msg.translating ? '…' : (
                              <>
                                <span>{locale === 'fr' ? 'Voir en français' : 'See in English'}</span>
                                {localStorage.getItem('is_premium') !== 'true' && (
                                  <span style={{ fontSize: '9px' }}>🔒</span>
                                )}
                              </>
                            )}
                          </button>
                          <div id={'premium-bubble-' + msg.id}
                            className="hidden absolute bottom-6 left-0 z-10 rounded-2xl p-3 shadow-lg"
                            style={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(184,148,74,0.2)', minWidth: '200px', backdropFilter: 'blur(12px)' }}>
                            <p className="text-[11px] mb-2" style={{ color: 'rgba(40,30,15,0.75)' }}>
                              {locale === 'fr'
                                ? 'La traduction est disponible avec l'accès complet.'
                                : 'Translation is available with full access.'}
                            </p>
                            <a href={'/' + locale + '/premium'}
                              className="text-[10px] uppercase tracking-[0.12em]"
                              style={{ color: 'var(--gold)', fontWeight: 400 }}>
                              {locale === 'fr' ? 'Découvrir →' : 'Learn more →'}
                            </a>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              <div className="glass-strong rounded-2xl px-4 py-3 flex items-end gap-3">
                <textarea value={newMsg} onChange={e => setNewMsg(e.target.value)}
                  placeholder={t('chat_placeholder')} rows={2} maxLength={600}
                  className="flex-1 bg-transparent resize-none text-[14px] focus:outline-none leading-relaxed"
                  style={{ color: 'rgba(40,30,15,0.82)' }}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} />
                <button onClick={handleSend} disabled={!newMsg.trim() || sending}
                  className="rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.12em] transition-all duration-500 shrink-0 disabled:opacity-30"
                  style={{ background: 'linear-gradient(135deg, #D4B86A, #B8944A)', color: 'white', fontWeight: 400 }}>
                  {sending ? '…' : t('send')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
