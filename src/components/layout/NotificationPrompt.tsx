'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props { locale: string; }

const MESSAGES = {
  fr: {
    title: 'Un moment pour toi, chaque soir',
    body: 'Reçois une pensée douce à 20h30,\npour revenir à toi en fin de journée.',
    accept: 'Oui, je veux',
    dismiss: 'Non merci',
  },
  en: {
    title: 'A moment for you, every evening',
    body: 'Receive a gentle thought at 8:30 PM,\nto come back to yourself at the end of the day.',
    accept: 'Yes, please',
    dismiss: 'No thanks',
  },
};

export function NotificationPrompt({ locale }: Props) {
  const [show, setShow] = useState(false);
  const m = MESSAGES[locale as keyof typeof MESSAGES] ?? MESSAGES.fr;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'default') return;
    if (localStorage.getItem('notif_asked')) return;

    // Show after 30 seconds on first visit
    const id = setTimeout(() => setShow(true), 30000);
    return () => clearTimeout(id);
  }, []);

  const handleAccept = async () => {
    localStorage.setItem('notif_asked', '1');
    setShow(false);
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      scheduleDaily();
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('notif_asked', '1');
    setShow(false);
  };

  const scheduleDaily = () => {
    // Schedule daily notification at 20:30
    const now = new Date();
    const target = new Date();
    target.setHours(20, 30, 0, 0);
    if (target <= now) target.setDate(target.getDate() + 1);
    const delay = target.getTime() - now.getTime();

    const NOTIFS = locale === 'fr' ? [
      'Tu peux poser ce que tu as porté aujourd\'hui.',
      'La journée touche à sa fin.\nQuelque chose de doux t\'attend ici.',
      'Avant de fermer les yeux ce soir,\nun instant rien qu\'à toi.',
      'Ce soir, laisse le silence prendre sa place.',
      'Tu as traversé cette journée.\nC\'est déjà quelque chose.',
      'L\'espace est là. Calme. Sans attente.',
      'Reviens à toi, doucement.',
    ] : [
      'You can set down what today asked of you.\nThe space is here.',
      'The day is drawing to a close.\nSomething quiet is waiting for you.',
      'Before you close your eyes tonight,\na moment just for you.',
      'This evening, let the silence settle in.',
      'You moved through this day.\nThat is already something.',
      'The space is here. Calm. Without expectation.',
      'Come back to yourself, gently.',
    ];

    setTimeout(() => {
      const day = new Date().getDay();
      new Notification('L. Aether', {
        body: NOTIFS[day % NOTIFS.length],
        icon: '/icons/icon-192.png',
        silent: false,
      });
      // Repeat every 24h
      setInterval(() => {
        const d = new Date().getDay();
        new Notification('L. Aether', {
          body: NOTIFS[d % NOTIFS.length],
          icon: '/icons/icon-192.png',
        });
      }, 24 * 60 * 60 * 1000);
    }, delay);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.8 }}
          className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-[300px] z-50"
        >
          <div className="glass-strong rounded-3xl p-6" style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.1)' }}>
            {/* Feather icon */}
            <div className="w-8 h-10 mx-auto mb-4">
              <svg viewBox="0 0 40 54" fill="none" className="w-full h-full" style={{ filter: 'drop-shadow(0 0 6px rgba(184,148,74,0.5))' }}>
                <path d="M20 3C28 13 33 23 20 51C7 23 12 13 20 3Z" stroke="#B8944A" strokeWidth="0.8" fill="rgba(184,148,74,0.08)"/>
                <line x1="20" y1="3" x2="20" y2="51" stroke="#B8944A" strokeWidth="0.6" opacity="0.5"/>
              </svg>
            </div>

            <p className="font-display italic text-[16px] text-ink-800 text-center mb-2" style={{ fontWeight: 400 }}>
              {m.title}
            </p>
            <p className="text-[12px] text-center mb-5 whitespace-pre-line" style={{ color: 'rgba(42,40,32,0.6)' }}>
              {m.body}
            </p>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleAccept}
                className="w-full rounded-full py-3 text-[11px] uppercase tracking-[0.14em] transition-all duration-500 hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, #D4B86A, #B8944A)',
                  color: 'white',
                  fontWeight: 400,
                }}
              >
                {m.accept}
              </button>
              <button
                onClick={handleDismiss}
                className="text-[11px] text-center py-2 transition-colors duration-500"
                style={{ color: 'rgba(42,40,32,0.4)' }}
              >
                {m.dismiss}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
